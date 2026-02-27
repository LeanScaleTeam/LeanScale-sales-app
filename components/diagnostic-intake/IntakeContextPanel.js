/**
 * IntakeContextPanel — Shows pains/opportunities from the Slack form
 * as persistent context at the top of Sections B, C, D.
 */

import { useState } from 'react';

export default function IntakeContextPanel({ contextNotes }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!contextNotes) return null;
  const { pains, opportunities, toolNotes } = contextNotes;
  if (!pains && !opportunities && !toolNotes) return null;

  return (
    <div style={styles.panel}>
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={styles.header}
        aria-expanded={!collapsed}
      >
        <span style={styles.icon}>&#x1F4CB;</span>
        <span style={styles.title}>Notes from intake call</span>
        <span style={styles.chevron}>{collapsed ? '\u25B6' : '\u25BC'}</span>
      </button>

      {!collapsed && (
        <div style={styles.body}>
          {pains && (
            <div style={styles.noteSection}>
              <div style={styles.noteLabel}>Biggest pains</div>
              <div style={styles.noteText}>{pains}</div>
            </div>
          )}
          {opportunities && (
            <div style={styles.noteSection}>
              <div style={styles.noteLabel}>Biggest opportunities</div>
              <div style={styles.noteText}>{opportunities}</div>
            </div>
          )}
          {toolNotes && (
            <div style={styles.noteSection}>
              <div style={styles.noteLabel}>Tool notes</div>
              <div style={styles.noteText}>{toolNotes}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  panel: {
    marginBottom: '1.5rem',
    border: '1px solid #BFDBFE',
    borderRadius: 'var(--radius-md, 8px)',
    background: '#EFF6FF',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.625rem 1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-medium)',
    color: '#1E40AF',
    textAlign: 'left',
  },
  icon: {
    fontSize: '14px',
  },
  title: {
    flex: 1,
  },
  chevron: {
    fontSize: '10px',
    opacity: 0.6,
  },
  body: {
    padding: '0 1rem 0.75rem',
  },
  noteSection: {
    marginBottom: '0.5rem',
  },
  noteLabel: {
    fontSize: '11px',
    fontWeight: 'var(--font-semibold)',
    color: '#1E40AF',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
    marginBottom: '0.125rem',
  },
  noteText: {
    fontSize: 'var(--text-sm)',
    color: '#1E3A5F',
    lineHeight: 1.5,
  },
};
