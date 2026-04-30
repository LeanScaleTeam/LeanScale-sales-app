import Layout from '../../components/Layout';
import { useCustomer } from '../../context/CustomerContext';

export default function StartDiagnostic() {
  const { customer } = useCustomer();

  // Default NDA link if not configured for customer
  const ndaLink = customer.ndaLink || 'https://powerforms.docusign.net/0758efed-0a42-4275-b5d9-f26875d64ae6?env=na4&acct=9287b4d2-50a6-4309-b7e8-7f0b785470c0&accountId=9287b4d2-50a6-4309-b7e8-7f0b785470c0';
  const intakeFormLink = customer.intakeFormLink || 'https://forms.fillout.com/t/nqEbrHoL5Eus';

  return (
    <Layout title="Start Diagnostic">
      {/* Dark Gradient Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        padding: 'clamp(3rem, 8vw, 5rem) 1.5rem clamp(2.5rem, 6vw, 4rem)',
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

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 620, margin: '0 auto' }}>
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
            Get Started
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            margin: '0 0 1rem',
            letterSpacing: '-0.02em',
          }}>
            Start{' '}
            <span style={{ color: '#a3e635' }}>Diagnostic</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            maxWidth: 480,
            margin: '0 auto',
          }}>
            Two quick steps to kick off your GTM Diagnostic — about 10 minutes.
          </p>
        </div>
      </section>

      {/* Step Cards */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Step 1: NDA */}
        <section style={{
          marginTop: '-1.5rem',
          marginBottom: '2rem',
          position: 'relative',
          zIndex: 2,
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}>
            {/* Step Header */}
            <div style={{
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#1a1a1a',
                flexShrink: 0,
              }}>1</div>
              <div>
                <h2 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  margin: 0,
                  color: '#1a1a1a',
                }}>Sign NDA</h2>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  margin: '0.15rem 0 0',
                  lineHeight: 1.5,
                }}>
                  Sign our mutual NDA to protect both parties before we begin
                </p>
              </div>
            </div>

            {/* Iframe Container */}
            <div style={{ padding: '1.5rem 2rem 2rem' }}>
              <div style={{
                width: '100%',
                minHeight: '600px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <iframe
                  src={ndaLink}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: 'none',
                  }}
                  title="Sign NDA via DocuSign"
                />
              </div>
              <p style={{
                marginTop: '0.75rem',
                fontSize: '0.8rem',
                color: '#6b7280',
              }}>
                Having trouble?{' '}
                <a
                  href={ndaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#a3e635', fontWeight: 600, textDecoration: 'none' }}
                >
                  Open in new tab
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Step 2: Intake Form */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}>
            {/* Step Header */}
            <div style={{
              padding: '1.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
                fontWeight: 800,
                color: '#1a1a1a',
                flexShrink: 0,
              }}>2</div>
              <div>
                <h2 style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  margin: 0,
                  color: '#1a1a1a',
                }}>GTM Diagnostic Intake</h2>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  margin: '0.15rem 0 0',
                  lineHeight: 1.5,
                }}>
                  ~15 questions about your CRM, marketing automation, sales engagement, and reporting stack. Takes about 8 minutes.
                </p>
              </div>
            </div>

            {/* Iframe Container */}
            <div style={{ padding: '1.5rem 2rem 2rem' }}>
              <div style={{
                width: '100%',
                minHeight: '800px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <iframe
                  src={intakeFormLink}
                  style={{
                    width: '100%',
                    height: '800px',
                    border: 'none',
                  }}
                  title="GTM Diagnostic Intake Form"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
