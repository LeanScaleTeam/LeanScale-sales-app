import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Power10Anchor from './Power10Anchor';
import FindingsWalkthrough from './FindingsWalkthrough';
import PhaseRoadmap from './PhaseRoadmap';
import TierSelector from './TierSelector';
import Phase1Scope from './Phase1Scope';
import { buildEngagementRoadmap, buildEngagementRoadmapV1 } from '../../lib/engagement-roadmap';
import { managedServices as managedServicesCatalog, functionLabels } from '../../data/services-catalog';
import { TOOL_CATALOG } from '../diagnostic/v3/GTMLandscape';

// Map GTMLandscape tool IDs → managedServices catalog service IDs
const TOOL_TO_SERVICE_ID = {
  'salesforce': 'salesforce-impl',
  'hubspot-crm': 'hubspot-impl',
  'hubspot-marketing': 'hubspot-impl',
  'clay': 'clay-impl',
  'looker': 'looker-impl',
  'tableau': 'tableau-impl',
  'domo': 'domo-impl',
  'powerbi': 'powerbi-impl',
  'census': 'census-impl',
  'hightouch': 'hightouch-impl',
  'fivetran': 'fivetran-impl',
  'segment': 'segment-impl',
  'clearbit': 'clearbit-impl',
  'zoominfo': 'zoominfo-impl',
  'apollo': 'apollo-impl',
  'lusha': 'lusha-impl',
  'cognism': 'cognism-impl',
  'demandbase': 'demandbase-impl',
  '6sense': '6sense-impl',
  'drift': 'drift-impl',
  'intercom-mktg': 'intercom-impl',
  'marketo': 'marketo-impl',
  'pardot': 'pardot-impl',
  'eloqua': 'eloqua-impl',
  'mailchimp': 'mailchimp-impl',
  'klaviyo': 'klaviyo-impl',
  'customer-io': 'customer-io-impl',
  'braze': 'braze-impl',
  'iterable': 'iterable-impl',
  'sendgrid': 'sendgrid-impl',
  'unbounce': 'unbounce-impl',
  'instapage': 'instapage-impl',
  'calendly': 'calendly-impl',
  'chili-piper': 'chilipiper-impl',
  'bizible': 'bizible-impl',
  'dreamdata': 'dreamdata-impl',
  'hockeystack': 'hockeystack-impl',
  'on24': 'on24-impl',
  'goldcast': 'goldcast-impl',
  'outreach': 'outreach-impl',
  'salesloft': 'salesloft-impl',
  'gong': 'gong-impl',
  'chorus': 'chorus-impl',
  'clari': 'clari-impl',
  'aviso': 'aviso-impl',
  'docusign': 'docusign-impl',
  'pandadoc': 'pandadoc-impl',
  'conga': 'conga-impl',
  'dealpath': 'dealpath-impl',
  'linkedin-sales-nav': 'linkedin-sales-nav-impl',
  'seismic': 'seismic-impl',
  'highspot': 'highspot-impl',
  'showpad': 'showpad-impl',
  'captivateiq': 'captivateiq-impl',
  'spiff': 'spiff-impl',
  'xactly': 'xactly-impl',
  'dealfront': 'dealfront-impl',
  'gainsight': 'gainsight-impl',
  'churnzero': 'churnzero-impl',
  'zendesk': 'zendesk-impl',
  'vitally': 'vitally-impl',
  'totango': 'totango-impl',
  'freshdesk': 'freshdesk-impl',
  'pendo': 'pendo-impl',
  'userguiding': 'userguiding-impl',
  'delighted': 'delighted-impl',
  'surveymonkey': 'surveymonkey-impl',
  'typeform': 'typeform-impl',
};

// Build a flat lookup: serviceId → service object from catalog
const MANAGED_CATALOG_LOOKUP = {};
for (const [categoryKey, services] of Object.entries(managedServicesCatalog)) {
  for (const s of services) {
    MANAGED_CATALOG_LOOKUP[s.id] = { ...s, primaryFunction: functionLabels[categoryKey] || 'Cross Functional' };
  }
}
import { recommendTier, getTierById } from '../../data/engagement-tiers';
import { parseIntakeContext, estimateTotalCostOfInaction, calculatePower10Summary } from '../../lib/impact-calculator';
import { getCompetencyById, V3_COMPETENCIES } from '../../lib/diagnostic-engine/v3/constants-v3';
import { enrichFromPlaybooks } from '../../lib/playbook-enrichment';
import { managedServicesHealth } from '../../data/diagnostic-data';

/**
 * Build a context-aware rationale for each managed service based on actual findings.
 * Returns a short sentence referencing the specific issues found.
 */
function buildManagedServiceRationale(serviceId, items) {
  const warnings = items.filter(i => i.status === 'warning');
  const careful = items.filter(i => i.status === 'careful');

  if (serviceId === 'crm-admin') {
    const crmIssues = [...warnings, ...careful].filter(i =>
      i.pillar === 'systems' || i.layer === 'foundation' ||
      (i.name && /crm|salesforce|hubspot|data quality|hygiene/i.test(i.name))
    );
    if (crmIssues.length > 0) {
      return `Included because ${crmIssues.length} system${crmIssues.length !== 1 ? 's' : ''} and process finding${crmIssues.length !== 1 ? 's' : ''} require ongoing CRM maintenance to stay fixed.`;
    }
    return 'Ongoing CRM configuration, user management, and system maintenance to keep your revenue engine running.';
  }

  if (serviceId === 'enrichment-tools-admin') {
    const dataIssues = [...warnings, ...careful].filter(i =>
      i.name && /enrich|data|contact|account|intent/i.test(i.name)
    );
    if (dataIssues.length > 0) {
      return `Included because your diagnostic flagged data quality and enrichment gaps — these tools need active management to maintain signal quality.`;
    }
    return 'Manage data enrichment tools and integrations to maintain high-quality contact and account data.';
  }

  if (serviceId === 'ongoing-reporting') {
    const reportingIssues = [...warnings, ...careful].filter(i =>
      i.pillar === 'reporting' || (i.name && /report|dashb|forecast|metric|analyt/i.test(i.name))
    );
    if (reportingIssues.length > 0) {
      return `Included because ${reportingIssues.length} reporting gap${reportingIssues.length !== 1 ? 's' : ''} ${reportingIssues.length !== 1 ? 'were' : 'was'} found — your team needs reliable, maintained dashboards as we build.`;
    }
    return 'Regular reporting updates, dashboard maintenance, and ad-hoc analysis for GTM leadership.';
  }

  return '';
}

/**
 * Map v3 pillar to v2-style layer for phase assignment and display.
 */
const PILLAR_TO_LAYER = {
  planning: 'maturity',
  people: 'maturity',
  process: 'foundation',
  systems: 'foundation',
  reporting: 'maturity',
  enablement: 'motions',
};

/**
 * Derive a primary function from v3 department scores.
 * Returns the department with the lowest (worst) score, or 'Cross Functional' for multi-dept.
 */
function derivePrimaryFunction(departments) {
  if (!departments) return 'Cross Functional';
  const scored = Object.entries(departments).filter(([, s]) => s !== null);
  if (scored.length === 0) return 'Cross Functional';
  if (scored.length >= 3) return 'Cross Functional';

  const DEPT_LABELS = { marketing: 'Marketing', sales: 'Sales', cs: 'Customer Success', partners: 'Partnerships' };
  // Return the department with the lowest score (most problematic)
  scored.sort((a, b) => a[1] - b[1]);
  return DEPT_LABELS[scored[0][0]] || 'Cross Functional';
}

/**
 * Reconstruct competency objects from score_card + static V3_COMPETENCIES.
 * score_card is { [competencyId]: { [dept]: score|null } }
 */
export function reconstructCompetencies(scoreCard) {
  if (!scoreCard) return [];
  return V3_COMPETENCIES.map(staticComp => {
    const deptScores = scoreCard[staticComp.id];
    if (!deptScores) return null;
    return {
      id: staticComp.id,
      name: staticComp.name,
      pillar: staticComp.pillar,
      source: staticComp.source,
      serviceIds: staticComp.serviceIds,
      departments: deptScores,
    };
  }).filter(Boolean);
}

/**
 * Convert v3 competencies into pitch-compatible items.
 * Accepts either full competency objects or reconstructed ones from score_card.
 */
export function adaptV3ToPitchItems(competencies) {
  if (!competencies || competencies.length === 0) return [];

  return competencies.map(comp => {
    const scores = Object.values(comp.departments || {}).filter(s => s !== null);
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;

    let status;
    if (avgScore === null) status = 'healthy'; // unscored = skip
    else if (avgScore >= 4) status = 'healthy';
    else if (avgScore >= 2.5) status = 'careful';
    else status = 'warning';

    // Join with static competency data and playbook content
    const staticComp = getCompetencyById(comp.id);
    const svcIds = comp.serviceIds || staticComp?.serviceIds || [];
    const enrichment = enrichFromPlaybooks(svcIds);

    return {
      id: comp.id,
      name: comp.name,
      layer: PILLAR_TO_LAYER[comp.pillar] || 'foundation',
      pillar: comp.pillar,
      source: comp.source,
      status,
      avgScore,
      weight: 1,
      serviceIds: svcIds,
      primaryFunction: derivePrimaryFunction(comp.departments),
      description: enrichment.description || staticComp?.description || comp.name,
      impactTemplate: enrichment.impactTemplate,
      outcomeStatement: enrichment.outcomeStatement,
      outcomes: enrichment.outcomes,
      power10Metrics: enrichment.power10Metrics,
    };
  });
}

const STEPS = [
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'tiers', label: 'Investment' },
  { id: 'start', label: 'Availability' },
];

/**
 * EngagementPitch — Interactive walkthrough container for prospect calls.
 *
 * Props:
 * - diagnosticVersion: 1 | 2 | 3
 * - v2Result: { items, scores, companyProfile, actionableServiceIds }
 * - v3Result: { competencies, company_profile, roadmap, ... }
 * - processes: v1 process data array
 * - power10Data: Power 10 metrics array
 * - managedServices: managed services health array
 * - companyProfile: intake answers { arrRange, repCount, gtmMotion }
 * - editMode: boolean for edit toggle
 * - engagementOverrides: persisted overrides object
 * - onOverridesChange: callback to save overrides
 * - customerPath: function to build customer-scoped URLs
 */
export default function EngagementPitch({
  diagnosticVersion,
  v2Result,
  v3Result,
  processes,
  power10Data,
  managedServices,
  companyProfile,
  editMode,
  engagementOverrides,
  onOverridesChange,
  customerPath,
  transcriptAssessments,
  crmSignals = {},
  crmType = 'unknown',
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState(
    () => engagementOverrides?.engagement_type?.toLowerCase() || null
  );
  const [showAll, setShowAll] = useState(false);

  // Override state — initialized from persisted overrides
  const [overrides, setOverrides] = useState(
    engagementOverrides || { power10: {}, findings: {}, roadmap: {} }
  );

  // Sync overrides and selectedTierId when the prop arrives asynchronously
  // (EngagementPitch can mount before DiagnosticResults finishes loading from DB)
  useEffect(() => {
    if (!engagementOverrides) return;
    setOverrides((prev) => {
      // Only sync if the DB value differs from current local state
      if (prev.engagement_type === engagementOverrides.engagement_type &&
          prev.monthly_investment === engagementOverrides.monthly_investment) {
        return prev;
      }
      return engagementOverrides;
    });
    setSelectedTierId((prev) => {
      const incoming = engagementOverrides.engagement_type?.toLowerCase() || null;
      return prev || incoming;
    });
  }, [engagementOverrides]);

  const context = parseIntakeContext(companyProfile);

  // Helper to update a section of overrides and notify parent
  function updateOverrides(section, key, value) {
    setOverrides(prev => {
      const next = {
        ...prev,
        [section]: { ...prev[section], [key]: { ...prev[section]?.[key], ...value } },
      };
      onOverridesChange?.(next);
      return next;
    });
  }

  // Determine items for findings (v3 competencies, v2 items, or v1 processes)
  const items = useMemo(() => {
    if (diagnosticVersion === 3 && v3Result) {
      // v3Result may have full competencies (from engine run) or score_card (from API load)
      const comps = v3Result.competencies || reconstructCompetencies(v3Result.score_card);
      if (comps.length > 0) return adaptV3ToPitchItems(comps);
    }
    if (diagnosticVersion === 2 && v2Result?.items) {
      return v2Result.items;
    }
    return processes || [];
  }, [diagnosticVersion, v3Result, v2Result, processes]);

  // Auto-recommend tier
  const autoTier = useMemo(() => {
    const warningCount = items.filter(i => i.status === 'warning').length;
    const power10RedCount = (power10Data || []).filter(
      m => m.ableToReport === 'warning' || m.ableToReport === 'unable'
    ).length;
    return recommendTier({
      arrRange: companyProfile?.arrRange || context.arrRange,
      repCount: companyProfile?.repCount || context.repCount,
      warningCount,
      power10RedCount,
    });
  }, [items, power10Data, companyProfile, context]);

  const persistedTierId = overrides?.engagement_type?.toLowerCase() || null;
  const activeTier = selectedTierId || persistedTierId || autoTier;

  // Persist tier selection to engagementOverrides so Exec Summary / Details stay in sync
  function handleSelectTier(tierId) {
    setSelectedTierId(tierId);
    const tier = getTierById(tierId);
    if (!tier) return;
    const next = {
      ...overrides,
      engagement_type: tier.name,
      monthly_investment: tier.monthlyPrice,
      monthly_hours: tier.monthlyHours,
    };
    setOverrides(next);
    onOverridesChange?.(next);
  }

  // Resolve managed services: the 3 core ops every LeanScale customer gets
  const resolvedManagedServices = useMemo(() => {
    if (managedServices === 'health') {
      return managedServicesHealth
        .filter(ms => ms.addToEngagement)
        .map(ms => ({
          serviceId: ms.serviceId,
          name: ms.name,
          hoursPerMonth: ms.hoursPerMonth,
          description: buildManagedServiceRationale(ms.serviceId, items),
        }));
    }
    return managedServices || [];
  }, [managedServices, items]);

  // Build roadmap
  const roadmap = useMemo(() => {
    if ((diagnosticVersion === 2 && v2Result?.items) || (diagnosticVersion === 3 && v3Result?.competencies)) {
      return buildEngagementRoadmap(items, activeTier, {
        processes: processes || [],
        managedServices: [],
        includeAll: showAll,
      });
    }
    return buildEngagementRoadmapV1(processes || [], activeTier, []);
  }, [diagnosticVersion, v2Result, v3Result, items, processes, activeTier, showAll]);

  // Compute which tool impls to show based on systems landscape detection
  const systemsToolImpls = useMemo(() => {
    const manualOverrides = overrides?.gtmLandscape?.tools || {};
    const seen = new Set();
    const result = [];
    for (const tool of TOOL_CATALOG) {
      const serviceId = TOOL_TO_SERVICE_ID[tool.id];
      if (!serviceId || seen.has(serviceId)) continue;
      const status = manualOverrides[tool.id] ?? tool.detectFn(crmSignals, crmType);
      if (status === 'confirmed' || status === 'likely') {
        const catalogEntry = MANAGED_CATALOG_LOOKUP[serviceId];
        if (catalogEntry) {
          seen.add(serviceId);
          result.push({
            serviceId: catalogEntry.id,
            name: catalogEntry.name,
            description: catalogEntry.description,
            icon: catalogEntry.icon,
            primaryFunction: catalogEntry.primaryFunction,
          });
        }
      }
    }
    return result;
  }, [crmSignals, crmType, overrides?.gtmLandscape?.tools]);

  // Filter managed services by exclusion overrides; include systems-detected tool impls always,
  // and all catalog tool impls when showAll
  const effectiveManagedServices = useMemo(() => {
    const roadmapOv = overrides?.roadmap || {};
    // Suppress the default placeholders (CRM Admin, Enrichment Tools Admin, Ongoing Reporting)
    // once a real diagnostic has been run — they're only for demo / pre-diagnostic state
    const diagnosticRan = diagnosticVersion === 3 && v3Result?.competencies?.length > 0;
    const base = diagnosticRan
      ? []
      : resolvedManagedServices.filter(ms => !roadmapOv[ms.serviceId]?.excluded);
    const existingIds = new Set(base.map(ms => ms.serviceId));

    // Always: add tool impls for confirmed/likely tools from systems landscape
    const fromSystems = systemsToolImpls.filter(
      ms => !existingIds.has(ms.serviceId) && !roadmapOv[ms.serviceId]?.excluded
    );
    fromSystems.forEach(ms => existingIds.add(ms.serviceId));

    if (!showAll) return [...base, ...fromSystems];

    // showAll: also append every remaining catalog tool impl
    const allToolImpls = Object.entries(managedServicesCatalog).flatMap(([categoryKey, services]) =>
      services.map(s => ({
        serviceId: s.id,
        name: s.name,
        description: s.description,
        icon: s.icon,
        primaryFunction: functionLabels[categoryKey] || 'Cross Functional',
      }))
    ).filter(ms => !existingIds.has(ms.serviceId) && !roadmapOv[ms.serviceId]?.excluded);

    return [...base, ...fromSystems, ...allToolImpls];
  }, [resolvedManagedServices, systemsToolImpls, overrides?.roadmap, showAll]);

  // Apply roadmap overrides (phase reassignment, exclusions)
  const effectiveRoadmap = useMemo(() => {
    if (!roadmap?.phases) return roadmap;
    const roadmapOv = overrides?.roadmap || {};

    const phases = roadmap.phases.map((phase) => ({
      ...phase,
      projects: phase.projects
        .filter(p => !roadmapOv[p.serviceId]?.excluded)
        .slice(),
    }));

    // Handle phase reassignments
    for (const [serviceId, ov] of Object.entries(roadmapOv)) {
      if (!ov.phase || ov.excluded) continue;
      let movedProject = null;
      for (const phase of phases) {
        const idx = phase.projects.findIndex(p => p.serviceId === serviceId);
        if (idx !== -1) {
          movedProject = phase.projects.splice(idx, 1)[0];
          break;
        }
      }
      if (movedProject) {
        const target = phases.find(p => p.id === ov.phase);
        if (target) target.projects.push(movedProject);
      }
    }

    return { ...roadmap, phases };
  }, [roadmap, overrides?.roadmap]);

  // Cost of inaction
  const costOfInaction = useMemo(() => {
    return estimateTotalCostOfInaction(items, context);
  }, [items, context]);

  const step = STEPS[currentStep];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {/* Step Navigation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        padding: 'var(--space-2) var(--space-3)',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 'var(--radius-lg, 12px)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
      }}>
        {STEPS.map((s, idx) => {
          const isActive = currentStep === idx;
          const isCompleted = currentStep > idx;
          const isFuture = currentStep < idx;
          return (
            <button
              key={s.id}
              onClick={() => setCurrentStep(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 600 : 400,
                borderRadius: '6px',
                border: 'none',
                background: isActive ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                color: isActive ? '#a78bfa' : isFuture ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.55)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
              }}
            >
              <span style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 700,
                flexShrink: 0,
                background: isActive ? '#7c3aed' : isCompleted ? 'rgba(124,58,237,0.35)' : 'rgba(255,255,255,0.08)',
                color: isActive || isCompleted ? 'white' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.15s ease',
              }}>
                {isCompleted ? '✓' : idx + 1}
              </span>
              <span className="pitch-step-label">{s.label}</span>
              {isActive && (
                <motion.div
                  layoutId="pitch-step-indicator"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '10%',
                    right: '10%',
                    height: 2,
                    background: '#7c3aed',
                    borderRadius: 1,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
        <span style={{
          fontSize: 'var(--text-2xs)',
          color: 'rgba(255,255,255,0.2)',
          fontWeight: 500,
          paddingLeft: 'var(--space-2)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          marginLeft: 'var(--space-1)',
        }}>
          {currentStep + 1} / {STEPS.length}
        </span>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {step.id === 'power10' && (
            <Power10Anchor
              power10Data={power10Data}
              costOfInaction={costOfInaction}
              editMode={editMode}
              overrides={overrides}
              onOverride={updateOverrides}
            />
          )}

          {step.id === 'findings' && (
            <FindingsWalkthrough
              items={items}
              companyProfile={companyProfile}
              editMode={editMode}
              overrides={overrides}
              onOverride={updateOverrides}
              customerPath={customerPath}
              transcriptAssessments={transcriptAssessments}
            />
          )}

          {step.id === 'roadmap' && (
            <PhaseRoadmap
              roadmap={effectiveRoadmap}
              managedServices={effectiveManagedServices}
              editMode={editMode}
              onOverride={updateOverrides}
              customerPath={customerPath}
              overrides={overrides}
              activeTier={activeTier}
              onSelectTier={handleSelectTier}
              showAll={showAll}
              onToggleShowAll={() => setShowAll(v => !v)}
            />
          )}

          {step.id === 'tiers' && (
            <TierSelector
              selectedTierId={activeTier}
              recommendedTierId={autoTier}
              onSelectTier={handleSelectTier}
            />
          )}

          {step.id === 'start' && (
            <Phase1Scope
              roadmap={effectiveRoadmap}
              customerPath={customerPath}
              editMode={editMode}
              onSelectCohort={(dateStr) => {
                const next = { ...overrides, start_date: dateStr };
                setOverrides(next);
                onOverridesChange?.(next);
              }}
              selectedStartDate={overrides.start_date || null}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Step Navigation Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-3) 0',
        borderTop: '1px solid var(--border-color)',
      }}>
        {/* Ghost Previous */}
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            fontSize: 'var(--text-sm)',
            borderRadius: 'var(--radius-md, 8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'transparent',
            color: currentStep === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
            cursor: currentStep === 0 ? 'default' : 'pointer',
            transition: 'all 0.15s',
          }}
        >
          ← Previous
        </button>

        {/* Solid purple Next — becomes muted on last step */}
        <button
          onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
          disabled={currentStep === STEPS.length - 1}
          style={{
            padding: 'var(--space-2) var(--space-5)',
            fontSize: 'var(--text-sm)',
            borderRadius: 'var(--radius-md, 8px)',
            border: 'none',
            background: currentStep === STEPS.length - 1
              ? 'rgba(255,255,255,0.06)'
              : '#7c3aed',
            color: currentStep === STEPS.length - 1
              ? 'rgba(255,255,255,0.25)'
              : 'white',
            cursor: currentStep === STEPS.length - 1 ? 'default' : 'pointer',
            fontWeight: 600,
            boxShadow: currentStep === STEPS.length - 1
              ? 'none'
              : '0 2px 12px rgba(124,58,237,0.35)',
            transition: 'all 0.15s',
          }}
        >
          {currentStep === STEPS.length - 1 ? 'Done' : `Next: ${STEPS[currentStep + 1]?.label} →`}
        </button>
      </div>
    </div>
  );
}
