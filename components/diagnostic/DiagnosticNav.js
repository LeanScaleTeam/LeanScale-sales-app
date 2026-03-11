import { motion } from 'framer-motion';

const VIEWS = [
  { id: 'lifecycle', label: 'Lifecycle', icon: '\uD83D\uDD04' },
  { id: 'priority', label: 'Priority', icon: '\uD83C\uDFAF' },
  { id: 'by-category', label: 'By Category', icon: '\uD83D\uDCC2' },
  { id: 'by-outcome', label: 'By Outcome', icon: '\uD83C\uDFAF' },
  { id: 'table', label: 'Table', icon: '\uD83D\uDCCB' },
  { id: 'metrics', label: 'Metrics', icon: '\uD83D\uDCC8' },
  // v2 views
  { id: 'layers', label: 'Layers', icon: '\uD83D\uDDC2\uFE0F' },
  // v3 views
  { id: 'scorecard', label: 'Score Card', icon: '\uD83D\uDCCA' },
  { id: 'roadmap', label: 'Roadmap', icon: '\uD83D\uDDFA\uFE0F' },
  { id: 'transcript', label: 'Transcripts', icon: '\uD83C\uDFA4' },
  { id: 'consultant', label: 'Consultant', icon: '\uD83D\uDC64' },
  { id: 'pitch', label: 'Engagement Details', icon: '\uD83D\uDCBC' },
];

/**
 * Sticky sub-navigation for the diagnostic page.
 * Shows view toggle segments + action buttons (edit, import, build SOW).
 */
export default function DiagnosticNav({
  activeView,
  onViewChange,
  editMode,
  onEditToggle,
  onImport,
  saving,
  hasCustomerData,
  hasDiagnosticResult,
  isDemo,
  isAdmin,
  availableViews,
}) {
  // Filter views based on what data is available
  const visibleViews = availableViews
    ? VIEWS.filter(v => availableViews.includes(v.id))
    : VIEWS;

  return (
    <div className="diagnostic-nav">
      {/* View segments */}
      <div className="diagnostic-nav-views">
        {visibleViews.map((view) => (
          <button
            key={view.id}
            className={`diagnostic-nav-view-btn ${activeView === view.id ? 'active' : ''}`}
            onClick={() => onViewChange(view.id)}
          >
            <span>{view.icon}</span> {view.label}
            {/* Animated active indicator */}
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

      {/* Actions */}
      {isAdmin && (
        <div className="diagnostic-nav-actions">
          <button
            className={`diagnostic-nav-action-btn ${editMode ? 'active' : ''}`}
            onClick={onEditToggle}
          >
            {editMode ? 'Done Editing' : 'Edit'}
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
                background: saving ? '#FEF3C7' : '#ECFDF5',
                color: saving ? '#92400E' : '#065F46',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              {saving ? 'Saving...' : 'Auto-saved'}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
