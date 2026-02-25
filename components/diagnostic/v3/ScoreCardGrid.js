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

  function getCellColor(score) {
    if (score === null || score === undefined) return '#F7FAFC'; // gray-50
    const rounded = Math.round(score);
    return V3_STATUS_COLORS[rounded] || '#F7FAFC';
  }

  function getCellTextColor(score) {
    if (score === null || score === undefined) return '#A0AEC0';
    return score <= 2 ? '#FFFFFF' : score >= 4 ? '#FFFFFF' : '#1A202C';
  }

  function handleCellClick(pillar, dept) {
    if (expandedCell?.pillar === pillar && expandedCell?.dept === dept) {
      setExpandedCell(null);
    } else {
      setExpandedCell({ pillar, dept });
    }
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
    borderRadius: 'var(--radius-lg, 12px)',
    border: '1px solid var(--border-color, #E2E8F0)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 'var(--text-sm, 0.875rem)',
  },
  cornerCell: {
    padding: '0.75rem',
    minWidth: '120px',
  },
  headerCell: {
    padding: '0.75rem 1rem',
    textAlign: 'center',
    borderBottom: '2px solid var(--border-color, #E2E8F0)',
    minWidth: '120px',
  },
  headerLabel: {
    fontWeight: 'var(--font-semibold, 600)',
    fontSize: 'var(--text-xs, 0.75rem)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-secondary, #4A5568)',
  },
  headerScore: {
    fontSize: 'var(--text-lg, 1.125rem)',
    fontWeight: 'var(--font-bold, 700)',
    marginTop: '0.25rem',
  },
  rowHeader: {
    padding: '0.75rem 1rem',
    borderRight: '2px solid var(--border-color, #E2E8F0)',
    minWidth: '140px',
  },
  pillarLabel: {
    fontWeight: 'var(--font-semibold, 600)',
    color: 'var(--text-primary, #1A202C)',
  },
  pillarScore: {
    fontSize: 'var(--text-xs, 0.75rem)',
    color: 'var(--text-muted, #718096)',
    marginTop: '0.15rem',
  },
  cell: {
    padding: '0.75rem',
    textAlign: 'center',
    borderBottom: '1px solid var(--border-color, #E2E8F0)',
    borderRight: '1px solid var(--border-color, #E2E8F0)',
    transition: 'all 0.15s ease',
    minWidth: '100px',
  },
  cellScore: {
    fontSize: 'var(--text-lg, 1.125rem)',
    fontWeight: 'var(--font-bold, 700)',
  },
  cellLabel: {
    fontSize: 'var(--text-2xs, 0.65rem)',
    opacity: 0.9,
    marginTop: '0.1rem',
  },
  cellEmpty: {
    color: '#CBD5E0',
    fontSize: 'var(--text-sm, 0.875rem)',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    background: 'var(--bg-secondary, #F7FAFC)',
    borderRadius: 'var(--radius-md, 8px) var(--radius-md, 8px) 0 0',
  },
  detailTitle: {
    fontSize: 'var(--text-base, 1rem)',
    fontWeight: 'var(--font-semibold, 600)',
    margin: 0,
  },
  closeBtn: {
    background: 'none',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-sm, 4px)',
    padding: '0.25rem 0.75rem',
    cursor: 'pointer',
    fontSize: 'var(--text-sm)',
  },
  competencyList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1rem',
    background: 'white',
    border: '1px solid var(--border-color)',
    borderTop: 'none',
    borderRadius: '0 0 var(--radius-md, 8px) var(--radius-md, 8px)',
  },
};
