import { useState, useRef } from 'react';
import { parseDiagnosticMarkdown, generateMarkdownTemplate } from '../../lib/parse-diagnostic-markdown';
import { StatusBadge } from './StatusLegend';

/**
 * MarkdownImport — UI for importing diagnostic data from markdown
 *
 * Supports:
 * - Paste markdown into textarea
 * - Upload .md file
 * - Preview parsed results before saving
 * - Validation warnings
 *
 * @param {string} diagnosticType - 'gtm' | 'clay' | 'cpq'
 * @param {function} onImport - Called with { processes, tools } when user confirms import
 * @param {function} onCancel - Called when user cancels
 */
export default function MarkdownImport({ diagnosticType, onImport, onCancel }) {
  const [markdown, setMarkdown] = useState('');
  const [preview, setPreview] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  function handleParse() {
    if (!markdown.trim()) {
      setWarnings(['Please paste or upload markdown content first.']);
      setPreview(null);
      return;
    }

    const result = parseDiagnosticMarkdown(markdown, diagnosticType);
    setPreview(result);
    setWarnings(result.warnings);
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setMarkdown(content);
        // Auto-parse after file upload
        const result = parseDiagnosticMarkdown(content, diagnosticType);
        setPreview(result);
        setWarnings(result.warnings);
      }
    };
    reader.readAsText(file);
  }

  async function handleConfirmImport() {
    if (!preview || (preview.processes.length === 0 && preview.tools.length === 0)) return;

    setSaving(true);
    try {
      await onImport({
        processes: preview.processes,
        tools: preview.tools,
        power10Metrics: preview.power10Metrics,
      });
    } catch (err) {
      setWarnings(prev => [...prev, `Import failed: ${err.message}`]);
    } finally {
      setSaving(false);
    }
  }

  function handleShowTemplate() {
    setMarkdown(generateMarkdownTemplate(diagnosticType));
    setPreview(null);
    setWarnings([]);
  }

  const typeLabel = diagnosticType === 'gtm' ? 'GTM' : diagnosticType === 'clay' ? 'Clay' : 'Q2C';

  return (
    <div style={{
      background: 'var(--bg-white)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
          Import {typeLabel} Diagnostic from Markdown
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.25rem',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '0.25rem',
            }}
          >
            ✕
          </button>
        )}
      </div>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        Paste a markdown table or upload a .md file. Supports both the standard template format
        and Tool Diagnostic Report format (auto-detected).
      </p>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={handleShowTemplate}
          style={{
            padding: '0.4rem 0.75rem',
            fontSize: '0.8rem',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          Show Template
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '0.4rem 0.75rem',
            fontSize: '0.8rem',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
          }}
        >
          Upload .md File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.txt,.markdown"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>

      {/* Textarea */}
      <textarea
        value={markdown}
        onChange={(e) => {
          setMarkdown(e.target.value);
          setPreview(null);
          setWarnings([]);
        }}
        placeholder={`Paste your ${typeLabel} diagnostic markdown here...`}
        style={{
          width: '100%',
          minHeight: '200px',
          padding: '0.75rem',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          resize: 'vertical',
          marginBottom: '1rem',
        }}
      />

      {/* Parse button */}
      {!preview && (
        <button
          onClick={handleParse}
          disabled={!markdown.trim()}
          style={{
            padding: '0.5rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            background: markdown.trim() ? 'var(--ls-purple)' : 'var(--bg-subtle)',
            color: markdown.trim() ? 'white' : 'var(--text-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: markdown.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          Parse & Preview
        </button>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div style={{
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem',
          marginTop: '1rem',
        }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>Warnings</div>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.8rem' }}>
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Preview */}
      {preview && (preview.processes.length > 0 || preview.tools.length > 0) && (
        <div style={{ marginTop: '1rem' }}>
          {/* Report metadata banner */}
          {preview.metadata && preview.metadata.orgAlias && (
            <div style={{
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              marginBottom: '0.75rem',
              fontSize: '0.8rem',
            }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Tool Diagnostic Report Detected</div>
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', color: 'var(--text-secondary)' }}>
                {preview.metadata.orgAlias && <span><strong>Org:</strong> {preview.metadata.orgAlias}</span>}
                {preview.metadata.date && <span><strong>Date:</strong> {preview.metadata.date}</span>}
                {preview.metadata.instanceUrl && <span><strong>Instance:</strong> {preview.metadata.instanceUrl}</span>}
              </div>
            </div>
          )}

          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Preview ({preview.processes.length} processes{preview.tools.length > 0 ? `, ${preview.tools.length} tools` : ''}{preview.power10Metrics && preview.power10Metrics.length > 0 ? `, ${preview.power10Metrics.length} Power10 metrics` : ''})
          </h4>

          {/* Tools preview (shown when tools exist, e.g. from report format) */}
          {preview.tools.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                Tools ({preview.tools.length})
              </h5>
              <div style={{
                maxHeight: '200px',
                overflow: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', position: 'sticky', top: 0 }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Name</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Category</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                      {preview.tools.some(t => t.oauthTokens) && (
                        <th style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '1px solid var(--border-color)' }}>OAuth</th>
                      )}
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.tools.map((t, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? 'white' : 'var(--bg-subtle)' }}>
                        <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid var(--border-color)' }}>{t.name}</td>
                        <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{t.category || '-'}</td>
                        <td style={{ padding: '0.4rem 0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
                          <StatusBadge status={t.status} />
                        </td>
                        {preview.tools.some(tt => tt.oauthTokens) && (
                          <td style={{ padding: '0.4rem 0.5rem', textAlign: 'right', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                            {t.oauthTokens || '-'}
                          </td>
                        )}
                        <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.75rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {t.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Processes preview */}
          {preview.processes.length > 0 && (
            <div>
              <h5 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                Processes ({preview.processes.length})
              </h5>
              <div style={{
                maxHeight: '250px',
                overflow: 'auto',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-subtle)', position: 'sticky', top: 0 }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Name</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                      <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>Priority</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                        {diagnosticType === 'gtm' ? 'Function' : 'Category'}
                      </th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.processes.map((p, i) => (
                      <tr key={i} style={{ background: i % 2 === 0 ? 'white' : 'var(--bg-subtle)' }}>
                        <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid var(--border-color)' }}>{p.name}</td>
                        <td style={{ padding: '0.4rem 0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
                          <StatusBadge status={p.status} />
                        </td>
                        <td style={{ padding: '0.4rem 0.5rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
                          {p.addToEngagement ? '✓' : ''}
                        </td>
                        <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                          {p.function || '-'}
                        </td>
                        <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                          {p.outcome || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Confirm / Cancel */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button
              onClick={handleConfirmImport}
              disabled={saving}
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                background: 'var(--ls-purple)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Importing...' : `Import ${preview.processes.length} Processes & ${preview.tools.length} Tools`}
            </button>
            <button
              onClick={() => {
                setPreview(null);
                setWarnings([]);
              }}
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '0.9rem',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
              }}
            >
              Edit Markdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
