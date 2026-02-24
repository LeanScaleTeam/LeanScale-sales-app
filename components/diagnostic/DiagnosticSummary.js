/**
 * DiagnosticSummary — Executive summary card: overall score + 3 layer scores
 */

import { motion } from 'framer-motion';
import HealthScoreRing from './HealthScoreRing';

const STATUS_LABELS = {
  healthy: 'Healthy',
  careful: 'Needs Attention',
  warning: 'Critical',
};

const STATUS_COLORS = {
  healthy: 'var(--status-healthy)',
  careful: 'var(--status-careful)',
  warning: 'var(--status-warning)',
};

export default function DiagnosticSummary({ scores, itemCount, companyProfile }) {
  if (!scores) return null;

  const layers = [
    { key: 'foundation', label: 'Foundation', weight: '40%', score: scores.foundation },
    { key: 'motions', label: 'Motions', weight: '35%', score: scores.motions },
    { key: 'maturity', label: 'Maturity', weight: '25%', score: scores.maturity },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={styles.container}
    >
      {/* Overall score */}
      <div style={styles.overallSection}>
        <HealthScoreRing
          score={scores.overall}
          maxScore={3}
          size={120}
          rating={scores.overallStatus === 'healthy' ? 'healthy' : scores.overallStatus === 'careful' ? 'moderate' : 'critical'}
        />
        <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: STATUS_COLORS[scores.overallStatus] }}>
            {STATUS_LABELS[scores.overallStatus]}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            {itemCount} items assessed
          </div>
        </div>
      </div>

      {/* Layer scores */}
      <div style={styles.layerGrid}>
        {layers.map((layer) => {
          const status = layer.score >= 2.5 ? 'healthy' : layer.score >= 1.5 ? 'careful' : 'warning';
          return (
            <div key={layer.key} style={styles.layerCard}>
              <div style={styles.layerLabel}>{layer.label}</div>
              <div style={{ ...styles.layerScore, color: STATUS_COLORS[status] }}>
                {layer.score.toFixed(1)}
              </div>
              <div style={styles.layerWeight}>{layer.weight} weight</div>
            </div>
          );
        })}
      </div>

      {/* Company info */}
      {companyProfile && (
        <div style={styles.profileRow}>
          {companyProfile.crm && companyProfile.crm !== 'unknown' && (
            <span style={styles.profileBadge}>CRM: {companyProfile.crm}</span>
          )}
          {companyProfile.repCount && companyProfile.repCount !== 'unknown' && (
            <span style={styles.profileBadge}>{companyProfile.repCount} reps</span>
          )}
          {companyProfile.arrRange && companyProfile.arrRange !== 'unknown' && (
            <span style={styles.profileBadge}>{companyProfile.arrRange} ARR</span>
          )}
        </div>
      )}
    </motion.div>
  );
}

const styles = {
  container: {
    background: 'white',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-lg, 12px)',
    padding: '2rem',
    marginBottom: '1.5rem',
  },
  overallSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  layerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '1rem',
  },
  layerCard: {
    textAlign: 'center',
    padding: '1rem',
    background: 'var(--bg-subtle)',
    borderRadius: 'var(--radius-md, 8px)',
  },
  layerLabel: {
    fontSize: 'var(--text-xs)',
    fontWeight: 'var(--font-semibold)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
    marginBottom: '0.25rem',
  },
  layerScore: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 'var(--font-bold)',
  },
  layerWeight: {
    fontSize: 'var(--text-2xs)',
    color: 'var(--text-muted)',
    marginTop: '0.125rem',
  },
  profileRow: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  profileBadge: {
    fontSize: 'var(--text-xs)',
    padding: '0.2rem 0.6rem',
    background: 'var(--gray-100)',
    borderRadius: '9999px',
    color: 'var(--text-secondary)',
  },
};
