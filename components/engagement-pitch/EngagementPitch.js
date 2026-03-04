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
 * - processes: v1 process data array
 * - power10Data: Power 10 metrics array
 * - managedServices: managed services health array
 * - companyProfile: intake answers { arrRange, repCount, gtmMotion }
 * - onBuildSow: callback to create SOW
 */
export default function EngagementPitch({
  diagnosticVersion,
  v2Result,
  processes,
  power10Data,
  managedServices,
  companyProfile,
  onBuildSow,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTierId, setSelectedTierId] = useState(null);

  const context = parseIntakeContext(companyProfile);

  // Determine items for findings (v2 items or v1 processes)
  const items = diagnosticVersion === 2 && v2Result?.items
    ? v2Result.items
    : (processes || []);

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
    if (diagnosticVersion === 2 && v2Result?.items) {
      return buildEngagementRoadmap(v2Result.items, activeTier, {
        processes: processes || [],
        managedServices: managedServices || [],
      });
    }
    return buildEngagementRoadmapV1(processes || [], activeTier, managedServices || []);
  }, [diagnosticVersion, v2Result, processes, managedServices, activeTier]);

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
            />
          )}

          {step.id === 'findings' && (
            <FindingsWalkthrough
              items={items}
              companyProfile={companyProfile}
            />
          )}

          {step.id === 'roadmap' && (
            <PhaseRoadmap roadmap={roadmap} />
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
              roadmap={roadmap}
              onBuildSow={onBuildSow}
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
