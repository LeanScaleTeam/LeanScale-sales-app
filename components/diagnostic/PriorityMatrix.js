import { useMemo, useState } from 'react';

const STATUS_Y = { unable: 90, warning: 70, careful: 40, healthy: 15, na: 5 };
const STATUS_COLORS = {
  healthy: '#22c55e', careful: '#eab308', warning: '#ef4444', unable: '#6b7280', na: '#d1d5db',
};
const SERVICE_IMPORTANCE = { strategic: 85, managed: 60, tactical: 40 };

function getImpactX(item) {
  // Use serviceType as a proxy for impact, with some jitter based on name hash
  const base = SERVICE_IMPORTANCE[item.serviceType] || 50;
  // Simple deterministic jitter from name
  let hash = 0;
  for (let i = 0; i < item.name.length; i++) hash = ((hash << 5) - hash + item.name.charCodeAt(i)) | 0;
  const jitter = ((hash % 30) - 15); // -15 to +15
  return Math.max(5, Math.min(95, base + jitter));
}

function getHealthY(item) {
  const base = STATUS_Y[item.status] || 50;
  let hash = 0;
  for (let i = 0; i < item.name.length; i++) hash = ((hash << 5) - hash + item.name.charCodeAt(i)) | 0;
  const jitter = ((hash % 16) - 8);
  return Math.max(5, Math.min(95, base + jitter));
}

export default function PriorityMatrix({ processes }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const points = useMemo(() => {
    return processes.filter(p => p.status !== 'na').map(item => ({
      ...item,
      x: getImpactX(item),
      y: getHealthY(item),
    }));
  }, [processes]);

  const quadrantCounts = useMemo(() => {
    const q = { fixNow: 0, plan: 0, improve: 0, monitor: 0 };
    for (const p of points) {
      if (p.x >= 50 && p.y >= 50) q.fixNow++;
      else if (p.x >= 50 && p.y < 50) q.plan++;
      else if (p.x < 50 && p.y >= 50) q.improve++;
      else q.monitor++;
    }
    return q;
  }, [points]);

  return (
    <div className="priority-matrix-container">
      <div className="priority-matrix-wrapper">
        {/* Quadrant labels */}
        <div className="matrix-quadrant-labels">
          <div className="matrix-quadrant-label matrix-q-tl">
            <span className="matrix-q-title">Improve</span>
            <span className="matrix-q-count">{quadrantCounts.improve}</span>
          </div>
          <div className="matrix-quadrant-label matrix-q-tr">
            <span className="matrix-q-title">🔥 Fix Now</span>
            <span className="matrix-q-count">{quadrantCounts.fixNow}</span>
          </div>
          <div className="matrix-quadrant-label matrix-q-bl">
            <span className="matrix-q-title">Monitor</span>
            <span className="matrix-q-count">{quadrantCounts.monitor}</span>
          </div>
          <div className="matrix-quadrant-label matrix-q-br">
            <span className="matrix-q-title">Plan</span>
            <span className="matrix-q-count">{quadrantCounts.plan}</span>
          </div>
        </div>

        {/* Chart area */}
        <div className="matrix-chart" style={{ position: 'relative', width: '100%', paddingBottom: '100%', maxWidth: 600, maxHeight: 600 }}>
          <svg
            viewBox="0 0 100 100"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Quadrant backgrounds */}
            <rect x="0" y="0" width="50" height="50" fill="rgba(234,179,8,0.04)" />
            <rect x="50" y="0" width="50" height="50" fill="rgba(239,68,68,0.06)" />
            <rect x="0" y="50" width="50" height="50" fill="rgba(34,197,94,0.04)" />
            <rect x="50" y="50" width="50" height="50" fill="rgba(59,130,246,0.04)" />

            {/* Grid lines */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="#e5e7eb" strokeWidth="0.3" strokeDasharray="2,2" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.3" strokeDasharray="2,2" />

            {/* Dots */}
            {points.map((point, i) => {
              const isSelected = selectedItem?.name === point.name;
              const isHovered = hoveredItem?.name === point.name;
              return (
                <g key={point.name}>
                  {(isSelected || isHovered) && (
                    <circle
                      cx={point.x} cy={point.y} r={3}
                      fill="none"
                      stroke={STATUS_COLORS[point.status]}
                      strokeWidth="0.4"
                      opacity="0.5"
                      className="matrix-dot-ring"
                    />
                  )}
                  <circle
                    cx={point.x} cy={point.y}
                    r={point.addToEngagement ? 2.2 : 1.5}
                    fill={STATUS_COLORS[point.status]}
                    stroke={isSelected ? '#fff' : 'none'}
                    strokeWidth="0.4"
                    opacity={isSelected || isHovered ? 1 : 0.8}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onClick={() => setSelectedItem(isSelected ? null : point)}
                    onMouseEnter={() => setHoveredItem(point)}
                    onMouseLeave={() => setHoveredItem(null)}
                  />
                  {point.addToEngagement && (
                    <circle cx={point.x} cy={point.y} r={3} fill="none" stroke={STATUS_COLORS[point.status]} strokeWidth="0.2" opacity="0.3" />
                  )}
                </g>
              );
            })}
          </svg>

          {/* Axis labels */}
          <div className="matrix-axis-x">Impact →</div>
          <div className="matrix-axis-y">← Health Risk</div>
        </div>
      </div>

      {/* Selected item detail */}
      {(selectedItem || hoveredItem) && (
        <div className="matrix-detail-card">
          <div className="matrix-detail-header">
            <span className="matrix-detail-dot" style={{ background: STATUS_COLORS[(selectedItem || hoveredItem).status] }} />
            <span className="matrix-detail-name">{(selectedItem || hoveredItem).name}</span>
          </div>
          <div className="matrix-detail-meta">
            <span>Function: {(selectedItem || hoveredItem).function}</span>
            <span>Outcome: {(selectedItem || hoveredItem).outcome}</span>
            <span>Status: {(selectedItem || hoveredItem).status}</span>
            {(selectedItem || hoveredItem).addToEngagement && (
              <span className="matrix-detail-priority">⭐ Priority</span>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="matrix-legend">
        <div className="matrix-legend-item">
          <svg width="12" height="12"><circle cx="6" cy="6" r="4" fill="#6b7280" /></svg>
          <span>Standard item</span>
        </div>
        <div className="matrix-legend-item">
          <svg width="16" height="16"><circle cx="8" cy="8" r="5" fill="#6b7280" /><circle cx="8" cy="8" r="7" fill="none" stroke="#6b7280" strokeWidth="1" opacity="0.3" /></svg>
          <span>Priority item</span>
        </div>
      </div>
    </div>
  );
}
