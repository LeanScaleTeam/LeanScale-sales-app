/**
 * HubSpotConnect — OAuth button + connection status badge
 */

export default function HubSpotConnect({ customerId, slug, status }) {
  const isConnected = status?.connected;

  if (isConnected) {
    return (
      <div style={styles.connectedBanner}>
        <div style={styles.connectedIcon}>&#10003;</div>
        <div>
          <div style={styles.connectedTitle}>HubSpot Connected</div>
          <div style={styles.connectedDetail}>
            Portal: {status.portalName || status.portalId}
            {status.signalsReady && ' — CRM data downloaded'}
          </div>
        </div>
      </div>
    );
  }

  const authorizeUrl = `/api/hubspot/authorize?customerId=${customerId}&slug=${slug}`;

  return (
    <div style={styles.connectBanner}>
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={styles.connectTitle}>Connect your HubSpot portal</div>
        <div style={styles.connectDesc}>
          We'll automatically analyze your CRM setup to grade Foundation items.
          This takes about 15 seconds after you authorize.
        </div>
      </div>
      <a href={authorizeUrl} style={styles.connectBtn}>
        Connect HubSpot
      </a>
    </div>
  );
}

const styles = {
  connectedBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: 'var(--status-healthy-bg)',
    border: '1px solid var(--status-healthy)',
    borderRadius: 'var(--radius-md, 8px)',
    marginBottom: '1.5rem',
  },
  connectedIcon: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    background: 'var(--status-healthy)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 'var(--text-sm)',
    flexShrink: 0,
  },
  connectedTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    color: 'var(--status-healthy-text)',
  },
  connectedDetail: {
    fontSize: 'var(--text-xs)',
    color: 'var(--status-healthy-text)',
    opacity: 0.8,
  },
  connectBanner: {
    padding: '1.25rem',
    background: '#FFF7ED',
    border: '1px solid #FDBA74',
    borderRadius: 'var(--radius-md, 8px)',
    marginBottom: '1.5rem',
  },
  connectTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    color: '#9A3412',
  },
  connectDesc: {
    fontSize: 'var(--text-xs)',
    color: '#9A3412',
    opacity: 0.8,
    marginTop: '0.25rem',
  },
  connectBtn: {
    display: 'inline-block',
    padding: '0.5rem 1.25rem',
    background: '#FF7A59',
    color: 'white',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};
