/**
 * ConsultantForm — Admin-only form for consultant assessments
 *
 * Three-tier layout:
 *   Tier 1 (Required):  21 competencies the consultant must score
 *   Tier 2 (Review):     6 competencies with pre-filled API scores to confirm/override
 *   Tier 3 (Auto):      13 competencies scored by system, read-only
 */

import { useState, useEffect } from 'react';
import {
  V3_COMPETENCIES,
  PILLAR_ORDER,
  DEPARTMENTS,
  PILLAR_LABELS,
  DEPT_LABELS,
  V3_STATUS,
  V3_STATUS_COLORS,
  expandDepartments,
  CONSULTANT_TIERS,
  getCompetenciesByTier,
  countCellsByTier,
} from '../../../lib/diagnostic-engine/v3/constants-v3';

export default function ConsultantForm({ customerId, existingAssessments, apiScores, onSave }) {
  const [assessments, setAssessments] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedPillar, setExpandedPillar] = useState(null);
  const [showAutoSection, setShowAutoSection] = useState(false);

  // Partition competencies by tier
  const tier1Comps = getCompetenciesByTier(CONSULTANT_TIERS.REQUIRED);
  const tier2Comps = getCompetenciesByTier(CONSULTANT_TIERS.REVIEW);
  const tier3Comps = getCompetenciesByTier(CONSULTANT_TIERS.AUTO);

  // Tier 1 progress tracking
  const tier1Total = countCellsByTier(CONSULTANT_TIERS.REQUIRED);
  const tier1Scored = tier1Comps.reduce((count, comp) => {
    const depts = expandDepartments(comp.departments);
    return count + depts.filter((d) => {
      const key = `${comp.id}_${d}`;
      return assessments[key]?.score >= 1;
    }).length;
  }, 0);
  const tier1Percent = tier1Total > 0 ? Math.round((tier1Scored / tier1Total) * 100) : 0;

  // Initialize from existing assessments
  useEffect(() => {
    if (existingAssessments) {
      const initial = {};
      for (const a of existingAssessments) {
        const key = `${a.competency_id}_${a.department}`;
        initial[key] = { score: a.score, notes: a.notes || '' };
      }
      setAssessments(initial);
    }
  }, [existingAssessments]);

  function setScore(competencyId, dept, score) {
    const key = `${competencyId}_${dept}`;
    setAssessments((prev) => ({
      ...prev,
      [key]: { ...prev[key], score, notes: prev[key]?.notes || '' },
    }));
    setSaved(false);
  }

  function setNotes(competencyId, dept, notes) {
    const key = `${competencyId}_${dept}`;
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
      const bulkAssessments = Object.entries(assessments)
        .filter(([_, v]) => v.score >= 1 && v.score <= 5)
        .map(([key, v]) => {
          const [competencyId, department] = key.split('_');
          return {
            competencyId,
            department,
            score: v.score,
            notes: v.notes || null,
          };
        });

      if (bulkAssessments.length === 0) return;

      const res = await fetch('/api/diagnostic/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          assessments: bulkAssessments,
          assessedBy: 'consultant',
        }),
      });

      const json = await res.json();
      if (json.success) {
        setSaved(true);
        onSave?.(json.data);
      }
    } catch (err) {
      console.error('Error saving consultant assessments:', err);
    } finally {
      setSaving(false);
    }
  }

  // Count all scored assessments
  const scoredCount = Object.values(assessments).filter((a) => a.score >= 1).length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Consultant Assessment</h3>
        <div style={styles.headerRight}>
          <span style={styles.count}>
            Required: {tier1Scored}/{tier1Total}
            {tier1Percent === 100 && ' \u2713'}
          </span>
          <button
            style={styles.saveBtn}
            onClick={handleSave}
            disabled={saving || scoredCount === 0}
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
            width: `${tier1Percent}%`,
            background: tier1Percent === 100 ? '#48BB78' : tier1Percent >= 50 ? '#ECC94B' : '#E53E3E',
          }} />
        </div>
        <span style={styles.progressLabel}>{tier1Percent}% complete</span>
      </div>

      {/* ═══ TIER 1: Required Assessment ═══ */}
      <div style={styles.tierSection}>
        <div style={styles.tierHeader}>
          <h4 style={styles.tierTitle}>Required Assessment</h4>
          <span style={styles.tierSubtext}>{tier1Comps.length} competencies</span>
        </div>

        {PILLAR_ORDER.map((pillar) => {
          const comps = tier1Comps.filter((c) => c.pillar === pillar);
          if (comps.length === 0) return null;
          const isExpanded = expandedPillar === pillar;

          return (
            <div key={pillar} style={styles.pillarSection}>
              <button
                style={styles.pillarHeader}
                onClick={() => setExpandedPillar(isExpanded ? null : pillar)}
              >
                <span style={styles.pillarName}>{PILLAR_LABELS[pillar]}</span>
                <span style={styles.pillarCount}>{comps.length} competencies</span>
                <span style={styles.chevron}>{isExpanded ? '\u25B2' : '\u25BC'}</span>
              </button>

              {isExpanded && (
                <div style={styles.pillarBody}>
                  {comps.map((comp) => (
                    <CompetencyRow
                      key={comp.id}
                      comp={comp}
                      assessments={assessments}
                      onSetScore={setScore}
                      onSetNotes={setNotes}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ═══ TIER 2: Review & Override ═══ */}
      <div style={styles.tierSection}>
        <div style={styles.tierHeader}>
          <h4 style={styles.tierTitle}>Review API Scores</h4>
          <span style={styles.tierSubtext}>{tier2Comps.length} competencies — confirm or override</span>
        </div>

        {tier2Comps.map((comp) => (
          <ReviewCompetencyRow
            key={comp.id}
            comp={comp}
            apiScores={apiScores || {}}
            assessments={assessments}
            onSetScore={setScore}
            onSetNotes={setNotes}
          />
        ))}
      </div>

      {/* ═══ TIER 3: System-Scored (Collapsed) ═══ */}
      <div style={styles.tierSection}>
        <button
          style={styles.tierHeaderCollapsible}
          onClick={() => setShowAutoSection(!showAutoSection)}
        >
          <h4 style={styles.tierTitle}>System-Scored</h4>
          <span style={styles.tierSubtext}>{tier3Comps.length} competencies (read-only)</span>
          <span style={styles.chevron}>{showAutoSection ? '\u25B2' : '\u25BC'}</span>
        </button>

        {showAutoSection && (
          <div style={styles.autoGrid}>
            {tier3Comps.map((comp) => (
              <AutoScoredRow
                key={comp.id}
                comp={comp}
                apiScores={apiScores || {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-Components ──

function CompetencyRow({ comp, assessments, onSetScore, onSetNotes }) {
  const depts = expandDepartments(comp.departments);
  return (
    <div style={styles.compRow}>
      <div style={styles.compInfo}>
        <span style={styles.compId}>{comp.id}</span>
        <span style={styles.compName}>{comp.name}</span>
      </div>

      <div style={styles.deptGrid}>
        {depts.map((dept) => {
          const key = `${comp.id}_${dept}`;
          const current = assessments[key];
          return (
            <div key={dept} style={styles.deptCell}>
              <div style={styles.deptName}>{DEPT_LABELS[dept]}</div>
              <ScoreButtons
                currentScore={current?.score}
                onSelect={(s) => onSetScore(comp.id, dept, s)}
              />
              <input
                style={styles.notesInput}
                value={current?.notes || ''}
                onChange={(e) => onSetNotes(comp.id, dept, e.target.value)}
                placeholder="Notes..."
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewCompetencyRow({ comp, apiScores, assessments, onSetScore, onSetNotes }) {
  const [overriding, setOverriding] = useState(false);
  const depts = expandDepartments(comp.departments);

  return (
    <div style={styles.compRow}>
      <div style={styles.compInfo}>
        <span style={styles.compId}>{comp.id}</span>
        <span style={styles.compName}>{comp.name}</span>
      </div>

      <div style={styles.deptGrid}>
        {depts.map((dept) => {
          const key = `${comp.id}_${dept}`;
          const apiScore = apiScores?.[key]?.score;
          const current = assessments[key];
          const hasConsultantScore = current?.score >= 1;

          return (
            <div key={dept} style={styles.deptCell}>
              <div style={styles.deptName}>{DEPT_LABELS[dept]}</div>

              {apiScore && !overriding && !hasConsultantScore ? (
                <div style={styles.apiScoreDisplay}>
                  <span style={{
                    ...styles.apiScoreBadge,
                    backgroundColor: V3_STATUS_COLORS[apiScore],
                  }}>
                    {apiScore} — {V3_STATUS[apiScore]}
                  </span>
                  <div style={styles.reviewActions}>
                    <button
                      style={styles.confirmBtn}
                      onClick={() => onSetScore(comp.id, dept, apiScore)}
                    >
                      Confirm
                    </button>
                    <button
                      style={styles.overrideBtn}
                      onClick={() => setOverriding(true)}
                    >
                      Override
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <ScoreButtons
                    currentScore={current?.score}
                    onSelect={(s) => onSetScore(comp.id, dept, s)}
                  />
                  <input
                    style={styles.notesInput}
                    value={current?.notes || ''}
                    onChange={(e) => onSetNotes(comp.id, dept, e.target.value)}
                    placeholder="Notes..."
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AutoScoredRow({ comp, apiScores }) {
  const depts = expandDepartments(comp.departments);

  return (
    <div style={styles.autoRow}>
      <div style={styles.compInfo}>
        <span style={styles.compId}>{comp.id}</span>
        <span style={styles.compName}>{comp.name}</span>
      </div>
      <div style={styles.autoDeptRow}>
        {depts.map((dept) => {
          const key = `${comp.id}_${dept}`;
          const score = apiScores?.[key]?.score;
          const source = apiScores?.[key]?.source || 'api';
          return (
            <div key={dept} style={styles.autoDeptCell}>
              <span style={styles.autoDeptLabel}>{DEPT_LABELS[dept]}</span>
              {score ? (
                <span style={{
                  ...styles.autoScoreBadge,
                  backgroundColor: V3_STATUS_COLORS[score],
                }}>
                  {score}
                </span>
              ) : (
                <span style={styles.autoNoScore}>—</span>
              )}
              <span style={styles.autoSource}>{source}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ScoreButtons({ currentScore, onSelect }) {
  return (
    <div style={styles.scoreButtons}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          style={{
            ...styles.scoreBtn,
            backgroundColor: currentScore === s ? V3_STATUS_COLORS[s] : 'transparent',
            color: currentScore === s ? '#FFF' : '#4A5568',
            border: `1px solid ${V3_STATUS_COLORS[s]}`,
          }}
          onClick={() => onSelect(s)}
          title={V3_STATUS[s]}
        >
          {s}
        </button>
      ))}
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
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  count: {
    fontSize: '0.8rem',
    color: '#718096',
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
    padding: '0 1.25rem 0.75rem',
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
    fontSize: '0.7rem',
    color: '#A0AEC0',
    minWidth: '5rem',
    textAlign: 'right',
  },
  tierSection: {
    borderBottom: '1px solid var(--border-color, #E2E8F0)',
  },
  tierHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    background: 'var(--bg-secondary, #F7FAFC)',
    borderBottom: '1px solid #EDF2F7',
  },
  tierHeaderCollapsible: {
    width: '100%',
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    background: 'var(--bg-secondary, #F7FAFC)',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  tierTitle: {
    margin: 0,
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  tierSubtext: {
    fontSize: '0.75rem',
    color: '#A0AEC0',
    flex: 1,
  },
  pillarSection: {
    borderBottom: '1px solid #EDF2F7',
  },
  pillarHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.25rem 0.6rem 2rem',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.85rem',
  },
  pillarName: {
    fontWeight: 600,
    flex: 1,
  },
  pillarCount: {
    fontSize: '0.7rem',
    color: '#A0AEC0',
  },
  chevron: {
    fontSize: '0.6rem',
    color: '#A0AEC0',
  },
  pillarBody: {
    padding: '0.5rem 1.25rem 1rem',
  },
  compRow: {
    padding: '0.75rem 0',
    borderBottom: '1px solid #EDF2F7',
  },
  compInfo: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  compId: {
    fontSize: '0.7rem',
    fontFamily: 'monospace',
    color: '#A0AEC0',
  },
  compName: {
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  deptGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.5rem',
    marginLeft: '1rem',
  },
  deptCell: {
    padding: '0.5rem',
    borderRadius: 'var(--radius-sm, 4px)',
    background: '#FAFAFA',
  },
  deptName: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#718096',
    textTransform: 'uppercase',
    marginBottom: '0.35rem',
  },
  scoreButtons: {
    display: 'flex',
    gap: '0.2rem',
    marginBottom: '0.35rem',
  },
  scoreBtn: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '0.65rem',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.1s ease',
  },
  notesInput: {
    width: '100%',
    padding: '0.25rem 0.5rem',
    border: '1px solid #E2E8F0',
    borderRadius: '4px',
    fontSize: '0.75rem',
    boxSizing: 'border-box',
  },
  // Tier 2 styles
  apiScoreDisplay: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
  },
  apiScoreBadge: {
    display: 'inline-block',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    color: 'white',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  reviewActions: {
    display: 'flex',
    gap: '0.3rem',
  },
  confirmBtn: {
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    border: '1px solid #48BB78',
    background: 'transparent',
    color: '#48BB78',
    fontSize: '0.7rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  overrideBtn: {
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    border: '1px solid #A0AEC0',
    background: 'transparent',
    color: '#A0AEC0',
    fontSize: '0.7rem',
    cursor: 'pointer',
  },
  // Tier 3 styles
  autoGrid: {
    padding: '0.75rem 1.25rem',
  },
  autoRow: {
    padding: '0.4rem 0',
    borderBottom: '1px solid #EDF2F7',
  },
  autoDeptRow: {
    display: 'flex',
    gap: '0.75rem',
    marginLeft: '1rem',
    marginTop: '0.25rem',
    flexWrap: 'wrap',
  },
  autoDeptCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
  },
  autoDeptLabel: {
    fontSize: '0.65rem',
    color: '#A0AEC0',
    textTransform: 'uppercase',
  },
  autoScoreBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.2rem',
    height: '1.2rem',
    borderRadius: '50%',
    color: 'white',
    fontSize: '0.6rem',
    fontWeight: 600,
  },
  autoNoScore: {
    fontSize: '0.7rem',
    color: '#CBD5E0',
  },
  autoSource: {
    fontSize: '0.6rem',
    color: '#CBD5E0',
  },
};
