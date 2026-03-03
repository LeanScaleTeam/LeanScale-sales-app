# Document Upload Parsing Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enable the TranscriptUpload component to accept `.docx` and `.pdf` files, parse them to text client-side, and feed them through the existing transcript analysis pipeline.

**Architecture:** Add `mammoth` (DOCX→HTML→text) and `pdfjs-dist` (PDF→text) as client-side dependencies. Modify the `readFile` function in `TranscriptUpload.js` to detect file type and route through the appropriate parser before setting the text state. Everything downstream (upload, OpenRouter analysis, storage) works unchanged.

**Tech Stack:** mammoth.js (DOCX parsing, ~50KB, 0 deps), pdfjs-dist (Mozilla PDF.js, battle-tested), React/Next.js client-side.

---

## Why Client-Side

- The existing pipeline already sends raw text to the server — parsing happens before that step
- No Netlify function timeout concern (parsing is fast, <2s for typical docs)
- mammoth runs in browser natively (no Node-only deps)
- pdfjs-dist is designed for browser use
- Zero backend changes needed

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install mammoth and pdfjs-dist**

Run:
```bash
npm install mammoth pdfjs-dist
```

mammoth: DOCX→HTML→text, ~50KB, zero native deps, works in browser.
pdfjs-dist: Mozilla's PDF.js, the standard for browser PDF parsing.

**Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add mammoth and pdfjs-dist for document parsing"
```

---

### Task 2: Add Document Parsing Utility

**Files:**
- Create: `lib/client/parse-document.js`

**Step 1: Create the parsing utility**

This file exports a single function that takes a File object and returns extracted text. It handles `.docx`, `.pdf`, `.txt`, and `.md`.

```js
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
```

Key design decisions:
- Dynamic imports (`await import(...)`) so mammoth/pdfjs only load when needed — no bundle size impact for users who don't upload docs
- PDF worker loaded from CDN to avoid Next.js webpack config complexity
- Each parser validates that extracted text is non-empty
- Clear error messages for unsupported types

**Step 2: Commit**

```bash
git add lib/client/parse-document.js
git commit -m "feat: add client-side document parser for docx and pdf"
```

---

### Task 3: Update TranscriptUpload to Accept Documents

**Files:**
- Modify: `components/diagnostic/v3/TranscriptUpload.js:204-216` (readFile function)
- Modify: `components/diagnostic/v3/TranscriptUpload.js:236-245` (drop zone UI text + accept attribute)

**Step 1: Import the parser**

Add at the top of the file, after the existing React import (after line 8):

```js
import { parseDocument } from '../../../lib/client/parse-document';
```

**Step 2: Replace the `readFile` function**

Replace lines 204-216 (the current `readFile` function) with:

```js
  async function readFile(file) {
    const name = file.name.toLowerCase();
    const supported = ['.txt', '.md', '.docx', '.pdf'];
    const ext = '.' + name.split('.').pop();

    if (!supported.includes(ext) && !file.type.startsWith('text/')) {
      setError('Please upload a .docx, .pdf, .txt, or .md file');
      return;
    }

    try {
      setError(null);
      const text = await parseDocument(file);
      setText(text);
    } catch (err) {
      setError(err.message || 'Failed to parse document');
    }
  }
```

Note: The function is now `async` since `parseDocument` returns a Promise.

**Step 3: Update the drop zone text and file input accept attribute**

Change the drop zone text at line 237 from:
```
Drop a .txt or .md file here or click to browse
```
To:
```
Drop a .docx, .pdf, .txt, or .md file here, or click to browse
```

Change the file input accept attribute at line 242 from:
```
accept=".txt,.md,text/plain,text/markdown"
```
To:
```
accept=".docx,.pdf,.txt,.md,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,text/plain,text/markdown"
```

**Step 4: Update the component title**

Change the title at line 222 from:
```
Upload Discovery Call Transcript
```
To:
```
Upload Document or Transcript
```

**Step 5: Update the divider text**

Change the divider text at line 248 from:
```
or paste transcript text
```
To:
```
or paste text directly
```

**Step 6: Commit**

```bash
git add components/diagnostic/v3/TranscriptUpload.js
git commit -m "feat: accept docx and pdf in transcript upload"
```

---

### Task 4: Add Parsing Status Indicator

**Files:**
- Modify: `components/diagnostic/v3/TranscriptUpload.js`

When parsing a large DOCX/PDF, there's a brief delay. Add a parsing state so the user sees feedback.

**Step 1: Add parsing state**

Add a new state variable after the existing state declarations (around line 16):

```js
  const [parsing, setParsing] = useState(false);
```

**Step 2: Update readFile to show parsing state**

Wrap the `parseDocument` call in the `readFile` function:

```js
  async function readFile(file) {
    const name = file.name.toLowerCase();
    const supported = ['.txt', '.md', '.docx', '.pdf'];
    const ext = '.' + name.split('.').pop();

    if (!supported.includes(ext) && !file.type.startsWith('text/')) {
      setError('Please upload a .docx, .pdf, .txt, or .md file');
      return;
    }

    try {
      setError(null);
      setParsing(true);
      const text = await parseDocument(file);
      setText(text);
    } catch (err) {
      setError(err.message || 'Failed to parse document');
    } finally {
      setParsing(false);
    }
  }
```

**Step 3: Show parsing indicator in the status section**

In the processing status block (around line 278), update the condition:

Change:
```js
{(uploading || analyzing) && (
```
To:
```js
{(parsing || uploading || analyzing) && (
```

And update the status text:
```js
<span>{parsing ? 'Extracting text from document...' : uploading ? 'Uploading transcript...' : 'Analyzing with Claude AI...'}</span>
```

**Step 4: Disable the upload button while parsing**

In the button disabled condition (around line 264), add `parsing`:

Change:
```js
disabled={!text.trim() || uploading || analyzing}
```
To:
```js
disabled={!text.trim() || parsing || uploading || analyzing}
```

**Step 5: Commit**

```bash
git add components/diagnostic/v3/TranscriptUpload.js
git commit -m "feat: add parsing status indicator for document uploads"
```

---

### Task 5: Handle the Document Source Label

**Files:**
- Modify: `pages/api/diagnostic/transcript.js`

Currently the transcript is stored with `source: 'upload'`. It would be useful to distinguish document types for analytics.

**Step 1: Accept optional source type in the upload request**

In `pages/api/diagnostic/transcript.js`, find where the upload body is parsed (around the POST handler). The client currently sends `{ customerId, text }`. We'll have it also send `{ customerId, text, source }`.

In `TranscriptUpload.js`, update the upload fetch call in `handleUpload` (Step 1, around line 78-81):

Change:
```js
body: JSON.stringify({ customerId, text: text.trim() }),
```
To:
```js
body: JSON.stringify({ customerId, text: text.trim(), source: lastFileType || 'paste' }),
```

Add a state variable to track the file type:
```js
const [lastFileType, setLastFileType] = useState(null);
```

In `readFile`, after successful parse, set the type:
```js
setLastFileType(ext.replace('.', ''));
```

When text is pasted directly (not from a file), clear it — or leave it as null (the API defaults to 'upload').

In the API handler (`pages/api/diagnostic/transcript.js`), read `source` from the body and pass it to the insert. Find where `source` is set in the Supabase insert and use the request body value if provided, falling back to `'upload'`.

**Step 2: Commit**

```bash
git add components/diagnostic/v3/TranscriptUpload.js pages/api/diagnostic/transcript.js
git commit -m "feat: track document source type (docx/pdf/txt/paste)"
```

---

## Testing Plan

Since this is a client-side feature with dynamic imports, testing is best done manually:

1. **DOCX upload:** Download any .docx file, drag into the upload zone. Verify text appears in the textarea and character count updates.
2. **PDF upload:** Upload a PDF with text content. Verify extracted text appears. Try a scanned/image PDF — should show "No text content found" error (expected: image PDFs need OCR, which is out of scope).
3. **TXT/MD unchanged:** Verify .txt and .md files still work exactly as before.
4. **Full pipeline:** Upload a DOCX, click "Upload & Analyze", verify the 4-step flow completes and competencies are scored.
5. **Error handling:** Try uploading a .png or .xlsx — should show clear error message.

---

## What This Does NOT Cover (Future)

- **OCR for scanned PDFs** — Would need Tesseract.js or server-side OCR. Out of scope.
- **Server-side S3 URL processing** — For retroactively parsing Fillout-uploaded docs. Separate feature if needed.
- **Auto-triggering on Fillout submission** — Would need a Fillout webhook receiver. Separate feature.
