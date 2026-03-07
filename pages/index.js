import Link from 'next/link';
import Layout from '../components/Layout';
import { useCustomer } from '../context/CustomerContext';
import { getCustomerServerSideProps } from '../lib/getCustomer';

export const getServerSideProps = getCustomerServerSideProps;

const stats = [
  { value: '2021', label: 'Founded' },
  { value: '25+', label: 'Team' },
  { value: '100+', label: 'Customers' },
  { value: '148', label: 'Services' },
];

const highlights = [
  { icon: '🏢', text: 'GTM Ops firm for B2B companies' },
  { icon: '🤝', text: 'Work with Mistral, Clio, Anrok, Portnox, etc' },
  { icon: '👥', text: '25+ full-time team members' },
  { icon: '🏆', text: 'Premier partner: Salesforce, Hubspot, Clay' },
];

const quickLinks = [
  {
    title: 'About Us',
    icon: '🎯',
    description: 'Learn why B2B companies choose us',
    links: [
      { href: '/about', label: 'Overview' },
      { href: '/about/references', label: 'Customer References' },
      { href: '/about/services', label: 'Services Catalog' },
    ],
  },
  {
    title: 'Diagnostic',
    icon: '🧪',
    description: 'Get clarity on your GTM engine',
    links: [
      { href: '/diagnostic', label: 'Overview' },
      { href: '/diagnostic/start', label: 'Start Diagnostic' },
      { href: '/diagnostic/gtm', label: 'GTM Diagnostic Demo' },
    ],
  },
  {
    title: 'Getting Started',
    icon: '🚀',
    description: 'Start your engagement',
    links: [
      { href: '/getting-started/availability', label: 'Cohort Availability' },
      { href: '/getting-started/investor-perks', label: 'Investor Perks' },
      { href: '/getting-started/team', label: 'Your Team' },
    ],
  },
];

export default function Home() {
  const { customer, customerPath } = useCustomer();
  const diagnosticType = customer.diagnosticType || 'gtm';
  const diagnosticHref = customer.hasDiagnosticResult
    ? `/diagnostic/${diagnosticType}`
    : '/diagnostic/start';

  return (
    <Layout title="LeanScale">
      <div className="container">
        {/* Header */}
        <div className="page-header" style={{ textAlign: 'center', paddingTop: '2rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
          }}>
            <span style={{ marginRight: '0.5rem' }}>🚀</span> LeanScale
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Top-Tier GTM Operations for B2B Tech Companies
          </p>
        </div>

        {/* Stats Row */}
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Highlights Row */}
        <div className="highlights-grid">
          {highlights.map((item, i) => (
            <div key={i} className="highlight-card">
              <span className="highlight-icon">{item.icon}</span>
              <span className="highlight-text">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Quick Links Grid */}
        <div className="quick-links-grid">
          {quickLinks.map((section) => (
            <div key={section.title} className="card" style={{ padding: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem',
              }}>
                <span style={{ fontSize: '1.5rem' }}>{section.icon}</span>
                <h2 style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  margin: 0,
                }}>
                  {section.title}
                </h2>
              </div>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
              }}>
                {section.description}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {section.links.map((link) => (
                  <Link key={link.href} href={customerPath(link.href)} className="quick-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Video Section */}
        {customer.youtubeVideoId && !customer.youtubeVideoId.includes('YOUR_') && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span>📺</span> LeanScale Overview
            </h3>
            <div className="video-container">
              <iframe
                src={`https://www.youtube.com/embed/${customer.youtubeVideoId}`}
                title="LeanScale Overview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Google Slides Embed */}
        {customer.googleSlidesEmbedUrl && !customer.googleSlidesEmbedUrl.includes('YOUR_') && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span>📊</span> LeanScale Deck
            </h3>
            <div className="video-container">
              <iframe
                src={customer.googleSlidesEmbedUrl}
                title="LeanScale Deck"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Testimonial */}
        <div className="card testimonial-card">
          <p className="testimonial-quote">
            &quot;LeanScale is constantly improving and bringing new ideas to our team. They become part of your team, trustworthy partners.&quot;
          </p>
          <div className="testimonial-author">
            <div className="testimonial-avatar">RL</div>
            <div>
              <a
                href="https://www.linkedin.com/in/rafaelloureiro/"
                target="_blank"
                rel="noopener noreferrer"
                className="testimonial-name"
              >
                Rafael Loureiro
              </a>
              <div className="testimonial-title">CEO, Wealth</div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="cta-banner">
          <h3 className="cta-title">Ready to accelerate your GTM?</h3>
          <p className="cta-subtitle">
            Take our diagnostic to identify the highest-impact opportunities.
          </p>
          <div className="cta-buttons">
            <Link href={customerPath(diagnosticHref)} className="btn cta-btn-primary">
              {customer.hasDiagnosticResult ? 'View Diagnostic' : 'Start Diagnostic'}
            </Link>
            <Link href={customerPath('/getting-started/availability')} className="btn cta-btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
