/**
 * V3Summary — Overall score with 6-pillar breakdown and top priorities
 *
 * Shows radar chart of pillar scores, company profile, and top 3 roadmap priorities.
 */

import {
  PILLAR_ORDER,
  PILLAR_LABELS,
  V3_STATUS,
  V3_STATUS_COLORS,
  DEPT_LABELS,
} from '../../../lib/diagnostic-engine/v3/constants-v3';

export default function V3Summary({
  overallScore,
  overallLabel,
  pillarScores,
  departmentScores,
  companyProfile,
  roadmapSummary,
  dataCoverage,
}) {
  return (
    <div style={styles.container}>
      {/* Overall score */}
      <div style={styles.scoreSection}>
        <div style={styles.overallRing}>
          <div
            style={{
              ...styles.ringInner,
              borderColor: overallScore ? V3_STATUS_COLORS[Math.round(overallScore)] : '#CBD5E0',
            }}
          >
            <span style={styles.overallValue}>
              {overallScore !== null ? overallScore.toFixed(1) : '--'}
            </span>
            <span style={styles.overallLabel}>{overallLabel || 'No Data'}</span>
          </div>
        </div>
        <div style={styles.overallMeta}>
          <span style={styles.scaleLabel}>out of 5.0</span>
          {dataCoverage && (
            <span style={styles.coverageLabel}>
              {dataCoverage.coveragePercent}% data coverage
            </span>
          )}
        </div>
      </div>

      {/* Pillar breakdown */}
      <div style={styles.pillarGrid}>
        {PILLAR_ORDER.map((pillar) => {
          const score = pillarScores?.[pillar]?._avg;
          const color = score !== null && score !== undefined
            ? V3_STATUS_COLORS[Math.round(score)]
            : '#CBD5E0';

          return (
            <div key={pillar} style={styles.pillarCard}>
              <div style={styles.pillarCardHeader}>
                <span style={styles.pillarCardName}>{PILLAR_LABELS[pillar]}</span>
                <span style={{ ...styles.pillarCardScore, color }}>
                  {score !== null && score !== undefined ? score.toFixed(1) : '--'}
                </span>
              </div>
              <div style={styles.pillarBar}>
                <div
                  style={{
                    ...styles.pillarBarFill,
                    width: score ? `${(score / 5) * 100}%` : '0%',
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Company profile badges */}
      {companyProfile && (
        <div style={styles.profileSection}>
          {companyProfile.crm && companyProfile.crm !== 'unknown' && (
            <span style={styles.badge}>CRM: {companyProfile.crm}</span>
          )}
          {companyProfile.repCount && companyProfile.repCount !== 'unknown' && (
            <span style={styles.badge}>Reps: {companyProfile.repCount}</span>
          )}
          {companyProfile.arrRange && companyProfile.arrRange !== 'unknown' && (
            <span style={styles.badge}>ARR: {companyProfile.arrRange}</span>
          )}
          {companyProfile.gtmMotion && companyProfile.gtmMotion !== 'unknown' && (
            <span style={styles.badge}>GTM: {companyProfile.gtmMotion}</span>
          )}
          {companyProfile.hasPartners && (
            <span style={styles.badge}>Partners</span>
          )}
        </div>
      )}

      {/* Top 3 priorities */}
      {roadmapSummary?.topPriorities?.length > 0 && (
        <div style={styles.prioritiesSection}>
          <h4 style={styles.prioritiesTitle}>Top Priorities</h4>
          {roadmapSummary.topPriorities.map((p, i) => (
            <div key={p.serviceId} style={styles.priorityRow}>
              <span style={styles.priorityNum}>{i + 1}</span>
              <span style={styles.priorityName}>{p.name}</span>
              <span style={styles.priorityPhase}>{p.phase}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '1.5rem',
    border: '1px solid var(--border-color, #E2E8F0)',
    borderRadius: 'var(--radius-lg, 12px)',
    background: 'white',
    marginBottom: '1.5rem',
  },
  scoreSection: {
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  overallRing: {
    display: 'inline-block',
    padding: '0.25rem',
    borderRadius: '50%',
  },
  ringInner: {
    width: '6rem',
    height: '6rem',
    borderRadius: '50%',
    border: '4px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  overallValue: {
    fontSize: '1.75rem',
    fontWeight: 700,
    lineHeight: 1.1,
  },
  overallLabel: {
    fontSize: '0.7rem',
    color: '#718096',
    fontWeight: 500,
  },
  overallMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.15rem',
    marginTop: '0.5rem',
  },
  scaleLabel: {
    fontSize: '0.75rem',
    color: '#A0AEC0',
  },
  coverageLabel: {
    fontSize: '0.7rem',
    color: '#A0AEC0',
  },
  pillarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0.75rem',
    marginBottom: '1.25rem',
  },
  pillarCard: {
    padding: '0.75rem',
    borderRadius: 'var(--radius-md, 8px)',
    background: 'var(--bg-secondary, #F7FAFC)',
  },
  pillarCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: '0.35rem',
  },
  pillarCardName: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#4A5568',
  },
  pillarCardScore: {
    fontSize: '1rem',
    fontWeight: 700,
  },
  pillarBar: {
    height: '4px',
    borderRadius: '2px',
    background: '#E2E8F0',
    overflow: 'hidden',
  },
  pillarBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  profileSection: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  badge: {
    fontSize: '0.7rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '1rem',
    background: '#EDF2F7',
    color: '#4A5568',
    fontWeight: 500,
  },
  prioritiesSection: {
    borderTop: '1px solid #EDF2F7',
    paddingTop: '1rem',
  },
  prioritiesTitle: {
    margin: '0 0 0.5rem',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  priorityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.4rem 0',
  },
  priorityNum: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    background: 'var(--ls-purple, #6C5CE7)',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  priorityName: {
    fontSize: '0.85rem',
    fontWeight: 500,
    flex: 1,
  },
  priorityPhase: {
    fontSize: '0.7rem',
    color: '#A0AEC0',
    textTransform: 'uppercase',
  },
};
