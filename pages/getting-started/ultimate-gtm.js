import Link from 'next/link';
import Layout from '../../components/Layout';
import { useCustomer } from '../../context/CustomerContext';

const stats = [
  { value: '68', label: 'Playbooks Delivered' },
  { value: '12-16', label: 'Week Engagement' },
  { value: '6', label: 'Workstreams' },
  { value: '$200K', label: 'Fixed Investment' },
];

const comparisonRows = [
  { label: 'Timeline', theirs: '12-24 months', ours: '12-16 weeks' },
  { label: 'Cost', theirs: '$500K-1M+', ours: '$200,000 flat' },
  { label: 'Scope', theirs: 'One workstream at a time', ours: 'All 6 workstreams in parallel' },
  { label: 'Day 1', theirs: 'Discovery workshop', ours: 'Building' },
  { label: 'Week 4', theirs: 'Still scoping', ours: 'First playbooks delivered' },
  { label: 'Deliverable', theirs: 'Recommendations deck', ours: 'Working systems + trained team' },
  { label: 'Ongoing support', theirs: 'Billable hours', ours: '30-day post-launch included' },
];

const phases = [
  {
    week: '1-2',
    title: 'Discovery & Architecture',
    color: '#7c3aed',
    items: [
      'Full GTM audit — processes, tools, data, team structure',
      'Growth model and GTM lifecycle mapping',
      'ICP refinement and market segmentation',
      'Architecture blueprint for all 6 workstreams',
      'Priority sequencing based on revenue impact',
    ],
  },
  {
    week: '3-6',
    title: 'Foundation Build',
    color: '#a855f7',
    items: [
      'CRM optimization — deduplication, hygiene, automations',
      'Lead lifecycle and routing implementation',
      'Sales lifecycle and territory design',
      'Marketing-to-Sales SLA and handoff process',
      'Foundational reporting and dashboards',
    ],
  },
  {
    week: '7-12',
    title: 'Full Stack Deployment',
    color: '#8b5cf6',
    items: [
      'Lead scoring, attribution, and enrichment live',
      'Sales engagement platform and outbound automation',
      'CPQ, billing, and quote-to-cash workflows',
      'Customer success lifecycle and health scoring',
      'ABM/ABS system and nurture programs deployed',
    ],
  },
  {
    week: '13-16',
    title: 'Optimization & Handoff',
    color: '#6d28d9',
    items: [
      'Executive reporting suite and ARR dashboards',
      'Pipeline analytics and forecasting process',
      'Commission design and revenue intelligence',
      'Full team training — reps, managers, leadership',
      'Runbooks, SOPs, and 30-day post-launch support',
    ],
  },
];

const workstreams = [
  {
    title: 'Foundation & Strategy',
    icon: '🏗️',
    color: '#7c3aed',
    items: [
      'Growth Model',
      'GTM Lifecycle',
      'Market Map & ICP',
      'GTM Org Design',
    ],
  },
  {
    title: 'Marketing Operations',
    icon: '📣',
    color: '#a855f7',
    items: [
      'Lead Lifecycle',
      'Automated Inbound Enrichment',
      'Lead Scoring Model',
      'Multi-Touch Attribution',
      'Lead Routing',
      'Marketing-to-Sales SLA',
      'MAP Implementation',
      'Inbound Journey Mapping',
      'Form & Lead Capture',
      'Email Nurture Programs',
      'Database Segmentation',
      'ABM/ABS System',
      'Event ROI Reporting',
      'Marketing Reporting Pack',
    ],
  },
  {
    title: 'Sales Operations',
    icon: '💼',
    color: '#8b5cf6',
    items: [
      'Sales Lifecycle',
      'Territory Design',
      'Quotas & Targets',
      'Forecasting Process',
      'Rules of Engagement',
      'Sales Qualification',
      'Automated Outbound',
      'Activity Capture',
      'Sales Engagement Platform',
      'E-Signature Setup',
      'Conversation Intelligence',
      'Commission Design',
      'Revenue Intelligence',
    ],
  },
  {
    title: 'Quote-to-Cash',
    icon: '💰',
    color: '#6d28d9',
    items: [
      'Pricing & Packaging',
      'CPQ Implementation',
      'Billing Infrastructure',
      'Revenue Recognition',
    ],
  },
  {
    title: 'Customer Success',
    icon: '🤝',
    color: '#5b21b6',
    items: [
      'Customer Lifecycle',
      'Sales-to-CS Handoff',
      'NRR/GRR Reporting',
      'Health Scoring',
    ],
  },
  {
    title: 'CRM Optimization',
    icon: '🧹',
    color: '#4c1d95',
    items: [
      'CRM Deduplication',
      'Ongoing Dedupe Tool',
      'Foundational Automations',
      'Reporting Logic',
      'Opportunity UX',
      'Lead Routing Config',
      'Data Hygiene',
      'Integration Audit',
    ],
  },
];

const outcomes = [
  { icon: '📈', label: 'Predictable Revenue' },
  { icon: '🎯', label: 'Clear Attribution' },
  { icon: '⚡', label: 'Faster Cycles' },
  { icon: '📊', label: 'Board-Ready Metrics' },
  { icon: '🔄', label: 'Scalable Process' },
  { icon: '💰', label: 'Lower CAC' },
  { icon: '📈', label: 'Higher Win Rates' },
  { icon: '⏱️', label: 'Shorter Sales Cycles' },
  { icon: '🎯', label: 'Accurate Forecasts' },
  { icon: '💪', label: 'Rep Productivity' },
  { icon: '🧹', label: 'Clean Data' },
  { icon: '✅', label: 'CRM Adoption' },
];

const testimonials = [
  {
    quote: 'This team has done an incredible job with our portcos. They\'re ready to engage the second we make an investment and give our founders the best shot at winning.',
    author: 'Michael Dzik',
    title: 'Growth Partner, Radian Capital',
    initials: 'MD',
  },
  {
    quote: 'This is the most competent team I\'ve ever worked with. They know exactly what to do and how to tailor it to your business.',
    author: 'Thomas Miller',
    title: 'CRO, Human',
    initials: 'TM',
  },
  {
    quote: 'LeanScale had us live on Salesforce in 30 days. Our reps were logging deals by week two. The speed was unreal, but what impressed us most was how tailored it was to our process.',
    author: 'Donal Tobin',
    title: 'CEO, Integrate.io',
    initials: 'DT',
  },
];

const clients = ['Clio', 'Chainguard', 'Mistral', 'CB Insights', 'Fountain', 'Wealth.com', 'SpyCloud', 'Integrate.io', 'AssemblyAI', 'Spectora', 'Komet Sales', 'Govenda'];

export default function UltimateGTM() {
  const { customer, customerPath } = useCustomer();
  const diagnosticType = customer.diagnosticType || 'gtm';
  const diagnosticHref = customer.hasDiagnosticResult
    ? `/diagnostic/${diagnosticType}`
    : '/diagnostic/start';

  return (
    <Layout title="Ultimate GTM">

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
            68 PLAYBOOKS. 6 WORKSTREAMS. ONE ENGAGEMENT.
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Ultimate GTM.<br />
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Complete Transformation.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#a1a1aa',
            maxWidth: 600,
            margin: '0 auto 1rem',
            lineHeight: 1.6,
          }}>
            The complete revenue operations overhaul. Every system, every process, fully optimized. All the bells and whistles — nothing held back.
          </p>

          <p style={{
            fontSize: '1.1rem',
            color: '#e4e4e7',
            maxWidth: 500,
            margin: '0 auto 2.5rem',
            fontWeight: 500,
          }}>
            $200,000 fixed. 12-16 weeks. Done.
          </p>

          <a
            href="#workstreams"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              color: '#0a0118',
              padding: '1rem 2.5rem',
              borderRadius: '9999px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '1.05rem',
              boxShadow: '0 0 30px rgba(163,230,53,0.3)',
              letterSpacing: '-0.01em',
            }}
          >
            See What&apos;s Included
          </a>
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

      {/* COMPARISON TABLE */}
      <div className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Why This Is Different</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>Big-firm scope. Startup speed.</h2>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#f9fafb', padding: '0.75rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af', letterSpacing: '0.05em' }}></div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#ef4444', letterSpacing: '0.05em', textAlign: 'center' }}>Typical Firm</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#7c3aed', letterSpacing: '0.05em', textAlign: 'center' }}>LeanScale</div>
          </div>
          {comparisonRows.map((row, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '0.85rem 1.25rem',
              borderBottom: i < comparisonRows.length - 1 ? '1px solid #f3f4f6' : 'none',
              background: i % 2 === 0 ? 'white' : '#fafafa', alignItems: 'center',
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>{row.label}</div>
              <div style={{ fontSize: '0.85rem', color: '#9ca3af', textAlign: 'center', textDecoration: 'line-through', textDecorationColor: '#fca5a5' }}>{row.theirs}</div>
              <div style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 600, textAlign: 'center' }}>{row.ours}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TIMELINE */}
      <div style={{ background: '#fafafa', padding: '4rem 0' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>The 16-Week Playbook</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>From audit to fully operational in one quarter</h2>
            <p style={{ color: '#6b7280', maxWidth: 550, margin: '0 auto' }}>
              Four phases. Six workstreams running in parallel. Every deliverable has an owner, a deadline, and a definition of done.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {phases.map((phase, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${phase.color}, ${phase.color}88)` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ background: phase.color, color: 'white', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>WK {phase.week}</span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{phase.title}</h3>
                </div>
                {phase.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.3rem 0', fontSize: '0.82rem', color: '#4b5563', lineHeight: 1.4 }}>
                    <span style={{ color: phase.color, flexShrink: 0, marginTop: '2px' }}>+</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', borderRadius: '12px', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ color: '#e9d5ff', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.25rem' }}>The Guarantee</div>
              <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>Every playbook delivered, every system live, every team trained — or we keep working until it is.</div>
            </div>
            <div style={{ color: '#a3e635', fontSize: '1.5rem', fontWeight: 800, whiteSpace: 'nowrap' }}>$200,000</div>
          </div>
        </div>
      </div>

      {/* WORKSTREAMS */}
      <div id="review-scope" className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Full Scope</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>6 workstreams. 68 playbooks. Zero gaps.</h2>
          <p style={{ color: '#6b7280', maxWidth: 550, margin: '0 auto' }}>
            Every deliverable below is included. Not upsold. Not phased. Delivered.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          {workstreams.map((ws) => (
            <div key={ws.title} className="card" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '3px',
                background: ws.color,
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{ws.icon}</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{ws.title}</h3>
                <span style={{
                  marginLeft: 'auto',
                  background: '#f3f4f6',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  color: '#6b7280',
                }}>
                  {ws.items.length} deliverables
                </span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', listStyle: 'none' }}>
                {ws.items.map((item) => (
                  <li key={item} style={{
                    fontSize: '0.85rem',
                    color: '#374151',
                    lineHeight: 1.8,
                    position: 'relative',
                    paddingLeft: '0.25rem',
                  }}>
                    <span style={{ position: 'absolute', left: '-1.25rem', color: ws.color }}>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Reporting & Analytics */}
        <div style={{
          padding: '1.5rem',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📊</span>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Reporting & Analytics</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {['Executive Reporting Suite', 'ARR Dashboards', 'Pipeline Analytics', 'GTM Reporting Pack'].map((item) => (
              <div key={item} style={{
                background: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#374151',
                border: '1px solid #e5e7eb',
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KEY OUTCOMES */}
      <div style={{ background: '#fafafa', padding: '4rem 0' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>What You Walk Away With</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>12 outcomes that change how you operate</h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
            maxWidth: 900,
            margin: '0 auto',
          }}>
            {outcomes.map((outcome, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.85rem 1rem',
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#374151',
              }}>
                <span style={{ fontSize: '1.1rem' }}>{outcome.icon}</span>
                {outcome.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHO IT'S FOR / NOT FOR */}
      <div className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          <div>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Who This Is For</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Built for companies ready to scale.</h2>
            <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              You&apos;ve found product-market fit. Revenue is growing. But your GTM engine is held together with duct tape and spreadsheets. Ultimate GTM fixes that — permanently.
            </p>
            {[
              'Series B-D B2B tech companies',
              '100-1,000 employees',
              'Sales teams of 15-100+ reps',
              'Multiple GTM motions (inbound, outbound, PLG)',
              'Board asking for predictable, scalable revenue',
              'RevOps team exists but is underwater',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#a3e635', fontWeight: 700 }}>+</span> {item}
              </div>
            ))}
          </div>
          <div>
            <p style={{ color: '#ef4444', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Who This Is NOT For</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Not every company needs this.</h2>
            <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              If you need one or two playbooks, start with Embedded. Ultimate GTM is for companies that need the whole engine rebuilt.
            </p>
            {[
              'Pre-revenue or pre-PMF startups',
              'Companies that only need CRM help (see Ultimate CRM)',
              'Teams looking for a single-function fix',
              'Organizations not ready to commit executive sponsorship',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
                <span style={{ color: '#ef4444' }}>-</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ background: '#fafafa', padding: '4rem 0' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '2rem', color: '#e5e7eb', lineHeight: 1, marginBottom: '0.5rem' }}>&ldquo;</div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: '#374151', flex: 1, fontStyle: 'italic' }}>{t.quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 600 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.author}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{t.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.75rem' }}>Trusted By</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
              {clients.map((name, i) => (
                <span key={i} style={{ padding: '0.35rem 0.85rem', background: 'white', border: '1px solid #f3f4f6', borderRadius: '9999px', fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 }}>{name}</span>
              ))}
            </div>
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
            Stop patching. Start building.
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 0.75rem' }}>68 playbooks. 6 workstreams. 12-16 weeks.</p>
          <p style={{ color: '#71717a', fontSize: '0.9rem', maxWidth: 450, margin: '0 auto 2rem' }}>
            $200,000 fixed investment. No hourly billing. No scope creep. No surprises.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={customerPath(diagnosticHref)} style={{
              display: 'inline-block', background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)', color: '#0a0118',
              padding: '0.9rem 2rem', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', boxShadow: '0 0 25px rgba(163,230,53,0.25)',
            }}>
              {customer.hasDiagnosticResult ? 'View Diagnostic' : 'Start Diagnostic'}
            </Link>
            <a href="#workstreams" style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', padding: '0.9rem 2rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem',
            }}>
              View All Deliverables
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
