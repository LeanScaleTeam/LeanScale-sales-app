/**
 * InvestmentSummaryBar - Sticky bottom bar showing live SOW totals
 *
 * Props:
 *   sections - Array of sow_sections (live state)
 *   expanded - Whether breakdown is expanded
 *   onToggleExpand - Callback to toggle expansion
 */

import { useMemo, useState } from 'react';

const TIER_THRESHOLDS = [
  { max: 10000, label: 'Starter', color: '#22c55e' },
  { max: 25000, label: 'Growth', color: '#6C5CE7' },
  { max: 75000, label: 'Scale', color: '#E17055' },
  { max: Infinity, label: 'Enterprise', color: '#1a1a2e' },
];

function getTier(investment) {
  return TIER_THRESHOLDS.find(t => investment <= t.max) || TIER_THRESHOLDS[TIER_THRESHOLDS.length - 1];
}

export default function InvestmentSummaryBar({ sections = [] }) {
  const [expanded, setExpanded] = useState(false);

  const stats = useMemo(() => {
    let totalHours = 0;
    let totalInvestment = 0;
    const breakdown = [];

    sections.forEach(s => {
      const h = parseFloat(s.hours) || 0;
      const r = parseFloat(s.rate) || 0;
      const sub = h * r;
      totalHours += h;
      totalInvestment += sub;
      breakdown.push({ title: s.title, hours: h, rate: r, subtotal: sub });
    });

    return { totalHours, totalInvestment, breakdown, tier: getTier(totalInvestment) };
  }, [sections]);

  return (
    <div style={{
      position: 'sticky',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: '#1a1a2e',
      color: '#fff',
      borderTop: '2px solid #6C5CE7',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      {/* Expanded breakdown */}
      {expanded && stats.breakdown.length > 0 && (
        <div style={{
          maxHeight: 240,
          overflow: 'auto',
          padding: '12px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', fontSize: 10, color: '#A0AEC0', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span style={{ flex: 1 }}>Section</span>
            <span style={{ width: 70, textAlign: 'right' }}>Hours</span>
            <span style={{ width: 80, textAlign: 'right' }}>Rate</span>
            <span style={{ width: 100, textAlign: 'right' }}>Subtotal</span>
          </div>
          {stats.breakdown.map((row, idx) => (
            <div key={idx} style={{ display: 'flex', fontSize: 12, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ flex: 1, color: '#E2E8F0' }}>{row.title || 'Untitled'}</span>
              <span style={{ width: 70, textAlign: 'right', color: '#A0AEC0' }}>{row.hours || '—'}</span>
              <span style={{ width: 80, textAlign: 'right', color: '#A0AEC0' }}>{row.rate ? `$${row.rate.toLocaleString()}` : '—'}</span>
              <span style={{ width: 100, textAlign: 'right', fontWeight: 600, color: row.subtotal > 0 ? '#22c55e' : '#A0AEC0' }}>
                {row.subtotal > 0 ? `$${row.subtotal.toLocaleString()}` : '—'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Summary bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 20px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <StatItem label="Sections" value={sections.length} />
          <StatItem label="Total Hours" value={stats.totalHours} />
          <StatItem label="Total Investment" value={`$${stats.totalInvestment.toLocaleString()}`} color="#22c55e" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: stats.tier.color,
            }} />
            <span style={{ fontSize: 11, color: '#A0AEC0' }}>Tier:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: stats.tier.color }}>{stats.tier.label}</span>
          </div>
        </div>
        <span style={{ fontSize: 12, color: '#A0AEC0' }}>
          {expanded ? '▾ Hide Breakdown' : '▸ Show Breakdown'}
        </span>
      </div>
    </div>
  );
}

function StatItem({ label, value, color }) {
  return (
    <div>
      <div style={{ fontSize: 9, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: color || '#fff' }}>{value}</div>
    </div>
  );
}
