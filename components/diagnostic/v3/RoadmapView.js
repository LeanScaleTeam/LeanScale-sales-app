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
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomer } from '../../../context/CustomerContext';
import { ROADMAP_PHASES, V3_STATUS_COLORS } from '../../../lib/diagnostic-engine/v3/constants-v3';
import { lookupServiceV3 } from '../../../lib/diagnostic-engine/v3/service-mapping-v3';

const PHASE_COLORS = {
  FOUNDATION: { bg: '#FFF5F5', border: '#FEB2B2', icon: '#E53E3E' },
  BUILD: { bg: '#FFFFF0', border: '#FEFCBF', icon: '#D69E2E' },
  OPTIMIZE: { bg: '#F0FFF4', border: '#C6F6D5', icon: '#38A169' },
  SCALE: { bg: '#EBF8FF', border: '#BEE3F8', icon: '#3182CE' },
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
            {isCustom ? (
              <span style={styles.cardName}>{service?.name || project.serviceId}</span>
            ) : (
              <Link
                href={customerPath(`/playbooks/${project.serviceId}`)}
                style={styles.cardName}
                onClick={(e) => e.stopPropagation()}
              >
                {service?.name || project.serviceId}
              </Link>
            )}
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
    flex: 1,
  },
  cardIcon: {
    fontSize: '1.25rem',
  },
  cardName: {
    fontWeight: 600,
    fontSize: '0.9rem',
    color: '#6C5CE7',
    textDecoration: 'none',
    display: 'block',
  },
  cardMeta: {
    fontSize: '0.75rem',
    color: '#718096',
  },
  customBadge: {
    fontSize: '0.65rem',
    padding: '0.1rem 0.4rem',
    borderRadius: '0.25rem',
    background: '#E9D8FD',
    color: '#6B46C1',
    fontWeight: 600,
  },
  priorityBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: 'var(--radius-sm, 4px)',
    background: '#F3F0FF',
    color: '#6C5CE7',
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
    border: '1px solid #E2E8F0',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '0.6rem',
    padding: '1px 4px',
    color: '#718096',
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
    border: '1px solid #E2E8F0',
    background: 'white',
    cursor: 'pointer',
  },
  removeBtn: {
    background: 'none',
    border: '1px solid #FEB2B2',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.75rem',
    padding: '0.15rem 0.4rem',
    color: '#E53E3E',
  },
  addProjectBtn: {
    background: 'none',
    border: '1px dashed #CBD5E0',
    borderRadius: 'var(--radius-md, 8px)',
    padding: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#718096',
    textAlign: 'center',
  },
  addForm: {
    border: '1px solid #E2E8F0',
    borderRadius: 'var(--radius-md, 8px)',
    padding: '0.75rem',
    background: '#F7FAFC',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  addInput: {
    fontSize: '0.8rem',
    padding: '0.4rem 0.6rem',
    borderRadius: '4px',
    border: '1px solid #E2E8F0',
    outline: 'none',
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
    background: '#6C5CE7',
    color: 'white',
    cursor: 'pointer',
  },
  addCancelBtn: {
    fontSize: '0.8rem',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    border: '1px solid #E2E8F0',
    background: 'white',
    color: '#4A5568',
    cursor: 'pointer',
  },
  // Removed section
  removedSection: {
    padding: '0.75rem',
    background: '#FFF5F5',
    borderRadius: 'var(--radius-md, 8px)',
    border: '1px solid #FEB2B2',
  },
  removedToggle: {
    background: 'none',
    border: 'none',
    fontSize: '0.8rem',
    color: '#E53E3E',
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
    background: 'white',
    borderRadius: '4px',
    fontSize: '0.8rem',
  },
  removedName: {
    color: '#718096',
    textDecoration: 'line-through',
  },
  restoreBtn: {
    fontSize: '0.7rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    border: '1px solid #C6F6D5',
    background: '#F0FFF4',
    color: '#38A169',
    cursor: 'pointer',
  },
  // Existing styles
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
