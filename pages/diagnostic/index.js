import Link from 'next/link';
import Layout from '../../components/Layout';
import { useCustomer } from '../../context/CustomerContext';
import { getCustomerServerSideProps } from '../../lib/getCustomer';

export const getServerSideProps = getCustomerServerSideProps;

const diagnosticFeatures = [
  { icon: '⚙️', label: '63 Process Inspection Points', desc: 'Marketing, Sales, CS, Partnerships' },
  { icon: '📈', label: 'Power10 Metrics', desc: 'The 10 metrics that matter most' },
  { icon: '🔧', label: '17 Tool Categories', desc: 'GTM tech stack health assessment' },
];

export default function DiagnosticOverview() {
  const { customer, customerPath } = useCustomer();
  const diagnosticType = customer.diagnosticType || 'gtm';
  const diagnosticHref = customer.hasDiagnosticResult
    ? `/diagnostic/${diagnosticType}`
    : '/diagnostic/start';
  return (
    <Layout title="Diagnostic">
      {/* Dark Gradient Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        padding: 'clamp(3rem, 8vw, 6rem) 1.5rem clamp(2.5rem, 6vw, 4rem)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(163,230,53,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(163,230,53,0.1)',
            border: '1px solid rgba(163,230,53,0.25)',
            borderRadius: '999px',
            padding: '0.4rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#a3e635',
            letterSpacing: '0.02em',
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#a3e635',
              display: 'inline-block',
              boxShadow: '0 0 6px rgba(163,230,53,0.6)',
            }} />
            Assessment Platform
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            margin: '0 0 1rem',
            letterSpacing: '-0.02em',
          }}>
            GTM{' '}
            <span style={{ color: '#a3e635' }}>Diagnostic</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
            maxWidth: 520,
            margin: '0 auto',
          }}>
            Get clarity on your GTM engine with our comprehensive diagnostic assessment
          </p>
        </div>
      </section>

      {/* CTA Cards */}
      <div className="container" style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginTop: '-2rem',
          marginBottom: '3rem',
          position: 'relative',
          zIndex: 2,
        }}>
          <Link href={customerPath('/diagnostic/start')} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '2rem',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              boxShadow: '0 4px 24px rgba(163,230,53,0.2)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(163,230,53,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(163,230,53,0.2)';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}>🚀</div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
                  Start Diagnostic
                </h2>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'rgba(0,0,0,0.6)', margin: 0, lineHeight: 1.6 }}>
                Begin your GTM health assessment questionnaire
              </p>
            </div>
          </Link>

          <Link href={customerPath('/diagnostic/gtm')} style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '2rem',
              background: '#ffffff',
              borderRadius: '16px',
              cursor: 'pointer',
              border: '1px solid rgba(0,0,0,0.08)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  background: 'rgba(163,230,53,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}>📊</div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
                  View Demo Results
                </h2>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
                See a sample diagnostic results dashboard
              </p>
            </div>
          </Link>
        </div>

        {/* Video Section */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '20px',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          marginBottom: '3rem',
        }}>
          <h3 style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
            fontWeight: 700,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#1a1a1a',
          }}>
            <span>📺</span> What is the GTM Diagnostic?
          </h3>
          <div className="video-container" style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <iframe
              src="https://fast.wistia.net/embed/iframe/38bjmcwsau"
              title="GTM VSL"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
            fontWeight: 700,
            marginBottom: '1.5rem',
            textAlign: 'center',
            color: '#1a1a1a',
          }}>
            What We Assess
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}>
            {diagnosticFeatures.map((feature) => (
              <div key={feature.label} style={{
                textAlign: 'center',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '2rem 1.5rem',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.08)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)';
              }}
              >
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(163,230,53,0.15) 0%, rgba(132,204,22,0.08) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '1.5rem',
                }}>
                  {feature.icon}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.35rem', color: '#1a1a1a' }}>
                  {feature.label}
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dark Gradient Footer CTA */}
        <div style={{
          background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)',
          textAlign: 'center',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Glow */}
          <div style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '250px',
            background: 'radial-gradient(ellipse, rgba(163,230,53,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 800,
              color: '#ffffff',
              marginBottom: '0.75rem',
            }}>
              Ready to get started?
            </h3>
            <p style={{
              fontSize: 'clamp(0.9rem, 2vw, 1.05rem)',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 450,
              margin: '0 auto 1.75rem',
              lineHeight: 1.6,
            }}>
              Take the diagnostic to identify your highest-impact GTM improvements.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={customerPath(diagnosticHref)} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 2rem',
                background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                color: '#1a1a1a',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 20px rgba(163,230,53,0.25)',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(163,230,53,0.35)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(163,230,53,0.25)';
              }}
              >
                {customer.hasDiagnosticResult ? 'View Diagnostic' : 'Start Diagnostic'} →
              </Link>
              <Link href={customerPath('/about/services')} style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 2rem',
                background: 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'background 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              >
                Browse Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
