// Tag category definitions
export type TagCategory =
  | 'function'
  | 'team'
  | 'outcome'
  | 'metric'
  | 'complexity';

export type TagType =
  // Functions
  | 'sales'
  | 'marketing'
  | 'cs'
  | 'partnerships'
  | 'revops'
  | 'finance'
  // Teams
  | 'sales-team'
  | 'marketing-team'
  | 'cs-team'
  | 'revops-team'
  | 'leadership'
  // GTM Outcomes
  | 'pipeline-generation'
  | 'conversion-optimization'
  | 'retention'
  | 'expansion'
  | 'efficiency'
  | 'visibility'
  // B2B Metrics
  | 'arr'
  | 'nrr'
  | 'cac'
  | 'ltv'
  | 'win-rate'
  | 'cycle-time'
  | 'quota-attainment'
  // Complexity
  | 'foundational'
  | 'intermediate'
  | 'advanced';

export type Tag = {
  label: string;
  description: string;
  color: string;
  category: TagCategory;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  docPath: string;
  tags: TagType[];
  featured?: boolean;
};

// Tag metadata registry
export const Tags: Record<TagType, Tag> = {
  // Functions
  sales: {
    label: 'Sales',
    description: 'Projects primarily for sales teams',
    color: '#4A90D9',
    category: 'function',
  },
  marketing: {
    label: 'Marketing',
    description: 'Projects primarily for marketing teams',
    color: '#7B68EE',
    category: 'function',
  },
  cs: {
    label: 'Customer Success',
    description: 'Projects for CS and support teams',
    color: '#50C878',
    category: 'function',
  },
  partnerships: {
    label: 'Partnerships',
    description: 'Partner program and channel projects',
    color: '#FF8C00',
    category: 'function',
  },
  revops: {
    label: 'RevOps',
    description: 'Revenue operations projects',
    color: '#DC143C',
    category: 'function',
  },
  finance: {
    label: 'Finance',
    description: 'Finance and FP&A related projects',
    color: '#708090',
    category: 'function',
  },
  // Teams
  'sales-team': {
    label: 'Sales Team',
    description: 'Executed by sales team',
    color: '#4A90D9',
    category: 'team',
  },
  'marketing-team': {
    label: 'Marketing Team',
    description: 'Executed by marketing team',
    color: '#7B68EE',
    category: 'team',
  },
  'cs-team': {
    label: 'CS Team',
    description: 'Executed by CS team',
    color: '#50C878',
    category: 'team',
  },
  'revops-team': {
    label: 'RevOps Team',
    description: 'Executed by RevOps',
    color: '#DC143C',
    category: 'team',
  },
  leadership: {
    label: 'Leadership',
    description: 'Requires executive sponsorship',
    color: '#FFD700',
    category: 'team',
  },
  // GTM Outcomes
  'pipeline-generation': {
    label: 'Pipeline Generation',
    description: 'Increases pipeline volume',
    color: '#32CD32',
    category: 'outcome',
  },
  'conversion-optimization': {
    label: 'Conversion',
    description: 'Improves conversion rates',
    color: '#20B2AA',
    category: 'outcome',
  },
  retention: {
    label: 'Retention',
    description: 'Improves customer retention',
    color: '#9370DB',
    category: 'outcome',
  },
  expansion: {
    label: 'Expansion',
    description: 'Drives upsell/cross-sell',
    color: '#FF69B4',
    category: 'outcome',
  },
  efficiency: {
    label: 'Efficiency',
    description: 'Improves operational efficiency',
    color: '#87CEEB',
    category: 'outcome',
  },
  visibility: {
    label: 'Visibility',
    description: 'Improves reporting and insights',
    color: '#DDA0DD',
    category: 'outcome',
  },
  // B2B Metrics
  arr: {
    label: 'ARR',
    description: 'Impacts Annual Recurring Revenue',
    color: '#228B22',
    category: 'metric',
  },
  nrr: {
    label: 'NRR',
    description: 'Impacts Net Revenue Retention',
    color: '#2E8B57',
    category: 'metric',
  },
  cac: {
    label: 'CAC',
    description: 'Impacts Customer Acquisition Cost',
    color: '#CD5C5C',
    category: 'metric',
  },
  ltv: {
    label: 'LTV',
    description: 'Impacts Lifetime Value',
    color: '#6B8E23',
    category: 'metric',
  },
  'win-rate': {
    label: 'Win Rate',
    description: 'Impacts opportunity win rate',
    color: '#4682B4',
    category: 'metric',
  },
  'cycle-time': {
    label: 'Cycle Time',
    description: 'Impacts sales cycle length',
    color: '#5F9EA0',
    category: 'metric',
  },
  'quota-attainment': {
    label: 'Quota Attainment',
    description: 'Impacts rep quota attainment',
    color: '#B8860B',
    category: 'metric',
  },
  // Complexity
  foundational: {
    label: 'Foundational',
    description: 'Core project, do first',
    color: '#90EE90',
    category: 'complexity',
  },
  intermediate: {
    label: 'Intermediate',
    description: 'Builds on foundational',
    color: '#FFD700',
    category: 'complexity',
  },
  advanced: {
    label: 'Advanced',
    description: 'Complex implementation',
    color: '#FF6347',
    category: 'complexity',
  },
};

// All 68 projects
export const Projects: Project[] = [
  {
    id: '01',
    title: 'Growth Model',
    description: 'Financial modeling integrating ARR targets with GTM efficiency metrics to create achievable quarterly revenue goals.',
    docPath: '/docs/projects/growth-model/playbook_growth-model',
    tags: ['revops', 'finance', 'leadership', 'arr', 'visibility', 'foundational'],
    featured: true,
  },
  {
    id: '02',
    title: 'Market Map',
    description: 'Define ICP, target market segments, and account scoring methodology.',
    docPath: '/docs/projects/market-map/playbook_market-map',
    tags: ['sales', 'marketing', 'revops-team', 'pipeline-generation', 'cac', 'foundational'],
    featured: true,
  },
  {
    id: '03',
    title: 'Automated Inbound Data Enrichment',
    description: 'Automate lead enrichment with firmographic and technographic data.',
    docPath: '/docs/projects/automated-inbound-data-enrichment/playbook_automated-inbound-data-enrichment',
    tags: ['marketing', 'revops', 'revops-team', 'efficiency', 'pipeline-generation', 'intermediate'],
  },
  {
    id: '04',
    title: 'GTM Lifecycle',
    description: 'Define end-to-end GTM lifecycle stages from lead to customer.',
    docPath: '/docs/projects/gtm-lifecycle/playbook_gtm-lifecycle',
    tags: ['revops', 'leadership', 'visibility', 'foundational'],
  },
  {
    id: '05',
    title: 'Lead Lifecycle',
    description: 'Define lead stages, qualification criteria, and handoff processes.',
    docPath: '/docs/projects/lead-lifecycle/playbook_lead-lifecycle',
    tags: ['marketing', 'sales', 'revops-team', 'conversion-optimization', 'foundational'],
  },
  {
    id: '06',
    title: 'Sales Lifecycle',
    description: 'Define opportunity stages, exit criteria, and sales process.',
    docPath: '/docs/projects/sales-lifecycle/playbook_sales-lifecycle',
    tags: ['sales', 'sales-team', 'win-rate', 'cycle-time', 'foundational'],
  },
  {
    id: '07',
    title: 'Customer Lifecycle',
    description: 'Define customer journey stages from onboarding to renewal.',
    docPath: '/docs/projects/customer-lifecycle/playbook_customer-lifecycle',
    tags: ['cs', 'cs-team', 'retention', 'nrr', 'foundational'],
  },
  {
    id: '08',
    title: 'Executive Reporting Suite',
    description: 'Build comprehensive executive dashboards for GTM performance.',
    docPath: '/docs/projects/executive-reporting-suite/playbook_executive-reporting-suite',
    tags: ['revops', 'leadership', 'visibility', 'arr', 'intermediate'],
  },
  {
    id: '09',
    title: 'Quotas and Target Setting',
    description: 'Design quota methodology and set achievable targets by segment.',
    docPath: '/docs/projects/quotas-and-target-setting/playbook_quotas-and-target-setting',
    tags: ['sales', 'revops', 'leadership', 'quota-attainment', 'arr', 'foundational'],
  },
  {
    id: '10',
    title: 'CRM Deduplication',
    description: 'Clean CRM data by merging duplicate accounts and contacts.',
    docPath: '/docs/projects/crm-deduplication/playbook_crm-deduplication',
    tags: ['revops', 'revops-team', 'efficiency', 'foundational'],
  },
  {
    id: '11',
    title: 'CRM Deduplication Ongoing Tool',
    description: 'Implement automated duplicate detection and prevention.',
    docPath: '/docs/projects/crm-deduplication-ongoing-tool/playbook_crm-deduplication-ongoing-tool',
    tags: ['revops', 'revops-team', 'efficiency', 'intermediate'],
  },
  {
    id: '12',
    title: 'Fed/PubSec CRM Partitioning',
    description: 'Partition CRM for federal and public sector compliance.',
    docPath: '/docs/projects/fed-pubsec-crm-partitioning/playbook_fed-pubsec-crm-partitioning',
    tags: ['revops', 'sales', 'revops-team', 'efficiency', 'advanced'],
  },
  {
    id: '13',
    title: 'GTM Org Chart, Roles & Hiring Plan',
    description: 'Design GTM org structure and hiring roadmap.',
    docPath: '/docs/projects/gtm-org-chart-roles-and-hiring-plan/playbook_gtm-org-chart-roles-and-hiring-plan',
    tags: ['revops', 'leadership', 'efficiency', 'foundational'],
  },
  {
    id: '14',
    title: 'Lead Routing',
    description: 'Design and implement lead routing rules and assignment logic.',
    docPath: '/docs/projects/lead-routing/playbook_lead-routing',
    tags: ['marketing', 'sales', 'revops-team', 'conversion-optimization', 'cycle-time', 'foundational'],
  },
  {
    id: '15',
    title: 'Marketing Automation Platform Implementation',
    description: 'Implement and configure marketing automation platform.',
    docPath: '/docs/projects/marketing-automation-platform-implementation/playbook_marketing-automation-platform-implementation',
    tags: ['marketing', 'marketing-team', 'pipeline-generation', 'efficiency', 'intermediate'],
  },
  {
    id: '16',
    title: 'Lead and Opportunity Attribution',
    description: 'Implement multi-touch attribution for leads and opportunities.',
    docPath: '/docs/projects/lead-and-opportunity-attribution/playbook_lead-and-opportunity-attribution',
    tags: ['marketing', 'revops', 'revops-team', 'visibility', 'cac', 'intermediate'],
  },
  {
    id: '17',
    title: 'Inbound Lead Journey Mapping',
    description: 'Map and optimize the inbound lead journey.',
    docPath: '/docs/projects/inbound-lead-journey-mapping/playbook_inbound-lead-journey-mapping',
    tags: ['marketing', 'marketing-team', 'conversion-optimization', 'pipeline-generation', 'intermediate'],
  },
  {
    id: '18',
    title: 'Automated Outbound Process',
    description: 'Design and automate outbound sales development process.',
    docPath: '/docs/projects/automated-outbound-process/playbook_automated-outbound-process',
    tags: ['sales', 'sales-team', 'pipeline-generation', 'efficiency', 'intermediate'],
  },
  {
    id: '19',
    title: 'Physical Event Process and ROI Reporting',
    description: 'Standardize event operations and measure ROI.',
    docPath: '/docs/projects/physical-event-process-and-roi-reporting/playbook_physical-event-process-and-roi-reporting',
    tags: ['marketing', 'marketing-team', 'pipeline-generation', 'visibility', 'cac', 'intermediate'],
  },
  {
    id: '20',
    title: 'Sales Territory Design',
    description: 'Design balanced territories for optimal coverage and quota attainment.',
    docPath: '/docs/projects/sales-territory-design/playbook_sales-territory-design',
    tags: ['sales', 'revops', 'revops-team', 'quota-attainment', 'efficiency', 'foundational'],
  },
  {
    id: '21',
    title: 'Rules of Engagement Design',
    description: 'Define account ownership rules and conflict resolution.',
    docPath: '/docs/projects/rules-of-engagement-design/playbook_rules-of-engagement-design',
    tags: ['sales', 'revops', 'sales-team', 'efficiency', 'foundational'],
  },
  {
    id: '22',
    title: 'Forecasting Process Implementation',
    description: 'Implement structured forecasting methodology and cadence.',
    docPath: '/docs/projects/forecasting-process-implementation/playbook_forecasting-process-implementation',
    tags: ['sales', 'revops', 'leadership', 'visibility', 'arr', 'intermediate'],
  },
  {
    id: '23',
    title: 'Sales Qualification Methodology',
    description: 'Implement MEDDIC, BANT, or custom qualification framework.',
    docPath: '/docs/projects/sales-qualification-methodology/playbook_sales-qualification-methodology',
    tags: ['sales', 'sales-team', 'win-rate', 'conversion-optimization', 'foundational'],
  },
  {
    id: '24',
    title: 'Activity Capture',
    description: 'Automate capture of sales activities and engagement data.',
    docPath: '/docs/projects/activity-capture/playbook_activity-capture',
    tags: ['sales', 'revops-team', 'visibility', 'efficiency', 'intermediate'],
  },
  {
    id: '25',
    title: 'Renewal/Churn/NRR/GRR Reporting',
    description: 'Build retention and revenue retention reporting.',
    docPath: '/docs/projects/renewal-churn-nrr-grr-reporting/playbook_renewal-churn-nrr-grr-reporting',
    tags: ['cs', 'revops', 'revops-team', 'nrr', 'retention', 'visibility', 'foundational'],
  },
  {
    id: '26',
    title: 'Onboarding and Process Improvement',
    description: 'Optimize customer onboarding process and time-to-value.',
    docPath: '/docs/projects/onboarding-and-process-improvement/playbook_onboarding-and-process-improvement',
    tags: ['cs', 'cs-team', 'retention', 'ltv', 'intermediate'],
  },
  {
    id: '27',
    title: 'Sales to CS Handoff Process',
    description: 'Design seamless handoff from sales to customer success.',
    docPath: '/docs/projects/sales-to-cs-handoff-process-implementation/playbook_sales-to-cs-handoff-process-implementation',
    tags: ['sales', 'cs', 'cs-team', 'retention', 'efficiency', 'foundational'],
  },
  {
    id: '28',
    title: 'NPS and Voice of Customer Launch',
    description: 'Implement NPS program and customer feedback loops.',
    docPath: '/docs/projects/nps-and-voice-of-customer-launch/playbook_nps-and-voice-of-customer-launch',
    tags: ['cs', 'cs-team', 'retention', 'visibility', 'intermediate'],
  },
  {
    id: '29',
    title: 'CPQ Implementation',
    description: 'Implement Configure-Price-Quote solution.',
    docPath: '/docs/projects/cpq-implementation/playbook_cpq-implementation',
    tags: ['sales', 'revops', 'revops-team', 'efficiency', 'cycle-time', 'advanced'],
  },
  {
    id: '30',
    title: 'Sales Engagement Platform',
    description: 'Implement sales engagement/sequencing platform.',
    docPath: '/docs/projects/sales-engagement-platform/playbook_sales-engagement-platform',
    tags: ['sales', 'sales-team', 'pipeline-generation', 'efficiency', 'intermediate'],
  },
  {
    id: '31',
    title: 'E-Signature Implementation',
    description: 'Implement electronic signature solution.',
    docPath: '/docs/projects/e-signature-implementation/playbook_e-signature-implementation',
    tags: ['sales', 'revops-team', 'cycle-time', 'efficiency', 'foundational'],
  },
  {
    id: '32',
    title: 'Support System Implementation',
    description: 'Implement customer support ticketing system.',
    docPath: '/docs/projects/support-system-implementation/playbook_support-system-implementation',
    tags: ['cs', 'cs-team', 'retention', 'efficiency', 'foundational'],
  },
  {
    id: '33',
    title: 'Customer Success Platform Implementation',
    description: 'Implement CS platform for health scoring and playbooks.',
    docPath: '/docs/projects/customer-success-platform-implementation/playbook_customer-success-platform-implementation',
    tags: ['cs', 'cs-team', 'retention', 'nrr', 'intermediate'],
  },
  {
    id: '34',
    title: 'CLM Implementation',
    description: 'Implement Contract Lifecycle Management solution.',
    docPath: '/docs/projects/clm-implementation/playbook_clm-implementation',
    tags: ['sales', 'revops', 'revops-team', 'efficiency', 'cycle-time', 'advanced'],
  },
  {
    id: '35',
    title: 'Website Lead Capture and Form Configuration',
    description: 'Optimize website forms and lead capture.',
    docPath: '/docs/projects/website-lead-capture-and-form-configuration/playbook_website-lead-capture-and-form-configuration',
    tags: ['marketing', 'marketing-team', 'pipeline-generation', 'conversion-optimization', 'foundational'],
  },
  {
    id: '36',
    title: 'Partnership Success Platform Implementation',
    description: 'Implement partner relationship management platform.',
    docPath: '/docs/projects/partnership-success-platform-implementation/playbook_partnership-success-platform-implementation',
    tags: ['partnerships', 'revops-team', 'pipeline-generation', 'arr', 'intermediate'],
  },
  {
    id: '37',
    title: 'Lead Scoring Model (Sales-Led)',
    description: 'Build lead scoring model for sales-led motion.',
    docPath: '/docs/projects/lead-scoring-model-sales-led/playbook_lead-scoring-model-sales-led',
    tags: ['marketing', 'sales', 'revops-team', 'conversion-optimization', 'efficiency', 'intermediate'],
  },
  {
    id: '38',
    title: 'Lead Scoring Model (Product-Led)',
    description: 'Build lead scoring model for product-led motion.',
    docPath: '/docs/projects/lead-scoring-model-product-led/playbook_lead-scoring-model-product-led',
    tags: ['marketing', 'revops', 'revops-team', 'conversion-optimization', 'efficiency', 'intermediate'],
  },
  {
    id: '39',
    title: 'PLG GTM Design',
    description: 'Design product-led growth go-to-market motion.',
    docPath: '/docs/projects/plg-gtm-design/playbook_plg-gtm-design',
    tags: ['marketing', 'sales', 'leadership', 'pipeline-generation', 'conversion-optimization', 'advanced'],
  },
  {
    id: '40',
    title: 'Foundational Automations and Reporting Logic',
    description: 'Build core CRM automations and reporting foundation.',
    docPath: '/docs/projects/foundational-automations-and-reporting-logic/playbook_foundational-automations-and-reporting-logic',
    tags: ['revops', 'revops-team', 'efficiency', 'visibility', 'foundational'],
  },
  {
    id: '41',
    title: 'Revenue Recognition',
    description: 'Implement revenue recognition processes and reporting.',
    docPath: '/docs/projects/revenue-recognition/playbook_revenue-recognition',
    tags: ['finance', 'revops', 'revops-team', 'arr', 'visibility', 'advanced'],
  },
  {
    id: '42',
    title: 'ARR Reporting',
    description: 'Build comprehensive ARR reporting and dashboards.',
    docPath: '/docs/projects/arr-reporting/playbook_arr-reporting',
    tags: ['revops', 'finance', 'revops-team', 'arr', 'visibility', 'foundational'],
  },
  {
    id: '43',
    title: 'HubSpot to Salesforce CRM Migration',
    description: 'Migrate from HubSpot to Salesforce CRM.',
    docPath: '/docs/projects/hubspot-to-salesforce-crm-migration/playbook_hubspot-to-salesforce-crm-migration',
    tags: ['revops', 'revops-team', 'efficiency', 'advanced'],
  },
  {
    id: '44',
    title: 'Salesforce to HubSpot CRM Migration',
    description: 'Migrate from Salesforce to HubSpot CRM.',
    docPath: '/docs/projects/salesforce-to-hubspot-crm-migration/playbook_salesforce-to-hubspot-crm-migration',
    tags: ['revops', 'revops-team', 'efficiency', 'advanced'],
  },
  {
    id: '45',
    title: 'Event Operations Platform Implementation',
    description: 'Implement event management platform.',
    docPath: '/docs/projects/event-operations-platform-implementation/playbook_event-operations-platform-implementation',
    tags: ['marketing', 'marketing-team', 'pipeline-generation', 'efficiency', 'intermediate'],
  },
  {
    id: '46',
    title: 'Monthly/Quarterly GTM Reporting Pack',
    description: 'Build recurring GTM performance reporting package.',
    docPath: '/docs/projects/monthly-quarterly-gtm-reporting-pack/playbook_monthly-quarterly-gtm-reporting-pack',
    tags: ['revops', 'leadership', 'visibility', 'arr', 'intermediate'],
  },
  {
    id: '47',
    title: 'ABM/ABS Process and System',
    description: 'Implement account-based marketing/selling program.',
    docPath: '/docs/projects/abm-abs-process-and-system/playbook_abm-abs-process-and-system',
    tags: ['marketing', 'sales', 'marketing-team', 'pipeline-generation', 'win-rate', 'advanced'],
  },
  {
    id: '48',
    title: 'Conversation Intelligence Platform',
    description: 'Implement call recording and conversation intelligence.',
    docPath: '/docs/projects/conversation-intelligence-platform-implementation/playbook_conversation-intelligence-platform-implementation',
    tags: ['sales', 'sales-team', 'win-rate', 'visibility', 'intermediate'],
  },
  {
    id: '49',
    title: 'Sales Enablement Platform Implementation',
    description: 'Implement sales content and enablement platform.',
    docPath: '/docs/projects/sales-enablement-platform-implementation/playbook_sales-enablement-platform-implementation',
    tags: ['sales', 'marketing', 'sales-team', 'win-rate', 'efficiency', 'intermediate'],
  },
  {
    id: '50',
    title: 'Customer Segmentation',
    description: 'Build customer segmentation for CS prioritization.',
    docPath: '/docs/projects/customer-segmentation/playbook_customer-segmentation',
    tags: ['cs', 'revops', 'cs-team', 'retention', 'efficiency', 'foundational'],
  },
  {
    id: '51',
    title: 'Customer Health Model',
    description: 'Build customer health scoring model.',
    docPath: '/docs/projects/customer-health-model/playbook_customer-health-model',
    tags: ['cs', 'cs-team', 'retention', 'nrr', 'intermediate'],
  },
  {
    id: '52',
    title: 'Renewal Management',
    description: 'Implement structured renewal process and playbooks.',
    docPath: '/docs/projects/renewal-management/playbook_renewal-management',
    tags: ['cs', 'sales', 'cs-team', 'nrr', 'retention', 'foundational'],
  },
  {
    id: '53',
    title: 'Email Operations: Nurture Program',
    description: 'Build automated email nurture programs.',
    docPath: '/docs/projects/email-operations-nurture-program/playbook_email-operations-nurture-program',
    tags: ['marketing', 'marketing-team', 'pipeline-generation', 'conversion-optimization', 'intermediate'],
  },
  {
    id: '54',
    title: 'Marketing Database Segmentation',
    description: 'Build marketing database segmentation strategy.',
    docPath: '/docs/projects/marketing-database-segmentation/playbook_marketing-database-segmentation',
    tags: ['marketing', 'marketing-team', 'pipeline-generation', 'efficiency', 'foundational'],
  },
  {
    id: '55',
    title: 'Marketing Reporting Pack',
    description: 'Build marketing performance reporting package.',
    docPath: '/docs/projects/marketing-reporting-pack/playbook_marketing-reporting-pack',
    tags: ['marketing', 'marketing-team', 'visibility', 'cac', 'intermediate'],
  },
  {
    id: '56',
    title: 'Email Operations: Subscription and Compliance',
    description: 'Implement email preference center and compliance.',
    docPath: '/docs/projects/email-operations-subscription-and-compliance/playbook_email-operations-subscription-and-compliance',
    tags: ['marketing', 'marketing-team', 'efficiency', 'foundational'],
  },
  {
    id: '57',
    title: 'Email Operations: Templates and Build Process',
    description: 'Standardize email templates and build process.',
    docPath: '/docs/projects/email-operations-templates-and-build-process/playbook_email-operations-templates-and-build-process',
    tags: ['marketing', 'marketing-team', 'efficiency', 'foundational'],
  },
  {
    id: '58',
    title: 'Event Operations: Lead List Intake Process',
    description: 'Standardize event lead list processing.',
    docPath: '/docs/projects/event-operations-lead-list-intake-process/playbook_event-operations-lead-list-intake-process',
    tags: ['marketing', 'marketing-team', 'pipeline-generation', 'efficiency', 'foundational'],
  },
  {
    id: '59',
    title: 'Commission Plan Design and Implementation',
    description: 'Design sales compensation and commission plans.',
    docPath: '/docs/projects/commission-plan-design-and-implementation/playbook_commission-plan-design-and-implementation',
    tags: ['sales', 'revops', 'leadership', 'quota-attainment', 'efficiency', 'advanced'],
  },
  {
    id: '60',
    title: 'Commission Tool Implementation',
    description: 'Implement commission calculation and tracking tool.',
    docPath: '/docs/projects/commission-tool-implementation/playbook_commission-tool-implementation',
    tags: ['sales', 'revops', 'revops-team', 'efficiency', 'visibility', 'intermediate'],
  },
  {
    id: '61',
    title: 'Quote to Cash',
    description: 'Optimize quote-to-cash process end-to-end.',
    docPath: '/docs/projects/quote-to-cash/playbook_quote-to-cash',
    tags: ['sales', 'revops', 'finance', 'revops-team', 'efficiency', 'cycle-time', 'advanced'],
  },
  {
    id: '62',
    title: 'Marketing to Sales Handoff and SLA Tracking',
    description: 'Define MQL handoff process and track SLA compliance.',
    docPath: '/docs/projects/marketing-to-sales-handoff-and-sla-tracking/playbook_marketing-to-sales-handoff-and-sla-tracking',
    tags: ['marketing', 'sales', 'revops-team', 'conversion-optimization', 'cycle-time', 'foundational'],
  },
  {
    id: '63',
    title: 'AI Automated Inbound',
    description: 'Implement AI-powered inbound lead processing.',
    docPath: '/docs/projects/ai-automated-inbound/playbook_ai-automated-inbound',
    tags: ['marketing', 'sales', 'revops-team', 'efficiency', 'pipeline-generation', 'advanced'],
  },
  {
    id: '64',
    title: 'Speed to Lead',
    description: 'Optimize lead response time and first contact.',
    docPath: '/docs/projects/speed-to-lead/playbook_speed-to-lead',
    tags: ['sales', 'marketing', 'revops-team', 'conversion-optimization', 'cycle-time', 'intermediate'],
  },
  {
    id: '65',
    title: 'CRM-ERP Integration',
    description: 'Integrate CRM with ERP for revenue operations.',
    docPath: '/docs/projects/crm-erp-integration/playbook_crm-erp-integration',
    tags: ['revops', 'finance', 'revops-team', 'efficiency', 'visibility', 'advanced'],
  },
  {
    id: '66',
    title: 'GTM Diagnostic',
    description: 'Comprehensive GTM health assessment and roadmap.',
    docPath: '/docs/projects/gtm-diagnostic/playbook_gtm-diagnostic',
    tags: ['revops', 'leadership', 'visibility', 'foundational'],
    featured: true,
  },
  {
    id: '67',
    title: 'Revenue Intelligence Process',
    description: 'Implement revenue intelligence and deal insights.',
    docPath: '/docs/projects/revenue-intelligence-process/playbook_revenue-intelligence-process',
    tags: ['sales', 'revops', 'sales-team', 'win-rate', 'visibility', 'advanced'],
  },
  {
    id: '68',
    title: 'Opportunity Management UX Improvements',
    description: 'Optimize CRM opportunity management experience.',
    docPath: '/docs/projects/opportunity-management-ux-improvements/playbook_opportunity-management-ux-improvements',
    tags: ['sales', 'revops', 'revops-team', 'efficiency', 'win-rate', 'intermediate'],
  },
];

// Sorted projects for display
export const sortedProjects = [...Projects].sort((a, b) =>
  a.title.localeCompare(b.title)
);

// Helper to get tags by category
export const getTagsByCategory = (category: TagCategory): TagType[] =>
  (Object.keys(Tags) as TagType[]).filter((t) => Tags[t].category === category);
