/**
 * /qbr/[quarter] — Individual QBR view
 * Route: /c/{slug}/qbr/Q1-2025 (middleware rewrites to /qbr/Q1-2025)
 *
 * Public (customer): read-only, only published QBRs
 * Admin: full edit mode, publish/unpublish, architect notes
 */

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getCustomerServer } from '../../lib/getCustomer';
import { supabaseAdmin } from '../../lib/supabase';
import { staggerContainer, fadeUpItem } from '../../lib/animations';

// ─── Status Config (mirrors Power10Anchor) ────────────────────────────────────

const STATUS_COLORS = {
  healthy: {
    dot: '#22c55e', text: '#86efac',
    bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)',
    label: 'Healthy',
  },
  careful: {
    dot: '#eab308', text: '#fde047',
    bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)',
    label: 'Careful',
  },
  warning: {
    dot: '#ef4444', text: '#fca5a5',
    bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)',
    label: 'Warning',
  },
  unable: {
    dot: '#4b5563', text: 'rgba(255,255,255,0.35)',
    bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)',
    label: 'Unable',
  },
};

const STATUS_RANK = { healthy: 0, careful: 1, warning: 2, unable: 3 };

function getTrendArrow(prev, curr) {
  if (!prev || !curr) return null;
  const rp = STATUS_RANK[prev] ?? 3;
  const rc = STATUS_RANK[curr] ?? 3;
  if (rc < rp) return { icon: '↑', color: '#22c55e', label: 'Improved' };
  if (rc > rp) return { icon: '↓', color: '#ef4444', label: 'Declined' };
  return { icon: '→', color: 'rgba(255,255,255,0.4)', label: 'Same' };
}

function countReportable(snapshot) {
  if (!Array.isArray(snapshot)) return 0;
  return snapshot.filter(m => m.ableToReport === 'healthy' || m.ableToReport === 'careful').length;
}

function formatPeriod(start, end) {
  if (!start && !end) return null;
  const fmt = d => new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `From ${fmt(start)}`;
  return `Until ${fmt(end)}`;
}

// ─── Status Pill ──────────────────────────────────────────────────────────────

function StatusPill({ status, size = 'sm' }) {
  const sc = STATUS_COLORS[status] || STATUS_COLORS.unable;
  const fontSize = size === 'sm' ? '0.65rem' : '0.72rem';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: size === 'sm' ? '2px 7px' : '3px 9px',
      borderRadius: 20,
      background: sc.bg,
      border: `1px solid ${sc.border}`,
      fontSize, fontWeight: 600, letterSpacing: '0.03em',
      color: sc.text,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
      {sc.label}
    </span>
  );
}

// ─── Phase Badge ──────────────────────────────────────────────────────────────

function PhaseBadge({ phase }) {
  const colors = {
    'Phase 1': { bg: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.4)', text: '#a5b4fc' },
    'Phase 2': { bg: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.4)', text: '#c4b5fd' },
    'Phase 3': { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', text: '#d8b4fe' },
  };
  const c = colors[phase] || { bg: 'rgba(255,255,255,0.07)', border: 'rgba(255,255,255,0.15)', text: 'rgba(255,255,255,0.5)' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      background: c.bg, border: `1px solid ${c.border}`,
      fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.05em',
      color: c.text, textTransform: 'uppercase',
    }}>
      {phase || 'General'}
    </span>
  );
}

// ─── Priority Tag ─────────────────────────────────────────────────────────────

function PriorityTag({ priority }) {
  const colors = {
    high:   { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#fca5a5', dot: '#ef4444' },
    medium: { bg: 'rgba(234,179,8,0.10)', border: 'rgba(234,179,8,0.3)', text: '#fde047', dot: '#eab308' },
    low:    { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)', text: '#86efac', dot: '#22c55e' },
  };
  const c = colors[priority?.toLowerCase()] || colors.medium;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 4,
      background: c.bg, border: `1px solid ${c.border}`,
      fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.05em',
      color: c.text, textTransform: 'uppercase',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot }} />
      {priority || 'Med'}
    </span>
  );
}

// ─── Inline Editable Textarea ─────────────────────────────────────────────────

function EditableText({ value, onChange, placeholder, multiline = true, style = {} }) {
  if (multiline) {
    return (
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        style={{
          width: '100%', background: 'rgba(255,255,255,0.04)',
          border: '1px dashed rgba(99,102,241,0.4)',
          borderRadius: 8, padding: '10px 12px',
          color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem',
          lineHeight: 1.7, resize: 'vertical', outline: 'none',
          fontFamily: 'inherit',
          ...style,
        }}
      />
    );
  }
  return (
    <input
      type="text"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', background: 'rgba(255,255,255,0.04)',
        border: '1px dashed rgba(99,102,241,0.4)',
        borderRadius: 6, padding: '6px 10px',
        color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem',
        outline: 'none', fontFamily: 'inherit',
        ...style,
      }}
    />
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.1rem' }}>{icon}</span>
          <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            {title}
          </h2>
        </div>
        {subtitle && (
          <p style={{ margin: '4px 0 0 28px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

// ─── Win Card ─────────────────────────────────────────────────────────────────

function WinCard({ win, editMode, onChange, onRemove }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      style={{
        background: 'rgba(34,197,94,0.04)',
        border: editMode ? '1px dashed rgba(34,197,94,0.35)' : '1px solid rgba(34,197,94,0.15)',
        borderRadius: 12,
        padding: '18px 20px',
        position: 'relative',
      }}
    >
      {editMode && (
        <button
          onClick={onRemove}
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(239,68,68,0.15)', border: 'none',
            color: '#fca5a5', borderRadius: 4, padding: '2px 7px',
            fontSize: '0.7rem', cursor: 'pointer',
          }}
        >
          ✕ Remove
        </button>
      )}

      {editMode ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <EditableText
              value={win.emoji}
              onChange={v => onChange({ ...win, emoji: v })}
              placeholder="🏆"
              multiline={false}
              style={{ width: 52, textAlign: 'center', fontSize: '1.2rem' }}
            />
            <EditableText
              value={win.title}
              onChange={v => onChange({ ...win, title: v })}
              placeholder="Win title"
              multiline={false}
              style={{ flex: 1 }}
            />
          </div>
          <EditableText
            value={win.description}
            onChange={v => onChange({ ...win, description: v })}
            placeholder="What happened and why it matters..."
            multiline={true}
            style={{ rows: 3 }}
          />
          <EditableText
            value={win.impact_statement}
            onChange={v => onChange({ ...win, impact_statement: v })}
            placeholder="Impact: +$X ARR, saved Y hours..."
            multiline={false}
          />
        </div>
      ) : (
        <>
          <div style={{ fontSize: '1.6rem', marginBottom: 10 }}>{win.emoji || '🏆'}</div>
          <h4 style={{ margin: '0 0 6px', fontSize: '0.92rem', fontWeight: 700, color: '#fff' }}>
            {win.title}
          </h4>
          {win.description && (
            <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
              {win.description}
            </p>
          )}
          {win.impact_statement && (
            <div style={{
              display: 'inline-block',
              padding: '3px 9px',
              background: 'rgba(34,197,94,0.1)',
              border: '1px solid rgba(34,197,94,0.25)',
              borderRadius: 20,
              fontSize: '0.7rem', fontWeight: 600,
              color: '#86efac',
            }}>
              {win.impact_statement}
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}

// ─── Power 10 Comparison Table ────────────────────────────────────────────────

function Power10Table({ currentSnapshot, baselineSnapshot, prevSnapshot }) {
  if (!Array.isArray(currentSnapshot) || currentSnapshot.length === 0) {
    return (
      <div style={{
        padding: '40px 24px', textAlign: 'center',
        border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 12,
        color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem',
      }}>
        No Power 10 data in this QBR snapshot.
      </div>
    );
  }

  const hasBaseline = Array.isArray(baselineSnapshot) && baselineSnapshot.length > 0;
  const hasPrev     = Array.isArray(prevSnapshot) && prevSnapshot.length > 0;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.08)', width: '30%' }}>
              METRIC
            </th>
            {hasBaseline && (
              <th style={{ textAlign: 'center', padding: '8px 12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                Q0 BASELINE
              </th>
            )}
            {hasPrev && (
              <th style={{ textAlign: 'center', padding: '8px 12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                LAST QUARTER
              </th>
            )}
            <th style={{ textAlign: 'center', padding: '8px 12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              THIS QUARTER
            </th>
            {(hasBaseline || hasPrev) && (
              <th style={{ textAlign: 'center', padding: '8px 12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                CHANGE
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {currentSnapshot.map((metric, i) => {
            const baseMetric = hasBaseline ? baselineSnapshot.find(m => m.name === metric.name) : null;
            const prevMetric = hasPrev ? prevSnapshot.find(m => m.name === metric.name) : null;
            const compareRef = prevMetric || baseMetric;
            const trendAble  = compareRef ? getTrendArrow(compareRef.ableToReport, metric.ableToReport) : null;
            const trendPlan  = compareRef ? getTrendArrow(compareRef.statusAgainstPlan, metric.statusAgainstPlan) : null;

            return (
              <tr key={metric.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {/* Metric name */}
                <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.75)', fontWeight: 500, fontSize: '0.78rem' }}>
                  <div>{metric.shortName || metric.name}</div>
                  <div style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.3)', marginTop: 2, fontStyle: 'italic' }}>
                    Reporting · Plan
                  </div>
                </td>

                {/* Q0 Baseline */}
                {hasBaseline && (
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {baseMetric ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <StatusPill status={baseMetric.ableToReport} />
                        <StatusPill status={baseMetric.statusAgainstPlan} />
                      </div>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>—</span>
                    )}
                  </td>
                )}

                {/* Last Quarter */}
                {hasPrev && (
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {prevMetric ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <StatusPill status={prevMetric.ableToReport} />
                        <StatusPill status={prevMetric.statusAgainstPlan} />
                      </div>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>—</span>
                    )}
                  </td>
                )}

                {/* This Quarter */}
                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <StatusPill status={metric.ableToReport} />
                    <StatusPill status={metric.statusAgainstPlan} />
                  </div>
                </td>

                {/* Change arrow */}
                {(hasBaseline || hasPrev) && (
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {trendAble ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <span style={{ fontSize: '1.1rem', color: trendAble.color, fontWeight: 700 }}>
                          {trendAble.icon}
                        </span>
                        <span style={{ fontSize: '0.6rem', color: trendAble.color, fontWeight: 600, letterSpacing: '0.03em' }}>
                          {trendAble.label}
                        </span>
                      </div>
                    ) : (
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.7rem' }}>—</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Project List Item ────────────────────────────────────────────────────────

function ProjectItem({ project, editMode, onChange, onRemove, showProgress = false }) {
  return (
    <div style={{
      display: 'flex', gap: 14, padding: '14px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      alignItems: 'flex-start',
    }}>
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <PhaseBadge phase={project.phase} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {editMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <EditableText
                value={project.phase}
                onChange={v => onChange({ ...project, phase: v })}
                placeholder="Phase 1"
                multiline={false}
                style={{ width: 100, fontSize: '0.75rem' }}
              />
              <EditableText
                value={project.name}
                onChange={v => onChange({ ...project, name: v })}
                placeholder="Project name"
                multiline={false}
                style={{ flex: 1 }}
              />
              {showProgress ? (
                <EditableText
                  value={project.pct_complete !== undefined ? String(project.pct_complete) : ''}
                  onChange={v => onChange({ ...project, pct_complete: parseInt(v) || 0 })}
                  placeholder="% complete"
                  multiline={false}
                  style={{ width: 90, fontSize: '0.75rem' }}
                />
              ) : (
                <EditableText
                  value={project.hours !== undefined ? String(project.hours) : ''}
                  onChange={v => onChange({ ...project, hours: parseFloat(v) || 0 })}
                  placeholder="hrs"
                  multiline={false}
                  style={{ width: 70, fontSize: '0.75rem' }}
                />
              )}
            </div>
            <EditableText
              value={project.description}
              onChange={v => onChange({ ...project, description: v })}
              placeholder="What was accomplished..."
              multiline={false}
            />
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{project.name}</span>
              {!showProgress && project.hours && (
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginLeft: 'auto', flexShrink: 0 }}>
                  {project.hours} hrs
                </span>
              )}
              {showProgress && project.pct_complete !== undefined && (
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginLeft: 'auto', flexShrink: 0 }}>
                  {project.pct_complete}% complete
                </span>
              )}
            </div>
            {project.description && (
              <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                {project.description}
              </p>
            )}
            {showProgress && project.pct_complete !== undefined && (
              <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${project.pct_complete}%`,
                  background: project.pct_complete >= 75 ? '#22c55e' : project.pct_complete >= 40 ? '#eab308' : '#6366f1',
                  transition: 'width 0.8s ease',
                }} />
              </div>
            )}
          </>
        )}
      </div>
      {editMode && (
        <button
          onClick={onRemove}
          style={{
            flexShrink: 0, background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#fca5a5', borderRadius: 4, padding: '3px 7px',
            fontSize: '0.65rem', cursor: 'pointer',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ─── Add Item Button ──────────────────────────────────────────────────────────

function AddItemBtn({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: 12, display: 'flex', alignItems: 'center', gap: 6,
        background: 'rgba(99,102,241,0.08)', border: '1px dashed rgba(99,102,241,0.35)',
        borderRadius: 8, padding: '8px 16px',
        color: '#a5b4fc', fontSize: '0.78rem', cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      + {label}
    </button>
  );
}

// ─── Roadmap Item ─────────────────────────────────────────────────────────────

function RoadmapItem({ item, editMode, onChange, onRemove }) {
  return (
    <div style={{
      display: 'flex', gap: 14, padding: '14px 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      alignItems: 'flex-start',
    }}>
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <PriorityTag priority={item.priority} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {editMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={item.priority || 'medium'}
                onChange={e => onChange({ ...item, priority: e.target.value })}
                style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 6, padding: '5px 8px', color: '#fff', fontSize: '0.75rem',
                  fontFamily: 'inherit', cursor: 'pointer', width: 90,
                }}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <EditableText
                value={item.title}
                onChange={v => onChange({ ...item, title: v })}
                placeholder="Initiative title"
                multiline={false}
                style={{ flex: 1 }}
              />
            </div>
            <EditableText
              value={item.description}
              onChange={v => onChange({ ...item, description: v })}
              placeholder="What this involves and why it's important..."
              multiline={false}
            />
          </div>
        ) : (
          <>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginBottom: 3 }}>
              {item.title}
            </div>
            {item.description && (
              <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
                {item.description}
              </p>
            )}
          </>
        )}
      </div>
      {editMode && (
        <button
          onClick={onRemove}
          style={{
            flexShrink: 0, background: 'rgba(239,68,68,0.12)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#fca5a5', borderRadius: 4, padding: '3px 7px',
            fontSize: '0.65rem', cursor: 'pointer',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
}

// ─── Glass Card wrapper ───────────────────────────────────────────────────────

function Card({ children, style = {} }) {
  return (
    <motion.div
      variants={fadeUpItem}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '28px 32px',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function QBRQuarterPage({ customer, qbr: initialQBR, baselineQBR, prevQBR, isAdmin, slug }) {
  const router = useRouter();
  const [qbr, setQBR] = useState(initialQBR);
  const [editMode, setEditMode] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [resyncing, setResyncing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);
  const [notesOpen, setNotesOpen] = useState(false);
  const fileInputRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  // ── Unsaved changes guard ──

  useEffect(() => {
    if (!isDirty) return;
    const handler = e => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // ── Stable key generator for list items ──

  function uid() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  // ── Local field updater ──

  function update(field, value) {
    setQBR(q => ({ ...q, [field]: value }));
    setIsDirty(true);
  }

  // ── Save ──

  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/qbr/${qbr.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quarterLabel:            qbr.quarter_label,
          executiveSummary:        qbr.executive_summary,
          architectNotes:          qbr.architect_notes,
          wins:                    qbr.wins,
          projectsCompleted:       qbr.projects_completed,
          projectsInProgress:      qbr.projects_in_progress,
          nextQuarterFocus:        qbr.next_quarter_focus,
          accomplishmentsMarkdown: qbr.accomplishments_markdown,
          hoursUsed:               qbr.hours_used,
          hoursBudgeted:           qbr.hours_budgeted,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      if (!mountedRef.current) return;
      setQBR(data.qbr ?? qbr);
      setIsDirty(false);
      setSaveMsg('Saved');
      setTimeout(() => { if (mountedRef.current) setSaveMsg(null); }, 2500);
    } catch {
      if (!mountedRef.current) return;
      setSaveMsg('Save failed');
    } finally {
      setSaving(false);
    }
  }

  // ── Publish / Unpublish ──

  async function handlePublish() {
    setPublishing(true);
    const newStatus = qbr.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch(`/api/qbr/${qbr.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      if (mountedRef.current) setQBR(data.qbr ?? qbr);
    } catch {
      if (mountedRef.current) alert('Failed to update status');
    } finally {
      if (mountedRef.current) setPublishing(false);
    }
  }

  // ── Share ──

  function handleShare() {
    if (typeof window === 'undefined') return;
    const url = `${window.location.origin}/c/${slug}/qbr/${qbr.quarter}`;
    navigator.clipboard.writeText(url).then(() => {
      if (mountedRef.current) setSaveMsg('Link copied!');
      setTimeout(() => { if (mountedRef.current) setSaveMsg(null); }, 2500);
    });
  }

  // ── Delete ──

  async function handleDelete() {
    if (!confirm(`Delete "${qbr.quarter_label || qbr.quarter}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/qbr/${qbr.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setIsDirty(false);
      router.push(`/c/${slug}/qbr`);
    } catch {
      alert('Delete failed — please try again.');
      setDeleting(false);
    }
  }

  // ── Re-sync Power 10 from diagnostic ──

  async function handleResync() {
    if (!confirm('Re-sync Power 10 from the current diagnostic? This will overwrite the existing snapshot for this QBR.')) return;
    setResyncing(true);
    try {
      const r = await fetch(`/api/diagnostic/v3/results?customerId=${customer.id}`);
      if (!r.ok) throw new Error('Diagnostic not found');
      const json = await r.json();
      const overrides    = json.data?.engagement_overrides || {};
      const rawMetrics   = json.data?.power10_metrics || [];
      const newSnapshot  = rawMetrics.map(m => ({
        ...m,
        ableToReport:      overrides?.power10?.[m.name]?.ableToReport      ?? m.ableToReport,
        statusAgainstPlan: overrides?.power10?.[m.name]?.statusAgainstPlan ?? m.statusAgainstPlan,
      }));
      const newScores = json.data?.scores || {};

      const res = await fetch(`/api/qbr/${qbr.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ power10Snapshot: newSnapshot, scoresSnapshot: newScores }),
      });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      if (!mountedRef.current) return;
      setQBR(data.qbr ?? qbr);
      setSaveMsg('Power 10 synced');
      setTimeout(() => { if (mountedRef.current) setSaveMsg(null); }, 3000);
    } catch (e) {
      if (mountedRef.current) alert(e.message || 'Re-sync failed');
    } finally {
      if (mountedRef.current) setResyncing(false);
    }
  }

  // ── Markdown import ──

  function handleFileImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (qbr.accomplishments_markdown?.trim()) {
        if (!confirm('This will replace your existing content. Continue?')) {
          e.target.value = '';
          return;
        }
      }
      update('accomplishments_markdown', ev.target.result);
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  // ── Simple markdown → HTML (minimal, safe) ──

  function renderMarkdown(md) {
    if (!md) return '';
    return md
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/^### (.+)$/gm, '<h3 style="color:#c4b5fd;font-size:0.95rem;margin:16px 0 6px">$1</h3>')
      .replace(/^## (.+)$/gm, '<h2 style="color:#a5b4fc;font-size:1rem;margin:20px 0 8px">$1</h2>')
      .replace(/^# (.+)$/gm, '<h1 style="color:#fff;font-size:1.1rem;margin:24px 0 10px">$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color:rgba(255,255,255,0.9)">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em style="color:rgba(255,255,255,0.7)">$1</em>')
      .replace(/^- (.+)$/gm, '<li style="margin:3px 0;color:rgba(255,255,255,0.65)">$1</li>')
      .replace(/(<li[^>]*>.*<\/li>\n?)+/g, s => `<ul style="margin:8px 0 8px 18px;padding:0">${s}</ul>`)
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
  }

  // ── Derived values ──

  const reportable     = countReportable(qbr.power10_snapshot);
  const totalMetrics   = Array.isArray(qbr.power10_snapshot) ? qbr.power10_snapshot.length : 0;
  const baseReportable = countReportable(baselineQBR?.power10_snapshot);
  const completed      = Array.isArray(qbr.projects_completed) ? qbr.projects_completed.length : 0;
  const wins           = Array.isArray(qbr.wins) ? qbr.wins : [];
  const inProgress     = Array.isArray(qbr.projects_in_progress) ? qbr.projects_in_progress : [];
  const roadmap        = Array.isArray(qbr.next_quarter_focus) ? qbr.next_quarter_focus : [];
  const period         = formatPeriod(qbr.period_start, qbr.period_end);
  const isPublished    = qbr.status === 'published';
  const isBaseline     = qbr.is_baseline;

  const hoursUsed      = qbr.hours_used;
  const hoursBudgeted  = qbr.hours_budgeted;
  const hoursPct       = hoursBudgeted ? Math.round((hoursUsed / hoursBudgeted) * 100) : null;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <Head>
        <title>{qbr.quarter_label || qbr.quarter} — {customer.customerName}</title>
      </Head>

      <div style={{ minHeight: '100vh', background: '#070512', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

        {/* ── Sticky Header ─────────────────────────────────────────────── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(7,5,18,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '0 24px',
          height: 56,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          {/* Back */}
          <Link href={`/c/${slug}/qbr`} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '0.8rem', flexShrink: 0 }}>
            ← Hub
          </Link>

          {/* Title */}
          <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {qbr.quarter_label || qbr.quarter}
              <span style={{ marginLeft: 8, color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
                — {customer.customerName}
              </span>
            </div>
          </div>

          {/* Status badge */}
          <span style={{
            padding: '3px 9px', borderRadius: 20, fontSize: '0.65rem', fontWeight: 700,
            letterSpacing: '0.04em', flexShrink: 0,
            background: isPublished ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)',
            border: isPublished ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.12)',
            color: isPublished ? '#86efac' : 'rgba(255,255,255,0.5)',
          }}>
            {isPublished ? 'Published' : 'Draft'}
          </span>

          {/* Save toast */}
          <AnimatePresence>
            {saveMsg && (
              <motion.span
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                style={{ fontSize: '0.72rem', color: '#86efac', flexShrink: 0 }}
              >
                {saveMsg}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Admin controls */}
          {isAdmin && (
            <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
              {isDirty && !saving && (
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                  Unsaved changes
                </span>
              )}
              {editMode && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '6px 14px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600,
                    background: isDirty ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.15)',
                    border: `1px solid ${isDirty ? 'rgba(99,102,241,0.6)' : 'rgba(99,102,241,0.3)'}`,
                    color: '#a5b4fc', cursor: 'pointer', fontFamily: 'inherit',
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? 'Saving…' : isDirty ? 'Save*' : 'Save'}
                </button>
              )}
              <button
                onClick={() => {
                  if (isDirty && editMode && !confirm('You have unsaved changes. Discard them?')) return;
                  setEditMode(m => !m);
                  if (editMode) setIsDirty(false);
                }}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600,
                  background: editMode ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)',
                  border: editMode ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.12)',
                  color: editMode ? '#a5b4fc' : 'rgba(255,255,255,0.65)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {editMode ? '✓ Editing' : 'Edit'}
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600,
                  background: isPublished ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
                  border: isPublished ? '1px solid rgba(239,68,68,0.35)' : '1px solid rgba(34,197,94,0.35)',
                  color: isPublished ? '#fca5a5' : '#86efac',
                  cursor: 'pointer', fontFamily: 'inherit',
                  opacity: publishing ? 0.6 : 1,
                }}
              >
                {isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <button
                onClick={handleShare}
                style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                Share ↗
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: '6px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600,
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  color: 'rgba(239,68,68,0.7)', cursor: 'pointer', fontFamily: 'inherit',
                  opacity: deleting ? 0.6 : 1,
                }}
                title="Delete this QBR"
              >
                {deleting ? '…' : '🗑'}
              </button>
            </div>
          )}
        </div>

        {/* ── Hero Section ───────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.12) 50%, transparent 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '52px 48px 44px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* BG orb */}
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          {isBaseline && (
            <div style={{
              position: 'absolute', top: 20, right: 48,
              padding: '4px 12px', borderRadius: 20,
              background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em', color: '#a5b4fc',
            }}>
              KICKOFF BASELINE
            </div>
          )}

          {/* Logo + name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            {customer.customerLogo && (
              <img src={customer.customerLogo} alt={customer.customerName} style={{ height: 40, objectFit: 'contain' }} />
            )}
            <div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 2 }}>
                {customer.customerName}
              </div>
              {editMode ? (
                <input
                  type="text"
                  value={qbr.quarter_label || ''}
                  onChange={e => update('quarter_label', e.target.value)}
                  style={{
                    fontSize: 'clamp(1.2rem,2.5vw,1.8rem)', fontWeight: 800, letterSpacing: '-0.02em',
                    color: '#fff', background: 'rgba(255,255,255,0.06)',
                    border: '1px dashed rgba(99,102,241,0.5)', borderRadius: 8,
                    padding: '4px 10px', outline: 'none', fontFamily: 'inherit',
                    width: '100%', maxWidth: 480,
                  }}
                />
              ) : (
                <h1 style={{ margin: 0, fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
                  {qbr.quarter_label || qbr.quarter}
                </h1>
              )}
              {period && (
                <div style={{ marginTop: 6, fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>
                  {period}
                </div>
              )}
            </div>
          </div>

          {/* Hero stats */}
          <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
            {totalMetrics > 0 && (
              <div style={{ padding: '0 28px 0 0', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {reportable}
                  <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
                    /{totalMetrics}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Reportable Metrics
                </div>
                {baseReportable !== null && baseReportable !== reportable && (
                  <div style={{ marginTop: 3, fontSize: '0.68rem', color: reportable > baseReportable ? '#86efac' : '#fca5a5' }}>
                    {reportable > baseReportable ? '↑' : '↓'} {Math.abs(reportable - baseReportable)} vs baseline
                  </div>
                )}
              </div>
            )}
            {completed > 0 && (
              <div style={{ padding: '0 28px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {completed}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Projects Completed
                </div>
              </div>
            )}
            {wins.length > 0 && (
              <div style={{ padding: '0 28px', borderRight: hoursBudgeted ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {wins.length}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Key Wins
                </div>
              </div>
            )}
            {hoursBudgeted > 0 && (
              <div style={{ padding: '0 0 0 28px' }}>
                <div style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {hoursUsed ?? '—'}
                  <span style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>
                    /{hoursBudgeted}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Hours Used
                </div>
                {hoursPct !== null && (
                  <div style={{ marginTop: 6, width: 120, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{
                      height: '100%', borderRadius: 2,
                      width: `${Math.min(hoursPct, 100)}%`,
                      background: hoursPct > 100 ? '#ef4444' : hoursPct > 80 ? '#eab308' : '#6366f1',
                    }} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Content ────────────────────────────────────────────────────── */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}
        >

          {/* ── Executive Summary ────────────────────────────────────── */}
          {(editMode || qbr.executive_summary) && (
            <Card style={{ marginBottom: 28 }}>
              <SectionHeader icon="📋" title="Executive Summary" />
              {editMode ? (
                <EditableText
                  value={qbr.executive_summary}
                  onChange={v => update('executive_summary', v)}
                  placeholder="A high-level summary of the quarter — what was accomplished, the overall trajectory, and what this sets up..."
                  multiline={true}
                  style={{ rows: 5 }}
                />
              ) : (
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {qbr.executive_summary}
                </p>
              )}
            </Card>
          )}

          {/* ── Key Wins ─────────────────────────────────────────────── */}
          {(editMode || wins.length > 0) && (
            <Card style={{ marginBottom: 28 }}>
              <SectionHeader
                icon="🏆"
                title="Key Wins"
                subtitle={`${wins.length} win${wins.length !== 1 ? 's' : ''} this quarter`}
                action={editMode && (
                  <AddItemBtn label="Add Win" onClick={() => update('wins', [...wins, { _key: uid(), emoji: '🏆', title: '', description: '', impact_statement: '' }])} />
                )}
              />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {wins.map((win, i) => (
                  <WinCard
                    key={win._key || i}
                    win={win}
                    editMode={editMode}
                    onChange={updated => update('wins', wins.map((w, j) => j === i ? updated : w))}
                    onRemove={() => update('wins', wins.filter((_, j) => j !== i))}
                  />
                ))}
                {wins.length === 0 && editMode && (
                  <div style={{ padding: '20px 0', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                    No wins yet — click "Add Win" to start.
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* ── Power 10 Progress ────────────────────────────────────── */}
          {(editMode || (Array.isArray(qbr.power10_snapshot) && qbr.power10_snapshot.length > 0)) && (
            <Card style={{ marginBottom: 28 }}>
              <SectionHeader
                icon="📊"
                title="Power 10: Progress Report"
                subtitle={baselineQBR ? 'Compared against Q0 baseline' : prevQBR ? 'Compared against last quarter' : 'Current state snapshot'}
                action={editMode && (
                  <button
                    onClick={handleResync}
                    disabled={resyncing}
                    style={{
                      padding: '6px 14px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600,
                      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
                      color: '#a5b4fc', cursor: 'pointer', fontFamily: 'inherit',
                      opacity: resyncing ? 0.6 : 1,
                    }}
                  >
                    {resyncing ? 'Syncing…' : '↻ Re-sync from Diagnostic'}
                  </button>
                )}
              />
              {Array.isArray(qbr.power10_snapshot) && qbr.power10_snapshot.length > 0 ? (
                <Power10Table
                  currentSnapshot={qbr.power10_snapshot}
                  baselineSnapshot={baselineQBR?.power10_snapshot}
                  prevSnapshot={prevQBR?.power10_snapshot}
                />
              ) : (
                <div style={{
                  padding: '32px 0', textAlign: 'center',
                  color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem',
                }}>
                  No snapshot yet — click "↻ Re-sync from Diagnostic" to pull in the current state.
                </div>
              )}
            </Card>
          )}

          {/* ── Projects Completed ───────────────────────────────────── */}
          {(editMode || (Array.isArray(qbr.projects_completed) && qbr.projects_completed.length > 0)) && (
            <Card style={{ marginBottom: 28 }}>
              <SectionHeader
                icon="✅"
                title="Projects Completed"
                subtitle={`${completed} project${completed !== 1 ? 's' : ''} this quarter`}
                action={editMode && (
                  <AddItemBtn label="Add Project" onClick={() => update('projects_completed', [...(qbr.projects_completed || []), { _key: uid(), name: '', phase: 'Phase 1', description: '', hours: null }])} />
                )}
              />
              <div>
                {(qbr.projects_completed || []).map((proj, i) => (
                  <ProjectItem
                    key={proj._key || i}
                    project={proj}
                    editMode={editMode}
                    onChange={updated => update('projects_completed', qbr.projects_completed.map((p, j) => j === i ? updated : p))}
                    onRemove={() => update('projects_completed', qbr.projects_completed.filter((_, j) => j !== i))}
                    showProgress={false}
                  />
                ))}
                {completed === 0 && editMode && (
                  <div style={{ padding: '16px 0', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                    No completed projects yet.
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* ── In Progress ──────────────────────────────────────────── */}
          {(editMode || inProgress.length > 0) && (
            <Card style={{ marginBottom: 28 }}>
              <SectionHeader
                icon="⚡"
                title="In Progress"
                subtitle="Active work carrying into next quarter"
                action={editMode && (
                  <AddItemBtn label="Add Project" onClick={() => update('projects_in_progress', [...inProgress, { _key: uid(), name: '', phase: 'Phase 1', description: '', pct_complete: 0 }])} />
                )}
              />
              <div>
                {inProgress.map((proj, i) => (
                  <ProjectItem
                    key={proj._key || i}
                    project={proj}
                    editMode={editMode}
                    onChange={updated => update('projects_in_progress', inProgress.map((p, j) => j === i ? updated : p))}
                    onRemove={() => update('projects_in_progress', inProgress.filter((_, j) => j !== i))}
                    showProgress={true}
                  />
                ))}
                {inProgress.length === 0 && editMode && (
                  <div style={{ padding: '16px 0', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                    No in-progress projects yet.
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* ── Accomplishments (Markdown) ───────────────────────────── */}
          {(editMode || qbr.accomplishments_markdown) && (
            <Card style={{ marginBottom: 28 }}>
              <SectionHeader
                icon="📝"
                title="Accomplishments"
                subtitle="Import or write in Markdown"
                action={editMode && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".md,.txt"
                      style={{ display: 'none' }}
                      onChange={handleFileImport}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '6px 14px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600,
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.55)', cursor: 'pointer', fontFamily: 'inherit',
                      }}
                    >
                      Import .md ↑
                    </button>
                  </>
                )}
              />
              {editMode ? (
                <EditableText
                  value={qbr.accomplishments_markdown}
                  onChange={v => update('accomplishments_markdown', v)}
                  placeholder="# Accomplishments&#10;&#10;## Infrastructure&#10;- Migrated CRM to new schema&#10;- Deployed lead routing engine..."
                  multiline={true}
                  style={{ fontFamily: 'monospace', fontSize: '0.8rem', minHeight: 160 }}
                />
              ) : (
                <div
                  style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(qbr.accomplishments_markdown) }}
                />
              )}
            </Card>
          )}

          {/* ── Next Quarter Roadmap ─────────────────────────────────── */}
          {(editMode || roadmap.length > 0) && (
            <Card style={{ marginBottom: 28 }}>
              <SectionHeader
                icon="🗺️"
                title="Next Quarter Roadmap"
                subtitle="Priorities and focus areas for the coming quarter"
                action={editMode && (
                  <AddItemBtn label="Add Initiative" onClick={() => update('next_quarter_focus', [...roadmap, { _key: uid(), title: '', description: '', priority: 'medium' }])} />
                )}
              />
              <div>
                {roadmap.map((item, i) => (
                  <RoadmapItem
                    key={item._key || i}
                    item={item}
                    editMode={editMode}
                    onChange={updated => update('next_quarter_focus', roadmap.map((r, j) => j === i ? updated : r))}
                    onRemove={() => update('next_quarter_focus', roadmap.filter((_, j) => j !== i))}
                  />
                ))}
                {roadmap.length === 0 && editMode && (
                  <div style={{ padding: '16px 0', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
                    No roadmap items yet.
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* ── Hours Summary ────────────────────────────────────────── */}
          {(editMode || (hoursBudgeted > 0)) && (
            <Card style={{ marginBottom: 28 }}>
              <SectionHeader icon="⏱" title="Hours Summary" />
              {editMode ? (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>
                      Hours Used
                    </label>
                    <input
                      type="number"
                      value={qbr.hours_used ?? ''}
                      onChange={e => update('hours_used', parseInt(e.target.value) || null)}
                      placeholder="0"
                      style={{
                        width: 90, background: 'rgba(255,255,255,0.06)',
                        border: '1px dashed rgba(99,102,241,0.4)',
                        borderRadius: 6, padding: '6px 10px',
                        color: '#fff', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.2)', alignSelf: 'flex-end', paddingBottom: 4 }}>/</div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 4 }}>
                      Hours Budgeted
                    </label>
                    <input
                      type="number"
                      value={qbr.hours_budgeted ?? ''}
                      onChange={e => update('hours_budgeted', parseInt(e.target.value) || null)}
                      placeholder="100"
                      style={{
                        width: 90, background: 'rgba(255,255,255,0.06)',
                        border: '1px dashed rgba(99,102,241,0.4)',
                        borderRadius: 6, padding: '6px 10px',
                        color: '#fff', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit',
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                    <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>Hours Used vs Budget</span>
                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>
                      {hoursUsed ?? 0} / {hoursBudgeted} hrs
                      {hoursPct !== null && (
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400, marginLeft: 8 }}>
                          ({hoursPct}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(hoursPct ?? 0, 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                      style={{
                        height: '100%', borderRadius: 4,
                        background: (hoursPct ?? 0) > 100 ? '#ef4444' : (hoursPct ?? 0) > 80 ? '#eab308' : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                      }}
                    />
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* ── Architect Notes (admin only) ─────────────────────────── */}
          {isAdmin && (
            <motion.div variants={fadeUpItem} style={{ marginBottom: 28 }}>
              <div
                style={{
                  background: 'rgba(239,68,68,0.04)',
                  border: '1px solid rgba(239,68,68,0.15)',
                  borderRadius: 16, overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setNotesOpen(o => !o)}
                  style={{
                    width: '100%', padding: '16px 28px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: '#fca5a5', fontFamily: 'inherit', textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>🔒 Architect Notes</span>
                  <span style={{
                    marginLeft: 8, padding: '2px 8px', borderRadius: 4,
                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)',
                    fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.04em', color: '#fca5a5',
                  }}>
                    INTERNAL ONLY — NOT VISIBLE TO CLIENT
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                    {notesOpen ? '▲' : '▼'}
                  </span>
                </button>
                <AnimatePresence>
                  {notesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div style={{ padding: '0 28px 24px' }}>
                        {editMode ? (
                          <EditableText
                            value={qbr.architect_notes}
                            onChange={v => update('architect_notes', v)}
                            placeholder="Internal notes, context, flags, things to watch... Never shown to the customer."
                            multiline={true}
                            style={{ minHeight: 100 }}
                          />
                        ) : (
                          <p style={{ margin: 0, fontSize: '0.84rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                            {qbr.architect_notes || <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>No architect notes yet.</span>}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </>
  );
}

// ─── getServerSideProps ───────────────────────────────────────────────────────

export async function getServerSideProps(context) {
  const { quarter } = context.params;

  const customer = await getCustomerServer(context);
  if (!customer) return { notFound: true };

  if (customer.customerType !== 'active') {
    return { redirect: { destination: '/diagnostic/gtm', permanent: false } };
  }

  const cookies = context.req.cookies || {};
  const isAdmin = Object.keys(cookies).some(
    key => key.startsWith('sb-') && key.endsWith('-auth-token')
  ) || !!(cookies['admin-session']);

  if (!supabaseAdmin) {
    return { notFound: true };
  }

  // Load this QBR
  const { data: qbrData, error } = await supabaseAdmin
    .from('customer_qbrs')
    .select('*')
    .eq('customer_id', customer.id)
    .eq('quarter', quarter)
    .single();

  if (error || !qbrData) return { notFound: true };

  // Non-admin can't see drafts
  if (!isAdmin && qbrData.status !== 'published') return { notFound: true };

  // Load all QBRs for this customer (for baseline/prev context)
  const { data: allQBRs } = await supabaseAdmin
    .from('customer_qbrs')
    .select('id, quarter, quarter_label, is_baseline, status, power10_snapshot, scores_snapshot, wins, projects_completed, created_at')
    .eq('customer_id', customer.id)
    .order('quarter', { ascending: true });

  const sortedQBRs = allQBRs || [];

  // Find baseline (Q0 / is_baseline=true)
  const baselineQBR = sortedQBRs.find(q => q.is_baseline) || null;

  // Find previous QBR (the one immediately before this one in the sorted list)
  const currentIdx = sortedQBRs.findIndex(q => q.quarter === quarter);
  const prevQBR = currentIdx > 0 ? sortedQBRs[currentIdx - 1] : null;

  // Slug for share link
  const slug = context.req.headers['x-customer-slug'] || context.req.cookies['customer-slug'] || customer.slug;

  return {
    props: {
      customer: JSON.parse(JSON.stringify(customer)),
      qbr:      JSON.parse(JSON.stringify(qbrData)),
      baselineQBR: baselineQBR ? JSON.parse(JSON.stringify(baselineQBR)) : null,
      prevQBR:     prevQBR     ? JSON.parse(JSON.stringify(prevQBR))     : null,
      isAdmin,
      slug: slug || customer.slug || 'demo',
    },
  };
}
