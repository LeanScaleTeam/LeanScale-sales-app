import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

const STEPS = [
  { id: 'diagnostic', label: 'Diagnostic', icon: '🔍', description: 'Assess GTM health' },
  { id: 'engagement', label: 'Engagement', icon: '📋', description: 'Review recommendations' },
  { id: 'scope', label: 'Scope', icon: '🎯', description: 'Select project scope' },
  { id: 'sow', label: 'SOW', icon: '📄', description: 'Build statement of work' },
  { id: 'review', label: 'Review', icon: '✅', description: 'Final review & send' },
];

const STORAGE_KEY = 'ls-workflow-state';

const WorkflowContext = createContext(null);

function loadPersistedState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistState(state) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function WorkflowProvider({ children }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('diagnostic');
  const [completedSteps, setCompletedSteps] = useState([]);
  const [data, setData] = useState({
    diagnosticResultId: null,
    diagnosticStats: null,
    engagementRecommendation: null,
    scopeSelections: null,
    sowId: null,
    customerId: null,
    customerName: null,
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadPersistedState();
    if (saved) {
      if (saved.currentStep) setCurrentStep(saved.currentStep);
      if (saved.completedSteps) setCompletedSteps(saved.completedSteps);
      if (saved.data) setData(prev => ({ ...prev, ...saved.data }));
    }
    setInitialized(true);
  }, []);

  // Sync from URL params on mount/change
  useEffect(() => {
    if (!initialized) return;
    const { step, customer, diagnosticResultId, sowId } = router.query;
    if (step && STEPS.find(s => s.id === step)) {
      setCurrentStep(step);
    }
    if (customer) setData(prev => ({ ...prev, customerName: customer }));
    if (diagnosticResultId) setData(prev => ({ ...prev, diagnosticResultId }));
    if (sowId) setData(prev => ({ ...prev, sowId }));
  }, [router.query, initialized]);

  // Persist to localStorage when state changes
  useEffect(() => {
    if (!initialized) return;
    persistState({ currentStep, completedSteps, data });
  }, [currentStep, completedSteps, data, initialized]);

  const currentStepIndex = useMemo(
    () => STEPS.findIndex(s => s.id === currentStep),
    [currentStep]
  );

  const updateURL = useCallback((stepId) => {
    const params = new URLSearchParams();
    params.set('step', stepId);
    if (data.customerName) params.set('customer', data.customerName);
    if (data.diagnosticResultId) params.set('diagnosticResultId', data.diagnosticResultId);
    if (data.sowId) params.set('sowId', data.sowId);
    router.replace(`/try-leanscale/workflow?${params.toString()}`, undefined, { shallow: true });
  }, [router, data]);

  const goToStep = useCallback((stepId) => {
    const targetIdx = STEPS.findIndex(s => s.id === stepId);
    if (targetIdx < 0) return false;

    // Can only go to completed steps or the next available step
    const isCompleted = completedSteps.includes(stepId);
    const isNext = targetIdx <= currentStepIndex + 1;
    if (!isCompleted && !isNext && targetIdx > currentStepIndex) return false;

    if (hasUnsavedChanges) {
      const ok = window.confirm('You have unsaved changes. Leave this step?');
      if (!ok) return false;
    }

    setCurrentStep(stepId);
    setHasUnsavedChanges(false);
    updateURL(stepId);
    return true;
  }, [completedSteps, currentStepIndex, hasUnsavedChanges, updateURL]);

  const completeStep = useCallback((stepId, stepData = {}) => {
    setCompletedSteps(prev => prev.includes(stepId) ? prev : [...prev, stepId]);
    setData(prev => ({ ...prev, ...stepData }));
    setHasUnsavedChanges(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStepIndex >= STEPS.length - 1) return false;
    // Auto-complete current step
    completeStep(currentStep);
    const next = STEPS[currentStepIndex + 1];
    setCurrentStep(next.id);
    updateURL(next.id);
    return true;
  }, [currentStepIndex, currentStep, completeStep, updateURL]);

  const previousStep = useCallback(() => {
    if (currentStepIndex <= 0) return false;
    if (hasUnsavedChanges) {
      const ok = window.confirm('You have unsaved changes. Go back?');
      if (!ok) return false;
    }
    const prev = STEPS[currentStepIndex - 1];
    setCurrentStep(prev.id);
    setHasUnsavedChanges(false);
    updateURL(prev.id);
    return true;
  }, [currentStepIndex, hasUnsavedChanges, updateURL]);

  const updateData = useCallback((updates) => {
    setData(prev => ({ ...prev, ...updates }));
  }, []);

  const resetWorkflow = useCallback(() => {
    setCurrentStep('diagnostic');
    setCompletedSteps([]);
    setData({
      diagnosticResultId: null,
      diagnosticStats: null,
      engagementRecommendation: null,
      scopeSelections: null,
      sowId: null,
      customerId: null,
      customerName: null,
    });
    setHasUnsavedChanges(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({
    steps: STEPS,
    currentStep,
    currentStepIndex,
    completedSteps,
    data,
    hasUnsavedChanges,
    initialized,
    goToStep,
    nextStep,
    previousStep,
    completeStep,
    updateData,
    setHasUnsavedChanges,
    resetWorkflow,
  }), [currentStep, currentStepIndex, completedSteps, data, hasUnsavedChanges, initialized, goToStep, nextStep, previousStep, completeStep, updateData, resetWorkflow]);

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflow must be inside WorkflowProvider');
  return ctx;
}

export { STEPS };
