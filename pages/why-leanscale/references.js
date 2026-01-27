import Layout from '../../components/Layout';

const references = [
  {
    name: 'Michael Dzik',
    role: 'Partner',
    company: 'Radian Capital',
    segment: 'Investor',
    quote: 'LeanScale has been instrumental in helping our portfolio companies scale their GTM operations efficiently.',
    url: '#',
  },
  {
    name: 'Thomas Miller',
    role: 'VP Revenue Operations',
    company: 'Human',
    segment: 'Series B',
    quote: 'The team at LeanScale became an extension of our own. Their expertise accelerated our growth.',
    url: '#',
  },
  {
    name: 'Donal Tobin',
    role: 'CEO',
    company: 'Integrate.io',
    segment: 'Series A',
    quote: 'Working with LeanScale gave us the operational foundation we needed to scale.',
    url: '#',
  },
  {
    name: 'Amy De Salvatore',
    role: 'Operating Partner',
    company: 'NightDragon',
    segment: 'Investor',
    quote: 'We recommend LeanScale to all our portfolio companies looking to build best-in-class GTM operations.',
    url: '#',
  },
  {
    name: 'Tim White',
    role: 'COO',
    company: 'Wealth.com',
    segment: 'Series B',
    quote: 'LeanScale helped us go from startup chaos to scalable processes in record time.',
    url: '#',
  },
];

export default function CustomerReferences() {
  return (
    <Layout title="Customer References">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>⭐</span> Customer References
          </h1>
        </div>

        <div className="data-table" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--ls-light-gray)' }}>Name</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--ls-light-gray)' }}>Role</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--ls-light-gray)' }}>Company</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--ls-light-gray)' }}>Segment</th>
                <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid var(--ls-light-gray)' }}>Quote</th>
              </tr>
            </thead>
            <tbody>
              {references.map((ref, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--ls-light-gray)' }}>
                  <td style={{ padding: '0.75rem' }}>
                    <a href={ref.url} style={{ color: 'var(--ls-purple)', fontWeight: 500 }}>{ref.name}</a>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{ref.role}</td>
                  <td style={{ padding: '0.75rem' }}>{ref.company}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      background: ref.segment === 'Investor' ? '#dbeafe' : '#dcfce7',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                    }}>
                      {ref.segment}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontStyle: 'italic', maxWidth: 300 }}>
                    &quot;{ref.quote.substring(0, 50)}...&quot;
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
