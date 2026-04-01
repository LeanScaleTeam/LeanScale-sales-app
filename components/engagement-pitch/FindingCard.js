import { motion } from 'framer-motion';
import { fadeUpItem } from '../../lib/animations';

const FUNCTION_COLORS = {
  'Marketing': { bg: 'rgba(96, 165, 250, 0.08)', text: '#60a5fa', border: 'rgba(96, 165, 250, 0.2)' },
  'Sales': { bg: 'rgba(34, 197, 94, 0.08)', text: '#86efac', border: 'rgba(34, 197, 94, 0.2)' },
  'Customer Success': { bg: 'rgba(251, 146, 60, 0.08)', text: '#fdba74', border: 'rgba(251, 146, 60, 0.2)' },
  'Partnerships': { bg: 'rgba(167, 139, 250, 0.08)', text: '#a78bfa', border: 'rgba(167, 139, 250, 0.2)' },
  'Cross Functional': { bg: 'rgba(255, 255, 255, 0.04)', text: 'rgba(255, 255, 255, 0.5)', border: 'rgba(255, 255, 255, 0.1)' },
};

const STATUS_BADGES = {
  warning: { label: 'Critical', bg: 'rgba(239, 68, 68, 0.12)', text: '#fca5a5', border: 'rgba(239, 68, 68, 0.3)' },
  careful: { label: 'Needs Work', bg: 'rgba(234, 179, 8, 0.12)', text: '#fde047', border: 'rgba(234, 179, 8, 0.3)' },
  healthy: { label: 'Healthy', bg: 'rgba(34, 197, 94, 0.12)', text: '#86efac', border: 'rgba(34, 197, 94, 0.3)' },
};

const FINDING_STATUS_CYCLE = ['warning', 'careful', 'healthy'];

/**
 * FindingCard — Problem/Impact/Solution/Outcome card for a single diagnostic finding.
 */
export default function FindingCard({ item, impact, services, onServiceClick, editMode, onOverride, customerPath }) {
  const funcColor = FUNCTION_COLORS[item.primaryFunction] || FUNCTION_COLORS['Cross Functional'];
  const statusBadge = STATUS_BADGES[item.status] || STATUS_BADGES.careful;

  function cycleStatus() {
    const idx = FINDING_STATUS_CYCLE.indexOf(item.status);
    const next = FINDING_STATUS_CYCLE[(idx + 1) % FINDING_STATUS_CYCLE.length];
    onOverride?.('findings', item.id, { status: next });
  }

  return (
    <motion.div
      variants={fadeUpItem}
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        opacity: item.excluded ? 0.4 : 1,
        transition: 'opacity 0.2s ease',
      }}
    >
      {/* Context Strip */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-3) var(--space-4)',
        background: funcColor.bg,
        borderBottom: `1px solid ${funcColor.border}`,
        flexWrap: 'wrap',
        gap: 'var(--space-2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            padding: '0.1rem 0.5rem',
            borderRadius: '4px',
            background: funcColor.border,
            color: funcColor.text,
          }}>
            {item.primaryFunction}
          </span>
          {item.outcomes && item.outcomes.length > 0 && (
            <span style={{ fontSize: 'var(--text-xs)', color: funcColor.text }}>
              {item.outcomes[0]}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {editMode ? (
            <button
              onClick={cycleStatus}
              title="Click to cycle status"
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: '9999px',
                cursor: 'pointer',
                background: 'none',
                padding: 0,
              }}
            >
              <span style={{
                display: 'inline-block',
                fontSize: '0.65rem',
                fontWeight: 600,
                padding: '0.1rem 0.5rem',
                borderRadius: '9999px',
                background: statusBadge.bg,
                color: statusBadge.text,
                border: `1px solid ${statusBadge.border}`,
              }}>
                {statusBadge.label}
              </span>
            </button>
          ) : (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              padding: '0.1rem 0.5rem',
              borderRadius: '9999px',
              background: statusBadge.bg,
              color: statusBadge.text,
              border: `1px solid ${statusBadge.border}`,
            }}>
              {statusBadge.label}
            </span>
          )}
          {editMode && (
            <button
              onClick={() => onOverride?.('findings', item.id, { excluded: !item.excluded })}
              title={item.excluded ? 'Include in pitch' : 'Exclude from pitch'}
              style={{
                fontSize: '0.8rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                lineHeight: 1,
              }}
            >
              {item.excluded ? '🔇' : '👁️'}
            </button>
          )}
          {item.power10Metrics && item.power10Metrics.length > 0 && (
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              Impacts: {item.power10Metrics.slice(0, 2).join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: 'var(--space-4)' }}>
        {/* Item Name */}
        <h3 style={{
          fontSize: 'var(--text-base)',
          fontWeight: 'var(--font-semibold)',
          marginBottom: 'var(--space-3)',
          color: 'rgba(255, 255, 255, 0.95)',
        }}>
          {item.name}
        </h3>

        {/* Problem */}
        <Section label="PROBLEM" color="#fca5a5">
          {editMode ? (
            <textarea
              value={item.description || ''}
              onChange={(e) => onOverride?.('findings', item.id, { description: e.target.value })}
              style={{
                width: '100%',
                fontSize: 'var(--text-sm)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '6px 8px',
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                color: 'rgba(255, 255, 255, 0.7)',
              }}
              rows={2}
            />
          ) : (
            item.description
          )}
        </Section>

        {/* Impact */}
        {(impact?.statement || editMode) && (
          <Section label="IMPACT" color="#fbbf24">
            {editMode ? (
              <textarea
                value={item.impactOverride ?? impact?.statement ?? ''}
                onChange={(e) => onOverride?.('findings', item.id, { impactOverride: e.target.value })}
                style={{
                  width: '100%',
                  fontSize: 'var(--text-sm)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
                rows={2}
              />
            ) : (
              <>
                <span>{item.impactOverride || impact?.statement}</span>
                {!item.impactOverride && impact?.type === 'benchmark' && (
                  <span style={{
                    fontSize: 'var(--text-2xs)',
                    color: 'var(--text-muted)',
                    marginLeft: 'var(--space-1)',
                  }}>
                    (industry benchmark)
                  </span>
                )}
              </>
            )}
          </Section>
        )}

        {/* Solution + Playbook Links */}
        {services && services.length > 0 && (
          <Section label="SOLUTION" color="#7c3aed">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {services.map(svc => (
                <div
                  key={svc.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                  }}
                >
                  <span>{svc.icon}</span>
                  <span
                    onClick={() => onServiceClick?.(svc)}
                    style={{
                      fontWeight: 'var(--font-medium)',
                      cursor: onServiceClick ? 'pointer' : 'default',
                    }}
                  >
                    {svc.name}
                  </span>
                  {svc.type === 'managed' && (
                    <span style={{
                      fontSize: '0.6rem',
                      padding: '0 0.3rem',
                      borderRadius: '3px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}>
                      managed
                    </span>
                  )}
                  {svc.hasPlaybook && customerPath && (
                    <a
                      href={customerPath(`/playbooks/${svc.id}`)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: '0.65rem',
                        color: '#7c3aed',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      View Playbook &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Outcome */}
        {(item.outcomeStatement || editMode) && (
          <Section label="OUTCOME" color="#86efac">
            {editMode ? (
              <textarea
                value={item.outcomeStatement || ''}
                onChange={(e) => onOverride?.('findings', item.id, { outcomeStatement: e.target.value })}
                style={{
                  width: '100%',
                  fontSize: 'var(--text-sm)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: 1.5,
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
                rows={2}
              />
            ) : (
              item.outcomeStatement
            )}
          </Section>
        )}
      </div>
    </motion.div>
  );
}

function Section({ label, color, children }) {
  return (
    <div style={{ marginBottom: 'var(--space-3)' }}>
      <div style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        color,
        marginBottom: 'var(--space-1)',
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
}
