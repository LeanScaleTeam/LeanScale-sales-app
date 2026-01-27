import Layout from '../../components/Layout';

const glossaryTerms = [
  { term: 'ICP', definition: 'Ideal Customer Profile - A detailed description of the type of company that would benefit most from your product or service.' },
  { term: 'Persona', definition: 'A fictional representation of your ideal buyer based on market research and real data about your existing customers.' },
  { term: 'TAM/SAM/SOM', definition: 'Total Addressable Market, Serviceable Addressable Market, Serviceable Obtainable Market - market sizing framework.' },
  { term: 'Lead', definition: 'A person or company that has shown interest in your product or service.' },
  { term: 'MQL', definition: 'Marketing Qualified Lead - A lead that has been deemed more likely to become a customer based on marketing engagement.' },
  { term: 'SQL', definition: 'Sales Qualified Lead - A lead that sales has accepted and is actively working.' },
  { term: 'SAL', definition: 'Sales Accepted Lead - A lead that has been accepted by sales from marketing.' },
  { term: 'Pipeline', definition: 'The total value of all active sales opportunities at any given time.' },
  { term: 'Inbound', definition: 'Marketing strategy focused on attracting customers through content and experiences.' },
  { term: 'Outbound', definition: 'Sales strategy focused on proactively reaching out to potential customers.' },
  { term: 'Intent Data', definition: 'Behavioral data that indicates a prospect\'s likelihood to purchase.' },
  { term: 'Lifecycle Stages', definition: 'The stages a contact goes through from first touch to customer.' },
  { term: 'Opportunity', definition: 'A qualified sales deal with a specific value and expected close date.' },
  { term: 'Stage', definition: 'A step in the sales process that an opportunity moves through.' },
  { term: 'Conversion Rate', definition: 'The percentage of leads or opportunities that convert to the next stage.' },
  { term: 'Win Rate', definition: 'The percentage of opportunities that result in closed-won deals.' },
  { term: 'Close Rate', definition: 'The percentage of deals that close within a given time period.' },
  { term: 'Deal Velocity', definition: 'The speed at which deals move through your sales pipeline.' },
  { term: 'TCV', definition: 'Total Contract Value - The total value of a contract over its entire duration.' },
  { term: 'ACV', definition: 'Annual Contract Value - The average annualized revenue per customer contract.' },
  { term: 'ARR', definition: 'Annual Recurring Revenue - The predictable revenue expected annually from subscriptions.' },
];

export default function Glossary() {
  return (
    <Layout title="GTM Ops Glossary">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>📖</span> GTM Ops Glossary
          </h1>
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
