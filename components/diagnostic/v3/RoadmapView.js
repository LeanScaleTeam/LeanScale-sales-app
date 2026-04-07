/**
 * RoadmapView — Engagement roadmap: Foundation → Build → Optimize → Scale
 *
 * Designed to communicate the customer journey visually — not just a list of work,
 * but a narrative of transformation from current state to a scaled revenue machine.
 *
 * Edit mode: reorder within phase, move between phases, remove, restore, add custom.
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { V3_STATUS_COLORS } from '../../../lib/diagnostic-engine/v3/constants-v3';

const PHASE_CONFIG = {
  FOUNDATION: {
    color: '#f87171',
    bg: 'rgba(248,113,113,0.07)',
    border: 'rgba(248,113,113,0.22)',
    label: 'Phase 1',
    tagline: 'Fix the foundation before building on top',
  },
  BUILD: {
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.07)',
    border: 'rgba(251,191,36,0.22)',
    label: 'Phase 2',
    tagline: 'Build the processes that drive repeatable revenue',
  },
  OPTIMIZE: {
    color: '#4ade80',
    bg: 'rgba(74,222,128,0.07)',
    border: 'rgba(74,222,128,0.22)',
    label: 'Phase 3',
    tagline: 'Measure every lever — then improve it',
  },
  SCALE: {
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.07)',
    border: 'rgba(96,165,250,0.22)',
    label: 'Phase 4',
    tagline: 'Systematize what works and expand with confidence',
  },
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
  const [expandedProject, setExpandedProject] = useState(null);
  const [addingToPhase, setAddingToPhase] = useState(null);
  const [newProject, setNewProject] = useState({ name: '', description: '', hours: '' });
  const [showRemoved, setShowRemoved] = useState(false);

  const maxPriority = useMemo(() => {
    if (!roadmap?.phases) return 1;
    const all = roadmap.phases.flatMap((p) => p.projects.map((proj) => proj.priority?.score || 0));
    return Math.max(...all, 1);
  }, [roadmap]);

  const totalHours = useMemo(() => {
    if (!roadmap?.phases) return 0;
    return roadmap.phases.flatMap((p) => p.projects).reduce((s, p) => s + (p.hours || 0), 0);
  }, [roadmap]);

  if (!roadmap?.phases) {
    return onToggleHealthy ? (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>
          No projects flagged based on current scores.
        </div>
        <button
          onClick={onToggleHealthy}
          style={{
            alignSelf: 'center', background: 'none',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
            padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          Show all items
        </button>
      </div>
    ) : null;
  }

  const emit = (action) => onRoadmapChange?.(action);

  const handleAddCustom = (phaseKey) => {
    if (!newProject.name.trim()) return;
    emit({
      type: 'addCustom',
      phase: phaseKey,
      project: {
        id: `custom-${Date.now()}`,
        name: newProject.name.trim(),
        description: newProject.description.trim(),
        hours: newProject.hours ? Number(newProject.hours) : null,
      },
    });
    setNewProject({ name: '', description: '', hours: '' });
    setAddingToPhase(null);
  };

  const coverage = roadmap.summary?.estimatedCoverage?.coveragePercent;
  const activePhaseCount = roadmap.phases.filter((p) => p.projects.length > 0).length;
  const visiblePhases = roadmap.phases.filter((p) => p.projects.length > 0 || editMode);

  // Hero stats to display
  const heroStats = [
    { label: 'Total Projects', value: roadmap.totalProjects },
    { label: 'Phases', value: activePhaseCount },
    ...(totalHours > 0 ? [{ label: 'Est. Hours', value: `~${totalHours}h` }] : []),
    ...(coverage != null ? [{ label: 'Gap Coverage', value: `${coverage}%` }] : []),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* ── Hero stat bar ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${heroStats.length}, 1fr)`,
        gap: '1px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '14px',
        overflow: 'hidden',
        marginBottom: '1.75rem',
      }}>
        {heroStats.map((stat, i) => (
          <div key={i} style={{
            padding: '1.25rem 1rem',
            background: 'rgba(255,255,255,0.015)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.62rem', color: 'rgba(255,255,255,0.38)',
              marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.07em',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* ── Phase mini-map ── */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.75rem' }}>
        {PHASE_KEYS.map((key, i) => {
          const cfg = PHASE_CONFIG[key];
          const phase = roadmap.phases.find((p) => p.key === key);
          const count = phase?.projectCount || 0;
          const active = count > 0;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{
                flex: 1,
                padding: '0.6rem 0.6rem',
                borderRadius: '10px',
                border: `1px solid ${active ? cfg.border : 'rgba(255,255,255,0.05)'}`,
                background: active ? cfg.bg : 'rgba(255,255,255,0.01)',
                textAlign: 'center',
                opacity: active ? 1 : 0.3,
                transition: 'all 0.2s',
              }}>
                <div style={{
                  fontSize: '0.56rem', fontWeight: 700,
                  color: active ? cfg.color : 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                  {cfg.label}
                </div>
                <div style={{
                  fontSize: '0.78rem', fontWeight: 700,
                  color: active ? '#fff' : 'rgba(255,255,255,0.2)',
                  margin: '0.15rem 0 0.1rem',
                }}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>
                  {active ? `${count} project${count !== 1 ? 's' : ''}` : '—'}
                </div>
              </div>
              {i < PHASE_KEYS.length - 1 && (
                <div style={{
                  color: 'rgba(255,255,255,0.15)', fontSize: '0.7rem',
                  padding: '0 0.3rem', flexShrink: 0, userSelect: 'none',
                }}>›</div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Phase sections ── */}
      {visiblePhases.map((phase, phaseIdx) => {
        const cfg = PHASE_CONFIG[phase.key] || PHASE_CONFIG.BUILD;
        const isLast = phaseIdx === visiblePhases.length - 1;

        return (
          <div key={phase.key}>
            <div style={{
              border: `1px solid ${cfg.border}`,
              borderRadius: '16px',
              overflow: 'hidden',
            }}>
              {/* Phase header */}
              <div style={{
                background: cfg.bg,
                borderBottom: `1px solid ${cfg.border}`,
                padding: '1.1rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.1rem',
              }}>
                {/* Phase number circle */}
                <div style={{
                  width: '2.6rem', height: '2.6rem', borderRadius: '50%',
                  border: `2px solid ${cfg.color}`,
                  color: cfg.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.05rem', fontWeight: 800,
                  flexShrink: 0, background: 'rgba(0,0,0,0.2)',
                }}>
                  {phase.order}
                </div>

                {/* Phase name + tagline */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.58rem', fontWeight: 700, color: cfg.color,
                    textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15rem',
                  }}>
                    {cfg.label}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
                    {phase.name}
                  </h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)', lineHeight: 1.4 }}>
                    {cfg.tagline}
                  </p>
                </div>

                {/* Project count */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: cfg.color, lineHeight: 1 }}>
                    {phase.projectCount}
                  </div>
                  <div style={{
                    fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    project{phase.projectCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {/* Project cards */}
              <div style={{ padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {phase.projects.map((project, idx) => (
                  <ProjectCard
                    key={project.serviceId}
                    project={project}
                    phaseKey={phase.key}
                    phaseColor={cfg.color}
                    index={idx}
                    totalInPhase={phase.projects.length}
                    maxPriority={maxPriority}
                    isExpanded={expandedProject === project.serviceId}
                    onToggle={() =>
                      setExpandedProject(expandedProject === project.serviceId ? null : project.serviceId)
                    }
                    editMode={editMode}
                    onMovePhase={(sid, np) => emit({ type: 'movePhase', serviceId: sid, newPhase: np })}
                    onReorder={(pk, sid, dir) => emit({ type: 'reorder', phase: pk, serviceId: sid, direction: dir })}
                    onRemove={(sid) => emit({ type: 'remove', serviceId: sid })}
                    onRemoveCustom={(pid) => emit({ type: 'removeCustom', projectId: pid })}
                  />
                ))}

                {/* Add project (edit mode) */}
                {editMode && (
                  addingToPhase === phase.key ? (
                    <div style={{
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                      padding: '0.75rem', background: 'rgba(255,255,255,0.03)',
                      display: 'flex', flexDirection: 'column', gap: '0.5rem',
                    }}>
                      <input
                        type="text" placeholder="Project name" value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        style={inputStyle} autoFocus
                      />
                      <input
                        type="text" placeholder="Description (optional)" value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        style={inputStyle}
                      />
                      <input
                        type="number" placeholder="Est. hours (optional)" value={newProject.hours}
                        onChange={(e) => setNewProject({ ...newProject, hours: e.target.value })}
                        style={{ ...inputStyle, width: '160px' }}
                      />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleAddCustom(phase.key)}
                          disabled={!newProject.name.trim()}
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '6px', border: 'none', background: '#7c3aed', color: 'white', cursor: 'pointer' }}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => { setAddingToPhase(null); setNewProject({ name: '', description: '', hours: '' }); }}
                          style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingToPhase(phase.key)}
                      style={{
                        background: 'none', border: '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: '10px', padding: '0.5rem', cursor: 'pointer',
                        fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center',
                      }}
                    >
                      + Add Project
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Phase connector */}
            {!isLast && (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '0.3rem 0', gap: '2px',
              }}>
                <div style={{ width: '1px', height: '8px', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.55rem', userSelect: 'none' }}>▼</div>
                <div style={{ width: '1px', height: '8px', background: 'rgba(255,255,255,0.08)' }} />
              </div>
            )}
          </div>
        );
      })}

      {/* ── Removed projects ── */}
      {editMode && removedProjects.length > 0 && (
        <div style={{
          marginTop: '1rem', padding: '0.75rem',
          background: 'rgba(239,68,68,0.06)', borderRadius: '10px',
          border: '1px solid rgba(239,68,68,0.2)',
        }}>
          <button
            onClick={() => setShowRemoved(!showRemoved)}
            style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: '#fca5a5', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            {showRemoved ? 'Hide' : 'Show'} removed projects ({removedProjects.length})
          </button>
          {showRemoved && (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {removedProjects.map((p) => (
                <div key={p.serviceId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.35rem 0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '6px', fontSize: '0.8rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>
                    {p.service?.name || p.serviceId}
                  </span>
                  <button
                    onClick={() => emit({ type: 'restore', serviceId: p.serviceId })}
                    style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(134,239,172,0.3)', background: 'rgba(134,239,172,0.1)', color: '#86efac', cursor: 'pointer' }}
                  >
                    Restore
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Toggle healthy items */}
      {onToggleHealthy && (
        <button
          onClick={onToggleHealthy}
          style={{
            alignSelf: 'center', marginTop: '1.5rem', background: 'none',
            border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
            padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          {showHealthy ? 'Hide healthy items' : 'Show all items'}
        </button>
      )}
    </div>
  );
}

// ── Score dot visualization ──────────────────────────────────────

function ScoreDots({ score, color }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <div
          key={n}
          style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: n <= score ? color : 'rgba(255,255,255,0.1)',
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

// ── Project card ─────────────────────────────────────────────────

function ProjectCard({
  project, phaseKey, phaseColor, index, totalInPhase, maxPriority,
  isExpanded, onToggle, editMode, onMovePhase, onReorder, onRemove, onRemoveCustom,
}) {
  const [hovered, setHovered] = useState(false);
  const service = project.service;
  const isCustom = project.isCustom;
  const priorityPct = maxPriority > 0 ? Math.min((project.priority?.score || 0) / maxPriority, 1) : 0;
  const description = service?.description || (isCustom ? project.description : null);

  return (
    <div
      style={{
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: `3px solid ${phaseColor}`,
        background: hovered && !editMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        overflow: 'hidden',
        transition: 'background 0.15s ease',
        cursor: editMode ? 'default' : 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={editMode ? undefined : onToggle}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.85rem 1rem' }}>

        {/* Edit: reorder buttons */}
        {editMode && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onReorder(phaseKey, project.serviceId, 'up'); }}
              disabled={index === 0}
              style={{
                background: 'none', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '3px',
                cursor: index === 0 ? 'not-allowed' : 'pointer', fontSize: '0.5rem',
                padding: '2px 4px', color: index === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.45)',
                lineHeight: 1,
              }}
            >▲</button>
            <button
              onClick={(e) => { e.stopPropagation(); onReorder(phaseKey, project.serviceId, 'down'); }}
              disabled={index === totalInPhase - 1}
              style={{
                background: 'none', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '3px',
                cursor: index === totalInPhase - 1 ? 'not-allowed' : 'pointer', fontSize: '0.5rem',
                padding: '2px 4px', color: index === totalInPhase - 1 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.45)',
                lineHeight: 1,
              }}
            >▼</button>
          </div>
        )}

        {/* Icon */}
        <span style={{ fontSize: '1.35rem', lineHeight: 1, flexShrink: 0 }}>
          {service?.icon || '📋'}
        </span>

        {/* Name + description + priority bar */}
        <div
          style={{ flex: 1, minWidth: 0, cursor: editMode ? 'pointer' : undefined }}
          onClick={editMode ? onToggle : undefined}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#fff' }}>
              {service?.name || project.serviceId}
            </span>
            {isCustom && (
              <span style={{
                fontSize: '0.56rem', padding: '0.1rem 0.4rem', borderRadius: '3px',
                background: 'rgba(167,139,250,0.15)', color: '#a78bfa',
                fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                Custom
              </span>
            )}
          </div>

          {description && (
            <div style={{
              fontSize: '0.7rem', color: 'rgba(255,255,255,0.42)', marginTop: '0.15rem',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {description}
            </div>
          )}

          {/* Priority bar + competency count */}
          {!isCustom && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.35rem' }}>
              <div style={{
                width: '72px', height: '3px',
                background: 'rgba(255,255,255,0.08)', borderRadius: '2px', flexShrink: 0,
              }}>
                <div style={{
                  height: '100%',
                  width: `${Math.round(priorityPct * 100)}%`,
                  background: phaseColor,
                  borderRadius: '2px', opacity: 0.75,
                }} />
              </div>
              <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)' }}>
                {project.competencyCount} area{project.competencyCount !== 1 ? 's' : ''} impacted
              </span>
            </div>
          )}
        </div>

        {/* Right side: hours badge + edit controls or chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          {project.hours && (
            <span style={{
              fontSize: '0.65rem', padding: '0.18rem 0.5rem', borderRadius: '20px',
              border: `1px solid ${phaseColor}45`, color: phaseColor,
              fontWeight: 600, whiteSpace: 'nowrap',
            }}>
              {project.hours}h
            </span>
          )}

          {editMode ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <select
                value={phaseKey}
                onChange={(e) => { e.stopPropagation(); onMovePhase(project.serviceId, e.target.value); }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontSize: '0.7rem', padding: '0.2rem 0.4rem', borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                }}
              >
                {PHASE_KEYS.map((pk) => (
                  <option key={pk} value={pk}>
                    {pk.charAt(0) + pk.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isCustom ? onRemoveCustom(project.serviceId) : onRemove(project.serviceId);
                }}
                style={{
                  background: 'none', border: '1px solid rgba(239,68,68,0.28)',
                  borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem',
                  padding: '0.15rem 0.45rem', color: '#fca5a5',
                }}
              >
                ✕
              </button>
            </div>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.58rem', userSelect: 'none' }}>
              {isExpanded ? '▲' : '▼'}
            </span>
          )}
        </div>
      </div>

      {/* ── Expanded impact body ── */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0.75rem 1rem 1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

              {/* Projected impact table */}
              {project.projectedImpact?.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase',
                    letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.6rem',
                  }}>
                    Projected Impact
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {project.projectedImpact.map((impact, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          flex: 1, fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {impact.competencyName}
                        </div>
                        <div style={{
                          fontSize: '0.6rem', color: 'rgba(255,255,255,0.28)',
                          flexShrink: 0, minWidth: '3.5rem', textAlign: 'right',
                        }}>
                          {impact.departmentLabel}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                          <ScoreDots
                            score={impact.currentScore}
                            color={V3_STATUS_COLORS[impact.currentScore] || '#f87171'}
                          />
                          <span style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.6rem' }}>→</span>
                          <ScoreDots
                            score={impact.projectedScore}
                            color={V3_STATUS_COLORS[impact.projectedScore] || '#4ade80'}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Service type badge */}
              {service?.type && (
                <div style={{ marginTop: project.projectedImpact?.length > 0 ? '0.75rem' : 0 }}>
                  <span style={{
                    fontSize: '0.62rem', padding: '0.15rem 0.5rem', borderRadius: '12px',
                    background: 'rgba(96,165,250,0.1)', color: '#60a5fa',
                  }}>
                    {service.type === 'strategic'
                      ? 'Strategic Project'
                      : service.type === 'custom'
                        ? 'Custom Project'
                        : 'Managed Service'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Shared input style ───────────────────────────────────────────

const inputStyle = {
  fontSize: '0.8rem',
  padding: '0.4rem 0.6rem',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.1)',
  outline: 'none',
  background: 'rgba(255,255,255,0.05)',
  color: 'rgba(255,255,255,0.9)',
};
