/**
 * PersonalizedSection — Wraps playbook content with diagnostic-aware styling
 *
 * - Highlighted sections for priority areas (low scores)
 * - Collapsed sections for areas where the user scores 4+
 * - Neutral sections when no personalization applies
 */

import { useState } from 'react';

export default function PersonalizedSection({ children, sectionId, personalization }) {
  const [expanded, setExpanded] = useState(false);

  if (!personalization?.hasPersonalization) {
    return <div>{children}</div>;
  }

  const isHighlighted = personalization.highlightSections.includes(sectionId);
  const isSkipped = personalization.skipSections.includes(sectionId);

  if (isSkipped) {
    return (
      <div style={styles.skippedContainer}>
        <button
          style={styles.skippedToggle}
          onClick={() => setExpanded(!expanded)}
        >
          <span style={styles.checkmark}>&#10003;</span>
          <span>{sectionId} — You're performing well here (score 4+)</span>
          <span style={styles.chevron}>{expanded ? '▲' : '▼'}</span>
        </button>
        {expanded && (
          <div style={styles.skippedContent}>{children}</div>
        )}
      </div>
    );
  }

  if (isHighlighted) {
    return (
      <div style={styles.highlightedContainer}>
        <div style={styles.highlightBadge}>
          Priority area based on your diagnostic
        </div>
        {children}
      </div>
    );
  }

  return <div>{children}</div>;
}

const styles = {
  skippedContainer: {
    border: '1px solid #C6F6D5',
    borderRadius: 'var(--radius-md, 8px)',
    marginBottom: '1rem',
    overflow: 'hidden',
  },
  skippedToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#F0FFF4',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#276749',
    fontWeight: 500,
    textAlign: 'left',
  },
  checkmark: {
    color: '#38A169',
    fontWeight: 700,
    fontSize: '1rem',
  },
  chevron: {
    marginLeft: 'auto',
    fontSize: '0.7rem',
    color: '#A0AEC0',
  },
  skippedContent: {
    padding: '1rem',
    background: '#F7FAFC',
    borderTop: '1px solid #C6F6D5',
    opacity: 0.8,
  },
  highlightedContainer: {
    border: '2px solid #D6BCFA',
    borderRadius: 'var(--radius-md, 8px)',
    padding: '1rem',
    marginBottom: '1rem',
    background: 'linear-gradient(to bottom, #FAF5FF 0%, white 30%)',
  },
  highlightBadge: {
    display: 'inline-block',
    padding: '0.2rem 0.6rem',
    background: '#553C9A',
    color: 'white',
    borderRadius: '1rem',
    fontSize: '0.7rem',
    fontWeight: 600,
    marginBottom: '0.75rem',
  },
};
