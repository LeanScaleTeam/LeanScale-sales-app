/**
 * ScenarioComparisonTable - Side-by-side comparison of SOW scenarios
 *
 * Props:
 *   scenarios  - Array of scenario objects with metrics computed
 *   sections   - All SOW sections (for computing metrics)
 *   onSelect   - Callback when a scenario is selected for editing
 */

import { useMemo } from 'react';
import { computeScenarioMetrics, assignBadges } from '../../lib/sow-scenarios';

const BADGE_STYLES = {
  'Best Value': { bg: '#F0FDF4', color: '#276749', icon: '💰' },
  'Most Comprehensive': { bg: '#EDE9FE', color: '#6C5CE7', icon: '🏆' },
  'Fastest': { bg: '#FFF7ED', color: '#C2410C', icon: '⚡' },
};

export default function ScenarioComparisonTable({ scenarios = [], sections = [], onSelect }) {
  const metricsWithBadges = useMemo(() => {
    const metrics = scenarios.map(s => ({
      ...s,
      ...computeScenarioMetrics(sections, s.sectionIds || []),
    }));
    return assignBadges(metrics);
  }, [scenarios, sections]);

  if (metricsWithBadges.length < 2) return null;

  // Find max/min for highlighting
  const maxHours = Math.max(...metricsWithBadges.map(m => m.totalHours));
  const minInvestment = Math.min(...metricsWithBadges.filter(m => m.totalInvestment > 0).map(m => m.totalInvestment));
  const maxInvestment = Math.max(...metricsWithBadges.map(m => m.totalInvestment));

  return (
    <div style={{
      background: 'var(--bg-white)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      marginBottom: 'var(--space-6)',
    }}>
      <div style={{
        padding: 'var(--space-4) var(--space-5)',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-subtle)',
      }}>
        <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--gray-900)' }}>
          📊 Scenario Comparison
        </h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ ...thStyle, width: '160px' }}>Metric</th>
              {metricsWithBadges.map(s => (
                <th key={s.id} style={{ ...thStyle, textAlign: 'center', cursor: onSelect ? 'pointer' : 'default' }}
                    onClick={() => onSelect?.(s.id)}>
                  <div style={{ fontWeight: 'var(--font-semibold)', color: 'var(--gray-900)' }}>{s.name}</div>
                  {s.isDefault && (
                    <span style={{
                      display: 'inline-block',
                      marginTop: 4,
                      padding: '1px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: '#6C5CE7',
                      color: 'white',
                      fontSize: 'var(--text-xs)',
                    }}>
                      Recommended
                    </span>
                  )}
                  {s.badges?.length > 0 && (
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 4, flexWrap: 'wrap' }}>
                      {s.badges.map(badge => (
                        <span key={badge} style={{
                          display: 'inline-block',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          background: BADGE_STYLES[badge]?.bg || '#F7FAFC',
                          color: BADGE_STYLES[badge]?.color || '#4A5568',
                          fontSize: '10px',
                          fontWeight: 'var(--font-medium)',
                        }}>
                          {BADGE_STYLES[badge]?.icon} {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ComparisonRow label="Sections" values={metricsWithBadges.map(m => m.sectionCount)} />
            <ComparisonRow
              label="Total Hours"
              values={metricsWithBadges.map(m => m.totalHours)}
              highlight={metricsWithBadges.map(m => m.totalHours === maxHours ? 'emphasis' : null)}
            />
            <ComparisonRow
              label="Investment"
              values={metricsWithBadges.map(m => `$${m.totalInvestment.toLocaleString()}`)}
              highlight={metricsWithBadges.map(m =>
                m.totalInvestment === minInvestment ? 'good' :
                m.totalInvestment === maxInvestment ? 'emphasis' : null
              )}
            />
            <ComparisonRow
              label="Duration"
              values={metricsWithBadges.map(m => m.durationWeeks != null ? `${m.durationWeeks} weeks` : '—')}
            />
            {/* Key sections included */}
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ ...tdStyle, fontWeight: 'var(--font-medium)', color: 'var(--text-primary)', verticalAlign: 'top' }}>
                Key Sections
              </td>
              {metricsWithBadges.map(m => (
                <td key={m.id} style={{ ...tdStyle, textAlign: 'center', verticalAlign: 'top' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                    {m.sectionTitles.slice(0, 5).map((t, i) => (
                      <span key={i} style={{
                        display: 'inline-block',
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-subtle)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-primary)',
                      }}>
                        {t}
                      </span>
                    ))}
                    {m.sectionTitles.length > 5 && (
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                        +{m.sectionTitles.length - 5} more
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ComparisonRow({ label, values, highlight = [] }) {
  return (
    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
      <td style={{ ...tdStyle, fontWeight: 'var(--font-medium)', color: 'var(--text-primary)' }}>
        {label}
      </td>
      {values.map((v, i) => (
        <td key={i} style={{
          ...tdStyle,
          textAlign: 'center',
          fontWeight: highlight[i] ? 'var(--font-semibold)' : 'normal',
          color: highlight[i] === 'good' ? '#276749' :
                 highlight[i] === 'emphasis' ? '#6C5CE7' :
                 'var(--text-primary)',
        }}>
          {v}
        </td>
      ))}
    </tr>
  );
}

const thStyle = {
  padding: '10px 14px',
  textAlign: 'left',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-secondary)',
  fontWeight: 'var(--font-medium)',
};

const tdStyle = {
  padding: '10px 14px',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-primary)',
};
