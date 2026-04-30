import Link from 'next/link';
import Layout from '../../components/Layout';
import ImageZoom from '../../components/ImageZoom';
import { useCustomer } from '../../context/CustomerContext';

const stats = [
  { value: '148', label: 'Services Available' },
  { value: '68', label: 'Detailed Playbooks' },
  { value: '40%', label: 'Faster Pipeline Velocity' },
  { value: '30%', label: 'Higher Conversion Rates' },
];

const comparisonRows = [
  { label: 'Time to Operational', theirs: '6-12 months', ours: '2-4 weeks' },
  { label: 'Annual Cost', theirs: '$200-400K+ fully loaded', ours: 'Predictable monthly investment' },
  { label: 'Risk', theirs: 'Single point of failure', ours: 'Full team with redundancy' },
  { label: 'Experience', theirs: 'Limited cross-company', ours: '100+ implementations' },
  { label: 'Scaling', theirs: 'Requires more hiring', ours: 'Flex capacity instantly' },
];

const podRoles = [
  {
    title: 'GTM Architect',
    color: '#7c3aed',
    desc: 'Strategic leadership, roadmap planning, and executive alignment',
  },
  {
    title: 'GTM Engineer',
    color: '#a855f7',
    desc: 'System implementation, integrations, and technical execution',
  },
  {
    title: 'Data Analyst',
    color: '#8b5cf6',
    desc: 'Reporting, analytics, and data quality management',
  },
  {
    title: 'Ops Specialist',
    color: '#6d28d9',
    desc: 'Day-to-day operations, admin, and process optimization',
  },
];

const weeklySchedule = [
  {
    day: 'Monday',
    title: 'Kickoff & Planning',
    color: '#7c3aed',
    desc: 'Weekly sync with your GTM Architect to review priorities, blockers, and align on the week\'s goals.',
  },
  {
    day: 'Tues-Thurs',
    title: 'Execution',
    color: '#a855f7',
    desc: 'Engineers and specialists execute on projects, with async updates via Slack and your project board.',
  },
  {
    day: 'Friday',
    title: 'Review & Report',
    color: '#8b5cf6',
    desc: 'End-of-week summary with completed work, metrics updates, and next week\'s preview.',
  },
];

const commsStats = [
  { value: '< 4 hours', label: 'Response Time' },
  { value: '1-2 calls', label: 'Weekly Syncs' },
  { value: 'Slack + Loom', label: 'Communication' },
  { value: 'Shared Board', label: 'Project Tracking' },
];

export default function WhyLeanScale() {
  const { customer, customerPath } = useCustomer();
  const diagnosticType = customer.diagnosticType || 'gtm';
  const diagnosticHref = customer.hasDiagnosticResult
    ? `/diagnostic/${diagnosticType}`
    : '/diagnostic/start';

  return (
    <Layout title="Why LeanScale?">

      {/* HERO */}
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
            FRACTIONAL GTM OPS FOR B2B TECH
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Go-to-Market<br />
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Operations.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#a1a1aa',
            maxWidth: 650,
            margin: '0 auto 1.5rem',
            lineHeight: 1.6,
          }}>
            LeanScale provides fractional GTM Operations teams for B2B tech startups, delivering
            enterprise-grade revenue operations without the enterprise price tag.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={customerPath('/getting-started')} style={{
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
              Get Started
            </Link>
            <Link href={customerPath('/diagnostic')} style={{
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
              Start GTM Diagnostic
            </Link>
          </div>
        </div>
      </div>

      {/* STATS BAR */}
      <div style={{ background: '#fafafa', borderBottom: '1px solid #e5e7eb', padding: '2rem 0' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CAPITAL CLOCK */}
      <div id="capital-clock" style={{ scrollMarginTop: '100px' }}>
        <div className="container" style={{ padding: '4rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>The Capital Clock</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Time is your scarcest resource</h2>
            <p style={{ color: '#6b7280', maxWidth: 600, margin: '0 auto' }}>
              For every B2B startup, the clock starts ticking the moment you raise capital. Every day without proper GTM infrastructure is a day of lost potential.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <p style={{ marginBottom: '1rem', lineHeight: 1.7, fontSize: '0.95rem', color: '#374151' }}>
                You have 18-24 months to prove product-market fit, build repeatable revenue, and set up for your next milestone.
              </p>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: '#fef2f2', borderRadius: '10px', marginBottom: '1rem' }}>
                <span style={{ color: '#ef4444', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>-</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.2rem' }}>The Challenge</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5 }}>
                    Building an in-house RevOps team takes 6-12 months of hiring, training, and iteration. By then, you&apos;ve burned through precious runway without the systems to show for it.
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem', background: '#f0fdf4', borderRadius: '10px', marginBottom: '1rem' }}>
                <span style={{ color: '#a3e635', fontWeight: 700, fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>+</span>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.2rem' }}>The Solution</div>
                  <div style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5 }}>
                    LeanScale gives you a battle-tested GTM operations team from day one. We&apos;ve built these systems dozens of times — we know what works, what doesn&apos;t, and how to get you operational in weeks, not months.
                  </div>
                </div>
              </div>
              <div style={{ padding: '1rem 1.25rem', background: '#f5f3ff', borderRadius: '10px', borderLeft: '3px solid #7c3aed' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Key Insight</div>
                <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5 }}>
                  Companies that invest in GTM operations early see 40% faster pipeline velocity and 30% higher conversion rates within the first year.
                </div>
              </div>
            </div>
            <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden' }}>
              <ImageZoom
                src="/images/capital-clock-screenshot.png"
                alt="The Capital Clock - GTM Operations Roadmap from Seed to Series D+"
              />
            </div>
          </div>
        </div>
      </div>

      {/* WHAT IS GTM OPS */}
      <div id="what-is-gtm-ops" style={{ background: '#fafafa', padding: '4rem 0', scrollMarginTop: '100px' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>What is GTM Operations?</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>The engine behind revenue growth</h2>
            <p style={{ color: '#6b7280', maxWidth: 600, margin: '0 auto' }}>
              GTM Operations (also known as Revenue Operations or RevOps) is the operational backbone that connects
              your Marketing, Sales, and Customer Success teams.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'start', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {[
                  { title: 'Everything Data', desc: 'From lead enrichment to customer health scores, GTM Ops ensures your data is clean, connected, and actionable. We build the pipelines that turn raw data into revenue intelligence.' },
                  { title: 'Processes & Workflows', desc: 'Lead routing, opportunity management, renewal tracking, and more. We design and implement the workflows that keep your revenue engine running smoothly.' },
                  { title: 'Technology Stack', desc: 'CRM, Marketing Automation, Sales Engagement, Customer Success platforms — we implement, integrate, and optimize your entire GTM tech stack.' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e5e7eb' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#374151', marginBottom: '0.5rem', margin: '0 0 0.5rem' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '-0.02em' }}>148</div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Services Available</div>
                </div>
                <div style={{ background: 'white', padding: '1.25rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '-0.02em' }}>68</div>
                  <div style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Detailed Playbooks</div>
                </div>
              </div>
              <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden' }}>
                <ImageZoom
                  src="/images/gtm-ops-screenshot.png"
                  alt="GTM Ops Matrix - The Full Stack View"
                />
              </div>
            </div>
          </div>

          <div style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <ImageZoom
              src="/images/gtm-ops-projects-screenshot.png"
              alt="LeanScale GTM Ops Projects by Function"
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href={customerPath('/about/services')} style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: 'white',
              padding: '0.85rem 2rem',
              borderRadius: '9999px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}>
              View Full Services Catalog
            </Link>
          </div>
        </div>
      </div>

      {/* IN-HOUSE VS PARTNER - Comparison Table */}
      <div id="in-house-vs-partner" style={{ scrollMarginTop: '100px' }}>
        <div className="container" style={{ padding: '4rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>In-House vs Partner</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Why partnering beats building</h2>
            <p style={{ color: '#6b7280', maxWidth: 600, margin: '0 auto' }}>
              The build vs. buy decision is critical for startups. Here&apos;s why partnering with LeanScale gives you
              the best of both worlds — expertise, speed, and cost efficiency.
            </p>
          </div>

          <div style={{ maxWidth: 700, margin: '0 auto 2.5rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#f9fafb', padding: '0.75rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#ef4444', letterSpacing: '0.05em', textAlign: 'center' }}>In-House</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#7c3aed', letterSpacing: '0.05em', textAlign: 'center' }}>LeanScale</div>
            </div>
            {comparisonRows.map((row, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0.85rem 1.25rem',
                borderBottom: i < comparisonRows.length - 1 ? '1px solid #f3f4f6' : 'none',
                background: i % 2 === 0 ? 'white' : '#fafafa', alignItems: 'center',
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{row.label}</div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center', textDecoration: 'line-through', textDecorationColor: '#fca5a5' }}>{row.theirs}</div>
                <div style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 600, textAlign: 'center' }}>{row.ours}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: '#e9d8f4', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden' }}>
              <ImageZoom
                src="/images/in-house-vs-partner-screenshot.png"
                alt="In-House vs LeanScale Comparison"
              />
            </div>
            <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden' }}>
              <ImageZoom
                src="/images/grow-efficiently-screenshot.png"
                alt="Grow quickly and efficiently through each stage"
              />
            </div>
          </div>
        </div>
      </div>

      {/* POD STRUCTURE - Cards with colored top borders */}
      <div id="pod-structure" style={{ background: '#fafafa', padding: '4rem 0', scrollMarginTop: '100px' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>GTM Pod Structure</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Build the best B2B GTM Ops org</h2>
            <p style={{ color: '#6b7280', maxWidth: 550, margin: '0 auto' }}>
              Every LeanScale engagement includes a dedicated pod of specialists, not generalists.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}>
            {podRoles.map((role) => (
              <div key={role.title} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${role.color}, ${role.color}88)`,
                }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.5rem', color: '#374151' }}>{role.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5, margin: 0 }}>
                  {role.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <ImageZoom
              src="/images/pod-structure-screenshot.png"
              alt="Build The Best 0 FTE GTM Ops Org"
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link href={customerPath('/getting-started/team')} style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: 'white',
              padding: '0.85rem 2rem',
              borderRadius: '9999px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}>
              Meet Your Team
            </Link>
          </div>
        </div>
      </div>

      {/* WORKING WITH LEANSCALE - Timeline cards */}
      <div id="working-with-leanscale" style={{ scrollMarginTop: '100px' }}>
        <div className="container" style={{ padding: '4rem 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Working with LeanScale</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>A week in the life with your LeanScale team</h2>
            <p style={{ color: '#6b7280', maxWidth: 550, margin: '0 auto' }}>
              Structured weekly cadence. Clear deliverables. Constant communication.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {weeklySchedule.map((item, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${item.color}, ${item.color}88)` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ background: item.color, color: 'white', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{item.day}</span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{item.title}</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ background: '#1a1a2e', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <ImageZoom
              src="/images/working-with-leanscale-screenshot.png"
              alt="A Week in the Life with your LeanScale Team"
            />
          </div>

          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid #e5e7eb' }}>
            <ImageZoom
              src="/images/highest-value-projects-screenshot.png"
              alt="Quickly Address Poor Performance With The Highest Value Projects"
            />
          </div>
        </div>
      </div>

      {/* COMMS STATS BAR */}
      <div style={{ background: '#fafafa', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '2rem 0' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
            {commsStats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '-0.02em' }}>{stat.value}</div>
                <div style={{ color: '#6b7280', fontSize: '0.8rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 40%, #2d1845 100%)',
        padding: '5rem 0',
        textAlign: 'center',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Ready to accelerate your GTM?
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 0.75rem' }}>
            Start with a GTM Diagnostic or schedule time to discuss your needs.
          </p>
          <p style={{ color: '#71717a', fontSize: '0.9rem', maxWidth: 450, margin: '0 auto 2rem' }}>
            148 services. 68 playbooks. Enterprise-grade operations at startup speed.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={customerPath(diagnosticHref)} style={{
              display: 'inline-block', background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)', color: '#0a0118',
              padding: '0.9rem 2rem', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', boxShadow: '0 0 25px rgba(163,230,53,0.25)',
            }}>
              {customer.hasDiagnosticResult ? 'View Diagnostic' : 'Start Diagnostic'}
            </Link>
            <Link href={customerPath('/getting-started')} style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', padding: '0.9rem 2rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem',
            }}>
              Start Engagement
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
