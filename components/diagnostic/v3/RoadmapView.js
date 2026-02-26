/**
 * RoadmapView — 4-phase prioritized project timeline
 *
 * Displays Foundation → Build → Optimize → Scale phases
 * with project cards sorted by priority within each phase.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROADMAP_PHASES, V3_STATUS_COLORS } from '../../../lib/diagnostic-engine/v3/constants-v3';
import { lookupServiceV3 } from '../../../lib/diagnostic-engine/v3/service-mapping-v3';

const PHASE_COLORS = {
  FOUNDATION: { bg: '#FFF5F5', border: '#FEB2B2', icon: '#E53E3E' },
  BUILD: { bg: '#FFFFF0', border: '#FEFCBF', icon: '#D69E2E' },
  OPTIMIZE: { bg: '#F0FFF4', border: '#C6F6D5', icon: '#38A169' },
  SCALE: { bg: '#EBF8FF', border: '#BEE3F8', icon: '#3182CE' },
};

export default function RoadmapView({ roadmap, showHealthy = false, onToggleHealthy }) {
  const [expandedProject, setExpandedProject] = useState(null);

  if (!roadmap?.phases) return null;

  return (
    <div style={styles.container}>
      {/* Phase timeline */}
      {roadmap.phases.map((phase) => {
        if (phase.projects.length === 0 && !showHealthy) return null;

        const colors = PHASE_COLORS[phase.key] || PHASE_COLORS.BUILD;

        return (
          <div key={phase.key} style={styles.phase}>
            {/* Phase header */}
            <div style={{ ...styles.phaseHeader, borderLeftColor: colors.icon }}>
              <div style={{ ...styles.phaseNumber, backgroundColor: colors.icon }}>
                {phase.order}
              </div>
              <div>
                <h3 style={styles.phaseName}>{phase.name}</h3>
                <p style={styles.phaseDesc}>{phase.description}</p>
              </div>
              <span style={styles.projectCount}>
                {phase.projectCount} project{phase.projectCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Project cards */}
            <div style={styles.projectGrid}>
              {phase.projects.map((project) => (
                <ProjectCard
                  key={project.serviceId}
                  project={project}
                  isExpanded={expandedProject === project.serviceId}
                  onToggle={() =>
                    setExpandedProject(
                      expandedProject === project.serviceId ? null : project.serviceId
                    )
                  }
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Summary */}
      {roadmap.summary && (
        <div style={styles.summary}>
          <div style={styles.summaryItem}>
            <span style={styles.summaryValue}>{roadmap.totalProjects}</span>
            <span style={styles.summaryLabel}>Total Projects</span>
          </div>
          <div style={styles.summaryItem}>
            <span style={styles.summaryValue}>{roadmap.summary.estimatedCoverage?.coveragePercent}%</span>
            <span style={styles.summaryLabel}>Gap Coverage</span>
          </div>
        </div>
      )}

      {/* Toggle healthy */}
      {onToggleHealthy && (
        <button style={styles.toggleBtn} onClick={onToggleHealthy}>
          {showHealthy ? 'Hide healthy items' : 'Show all items'}
        </button>
      )}
    </div>
  );
}

function ProjectCard({ project, isExpanded, onToggle }) {
  const service = project.service;

  return (
    <div style={styles.card} onClick={onToggle}>
      <div style={styles.cardHeader}>
        <div style={styles.cardInfo}>
          <span style={styles.cardIcon}>{service?.icon || ''}</span>
          <div>
            <div style={styles.cardName}>{service?.name || project.serviceId}</div>
            <div style={styles.cardMeta}>
              {project.competencyCount} competenc{project.competencyCount !== 1 ? 'ies' : 'y'} impacted
            </div>
          </div>
        </div>
        <div style={styles.priorityBadge}>
          {project.priority?.score?.toFixed(1)}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={styles.cardBody}>
              {/* Description */}
              {service?.description && (
                <p style={styles.cardDesc}>{service.description}</p>
              )}

              {/* Impact details */}
              {project.projectedImpact?.length > 0 && (
                <div style={styles.impactSection}>
                  <div style={styles.impactTitle}>Projected Impact</div>
                  {project.projectedImpact.map((impact, i) => (
                    <div key={i} style={styles.impactRow}>
                      <span style={styles.impactComp}>
                        {impact.competencyId}: {impact.competencyName}
                      </span>
                      <span style={styles.impactDept}>{impact.departmentLabel}</span>
                      <span style={styles.impactScores}>
                        <span style={{ color: V3_STATUS_COLORS[impact.currentScore] }}>
                          {impact.currentScore}
                        </span>
                        {' → '}
                        <span style={{ color: V3_STATUS_COLORS[impact.projectedScore] }}>
                          {impact.projectedScore}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Service type */}
              {service?.type && (
                <span style={styles.typeBadge}>
                  {service.type === 'strategic' ? 'Strategic Project' : 'Managed Service'}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  phase: {
    marginBottom: '0.5rem',
  },
  phaseHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderLeft: '4px solid',
    background: 'var(--bg-secondary, #F7FAFC)',
    borderRadius: '0 var(--radius-md, 8px) var(--radius-md, 8px) 0',
    marginBottom: '0.75rem',
  },
  phaseNumber: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    color: 'white',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.875rem',
    flexShrink: 0,
  },
  phaseName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 600,
  },
  phaseDesc: {
    margin: 0,
    fontSize: '0.8rem',
    color: '#718096',
  },
  projectCount: {
    marginLeft: 'auto',
    fontSize: '0.8rem',
    color: '#718096',
    whiteSpace: 'nowrap',
  },
  projectGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingLeft: '1.5rem',
  },
  card: {
    border: '1px solid var(--border-color, #E2E8F0)',
    borderRadius: 'var(--radius-md, 8px)',
    background: 'white',
    cursor: 'pointer',
    transition: 'box-shadow 0.15s ease',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 1rem',
  },
  cardInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  cardIcon: {
    fontSize: '1.25rem',
  },
  cardName: {
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  cardMeta: {
    fontSize: '0.75rem',
    color: '#718096',
  },
  priorityBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm, 4px)',
    background: '#F3F0FF',
    color: '#6C5CE7',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  cardBody: {
    padding: '0 1rem 1rem',
    borderTop: '1px solid #EDF2F7',
  },
  cardDesc: {
    fontSize: '0.8rem',
    color: '#4A5568',
    margin: '0.75rem 0',
    lineHeight: 1.5,
  },
  impactSection: {
    marginTop: '0.5rem',
  },
  impactTitle: {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    color: '#718096',
    marginBottom: '0.25rem',
  },
  impactRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.2rem 0',
    fontSize: '0.8rem',
  },
  impactComp: {
    flex: 1,
    color: '#2D3748',
  },
  impactDept: {
    fontSize: '0.7rem',
    color: '#A0AEC0',
    minWidth: '4rem',
  },
  impactScores: {
    fontWeight: 600,
    fontFamily: 'monospace',
  },
  typeBadge: {
    display: 'inline-block',
    fontSize: '0.7rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '1rem',
    background: '#EBF8FF',
    color: '#3182CE',
    marginTop: '0.5rem',
  },
  summary: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    padding: '1.5rem',
    background: 'var(--bg-secondary, #F7FAFC)',
    borderRadius: 'var(--radius-lg, 12px)',
  },
  summaryItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  summaryLabel: {
    fontSize: '0.75rem',
    color: '#718096',
  },
  toggleBtn: {
    alignSelf: 'center',
    background: 'none',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md, 8px)',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#4A5568',
  },
};
