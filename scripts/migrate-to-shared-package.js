#!/usr/bin/env node
/**
 * One-time migration script: Playbooks-Site reorganize branch → playbooks-content/
 *
 * Reads markdown from the Playbooks-Site repo's reorganize branch,
 * strips Docusaurus frontmatter and JSX Loom embeds, and writes
 * clean markdown + structured metadata to playbooks-content/.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ── Config ──
const PLAYBOOKS_SITE_PATH = path.join(__dirname, '..', '..', 'Playbooks-Site');
const OUTPUT_BASE = path.join(__dirname, '..', 'playbooks-content');
const PLAYBOOKS_DIR = path.join(OUTPUT_BASE, 'playbooks');
const BRANCH = 'origin/reorganize';

// ── Complete project registry (from Playbooks-Site src/data/projects.ts) ──
const PROJECTS = [
  { numericId: '01', slug: 'growth-model', title: 'Growth Model', description: 'Financial modeling integrating ARR targets with GTM efficiency metrics to create achievable quarterly revenue goals.', tags: { function: ['revops', 'finance'], team: ['leadership'], outcome: ['visibility'], metric: ['arr'], complexity: 'foundational' }, featured: true },
  { numericId: '02', slug: 'market-map', title: 'Market Map', description: 'Define ICP, target market segments, and account scoring methodology.', tags: { function: ['sales', 'marketing'], team: ['revops-team'], outcome: ['pipeline-generation'], metric: ['cac'], complexity: 'foundational' }, featured: true },
  { numericId: '03', slug: 'automated-inbound', title: 'Automated Inbound Data Enrichment', description: 'Automate lead enrichment with firmographic and technographic data.', tags: { function: ['marketing', 'revops'], team: ['revops-team'], outcome: ['efficiency', 'pipeline-generation'], metric: [], complexity: 'intermediate' } },
  { numericId: '04', slug: 'gtm-lifecycle', title: 'GTM Lifecycle', description: 'Define end-to-end GTM lifecycle stages from lead to customer.', tags: { function: ['revops'], team: ['leadership'], outcome: ['visibility'], metric: [], complexity: 'foundational' } },
  { numericId: '05', slug: 'lead-lifecycle', title: 'Lead Lifecycle', description: 'Define lead stages, qualification criteria, and handoff processes.', tags: { function: ['marketing', 'sales'], team: ['revops-team'], outcome: ['conversion-optimization'], metric: [], complexity: 'foundational' } },
  { numericId: '06', slug: 'sales-lifecycle', title: 'Sales Lifecycle', description: 'Define opportunity stages, exit criteria, and sales process.', tags: { function: ['sales'], team: ['sales-team'], outcome: [], metric: ['win-rate', 'cycle-time'], complexity: 'foundational' } },
  { numericId: '07', slug: 'customer-lifecycle', title: 'Customer Lifecycle', description: 'Define customer journey stages from onboarding to renewal.', tags: { function: ['cs'], team: ['cs-team'], outcome: ['retention'], metric: ['nrr'], complexity: 'foundational' } },
  { numericId: '08', slug: 'executive-reporting-suite', title: 'Executive Reporting Suite', description: 'Build comprehensive executive dashboards for GTM performance.', tags: { function: ['revops'], team: ['leadership'], outcome: ['visibility'], metric: ['arr'], complexity: 'intermediate' } },
  { numericId: '09', slug: 'quotas-and-target-setting', title: 'Quotas and Target Setting', description: 'Design quota methodology and set achievable targets by segment.', tags: { function: ['sales', 'revops'], team: ['leadership'], outcome: [], metric: ['quota-attainment', 'arr'], complexity: 'foundational' } },
  { numericId: '10', slug: 'crm-deduplication', title: 'CRM Deduplication', description: 'Clean CRM data by merging duplicate accounts and contacts.', tags: { function: ['revops'], team: ['revops-team'], outcome: ['efficiency'], metric: [], complexity: 'foundational' } },
  { numericId: '11', slug: 'crm-deduplication-ongoing-tool', title: 'CRM Deduplication Ongoing Tool', description: 'Implement automated duplicate detection and prevention.', tags: { function: ['revops'], team: ['revops-team'], outcome: ['efficiency'], metric: [], complexity: 'intermediate' } },
  { numericId: '12', slug: 'fed-pubsec-crm-partitioning', title: 'Fed/PubSec CRM Partitioning', description: 'Partition CRM for federal and public sector compliance.', tags: { function: ['revops', 'sales'], team: ['revops-team'], outcome: ['efficiency'], metric: [], complexity: 'advanced' } },
  { numericId: '13', slug: 'gtm-org-chart-roles-and-hiring-plan', title: 'GTM Org Chart, Roles & Hiring Plan', description: 'Design GTM org structure and hiring roadmap.', tags: { function: ['revops'], team: ['leadership'], outcome: ['efficiency'], metric: [], complexity: 'foundational' } },
  { numericId: '14', slug: 'lead-routing', title: 'Lead Routing', description: 'Design and implement lead routing rules and assignment logic.', tags: { function: ['marketing', 'sales'], team: ['revops-team'], outcome: ['conversion-optimization'], metric: ['cycle-time'], complexity: 'foundational' } },
  { numericId: '15', slug: 'marketing-automation-platform-implementation', title: 'Marketing Automation Platform Implementation', description: 'Implement and configure marketing automation platform.', tags: { function: ['marketing'], team: ['marketing-team'], outcome: ['pipeline-generation', 'efficiency'], metric: [], complexity: 'intermediate' } },
  { numericId: '16', slug: 'attribution', title: 'Lead and Opportunity Attribution', description: 'Implement multi-touch attribution for leads and opportunities.', tags: { function: ['marketing', 'revops'], team: ['revops-team'], outcome: ['visibility'], metric: ['cac'], complexity: 'intermediate' } },
  { numericId: '17', slug: 'inbound-lead-journey-mapping', title: 'Inbound Lead Journey Mapping', description: 'Map and optimize the inbound lead journey.', tags: { function: ['marketing'], team: ['marketing-team'], outcome: ['conversion-optimization', 'pipeline-generation'], metric: [], complexity: 'intermediate' } },
  { numericId: '18', slug: 'automated-outbound-process', title: 'Automated Outbound Process', description: 'Design and automate outbound sales development process.', tags: { function: ['sales'], team: ['sales-team'], outcome: ['pipeline-generation', 'efficiency'], metric: [], complexity: 'intermediate' } },
  { numericId: '19', slug: 'physical-event-process-and-roi-reporting', title: 'Physical Event Process and ROI Reporting', description: 'Standardize event operations and measure ROI.', tags: { function: ['marketing'], team: ['marketing-team'], outcome: ['pipeline-generation', 'visibility'], metric: ['cac'], complexity: 'intermediate' } },
  { numericId: '20', slug: 'sales-territory-design', title: 'Sales Territory Design', description: 'Design balanced territories for optimal coverage and quota attainment.', tags: { function: ['sales', 'revops'], team: ['revops-team'], outcome: ['efficiency'], metric: ['quota-attainment'], complexity: 'foundational' } },
  { numericId: '21', slug: 'rules-of-engagement-design', title: 'Rules of Engagement Design', description: 'Define account ownership rules and conflict resolution.', tags: { function: ['sales', 'revops'], team: ['sales-team'], outcome: ['efficiency'], metric: [], complexity: 'foundational' } },
  { numericId: '22', slug: 'forecasting-process-implementation', title: 'Forecasting Process Implementation', description: 'Implement structured forecasting methodology and cadence.', tags: { function: ['sales', 'revops'], team: ['leadership'], outcome: ['visibility'], metric: ['arr'], complexity: 'intermediate' } },
  { numericId: '23', slug: 'sales-qualification-methodology', title: 'Sales Qualification Methodology', description: 'Implement MEDDIC, BANT, or custom qualification framework.', tags: { function: ['sales'], team: ['sales-team'], outcome: ['conversion-optimization'], metric: ['win-rate'], complexity: 'foundational' } },
  { numericId: '24', slug: 'activity-capture', title: 'Activity Capture', description: 'Automate capture of sales activities and engagement data.', tags: { function: ['sales'], team: ['revops-team'], outcome: ['visibility', 'efficiency'], metric: [], complexity: 'intermediate' } },
  { numericId: '25', slug: 'renewal-churn-nrr-grr-reporting', title: 'Renewal/Churn/NRR/GRR Reporting', description: 'Build retention and revenue retention reporting.', tags: { function: ['cs', 'revops'], team: ['revops-team'], outcome: ['retention', 'visibility'], metric: ['nrr'], complexity: 'foundational' } },
  { numericId: '26', slug: 'onboarding-and-process-improvement', title: 'Onboarding and Process Improvement', description: 'Optimize customer onboarding process and time-to-value.', tags: { function: ['cs'], team: ['cs-team'], outcome: ['retention'], metric: ['ltv'], complexity: 'intermediate' } },
  { numericId: '27', slug: 'sales-to-cs-handoff-process-implementation', title: 'Sales to CS Handoff Process', description: 'Design seamless handoff from sales to customer success.', tags: { function: ['sales', 'cs'], team: ['cs-team'], outcome: ['retention', 'efficiency'], metric: [], complexity: 'foundational' } },
  { numericId: '28', slug: 'nps-and-voice-of-customer-launch', title: 'NPS and Voice of Customer Launch', description: 'Implement NPS program and customer feedback loops.', tags: { function: ['cs'], team: ['cs-team'], outcome: ['retention', 'visibility'], metric: [], complexity: 'intermediate' } },
  { numericId: '29', slug: 'cpq-implementation', title: 'CPQ Implementation', description: 'Implement Configure-Price-Quote solution.', tags: { function: ['sales', 'revops'], team: ['revops-team'], outcome: ['efficiency'], metric: ['cycle-time'], complexity: 'advanced' } },
  { numericId: '30', slug: 'sales-engagement-platform', title: 'Sales Engagement Platform', description: 'Implement sales engagement/sequencing platform.', tags: { function: ['sales'], team: ['sales-team'], outcome: ['pipeline-generation', 'efficiency'], metric: [], complexity: 'intermediate' } },
  { numericId: '31', slug: 'e-signature-implementation', title: 'E-Signature Implementation', description: 'Implement electronic signature solution.', tags: { function: ['sales'], team: ['revops-team'], outcome: ['efficiency'], metric: ['cycle-time'], complexity: 'foundational' } },
  { numericId: '32', slug: 'support-system-implementation', title: 'Support System Implementation', description: 'Implement customer support ticketing system.', tags: { function: ['cs'], team: ['cs-team'], outcome: ['retention', 'efficiency'], metric: [], complexity: 'foundational' } },
  { numericId: '33', slug: 'customer-success-platform-implementation', title: 'Customer Success Platform Implementation', description: 'Implement CS platform for health scoring and playbooks.', tags: { function: ['cs'], team: ['cs-team'], outcome: ['retention'], metric: ['nrr'], complexity: 'intermediate' } },
  { numericId: '34', slug: 'clm-implementation', title: 'CLM Implementation', description: 'Implement Contract Lifecycle Management solution.', tags: { function: ['sales', 'revops'], team: ['revops-team'], outcome: ['efficiency'], metric: ['cycle-time'], complexity: 'advanced' } },
  { numericId: '35', slug: 'website-lead-capture-and-form-compliance', title: 'Website Lead Capture and Form Configuration', description: 'Optimize website forms and lead capture.', tags: { function: ['marketing'], team: ['marketing-team'], outcome: ['pipeline-generation', 'conversion-optimization'], metric: [], complexity: 'foundational' } },
  { numericId: '36', slug: 'partnership-success-platform-implementation', title: 'Partnership Success Platform Implementation', description: 'Implement partner relationship management platform.', tags: { function: ['partnerships'], team: ['revops-team'], outcome: ['pipeline-generation'], metric: ['arr'], complexity: 'intermediate' } },
  { numericId: '37', slug: 'lead-scoring-model-sales-led', title: 'Lead Scoring Model (Sales-Led)', description: 'Build lead scoring model for sales-led motion.', tags: { function: ['marketing', 'sales'], team: ['revops-team'], outcome: ['conversion-optimization', 'efficiency'], metric: [], complexity: 'intermediate' } },
  { numericId: '38', slug: 'lead-scoring-model-product-led', title: 'Lead Scoring Model (Product-Led)', description: 'Build lead scoring model for product-led motion.', tags: { function: ['marketing', 'revops'], team: ['revops-team'], outcome: ['conversion-optimization', 'efficiency'], metric: [], complexity: 'intermediate' } },
  { numericId: '39', slug: 'plg-gtm-design', title: 'PLG GTM Design', description: 'Design product-led growth go-to-market motion.', tags: { function: ['marketing', 'sales'], team: ['leadership'], outcome: ['pipeline-generation', 'conversion-optimization'], metric: [], complexity: 'advanced' } },
  { numericId: '40', slug: 'foundational-automations-and-reporting', title: 'Foundational Automations and Reporting Logic', description: 'Build core CRM automations and reporting foundation.', tags: { function: ['revops'], team: ['revops-team'], outcome: ['efficiency', 'visibility'], metric: [], complexity: 'foundational' } },
  { numericId: '41', slug: 'revenue-recognition', title: 'Revenue Recognition', description: 'Implement revenue recognition processes and reporting.', tags: { function: ['finance', 'revops'], team: ['revops-team'], outcome: ['visibility'], metric: ['arr'], complexity: 'advanced' } },
  { numericId: '42', slug: 'arr-reporting', title: 'ARR Reporting', description: 'Build comprehensive ARR reporting and dashboards.', tags: { function: ['revops', 'finance'], team: ['revops-team'], outcome: ['visibility'], metric: ['arr'], complexity: 'foundational' } },
  { numericId: '43', slug: 'hubspot-sfdc-migration', title: 'HubSpot to Salesforce CRM Migration', description: 'Migrate from HubSpot to Salesforce CRM.', tags: { function: ['revops'], team: ['revops-team'], outcome: ['efficiency'], metric: [], complexity: 'advanced' } },
  { numericId: '44', slug: 'salesforce-to-hubspot-crm-migration', title: 'Salesforce to HubSpot CRM Migration', description: 'Migrate from Salesforce to HubSpot CRM.', tags: { function: ['revops'], team: ['revops-team'], outcome: ['efficiency'], metric: [], complexity: 'advanced' } },
  { numericId: '45', slug: 'event-operations-platform-implementation', title: 'Event Operations Platform Implementation', description: 'Implement event management platform.', tags: { function: ['marketing'], team: ['marketing-team'], outcome: ['pipeline-generation', 'efficiency'], metric: [], complexity: 'intermediate' } },
  { numericId: '46', slug: 'monthly-quarterly-gtm-reporting-pack', title: 'Monthly/Quarterly GTM Reporting Pack', description: 'Build recurring GTM performance reporting package.', tags: { function: ['revops'], team: ['leadership'], outcome: ['visibility'], metric: ['arr'], complexity: 'intermediate' } },
  { numericId: '47', slug: 'abm-abs-process-and-system', title: 'ABM/ABS Process and System', description: 'Implement account-based marketing/selling program.', tags: { function: ['marketing', 'sales'], team: ['marketing-team'], outcome: ['pipeline-generation'], metric: ['win-rate'], complexity: 'advanced' } },
  { numericId: '48', slug: 'conversation-intelligence-platform-implementation', title: 'Conversation Intelligence Platform', description: 'Implement call recording and conversation intelligence.', tags: { function: ['sales'], team: ['sales-team'], outcome: ['visibility'], metric: ['win-rate'], complexity: 'intermediate' } },
  { numericId: '49', slug: 'sales-enablement-platform-implementation', title: 'Sales Enablement Platform Implementation', description: 'Implement sales content and enablement platform.', tags: { function: ['sales', 'marketing'], team: ['sales-team'], outcome: ['efficiency'], metric: ['win-rate'], complexity: 'intermediate' } },
  { numericId: '50', slug: 'customer-segmentation', title: 'Customer Segmentation', description: 'Build customer segmentation for CS prioritization.', tags: { function: ['cs', 'revops'], team: ['cs-team'], outcome: ['retention', 'efficiency'], metric: [], complexity: 'foundational' } },
  { numericId: '51', slug: 'customer-health-model', title: 'Customer Health Model', description: 'Build customer health scoring model.', tags: { function: ['cs'], team: ['cs-team'], outcome: ['retention'], metric: ['nrr'], complexity: 'intermediate' } },
  { numericId: '52', slug: 'renewal-management', title: 'Renewal Management', description: 'Implement structured renewal process and playbooks.', tags: { function: ['cs', 'sales'], team: ['cs-team'], outcome: ['retention'], metric: ['nrr'], complexity: 'foundational' } },
  { numericId: '53', slug: 'email-operations-nurture-program', title: 'Email Operations: Nurture Program', description: 'Build automated email nurture programs.', tags: { function: ['marketing'], team: ['marketing-team'], outcome: ['pipeline-generation', 'conversion-optimization'], metric: [], complexity: 'intermediate' } },
  { numericId: '54', slug: 'marketing-database-segmentation', title: 'Marketing Database Segmentation', description: 'Build marketing database segmentation strategy.', tags: { function: ['marketing'], team: ['marketing-team'], outcome: ['pipeline-generation', 'efficiency'], metric: [], complexity: 'foundational' } },
  { numericId: '55', slug: 'marketing-reporting-pack', title: 'Marketing Reporting Pack', description: 'Build marketing performance reporting package.', tags: { function: ['marketing'], team: ['marketing-team'], outcome: ['visibility'], metric: ['cac'], complexity: 'intermediate' } },
  { numericId: '56', slug: 'email-operations-subscription-and-compliance', title: 'Email Operations: Subscription and Compliance', description: 'Implement email preference center and compliance.', tags: { function: ['marketing'], team: ['marketing-team'], outcome: ['efficiency'], metric: [], complexity: 'foundational' } },
  { numericId: '57', slug: 'email-operations-templates-and-build-process', title: 'Email Operations: Templates and Build Process', description: 'Standardize email templates and build process.', tags: { function: ['marketing'], team: ['marketing-team'], outcome: ['efficiency'], metric: [], complexity: 'foundational' } },
  { numericId: '58', slug: 'event-operations-lead-list-intake-process', title: 'Event Operations: Lead List Intake Process', description: 'Standardize event lead list processing.', tags: { function: ['marketing'], team: ['marketing-team'], outcome: ['pipeline-generation', 'efficiency'], metric: [], complexity: 'foundational' } },
  { numericId: '59', slug: 'commission-plan-design-and-implementation', title: 'Commission Plan Design and Implementation', description: 'Design sales compensation and commission plans.', tags: { function: ['sales', 'revops'], team: ['leadership'], outcome: ['efficiency'], metric: ['quota-attainment'], complexity: 'advanced' } },
  { numericId: '60', slug: 'commission-tool-implementation', title: 'Commission Tool Implementation', description: 'Implement commission calculation and tracking tool.', tags: { function: ['sales', 'revops'], team: ['revops-team'], outcome: ['efficiency', 'visibility'], metric: [], complexity: 'intermediate' } },
  { numericId: '61', slug: 'quote-to-cash', title: 'Quote to Cash', description: 'Optimize quote-to-cash process end-to-end.', tags: { function: ['sales', 'revops', 'finance'], team: ['revops-team'], outcome: ['efficiency'], metric: ['cycle-time'], complexity: 'advanced' } },
  { numericId: '62', slug: 'marketing-to-sales-handoff-and-sla-tracking', title: 'Marketing to Sales Handoff and SLA Tracking', description: 'Define MQL handoff process and track SLA compliance.', tags: { function: ['marketing', 'sales'], team: ['revops-team'], outcome: ['conversion-optimization'], metric: ['cycle-time'], complexity: 'foundational' } },
  { numericId: '63', slug: 'ai-automated-inbound', title: 'AI Automated Inbound', description: 'Implement AI-powered inbound lead processing.', tags: { function: ['marketing', 'sales'], team: ['revops-team'], outcome: ['efficiency', 'pipeline-generation'], metric: [], complexity: 'advanced' } },
  { numericId: '64', slug: 'speed-to-lead-sla-tracking', title: 'Speed to Lead', description: 'Optimize lead response time and first contact.', tags: { function: ['sales', 'marketing'], team: ['revops-team'], outcome: ['conversion-optimization'], metric: ['cycle-time'], complexity: 'intermediate' } },
  { numericId: '65', slug: 'crm-erp-integration', title: 'CRM-ERP Integration', description: 'Integrate CRM with ERP for revenue operations.', tags: { function: ['revops', 'finance'], team: ['revops-team'], outcome: ['efficiency', 'visibility'], metric: [], complexity: 'advanced' } },
  { numericId: '66', slug: 'gtm-diagnostic', title: 'GTM Diagnostic', description: 'Comprehensive GTM health assessment and roadmap.', tags: { function: ['revops'], team: ['leadership'], outcome: ['visibility'], metric: [], complexity: 'foundational' }, featured: true },
  { numericId: '67', slug: 'revenue-intelligence-process', title: 'Revenue Intelligence Process', description: 'Implement revenue intelligence and deal insights.', tags: { function: ['sales', 'revops'], team: ['sales-team'], outcome: ['visibility'], metric: ['win-rate'], complexity: 'advanced' } },
  { numericId: '68', slug: 'opportunity-management-ux-improvements', title: 'Opportunity Management UX Improvements', description: 'Optimize CRM opportunity management experience.', tags: { function: ['sales', 'revops'], team: ['revops-team'], outcome: ['efficiency'], metric: ['win-rate'], complexity: 'intermediate' } },
];

// Map from slug → tier (core or extended) based on reorganize branch folders
const CORE_SLUGS = new Set([
  'attribution', 'automated-inbound', 'growth-model', 'gtm-lifecycle',
  'hubspot-sfdc-migration', 'lead-routing', 'market-map', 'quote-to-cash',
  'sales-territory-design', 'speed-to-lead-sla-tracking',
]);

// Slugs that exist on the reorganize branch (have actual content)
const REORGANIZE_FOLDERS = new Set([
  // core
  'attribution', 'automated-inbound', 'growth-model', 'gtm-lifecycle',
  'hubspot-sfdc-migration', 'lead-routing', 'market-map', 'quote-to-cash',
  'sales-territory-design', 'speed-to-lead-sla-tracking',
  // extended
  'abm-abs-process-and-system', 'activity-capture', 'arr-reporting',
  'automated-outbound-process', 'clm-implementation',
  'conversation-intelligence-platform-implementation',
  'crm-deduplication-ongoing-tool', 'crm-deduplication',
  'customer-health-model', 'customer-lifecycle', 'customer-segmentation',
  'customer-success-platform-implementation', 'e-signature-implementation',
  'event-operations-platform-implementation', 'executive-reporting-suite',
  'fed-pubsec-crm-partitioning', 'forecasting-process-implementation',
  'foundational-automations-and-reporting',
  'gtm-org-chart-roles-and-hiring-plan', 'inbound-lead-journey-mapping',
  'lead-lifecycle', 'lead-scoring-model-product-led',
  'lead-scoring-model-sales-led',
  'marketing-automation-platform-implementation',
  'monthly-quarterly-gtm-reporting-pack',
  'nps-and-voice-of-customer-launch', 'onboarding-and-process-improvement',
  'partnership-success-platform-implementation',
  'physical-event-process-and-roi-reporting', 'plg-gtm-design',
  'quotas-and-target-setting', 'renewal-churn-nrr-grr-reporting',
  'rules-of-engagement-design', 'sales-enablement-platform-implementation',
  'sales-engagement-platform', 'sales-lifecycle',
  'sales-qualification-methodology',
  'sales-to-cs-handoff-process-implementation',
  'salesforce-to-hubspot-crm-migration', 'support-system-implementation',
  'website-lead-capture-and-form-compliance',
]);

// v3 diagnostic competency → serviceIds mapping (for meta.json competencyIds)
const SERVICE_TO_COMPETENCIES = {
  'growth-model': ['PL-1', 'PL-3'],
  'monthly-quarterly-gtm-reporting-pack': ['PL-1', 'PL-5', 'RP-2', 'RP-3', 'RP-4'],
  'quotas-and-target-setting': ['PL-2'],
  'gtm-org-chart-roles-and-hiring-plan': ['PL-2', 'PE-1', 'PE-2', 'PE-3', 'PE-5', 'PE-6'],
  'executive-reporting-suite': ['PL-4', 'RP-1', 'RP-5'],
  'commission-plan-design-and-implementation': ['PE-4'],
  'lead-lifecycle': ['PR-1'],
  'gtm-lifecycle': ['PR-1'],
  'sales-lifecycle': ['PR-2'],
  'customer-lifecycle': ['PR-3'],
  'onboarding-and-process-improvement': ['PR-3'],
  'partnership-success-platform-implementation': ['PR-4'],
  'marketing-to-sales-handoff-and-sla-tracking': ['PR-5'],
  'sales-to-cs-handoff-process-implementation': ['PR-5'],
  'sales-qualification-methodology': ['PR-6'],
  'sales-territory-design': ['PR-7'],
  'lead-routing': ['PR-7'],
  'rules-of-engagement-design': ['PR-7'],
  'abm-abs-process-and-system': ['PR-8'],
  'market-map': ['PR-8'],
  'attribution': ['PR-9'],
  'lead-and-opportunity-attribution': ['PR-9'],
  'forecasting-process-implementation': ['PR-10', 'RP-6'],
  'revenue-intelligence-process': ['PR-10'],
  'hubspot-impl': ['SY-1'],
  'salesforce-impl': ['SY-1'],
  'foundational-automations-and-reporting': ['SY-1'],
  'marketing-automation-platform-implementation': ['SY-2'],
  'sales-engagement-platform': ['SY-3'],
  'automated-outbound-process': ['SY-3'],
  'customer-success-platform-implementation': ['SY-4'],
  'support-system-implementation': ['SY-4'],
  'automated-inbound': ['SY-6'],
  'crm-erp-integration': ['SY-7'],
  'arr-reporting': ['RP-5'],
  'sales-enablement-platform-implementation': ['EN-1', 'EN-2', 'EN-4', 'EN-5'],
  'conversation-intelligence-platform-implementation': ['EN-3'],
};

// ── Helpers ──

function gitShow(filePath) {
  try {
    return execSync(`git show "${BRANCH}:${filePath}"`, {
      cwd: PLAYBOOKS_SITE_PATH,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024,
    });
  } catch {
    return null;
  }
}

function stripFrontmatter(markdown) {
  if (!markdown) return '';
  return markdown.replace(/^---\n[\s\S]*?\n---\n*/, '');
}

function extractLoomId(markdown) {
  if (!markdown) return null;
  const match = markdown.match(/loom\.com\/embed\/([a-f0-9]+)/);
  return match ? match[1] : null;
}

function stripLoomEmbed(markdown) {
  if (!markdown) return '';
  // Remove JSX-style loom embed blocks
  return markdown.replace(/<div style=\{\{[^}]*\}\}><iframe src="https:\/\/www\.loom\.com\/embed\/[^"]*"[^>]*><\/iframe><\/div>\n*/g, '');
}

function cleanMarkdown(markdown) {
  if (!markdown) return '';
  let clean = stripFrontmatter(markdown);
  clean = stripLoomEmbed(clean);
  // Trim leading/trailing whitespace
  return clean.trim() + '\n';
}

// ── Main ──

function migrate() {
  console.log('Starting migration from Playbooks-Site reorganize branch...\n');

  // Verify Playbooks-Site exists
  if (!fs.existsSync(PLAYBOOKS_SITE_PATH)) {
    console.error(`Playbooks-Site not found at ${PLAYBOOKS_SITE_PATH}`);
    process.exit(1);
  }

  // Ensure output dirs exist
  fs.mkdirSync(PLAYBOOKS_DIR, { recursive: true });

  const registryEntries = [];
  let publishedCount = 0;
  let stubCount = 0;
  const pages = ['advisory', 'methodology', 'implementation'];

  for (const project of PROJECTS) {
    const slug = project.slug;
    const hasContent = REORGANIZE_FOLDERS.has(slug);
    const tier = CORE_SLUGS.has(slug) ? 'core' : 'extended';
    const outDir = path.join(PLAYBOOKS_DIR, slug);
    fs.mkdirSync(outDir, { recursive: true });

    let loomEmbedId = null;

    if (hasContent) {
      // Determine which folder on the reorganize branch (core/ or extended/)
      const branchTier = CORE_SLUGS.has(slug) ? 'core' : 'extended';

      for (const page of pages) {
        const rawMd = gitShow(`docs/${branchTier}/${slug}/${page}.md`);
        if (rawMd) {
          // Extract Loom ID from advisory page
          if (page === 'advisory' && !loomEmbedId) {
            loomEmbedId = extractLoomId(rawMd);
          }
          const cleanedMd = cleanMarkdown(rawMd);
          fs.writeFileSync(path.join(outDir, `${page}.md`), cleanedMd);
        }
      }
      publishedCount++;
      console.log(`  [published] ${slug} (${tier})`);
    } else {
      // Create stub entry with empty markdown files
      for (const page of pages) {
        fs.writeFileSync(path.join(outDir, `${page}.md`), `# ${project.title} — ${page.charAt(0).toUpperCase() + page.slice(1)}\n\n> Content coming soon.\n`);
      }
      stubCount++;
      console.log(`  [stub]      ${slug}`);
    }

    // Write meta.json
    const competencyIds = SERVICE_TO_COMPETENCIES[slug] || [];
    const meta = {
      slug,
      title: project.title,
      tier,
      description: project.description,
      status: hasContent ? 'published' : 'stub',
      competencyIds,
      loomEmbedId,
    };
    fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');

    // Registry entry
    registryEntries.push({
      slug,
      numericId: project.numericId,
      title: project.title,
      description: project.description,
      tier,
      status: hasContent ? 'published' : 'stub',
      tags: project.tags,
      featured: project.featured || false,
      loomEmbedId,
      pages: hasContent ? pages : [],
    });
  }

  // Write registry.json
  const registry = {
    version: '2.0',
    generated: new Date().toISOString(),
    playbooks: registryEntries,
  };
  fs.writeFileSync(
    path.join(OUTPUT_BASE, 'registry.json'),
    JSON.stringify(registry, null, 2) + '\n'
  );

  console.log(`\nMigration complete!`);
  console.log(`  Published: ${publishedCount}`);
  console.log(`  Stubs: ${stubCount}`);
  console.log(`  Total: ${registryEntries.length}`);
  console.log(`\nOutput: ${OUTPUT_BASE}/`);
}

migrate();
