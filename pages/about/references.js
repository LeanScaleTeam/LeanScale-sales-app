import Layout from '../../components/Layout';

const testimonials = [
  {
    name: 'Michael Dzik',
    role: 'Growth Partner',
    company: 'Radian Capital',
    segment: 'VC / Portfolio Partner',
    quote: "LeanScale does an incredible job with our portcos, jumping in as soon as we invest and giving founders a strong shot at winning.",
    url: 'https://leanscale.team/portfolio/',
  },
  {
    name: 'Thomas Miller',
    role: 'CRO',
    company: 'Human',
    segment: 'Mid-Market SaaS',
    quote: "The most competent team I've worked with; they know what to do and how to tailor everything to our business.",
    url: 'https://leanscale.team/portfolio/',
  },
  {
    name: 'Donal Tobin',
    role: 'CEO',
    company: 'Integrate.io',
    segment: 'Mid-Market SaaS',
    quote: "LeanScale gave us the playbook and technical expertise to get up and running in 60 days with a smooth, thorough implementation.",
    url: 'https://leanscale.team/portfolio/',
  },
  {
    name: 'Amy De Salvatore',
    role: 'Partner',
    company: 'NightDragon',
    segment: 'VC / Growth Stage',
    quote: "LeanScale's holistic revenue-ops approach has clearly boosted our portfolio's growth and made them a trusted partner for complex GTM challenges.",
    url: 'https://leanscale.team/growth-stage-investments/',
  },
  {
    name: 'Tim White',
    role: 'Chief Growth Officer',
    company: 'Wealth.com',
    segment: 'Seed / Fintech',
    quote: "As with every project, LeanScale did an incredible job designing and fully streamlining our proposal and contracting process with DealHub CPQ.",
    url: 'https://leanscale.team/wealth-com/',
  },
  {
    name: 'Justin W.',
    role: 'Reviewer',
    company: 'Mid-Market',
    segment: 'Mid-Market SaaS',
    quote: "I appreciate their professional, pragmatic, straight-forward communication and the deep SaaS experience they bring from seeing what actually works.",
    url: 'https://leanscale.team/',
  },
  {
    name: 'Rafael L.',
    role: 'Reviewer',
    company: 'Small-Business',
    segment: 'SMB SaaS',
    quote: "Instead of hiring in-house RevOps, we got LeanScale's experience, tools, and team for roughly the same cost—making the decision an easy one.",
    url: 'https://leanscale.team/',
  },
  {
    name: 'Cheryl Y.',
    role: 'Reviewer',
    company: 'Mid-Market',
    segment: 'Mid-Market SaaS',
    quote: "Don't hesitate—get LeanScale involved quickly; they feel like internal resources, stay on top of everything, and are a rare find in the SalesOps world.",
    url: 'https://leanscale.team/',
  },
];

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function getSegmentColor(segment) {
  if (segment.includes('VC') || segment.includes('Growth Stage')) return '#dbeafe';
  if (segment.includes('SMB')) return '#fef3c7';
  if (segment.includes('Fintech') || segment.includes('Seed')) return '#fce7f3';
  return '#dcfce7';
}

export default function CustomerReferences() {
  return (
    <Layout title="Customer References">

      {/* DARK HERO */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        color: 'white',
        padding: '5rem 0 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

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
            TRUSTED BY B2B LEADERS
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Customer{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              References
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#a1a1aa',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Hear from the teams we&apos;ve helped scale their go-to-market operations
          </p>
        </div>
      </div>

      {/* TESTIMONIAL GRID */}
      <div style={{ background: '#f9fafb', padding: '4rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem',
          }}>
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '2rem',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Large quote mark */}
                <div style={{
                  fontSize: '3.5rem',
                  lineHeight: 1,
                  color: '#7c3aed',
                  fontFamily: 'Georgia, serif',
                  marginBottom: '0.5rem',
                  opacity: 0.3,
                  userSelect: 'none',
                }}>
                  &ldquo;
                </div>

                {/* Quote text */}
                <p style={{
                  fontStyle: 'italic',
                  lineHeight: 1.7,
                  flex: 1,
                  marginBottom: '1.5rem',
                  fontSize: '0.95rem',
                  color: '#374151',
                }}>
                  {testimonial.quote}
                </p>

                {/* Author row */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '1rem',
                }}>
                  {/* Avatar with initials */}
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    flexShrink: 0,
                    letterSpacing: '0.02em',
                  }}>
                    {getInitials(testimonial.name)}
                  </div>

                  {/* Name and role */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a
                      href={testimonial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontWeight: 700,
                        color: '#1f2937',
                        textDecoration: 'none',
                        fontSize: '0.9rem',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#7c3aed'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#1f2937'; }}
                    >
                      {testimonial.name}
                    </a>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.1rem' }}>
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>

                  {/* Segment badge */}
                  <span style={{
                    padding: '0.25rem 0.6rem',
                    background: getSegmentColor(testimonial.segment),
                    borderRadius: '9999px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    color: '#374151',
                    letterSpacing: '0.01em',
                  }}>
                    {testimonial.segment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </Layout>
  );
}
