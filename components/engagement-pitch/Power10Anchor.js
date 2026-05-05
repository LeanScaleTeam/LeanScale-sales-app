import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeUpItem, staggerContainer } from '../../lib/animations';
import { calculatePower10Summary } from '../../lib/impact-calculator';

// ─── Status Config ─────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  healthy: {
    dot: '#22c55e', text: '#86efac',
    bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)',
    track: '#22c55e',
    cardBg: 'rgba(34,197,94,0.04)', cardBorder: 'rgba(34,197,94,0.18)',
    cardBorderEdit: 'rgba(34,197,94,0.35)',
  },
  careful: {
    dot: '#eab308', text: '#fde047',
    bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)',
    track: '#eab308',
    cardBg: 'rgba(234,179,8,0.05)', cardBorder: 'rgba(234,179,8,0.22)',
    cardBorderEdit: 'rgba(234,179,8,0.4)',
  },
  warning: {
    dot: '#ef4444', text: '#fca5a5',
    bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)',
    track: '#ef4444',
    cardBg: 'rgba(239,68,68,0.07)', cardBorder: 'rgba(239,68,68,0.25)',
    cardBorderEdit: 'rgba(239,68,68,0.45)',
  },
  unable: {
    dot: '#4b5563', text: 'rgba(255,255,255,0.35)',
    bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)',
    track: 'rgba(255,255,255,0.08)',
    cardBg: 'rgba(255,255,255,0.02)', cardBorder: 'rgba(255,255,255,0.08)',
    cardBorderEdit: 'rgba(255,255,255,0.2)',
  },
};

const STATUS_RANK   = { healthy: 0, careful: 1, warning: 2, unable: 3 };
const TRACK_FILLS   = { healthy: 4, careful: 3, warning: 2, unable: 0 };
const STATUS_CYCLE  = ['healthy', 'careful', 'warning', 'unable'];
const STATUS_LABELS = { healthy: 'Healthy', careful: 'Careful', warning: 'Warning', unable: 'Unable' };

function worstStatus(a, b) {
  const ra = STATUS_RANK[a] ?? 3;
  const rb = STATUS_RANK[b] ?? 3;
  return ra >= rb ? (a || 'unable') : (b || 'unable');
}

// ─── StatusTrack ───────────────────────────────────────────────────────────────

function StatusTrack({ status }) {
  const filled = TRACK_FILLS[status] ?? 0;
  const sc = STATUS_COLORS[status] || STATUS_COLORS.unable;
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{
          width: 10, height: 3, borderRadius: 2,
          background: i < filled ? sc.track : 'rgba(255,255,255,0.1)',
          transition: 'background 0.2s',
        }} />
      ))}
    </div>
  );
}

// ─── OverallDot ────────────────────────────────────────────────────────────────

function OverallDot({ status }) {
  const sc = STATUS_COLORS[status] || STATUS_COLORS.unable;
  return (
    <div style={{
      width: 9, height: 9, borderRadius: '50%',
      background: sc.dot,
      boxShadow: `0 0 6px ${sc.dot}80`,
      flexShrink: 0,
    }} />
  );
}

// ─── StatusPill ────────────────────────────────────────────────────────────────

function StatusPill({ status }) {
  const sc = STATUS_COLORS[status] || STATUS_COLORS.unable;
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.12rem 0.5rem',
      fontSize: '0.65rem',
      fontWeight: 600,
      borderRadius: 9999,
      background: sc.bg,
      color: sc.text,
      border: `1px solid ${sc.border}`,
      whiteSpace: 'nowrap',
    }}>
      {STATUS_LABELS[status] || 'N/A'}
    </span>
  );
}

// ─── MetricCard ────────────────────────────────────────────────────────────────

function MetricCard({ metric, index, editMode, onCycle }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  const reportStatus = metric.ableToReport     || 'unable';
  const perfStatus   = metric.statusAgainstPlan || 'unable';
  const worst        = worstStatus(reportStatus, perfStatus);
  const sc           = STATUS_COLORS[worst] || STATUS_COLORS.unable;
  const displayName  = metric.shortName || metric.name;

  return (
    <motion.div
      variants={fadeUpItem}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      style={{
        background: sc.cardBg,
        border: `${editMode ? '1px dashed' : '1px solid'} ${editMode ? sc.cardBorderEdit : sc.cardBorder}`,
        borderRadius: 14,
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.55rem',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Top row: index + overall dot */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: '0.62rem', fontWeight: 700,
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.05em', lineHeight: 1,
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <OverallDot status={worst} />
      </div>

      {/* Short name */}
      <div style={{
        fontSize: '1.05rem', fontWeight: 800,
        color: 'rgba(255,255,255,0.95)',
        letterSpacing: '-0.01em', lineHeight: 1.1,
      }}>
        {displayName}
      </div>

      {/* Description */}
      <div style={{
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.38)',
        lineHeight: 1.45,
      }}>
        {metric.description || metric.name}
      </div>

      {/* Why */}
      {metric.why && (
        <div style={{
          fontSize: '0.68rem', fontStyle: 'italic',
          color: 'rgba(167,139,250,0.72)',
          lineHeight: 1.4,
        }}>
          {metric.why}
        </div>
      )}

      {/* Actual value (from Vasco) */}
      {metric.formatted && (
        <div style={{
          fontSize: '1.5rem', fontWeight: 700,
          color: 'rgba(255,255,255,0.95)',
          lineHeight: 1.1,
          marginTop: '0.25rem',
        }}>
          {metric.formatted}
          {metric.asOf && (
            <span style={{
              fontSize: '0.6rem', fontWeight: 400,
              color: 'rgba(255,255,255,0.35)',
              marginLeft: '0.5rem',
            }}>
              {metric.asOf}
            </span>
          )}
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)' }} />

      {/* Status rows */}
      {[
        { field: 'ableToReport',      label: 'Reporting:',   status: reportStatus },
        { field: 'statusAgainstPlan', label: 'Performance:', status: perfStatus   },
      ].map(({ field, label, status }) => (
        <div
          key={field}
          onClick={() => editMode && onCycle(metric.name, field, status)}
          onMouseEnter={() => editMode && setHoveredRow(field)}
          onMouseLeave={() => setHoveredRow(null)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.25rem 0.35rem',
            borderRadius: 6,
            cursor: editMode ? 'pointer' : 'default',
            background: editMode && hoveredRow === field ? 'rgba(255,255,255,0.04)' : 'transparent',
            transition: 'background 0.15s',
          }}
        >
          <span style={{
            fontSize: '0.62rem',
            color: 'rgba(255,255,255,0.35)',
            width: 74, flexShrink: 0,
          }}>
            {label}
          </span>
          <StatusTrack status={status} />
          <StatusPill status={status} />
        </div>
      ))}
    </motion.div>
  );
}

// ─── PunchlineSection ──────────────────────────────────────────────────────────

function PunchlineSection({ summary, costOfInaction, effectiveData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Purple punchline box */}
      <div style={{
        textAlign: 'center',
        padding: 'var(--space-5, 1.25rem) var(--space-6, 1.5rem)',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(167,139,250,0.08) 100%)',
        borderRadius: 'var(--radius-xl, 16px)',
        border: '1px solid rgba(167,139,250,0.2)',
      }}>
        <div style={{ fontSize: 'var(--text-lg, 1.125rem)', fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>
          {summary.punchline}
        </div>
        {costOfInaction && (
          <div style={{ fontSize: 'var(--text-sm, 0.875rem)', color: '#a78bfa', marginTop: 'var(--space-2, 0.5rem)' }}>
            {costOfInaction.statement}
          </div>
        )}
      </div>

      {/* Health Overview strip */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 10,
        padding: '0.875rem 1rem',
      }}>
        <div style={{
          fontSize: '0.62rem', fontWeight: 600,
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', letterSpacing: '0.07em',
          marginBottom: '0.6rem',
        }}>
          Metric Health Overview
        </div>

        {/* Colored segments */}
        <div style={{ display: 'flex', gap: 3, marginBottom: '0.35rem' }}>
          {effectiveData.map((m) => {
            const worst = worstStatus(m.ableToReport || 'unable', m.statusAgainstPlan || 'unable');
            const dot = STATUS_COLORS[worst]?.dot || STATUS_COLORS.unable.dot;
            return (
              <div
                key={m.name}
                title={`${m.shortName || m.name} — ${STATUS_LABELS[worst]}`}
                style={{
                  flex: 1, height: 20, borderRadius: 4,
                  background: dot,
                  opacity: 0.75,
                }}
              />
            );
          })}
        </div>

        {/* Short name labels */}
        <div style={{ display: 'flex', gap: 3, marginBottom: '0.65rem' }}>
          {effectiveData.map((m) => (
            <div key={m.name} style={{
              flex: 1, fontSize: '0.48rem',
              color: 'rgba(255,255,255,0.25)',
              textAlign: 'center',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {m.shortName || m.name}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {['healthy', 'careful', 'warning', 'unable'].map(key => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{
                width: 8, height: 8, borderRadius: 2,
                background: STATUS_COLORS[key].dot,
              }} />
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>
                {STATUS_LABELS[key]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SummaryStats ──────────────────────────────────────────────────────────────

function SummaryStats({ effectiveData, summary }) {
  const healthyOnBoth = effectiveData.filter(
    m => m.ableToReport === 'healthy' && m.statusAgainstPlan === 'healthy'
  ).length;
  const blindSpots = 10 - summary.reportable;

  const stats = [
    {
      label: 'Reportable',
      value: `${summary.reportable}/10`,
      color: summary.reportable >= 7 ? '#22c55e' : summary.reportable >= 4 ? '#eab308' : '#ef4444',
    },
    {
      label: 'On Track',
      value: `${summary.onTrack}/10`,
      color: summary.onTrack >= 7 ? '#22c55e' : summary.onTrack >= 4 ? '#eab308' : '#ef4444',
    },
    {
      label: 'Blind Spots',
      value: `${blindSpots}`,
      color: blindSpots <= 3 ? '#22c55e' : '#ef4444',
    },
    {
      label: 'Healthy on Both',
      value: `${healthyOnBoth}/10`,
      color: healthyOnBoth >= 7 ? '#22c55e' : healthyOnBoth >= 4 ? '#eab308' : '#ef4444',
    },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 'var(--radius-xl, 16px)',
      padding: 'var(--space-4, 1rem) var(--space-3, 0.75rem)',
    }}>
      {stats.map((stat, i) => (
        <div key={stat.label} style={{ display: 'contents' }}>
          <div style={{ textAlign: 'center', padding: '0 var(--space-5, 1.25rem)' }}>
            <div style={{
              fontSize: '1.6rem', fontWeight: 800,
              color: stat.color,
              letterSpacing: '-0.02em', lineHeight: 1,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontSize: '0.62rem',
              color: 'rgba(255,255,255,0.35)',
              fontWeight: 500,
              marginTop: '0.2rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              whiteSpace: 'nowrap',
            }}>
              {stat.label}
            </div>
          </div>
          {i < stats.length - 1 && (
            <div style={{
              width: 1, height: 32,
              background: 'rgba(255,255,255,0.07)',
              flexShrink: 0,
            }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

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
    ableToReport:      overrides?.power10?.[metric.name]?.ableToReport      ?? metric.ableToReport,
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
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5, 1.25rem)' }}
    >
      {/* Header */}
      <motion.div variants={fadeUpItem} style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
          The Power 10: Your Revenue Metrics
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>
          Every GTM organization needs these 10 metrics to run the business. Here&apos;s where you stand.
        </p>
      </motion.div>

      {/* Punchline + Health Strip */}
      <motion.div variants={fadeUpItem}>
        <PunchlineSection
          summary={summary}
          costOfInaction={costOfInaction}
          effectiveData={effectiveData}
        />
      </motion.div>

      {/* Metric Card Grid */}
      <motion.div
        variants={staggerContainer}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.875rem',
        }}
      >
        {effectiveData.map((metric, idx) => (
          <MetricCard
            key={metric.name}
            metric={metric}
            index={idx}
            editMode={editMode}
            onCycle={cycleStatus}
          />
        ))}
      </motion.div>

      {/* Summary Stats */}
      <motion.div variants={fadeUpItem}>
        <SummaryStats effectiveData={effectiveData} summary={summary} />
      </motion.div>
    </motion.div>
  );
}
