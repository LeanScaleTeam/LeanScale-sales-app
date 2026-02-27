/**
 * SlackFormBanner — Collapsible banner on Section A for pasting Slack form data.
 *
 * When the user pastes raw Slack form text and clicks Parse, we run the parser
 * and call onParsed with the results. The banner collapses to show a summary.
 */

import { useState } from 'react';
import { parseSlackForm } from '../../lib/slack-form-parser';

export default function SlackFormBanner({ onParsed }) {
  const [expanded, setExpanded] = useState(false);
  const [text, setText] = useState('');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  const handleParse = () => {
    if (!text.trim()) return;
    setError(null);

    try {
      const result = parseSlackForm(text);
      if (result.summary.mapped === 0) {
        setError('Could not parse any fields. Make sure you pasted the full form output.');
        return;
      }
      setSummary(result.summary);
      setExpanded(false);
      onParsed(result);
    } catch (err) {
      setError('Failed to parse form data. Please check the format and try again.');
    }
  };

  if (summary) {
    return (
      <div style={styles.summaryBanner}>
        <div style={styles.summaryRow}>
          <span style={styles.checkIcon}>&#10003;</span>
          <span style={styles.summaryText}>
            Pre-filled <strong>{summary.mapped}</strong> of {summary.total} fields from intake form
            {summary.toolsFound > 0 && ` \u00B7 ${summary.toolsFound} tools detected`}
          </span>
          <button onClick={() => { setSummary(null); setExpanded(true); }} style={styles.editLink}>
            Re-paste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.banner}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={styles.toggleBtn}
        aria-expanded={expanded}
      >
        <span style={styles.toggleIcon}>{expanded ? '\u25BC' : '\u25B6'}</span>
        <span>Have a completed intake form? Paste it here to pre-fill.</span>
      </button>

      {expanded && (
        <div style={styles.expandedArea}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the Slack form output here (e.g., CRM:Salesforce\nMarketing Automation Platform:Marketo\n...)"
            style={styles.textarea}
            rows={10}
          />
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.actions}>
            <button onClick={() => setExpanded(false)} style={styles.cancelBtn}>Cancel</button>
            <button
              onClick={handleParse}
              disabled={!text.trim()}
              style={{ ...styles.parseBtn, opacity: text.trim() ? 1 : 0.5 }}
            >
              Parse &amp; Pre-fill
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  banner: {
    marginBottom: '1.5rem',
    border: '1px solid #E0E7FF',
    borderRadius: 'var(--radius-md, 8px)',
    background: '#F5F3FF',
    overflow: 'hidden',
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    color: '#5B21B6',
    fontWeight: 'var(--font-medium)',
    textAlign: 'left',
  },
  toggleIcon: {
    fontSize: '10px',
  },
  expandedArea: {
    padding: '0 1rem 1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'inherit',
    resize: 'vertical',
    lineHeight: 1.5,
    boxSizing: 'border-box',
  },
  error: {
    marginTop: '0.5rem',
    fontSize: 'var(--text-xs)',
    color: '#991b1b',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end',
    marginTop: '0.75rem',
  },
  cancelBtn: {
    padding: '0.5rem 1rem',
    background: 'white',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
  },
  parseBtn: {
    padding: '0.5rem 1rem',
    background: 'var(--ls-purple)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-medium)',
    cursor: 'pointer',
  },
  summaryBanner: {
    marginBottom: '1.5rem',
    padding: '0.75rem 1rem',
    border: '1px solid #BBF7D0',
    borderRadius: 'var(--radius-md, 8px)',
    background: '#F0FDF4',
  },
  summaryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  checkIcon: {
    color: '#16A34A',
    fontWeight: 'bold',
  },
  summaryText: {
    flex: 1,
    fontSize: 'var(--text-sm)',
    color: '#166534',
  },
  editLink: {
    background: 'none',
    border: 'none',
    color: '#5B21B6',
    fontSize: 'var(--text-xs)',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};
