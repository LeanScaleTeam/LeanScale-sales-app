import { useState, useEffect, useRef } from 'react';
import { useWorkflow, STEPS } from './WorkflowContext';

const completionSummaries = {
  diagnostic: (data) => ({
    title: 'Diagnostic Complete',
    items: [
      data.diagnosticStats?.total && `${data.diagnosticStats.total} processes assessed`,
      data.diagnosticStats?.warning && `${data.diagnosticStats.warning} warnings found`,
      data.diagnosticStats?.priority && `${data.diagnosticStats.priority} priority items`,
    ].filter(Boolean),
  }),
  engagement: (data) => ({
    title: 'Engagement Reviewed',
    items: [
      data.engagementRecommendation?.summary?.projectCount && `${data.engagementRecommendation.summary.projectCount} projects recommended`,
      data.engagementRecommendation?.summary?.recommendedTier?.label && `${data.engagementRecommendation.summary.recommendedTier.label} tier`,
      data.engagementRecommendation?.summary?.avgProjectHours && `${data.engagementRecommendation.summary.avgProjectHours} total hours`,
    ].filter(Boolean),
  }),
  scope: (data) => ({
    title: 'Scope Defined',
    items: [
      data.scopeSelections && `${data.scopeSelections.length} items in scope`,
    ].filter(Boolean),
  }),
  sow: (data) => ({
    title: 'SOW Built',
    items: [
      data.sowId && 'Statement of Work drafted',
    ].filter(Boolean),
  }),
};

export default function StepTransition({ direction = 'forward', previousStepId, children }) {
  const { steps, currentStep, nextStep: goNext } = useWorkflow();
  const [animating, setAnimating] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const containerRef = useRef(null);
  const { data } = useWorkflow();

  const currentIdx = steps.findIndex(s => s.id === currentStep);
  const nextStepObj = currentIdx < steps.length - 1 ? steps[currentIdx + 1] : null;
  const prevStepObj = previousStepId ? steps.find(s => s.id === previousStepId) : null;
  const summary = prevStepObj ? completionSummaries[prevStepObj.id]?.(data) : null;

  useEffect(() => {
    if (previousStepId && summary?.items?.length > 0) {
      setShowSummary(true);
      const timer = setTimeout(() => setShowSummary(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [previousStepId]);

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 400);
    return () => clearTimeout(timer);
  }, [currentStep]);

  const slideDirection = direction === 'forward' ? 1 : -1;

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Completion summary toast */}
      {showSummary && summary && (
        <div style={{
          position: 'fixed',
          top: 130,
          right: 24,
          zIndex: 1000,
          background: 'white',
          border: '1px solid #dcfce7',
          borderLeft: '4px solid #22c55e',
          borderRadius: 12,
          padding: '1rem 1.25rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          maxWidth: 300,
          animation: 'slideInRight 0.3s ease-out',
        }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem', color: '#166534' }}>
            ✓ {summary.title}
          </div>
          {summary.items.map((item, i) => (
            <div key={i} style={{ fontSize: '0.8rem', color: '#4b5563', marginBottom: 2 }}>
              • {item}
            </div>
          ))}
        </div>
      )}

      {/* Animated content */}
      <div
        ref={containerRef}
        style={{
          transform: animating ? `translateX(${slideDirection * 30}px)` : 'translateX(0)',
          opacity: animating ? 0 : 1,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
        }}
      >
        {children}
      </div>

      {/* Continue CTA at bottom */}
      {nextStepObj && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem 2rem',
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
          borderRadius: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid #e9d5ff',
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 2 }}>
              Next step
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--ls-purple)' }}>
              {nextStepObj.icon} {nextStepObj.label}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              {nextStepObj.description}
            </div>
          </div>
          <button
            onClick={goNext}
            style={{
              padding: '0.75rem 2rem',
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 100,
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(124,58,237,0.3)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(124,58,237,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(124,58,237,0.3)'; }}
          >
            Continue to {nextStepObj.label} →
          </button>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
