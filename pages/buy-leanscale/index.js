import Link from 'next/link';
import Layout from '../../components/Layout';

const sections = [
  { href: '/buy-leanscale/investor-perks', icon: '🏆', label: 'Investor Perks' },
  { href: '/buy-leanscale/one-time-projects', icon: '📋', label: 'One-Time Projects' },
  { href: '/buy-leanscale/clay', icon: '🏺', label: 'Clay x LeanScale' },
  { href: '/buy-leanscale/security', icon: '🔒', label: 'Security' },
  { href: '/buy-leanscale/team', icon: '👤', label: 'Your Team' },
  { href: '/buy-leanscale/availability', icon: '📅', label: 'Available Start Dates' },
  { href: '/buy-leanscale/calculator', icon: '🧮', label: 'Engagement Calculator' },
  { href: '/buy-leanscale/start', icon: '⚡', label: 'Getting Started' },
];

export default function BuyLeanScale() {
  return (
    <Layout title="Buy LeanScale">
      {/* Hero */}
      <div className="hero">
        <div className="hero-content">
          <img src="/leanscale-logo.svg" alt="LeanScale" className="hero-logo" />
          <h1 className="hero-tagline">
            Accelerate Your Go-To-Market with Top-Tier GTM Operations
          </h1>
        </div>
      </div>

      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>🛒</span> Buy LeanScale
          </h1>
        </div>

        {/* Section Buttons */}
        <div className="button-grid">
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="button-pill">
              <span>{section.icon}</span> {section.label}
            </Link>
          ))}
        </div>

        {/* Video */}
        <div className="video-container" style={{ marginTop: '2rem' }}>
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="LeanScale | GTM Ops for Hypergrowth Startups"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </Layout>
  );
}
