import Layout from '../../components/Layout';

const resources = [
  { title: 'LeanScale Home', type: 'Website', url: 'https://leanscale.team', icon: '🏠' },
  { title: 'LeanScale YouTube Channel', type: 'Video', url: 'https://youtube.com/@leanscale', icon: '📺' },
  { title: 'Services Overview', type: 'Website', url: 'https://leanscale.team/services', icon: '🛠️' },
  { title: 'Intro to LeanScale', type: 'Article', url: '#', icon: '📄' },
  { title: 'Growth Modeling & Capacity Planning', type: 'Video', url: '#', icon: '📈' },
  { title: 'Lean Startups Guide', type: 'Article', url: '#', icon: '📖' },
  { title: 'Ecosystem-Led Growth', type: 'Article', url: '#', icon: '🌱' },
  { title: 'GTM Lifecycle Guide', type: 'Docs', url: '#', icon: '🔄' },
  { title: 'CRM Setup Basics', type: 'Docs', url: '#', icon: '💾' },
  { title: 'Lead Source Playbook', type: 'Docs', url: '#', icon: '🎯' },
  { title: 'Sales Territories Guide', type: 'Docs', url: '#', icon: '🗺️' },
  { title: 'Marketing Dashboards Guide', type: 'Docs', url: '#', icon: '📊' },
];

export default function KeyResources() {
  return (
    <Layout title="Key Resources">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>📚</span> Key Resources
          </h1>
        </div>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {resources.map((resource) => (
            <a
              key={resource.title}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{resource.icon}</div>
              <h3 className="card-title">{resource.title}</h3>
              <span style={{
                display: 'inline-block',
                padding: '0.25rem 0.5rem',
                background: 'var(--ls-light-gray)',
                borderRadius: '4px',
                fontSize: '0.75rem',
                marginTop: '0.5rem',
              }}>
                {resource.type}
              </span>
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
}
