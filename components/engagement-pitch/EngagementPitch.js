import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Power10Anchor from './Power10Anchor';
import FindingsWalkthrough from './FindingsWalkthrough';
import PhaseRoadmap from './PhaseRoadmap';
import TierSelector from './TierSelector';
import Phase1Scope from './Phase1Scope';
import { buildEngagementRoadmap, buildEngagementRoadmapV1 } from '../../lib/engagement-roadmap';
import { recommendTier } from '../../data/engagement-tiers';
import { parseIntakeContext, estimateTotalCostOfInaction, calculatePower10Summary } from '../../lib/impact-calculator';
import { getCompetencyById, V3_COMPETENCIES } from '../../lib/diagnostic-engine/v3/constants-v3';
import { enrichFromPlaybooks } from '../../lib/playbook-enrichment';

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
function reconstructCompetencies(scoreCard) {
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
function adaptV3ToPitchItems(competencies) {
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
  { id: 'power10', label: 'Power 10', icon: '📊' },
  { id: 'findings', label: 'Findings', icon: '🔍' },
  { id: 'roadmap', label: 'Roadmap', icon: '🗺️' },
  { id: 'tiers', label: 'Engagement', icon: '💼' },
  { id: 'start', label: 'Let\'s Start', icon: '🚀' },
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
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState(null);

  // Override state — initialized from persisted overrides
  const [overrides, setOverrides] = useState(
    engagementOverrides || { power10: {}, findings: {}, roadmap: {} }
  );

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

  const activeTier = selectedTierId || autoTier;

  // Build roadmap
  const roadmap = useMemo(() => {
    if ((diagnosticVersion === 2 && v2Result?.items) || (diagnosticVersion === 3 && v3Result?.competencies)) {
      return buildEngagementRoadmap(items, activeTier, {
        processes: processes || [],
        managedServices: managedServices || [],
      });
    }
    return buildEngagementRoadmapV1(processes || [], activeTier, managedServices || []);
  }, [diagnosticVersion, v2Result, v3Result, items, processes, managedServices, activeTier]);

  // Apply roadmap overrides (phase reassignment, exclusions)
  const effectiveRoadmap = useMemo(() => {
    if (!roadmap?.phases || !overrides?.roadmap) return roadmap;
    const roadmapOv = overrides.roadmap;
    if (Object.keys(roadmapOv).length === 0) return roadmap;

    const phases = roadmap.phases.map(phase => ({
      ...phase,
      projects: phase.projects
        .filter(p => !roadmapOv[p.serviceId]?.excluded)
        .slice(), // shallow copy
    }));

    // Handle phase reassignments
    for (const [serviceId, ov] of Object.entries(roadmapOv)) {
      if (!ov.phase || ov.excluded) continue;
      // Find and move the project
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Step Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-1)',
        padding: 'var(--space-2)',
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-lg, 12px)',
      }}>
        {STEPS.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentStep(idx)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              padding: 'var(--space-2) var(--space-3)',
              fontSize: 'var(--text-sm)',
              fontWeight: currentStep === idx ? 'var(--font-semibold)' : 'var(--font-normal)',
              borderRadius: 'var(--radius-md, 8px)',
              border: 'none',
              background: currentStep === idx ? 'white' : 'transparent',
              color: currentStep === idx ? '#6C5CE7' : 'var(--text-muted)',
              cursor: 'pointer',
              boxShadow: currentStep === idx ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease',
              position: 'relative',
            }}
          >
            <span>{s.icon}</span>
            <span className="pitch-step-label">{s.label}</span>
            {currentStep === idx && (
              <motion.div
                layoutId="pitch-step-indicator"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '10%',
                  right: '10%',
                  height: 2,
                  background: '#6C5CE7',
                  borderRadius: 1,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
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
            />
          )}

          {step.id === 'roadmap' && (
            <PhaseRoadmap
              roadmap={effectiveRoadmap}
              editMode={editMode}
              onOverride={updateOverrides}
              customerPath={customerPath}
              overrides={overrides}
            />
          )}

          {step.id === 'tiers' && (
            <TierSelector
              selectedTierId={activeTier}
              recommendedTierId={autoTier}
              onSelectTier={setSelectedTierId}
            />
          )}

          {step.id === 'start' && (
            <Phase1Scope
              roadmap={effectiveRoadmap}
              customerPath={customerPath}
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
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            fontSize: 'var(--text-sm)',
            borderRadius: 'var(--radius-md, 8px)',
            border: '1px solid var(--border-color)',
            background: 'white',
            color: currentStep === 0 ? 'var(--text-muted)' : '#1a1a2e',
            cursor: currentStep === 0 ? 'default' : 'pointer',
            opacity: currentStep === 0 ? 0.5 : 1,
          }}
        >
          Previous
        </button>

        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          {currentStep + 1} of {STEPS.length}
        </div>

        <button
          onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
          disabled={currentStep === STEPS.length - 1}
          style={{
            padding: 'var(--space-2) var(--space-4)',
            fontSize: 'var(--text-sm)',
            borderRadius: 'var(--radius-md, 8px)',
            border: 'none',
            background: currentStep === STEPS.length - 1 ? 'var(--bg-subtle)' : '#6C5CE7',
            color: currentStep === STEPS.length - 1 ? 'var(--text-muted)' : 'white',
            cursor: currentStep === STEPS.length - 1 ? 'default' : 'pointer',
            fontWeight: 'var(--font-semibold)',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
