/**
 * SuggestedProjects — banner shown after score recalculation
 *
 * When consultant scores or transcripts trigger a re-run with preserveRoadmap,
 * this compares the freshly generated roadmap against the current one and
 * surfaces new project recommendations for the user to accept or dismiss.
 */

import { useState } from 'react';
import { ROADMAP_PHASES } from '../../../lib/diagnostic-engine/v3/constants-v3';

/**
 * Diff two roadmaps to find projects in `suggested` that aren't in `current`.
 */
export function findNewSuggestedProjects(currentRoadmap, suggestedRoadmap) {
  if (!currentRoadmap?.phases || !suggestedRoadmap?.phases) return [];

  const currentIds = new Set(
    currentRoadmap.phases.flatMap((p) => p.projects.map((proj) => proj.serviceId))
  );

  const suggestions = [];
  for (const phase of suggestedRoadmap.phases) {
    for (const proj of phase.projects) {
      if (!currentIds.has(proj.serviceId)) {
        suggestions.push({ ...proj, suggestedPhase: phase.key });
      }
    }
  }
  return suggestions;
}

export default function SuggestedProjects({ suggestions, onAdd, onDismiss, onDismissAll }) {
  const [dismissed, setDismissed] = useState(new Set());

  if (!suggestions || suggestions.length === 0) return null;

  const visible = suggestions.filter((s) => !dismissed.has(s.serviceId));
  if (visible.length === 0) return null;

  const handleDismissOne = (serviceId) => {
    setDismissed((prev) => new Set([...prev, serviceId]));
    if (onDismiss) onDismiss(serviceId);
  };

  return (
    <div style={styles.banner}>
      <div style={styles.header}>
        <div>
          <h4 style={styles.title}>New Recommendations</h4>
          <p style={styles.subtitle}>
            Based on updated scores, {visible.length} new project{visible.length !== 1 ? 's' : ''} may
            be worth adding to your roadmap.
          </p>
        </div>
        <button onClick={onDismissAll} style={styles.dismissAllBtn}>
          Dismiss All
        </button>
      </div>

      <div style={styles.list}>
        {visible.map((proj) => {
          const phaseMeta = ROADMAP_PHASES.find((p) => p.key === proj.suggestedPhase);
          return (
            <div key={proj.serviceId} style={styles.card}>
              <div style={styles.cardLeft}>
                <span style={styles.icon}>{proj.service?.icon || ''}</span>
                <div>
                  <div style={styles.projName}>{proj.service?.name || proj.serviceId}</div>
                  <div style={styles.projMeta}>
                    {proj.competencyCount} competenc{proj.competencyCount !== 1 ? 'ies' : 'y'} impacted
                    {' · '}
                    Suggested: <strong>{phaseMeta?.name || proj.suggestedPhase}</strong>
                  </div>
                  {proj.projectedImpact?.length > 0 && (
                    <div style={styles.impacts}>
                      {proj.projectedImpact.slice(0, 3).map((impact, i) => (
                        <span key={i} style={styles.impactChip}>
                          {impact.competencyName} ({impact.departmentLabel}): {impact.currentScore} → {impact.projectedScore}
                        </span>
                      ))}
                      {proj.projectedImpact.length > 3 && (
                        <span style={styles.impactMore}>+{proj.projectedImpact.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div style={styles.cardActions}>
                <button
                  onClick={() => onAdd(proj)}
                  style={styles.addBtn}
                >
                  Add to Roadmap
                </button>
                <button
                  onClick={() => handleDismissOne(proj.serviceId)}
                  style={styles.skipBtn}
                >
                  Skip
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  banner: {
    border: '1px solid #BEE3F8',
    borderRadius: 'var(--radius-lg, 12px)',
    background: '#EBF8FF',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem',
  },
  title: {
    margin: 0,
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#2B6CB0',
  },
  subtitle: {
    margin: '0.15rem 0 0',
    fontSize: '0.8rem',
    color: '#4A5568',
  },
  dismissAllBtn: {
    background: 'none',
    border: '1px solid #90CDF4',
    borderRadius: '6px',
    padding: '0.3rem 0.75rem',
    fontSize: '0.75rem',
    color: '#2B6CB0',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  card: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
  },
  cardLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    flex: 1,
  },
  icon: {
    fontSize: '1.25rem',
    marginTop: '0.1rem',
  },
  projName: {
    fontWeight: 600,
    fontSize: '0.88rem',
    color: '#2D3748',
  },
  projMeta: {
    fontSize: '0.75rem',
    color: '#718096',
    marginTop: '0.1rem',
  },
  impacts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.35rem',
    marginTop: '0.35rem',
  },
  impactChip: {
    fontSize: '0.68rem',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
    background: '#F7FAFC',
    border: '1px solid #E2E8F0',
    color: '#4A5568',
    fontFamily: 'monospace',
  },
  impactMore: {
    fontSize: '0.68rem',
    color: '#A0AEC0',
    alignSelf: 'center',
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    marginLeft: '1rem',
    flexShrink: 0,
  },
  addBtn: {
    padding: '0.3rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '6px',
    border: 'none',
    background: '#6C5CE7',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  skipBtn: {
    padding: '0.3rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
    background: 'white',
    color: '#718096',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
};
