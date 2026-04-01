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
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(167, 139, 250, 0.08) 100%)',
          borderRadius: 'var(--radius-xl, 16px)',
          border: '1px solid rgba(167, 139, 250, 0.2)',
        }}
      >
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', color: 'rgba(255, 255, 255, 0.95)' }}>
          {summary.punchline}
        </div>
        {costOfInaction && (
          <div style={{ fontSize: 'var(--text-sm)', color: '#7c3aed', marginTop: 'var(--space-2)' }}>
            {costOfInaction.statement}
          </div>
        )}
      </motion.div>

      {/* Metrics Table */}
      <motion.div variants={fadeUpItem} style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg, 12px)', border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
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
                  borderBottom: idx < effectiveData.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                  background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
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
    healthy: { bg: 'rgba(34, 197, 94, 0.12)', text: '#86efac', border: 'rgba(34, 197, 94, 0.3)' },
    careful: { bg: 'rgba(234, 179, 8, 0.12)', text: '#fde047', border: 'rgba(234, 179, 8, 0.3)' },
    warning: { bg: 'rgba(239, 68, 68, 0.12)', text: '#fca5a5', border: 'rgba(239, 68, 68, 0.3)' },
    unable: { bg: 'rgba(255, 255, 255, 0.06)', text: 'rgba(255, 255, 255, 0.4)', border: 'rgba(255, 255, 255, 0.1)' },
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
