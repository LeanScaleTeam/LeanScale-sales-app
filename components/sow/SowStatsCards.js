/**
 * SowStatsCards — Summary stat cards for the SOW page.
 *
 * Shows 4 metrics: section count, total hours, investment, and engagement duration.
 *
 * @param {Array} sections - SOW sections
 * @param {number} totalHours - Projected total hours
 * @param {number} totalInvestment - Projected total investment
 */

import { calculateEngagementDuration } from '../../lib/date-utils';

export default function SowStatsCards({ sections = [], totalHours = 0, totalInvestment = 0 }) {
  const duration = calculateEngagementDuration(sections);

  const cards = [
    {
      label: 'Scope Sections',
      value: sections.length,
      format: 'number',
    },
    {
      label: 'Total Hours',
      value: totalHours,
      format: 'hours',
    },
    {
      label: 'Investment',
      value: totalInvestment,
      format: 'currency',
    },
    {
      label: 'Duration',
      value: duration.months,
      format: 'months',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    }}>
      {cards.map(card => (
        <div
          key={card.label}
          style={{
            background: 'white',
            border: '1px solid #E2E8F0',
            borderRadius: '0.75rem',
            padding: '1.25rem',
            textAlign: 'center',
          }}
        >
          <div style={{
            fontSize: '0.75rem',
            color: '#718096',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {card.label}
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#6C5CE7',
            fontVariantNumeric: 'tabular-nums',
          }}>
            {formatValue(card.value, card.format)}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatValue(value, format) {
  if (value === 0 || value == null) {
    if (format === 'months') return '-';
    if (format === 'currency') return '$0';
    return '0';
  }

  switch (format) {
    case 'currency':
      return `$${Math.round(value).toLocaleString()}`;
    case 'hours':
      return Math.round(value).toLocaleString();
    case 'months': {
      const m = Math.round(value * 10) / 10;
      if (m < 1) return `${Math.round(value * 4.33)}w`;
      return `${m}mo`;
    }
    default:
      return String(value);
  }
}
