/**
 * Diagnostic v3 Constants — 6-Pillar RevOps Assessment
 *
 * Restructures from 4 technical layers to 6 business pillars with:
 * - 5-point scale (1-5) instead of 3-point (warning/careful/healthy)
 * - Per-department scoring (Marketing, Sales, CS, Partners)
 * - ~124 competency cells in the full matrix
 * - Three data sources: CRM API, discovery transcripts, consultant assessment
 */

// ── Scoring Scale ──

export const V3_STATUS = {
  1: 'Weak',
  2: 'Below Average',
  3: 'Average',
  4: 'Good',
  5: 'Best Practice',
};

export const V3_STATUS_COLORS = {
  1: '#f87171', // soft red
  2: '#fb923c', // soft orange
  3: '#fbbf24', // warm yellow
  4: '#4ade80', // soft green
  5: '#34d399', // emerald
};

// ── Weights ──

export const PILLAR_WEIGHTS = {
  planning: 0.15,
  people: 0.15,
  process: 0.25,
  systems: 0.20,
  reporting: 0.15,
  enablement: 0.10,
};

export const DEPT_WEIGHTS = {
  marketing: 1.0,
  sales: 1.0,
  cs: 1.0,
  partners: 0.5,
};

export const DEPARTMENTS = ['marketing', 'sales', 'cs', 'partners'];

export const PILLAR_ORDER = ['planning', 'people', 'process', 'systems', 'reporting', 'enablement'];

export const PILLAR_LABELS = {
  planning: 'Planning',
  people: 'People',
  process: 'Process',
  systems: 'Systems',
  reporting: 'Reporting',
  enablement: 'Enablement',
};

export const DEPT_LABELS = {
  marketing: 'Marketing',
  sales: 'Sales',
  cs: 'Customer Success',
  partners: 'Partners',
};

// ── Source Types ──

export const V3_SOURCE_TYPES = {
  API_ONLY: 'API_ONLY',
  API_PLUS: 'API_PLUS',
  INTAKE: 'INTAKE',
  TRANSCRIPT: 'TRANSCRIPT',
  TRANSCRIPT_CONSULTANT: 'TRANSCRIPT_CONSULTANT',
  CONSULTANT_ONLY: 'CONSULTANT_ONLY',
};

export const SOURCE_WEIGHTS = {
  API_ONLY: 1.0,
  INTAKE: 0.8,
  TRANSCRIPT_HIGH: 0.9,  // confidence >= 0.7
  TRANSCRIPT_MED: 0.6,   // confidence 0.5-0.7
  TRANSCRIPT_LOW: 0.3,   // confidence < 0.5
  CONSULTANT: 1.0,        // consultant overrides all
};

// ── Consultant Tier & Transcript Priority ──

export const CONSULTANT_TIERS = {
  REQUIRED: 'required',   // Consultant must score (no API signal)
  REVIEW: 'review',       // Show API score, allow confirm/override
  AUTO: 'auto',           // System-scored, read-only
};

export const TRANSCRIPT_PRIORITIES = {
  HIGH: 'high',     // Full rubric in prompt, always extract
  MEDIUM: 'medium', // Compressed rubric, only extract if strong evidence
};

// ── Competency Rubric ──
// Each competency: { id, name, pillar, departments, source, serviceIds, description }
// departments: which departments this applies to ('all' expands to all 4)

export const V3_COMPETENCIES = [
  // ══════════════════════════════════════════════
  // PILLAR 1: PLANNING (5 competencies)
  // ══════════════════════════════════════════════
  {
    id: 'PL-1',
    name: 'Operating plan with quarterly goals',
    pillar: 'planning',
    departments: 'all',
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['growth-model', 'monthly-quarterly-gtm-reporting-pack', 'executive-reporting-suite'],
    consultantTier: 'required',
    transcriptPriority: 'high',
    description: 'Existence and quality of a written operating plan with quarterly OKRs or goals for each GTM function.',
    rubric: {
      1: 'No operating plan exists; goals are ad-hoc or verbal.',
      2: 'Informal plan exists but not shared or tracked regularly.',
      3: 'Written plan with annual goals but limited quarterly detail.',
      4: 'Quarterly plans with clear goals shared across teams.',
      5: 'Best-practice: quarterly plans with cascading goals, tracked in system of record.',
    },
  },
  {
    id: 'PL-2',
    name: 'Capacity plan / headcount model',
    pillar: 'planning',
    departments: 'all',
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['quotas-and-target-setting', 'gtm-org-chart-roles-and-hiring-plan', 'growth-model'],
    consultantTier: 'required',
    transcriptPriority: 'high',
    description: 'Headcount planning tied to revenue targets with ramp assumptions and capacity modeling.',
    rubric: {
      1: 'No headcount planning; hiring is reactive.',
      2: 'Basic headcount budget exists but not tied to revenue model.',
      3: 'Headcount plan exists with some capacity assumptions.',
      4: 'Capacity model ties hiring to revenue targets with ramp.',
      5: 'Dynamic capacity model updated quarterly with scenario planning.',
    },
  },
  {
    id: 'PL-3',
    name: 'Budget allocation process',
    pillar: 'planning',
    departments: 'all',
    source: V3_SOURCE_TYPES.CONSULTANT_ONLY,
    serviceIds: ['growth-model'],
    consultantTier: 'required',
    transcriptPriority: null,
    description: 'Formal GTM budget allocation across departments with ROI tracking.',
    rubric: {
      1: 'No formal budget process; spending is unplanned.',
      2: 'Annual budget exists but not allocated by function or tracked.',
      3: 'Budget allocated by function with basic tracking.',
      4: 'Budget process with quarterly reviews and ROI analysis.',
      5: 'Zero-based budgeting with real-time spend tracking and ROI attribution.',
    },
  },
  {
    id: 'PL-4',
    name: 'OKR / KPI setting',
    pillar: 'planning',
    departments: 'all',
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['executive-reporting-suite', 'monthly-quarterly-gtm-reporting-pack'],
    consultantTier: 'required',
    transcriptPriority: 'medium',
    description: 'Structured OKR or KPI framework with clear ownership and measurement cadence.',
    rubric: {
      1: 'No defined KPIs or OKRs.',
      2: 'Some metrics tracked but no formal framework.',
      3: 'KPIs defined per function but not cascaded or regularly reviewed.',
      4: 'OKR/KPI framework with ownership and quarterly reviews.',
      5: 'Cascading OKRs from company to team to individual, tracked weekly.',
    },
  },
  {
    id: 'PL-5',
    name: 'Review cadence (QBR, WBR)',
    pillar: 'planning',
    departments: 'all',
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['monthly-quarterly-gtm-reporting-pack'],
    consultantTier: 'required',
    transcriptPriority: 'medium',
    description: 'Regular business review cadence at weekly, monthly, and quarterly levels.',
    rubric: {
      1: 'No regular review meetings.',
      2: 'Ad-hoc reviews when issues arise.',
      3: 'Monthly reviews exist but inconsistent.',
      4: 'Weekly and monthly reviews with structured agendas.',
      5: 'D/W/M/Q review cadence with templated agendas, action tracking, and QBR presentations.',
    },
  },

  // ══════════════════════════════════════════════
  // PILLAR 2: PEOPLE (6 competencies)
  // ══════════════════════════════════════════════
  {
    id: 'PE-1',
    name: 'Documented job descriptions',
    pillar: 'people',
    departments: 'all',
    source: V3_SOURCE_TYPES.CONSULTANT_ONLY,
    serviceIds: ['gtm-org-chart-roles-and-hiring-plan'],
    consultantTier: 'required',
    transcriptPriority: null,
    description: 'Written job descriptions for all GTM roles with clear responsibilities and success criteria.',
    rubric: {
      1: 'No job descriptions exist.',
      2: 'Some roles have outdated or generic descriptions.',
      3: 'Most roles have descriptions but not consistently updated.',
      4: 'All roles documented with KPIs and updated annually.',
      5: 'Comprehensive role profiles with career paths, competency models, and OKR alignment.',
    },
  },
  {
    id: 'PE-2',
    name: 'Structured interview process',
    pillar: 'people',
    departments: 'all',
    source: V3_SOURCE_TYPES.CONSULTANT_ONLY,
    serviceIds: ['gtm-org-chart-roles-and-hiring-plan'],
    consultantTier: 'required',
    transcriptPriority: null,
    description: 'Standardized hiring process with scorecards, panel interviews, and consistent evaluation.',
    rubric: {
      1: 'No structured hiring process.',
      2: 'Basic interview process but varies by hiring manager.',
      3: 'Consistent process with defined stages but no scorecards.',
      4: 'Structured process with scorecards and panel interviews.',
      5: 'Data-driven hiring with competency-based scorecards, debrief process, and quality-of-hire tracking.',
    },
  },
  {
    id: 'PE-3',
    name: 'Onboarding plan (30/60/90)',
    pillar: 'people',
    departments: 'all',
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['gtm-org-chart-roles-and-hiring-plan', 'sales-enablement-platform-implementation'],
    consultantTier: 'required',
    transcriptPriority: 'high',
    description: 'Documented 30/60/90-day onboarding plan for new GTM hires.',
    rubric: {
      1: 'No onboarding plan; sink or swim.',
      2: 'Informal buddy system or ad-hoc training.',
      3: 'Basic 30-day checklist exists.',
      4: '30/60/90 plan with milestones and manager checkpoints.',
      5: 'Comprehensive onboarding with certification, shadowing, ramp targets, and ongoing enablement.',
    },
  },
  {
    id: 'PE-4',
    name: 'Comp plan / commission structure',
    pillar: 'people',
    departments: ['sales', 'cs', 'partners'],
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['commission-plan-design-and-implementation', 'commission-tool-implementation'],
    consultantTier: 'required',
    transcriptPriority: 'high',
    description: 'Documented compensation plans with clear commission structures and accelerators.',
    rubric: {
      1: 'No formal comp plan or commission structure.',
      2: 'Basic commission exists but not documented or inconsistent.',
      3: 'Documented comp plan with standard commission rates.',
      4: 'Structured comp plans with accelerators, SPIFFs, and clear OTE.',
      5: 'Best-practice comp design with multi-component plans, benchmarked to market, and system-automated payouts.',
    },
  },
  {
    id: 'PE-5',
    name: 'Performance review cadence',
    pillar: 'people',
    departments: 'all',
    source: V3_SOURCE_TYPES.CONSULTANT_ONLY,
    serviceIds: ['gtm-org-chart-roles-and-hiring-plan'],
    consultantTier: 'required',
    transcriptPriority: null,
    description: 'Regular performance review process with clear evaluation criteria.',
    rubric: {
      1: 'No formal performance reviews.',
      2: 'Annual reviews only, inconsistent format.',
      3: 'Semi-annual reviews with basic template.',
      4: 'Quarterly reviews with 360 feedback and development plans.',
      5: 'Continuous performance management with weekly 1:1s, quarterly reviews, and career development frameworks.',
    },
  },
  {
    id: 'PE-6',
    name: 'Org structure clarity',
    pillar: 'people',
    departments: 'all',
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['gtm-org-chart-roles-and-hiring-plan'],
    consultantTier: 'review',
    transcriptPriority: null,
    description: 'Clear organizational structure with defined teams, roles, and reporting lines visible in CRM.',
    rubric: {
      1: 'No clear org structure; roles are undefined.',
      2: 'Basic structure exists but not reflected in systems.',
      3: 'Teams defined in CRM but incomplete coverage.',
      4: 'Full org structure in CRM with clear team assignments.',
      5: 'Dynamic org structure with role-based permissions, territory alignment, and capacity-based assignment.',
    },
  },

  // ══════════════════════════════════════════════
  // PILLAR 3: PROCESS (10 competencies)
  // ══════════════════════════════════════════════
  {
    id: 'PR-1',
    name: 'Lead lifecycle definition',
    pillar: 'process',
    departments: ['marketing'],
    source: V3_SOURCE_TYPES.API_PLUS,
    v2ItemId: 'F3',
    serviceIds: ['lead-lifecycle', 'gtm-lifecycle', 'lead-routing', 'speed-to-lead'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Defined lead stages with automated transitions from MQL through to SQL.',
    rubric: {
      1: 'No lead lifecycle defined.',
      2: 'Basic lifecycle exists but not automated.',
      3: 'Lead stages defined with some automation.',
      4: 'Full lifecycle with automated transitions and SLA tracking.',
      5: 'Dynamic lifecycle with scoring-driven transitions, SLA alerts, and recycling workflows.',
    },
  },
  {
    id: 'PR-2',
    name: 'Sales lifecycle / pipeline design',
    pillar: 'process',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.API_PLUS,
    v2ItemId: 'F2',
    serviceIds: ['sales-lifecycle', 'sales-qualification-methodology', 'forecasting-process-implementation'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Deal pipeline with well-defined stages, exit criteria, and probability mapping.',
    rubric: {
      1: 'No defined sales pipeline.',
      2: 'Pipeline exists but stages are unclear or too many/few.',
      3: 'Pipeline with 5-8 stages and basic probabilities.',
      4: 'Pipeline with exit criteria, required fields per stage, and accurate probabilities.',
      5: 'Best-practice pipeline with methodology-aligned stages, automated hygiene, and conversion analytics.',
    },
  },
  {
    id: 'PR-3',
    name: 'Customer lifecycle definition',
    pillar: 'process',
    departments: ['cs'],
    source: V3_SOURCE_TYPES.API_PLUS,
    v2ItemId: 'M6',
    serviceIds: ['customer-lifecycle', 'onboarding-and-process-improvement', 'renewal-management', 'customer-health-model'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Post-sale customer journey with defined stages from onboarding through renewal and expansion.',
    rubric: {
      1: 'No customer lifecycle defined.',
      2: 'Informal process; handoffs happen ad-hoc.',
      3: 'Customer stages defined but not consistently followed.',
      4: 'Full lifecycle with automated stage transitions and health scoring.',
      5: 'Data-driven lifecycle with predictive health, automated playbooks, and expansion triggers.',
    },
  },
  {
    id: 'PR-4',
    name: 'Partner lifecycle definition',
    pillar: 'process',
    departments: ['partners'],
    source: V3_SOURCE_TYPES.API_PLUS,
    v2ItemId: 'M7',
    serviceIds: ['partnership-success-platform-implementation'],
    consultantTier: 'required',
    transcriptPriority: null,
    description: 'Structured partner program with defined tiers, deal registration, and co-selling processes.',
    rubric: {
      1: 'No partner program or process.',
      2: 'Informal partner relationships; no tracking.',
      3: 'Basic partner pipeline exists with deal registration.',
      4: 'Structured program with tiers, co-selling process, and reporting.',
      5: 'Best-practice partner ecosystem with automated deal reg, MDF, co-marketing, and attribution.',
    },
  },
  {
    id: 'PR-5',
    name: 'Cross-functional handoffs',
    pillar: 'process',
    departments: 'all',
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['marketing-to-sales-handoff-and-sla-tracking', 'sales-to-cs-handoff-process-implementation', 'lead-routing'],
    consultantTier: 'review',
    transcriptPriority: null,
    description: 'Defined handoff processes between Marketing→Sales and Sales→CS with SLA tracking.',
    rubric: {
      1: 'No defined handoff processes.',
      2: 'Informal handoffs; dropped leads are common.',
      3: 'Basic handoff process exists but not automated.',
      4: 'Automated handoffs with SLA tracking and notifications.',
      5: 'Seamless handoffs with context transfer, SLA dashboards, and feedback loops.',
    },
  },
  {
    id: 'PR-6',
    name: 'Sales methodology (MEDDIC etc)',
    pillar: 'process',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.API_PLUS,
    v2ItemId: 'M3',
    serviceIds: ['sales-qualification-methodology', 'conversation-intelligence-platform-implementation'],
    consultantTier: 'review',
    transcriptPriority: null,
    description: 'Adopted sales qualification methodology with CRM enforcement and training.',
    rubric: {
      1: 'No sales methodology.',
      2: 'Methodology chosen but not enforced in CRM.',
      3: 'Methodology fields in CRM but inconsistent usage.',
      4: 'Methodology enforced with required fields and manager coaching.',
      5: 'Methodology embedded in deal stages, required fields, coaching cadences, and win rate tracking.',
    },
  },
  {
    id: 'PR-7',
    name: 'Territory / account assignment',
    pillar: 'process',
    departments: ['sales', 'partners'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['sales-territory-design', 'lead-routing', 'rules-of-engagement-design'],
    consultantTier: 'review',
    transcriptPriority: null,
    description: 'Structured territory design with automated account assignment and rules of engagement.',
    rubric: {
      1: 'No territory design; assignments are ad-hoc.',
      2: 'Basic territory exists but manual assignment.',
      3: 'Territories defined with some automation.',
      4: 'Automated territory assignment with round-robin and capacity-based routing.',
      5: 'Dynamic territories with automated rebalancing, ROE enforcement, and coverage analytics.',
    },
  },
  {
    id: 'PR-8',
    name: 'ABM / target account process',
    pillar: 'process',
    departments: ['marketing', 'sales'],
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['abm-abs-process-and-system', 'market-map', 'automated-outbound-process'],
    consultantTier: 'required',
    transcriptPriority: 'high',
    description: 'Account-based marketing and selling process with target account selection and orchestration.',
    rubric: {
      1: 'No ABM process.',
      2: 'Target account list exists but no coordinated approach.',
      3: 'Basic ABM with account selection and some personalization.',
      4: 'Multi-channel ABM with sales alignment and engagement scoring.',
      5: 'Full ABM/ABS with intent data, dynamic account scoring, orchestrated plays, and attribution.',
    },
  },
  {
    id: 'PR-9',
    name: 'Attribution model',
    pillar: 'process',
    departments: ['marketing'],
    source: V3_SOURCE_TYPES.API_PLUS,
    v2ItemId: 'M4',
    serviceIds: ['lead-and-opportunity-attribution'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Marketing attribution model tracking lead source and campaign influence on pipeline.',
    rubric: {
      1: 'No attribution tracking.',
      2: 'Basic lead source field exists but not maintained.',
      3: 'First-touch or last-touch attribution with basic reporting.',
      4: 'Multi-touch attribution with campaign influence tracking.',
      5: 'Full-funnel attribution with revenue attribution, channel ROI, and data-driven budget allocation.',
    },
  },
  {
    id: 'PR-10',
    name: 'Pipeline management process',
    pillar: 'process',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['forecasting-process-implementation', 'revenue-intelligence-process', 'opportunity-management-ux-improvements'],
    consultantTier: 'review',
    transcriptPriority: null,
    description: 'Structured pipeline management with regular reviews, hygiene enforcement, and velocity tracking.',
    rubric: {
      1: 'No pipeline management process.',
      2: 'Ad-hoc pipeline reviews with no hygiene.',
      3: 'Weekly pipeline reviews with basic metrics.',
      4: 'Structured reviews with aging rules, velocity tracking, and manager coaching.',
      5: 'AI-assisted pipeline management with deal scoring, risk alerts, and automated hygiene enforcement.',
    },
  },

  // ══════════════════════════════════════════════
  // PILLAR 4: SYSTEMS (7 competencies)
  // ══════════════════════════════════════════════
  {
    id: 'SY-1',
    name: 'CRM configuration & optimization',
    pillar: 'systems',
    departments: 'all',
    source: V3_SOURCE_TYPES.API_ONLY,
    v2ItemIds: ['F1', 'F4', 'F5'],
    serviceIds: ['hubspot-impl', 'salesforce-impl', 'foundational-automations-and-reporting-logic', 'crm-deduplication', 'activity-capture'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'CRM setup quality including data model, automation, and team structure.',
    rubric: {
      1: 'CRM is out-of-box with no customization.',
      2: 'Basic customization but significant gaps.',
      3: 'Moderate customization with core automations.',
      4: 'Well-configured CRM with comprehensive automations.',
      5: 'Optimized CRM with advanced automation, data quality controls, and governance.',
    },
  },
  {
    id: 'SY-2',
    name: 'Marketing automation platform',
    pillar: 'systems',
    departments: ['marketing'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['marketing-automation-platform-implementation'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Marketing automation platform deployed and actively used for campaigns and nurture.',
    rubric: {
      1: 'No marketing automation platform.',
      2: 'Platform exists but barely used.',
      3: 'Platform used for basic email and forms.',
      4: 'Full-featured MAP with nurture, scoring, and segmentation.',
      5: 'Advanced MAP with behavioral triggers, dynamic content, and revenue attribution.',
    },
  },
  {
    id: 'SY-3',
    name: 'Sales engagement platform',
    pillar: 'systems',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['sales-engagement-platform', 'automated-outbound-process'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Sales engagement tool (Outreach, Salesloft, etc.) deployed for sequences and cadences.',
    rubric: {
      1: 'No sales engagement platform.',
      2: 'Platform exists but low adoption.',
      3: 'Platform used for basic sequences.',
      4: 'Full adoption with templates, analytics, and CRM sync.',
      5: 'Optimized with A/B testing, AI-assisted messaging, and pipeline attribution.',
    },
  },
  {
    id: 'SY-4',
    name: 'CS / support platform',
    pillar: 'systems',
    departments: ['cs'],
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['customer-success-platform-implementation', 'support-system-implementation'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Customer success and/or support platform deployed with health scoring and automation.',
    rubric: {
      1: 'No CS or support platform.',
      2: 'Basic ticketing system only.',
      3: 'CS platform deployed with some automation.',
      4: 'Full CS platform with health scoring, playbooks, and renewal tracking.',
      5: 'Advanced CS stack with predictive health, automated expansion triggers, and unified support.',
    },
  },
  {
    id: 'SY-5',
    name: 'Partner management platform',
    pillar: 'systems',
    departments: ['partners'],
    source: V3_SOURCE_TYPES.INTAKE,
    serviceIds: ['partnership-success-platform-implementation'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Partner relationship management (PRM) tool for deal registration and partner portal.',
    rubric: {
      1: 'No partner management system.',
      2: 'Partners tracked in spreadsheets.',
      3: 'Basic CRM tracking for partner deals.',
      4: 'PRM platform with deal registration and portal.',
      5: 'Full PRM with partner portal, co-selling tools, MDF management, and attribution.',
    },
  },
  {
    id: 'SY-6',
    name: 'Intelligence tools (enrichment, CI)',
    pillar: 'systems',
    departments: ['marketing', 'sales'],
    source: V3_SOURCE_TYPES.API_ONLY,
    v2ItemId: 'F6',
    serviceIds: ['automated-inbound-data-enrichment', 'clay-impl', 'zoominfo-impl', '6sense-impl'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Data enrichment and competitive intelligence tools detected and integrated.',
    rubric: {
      1: 'No enrichment or intelligence tools.',
      2: 'Manual data entry; no enrichment automation.',
      3: 'One enrichment tool with basic coverage.',
      4: 'Multi-source enrichment with CI tracking.',
      5: 'Automated enrichment pipeline with real-time triggers, waterfall logic, and intent data.',
    },
  },
  {
    id: 'SY-7',
    name: 'Integration / automation health',
    pillar: 'systems',
    departments: 'all',
    source: V3_SOURCE_TYPES.API_ONLY,
    v2ItemId: 'P5',
    serviceIds: ['crm-erp-integration'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Health of system integrations including connected apps, data flows, and error monitoring.',
    rubric: {
      1: 'No integrations; all manual data transfer.',
      2: 'Basic integrations with frequent errors or manual workarounds.',
      3: 'Key integrations working but no monitoring.',
      4: 'Robust integrations with error handling and monitoring.',
      5: 'Enterprise integration architecture with iPaaS, error alerts, and data governance.',
    },
  },

  // ══════════════════════════════════════════════
  // PILLAR 5: REPORTING (6 competencies)
  // ══════════════════════════════════════════════
  {
    id: 'RP-1',
    name: 'Executive dashboards',
    pillar: 'reporting',
    departments: 'all',
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['executive-reporting-suite', 'arr-reporting'],
    consultantTier: 'review',
    transcriptPriority: null,
    description: 'Executive-level dashboards with board-ready metrics and KPI tracking.',
    rubric: {
      1: 'No executive dashboards.',
      2: 'Basic CRM reports but not dashboarded.',
      3: 'Some dashboards exist but not trusted or regularly used.',
      4: 'Executive dashboard suite with key GTM metrics.',
      5: 'Board-ready reporting with real-time dashboards, automated distribution, and drill-down.',
    },
  },
  {
    id: 'RP-2',
    name: 'Manager dashboards',
    pillar: 'reporting',
    departments: 'all',
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['monthly-quarterly-gtm-reporting-pack'],
    consultantTier: 'required',
    transcriptPriority: 'medium',
    description: 'Manager-level dashboards for team performance, pipeline, and activity monitoring.',
    rubric: {
      1: 'No manager dashboards.',
      2: 'Managers rely on ad-hoc spreadsheets.',
      3: 'Basic CRM dashboards for managers.',
      4: 'Comprehensive manager dashboards with team and individual views.',
      5: 'AI-assisted manager dashboards with coaching insights, anomaly detection, and goal tracking.',
    },
  },
  {
    id: 'RP-3',
    name: 'IC dashboards (daily use)',
    pillar: 'reporting',
    departments: ['marketing', 'sales', 'cs'],
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['monthly-quarterly-gtm-reporting-pack'],
    consultantTier: 'required',
    transcriptPriority: 'medium',
    description: 'Individual contributor dashboards and views used daily for task management and performance.',
    rubric: {
      1: 'No IC-facing dashboards or views.',
      2: 'Default CRM views only.',
      3: 'Some custom views but inconsistent.',
      4: 'Personalized IC dashboards with tasks, pipeline, and activity views.',
      5: 'Optimized IC experience with prioritized task lists, deal insights, and guided workflows.',
    },
  },
  {
    id: 'RP-4',
    name: 'Cadence reporting (D/W/M/Q/A)',
    pillar: 'reporting',
    departments: 'all',
    source: V3_SOURCE_TYPES.TRANSCRIPT,
    serviceIds: ['monthly-quarterly-gtm-reporting-pack'],
    consultantTier: 'required',
    transcriptPriority: 'medium',
    description: 'Regular reporting cadence with automated report delivery at daily, weekly, monthly, quarterly, and annual intervals.',
    rubric: {
      1: 'No regular reporting cadence.',
      2: 'Ad-hoc reporting when requested.',
      3: 'Monthly reporting exists but manual.',
      4: 'W/M/Q reporting with some automation.',
      5: 'Full D/W/M/Q/A cadence with automated delivery, templated formats, and action tracking.',
    },
  },
  {
    id: 'RP-5',
    name: 'Revenue metrics (Power 10)',
    pillar: 'reporting',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.INTAKE,
    v2ItemId: 'R2',
    serviceIds: ['arr-reporting', 'executive-reporting-suite'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Ability to report on the 10 key revenue metrics (pipeline, bookings, retention, etc.) from CRM.',
    rubric: {
      1: 'Cannot report on basic revenue metrics.',
      2: 'Can report 1-3 metrics manually.',
      3: 'Can report 4-6 metrics with some automation.',
      4: 'Can report 7-9 metrics with automated dashboards.',
      5: 'All 10 Power Metrics automated with trend analysis and benchmarking.',
    },
  },
  {
    id: 'RP-6',
    name: 'Forecasting methodology',
    pillar: 'reporting',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.INTAKE,
    v2ItemId: 'R3',
    serviceIds: ['forecasting-process-implementation', 'growth-model', 'revenue-intelligence-process'],
    consultantTier: 'auto',
    transcriptPriority: null,
    description: 'Structured forecasting methodology with commit categories, weighted pipeline, and accuracy tracking.',
    rubric: {
      1: 'No forecasting methodology.',
      2: 'Gut-feel forecasting only.',
      3: 'Basic weighted pipeline forecasting.',
      4: 'Structured forecasting with commit/best-case/pipeline categories.',
      5: 'Multi-method forecasting with AI-assisted predictions, accuracy tracking, and scenario modeling.',
    },
  },

  // ══════════════════════════════════════════════
  // PILLAR 6: ENABLEMENT (5 competencies)
  // ══════════════════════════════════════════════
  {
    id: 'EN-1',
    name: 'ICP content coverage',
    pillar: 'enablement',
    departments: ['marketing', 'sales', 'partners'],
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['sales-enablement-platform-implementation', 'market-map'],
    consultantTier: 'required',
    transcriptPriority: 'high',
    description: 'Content library covering ICP personas, industries, and buying stages.',
    rubric: {
      1: 'No sales or marketing content library.',
      2: 'Some content exists but scattered and outdated.',
      3: 'Content covers key personas but gaps in buying stages.',
      4: 'Comprehensive content mapped to personas and buying stages.',
      5: 'Content factory with persona x stage x industry coverage, usage analytics, and regular refresh.',
    },
  },
  {
    id: 'EN-2',
    name: 'Content accessible in single system',
    pillar: 'enablement',
    departments: 'all',
    source: V3_SOURCE_TYPES.API_PLUS,
    serviceIds: ['sales-enablement-platform-implementation'],
    consultantTier: 'required',
    transcriptPriority: 'medium',
    description: 'All enablement content centralized in a searchable system accessible to the field.',
    rubric: {
      1: 'Content scattered across email, drives, and Slack.',
      2: 'Some central repository but poor adoption.',
      3: 'Central system exists but not all content is there.',
      4: 'Enablement platform deployed with good adoption.',
      5: 'AI-powered enablement platform with content recommendations, analytics, and CRM integration.',
    },
  },
  {
    id: 'EN-3',
    name: 'Sales coaching program',
    pillar: 'enablement',
    departments: ['sales'],
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['conversation-intelligence-platform-implementation', 'sales-enablement-platform-implementation'],
    consultantTier: 'required',
    transcriptPriority: 'high',
    description: 'Structured coaching program using call recordings, deal reviews, and skill development.',
    rubric: {
      1: 'No coaching program.',
      2: 'Ad-hoc coaching by individual managers.',
      3: 'Some coaching exists but inconsistent.',
      4: 'Structured coaching with conversation intelligence and deal reviews.',
      5: 'Best-practice coaching with CI platform, scorecards, peer learning, and impact measurement.',
    },
  },
  {
    id: 'EN-4',
    name: 'Training / certification',
    pillar: 'enablement',
    departments: 'all',
    source: V3_SOURCE_TYPES.CONSULTANT_ONLY,
    serviceIds: ['sales-enablement-platform-implementation'],
    consultantTier: 'required',
    transcriptPriority: 'medium',
    description: 'Formal training and certification programs for GTM roles.',
    rubric: {
      1: 'No formal training programs.',
      2: 'One-time onboarding training only.',
      3: 'Some ongoing training but not structured.',
      4: 'Regular training with skill assessments.',
      5: 'Certification programs with LMS, competency tracking, and continuous learning paths.',
    },
  },
  {
    id: 'EN-5',
    name: 'Playbook documentation',
    pillar: 'enablement',
    departments: 'all',
    source: V3_SOURCE_TYPES.TRANSCRIPT_CONSULTANT,
    serviceIds: ['sales-enablement-platform-implementation', 'conversation-intelligence-platform-implementation'],
    consultantTier: 'required',
    transcriptPriority: 'high',
    description: 'Documented playbooks for key GTM motions (inbound, outbound, expansion, etc.).',
    rubric: {
      1: 'No documented playbooks.',
      2: 'Tribal knowledge only; nothing written down.',
      3: 'Some playbooks exist but incomplete or outdated.',
      4: 'Playbooks for key motions with regular updates.',
      5: 'Comprehensive playbook library with branching scenarios, embedded in workflows, and A/B tested.',
    },
  },
];

// ── Phase Assignment Constants ──

export const ROADMAP_PHASES = {
  FOUNDATION: { order: 1, name: 'Foundation', description: 'Core systems and data infrastructure' },
  BUILD: { order: 2, name: 'Build', description: 'Process design and implementation' },
  OPTIMIZE: { order: 3, name: 'Optimize', description: 'Reporting, enablement, and refinement' },
  SCALE: { order: 4, name: 'Scale', description: 'Advanced optimization and expansion' },
};

// Map pillars to their default phase
export const PILLAR_DEFAULT_PHASE = {
  systems: 'FOUNDATION',
  process: 'BUILD',
  planning: 'BUILD',
  people: 'BUILD',
  reporting: 'OPTIMIZE',
  enablement: 'OPTIMIZE',
};

// ── Helper Functions ──

/**
 * Expand 'all' departments to the full list.
 */
export function expandDepartments(deptSpec) {
  if (deptSpec === 'all') return [...DEPARTMENTS];
  if (Array.isArray(deptSpec)) return deptSpec;
  return [deptSpec];
}

/**
 * Get competency by ID.
 */
export function getCompetencyById(id) {
  return V3_COMPETENCIES.find((c) => c.id === id);
}

/**
 * Get all competencies for a pillar.
 */
export function getCompetenciesByPillar(pillar) {
  return V3_COMPETENCIES.filter((c) => c.pillar === pillar);
}

/**
 * Get all competencies applicable to a department.
 */
export function getCompetenciesByDepartment(dept) {
  return V3_COMPETENCIES.filter((c) => {
    const depts = expandDepartments(c.departments);
    return depts.includes(dept);
  });
}

/**
 * Build the full competency matrix: { [pillar]: { [dept]: competencyId[] } }
 */
export function buildCompetencyMatrix() {
  const matrix = {};
  for (const pillar of PILLAR_ORDER) {
    matrix[pillar] = {};
    for (const dept of DEPARTMENTS) {
      matrix[pillar][dept] = V3_COMPETENCIES
        .filter((c) => c.pillar === pillar && expandDepartments(c.departments).includes(dept))
        .map((c) => c.id);
    }
  }
  return matrix;
}

// ── Tier & Transcript Helpers ──

/**
 * Get competencies by consultant tier.
 */
export function getCompetenciesByTier(tier) {
  return V3_COMPETENCIES.filter((c) => c.consultantTier === tier);
}

/**
 * Get competencies by transcript priority.
 */
export function getCompetenciesByTranscriptPriority(priority) {
  return V3_COMPETENCIES.filter((c) => c.transcriptPriority === priority);
}

/**
 * Get all transcript-eligible competencies (high + medium).
 */
export function getTranscriptCompetencies() {
  return V3_COMPETENCIES.filter((c) => c.transcriptPriority !== null);
}

/**
 * Total expected cells by tier (for progress calculation).
 */
export function countCellsByTier(tier) {
  const comps = getCompetenciesByTier(tier);
  let total = 0;
  for (const c of comps) {
    total += expandDepartments(c.departments).length;
  }
  return total;
}
