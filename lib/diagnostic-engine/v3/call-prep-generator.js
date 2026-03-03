/**
 * Discovery Call Prep Sheet Generator
 *
 * Takes a customer's CRM metadata and produces a structured object
 * with company snapshot, discovery questions, and gap-specific probes.
 * The output is rendered by the call-prep page component.
 */

import { V2_COMPETENCIES, computeAllSuggestedScores } from './consultant-competencies';

/**
 * Generate a complete call prep sheet from customer metadata.
 *
 * @param {Object} metadata - CRM metadata (camelCase from DB row)
 * @param {Object} enhancedData - Enhanced SOQL query results (optional)
 * @param {string} crmType - 'salesforce' or 'hubspot'
 * @returns {{ snapshot, questions, gaps }}
 */
export function generateCallPrep(metadata = {}, enhancedData = {}, crmType = 'salesforce') {
  const snapshot = buildSnapshot(metadata, enhancedData);
  const questions = buildQuestions();
  const gaps = buildGaps(metadata, enhancedData, snapshot);

  return { snapshot, questions, gaps, crmType };
}

// ── Part 1: Company Snapshot ──

function buildSnapshot(metadata, enhanced) {
  const users = metadata.users || [];
  const flows = metadata.flows || [];
  const validationRules = metadata.validationRules || [];
  const reports = metadata.reports || [];
  const dashboards = metadata.dashboards || [];
  const installedPackages = metadata.installedPackages || [];
  const connectedApps = metadata.connectedApps || [];
  const stages = metadata.stages || [];

  // ARR from enhanced data
  const arrAgg = enhanced?.arrAggregate?.[0];
  const arr = arrAgg
    ? formatCurrency(arrAgg.total_arr || arrAgg.TotalARR || arrAgg.Amount || 0)
    : null;

  // GTM motion from lead source distribution
  const leadSources = enhanced?.leadSourceDistribution || [];
  const gtmMotion = inferGTMMotion(leadSources);

  // Login activity
  const loginHistory = enhanced?.loginHistory || [];
  const activeLogins = loginHistory.reduce((sum, r) => sum + (r.cnt || r.LoginCount || 0), 0);

  // Tech stack — extract notable package names
  const techStack = installedPackages
    .map((p) => p.SubscriberPackage?.Name || p.Name)
    .filter(Boolean)
    .slice(0, 15);

  return {
    crm: 'Salesforce',
    arr,
    gtmMotion,
    userCount: users.length,
    activeLogins: activeLogins || null,
    oppStages: stages.length,
    techStack,
    connectedAppCount: connectedApps.length,
    flowCount: flows.length,
    validationRuleCount: validationRules.length,
    reportCount: reports.length,
    dashboardCount: dashboards.length,
    packageCount: installedPackages.length,
  };
}

function inferGTMMotion(leadSources) {
  if (!leadSources || leadSources.length === 0) return 'Unknown';

  const total = leadSources.reduce((sum, s) => sum + (s.cnt || 0), 0);
  if (total === 0) return 'Unknown';

  const inboundPatterns = /web|inbound|content|organic|social|referral|marketing/i;
  const outboundPatterns = /outbound|cold|sdr|bdr|sales.?dev|prospecting/i;
  const partnerPatterns = /partner|channel|reseller|referral.?partner/i;

  let inbound = 0;
  let outbound = 0;
  let partner = 0;

  for (const s of leadSources) {
    const src = s.LeadSource || s.lead_source || '';
    const cnt = s.cnt || 0;
    if (partnerPatterns.test(src)) partner += cnt;
    else if (outboundPatterns.test(src)) outbound += cnt;
    else if (inboundPatterns.test(src)) inbound += cnt;
  }

  const parts = [];
  if (inbound > total * 0.3) parts.push('Inbound');
  if (outbound > total * 0.3) parts.push('Outbound');
  if (partner > total * 0.15) parts.push('Partner-led');

  return parts.length > 0 ? parts.join(' + ') : 'Mixed';
}

function formatCurrency(amount) {
  if (!amount || amount === 0) return null;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}

// ── Part 2: Discovery Questions ──

const QUESTION_TOPICS = [
  {
    topic: 'Planning & Strategy',
    competencyIds: ['PL-A', 'PL-B', 'PL-C', 'PL-D'],
  },
  {
    topic: 'Hiring & Team Development',
    competencyIds: ['PE-A', 'PE-B', 'PE-C', 'PE-D'],
  },
  {
    topic: 'Go-to-Market Process',
    competencyIds: ['PR-A', 'PR-B'],
  },
  {
    topic: 'Reporting & Dashboards',
    competencyIds: ['RP-A', 'RP-B'],
  },
  {
    topic: 'Enablement & Coaching',
    competencyIds: ['EN-A', 'EN-B'],
  },
];

function buildQuestions() {
  return QUESTION_TOPICS.map(({ topic, competencyIds }) => ({
    topic,
    items: competencyIds.flatMap((id) => {
      const comp = V2_COMPETENCIES.find((c) => c.id === id);
      if (!comp) return [];
      // Pick the first 2 discovery questions (most important/broad)
      return comp.discoveryQuestions.slice(0, 2).map((question) => ({
        question,
        mapsTo: id,
      }));
    }),
  }));
}

// ── Part 3: Gaps to Probe ──

function buildGaps(metadata, enhanced, snapshot) {
  const gaps = [];

  // Run signal mappings to find where we have no data
  const suggestions = computeAllSuggestedScores({}, enhanced || {}, metadata || {});

  for (const comp of V2_COMPETENCIES) {
    const suggestion = suggestions[comp.id];

    if (!suggestion || suggestion.score === null) {
      // No signal — this is a gap
      gaps.push({
        competencyId: comp.id,
        competencyName: comp.name,
        severity: 'warning',
        signal: `No CRM signals found for ${comp.name}`,
        probeQuestion: comp.discoveryQuestions[0],
      });
    } else if (suggestion.score <= 2) {
      // Weak signal — probe further
      gaps.push({
        competencyId: comp.id,
        competencyName: comp.name,
        severity: 'concern',
        signal: suggestion.evidence?.join('; ') || 'Weak signals detected',
        probeQuestion: comp.discoveryQuestions[comp.discoveryQuestions.length - 1],
      });
    }
  }

  // Add structural gaps from snapshot
  if (snapshot.oppStages > 12) {
    gaps.push({
      competencyId: null,
      competencyName: 'Sales Process',
      severity: 'concern',
      signal: `${snapshot.oppStages} opportunity stages detected (high — typical is 5-8)`,
      probeQuestion: 'Are all opportunity stages actively used? Which ones could be consolidated?',
    });
  }

  if (snapshot.flowCount === 0) {
    gaps.push({
      competencyId: null,
      competencyName: 'Automation',
      severity: 'warning',
      signal: 'No Flows or automation detected',
      probeQuestion: 'How are routine tasks handled — manually or with automation?',
    });
  }

  if (snapshot.dashboardCount === 0) {
    gaps.push({
      competencyId: null,
      competencyName: 'Reporting',
      severity: 'warning',
      signal: 'No dashboards found',
      probeQuestion: 'Where does leadership get visibility into pipeline and performance?',
    });
  }

  return gaps;
}
