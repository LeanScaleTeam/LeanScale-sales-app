import Link from 'next/link';
import Layout from '../../components/Layout';

export default function TryLeanScale() {
  return (
    <Layout title="Try LeanScale">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>🧪</span> Try LeanScale
          </h1>
          <p className="page-subtitle">Get Clarity On Your GTM Engine</p>
        </div>

        {/* CTA Buttons */}
        <div className="button-grid" style={{ marginBottom: '2rem' }}>
          <Link href="/try-leanscale/start" className="button-pill" style={{ background: 'var(--ls-lime-green)' }}>
            <span>🚀</span> Start Diagnostic
          </Link>
          <Link href="/try-leanscale/diagnostic" className="button-pill">
            <span>📊</span> GTM Diagnostic
          </Link>
        </div>

        {/* Video */}
        <div className="video-container">
          <iframe
            src="https://fast.wistia.net/embed/iframe/38bjmcwsau"
            title="GTM VSL"
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>

        {/* What is the Diagnostic */}
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>What is the GTM Diagnostic?</h2>
          <p style={{ lineHeight: 1.7, marginBottom: '1rem' }}>
            The GTM Diagnostic is a comprehensive assessment of your go-to-market operations health.
            We evaluate 63 processes, 10 key metrics, and 17 tool categories to give you a clear picture
            of where you stand and where you need to invest.
          </p>
          <div className="card-grid">
            <div className="card">
              <h3 className="card-title">63 Process Inspection Points</h3>
              <p className="card-subtitle">Covering marketing, sales, customer success, and partnerships</p>
            </div>
            <div className="card">
              <h3 className="card-title">Power10 Metrics</h3>
              <p className="card-subtitle">The 10 metrics that matter most for GTM success</p>
            </div>
            <div className="card">
              <h3 className="card-title">17 Tool Categories</h3>
              <p className="card-subtitle">Assessment of your GTM tech stack health</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
