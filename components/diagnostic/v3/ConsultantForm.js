/**
 * ConsultantForm — Admin-only form for consultant assessments
 *
 * Organized by pillar → department → competency with 1-5 scoring
 * and notes fields. Supports bulk save.
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
} from '../../../lib/diagnostic-engine/v3/constants-v3';

export default function ConsultantForm({ customerId, existingAssessments, onSave }) {
  const [assessments, setAssessments] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedPillar, setExpandedPillar] = useState(null);

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

  // Count scored assessments
  const scoredCount = Object.values(assessments).filter((a) => a.score >= 1).length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Consultant Assessment</h3>
        <div style={styles.headerRight}>
          <span style={styles.count}>{scoredCount} scored</span>
          <button
            style={styles.saveBtn}
            onClick={handleSave}
            disabled={saving || scoredCount === 0}
          >
            {saving ? 'Saving...' : saved ? 'Saved' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Pillar accordions */}
      {PILLAR_ORDER.map((pillar) => {
        const pillarComps = V3_COMPETENCIES.filter((c) => c.pillar === pillar);
        const isExpanded = expandedPillar === pillar;

        return (
          <div key={pillar} style={styles.pillarSection}>
            <button
              style={styles.pillarHeader}
              onClick={() => setExpandedPillar(isExpanded ? null : pillar)}
            >
              <span style={styles.pillarName}>{PILLAR_LABELS[pillar]}</span>
              <span style={styles.pillarCount}>{pillarComps.length} competencies</span>
              <span style={styles.chevron}>{isExpanded ? '\u25B2' : '\u25BC'}</span>
            </button>

            {isExpanded && (
              <div style={styles.pillarBody}>
                {pillarComps.map((comp) => {
                  const depts = expandDepartments(comp.departments);
                  return (
                    <div key={comp.id} style={styles.compRow}>
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
                              <div style={styles.scoreButtons}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <button
                                    key={s}
                                    style={{
                                      ...styles.scoreBtn,
                                      backgroundColor: current?.score === s ? V3_STATUS_COLORS[s] : 'transparent',
                                      color: current?.score === s ? '#FFF' : '#4A5568',
                                      border: `1px solid ${V3_STATUS_COLORS[s]}`,
                                    }}
                                    onClick={() => setScore(comp.id, dept, s)}
                                    title={V3_STATUS[s]}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                              <input
                                style={styles.notesInput}
                                value={current?.notes || ''}
                                onChange={(e) => setNotes(comp.id, dept, e.target.value)}
                                placeholder="Notes..."
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

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
  pillarSection: {
    borderBottom: '1px solid var(--border-color, #E2E8F0)',
  },
  pillarHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    background: 'var(--bg-secondary, #F7FAFC)',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.9rem',
  },
  pillarName: {
    fontWeight: 600,
    flex: 1,
  },
  pillarCount: {
    fontSize: '0.75rem',
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
};
