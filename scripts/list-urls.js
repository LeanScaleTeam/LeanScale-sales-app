const fs = require('fs');
const ID_OVERRIDES = {
  'automated-inbound-data-enrichment': 'automated-inbound',
  'lead-and-opportunity-attribution': 'attribution',
  'revenue-recognition': 'revrec',
  'hubspot-to-salesforce-crm-migration': 'hubspot-sfdc-migration',
  'speed-to-lead': 'speed-to-lead-sla-tracking',
};
const CORE_IDS = [
  'growth-model', 'gtm-lifecycle', 'market-map', 'automated-inbound',
  'attribution', 'sales-territory-design', 'lead-routing',
  'speed-to-lead-sla-tracking', 'hubspot-sfdc-migration',
  'cpq-implementation', 'revrec', 'billing', 'metering',
  'pricing-and-packaging',
];
const ids = fs.readdirSync('data/advisory').map(f => f.replace('.md','')).filter(id => id !== 'gtm-lifecycle');
const type = process.argv[2] || 'methodology';
ids.forEach(id => {
  const slug = ID_OVERRIDES[id] || id;
  const tier = CORE_IDS.includes(slug) ? 'core' : 'extended';
  const url = `https://playbooks.leanscale.team/docs/${tier}/${slug}/${type}`;
  console.log(`${id}|${url}`);
});
