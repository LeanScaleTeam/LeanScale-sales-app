export default function HealthBar({ data, showLegend = true, showPercentages = true }) {
  const total = data.healthy + data.careful + data.warning + data.unable;
  if (total === 0) return null;

  const percentages = {
    healthy: ((data.healthy / total) * 100).toFixed(0),
    careful: ((data.careful / total) * 100).toFixed(0),
    warning: ((data.warning / total) * 100).toFixed(0),
    unable: ((data.unable / total) * 100).toFixed(0),
  };

  const segments = [
    { key: 'healthy', label: 'Healthy', color: '#22c55e', count: data.healthy, pct: percentages.healthy },
    { key: 'careful', label: 'Careful', color: '#eab308', count: data.careful, pct: percentages.careful },
    { key: 'warning', label: 'Warning', color: '#ef4444', count: data.warning, pct: percentages.warning },
    { key: 'unable', label: 'Unable', color: '#1f2937', count: data.unable, pct: percentages.unable },
  ].filter(s => s.count > 0);

  return (
    <div>
      {showPercentages && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
          {segments.map(s => (
            <span key={s.key}>{s.count} ({s.pct}%) {s.label}</span>
          ))}
        </div>
      )}

      <div style={{
        display: 'flex',
        height: '24px',
        borderRadius: '6px',
        overflow: 'hidden',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
      }}>
        {segments.map((s, i) => (
          <div
            key={s.key}
            style={{
              width: `${s.pct}%`,
              background: s.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: s.key === 'careful' ? '#1f2937' : 'white',
              fontSize: '0.7rem',
              fontWeight: 600,
              minWidth: s.count > 0 ? '20px' : '0',
              transition: 'width 0.3s ease',
            }}
            title={`${s.label}: ${s.count} (${s.pct}%)`}
          >
            {parseInt(s.pct) >= 10 && s.count}
          </div>
        ))}
      </div>

      {showLegend && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
          {segments.map(s => (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
              <span style={{ color: '#374151' }}>{s.label} ({s.count})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
