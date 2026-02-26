/**
 * PlaybookTabBar — Tab navigation for the 3-page playbook format
 */

export default function PlaybookTabBar({ tabs, active, onChange }) {
  return (
    <div style={styles.container}>
      {tabs.map(tab => (
        <button
          key={tab.key}
          style={{
            ...styles.tab,
            ...(active === tab.key ? styles.activeTab : {}),
          }}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '0.25rem',
    borderBottom: '2px solid #E2E8F0',
    marginBottom: '1.5rem',
  },
  tab: {
    padding: '0.75rem 1.25rem',
    border: 'none',
    background: 'transparent',
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#718096',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
    transition: 'all 0.15s ease',
  },
  activeTab: {
    color: '#7c3aed',
    borderBottomColor: '#7c3aed',
    fontWeight: 600,
  },
};
