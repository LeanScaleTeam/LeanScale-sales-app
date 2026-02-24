/**
 * ItemDetailPanel — Expanded view for a single diagnostic v2 item.
 * Shows status, source type, signals, and recommendations.
 */

import { motion, AnimatePresence } from 'framer-motion';
import SignalList from './SignalList';
import RecommendationList from './RecommendationList';

const STATUS_COLORS = {
  healthy: 'var(--status-healthy)',
  careful: 'var(--status-careful)',
  warning: 'var(--status-warning)',
};

const STATUS_LABELS = {
  healthy: 'Healthy',
  careful: 'Needs Attention',
  warning: 'Critical',
};

const SOURCE_LABELS = {
  API_ONLY: 'CRM Auto-Graded',
  API_PLUS: 'CRM + Intake',
  INTAKE_ONLY: 'Intake Graded',
};

const STATUS_CYCLE = ['healthy', 'careful', 'warning'];

export default function ItemDetailPanel({ item, isExpanded, onToggle, editMode, onStatusChange }) {
  const statusColor = STATUS_COLORS[item.status] || 'var(--text-muted)';

  return (
    <div style={styles.wrapper}>
      {/* Collapsed header */}
      <button onClick={onToggle} style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={{ ...styles.statusDot, background: statusColor }} />
          <span style={styles.itemId}>{item.id}</span>
          <span style={styles.itemName}>{item.name}</span>
        </div>
        <div style={styles.headerRight}>
          <span style={{ ...styles.statusLabel, color: statusColor }}>
            {STATUS_LABELS[item.status] || item.status}
          </span>
          {editMode && onStatusChange && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const idx = STATUS_CYCLE.indexOf(item.status);
                const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
                onStatusChange(item.id, next);
              }}
              style={styles.editBtn}
              title="Cycle status"
            >
              &#8635;
            </button>
          )}
          <span style={styles.sourceBadge}>{SOURCE_LABELS[item.source] || item.source}</span>
          <span style={{ ...styles.chevron, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            &#9660;
          </span>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={styles.detail}>
              {item.description && (
                <p style={styles.description}>{item.description}</p>
              )}
              <SignalList signals={item.signals} />
              <RecommendationList
                recommendations={item.recommendations}
                serviceIds={item.serviceIds}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  wrapper: {
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md, 8px)',
    overflow: 'hidden',
    marginBottom: '0.5rem',
    background: 'white',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1,
  },
  statusDot: {
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    flexShrink: 0,
  },
  itemId: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    fontWeight: 'var(--font-semibold)',
    minWidth: '1.5rem',
  },
  itemName: {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-medium)',
    color: 'var(--text-primary)',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexShrink: 0,
  },
  statusLabel: {
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--font-semibold)',
  },
  editBtn: {
    background: 'none',
    border: '1px dashed var(--border-color)',
    borderRadius: 'var(--radius-sm, 4px)',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    padding: '0 4px',
    lineHeight: 1,
  },
  sourceBadge: {
    fontSize: 'var(--text-2xs)',
    padding: '0.1rem 0.4rem',
    background: 'var(--gray-100)',
    borderRadius: '9999px',
    color: 'var(--text-muted)',
  },
  chevron: {
    fontSize: 'var(--text-2xs)',
    color: 'var(--text-muted)',
    transition: 'transform 0.2s',
    display: 'inline-block',
  },
  detail: {
    padding: '0 1rem 1rem',
    borderTop: '1px solid var(--border-color)',
  },
  description: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-secondary)',
    marginTop: '0.75rem',
    marginBottom: '0.5rem',
    lineHeight: 1.5,
  },
};
