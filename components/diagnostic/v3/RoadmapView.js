/**
 * RoadmapView — 4-phase prioritized project timeline
 *
 * Displays Foundation → Build → Optimize → Scale phases
 * with project cards sorted by priority within each phase.
 *
 * Edit mode supports: move between phases, reorder within phase,
 * remove projects, and add custom projects.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomer } from '../../../context/CustomerContext';
import { ROADMAP_PHASES, V3_STATUS_COLORS } from '../../../lib/diagnostic-engine/v3/constants-v3';
import { lookupServiceV3 } from '../../../lib/diagnostic-engine/v3/service-mapping-v3';

const PHASE_COLORS = {
  FOUNDATION: { bg: 'rgba(248, 113, 113, 0.08)', border: 'rgba(248, 113, 113, 0.2)', icon: '#f87171' },
  BUILD: { bg: 'rgba(251, 191, 36, 0.08)', border: 'rgba(251, 191, 36, 0.2)', icon: '#fbbf24' },
  OPTIMIZE: { bg: 'rgba(74, 222, 128, 0.08)', border: 'rgba(74, 222, 128, 0.2)', icon: '#4ade80' },
  SCALE: { bg: 'rgba(96, 165, 250, 0.08)', border: 'rgba(96, 165, 250, 0.2)', icon: '#60a5fa' },
};

const PHASE_KEYS = ['FOUNDATION', 'BUILD', 'OPTIMIZE', 'SCALE'];

export default function RoadmapView({
  roadmap,
  showHealthy = false,
  onToggleHealthy,
  editMode = false,
  onRoadmapChange,
  removedProjects = [],
}) {
  const { customerPath } = useCustomer();
  const [expandedProject, setExpandedProject] = useState(null);
  const [addingToPhase, setAddingToPhase] = useState(null);
  const [newProject, setNewProject] = useState({ name: '', description: '', hours: '' });
  const [showRemoved, setShowRemoved] = useState(false);

  if (!roadmap?.phases) return null;

  const handleMovePhase = (serviceId, newPhase) => {
    if (onRoadmapChange) {
      onRoadmapChange({ type: 'movePhase', serviceId, newPhase });
    }
  };

  const handleReorder = (phaseKey, serviceId, direction) => {
    if (onRoadmapChange) {
      onRoadmapChange({ type: 'reorder', phase: phaseKey, serviceId, direction });
    }
  };

  const handleRemove = (serviceId) => {
    if (onRoadmapChange) {
      onRoadmapChange({ type: 'remove', serviceId });
    }
  };

  const handleRestore = (serviceId) => {
    if (onRoadmapChange) {
      onRoadmapChange({ type: 'restore', serviceId });
    }
  };

  const handleAddCustom = (phaseKey) => {
    if (!newProject.name.trim()) return;
    if (onRoadmapChange) {
      onRoadmapChange({
        type: 'addCustom',
        phase: phaseKey,
        project: {
          id: `custom-${Date.now()}`,
          name: newProject.name.trim(),
          description: newProject.description.trim(),
          hours: newProject.hours ? Number(newProject.hours) : null,
        },
      });
    }
    setNewProject({ name: '', description: '', hours: '' });
    setAddingToPhase(null);
  };

  const handleRemoveCustom = (projectId) => {
    if (onRoadmapChange) {
      onRoadmapChange({ type: 'removeCustom', projectId });
    }
  };

  return (
    <div style={styles.container}>
      {/* Phase timeline */}
      {roadmap.phases.map((phase) => {
        if (phase.projects.length === 0 && !showHealthy && !editMode) return null;

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
              {phase.projects.map((project, idx) => (
                <ProjectCard
                  key={project.serviceId}
                  project={project}
                  phaseKey={phase.key}
                  index={idx}
                  totalInPhase={phase.projects.length}
                  isExpanded={expandedProject === project.serviceId}
                  onToggle={() =>
                    setExpandedProject(
                      expandedProject === project.serviceId ? null : project.serviceId
                    )
                  }
                  customerPath={customerPath}
                  editMode={editMode}
                  onMovePhase={handleMovePhase}
                  onReorder={handleReorder}
                  onRemove={handleRemove}
                  onRemoveCustom={handleRemoveCustom}
                />
              ))}

              {/* Add project button */}
              {editMode && (
                <>
                  {addingToPhase === phase.key ? (
                    <div style={styles.addForm}>
                      <input
                        type="text"
                        placeholder="Project name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        style={styles.addInput}
                        autoFocus
                      />
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        style={styles.addInput}
                      />
                      <input
                        type="number"
                        placeholder="Est. hours (optional)"
                        value={newProject.hours}
                        onChange={(e) => setNewProject({ ...newProject, hours: e.target.value })}
                        style={{ ...styles.addInput, width: '140px' }}
                      />
                      <div style={styles.addActions}>
                        <button
                          onClick={() => handleAddCustom(phase.key)}
                          style={styles.addConfirmBtn}
                          disabled={!newProject.name.trim()}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => { setAddingToPhase(null); setNewProject({ name: '', description: '', hours: '' }); }}
                          style={styles.addCancelBtn}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingToPhase(phase.key)}
                      style={styles.addProjectBtn}
                    >
                      + Add Project
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Removed projects section */}
      {editMode && removedProjects.length > 0 && (
        <div style={styles.removedSection}>
          <button
            onClick={() => setShowRemoved(!showRemoved)}
            style={styles.removedToggle}
          >
            {showRemoved ? 'Hide' : 'Show'} removed projects ({removedProjects.length})
          </button>
          {showRemoved && (
            <div style={styles.removedList}>
              {removedProjects.map((p) => (
                <div key={p.serviceId} style={styles.removedItem}>
                  <span style={styles.removedName}>
                    {p.service?.name || p.serviceId}
                  </span>
                  <button
                    onClick={() => handleRestore(p.serviceId)}
                    style={styles.restoreBtn}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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

function ProjectCard({
  project,
  phaseKey,
  index,
  totalInPhase,
  isExpanded,
  onToggle,
  customerPath,
  editMode,
  onMovePhase,
  onReorder,
  onRemove,
  onRemoveCustom,
}) {
  const service = project.service;
  const isCustom = project.isCustom;

  return (
    <div style={styles.card} onClick={editMode ? undefined : onToggle}>
      <div style={styles.cardHeader}>
        {/* Reorder buttons (edit mode) */}
        {editMode && (
          <div style={styles.reorderBtns}>
            <button
              onClick={(e) => { e.stopPropagation(); onReorder(phaseKey, project.serviceId, 'up'); }}
              disabled={index === 0}
              style={{ ...styles.reorderBtn, opacity: index === 0 ? 0.3 : 1 }}
              title="Move up"
            >
              &#9650;
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onReorder(phaseKey, project.serviceId, 'down'); }}
              disabled={index === totalInPhase - 1}
              style={{ ...styles.reorderBtn, opacity: index === totalInPhase - 1 ? 0.3 : 1 }}
              title="Move down"
            >
              &#9660;
            </button>
          </div>
        )}

        <div style={styles.cardInfo} onClick={editMode ? onToggle : undefined}>
          <span style={styles.cardIcon}>{service?.icon || ''}</span>
          <div>
            <span style={styles.cardName}>{service?.name || project.serviceId}</span>
            <div style={styles.cardMeta}>
              {isCustom ? (
                <span style={styles.customBadge}>Custom</span>
              ) : (
                `${project.competencyCount} competenc${project.competencyCount !== 1 ? 'ies' : 'y'} impacted`
              )}
              {project.hours && ` · ${project.hours}h`}
            </div>
          </div>
        </div>

        {/* Phase selector (edit mode) or priority badge */}
        {editMode ? (
          <div style={styles.editControls}>
            <select
              value={phaseKey}
              onChange={(e) => { e.stopPropagation(); onMovePhase(project.serviceId, e.target.value); }}
              onClick={(e) => e.stopPropagation()}
              style={styles.phaseSelect}
            >
              {PHASE_KEYS.map((pk) => (
                <option key={pk} value={pk}>{pk.charAt(0) + pk.slice(1).toLowerCase()}</option>
              ))}
            </select>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isCustom) onRemoveCustom(project.serviceId);
                else onRemove(project.serviceId);
              }}
              style={styles.removeBtn}
              title="Remove project"
            >
              &#10005;
            </button>
          </div>
        ) : (
          <div style={styles.priorityBadge}>
            {project.priority?.score?.toFixed(1)}
          </div>
        )}
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
                  {service.type === 'strategic' ? 'Strategic Project' : service.type === 'custom' ? 'Custom Project' : 'Managed Service'}
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
    background: 'var(--bg-secondary, rgba(255, 255, 255, 0.04))',
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
    color: 'rgba(255, 255, 255, 0.5)',
  },
  projectCount: {
    marginLeft: 'auto',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    whiteSpace: 'nowrap',
  },
  projectGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    paddingLeft: '1.5rem',
  },
  card: {
    border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
    borderRadius: 'var(--radius-md, 8px)',
    background: 'var(--glass-bg, rgba(255, 255, 255, 0.03))',
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
    flex: 1,
  },
  cardIcon: {
    fontSize: '1.25rem',
  },
  cardName: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#a78bfa',
    textDecoration: 'none',
    display: 'block',
  },
  cardMeta: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  customBadge: {
    fontSize: '0.65rem',
    padding: '0.1rem 0.4rem',
    borderRadius: '0.25rem',
    background: 'rgba(167, 139, 250, 0.15)',
    color: '#a78bfa',
    fontWeight: 600,
  },
  priorityBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm, 4px)',
    background: 'rgba(167, 139, 250, 0.12)',
    color: '#a78bfa',
    fontSize: '0.75rem',
    fontWeight: 600,
  },
  // Edit mode controls
  reorderBtns: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    marginRight: '0.5rem',
  },
  reorderBtn: {
    background: 'none',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '0.6rem',
    padding: '1px 4px',
    color: 'rgba(255, 255, 255, 0.5)',
    lineHeight: 1,
  },
  editControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flexShrink: 0,
  },
  phaseSelect: {
    fontSize: '0.75rem',
    padding: '0.2rem 0.4rem',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(255, 255, 255, 0.04)',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
  },
  removeBtn: {
    background: 'none',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    padding: '0.15rem 0.4rem',
    color: '#fca5a5',
  },
  addProjectBtn: {
    background: 'none',
    border: '1px dashed rgba(255, 255, 255, 0.15)',
    borderRadius: 'var(--radius-md, 8px)',
    padding: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  addForm: {
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: 'var(--radius-md, 8px)',
    padding: '0.75rem',
    background: 'rgba(255, 255, 255, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  addInput: {
    fontSize: '0.8rem',
    padding: '0.4rem 0.6rem',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.04)',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  addActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  addConfirmBtn: {
    fontSize: '0.8rem',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    border: 'none',
    background: '#7c3aed',
    color: 'white',
    cursor: 'pointer',
  },
  addCancelBtn: {
    fontSize: '0.8rem',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    background: 'rgba(255, 255, 255, 0.04)',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
  },
  // Removed section
  removedSection: {
    padding: '0.75rem',
    background: 'rgba(239, 68, 68, 0.06)',
    borderRadius: 'var(--radius-md, 8px)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  removedToggle: {
    background: 'none',
    border: 'none',
    fontSize: '0.8rem',
    color: '#fca5a5',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
  removedList: {
    marginTop: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  removedItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.35rem 0.5rem',
    background: 'rgba(255, 255, 255, 0.04)',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  removedName: {
    color: 'rgba(255, 255, 255, 0.5)',
    textDecoration: 'line-through',
  },
  restoreBtn: {
    fontSize: '0.7rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    border: '1px solid rgba(134, 239, 172, 0.3)',
    background: 'rgba(134, 239, 172, 0.1)',
    color: '#86efac',
    cursor: 'pointer',
  },
  // Existing styles
  cardBody: {
    padding: '0 1rem 1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
  },
  cardDesc: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.7)',
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
    color: 'rgba(255, 255, 255, 0.5)',
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
    color: 'rgba(255, 255, 255, 0.8)',
  },
  impactDept: {
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.4)',
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
    background: 'rgba(96, 165, 250, 0.1)',
    color: '#60a5fa',
    marginTop: '0.5rem',
  },
  summary: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.04)',
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
    color: 'rgba(255, 255, 255, 0.5)',
  },
  toggleBtn: {
    alignSelf: 'center',
    background: 'none',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md, 8px)',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
};
