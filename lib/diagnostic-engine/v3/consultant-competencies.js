/**
 * Consultant Competencies V2 — Consolidated Assessment Model
 *
 * 14 competencies (down from 21 required in V1) with:
 * - org-level vs dept-specific scoping
 * - CRM-specific check instructions (Salesforce / HubSpot)
 * - Signal-to-score mapping for pre-population
 * - Merge map to fan out V2 scores to original V1 competency IDs
 * - Discovery call questions per competency
 */

// ── Merge Map: V2 ID → V1 IDs ──

export const COMPETENCY_MERGE_MAP = {
  'PL-A': ['PL-1', 'PL-4'],
  'PL-B': ['PL-2'],
  'PL-C': ['PL-3'],
  'PL-D': ['PL-5'],
  'PE-A': ['PE-1', 'PE-2'],
  'PE-B': ['PE-3'],
  'PE-C': ['PE-4'],
  'PE-D': ['PE-5'],
  'PR-A': ['PR-4'],
  'PR-B': ['PR-8'],
  'RP-A': ['RP-2', 'RP-3'],
  'RP-B': ['RP-4'],
  'EN-A': ['EN-1', 'EN-2', 'EN-5'],
  'EN-B': ['EN-3', 'EN-4'],
};

// ── Helper: Package Detection ──

function hasPackage(metadata, patterns) {
  const packages = metadata?.installedPackages || [];
  return packages.some((p) => {
    const name = (p.SubscriberPackage?.Name || p.Name || '').toLowerCase();
    return patterns.some((pat) => name.includes(pat.toLowerCase()));
  });
}

function getPackageNames(metadata, patterns) {
  const packages = metadata?.installedPackages || [];
  return packages
    .filter((p) => {
      const name = (p.SubscriberPackage?.Name || p.Name || '').toLowerCase();
      return patterns.some((pat) => name.includes(pat.toLowerCase()));
    })
    .map((p) => p.SubscriberPackage?.Name || p.Name);
}

function countByPattern(items, field, patterns) {
  if (!items || !Array.isArray(items)) return 0;
  const re = new RegExp(patterns.join('|'), 'i');
  return items.filter((item) => re.test(item[field] || '')).length;
}

// ── V2 Competencies ──

export const V2_COMPETENCIES = [
  // ══════════════════════════════════════
  // PLANNING
  // ══════════════════════════════════════
  {
    id: 'PL-A',
    name: 'Strategic planning & goals',
    pillar: 'planning',
    scope: 'org',
    departments: 'all',
    mergesFrom: ['PL-1', 'PL-4'],
    rubric: {
      1: 'No operating plan or goal framework exists; targets are ad-hoc or verbal.',
      3: 'Written plan with annual goals but limited quarterly detail; KPIs defined per function but not cascaded.',
      5: 'Quarterly plans with cascading OKRs from company to team to individual, tracked in system of record.',
    },
    crmChecks: {
      salesforce: [
        'Reports tab → search "quarterly", "OKR", or "goal"',
        'Dashboard folders → look for "Executive" or "Leadership" folders',
        'Opportunity fields → check for Goal or Target custom fields',
        'Scheduled Reports (CronTrigger) → recurring delivery of goal-tracking reports?',
      ],
      hubspot: [
        'Check Goals tool usage under Reports → Goals',
        'Search Reports for "quarterly" or "OKR"',
        'Dashboard creation dates and sharing — are they actively maintained?',
        'Check for recurring report emails in Settings → Notifications',
      ],
    },
    discoveryQuestions: [
      'How do you set annual and quarterly targets? Who\'s involved in that process?',
      'Is there a written operating plan? Can you share it or describe its structure?',
      'How do KPIs cascade from company goals down to individual contributors?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      let score = null;

      const scheduledReports = metadata?.reportSchedules?.length || 0;
      const dashFolders = metadata?.dashboards || [];
      const execDashboards = countByPattern(dashFolders, 'FolderName', ['executive', 'leadership', 'strategy', 'goal', 'okr']);

      if (scheduledReports > 0) evidence.push(`${scheduledReports} scheduled reports found`);
      if (execDashboards > 0) evidence.push(`${execDashboards} executive/goal dashboards found`);

      if (scheduledReports >= 3 && execDashboards >= 3) score = 4;
      else if (scheduledReports >= 1 || execDashboards >= 1) score = 3;
      else if ((metadata?.reports?.length || 0) > 50) score = 2;

      return evidence.length > 0 ? { score, confidence: score ? 'medium' : 'low', evidence } : null;
    },
  },

  {
    id: 'PL-B',
    name: 'Capacity & headcount model',
    pillar: 'planning',
    scope: 'org',
    departments: 'all',
    mergesFrom: ['PL-2'],
    rubric: {
      1: 'No headcount planning; hiring is reactive.',
      3: 'Headcount plan exists with some capacity assumptions.',
      5: 'Dynamic capacity model updated quarterly with scenario planning and ramp assumptions.',
    },
    crmChecks: {
      salesforce: [
        'User list → count active users by Role',
        'UserRole hierarchy → how deep? Does it reflect actual team structure?',
        'Territory2Model → is territory management active?',
        'Compare user count to pipeline — reasonable ratio?',
      ],
      hubspot: [
        'Check Teams setup under Settings → Users & Teams',
        'Count users vs pipeline volume',
        'Check for capacity-related custom properties on deals',
      ],
    },
    discoveryQuestions: [
      'How do you decide when to hire new reps? Is there a capacity model?',
      'What ramp time do you assume for new hires?',
      'How do you tie headcount planning to revenue targets?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const users = metadata?.users?.length || 0;
      const roles = metadata?.roles?.length || 0;
      const territories = metadata?.territories?.length || 0;

      if (users > 0) evidence.push(`${users} active users`);
      if (roles > 3) evidence.push(`${roles} roles in hierarchy`);
      if (territories > 0) evidence.push('Territory management active');

      if (territories > 0 && roles > 5) return { score: 4, confidence: 'medium', evidence };
      if (roles > 3) return { score: 3, confidence: 'low', evidence };
      return evidence.length > 0 ? { score: null, confidence: 'low', evidence } : null;
    },
  },

  {
    id: 'PL-C',
    name: 'Budget allocation',
    pillar: 'planning',
    scope: 'org',
    departments: 'all',
    mergesFrom: ['PL-3'],
    rubric: {
      1: 'No formal budget process; spending is unplanned.',
      3: 'Budget allocated by function with basic tracking.',
      5: 'Zero-based budgeting with real-time spend tracking and ROI attribution.',
    },
    crmChecks: {
      salesforce: [
        'Reports → search "budget", "ROI", "spend", "cost"',
        'Campaign fields → check for BudgetedCost, ActualCost fields',
        'Check if Campaign Influence is enabled (Setup → Campaign Influence)',
        'Look for financial report folders',
      ],
      hubspot: [
        'Check Campaign tool for budget tracking',
        'Look for ad spend integrations (Google Ads, LinkedIn, etc.)',
        'Search Reports for "budget" or "ROI"',
      ],
    },
    discoveryQuestions: [
      'How do you allocate budget across marketing, sales, and CS?',
      'Do you track ROI by channel or campaign?',
      'How often is budget reviewed and adjusted?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const campaigns = metadata?.campaigns || [];
      const hasBudgetCampaigns = campaigns.some((c) =>
        c.BudgetedCost || c.ActualCost || c.NumberOfOpportunities > 0
      );
      const budgetReports = countByPattern(metadata?.reports || [], 'Name', ['budget', 'roi', 'spend', 'cost']);

      if (hasBudgetCampaigns) evidence.push('Campaigns with budget/cost data found');
      if (budgetReports > 0) evidence.push(`${budgetReports} budget/ROI reports found`);

      if (hasBudgetCampaigns && budgetReports > 0) return { score: 3, confidence: 'medium', evidence };
      if (evidence.length > 0) return { score: 2, confidence: 'low', evidence };
      return null;
    },
  },

  {
    id: 'PL-D',
    name: 'Review cadence (QBR/WBR)',
    pillar: 'planning',
    scope: 'org',
    departments: 'all',
    mergesFrom: ['PL-5'],
    rubric: {
      1: 'No regular review meetings.',
      3: 'Monthly reviews exist but inconsistent.',
      5: 'D/W/M/Q review cadence with templated agendas, action tracking, and QBR presentations.',
    },
    crmChecks: {
      salesforce: [
        'CronTrigger → count scheduled reports, check frequency patterns (daily/weekly/monthly)',
        'Events → search for recurring events with "review", "QBR", "WBR", "pipeline" subjects',
        'Dashboard folders → look for "Weekly", "Monthly", "QBR" naming',
      ],
      hubspot: [
        'Check for recurring meeting activities with review-related titles',
        'Look at scheduled report emails and their cadence',
        'Search Dashboard names for "QBR", "WBR", "Weekly"',
      ],
    },
    discoveryQuestions: [
      'Can you walk me through your last QBR — what was on the agenda?',
      'What recurring meetings does your sales team have (daily standups, weekly pipeline, monthly reviews)?',
      'How do you track action items coming out of reviews?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const scheduled = metadata?.reportSchedules?.length || 0;
      const events = metadata?.eventPatterns?.length || 0;
      const reviewDashboards = countByPattern(metadata?.dashboards || [], 'Title', ['weekly', 'monthly', 'qbr', 'wbr', 'review', 'pipeline']);

      if (scheduled > 0) evidence.push(`${scheduled} scheduled report deliveries`);
      if (events > 0) evidence.push(`${events} recurring events found`);
      if (reviewDashboards > 0) evidence.push(`${reviewDashboards} review-related dashboards`);

      if (scheduled >= 3 && reviewDashboards >= 2) return { score: 4, confidence: 'medium', evidence };
      if (scheduled >= 1 || reviewDashboards >= 1) return { score: 3, confidence: 'low', evidence };
      return evidence.length > 0 ? { score: null, confidence: 'low', evidence } : null;
    },
  },

  // ══════════════════════════════════════
  // PEOPLE
  // ══════════════════════════════════════
  {
    id: 'PE-A',
    name: 'Hiring maturity',
    pillar: 'people',
    scope: 'org',
    departments: 'all',
    mergesFrom: ['PE-1', 'PE-2'],
    rubric: {
      1: 'No job descriptions or structured hiring process; hiring is ad-hoc.',
      3: 'Most roles documented; consistent interview process with defined stages but no scorecards.',
      5: 'Comprehensive role profiles with career paths, competency-based scorecards, and quality-of-hire tracking.',
    },
    crmChecks: {
      salesforce: [
        'Profile names → beyond "System Administrator" and "Standard User"? Structured naming suggests role maturity',
        'Role hierarchy → depth and structure. Flat hierarchy = immature org design',
        'Permission Sets → custom sets suggest intentional role design',
      ],
      hubspot: [
        'Teams setup → structured team hierarchy?',
        'User permission structure — custom permission sets?',
        'Role-based views and filtered dashboards suggest role maturity',
      ],
    },
    discoveryQuestions: [
      'What does your hiring process look like for a new sales rep? Is there a scorecard?',
      'Are job descriptions documented and up to date?',
      'How do you evaluate candidates consistently across hiring managers?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const profiles = metadata?.profiles?.length || 0;
      const roles = metadata?.roles?.length || 0;
      const permSets = metadata?.permissionSets?.length || 0;

      if (profiles > 5) evidence.push(`${profiles} profiles (beyond default)`);
      if (roles > 5) evidence.push(`${roles} roles in hierarchy`);
      if (permSets > 10) evidence.push(`${permSets} custom permission sets`);

      if (profiles > 10 && roles > 8) return { score: 4, confidence: 'low', evidence };
      if (profiles > 5 || roles > 5) return { score: 3, confidence: 'low', evidence };
      return evidence.length > 0 ? { score: null, confidence: 'low', evidence } : null;
    },
  },

  {
    id: 'PE-B',
    name: 'Onboarding (30/60/90)',
    pillar: 'people',
    scope: 'org',
    departments: 'all',
    mergesFrom: ['PE-3'],
    rubric: {
      1: 'No onboarding plan; sink or swim.',
      3: 'Basic 30-day checklist exists.',
      5: 'Comprehensive onboarding with certification, shadowing, ramp targets, and ongoing enablement.',
    },
    crmChecks: {
      salesforce: [
        'ContentVersion → search titles for "onboarding", "new hire", "ramp", "30-60-90"',
        'Flows → look for triggers on new User creation',
        'KnowledgeArticleVersion → search for onboarding articles',
        'Task templates → check for onboarding task creation',
      ],
      hubspot: [
        'Knowledge Base → search for onboarding articles',
        'Sequences → look for onboarding-tagged sequences',
        'Playbooks → check for onboarding playbooks',
      ],
    },
    discoveryQuestions: [
      'What does the first 90 days look like for a new hire?',
      'Is there a documented onboarding plan? What milestones do you track?',
      'How long does it take a new rep to reach full productivity?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const content = metadata?.contentVersions || [];
      const knowledge = metadata?.knowledgeArticles || [];
      const onboardingContent = countByPattern(content, 'Title', ['onboarding', 'new hire', 'ramp', '30.60.90']);
      const onboardingKB = countByPattern(knowledge, 'Title', ['onboarding', 'new hire', 'ramp']);

      if (onboardingContent > 0) evidence.push(`${onboardingContent} onboarding documents found`);
      if (onboardingKB > 0) evidence.push(`${onboardingKB} knowledge articles on onboarding`);

      if (onboardingContent >= 3 && onboardingKB > 0) return { score: 4, confidence: 'medium', evidence };
      if (onboardingContent > 0 || onboardingKB > 0) return { score: 3, confidence: 'low', evidence };
      return null;
    },
  },

  {
    id: 'PE-C',
    name: 'Comp & commission design',
    pillar: 'people',
    scope: 'dept',
    departments: ['sales', 'cs', 'partners'],
    mergesFrom: ['PE-4'],
    rubric: {
      1: 'No formal comp plan or commission structure.',
      3: 'Documented comp plan with standard commission rates.',
      5: 'Multi-component plans benchmarked to market with system-automated payouts and accelerators.',
    },
    crmChecks: {
      salesforce: [
        'Opportunity fields → search for "Commission", "Comp", "SPIFF", "Accelerator", "Payout"',
        'Installed Packages → look for Xactly, CaptivateIQ, Spiff, Performio, Varicent',
        'Reports → search for "commission", "comp plan", "payout"',
      ],
      hubspot: [
        'Deal properties → check for commission-related custom properties',
        'Calculated properties → look for payout-related formulas',
        'Check integrations for comp tools (Xactly, CaptivateIQ, Spiff)',
      ],
    },
    discoveryQuestions: [
      'How are comp plans structured? Any accelerators or SPIFFs?',
      'Is commission calculation automated or manual (spreadsheet)?',
      'How often do you update comp plans?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const compPackages = getPackageNames(metadata, ['xactly', 'captivateiq', 'spiff', 'performio', 'varicent']);
      const compFields = (metadata?.objects?.Opportunity?.fields || []).filter((f) =>
        /commission|comp|spiff|payout|accelerator/i.test(f.name || f.label || '')
      );

      if (compPackages.length > 0) evidence.push(`Comp tools detected: ${compPackages.join(', ')}`);
      if (compFields.length > 0) evidence.push(`${compFields.length} commission-related fields on Opportunity`);

      if (compPackages.length > 0) return { score: 4, confidence: 'medium', evidence };
      if (compFields.length > 0) return { score: 3, confidence: 'low', evidence };
      return null;
    },
  },

  {
    id: 'PE-D',
    name: 'Performance management',
    pillar: 'people',
    scope: 'org',
    departments: 'all',
    mergesFrom: ['PE-5'],
    rubric: {
      1: 'No formal performance reviews.',
      3: 'Semi-annual reviews with basic template.',
      5: 'Continuous performance management with weekly 1:1s, quarterly reviews, and career development frameworks.',
    },
    crmChecks: {
      salesforce: [
        'Dashboard folders → named after managers or with "performance", "1:1", "review"?',
        'Scheduled Reports → reports sent to management roles',
        'Custom objects → any performance tracking objects?',
        'Reports → search for "rep performance", "activity", "scorecard"',
      ],
      hubspot: [
        'Check for rep-level filtered dashboards',
        'Look at activity-based reports per user',
        'Goals tool → assigned to individual users?',
      ],
    },
    discoveryQuestions: [
      'How do you review individual rep performance? How often?',
      'Do managers have dashboards to track their team\'s activities?',
      'Is there a formal 1:1 cadence? What\'s covered?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const mgrDashboards = countByPattern(metadata?.dashboards || [], 'FolderName', ['manager', 'director', 'leadership', 'performance', '1:1']);
      const perfReports = countByPattern(metadata?.reports || [], 'Name', ['performance', 'scorecard', 'activity', 'rep']);

      if (mgrDashboards > 0) evidence.push(`${mgrDashboards} manager/performance dashboards`);
      if (perfReports > 0) evidence.push(`${perfReports} performance-related reports`);

      if (mgrDashboards >= 3 && perfReports >= 3) return { score: 4, confidence: 'medium', evidence };
      if (mgrDashboards > 0 || perfReports > 0) return { score: 3, confidence: 'low', evidence };
      return null;
    },
  },

  // ══════════════════════════════════════
  // PROCESS
  // ══════════════════════════════════════
  {
    id: 'PR-A',
    name: 'Partner program maturity',
    pillar: 'process',
    scope: 'dept',
    departments: ['partners'],
    mergesFrom: ['PR-4'],
    rubric: {
      1: 'No partner program or process.',
      3: 'Basic partner pipeline exists with deal registration.',
      5: 'Best-practice partner ecosystem with automated deal reg, MDF, co-marketing, and attribution.',
    },
    crmChecks: {
      salesforce: [
        'PartnerRole object → does it exist with records? (active program)',
        'Record Types → partner-specific record types on Account or Opportunity?',
        'Profiles/Permission Sets → partner-specific profiles?',
        'Installed Packages → look for PRM tools (Impartner, Crossbeam, PartnerStack, Reveal)',
      ],
      hubspot: [
        'Check for partner-related deal pipeline',
        'Look for partner contact properties or lifecycle stages',
        'Check for partner portal setup in Settings',
      ],
    },
    discoveryQuestions: [
      'Tell me about your partner program — how mature is deal registration?',
      'How do you track partner-sourced vs partner-influenced deals?',
      'Do partners have their own portal or CRM access?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const partnerRoles = enhanced?.partnerRoles?.length || 0;
      const prmPackages = getPackageNames(metadata, ['impartner', 'crossbeam', 'partnerstack', 'reveal', 'partner']);

      if (partnerRoles > 0) evidence.push('PartnerRole object active');
      if (prmPackages.length > 0) evidence.push(`PRM tools: ${prmPackages.join(', ')}`);

      if (prmPackages.length > 0 && partnerRoles > 0) return { score: 4, confidence: 'medium', evidence };
      if (partnerRoles > 0) return { score: 3, confidence: 'medium', evidence };
      if (prmPackages.length > 0) return { score: 3, confidence: 'low', evidence };
      return null;
    },
  },

  {
    id: 'PR-B',
    name: 'ABM / target account process',
    pillar: 'process',
    scope: 'dept',
    departments: ['marketing', 'sales'],
    mergesFrom: ['PR-8'],
    rubric: {
      1: 'No ABM process.',
      3: 'Basic ABM with account selection and some personalization.',
      5: 'Full ABM/ABS with intent data, dynamic scoring, orchestrated plays, and attribution.',
    },
    crmChecks: {
      salesforce: [
        'Account fields → search for "Tier", "Target", "ICP", "ABM", "Score", "Intent"',
        'Installed Packages → look for 6sense, Demandbase, Terminus, RollWorks, Bombora',
        'Campaign types → any campaigns with "ABM" type?',
        'Reports → search for "target account", "ABM", "ICP"',
      ],
      hubspot: [
        'Company properties → check for scoring or tier properties',
        'Static lists → named "target", "ABM", "ICP", "tier 1"',
        'Check for ABM-related workflows',
      ],
    },
    discoveryQuestions: [
      'Do you run an ABM program? How do you select target accounts?',
      'How do marketing and sales coordinate on target accounts?',
      'Do you use any intent data or account scoring?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const abmPackages = getPackageNames(metadata, ['6sense', 'demandbase', 'terminus', 'rollworks', 'bombora']);
      const abmFields = (metadata?.objects?.Account?.fields || []).filter((f) =>
        /tier|target|icp|abm|score|intent/i.test(f.name || f.label || '')
      );
      const abmCampaigns = countByPattern(metadata?.campaigns || [], 'Type', ['abm']);

      if (abmPackages.length > 0) evidence.push(`ABM tools: ${abmPackages.join(', ')}`);
      if (abmFields.length > 0) evidence.push(`${abmFields.length} ABM-related fields on Account`);
      if (abmCampaigns > 0) evidence.push(`${abmCampaigns} ABM campaigns`);

      if (abmPackages.length > 0 && abmFields.length > 0) return { score: 4, confidence: 'medium', evidence };
      if (abmPackages.length > 0 || abmFields.length >= 2) return { score: 3, confidence: 'medium', evidence };
      if (abmFields.length > 0 || abmCampaigns > 0) return { score: 2, confidence: 'low', evidence };
      return null;
    },
  },

  // ══════════════════════════════════════
  // REPORTING
  // ══════════════════════════════════════
  {
    id: 'RP-A',
    name: 'Dashboard adoption & trust',
    pillar: 'reporting',
    scope: 'dept',
    departments: ['marketing', 'sales', 'cs'],
    mergesFrom: ['RP-2', 'RP-3'],
    rubric: {
      1: 'No dashboards; managers and ICs rely on ad-hoc spreadsheets.',
      3: 'Basic CRM dashboards exist but not trusted or consistently used across levels.',
      5: 'Personalized dashboards for managers and ICs with optimized views, prioritized tasks, and guided workflows.',
    },
    crmChecks: {
      salesforce: [
        'Dashboard count → total dashboards vs active users (healthy ratio: 3-5 per user)',
        'Folder structure → organized by team/role? (e.g., "Sales Managers", "Marketing", "CS Team")',
        'Folder names → look for "Manager", "Director", "IC", "Rep" naming patterns',
        'Dashboard ages → are they recently modified or stale?',
      ],
      hubspot: [
        'Dashboard count and sharing patterns',
        'Check for team-level dashboard organization',
        'Report view frequency — are people actually looking at them?',
      ],
    },
    discoveryQuestions: [
      'What dashboards do your managers look at daily? What about individual reps?',
      'Do people trust the data in the dashboards, or do they build their own spreadsheets?',
      'How are dashboards organized — by team, by function, by metric?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const totalDash = enhanced?.totalDashboardCount?.[0]?.cnt || metadata?.dashboards?.length || 0;
      const users = metadata?.users?.length || 0;
      const mgrDash = countByPattern(metadata?.dashboards || [], 'FolderName', ['manager', 'director', 'leadership']);
      const icDash = countByPattern(metadata?.dashboards || [], 'FolderName', ['rep', 'ic', 'individual', 'my ']);

      if (totalDash > 0) evidence.push(`${totalDash} total dashboards`);
      if (users > 0) evidence.push(`${(totalDash / users).toFixed(1)} dashboards per user`);
      if (mgrDash > 0) evidence.push(`${mgrDash} manager-level dashboards`);
      if (icDash > 0) evidence.push(`${icDash} IC-level dashboards`);

      if (mgrDash > 0 && icDash > 0 && totalDash > users) return { score: 4, confidence: 'medium', evidence };
      if (totalDash > users * 0.5) return { score: 3, confidence: 'low', evidence };
      if (totalDash > 0) return { score: 2, confidence: 'low', evidence };
      return null;
    },
  },

  {
    id: 'RP-B',
    name: 'Reporting cadence',
    pillar: 'reporting',
    scope: 'org',
    departments: 'all',
    mergesFrom: ['RP-4'],
    rubric: {
      1: 'No regular reporting cadence.',
      3: 'Monthly reporting exists but manual.',
      5: 'Full D/W/M/Q/A cadence with automated delivery, templated formats, and action tracking.',
    },
    crmChecks: {
      salesforce: [
        'CronTrigger → count scheduled reports and check frequency patterns',
        'Look for daily vs weekly vs monthly cron expressions',
        'Check for report distribution lists or subscriptions',
        'Email Templates → active templates suggest regular communications',
      ],
      hubspot: [
        'Check for scheduled email reports under Reporting',
        'Look at report delivery frequency in Settings',
        'Check for automated report notifications',
      ],
    },
    discoveryQuestions: [
      'How often do reports go out — daily, weekly, monthly?',
      'Are reports automatically delivered, or does someone manually pull them?',
      'What\'s the most important report that goes to leadership?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const scheduled = metadata?.reportSchedules?.length || 0;
      const emailTemplates = metadata?.emailTemplates?.[0]?.cnt || metadata?.emailTemplates?.cnt || 0;

      if (scheduled > 0) evidence.push(`${scheduled} scheduled report deliveries`);
      if (emailTemplates > 0) evidence.push(`${emailTemplates} active email templates`);

      if (scheduled >= 5) return { score: 4, confidence: 'medium', evidence };
      if (scheduled >= 2) return { score: 3, confidence: 'medium', evidence };
      if (scheduled >= 1) return { score: 2, confidence: 'low', evidence };
      return null;
    },
  },

  // ══════════════════════════════════════
  // ENABLEMENT
  // ══════════════════════════════════════
  {
    id: 'EN-A',
    name: 'Content & playbook maturity',
    pillar: 'enablement',
    scope: 'org',
    departments: 'all',
    mergesFrom: ['EN-1', 'EN-2', 'EN-5'],
    rubric: {
      1: 'No content library or documented playbooks; tribal knowledge only.',
      3: 'Content covers key personas but gaps in buying stages; some playbooks exist but incomplete.',
      5: 'Content factory with full persona x stage x industry coverage, centralized enablement platform, and playbooks embedded in workflows.',
    },
    crmChecks: {
      salesforce: [
        'ContentVersion → count total documents; search titles for "playbook", "process", "guide", "SOP"',
        'KnowledgeArticleVersion → count published articles',
        'Installed Packages → look for Highspot, Seismic, Showpad, Guru, Mindtickle',
        'Reports → search for "content", "enablement", "playbook"',
      ],
      hubspot: [
        'Documents tool → count shared documents',
        'Search for playbook-related content in Playbooks tool',
        'Templates library → count email and snippet templates',
        'Check for enablement tool integrations',
      ],
    },
    discoveryQuestions: [
      'Where do reps find playbooks and sales content? Is it centralized?',
      'How often is content refreshed? Who owns it?',
      'Are there documented playbooks for key motions (inbound, outbound, expansion)?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const content = metadata?.contentVersions?.length || 0;
      const knowledge = metadata?.knowledgeArticles?.length || 0;
      const enablementPackages = getPackageNames(metadata, ['highspot', 'seismic', 'showpad', 'guru', 'mindtickle']);
      const playbookContent = countByPattern(metadata?.contentVersions || [], 'Title', ['playbook', 'process', 'guide', 'sop', 'runbook']);

      if (content > 0) evidence.push(`${content} content documents`);
      if (knowledge > 0) evidence.push(`${knowledge} knowledge articles`);
      if (enablementPackages.length > 0) evidence.push(`Enablement tools: ${enablementPackages.join(', ')}`);
      if (playbookContent > 0) evidence.push(`${playbookContent} playbook/guide documents`);

      if (enablementPackages.length > 0 && content > 20) return { score: 4, confidence: 'medium', evidence };
      if (content > 20 || knowledge > 10) return { score: 3, confidence: 'low', evidence };
      if (content > 0 || knowledge > 0) return { score: 2, confidence: 'low', evidence };
      return null;
    },
  },

  {
    id: 'EN-B',
    name: 'Coaching & training program',
    pillar: 'enablement',
    scope: 'dept',
    departments: ['sales', 'cs'],
    mergesFrom: ['EN-3', 'EN-4'],
    rubric: {
      1: 'No coaching program or formal training.',
      3: 'Some coaching exists but inconsistent; one-time onboarding training only.',
      5: 'Best-practice coaching with CI platform, scorecards, certification programs, and impact measurement.',
    },
    crmChecks: {
      salesforce: [
        'Installed Packages → look for Gong, Chorus, Clari, ExecVision, Revenue.io',
        'Dashboard folders → coaching-related folders?',
        'Events → recurring events suggesting call review sessions',
        'Reports → search for "coaching", "call review", "training"',
      ],
      hubspot: [
        'Check for conversation intelligence integrations (Gong, Chorus)',
        'Call recording settings in Settings → Calling',
        'Check for coaching-related templates or playbooks',
      ],
    },
    discoveryQuestions: [
      'Do you have a formal coaching program? How are call reviews done?',
      'Do you use any conversation intelligence tools (Gong, Chorus)?',
      'Is there a certification or ongoing training program for reps?',
    ],
    signalMapping: (signals, enhanced, metadata) => {
      const evidence = [];
      const ciPackages = getPackageNames(metadata, ['gong', 'chorus', 'clari', 'execvision', 'revenue.io', 'jiminny']);
      const coachingDash = countByPattern(metadata?.dashboards || [], 'FolderName', ['coaching', 'training', 'enablement']);
      const coachingReports = countByPattern(metadata?.reports || [], 'Name', ['coaching', 'call review', 'training']);

      if (ciPackages.length > 0) evidence.push(`CI tools: ${ciPackages.join(', ')}`);
      if (coachingDash > 0) evidence.push(`${coachingDash} coaching dashboards`);
      if (coachingReports > 0) evidence.push(`${coachingReports} coaching/training reports`);

      if (ciPackages.length > 0 && (coachingDash > 0 || coachingReports > 0)) return { score: 4, confidence: 'medium', evidence };
      if (ciPackages.length > 0) return { score: 3, confidence: 'medium', evidence };
      if (coachingDash > 0 || coachingReports > 0) return { score: 2, confidence: 'low', evidence };
      return null;
    },
  },
];

// ── Helper Functions ──

/**
 * Get all V2 competencies.
 */
export function getV2Competencies() {
  return V2_COMPETENCIES;
}

/**
 * Get a V2 competency by ID.
 */
export function getV2CompetencyById(id) {
  return V2_COMPETENCIES.find((c) => c.id === id);
}

/**
 * Get the V1 IDs that a V2 ID maps to.
 */
export function getMergeTargets(v2Id) {
  return COMPETENCY_MERGE_MAP[v2Id] || [];
}

/**
 * Expand departments for a V2 competency.
 */
export function expandV2Departments(comp) {
  if (comp.scope === 'org') return ['org'];
  if (comp.departments === 'all') return ['marketing', 'sales', 'cs', 'partners'];
  if (Array.isArray(comp.departments)) return comp.departments;
  return [comp.departments];
}

/**
 * Count total cells in the V2 model.
 */
export function countV2Cells() {
  return V2_COMPETENCIES.reduce((total, comp) => {
    return total + expandV2Departments(comp).length;
  }, 0);
}

/**
 * Compute suggested scores for all V2 competencies.
 * Returns { [v2Id]: { score, confidence, evidence[] } | null }
 */
export function computeAllSuggestedScores(computedSignals, enhancedSignals, metadata) {
  const suggestions = {};
  for (const comp of V2_COMPETENCIES) {
    try {
      suggestions[comp.id] = comp.signalMapping(computedSignals || {}, enhancedSignals || {}, metadata || {});
    } catch {
      suggestions[comp.id] = null;
    }
  }
  return suggestions;
}

/**
 * Build a reverse map from V1 IDs to V2 IDs.
 * Returns { 'PL-1': 'PL-A', 'PL-4': 'PL-A', 'PE-1': 'PE-A', ... }
 */
export function buildV1ToV2Map() {
  const map = {};
  for (const [v2Id, v1Ids] of Object.entries(COMPETENCY_MERGE_MAP)) {
    for (const v1Id of v1Ids) {
      map[v1Id] = v2Id;
    }
  }
  return map;
}

/**
 * Convert V1-keyed existing assessments into V2-keyed assessments
 * for the ConsultantAuditForm. Org-scoped V2 competencies collapse
 * multiple department rows into a single 'org' entry (using the first found score).
 */
export function collapseAssessmentsToV2(existingAssessments) {
  const v1ToV2 = buildV1ToV2Map();
  const result = {};

  for (const a of existingAssessments) {
    const v2Id = v1ToV2[a.competency_id];
    if (!v2Id) continue;

    const comp = getV2CompetencyById(v2Id);
    if (!comp) continue;

    if (comp.scope === 'org') {
      // Collapse all department rows into a single 'org' entry
      const key = `${v2Id}_org`;
      if (!result[key]) {
        result[key] = { score: a.score, notes: a.notes || '' };
      }
    } else {
      // Dept-scoped: keep the department from the DB row
      const key = `${v2Id}_${a.department}`;
      if (!result[key]) {
        result[key] = { score: a.score, notes: a.notes || '' };
      }
    }
  }

  return result;
}

/**
 * Fan out a V2 assessment to V1 IDs for storage.
 * Returns array of { competencyId (V1), department, score, notes }
 */
export function fanOutAssessment(v2Id, deptOrOrg, score, notes) {
  const v1Ids = getMergeTargets(v2Id);
  if (v1Ids.length === 0) return [];

  const comp = getV2CompetencyById(v2Id);
  if (!comp) return [];

  // For org-scoped competencies, fan out the score to all 4 departments for each V1 ID
  const departments = comp.scope === 'org'
    ? ['marketing', 'sales', 'cs', 'partners']
    : [deptOrOrg];

  const results = [];
  for (const v1Id of v1Ids) {
    for (const dept of departments) {
      results.push({
        competencyId: v1Id,
        department: dept,
        score,
        notes: notes || null,
      });
    }
  }
  return results;
}
