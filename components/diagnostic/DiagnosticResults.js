import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Layout from '../Layout';
import { diagnosticRegistry, countStatuses } from '../../data/diagnostic-registry';
import { useCustomer } from '../../context/CustomerContext';
import { useAuth } from '../../context/AuthContext';
import { slideUp } from '../../lib/animations';
import { V3_COMPETENCIES, expandDepartments } from '../../lib/diagnostic-engine/v3/constants-v3';

// Always-needed views (on first paint for all diagnostic types)
import DiagnosticNav from './DiagnosticNav';
import DiagnosticSkeleton from './DiagnosticSkeleton';
import DiagnosticItemModal from './DiagnosticItemModal';
import V3Summary from './v3/V3Summary';

// v3 core — loaded once v3 data is ready (not on first paint)
import ScoreCardGrid from './v3/ScoreCardGrid';
import DataCoverage from './v3/DataCoverage';
import SystemsHealth from './v3/SystemsHealth';
import VascoTrends from './v3/VascoTrends';
import VascoMatrix from './v3/VascoMatrix';
import { applyRoadmapOverrides } from '../../lib/diagnostic-engine/v3/apply-roadmap-overrides';
import { generateRoadmap } from '../../lib/diagnostic-engine/v3/generate-roadmap';
import { runDiagnosticV3 } from '../../lib/diagnostic-engine/v3/index';

// Engagement Pitch — loaded when user clicks the Engagement tab
import EngagementPitch, { reconstructCompetencies, adaptV3ToPitchItems } from '../engagement-pitch/EngagementPitch';
import GTMLandscape from './v3/GTMLandscape';
import Power10Anchor from '../engagement-pitch/Power10Anchor';
import FindingsWalkthrough from '../engagement-pitch/FindingsWalkthrough';

// Lazy-loaded: heavy chart/viz components (Recharts) — behind collapsed sections
const DiagnosticVisualizations = dynamic(() => import('./v3/DiagnosticVisualizations'), { ssr: false });
const PerformanceToPlan = dynamic(() => import('./v3/PerformanceToPlan'), { ssr: false });

// Lazy-loaded: secondary views only navigated to explicitly
const RoadmapView = dynamic(() => import('./v3/RoadmapView'), { ssr: false });
const SuggestedProjects = dynamic(() => import('./v3/SuggestedProjects'), { ssr: false });

// Presentation views (created last, shown first)
const ExecutiveSummary = dynamic(() => import('./v3/ExecutiveSummary'), { ssr: false });
const DiagnosticDetails = dynamic(() => import('./v3/DiagnosticDetails'), { ssr: false });

// Lazy-loaded: admin-only tools (never seen by demo prospects)
const TranscriptUpload = dynamic(() => import('./v3/TranscriptUpload'), { ssr: false });
const PresenterMode = dynamic(() => import('./v3/PresenterMode'), { ssr: false });
const ConsultantAuditForm = dynamic(() => import('./v3/ConsultantAuditForm'), { ssr: false });
const VascoImportPanel = dynamic(() => import('./v3/VascoImportPanel'), { ssr: false });
const MarkdownImport = dynamic(() => import('./MarkdownImport'), { ssr: false });

// Lazy-loaded: v1/v2/CPQ views
const PriorityView = dynamic(() => import('./views/PriorityView'), { ssr: false });
const CategoryView = dynamic(() => import('./views/CategoryView'), { ssr: false });
const OutcomeView = dynamic(() => import('./views/OutcomeView'), { ssr: false });
const TableView = dynamic(() => import('./views/TableView'), { ssr: false });
const MetricsView = dynamic(() => import('./views/MetricsView'), { ssr: false });
const LayerView = dynamic(() => import('./LayerView'), { ssr: false });
const LifecycleView = dynamic(() => import('./views/LifecycleView'), { ssr: false });
const CpqMetricsView = dynamic(() => import('./views/CpqMetricsView'), { ssr: false });
const PrioritySection = dynamic(() => import('./PrioritySection'), { ssr: false });

// Utility functions used inline — imported directly, not dynamic components
import buildPresenterSlides from '../../lib/diagnostic-engine/v3/build-presenter-slides';
import { findNewSuggestedProjects } from './v3/SuggestedProjects';

/**
 * Derive Power 10 metrics array from intake D5_* answers.
 * Maps intake values to the { name, ableToReport } shape Power10Anchor expects.
 */
const D5_TO_METRIC = [
  ['D5_arr',       'ARR',                                    'ARR',          'Total contracted recurring revenue across all active subscriptions.',                                      'The north star — every GTM decision traces back to ARR trajectory.'],
  ['D5_bookings',  'Bookings',                               'Bookings',     'New revenue committed in the period, regardless of start date.',                                           'Bookings predict future ARR — a leading indicator reps live and die by.'],
  ['D5_pipeline',  'Pipeline production',                    'Pipeline',     'Total new pipeline value entered in the period.',                                                           'Pipeline is the leading indicator of bookings — you need 3-4x your quota in pipe.'],
  ['D5_mql',       'MQL production',                         'MQL Volume',   'Total count of marketing-qualified leads generated in the period.',                                         'Volume is the fuel — without enough MQLs, pipeline math never closes.'],
  ['D5_gross_churn','Gross churn',                           'Gross Churn',  'Revenue lost from cancellations, excluding downgrades or expansions.',                                     'High gross churn signals product-market fit or CS execution problems.'],
  ['D5_grr',       'Gross retention',                        'GRR',          'Percentage of starting revenue retained, excluding expansions.',                                            'The floor of your revenue — a leaky bucket kills compounding growth.'],
  ['D5_nrr',       'Net retention',                          'NRR',          'Revenue retained plus expansions minus contractions and churn.',                                            'NRR above 100% means existing customers are funding your growth.'],
  ['D5_mql_opp',   'MQL -> Opportunity conversion rate',     'MQL → Opp %',  'Percentage of marketing-qualified leads that convert to pipeline opportunities.',                          'The marketing-to-sales handoff quality metric — where demand gen ROI is proven.'],
  ['D5_opp_cw',    'Opportunity/Deal -> CW conversion rate', 'Win Rate',     'Percentage of opportunities that close as won.',                                                            'The ultimate measure of sales execution quality and competitive positioning.'],
  ['D5_cycle',     'Opportunity/Deal - CW cycle time',       'Cycle Time',   'Average days from opportunity creation to close-won.',                                                      'Shorter cycles mean faster cash — every extra week is a week of runway burned.'],
];

function derivePower10FromIntake(answers) {
  if (!answers) return null;
  const hasAny = D5_TO_METRIC.some(([key]) => answers[key]);
  if (!hasAny) return null;
  return D5_TO_METRIC.map(([key, name, shortName, description, why]) => {
    const val = answers[key];
    let ableToReport = 'unable';
    if (val === 'Automated') ableToReport = 'healthy';
    else if (val === 'Manual calc') ableToReport = 'careful';
    else if (val === "Can't report" || val === 'Not reported') ableToReport = 'warning';
    return { name, shortName, description, why, ableToReport };
  });
}

const V3_STATUS_LABELS = { 1: 'Weak', 2: 'Below Average', 3: 'Average', 4: 'Good', 5: 'Best Practice' };

/**
 * Sort processes into priority tiers.
 */
function sortByPriority(processes) {
  const tiers = { critical: [], warning: [], moderate: [], healthy: [] };

  processes.forEach((p) => {
    if (p.status === 'unable' || (p.status === 'warning' && p.addToEngagement)) {
      tiers.critical.push(p);
    } else if (p.status === 'warning') {
      tiers.warning.push(p);
    } else if (p.status === 'careful') {
      tiers.moderate.push(p);
    } else {
      tiers.healthy.push(p);
    }
  });

  return tiers;
}

/**
 * DiagnosticResults — unified diagnostic results page component (redesigned)
 *
 * Orchestrates data loading, edit state, and view rendering.
 * All visual rendering is delegated to view components.
 *
 * @param {string} diagnosticType - 'gtm' | 'clay' | 'cpq'
 */
const sectionDivider = {
  fontSize: '0.68rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'rgba(255,255,255,0.2)',
  paddingBottom: '0.4rem',
  marginBottom: '0.5rem',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
};

/**
 * Collapsible section header for the ScoreCard view.
 */
function CollapsibleSection({ label, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.4rem 0',
          marginBottom: open ? '0.75rem' : 0,
        }}
      >
        <span style={{
          fontSize: '0.68rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.35)',
          flex: 1,
          textAlign: 'left',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          paddingBottom: '0.4rem',
        }}>
          {label}
        </span>
        <span style={{
          fontSize: '0.6rem',
          color: 'rgba(255,255,255,0.25)',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
          paddingBottom: open ? '0.4rem' : 0,
        }}>
          ▼
        </span>
      </button>
      {open && children}
    </div>
  );
}

const SCORE_SECTION_DIVIDER = {
  fontSize: '0.68rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'rgba(255,255,255,0.2)',
  paddingBottom: '0.4rem',
  marginBottom: '0.5rem',
  borderBottom: '1px solid rgba(255,255,255,0.04)',
};

/**
 * ScoreCard view — V3Summary as hero, secondary sections collapsed by default.
 */
function ScoreCardView({
  v3Result, power10Data, transcriptAssessments, editMode,
  customer, setV3Result, setActiveView, engagementOverrides,
}) {
  // Apply engagement overrides to power10 data (same logic as Power10Anchor)
  const p10Overrides = engagementOverrides?.power10 || {};
  const effectivePower10 = (power10Data || []).map(metric => ({
    ...metric,
    ableToReport:      p10Overrides[metric.name]?.ableToReport      ?? metric.ableToReport,
    statusAgainstPlan: p10Overrides[metric.name]?.statusAgainstPlan ?? metric.statusAgainstPlan,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {effectivePower10.length > 0 && (
        <PerformanceToPlan metrics={effectivePower10} />
      )}

      {/* Hero — always visible */}
      <div>
        <div style={SCORE_SECTION_DIVIDER}>Overview</div>
        <V3Summary
          overallScore={v3Result.overall_score}
          overallLabel={V3_STATUS_LABELS[Math.round(v3Result.overall_score)] || 'No Data'}
          pillarScores={v3Result.pillar_scores}
          departmentScores={v3Result.department_scores}
          companyProfile={v3Result.company_profile}
          dataCoverage={v3Result.data_coverage}
        />
      </div>

      {/* Analytics — collapsed by default */}
      <CollapsibleSection label="Analytics">
        <DiagnosticVisualizations
          overallScore={v3Result.overall_score}
          pillarScores={v3Result.pillar_scores}
          departmentScores={v3Result.department_scores}
          competencies={v3Result.competencies}
        />
      </CollapsibleSection>

      {/* Detailed Scores — collapsed by default */}
      <CollapsibleSection label="Detailed Scores">
        <ScoreCardGrid
          scoreCard={v3Result.score_card}
          pillarScores={v3Result.pillar_scores}
          departmentScores={v3Result.department_scores}
          competencies={v3Result.competencies}
          transcriptAssessments={transcriptAssessments}
          editMode={editMode}
          onCellClick={(compId, dept, score) => {
            if (!editMode) return;
            fetch('/api/diagnostic/v3/run', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customerId: customer.id,
                overrides: [{ competencyId: compId, department: dept, score }],
              }),
            })
              .then((r) => r.json())
              .then((json) => {
                if (json.success && json.data) setV3Result((prev) => ({ ...prev, ...json.data }));
              });
          }}
        />
      </CollapsibleSection>

      {/* Data Sources — collapsed by default */}
      <CollapsibleSection label="Data Sources">
        <DataCoverage
          dataCoverage={v3Result.data_coverage}
          onUploadTranscript={() => setActiveView('transcript')}
          onStartConsultant={() => setActiveView('consultant')}
        />
      </CollapsibleSection>
    </div>
  );
}

export default function DiagnosticResults({ diagnosticType, isAdminSession }) {
  const router = useRouter();
  const { customer, isDemo, customerPath } = useCustomer();
  const { isAuthenticated } = useAuth();
  const isAdmin = (isAuthenticated || isAdminSession) && !isDemo;
  const config = diagnosticRegistry[diagnosticType];

  // --- State ---
  const [editMode, setEditMode] = useState(false);
  const [editableProcesses, setEditableProcesses] = useState(null);
  const [editableTools, setEditableTools] = useState(null);
  const [editablePower10, setEditablePower10] = useState(null);
  const [engagementOverrides, setEngagementOverrides] = useState(null);
  const [notes, setNotes] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [diagnosticResultId, setDiagnosticResultId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [activeView, setActiveView] = useState(diagnosticType === 'cpq' ? 'lifecycle' : 'priority');
  const [highlightedItem, setHighlightedItem] = useState(null);
  const [modalItem, setModalItem] = useState(null);
  const saveTimerRef = useRef(null);

  // Diagnostic version comes from admin config on the customer record
  const configuredVersion = customer?.diagnosticVersion || 2;
  const [diagnosticVersion, setDiagnosticVersion] = useState(null);

  // v2 state
  const [v2Result, setV2Result] = useState(null);
  const [v2RunTimestamp, setV2RunTimestamp] = useState(null);

  // v3 state
  const [v3Result, setV3Result] = useState(null);
  const [v3RunTimestamp, setV3RunTimestamp] = useState(null);
  const [showTranscriptUpload, setShowTranscriptUpload] = useState(false);
  const [consultantAssessments, setConsultantAssessments] = useState([]);
  const [applyingVasco, setApplyingVasco] = useState(false);
  const [vascoApplyResult, setVascoApplyResult] = useState(null);
  const [crmSignals, setCrmSignals] = useState({ computedSignals: {}, enhancedSignals: {}, crmType: 'salesforce' });
  const [roadmapOverrides, setRoadmapOverrides] = useState(null);
  const [roadmapDirty, setRoadmapDirty] = useState(false);
  const [roadmapSaving, setRoadmapSaving] = useState(false);
  const [showHealthy, setShowHealthy] = useState(false);
  const [suggestedProjects, setSuggestedProjects] = useState([]);
  const [transcriptAssessments, setTranscriptAssessments] = useState({});
  const [showPresenter, setShowPresenter] = useState(false);

  if (!config) {
    return (
      <Layout title="Diagnostic Not Found">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1>Diagnostic type &quot;{diagnosticType}&quot; not found</h1>
        </div>
      </Layout>
    );
  }

  const { processes: staticProcesses, tools: staticTools, categories, outcomes, power10Metrics: staticPower10 } = config;

  // Use customer-specific data when available, otherwise static
  const processes = editableProcesses || staticProcesses;
  const toolsData = editableTools || staticTools;
  const power10Data = editablePower10 || staticPower10;

  // Separate "unable" processes into their own bottom section
  const reportableProcesses = processes.filter(p => p.status !== 'unable');
  const unableProcesses = processes.filter(p => p.status === 'unable');

  // --- Load customer-specific diagnostic data ---
  useEffect(() => {
    if (isDemo || !customer?.id) {
      // Demo mode: generate v3 data client-side from curated intake answers
      if (isDemo && diagnosticType === 'gtm') {
        import('../../data/demo-v3-intake').then(({ DEMO_INTAKE_ANSWERS }) => {
          const result = runDiagnosticV3(DEMO_INTAKE_ANSWERS, {}, {}, {}, 'salesforce');
          setDiagnosticVersion(3);
          setV3Result(result);
          setEditablePower10(derivePower10FromIntake(DEMO_INTAKE_ANSWERS));
          setEngagementOverrides({
            engagement_type: 'Scale',
            monthly_investment: 25000,
            monthly_hours: 100,
            start_date: '2026-04-13',
            notes: 'This company is at an inflection point — pipeline volume is there but conversion is breaking down in the middle stages. The GTM team has the right people but lacks the infrastructure to scale consistently. LeanScale will build the operational foundation across CRM hygiene, pipeline management, and enablement.',
          });
          setActiveView('executive-summary');
        });
      }
      return;
    }

    async function loadDiagnosticData() {
      setLoadingData(true);
      let foundResults = false;
      try {
        if (configuredVersion === 3 && diagnosticType === 'gtm') {
          // v3: load from v3 endpoint
          const [v3Res, intakeRes] = await Promise.all([
            fetch(`/api/diagnostic/v3/results?customerId=${customer.id}`),
            fetch(`/api/diagnostic/intake?customerId=${customer.id}`),
          ]);
          if (v3Res.ok) {
            const json = await v3Res.json();
            if (json.success && json.data) {
              setDiagnosticVersion(3);
              setV3Result(json.data);
              setDiagnosticResultId(json.data.id);
              setV3RunTimestamp(json.data.updated_at || json.data.created_at);
              if (json.data.engagement_overrides) {
                setEngagementOverrides(json.data.engagement_overrides);
              }
              if (json.data.transcript_assessments) {
                setTranscriptAssessments(json.data.transcript_assessments);
              }
              // Derive Power 10 from intake answers for engagement details
              if (intakeRes.ok) {
                const intakeJson = await intakeRes.json();
                if (intakeJson.success && intakeJson.answers) {
                  const p10 = derivePower10FromIntake(intakeJson.answers);
                  if (p10) setEditablePower10(p10);
                }
              }
              setActiveView('executive-summary');
              foundResults = true;
            }
          }
        } else {
          // v1/v2: load from existing endpoint
          const res = await fetch(`/api/diagnostics/${diagnosticType}?customerId=${customer.id}`);
          if (!res.ok) return;
          const json = await res.json();
          if (json.success && json.data) {
            if (json.data.version === 2 && json.data.items) {
              setDiagnosticVersion(2);
              setV2Result({
                items: json.data.items,
                scores: json.data.scores,
                companyProfile: json.data.company_profile || json.data.companyProfile,
                actionableServiceIds: json.data.actionable_service_ids || json.data.actionableServiceIds || [],
                metadata: json.data.metadata,
              });
              setDiagnosticResultId(json.data.id);
              setV2RunTimestamp(json.data.updated_at || json.data.created_at);
              if (json.data.engagement_overrides) setEngagementOverrides(json.data.engagement_overrides);
              setActiveView('layers');
              foundResults = true;
            } else {
              setDiagnosticVersion(1);
              setEditableProcesses(json.data.processes || []);
              setEditableTools(json.data.tools || []);
              if (json.data.power10_metrics && json.data.power10_metrics.length > 0) {
                setEditablePower10(json.data.power10_metrics);
              }
              if (json.data.engagement_overrides) setEngagementOverrides(json.data.engagement_overrides);
              setDiagnosticResultId(json.data.id);
              foundResults = true;
            }
            setNotes(json.notes || []);
          }
        }
      } catch (err) {
        console.error('Error loading diagnostic data:', err);
      } finally {
        setLoadingData(false);
        if (!foundResults && diagnosticType === 'gtm') {
          const { DEMO_INTAKE_ANSWERS } = await import('../../data/demo-v3-intake');
          const result = runDiagnosticV3(DEMO_INTAKE_ANSWERS, {}, {}, {}, 'salesforce');
          setDiagnosticVersion(3);
          setV3Result(result);
          setEditablePower10(derivePower10FromIntake(DEMO_INTAKE_ANSWERS));
          setActiveView('executive-summary');
        }
      }
    }

    loadDiagnosticData();
  }, [customer?.id, diagnosticType, isDemo, configuredVersion]);

  // --- Load consultant assessments for v3 ---
  useEffect(() => {
    if (isDemo || !customer?.id || diagnosticVersion !== 3) return;

    async function loadConsultant() {
      try {
        const res = await fetch(`/api/diagnostic/consultant?customerId=${customer.id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) setConsultantAssessments(json.data || []);
        }
      } catch (_) { /* ignore */ }
    }

    loadConsultant();
  }, [customer?.id, diagnosticVersion, isDemo]);

  // --- Load CRM signals for consultant audit form ---
  useEffect(() => {
    if (isDemo || !customer?.id || diagnosticVersion !== 3) return;

    async function loadCrmSignals() {
      try {
        const res = await fetch(`/api/diagnostic/v3/crm-signals?customerId=${customer.id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) setCrmSignals(json.data);
        }
      } catch (_) { /* ignore */ }
    }

    loadCrmSignals();
  }, [customer?.id, diagnosticVersion, isDemo]);

  // --- Handle highlight query param ---
  useEffect(() => {
    const { highlight } = router.query;
    if (highlight) {
      setHighlightedItem(highlight);
      // Auto-clear after 3 seconds
      const timer = setTimeout(() => setHighlightedItem(null), 3000);
      // Scroll to the item
      requestAnimationFrame(() => {
        const el = document.querySelector(`[data-process-name="${CSS.escape(highlight)}"]`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
      return () => clearTimeout(timer);
    }
  }, [router.query]);

  // --- Auto-save (debounced) ---
  const saveToApi = useCallback(async (procs, tls, p10, eo) => {
    if (isDemo || !customer?.id) return;
    setSaving(true);
    try {
      const payload = {
        customerId: customer.id,
        processes: procs,
        tools: tls || [],
        createdBy: customer.customerName || 'unknown',
      };
      if (p10 !== undefined) {
        payload.power10Metrics = p10;
      }
      if (eo !== undefined) {
        payload.engagementOverrides = eo;
      }
      await fetch(`/api/diagnostics/${diagnosticType}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error('Error saving diagnostic data:', err);
    } finally {
      setSaving(false);
    }
  }, [customer?.id, diagnosticType, isDemo, customer?.customerName]);

  function scheduleSave(procs, tls, p10, eo) {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => saveToApi(procs, tls, p10, eo), 800);
  }

  // --- Edit handlers ---
  function handleStatusChange(processName, newStatus) {
    const updated = processes.map(p =>
      p.name === processName ? { ...p, status: newStatus } : p
    );
    setEditableProcesses(updated);
    scheduleSave(updated, editableTools, editablePower10);
  }

  function handlePriorityToggle(processName) {
    const updated = processes.map(p =>
      p.name === processName ? { ...p, addToEngagement: !p.addToEngagement } : p
    );
    setEditableProcesses(updated);
    scheduleSave(updated, editableTools, editablePower10);
  }

  // --- Engagement overrides handler (works across v1/v2/v3) ---
  function handleEngagementOverridesChange(overrides) {
    setEngagementOverrides(overrides);
    // Save via the appropriate path
    if (diagnosticVersion === 2 || diagnosticVersion === 3) {
      // v2/v3: save via the run endpoint
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        if (!diagnosticResultId || !customer?.id) return;
        setSaving(true);
        try {
          await fetch('/api/diagnostic/run', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              diagnosticResultId,
              customerId: customer.id,
              diagnosticVersion,
              engagementOverrides: overrides,
            }),
          });
        } catch (err) {
          console.error('Error saving engagement overrides:', err);
        } finally {
          setSaving(false);
        }
      }, 800);
    } else {
      // v1: include in the standard save
      scheduleSave(editableProcesses, editableTools, editablePower10, overrides);
    }
  }

  // --- v2 edit handler ---
  function handleV2StatusChange(itemId, newStatus) {
    if (!v2Result) return;
    const updatedItems = v2Result.items.map(it =>
      it.id === itemId ? { ...it, status: newStatus } : it
    );
    const updatedResult = { ...v2Result, items: updatedItems };
    setV2Result(updatedResult);
    // Debounced save to v2 API
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      if (!diagnosticResultId || !customer?.id) return;
      setSaving(true);
      try {
        await fetch('/api/diagnostic/run', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            diagnosticResultId,
            customerId: customer.id,
            items: updatedItems,
          }),
        });
      } catch (err) {
        console.error('Error saving v2 diagnostic:', err);
      } finally {
        setSaving(false);
      }
    }, 800);
  }

  // --- Note handlers ---
  async function handleAddNote({ processName, note }) {
    if (!diagnosticResultId) return;
    try {
      const res = await fetch('/api/diagnostics/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosticResultId,
          processName,
          note,
          author: customer?.customerName || 'User',
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setNotes(prev => [...prev, json.data]);
        }
      }
    } catch (err) {
      console.error('Error adding note:', err);
    }
  }

  async function handleDeleteNote(noteId) {
    try {
      const res = await fetch('/api/diagnostics/notes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId }),
      });
      if (res.ok) {
        setNotes(prev => prev.filter(n => n.id !== noteId));
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  }

  // --- Markdown import handler ---
  async function handleImport({ processes: importedProcesses, tools: importedTools, power10Metrics: importedPower10 }) {
    // Switch to v1 mode (markdown import is always v1)
    setDiagnosticVersion(1);
    setV2Result(null);
    setEditableProcesses(importedProcesses);
    setEditableTools(importedTools || []);
    setEditablePower10(importedPower10 || []);
    setShowImport(false);
    await saveToApi(importedProcesses, importedTools || [], importedPower10 || []);
    try {
      const res = await fetch(`/api/diagnostics/${diagnosticType}?customerId=${customer.id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setDiagnosticResultId(json.data.id);
        }
      }
    } catch (_) { /* ignore */ }
  }

  // --- Roadmap edit handlers ---
  // Initialize overrides from stored v3 result
  useEffect(() => {
    if (v3Result?.roadmap_overrides) {
      setRoadmapOverrides(v3Result.roadmap_overrides);
    }
  }, [v3Result?.roadmap_overrides]);

  function handleRoadmapChange(action) {
    setRoadmapDirty(true);
    setRoadmapOverrides((prev) => {
      const overrides = prev ? structuredClone(prev) : {
        removedProjects: [],
        phaseOverrides: {},
        orderOverrides: {},
        customProjects: [],
      };

      switch (action.type) {
        case 'movePhase':
          overrides.phaseOverrides[action.serviceId] = action.newPhase;
          break;

        case 'reorder': {
          // Get current phase order (with overrides applied)
          const merged = applyRoadmapOverrides(v3Result?.roadmap, overrides);
          const phase = merged?.phases?.find((p) => p.key === action.phase);
          if (!phase) break;
          const ids = phase.projects.map((p) => p.serviceId);
          const idx = ids.indexOf(action.serviceId);
          if (idx === -1) break;
          const swapIdx = action.direction === 'up' ? idx - 1 : idx + 1;
          if (swapIdx < 0 || swapIdx >= ids.length) break;
          [ids[idx], ids[swapIdx]] = [ids[swapIdx], ids[idx]];
          overrides.orderOverrides[action.phase] = ids;
          break;
        }

        case 'remove':
          if (!overrides.removedProjects.includes(action.serviceId)) {
            overrides.removedProjects.push(action.serviceId);
          }
          break;

        case 'restore':
          overrides.removedProjects = overrides.removedProjects.filter((id) => id !== action.serviceId);
          break;

        case 'addCustom':
          overrides.customProjects.push({
            id: action.project.id,
            name: action.project.name,
            description: action.project.description,
            phase: action.phase,
            hours: action.project.hours,
          });
          break;

        case 'removeCustom':
          overrides.customProjects = overrides.customProjects.filter((p) => p.id !== action.projectId);
          break;
      }

      return overrides;
    });
  }

  async function handleRoadmapSave() {
    if (!customer?.id || !roadmapOverrides) return;
    setRoadmapSaving(true);
    try {
      const res = await fetch('/api/diagnostic/v3/roadmap', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customer.id, overrides: roadmapOverrides }),
      });
      const json = await res.json();
      if (res.ok && json.success !== false) {
        setRoadmapDirty(false);
        // Update v3Result with new overrides
        setV3Result((prev) => prev ? { ...prev, roadmap_overrides: roadmapOverrides } : prev);
      } else {
        alert(`Failed to save roadmap changes: ${json.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error saving roadmap overrides:', err);
      alert(`Error saving roadmap: ${err.message}`);
    } finally {
      setRoadmapSaving(false);
    }
  }

  function handleRoadmapDiscard() {
    setRoadmapOverrides(v3Result?.roadmap_overrides || null);
    setRoadmapDirty(false);
  }

  // Compute merged roadmap for display
  // When showHealthy is true, re-generate from competencies with all items included
  const baseRoadmap = (() => {
    if (!v3Result) return null;
    if (showHealthy && v3Result.competencies?.length > 0) {
      return generateRoadmap(v3Result.competencies, { includeHealthy: true });
    }
    return v3Result.roadmap || null;
  })();
  const mergedRoadmap = baseRoadmap
    ? applyRoadmapOverrides(baseRoadmap, roadmapOverrides)
    : null;

  // Collect removed projects info for the "Removed" section in RoadmapView
  const removedProjectsList = (() => {
    if (!roadmapOverrides?.removedProjects?.length || !v3Result?.roadmap?.phases) return [];
    const allProjects = v3Result.roadmap.phases.flatMap((p) => p.projects);
    return allProjects.filter((p) => roadmapOverrides.removedProjects.includes(p.serviceId));
  })();

  // Handle re-run response: update state and compute suggested projects
  function handleRerunResponse(json) {
    if (!json.success || !json.data) return;
    const { suggestedRoadmap, ...rest } = json.data;
    setV3Result((prev) => ({ ...prev, ...rest }));
    // If the engine suggested a new roadmap, diff it against the current one
    if (suggestedRoadmap && rest.roadmap) {
      const newSuggestions = findNewSuggestedProjects(rest.roadmap, suggestedRoadmap);
      if (newSuggestions.length > 0) {
        setSuggestedProjects(newSuggestions);
      }
    }
  }

  // Add a suggested project to the roadmap via overrides
  function handleAddSuggestion(proj) {
    handleRoadmapChange({
      type: 'addCustom',
      phase: proj.suggestedPhase,
      project: {
        id: proj.serviceId,
        name: proj.service?.name || proj.serviceId,
        description: proj.service?.description || '',
        hours: null,
      },
    });
    setSuggestedProjects((prev) => prev.filter((s) => s.serviceId !== proj.serviceId));
  }

  // --- Computed data ---
  // Stats use ALL processes (health score reflects full picture)
  const processStats = countStatuses(processes);
  const toolStats = toolsData ? countStatuses(toolsData) : null;
  const power10Stats = power10Data
    ? countStatuses(power10Data.map(m => ({ status: m.ableToReport || 'unable' })))
    : null;
  const priorityCount = processes.filter(p => p.addToEngagement).length;
  // Tiers use only reportable processes (unable has its own section)
  const tiers = sortByPriority(reportableProcesses);

  // Build available views based on data
  const isV3 = diagnosticVersion === 3 && v3Result;
  const isV2 = diagnosticVersion === 2 && v2Result;

  const availableViews = isV3
    ? (isDemo
      ? ['executive-summary', 'details', 'scorecard', 'power10', 'systems', 'findings', 'pitch']
      : ['executive-summary', 'details', 'scorecard', 'power10', 'systems', 'findings', 'pitch', 'transcript', 'consultant', ...(isAdmin ? ['vasco'] : [])])
    : isV2
    ? ['layers', 'pitch', 'table']
    : (() => {
        const views = [];
        // CPQ gets lifecycle as first view
        if (diagnosticType === 'cpq') views.push('lifecycle');
        views.push('priority');
        views.push('pitch');
        if (categories && categories.length > 0) views.push('by-category');
        if (outcomes && outcomes.length > 0) views.push('by-outcome');
        views.push('table');
        // CPQ gets its own metrics view; GTM/Clay get Power10/Tools metrics
        if (diagnosticType === 'cpq') {
          views.push('metrics');
        } else if (power10Data || (toolsData && toolsData.length > 0)) {
          views.push('metrics');
        }
        return views;
      })();

  const categoryLabel = diagnosticType === 'gtm' ? 'Function' : 'Category';

  // --- Sync active view from URL ---
  useEffect(() => {
    const { view } = router.query;
    if (view && availableViews.includes(view)) {
      setActiveView(view);
    }
  }, [router.query]);

  return (
    <Layout title={config.title}>
      <div className={`container${isV3 ? ' v3-dark-theme' : ''}`}>
        {/* Page header — compact single row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '0.5rem',
        }}>
          {/* Left: title + CRM badge + last run */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <h1 style={{
              margin: 0,
              fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.95)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span>{config.icon}</span> {config.title}
            </h1>
            {/* CRM type badge */}
            {isV3 && (() => {
              const effectiveCrmType = crmSignals.crmType || v3Result?.crm_type || 'salesforce';
              const badgeStyle = {
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 600,
              };
              if (effectiveCrmType === 'dual') {
                return (
                  <span style={{
                    ...badgeStyle,
                    background: 'linear-gradient(135deg, rgba(147, 197, 253, 0.1), rgba(134, 239, 172, 0.1))',
                    border: '1px solid rgba(147, 197, 253, 0.3)',
                    color: '#93c5fd',
                  }}>
                    Salesforce + HubSpot
                  </span>
                );
              }
              if (effectiveCrmType === 'hubspot') {
                return (
                  <span style={{
                    ...badgeStyle,
                    background: 'rgba(251, 146, 60, 0.15)',
                    border: '1px solid rgba(251, 146, 60, 0.3)',
                    color: '#fb923c',
                  }}>
                    HubSpot
                  </span>
                );
              }
              return (
                <span style={{
                  ...badgeStyle,
                  background: 'rgba(147, 197, 253, 0.1)',
                  border: '1px solid rgba(147, 197, 253, 0.3)',
                  color: '#93c5fd',
                }}>
                  Salesforce
                </span>
              );
            })()}
            {/* Last run timestamp */}
            {isAdmin && ((isV2 && v2RunTimestamp) || (isV3 && v3RunTimestamp)) && (
              <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
                Last run: {new Date(v3RunTimestamp || v2RunTimestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </span>
            )}
          </div>

          {/* Right: action buttons */}
          {isAdmin && diagnosticType === 'gtm' && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              {diagnosticResultId ? (
                <>
                  <a
                    href={customerPath('/diagnostic/intake')}
                    style={{
                      display: 'inline-block',
                      padding: '0.4rem 1rem',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: 'rgba(255, 255, 255, 0.85)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 'var(--radius-md, 8px)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Re-run
                  </a>
                  {isV3 && (
                    <a
                      href={`/api/diagnostic/v3/export?customerId=${customer?.id}`}
                      download
                      style={{
                        display: 'inline-block',
                        padding: '0.4rem 1rem',
                        background: 'rgba(255, 255, 255, 0.06)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 'var(--radius-md, 8px)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      Download
                    </a>
                  )}
                  {isV3 && (
                    <button
                      onClick={() => setShowPresenter(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.4rem 1rem',
                        background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-md, 8px)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      &#9654; Present
                    </button>
                  )}
                </>
              ) : (
                <a
                  href={customerPath('/diagnostic/intake')}
                  style={{
                    display: 'inline-block',
                    padding: '0.4rem 1rem',
                    background: 'var(--ls-purple)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md, 8px)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Run Diagnostic
                </a>
              )}
            </div>
          )}
        </div>

        {/* Markdown Import Modal */}
        {showImport && (
          <div style={{ marginBottom: '2rem' }}>
            <MarkdownImport
              diagnosticType={diagnosticType}
              onImport={handleImport}
              onCancel={() => setShowImport(false)}
            />
          </div>
        )}

        {/* Loading skeleton */}
        {loadingData && <DiagnosticSkeleton />}

        {/* Sticky navigation */}
        <DiagnosticNav
          activeView={activeView}
          onViewChange={setActiveView}
          editMode={editMode}
          onEditToggle={() => setEditMode(!editMode)}
          onImport={() => setShowImport(true)}
          saving={saving}
          hasCustomerData={editableProcesses !== null}
          hasDiagnosticResult={!!diagnosticResultId}
          isDemo={isDemo}
          isAdmin={isAdmin}
          availableViews={availableViews}
        />

        {/* Active View */}
        <div style={{ marginTop: 'var(--space-4)' }}>
          {/* --- v3 presentation views (created last, shown first) --- */}
          {isV3 && activeView === 'executive-summary' && (
            <ExecutiveSummary
              v3Result={v3Result}
              mergedRoadmap={mergedRoadmap}
              engagementOverrides={engagementOverrides}
              customer={customer}
              consultantAssessments={consultantAssessments}
            />
          )}

          {isV3 && activeView === 'details' && (
            <DiagnosticDetails
              v3Result={v3Result}
              mergedRoadmap={mergedRoadmap}
              engagementOverrides={engagementOverrides}
              customer={customer}
              consultantAssessments={consultantAssessments}
            />
          )}

          {/* --- v3 views --- */}
          {isV3 && activeView === 'scorecard' && (
            <ScoreCardView
              v3Result={v3Result}
              power10Data={power10Data}
              transcriptAssessments={transcriptAssessments}
              editMode={editMode}
              customer={customer}
              setV3Result={setV3Result}
              setActiveView={setActiveView}
              engagementOverrides={engagementOverrides}
            />
          )}

          {/* --- Power 10 standalone view --- */}
          {isV3 && activeView === 'power10' && (
            <Power10Anchor
              power10Data={power10Data}
              editMode={editMode}
              overrides={engagementOverrides}
              onOverride={(section, key, value) => {
                const next = {
                  ...engagementOverrides,
                  [section]: { ...engagementOverrides?.[section], [key]: { ...engagementOverrides?.[section]?.[key], ...value } },
                };
                handleEngagementOverridesChange(next);
              }}
            />
          )}

          {/* --- Systems Health view --- */}
          {isV3 && activeView === 'systems' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* GTM Systems Landscape — hero visual */}
              <GTMLandscape
                companyProfile={v3Result?.company_profile || {}}
                computedSignals={crmSignals.computedSignals || {}}
                crmType={crmSignals.crmType || v3Result?.crm_type || 'salesforce'}
                editMode={editMode}
                overrides={engagementOverrides}
                onOverride={(section, key, value) => {
                  const next = {
                    ...engagementOverrides,
                    [section]: { ...engagementOverrides?.[section], [key]: { ...engagementOverrides?.[section]?.[key], ...value } },
                  };
                  handleEngagementOverridesChange(next);
                }}
              />
              {/* CRM Data Integrity */}
              <div>
                <h2 style={{
                  fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
                  fontWeight: 700,
                  margin: '0 0 1.25rem',
                  color: 'rgba(255,255,255,0.95)',
                  letterSpacing: '-0.01em',
                }}>
                  CRM Health
                </h2>
                {isAdmin && !engagementOverrides?.crm_health?._source && (
                  <button
                    onClick={async () => {
                      setApplyingVasco(true);
                      setVascoApplyResult(null);
                      try {
                        const res = await fetch('/api/admin/vasco-apply', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ customerId: customer.id }),
                        });
                        const json = await res.json();
                        if (!res.ok) throw new Error(json.error);
                        setVascoApplyResult({ type: 'success', data: json.applied });
                        // Reload diagnostic to reflect new data
                        window.location.reload();
                      } catch (err) {
                        setVascoApplyResult({ type: 'error', message: err.message });
                      } finally {
                        setApplyingVasco(false);
                      }
                    }}
                    disabled={applyingVasco}
                    style={{
                      padding: '0.5rem 1rem',
                      background: applyingVasco ? '#a5b4fc' : '#4338ca',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: applyingVasco ? 'not-allowed' : 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      marginBottom: '1rem',
                    }}
                  >
                    {applyingVasco ? 'Applying Vasco Data...' : 'Apply Vasco Snapshot'}
                  </button>
                )}
                {vascoApplyResult?.type === 'error' && (
                  <div style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    {vascoApplyResult.message}
                  </div>
                )}
                {engagementOverrides?.crm_health?._source === 'vasco_snapshot' && (
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                    Auto-populated from Vasco snapshot ({engagementOverrides.crm_health._snapshot_date})
                  </div>
                )}
                <SystemsHealth
                  editMode={editMode}
                  integrityScore={engagementOverrides?.crm_health?.integrity_score}
                  bowtieStages={engagementOverrides?.crm_health?.bowtie_stages}
                  eventStatus={engagementOverrides?.crm_health?.event_status}
                  issues={engagementOverrides?.crm_health?.issues}
                  employees={engagementOverrides?.crm_health?.employees}
                />
                <VascoTrends
                  trends={engagementOverrides?.vasco_trends}
                  snapshotDate={engagementOverrides?.crm_health?._snapshot_date}
                />
                <VascoMatrix
                  matrix={engagementOverrides?.vasco_matrix}
                  techStack={engagementOverrides?.vasco_tech_stack}
                  insights={engagementOverrides?.vasco_insights}
                  architect={engagementOverrides?.vasco_architect}
                  quarter={engagementOverrides?.vasco_quarter}
                  periodComparison={engagementOverrides?.vasco_period_comparison}
                  snapshotDate={engagementOverrides?.crm_health?._snapshot_date}
                />
              </div>
            </div>
          )}

          {/* --- Findings standalone view --- */}
          {isV3 && activeView === 'findings' && (() => {
            const comps = v3Result?.competencies || reconstructCompetencies(v3Result?.score_card);
            const items = comps.length > 0 ? adaptV3ToPitchItems(comps) : [];
            return (
              <FindingsWalkthrough
                items={items}
                companyProfile={v3Result?.company_profile || {}}
                editMode={editMode}
                overrides={engagementOverrides}
                onOverride={(section, key, value) => {
                  const next = {
                    ...engagementOverrides,
                    [section]: { ...engagementOverrides?.[section], [key]: { ...engagementOverrides?.[section]?.[key], ...value } },
                  };
                  handleEngagementOverridesChange(next);
                }}
                customerPath={customerPath}
                transcriptAssessments={transcriptAssessments}
              />
            );
          })()}

          {isV3 && activeView === 'roadmap' && (
            <>
              {suggestedProjects.length > 0 && (
                <SuggestedProjects
                  suggestions={suggestedProjects}
                  onAdd={handleAddSuggestion}
                  onDismiss={() => {}}
                  onDismissAll={() => setSuggestedProjects([])}
                />
              )}

              <RoadmapView
                roadmap={mergedRoadmap}
                showHealthy={showHealthy}
                onToggleHealthy={() => setShowHealthy((v) => !v)}
                editMode={editMode}
                onRoadmapChange={handleRoadmapChange}
                removedProjects={removedProjectsList}
              />

              {/* Save/Discard bar */}
              {roadmapDirty && (
                <div style={{
                  position: 'sticky',
                  bottom: '1rem',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: 'var(--radius-lg, 12px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(16px)',
                  zIndex: 50,
                }}>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.7)', alignSelf: 'center' }}>
                    Unsaved roadmap changes
                  </span>
                  <button
                    onClick={handleRoadmapSave}
                    disabled={roadmapSaving}
                    style={{
                      padding: '0.4rem 1.25rem',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: 'none',
                      background: '#7c3aed',
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 600,
                      opacity: roadmapSaving ? 0.6 : 1,
                    }}
                  >
                    {roadmapSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleRoadmapDiscard}
                    style={{
                      padding: '0.4rem 1rem',
                      fontSize: '0.85rem',
                      borderRadius: 'var(--radius-md, 8px)',
                      border: '1px solid var(--border-color)',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: 'rgba(255, 255, 255, 0.6)',
                      cursor: 'pointer',
                    }}
                  >
                    Discard
                  </button>
                </div>
              )}
            </>
          )}

          {isV3 && isAdmin && activeView === 'transcript' && (
            <TranscriptUpload
              customerId={customer?.id}
              onUploadComplete={() => {
                // Re-run v3 diagnostic after transcript analysis — preserve roadmap, surface suggestions
                fetch('/api/diagnostic/v3/run', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ customerId: customer.id, preserveRoadmap: true }),
                })
                  .then((r) => r.json())
                  .then(handleRerunResponse);
              }}
              onIntakeExtracted={(preFill) => {
                // Merge transcript-extracted answers into intake
                // Save to Supabase so they persist for the intake form
                const answerValues = {};
                for (const [key, data] of Object.entries(preFill)) {
                  answerValues[key] = data.value;
                }
                fetch('/api/diagnostic/intake', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    customerId: customer.id,
                    answers: answerValues,
                    merge: true,
                  }),
                });
              }}
            />
          )}

          {isV3 && isAdmin && activeView === 'consultant' && (
            <ConsultantAuditForm
              customerId={customer?.id}
              crmType={crmSignals.crmType || v3Result?.crm_type || 'salesforce'}
              computedSignals={crmSignals.computedSignals || {}}
              enhancedSignals={crmSignals.enhancedSignals || {}}
              metadata={v3Result?.metadata || {}}
              existingAssessments={consultantAssessments}
              onSave={() => {
                // Re-run v3 diagnostic after consultant input — preserve roadmap, surface suggestions
                fetch('/api/diagnostic/v3/run', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ customerId: customer.id, preserveRoadmap: true }),
                })
                  .then((r) => r.json())
                  .then(handleRerunResponse);
              }}
            />
          )}

          {isV3 && isAdmin && activeView === 'vasco' && (
            <VascoImportPanel
              customerId={customer?.id}
              existingCrmHealth={engagementOverrides?.crm_health || null}
              onApplyImport={async (scoreOverrides) => {
                // Build per-department assessments from Vasco competency scores
                const bulkAssessments = [];
                for (const [competencyId, score] of Object.entries(scoreOverrides)) {
                  const comp = V3_COMPETENCIES.find(c => c.id === competencyId);
                  const depts = comp ? expandDepartments(comp.departments) : ['sales'];
                  for (const dept of depts) {
                    bulkAssessments.push({
                      competencyId,
                      department: dept,
                      score,
                      notes: 'Imported from Vasco',
                    });
                  }
                }

                // Persist to DB first, then re-run diagnostic
                try {
                  const saveRes = await fetch('/api/diagnostic/consultant', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      customerId: customer.id,
                      assessments: bulkAssessments,
                      assessedBy: 'vasco',
                    }),
                  });
                  const saveJson = await saveRes.json();
                  if (saveJson.success) {
                    setConsultantAssessments(saveJson.data || []);
                  }
                } catch (err) {
                  console.error('Failed to persist Vasco scores:', err);
                }

                // Re-run diagnostic with persisted scores
                fetch('/api/diagnostic/v3/run', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ customerId: customer.id, preserveRoadmap: true }),
                })
                  .then(r => r.json())
                  .then(handleRerunResponse);
              }}
              onApplyCrmHealth={(crmHealth) => {
                handleEngagementOverridesChange({
                  ...engagementOverrides,
                  crm_health: crmHealth,
                });
              }}
            />
          )}

          {isV3 && activeView === 'table' && (
            <TableView
              processes={(v3Result.competencies || []).map((c) => {
                const avgScore = Object.values(c.departments || {}).filter((s) => s !== null).reduce((a, b) => a + b, 0) /
                  Math.max(1, Object.values(c.departments || {}).filter((s) => s !== null).length);
                return {
                  name: `${c.id}: ${c.name}`,
                  function: c.pillar,
                  status: avgScore >= 4 ? 'healthy' : avgScore >= 2.5 ? 'careful' : 'warning',
                  addToEngagement: avgScore < 3,
                };
              })}
              editMode={false}
              onStatusChange={() => {}}
              onPriorityToggle={() => {}}
              notes={notes}
              expandedRow={expandedRow}
              onRowExpand={setExpandedRow}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              categoryLabel="Pillar"
            />
          )}

          {/* --- Engagement Pitch view (all versions) --- */}
          {activeView === 'pitch' && (
            <EngagementPitch
              diagnosticVersion={diagnosticVersion}
              v2Result={v2Result}
              v3Result={v3Result}
              processes={processes}
              power10Data={power10Data}
              managedServices="health"
              companyProfile={
                isV2 ? v2Result?.companyProfile
                : isV3 ? v3Result?.company_profile
                : {}
              }
              editMode={editMode}
              engagementOverrides={engagementOverrides}
              onOverridesChange={handleEngagementOverridesChange}
              customerPath={customerPath}
              transcriptAssessments={transcriptAssessments}
              crmSignals={crmSignals.computedSignals || {}}
              crmType={crmSignals.crmType || v3Result?.crm_type || 'unknown'}
            />
          )}

          {/* --- v2 views --- */}
          {isV2 && activeView === 'layers' && (
            <LayerView
              diagnosticResult={v2Result}
              editMode={editMode}
              onStatusChange={handleV2StatusChange}
            />
          )}

          {isV2 && activeView === 'table' && (
            <TableView
              processes={v2Result.items.map(it => ({
                name: `${it.id}: ${it.name}`,
                function: it.layer,
                status: it.status,
                addToEngagement: it.status === 'warning',
              }))}
              editMode={editMode}
              onStatusChange={(name, status) => {
                const itemId = name.split(':')[0].trim();
                handleV2StatusChange(itemId, status);
              }}
              onPriorityToggle={() => {}}
              notes={notes}
              expandedRow={expandedRow}
              onRowExpand={setExpandedRow}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              categoryLabel="Layer"
            />
          )}

          {/* --- CPQ lifecycle view --- */}
          {!isV2 && activeView === 'lifecycle' && diagnosticType === 'cpq' && (
            <LifecycleView
              processes={processes}
              editMode={editMode}
              onStatusChange={handleStatusChange}
              onPriorityToggle={handlePriorityToggle}
              notes={notes}
              onOpenNotes={(name) => setExpandedRow(name === expandedRow ? null : name)}

              highlightedItem={highlightedItem}
              customerPath={customerPath}
              onOpenModal={editMode ? setModalItem : undefined}
            />
          )}

          {/* --- v1 views --- */}
          {!isV2 && activeView === 'priority' && (
            <PriorityView
              tiers={tiers}
              stats={processStats}
              priorityCount={priorityCount}
              diagnosticType={diagnosticType}
              title={config.title}
              editMode={editMode}
              onStatusChange={handleStatusChange}
              onPriorityToggle={handlePriorityToggle}
              notes={notes}
              expandedRow={expandedRow}
              onRowExpand={setExpandedRow}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}

              highlightedItem={highlightedItem}
              customerPath={customerPath}
              onOpenModal={editMode ? setModalItem : undefined}
            />
          )}

          {!isV2 && activeView === 'by-category' && categories && (
            <CategoryView
              processes={reportableProcesses}
              groupNames={categories}
              groupField="function"
              groupLabel={categoryLabel}
              editMode={editMode}
              onStatusChange={handleStatusChange}
              onPriorityToggle={handlePriorityToggle}
              notes={notes}
              onOpenNotes={(name) => setExpandedRow(name === expandedRow ? null : name)}

              highlightedItem={highlightedItem}
              customerPath={customerPath}
              onOpenModal={editMode ? setModalItem : undefined}
            />
          )}

          {!isV2 && activeView === 'by-outcome' && outcomes && (
            <OutcomeView
              processes={reportableProcesses}
              outcomes={outcomes}
              editMode={editMode}
              onStatusChange={handleStatusChange}
              onPriorityToggle={handlePriorityToggle}
              notes={notes}
              onOpenNotes={(name) => setExpandedRow(name === expandedRow ? null : name)}
              onOpenModal={editMode ? setModalItem : undefined}
            />
          )}

          {!isV2 && activeView === 'table' && (
            <TableView
              processes={reportableProcesses}
              editMode={editMode}
              onStatusChange={handleStatusChange}
              onPriorityToggle={handlePriorityToggle}
              notes={notes}
              expandedRow={expandedRow}
              onRowExpand={setExpandedRow}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              categoryLabel={categoryLabel}
              onOpenModal={editMode ? setModalItem : undefined}
            />
          )}

          {!isV2 && activeView === 'metrics' && diagnosticType === 'cpq' && (
            <CpqMetricsView processes={processes} />
          )}

          {!isV2 && activeView === 'metrics' && diagnosticType !== 'cpq' && (
            <MetricsView
              power10Data={power10Data}
              toolsData={toolsData}
              processStats={processStats}
              toolStats={toolStats}
              power10Stats={power10Stats}
              processes={processes}
            />
          )}
          {/* Unable to Report section — only on priority view */}
          {activeView === 'priority' && unableProcesses.length > 0 && (
            <PrioritySection
              tier="unable"
              items={unableProcesses}
              editMode={editMode}
              onStatusChange={handleStatusChange}
              onPriorityToggle={handlePriorityToggle}
              notes={notes}
              onOpenNotes={(name) => setExpandedRow(name === expandedRow ? null : name)}

              highlightedItem={highlightedItem}
              customerPath={customerPath}
              onOpenModal={editMode ? setModalItem : undefined}
            />
          )}
        </div>


        {/* Diagnostic Item Detail Modal */}
        <DiagnosticItemModal
          item={modalItem}
          open={!!modalItem}
          onClose={() => setModalItem(null)}
          editMode={editMode}
          onStatusChange={(name, status) => {
            handleStatusChange(name, status);
            // Update modalItem in place so the modal reflects the change
            setModalItem(prev => prev && prev.name === name ? { ...prev, status } : prev);
          }}
          onPriorityToggle={(name) => {
            handlePriorityToggle(name);
            setModalItem(prev => prev && prev.name === name ? { ...prev, addToEngagement: !prev.addToEngagement } : prev);
          }}
          notes={notes}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      </div>

      {/* Presenter Mode overlay */}
      {showPresenter && isV3 && v3Result && (
        <PresenterMode
          slides={buildPresenterSlides({
            v3Result,
            transcriptAssessments,
            companyProfile: v3Result.company_profile,
            power10Data: (() => {
              const p10Overrides = engagementOverrides?.power10 || {};
              return (power10Data || []).map((m) => ({
                ...m,
                ableToReport: p10Overrides[m.name]?.ableToReport ?? m.ableToReport,
                statusAgainstPlan: p10Overrides[m.name]?.statusAgainstPlan ?? m.statusAgainstPlan,
              }));
            })(),
            roadmap: roadmapOverrides || v3Result.roadmap,
          })}
          onClose={() => setShowPresenter(false)}
        />
      )}
    </Layout>
  );
}
