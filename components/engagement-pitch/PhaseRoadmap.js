import { motion } from 'framer-motion';
import { fadeUpItem, staggerContainer } from '../../lib/animations';

const PHASE_COLORS = {
  stabilize: { bg: '#FEF2F2', border: '#FECACA', accent: '#DC2626', text: '#991B1B' },
  activate: { bg: '#FFF7ED', border: '#FED7AA', accent: '#EA580C', text: '#9A3412' },
  optimize: { bg: '#EFF6FF', border: '#BFDBFE', accent: '#2563EB', text: '#1E40AF' },
  scale: { bg: '#F0FDF4', border: '#BBF7D0', accent: '#16A34A', text: '#166534' },
};

const PHASE_IDS = ['stabilize', 'activate', 'optimize', 'scale'];

const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Critical', color: '#DC2626', bg: '#FEF2F2' },
  { value: 'recommended', label: 'Recommended', color: '#EA580C', bg: '#FFF7ED' },
  { value: 'optional', label: 'Optional', color: '#6B7280', bg: '#F3F4F6' },
];

/**
 * PhaseRoadmap — Step 3 of the Engagement Details.
 * Shows the 4-phase quarterly roadmap with projects and managed services per phase.
 */
export default function PhaseRoadmap({ roadmap, editMode, onOverride, customerPath, overrides }) {
  if (!roadmap || !roadmap.phases) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
    >
      {/* Header */}
      <motion.div variants={fadeUpItem} style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
          Your Engagement Roadmap
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Here&apos;s what your embedded LeanScale team focuses on each quarter.
        </p>
      </motion.div>

      {/* Phase Cards */}
      {roadmap.phases.map((phase, idx) => {
        const colors = PHASE_COLORS[phase.id] || PHASE_COLORS.activate;
        const hasContent = phase.projects.length > 0 || phase.managedServices?.length > 0;

        return (
          <motion.div
            key={phase.id}
            variants={fadeUpItem}
            className="card"
            style={{
              padding: 0,
              overflow: 'hidden',
              border: `1px solid ${colors.border}`,
              opacity: hasContent ? 1 : 0.5,
            }}
          >
            {/* Phase Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-4)',
              background: colors.bg,
              borderBottom: `1px solid ${colors.border}`,
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    background: colors.accent,
                    color: 'white',
                  }}>
                    {phase.timing}
                  </span>
                  <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: colors.text, margin: 0 }}>
                    {phase.name}
                  </h3>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 'var(--space-1) 0 0' }}>
                  {phase.tagline}
                </p>
              </div>
              {phase.power10Progress && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: colors.text }}>
                    {phase.power10Progress.label}
                  </div>
                  <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                    Power 10 Reportable
                  </div>
                </div>
              )}
            </div>

            {/* Phase Content */}
            <div style={{ padding: 'var(--space-4)' }}>
              {/* Strategic Projects */}
              {phase.projects.length > 0 && (
                <div style={{ marginBottom: phase.managedServices?.length > 0 ? 'var(--space-4)' : 0 }}>
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: 'var(--space-2)',
                  }}>
                    Strategic Projects
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 'var(--space-2)',
                  }}>
                    {phase.projects.map(proj => (
                      <ProjectRow
                        key={proj.serviceId}
                        project={proj}
                        colors={colors}
                        currentPhaseId={phase.id}
                        editMode={editMode}
                        onOverride={onOverride}
                        customerPath={customerPath}
                        priority={overrides?.roadmap?.[proj.serviceId]?.priority}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Managed Services */}
              {phase.managedServices?.length > 0 && (
                <div>
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    marginBottom: 'var(--space-2)',
                  }}>
                    Managed Systems
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    {phase.managedServices.map(ms => (
                      <span
                        key={ms.serviceId || ms.name}
                        style={{
                          fontSize: 'var(--text-xs)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '9999px',
                          background: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        {ms.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!hasContent && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-4)' }}>
                  No additional projects needed in this phase based on your diagnostic results.
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function ProjectRow({ project, colors, currentPhaseId, editMode, onOverride, customerPath, priority }) {
  const priorityOption = PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[1]; // default: recommended
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: 'var(--space-2) var(--space-3)',
      borderRadius: 'var(--radius-md, 8px)',
      background: 'var(--bg-subtle)',
      border: '1px solid var(--border-color)',
    }}>
      <span style={{ fontSize: 'var(--text-base)' }}>{project.icon || '📋'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-medium)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {project.name}
        </div>
        {project.primaryFunction && (
          <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
            {project.primaryFunction}
          </div>
        )}
      </div>
      {/* Priority badge (always shown) */}
      {!editMode && (
        <span style={{
          fontSize: '0.6rem',
          padding: '0 0.3rem',
          borderRadius: '3px',
          background: priorityOption.bg,
          color: priorityOption.color,
          fontWeight: 600,
          flexShrink: 0,
        }}>
          {priorityOption.label}
        </span>
      )}
      {/* Playbook link */}
      {project.hasPlaybook && customerPath && (
        <a
          href={customerPath(`/playbooks/${project.serviceId}`)}
          onClick={(e) => e.stopPropagation()}
          title="View Playbook"
          style={{
            fontSize: '0.8rem',
            textDecoration: 'none',
            flexShrink: 0,
            lineHeight: 1,
          }}
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
              fontSize: '0.65rem',
              padding: '0.15rem 0.3rem',
              borderRadius: '4px',
              border: `1px solid ${priorityOption.color}`,
              background: priorityOption.bg,
              color: priorityOption.color,
              cursor: 'pointer',
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {PRIORITY_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <select
            value={currentPhaseId}
            onChange={(e) => onOverride?.('roadmap', project.serviceId, { phase: e.target.value })}
            style={{
              fontSize: '0.65rem',
              padding: '0.15rem 0.3rem',
              borderRadius: '4px',
              border: '1px dashed var(--border-color)',
              background: 'white',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {PHASE_IDS.map(pid => (
              <option key={pid} value={pid}>
                {pid.charAt(0).toUpperCase() + pid.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => onOverride?.('roadmap', project.serviceId, { excluded: true })}
            title="Exclude from roadmap"
            style={{
              fontSize: '0.8rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              lineHeight: 1,
              color: '#9CA3AF',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
}
