import { motion } from 'framer-motion';
import { fadeUpItem } from '../../lib/animations';

const FUNCTION_COLORS = {
  'Marketing': { bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' },
  'Sales': { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
  'Customer Success': { bg: '#FFF7ED', text: '#9A3412', border: '#FED7AA' },
  'Partnerships': { bg: '#FAF5FF', text: '#6B21A8', border: '#E9D5FF' },
  'Cross Functional': { bg: '#F8FAFC', text: '#475569', border: '#E2E8F0' },
};

const STATUS_BADGES = {
  warning: { label: 'Critical', bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
  careful: { label: 'Needs Work', bg: '#FEFCE8', text: '#854D0E', border: '#FEF08A' },
  healthy: { label: 'Healthy', bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
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
        border: '1px solid var(--border-color)',
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
          color: '#1a1a2e',
        }}>
          {item.name}
        </h3>

        {/* Problem */}
        <Section label="PROBLEM" color="#991B1B">
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
                color: '#374151',
              }}
              rows={2}
            />
          ) : (
            item.description
          )}
        </Section>

        {/* Impact */}
        {(impact?.statement || editMode) && (
          <Section label="IMPACT" color="#92400E">
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
                  color: '#374151',
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
          <Section label="SOLUTION" color="#6C5CE7">
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
                      background: '#E2E8F0',
                      color: '#475569',
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
          <Section label="OUTCOME" color="#166534">
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
                  color: '#374151',
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
      <div style={{ fontSize: 'var(--text-sm)', color: '#374151', lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
}
