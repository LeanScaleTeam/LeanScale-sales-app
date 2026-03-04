import { motion } from 'framer-motion';
import { fadeUpItem, staggerContainer } from '../../lib/animations';
import { calculatePower10Summary } from '../../lib/impact-calculator';

const STATUS_CYCLE = ['healthy', 'careful', 'warning', 'unable'];

/**
 * Power10Anchor — Step 1 of the Engagement Details walkthrough.
 * Shows the 10 key revenue metrics with ability-to-report and performance-to-goal status.
 */
export default function Power10Anchor({ power10Data, costOfInaction, editMode, overrides, onOverride }) {
  if (!power10Data || power10Data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-muted)' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
          The Power 10: Your Revenue Metrics
        </h2>
        <p>Power 10 metrics have not been configured for this customer yet. Import diagnostic data or run the diagnostic to populate these metrics.</p>
      </div>
    );
  }

  // Merge overrides on top of power10Data
  const effectiveData = (power10Data || []).map(metric => ({
    ...metric,
    ableToReport: overrides?.power10?.[metric.name]?.ableToReport ?? metric.ableToReport,
    statusAgainstPlan: overrides?.power10?.[metric.name]?.statusAgainstPlan ?? metric.statusAgainstPlan,
  }));

  const summary = calculatePower10Summary(effectiveData);

  function cycleStatus(metricName, field, currentStatus) {
    const current = currentStatus || 'unable';
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    onOverride('power10', metricName, { [field]: next });
  }

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
          The Power 10: Your Revenue Metrics
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Every GTM organization needs these 10 metrics to run the business. Here&apos;s where you stand.
        </p>
      </motion.div>

      {/* Punchline */}
      <motion.div
        variants={fadeUpItem}
        style={{
          textAlign: 'center',
          padding: 'var(--space-5) var(--space-6)',
          background: 'linear-gradient(135deg, #F3F0FF 0%, #EDE9FE 100%)',
          borderRadius: 'var(--radius-xl, 16px)',
          border: '1px solid rgba(108, 92, 231, 0.15)',
        }}
      >
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: '#1a1a2e' }}>
          {summary.punchline}
        </div>
        {costOfInaction && (
          <div style={{ fontSize: 'var(--text-sm)', color: '#6C5CE7', marginTop: 'var(--space-2)' }}>
            {costOfInaction.statement}
          </div>
        )}
      </motion.div>

      {/* Metrics Table */}
      <motion.div variants={fadeUpItem} className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ textAlign: 'left', padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--font-semibold)' }}>
                Metric
              </th>
              <th style={{ textAlign: 'center', padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--font-semibold)', width: '140px' }}>
                Can You Report It?
              </th>
              <th style={{ textAlign: 'center', padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--font-semibold)', width: '140px' }}>
                Performance to Goal
              </th>
            </tr>
          </thead>
          <tbody>
            {effectiveData.map((metric, idx) => (
              <tr
                key={metric.name}
                style={{
                  borderBottom: idx < effectiveData.length - 1 ? '1px solid var(--border-color)' : 'none',
                  background: idx % 2 === 0 ? 'white' : 'var(--bg-subtle)',
                }}
              >
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 'var(--font-medium)' }}>
                  {metric.name}
                </td>
                <td style={{ textAlign: 'center', padding: 'var(--space-3) var(--space-4)' }}>
                  {editMode ? (
                    <EditablePill
                      status={metric.ableToReport || 'unable'}
                      onClick={() => cycleStatus(metric.name, 'ableToReport', metric.ableToReport)}
                    />
                  ) : (
                    <StatusPill status={metric.ableToReport || 'unable'} />
                  )}
                </td>
                <td style={{ textAlign: 'center', padding: 'var(--space-3) var(--space-4)' }}>
                  {editMode ? (
                    <EditablePill
                      status={metric.statusAgainstPlan || 'unable'}
                      onClick={() => cycleStatus(metric.name, 'statusAgainstPlan', metric.statusAgainstPlan)}
                    />
                  ) : (
                    <StatusPill status={metric.statusAgainstPlan || 'unable'} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Summary bar */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--space-6)',
          padding: 'var(--space-3)',
        }}
      >
        <StatBox label="Reportable" value={`${summary.reportable}/10`} color={summary.reportable >= 7 ? '#22c55e' : summary.reportable >= 4 ? '#eab308' : '#ef4444'} />
        <StatBox label="On Track" value={`${summary.onTrack}/10`} color={summary.onTrack >= 7 ? '#22c55e' : summary.onTrack >= 4 ? '#eab308' : '#ef4444'} />
        <StatBox label="Blind Spots" value={`${10 - summary.reportable}`} color={10 - summary.reportable <= 3 ? '#22c55e' : '#ef4444'} />
      </motion.div>
    </motion.div>
  );
}

function EditablePill({ status, onClick }) {
  return (
    <button
      onClick={onClick}
      title="Click to cycle status"
      style={{
        border: '2px dashed var(--border-color)',
        borderRadius: '9999px',
        cursor: 'pointer',
        background: 'none',
        padding: 0,
      }}
    >
      <StatusPill status={status} />
    </button>
  );
}

function StatusPill({ status }) {
  const labels = { healthy: 'Healthy', careful: 'Careful', warning: 'Warning', unable: 'Unable' };
  const colors = {
    healthy: { bg: '#F0FDF4', text: '#166534', border: '#BBF7D0' },
    careful: { bg: '#FEFCE8', text: '#854D0E', border: '#FEF08A' },
    warning: { bg: '#FEF2F2', text: '#991B1B', border: '#FECACA' },
    unable: { bg: '#F3F4F6', text: '#4B5563', border: '#E5E7EB' },
  };
  const c = colors[status] || colors.unable;
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.15rem 0.6rem',
      fontSize: '0.7rem',
      fontWeight: 600,
      borderRadius: '9999px',
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
    }}>
      {labels[status] || 'N/A'}
    </span>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', color }}>{value}</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</div>
    </div>
  );
}
