import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { fadeUpItem, staggerContainer } from '../../lib/animations';
import { ENGAGEMENT_TIERS } from '../../data/engagement-tiers';

const PHASE_COLORS = {
  stabilize: { bg: 'rgba(239, 68, 68, 0.07)', border: 'rgba(239, 68, 68, 0.22)', accent: '#DC2626', text: '#fca5a5', bar: '#DC2626' },
  activate:  { bg: 'rgba(251, 146, 60, 0.07)', border: 'rgba(251, 146, 60, 0.22)', accent: '#EA580C', text: '#fdba74', bar: '#EA580C' },
  optimize:  { bg: 'rgba(96, 165, 250, 0.07)',  border: 'rgba(96, 165, 250, 0.22)',  accent: '#2563EB', text: '#60a5fa', bar: '#2563EB' },
  scale:     { bg: 'rgba(34, 197, 94, 0.07)',   border: 'rgba(34, 197, 94, 0.22)',   accent: '#16A34A', text: '#86efac', bar: '#16A34A' },
};

const PHASE_IDS = ['stabilize', 'activate', 'optimize', 'scale'];

const PRIORITY_OPTIONS = [
  { value: 'critical',    label: 'Critical',    color: '#DC2626', bg: 'rgba(239, 68, 68, 0.12)' },
  { value: 'recommended', label: 'Recommended', color: '#EA580C', bg: 'rgba(251, 146, 60, 0.12)' },
  { value: 'optional',    label: 'Optional',    color: 'rgba(255, 255, 255, 0.4)', bg: 'rgba(255, 255, 255, 0.06)' },
];

const FUNCTION_ORDER = ['Sales', 'Marketing', 'Customer Success', 'Partnerships', 'Cross Functional'];

const MANAGED_SERVICE_ICONS = {
  'crm-admin': '🗄️',
  'enrichment-tools-admin': '🔬',
  'ongoing-reporting': '📊',
};

const FUNCTION_ICONS = {
  'Sales': '💼',
  'Marketing': '📣',
  'Customer Success': '🤝',
  'Partnerships': '🔗',
  'Cross Functional': '⚙️',
};

const SEVERITY_LABELS = { 3: 'Critical', 2: 'Needs Work', 1: 'On Track', 0: 'No Data' };
const SEVERITY_COLORS = { 3: '#fca5a5', 2: '#fdba74', 1: '#86efac', 0: 'rgba(255,255,255,0.3)' };

const PILLAR_LABELS = {
  process: 'Process', systems: 'Systems', planning: 'Planning',
  people: 'People', reporting: 'Reporting', enablement: 'Enablement',
  foundation: 'Foundation', motions: 'Motions', maturity: 'Maturity',
};

const GANTT_CONFIG = {
  growth: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Yr2·H1', 'Yr2·H2'],
    total: 6,
    phases: {
      stabilize: { start: 0, span: 2 },
      activate:  { start: 2, span: 2 },
      optimize:  { start: 4, span: 1 },
      scale:     { start: 5, span: 1 },
    },
  },
  scale: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    total: 4,
    phases: {
      stabilize: { start: 0, span: 1 },
      activate:  { start: 1, span: 1 },
      optimize:  { start: 2, span: 1 },
      scale:     { start: 3, span: 1 },
    },
  },
  enterprise: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    total: 4,
    phases: {
      stabilize: { start: 0, span: 1 },
      activate:  { start: 0, span: 1 },
      optimize:  { start: 1, span: 1 },
      scale:     { start: 2, span: 2 },
    },
  },
};

function groupByFunction(projects) {
  const groups = new Map();
  for (const proj of projects) {
    const fn = proj.primaryFunction || 'Cross Functional';
    if (!groups.has(fn)) groups.set(fn, []);
    groups.get(fn).push(proj);
  }
  const sorted = [...groups.entries()].sort(([a], [b]) => {
    const ai = FUNCTION_ORDER.indexOf(a);
    const bi = FUNCTION_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
  return sorted;
}

// ─── Gantt Timeline ──────────────────────────────────────────────────────────

function GanttTimeline({ tierId, phases }) {
  const config = GANTT_CONFIG[tierId] || GANTT_CONFIG.scale;
  const { labels, total } = config;

  return (
    <div style={{ marginBottom: 'var(--space-3)' }}>
      {/* Column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `90px repeat(${total}, 1fr)`,
        gap: 0,
        marginBottom: '6px',
      }}>
        <div />
        {labels.map(l => (
          <div key={l} style={{
            fontSize: '0.62rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.3)',
            textAlign: 'center',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            {l}
          </div>
        ))}
      </div>

      {/* Phase rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {PHASE_IDS.map((phaseId, phaseNum) => {
          const phase = phases.find(p => p.id === phaseId);
          const colors = PHASE_COLORS[phaseId];
          const gantt = config.phases[phaseId];
          if (!gantt) return null;

          const projectCount = phase?.projects?.length ?? 0;
          const phaseName = phase?.name || (phaseId.charAt(0).toUpperCase() + phaseId.slice(1));

          return (
            <div
              key={phaseId}
              style={{
                display: 'grid',
                gridTemplateColumns: `90px repeat(${total}, 1fr)`,
                gap: 0,
                alignItems: 'center',
                opacity: projectCount === 0 ? 0.25 : 1,
              }}
            >
              {/* Phase label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                paddingRight: '0.6rem',
                justifyContent: 'flex-end',
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: colors.accent,
                  flexShrink: 0,
                  opacity: projectCount > 0 ? 1 : 0.4,
                }} />
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  color: projectCount > 0 ? colors.text : 'rgba(255,255,255,0.25)',
                  whiteSpace: 'nowrap',
                }}>
                  {phaseName}
                </span>
              </div>

              {/* Grid cells */}
              {Array.from({ length: total }).map((_, colIdx) => {
                const isInBar = colIdx >= gantt.start && colIdx < gantt.start + gantt.span;
                const isFirst = colIdx === gantt.start;
                const isLast = colIdx === gantt.start + gantt.span - 1;

                return (
                  <div
                    key={colIdx}
                    style={{
                      height: '28px',
                      background: isInBar
                        ? `linear-gradient(90deg, ${colors.bar}, ${colors.bar}cc)`
                        : 'rgba(255,255,255,0.03)',
                      borderRadius: isFirst && isLast
                        ? '5px'
                        : isFirst
                        ? '5px 0 0 5px'
                        : isLast
                        ? '0 5px 5px 0'
                        : 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isFirst ? 'flex-start' : 'center',
                      paddingLeft: isFirst ? '8px' : 0,
                      overflow: 'hidden',
                      borderRight: !isInBar && colIdx < total - 1
                        ? '1px solid rgba(255,255,255,0.03)'
                        : 'none',
                    }}
                  >
                    {isFirst && projectCount > 0 && (
                      <span style={{
                        fontSize: '0.6rem',
                        fontWeight: 700,
                        color: 'rgba(255,255,255,0.9)',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.02em',
                      }}>
                        {projectCount} project{projectCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tier Switcher ────────────────────────────────────────────────────────────

function TierSwitcher({ activeTier, onSelectTier }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      marginBottom: 'var(--space-3)',
    }}>
      <span style={{
        fontSize: '0.6rem',
        color: 'rgba(255,255,255,0.28)',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        whiteSpace: 'nowrap',
      }}>
        Pace
      </span>
      <div style={{ display: 'flex', gap: '3px' }}>
        {ENGAGEMENT_TIERS.map(tier => {
          const isActive = activeTier === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => onSelectTier(tier.id)}
              style={{
                padding: '0.25rem 0.7rem',
                fontSize: '0.75rem',
                fontWeight: isActive ? 700 : 400,
                borderRadius: '6px',
                border: `1px solid ${isActive ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.07)'}`,
                background: isActive ? 'rgba(124,58,237,0.18)' : 'rgba(255,255,255,0.02)',
                color: isActive ? '#a78bfa' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tier.name}
              <span style={{
                marginLeft: '0.35rem',
                fontSize: '0.58rem',
                opacity: 0.7,
                color: isActive ? '#c4b5fd' : 'rgba(255,255,255,0.22)',
              }}>
                {tier.timeToGreen}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Project Tooltip ──────────────────────────────────────────────────────────

function PhaseReason({ project, currentPhaseId }) {
  const defaultPhase = project.defaultPhase;
  const wasElevated = project.severity >= 3 && currentPhaseId !== defaultPhase;

  if (wasElevated) {
    return (
      <span style={{ color: '#fca5a5', fontStyle: 'italic' }}>
        Elevated to this phase — critical finding
      </span>
    );
  }
  const layerLabel = PILLAR_LABELS[project.layer || project.pillar] || project.layer || '—';
  return <span>{layerLabel} layer → default phase</span>;
}

function ProjectTooltipContent({ project, currentPhaseId }) {
  const scoreDisplay = project.avgScore != null
    ? project.avgScore.toFixed(1) + ' / 5'
    : null;
  const severityLabel = SEVERITY_LABELS[project.severity] ?? '—';
  const severityColor = SEVERITY_COLORS[project.severity] ?? 'rgba(255,255,255,0.4)';

  return (
    <div style={{
      background: '#1a1625',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: '8px',
      padding: '0.6rem 0.75rem',
      maxWidth: '240px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      zIndex: 1000,
    }}>
      {project.diagnosticItemName && (
        <div style={{
          fontSize: '0.65rem',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: '0.35rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          From: {project.diagnosticItemName}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
        <span style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: severityColor,
          background: `${severityColor}18`,
          padding: '0.1rem 0.4rem',
          borderRadius: '3px',
        }}>
          {severityLabel}
        </span>
        {scoreDisplay && (
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
            Score {scoreDisplay}
          </span>
        )}
      </div>
      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>
        <PhaseReason project={project} currentPhaseId={currentPhaseId} />
      </div>
    </div>
  );
}

// ─── Presenter Gantt ─────────────────────────────────────────────────────────

function PresenterGantt({ tierId, phases }) {
  const config = GANTT_CONFIG[tierId] || GANTT_CONFIG.scale;
  const { labels, total } = config;

  return (
    <div style={{ padding: '1.5rem 2.5rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
      {/* Section label */}
      <div style={{
        fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.12em',
        color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: '0.9rem',
      }}>
        Engagement Timeline
      </div>

      {/* Quarter column headers */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${total}, 1fr)`,
        marginBottom: '0.5rem',
        paddingLeft: 0,
      }}>
        {labels.map((l, i) => (
          <div key={l} style={{
            fontSize: '0.62rem', fontWeight: 700, color: 'rgba(255,255,255,0.22)',
            textAlign: 'center', letterSpacing: '0.08em', textTransform: 'uppercase',
            position: 'relative',
          }}>
            {l}
            {/* vertical grid tick */}
            <div style={{
              position: 'absolute', top: '1.4rem', left: '0',
              width: '1px', height: '999px',
              background: 'rgba(255,255,255,0.04)',
              pointerEvents: 'none',
            }} />
          </div>
        ))}
      </div>

      {/* Phase bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
        {PHASE_IDS.map((phaseId) => {
          const phase = phases.find(p => p.id === phaseId);
          const colors = PHASE_COLORS[phaseId];
          const gantt = config.phases[phaseId];
          if (!gantt) return null;

          const strategicProjects = phase?.projects?.filter(p => p.type !== 'managed') || [];
          const count = strategicProjects.length;
          const phaseName = phase?.name || (phaseId.charAt(0).toUpperCase() + phaseId.slice(1));
          const isEmpty = count === 0;

          return (
            <div key={phaseId} style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${total}, 1fr)`,
              height: '64px',
              opacity: isEmpty ? 0.25 : 1,
            }}>
              {Array.from({ length: total }).map((_, colIdx) => {
                const isInBar = colIdx >= gantt.start && colIdx < gantt.start + gantt.span;
                const isFirst = colIdx === gantt.start;
                const isLast = colIdx === gantt.start + gantt.span - 1;

                return (
                  <div key={colIdx} style={{
                    height: '64px',
                    background: isInBar
                      ? `linear-gradient(135deg, ${colors.accent}ee, ${colors.accent}99)`
                      : 'rgba(255,255,255,0.02)',
                    borderRadius: isFirst && isLast ? '8px'
                      : isFirst ? '8px 0 0 8px'
                      : isLast ? '0 8px 8px 0'
                      : 0,
                    display: 'flex', alignItems: 'center',
                    paddingLeft: isFirst ? '14px' : 0,
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    {/* Inside the bar: phase name + count */}
                    {isFirst && !isEmpty && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', zIndex: 1 }}>
                        <span style={{
                          fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.95)',
                          letterSpacing: '-0.01em', lineHeight: 1, textTransform: 'uppercase',
                        }}>
                          {phaseName}
                        </span>
                        <span style={{
                          fontSize: '0.58rem', color: 'rgba(255,255,255,0.65)',
                          fontWeight: 500, letterSpacing: '0.02em',
                        }}>
                          {count} project{count !== 1 ? 's' : ''}
                          {phase?.timing ? ` · ${phase.timing}` : ''}
                        </span>
                      </div>
                    )}
                    {/* Subtle shimmer overlay */}
                    {isInBar && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 60%)',
                        pointerEvents: 'none',
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Power 10 progress strip */}
      {phases.some(p => p.power10Progress) && (
        <div style={{
          display: 'grid', gridTemplateColumns: `repeat(${total}, 1fr)`,
          marginTop: '8px',
        }}>
          {PHASE_IDS.map((phaseId) => {
            const phase = phases.find(p => p.id === phaseId);
            const gantt = config.phases[phaseId];
            if (!gantt || !phase?.power10Progress) return null;
            const colors = PHASE_COLORS[phaseId];
            return (
              <div key={phaseId} style={{
                gridColumn: `${gantt.start + 1} / span ${gantt.span}`,
                display: 'flex', alignItems: 'center', gap: '0.35rem',
                paddingLeft: '14px', paddingTop: '6px',
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.accent }} />
                <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
                  {phase.power10Progress.label} reportable
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Roadmap Presenter ────────────────────────────────────────────────────────

function RoadmapPresenter({ phases, tierId, onClose }) {
  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const totalProjects = phases.reduce((sum, p) => sum + (p.projects?.filter(x => x.type !== 'managed').length || 0), 0);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#07070f',
      zIndex: 9999, display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.9rem 2.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)',
            letterSpacing: '-0.01em',
          }}>
            LeanScale Engagement Roadmap
          </span>
          <span style={{
            fontSize: '0.58rem', color: 'rgba(255,255,255,0.22)',
            padding: '0.15rem 0.5rem', borderRadius: '4px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {totalProjects} strategic projects across {phases.length} phases
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '0.3rem 0.75rem', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'transparent', color: 'rgba(255,255,255,0.35)',
            fontSize: '0.65rem', cursor: 'pointer', letterSpacing: '0.03em',
          }}
        >
          ESC · Close
        </button>
      </div>

      {/* Gantt timeline (fixed) */}
      <PresenterGantt tierId={tierId || 'scale'} phases={phases} />

      {/* Scrollable project detail */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {phases.map((phase, phaseIdx) => {
            const colors = PHASE_COLORS[phase.id] || PHASE_COLORS.activate;
            const strategicProjects = phase.projects?.filter(p => p.type !== 'managed') || [];
            if (strategicProjects.length === 0) return null;
            const functionGroups = groupByFunction(strategicProjects);
            const phaseNum = PHASE_IDS.indexOf(phase.id) + 1;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: phaseIdx * 0.06, duration: 0.28 }}
              >
                {/* Phase section header */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  marginBottom: '1.25rem', paddingBottom: '0.75rem',
                  borderBottom: `1px solid ${colors.accent}30`,
                }}>
                  <div style={{
                    width: '4px', height: '36px',
                    background: `linear-gradient(180deg, ${colors.accent}, ${colors.accent}55)`,
                    borderRadius: '2px', flexShrink: 0,
                  }} />
                  <div>
                    <div style={{
                      fontSize: '0.58rem', fontWeight: 700, color: colors.accent,
                      textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem',
                    }}>
                      Phase {phaseNum} · {phase.timing}
                    </div>
                    <h2 style={{
                      fontSize: '1.4rem', fontWeight: 900, color: colors.text,
                      margin: 0, letterSpacing: '-0.03em', lineHeight: 1,
                    }}>
                      {phase.name}
                    </h2>
                  </div>
                  {phase.tagline && (
                    <p style={{
                      fontSize: '0.82rem', color: 'rgba(255,255,255,0.35)',
                      margin: 0, lineHeight: 1.55, flex: 1, maxWidth: '500px',
                    }}>
                      {phase.tagline}
                    </p>
                  )}
                  {phase.power10Progress && (
                    <div style={{
                      marginLeft: 'auto', flexShrink: 0, textAlign: 'center',
                      padding: '0.5rem 1rem',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '10px', background: `${colors.accent}0d`,
                    }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: colors.text, lineHeight: 1 }}>
                        {phase.power10Progress.label}
                      </div>
                      <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.28)', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Power 10
                      </div>
                    </div>
                  )}
                </div>

                {/* Function groups */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {functionGroups.map(([functionName, projects]) => (
                    <div key={functionName}>
                      {/* Function label */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.45rem',
                        marginBottom: '0.65rem',
                      }}>
                        <span style={{ fontSize: '0.9rem' }}>{FUNCTION_ICONS[functionName] || '📋'}</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          {functionName}
                        </span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                        <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>
                          {projects.length} project{projects.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Project cards grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                        gap: '0.7rem',
                      }}>
                        {projects.map((project, pIdx) => {
                          const outcomeText = project.outcomeStatement || project.outcome || '';
                          const severityColor = SEVERITY_COLORS[project.severity] ?? 'rgba(255,255,255,0.3)';

                          return (
                            <motion.div
                              key={project.id || project.name}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: phaseIdx * 0.06 + pIdx * 0.02, duration: 0.22 }}
                              style={{
                                padding: '1rem 1.1rem',
                                borderRadius: '10px',
                                background: `${colors.accent}08`,
                                border: `1px solid ${colors.border}`,
                                borderLeft: `3px solid ${colors.accent}80`,
                                display: 'flex', flexDirection: 'column', gap: '0.45rem',
                                position: 'relative', overflow: 'hidden',
                              }}
                            >
                              {/* Decorative background number */}
                              <div style={{
                                position: 'absolute', right: '0.6rem', bottom: '-0.4rem',
                                fontSize: '4rem', fontWeight: 900,
                                color: colors.accent, opacity: 0.05,
                                lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
                                letterSpacing: '-0.05em',
                              }}>
                                {String(pIdx + 1).padStart(2, '0')}
                              </div>

                              {/* Header: icon + name + severity */}
                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                                <span style={{ fontSize: '1.05rem', flexShrink: 0, lineHeight: 1.2 }}>
                                  {project.icon || '📋'}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    fontSize: '0.88rem', fontWeight: 700,
                                    color: 'rgba(255,255,255,0.92)', lineHeight: 1.3,
                                    letterSpacing: '-0.01em',
                                  }}>
                                    {project.name}
                                  </div>
                                </div>
                                {project.severity > 0 && (
                                  <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: severityColor, flexShrink: 0, marginTop: '4px',
                                  }} title={SEVERITY_LABELS[project.severity]} />
                                )}
                              </div>

                              {/* Outcome text — full, not truncated */}
                              {outcomeText && (
                                <p style={{
                                  fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)',
                                  margin: 0, lineHeight: 1.6,
                                }}>
                                  {outcomeText}
                                </p>
                              )}

                              {/* Footer: function tag + playbook badge */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
                                <span style={{
                                  fontSize: '0.58rem', color: colors.text,
                                  background: `${colors.accent}18`,
                                  padding: '0.1rem 0.45rem', borderRadius: '4px',
                                  fontWeight: 600, letterSpacing: '0.03em',
                                }}>
                                  {project.primaryFunction || 'Cross Functional'}
                                </span>
                                {project.hasPlaybook && (
                                  <span style={{
                                    fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)',
                                    background: 'rgba(255,255,255,0.04)',
                                    padding: '0.1rem 0.45rem', borderRadius: '4px',
                                    fontWeight: 500,
                                  }}>
                                    📖 Playbook
                                  </span>
                                )}
                                {project.severity >= 3 && (
                                  <span style={{
                                    fontSize: '0.58rem', color: '#fca5a5',
                                    background: 'rgba(239,68,68,0.1)',
                                    padding: '0.1rem 0.45rem', borderRadius: '4px',
                                    fontWeight: 600,
                                  }}>
                                    Critical finding
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PhaseRoadmap({
  roadmap,
  managedServices,
  editMode,
  onOverride,
  customerPath,
  overrides,
  activeTier,
  onSelectTier,
  showAll,
  onToggleShowAll,
}) {
  const [presentMode, setPresentMode] = useState(false);

  if (!roadmap || !roadmap.phases) return null;

  const tierId = activeTier || roadmap.tierId || 'scale';

  return (
    <Tooltip.Provider delayDuration={300}>
      {presentMode && (
        <RoadmapPresenter
          phases={roadmap.phases}
          tierId={tierId}
          onClose={() => setPresentMode(false)}
        />
      )}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
      >
        {/* Header */}
        <motion.div variants={fadeUpItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: 0 }}>
              Your Engagement Roadmap
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '0.25rem auto 0', maxWidth: '500px' }}>
              Here&apos;s what your embedded LeanScale team focuses on each quarter.
            </p>
          </div>
          <button
            onClick={() => setPresentMode(true)}
            style={{
              padding: '0.4rem 0.9rem', borderRadius: 8,
              border: '1px solid rgba(124,58,237,0.35)',
              background: 'rgba(124,58,237,0.1)', color: '#a78bfa',
              fontSize: '0.72rem', fontWeight: 600,
              cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            Present
          </button>
        </motion.div>

        {/* Tier switcher + Gantt */}
        <motion.div variants={fadeUpItem} className="card" style={{
          padding: 'var(--space-3) var(--space-4)',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          {onSelectTier && (
            <TierSwitcher activeTier={tierId} onSelectTier={onSelectTier} />
          )}
          <GanttTimeline tierId={tierId} phases={roadmap.phases} />
        </motion.div>

        {/* Ongoing Managed Services */}
        {managedServices?.length > 0 && (
          <motion.div variants={fadeUpItem}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.6rem',
            }}>
              <div style={{
                fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.07em',
                color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase',
              }}>
                Ongoing Managed Services
              </div>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{
                fontSize: '0.58rem', color: 'rgba(124,58,237,0.7)',
                fontWeight: 600, letterSpacing: '0.04em',
              }}>
                Always Included
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'var(--space-2)',
            }}>
              {managedServices.map(ms => (
                <ManagedServiceCard
                  key={ms.serviceId || ms.name}
                  service={ms}
                  editMode={editMode}
                  onOverride={onOverride}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Phase Cards */}
        {roadmap.phases.map((phase) => {
          const colors = PHASE_COLORS[phase.id] || PHASE_COLORS.activate;
          const strategicProjects = (phase.projects || []).filter(p => p.type !== 'managed');
          const hasContent = strategicProjects.length > 0;
          const functionGroups = groupByFunction(strategicProjects);
          const phaseNum = PHASE_IDS.indexOf(phase.id) + 1;

          return (
            <motion.div
              key={phase.id}
              variants={fadeUpItem}
              className="card"
              style={{
                padding: 0,
                overflow: 'hidden',
                background: 'transparent',
                border: `1px solid ${colors.border}`,
                borderLeft: `3px solid ${colors.accent}`,
                opacity: hasContent ? 1 : 0.4,
              }}
            >
              {/* Phase Header */}
              <div style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.1rem 1.5rem',
                background: colors.bg,
                borderBottom: `1px solid ${colors.border}`,
                overflow: 'hidden',
              }}>
                {/* Decorative large phase number */}
                <div style={{
                  position: 'absolute',
                  right: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '4.5rem',
                  fontWeight: 900,
                  color: colors.accent,
                  opacity: 0.09,
                  lineHeight: 1,
                  userSelect: 'none',
                  pointerEvents: 'none',
                  letterSpacing: '-0.05em',
                }}>
                  {String(phaseNum).padStart(2, '0')}
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 700,
                      padding: '0.18rem 0.6rem', borderRadius: '5px',
                      background: colors.accent, color: 'white', letterSpacing: '0.04em',
                    }}>
                      {phase.timing}
                    </span>
                    <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.32)', fontWeight: 500 }}>
                      {strategicProjects.length} project{strategicProjects.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '1.1rem', fontWeight: 800, color: colors.text,
                    margin: '0 0 0.25rem', letterSpacing: '-0.02em',
                  }}>
                    {phase.name}
                  </h3>
                  <p style={{
                    fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)',
                    margin: 0, lineHeight: 1.45, maxWidth: '480px',
                  }}>
                    {phase.tagline}
                  </p>
                </div>

                {phase.power10Progress && (
                  <div style={{
                    position: 'relative', zIndex: 1,
                    textAlign: 'center', flexShrink: 0,
                    padding: '0.5rem 0.9rem',
                    border: `1px solid ${colors.border}`,
                    borderRadius: '10px',
                    background: `${colors.accent}12`,
                    marginLeft: '1rem',
                  }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: colors.text, lineHeight: 1 }}>
                      {phase.power10Progress.label}
                    </div>
                    <div style={{
                      fontSize: '0.57rem', color: 'rgba(255,255,255,0.32)',
                      marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      Power 10
                    </div>
                  </div>
                )}
              </div>

              {/* Phase Content */}
              <div style={{ padding: '1rem 1.25rem 1.25rem' }}>
                {hasContent ? (
                  <div>
                    <div style={{
                      fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.07em',
                      color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase',
                      marginBottom: '0.75rem',
                    }}>
                      Strategic Projects
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {functionGroups.map(([functionName, projects]) => (
                        <FunctionGroup
                          key={functionName}
                          functionName={functionName}
                          projects={projects}
                          colors={colors}
                          currentPhaseId={phase.id}
                          editMode={editMode}
                          onOverride={onOverride}
                          customerPath={customerPath}
                          overrides={overrides}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p style={{
                    fontSize: 'var(--text-sm)', color: 'var(--text-muted)',
                    textAlign: 'center', padding: 'var(--space-2)',
                  }}>
                    No additional projects needed in this phase based on your diagnostic results.
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}

        {onToggleShowAll && (
          <button
            onClick={onToggleShowAll}
            style={{
              alignSelf: 'center', background: 'none',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px',
              padding: '0.5rem 1.25rem', cursor: 'pointer', fontSize: '0.78rem',
              color: 'rgba(255,255,255,0.45)', marginTop: '0.5rem',
            }}
          >
            {showAll ? 'Show recommended only' : 'Show all projects'}
          </button>
        )}
      </motion.div>
    </Tooltip.Provider>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em',
      color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-1)',
    }}>
      {children}
    </div>
  );
}

function FunctionGroup({ functionName, projects, colors, currentPhaseId, editMode, onOverride, customerPath, overrides }) {
  return (
    <div>
      {/* Function header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.4rem',
        marginBottom: '0.35rem',
        paddingBottom: '0.3rem',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <span style={{ fontSize: '0.8rem' }}>{FUNCTION_ICONS[functionName] || '📋'}</span>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
          {functionName}
        </span>
        <span style={{
          fontSize: '0.58rem', color: 'rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
          padding: '0.05rem 0.35rem', fontWeight: 600,
        }}>
          {projects.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {projects.map(proj => (
          <ProjectRow
            key={proj.serviceId}
            project={proj}
            colors={colors}
            currentPhaseId={currentPhaseId}
            editMode={editMode}
            onOverride={onOverride}
            customerPath={customerPath}
            priority={overrides?.roadmap?.[proj.serviceId]?.priority ?? proj.suggestedPriority}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectRow({ project, colors, currentPhaseId, editMode, onOverride, customerPath, priority }) {
  const priorityOption = PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[1];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.6rem',
        padding: '0.5rem 0.6rem',
        borderRadius: '6px',
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        transition: 'background 0.12s',
        borderLeft: `2px solid ${hovered ? colors.accent + '60' : 'transparent'}`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: '1rem', flexShrink: 0, marginTop: '0.05rem', lineHeight: 1 }}>
        {project.icon || '📋'}
      </span>

      {/* Name + outcome stacked vertically */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Project name with tooltip */}
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span style={{
                fontSize: '0.825rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.88)',
                cursor: 'help',
                borderBottom: '1px dashed rgba(255,255,255,0.12)',
                lineHeight: 1.35,
              }}>
                {project.name}
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content side="top" align="start" sideOffset={6}>
                <ProjectTooltipContent project={project} currentPhaseId={currentPhaseId} />
                <Tooltip.Arrow style={{ fill: '#1a1625' }} />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>

          {/* Transcript signal badge */}
          {editMode && project.transcriptSignal && (
            <span
              title={project.transcriptSignal.evidence || ''}
              style={{
                fontSize: '0.55rem', padding: '0.1rem 0.35rem', borderRadius: '3px',
                background: 'rgba(167, 139, 250, 0.15)', color: '#7c3aed',
                fontWeight: 600, flexShrink: 0,
                cursor: project.transcriptSignal.evidence ? 'help' : 'default',
                whiteSpace: 'nowrap',
              }}
            >
              Mentioned in call
            </span>
          )}

          {/* Priority indicator (view mode) */}
          {!editMode && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.2rem',
              fontSize: '0.58rem', color: priorityOption.color, fontWeight: 600, flexShrink: 0,
            }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: priorityOption.color }} />
              {priorityOption.label}
            </span>
          )}

          {/* Playbook link */}
          {project.hasPlaybook && customerPath && (
            <a
              href={customerPath(`/playbooks/${project.serviceId}`)}
              onClick={(e) => e.stopPropagation()}
              title="View Playbook"
              style={{ fontSize: '0.75rem', textDecoration: 'none', flexShrink: 0, lineHeight: 1, opacity: 0.5 }}
            >
              📖
            </a>
          )}

          {/* Edit controls */}
          {editMode && (
            <>
              <select
                value={priority || 'recommended'}
                onChange={(e) => onOverride?.('roadmap', project.serviceId, { priority: e.target.value })}
                style={{
                  fontSize: '0.62rem', padding: '0.12rem 0.3rem', borderRadius: '4px',
                  border: `1px solid ${priorityOption.color}`, background: priorityOption.bg,
                  color: priorityOption.color, cursor: 'pointer', fontWeight: 600, flexShrink: 0,
                }}
              >
                {PRIORITY_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={currentPhaseId}
                onChange={(e) => onOverride?.('roadmap', project.serviceId, { phase: e.target.value })}
                style={{
                  fontSize: '0.62rem', padding: '0.12rem 0.3rem', borderRadius: '4px',
                  border: '1px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)',
                  cursor: 'pointer', flexShrink: 0, color: 'rgba(255,255,255,0.7)',
                }}
              >
                {PHASE_IDS.map(pid => (
                  <option key={pid} value={pid}>{pid.charAt(0).toUpperCase() + pid.slice(1)}</option>
                ))}
              </select>
              <button
                onClick={() => onOverride?.('roadmap', project.serviceId, { excluded: true })}
                title="Exclude from roadmap"
                style={{
                  fontSize: '0.8rem', background: 'none', border: 'none',
                  cursor: 'pointer', padding: '1px', lineHeight: 1,
                  color: 'rgba(255,255,255,0.25)', flexShrink: 0,
                }}
              >
                ✕
              </button>
            </>
          )}
        </div>

        {/* Outcome text on second line */}
        {project.outcome && !editMode && (
          <div style={{
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.35)',
            marginTop: '0.2rem',
            lineHeight: 1.45,
          }}>
            {project.outcome}
          </div>
        )}
      </div>
    </div>
  );
}

function ManagedServiceCard({ service, editMode, onOverride }) {
  return (
    <div className="card" style={{
      padding: 'var(--space-3)',
      position: 'relative',
      background: 'rgba(124, 58, 237, 0.06)',
      border: '1px solid rgba(124, 58, 237, 0.18)',
    }}>
      {editMode && (
        <button
          onClick={() => onOverride?.('roadmap', service.serviceId || service.id, { excluded: true })}
          title={`Remove ${service.name}`}
          style={{
            position: 'absolute', top: '0.5rem', right: '0.5rem',
            fontSize: '0.8rem', background: 'none', border: 'none',
            cursor: 'pointer', padding: '2px', lineHeight: 1, color: '#9CA3AF',
          }}
        >
          ✕
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
        <span style={{ fontSize: '1.35rem', lineHeight: 1 }}>
          {MANAGED_SERVICE_ICONS[service.serviceId] || '🔧'}
        </span>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)' }}>
          {service.name}
        </span>
      </div>
      {service.description && (
        <p style={{
          fontSize: '0.72rem', color: 'rgba(255,255,255,0.42)',
          margin: '0 0 0.6rem', lineHeight: 1.5,
        }}>
          {service.description}
        </p>
      )}
      {service.hoursPerMonth && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
          fontSize: '0.7rem', color: '#a78bfa', fontWeight: 600,
          background: 'rgba(124,58,237,0.12)', borderRadius: '20px',
          padding: '0.2rem 0.6rem',
        }}>
          ~{service.hoursPerMonth} hrs/month
        </div>
      )}
    </div>
  );
}
