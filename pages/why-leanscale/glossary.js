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
      <div className="container">
        <div className="page-header" style={{ textAlign: 'center' }}>
          <h1 className="page-title" style={{ justifyContent: 'center' }}>
            <span>📖</span> GTM Ops Glossary
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Plain English definitions for common GTM and RevOps terms
          </p>
        </div>

        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {glossaryTerms.map((item) => (
            <div key={item.term} className="card">
              <h3 className="card-title" style={{ color: 'var(--ls-purple)' }}>{item.term}</h3>
              <p className="card-subtitle">{item.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
