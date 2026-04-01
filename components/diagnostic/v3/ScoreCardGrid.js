/**
 * ScoreCardGrid — v3 Heat-mapped 6-pillar × 4-department grid
 *
 * Displays the full competency matrix with color-coded cells.
 * Click a cell to expand and see individual competencies.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PILLAR_ORDER,
  DEPARTMENTS,
  PILLAR_LABELS,
  DEPT_LABELS,
  V3_STATUS,
  V3_STATUS_COLORS,
  V3_COMPETENCIES,
  expandDepartments,
} from '../../../lib/diagnostic-engine/v3/constants-v3';
import CompetencyDetailPanel from './CompetencyDetailPanel';

export default function ScoreCardGrid({
  scoreCard,
  pillarScores,
  departmentScores,
  competencies,
  transcriptAssessments,
  consultantAssessments,
  editMode,
  onCellClick,
}) {
  const [expandedCell, setExpandedCell] = useState(null); // { pillar, dept }

  // Softer cell background colors for dark theme
  const CELL_BG = {
    1: 'rgba(248, 113, 113, 0.15)', // soft red
    2: 'rgba(251, 146, 60, 0.15)',  // soft orange
    3: 'rgba(251, 191, 36, 0.12)',  // soft yellow
    4: 'rgba(74, 222, 128, 0.12)',  // soft green
    5: 'rgba(52, 211, 153, 0.15)',  // soft emerald
  };
  const CELL_TEXT = {
    1: '#fca5a5',
    2: '#fdba74',
    3: '#fde68a',
    4: '#86efac',
    5: '#6ee7b7',
  };

  function getCellColor(score) {
    if (score === null || score === undefined) return 'rgba(255, 255, 255, 0.02)';
    return CELL_BG[Math.round(score)] || 'rgba(255, 255, 255, 0.02)';
  }

  function getCellTextColor(score) {
    if (score === null || score === undefined) return 'rgba(255, 255, 255, 0.25)';
    return CELL_TEXT[Math.round(score)] || 'rgba(255, 255, 255, 0.9)';
  }

  function handleCellClick(pillar, dept) {
    if (expandedCell?.pillar === pillar && expandedCell?.dept === dept) {
      setExpandedCell(null);
    } else {
      setExpandedCell({ pillar, dept });
    }
  }

  // Count evidence quotes for a pillar/dept cell
  function getEvidenceCount(pillar, dept) {
    if (!transcriptAssessments) return 0;
    const comps = V3_COMPETENCIES.filter(
      (c) => c.pillar === pillar && expandDepartments(c.departments).includes(dept)
    );
    let count = 0;
    for (const c of comps) {
      const key = `${c.id}_${dept}`;
      const data = transcriptAssessments[key];
      if (data?.evidence?.length > 0) count += data.evidence.length;
    }
    return count;
  }

  // Get competencies for expanded cell
  const expandedCompetencies = expandedCell
    ? V3_COMPETENCIES.filter(
        (c) =>
          c.pillar === expandedCell.pillar &&
          expandDepartments(c.departments).includes(expandedCell.dept)
      )
    : [];

  return (
    <div>
      {/* Grid */}
      <div style={styles.gridContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.cornerCell}></th>
              {DEPARTMENTS.map((dept) => (
                <th key={dept} style={styles.headerCell}>
                  <div style={styles.headerLabel}>{DEPT_LABELS[dept]}</div>
                  {departmentScores?.[dept] !== null && departmentScores?.[dept] !== undefined && (
                    <div style={styles.headerScore}>{departmentScores[dept].toFixed(1)}</div>
                  )}
                </th>
              ))}
              <th style={styles.headerCell}>
                <div style={styles.headerLabel}>Avg</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {PILLAR_ORDER.map((pillar) => (
              <tr key={pillar}>
                <td style={styles.rowHeader}>
                  <div style={styles.pillarLabel}>{PILLAR_LABELS[pillar]}</div>
                  {pillarScores?.[pillar]?._avg !== null && (
                    <div style={styles.pillarScore}>{pillarScores[pillar]._avg?.toFixed(1)}</div>
                  )}
                </td>
                {DEPARTMENTS.map((dept) => {
                  const score = pillarScores?.[pillar]?.[dept];
                  const isExpanded = expandedCell?.pillar === pillar && expandedCell?.dept === dept;
                  return (
                    <td
                      key={dept}
                      style={{
                        ...styles.cell,
                        backgroundColor: getCellColor(score),
                        color: getCellTextColor(score),
                        outline: isExpanded ? '2px solid var(--ls-purple)' : 'none',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                      onClick={() => handleCellClick(pillar, dept)}
                    >
                      {score !== null && score !== undefined ? (
                        <div>
                          <div style={styles.cellScore}>{score.toFixed(1)}</div>
                          <div style={styles.cellLabel}>{V3_STATUS[Math.round(score)]}</div>
                        </div>
                      ) : (
                        <div style={styles.cellEmpty}>--</div>
                      )}
                      {(() => {
                        const evCount = getEvidenceCount(pillar, dept);
                        if (evCount === 0) return null;
                        return (
                          <span style={styles.evidenceBadge} title={`${evCount} transcript quote${evCount !== 1 ? 's' : ''}`}>
                            {evCount}
                          </span>
                        );
                      })()}
                    </td>
                  );
                })}
                <td style={{ ...styles.cell, backgroundColor: getCellColor(pillarScores?.[pillar]?._avg), color: getCellTextColor(pillarScores?.[pillar]?._avg) }}>
                  {pillarScores?.[pillar]?._avg !== null ? (
                    <div style={styles.cellScore}>{pillarScores[pillar]._avg.toFixed(1)}</div>
                  ) : (
                    <div style={styles.cellEmpty}>--</div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expanded competency detail */}
      <AnimatePresence>
        {expandedCell && expandedCompetencies.length > 0 && (
          <motion.div
            key={`${expandedCell.pillar}-${expandedCell.dept}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden', marginTop: '1rem' }}
          >
            <div style={styles.detailHeader}>
              <h3 style={styles.detailTitle}>
                {PILLAR_LABELS[expandedCell.pillar]} — {DEPT_LABELS[expandedCell.dept]}
              </h3>
              <button style={styles.closeBtn} onClick={() => setExpandedCell(null)}>
                Close
              </button>
            </div>
            <div style={styles.competencyList}>
              {expandedCompetencies.map((comp) => {
                const score = scoreCard?.[comp.id]?.[expandedCell.dept];
                return (
                  <CompetencyDetailPanel
                    key={comp.id}
                    competency={comp}
                    department={expandedCell.dept}
                    score={score}
                    transcriptData={transcriptAssessments?.[`${comp.id}_${expandedCell.dept}`]}
                    consultantData={consultantAssessments?.[`${comp.id}_${expandedCell.dept}`]}
                    editMode={editMode}
                    onScoreChange={onCellClick}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  gridContainer: {
    overflowX: 'auto',
    borderRadius: 14,
    border: '1px solid rgba(255, 255, 255, 0.06)',
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(12px)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.88rem',
  },
  cornerCell: {
    padding: '1rem 1.25rem',
    minWidth: '130px',
  },
  headerCell: {
    padding: '1rem 1.25rem',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    minWidth: '120px',
  },
  headerLabel: {
    fontWeight: 600,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  headerScore: {
    fontSize: '1.2rem',
    fontWeight: 700,
    marginTop: '0.3rem',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  rowHeader: {
    padding: '1rem 1.25rem',
    borderRight: '1px solid rgba(255, 255, 255, 0.06)',
    minWidth: '140px',
  },
  pillarLabel: {
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: '0.88rem',
  },
  pillarScore: {
    fontSize: '0.72rem',
    color: 'rgba(255, 255, 255, 0.35)',
    marginTop: '0.2rem',
  },
  cell: {
    padding: '1rem 1.1rem',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
    borderRight: '1px solid rgba(255, 255, 255, 0.04)',
    transition: 'all 0.2s ease',
    minWidth: '110px',
  },
  cellScore: {
    fontSize: '1.15rem',
    fontWeight: 700,
    letterSpacing: '-0.01em',
  },
  cellLabel: {
    fontSize: '0.62rem',
    opacity: 0.75,
    marginTop: '0.15rem',
    textTransform: 'capitalize',
  },
  cellEmpty: {
    color: 'rgba(255, 255, 255, 0.2)',
    fontSize: '0.88rem',
  },
  evidenceBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    minWidth: 16,
    height: 16,
    padding: '0 3px',
    borderRadius: '8px',
    background: 'rgba(163, 230, 53, 0.2)',
    color: '#a3e635',
    fontSize: '9px',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    border: '1px solid rgba(163, 230, 53, 0.3)',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 'var(--radius-md, 8px) var(--radius-md, 8px) 0 0',
  },
  detailTitle: {
    fontSize: 'var(--text-base, 1rem)',
    fontWeight: 'var(--font-semibold, 600)',
    margin: 0,
    color: '#ffffff',
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: 'var(--radius-sm, 4px)',
    padding: '0.25rem 0.75rem',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  competencyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1rem',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderTop: 'none',
    borderRadius: '0 0 var(--radius-md, 8px) var(--radius-md, 8px)',
  },
};
