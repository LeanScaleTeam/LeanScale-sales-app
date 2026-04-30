import Layout from '../../components/Layout';
import AvailabilityCalendar from '../../components/AvailabilityCalendar';
import Link from 'next/link';
import { useCustomer } from '../../context/CustomerContext';

export default function Availability() {
  const { customer, customerPath } = useCustomer();
  const diagnosticType = customer.diagnosticType || 'gtm';
  const diagnosticHref = customer.hasDiagnosticResult
    ? `/diagnostic/${diagnosticType}`
    : '/diagnostic/start';

  return (
    <Layout title="Cohort Availability">
      {/* Dark Gradient Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        padding: 'clamp(2.5rem, 6vw, 4rem) 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '9999px',
            padding: '0.375rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 500,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#a3e635',
              display: 'inline-block',
            }} />
            Reserve Your Spot
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'white',
            marginBottom: '0.75rem',
            lineHeight: 1.15,
          }}>
            Cohort{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Availability
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 550,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            New embedded teams start every 2 weeks. See real-time availability and reserve your spot.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem 3rem' }}>

        {/* Calendar Section */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          marginBottom: '2rem',
        }}>
          <AvailabilityCalendar compact={false} />
        </div>

        {/* How Embedded Teams Work */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '1.25rem',
            textAlign: 'center',
            color: '#111827',
          }}>
            How Embedded Teams Work
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}>
            {[
              { icon: '🚀', title: 'Kickoff', desc: 'Meet your team and align on priorities within the first week.', color: '#a3e635' },
              { icon: '⚙️', title: 'Execution', desc: 'Your dedicated team works on GTM operations throughout the engagement.', color: '#7c3aed' },
              { icon: '📊', title: 'Reviews', desc: 'Weekly syncs to review progress, adjust priorities, and plan ahead.', color: '#a855f7' },
            ].map((item) => (
              <div key={item.title} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '3px',
                  background: item.color,
                }} />
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem', color: '#111827' }}>{item.title}</div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{
          padding: 'clamp(2rem, 4vw, 3rem) 2rem',
          background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
          borderRadius: '20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontWeight: 700,
              color: 'white',
              marginBottom: '0.5rem',
            }}>
              Ready to get started?
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '1.5rem',
              maxWidth: 500,
              margin: '0 auto 1.5rem',
              lineHeight: 1.6,
            }}>
              Configure your engagement and secure your embedded team spot today.
            </p>
            <Link href={customerPath(diagnosticHref)} style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              color: '#0a0118',
              fontWeight: 700,
              padding: '0.875rem 2rem',
              fontSize: '1rem',
              borderRadius: '12px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}>
              {customer.hasDiagnosticResult ? 'View Diagnostic →' : 'Start Diagnostic →'}
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
