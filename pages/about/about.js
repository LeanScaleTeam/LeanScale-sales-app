import Layout from '../../components/Layout';

const values = ['Integrity', 'Humility', 'Taking action', 'Challenging yourself and others'];

const differentiators = [
  {
    title: 'Startup Operator Experience',
    description: 'Our team has built and scaled GTM operations at startups from Series A to IPO.',
  },
  {
    title: 'Proactive Approach',
    description: "We don't wait for problems—we anticipate them and build solutions before they become blockers.",
  },
  {
    title: 'Assigned Team Members',
    description: "Because business context matters. Your team gets better and better as they spend more time with you and your business. We don't switch consultants from project to project, we know business context matters and you don't need to waste your time getting someone new up to speed.",
  },
  {
    title: 'Broad Scope and Capabilities',
    description: "We have a dynamic team and access to experts in every area of revenue operations. Give us a problem, and we can solve it. When it comes to new tools, new ways to measure your GTM engine, or novel operational approaches, we're always testing the limits of what's possible and helps our customers.",
  },
  {
    title: 'Long Term Partnerships',
    description: "We get more efficient and effective the longer the partnership continues. We use business context to help provide the best operational solutions possible.",
  },
  {
    title: "'Lean on Us' Mentality",
    description: "Don't worry about what's \"in scope\" and focus on growing your revenue machine. Unload the operational burden of RevOps to your LeanScale team. With our broad scope and capabilities we welcome leaning on our team to achieve your goals.",
  },
];

const topTalent = [
  '3-10+ Years Startup Experience',
  'Quick Ramp Abilities',
  'Fast Pace Work Style',
  'Rapid Re-Prioritization Skills',
  'Iterative Approach',
  'B2B SaaS and AIaaS Expertise',
];

const deepCapabilities = [
  'LeanScale Academy™ Certified',
  'CRM + GTM Tech Stack Administration',
  'AI Best Practices + Playbooks',
  'Strategic & Technical Support',
  'Holistic View of Business & GTM Ops',
];

export default function AboutUs() {
  return (
    <Layout title="About Us">
      {/* ── Dark Gradient Hero ── */}
      <section
        style={{
          background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
          padding: 'clamp(4rem, 10vw, 8rem) clamp(1rem, 5vw, 3rem)',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        {/* Pill Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '999px',
            padding: '0.4rem 1.25rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '2rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#a3e635',
              display: 'inline-block',
            }}
          />
          About LeanScale
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 auto 1.5rem',
            maxWidth: 800,
          }}
        >
          We Help Startups{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Succeed
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
            lineHeight: 1.7,
            maxWidth: 720,
            margin: '0 auto',
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          To attract and develop the world&apos;s best startup operators and help startups,
          their people, and their investors succeed.
        </p>
      </section>

      {/* ── Values Section ── */}
      <section
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
          background: '#fff',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#7c3aed',
              marginBottom: '0.75rem',
            }}
          >
            What We Stand For
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              fontWeight: 800,
              color: '#0f0524',
              marginBottom: '2.5rem',
            }}
          >
            Our Values
          </h2>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {values.map((value) => (
              <div
                key={value}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(135deg, rgba(163,230,53,0.12) 0%, rgba(132,204,22,0.12) 100%)',
                  border: '1px solid rgba(163,230,53,0.3)',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
                  color: '#365314',
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                    flexShrink: 0,
                  }}
                />
                {value}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Sets Us Apart ── */}
      <section
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
          background: '#f5f3ff',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#7c3aed',
                marginBottom: '0.75rem',
              }}
            >
              Our Differentiators
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 800,
                color: '#0f0524',
              }}
            >
              What Sets Us Apart
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 'clamp(1rem, 2vw, 1.5rem)',
            }}
          >
            {differentiators.map((item) => (
              <div
                key={item.title}
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  padding: '2rem',
                  border: '1px solid #e9e5f5',
                  borderTop: '4px solid transparent',
                  borderImage: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%) 1',
                  borderImageSlice: '1',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <h3
                  style={{
                    fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                    fontWeight: 700,
                    color: '#1a0a2e',
                    marginBottom: '0.75rem',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    lineHeight: 1.7,
                    margin: 0,
                    color: '#4a4a5a',
                    fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We Hire ── */}
      <section
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
          background: '#fafafa',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#7c3aed',
                marginBottom: '0.75rem',
              }}
            >
              Our Team
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                fontWeight: 800,
                color: '#0f0524',
              }}
            >
              Who We Hire
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(1.5rem, 3vw, 3rem)',
            }}
          >
            {/* Top Talent Column */}
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                border: '1px solid #e9e5f5',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <h3
                style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#7c3aed',
                }}
              >
                Top Talent
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {topTalent.map((item) => (
                  <li
                    key={item}
                    style={{
                      padding: '0.65rem 0',
                      borderBottom: '1px solid #f0edf5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                      color: '#2d2d3a',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Deep Capabilities Column */}
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                border: '1px solid #e9e5f5',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <h3
                style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#7c3aed',
                }}
              >
                Deep Capabilities
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {deepCapabilities.map((item) => (
                  <li
                    key={item}
                    style={{
                      padding: '0.65rem 0',
                      borderBottom: '1px solid #f0edf5',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                      color: '#2d2d3a',
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                        flexShrink: 0,
                      }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Dark Gradient Footer CTA ── */}
      <section
        style={{
          background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
          padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 5vw, 3rem)',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
          }}
        >
          Ready to{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Lean on Us
          </span>
          ?
        </h2>
        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 600,
            margin: '0 auto 2rem',
            lineHeight: 1.7,
          }}
        >
          Let our team of experienced startup operators handle your revenue operations
          so you can focus on growth.
        </p>
        <button
          onClick={() => window.open('https://meet.reclaimai.com/u/7f49bc93-ac0e-47eb-9e6a-0936f035cfa8', '_blank')}
          style={{
            display: 'inline-block',
            padding: '0.9rem 2.5rem',
            background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
            color: '#1a0a2e',
            fontWeight: 700,
            fontSize: '1rem',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 20px rgba(163,230,53,0.3)',
          }}
        >
          Get in Touch
        </button>
      </section>
    </Layout>
  );
}
