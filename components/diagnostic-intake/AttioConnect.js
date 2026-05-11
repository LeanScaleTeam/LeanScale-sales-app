/**
 * AttioConnect — OAuth button + connection status badge for Attio.
 */

export default function AttioConnect({ customerId, slug, status, onSaveAllAnswers }) {
  const isConnected = status?.connected;

  if (isConnected) {
    return (
      <div style={styles.connectedBanner}>
        <div style={styles.connectedIcon}>&#10003;</div>
        <div>
          <div style={styles.connectedTitle}>Attio Connected</div>
          <div style={styles.connectedDetail}>
            Workspace: {status.workspaceName || status.workspaceId}
            {status.signalsReady && ' — CRM data downloaded'}
          </div>
        </div>
      </div>
    );
  }

  const authorizeUrl = `/api/attio/authorize?customerId=${customerId}&slug=${slug}`;

  const handleConnect = async (e) => {
    if (onSaveAllAnswers) {
      e.preventDefault();
      await onSaveAllAnswers();
      window.location.href = authorizeUrl;
    }
  };

  return (
    <div style={styles.connectBanner}>
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={styles.connectTitle}>Connect your Attio workspace</div>
        <div style={styles.connectDesc}>
          We&apos;ll analyze your data model, lists, webhooks, and workspace members
          to pre-fill the diagnostic. This takes about 15 seconds after you authorize.
        </div>
      </div>
      <a href={authorizeUrl} onClick={handleConnect} style={styles.connectBtn}>
        Connect Attio
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
    background: '#EEF2FF',
    border: '1px solid #818CF8',
    borderRadius: 'var(--radius-md, 8px)',
    marginBottom: '1.5rem',
  },
  connectTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    color: '#3730A3',
  },
  connectDesc: {
    fontSize: 'var(--text-xs)',
    color: '#3730A3',
    opacity: 0.8,
    marginTop: '0.25rem',
  },
  connectBtn: {
    display: 'inline-block',
    padding: '0.5rem 1.25rem',
    background: '#4F46E5',
    color: 'white',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};
