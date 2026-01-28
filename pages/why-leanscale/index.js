import Link from 'next/link';
import Layout from '../../components/Layout';

const navLinks = [
  { href: '#capital-clock', label: 'The "Capital Clock"' },
  { href: '#what-is-gtm-ops', label: 'What is GTM Operations?' },
  { href: '#in-house-vs-partner', label: 'In-House vs Partner' },
  { href: '#pod-structure', label: 'LeanScale GTM Pod Structure' },
  { href: '#working-with-leanscale', label: 'Working with LeanScale' },
];

const sections = [
  { href: '/why-leanscale/about', icon: '👋', label: 'About Us' },
  { href: '/why-leanscale/resources', icon: '📚', label: 'Key Resources' },
  { href: '/why-leanscale/references', icon: '⭐', label: 'Customer References' },
  { href: '/why-leanscale/services', icon: '🛠️', label: 'Services Catalog' },
  { href: '/why-leanscale/glossary', icon: '📖', label: 'GTM Ops Glossary' },
];

export default function WhyLeanScale() {
  return (
    <Layout title="Why LeanScale?">
      <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: 'white', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '800px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem' }}>
              Go-to-Market Operations <span style={{ fontSize: '2.5rem' }}>🚀</span>
            </h1>
            <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>
              Accelerate Your Go-To-Market with Top-Tier GTM Operations. LeanScale provides fractional GTM Operations teams 
              for B2B tech startups, delivering enterprise-grade revenue operations without the enterprise price tag.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/buy-leanscale">
                <button className="btn" style={{ background: 'white', color: '#7c3aed', padding: '0.75rem 1.5rem', fontWeight: 600 }}>
                  Get Started
                </button>
              </Link>
              <Link href="/try-leanscale">
                <button className="btn" style={{ background: 'transparent', color: 'white', border: '2px solid white', padding: '0.75rem 1.5rem' }}>
                  Try GTM Diagnostic
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-2rem' }}>
        <div className="card" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', padding: '1rem 1.5rem', justifyContent: 'center' }}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} style={{ padding: '0.5rem 1rem', color: '#7c3aed', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', borderRadius: '20px', background: '#f3f4f6' }}>
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="container" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {sections.map((section) => (
            <Link key={section.href} href={section.href} className="button-pill">
              <span>{section.icon}</span> {section.label}
            </Link>
          ))}
        </div>

        <section id="capital-clock" style={{ marginBottom: '4rem', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⏰</span> The "Capital Clock"
          </h2>
          <div className="card" style={{ padding: '2rem' }}>
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
              For every B2B startup, the clock starts ticking the moment you raise capital. You have 18-24 months to prove 
              product-market fit, build repeatable revenue, and set up for your next milestone. LeanScale gives you a 
              battle-tested GTM operations team from day one.
            </p>
            <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden' }}>
              <img 
                src="/images/capital-clock-screenshot.png" 
                alt="The Capital Clock - GTM Operations Roadmap from Seed to Series D+"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
              />
            </div>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px', borderLeft: '4px solid #7c3aed' }}>
              <strong style={{ color: '#7c3aed' }}>Key Insight:</strong> Companies that invest in GTM operations early 
              see 40% faster pipeline velocity and 30% higher conversion rates within the first year.
            </div>
          </div>
        </section>

        <section id="what-is-gtm-ops" style={{ marginBottom: '4rem', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚙️</span> What is GTM Operations?
          </h2>
          <div className="card" style={{ padding: '2rem' }}>
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7, maxWidth: '800px' }}>
              GTM Operations (also known as Revenue Operations or RevOps) is the operational backbone that connects 
              your Marketing, Sales, and Customer Success teams. It covers Planning, Process, Systems, Reporting, and Enablement 
              across all revenue functions.
            </p>
            <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <img 
                src="/images/gtm-ops-screenshot.png" 
                alt="GTM Ops Matrix - The Full Stack View"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#7c3aed' }}>148</div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Services Available</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#7c3aed' }}>68</div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Detailed Playbooks</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#7c3aed' }}>5</div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>GTM Functions</div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>📋</span> LeanScale GTM Ops Projects
          </h2>
          <div className="card" style={{ padding: '2rem' }}>
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
              Each project can be leveraged to improve go-to-market performance across Cross Functional, Sales, Marketing, 
              Customer Success, and Partnerships.
            </p>
            <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden' }}>
              <img 
                src="/images/gtm-ops-projects-screenshot.png" 
                alt="LeanScale GTM Ops Projects by Function"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
              />
            </div>
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link href="/why-leanscale/services">
                <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                  View Full Services Catalog →
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section id="in-house-vs-partner" style={{ marginBottom: '4rem', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚖️</span> In-House vs Partner
          </h2>
          <div className="card" style={{ padding: '2rem' }}>
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
              The build vs. buy decision is critical for startups. Here's why partnering with LeanScale gives you 
              the best of both worlds — expertise, speed, and cost efficiency.
            </p>
            <div style={{ background: '#e9d8f4', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <img 
                src="/images/in-house-vs-partner-screenshot.png" 
                alt="In-House vs LeanScale Comparison - Playbooks, Adaptability, Talent, Speed, Focus, Cost"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
              />
            </div>
            <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden' }}>
              <img 
                src="/images/grow-efficiently-screenshot.png" 
                alt="Grow quickly and efficiently through each stage - The Old Way vs The New Way"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
              />
            </div>
          </div>
        </section>

        <section id="pod-structure" style={{ marginBottom: '4rem', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👥</span> LeanScale GTM Pod Structure
          </h2>
          <div className="card" style={{ padding: '2rem' }}>
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7, textAlign: 'center', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
              Build the best 0 FTE GTM Ops Org. Your dedicated team is backed by our Center of Excellence with specialists 
              across RevOps, CS Ops, Sales Ops, Marketing Ops, Partner Ops, and Pipeline Ops.
            </p>
            <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden' }}>
              <img 
                src="/images/pod-structure-screenshot.png" 
                alt="Build The Best 0 FTE GTM Ops Org - Your Dedicated Team backed by Center of Excellence"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
              />
            </div>
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link href="/buy-leanscale/team">
                <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                  Meet Your Team →
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section id="working-with-leanscale" style={{ marginBottom: '4rem', scrollMarginTop: '100px' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🤝</span> Working with LeanScale
          </h2>
          <div className="card" style={{ padding: '2rem' }}>
            <p style={{ marginBottom: '1.5rem', lineHeight: 1.7, textAlign: 'center', maxWidth: '700px', margin: '0 auto 1.5rem' }}>
              A Week in the Life with your LeanScale Team. See how our dedicated partners, architects, and engineers 
              work together throughout the week to deliver results.
            </p>
            <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <img 
                src="/images/working-with-leanscale-screenshot.png" 
                alt="A Week in the Life with your LeanScale Team - Series A Example"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
              />
            </div>
            <div style={{ background: '#f3f4f6', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden' }}>
              <img 
                src="/images/highest-value-projects-screenshot.png" 
                alt="Quickly Address Poor Performance With The Highest Value Projects"
                style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Response Time</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7c3aed' }}>&lt; 4 hours</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Weekly Syncs</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7c3aed' }}>1-2 calls</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Communication</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7c3aed' }}>Slack + Loom</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>Project Tracking</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7c3aed' }}>Shared Board</div>
              </div>
            </div>
          </div>
        </section>

        <div className="card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: 'white', textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Ready to Accelerate Your GTM?</h3>
          <p style={{ margin: '0 0 1.5rem 0', opacity: 0.9 }}>Start with a GTM Diagnostic or schedule time to discuss your needs.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/try-leanscale">
              <button className="btn" style={{ background: 'white', color: '#7c3aed', border: 'none', padding: '0.75rem 1.5rem', fontWeight: 600 }}>
                Take GTM Diagnostic
              </button>
            </Link>
            <Link href="/buy-leanscale">
              <button className="btn" style={{ background: 'transparent', color: 'white', border: '2px solid white', padding: '0.75rem 1.5rem' }}>
                Start Engagement
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
