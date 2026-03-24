import Link from 'next/link';
import Layout from '../../components/Layout';

const perks = [
  {
    title: 'GTM Diagnostic',
    value: '$5,000',
    valueType: 'One-time',
    description: 'End-to-end inspection of Go-to-Market engine (systems, funnel, reporting, performance to goal) that returns a green/yellow/red scorecard and an execution-ready roadmap.',
    features: ['GTM Metrics Audit', 'GTM Scorecard', 'Inspection Report', 'Execution Roadmap'],
  },
  {
    title: 'GTM Planning Package',
    value: '$5,000',
    valueType: '/ month',
    description: 'Quarterly growth modeling and a GTM reporting-to-goal platform (installed, administered, and paid for by LeanScale) included free of charge for portfolio companies working with us.',
    features: ['Growth Model', 'Performance-to-Goal', 'Reporting Platform', 'Operator Support'],
  },
];

const stats = [
  { value: '$5.45B+', label: 'Capital raised by our clients' },
  { value: '395K+', label: 'YouTube subscribers' },
  { value: '200+', label: 'B2B projects executed' },
];

const steps = [
  {
    number: '01',
    title: 'Connect With Anthony',
    description: 'Schedule a quick 15-minute chat with Anthony - 3x VP through $500M exit, Founder of LeanScale - to explore how we can support your portfolio.',
    bullets: ['Share investor insights', 'Get field benchmarks', 'Collaborate + connect'],
  },
  {
    number: '02',
    title: 'Give Portcos What They Need - For Free',
    description: 'Complimentary GTM Diagnostic + Planning Package to assess, model, and install the systems your portfolio companies need to scale.',
    bullets: ['Audit GTM engine', 'Scorecard + roadmap', 'Complimentary growth modeling platform'],
  },
];

export default function InvestorPerks() {
  return (
    <Layout title="Investor Perks">
      {/* ── Hero ── */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        color: 'white',
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Radial glow decoration */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(163,230,53,0.1)',
            border: '1px solid rgba(163,230,53,0.25)',
            borderRadius: '9999px',
            padding: '0.4rem 1rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#a3e635',
            letterSpacing: '0.5px',
            marginBottom: '1.5rem',
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#a3e635',
              display: 'inline-block',
            }} />
            For Investors in B2B Tech
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}>
            Helping Your Portcos Scale Faster
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 700,
            margin: '0 auto 2.5rem',
            lineHeight: 1.6,
          }}>
            Complimentary Support for Your Portcos from the GTM Ops team behind some of the fastest growing names in B2B tech
          </p>

          {/* Video */}
          <div style={{
            maxWidth: 700,
            margin: '0 auto 2.5rem',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.6)',
          }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://fast.wistia.net/embed/iframe/9k2foyun1f?seo=true&videoFoam=false"
                title="LeanScale Investor VSL"
                allow="autoplay; fullscreen"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>

          {/* CTA */}
          <a
            href="https://go.leanscale.team/investor#investor-calendar"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#a3e635',
              color: '#0a0118',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.85rem 2.25rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 0 24px rgba(163,230,53,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            Let&apos;s Connect
          </a>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.75rem' }}>
            Let&apos;s chat portfolios, trends, and intros
          </p>
        </div>
      </div>

      {/* ── Perks Section ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem' }}>
        <section style={{ padding: '4rem 0 3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 700 }}>
            Give Your Portcos What They Need - For Free
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2.5rem', maxWidth: 680, margin: '0 auto 2.5rem' }}>
            For investors who connect with LeanScale, we provide the following complimentary GTM support to your portfolio companies.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {perks.map((perk) => (
              <div key={perk.title} style={{
                background: 'white',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>
                <h3 style={{ color: '#7c3aed', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                  {perk.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {perk.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem 0' }}>
                  {perk.features.map((feature) => (
                    <li key={feature} style={{
                      padding: '0.35rem 0',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span style={{ color: '#7c3aed', fontWeight: 700 }}>&#10003;</span> {feature}
                    </li>
                  ))}
                </ul>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(163,230,53,0.12) 0%, rgba(163,230,53,0.06) 100%)',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  border: '1px solid rgba(163,230,53,0.2)',
                }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#7c3aed' }}>
                    {perk.value}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}> {perk.valueType}</span>
                  <div style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600, marginTop: '0.25rem' }}>
                    FREE for Portcos
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Stats Section (dark gradient card) ── */}
        <section style={{
          background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
          borderRadius: '16px',
          padding: '3rem',
          color: 'white',
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            right: '-20%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 700, position: 'relative', zIndex: 1 }}>
            We&apos;ve scaled the fastest-growing Startups in B2B Tech
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', position: 'relative', zIndex: 1 }}>
            {stats.map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#a3e635' }}>{stat.value}</div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Steps Section ── */}
        <section style={{ background: '#f8fafc', borderRadius: '16px', padding: '3rem', marginBottom: '3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontWeight: 700 }}>The Simple Process</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2.5rem', maxWidth: 700, margin: '0 auto 2.5rem' }}>
            A proven GTM partner that equips your portfolio companies with diagnostics, growth modeling, and reporting systems – all handled for you at no cost.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {steps.map((step) => (
              <div key={step.number} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #a3e635 0%, #65a30d 100%)',
                  color: '#0a0118',
                  padding: '0.3rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                }}>
                  Step {step.number}
                </div>
                <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>{step.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {step.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {step.bullets.map((bullet) => (
                    <li key={bullet} style={{
                      padding: '0.25rem 0',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span style={{ color: '#7c3aed', fontWeight: 700 }}>&rarr;</span> {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Founder Section ── */}
        <section style={{
          background: 'white',
          borderRadius: '16px',
          padding: '3rem',
          marginBottom: '3rem',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <img
                src="https://leanscale.team/wp-content/uploads/2024/03/Anthony2_de13c4ccc0.jpg"
                alt="Anthony Enrico"
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '4px solid #7c3aed',
                  marginBottom: '1rem',
                }}
              />
              <h3 style={{ marginBottom: '0.25rem', fontWeight: 700 }}>Anthony Enrico</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>CEO & Founder</p>
            </div>
            <div>
              <p style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.15)',
                borderRadius: '9999px',
                padding: '0.3rem 0.85rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#7c3aed',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '0.75rem',
              }}>
                LeanScale Founder
              </p>
              <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 700 }}>Meet Anthony, CEO of LeanScale</h2>
              <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: '1rem' }}>
                Anthony Enrico is a 3-time VP of Revenue Operations across startups, scaleups, and Fortune 1000 companies. He led RevOps for Emailage through a $500M exit, started the #1 YouTube channel for RevOps, and has been an operator with expertise across Marketing, Sales, CS and partnerships.
              </p>
              <p style={{ color: '#4b5563', lineHeight: 1.7 }}>
                Today, he leads LeanScale as the embedded GTM team behind high-growth SaaS leaders. Anthony lives in Phoenix, AZ with his wife and three kids.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Footer CTA (dark gradient) ── */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        padding: '4rem 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-40%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(163,230,53,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', position: 'relative', zIndex: 1 }}>
          <h2 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.75rem', fontWeight: 700 }}>
            Ready to support your portfolio?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: 600, margin: '0 auto 2rem' }}>
            Use the calendar below to schedule time with Anthony - swap notes on what&apos;s working across portfolios, share what we&apos;re seeing in the field, or just make a few introductions.
          </p>
          <a
            href="https://go.leanscale.team/investor#investor-calendar"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#a3e635',
              color: '#0a0118',
              fontWeight: 700,
              fontSize: '1rem',
              padding: '0.85rem 2.25rem',
              borderRadius: '9999px',
              textDecoration: 'none',
              boxShadow: '0 0 24px rgba(163,230,53,0.35)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
          >
            Schedule a Call
          </a>
        </div>
      </div>
    </Layout>
  );
}
