import { useMemo } from 'react';
import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { staggerContainer, fadeUpItem } from '../../../lib/animations';

// ─── Journey Stages ───────────────────────────────────────────────────────────

const STAGES = [
  { id: 'crossfunctional', label: 'Cross-Functional', sublabel: 'CRM, RevOps & Ops', color: '#3b82f6' },
  { id: 'intelligence',   label: 'Intelligence',    sublabel: 'Data & Intent',      color: '#6366f1' },
  { id: 'marketing',      label: 'Marketing',       sublabel: 'Automation & ABM',   color: '#ec4899' },
  { id: 'sales',          label: 'Sales',           sublabel: 'Execution',          color: '#f59e0b' },
  { id: 'cs',             label: 'Customer',        sublabel: 'Success',            color: '#06b6d4' },
  { id: 'partners',       label: 'Partnerships',    sublabel: 'Channel & PRM',      color: '#8b5cf6' },
];

// ─── AI Layer ─────────────────────────────────────────────────────────────────

const AI_TOOLS = [
  {
    id: 'claude',
    name: 'Claude / Claude Code',
    category: 'AI Coding & Automation',
    whatItDoes: 'Builds agents, automates workflows, and writes production code across your GTM stack.',
    whyItMatters: 'The only AI that operates as a true coding collaborator — not just a chatbot.',
    statusLabel: 'Opportunity',
    statusColor: '#a78bfa',
    statusBg: 'rgba(124,58,237,0.15)',
  },
  {
    id: 'vasco',
    name: 'Vasco',
    category: 'GTM AI Analytics',
    whatItDoes: 'Standardized GTM metrics, forecasting, and plan vs. actuals across every connected source.',
    whyItMatters: 'Closes the gap between data and decisions — answers "why did we miss quota?" in real time.',
    statusLabel: 'Connected',
    statusColor: '#86efac',
    statusBg: 'rgba(34,197,94,0.1)',
  },
  {
    id: 'gong-ai',
    name: 'Gong AI',
    category: 'Conversation Intelligence',
    whatItDoes: 'AI-powered call analysis, rep coaching signals, and deal risk detection from every conversation.',
    whyItMatters: 'Turns every call into structured data your managers can act on.',
    statusLabel: 'Active',
    statusColor: '#fde047',
    statusBg: 'rgba(234,179,8,0.1)',
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT / Copilot',
    category: 'Writing & Research',
    whatItDoes: 'AI writing, research synthesis, and content generation for sales and marketing teams.',
    whyItMatters: 'Removes blank-page friction from every rep, marketer, and CS manager.',
    statusLabel: 'Active',
    statusColor: '#86efac',
    statusBg: 'rgba(34,197,94,0.1)',
  },
];

// ─── Tool Catalog ─────────────────────────────────────────────────────────────

export const TOOL_CATALOG = [
  // Intelligence & Data
  {
    id: 'zoominfo', name: 'ZoomInfo', stage: 'intelligence', category: 'B2B Data',
    whatItDoes: 'Company and contact data enrichment with buyer intent signals.',
    whyItMatters: 'Without accurate contact data, every outbound motion starts with bad addresses.',
    detectFn: (sig) => {
      const tools = sig.enrichment_tools || [];
      if (tools.some(t => /zoominfo|zi_/i.test(t.name || t))) return 'confirmed';
      if (sig.has_enrichment_tool) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'clay', name: 'Clay', stage: 'intelligence', category: 'Data Enrichment',
    whatItDoes: 'AI-powered enrichment orchestration — combines 50+ data sources into one workflow.',
    whyItMatters: 'Replaces 3-5 enrichment tools and cuts data team overhead by 60%.',
    detectFn: (sig) => {
      const tools = sig.enrichment_tools || [];
      if (tools.some(t => /^clay_|_clay_/i.test(t.name || t))) return 'confirmed';
      if (sig.has_enrichment_tool) return 'likely';
      return 'unknown';
    },
  },
  {
    id: '6sense', name: '6sense', stage: 'intelligence', category: 'Intent & ABM',
    whatItDoes: 'Account-level buyer intent detection using AI across web, content, and third-party signals.',
    whyItMatters: 'Prioritizes outreach to the 3% of your TAM actively in-market right now.',
    detectFn: (sig) => {
      const tools = sig.enrichment_tools || [];
      if (tools.some(t => /6sense/i.test(t.name || t))) return 'confirmed';
      if (sig.has_abm_tool) return 'likely';
      return 'missing';
    },
  },
  {
    id: 'clearbit', name: 'Clearbit', stage: 'intelligence', category: 'Data Enrichment',
    whatItDoes: 'Real-time company and contact enrichment via API — used for inbound scoring and form shortening.',
    whyItMatters: 'Eliminates manual research for inbound leads and enriches every new contact instantly.',
    detectFn: (sig) => {
      const tools = sig.enrichment_tools || [];
      if (tools.some(t => /clearbit/i.test(t.name || t))) return 'confirmed';
      return 'unknown';
    },
  },
  {
    id: 'apollo', name: 'Apollo', stage: 'intelligence', category: 'Prospecting',
    whatItDoes: 'Prospecting database, email sequencing, and enrichment in one platform.',
    whyItMatters: 'Combines data and outreach — reduces the tool stack for smaller teams.',
    detectFn: (sig) => {
      const tools = sig.enrichment_tools || [];
      if (tools.some(t => /apollo/i.test(t.name || t))) return 'confirmed';
      if (sig.has_enrichment_tool || sig.has_sales_engagement_tool) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'demandbase', name: 'Demandbase', stage: 'intelligence', category: 'ABM',
    whatItDoes: 'Account-based marketing platform with advertising, intent, and engagement scoring.',
    whyItMatters: 'Aligns marketing spend to the accounts sales actually wants to close.',
    detectFn: (sig) => {
      const tools = sig.enrichment_tools || [];
      if (tools.some(t => /demandbase/i.test(t.name || t))) return 'confirmed';
      if (sig.has_abm_tool) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'bombora', name: 'Bombora', stage: 'intelligence', category: 'Intent Data',
    whatItDoes: 'Third-party B2B intent data from 5,000+ publisher sites tracking research behavior.',
    whyItMatters: 'Tells you which companies are researching your category before they ever visit your site.',
    detectFn: () => 'unknown',
  },
  {
    id: 'lusha', name: 'Lusha', stage: 'intelligence', category: 'Contact Data',
    whatItDoes: 'Direct dial and personal email data for B2B prospecting, with browser extension.',
    whyItMatters: 'Gets reps past gatekeepers with verified mobile numbers and direct emails.',
    detectFn: (sig) => {
      const tools = sig.enrichment_tools || [];
      if (tools.some(t => /lusha/i.test(t.name || t))) return 'confirmed';
      if (sig.has_enrichment_tool) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'cognism', name: 'Cognism', stage: 'intelligence', category: 'B2B Data',
    whatItDoes: 'GDPR-compliant B2B data with phone-verified mobile numbers and intent signals.',
    whyItMatters: 'The compliance-first alternative to ZoomInfo for teams selling into EMEA markets.',
    detectFn: (sig) => {
      const tools = sig.enrichment_tools || [];
      if (tools.some(t => /cognism/i.test(t.name || t))) return 'confirmed';
      if (sig.has_enrichment_tool) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'dealfront', name: 'Dealfront', stage: 'intelligence', category: 'European GTM Data',
    whatItDoes: 'European-focused go-to-market intelligence combining Echobot and Leadfeeder data.',
    whyItMatters: 'Purpose-built for DACH and European markets where US databases fall short.',
    detectFn: () => 'unknown',
  },

  // Marketing
  {
    id: 'hubspot-marketing', name: 'HubSpot Mktg', stage: 'marketing', category: 'Marketing Automation',
    whatItDoes: 'Email, landing pages, workflows, and attribution reporting in one platform.',
    whyItMatters: 'The glue between marketing campaigns and CRM pipeline data.',
    detectFn: (sig, crmType) => {
      if (crmType === 'hubspot' || crmType === 'dual') return 'confirmed';
      return 'unknown';
    },
  },
  {
    id: 'marketo', name: 'Marketo', stage: 'marketing', category: 'Marketing Automation',
    whatItDoes: 'Enterprise marketing automation for complex nurture programs and ABM.',
    whyItMatters: 'Powers the highest-volume and most complex B2B demand gen programs.',
    detectFn: (sig) => {
      if (sig.has_marketing_automation_package) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'drift', name: 'Drift / Qualified', stage: 'marketing', category: 'Conversational Marketing',
    whatItDoes: 'Website chatbot that qualifies and routes inbound visitors to reps in real time.',
    whyItMatters: 'Cuts inbound response time from hours to seconds — the biggest lever for speed-to-lead.',
    detectFn: () => 'unknown',
  },
  {
    id: 'intercom-mktg', name: 'Intercom', stage: 'marketing', category: 'Customer Messaging',
    whatItDoes: 'In-app messaging, onboarding flows, and support — bridges marketing into product.',
    whyItMatters: 'Turns your product into a retention and expansion channel.',
    detectFn: (sig) => {
      if (sig.has_support_tool) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'pardot', name: 'Pardot', stage: 'marketing', category: 'Marketing Automation',
    whatItDoes: 'Salesforce-native B2B marketing automation for nurturing, scoring, and reporting.',
    whyItMatters: 'Deep Salesforce sync makes it the natural MAP choice for Salesforce-heavy orgs.',
    detectFn: (sig) => {
      if (sig.has_marketing_automation_package) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'eloqua', name: 'Eloqua', stage: 'marketing', category: 'Marketing Automation',
    whatItDoes: 'Oracle Eloqua — enterprise-grade marketing automation for complex multi-touch programs.',
    whyItMatters: 'Built for large orgs running high-volume, multi-market demand gen programs.',
    detectFn: (sig) => {
      if (sig.has_marketing_automation_package) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'klaviyo', name: 'Klaviyo', stage: 'marketing', category: 'Email & SMS',
    whatItDoes: 'Email and SMS marketing automation with deep ecommerce and product data integrations.',
    whyItMatters: 'Best-in-class for PLG and ecommerce-adjacent B2B companies needing behavioral triggers.',
    detectFn: () => 'unknown',
  },
  {
    id: 'braze', name: 'Braze', stage: 'marketing', category: 'Customer Engagement',
    whatItDoes: 'Cross-channel customer engagement platform for email, push, SMS, and in-app messaging.',
    whyItMatters: 'Powers personalized lifecycle marketing at scale for product-led businesses.',
    detectFn: () => 'unknown',
  },
  {
    id: 'iterable', name: 'Iterable', stage: 'marketing', category: 'Cross-Channel Marketing',
    whatItDoes: 'Growth marketing platform for multi-channel campaigns across email, SMS, push, and web.',
    whyItMatters: 'Flexible workflow builder lets marketing ops build complex journeys without engineering.',
    detectFn: () => 'unknown',
  },
  {
    id: 'customer-io', name: 'Customer.io', stage: 'marketing', category: 'Messaging Automation',
    whatItDoes: 'Behavioral messaging automation using real-time data to trigger personalized campaigns.',
    whyItMatters: 'Developers love it — direct API integration means your product data drives every send.',
    detectFn: () => 'unknown',
  },
  {
    id: 'mailchimp', name: 'Mailchimp', stage: 'marketing', category: 'Email Marketing',
    whatItDoes: 'Email marketing, landing pages, and light automation — popular with early-stage teams.',
    whyItMatters: 'Fast to launch, low cost — right platform until you need advanced segmentation.',
    detectFn: () => 'unknown',
  },
  {
    id: 'sendgrid', name: 'SendGrid', stage: 'marketing', category: 'Email Delivery',
    whatItDoes: 'Transactional email delivery and marketing campaigns via API or drag-and-drop builder.',
    whyItMatters: 'Powers high-volume transactional sends with 99%+ deliverability infrastructure.',
    detectFn: () => 'unknown',
  },
  {
    id: 'on24', name: 'ON24', stage: 'marketing', category: 'Virtual Events',
    whatItDoes: 'Webinar and virtual event platform with engagement analytics and content repurposing.',
    whyItMatters: 'Turns webinars into pipeline — first-party engagement data feeds directly into MAP scoring.',
    detectFn: () => 'unknown',
  },
  {
    id: 'goldcast', name: 'Goldcast', stage: 'marketing', category: 'B2B Events',
    whatItDoes: 'B2B virtual and hybrid event platform designed for demand gen and field marketing.',
    whyItMatters: 'Built natively for B2B — CRM sync and account-level engagement data out of the box.',
    detectFn: () => 'unknown',
  },
  {
    id: 'unbounce', name: 'Unbounce', stage: 'marketing', category: 'Landing Pages',
    whatItDoes: 'AI-powered landing page builder with A/B testing and smart traffic optimization.',
    whyItMatters: 'Marketers can ship high-converting pages without waiting on engineering.',
    detectFn: () => 'unknown',
  },
  {
    id: 'instapage', name: 'Instapage', stage: 'marketing', category: 'Landing Pages',
    whatItDoes: 'Enterprise landing page platform with personalization and ad-to-page matching.',
    whyItMatters: 'Ad spend ROI depends on landing page relevance — Instapage closes the gap.',
    detectFn: () => 'unknown',
  },
  {
    id: 'calendly', name: 'Calendly', stage: 'marketing', category: 'Scheduling',
    whatItDoes: 'Meeting scheduling automation — embeds in emails, websites, and chatbots.',
    whyItMatters: 'Removes back-and-forth friction from the inbound meeting booking process.',
    detectFn: () => 'unknown',
  },
  {
    id: 'bizible', name: 'Bizible / Marketo Measure', stage: 'marketing', category: 'Attribution',
    whatItDoes: 'Multi-touch B2B attribution that connects marketing touchpoints to closed revenue.',
    whyItMatters: 'Without it, marketing can\'t prove its impact on pipeline — budget conversations become guesswork.',
    detectFn: () => 'unknown',
  },
  {
    id: 'dreamdata', name: 'Dreamdata', stage: 'marketing', category: 'Attribution',
    whatItDoes: 'B2B revenue attribution across the entire customer journey with self-serve analytics.',
    whyItMatters: 'Purpose-built for B2B SaaS — connects paid, organic, and product signals in one model.',
    detectFn: () => 'unknown',
  },
  {
    id: 'hockeystack', name: 'HockeyStack', stage: 'marketing', category: 'Attribution & Analytics',
    whatItDoes: 'No-code B2B analytics with pipeline attribution, intent signals, and funnel visibility.',
    whyItMatters: 'Eliminates data warehouse dependency — marketing gets self-serve revenue attribution.',
    detectFn: () => 'unknown',
  },

  // Cross-Functional (CRM + RevOps)
  {
    id: 'salesforce', name: 'Salesforce', stage: 'crossfunctional', category: 'CRM',
    whatItDoes: 'The industry-standard CRM for B2B — opportunity management, pipeline visibility, and reporting.',
    whyItMatters: 'Every GTM motion runs through your CRM. If it\'s broken, everything downstream is broken.',
    detectFn: (sig, crmType) => {
      if (crmType === 'salesforce' || crmType === 'dual') return 'confirmed';
      return 'missing';
    },
  },
  {
    id: 'hubspot-crm', name: 'HubSpot CRM', stage: 'crossfunctional', category: 'CRM',
    whatItDoes: 'Free-to-start CRM with native marketing and sales tools — strong for SMB and mid-market.',
    whyItMatters: 'Best-in-class ease of use and time-to-value for growing GTM teams.',
    detectFn: (sig, crmType) => {
      if (crmType === 'hubspot' || crmType === 'dual') return 'confirmed';
      return 'unknown';
    },
  },

  // Sales Execution
  {
    id: 'outreach', name: 'Outreach', stage: 'sales', category: 'Sales Engagement',
    whatItDoes: 'Multi-channel sales sequences (email, phone, LinkedIn) with performance analytics.',
    whyItMatters: 'Reps without a sequencer send 5x fewer touchpoints. Volume + personalization at scale.',
    detectFn: (sig) => {
      if (sig.has_sales_engagement_tool) return 'likely';
      return 'missing';
    },
  },
  {
    id: 'salesloft', name: 'SalesLoft', stage: 'sales', category: 'Sales Engagement',
    whatItDoes: 'Revenue orchestration platform — sequences, dialer, forecasting, and conversation insights.',
    whyItMatters: 'Unifies the rep workflow so managers have full visibility into pipeline activity.',
    detectFn: (sig) => {
      if (sig.has_sales_engagement_tool) return 'likely';
      return 'missing';
    },
  },
  {
    id: 'amplemarket', name: 'Amplemarket', stage: 'sales', category: 'AI Sales',
    whatItDoes: 'AI-native outbound platform — data, sequencing, and AI research in one tool.',
    whyItMatters: 'Replaces the ZoomInfo + Outreach stack for teams that want to simplify.',
    detectFn: () => 'unknown',
  },
  {
    id: 'gong', name: 'Gong', stage: 'sales', category: 'Conversation Intelligence',
    whatItDoes: 'Records and analyzes every sales call — surfaces deals at risk and coaching moments.',
    whyItMatters: 'The highest-ROI investment in sales excellence. Managers can coach 10x more reps.',
    detectFn: (sig) => {
      if (sig.has_conversation_intelligence) return 'confirmed';
      return 'missing';
    },
  },
  {
    id: 'chorus', name: 'Chorus', stage: 'sales', category: 'Conversation Intelligence',
    whatItDoes: 'Conversation intelligence and sales coaching via call recordings and AI analysis.',
    whyItMatters: 'Enables data-driven coaching at scale without sitting in every call.',
    detectFn: (sig) => {
      if (sig.has_conversation_intelligence) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'zoom', name: 'Zoom', stage: 'sales', category: 'Video & Meetings',
    whatItDoes: 'Video conferencing for demos, discovery calls, and QBRs.',
    whyItMatters: 'The default canvas for the entire B2B sales motion.',
    detectFn: () => 'confirmed',
  },
  {
    id: 'linkedin-sales-nav', name: 'LinkedIn Sales Nav', stage: 'sales', category: 'Social Selling',
    whatItDoes: 'Advanced prospecting, account maps, and relationship intelligence inside LinkedIn.',
    whyItMatters: 'Multi-threading deals requires knowing the org chart — Sales Nav makes that visible.',
    detectFn: () => 'unknown',
  },
  {
    id: 'aviso', name: 'Aviso', stage: 'sales', category: 'AI-Guided Selling',
    whatItDoes: 'AI-driven deal guidance, forecasting, and pipeline risk detection.',
    whyItMatters: 'Tells reps which deals to focus on and managers which to inspect — before it\'s too late.',
    detectFn: (sig) => {
      if (sig.has_forecasting_config) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'dealpath', name: 'DealPath', stage: 'sales', category: 'Deal Management',
    whatItDoes: 'Deal management platform for tracking complex enterprise sales with stakeholder maps.',
    whyItMatters: 'Keeps enterprise deals on track when there are 10+ stakeholders and 6+ month cycles.',
    detectFn: () => 'unknown',
  },
  {
    id: 'seismic', name: 'Seismic', stage: 'sales', category: 'Sales Enablement',
    whatItDoes: 'Content management and personalization platform for sales and marketing alignment.',
    whyItMatters: 'Reps find the right content in seconds instead of wasting time rebuilding decks.',
    detectFn: (sig) => {
      if (sig.has_sales_enablement_tool) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'highspot', name: 'Highspot', stage: 'sales', category: 'Sales Enablement',
    whatItDoes: 'Sales enablement platform with content, training, and buyer engagement analytics.',
    whyItMatters: 'Connects content usage to win rates — finally proves which assets actually close deals.',
    detectFn: (sig) => {
      if (sig.has_sales_enablement_tool) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'showpad', name: 'Showpad', stage: 'sales', category: 'Sales Enablement',
    whatItDoes: 'Content and training platform that delivers the right assets at every stage of the deal.',
    whyItMatters: 'Accelerates onboarding and keeps reps equipped with current, approved materials.',
    detectFn: (sig) => {
      if (sig.has_sales_enablement_tool) return 'likely';
      return 'unknown';
    },
  },

  {
    id: 'clari', name: 'Clari', stage: 'crossfunctional', category: 'Revenue Intelligence',
    whatItDoes: 'AI-powered pipeline inspection and revenue forecasting in real time.',
    whyItMatters: 'Replaces spreadsheet forecasting — gives VP Sales an accurate number every Friday.',
    detectFn: (sig) => {
      if (sig.has_forecasting_config) return 'confirmed';
      return 'missing';
    },
  },
  {
    id: 'leandata', name: 'LeanData', stage: 'crossfunctional', category: 'Lead Routing',
    whatItDoes: 'Automated lead-to-account matching and round-robin routing inside Salesforce.',
    whyItMatters: 'Without it, inbound leads route to the wrong rep or fall through the cracks.',
    detectFn: () => 'unknown',
  },
  {
    id: 'chili-piper', name: 'Chili Piper', stage: 'crossfunctional', category: 'Meeting Scheduling',
    whatItDoes: 'Instant inbound meeting booking — converts form fills into booked demos in under a minute.',
    whyItMatters: 'Speed-to-lead is the #1 predictor of inbound conversion. Chili Piper eliminates lag.',
    detectFn: () => 'unknown',
  },
  {
    id: 'docusign', name: 'DocuSign', stage: 'crossfunctional', category: 'E-Signature / CPQ',
    whatItDoes: 'Electronic signature and contract management for accelerating deal close.',
    whyItMatters: 'Every day a contract sits unsigned is a day of ARR at risk.',
    detectFn: () => 'unknown',
  },
  {
    id: 'pandadoc', name: 'PandaDoc', stage: 'crossfunctional', category: 'Proposals & E-Sign',
    whatItDoes: 'Proposal creation, e-signature, and contract management with CRM integrations.',
    whyItMatters: 'Turns proposal creation from a 2-hour task into a 10-minute workflow.',
    detectFn: () => 'unknown',
  },
  {
    id: 'conga', name: 'Conga', stage: 'crossfunctional', category: 'Document & CLM',
    whatItDoes: 'Document generation, contract lifecycle management, and CPQ within Salesforce.',
    whyItMatters: 'Automates the contract redline and approval process for enterprise deals.',
    detectFn: () => 'unknown',
  },
  {
    id: 'captivateiq', name: 'CaptivateIQ', stage: 'crossfunctional', category: 'Commission Management',
    whatItDoes: 'Automated commission calculation and rep-facing payout visibility.',
    whyItMatters: 'Eliminates commission disputes — reps trust their numbers and focus on selling.',
    detectFn: () => 'unknown',
  },
  {
    id: 'spiff', name: 'Spiff', stage: 'crossfunctional', category: 'Commission Management',
    whatItDoes: 'Real-time commission tracking with rep-facing dashboards and plan management.',
    whyItMatters: 'Transparency in commissions is a retention lever — reps leave when they don\'t trust the math.',
    detectFn: () => 'unknown',
  },
  {
    id: 'xactly', name: 'Xactly', stage: 'crossfunctional', category: 'Incentive Compensation',
    whatItDoes: 'Enterprise incentive compensation management with analytics and quota planning.',
    whyItMatters: 'Aligns rep behavior to company strategy — the right plan drives the right motions.',
    detectFn: () => 'unknown',
  },
  {
    id: 'looker', name: 'Looker', stage: 'crossfunctional', category: 'Business Intelligence',
    whatItDoes: 'SQL-based BI platform with governed metrics, embedded analytics, and data exploration.',
    whyItMatters: 'A single source of truth for GTM metrics across all departments and data sources.',
    detectFn: () => 'unknown',
  },
  {
    id: 'tableau', name: 'Tableau', stage: 'crossfunctional', category: 'Business Intelligence',
    whatItDoes: 'Visual analytics platform for building interactive dashboards from any data source.',
    whyItMatters: 'Makes data explorable for non-technical revenue leaders without writing SQL.',
    detectFn: () => 'unknown',
  },
  {
    id: 'domo', name: 'Domo', stage: 'crossfunctional', category: 'Business Intelligence',
    whatItDoes: 'Cloud-native BI platform with pre-built connectors and mobile-first dashboards.',
    whyItMatters: 'Executives want real-time pipeline and ARR on their phone — Domo delivers that.',
    detectFn: () => 'unknown',
  },
  {
    id: 'powerbi', name: 'Power BI', stage: 'crossfunctional', category: 'Business Intelligence',
    whatItDoes: 'Microsoft\'s BI tool — connects Excel, Azure, and Dynamics data into visual reports.',
    whyItMatters: 'Natural choice for Microsoft-stack organizations needing fast, free reporting.',
    detectFn: () => 'unknown',
  },
  {
    id: 'segment', name: 'Segment', stage: 'crossfunctional', category: 'Customer Data Platform',
    whatItDoes: 'Customer data platform that collects, unifies, and routes product behavior data.',
    whyItMatters: 'Without a CDP, product data sits siloed — Segment connects it to your MAP and CRM.',
    detectFn: () => 'unknown',
  },
  {
    id: 'fivetran', name: 'Fivetran', stage: 'crossfunctional', category: 'Data Pipeline',
    whatItDoes: 'Automated data connectors that sync SaaS apps and databases into your data warehouse.',
    whyItMatters: 'Eliminates data engineering bottlenecks — your warehouse stays fresh without maintenance.',
    detectFn: () => 'unknown',
  },
  {
    id: 'census', name: 'Census', stage: 'crossfunctional', category: 'Reverse ETL',
    whatItDoes: 'Reverse ETL — syncs warehouse data back into CRM, MAP, and sales tools.',
    whyItMatters: 'Closes the loop: data collected in your warehouse actually reaches the tools reps use.',
    detectFn: () => 'unknown',
  },
  {
    id: 'hightouch', name: 'Hightouch', stage: 'crossfunctional', category: 'Reverse ETL',
    whatItDoes: 'Syncs data from your warehouse to 100+ destinations — CRM, ads, support, and more.',
    whyItMatters: 'Turns your data warehouse into an activation layer for every GTM system.',
    detectFn: () => 'unknown',
  },

  // Customer Success
  {
    id: 'gainsight', name: 'Gainsight', stage: 'cs', category: 'CS Platform',
    whatItDoes: 'Customer success management — health scores, playbooks, QBRs, and renewal tracking.',
    whyItMatters: 'The operating system for your CS team. Without it, renewals are reactive.',
    detectFn: (sig) => {
      if (sig.has_cs_platform_installed) return 'confirmed';
      return 'missing';
    },
  },
  {
    id: 'churnzero', name: 'ChurnZero', stage: 'cs', category: 'CS Platform',
    whatItDoes: 'Real-time customer health monitoring and automated CS plays for at-risk accounts.',
    whyItMatters: 'Identifies churn risk 60-90 days before renewal — while there\'s still time to intervene.',
    detectFn: (sig) => {
      if (sig.has_cs_platform_installed) return 'likely';
      return 'missing';
    },
  },
  {
    id: 'zendesk', name: 'Zendesk', stage: 'cs', category: 'Support',
    whatItDoes: 'Ticketing, live chat, and help desk for customer support operations.',
    whyItMatters: 'Support volume and CSAT are leading indicators of retention.',
    detectFn: (sig) => {
      if (sig.has_support_tool) return 'confirmed';
      return 'unknown';
    },
  },
  {
    id: 'vitally', name: 'Vitally / Planhat', stage: 'cs', category: 'CS Platform',
    whatItDoes: 'Modern CS platforms with usage data integrations, NPS, and renewal workflows.',
    whyItMatters: 'Designed for SaaS teams that need product usage + CRM signals in one view.',
    detectFn: (sig) => {
      if (sig.has_cs_platform_installed) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'totango', name: 'Totango', stage: 'cs', category: 'CS Platform',
    whatItDoes: 'Modular customer success platform with SuccessPlays, health scores, and expansion tracking.',
    whyItMatters: 'Pre-built playbook library gets CS teams operational without building from scratch.',
    detectFn: (sig) => {
      if (sig.has_cs_platform_installed) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'freshdesk', name: 'Freshdesk', stage: 'cs', category: 'Support',
    whatItDoes: 'Helpdesk and ticketing with AI-powered automations and multi-channel support.',
    whyItMatters: 'Cost-effective Zendesk alternative for growing teams needing full support infrastructure.',
    detectFn: (sig) => {
      if (sig.has_support_tool) return 'likely';
      return 'unknown';
    },
  },
  {
    id: 'pendo', name: 'Pendo', stage: 'cs', category: 'Product Analytics',
    whatItDoes: 'In-app guides, NPS, feature adoption analytics, and user behavior tracking.',
    whyItMatters: 'Turns product usage data into CS insights — who\'s adopting, who\'s at risk, what\'s stuck.',
    detectFn: () => 'unknown',
  },
  {
    id: 'userguiding', name: 'UserGuiding', stage: 'cs', category: 'Product Adoption',
    whatItDoes: 'No-code in-app onboarding checklists, tooltips, and product tours.',
    whyItMatters: 'Reduces time-to-value for new users without engineering resources.',
    detectFn: () => 'unknown',
  },
  {
    id: 'delighted', name: 'Delighted', stage: 'cs', category: 'NPS & Feedback',
    whatItDoes: 'Simple NPS, CSAT, and CES surveys delivered via email, SMS, or in-app.',
    whyItMatters: 'Real-time customer sentiment — your earliest warning signal before a churn risk escalates.',
    detectFn: () => 'unknown',
  },
  {
    id: 'surveymonkey', name: 'SurveyMonkey', stage: 'cs', category: 'Surveys',
    whatItDoes: 'Online survey platform for customer research, NPS, and event feedback.',
    whyItMatters: 'Structured customer feedback at scale without a custom research team.',
    detectFn: () => 'unknown',
  },
  {
    id: 'typeform', name: 'Typeform', stage: 'cs', category: 'Forms & Surveys',
    whatItDoes: 'Conversational forms and surveys with high completion rates and CRM integrations.',
    whyItMatters: 'Form completion rates 3× higher than standard surveys — more signal, less friction.',
    detectFn: () => 'unknown',
  },

  // Partnerships
  {
    id: 'partnerstack', name: 'PartnerStack', stage: 'partners', category: 'PRM',
    whatItDoes: 'Partner relationship management — affiliate, reseller, and referral program automation.',
    whyItMatters: 'Partner-sourced pipeline has 25% higher close rates and 30% lower CAC.',
    detectFn: (sig) => {
      if (sig.has_prm_tool) return 'confirmed';
      return 'missing';
    },
  },
  {
    id: 'crossbeam', name: 'Crossbeam', stage: 'partners', category: 'Partner Intelligence',
    whatItDoes: 'Account mapping with partners — safely compare customer lists to find overlaps.',
    whyItMatters: 'Turns partner relationships from conversations into pipeline.',
    detectFn: () => 'unknown',
  },
  {
    id: 'workramp', name: 'WorkRamp', stage: 'partners', category: 'Enablement LMS',
    whatItDoes: 'Learning management system for partner and internal sales enablement.',
    whyItMatters: 'Certifies partners and reps at scale without synchronous training sessions.',
    detectFn: (sig) => {
      if (sig.has_lms) return 'likely';
      return 'unknown';
    },
  },
];

// ─── Status Config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  confirmed:  { dot: '#22c55e', border: '1px solid rgba(34,197,94,0.45)',  shadow: '0 0 8px rgba(34,197,94,0.12)',  bg: 'rgba(34,197,94,0.04)',  label: 'Detected' },
  likely:     { dot: '#60a5fa', border: '1px solid rgba(96,165,250,0.4)',   shadow: 'none',                          bg: 'rgba(96,165,250,0.04)', label: 'Likely' },
  missing:    { dot: '#f87171', border: '1px dashed rgba(239,68,68,0.5)',   shadow: 'none',                          bg: 'transparent',           label: 'Gap' },
  'not-needed': { dot: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.05)', shadow: 'none', bg: 'transparent', label: 'N/A' },
  unknown:    { dot: 'rgba(255,255,255,0.2)',  border: '1px solid rgba(255,255,255,0.08)',  shadow: 'none',  bg: 'transparent',           label: '?' },
};

const STATUS_CYCLE = ['confirmed', 'missing', 'not-needed'];

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function ToolTooltip({ tool, status }) {
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
  const statusMessages = {
    confirmed:   'Detected via CRM signals or API integration.',
    likely:      'Inferred from intake signals — not yet verified.',
    missing:     'Not detected — this may be a gap worth addressing.',
    'not-needed': 'Marked as not applicable for this customer.',
    unknown:     'No data to confirm or rule out.',
  };
  return (
    <div style={{
      background: '#12101e',
      border: '1px solid rgba(255,255,255,0.14)',
      borderRadius: 10,
      padding: '0.7rem 0.85rem',
      maxWidth: 240,
      boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)' }}>{tool.name}</span>
        <span style={{ fontSize: '0.6rem', color: sc.dot, fontWeight: 600, marginLeft: 'auto' }}>{sc.label}</span>
      </div>
      <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {tool.category}
      </div>
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '0.35rem' }}>
        {tool.whatItDoes}
      </div>
      <div style={{ fontSize: '0.68rem', color: '#a78bfa', lineHeight: 1.45, marginBottom: '0.35rem', fontStyle: 'italic' }}>
        {tool.whyItMatters}
      </div>
      <div style={{ fontSize: '0.65rem', color: status === 'missing' ? '#fca5a5' : status === 'confirmed' ? '#86efac' : 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
        {statusMessages[status]}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GTMLandscape({
  companyProfile = {},
  computedSignals = {},
  crmType = 'salesforce',
  editMode = false,
  overrides = {},
  onOverride,
}) {
  // Compute status for each tool
  const toolStatuses = useMemo(() => {
    const auto = {};
    for (const tool of TOOL_CATALOG) {
      auto[tool.id] = tool.detectFn(computedSignals, crmType) || 'unknown';
    }
    // Apply manual overrides
    const manualOverrides = overrides?.gtmLandscape?.tools || {};
    return { ...auto, ...manualOverrides };
  }, [computedSignals, crmType, overrides]);

  function cycleStatus(toolId) {
    if (!editMode) return;
    const current = toolStatuses[toolId] || 'unknown';
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    onOverride?.('gtmLandscape', 'tools', { [toolId]: next });
  }

  // Summary stats
  const activeCatalog = TOOL_CATALOG.filter(t => toolStatuses[t.id] !== 'not-needed');
  const detectedCount = activeCatalog.filter(t => ['confirmed', 'likely'].includes(toolStatuses[t.id])).length;
  const gapCount = activeCatalog.filter(t => toolStatuses[t.id] === 'missing').length;

  // Group tools by stage
  const byStage = useMemo(() => {
    const map = {};
    for (const stage of STAGES) map[stage.id] = [];
    for (const tool of TOOL_CATALOG) {
      if (map[tool.stage]) map[tool.stage].push(tool);
    }
    return map;
  }, []);

  return (
    <Tooltip.Provider delayDuration={150}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{
          background: 'rgba(8, 6, 18, 0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '1.5rem',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <motion.div variants={fadeUpItem} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.97)' }}>
              GTM Systems Landscape
            </h2>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
              Your full go-to-market stack across the customer journey
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Stat value={detectedCount} label="tools detected" color="#86efac" bg="rgba(34,197,94,0.08)" border="rgba(34,197,94,0.2)" />
            {gapCount > 0 && (
              <Stat value={gapCount} label="gaps found" color="#fca5a5" bg="rgba(239,68,68,0.08)" border="rgba(239,68,68,0.2)" />
            )}
            <Stat value={TOOL_CATALOG.length} label="tools tracked" color="rgba(255,255,255,0.4)" bg="rgba(255,255,255,0.04)" border="rgba(255,255,255,0.08)" />
          </div>
        </motion.div>

        {/* AI Layer */}
        <motion.div variants={fadeUpItem} style={{
          background: 'linear-gradient(90deg, rgba(124,58,237,0.18), rgba(167,139,250,0.1), rgba(99,102,241,0.18))',
          border: '1px solid rgba(124,58,237,0.3)',
          borderRadius: 10,
          padding: '0.65rem 1rem',
          marginBottom: '1.25rem',
          boxShadow: '0 0 24px rgba(124,58,237,0.12)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a78bfa', whiteSpace: 'nowrap', marginRight: '0.25rem' }}>
            AI Layer
          </span>
          <div style={{ width: 1, height: 16, background: 'rgba(167,139,250,0.25)', flexShrink: 0 }} />
          {AI_TOOLS.map(tool => (
            <Tooltip.Root key={tool.id}>
              <Tooltip.Trigger asChild>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 6,
                  background: tool.statusBg,
                  border: `1px solid rgba(167,139,250,0.2)`,
                  cursor: 'help',
                  transition: 'background 0.15s',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: tool.statusColor, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{tool.name}</span>
                  <span style={{ fontSize: '0.6rem', color: tool.statusColor, fontWeight: 600 }}>{tool.statusLabel}</span>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content side="bottom" align="start" sideOffset={6} style={{ zIndex: 1000 }}>
                  <div style={{
                    background: '#12101e',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 10,
                    padding: '0.7rem 0.85rem',
                    maxWidth: 260,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.2rem', color: '#a78bfa' }}>{tool.name}</div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{tool.category}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, marginBottom: '0.3rem' }}>{tool.whatItDoes}</div>
                    <div style={{ fontSize: '0.68rem', color: '#c4b5fd', fontStyle: 'italic', lineHeight: 1.4 }}>{tool.whyItMatters}</div>
                  </div>
                  <Tooltip.Arrow style={{ fill: '#12101e' }} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          ))}
        </motion.div>

        {/* Stage Columns */}
        <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(130px, 1fr))',
            gap: '0.6rem',
            minWidth: 860,
          }}>
            {STAGES.map((stage, stageIdx) => {
              const tools = byStage[stage.id] || [];
              return (
                <motion.div
                  key={stage.id}
                  variants={fadeUpItem}
                  transition={{ delay: stageIdx * 0.04 }}
                >
                  {/* Stage header */}
                  <div style={{
                    padding: '0.4rem 0.5rem',
                    borderRadius: '7px 7px 0 0',
                    background: `${stage.color}14`,
                    borderBottom: `2px solid ${stage.color}`,
                    marginBottom: '0.4rem',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: stage.color, letterSpacing: '0.03em' }}>
                      {stage.label}
                    </div>
                    <div style={{ fontSize: '0.55rem', color: `${stage.color}99`, marginTop: '1px', letterSpacing: '0.02em' }}>
                      {stage.sublabel}
                    </div>
                  </div>

                  {/* Tool cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {tools.map(tool => {
                      const status = toolStatuses[tool.id] || 'unknown';
                      if (status === 'not-needed' && !editMode) return null;
                      const sc = STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
                      return (
                        <Tooltip.Root key={tool.id}>
                          <Tooltip.Trigger asChild>
                            <div
                              onClick={() => cycleStatus(tool.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                padding: '0.3rem 0.4rem',
                                borderRadius: 6,
                                background: sc.bg,
                                border: sc.border,
                                boxShadow: sc.shadow,
                                cursor: editMode ? 'pointer' : 'help',
                                transition: 'background 0.15s ease, border-color 0.15s ease',
                                opacity: status === 'not-needed' ? 0.35 : 1,
                              }}
                            >
                              <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                              <span style={{ fontSize: '0.64rem', fontWeight: 600, color: 'rgba(255,255,255,0.82)', lineHeight: 1.2 }}>
                                {tool.name}
                              </span>
                            </div>
                          </Tooltip.Trigger>
                          <Tooltip.Portal>
                            <Tooltip.Content side="top" align="start" sideOffset={6} style={{ zIndex: 1000 }}>
                              <ToolTooltip tool={tool} status={status} />
                              <Tooltip.Arrow style={{ fill: '#12101e' }} />
                            </Tooltip.Content>
                          </Tooltip.Portal>
                        </Tooltip.Root>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <motion.div variants={fadeUpItem} style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.58rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)', marginRight: '0.25rem' }}>
            Legend
          </span>
          {Object.entries(STATUS_CONFIG).filter(([k]) => k !== 'not-needed').map(([key, sc]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
              <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                {sc.label}
              </span>
            </div>
          ))}
          {editMode && (
            <span style={{ fontSize: '0.6rem', color: '#a78bfa', marginLeft: 'auto', fontStyle: 'italic' }}>
              Click any tool to change its status
            </span>
          )}
        </motion.div>
      </motion.div>
    </Tooltip.Provider>
  );
}

// ─── Stat Pill ────────────────────────────────────────────────────────────────

function Stat({ value, label, color, bg, border }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.3rem 0.7rem',
      borderRadius: 20,
      background: bg,
      border: `1px solid ${border}`,
    }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color, letterSpacing: '-0.01em', lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>{label}</span>
    </div>
  );
}
