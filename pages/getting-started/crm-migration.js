import Link from 'next/link';
import Layout from '../../components/Layout';

const stats = [
  { value: '50+', label: 'CRM Implementations' },
  { value: '30', label: 'Days to Live Pipeline' },
  { value: '80%+', label: 'Rep Adoption Rate' },
  { value: '$0', label: 'Surprise Fees' },
];

const comparisonRows = [
  { label: 'Timeline', theirs: '6-18 months', ours: '30 days' },
  { label: 'Cost', theirs: '$100K-300K', ours: '$25,000 flat' },
  { label: 'Day 1', theirs: 'Kickoff meeting', ours: 'Building' },
  { label: 'Week 4', theirs: 'Still in discovery', ours: 'Your team is live' },
  { label: 'Deliverable', theirs: 'A 40-slide deck', ours: 'A working pipeline' },
  { label: 'Adoption guarantee', theirs: 'None', ours: 'Or we keep working free' },
];

const sprintWeeks = [
  {
    week: '1',
    title: 'Foundation',
    color: '#7c3aed',
    items: [
      'Pipeline stages mapped to your sales process',
      'Deal properties and custom fields configured',
      'User permissions and role hierarchy',
      'Historical data import and deduplication',
      'Naming conventions and data standards',
    ],
  },
  {
    week: '2',
    title: 'Automation',
    color: '#a855f7',
    items: [
      'Lead routing and assignment rules',
      'Lead scoring model based on your ICP',
      'Activity tracking and logging automation',
      'Stage-based workflow triggers',
      'Notification and task automation',
    ],
  },
  {
    week: '3',
    title: 'Integration',
    color: '#8b5cf6',
    items: [
      'Email sync (Gmail / Outlook)',
      'Calendar integration for meeting tracking',
      'Slack alerts for deal movements',
      'Essential tool connections (Outreach, Gong, etc.)',
      'API setup for custom integrations',
    ],
  },
  {
    week: '4',
    title: 'Launch',
    color: '#6d28d9',
    items: [
      'Pipeline and velocity dashboards',
      'Forecasting and conversion reports',
      'Team training session #1 (reps)',
      'Team training session #2 (managers)',
      'Go-live with adoption monitoring',
    ],
  },
];

const migrationWeeks = [
  {
    week: '1-2',
    title: 'Planning & Mapping',
    items: [
      'Full audit of source CRM (objects, fields, automations, integrations)',
      'Data mapping document — every field, every object, every relationship',
      'Custom object architecture in target system',
      'Migration runbook with rollback plan',
    ],
  },
  {
    week: '3-4',
    title: 'Data Migration',
    items: [
      'Contacts, companies, deals, activities, notes — everything moves',
      'Historical data preservation (no orphaned records)',
      'Deduplication and data cleanup during transfer',
      'Custom object and relationship recreation',
    ],
  },
  {
    week: '5-6',
    title: 'Rebuild & Connect',
    items: [
      'Workflow and automation rebuild in new system',
      'Integration reconnection (email, calendar, tools)',
      'Reporting and dashboard recreation',
      'Parallel run — old system stays live until new one is proven',
    ],
  },
  {
    week: '7-8',
    title: 'Launch & Train',
    items: [
      'User acceptance testing with your team',
      'Full team retraining on new platform',
      'Cutover day — zero downtime transition',
      '30 days of Slack support post-launch',
    ],
  },
];

const salesforceDetails = [
  { label: 'Opportunity Management', desc: 'Custom stages, record types, and page layouts matched to your sales motion' },
  { label: 'Reports & Dashboards', desc: 'Pipeline, velocity, forecast, and rep activity — real-time visibility for leadership' },
  { label: 'Flows & Process Builder', desc: 'Automated lead routing, task creation, field updates, and approval processes' },
  { label: 'AppExchange Integrations', desc: 'Outreach, Gong, Clari, ZoomInfo, Slack — connected and configured' },
  { label: 'Custom Objects', desc: 'Product catalog, territories, partner tracking — whatever your process needs' },
  { label: 'Permission Sets & Profiles', desc: 'Role hierarchy, field-level security, and sharing rules done right' },
];

const hubspotDetails = [
  { label: 'Deal Pipeline', desc: 'Customized stages, required properties, and automation triggers per pipeline' },
  { label: 'Custom Reports', desc: 'Revenue analytics, funnel conversion, deal velocity — all in one dashboard' },
  { label: 'Workflows', desc: 'Lead rotation, lifecycle stage automation, task queues, and internal notifications' },
  { label: 'Native Integrations', desc: 'Gmail/Outlook sync, Slack, Zoom, LinkedIn Sales Nav — plug and play' },
  { label: 'Sequences & Templates', desc: 'Sales email sequences, meeting links, and quote generation built-in' },
  { label: 'Properties & Views', desc: 'Custom properties, filtered views, and saved segments for every team' },
];

const caseStudies = [
  {
    company: 'Integrate.io',
    logoText: 'integrate.io',
    logoBg: '#1a1a2e',
    logoColor: '#4fc3f7',
    industry: 'Data Integration / SaaS',
    type: '30-Day Implementation',
    platform: 'Salesforce',
    challenge: 'Growing sales team with no standardized pipeline, manual processes everywhere, and zero reporting visibility for leadership.',
    result: 'Fully operational Salesforce in 30 days — pipeline stages, lead routing, dashboards, and full team adoption.',
    quote: 'LeanScale had us live on Salesforce in 30 days. Our reps were logging deals by week two. The speed was unreal, but what impressed us most was how tailored it was to our process.',
    author: 'Donal Tobin',
    title: 'CEO, Integrate.io',
  },
  {
    company: 'Mistral',
    logoText: 'mistral',
    logoBg: '#0d0d0d',
    logoColor: '#ff7000',
    industry: 'AI / Deep Tech',
    type: '60-Day Migration',
    platform: 'Salesforce',
    challenge: 'Needed to migrate to Salesforce AND build monthly contracted revenue tracking simultaneously — under intense timeline pressure.',
    result: 'Complete migration with zero data loss, zero downtime. MCR tracking live. Leadership has real-time revenue visibility.',
    quote: null,
    author: null,
    title: null,
  },
  {
    company: 'Clio',
    logoText: 'clio',
    logoBg: '#002b49',
    logoColor: '#00b4d8',
    industry: 'Legal Tech / SaaS',
    type: 'Multiple Sprints',
    platform: 'Salesforce',
    challenge: 'Had Salesforce but lacked win rate visibility, post-sales tracking, MRR reporting, and SE workflow visibility.',
    result: 'Heat maps for win/loss analysis, full post-sales lifecycle tracking, automated MRR reporting, SE workload visible to leadership.',
    quote: null,
    author: null,
    title: null,
  },
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

export default function CrmMigration() {
  return (
    <Layout title="Ultimate CRM">

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
            LIMITED TO 4 SPRINTS PER MONTH
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Ultimate CRM.<br />
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              30 Days to Pipeline.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#a1a1aa',
            maxWidth: 600,
            margin: '0 auto 1rem',
            lineHeight: 1.6,
          }}>
            Your CRM should take less time to implement than your free trial takes to expire.
          </p>

          <p style={{
            fontSize: '1.1rem',
            color: '#e4e4e7',
            maxWidth: 500,
            margin: '0 auto 2.5rem',
            fontWeight: 500,
          }}>
            Not a deck. Not a &ldquo;roadmap.&rdquo;<br />A pipeline your reps actually use.
          </p>

          <a
            href="#packages"
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
              transition: 'all 0.2s ease',
              letterSpacing: '-0.01em',
            }}
          >
            See What&apos;s Included
          </a>
        </div>
      </div>

      {/* TWO PATHS */}
      <div className="container" style={{ padding: '3rem 2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Two Paths, One Goal</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Choose your starting point</h2>
          <p style={{ color: '#6b7280', maxWidth: 550, margin: '0 auto' }}>
            Whether you&apos;re starting from scratch or migrating from an existing CRM, we have a fixed-scope package that gets you live fast.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1rem' }}>
          <a href="#packages" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: 'white', border: '2px solid #7c3aed', borderRadius: '16px', padding: '2rem', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚀</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>30-Day Implementation</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#7c3aed', marginBottom: '0.5rem' }}>$25,000</div>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                No CRM or a barely-used one? We build your HubSpot or Salesforce from the ground up — live pipeline in 30 days.
              </p>
            </div>
          </a>
          <a href="#migration" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: 'white', border: '2px solid #f59e0b', borderRadius: '16px', padding: '2rem', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔄</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>60-Day Migration</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.5rem' }}>$35,000</div>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                Switching CRMs? Full data migration, workflow rebuild, and team retraining — zero data loss, zero downtime.
              </p>
            </div>
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
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>Traditional consultants vs. LeanScale</h2>
        </div>

        <div style={{ maxWidth: 700, margin: '0 auto', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#f9fafb', padding: '0.75rem 1.25rem', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.05em' }}></div>
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
              <div style={{ fontSize: '0.85rem', color: '#6b7280', textAlign: 'center', textDecoration: 'line-through', textDecorationColor: '#fca5a5' }}>{row.theirs}</div>
              <div style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 600, textAlign: 'center' }}>{row.ours}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 30-DAY SPRINT */}
      <div id="packages" style={{ background: '#fafafa', padding: '4rem 0' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>30-Day Implementation Sprint — $25,000</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>4 weeks. Live pipeline. Reps logging deals.</h2>
            <p style={{ color: '#6b7280', maxWidth: 550, margin: '0 auto' }}>
              For companies with no CRM or a barely-used one. Post-funding teams scaling sales. HubSpot or Salesforce — your choice.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            {sprintWeeks.map((week, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${week.color}, ${week.color}88)` }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ background: week.color, color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>W{week.week}</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{week.title}</h3>
                </div>
                {week.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.3rem 0', fontSize: '0.82rem', color: '#4b5563', lineHeight: 1.4 }}>
                    <span style={{ color: week.color, flexShrink: 0, marginTop: '2px' }}>+</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)', borderRadius: '12px', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ color: '#e9d5ff', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.25rem' }}>The Guarantee</div>
              <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>If your team isn&apos;t using it by Day 30, we keep working — at no additional cost — until they are.</div>
            </div>
            <div style={{ color: '#a3e635', fontSize: '1.5rem', fontWeight: 800, whiteSpace: 'nowrap' }}>$25,000</div>
          </div>
        </div>
      </div>

      {/* 60-DAY MIGRATION */}
      <div className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>60-Day CRM Migration — $35,000</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Zero data loss. Zero downtime. 60 days.</h2>
          <p style={{ color: '#6b7280', maxWidth: 600, margin: '0 auto' }}>
            Salesforce to HubSpot. HubSpot to Salesforce. Legacy CRM to modern platform. Full data migration, workflow rebuild, and team retraining.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          {migrationWeeks.map((phase, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e5e7eb', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #f59e0b, #f59e0b88)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ background: '#f59e0b', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>WK {phase.week}</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{phase.title}</h3>
              </div>
              {phase.items.map((item, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.3rem 0', fontSize: '0.82rem', color: '#4b5563', lineHeight: 1.4 }}>
                  <span style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }}>+</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', borderRadius: '12px', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ color: '#fef3c7', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '0.25rem' }}>The Migration Guarantee</div>
            <div style={{ color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>Zero data loss. Zero downtime. If we miss either, we fix it free.</div>
          </div>
          <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, whiteSpace: 'nowrap' }}>$35,000</div>
        </div>
      </div>

      {/* PLATFORM DEEP DIVES */}
      <div style={{ background: '#fafafa', padding: '4rem 0' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Platform Expertise</p>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>We implement the right CRM for your team.</h2>
            <p style={{ color: '#6b7280', maxWidth: 550, margin: '0 auto' }}>Premier partners with both Salesforce and HubSpot. We recommend the platform based on your team size, complexity, and existing tech stack.</p>
          </div>

          {/* Salesforce */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '1.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #0176d3 0%, #014486 100%)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Salesforce</h3>
                <p style={{ color: '#b4d7ff', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>Enterprise-grade CRM for scaling B2B teams</p>
              </div>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600 }}>Premier Partner</span>
            </div>
            <div style={{ padding: '1.5rem 2rem' }}>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Best for companies with 15+ reps, complex sales processes, multi-object data models, or enterprise integration requirements. If you need granular control over permissions, advanced reporting, or AppExchange ecosystem access — Salesforce is the play.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {salesforceDetails.map((item, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: '#f0f7ff', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0176d3', marginBottom: '0.2rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* HubSpot */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #ff7a59 0%, #e0563b 100%)', padding: '1.5rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>HubSpot</h3>
                <p style={{ color: '#ffd4c9', fontSize: '0.85rem', margin: '0.25rem 0 0' }}>All-in-one CRM platform for fast-moving teams</p>
              </div>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 600 }}>Premier Partner</span>
            </div>
            <div style={{ padding: '1.5rem 2rem' }}>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Best for companies with 5-30 reps who want marketing, sales, and service in one platform. If your team values ease of use, fast onboarding, native integrations, and lower total cost of ownership — HubSpot is the move.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
                {hubspotDetails.map((item, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: '#fff5f2', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ff7a59', marginBottom: '0.2rem' }}>{item.label}</div>
                    <div style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.4 }}>{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CASE STUDIES */}
      <div className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Real Results From Real Sprints</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>Companies that sprinted with us</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {caseStudies.map((study, i) => (
            <div key={i} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    background: study.logoBg,
                    borderRadius: '10px',
                    padding: '0.5rem 0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '80px',
                    height: '36px',
                  }}>
                    <span style={{
                      color: study.logoColor,
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      letterSpacing: '-0.02em',
                      textTransform: 'lowercase',
                      whiteSpace: 'nowrap',
                    }}>{study.logoText}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{study.industry}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{ background: '#f5f3ff', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: '#7c3aed', fontWeight: 600 }}>{study.type}</span>
                  <span style={{ background: '#f3f4f6', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: '#6b7280' }}>{study.platform}</span>
                </div>
              </div>
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Challenge</div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '0.75rem' }}>{study.challenge}</p>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>Result</div>
                <p style={{ fontSize: '0.85rem', color: '#374151', lineHeight: 1.5, fontWeight: 500, margin: 0 }}>{study.result}</p>
              </div>
              {study.quote && (
                <div style={{ padding: '1rem 1.5rem', background: '#fafafa', borderTop: '1px solid #f3f4f6' }}>
                  <p style={{ fontSize: '0.82rem', fontStyle: 'italic', color: '#4b5563', lineHeight: 1.5, margin: '0 0 0.5rem' }}>&ldquo;{study.quote}&rdquo;</p>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{study.author}, <span style={{ fontWeight: 400, color: '#6b7280' }}>{study.title}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.75rem' }}>Trusted By</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
            {clients.map((name, i) => (
              <span key={i} style={{ padding: '0.35rem 0.85rem', background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '9999px', fontSize: '0.78rem', color: '#6b7280', fontWeight: 500 }}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ background: '#fafafa', padding: '4rem 0' }}>
        <div className="container" style={{ padding: '0 2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
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
        </div>
      </div>

      {/* WHO IT'S FOR / NOT FOR */}
      <div className="container" style={{ padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          <div>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Who This Is For</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Built for B2B teams that need to move fast.</h2>
            <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              We work with Series A-C tech companies that have just closed funding and need pipeline visibility now — not next quarter.
            </p>
            {['Series A-C B2B tech companies', '50-500 employees', 'Sales teams of 5-50 reps', 'Recently closed funding round', 'Current CRM is broken, outgrown, or nonexistent'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', fontSize: '0.9rem', color: '#374151' }}>
                <span style={{ color: '#a3e635', fontWeight: 700 }}>+</span> {item}
              </div>
            ))}
          </div>
          <div>
            <p style={{ color: '#ef4444', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: '0.5rem' }}>Who This Is NOT For</p>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>Not every company is a fit.</h2>
            <p style={{ color: '#6b7280', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              We&apos;re honest about scope. If you need a 500-user enterprise rollout, that&apos;s a custom engagement — not a sprint.
            </p>
            {['Enterprise companies with 500+ CRM users', 'Companies that want 6 months of discovery', 'Multi-department phased rollouts', 'Teams looking for the cheapest option, not the fastest'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
                <span style={{ color: '#ef4444' }}>-</span> {item}
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
            Consultants talk. We ship.
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 0.75rem' }}>Limited to 4 sprints per month.</p>
          <p style={{ color: '#71717a', fontSize: '0.9rem', maxWidth: 450, margin: '0 auto 2rem' }}>
            50+ implementations. HubSpot or Salesforce. $25K implementation. $35K migration. No hourly billing. No scope creep.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#packages" style={{
              display: 'inline-block', background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)', color: '#0a0118',
              padding: '0.9rem 2rem', borderRadius: '9999px', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem', boxShadow: '0 0 25px rgba(163,230,53,0.25)',
            }}>
              See What&apos;s Included
            </a>
            <Link href="/playbooks/hubspot-to-salesforce-crm-migration" style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: 'white', padding: '0.9rem 2rem', borderRadius: '9999px', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem',
            }}>
              View Migration Playbook
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
