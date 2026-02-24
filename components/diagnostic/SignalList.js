/**
 * SignalList — Renders signals with positive/negative/neutral indicators.
 *
 * Signals are evidence from the CRM metadata or intake answers
 * that contributed to an item's grade.
 */

const INDICATOR_STYLES = {
  positive: { color: 'var(--status-healthy)', symbol: '+' },
  negative: { color: 'var(--status-warning)', symbol: '-' },
  neutral: { color: 'var(--text-muted)', symbol: '~' },
};

function classifySignal(signal) {
  if (typeof signal === 'object' && signal.type) return signal.type;
  // Heuristic: strings starting with "No " or "Missing" are negative
  const text = typeof signal === 'string' ? signal : signal.label || '';
  if (/^(No |Missing |Unable |0 |None)/i.test(text)) return 'negative';
  if (/\b(found|detected|present|active|configured|automated)\b/i.test(text)) return 'positive';
  return 'neutral';
}

export default function SignalList({ signals }) {
  if (!signals || signals.length === 0) return null;

  return (
    <div style={styles.container}>
      <div style={styles.heading}>Signals</div>
      <ul style={styles.list}>
        {signals.map((signal, i) => {
          const text = typeof signal === 'string' ? signal : signal.label || JSON.stringify(signal);
          const type = classifySignal(signal);
          const ind = INDICATOR_STYLES[type];

          return (
            <li key={i} style={styles.item}>
              <span style={{ ...styles.indicator, color: ind.color }}>{ind.symbol}</span>
              <span style={styles.text}>{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '0.5rem',
  },
  heading: {
    fontSize: 'var(--text-2xs)',
    fontWeight: 'var(--font-semibold)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-muted)',
    marginBottom: '0.25rem',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.375rem',
    padding: '0.125rem 0',
    fontSize: 'var(--text-xs)',
    lineHeight: 1.4,
  },
  indicator: {
    fontWeight: 'var(--font-bold)',
    fontSize: 'var(--text-sm)',
    flexShrink: 0,
    width: '0.875rem',
    textAlign: 'center',
  },
  text: {
    color: 'var(--text-secondary)',
  },
};
