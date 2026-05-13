/**
 * Client-side document parser.
 *
 * Extracts plain text from uploaded files:
 * - .docx → mammoth (HTML → stripped text)
 * - .pdf  → pdfjs-dist (page text extraction)
 * - .txt/.md → FileReader.readAsText()
 *
 * Runs entirely in the browser. No server round-trip needed.
 */

/**
 * Parse a file to plain text.
 * @param {File} file - The uploaded file
 * @returns {Promise<string>} Extracted text content
 * @throws {Error} If file type is unsupported or parsing fails
 */
export async function parseDocument(file) {
  const name = file.name.toLowerCase();

  if (name.endsWith('.docx')) {
    return parseDocx(file);
  }

  if (name.endsWith('.pdf')) {
    return parsePdf(file);
  }

  if (name.endsWith('.txt') || name.endsWith('.md') || file.type.startsWith('text/')) {
    return parseText(file);
  }

  throw new Error(`Unsupported file type: ${name.split('.').pop()}. Upload .docx, .pdf, .txt, or .md files.`);
}

async function parseDocx(file) {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value.trim();

  if (!text) {
    throw new Error('No text content found in DOCX file');
  }

  return text;
}

async function parsePdf(file) {
  const pdfjsLib = await import('pdfjs-dist');

  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(reconstructPageText(content.items));
  }

  const text = pages.join('\n\n').trim();

  if (!text) {
    throw new Error('No text content found in PDF file');
  }

  return text;
}

/**
 * Reconstruct readable text from pdf.js text items.
 *
 * pdf.js emits each glyph cluster as a separate item with its own bounding box.
 * Each item exposes:
 *   - str         : the text content
 *   - transform[4]: x position (baseline left)
 *   - transform[5]: y position (baseline)
 *   - width       : rendered width in PDF units
 *   - height      : rendered height
 *   - hasEOL      : explicit line break flag
 *
 * Naively joining items with spaces breaks two ways:
 *   1. Adds a space between adjacent glyphs that were rendered touching, e.g.
 *      "P" + "0" → "P 0" instead of "P0".
 *   2. Adds a literal space even when the previous token already ended in
 *      whitespace, producing "GTM   Engineer".
 *
 * Strategy:
 *   - Detect line breaks via item.hasEOL OR y-position change > line height.
 *   - On the same line, compute the horizontal gap: nextX − (prevX + prevWidth).
 *     If the gap is large enough to fit a space glyph (~25% of avg char width),
 *     insert one space; otherwise concatenate directly.
 *   - Skip space insertion when the previous token already ends in whitespace
 *     or the next starts with one.
 *   - Final pass: collapse stray double-spaces and tidy newlines.
 */
function reconstructPageText(items) {
  if (!Array.isArray(items) || items.length === 0) return '';

  const parts = [];
  let prevY = null;
  let prevEndX = null;
  let prevHeight = null;
  let prevEndsWithSpace = false;

  for (const item of items) {
    const str = item.str || '';
    const x = item.transform ? item.transform[4] : null;
    const y = item.transform ? item.transform[5] : null;
    const w = typeof item.width === 'number' ? item.width : 0;
    const h = typeof item.height === 'number' ? item.height : 0;

    // Detect a new line: explicit flag, or y moved by more than half line height.
    const lineHeight = prevHeight || h || 10;
    const sameLine =
      prevY === null ||
      (y !== null && Math.abs(y - prevY) < lineHeight * 0.5);

    if (!sameLine || item.hasEOL) {
      parts.push('\n');
      parts.push(str);
      prevEndsWithSpace = /\s$/.test(str);
    } else if (str.length === 0) {
      // Empty token — treat as a possible space marker only if there's a real
      // horizontal gap; otherwise ignore. (pdf.js sometimes emits empty items.)
      if (prevEndX !== null && x !== null && x - prevEndX > (h || 4) * 0.25) {
        if (!prevEndsWithSpace) {
          parts.push(' ');
          prevEndsWithSpace = true;
        }
      }
    } else {
      const startsWithSpace = /^\s/.test(str);
      const gap = prevEndX !== null && x !== null ? x - prevEndX : null;
      // A space-sized gap is approximately 25%+ of glyph height. If the items
      // are touching (or overlapping), don't insert a space.
      const gapWarrantsSpace = gap === null || gap > (h || lineHeight) * 0.25;

      if (!prevEndsWithSpace && !startsWithSpace && gapWarrantsSpace) {
        parts.push(' ');
      }
      parts.push(str);
      prevEndsWithSpace = /\s$/.test(str);
    }

    prevY = y;
    prevEndX = x !== null ? x + w : prevEndX;
    if (h) prevHeight = h;
  }

  return parts.join('')
    .replace(/[ \t]+/g, ' ') // collapse runs of horizontal whitespace
    .replace(/\n[ \t]+/g, '\n') // strip leading spaces on each line
    .replace(/[ \t]+\n/g, '\n') // strip trailing spaces before newline
    .replace(/\n{3,}/g, '\n\n') // collapse 3+ newlines to paragraph break
    .trim();
}

async function parseText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
}
