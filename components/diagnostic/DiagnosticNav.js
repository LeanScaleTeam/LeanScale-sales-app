import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Views that form the primary numbered wizard flow.
 * Order here defines step numbers.
 */
const WIZARD_VIEWS = [
  { id: 'executive-summary', label: 'Exec Summary' },
  { id: 'details', label: 'Full Details' },
  { id: 'scorecard', label: 'Score Card' },
  { id: 'power10', label: 'Power 10' },
  { id: 'systems', label: 'Systems' },
  { id: 'findings', label: 'Findings' },
  { id: 'pitch', label: 'Engagement' },
];

/**
 * Views that are admin/consultant-only and live in the dropdown.
 */
const ADMIN_VIEWS = [
  { id: 'transcript', label: 'Transcripts' },
  { id: 'consultant', label: 'Consultant Audit' },
  { id: 'vasco', label: 'Vasco Import' },
];

/**
 * Legacy views for v1/v2 diagnostics — shown as flat pills, no wizard.
 */
const LEGACY_VIEWS = [
  { id: 'lifecycle', label: 'Lifecycle' },
  { id: 'priority', label: 'Priority' },
  { id: 'layers', label: 'Layers' },
  { id: 'by-category', label: 'By Category' },
  { id: 'by-outcome', label: 'By Outcome' },
  { id: 'table', label: 'Table' },
  { id: 'metrics', label: 'Metrics' },
];

/**
 * Sticky navigation for the diagnostic page.
 *
 * For v3 diagnostics: renders a numbered 5-step wizard flow.
 * For v1/v2: renders a flat pill nav (legacy behaviour unchanged).
 */
export default function DiagnosticNav({
  activeView,
  onViewChange,
  editMode,
  onEditToggle,
  onImport,
  saving,
  isAdmin,
  availableViews,
}) {
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAdminMenuOpen(false);
      }
    }
    if (adminMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [adminMenuOpen]);

  const available = availableViews || [];

  // Determine if we're in wizard mode (any v3 view is available)
  const isWizardMode = WIZARD_VIEWS.some(v => available.includes(v.id));

  // Which wizard steps are actually available
  const wizardSteps = WIZARD_VIEWS.filter(v => available.includes(v.id));
  const activeStepIndex = wizardSteps.findIndex(v => v.id === activeView);

  // Which admin views are available
  const adminSteps = ADMIN_VIEWS.filter(v => available.includes(v.id));
  const isAdminViewActive = adminSteps.some(v => v.id === activeView);

  // Legacy views
  const legacyViews = LEGACY_VIEWS.filter(v => available.includes(v.id));

  return (
    <nav className="diagnostic-nav" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        justifyContent: 'space-between',
      }}>

        {/* ── Wizard steps (v3) ── */}
        {isWizardMode && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            flex: 1,
            minWidth: 0,
          }}>
            {wizardSteps.map((step, idx) => {
              const isActive = activeView === step.id;
              const isCompleted = activeStepIndex > idx;
              const isFuture = activeStepIndex < idx && !isActive;

              return (
                <button
                  key={step.id}
                  onClick={() => onViewChange(step.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    border: 'none',
                    background: isActive
                      ? 'rgba(124, 58, 237, 0.2)'
                      : 'transparent',
                    color: isActive
                      ? '#a78bfa'
                      : isFuture
                      ? 'rgba(255,255,255,0.25)'
                      : 'rgba(255,255,255,0.55)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                  }}
                >
                  {/* Step number / check */}
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
                    background: isActive
                      ? '#7c3aed'
                      : isCompleted
                      ? 'rgba(124, 58, 237, 0.35)'
                      : 'rgba(255,255,255,0.08)',
                    color: isActive || isCompleted ? 'white' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.15s ease',
                  }}>
                    {isCompleted ? '✓' : idx + 1}
                  </span>

                  <span style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: isActive ? 600 : 400,
                  }}>
                    {step.label}
                  </span>

                  {/* Active underline */}
                  {isActive && (
                    <motion.div
                      layoutId="diagnostic-nav-active"
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

            {/* Connector line between steps */}
            {wizardSteps.length > 1 && (
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '1px',
                background: 'rgba(255,255,255,0.05)',
                pointerEvents: 'none',
              }} />
            )}
          </div>
        )}

        {/* ── Legacy flat pills (v1/v2) ── */}
        {!isWizardMode && (
          <div className="diagnostic-nav-views" style={{ flex: 1, minWidth: 0 }}>
            {legacyViews.map((view) => (
              <button
                key={view.id}
                className={`diagnostic-nav-view-btn ${activeView === view.id ? 'active' : ''}`}
                onClick={() => onViewChange(view.id)}
              >
                {view.label}
                {activeView === view.id && (
                  <motion.div
                    layoutId="diagnostic-nav-active"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 2,
                      background: 'var(--ls-purple-light)',
                      borderRadius: 1,
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Right side: admin tools + edit actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>

          {/* Step counter */}
          {isWizardMode && activeStepIndex >= 0 && (
            <span style={{
              fontSize: 'var(--text-2xs)',
              color: 'rgba(255,255,255,0.25)',
              fontWeight: 500,
              paddingRight: 'var(--space-1)',
            }}>
              {activeStepIndex + 1} / {wizardSteps.length}
            </span>
          )}

          {/* Admin tools dropdown */}
          {isAdmin && adminSteps.length > 0 && (
            <div style={{ position: 'relative' }} ref={menuRef}>
              <button
                onClick={() => setAdminMenuOpen(o => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.3rem 0.6rem',
                  fontSize: 'var(--text-xs)',
                  fontWeight: isAdminViewActive ? 600 : 400,
                  borderRadius: '6px',
                  border: `1px solid ${isAdminViewActive ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  background: isAdminViewActive ? 'rgba(124,58,237,0.12)' : 'rgba(255,255,255,0.04)',
                  color: isAdminViewActive ? '#a78bfa' : 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                Tools
                <span style={{
                  fontSize: '0.5rem',
                  opacity: 0.6,
                  transform: adminMenuOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s',
                  display: 'inline-block',
                }}>▼</span>
              </button>

              {adminMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.12 }}
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    right: 0,
                    minWidth: '160px',
                    background: '#1a1625',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '0.35rem',
                    zIndex: 200,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                >
                  {adminSteps.map(v => (
                    <button
                      key={v.id}
                      onClick={() => { onViewChange(v.id); setAdminMenuOpen(false); }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.4rem 0.6rem',
                        fontSize: 'var(--text-sm)',
                        borderRadius: '5px',
                        border: 'none',
                        background: activeView === v.id ? 'rgba(124,58,237,0.15)' : 'transparent',
                        color: activeView === v.id ? '#a78bfa' : 'rgba(255,255,255,0.65)',
                        cursor: 'pointer',
                        fontWeight: activeView === v.id ? 600 : 400,
                      }}
                    >
                      {v.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {/* Edit / Import / Save indicator */}
          {isAdmin && (
            <>
              <button
                className={`diagnostic-nav-action-btn ${editMode ? 'active' : ''}`}
                onClick={onEditToggle}
              >
                {editMode ? 'Done' : 'Edit'}
              </button>
              <button
                className="diagnostic-nav-action-btn"
                onClick={onImport}
              >
                Import
              </button>
              {editMode && (
                <span
                  aria-live="polite"
                  style={{
                    fontSize: 'var(--text-2xs)',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    background: saving ? 'rgba(251, 191, 36, 0.12)' : 'rgba(34, 197, 94, 0.12)',
                    color: saving ? '#fbbf24' : '#86efac',
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                >
                  {saving ? 'Saving...' : 'Saved'}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
