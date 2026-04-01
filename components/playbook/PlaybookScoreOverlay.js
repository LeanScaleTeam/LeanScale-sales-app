/**
 * PlaybookScoreOverlay — Banner showing why this playbook was recommended
 *
 * Displays the diagnostic competencies that triggered this recommendation,
 * their current scores per department, and visual severity indicators.
 */

import { V3_STATUS } from '../../lib/diagnostic-engine/v3/constants-v3';

const STATUS_COLORS = {
  1: '#f87171',
  2: '#fb923c',
  3: '#fbbf24',
  4: '#4ade80',
  5: '#34d399',
};

export default function PlaybookScoreOverlay({ playbookSlug, scores, competencyIds }) {
  if (!scores || !competencyIds?.length) return null;

  // Find competencies that triggered this playbook recommendation
  const relevantScores = competencyIds
    .map(compId => {
      const scored = scores.find(s => s.id === compId);
      if (!scored) return null;

      // Find departments with low scores (the ones that triggered the recommendation)
      const lowDepts = Object.entries(scored.departments || {})
        .filter(([, score]) => score !== null && score <= 3)
        .map(([dept, score]) => ({ dept, score }));

      if (lowDepts.length === 0) return null;

      return {
        competencyId: compId,
        competencyName: scored.name,
        pillar: scored.pillar,
        departments: lowDepts,
      };
    })
    .filter(Boolean);

  if (relevantScores.length === 0) return null;

  return (
    <div style={styles.banner}>
      <div style={styles.header}>
        <span style={styles.icon}>&#x1F3AF;</span>
        <h3 style={styles.title}>Why this playbook was recommended</h3>
      </div>
      <div style={styles.cards}>
        {relevantScores.map(rs => (
          <div key={rs.competencyId} style={styles.card}>
            <div style={styles.compName}>{rs.competencyName}</div>
            <div style={styles.pillarBadge}>{rs.pillar}</div>
            <div style={styles.deptScores}>
              {rs.departments.map(d => (
                <span
                  key={d.dept}
                  style={{
                    ...styles.deptBadge,
                    backgroundColor: STATUS_COLORS[d.score] || '#A0AEC0',
                  }}
                >
                  {d.dept}: {d.score}/5 ({V3_STATUS[d.score]})
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  banner: {
    padding: '1.25rem',
    background: 'linear-gradient(135deg, #F0EBFF 0%, #E8F4FD 100%)',
    border: '1px solid #D6BCFA',
    borderRadius: 'var(--radius-lg, 12px)',
    marginBottom: '1.5rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  icon: {
    fontSize: '1.25rem',
  },
  title: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#553C9A',
  },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  card: {
    padding: '0.75rem',
    background: 'white',
    borderRadius: 'var(--radius-md, 8px)',
    border: '1px solid #E2E8F0',
    minWidth: '200px',
    flex: '1 1 200px',
  },
  compName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#2D3748',
    marginBottom: '0.25rem',
  },
  pillarBadge: {
    display: 'inline-block',
    fontSize: '0.7rem',
    fontWeight: 500,
    color: '#718096',
    textTransform: 'uppercase',
    marginBottom: '0.5rem',
  },
  deptScores: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.25rem',
  },
  deptBadge: {
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    borderRadius: '1rem',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'white',
  },
};
