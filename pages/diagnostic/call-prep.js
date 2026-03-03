/**
 * Discovery Call Prep Sheet
 * URL: /c/[slug]/diagnostic/call-prep (via middleware rewrite)
 *
 * Auto-generated printable prep sheet with company snapshot,
 * discovery questions, and gap-specific probes.
 */

import { useState, useEffect } from 'react';
import { getCustomerServerSideProps } from '../../lib/getCustomer';
import { CustomerProvider, useCustomer } from '../../context/CustomerContext';
import Layout from '../../components/Layout';

export const getServerSideProps = getCustomerServerSideProps;

export default function CallPrepPage({ customer }) {
  return (
    <CustomerProvider initialCustomer={customer}>
      <Layout title="Discovery Call Prep">
        <CallPrepContent />
      </Layout>
    </CustomerProvider>
  );
}

function CallPrepContent() {
  const { customer } = useCustomer();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!customer?.id) return;

    async function load() {
      try {
        const res = await fetch('/api/diagnostic/call-prep', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId: customer.id }),
        });
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        } else {
          setError(json.error || 'Failed to generate call prep');
        }
      } catch (err) {
        setError('Failed to load call prep data');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [customer?.id]);

  if (loading) {
    return <div style={styles.loading}>Generating call prep sheet...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (!data) {
    return <div style={styles.error}>No data available</div>;
  }

  const { snapshot, questions, gaps } = data;

  return (
    <div style={styles.container}>
      {/* Print button (hidden in print) */}
      <div style={styles.printBar} className="no-print">
        <button style={styles.printBtn} onClick={() => window.print()}>
          Print / Save as PDF
        </button>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Discovery Call Prep</h1>
        <p style={styles.subtitle}>{customer?.customerName}</p>
        <p style={styles.date}>{new Date().toLocaleDateString()}</p>
      </div>

      {/* Part 1: Company Snapshot */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Company Snapshot</h2>
        <div style={styles.snapshotGrid}>
          <SnapshotItem label="CRM" value={snapshot.crm} />
          {snapshot.arr && <SnapshotItem label="ARR" value={snapshot.arr} />}
          <SnapshotItem label="GTM Motion" value={snapshot.gtmMotion} />
          <SnapshotItem label="Users" value={snapshot.userCount} />
          {snapshot.activeLogins && <SnapshotItem label="Active Logins" value={snapshot.activeLogins} />}
          <SnapshotItem label="Opp Stages" value={snapshot.oppStages} />
          <SnapshotItem label="Flows" value={snapshot.flowCount} />
          <SnapshotItem label="Validation Rules" value={snapshot.validationRuleCount} />
          <SnapshotItem label="Reports" value={snapshot.reportCount} />
          <SnapshotItem label="Dashboards" value={snapshot.dashboardCount} />
          <SnapshotItem label="Packages" value={snapshot.packageCount} />
        </div>

        {snapshot.techStack && snapshot.techStack.length > 0 && (
          <div style={styles.techStack}>
            <span style={styles.techLabel}>Tech Stack:</span>
            <div style={styles.techTags}>
              {snapshot.techStack.map((pkg, i) => (
                <span key={i} style={styles.techTag}>{pkg}</span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Part 2: Discovery Questions */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Discovery Questions</h2>
        {questions.map((group) => (
          <div key={group.topic} style={styles.questionGroup}>
            <h3 style={styles.topicTitle}>{group.topic}</h3>
            <ol style={styles.questionList}>
              {group.items.map((item, i) => (
                <li key={i} style={styles.questionItem}>
                  <span style={styles.question}>{item.question}</span>
                  <span style={styles.mapsTo}>{item.mapsTo}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </section>

      {/* Part 3: Gaps to Probe */}
      {gaps.length > 0 && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Gaps to Probe</h2>
          <div style={styles.gapList}>
            {gaps.map((gap, i) => (
              <div key={i} style={styles.gapItem}>
                <div style={styles.gapHeader}>
                  <span style={{
                    ...styles.severityBadge,
                    backgroundColor: gap.severity === 'warning' ? '#F6AD55' : '#FC8181',
                  }}>
                    {gap.severity === 'warning' ? '\u26A0' : '\u2757'}
                  </span>
                  <span style={styles.gapSignal}>{gap.signal}</span>
                  {gap.competencyId && (
                    <span style={styles.gapCompId}>{gap.competencyId}</span>
                  )}
                </div>
                <p style={styles.gapProbe}>Ask: {gap.probeQuestion}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SnapshotItem({ label, value }) {
  return (
    <div style={styles.snapshotItem}>
      <span style={styles.snapshotLabel}>{label}</span>
      <span style={styles.snapshotValue}>{value ?? '—'}</span>
    </div>
  );
}

// ── Styles ──

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem 1rem',
    color: '#718096',
    fontSize: '1rem',
  },
  error: {
    textAlign: 'center',
    padding: '4rem 1rem',
    color: '#E53E3E',
    fontSize: '1rem',
  },
  printBar: {
    textAlign: 'right',
    marginBottom: '1rem',
  },
  printBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    background: 'white',
    color: '#4A5568',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  header: {
    borderBottom: '2px solid #E2E8F0',
    paddingBottom: '1rem',
    marginBottom: '1.5rem',
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1A202C',
  },
  subtitle: {
    margin: '0 0 0.25rem',
    fontSize: '1.1rem',
    color: '#4A5568',
  },
  date: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#A0AEC0',
  },
  section: {
    marginBottom: '2rem',
    pageBreakInside: 'avoid',
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#2D3748',
    borderBottom: '1px solid #E2E8F0',
    paddingBottom: '0.5rem',
    marginBottom: '1rem',
  },
  snapshotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  snapshotItem: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    background: '#F7FAFC',
    border: '1px solid #EDF2F7',
  },
  snapshotLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#A0AEC0',
    textTransform: 'uppercase',
    marginBottom: '0.2rem',
  },
  snapshotValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#2D3748',
  },
  techStack: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
    marginTop: '0.5rem',
  },
  techLabel: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#718096',
    flexShrink: 0,
    paddingTop: '0.2rem',
  },
  techTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
  },
  techTag: {
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    background: '#EBF4FF',
    color: '#3182CE',
    fontSize: '0.7rem',
    fontWeight: 500,
  },
  questionGroup: {
    marginBottom: '1.5rem',
  },
  topicTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#4A5568',
    marginBottom: '0.5rem',
  },
  questionList: {
    margin: 0,
    paddingLeft: '1.5rem',
  },
  questionItem: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    lineHeight: 1.4,
  },
  question: {
    fontSize: '0.9rem',
    color: '#2D3748',
    flex: 1,
  },
  mapsTo: {
    fontSize: '0.65rem',
    fontFamily: 'monospace',
    color: '#A0AEC0',
    flexShrink: 0,
  },
  gapList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  gapItem: {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #FED7D7',
    background: '#FFF5F5',
  },
  gapHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.35rem',
  },
  severityBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.4rem',
    height: '1.4rem',
    borderRadius: '50%',
    fontSize: '0.7rem',
    flexShrink: 0,
  },
  gapSignal: {
    fontSize: '0.85rem',
    fontWeight: 500,
    color: '#2D3748',
    flex: 1,
  },
  gapCompId: {
    fontSize: '0.65rem',
    fontFamily: 'monospace',
    color: '#A0AEC0',
    flexShrink: 0,
  },
  gapProbe: {
    margin: 0,
    marginLeft: '1.9rem',
    fontSize: '0.85rem',
    color: '#4A5568',
    fontStyle: 'italic',
  },
};
