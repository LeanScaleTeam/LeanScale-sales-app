import { useMemo, useState } from 'react';
import { groupBy } from '../../data/diagnostic-registry';

const STATUS_SEVERITY = { unable: 4, warning: 3, careful: 2, healthy: 1, na: 0 };
const STATUS_COLORS = {
  unable: '#ef4444', warning: '#fb923c', careful: '#eab308', healthy: '#22c55e', na: '#e5e7eb', empty: 'transparent',
};
const STATUS_BG = {
  unable: 'rgba(239,68,68,0.15)', warning: 'rgba(251,146,42,0.15)',
  careful: 'rgba(234,179,8,0.12)', healthy: 'rgba(34,197,94,0.1)',
  na: 'rgba(229,231,235,0.3)', empty: 'transparent',
};

function worstStatus(items) {
  if (!items || items.length === 0) return 'empty';
  let worst = 'na';
  for (const item of items) {
    if ((STATUS_SEVERITY[item.status] || 0) > (STATUS_SEVERITY[worst] || 0)) {
      worst = item.status;
    }
  }
  return worst;
}

export default function FunctionHeatmap({ processes, categories, outcomes, onFilterChange }) {
  const [hoveredCell, setHoveredCell] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  const grid = useMemo(() => {
    const data = {};
    for (const p of processes) {
      const func = p.function || 'Other';
      const outcome = p.outcome || 'Other';
      const key = `${func}|${outcome}`;
      if (!data[key]) data[key] = [];
      data[key].push(p);
    }
    return data;
  }, [processes]);

  const funcs = categories || [...new Set(processes.map(p => p.function || 'Other'))];
  const outs = outcomes || [...new Set(processes.map(p => p.outcome || 'Other'))];

  function handleCellClick(func, outcome) {
    const key = `${func}|${outcome}`;
    const items = grid[key];
    if (items && items.length > 0 && onFilterChange) {
      onFilterChange({ function: func, outcome });
    }
  }

  function handleMouseEnter(e, func, outcome) {
    const key = `${func}|${outcome}`;
    const items = grid[key] || [];
    setHoveredCell(key);
    if (items.length > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
        func, outcome, items,
      });
    }
  }

  function handleMouseLeave() {
    setHoveredCell(null);
    setTooltip(null);
  }

  return (
    <div className="heatmap-container">
      <div className="heatmap-scroll">
        <table className="heatmap-table">
          <thead>
            <tr>
              <th className="heatmap-corner">Function / Outcome</th>
              {outs.map(o => (
                <th key={o} className="heatmap-col-header">
                  <span>{o}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {funcs.map(func => (
              <tr key={func}>
                <td className="heatmap-row-header">{func}</td>
                {outs.map(outcome => {
                  const key = `${func}|${outcome}`;
                  const items = grid[key] || [];
                  const status = worstStatus(items);
                  const isHovered = hoveredCell === key;
                  return (
                    <td
                      key={outcome}
                      className={`heatmap-cell ${status !== 'empty' ? 'heatmap-cell-active' : ''} ${isHovered ? 'heatmap-cell-hovered' : ''}`}
                      style={{
                        background: STATUS_BG[status],
                        cursor: items.length > 0 ? 'pointer' : 'default',
                      }}
                      onClick={() => handleCellClick(func, outcome)}
                      onMouseEnter={(e) => handleMouseEnter(e, func, outcome)}
                      onMouseLeave={handleMouseLeave}
                    >
                      {items.length > 0 && (
                        <div className="heatmap-cell-content">
                          <span className="heatmap-cell-dot" style={{ background: STATUS_COLORS[status] }} />
                          <span className="heatmap-cell-count">{items.length}</span>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="heatmap-tooltip"
          style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
            zIndex: 1000,
          }}
        >
          <div className="heatmap-tooltip-header">
            {tooltip.func} → {tooltip.outcome}
          </div>
          <div className="heatmap-tooltip-items">
            {tooltip.items.map(item => (
              <div key={item.name} className="heatmap-tooltip-item">
                <span className="heatmap-tooltip-dot" style={{ background: STATUS_COLORS[item.status] }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
          <div className="heatmap-tooltip-hint">Click to filter table</div>
        </div>
      )}

      {/* Legend */}
      <div className="heatmap-legend">
        {['healthy', 'careful', 'warning', 'unable'].map(s => (
          <div key={s} className="heatmap-legend-item">
            <span className="heatmap-legend-dot" style={{ background: STATUS_COLORS[s] }} />
            <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
