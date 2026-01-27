import { useState } from 'react';
import Layout from '../../components/Layout';

const services = [
  { name: 'Executive Reporting Suite', category: 'Strategic Projects', function: 'Cross Functional' },
  { name: 'Growth Model', category: 'Strategic Projects', function: 'Cross Functional' },
  { name: 'ICP/TAM', category: 'Strategic Projects', function: 'Marketing' },
  { name: 'GTM Lifecycle', category: 'Strategic Projects', function: 'Cross Functional' },
  { name: 'Lead Lifecycle', category: 'Strategic Projects', function: 'Marketing' },
  { name: 'CRM Deduplication', category: 'Tool Implementation', function: 'Cross Functional' },
  { name: 'Clay CRM Enrichment', category: 'Tool Implementation', function: 'Sales' },
  { name: 'GTM Diagnostic', category: 'Strategic Projects', function: 'Cross Functional' },
  { name: 'Sales Lifecycle', category: 'Strategic Projects', function: 'Sales' },
  { name: 'Activity Capture', category: 'Tool Implementation', function: 'Sales' },
  { name: 'Forecasting Process', category: 'Strategic Projects', function: 'Sales' },
  { name: 'Market Map', category: 'Strategic Projects', function: 'Marketing' },
  { name: 'Lead Attribution', category: 'Strategic Projects', function: 'Marketing' },
  { name: 'Lead Routing', category: 'Strategic Projects', function: 'Sales' },
  { name: 'Customer Health Model', category: 'Strategic Projects', function: 'Customer Success' },
  { name: 'Renewal Management', category: 'Managed Services', function: 'Customer Success' },
  { name: 'Partner Success Platform', category: 'Tool Implementation', function: 'Partnerships' },
  { name: 'Automated Outbound', category: 'Strategic Projects', function: 'Sales' },
  { name: 'Marketing Automation', category: 'Tool Implementation', function: 'Marketing' },
  { name: 'Revenue Recognition', category: 'Strategic Projects', function: 'Cross Functional' },
  { name: 'Quote to Cash', category: 'Strategic Projects', function: 'Sales' },
  { name: 'Commission Tool', category: 'Tool Implementation', function: 'Sales' },
  { name: 'Conversation Intelligence', category: 'Tool Implementation', function: 'Sales' },
  { name: 'CLM Implementation', category: 'Tool Implementation', function: 'Cross Functional' },
];

const categories = ['All', 'Strategic Projects', 'Managed Services', 'Tool Implementation'];
const functions = ['All', 'Cross Functional', 'Marketing', 'Sales', 'Customer Success', 'Partnerships'];

export default function ServicesCatalog() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [functionFilter, setFunctionFilter] = useState('All');

  const filteredServices = services.filter((service) => {
    const matchesCategory = categoryFilter === 'All' || service.category === categoryFilter;
    const matchesFunction = functionFilter === 'All' || service.function === functionFilter;
    return matchesCategory && matchesFunction;
  });

  return (
    <Layout title="Services Catalog">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>🛠️</span> LeanScale Services Catalog
          </h1>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-input"
              style={{ width: 200 }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Function</label>
            <select
              value={functionFilter}
              onChange={(e) => setFunctionFilter(e.target.value)}
              className="form-input"
              style={{ width: 200 }}
            >
              {functions.map((fn) => (
                <option key={fn} value={fn}>{fn}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Services Grid */}
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
          {filteredServices.map((service, i) => (
            <div key={i} className="card">
              <h3 className="card-title">{service.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  background: '#dbeafe',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                }}>
                  {service.category}
                </span>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  background: '#fef3c7',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                }}>
                  {service.function}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '2rem', color: '#666', textAlign: 'center' }}>
          Showing {filteredServices.length} of {services.length} services
        </p>
      </div>
    </Layout>
  );
}
