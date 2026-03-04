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
};

/**
 * FindingCard — Problem/Impact/Solution/Outcome card for a single diagnostic finding.
 */
export default function FindingCard({ item, impact, services, onServiceClick }) {
  const funcColor = FUNCTION_COLORS[item.primaryFunction] || FUNCTION_COLORS['Cross Functional'];
  const statusBadge = STATUS_BADGES[item.status] || STATUS_BADGES.careful;

  return (
    <motion.div
      variants={fadeUpItem}
      className="card"
      style={{
        padding: 0,
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
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
          {item.description}
        </Section>

        {/* Impact */}
        {impact?.statement && (
          <Section label="IMPACT" color="#92400E">
            <span>{impact.statement}</span>
            {impact.type === 'benchmark' && (
              <span style={{
                fontSize: 'var(--text-2xs)',
                color: 'var(--text-muted)',
                marginLeft: 'var(--space-1)',
              }}>
                (industry benchmark)
              </span>
            )}
          </Section>
        )}

        {/* Solution */}
        {services && services.length > 0 && (
          <Section label="SOLUTION" color="#6C5CE7">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {services.map(svc => (
                <div
                  key={svc.id}
                  onClick={() => onServiceClick?.(svc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    cursor: onServiceClick ? 'pointer' : 'default',
                  }}
                >
                  <span>{svc.icon}</span>
                  <span style={{ fontWeight: 'var(--font-medium)' }}>{svc.name}</span>
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
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Outcome */}
        {item.outcomeStatement && (
          <Section label="OUTCOME" color="#166534">
            {item.outcomeStatement}
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
