import Link from 'next/link';
import Layout from '../components/Layout';
import { useCustomer } from '../context/CustomerContext';
import { getCustomerServerSideProps } from '../lib/getCustomer';

export const getServerSideProps = getCustomerServerSideProps;

const stats = [
  { value: '2021', label: 'Founded' },
  { value: '25+', label: 'Team' },
  { value: '100+', label: 'Customers' },
  { value: '68', label: 'Playbooks' },
];

const services = [
  {
    icon: '\u{1F680}',
    title: 'GTM Launch',
    price: '$75K',
    description: 'Full-stack GTM infrastructure in 8 weeks. Purpose-built agents, prescriptive playbooks, and 11+ executive dashboards — everything you need to go from zero to operational.',
    href: '/getting-started/ultimate-gtm',
    borderColor: '#a855f7',
  },
  {
    icon: '\u{1F91D}',
    title: 'GTM Embedded',
    price: 'Custom',
    description: 'Dedicated GTM operators embedded in your team. Custom engagements with rolling 90-day outs — exactly how we sell today, tailored to your needs.',
    href: '/getting-started/embedded',
    borderColor: '#7c3aed',
  },
];

const testimonials = [
  {
    quote: 'This team has done an incredible job with our portcos. They\'re ready to engage the second we make an investment and give our founders the best shot at winning.',
    author: 'Michael Dzik',
    title: 'Growth Partner, Radian Capital',
    initials: 'MD',
  },
  {
    quote: 'This is the most competent team I\'ve ever worked with. They know exactly what to do and how to tailor it to your business.',
    author: 'Thomas Miller',
    title: 'CRO, Human',
    initials: 'TM',
  },
  {
    quote: 'LeanScale had us live on Salesforce in 30 days. Our reps were logging deals by week two. The speed was unreal, but what impressed us most was how tailored it was to our process.',
    author: 'Donal Tobin',
    title: 'CEO, Integrate.io',
    initials: 'DT',
  },
];

const clients = [
  { name: 'Mistral', logo: '/images/logos/mistral.svg' },
  { name: 'Chainguard', logo: '/images/logos/chainguard.svg' },
  { name: 'Clio', logo: '/images/logos/clio.svg' },
  { name: 'AssemblyAI', logo: '/images/logos/assemblyai.svg' },
  { name: 'CB Insights', logo: '/images/logos/cbinsights.svg' },
  { name: 'Wealth.com', logo: '/images/logos/wealth.svg' },
];

export default function Home() {
  const { customer, customerPath } = useCustomer();
  const diagnosticType = customer.diagnosticType || 'gtm';
  const diagnosticHref = customer.hasDiagnosticResult
    ? `/diagnostic/${diagnosticType}`
    : '/diagnostic/start';

  return (
    <Layout title="LeanScale">

      {/* HERO */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        color: 'white',
        padding: '5rem 0 3rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '15%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(163,230,53,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: '9999px',
            padding: '0.4rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            color: '#c4b5fd',
            letterSpacing: '0.05em',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a3e635', boxShadow: '0 0 8px #a3e635' }} />
            GTM OPERATIONS FOR B2B TECH
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Top-Tier GTM Operations<br />
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              for B2B Tech Companies
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#a1a1aa',
            maxWidth: 620,
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}>
            We build full-stack GTM infrastructure for the fastest-growing B2B companies. Two products — GTM Launch or GTM Embedded. No a la carte.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Link href={customerPath(diagnosticHref)} style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              color: '#0a0118',
              padding: '0.9rem 2rem',
              borderRadius: '9999px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
              boxShadow: '0 0 30px rgba(163,230,53,0.25)',
              letterSpacing: '-0.01em',
            }}>
              {customer.hasDiagnosticResult ? 'View Diagnostic' : 'Start Diagnostic'}
            </Link>
            <Link href={customerPath('/about/services')} style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'white',
              padding: '0.9rem 2rem',
              borderRadius: '9999px',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}>
              Browse Services
            </Link>
          </div>

          {/* Stats — inside hero */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            maxWidth: 600,
            margin: '0 auto',
            padding: '1.5rem 0',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 800, color: '#a3e635', letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TRUSTED BY LOGO BAR */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '1.75rem 0' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
          }}>
            <span style={{ fontSize: '0.65rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Trusted by</span>
            {clients.map((client) => (
              <img
                key={client.name}
                src={client.logo}
                alt={client.name}
                title={client.name}
                style={{
                  height: 22,
                  maxWidth: 110,
                  width: 'auto',
                  objectFit: 'contain',
                  opacity: 0.4,
                  transition: 'opacity 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.4'; }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* HOW WE WORK */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 50%, #0f0720 100%)',
        padding: 'clamp(3rem, 6vw, 5rem) 0',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '20%', right: '5%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(163,230,53,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <p style={{ color: '#a3e635', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '0.5rem' }}>How We Work</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>Two ways to engage</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 500, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
              You get the whopper, or you get embedded. No a la carte projects.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 800, margin: '0 auto' }}>
            {services.map((service) => (
              <Link key={service.title} href={customerPath(service.href)} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="service-card" style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    width: 4,
                    flexShrink: 0,
                    background: `linear-gradient(180deg, ${service.borderColor}, ${service.borderColor}66)`,
                  }} />
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'clamp(1rem, 2vw, 1.5rem) clamp(1rem, 2.5vw, 1.75rem)',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                  }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{service.icon}</span>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{service.title}</h3>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, margin: 0 }}>
                        {service.description}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '1.35rem', fontWeight: 800, color: service.borderColor, letterSpacing: '-0.02em' }}>{service.price}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500, marginTop: '0.15rem' }}>Learn more &rarr;</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO SECTION */}
      {customer.youtubeVideoId && !customer.youtubeVideoId.includes('YOUR_') && (
        <div style={{ background: '#fff', padding: '4rem 0' }}>
          <div className="container" style={{ padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ color: '#7c3aed', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '0.5rem' }}>See It In Action</p>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>LeanScale Overview</h2>
            </div>
            <div className="video-container" style={{ maxWidth: 800, margin: '0 auto', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              <iframe
                src={`https://www.youtube.com/embed/${customer.youtubeVideoId}`}
                title="LeanScale Overview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE SLIDES EMBED */}
      {customer.googleSlidesEmbedUrl && !customer.googleSlidesEmbedUrl.includes('YOUR_') && (
        <div style={{ background: '#fff', padding: '4rem 0' }}>
          <div className="container" style={{ padding: '0 2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <p style={{ color: '#7c3aed', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '0.5rem' }}>Our Deck</p>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>LeanScale Deck</h2>
            </div>
            <div className="video-container" style={{ maxWidth: 800, margin: '0 auto', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              <iframe
                src={customer.googleSlidesEmbedUrl}
                title="LeanScale Deck"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* TESTIMONIALS */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 50%, #0f0720 100%)',
        padding: 'clamp(3rem, 6vw, 5rem) 0',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <p style={{ color: '#a3e635', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '0.5rem' }}>What Our Customers Say</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>Trusted by the best in B2B</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 12,
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
              }}>
                <div style={{ fontSize: '1.5rem', color: 'rgba(163, 230, 53, 0.3)', lineHeight: 1, marginBottom: '0.75rem' }}>&ldquo;</div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', flex: 1, fontStyle: 'italic', margin: 0 }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.author}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{
        background: '#fff',
        padding: 'clamp(3rem, 6vw, 5rem) 0',
        textAlign: 'center',
      }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <p style={{ color: '#7c3aed', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '0.75rem' }}>Get Started</p>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em', color: '#111' }}>
            Ready to accelerate your GTM?
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.6 }}>
            Take our diagnostic to identify the highest-impact opportunities across your revenue engine.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={customerPath(diagnosticHref)} style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: '#fff',
              padding: '0.9rem 2rem',
              borderRadius: '9999px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
              boxShadow: '0 4px 20px rgba(124,58,237,0.25)',
            }}>
              {customer.hasDiagnosticResult ? 'View Diagnostic' : 'Start Diagnostic'}
            </Link>
            <Link href={customerPath('/getting-started/availability')} style={{
              display: 'inline-block',
              background: '#fff',
              border: '1px solid #e5e7eb',
              color: '#374151',
              padding: '0.9rem 2rem',
              borderRadius: '9999px',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}>
              View Availability
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
