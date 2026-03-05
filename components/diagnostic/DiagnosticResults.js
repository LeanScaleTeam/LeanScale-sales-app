import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from '../Layout';
import { diagnosticRegistry, countStatuses } from '../../data/diagnostic-registry';
import { useCustomer } from '../../context/CustomerContext';
import { useAuth } from '../../context/AuthContext';
import { slideUp } from '../../lib/animations';

// Views
import DiagnosticNav from './DiagnosticNav';
import PriorityView from './views/PriorityView';
import CategoryView from './views/CategoryView';
import OutcomeView from './views/OutcomeView';
import TableView from './views/TableView';
import MetricsView from './views/MetricsView';
import MarkdownImport from './MarkdownImport';
import PrioritySection from './PrioritySection';
import DiagnosticSkeleton from './DiagnosticSkeleton';
import DiagnosticItemModal from './DiagnosticItemModal';

// v2 Views
import LayerView from './LayerView';

// v3 Views
import ScoreCardGrid from './v3/ScoreCardGrid';
import RoadmapView from './v3/RoadmapView';
import V3Summary from './v3/V3Summary';
import DataCoverage from './v3/DataCoverage';
import TranscriptUpload from './v3/TranscriptUpload';
import ConsultantAuditForm from './v3/ConsultantAuditForm';
import SuggestedProjects, { findNewSuggestedProjects } from './v3/SuggestedProjects';
import { applyRoadmapOverrides } from '../../lib/diagnostic-engine/v3/apply-roadmap-overrides';

// CPQ-specific views
import LifecycleView from './views/LifecycleView';
import CpqMetricsView from './views/CpqMetricsView';

// Engagement Pitch view
import EngagementPitch from '../engagement-pitch/EngagementPitch';

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
export default function DiagnosticResults({ diagnosticType }) {
  const router = useRouter();
  const { customer, isDemo, customerPath } = useCustomer();
  const { isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && !isDemo;
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
  const [linkedSows, setLinkedSows] = useState([]);
  const [syncToast, setSyncToast] = useState(null);
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
  const [crmSignals, setCrmSignals] = useState({ computedSignals: {}, enhancedSignals: {}, crmType: 'salesforce' });
  const [roadmapEditMode, setRoadmapEditMode] = useState(false);
  const [roadmapOverrides, setRoadmapOverrides] = useState(null);
  const [roadmapDirty, setRoadmapDirty] = useState(false);
  const [roadmapSaving, setRoadmapSaving] = useState(false);
  const [suggestedProjects, setSuggestedProjects] = useState([]);

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
    if (isDemo || !customer?.id) return;

    async function loadDiagnosticData() {
      setLoadingData(true);
      try {
        if (configuredVersion === 3 && diagnosticType === 'gtm') {
          // v3: load from v3 endpoint
          const res = await fetch(`/api/diagnostic/v3/results?customerId=${customer.id}`);
          if (res.ok) {
            const json = await res.json();
            if (json.success && json.data) {
              setDiagnosticVersion(3);
              setV3Result(json.data);
              setDiagnosticResultId(json.data.id);
              setV3RunTimestamp(json.data.updated_at || json.data.created_at);
              if (json.data.engagement_overrides) {
                setEngagementOverrides(json.data.engagement_overrides);
                if (json.data.engagement_overrides.power10) {
                  setEditablePower10(json.data.engagement_overrides.power10);
                }
              }
              setActiveView('scorecard');
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
            } else {
              setDiagnosticVersion(1);
              setEditableProcesses(json.data.processes || []);
              setEditableTools(json.data.tools || []);
              console.log('[DiagnosticLoad] power10_metrics from API:', json.data.power10_metrics?.length, 'metrics', json.data.power10_metrics?.slice(0, 2));
              if (json.data.power10_metrics && json.data.power10_metrics.length > 0) {
                setEditablePower10(json.data.power10_metrics);
              }
              if (json.data.engagement_overrides) setEngagementOverrides(json.data.engagement_overrides);
              setDiagnosticResultId(json.data.id);
            }
            setNotes(json.notes || []);
          }
        }
      } catch (err) {
        console.error('Error loading diagnostic data:', err);
      } finally {
        setLoadingData(false);
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

  // --- Load linked SOWs ---
  useEffect(() => {
    if (isDemo || !customer?.id) return;

    async function loadLinkedSows() {
      try {
        const res = await fetch(`/api/diagnostics/${diagnosticType}/linked-sows?customerId=${customer.id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) setLinkedSows(json.data || []);
        }
      } catch (_) { /* ignore */ }
    }

    loadLinkedSows();
  }, [customer?.id, diagnosticType, isDemo]);

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
      console.log('[DiagnosticSave] Saving with power10:', p10?.length, 'metrics');
      await fetch(`/api/diagnostics/${diagnosticType}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      // Show sync toast if there are linked SOWs
      if (linkedSows.length > 0) {
        setSyncToast({
          count: linkedSows.length,
          sows: linkedSows,
        });
        setTimeout(() => setSyncToast(null), 5000);
      }
    } catch (err) {
      console.error('Error saving diagnostic data:', err);
    } finally {
      setSaving(false);
    }
  }, [customer?.id, diagnosticType, isDemo, customer?.customerName, linkedSows]);

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
    console.log('[DiagnosticImport] Power10 received:', importedPower10?.length, 'metrics', importedPower10?.slice(0, 2));
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

  // --- Build SOW handler ---
  async function handleBuildSow() {
    const isV3Now = diagnosticVersion === 3 && v3Result;
    try {
      const res = await fetch('/api/sow/from-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          diagnosticResultId: isV3Now ? v3Result.id : diagnosticResultId,
          diagnosticType,
          diagnosticVersion: isV3Now ? 3 : diagnosticVersion,
          customerName: customer.customerName,
          sowType: diagnosticType === 'clay' ? 'clay' : diagnosticType === 'cpq' ? 'q2c' : 'embedded',
          createdBy: 'sales-app',
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.id) {
        router.push(customerPath(`/sow/${json.data.id}`));
      } else {
        console.error('SOW creation failed:', json);
        alert(`SOW creation failed: ${json.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error creating SOW from diagnostic:', err);
      alert(`SOW creation error: ${err.message}`);
    }
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
  const mergedRoadmap = v3Result?.roadmap
    ? applyRoadmapOverrides(v3Result.roadmap, roadmapOverrides)
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
    ? ['scorecard', 'pitch', 'transcript', 'consultant', 'table']
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
      <div className="container">
        {/* Page header */}
        <div className="page-header" style={{ textAlign: 'center' }}>
          <h1 className="page-title" style={{ justifyContent: 'center' }}>
            <span>{config.icon}</span> {config.title}
          </h1>
          <p className="page-subtitle">{config.subtitle}</p>
          {isAdmin && diagnosticType === 'gtm' && (
            <div style={{ marginTop: '0.75rem' }}>
              {((isV2 && v2RunTimestamp) || (isV3 && v3RunTimestamp)) && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                  Last run: {new Date(v3RunTimestamp || v2RunTimestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </div>
              )}
              {diagnosticResultId ? (
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <a
                    href={customerPath('/diagnostic/intake')}
                    style={{
                      display: 'inline-block',
                      padding: '0.5rem 1.25rem',
                      background: 'white',
                      color: 'var(--ls-purple)',
                      border: '1px solid var(--ls-purple)',
                      borderRadius: 'var(--radius-md, 8px)',
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--font-semibold)',
                      textDecoration: 'none',
                    }}
                  >
                    Re-run Diagnostic
                  </a>
                  {isV3 && (
                    <a
                      href={`/api/diagnostic/v3/export?customerId=${customer?.id}`}
                      download
                      style={{
                        display: 'inline-block',
                        padding: '0.5rem 1.25rem',
                        background: 'white',
                        color: '#4A5568',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md, 8px)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: 'var(--font-semibold)',
                        textDecoration: 'none',
                      }}
                    >
                      Download Brief
                    </a>
                  )}
                </div>
              ) : (
                <a
                  href={customerPath('/diagnostic/intake')}
                  style={{
                    display: 'inline-block',
                    padding: '0.5rem 1.25rem',
                    background: 'var(--ls-purple)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-md, 8px)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
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
          onBuildSow={handleBuildSow}
          saving={saving}
          hasCustomerData={editableProcesses !== null}
          hasDiagnosticResult={!!diagnosticResultId}
          isDemo={isDemo}
          isAdmin={isAdmin}
          availableViews={availableViews}
        />

        {/* Active View */}
        <div style={{ marginTop: 'var(--space-4)' }}>
          {/* --- v3 views --- */}
          {isV3 && activeView === 'scorecard' && (
            <>
              <V3Summary
                overallScore={v3Result.overall_score}
                overallLabel={V3_STATUS_LABELS[Math.round(v3Result.overall_score)] || 'No Data'}
                pillarScores={v3Result.pillar_scores}
                departmentScores={v3Result.department_scores}
                companyProfile={v3Result.company_profile}
                dataCoverage={v3Result.data_coverage}
              />
              <ScoreCardGrid
                scoreCard={v3Result.score_card}
                pillarScores={v3Result.pillar_scores}
                departmentScores={v3Result.department_scores}
                competencies={v3Result.competencies}
                editMode={editMode}
                onCellClick={(compId, dept, score) => {
                  // Admin override
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
              <DataCoverage
                dataCoverage={v3Result.data_coverage}
                onUploadTranscript={() => setActiveView('transcript')}
                onStartConsultant={() => setActiveView('consultant')}
              />
            </>
          )}

          {isV3 && activeView === 'roadmap' && (
            <>
              {/* Edit mode toolbar */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem', gap: '0.5rem' }}>
                <button
                  onClick={() => setRoadmapEditMode(!roadmapEditMode)}
                  style={{
                    padding: '0.4rem 1rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-md, 8px)',
                    border: roadmapEditMode ? '1px solid #E53E3E' : '1px solid var(--border-color)',
                    background: roadmapEditMode ? '#FFF5F5' : 'white',
                    color: roadmapEditMode ? '#E53E3E' : '#4A5568',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  {roadmapEditMode ? 'Exit Edit Mode' : 'Edit Roadmap'}
                </button>
              </div>

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
                editMode={roadmapEditMode}
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
                  background: 'white',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg, 12px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  zIndex: 50,
                }}>
                  <span style={{ fontSize: '0.85rem', color: '#4A5568', alignSelf: 'center' }}>
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
                      background: '#6C5CE7',
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
                      background: 'white',
                      color: '#718096',
                      cursor: 'pointer',
                    }}
                  >
                    Discard
                  </button>
                </div>
              )}
            </>
          )}

          {isV3 && activeView === 'transcript' && (
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

          {isV3 && activeView === 'consultant' && (
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
              managedServices={[]}
              companyProfile={
                isV2 ? v2Result?.companyProfile
                : isV3 ? v3Result?.company_profile
                : {}
              }
              onBuildSow={diagnosticResultId ? handleBuildSow : undefined}
              editMode={editMode}
              engagementOverrides={engagementOverrides}
              onOverridesChange={handleEngagementOverridesChange}
              customerPath={customerPath}
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
              linkedSows={linkedSows}
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
              linkedSows={linkedSows}
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
              linkedSows={linkedSows}
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
              linkedSows={linkedSows}
              highlightedItem={highlightedItem}
              customerPath={customerPath}
              onOpenModal={editMode ? setModalItem : undefined}
            />
          )}
        </div>

        {/* CTA Banner */}
        <div className="cta-banner" style={{ marginTop: '2rem' }}>
          <h3 className="cta-title">
            {diagnosticType === 'clay'
              ? 'Ready to optimize your Clay implementation?'
              : diagnosticType === 'cpq'
              ? 'Ready to optimize your Quote-to-Cash process?'
              : 'Ready to see your recommended engagement?'}
          </h3>
          <p className="cta-subtitle">
            View prioritized projects and timeline based on your diagnostic results.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {!isDemo && diagnosticResultId ? (
              <>
                <a href={customerPath('/sow')} className="nav-cta" style={{ textDecoration: 'none' }}>
                  View Statement of Work
                </a>
                {!customer?.hideEngagement && (
                  <a
                    href={customerPath('/try-leanscale/engagement')}
                    className="nav-cta"
                    style={{
                      textDecoration: 'none',
                      background: 'transparent',
                      border: '2px solid var(--primary)',
                      color: 'var(--primary)',
                    }}
                  >
                    View Engagement Overview
                  </a>
                )}
              </>
            ) : (
              <a href={customerPath('/try-leanscale/start')} className="nav-cta" style={{ textDecoration: 'none' }}>
                Start Your Diagnostic
              </a>
            )}
          </div>
        </div>

        {/* Sync Toast */}
        <AnimatePresence>
          {syncToast && (
            <motion.div
              variants={slideUp}
              initial="hidden"
              animate="show"
              exit="exit"
              style={{
                position: 'fixed',
                bottom: '1.5rem',
                right: '1.5rem',
                zIndex: 100,
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem 1.25rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                maxWidth: '340px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#1a1a2e', marginBottom: '0.25rem' }}>
                    Diagnostic saved
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#718096' }}>
                    {syncToast.count} linked SOW{syncToast.count !== 1 ? 's' : ''} may need updating
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                    {syncToast.sows.slice(0, 3).map(s => (
                      <a
                        key={s.id}
                        href={customerPath(`/sow/${s.id}`)}
                        style={{
                          fontSize: '0.75rem',
                          color: '#6C5CE7',
                          textDecoration: 'none',
                          padding: '0.15rem 0.5rem',
                          background: '#F3F0FF',
                          borderRadius: '0.25rem',
                        }}
                      >
                        {s.title || 'View SOW'}
                      </a>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setSyncToast(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#A0AEC0',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  x
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </Layout>
  );
}
