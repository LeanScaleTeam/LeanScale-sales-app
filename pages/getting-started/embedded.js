import Link from 'next/link';
import Layout from '../../components/Layout';
import { useCustomer } from '../../context/CustomerContext';

const tiers = [
  {
    name: 'Starter',
    hours: 50,
    price: '$15,000',
    rate: '$300/hr',
    description: 'Perfect for tactical needs',
    color: '#7c3aed',
    featured: false,
  },
  {
    name: 'Growth',
    hours: 100,
    price: '$25,000',
    rate: '$250/hr',
    description: 'Save $5,000 vs hourly',
    color: '#7c3aed',
    featured: true,
  },
  {
    name: 'Scale',
    hours: 225,
    price: '$50,000',
    rate: '$222/hr',
    description: 'Save $17,500 vs hourly',
    color: '#7c3aed',
    featured: false,
  },
];

const revopsItems = [
  'CRM administration & optimization',
  'Process design & improvement',
  'Data hygiene & enrichment',
  'Reporting & dashboards',
  'Integration management',
  'Cross-functional alignment',
  'Tool evaluation & implementation',
];

const mopsItems = [
  'Campaign execution & QA',
  'Automation building',
  'Lead management & scoring',
  'Attribution setup & analysis',
  'MarTech optimization',
  'Email operations',
  'Event lead processing',
];

export default function Embedded() {
  const { customer, customerPath } = useCustomer();
  const diagnosticType = customer.diagnosticType || 'gtm';
  const diagnosticHref = customer.hasDiagnosticResult
    ? `/diagnostic/${diagnosticType}`
    : '/diagnostic/start';

  return (
    <Layout title="Embedded Support">
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
            Flexible Expertise
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'white',
            marginBottom: '0.75rem',
            lineHeight: 1.15,
          }}>
            Embedded{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Support
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Augment your team with dedicated RevOps or Marketing Ops expertise. Flexible hours you can use however you need.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 1.5rem 3rem' }}>

        {/* Pricing Tiers */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          textAlign: 'center',
          color: '#111827',
        }}>
          Pricing Tiers
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          {tiers.map((tier) => (
            <div key={tier.name} style={{
              background: tier.featured ? '#faf5ff' : 'white',
              borderRadius: '16px',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              border: tier.featured ? '2px solid #7c3aed' : '1px solid #e5e7eb',
              boxShadow: tier.featured
                ? '0 8px 32px rgba(124,58,237,0.15)'
                : '0 1px 3px rgba(0,0,0,0.06)',
              transition: 'all 0.3s ease',
            }}>
              {tier.featured && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '-28px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.25rem 2rem',
                  transform: 'rotate(45deg)',
                }}>
                  POPULAR
                </div>
              )}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem', color: '#111827' }}>
                {tier.name}
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed', marginBottom: '0.25rem' }}>
                {tier.price}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
                {tier.hours} hours · {tier.rate}
              </div>
              <div style={{
                background: tier.featured ? '#ede9fe' : '#f3f4f6',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: tier.featured ? '#5b21b6' : '#374151',
              }}>
                {tier.description}
              </div>
            </div>
          ))}
        </div>

        {/* What's Included */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
          textAlign: 'center',
          color: '#111827',
        }}>
          What's Included
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          {/* RevOps */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '3px',
              background: '#7c3aed',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🔧</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#111827' }}>RevOps Support</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'none' }}>
              {revopsItems.map((item) => (
                <li key={item} style={{
                  fontSize: '0.85rem',
                  color: '#374151',
                  lineHeight: 1.8,
                  position: 'relative',
                  paddingLeft: '0.25rem',
                }}>
                  <span style={{ position: 'absolute', left: '-1.25rem', color: '#7c3aed' }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Marketing Ops */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '3px',
              background: '#a855f7',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📊</span>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#111827' }}>Marketing Ops Support</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'none' }}>
              {mopsItems.map((item) => (
                <li key={item} style={{
                  fontSize: '0.85rem',
                  color: '#374151',
                  lineHeight: 1.8,
                  position: 'relative',
                  paddingLeft: '0.25rem',
                }}>
                  <span style={{ position: 'absolute', left: '-1.25rem', color: '#a855f7' }}>•</span>
                  {item}
                </li>
              ))}
            </ul>
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
          marginBottom: '2rem',
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
              Ready to augment your team?
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              maxWidth: 500,
              margin: '0 auto 1.5rem',
              lineHeight: 1.6,
            }}>
              Start with a diagnostic to identify where embedded support will have the biggest impact.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={customerPath(diagnosticHref)} style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                  color: '#0a0118',
                  fontWeight: 700,
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                  {customer.hasDiagnosticResult ? 'View Diagnostic →' : 'Start Diagnostic →'}
                </button>
              </Link>
              <Link href={customerPath('/getting-started/availability')} style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: 'white',
                  fontWeight: 600,
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}>
                  View Availability →
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
