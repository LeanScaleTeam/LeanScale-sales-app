/**
 * Salesforce Enhanced Intake Inferrer
 *
 * Takes enhanced SOQL query results (data not available in the standard
 * metadata path) and produces pre-fill entries for intake form questions.
 * Each entry has shape:
 *   { value: string, confidence: 'high'|'medium', evidence: string }
 *
 * HIGH-confidence inferences:
 *   D1  — dashboard count (from totalDashboardCount — true COUNT, not LIMIT 200)
 *   D5  — report distribution (from report schedules)
 *
 * MEDIUM-confidence inferences:
 *   A3  — ARR range (from won opportunity aggregate)
 *   A4  — GTM motion (from lead source distribution)
 *   A5  — partner program (from partner roles + record types)
 *   C2  — response time (from speed-to-lead tool detection via packages)
 *   C7  — sales-to-CS handoff (from flows + roles)
 *   C9  — NPS/CSAT (from object fields + flows)
 *   C11 — email nurture (from campaign types + installed packages)
 *   C12 — events (from campaign types)
 *   C13 — operating plan (from forecast dashboards + review cadence)
 *   C15 — business review frequency (from dashboard titles)
 *   C16 — manager dashboards (from dashboard titles/folders)
 *   C17 — IC daily use (from login history + user count)
 *   D2  — dashboard trust (from dashboard count + folder diversity)
 *   D3  — forecasting (from forecastingTypes + forecastingItemCount + connectedApps)
 *   D4  — growth model (from ARR + bookings split + segment fields)
 *   D6  — playbooks (from knowledge articles + content versions + packages)
 *
 * Power 10 metrics (D5_arr through D5_cycle) — from report names + data signals
 */

// ── GTM Motion Patterns ──

const GTM_INBOUND_PATTERN = /\bweb\b|\binbound\b|\borganic\b|\bcontent\b|\bseo\b/i;
const GTM_OUTBOUND_PATTERN = /\boutbound\b|\bcold\b|\bprospecting\b|\bsales\b/i;
const GTM_PARTNER_PATTERN = /\bpartner\b|\breferral\b|\bchannel\b/i;
const GTM_PRODUCT_PATTERN = /\bproduct\b|\btrial\b|\bfreemium\b|\bsignup\b/i;

// ── Handoff / CS Patterns ──

const HANDOFF_FLOW_PATTERN = /handoff|hand.?off|sales.?to.?cs|onboard/i;
const CS_ROLE_PATTERN = /customer.?success|cs\b|csm|onboard/i;

// ── NPS / CSAT Patterns ──

const NPS_CSAT_FIELD_PATTERN = /nps|csat|satisfaction|survey|net.?promoter/i;
const NPS_CSAT_FLOW_PATTERN = /nps|csat|satisfaction|survey|net.?promoter/i;

// ── Event Campaign Patterns ──

const EVENT_TYPE_PATTERN = /event|webinar|conference|dinner|roundtable|workshop/i;

// ── Manager Dashboard Patterns ──

const MANAGER_DASHBOARD_PATTERN = /manager|director|leadership|executive|vp\b|svp\b/i;

// ── Forecasting App Patterns ──

const FORECASTING_APP_PATTERN = /clari|aviso|boostup/i;

// ── Playbook / Enablement Patterns ──

const PLAYBOOK_PATTERN = /playbook|enablement|sales.?play|battle.?card|objection|compete|pricing.?guide/i;

// ── Enablement Package Patterns ──

const ENABLEMENT_PACKAGE_PATTERN = /highspot|seismic|showpad|guru|lessonly|workramp|docebo/i;

// ── Partner Record Type Pattern ──

const PARTNER_RT_PATTERN = /partner/i;

// ── Speed-to-Lead Package Patterns ──

const SPEED_TO_LEAD_PATTERN = /chili.?piper|qualified|leandata/i;

// ── Nurture / MAP Patterns ──

const NURTURE_CAMPAIGN_PATTERN = /email|newsletter|nurture|promotional|drip/i;
const MAP_PACKAGE_PATTERN = /pardot|marketing\s*cloud|marketo|hubspot.*marketing/i;

// ── Business Review Dashboard Patterns ──

const WEEKLY_REVIEW_PATTERN = /weekly/i;
const QUARTERLY_REVIEW_PATTERN = /quarterly|qbr|business.?review/i;

// ── ARR / Segment Field Patterns ──

const ARR_FIELD_PATTERN = /\barr\b|annual.?recurring|mrr|monthly.?recurring/i;
const SEGMENT_FIELD_PATTERN = /segment|tier|classification|customer_segment/i;
const CHURN_FIELD_PATTERN = /churn|forecasted.?churn|renewal.?risk/i;

// ── Power 10 Report Patterns ──

const POWER_10_PATTERNS = [
  { key: 'D5_arr', pattern: /arr|annual.?recurring|recurring.?revenue/i },
  { key: 'D5_bookings', pattern: /booking|new.?business|expansion/i },
  { key: 'D5_pipeline', pattern: /pipeline|funnel/i },
  { key: 'D5_mql', pattern: /mql|marketing.?qualified|lead.?source/i },
  { key: 'D5_gross_churn', pattern: /churn|logo.?retention/i },
  { key: 'D5_grr', pattern: /grr|gross.?retention|gross.?dollar/i },
  { key: 'D5_nrr', pattern: /nrr|net.?retention|net.?dollar/i },
  { key: 'D5_mql_opp', pattern: /mql.?to.?opp|lead.?conversion|conversion.?rate/i },
  { key: 'D5_opp_cw', pattern: /win.?rate|close.?rate|opp.?to.?close/i },
  { key: 'D5_cycle', pattern: /cycle.?time|sales.?cycle|average.?days|days.?to.?close/i },
];

// ── Main Export ──

/**
 * Infer enhanced intake form answers from SOQL query results + standard metadata.
 *
 * @param {object|null} enhanced - Enhanced SOQL data (arrAggregate, leadSourceDistribution, etc.)
 * @param {object|null} metadata - Standard Salesforce metadata
 * @returns {object} Pre-fill map keyed by question ID. Each entry:
 *   { value: string, confidence: 'high'|'medium', evidence: string }
 */
export function inferEnhancedAnswers(enhanced, metadata) {
  const preFill = {};

  if (!enhanced) enhanced = {};
  if (!metadata) metadata = {};

  // Normalize enhanced arrays
  const arrAggregate = Array.isArray(enhanced.arrAggregate) ? enhanced.arrAggregate : [];
  const leadSourceDistribution = Array.isArray(enhanced.leadSourceDistribution) ? enhanced.leadSourceDistribution : [];
  const campaignTypes = Array.isArray(enhanced.campaignTypes) ? enhanced.campaignTypes : [];
  const loginHistory = Array.isArray(enhanced.loginHistory) ? enhanced.loginHistory : [];
  const partnerRoles = Array.isArray(enhanced.partnerRoles) ? enhanced.partnerRoles : [];
  const reportNames = Array.isArray(enhanced.reportNames) ? enhanced.reportNames : [];
  // Gap analysis additions
  const wonOppsByType = Array.isArray(enhanced.wonOppsByType) ? enhanced.wonOppsByType : [];
  const leadConversionCount = Array.isArray(enhanced.leadConversionCount) ? enhanced.leadConversionCount : [];
  const leadConversionBySource = Array.isArray(enhanced.leadConversionBySource) ? enhanced.leadConversionBySource : [];
  const totalDashboardCount = extractCount(enhanced.totalDashboardCount);
  const totalReportCount = extractCount(enhanced.totalReportCount);
  const forecastingItemCount = extractCount(enhanced.forecastingItemCount);
  const oppLineItemCount = extractCount(enhanced.oppLineItemCount);
  const contractCount = extractCount(enhanced.contractCount);
  const stageHistoryCount = extractCount(enhanced.stageHistoryCount);

  // Normalize metadata arrays and objects
  const objects = metadata.objects || {};
  const users = Array.isArray(metadata.users) ? metadata.users : [];
  const flows = Array.isArray(metadata.flows) ? metadata.flows : [];
  const dashboards = Array.isArray(metadata.dashboards) ? metadata.dashboards : [];
  const connectedApps = Array.isArray(metadata.connectedApps) ? metadata.connectedApps : [];
  const recordTypes = Array.isArray(metadata.recordTypes) ? metadata.recordTypes : [];
  const roles = Array.isArray(metadata.roles) ? metadata.roles : [];
  const forecastingTypes = Array.isArray(metadata.forecastingTypes) ? metadata.forecastingTypes : [];
  const reportSchedules = Array.isArray(metadata.reportSchedules) ? metadata.reportSchedules : [];
  const contentVersions = Array.isArray(metadata.contentVersions) ? metadata.contentVersions : [];
  const knowledgeArticles = Array.isArray(metadata.knowledgeArticles) ? metadata.knowledgeArticles : [];
  const installedPackages = Array.isArray(metadata.installedPackages) ? metadata.installedPackages : [];
  const campaigns = Array.isArray(metadata.campaigns) ? metadata.campaigns : [];

  // Collect package names for tool detection
  const packageNames = installedPackages
    .map((p) => p.SubscriberPackage?.Name || p.Name || '')
    .filter(Boolean);

  // Get object field arrays for field-pattern checks
  const accountFields = getFields(objects.Account);
  const oppFields = getFields(objects.Opportunity);

  // ── Inferences ──

  inferA3(preFill, arrAggregate);
  inferA4(preFill, leadSourceDistribution);
  inferA5(preFill, partnerRoles, recordTypes);
  inferC2(preFill, packageNames);
  inferC7(preFill, flows, roles);
  inferC9(preFill, objects, flows);
  inferC11(preFill, campaignTypes, campaigns, packageNames);
  inferC12(preFill, campaignTypes);
  inferC13(preFill, dashboards);
  inferC15(preFill, dashboards);
  inferC16(preFill, dashboards);
  inferC17(preFill, loginHistory, users);
  inferD1(preFill, totalDashboardCount, dashboards);
  inferD2(preFill, totalDashboardCount, dashboards);
  inferD3(preFill, forecastingTypes, forecastingItemCount, connectedApps, packageNames);
  inferD4(preFill, arrAggregate, wonOppsByType, accountFields);
  inferD5(preFill, reportSchedules);
  inferD6(preFill, knowledgeArticles, contentVersions, packageNames);
  inferPower10(preFill, reportNames, wonOppsByType, leadConversionCount,
    contractCount, oppFields, accountFields, stageHistoryCount);

  return preFill;
}

// ── Inference Functions ──

/**
 * A3: ARR range -- map won opportunity aggregate to revenue bucket.
 * Buckets: <$1M, $1-5M, $5-20M, $20-50M, $50M+
 */
function inferA3(preFill, arrAggregate) {
  if (arrAggregate.length === 0) return;

  const total = arrAggregate[0]?.total;
  if (!total || total <= 0) return;

  let bucket;
  if (total < 1_000_000) bucket = '<$1M';
  else if (total < 5_000_000) bucket = '$1-5M';
  else if (total < 20_000_000) bucket = '$5-20M';
  else if (total < 50_000_000) bucket = '$20-50M';
  else bucket = '$50M+';

  preFill.A3 = {
    value: bucket,
    confidence: 'medium',
    evidence: `Won opportunity total this year: $${total.toLocaleString()}`,
  };
}

/**
 * A4: GTM motion -- analyze top lead source to determine go-to-market motion.
 * Categorizes as Inbound-led, Outbound-led, Partner-led, Product-led, or Blended.
 */
function inferA4(preFill, leadSourceDistribution) {
  if (leadSourceDistribution.length === 0) return;

  // Sort by count descending to find the top source
  const sorted = [...leadSourceDistribution].sort((a, b) => (b.cnt || 0) - (a.cnt || 0));
  const topSource = sorted[0]?.LeadSource || '';

  let motion;
  if (GTM_INBOUND_PATTERN.test(topSource)) motion = 'Inbound-led';
  else if (GTM_OUTBOUND_PATTERN.test(topSource)) motion = 'Outbound-led';
  else if (GTM_PARTNER_PATTERN.test(topSource)) motion = 'Partner-led';
  else if (GTM_PRODUCT_PATTERN.test(topSource)) motion = 'Product-led';
  else motion = 'Blended';

  // Build evidence showing top 3 sources
  const top3 = sorted.slice(0, 3).map((s) => `${s.LeadSource} (${s.cnt})`);

  preFill.A4 = {
    value: motion,
    confidence: 'medium',
    evidence: `Top lead sources: ${top3.join(', ')}`,
  };
}

/**
 * A5: Partner program -- check partnerRoles and partner-related record types.
 */
function inferA5(preFill, partnerRoles, recordTypes) {
  const hasPartnerRoles = partnerRoles.length > 0;
  const hasPartnerRT = recordTypes.some((rt) => {
    const sobjectType = rt.SobjectType || '';
    return PARTNER_RT_PATTERN.test(sobjectType);
  });

  if (!hasPartnerRoles && !hasPartnerRT) return;

  const evidenceParts = [];
  if (hasPartnerRoles) evidenceParts.push(`${partnerRoles.length} partner role(s) found`);
  if (hasPartnerRT) evidenceParts.push('Partner-related record types detected');

  preFill.A5 = {
    value: 'Yes, active',
    confidence: 'medium',
    evidence: evidenceParts.join('; '),
  };
}

/**
 * C7: Sales-to-CS handoff -- check flows for handoff patterns and roles for CS patterns.
 * Flow match -> "Documented + automated"
 * CS role only -> "Informal"
 */
function inferC7(preFill, flows, roles) {
  const handoffFlow = flows.find((f) => {
    const label = f.Label || f.Name || '';
    return HANDOFF_FLOW_PATTERN.test(label);
  });

  const csRole = roles.find((r) => {
    const name = r.Name || '';
    return CS_ROLE_PATTERN.test(name);
  });

  if (handoffFlow) {
    preFill.C7 = {
      value: 'Documented + automated',
      confidence: 'medium',
      evidence: `Handoff flow detected: "${handoffFlow.Label || handoffFlow.Name}"`,
    };
  } else if (csRole) {
    preFill.C7 = {
      value: 'Informal',
      confidence: 'medium',
      evidence: `CS-related role found: "${csRole.Name}"`,
    };
  }
}

/**
 * C9: NPS/CSAT -- check Account and Contact fields for NPS/CSAT patterns.
 * If automated flow also exists -> "Yes, automated program"
 * If just fields -> "Yes, ad hoc"
 */
function inferC9(preFill, objects, flows) {
  const accountFields = getFields(objects.Account);
  const contactFields = getFields(objects.Contact);
  const allFields = [...accountFields, ...contactFields];

  const hasNpsCsatField = allFields.some((f) => {
    const nameLabel = `${f.name || ''} ${f.label || ''}`;
    return NPS_CSAT_FIELD_PATTERN.test(nameLabel);
  });

  if (!hasNpsCsatField) return;

  const hasAutomatedFlow = flows.some((f) => {
    const label = f.Label || f.Name || '';
    return NPS_CSAT_FLOW_PATTERN.test(label);
  });

  if (hasAutomatedFlow) {
    preFill.C9 = {
      value: 'Yes, automated program',
      confidence: 'medium',
      evidence: 'NPS/CSAT fields found with automated survey flow',
    };
  } else {
    preFill.C9 = {
      value: 'Yes, ad hoc',
      confidence: 'medium',
      evidence: 'NPS/CSAT fields found on Account or Contact (no automated flow detected)',
    };
  }
}

/**
 * C12: Events -- check campaign types for event-related patterns.
 * Total event count > 5 -> "Yes, regularly"
 * 1-5 -> "Occasionally"
 */
function inferC12(preFill, campaignTypes) {
  const eventTypes = campaignTypes.filter((ct) =>
    EVENT_TYPE_PATTERN.test(ct.Type || '')
  );

  const totalEventCount = eventTypes.reduce((sum, ct) => sum + (ct.cnt || 0), 0);
  if (totalEventCount === 0) return;

  const value = totalEventCount > 5 ? 'Yes, regularly' : 'Occasionally';
  const matchedTypes = eventTypes.map((ct) => `${ct.Type} (${ct.cnt})`).join(', ');

  preFill.C12 = {
    value,
    confidence: 'medium',
    evidence: `Event campaign types: ${matchedTypes}, total: ${totalEventCount}`,
  };
}

/**
 * C16: Manager dashboards -- check dashboard titles and folder names for manager patterns.
 */
function inferC16(preFill, dashboards) {
  const managerDash = dashboards.find((d) => {
    const title = d.Title || '';
    const folder = d.FolderName || '';
    return MANAGER_DASHBOARD_PATTERN.test(title) || MANAGER_DASHBOARD_PATTERN.test(folder);
  });

  if (!managerDash) return;

  preFill.C16 = {
    value: 'Yes per team',
    confidence: 'medium',
    evidence: `Manager/leadership dashboard detected: "${managerDash.Title}" in folder "${managerDash.FolderName || 'unknown'}"`,
  };
}

/**
 * C17: IC daily use -- count users with 5+ logins in last 7 days.
 * >50% of total users -> "Yes with personal views"
 * 25-50% -> "Yes basic"
 * <25% -> skip
 */
function inferC17(preFill, loginHistory, users) {
  const totalUsers = users.length;
  if (totalUsers === 0) return;

  const frequentUsers = loginHistory.filter((entry) => (entry.cnt || 0) >= 5).length;
  const pct = frequentUsers / totalUsers;

  if (pct > 0.5) {
    preFill.C17 = {
      value: 'Yes with personal views',
      confidence: 'medium',
      evidence: `${frequentUsers} of ${totalUsers} users (${Math.round(pct * 100)}%) logged in 5+ of last 7 days`,
    };
  } else if (pct >= 0.25) {
    preFill.C17 = {
      value: 'Yes basic',
      confidence: 'medium',
      evidence: `${frequentUsers} of ${totalUsers} users (${Math.round(pct * 100)}%) logged in 5+ of last 7 days`,
    };
  }
  // Below 25% -> don't pre-fill
}

/**
 * C2: Response time -- detect speed-to-lead tools from installed packages.
 * Chili Piper / Qualified / LeanData -> "<5 minutes"
 */
function inferC2(preFill, packageNames) {
  const speedTool = packageNames.find((n) => SPEED_TO_LEAD_PATTERN.test(n));
  if (!speedTool) return;

  preFill.C2 = {
    value: '<5 minutes',
    confidence: 'medium',
    evidence: `Speed-to-lead tool detected: ${speedTool}`,
  };
}

/**
 * C11: Email nurture -- detect from campaign types or installed MAP packages.
 * MAP installed -> "Yes, in CRM/MAP"
 * Nurture campaigns found -> "Yes, other tool"
 */
function inferC11(preFill, campaignTypes, campaigns, packageNames) {
  const hasMAP = packageNames.some((n) => MAP_PACKAGE_PATTERN.test(n));
  if (hasMAP) {
    const mapName = packageNames.find((n) => MAP_PACKAGE_PATTERN.test(n));
    preFill.C11 = {
      value: 'Yes, in CRM/MAP',
      confidence: 'medium',
      evidence: `Marketing automation platform: ${mapName}`,
    };
    return;
  }

  const nurtureCampaigns = [
    ...campaignTypes.filter((ct) => NURTURE_CAMPAIGN_PATTERN.test(ct.Type || '')),
    ...campaigns.filter((c) => NURTURE_CAMPAIGN_PATTERN.test(c.Type || '') || NURTURE_CAMPAIGN_PATTERN.test(c.Name || '')),
  ];
  if (nurtureCampaigns.length > 0) {
    preFill.C11 = {
      value: 'Yes, other tool',
      confidence: 'medium',
      evidence: `${nurtureCampaigns.length} nurture/email campaign(s) found`,
    };
  }
}

/**
 * C13: Operating/GTM plan -- check for forecast dashboards and quarterly patterns.
 * Forecast + quarterly dashboards -> "Yes quarterly"
 */
function inferC13(preFill, dashboards) {
  const hasForecastDash = dashboards.some((d) =>
    /forecast/i.test(d.Title || '') || /forecast/i.test(d.FolderName || '')
  );
  const hasQuarterlyDash = dashboards.some((d) =>
    QUARTERLY_REVIEW_PATTERN.test(d.Title || '') || QUARTERLY_REVIEW_PATTERN.test(d.FolderName || '')
  );

  if (hasForecastDash && hasQuarterlyDash) {
    preFill.C13 = {
      value: 'Yes quarterly',
      confidence: 'medium',
      evidence: 'Forecast and quarterly review dashboards detected',
    };
  } else if (hasForecastDash) {
    preFill.C13 = {
      value: 'Yes annual',
      confidence: 'medium',
      evidence: 'Forecast dashboards detected (no quarterly cadence pattern)',
    };
  }
}

/**
 * C15: Business review frequency -- check dashboard titles for cadence patterns.
 * Weekly + monthly/quarterly -> "D/W/M/Q" or "W/M/Q"
 * Monthly/quarterly only -> "Monthly" or "Quarterly"
 */
function inferC15(preFill, dashboards) {
  const hasWeekly = dashboards.some((d) => WEEKLY_REVIEW_PATTERN.test(d.Title || ''));
  const hasMonthly = dashboards.some((d) => /monthly/i.test(d.Title || ''));
  const hasQuarterly = dashboards.some((d) => QUARTERLY_REVIEW_PATTERN.test(d.Title || ''));

  if (!hasWeekly && !hasMonthly && !hasQuarterly) return;

  let value;
  if (hasWeekly && (hasMonthly || hasQuarterly)) value = 'W/M/Q';
  else if (hasMonthly && hasQuarterly) value = 'Monthly';
  else if (hasQuarterly) value = 'Quarterly';
  else if (hasWeekly) value = 'W/M/Q';
  else value = 'Monthly';

  const cadences = [];
  if (hasWeekly) cadences.push('weekly');
  if (hasMonthly) cadences.push('monthly');
  if (hasQuarterly) cadences.push('quarterly');

  preFill.C15 = {
    value,
    confidence: 'medium',
    evidence: `Review cadence dashboards found: ${cadences.join(', ')}`,
  };
}

/**
 * D1: Dashboard count -- use true COUNT (not LIMIT 200) when available.
 * Overrides the base inferrer's D1 if we have a more accurate count.
 */
function inferD1(preFill, totalDashboardCount, dashboards) {
  const count = totalDashboardCount > 0 ? totalDashboardCount : dashboards.length;
  if (count === 0) return;

  let value;
  if (count >= 10) value = '10+';
  else if (count >= 5) value = '5-10';
  else if (count >= 1) value = '1-4';
  else value = 'None';

  preFill.D1 = {
    value,
    confidence: 'high',
    evidence: `${count} dashboard${count !== 1 ? 's' : ''} found (true count)`,
  };
}

/**
 * D2: Dashboard trust -- infer from dashboard count + folder diversity.
 * Many dashboards with diverse folders -> "Yes, primary tool"
 * Some dashboards -> "Somewhat"
 */
function inferD2(preFill, totalDashboardCount, dashboards) {
  const count = totalDashboardCount > 0 ? totalDashboardCount : dashboards.length;
  if (count === 0) return;

  const uniqueFolders = new Set(dashboards.map((d) => d.FolderName).filter(Boolean));

  if (count >= 10 && uniqueFolders.size >= 3) {
    preFill.D2 = {
      value: 'Yes, primary tool',
      confidence: 'medium',
      evidence: `${count} dashboards across ${uniqueFolders.size} folder(s) — indicates active usage`,
    };
  } else if (count >= 5) {
    preFill.D2 = {
      value: 'Somewhat',
      confidence: 'medium',
      evidence: `${count} dashboards in ${uniqueFolders.size} folder(s)`,
    };
  }
}

/**
 * D3: Forecasting -- check forecastingTypes, forecastingItemCount, connectedApps, packages.
 * AI tool (Clari/Aviso/BoostUp) -> "AI/tool-assisted"
 * CRM forecast with heavy usage -> "CRM forecast tool"
 * CRM forecast configured but light -> "CRM forecast tool"
 */
function inferD3(preFill, forecastingTypes, forecastingItemCount, connectedApps, packageNames) {
  // Check for AI forecasting tools in connected apps and packages
  const hasAITool = connectedApps.some((app) =>
    FORECASTING_APP_PATTERN.test(app.Name || '')
  ) || packageNames.some((n) => FORECASTING_APP_PATTERN.test(n));

  const hasCRMForecast = forecastingTypes.length > 0;

  if (hasAITool) {
    const matchedApp = connectedApps.find((app) =>
      FORECASTING_APP_PATTERN.test(app.Name || '')
    );
    const matchedPkg = packageNames.find((n) => FORECASTING_APP_PATTERN.test(n));
    preFill.D3 = {
      value: 'AI/tool-assisted',
      confidence: 'medium',
      evidence: `Forecasting tool detected: ${matchedApp?.Name || matchedPkg}`,
    };
  } else if (hasCRMForecast) {
    const usageNote = forecastingItemCount > 1000
      ? ` (heavy usage: ${forecastingItemCount.toLocaleString()} forecast items)`
      : forecastingItemCount > 0
        ? ` (${forecastingItemCount.toLocaleString()} forecast items)`
        : ' (configured, usage unknown)';
    preFill.D3 = {
      value: 'CRM forecast tool',
      confidence: 'medium',
      evidence: `${forecastingTypes.length} CRM forecasting type(s)${usageNote}`,
    };
  }
}

/**
 * D4: Growth model -- infer from ARR tracking + bookings split + segment fields.
 * ARR + bookings split + segments -> "Yes, comprehensive"
 * ARR + some tracking -> "Partial"
 */
function inferD4(preFill, arrAggregate, wonOppsByType, accountFields) {
  const hasARR = accountFields.some((f) => ARR_FIELD_PATTERN.test(f.name || '') || ARR_FIELD_PATTERN.test(f.label || ''));
  const hasBookingsSplit = wonOppsByType.length > 1;
  const hasSegments = accountFields.some((f) => SEGMENT_FIELD_PATTERN.test(f.name || '') || SEGMENT_FIELD_PATTERN.test(f.label || ''));
  const hasRevenue = arrAggregate.length > 0 && (arrAggregate[0]?.total || 0) > 0;

  if (hasARR && hasBookingsSplit && hasSegments) {
    preFill.D4 = {
      value: 'Yes, comprehensive',
      confidence: 'medium',
      evidence: 'ARR field, bookings split by type, and segment fields all detected',
    };
  } else if (hasARR || (hasRevenue && hasBookingsSplit)) {
    preFill.D4 = {
      value: 'Partial',
      confidence: 'medium',
      evidence: `${hasARR ? 'ARR field' : 'Revenue tracking'} detected${hasBookingsSplit ? ' with bookings split' : ''}`,
    };
  }
}

/**
 * D5: Report distribution -- check for scheduled reports.
 * Non-empty -> "Automated schedule" (HIGH confidence)
 */
function inferD5(preFill, reportSchedules) {
  if (reportSchedules.length === 0) return;

  preFill.D5 = {
    value: 'Automated schedule',
    confidence: 'high',
    evidence: `${reportSchedules.length} scheduled report(s) found`,
  };
}

/**
 * D6: Playbooks -- check enablement packages, knowledge articles, and content versions.
 * Enablement package (Highspot, Seismic) -> "Yes in enablement platform"
 * Knowledge articles match -> "Yes in enablement platform"
 * Content versions match -> "Yes in docs"
 */
function inferD6(preFill, knowledgeArticles, contentVersions, packageNames) {
  const enablementPkg = packageNames.find((n) => ENABLEMENT_PACKAGE_PATTERN.test(n));
  if (enablementPkg) {
    preFill.D6 = {
      value: 'Yes in enablement platform',
      confidence: 'medium',
      evidence: `Enablement platform detected: ${enablementPkg}`,
    };
    return;
  }

  const matchingArticle = knowledgeArticles.find((a) =>
    PLAYBOOK_PATTERN.test(a.Title || '')
  );

  const matchingContent = contentVersions.find((cv) =>
    PLAYBOOK_PATTERN.test(cv.Title || '')
  );

  if (matchingArticle) {
    preFill.D6 = {
      value: 'Yes in enablement platform',
      confidence: 'medium',
      evidence: `Enablement content in Knowledge: "${matchingArticle.Title}"`,
    };
  } else if (matchingContent) {
    preFill.D6 = {
      value: 'Yes in docs',
      confidence: 'medium',
      evidence: `Enablement content in Files: "${matchingContent.Title}"`,
    };
  }
}

/**
 * Power 10 metrics (D5_arr through D5_cycle) -- use data signals + report names.
 * Data-backed signals take precedence over report name matching.
 * "Automated" = can report from CRM data
 * "Manual calc" = data exists but needs manual computation
 */
function inferPower10(preFill, reportNames, wonOppsByType, leadConversionCount,
  contractCount, oppFields, accountFields, stageHistoryCount) {
  const hasARR = accountFields.some((f) => ARR_FIELD_PATTERN.test(f.name || '') || ARR_FIELD_PATTERN.test(f.label || ''));
  const hasSegments = accountFields.some((f) => SEGMENT_FIELD_PATTERN.test(f.name || '') || SEGMENT_FIELD_PATTERN.test(f.label || ''));
  const hasBookingsSplit = wonOppsByType.length > 1;
  const hasLeadConversion = extractCount(leadConversionCount) > 0;
  const hasContracts = contractCount > 0;
  const hasChurnField = oppFields.some((f) => CHURN_FIELD_PATTERN.test(f.name || '') || CHURN_FIELD_PATTERN.test(f.label || ''));
  const hasRenewalTracking = oppFields.some((f) => /renewal|contract.?end|expir/i.test(f.name || '') || /renewal|contract.?end|expir/i.test(f.label || ''));
  const hasStageHistory = stageHistoryCount > 0;
  const hasDealSource = oppFields.some((f) => /deal_source|dealSource|original_source|LeadSource|opportunity.?source/i.test(f.name || ''));

  // Data-backed Power 10 inferences
  const dataInferences = {
    D5_arr: hasARR && hasSegments ? 'Automated' : hasARR ? 'Manual calc' : null,
    D5_bookings: hasBookingsSplit ? 'Automated' : null,
    D5_pipeline: hasDealSource ? 'Automated' : null,
    D5_mql: hasLeadConversion ? 'Automated' : null,
    D5_gross_churn: hasChurnField && hasBookingsSplit ? 'Automated' : hasRenewalTracking ? 'Manual calc' : null,
    D5_grr: hasARR && hasContracts ? 'Manual calc' : null,
    D5_nrr: hasARR && hasContracts && hasBookingsSplit ? 'Manual calc' : null,
    D5_mql_opp: hasLeadConversion ? 'Automated' : null,
    D5_opp_cw: 'Automated', // Always reportable (standard fields)
    D5_cycle: hasStageHistory ? 'Automated' : 'Automated', // Always reportable via CreatedDate-CloseDate
  };

  // Apply data-backed inferences first
  for (const [key, value] of Object.entries(dataInferences)) {
    if (value) {
      preFill[key] = {
        value,
        confidence: 'medium',
        evidence: getDataEvidence(key, { hasARR, hasSegments, hasBookingsSplit, hasLeadConversion,
          hasContracts, hasChurnField, hasRenewalTracking, hasStageHistory, hasDealSource }),
      };
    }
  }

  // Supplement with report name matches (upgrade to Automated if report exists)
  for (const { key, pattern } of POWER_10_PATTERNS) {
    const matchingReport = reportNames.find((r) => pattern.test(r.Name || ''));
    if (matchingReport) {
      // Report exists — upgrade to Automated if was Manual calc, or set if not yet set
      if (!preFill[key] || preFill[key].value === 'Manual calc') {
        preFill[key] = {
          value: 'Automated',
          confidence: 'medium',
          evidence: `Report found: "${matchingReport.Name}"`,
        };
      }
    }
  }
}

/**
 * Generate evidence string for data-backed Power 10 inferences.
 */
function getDataEvidence(key, signals) {
  const evidenceMap = {
    D5_arr: signals.hasSegments ? 'ARR and segment fields on Account' : 'ARR field on Account (segment field missing)',
    D5_bookings: 'Multiple opportunity types found (new vs expansion)',
    D5_pipeline: 'Deal source field on Opportunity',
    D5_mql: 'Lead conversion data available',
    D5_gross_churn: signals.hasChurnField ? 'Churn field detected on Opportunity' : 'Renewal tracking fields detected',
    D5_grr: 'ARR field + contract records detected',
    D5_nrr: 'ARR + contracts + bookings split detected',
    D5_mql_opp: 'Lead conversion data available',
    D5_opp_cw: 'Standard Opportunity fields (always reportable)',
    D5_cycle: 'Reportable via Opportunity CreatedDate to CloseDate',
  };
  return evidenceMap[key] || 'Data signals detected';
}

// ── Utility Helpers ──

/**
 * Extract a count from a SOQL COUNT() result.
 * Handles various shapes: number, array with {cnt}, {total}, {expr0}.
 */
function extractCount(queryResult) {
  if (!queryResult) return 0;
  if (typeof queryResult === 'number') return queryResult;
  if (Array.isArray(queryResult) && queryResult[0]) {
    return queryResult[0].cnt || queryResult[0].total || queryResult[0].expr0 || 0;
  }
  return 0;
}

/**
 * Get fields array from an object describe, safely.
 * @param {object} objectDescribe - Salesforce object describe
 * @returns {Array} Fields array
 */
function getFields(objectDescribe) {
  if (!objectDescribe || !Array.isArray(objectDescribe.fields)) return [];
  return objectDescribe.fields;
}
