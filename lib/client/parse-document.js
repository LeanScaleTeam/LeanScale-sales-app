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

  // Set worker source to bundled worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(' ');
    pages.push(pageText);
  }

  const text = pages.join('\n\n').trim();

  if (!text) {
    throw new Error('No text content found in PDF file');
  }

  return text;
}

async function parseText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
}
