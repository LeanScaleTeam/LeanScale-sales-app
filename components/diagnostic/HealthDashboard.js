import { useState, useEffect, useMemo } from 'react';
import { getStatusColor } from './StatusLegend';
import { countStatuses, groupBy } from '../../data/diagnostic-registry';

const STATUS_WEIGHTS = { healthy: 100, careful: 65, warning: 30, unable: 0, na: null };
const STATUS_COLORS = {
  healthy: '#22c55e', careful: '#eab308', warning: '#ef4444', unable: '#6b7280', na: '#d1d5db',
};
const STATUS_LABELS = { healthy: 'Healthy', careful: 'Careful', warning: 'Warning', unable: 'Unable', na: 'N/A' };

function computeHealthScore(items) {
  const scorable = items.filter(i => i.status !== 'na');
  if (!scorable.length) return 0;
  const total = scorable.reduce((sum, i) => sum + (STATUS_WEIGHTS[i.status] ?? 0), 0);
  return Math.round(total / scorable.length);
}

function AnimatedCounter({ target, duration = 1200 }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start = 0;
    const startTime = performance.now();
    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, duration]);
  return <span>{value}</span>;
}

function DonutChartSVG({ data, size = 180 }) {
  const total = data.healthy + data.careful + data.warning + data.unable;
  if (total === 0) return null;
  const segments = ['healthy', 'careful', 'warning', 'unable'].filter(s => data[s] > 0);
  const radius = (size - 20) / 2;
  const cx = size / 2, cy = size / 2;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {segments.map(status => {
        const pct = data[status] / total;
        const dashArray = `${pct * circumference} ${circumference}`;
        const dashOffset = -offset * circumference;
        offset += pct;
        return (
          <circle
            key={status}
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={STATUS_COLORS[status]}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="dashboard-donut-segment"
          />
        );
      })}
    </svg>
  );
}

function ScoreGauge({ score }) {
  const color = score >= 70 ? '#22c55e' : score >= 45 ? '#eab308' : '#ef4444';
  return (
    <div className="dashboard-score-gauge">
      <div className="dashboard-score-value" style={{ color }}>
        <AnimatedCounter target={score} />
      </div>
      <div className="dashboard-score-label">GTM Health Score</div>
    </div>
  );
}

function FunctionSparkline({ name, items }) {
  const stats = countStatuses(items);
  const total = items.length;
  if (total === 0) return null;
  const segments = ['healthy', 'careful', 'warning', 'unable', 'na'].filter(s => stats[s] > 0);

  return (
    <div className="dashboard-sparkline-row">
      <span className="dashboard-sparkline-label">{name}</span>
      <div className="dashboard-sparkline-bar">
        {segments.map(s => (
          <div
            key={s}
            style={{
              width: `${(stats[s] / total) * 100}%`,
              background: STATUS_COLORS[s],
              height: '100%',
              transition: 'width 0.6s ease',
            }}
          />
        ))}
      </div>
      <span className="dashboard-sparkline-count">{total}</span>
    </div>
  );
}

export default function HealthDashboard({ processes, categories, diagnosticType }) {
  const score = useMemo(() => computeHealthScore(processes), [processes]);
  const stats = useMemo(() => countStatuses(processes), [processes]);
  const grouped = useMemo(() => groupBy(processes, 'function'), [processes]);

  // Key insight: find the function with most warning+unable items
  const insights = useMemo(() => {
    const results = [];
    const funcProblems = {};
    for (const [func, items] of Object.entries(grouped)) {
      const critical = items.filter(i => i.status === 'warning' || i.status === 'unable').length;
      if (critical > 0) funcProblems[func] = critical;
    }
    const sorted = Object.entries(funcProblems).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      results.push(`${sorted[0][1]} critical areas need immediate attention in ${sorted[0][0]}`);
    }
    const totalCritical = stats.warning + stats.unable;
    if (totalCritical > 0) {
      results.push(`${totalCritical} of ${processes.length} processes require action`);
    }
    return results;
  }, [grouped, stats, processes]);

  const statEntries = [
    { key: 'healthy', label: 'Healthy', color: STATUS_COLORS.healthy },
    { key: 'careful', label: 'Careful', color: STATUS_COLORS.careful },
    { key: 'warning', label: 'Warning', color: STATUS_COLORS.warning },
    { key: 'unable', label: 'Unable', color: STATUS_COLORS.unable },
  ];

  return (
    <div className="health-dashboard">
      {/* Top row: Score + Donut + Counters */}
      <div className="dashboard-top-row">
        <div className="dashboard-glass-card dashboard-score-card">
          <ScoreGauge score={score} />
          {insights.length > 0 && (
            <div className="dashboard-insight">
              <span className="dashboard-insight-icon">⚠️</span>
              <span>{insights[0]}</span>
            </div>
          )}
        </div>

        <div className="dashboard-glass-card dashboard-donut-card">
          <div className="dashboard-donut-wrapper">
            <DonutChartSVG data={stats} size={180} />
            <div className="dashboard-donut-center">
              <div className="dashboard-donut-total"><AnimatedCounter target={processes.filter(p => p.status !== 'na').length} /></div>
              <div className="dashboard-donut-subtitle">Total</div>
            </div>
          </div>
        </div>

        <div className="dashboard-glass-card dashboard-counters-card">
          <h4 className="dashboard-section-title">Status Distribution</h4>
          <div className="dashboard-counter-grid">
            {statEntries.map(({ key, label, color }) => (
              <div key={key} className="dashboard-counter-item">
                <div className="dashboard-counter-value" style={{ color }}>
                  <AnimatedCounter target={stats[key]} />
                </div>
                <div className="dashboard-counter-label">
                  <span className="dashboard-counter-dot" style={{ background: color }} />
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Function sparklines */}
      <div className="dashboard-glass-card dashboard-sparklines-card">
        <h4 className="dashboard-section-title">Health by Function</h4>
        <div className="dashboard-sparklines">
          {(categories || Object.keys(grouped)).map(func => (
            grouped[func] ? <FunctionSparkline key={func} name={func} items={grouped[func]} /> : null
          ))}
        </div>
      </div>
    </div>
  );
}
