import Link from 'next/link';
import Layout from '../../components/Layout';
import { useCustomer } from '../../context/CustomerContext';

const tiers = [
  {
    name: 'Starter',
    monthlyPrice: 15000,
    monthlyHours: 50,
    rate: '$300/hr',
    description: 'Single workstream focus',
    summary: 'We fix the critical stuff first, then build methodically.',
    timeToGreen: '12–18 months',
    color: '#7c3aed',
    accent: 'rgba(124,58,237,0.5)',
    featured: false,
  },
  {
    name: 'Growth',
    monthlyPrice: 25000,
    monthlyHours: 100,
    rate: '$250/hr',
    description: 'Multi-workstream coverage',
    summary: 'Full roadmap in 12 months — the sweet spot for most teams.',
    timeToGreen: '6–9 months',
    color: '#7c3aed',
    accent: 'rgba(124,58,237,0.7)',
    featured: true,
  },
  {
    name: 'Scale',
    monthlyPrice: 50000,
    monthlyHours: 225,
    rate: '$222/hr',
    description: 'Full RevOps coverage',
    summary: 'Aggressive timeline with multiple workstreams running in parallel.',
    timeToGreen: '4–6 months',
    color: '#a855f7',
    accent: 'rgba(168,85,247,0.7)',
    featured: false,
  },
];

const engagementSteps = [
  {
    label: 'Week 1',
    title: 'Onboard & scope',
    description:
      'Your assigned operators embed in your Slack and CRM, audit your current stack, and set the first-month sprints based on the diagnostic.',
  },
  {
    label: 'Ongoing',
    title: 'Embedded execution',
    description:
      'Weekly stand-ups, async coverage in Slack, hands-on work in your CRM and tools. Sprint output every two weeks, not slide decks.',
  },
  {
    label: 'Anytime',
    title: 'Roll out or up',
    description:
      'Rolling 90-day outs — scale tiers up or down as priorities change, pause when you need to, no long-term lock-in.',
  },
];

const stats = [
  { value: 'From $15K', label: 'per month' },
  { value: '90 days', label: 'rolling out' },
  { value: 'Day 1', label: 'embedded in your stack' },
];

const formatPrice = (n) => `$${(n / 1000).toFixed(0)}K`;

export default function Embedded() {
  const { customer, customerPath } = useCustomer();
  const diagnosticType = customer.diagnosticType || 'gtm';
  const diagnosticHref = customer.hasDiagnosticResult
    ? `/diagnostic/${diagnosticType}`
    : '/diagnostic/start';

  return (
    <Layout title="Pricing & Tiers">
      {/* Dark Gradient Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        padding: 'clamp(3rem, 7vw, 5rem) 1.5rem clamp(2.5rem, 5vw, 3.5rem)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '450px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(124,58,237,0.18)',
            border: '1px solid rgba(167,139,250,0.35)',
            borderRadius: '9999px',
            padding: '0.4rem 1.05rem',
            marginBottom: '1.5rem',
            fontSize: '0.78rem',
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 500,
            letterSpacing: '0.01em',
            backdropFilter: 'blur(4px)',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#a3e635',
              display: 'inline-block',
            }} />
            Pricing &amp; Tiers
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: 'white',
            margin: '0 0 1rem',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Operators{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              embedded in your team
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 620,
            margin: '0 auto 2rem',
            lineHeight: 1.65,
          }}>
            Dedicated GTM operators running RevOps and Marketing Ops alongside your team. Pick the
            tier that fits your stage — change it whenever you need to.
          </p>

          {/* Stat strip */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 'clamp(1.25rem, 3vw, 2.5rem)',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            maxWidth: 580,
            margin: '0 auto',
          }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}>
                  {s.value}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: 'rgba(255,255,255,0.45)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginTop: '0.25rem',
                  fontWeight: 500,
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING TIERS */}
      <div style={{
        background: '#fafafa',
        padding: 'clamp(3rem, 6vw, 5rem) 1.5rem',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <p style={{
              color: '#7c3aed',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
              margin: '0 0 0.5rem',
            }}>Pricing</p>
            <h2 style={{
              fontSize: 'clamp(1.65rem, 3vw, 2.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#0f0524',
              margin: '0 0 0.65rem',
            }}>
              Three tiers, same operators
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#4a4a5a',
              maxWidth: 600,
              margin: '0 auto',
              lineHeight: 1.65,
            }}>
              Same roadmap, different speeds. The tier you pick sets how many hours we run for you each
              month — the people and the work product are the same.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            alignItems: 'stretch',
          }}>
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={tier.featured ? 'tier-card tier-featured' : 'tier-card'}
                style={{
                  position: 'relative',
                  background: '#fff',
                  borderRadius: '18px',
                  padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                  border: tier.featured ? `2px solid ${tier.color}` : '1px solid #e5e7eb',
                  boxShadow: tier.featured
                    ? '0 12px 36px rgba(124,58,237,0.18), 0 2px 6px rgba(124,58,237,0.06)'
                    : '0 1px 3px rgba(0,0,0,0.04)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Top accent bar */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: 4,
                  background: `linear-gradient(90deg, ${tier.color}, ${tier.accent})`,
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                }} />

                {/* Most popular pill */}
                {tier.featured && (
                  <div style={{
                    position: 'absolute',
                    top: -13,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: `linear-gradient(135deg, ${tier.color} 0%, #a855f7 100%)`,
                    color: '#fff',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    boxShadow: '0 4px 12px rgba(124,58,237,0.35)',
                  }}>
                    Most Popular
                  </div>
                )}

                {/* Tier name */}
                <div style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: tier.color,
                  marginBottom: '0.5rem',
                  marginTop: '0.25rem',
                }}>
                  {tier.name}
                </div>

                {/* Price */}
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.35rem',
                  marginBottom: '0.4rem',
                }}>
                  <span style={{
                    fontSize: '2.25rem',
                    fontWeight: 800,
                    color: '#111827',
                    letterSpacing: '-0.025em',
                    lineHeight: 1,
                  }}>
                    {formatPrice(tier.monthlyPrice)}
                  </span>
                  <span style={{ fontSize: '0.95rem', color: '#6b7280', fontWeight: 500 }}>
                    /mo
                  </span>
                </div>

                {/* Hours / rate */}
                <div style={{
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  marginBottom: '1.1rem',
                }}>
                  {tier.monthlyHours} hours · {tier.rate}
                </div>

                {/* Description chip */}
                <div style={{
                  background: tier.featured ? '#f5f3ff' : '#f3f4f6',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '9999px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: tier.featured ? '#5b21b6' : '#374151',
                  marginBottom: '1.25rem',
                  display: 'inline-block',
                  alignSelf: 'flex-start',
                }}>
                  {tier.description}
                </div>

                {/* Summary */}
                <p style={{
                  fontSize: '0.92rem',
                  color: '#374151',
                  lineHeight: 1.6,
                  margin: '0 0 1.25rem',
                  flex: 1,
                }}>
                  {tier.summary}
                </p>

                {/* Time-to-green */}
                <div style={{
                  borderTop: '1px solid #f0edf5',
                  paddingTop: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: '50%',
                    background: tier.featured ? '#ede9fe' : '#f3f4f6',
                    color: tier.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}>
                    ⏱
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.72rem',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 600,
                    }}>
                      Time to mature
                    </div>
                    <div style={{
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#111827',
                      letterSpacing: '-0.01em',
                    }}>
                      {tier.timeToGreen}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: '0.85rem',
            color: '#6b7280',
            marginTop: '2rem',
            marginBottom: 0,
          }}>
            Custom scope and pricing available for teams above 225 hours/month.
          </p>
        </div>
      </div>

      {/* HOW AN ENGAGEMENT RUNS */}
      <div style={{
        background: '#fff',
        padding: 'clamp(3rem, 6vw, 5rem) 1.5rem',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
            <p style={{
              color: '#7c3aed',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontWeight: 700,
              margin: '0 0 0.5rem',
            }}>How it runs</p>
            <h2 style={{
              fontSize: 'clamp(1.65rem, 3vw, 2.25rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#0f0524',
              margin: 0,
            }}>
              What an engagement looks like
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}>
            {engagementSteps.map((step, idx) => (
              <div key={step.label} style={{
                background: '#fafafa',
                border: '1px solid #ececf2',
                borderRadius: '14px',
                padding: '1.75rem',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}>
                  <div style={{
                    width: 32, height: 32,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 10px rgba(124,58,237,0.25)',
                    flexShrink: 0,
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#7c3aed',
                  }}>
                    {step.label}
                  </div>
                </div>
                <h3 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  color: '#111827',
                  margin: '0 0 0.5rem',
                  letterSpacing: '-0.01em',
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#4a4a5a',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CTA */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        padding: 'clamp(3rem, 6vw, 5rem) 1.5rem',
        textAlign: 'center',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600, height: 320,
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 0.75rem',
          }}>
            Not sure which tier fits?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            margin: '0 auto 1.75rem',
            lineHeight: 1.65,
            fontSize: '1rem',
            maxWidth: 540,
          }}>
            Start with the diagnostic. We&apos;ll surface where embedded support has the biggest
            impact and recommend a tier based on your stage and the work involved.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={customerPath(diagnosticHref)} style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                color: '#0a0118',
                fontWeight: 700,
                padding: '0.9rem 2rem',
                fontSize: '0.95rem',
                border: 'none',
                borderRadius: '9999px',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(163,230,53,0.3)',
                letterSpacing: '-0.01em',
              }}>
                {customer.hasDiagnosticResult ? 'View Diagnostic →' : 'Start Diagnostic →'}
              </button>
            </Link>
            <Link href={customerPath('/getting-started/availability')} style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                fontWeight: 600,
                padding: '0.9rem 2rem',
                fontSize: '0.95rem',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '9999px',
                cursor: 'pointer',
              }}>
                View Availability →
              </button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.tier-card:hover) {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(124,58,237,0.18), 0 2px 6px rgba(0,0,0,0.04);
        }
        :global(.tier-featured:hover) {
          box-shadow: 0 18px 48px rgba(124,58,237,0.28), 0 2px 6px rgba(124,58,237,0.08);
        }
      `}</style>
    </Layout>
  );
}
