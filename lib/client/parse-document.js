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
 * pdf.js emits each glyph cluster as a separate item with its own bounding box
 * (transform[5] = baseline y, transform[4] = x). Naively joining with spaces
 * produces output like "GTM   Engineer   Project" because each token was
 * already a word — the space is added even between glyphs that were rendered
 * adjacent.
 *
 * Strategy:
 *   - Use item.hasEOL to detect explicit line breaks
 *   - Track the previous item's baseline y to detect line wrapping
 *   - Within a line, append item.str directly when the previous item already
 *     ends with whitespace (pdf.js often includes the trailing space); otherwise
 *     insert one space between items.
 *   - Collapse runs of 2+ spaces to a single space at the end (safety net).
 */
function reconstructPageText(items) {
  if (!Array.isArray(items) || items.length === 0) return '';

  const parts = [];
  let prevY = null;
  let prevEndsWithSpace = false;

  for (const item of items) {
    const str = item.str || '';
    const y = item.transform ? item.transform[5] : null;

    // Detect a new line: either explicit hasEOL flag, or vertical position change.
    const sameLine = prevY === null || (y !== null && Math.abs(y - prevY) < 2);

    if (!sameLine || item.hasEOL) {
      parts.push('\n');
      parts.push(str);
      prevEndsWithSpace = /\s$/.test(str);
    } else {
      if (str.length === 0) {
        // Empty token (sometimes a spacing marker) — keep a single space if not already
        if (!prevEndsWithSpace) {
          parts.push(' ');
          prevEndsWithSpace = true;
        }
      } else {
        const startsWithSpace = /^\s/.test(str);
        if (!prevEndsWithSpace && !startsWithSpace) {
          parts.push(' ');
        }
        parts.push(str);
        prevEndsWithSpace = /\s$/.test(str);
      }
    }
    prevY = y;
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
