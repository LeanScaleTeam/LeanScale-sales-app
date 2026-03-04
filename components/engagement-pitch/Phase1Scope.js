import { motion } from 'framer-motion';
import { fadeUpItem, staggerContainer } from '../../lib/animations';

/**
 * Phase1Scope — Step 5 of the Engagement Pitch.
 * Zooms into Phase 1 (Stabilize) with specific projects, milestones, and investment.
 */
export default function Phase1Scope({ roadmap, onBuildSow, customerPath }) {
  if (!roadmap || !roadmap.phases) return null;

  const phase1 = roadmap.phases[0];
  if (!phase1) return null;
  const projects = phase1.projects || [];
  const managed = phase1.managedServices || [];

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
          Let&apos;s Start: {phase1.name}
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          {phase1.tagline} — here&apos;s what the first phase looks like in detail.
        </p>
      </motion.div>

      {/* Investment Summary */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-8)',
          padding: 'var(--space-5)',
          background: 'linear-gradient(135deg, #F3F0FF 0%, #EDE9FE 100%)',
          borderRadius: 'var(--radius-xl, 16px)',
          border: '1px solid rgba(108, 92, 231, 0.15)',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: '#6C5CE7' }}>
            ${(roadmap.monthlyPrice / 1000).toFixed(0)}K
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>per month</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: '#1a1a2e' }}>
            {roadmap.monthlyHours}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>hours/month</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: '#1a1a2e' }}>
            {projects.length}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>projects</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: '#1a1a2e' }}>
            {phase1.timing}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>timeline</div>
        </div>
      </motion.div>

      {/* Milestones */}
      <motion.div variants={fadeUpItem} className="card" style={{ padding: 'var(--space-4)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)' }}>
          First 90 Days
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <Milestone
            day="Day 1-30"
            title="Discovery & Foundation"
            items={[
              'Kickoff and detailed requirements gathering',
              'CRM audit and data model assessment',
              'Quick wins: cleanup, automation fixes, basic reporting',
            ]}
          />
          <Milestone
            day="Day 31-60"
            title="Build & Configure"
            items={[
              'Lifecycle and pipeline redesign implementation',
              'Foundational automations deployed',
              'Initial dashboard builds for key stakeholders',
            ]}
          />
          <Milestone
            day="Day 61-90"
            title="Launch & Validate"
            items={[
              'Go-live with new processes',
              'Team training and enablement',
              'First reporting cycle with validated metrics',
            ]}
          />
        </div>
      </motion.div>

      {/* Projects List */}
      <motion.div variants={fadeUpItem} className="card" style={{ padding: 'var(--space-4)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)' }}>
          Phase 1 Projects
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {projects.map(proj => (
            <div
              key={proj.serviceId}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-md, 8px)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
              }}
            >
              <span style={{ fontSize: 'var(--text-lg)' }}>{proj.icon || '📋'}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{proj.name}</div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                  {proj.primaryFunction}{proj.outcome ? ` — ${proj.outcome}` : ''}
                </div>
              </div>
              {proj.metric && (
                <span style={{
                  fontSize: '0.6rem',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '4px',
                  background: '#F3F0FF',
                  color: '#6C5CE7',
                  whiteSpace: 'nowrap',
                }}>
                  {proj.metric}
                </span>
              )}
              {proj.hasPlaybook && customerPath && (
                <a
                  href={customerPath(`/playbooks/${proj.serviceId}`)}
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
            </div>
          ))}
        </div>
      </motion.div>

      {/* Managed Services */}
      {managed.length > 0 && (
        <motion.div variants={fadeUpItem} className="card" style={{ padding: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-3)' }}>
            Systems We Manage
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {managed.map(ms => (
              <span
                key={ms.serviceId || ms.name}
                style={{
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                {ms.name}
                {ms.hoursPerMonth && (
                  <span style={{ color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
                    ({ms.hoursPerMonth}hrs/mo)
                  </span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Power 10 Progress */}
      {phase1.power10Progress && (
        <motion.div variants={fadeUpItem} style={{
          textAlign: 'center',
          padding: 'var(--space-4)',
          background: '#F0FDF4',
          borderRadius: 'var(--radius-xl, 16px)',
          border: '1px solid #BBF7D0',
        }}>
          <div style={{ fontSize: 'var(--text-sm)', color: '#166534', fontWeight: 'var(--font-semibold)' }}>
            After Phase 1: {phase1.power10Progress.label} Power 10 metrics reportable
          </div>
        </motion.div>
      )}

      {/* CTA */}
      {onBuildSow && (
        <motion.div variants={fadeUpItem} style={{ textAlign: 'center' }}>
          <button
            onClick={onBuildSow}
            style={{
              padding: 'var(--space-3) var(--space-6)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-semibold)',
              borderRadius: 'var(--radius-lg, 12px)',
              border: 'none',
              background: '#6C5CE7',
              color: 'white',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(108, 92, 231, 0.3)',
            }}
          >
            Build Statement of Work
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function Milestone({ day, title, items }) {
  return (
    <div style={{
      display: 'flex',
      gap: 'var(--space-3)',
      padding: 'var(--space-3)',
      borderRadius: 'var(--radius-md, 8px)',
      background: 'var(--bg-subtle)',
    }}>
      <div style={{
        flexShrink: 0,
        width: '80px',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-semibold)',
        color: '#6C5CE7',
      }}>
        {day}
      </div>
      <div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-1)' }}>
          {title}
        </div>
        <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ marginBottom: '2px' }}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
