import Layout from '../../components/Layout';

const glossaryTerms = [
  { term: 'ICP (Ideal Customer Profile)', definition: 'The type of company you want more of — your best-fit customers.' },
  { term: 'Persona', definition: 'The type of person you sell to inside those companies (ex: Head of Ops, CFO).' },
  { term: 'TAM / SAM / SOM', definition: 'How big your market is: TAM = everyone, SAM = realistic target slice, SOM = who you can win now.' },
  { term: 'Lead', definition: 'Anyone who shows interest or comes into your system. Not qualified yet.' },
  { term: 'MQL (Marketing Qualified Lead)', definition: 'A lead that looks promising based on fit or engagement.' },
  { term: 'SQL (Sales Qualified Lead)', definition: 'A lead that sales agrees is worth talking to — ready for a real conversation.' },
  { term: 'SAL (Sales Accepted Lead)', definition: 'Sales has accepted the lead and agrees to work it.' },
  { term: 'Pipeline', definition: 'All active deals your sales team is working on.' },
  { term: 'Inbound', definition: 'Leads that come to you (form fills, chat, trial signup, demo request).' },
  { term: 'Outbound', definition: 'Leads your team goes after (emails, calls, sequences, outbound SDR motion).' },
  { term: 'Intent Data', definition: 'Signals that a company is researching something you sell (G2, website visits, etc.).' },
  { term: 'Lifecycle Stages', definition: 'Labels that show where someone is in your funnel (Lead → MQL → SQL → Opp → Customer).' },
  { term: 'Opportunity', definition: 'A potential deal that sales is actively working on with a real chance to close.' },
  { term: 'Stage', definition: 'The step in your sales process (ex: Discovery, Demo, Eval, Contract Sent).' },
  { term: 'Conversion Rate', definition: 'Percentage of leads that move from one stage to the next.' },
  { term: 'Win Rate', definition: 'Percentage of opportunities that become customers.' },
  { term: 'Close Rate', definition: 'Same as win rate, but usually measured for a specific stage or time period.' },
  { term: 'Deal Velocity / Sales Cycle', definition: 'How long it takes to move from first touch → closed deal.' },
  { term: 'TCV (Total Contract Value)', definition: 'Total revenue from the entire contract.' },
  { term: 'ACV (Annual Contract Value)', definition: 'Revenue generated per year of the contract.' },
  { term: 'ARR (Annual Recurring Revenue)', definition: 'Subscription revenue that repeats every year.' },
  { term: 'Renewal', definition: 'When a customer signs on for another contract period.' },
  { term: 'Churn', definition: 'When a customer leaves or stops paying.' },
  { term: 'Expansion / Upsell', definition: 'Customer pays you more than before (more seats, products, usage, etc.).' },
  { term: 'Attribution', definition: 'Figuring out which marketing or sales touchpoints helped create a lead.' },
  { term: 'UTM Parameters', definition: 'Tags added to URLs so you know where traffic came from (ad, email, social, etc.).' },
  { term: 'Nurture', definition: 'Automated emails/messages to keep leads warm until ready to buy.' },
  { term: 'Lead Score', definition: 'Point system to rank which leads are most likely to buy.' },
  { term: 'Territory', definition: 'The grouping of accounts reps are responsible for (by region, industry, size, etc).' },
  { term: 'Routing', definition: 'Automation that decides where a lead goes (to which rep or team).' },
  { term: 'SLAs (Service-Level Agreements)', definition: 'Rules for how fast sales or success must respond.' },
  { term: 'Enrichment', definition: 'Filling in missing info on leads/accounts using tools like Clay, Clearbit, Apollo.' },
  { term: 'Data Hygiene', definition: 'Keeping CRM data clean, accurate, and deduped.' },
  { term: 'RevOps', definition: 'The team that owns the systems, data, processes, automation, and reporting across marketing, sales, and CS.' },
  { term: 'GTM Ops', definition: 'Same as RevOps, but typically broader — includes strategy + execution for the entire go-to-market.' },
  { term: 'Playbook', definition: 'A step-by-step guide for how a team should run a specific process (ex: Lead Handoff, Qualification, Onboarding).' },
  { term: 'Enablement', definition: 'Training, tools, and content that help sales or CS do their jobs better.' },
  { term: 'Forecast', definition: "A prediction of how much revenue you'll close this month/quarter." },
  { term: 'MRR / ARR Movement', definition: 'Changes in recurring revenue (new, expansion, contraction, churn).' },
  { term: 'Usage Data', definition: 'How customers are actually using your product — often tied to renewals or upsell.' },
];

export default function Glossary() {
  return (
    <Layout title="GTM Ops Glossary">
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
              Quick Reference Guide
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
            GTM Ops{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #65a30d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Glossary
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Plain English definitions for common GTM and RevOps terms.
          </p>
        </div>
      </section>

      {/* Glossary terms section */}
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
              {glossaryTerms.length} Terms
            </p>
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 700,
              color: '#111827',
              margin: 0,
            }}>
              All Terms A&ndash;Z
            </h2>
          </div>

          {/* Card grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}>
            {glossaryTerms.map((item) => (
              <div
                key={item.term}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#c4b5fd';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#7c3aed',
                  lineHeight: 1.3,
                }}>
                  {item.term}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: '#4b5563',
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
