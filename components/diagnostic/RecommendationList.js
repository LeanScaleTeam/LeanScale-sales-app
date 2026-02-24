/**
 * RecommendationList — Recommendations linked to the service catalog.
 */

export default function RecommendationList({ recommendations, serviceIds, onServiceClick }) {
  if ((!recommendations || recommendations.length === 0) && (!serviceIds || serviceIds.length === 0)) {
    return null;
  }

  return (
    <div style={styles.container}>
      {recommendations && recommendations.length > 0 && (
        <>
          <div style={styles.heading}>Recommendations</div>
          <ul style={styles.list}>
            {recommendations.map((rec, i) => (
              <li key={i} style={styles.item}>{rec}</li>
            ))}
          </ul>
        </>
      )}

      {serviceIds && serviceIds.length > 0 && (
        <div style={styles.services}>
          <div style={styles.servicesLabel}>Related services:</div>
          <div style={styles.serviceChips}>
            {serviceIds.map((sid) => (
              <button
                key={sid}
                onClick={() => onServiceClick?.(sid)}
                style={styles.chip}
              >
                {sid.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '0.75rem',
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
    fontSize: 'var(--text-xs)',
    color: 'var(--text-secondary)',
    padding: '0.2rem 0',
    paddingLeft: '0.75rem',
    position: 'relative',
  },
  services: {
    marginTop: '0.5rem',
  },
  servicesLabel: {
    fontSize: 'var(--text-2xs)',
    color: 'var(--text-muted)',
    marginBottom: '0.25rem',
  },
  serviceChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.375rem',
  },
  chip: {
    fontSize: 'var(--text-2xs)',
    padding: '0.15rem 0.5rem',
    background: 'var(--gray-100)',
    color: 'var(--ls-purple)',
    border: '1px solid var(--border-color)',
    borderRadius: '9999px',
    cursor: 'pointer',
    textTransform: 'capitalize',
    transition: 'background 0.15s',
  },
};
