// Horizontal stacked bar chart for health status visualization

export default function HealthBar({ data, showLegend = true }) {
  // Calculate percentages
  const total = data.healthy + data.careful + data.warning + data.unable;
  const percentages = {
    healthy: ((data.healthy / total) * 100).toFixed(0),
    careful: ((data.careful / total) * 100).toFixed(0),
    warning: ((data.warning / total) * 100).toFixed(0),
    unable: ((data.unable / total) * 100).toFixed(0),
  };

  return (
    <div>
      <div className="health-bar">
        {data.healthy > 0 && (
          <div
            className="health-bar-segment healthy"
            style={{ width: `${percentages.healthy}%` }}
            title={`Healthy: ${data.healthy} (${percentages.healthy}%)`}
          />
        )}
        {data.careful > 0 && (
          <div
            className="health-bar-segment careful"
            style={{ width: `${percentages.careful}%` }}
            title={`Careful: ${data.careful} (${percentages.careful}%)`}
          />
        )}
        {data.warning > 0 && (
          <div
            className="health-bar-segment warning"
            style={{ width: `${percentages.warning}%` }}
            title={`Warning: ${data.warning} (${percentages.warning}%)`}
          />
        )}
        {data.unable > 0 && (
          <div
            className="health-bar-segment unable"
            style={{ width: `${percentages.unable}%` }}
            title={`Unable to Report: ${data.unable} (${percentages.unable}%)`}
          />
        )}
      </div>

      {showLegend && (
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--status-healthy)' }} />
            <span>Healthy ({data.healthy})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--status-careful)' }} />
            <span>Careful ({data.careful})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--status-warning)' }} />
            <span>Warning ({data.warning})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--status-unable)' }} />
            <span>Unable ({data.unable})</span>
          </div>
        </div>
      )}
    </div>
  );
}
