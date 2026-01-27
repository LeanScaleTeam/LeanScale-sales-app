import Layout from '../../components/Layout';

const values = ['Integrity', 'Humility', 'Taking action', 'Challenging yourself and others'];

const differentiators = [
  {
    title: 'Startup Operator Experience',
    description: 'Our team has built and scaled GTM operations at startups from Series A to IPO.',
  },
  {
    title: 'Proactive Approach',
    description: 'We don\'t wait for problems—we anticipate them and build solutions before they become blockers.',
  },
  {
    title: 'Assigned Team Members',
    description: 'You work with dedicated team members who know your business, not a rotating cast of consultants.',
  },
  {
    title: 'Broad Scope and Capabilities',
    description: 'From strategy to implementation, we cover the full spectrum of GTM operations needs.',
  },
];

export default function AboutUs() {
  return (
    <Layout title="About Us">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>👋</span> About Us
          </h1>
        </div>

        {/* Mission */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.7, maxWidth: 800 }}>
            To attract and develop the world&apos;s best startup operators and help startups,
            their people, and their investors succeed.
          </p>
        </section>

        {/* Values */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Our Values</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {values.map((value) => (
              <div
                key={value}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--ls-lime-green)',
                  borderRadius: '8px',
                  fontWeight: 500,
                }}
              >
                {value}
              </div>
            ))}
          </div>
        </section>

        {/* Differentiators */}
        <section>
          <h2 style={{ marginBottom: '1.5rem' }}>What Sets Us Apart</h2>
          <div className="card-grid">
            {differentiators.map((item) => (
              <div key={item.title} className="card">
                <h3 className="card-title">{item.title}</h3>
                <p className="card-subtitle">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
