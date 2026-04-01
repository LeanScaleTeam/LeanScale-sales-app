/**
 * TranscriptUpload — Drag-and-drop upload area for discovery call transcripts
 *
 * Handles text paste and file upload (.docx, .pdf, .txt, .md), shows processing
 * status and results preview after analysis.
 */

import { useState, useRef } from 'react';
import { parseDocument } from '../../../lib/client/parse-document';

export default function TranscriptUpload({ customerId, onUploadComplete, onIntakeExtracted, onProjectSignalsExtracted }) {
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [lastFileType, setLastFileType] = useState(null);
  const fileInputRef = useRef(null);

  // Safely parse JSON from a fetch response, throwing a clear error if HTML/non-JSON
  async function safeJson(res, label) {
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      const body = contentType.includes('json')
        ? await res.json().catch(() => ({}))
        : await res.text().catch(() => '');
      throw new Error(
        (typeof body === 'object' ? body.error : null) ||
        `${label} failed (${res.status})`
      );
    }
    if (!contentType.includes('json')) {
      throw new Error(`${label} returned unexpected response (${res.status})`);
    }
    return res.json();
  }

  /**
   * Call OpenRouter directly from the browser using a prepared prompt config.
   * This avoids Netlify function timeouts (~26s) since the browser has no timeout.
   * Retries up to 3 times with exponential backoff on 429 rate limit errors.
   */
  async function callOpenRouterDirect(apiKey, config, retries = 3) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://leanscale.team',
          'X-Title': 'LeanScale Diagnostic',
        },
        body: JSON.stringify({
          model: config.model,
          max_tokens: config.maxTokens || 4096,
          messages: [
            { role: 'system', content: config.systemPrompt },
            { role: 'user', content: config.userMessage },
          ],
          tools: config.tools,
          tool_choice: config.toolChoice,
        }),
      });

      if (response.ok) {
        return response.json();
      }

      // Retry on 429 (rate limit) or 529 (overloaded) with exponential backoff
      if ((response.status === 429 || response.status === 529) && attempt < retries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      const errorText = await response.text().catch(() => '');
      throw new Error(`AI analysis error (${response.status}): ${errorText.slice(0, 200)}`);
    }
  }

  async function handleUpload() {
    if (!text.trim() || !customerId) return;

    setUploading(true);
    setError(null);

    try {
      // Step 1: Upload transcript text to server (fast)
      const uploadRes = await fetch('/api/diagnostic/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, text: text.trim(), source: lastFileType || 'paste' }),
      });

      const uploadJson = await safeJson(uploadRes, 'Upload');
      if (!uploadJson.success) {
        throw new Error(uploadJson.error || 'Upload failed');
      }

      const transcriptId = uploadJson.data.id;

      // Step 2: Get prompt configs + API key from server (fast — no LLM calls)
      setUploading(false);
      setAnalyzing(true);

      const [prepAnalyzeRes, prepIntakeRes, prepSignalsRes] = await Promise.all([
        fetch('/api/diagnostic/transcript?action=prepare-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcriptId, customerId }),
        }),
        fetch('/api/diagnostic/transcript?action=prepare-intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcriptId, customerId }),
        }),
        fetch('/api/diagnostic/transcript?action=prepare-project-signals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcriptId, customerId }),
        }),
      ]);

      const prepAnalyze = await safeJson(prepAnalyzeRes, 'Prepare analysis');
      const prepIntake = await safeJson(prepIntakeRes, 'Prepare intake');
      const prepSignals = await safeJson(prepSignalsRes, 'Prepare project signals');

      if (!prepAnalyze.success || !prepIntake.success) {
        throw new Error('Failed to prepare analysis');
      }

      // Step 3: Call OpenRouter directly from browser (no timeout!)
      // All three extractions run in parallel
      const [analyzeOpenRouter, intakeOpenRouter, signalsOpenRouter] = await Promise.allSettled([
        callOpenRouterDirect(prepAnalyze.data.apiKey, prepAnalyze.data.config),
        callOpenRouterDirect(prepIntake.data.apiKey, prepIntake.data.config),
        prepSignals.success
          ? callOpenRouterDirect(prepSignals.data.apiKey, prepSignals.data.config)
          : Promise.reject(new Error('Skipped')),
      ]);

      if (analyzeOpenRouter.status === 'rejected') {
        throw new Error(analyzeOpenRouter.reason?.message || 'Competency analysis failed');
      }

      // Step 4: Send raw LLM responses to server for validation + storage (fast)
      const storePromises = [
        fetch('/api/diagnostic/transcript?action=store-analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcriptId,
            customerId,
            openRouterResponse: analyzeOpenRouter.value,
          }),
        }),
      ];

      // Intake extraction is best-effort
      if (intakeOpenRouter.status === 'fulfilled') {
        storePromises.push(
          fetch('/api/diagnostic/transcript?action=store-intake', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transcriptId,
              customerId,
              openRouterResponse: intakeOpenRouter.value,
            }),
          })
        );
      }

      // Project signals extraction is best-effort
      if (signalsOpenRouter.status === 'fulfilled') {
        storePromises.push(
          fetch('/api/diagnostic/transcript?action=store-project-signals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transcriptId,
              customerId,
              openRouterResponse: signalsOpenRouter.value,
            }),
          })
        );
      }

      const storeResults = await Promise.all(storePromises);
      const analyzeJson = await safeJson(storeResults[0], 'Store analysis');

      if (!analyzeJson.success) {
        throw new Error(analyzeJson.error || 'Failed to store analysis');
      }

      // Intake and project signals stores are best-effort
      let intakeData = null;
      let signalsData = null;

      // Parse remaining store results (indices depend on which extractions succeeded)
      let storeIdx = 1;
      if (intakeOpenRouter.status === 'fulfilled' && storeResults[storeIdx]) {
        try {
          const intakeJson = await safeJson(storeResults[storeIdx], 'Store intake');
          if (intakeJson.success) intakeData = intakeJson.data;
        } catch {
          // Intake storage failed silently
        }
        storeIdx++;
      }
      if (signalsOpenRouter.status === 'fulfilled' && storeResults[storeIdx]) {
        try {
          const signalsJson = await safeJson(storeResults[storeIdx], 'Store project signals');
          if (signalsJson.success) signalsData = signalsJson.data;
        } catch {
          // Project signals storage failed silently
        }
      }

      const combinedResult = {
        ...analyzeJson.data,
        intakeExtracted: intakeData?.extractedCount || 0,
        projectSignals: signalsData?.signalCount || 0,
      };

      setResult(combinedResult);
      onUploadComplete?.(analyzeJson.data);

      if (intakeData?.preFill && Object.keys(intakeData.preFill).length > 0) {
        onIntakeExtracted?.(intakeData.preFill);
      }

      if (signalsData?.signals && signalsData.signals.length > 0) {
        onProjectSignalsExtracted?.(signalsData.signals);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  }

  function handleFileDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) readFile(file);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) readFile(file);
  }

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
      setLastFileType(ext.replace('.', ''));
    } catch (err) {
      setError(err.message || 'Failed to parse document');
    } finally {
      setParsing(false);
    }
  }

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Upload Document or Transcript</h4>

      {!result && (
        <>
          {/* Drop zone */}
          <div
            style={{
              ...styles.dropZone,
              borderColor: dragOver ? '#a78bfa' : 'rgba(255, 255, 255, 0.15)',
              background: dragOver ? 'rgba(167, 139, 250, 0.1)' : 'rgba(255, 255, 255, 0.03)',
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={styles.dropText}>
              Drop a .docx, .pdf, .txt, or .md file here, or click to browse
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".docx,.pdf,.txt,.md,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,text/plain,text/markdown"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>

          <div style={styles.divider}>or paste text directly</div>

          {/* Text area */}
          <textarea
            style={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the full transcript text here..."
            rows={8}
          />

          {/* Upload button */}
          <div style={styles.actions}>
            <button
              style={styles.uploadBtn}
              onClick={handleUpload}
              disabled={!text.trim() || parsing || uploading || analyzing}
            >
              {uploading ? 'Uploading...' : analyzing ? 'Analyzing...' : 'Upload & Analyze'}
            </button>
            {text.length > 0 && (
              <span style={styles.charCount}>
                {text.length.toLocaleString()} characters
              </span>
            )}
          </div>
        </>
      )}

      {/* Processing status */}
      {(parsing || uploading || analyzing) && (
        <div style={styles.status}>
          <div style={styles.spinner} />
          <span>{parsing ? 'Extracting text from document...' : uploading ? 'Uploading transcript...' : 'Analyzing with Claude AI...'}</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={styles.error}>{error}</div>
      )}

      {/* Results preview */}
      {result && (
        <div style={styles.results}>
          <div style={styles.resultHeader}>Analysis Complete</div>
          <div style={styles.resultStats}>
            <div style={styles.stat}>
              <span style={styles.statValue}>{result.assessmentCount}</span>
              <span style={styles.statLabel}>Competencies Scored</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statValue}>
                {result.assessmentCount > 0
                  ? Math.round(
                      (result.assessments.reduce((s, a) => s + a.confidence, 0) /
                        result.assessmentCount) *
                        100
                    )
                  : 0}%
              </span>
              <span style={styles.statLabel}>Avg Confidence</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statValue}>{result.lowConfidenceCount}</span>
              <span style={styles.statLabel}>Need Review</span>
            </div>
            {result.intakeExtracted > 0 && (
              <div style={styles.stat}>
                <span style={styles.statValue}>{result.intakeExtracted}</span>
                <span style={styles.statLabel}>Intake Questions Filled</span>
              </div>
            )}
            {result.projectSignals > 0 && (
              <div style={styles.stat}>
                <span style={styles.statValue}>{result.projectSignals}</span>
                <span style={styles.statLabel}>Project Signals</span>
              </div>
            )}
          </div>
          <button
            style={styles.resetBtn}
            onClick={() => { setResult(null); setText(''); }}
          >
            Upload Another
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '1.25rem',
    border: '1px solid var(--border-color, #E2E8F0)',
    borderRadius: 'var(--radius-lg, 12px)',
    background: 'rgba(255, 255, 255, 0.03)',
  },
  title: {
    margin: '0 0 1rem',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  dropZone: {
    border: '2px dashed',
    borderRadius: 'var(--radius-md, 8px)',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  dropText: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  divider: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: '0.75rem 0',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
    background: 'rgba(255, 255, 255, 0.04)',
    color: '#fff',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '0.75rem',
  },
  uploadBtn: {
    padding: '0.5rem 1.25rem',
    borderRadius: 'var(--radius-md, 8px)',
    border: 'none',
    background: 'var(--ls-purple, #7c3aed)',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  charCount: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 'var(--radius-md, 8px)',
    marginTop: '0.75rem',
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  spinner: {
    width: '1rem',
    height: '1rem',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderTop: '2px solid #a78bfa',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  error: {
    padding: '0.75rem 1rem',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 'var(--radius-md, 8px)',
    color: '#fca5a5',
    fontSize: '0.85rem',
    marginTop: '0.75rem',
  },
  results: {
    padding: '1rem',
    background: 'rgba(34, 197, 94, 0.08)',
    border: '1px solid rgba(34, 197, 94, 0.25)',
    borderRadius: 'var(--radius-md, 8px)',
  },
  resultHeader: {
    fontWeight: 600,
    color: '#86efac',
    marginBottom: '0.75rem',
  },
  resultStats: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '0.75rem',
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  statLabel: {
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  resetBtn: {
    background: 'none',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: 'var(--radius-sm, 4px)',
    padding: '0.35rem 0.75rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#86efac',
  },
};
