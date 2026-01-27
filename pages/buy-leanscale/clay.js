import Layout from '../../components/Layout';

export default function ClayPartnership() {
  return (
    <Layout title="Clay x LeanScale">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>🏺</span> Clay x LeanScale
          </h1>
        </div>

        {/* Video */}
        <div className="video-container">
          <iframe
            src="https://fast.wistia.net/embed/iframe/YOUR_WISTIA_ID"
            title="Clay x LeanScale"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Partnership Info */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h2 style={{
            background: 'var(--ls-lime-green)',
            display: 'inline-block',
            padding: '0.5rem 1rem',
            fontSize: '1.5rem',
          }}>
            LeanScale | Clay Enterprise Partner
          </h2>
          <p style={{ marginTop: '1rem', fontSize: '1.1rem', maxWidth: 600, margin: '1rem auto' }}>
            LeanScale is one of Clay&apos;s only accredited Enterprise Solution Partners.
          </p>
          <p style={{ fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            Work directly with Clay to implement Clay for the fastest-growing B2B startups.
          </p>
        </div>

        {/* What We Offer */}
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Clay Implementation Services</h2>
          <div className="card-grid">
            <div className="card">
              <h3 className="card-title">Clay Setup & Configuration</h3>
              <p className="card-subtitle">
                Full Clay workspace setup with tables, enrichments, and automations
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">CRM Integration</h3>
              <p className="card-subtitle">
                Bi-directional sync between Clay and Salesforce/HubSpot
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Custom Enrichment Signals</h3>
              <p className="card-subtitle">
                Build custom data enrichment workflows specific to your ICP
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Automated Outbound</h3>
              <p className="card-subtitle">
                End-to-end automated outbound sequences powered by Clay
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
