import Layout from '../../components/Layout';

const resources = [
  {
    title: 'LeanScale Home',
    type: 'Website',
    url: 'https://leanscale.team',
    icon: '🏠',
    description: 'Quick overview of who LeanScale is and what we do.'
  },
  {
    title: 'LeanScale YouTube Channel',
    type: 'YouTube',
    url: 'https://www.youtube.com/@leanscale',
    icon: '📺',
    description: 'All our RevOps, GTM Ops, and growth videos in one place.'
  },
  {
    title: 'Services Overview',
    type: 'Website',
    url: 'https://leanscale.team/services/',
    icon: '🛠️',
    description: 'Simple breakdown of our main services and how we help GTM teams.'
  },
  {
    title: 'Intro to LeanScale',
    type: 'Article',
    url: 'https://leanscale.team/introducing-leanscale-for-b2b-startups/',
    icon: '📄',
    description: 'High-level intro to our approach for B2B startups.'
  },
  {
    title: 'Growth Modeling & Capacity Planning',
    type: 'Video',
    url: 'https://www.youtube.com/watch?v=aCcS8tFl2zY',
    icon: '📈',
    description: 'Popular walkthrough on how to plan headcount and growth realistically.'
  },
  {
    title: 'Lean Startups Guide',
    type: 'Article',
    url: 'https://leanscale.team/lean-startups/',
    icon: '📖',
    description: 'Our point of view on how modern startups should operate and scale.'
  },
  {
    title: 'Ecosystem-Led Growth',
    type: 'Article',
    url: 'https://leanscale.team/eco-led-startups/',
    icon: '🌱',
    description: 'Short read on building through partnerships and ecosystems.'
  },
  {
    title: 'GTM Lifecycle Guide',
    type: 'Docs',
    url: 'https://docs.leanscale.team/go-to-market-lifecycle/go-to-market-lifecycle',
    icon: '🔄',
    description: 'Full walkthrough of the GTM process from lead to renewal.'
  },
  {
    title: 'CRM Setup Basics',
    type: 'Docs',
    url: 'https://docs.leanscale.team/gtm-tech-stack/crm-considerations',
    icon: '💾',
    description: 'What a solid CRM setup should look like and how to keep it clean.'
  },
  {
    title: 'Lead Source Playbook',
    type: 'Docs',
    url: 'https://docs.leanscale.team/lead-attribution/lead-source-taxonomy',
    icon: '🎯',
    description: 'How to organize and track lead sources the right way.'
  },
  {
    title: 'Sales Territories Guide',
    type: 'Docs',
    url: 'https://docs.leanscale.team/strategic-walkthroughs/building-sales-territories',
    icon: '🗺️',
    description: 'How to design fair, logical sales territories as you scale.'
  },
  {
    title: 'Marketing Dashboards Guide',
    type: 'Docs',
    url: 'https://docs.leanscale.team/strategic-walkthroughs/building-dashboards/marketing-dashboards',
    icon: '📊',
    description: 'Key dashboards every GTM team should have and how to build them.'
  },
];

function getTypeBadgeColor(type) {
  const colors = {
    Website: { bg: '#ede9fe', text: '#7c3aed' },
    YouTube: { bg: '#fee2e2', text: '#dc2626' },
    Article: { bg: '#dbeafe', text: '#2563eb' },
    Video: { bg: '#fef3c7', text: '#d97706' },
    Docs: { bg: '#dcfce7', text: '#16a34a' },
  };
  return colors[type] || { bg: '#f3f4f6', text: '#374151' };
}

export default function KeyResources() {
  return (
    <Layout title="Key Resources">
      {/* Dark gradient hero */}
      <section style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        padding: 'clamp(3rem, 8vw, 6rem) 1.5rem clamp(3rem, 8vw, 5rem)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(124,58,237,0.25)',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: '9999px',
            marginBottom: '1.5rem',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#a3e635',
              boxShadow: '0 0 8px rgba(163,230,53,0.6)',
            }} />
            <span style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.8rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}>
              LeanScale Knowledge Base
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            color: '#ffffff',
            margin: '0 0 1rem 0',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}>
            Key{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #65a30d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Resources
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Curated articles, videos, docs, and tools to help you master GTM operations.
          </p>
        </div>
      </section>

      {/* Resources grid section */}
      <section style={{
        background: '#ffffff',
        padding: 'clamp(2.5rem, 6vw, 4rem) 1.5rem',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Section label */}
          <div style={{ marginBottom: '2rem' }}>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#7c3aed',
              margin: '0 0 0.5rem 0',
            }}>
              Browse Resources
            </p>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: '#111827',
              margin: 0,
            }}>
              Everything You Need
            </h2>
          </div>

          {/* Card grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {resources.map((resource) => (
              <a
                key={resource.title}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="resource-card-link"
                style={{
                  display: 'block',
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#7c3aed';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{resource.icon}</div>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  color: '#111827',
                  lineHeight: 1.3,
                }}>
                  {resource.title}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#6b7280',
                  margin: '0 0 1rem 0',
                  lineHeight: 1.55,
                }}>
                  {resource.description}
                </p>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.65rem',
                  background: getTypeBadgeColor(resource.type).bg,
                  color: getTypeBadgeColor(resource.type).text,
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {resource.type}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
