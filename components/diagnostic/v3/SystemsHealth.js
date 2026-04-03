/**
 * SystemsHealth — Data integrity & systems dashboard
 *
 * Matches the reference screenshot 1:1. All data is imported from an
 * external system and passed in as props — nothing is derived from CRM signals.
 *
 * Props:
 * - integrityScore: number (0-100)
 * - bowtieStages: [{ label, count?, errorsBefore?, errorsAfter? }]
 * - eventStatus: { succeeded, warning, failed, ignored }
 * - issues: [{ severity: 'fail'|'warning', category, name, eventCount, description }]
 * - employees: [{ name, avatar?, score, events, barPct }]
 * - editMode: boolean
 * - onUpdate: callback for edits
 */
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeUpItem, staggerContainer } from '../../../lib/animations';

// ─── Defaults (preview / demo data) ──────────────────────────

const DEFAULT_BOWTIE = [
  { label: 'Awareness' },
  { label: 'Education', errorsAfter: 76 },
  { label: 'Selection', errorsBefore: 102 },
  { label: 'Closing', errorsBefore: 2 },
  { label: 'Onboarding', errorsBefore: 2, errorsAfter: 9 },
  { label: 'Retention', errorsBefore: 8 },
  { label: 'Expansion' },
];

const DEFAULT_EVENT_STATUS = {
  succeeded: 4186,
  warning: 111,
  failed: 88,
  ignored: 8020,
};

const DEFAULT_ISSUES = [
  { severity: 'fail', category: 'Mapping', name: 'Duplicate Contact Records', eventCount: 342, description: 'Multiple contact records detected with same email across objects.' },
  { severity: 'fail', category: 'Mapping', name: 'Missing Account Association', eventCount: 156, description: 'Contacts not linked to parent account records.' },
  { severity: 'warning', category: 'Data Quality', name: 'Incomplete Lead Source', eventCount: 89, description: 'Lead source field blank or set to default value.' },
];

const DEFAULT_EMPLOYEES = [
  { name: 'Sarah Chen', score: 99, events: 847, barPct: 99 },
  { name: 'Marcus Johnson', score: 98, events: 612, barPct: 96 },
  { name: 'Emily Rodriguez', score: 97, events: 534, barPct: 94 },
  { name: 'David Kim', score: 95, events: 423, barPct: 90 },
  { name: 'Rachel Thompson', score: 94, events: 389, barPct: 88 },
  { name: 'James Wilson', score: 91, events: 312, barPct: 82 },
  { name: 'Lisa Park', score: 89, events: 287, barPct: 78 },
  { name: 'Tom Baker', score: 86, events: 245, barPct: 72 },
];

// ─── Helpers ──────────────────────────────────────────────────

function getIntegrityColor(score) {
  if (score >= 90) return '#22c55e';
  if (score >= 70) return '#eab308';
  if (score >= 50) return '#f97316';
  return '#ef4444';
}

function getIntegrityLabel(score) {
  if (score >= 90) return 'EXCELLENT';
  if (score >= 70) return 'GOOD';
  if (score >= 50) return 'AVERAGE';
  return 'POOR';
}

// ─── Integrity Score Gauge ────────────────────────────────────

function IntegrityGauge({ score }) {
  const [animatedOffset, setAnimatedOffset] = useState(282.7);
  const r = 45;
  const circ = 2 * Math.PI * r;
  const pct = (score || 0) / 100;
  const target = circ - pct * circ;
  const color = getIntegrityColor(score || 0);

  useEffect(() => {
    const t = setTimeout(() => setAnimatedOffset(target), 100);
    return () => clearTimeout(t);
  }, [target]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="70" cy="70" r={r} fill="none"
            stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={animatedOffset}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', textAlign: 'center',
        }}>
          <div style={{ fontSize: '2.25rem', fontWeight: 700, color, lineHeight: 1 }}>
            {score ?? '--'}
          </div>
        </div>
      </div>
      <div style={{
        fontSize: '0.75rem', fontWeight: 700, color,
        textTransform: 'uppercase', letterSpacing: '0.1em',
      }}>
        {score != null ? getIntegrityLabel(score) : 'NO DATA'}
      </div>
    </div>
  );
}

// ─── Lifecycle Bowtie ─────────────────────────────────────────

function LifecycleBowtie({ stages }) {
  const data = stages || DEFAULT_BOWTIE;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
        {data.map((stage, i) => {
          const isCenter = i === 3;
          const distFromCenter = Math.abs(i - 3);
          const height = 90 - distFromCenter * 8;
          const showErrorsBefore = stage.errorsBefore != null && stage.errorsBefore > 0;
          const showErrorsAfter = stage.errorsAfter != null && stage.errorsAfter > 0;

          // Bowtie colors: stages get slightly different shades
          const leftSide = i <= 3;
          const baseHue = leftSide ? 'rgba(99, 102, 241, 0.15)' : 'rgba(124, 58, 237, 0.15)';

          return (
            <div key={stage.label} style={{ display: 'flex', alignItems: 'center', flex: '1 1 0' }}>
              {/* Error count BEFORE this stage */}
              {showErrorsBefore && (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  minWidth: 24, padding: '0 2px',
                }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    color: '#ef4444',
                    background: 'rgba(239, 68, 68, 0.12)',
                    borderRadius: 4, padding: '1px 4px',
                  }}>
                    {stage.errorsBefore}
                  </span>
                </div>
              )}

              {/* Stage block */}
              <div style={{
                flex: 1, height,
                background: baseHue,
                borderLeft: i === 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                borderTop: '1px solid rgba(255,255,255,0.08)',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
                cursor: 'default',
                position: 'relative',
              }}>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 600,
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center', lineHeight: 1.2,
                }}>
                  {stage.label}
                </span>
              </div>

              {/* Error count AFTER this stage */}
              {showErrorsAfter && (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  minWidth: 24, padding: '0 2px',
                }}>
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    color: '#f97316',
                    background: 'rgba(249, 115, 22, 0.12)',
                    borderRadius: 4, padding: '1px 4px',
                  }}>
                    {stage.errorsAfter}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Event Status ─────────────────────────────────────────────

const EVENT_COLORS = {
  succeeded: '#22c55e',
  warning: '#fbbf24',
  failed: '#ef4444',
  ignored: '#64748b',
};

function EventStatus({ status }) {
  const data = status || DEFAULT_EVENT_STATUS;
  const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;

  const items = [
    { key: 'succeeded', label: 'Succeeded', count: data.succeeded || 0 },
    { key: 'warning', label: 'Warning', count: data.warning || 0 },
    { key: 'failed', label: 'Failed', count: data.failed || 0 },
    { key: 'ignored', label: 'Ignored', count: data.ignored || 0 },
  ];

  return (
    <div>
      {/* Stacked bar */}
      <div style={{
        display: 'flex', height: 12, borderRadius: 6,
        overflow: 'hidden', background: 'rgba(255,255,255,0.06)',
        marginBottom: '0.75rem',
      }}>
        {items.map(item => {
          const pct = (item.count / total) * 100;
          return pct > 0 ? (
            <div key={item.key} style={{
              width: `${pct}%`,
              background: EVENT_COLORS[item.key],
              transition: 'width 0.6s ease',
            }} />
          ) : null;
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {items.map(item => (
          <div key={item.key} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem',
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: '50%',
              background: EVENT_COLORS[item.key], flexShrink: 0,
            }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', flex: 1 }}>
              {item.label}
            </span>
            <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {item.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Issues List ──────────────────────────────────────────────

function IssuesList({ issues: propIssues }) {
  const issues = propIssues || DEFAULT_ISSUES;
  const [filter, setFilter] = useState('all');
  const [hoveredIssue, setHoveredIssue] = useState(null);

  const failCount = issues.filter(i => i.severity === 'fail').length;
  const warnCount = issues.filter(i => i.severity === 'warning').length;
  const filtered = filter === 'all' ? issues : issues.filter(i => i.severity === filter);

  // Group by category
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(issue => {
      if (!groups[issue.category]) groups[issue.category] = [];
      groups[issue.category].push(issue);
    });
    return groups;
  }, [filtered]);

  return (
    <div>
      {/* Header + filter tabs */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Issues</h3>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {[
            { id: 'all', label: 'All', count: issues.length },
            { id: 'fail', label: 'Fail', count: failCount, color: '#ef4444' },
            { id: 'warning', label: 'Warning', count: warnCount, color: '#fbbf24' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              style={{
                padding: '0.2rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: filter === tab.id
                  ? (tab.color ? `${tab.color}22` : 'rgba(255,255,255,0.1)')
                  : 'transparent',
                color: filter === tab.id
                  ? (tab.color || 'rgba(255,255,255,0.9)')
                  : 'rgba(255,255,255,0.4)',
              }}
            >
              {tab.label} <span style={{ opacity: 0.7 }}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Issue groups */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} style={{ marginBottom: '0.75rem' }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 600,
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase', letterSpacing: '0.05em',
            padding: '0.35rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '0.5rem',
          }}>
            {category}
          </div>
          {items.map((issue, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIssue(`${category}-${idx}`)}
              onMouseLeave={() => setHoveredIssue(null)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                padding: '0.6rem 0.5rem',
                margin: '0 -0.5rem',
                borderBottom: idx < items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                borderRadius: 6,
                background: hoveredIssue === `${category}-${idx}` ? 'rgba(255,255,255,0.03)' : 'transparent',
                cursor: 'default',
                transition: 'background 0.15s ease',
              }}
            >
              {/* Severity dot */}
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: issue.severity === 'fail' ? '#ef4444' : '#fbbf24',
                flexShrink: 0, marginTop: '0.35rem',
              }} />

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  marginBottom: '0.15rem',
                }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {issue.name}
                  </span>
                  {issue.eventCount != null && (
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 600,
                      padding: '1px 6px', borderRadius: 4,
                      background: 'rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.5)',
                    }}>
                      {issue.eventCount.toLocaleString()} events
                    </span>
                  )}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: hoveredIssue === `${category}-${idx}` ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.45)',
                  lineHeight: 1.4,
                  transition: 'color 0.15s ease',
                }}>
                  {issue.description}
                </div>
              </div>

            </div>
          ))}
        </div>
      ))}

      {issues.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '2rem',
          color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem',
        }}>
          No issues detected — systems look healthy.
        </div>
      )}
    </div>
  );
}

// ─── Employee Integrity ───────────────────────────────────────

function EmployeeIntegrity({ employees: propEmployees }) {
  const employees = propEmployees || DEFAULT_EMPLOYEES;
  const [page, setPage] = useState(0);
  const [hoveredEmployee, setHoveredEmployee] = useState(null);
  const perPage = 5;
  const totalPages = Math.ceil(employees.length / perPage);
  const visible = employees.slice(page * perPage, (page + 1) * perPage);

  // Generate deterministic avatar color from name
  function avatarColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 50%)`;
  }

  function initials(name) {
    return name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  }

  function scoreColor(score) {
    if (score >= 95) return '#22c55e';
    if (score >= 85) return '#eab308';
    if (score >= 70) return '#f97316';
    return '#ef4444';
  }

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Employee Integrity</h3>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              style={{
                padding: '0.15rem 0.5rem', fontSize: '0.7rem',
                borderRadius: '4px', border: 'none', cursor: page === 0 ? 'default' : 'pointer',
                background: 'rgba(255,255,255,0.06)', color: page === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
              }}
            >
              ←
            </button>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
              {page + 1}/{totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              style={{
                padding: '0.15rem 0.5rem', fontSize: '0.7rem',
                borderRadius: '4px', border: 'none', cursor: page >= totalPages - 1 ? 'default' : 'pointer',
                background: 'rgba(255,255,255,0.06)', color: page >= totalPages - 1 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.6)',
              }}
            >
              →
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {visible.map((emp, idx) => (
          <div
            key={emp.name + idx}
            onMouseEnter={() => setHoveredEmployee(idx)}
            onMouseLeave={() => setHoveredEmployee(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.25rem 0.35rem',
              margin: '0 -0.35rem',
              borderRadius: 8,
              background: hoveredEmployee === idx ? 'rgba(99,102,241,0.06)' : 'transparent',
              transition: 'background 0.15s ease',
            }}
          >
            {/* Avatar with score badge */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: avatarColor(emp.name),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontWeight: 700, color: '#fff',
              }}>
                {emp.avatar || initials(emp.name)}
              </div>
              {/* Score badge */}
              <div style={{
                position: 'absolute', bottom: -4, right: -4,
                width: 20, height: 20, borderRadius: '50%',
                background: '#1a1040',
                border: `2px solid ${scoreColor(emp.score)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.5rem', fontWeight: 700,
                color: scoreColor(emp.score),
              }}>
                {emp.score}
              </div>
            </div>

            {/* Name */}
            <div style={{
              fontSize: '0.8rem', fontWeight: 500,
              color: 'rgba(255,255,255,0.8)',
              minWidth: 100, flexShrink: 0,
            }}>
              {emp.name}
            </div>

            {/* Bar */}
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${emp.barPct || emp.score}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                style={{
                  height: '100%', borderRadius: 4,
                  background: 'linear-gradient(90deg, #6366f1, #818cf8)',
                }}
              />
            </div>

            {/* Event count */}
            <span style={{
              fontSize: '0.75rem', fontWeight: hoveredEmployee === idx ? 700 : 600,
              color: hoveredEmployee === idx ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
              fontVariantNumeric: 'tabular-nums',
              minWidth: 40, textAlign: 'right',
              transition: 'color 0.15s ease',
            }}>
              {emp.events?.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────

export default function SystemsHealth({
  integrityScore = 97,
  bowtieStages,
  eventStatus,
  issues,
  employees,
  editMode,
  onUpdate,
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Top row: Integrity Score + Bowtie + Event Status */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'grid',
          gridTemplateColumns: '200px 1fr 240px',
          gap: '1.5rem',
          padding: '1.25rem',
          ...glassCard,
        }}
      >
        {/* Integrity Score */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          <div style={sectionLabel}>Integrity Score</div>
          <IntegrityGauge score={integrityScore} />
        </div>

        {/* Bowtie */}
        <div>
          <div style={sectionLabel}>Lifecycle Bowtie</div>
          <LifecycleBowtie stages={bowtieStages} />
        </div>

        {/* Event Status */}
        <div>
          <div style={sectionLabel}>Event Status</div>
          <EventStatus status={eventStatus} />
        </div>
      </motion.div>

      {/* Bottom row: Issues + Employee Integrity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.25rem',
      }}>
        {/* Issues */}
        <motion.div variants={fadeUpItem} style={{ padding: '1.25rem', ...glassCard }}>
          <IssuesList issues={issues} />
        </motion.div>

        {/* Employee Integrity */}
        <motion.div variants={fadeUpItem} style={{ padding: '1.25rem', ...glassCard }}>
          <EmployeeIntegrity employees={employees} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Shared Styles ────────────────────────────────────────────

const glassCard = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 12,
  backdropFilter: 'blur(12px)',
};

const sectionLabel = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};
