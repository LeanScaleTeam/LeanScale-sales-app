import Layout from '../../components/Layout';

export default function InvestorPerks() {
  return (
    <Layout title="Investor Perks">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>🏆</span> Investor Perks
          </h1>
          <p className="page-subtitle">Helping Portcos Scale Faster</p>
        </div>

        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 2rem' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--ls-purple)', fontWeight: 500 }}>
            Complimentary Support for Your Portcos from the GTM Ops team behind some of the fastest growing names in B2B tech
          </p>
        </div>

        {/* Video */}
        <div className="video-container">
          <iframe
            src="https://fast.wistia.net/embed/iframe/YOUR_WISTIA_ID"
            title="LeanScale GTM Pods"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Perks List */}
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>What&apos;s Included</h2>
          <div className="card-grid">
            <div className="card">
              <h3 className="card-title">Free GTM Diagnostic</h3>
              <p className="card-subtitle">
                Comprehensive assessment of your portco&apos;s GTM operations health
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Priority Onboarding</h3>
              <p className="card-subtitle">
                Skip the waitlist with dedicated capacity for investor portfolio companies
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Discounted Rates</h3>
              <p className="card-subtitle">
                Special pricing for portfolio companies on all engagement tiers
              </p>
            </div>
            <div className="card">
              <h3 className="card-title">Quarterly Check-ins</h3>
              <p className="card-subtitle">
                Regular updates on portco progress and GTM health metrics
              </p>
            </div>
          </div>
        </section>

        {/* Client Logos */}
        <section style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Trusted By Leading Startups</h2>
          <p style={{ color: '#666' }}>
            Clio • Mistral AI • Chaingage • Human • SpyCloud • Anrok • Data Zoo • Wealth.com • and more
          </p>
        </section>
      </div>
    </Layout>
  );
}
