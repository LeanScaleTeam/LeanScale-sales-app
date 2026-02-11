import { useWorkflow } from './WorkflowContext';

const stepStats = {
  diagnostic: (data) => data.diagnosticStats ? `${data.diagnosticStats.total} items` : null,
  engagement: (data) => data.engagementRecommendation?.summary?.projectCount ? `${data.engagementRecommendation.summary.projectCount} projects` : null,
  scope: (data) => data.scopeSelections ? `${data.scopeSelections.length} selected` : null,
  sow: (data) => data.sowId ? 'Draft ready' : null,
  review: () => null,
};

function StepIcon({ status }) {
  if (status === 'complete') return <span style={iconStyle('#22c55e')}>✓</span>;
  if (status === 'current') return <span style={iconStyle('var(--ls-purple-light)', true)}>●</span>;
  return <span style={iconStyle('#d1d5db')}>○</span>;
}

const iconStyle = (color, pulse = false) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'white',
  background: color,
  flexShrink: 0,
  ...(pulse ? { boxShadow: `0 0 0 4px rgba(124, 58, 237, 0.2)` } : {}),
});

export default function SalesWorkflowStepper() {
  const { steps, currentStep, completedSteps, data, goToStep } = useWorkflow();

  const getStatus = (stepId) => {
    if (stepId === currentStep) return 'current';
    if (completedSteps.includes(stepId)) return 'complete';
    return 'upcoming';
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(249,250,251,0.98) 100%)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0.75rem 2rem',
      position: 'sticky',
      top: 60,
      zIndex: 900,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
      }}>
        {steps.map((step, idx) => {
          const status = getStatus(step.id);
          const stat = stepStats[step.id]?.(data);
          const clickable = status === 'complete' || status === 'current';

          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <button
                onClick={() => clickable && goToStep(step.id)}
                disabled={!clickable}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: clickable ? 'pointer' : 'default',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 8,
                  transition: 'background 0.15s',
                  opacity: status === 'upcoming' ? 0.5 : 1,
                  ...(status === 'current' ? { background: 'rgba(124, 58, 237, 0.06)' } : {}),
                }}
                onMouseEnter={(e) => { if (clickable) e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = status === 'current' ? 'rgba(124,58,237,0.06)' : 'transparent'; }}
              >
                <StepIcon status={status} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontSize: '0.8rem',
                    fontWeight: status === 'current' ? 700 : 500,
                    color: status === 'current' ? 'var(--ls-purple-light)' : 'var(--text-primary)',
                    lineHeight: 1.2,
                  }}>
                    {step.label}
                  </div>
                  {stat && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 1 }}>
                      {stat}
                    </div>
                  )}
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div style={{
                  flex: 1,
                  height: 2,
                  background: completedSteps.includes(step.id) ? '#22c55e' : '#e5e7eb',
                  margin: '0 0.25rem',
                  borderRadius: 1,
                  transition: 'background 0.3s',
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        background: '#f3f4f6',
      }}>
        <div style={{
          height: '100%',
          width: `${((steps.findIndex(s => s.id === currentStep) + (completedSteps.includes(currentStep) ? 1 : 0.5)) / steps.length) * 100}%`,
          background: 'linear-gradient(90deg, var(--ls-purple-light), #a855f7)',
          borderRadius: '0 2px 2px 0',
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
    </div>
  );
}
