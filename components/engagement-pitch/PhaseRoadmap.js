import { motion } from 'framer-motion';
import { fadeUpItem, staggerContainer } from '../../lib/animations';

const PHASE_COLORS = {
  stabilize: { bg: 'rgba(239, 68, 68, 0.06)', border: 'rgba(239, 68, 68, 0.2)', accent: '#DC2626', text: '#fca5a5' },
  activate: { bg: 'rgba(251, 146, 60, 0.06)', border: 'rgba(251, 146, 60, 0.2)', accent: '#EA580C', text: '#fdba74' },
  optimize: { bg: 'rgba(96, 165, 250, 0.06)', border: 'rgba(96, 165, 250, 0.2)', accent: '#2563EB', text: '#60a5fa' },
  scale: { bg: 'rgba(34, 197, 94, 0.06)', border: 'rgba(34, 197, 94, 0.2)', accent: '#16A34A', text: '#86efac' },
};

const PHASE_IDS = ['stabilize', 'activate', 'optimize', 'scale'];

const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Critical', color: '#DC2626', bg: 'rgba(239, 68, 68, 0.12)' },
  { value: 'recommended', label: 'Recommended', color: '#EA580C', bg: 'rgba(251, 146, 60, 0.12)' },
  { value: 'optional', label: 'Optional', color: 'rgba(255, 255, 255, 0.4)', bg: 'rgba(255, 255, 255, 0.06)' },
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

/**
 * Group projects by primaryFunction, in a stable order.
 */
function groupByFunction(projects) {
  const groups = new Map();
  for (const proj of projects) {
    const fn = proj.primaryFunction || 'Cross Functional';
    if (!groups.has(fn)) groups.set(fn, []);
    groups.get(fn).push(proj);
  }
  // Sort by FUNCTION_ORDER, then alphabetical for any extras
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

/**
 * PhaseRoadmap — Step 3 of the Engagement Details.
 * Shows the 4-phase quarterly roadmap with projects grouped by function,
 * plus managed services per phase.
 */
export default function PhaseRoadmap({ roadmap, managedServices, editMode, onOverride, customerPath, overrides }) {
  if (!roadmap || !roadmap.phases) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
    >
      {/* Header */}
      <motion.div variants={fadeUpItem} style={{ textAlign: 'center', marginBottom: '-0.25rem' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', margin: 0 }}>
          Your Engagement Roadmap
        </h2>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '0.25rem auto 0', maxWidth: '500px' }}>
          Here&apos;s what your embedded LeanScale team focuses on each quarter.
        </p>
      </motion.div>

      {/* Ongoing Managed Services — not tied to any phase */}
      {managedServices?.length > 0 && (
        <motion.div variants={fadeUpItem}>
          <SectionLabel>Ongoing Managed Services</SectionLabel>
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
        const strategicProjects = phase.projects.filter(p => p.type !== 'managed');
        const hasContent = strategicProjects.length > 0;
        const functionGroups = groupByFunction(strategicProjects);

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
              opacity: hasContent ? 1 : 0.5,
            }}
          >
            {/* Phase Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 'var(--space-3) var(--space-4)',
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
                  <span style={{
                    fontSize: 'var(--text-2xs)',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                  }}>
                    {strategicProjects.length} project{strategicProjects.length !== 1 ? 's' : ''}
                  </span>
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
            <div style={{ padding: 'var(--space-3) var(--space-4)' }}>
              {/* Strategic Projects grouped by function */}
              {strategicProjects.length > 0 && (
                <div>
                  <SectionLabel>Strategic Projects</SectionLabel>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
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
              )}

              {!hasContent && (
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-2)' }}>
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

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: '0.65rem',
      fontWeight: 700,
      letterSpacing: '0.05em',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      marginBottom: 'var(--space-1)',
    }}>
      {children}
    </div>
  );
}

function FunctionGroup({ functionName, projects, colors, currentPhaseId, editMode, onOverride, customerPath, overrides }) {
  return (
    <div>
      {/* Function subheader */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        marginBottom: 'var(--space-1)',
        paddingBottom: '0.25rem',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <span style={{ fontSize: 'var(--text-xs)' }}>{FUNCTION_ICONS[functionName] || '📋'}</span>
        <span style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 'var(--font-semibold)',
          color: 'var(--text-secondary)',
        }}>
          {functionName}
        </span>
        <span style={{
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-muted)',
        }}>
          ({projects.length})
        </span>
      </div>
      {/* Project list */}
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
            priority={overrides?.roadmap?.[proj.serviceId]?.priority}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectRow({ project, colors, currentPhaseId, editMode, onOverride, customerPath, priority }) {
  const priorityOption = PRIORITY_OPTIONS.find(p => p.value === priority) || PRIORITY_OPTIONS[1];
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: '0.4rem 0.6rem',
      borderRadius: '4px',
      transition: 'background 0.15s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ fontSize: 'var(--text-sm)' }}>{project.icon || '📋'}</span>
      <span style={{
        fontSize: 'var(--text-sm)',
        fontWeight: 'var(--font-medium)',
        flex: 1,
        minWidth: 0,
      }}>
        {project.name}
      </span>
      {/* Outcome text when available */}
      {project.outcome && !editMode && (
        <span style={{
          fontSize: 'var(--text-2xs)',
          color: 'var(--text-muted)',
          flexShrink: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '200px',
        }}>
          {project.outcome}
        </span>
      )}
      {/* Transcript signal badge (admin only) */}
      {editMode && project.transcriptSignal && (
        <span
          title={project.transcriptSignal.evidence || ''}
          style={{
            fontSize: '0.55rem',
            padding: '0.1rem 0.35rem',
            borderRadius: '3px',
            background: 'rgba(167, 139, 250, 0.15)',
            color: '#7c3aed',
            fontWeight: 600,
            flexShrink: 0,
            cursor: project.transcriptSignal.evidence ? 'help' : 'default',
            whiteSpace: 'nowrap',
          }}
        >
          Mentioned in call
        </span>
      )}
      {/* Priority dot + label */}
      {!editMode && (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          fontSize: '0.6rem',
          color: priorityOption.color,
          fontWeight: 600,
          flexShrink: 0,
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: priorityOption.color,
          }} />
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
            fontSize: '0.75rem',
            textDecoration: 'none',
            flexShrink: 0,
            lineHeight: 1,
            opacity: 0.6,
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
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              background: 'rgba(255, 255, 255, 0.04)',
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
              color: 'rgba(255, 255, 255, 0.3)',
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

function ManagedServiceCard({ service, editMode, onOverride }) {
  return (
    <div className="card" style={{ padding: 'var(--space-3)', position: 'relative', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      {editMode && (
        <button
          onClick={() => onOverride?.('roadmap', service.serviceId || service.id, { excluded: true })}
          title={`Remove ${service.name}`}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            fontSize: '0.8rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            lineHeight: 1,
            color: '#9CA3AF',
          }}
        >
          ✕
        </button>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'var(--space-2)' }}>
        <span style={{ fontSize: '1.25rem' }}>{MANAGED_SERVICE_ICONS[service.serviceId] || '🔧'}</span>
        <span style={{ fontWeight: 600 }}>{service.name}</span>
      </div>
      {service.description && (
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '0 0 var(--space-2) 0' }}>
          {service.description}
        </p>
      )}
      {service.hoursPerMonth && (
        <div style={{ fontSize: 'var(--text-xs)', color: '#7c3aed', fontWeight: 500 }}>
          ~{service.hoursPerMonth} hrs/month
        </div>
      )}
    </div>
  );
}
