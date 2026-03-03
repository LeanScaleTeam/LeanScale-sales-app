/**
 * ConsultantAuditForm — V2 Sequential CRM Audit Checklist
 *
 * Replaces the V1 ConsultantForm with a guided sequential flow:
 * - 14 consolidated competencies (down from 21 required)
 * - "What We Found" panel from CRM signals
 * - CRM-specific check instructions (Salesforce / HubSpot)
 * - Suggested scores with confirm/override
 * - Progress tracking
 */

import { useState, useEffect, useRef } from 'react';
import {
  V2_COMPETENCIES,
  expandV2Departments,
  computeAllSuggestedScores,
  collapseAssessmentsToV2,
} from '../../../lib/diagnostic-engine/v3/consultant-competencies';

const PILLAR_LABELS = {
  planning: 'Planning',
  people: 'People',
  process: 'Process',
  reporting: 'Reporting',
  enablement: 'Enablement',
};

const SCORE_LABELS = {
  1: 'Non-Existent',
  2: 'Below Average',
  3: 'Average',
  4: 'Above Average',
  5: 'Best Practice',
};

const SCORE_COLORS = {
  1: '#E53E3E',
  2: '#DD6B20',
  3: '#ECC94B',
  4: '#38A169',
  5: '#2B6CB0',
};

export default function ConsultantAuditForm({
  customerId,
  crmType = 'salesforce',
  computedSignals = {},
  enhancedSignals = {},
  metadata = {},
  existingAssessments = [],
  onSave,
}) {
  const [assessments, setAssessments] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef([]);

  // Compute suggested scores from CRM signals
  const suggestions = computeAllSuggestedScores(computedSignals, enhancedSignals, metadata);

  // Build flat list: each entry is { comp, dept } for dept-scoped, or { comp, dept: 'org' } for org-scoped
  const cells = [];
  for (const comp of V2_COMPETENCIES) {
    if (comp.scope === 'org') {
      cells.push({ comp, dept: 'org' });
    } else {
      for (const dept of expandV2Departments(comp)) {
        cells.push({ comp, dept });
      }
    }
  }

  // Initialize from existing assessments (V1 IDs → collapsed to V2 keys)
  useEffect(() => {
    if (existingAssessments && existingAssessments.length > 0) {
      setAssessments(collapseAssessmentsToV2(existingAssessments));
    }
  }, [existingAssessments]);

  // Progress
  const totalCells = cells.length;
  const scoredCells = cells.filter(({ comp, dept }) => {
    const key = `${comp.id}_${dept}`;
    return assessments[key]?.score >= 1;
  }).length;
  const progressPercent = totalCells > 0 ? Math.round((scoredCells / totalCells) * 100) : 0;

  function setScore(compId, dept, score) {
    const key = `${compId}_${dept}`;
    setAssessments((prev) => ({
      ...prev,
      [key]: { ...prev[key], score, notes: prev[key]?.notes || '' },
    }));
    setSaved(false);

    // Auto-advance to next unscored item
    const currentIdx = cells.findIndex((c) => c.comp.id === compId && c.dept === dept);
    if (currentIdx >= 0 && currentIdx < cells.length - 1) {
      const nextUnscored = cells.findIndex((c, i) => {
        if (i <= currentIdx) return false;
        const k = `${c.comp.id}_${c.dept}`;
        return !(assessments[k]?.score >= 1) && !(compId === c.comp.id && dept === c.dept);
      });
      if (nextUnscored >= 0) {
        setActiveIndex(nextUnscored);
        setTimeout(() => {
          itemRefs.current[nextUnscored]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }

  function setNotes(compId, dept, notes) {
    const key = `${compId}_${dept}`;
    setAssessments((prev) => ({
      ...prev,
      [key]: { ...prev[key], notes, score: prev[key]?.score || null },
    }));
    setSaved(false);
  }

  async function handleSave() {
    if (!customerId) return;
    setSaving(true);

    try {
      // Collect all scored cells and send as V2 IDs — the API fans them out
      const bulkAssessments = [];
      for (const { comp, dept } of cells) {
        const key = `${comp.id}_${dept}`;
        const a = assessments[key];
        if (a?.score >= 1 && a?.score <= 5) {
          bulkAssessments.push({
            competencyId: comp.id,
            department: dept,
            score: a.score,
            notes: a.notes || null,
          });
        }
      }

      if (bulkAssessments.length === 0) return;

      const res = await fetch('/api/diagnostic/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          assessments: bulkAssessments,
          assessedBy: 'consultant-v2',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        onSave?.(json.data);
      }
    } catch (err) {
      console.error('Error saving audit assessments:', err);
    } finally {
      setSaving(false);
    }
  }

  // Group cells by competency for rendering
  let currentPillar = null;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>CRM Audit Form</h3>
          <p style={styles.subtitle}>
            {V2_COMPETENCIES.length} competencies | {totalCells} items to review
          </p>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.count}>{scoredCells}/{totalCells} scored</span>
          <button
            style={styles.saveBtn}
            onClick={handleSave}
            disabled={saving || scoredCells === 0}
          >
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={styles.progressContainer}>
        <div style={styles.progressTrack}>
          <div style={{
            ...styles.progressFill,
            width: `${progressPercent}%`,
            background: progressPercent === 100 ? '#48BB78' : progressPercent >= 50 ? '#ECC94B' : '#6C5CE7',
          }} />
        </div>
        <span style={styles.progressLabel}>{progressPercent}%</span>
      </div>

      {/* Checklist */}
      <div style={styles.checklist}>
        {cells.map(({ comp, dept }, idx) => {
          const key = `${comp.id}_${dept}`;
          const currentAssessment = assessments[key];
          const isScored = currentAssessment?.score >= 1;
          const isActive = idx === activeIndex;
          const suggestion = suggestions[comp.id];
          const crmChecks = comp.crmChecks[crmType] || comp.crmChecks.salesforce;

          // Pillar separator
          let pillarHeader = null;
          if (comp.pillar !== currentPillar) {
            currentPillar = comp.pillar;
            pillarHeader = (
              <div style={styles.pillarDivider} key={`pillar-${comp.pillar}`}>
                <span style={styles.pillarLabel}>{PILLAR_LABELS[comp.pillar]}</span>
              </div>
            );
          }

          return (
            <div key={key}>
              {pillarHeader}
              <div
                ref={(el) => (itemRefs.current[idx] = el)}
                style={{
                  ...styles.checkItem,
                  ...(isActive ? styles.checkItemActive : {}),
                  ...(isScored ? styles.checkItemScored : {}),
                }}
                onClick={() => setActiveIndex(idx)}
              >
                {/* Checkbox + Title */}
                <div style={styles.checkHeader}>
                  <span style={{
                    ...styles.checkbox,
                    ...(isScored ? styles.checkboxDone : {}),
                  }}>
                    {isScored ? '\u2713' : (idx + 1)}
                  </span>
                  <div style={styles.checkTitleBlock}>
                    <span style={styles.checkId}>{comp.id}</span>
                    <span style={styles.checkName}>{comp.name}</span>
                    {comp.scope === 'dept' && (
                      <span style={styles.deptBadge}>{dept}</span>
                    )}
                    {comp.scope === 'org' && (
                      <span style={styles.orgBadge}>org-wide</span>
                    )}
                  </div>
                  {isScored && (
                    <span style={{
                      ...styles.scoredBadge,
                      backgroundColor: SCORE_COLORS[currentAssessment.score],
                    }}>
                      {currentAssessment.score}
                    </span>
                  )}
                </div>

                {/* Expanded detail — only for active item */}
                {isActive && (
                  <div style={styles.expandedDetail}>
                    {/* What We Found panel */}
                    {suggestion && suggestion.evidence && suggestion.evidence.length > 0 && (
                      <div style={styles.foundPanel}>
                        <div style={styles.foundHeader}>WHAT WE FOUND</div>
                        <ul style={styles.foundList}>
                          {suggestion.evidence.map((e, i) => (
                            <li key={i} style={styles.foundItem}>{e}</li>
                          ))}
                        </ul>
                        {suggestion.score && (
                          <div style={styles.suggestedScore}>
                            Suggested score: <strong>{suggestion.score}</strong> ({SCORE_LABELS[suggestion.score]})
                            <span style={styles.confidence}>{suggestion.confidence} confidence</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* CRM Check Instructions */}
                    <div style={styles.crmChecksPanel}>
                      <div style={styles.crmChecksHeader}>
                        VERIFY IN {crmType.toUpperCase()}
                      </div>
                      <ul style={styles.crmChecksList}>
                        {crmChecks.map((check, i) => (
                          <li key={i} style={styles.crmCheckItem}>{check}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Scoring Guide */}
                    <div style={styles.scoringGuide}>
                      <div style={styles.scoringHeader}>SCORING GUIDE</div>
                      <div style={styles.rubricGrid}>
                        {[1, 3, 5].map((level) => (
                          <div key={level} style={styles.rubricItem}>
                            <span style={{
                              ...styles.rubricLevel,
                              color: SCORE_COLORS[level],
                            }}>{level}</span>
                            <span style={styles.rubricText}>{comp.rubric[level]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Score + Notes */}
                    <div style={styles.scoreSection}>
                      <div style={styles.scoreRow}>
                        <span style={styles.scoreLabel}>Score:</span>
                        <div style={styles.scoreButtons}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              style={{
                                ...styles.scoreBtn,
                                backgroundColor: currentAssessment?.score === s
                                  ? SCORE_COLORS[s]
                                  : suggestion?.score === s ? `${SCORE_COLORS[s]}33` : 'transparent',
                                color: currentAssessment?.score === s ? '#FFF' : '#4A5568',
                                border: `2px solid ${SCORE_COLORS[s]}`,
                                fontWeight: suggestion?.score === s ? 700 : 500,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setScore(comp.id, dept, s);
                              }}
                              title={SCORE_LABELS[s]}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        {suggestion?.score && !isScored && (
                          <button
                            style={styles.confirmSuggested}
                            onClick={(e) => {
                              e.stopPropagation();
                              setScore(comp.id, dept, suggestion.score);
                            }}
                          >
                            Confirm {suggestion.score}
                          </button>
                        )}
                      </div>
                      <input
                        style={styles.notesInput}
                        value={currentAssessment?.notes || ''}
                        onChange={(e) => setNotes(comp.id, dept, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Notes (optional)..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Styles ──

const styles = {
  container: {
    border: '1px solid var(--border-color, #E2E8F0)',
    borderRadius: 'var(--radius-lg, 12px)',
    background: 'white',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    borderBottom: '1px solid var(--border-color, #E2E8F0)',
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
  },
  subtitle: {
    margin: '0.2rem 0 0',
    fontSize: '0.75rem',
    color: '#A0AEC0',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  count: {
    fontSize: '0.8rem',
    color: '#718096',
    fontWeight: 500,
  },
  saveBtn: {
    padding: '0.4rem 1rem',
    borderRadius: 'var(--radius-md, 8px)',
    border: 'none',
    background: 'var(--ls-purple, #6C5CE7)',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1.25rem 0.75rem',
  },
  progressTrack: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    background: '#EDF2F7',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  progressLabel: {
    fontSize: '0.75rem',
    color: '#A0AEC0',
    fontWeight: 600,
    minWidth: '2.5rem',
    textAlign: 'right',
  },
  checklist: {
    padding: '0 0 1rem',
  },
  pillarDivider: {
    padding: '0.6rem 1.25rem',
    background: 'var(--bg-secondary, #F7FAFC)',
    borderTop: '1px solid #EDF2F7',
    borderBottom: '1px solid #EDF2F7',
  },
  pillarLabel: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#4A5568',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
  },
  checkItem: {
    padding: '0.75rem 1.25rem',
    borderBottom: '1px solid #EDF2F7',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  checkItemActive: {
    background: '#FAFBFF',
    borderLeft: '3px solid var(--ls-purple, #6C5CE7)',
    paddingLeft: 'calc(1.25rem - 3px)',
  },
  checkItemScored: {
    opacity: 1,
  },
  checkHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  checkbox: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.6rem',
    height: '1.6rem',
    borderRadius: '50%',
    border: '2px solid #CBD5E0',
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#A0AEC0',
    flexShrink: 0,
  },
  checkboxDone: {
    backgroundColor: '#48BB78',
    borderColor: '#48BB78',
    color: 'white',
  },
  checkTitleBlock: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.4rem',
    flex: 1,
  },
  checkId: {
    fontSize: '0.7rem',
    fontFamily: 'monospace',
    color: '#A0AEC0',
  },
  checkName: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#2D3748',
  },
  deptBadge: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: '#6C5CE7',
    background: '#EDE9FE',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
    textTransform: 'uppercase',
  },
  orgBadge: {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: '#38A169',
    background: '#F0FFF4',
    padding: '0.1rem 0.4rem',
    borderRadius: '4px',
  },
  scoredBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 700,
    flexShrink: 0,
  },
  expandedDetail: {
    marginTop: '0.75rem',
    marginLeft: '2.1rem',
  },
  foundPanel: {
    background: '#F0FFF4',
    border: '1px solid #C6F6D5',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '0.75rem',
  },
  foundHeader: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#38A169',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    marginBottom: '0.4rem',
  },
  foundList: {
    margin: 0,
    paddingLeft: '1.2rem',
  },
  foundItem: {
    fontSize: '0.8rem',
    color: '#2D3748',
    marginBottom: '0.2rem',
    lineHeight: 1.4,
  },
  suggestedScore: {
    marginTop: '0.4rem',
    fontSize: '0.8rem',
    color: '#4A5568',
  },
  confidence: {
    marginLeft: '0.5rem',
    fontSize: '0.7rem',
    color: '#A0AEC0',
  },
  crmChecksPanel: {
    background: '#EBF8FF',
    border: '1px solid #BEE3F8',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '0.75rem',
  },
  crmChecksHeader: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#3182CE',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    marginBottom: '0.4rem',
  },
  crmChecksList: {
    margin: 0,
    paddingLeft: '1.2rem',
  },
  crmCheckItem: {
    fontSize: '0.8rem',
    color: '#2D3748',
    marginBottom: '0.3rem',
    lineHeight: 1.4,
  },
  scoringGuide: {
    background: '#FFFAF0',
    border: '1px solid #FEEBC8',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '0.75rem',
  },
  scoringHeader: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: '#DD6B20',
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    marginBottom: '0.4rem',
  },
  rubricGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  rubricItem: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'flex-start',
  },
  rubricLevel: {
    fontWeight: 700,
    fontSize: '0.8rem',
    minWidth: '1rem',
  },
  rubricText: {
    fontSize: '0.78rem',
    color: '#4A5568',
    lineHeight: 1.3,
  },
  scoreSection: {
    marginTop: '0.25rem',
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  scoreLabel: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#4A5568',
  },
  scoreButtons: {
    display: 'flex',
    gap: '0.3rem',
  },
  scoreBtn: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '0.8rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
  confirmSuggested: {
    marginLeft: '0.5rem',
    padding: '0.3rem 0.75rem',
    borderRadius: '6px',
    border: '1px solid #48BB78',
    background: '#F0FFF4',
    color: '#38A169',
    fontSize: '0.75rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  notesInput: {
    width: '100%',
    padding: '0.4rem 0.6rem',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    fontSize: '0.8rem',
    boxSizing: 'border-box',
  },
};
