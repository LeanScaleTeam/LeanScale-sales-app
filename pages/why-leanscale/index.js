import Link from 'next/link';
import Layout from '../../components/Layout';

const sections = [
  { href: '/why-leanscale/about', icon: '👋', label: 'About Us' },
  { href: '/why-leanscale/resources', icon: '📚', label: 'Key Resources' },
  { href: '/why-leanscale/references', icon: '⭐', label: 'Customer References' },
  { href: '/why-leanscale/services', icon: '🛠️', label: 'LeanScale Services Catalog' },
  { href: '/why-leanscale/glossary', icon: '📖', label: 'GTM Ops Glossary' },
];

const keySlides = [
  'The "Capital Clock"',
  'What is GTM Operations?',
  'In-House vs Partner',
  'LeanScale GTM Pod Structure',
  'Working with LeanScale',
];

export default function WhyLeanScale() {
  return (
    <Layout title="Why LeanScale?">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>🌍</span> Why LeanScale?
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

        {/* Key Slides */}
        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Key Slides</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {keySlides.map((slide, i) => (
              <button
                key={i}
                className="button-pill"
                style={{ background: i === 0 ? 'var(--ls-lime-green)' : 'white' }}
              >
                {slide}
              </button>
            ))}
          </div>

          {/* Google Slides Embed */}
          <div className="video-container">
            <iframe
              src="https://docs.google.com/presentation/d/e/YOUR_SLIDES_ID/embed?start=false&loop=false&delayms=3000"
              title="LeanScale Overview Deck"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        </section>
      </div>
    </Layout>
  );
}
