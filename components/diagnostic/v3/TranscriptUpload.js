/**
 * TranscriptUpload — Drag-and-drop upload area for discovery call transcripts
 *
 * Handles text paste and file upload (.txt, .md), shows processing status
 * and results preview after analysis.
 */

import { useState, useRef } from 'react';

export default function TranscriptUpload({ customerId, onUploadComplete, onIntakeExtracted }) {
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  async function handleUpload() {
    if (!text.trim() || !customerId) return;

    setUploading(true);
    setError(null);

    try {
      // Upload transcript
      const uploadRes = await fetch('/api/diagnostic/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, text: text.trim() }),
      });

      const uploadJson = await uploadRes.json();
      if (!uploadJson.success) {
        throw new Error(uploadJson.error || 'Upload failed');
      }

      const transcriptId = uploadJson.data.id;

      // Run competency analysis + intake extraction in parallel
      setUploading(false);
      setAnalyzing(true);

      const [analyzeRes, intakeRes] = await Promise.all([
        fetch('/api/diagnostic/transcript?action=analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcriptId, customerId }),
        }),
        fetch('/api/diagnostic/transcript?action=extract-intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcriptId, customerId }),
        }),
      ]);

      const analyzeJson = await analyzeRes.json();
      if (!analyzeJson.success) {
        throw new Error(analyzeJson.error || 'Analysis failed');
      }

      // Intake extraction is best-effort — don't fail the whole flow
      let intakeData = null;
      try {
        const intakeJson = await intakeRes.json();
        if (intakeJson.success) {
          intakeData = intakeJson.data;
        }
      } catch {
        // Intake extraction failed silently — competency analysis still succeeds
      }

      const combinedResult = {
        ...analyzeJson.data,
        intakeExtracted: intakeData?.extractedCount || 0,
      };

      setResult(combinedResult);
      onUploadComplete?.(analyzeJson.data);

      if (intakeData?.preFill && Object.keys(intakeData.preFill).length > 0) {
        onIntakeExtracted?.(intakeData.preFill);
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

  function readFile(file) {
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md') && !file.type.startsWith('text/')) {
      setError('Please upload a .txt or .md file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setText(e.target.result);
      setError(null);
    };
    reader.readAsText(file);
  }

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Upload Discovery Call Transcript</h4>

      {!result && (
        <>
          {/* Drop zone */}
          <div
            style={{
              ...styles.dropZone,
              borderColor: dragOver ? 'var(--ls-purple, #6C5CE7)' : '#CBD5E0',
              background: dragOver ? '#F3F0FF' : '#FAFAFA',
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div style={styles.dropText}>
              Drop a .txt or .md file here or click to browse
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,text/plain,text/markdown"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>

          <div style={styles.divider}>or paste transcript text</div>

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
              disabled={!text.trim() || uploading || analyzing}
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
      {(uploading || analyzing) && (
        <div style={styles.status}>
          <div style={styles.spinner} />
          <span>{uploading ? 'Uploading transcript...' : 'Analyzing with Claude AI...'}</span>
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
    background: 'white',
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
    color: '#718096',
  },
  divider: {
    textAlign: 'center',
    fontSize: '0.75rem',
    color: '#A0AEC0',
    margin: '0.75rem 0',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid var(--border-color, #E2E8F0)',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
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
    background: 'var(--ls-purple, #6C5CE7)',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  charCount: {
    fontSize: '0.75rem',
    color: '#A0AEC0',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    background: '#F7FAFC',
    borderRadius: 'var(--radius-md, 8px)',
    marginTop: '0.75rem',
    fontSize: '0.85rem',
    color: '#4A5568',
  },
  spinner: {
    width: '1rem',
    height: '1rem',
    border: '2px solid #E2E8F0',
    borderTop: '2px solid var(--ls-purple, #6C5CE7)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  error: {
    padding: '0.75rem 1rem',
    background: '#FFF5F5',
    border: '1px solid #FEB2B2',
    borderRadius: 'var(--radius-md, 8px)',
    color: '#C53030',
    fontSize: '0.85rem',
    marginTop: '0.75rem',
  },
  results: {
    padding: '1rem',
    background: '#F0FFF4',
    border: '1px solid #C6F6D5',
    borderRadius: 'var(--radius-md, 8px)',
  },
  resultHeader: {
    fontWeight: 600,
    color: '#22543D',
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
    color: '#2D3748',
  },
  statLabel: {
    fontSize: '0.7rem',
    color: '#718096',
  },
  resetBtn: {
    background: 'none',
    border: '1px solid #C6F6D5',
    borderRadius: 'var(--radius-sm, 4px)',
    padding: '0.35rem 0.75rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#22543D',
  },
};
