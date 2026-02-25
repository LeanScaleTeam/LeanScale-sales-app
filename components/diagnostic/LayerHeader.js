/**
 * LayerHeader — Layer name + composite score badge for a diagnostic layer.
 */

import { motion } from 'framer-motion';

const STATUS_COLORS = {
  healthy: 'var(--status-healthy)',
  careful: 'var(--status-careful)',
  warning: 'var(--status-warning)',
};

const STATUS_BG = {
  healthy: 'var(--status-healthy-bg, #f0fdf4)',
  careful: 'var(--status-careful-bg, #fefce8)',
  warning: 'var(--status-warning-bg, #fef2f2)',
};

const LAYER_LABELS = {
  foundation: 'Foundation',
  motions: 'Motions',
  maturity: 'Maturity',
  platformHealth: 'Platform Health',
};

const LAYER_DESCRIPTIONS = {
  foundation: 'CRM infrastructure, data model, and automation backbone',
  motions: 'Go-to-market motions, lead flow, and execution processes',
  maturity: 'Reporting maturity, forecasting, and revenue metrics',
  platformHealth: 'Salesforce platform configuration, code health, and security',
};

export default function LayerHeader({ layer, score, itemCount, isExpanded, onToggle }) {
  const status = score >= 2.5 ? 'healthy' : score >= 1.5 ? 'careful' : 'warning';

  return (
    <motion.button
      onClick={onToggle}
      style={{
        ...styles.container,
        borderColor: isExpanded ? STATUS_COLORS[status] : 'var(--border-color)',
      }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
    >
      <div style={styles.left}>
        <div style={styles.labelRow}>
          <span style={styles.layerName}>{LAYER_LABELS[layer] || layer}</span>
          <span style={{ ...styles.scoreBadge, background: STATUS_BG[status], color: STATUS_COLORS[status] }}>
            {score.toFixed(1)} / 3.0
          </span>
        </div>
        <div style={styles.description}>{LAYER_DESCRIPTIONS[layer]}</div>
        <div style={styles.itemCount}>{itemCount} items</div>
      </div>
      <div style={styles.right}>
        <span style={{ ...styles.chevron, transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          &#9660;
        </span>
      </div>
    </motion.button>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '1rem 1.25rem',
    background: 'white',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md, 8px)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.2s',
  },
  left: { flex: 1 },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.25rem',
  },
  layerName: {
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-semibold)',
    color: 'var(--text-primary)',
  },
  scoreBadge: {
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--font-semibold)',
    padding: '0.15rem 0.5rem',
    borderRadius: '9999px',
  },
  description: {
    fontSize: 'var(--text-xs)',
    color: 'var(--text-secondary)',
    marginBottom: '0.125rem',
  },
  itemCount: {
    fontSize: 'var(--text-2xs)',
    color: 'var(--text-muted)',
  },
  right: {
    flexShrink: 0,
    marginLeft: '1rem',
  },
  chevron: {
    display: 'inline-block',
    fontSize: 'var(--text-xs)',
    color: 'var(--text-muted)',
    transition: 'transform 0.2s',
  },
};
