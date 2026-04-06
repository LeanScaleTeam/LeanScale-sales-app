import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpItem } from '../../../lib/animations';

/**
 * VascoImportPanel — Admin tool for importing GTM metric data from Vasco.
 *
 * Vasco (vasco.ai) is a GTM metrics platform that tracks actuals, forecasts,
 * and targets across HubSpot, Salesforce, Gong, and other connected sources.
 *
 * This panel:
 * 1. Accepts paste of Vasco JSON export or manual metric entry
 * 2. Maps Vasco metrics → LeanScale diagnostic competency scores
 * 3. Allows per-metric admin override before applying
 * 4. Calls onApplyImport({ [competencyId]: score }) to set scores
 *
 * Future: When Vasco MCP is live, the "Fetch from Vasco" button will auto-populate
 * via per-customer org ID + token (no shared token; SOC 2 segregated).
 */

// ─── Metric → Competency Mapping ─────────────────────────────────────────────

const VASCO_METRICS = [
  { key: 'win_rate',            label: 'Win Rate',               pillar: 'process',    competency: 'PR-3',  description: '% of opportunities closed won' },
  { key: 'pipeline_coverage',   label: 'Pipeline Coverage',      pillar: 'planning',   competency: 'PL-2',  description: 'Pipeline to quota ratio (target: 3-4x)' },
  { key: 'forecast_accuracy',   label: 'Forecast Accuracy',      pillar: 'reporting',  competency: 'RE-1',  description: 'Forecast vs. actuals variance' },
  { key: 'net_revenue_retention', label: 'Net Revenue Retention', pillar: 'process',   competency: 'CS-1',  description: 'NRR — expansion + retention' },
  { key: 'mql_volume',          label: 'MQL Volume vs. Target',  pillar: 'planning',   competency: 'MK-1',  description: 'MQL attainment as % of monthly target' },
  { key: 'crm_completeness',    label: 'CRM Data Quality',       pillar: 'systems',    competency: 'SY-1',  description: 'Required field completeness rate' },
  { key: 'rep_ramp_time',       label: 'Rep Ramp Time',          pillar: 'people',     competency: 'PE-1',  description: 'Avg months to full quota attainment' },
  { key: 'sales_cycle',         label: 'Sales Cycle Length',     pillar: 'process',    competency: 'PR-2',  description: 'Avg days from opportunity create to close' },
  { key: 'quota_attainment',    label: 'Quota Attainment',       pillar: 'people',     competency: 'PE-2',  description: '% of reps at or above quota' },
  { key: 'activity_compliance', label: 'Activity Logging Rate',  pillar: 'process',    competency: 'SE-1',  description: 'CRM activity compliance (calls, emails logged)' },
];

const PILLAR_COLORS = {
  process:   '#fdba74',
  planning:  '#a78bfa',
  reporting: '#60a5fa',
  systems:   '#86efac',
  people:    '#f472b6',
};

// Map Vasco status → diagnostic score (1-5 scale)
function statusToScore(status) {
  if (status === 'green')  return 4.5;
  if (status === 'yellow') return 2.8;
  if (status === 'red')    return 1.5;
  return null;
}

// Map actual/target ratio → status
function ratioToStatus(actual, target) {
  if (actual == null || target == null || target === 0) return null;
  const pct = actual / target;
  if (pct >= 0.9) return 'green';
  if (pct >= 0.6) return 'yellow';
  return 'red';
}

function parseVascoJson(raw) {
  try {
    const parsed = JSON.parse(raw);
    // Support { metrics: [{key, actual, target, status}] } or flat { key: value }
    if (Array.isArray(parsed.metrics)) {
      const result = {};
      for (const m of parsed.metrics) {
        if (m.key) result[m.key] = m;
      }
      return result;
    }
    // Flat format: { win_rate: { actual: 0.22, target: 0.28, status: 'red' } }
    return parsed;
  } catch {
    return null;
  }
}

// ─── CRM Health defaults ──────────────────────────────────────────────────────

const DEFAULT_STAGES = [
  { label: 'Awareness',   count: null, errorsBefore: null, errorsAfter: null },
  { label: 'Education',   count: null, errorsBefore: null, errorsAfter: null },
  { label: 'Selection',   count: null, errorsBefore: null, errorsAfter: null },
  { label: 'Closing',     count: null, errorsBefore: null, errorsAfter: null },
  { label: 'Onboarding',  count: null, errorsBefore: null, errorsAfter: null },
  { label: 'Retention',   count: null, errorsBefore: null, errorsAfter: null },
  { label: 'Expansion',   count: null, errorsBefore: null, errorsAfter: null },
];

function numField(val, onChange, placeholder) {
  return (
    <input
      type="number"
      min={0}
      value={val ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
      placeholder={placeholder}
      style={{
        width: '64px', padding: '0.25rem 0.4rem', borderRadius: 5,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', fontFamily: 'inherit',
        textAlign: 'right',
      }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VascoImportPanel({ customerId, onApplyImport, onApplyCrmHealth }) {
  const [orgId, setOrgId] = useState('');
  const [jsonPaste, setJsonPaste] = useState('');
  const [parseError, setParseError] = useState(null);
  const [parsedData, setParsedData] = useState(null); // { [key]: { actual, target, status } }
  const [scoreOverrides, setScoreOverrides] = useState({}); // { [key]: number }
  const [applyStatus, setApplyStatus] = useState(null); // null | 'success' | 'error'

  // ── CRM Health state ──────────────────────────────────────────
  const [integrityScore, setIntegrityScore] = useState('');
  const [stages, setStages] = useState(DEFAULT_STAGES.map(s => ({ ...s })));
  const [eventStatus, setEventStatus] = useState({ succeeded: '', warning: '', failed: '', ignored: '' });
  const [issues, setIssues] = useState([
    { severity: 'fail', category: 'Mapping', name: '', eventCount: '', description: '' },
  ]);
  const [employees, setEmployees] = useState([
    { name: '', score: '', events: '' },
  ]);
  const [crmSaveStatus, setCrmSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'

  function updateStage(i, field, value) {
    setStages(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  function buildCrmHealth() {
    const bowtie_stages = stages.map(s => {
      const entry = { label: s.label };
      if (s.count !== null && s.count !== '') entry.count = Number(s.count);
      if (s.errorsBefore !== null && s.errorsBefore !== '') entry.errorsBefore = Number(s.errorsBefore);
      if (s.errorsAfter !== null && s.errorsAfter !== '') entry.errorsAfter = Number(s.errorsAfter);
      return entry;
    });
    return {
      integrity_score: integrityScore !== '' ? Number(integrityScore) : null,
      bowtie_stages,
      event_status: {
        succeeded: eventStatus.succeeded !== '' ? Number(eventStatus.succeeded) : null,
        warning:   eventStatus.warning   !== '' ? Number(eventStatus.warning)   : null,
        failed:    eventStatus.failed    !== '' ? Number(eventStatus.failed)     : null,
        ignored:   eventStatus.ignored   !== '' ? Number(eventStatus.ignored)    : null,
      },
      issues: issues.filter(i => i.name).map(i => ({
        severity: i.severity,
        category: i.category,
        name: i.name,
        eventCount: i.eventCount !== '' ? Number(i.eventCount) : null,
        description: i.description,
      })),
      employees: employees.filter(e => e.name).map(e => ({
        name: e.name,
        score: e.score !== '' ? Number(e.score) : null,
        events: e.events !== '' ? Number(e.events) : null,
        barPct: e.score !== '' ? Number(e.score) : null,
      })),
    };
  }

  async function handleSaveCrmHealth() {
    setCrmSaveStatus('saving');
    try {
      const crm_health = buildCrmHealth();
      await onApplyCrmHealth?.(crm_health);
      setCrmSaveStatus('saved');
      setTimeout(() => setCrmSaveStatus(null), 3000);
    } catch {
      setCrmSaveStatus('error');
    }
  }

  function handleParse() {
    setParseError(null);
    if (!jsonPaste.trim()) {
      setParseError('Paste your Vasco JSON export above.');
      return;
    }
    const parsed = parseVascoJson(jsonPaste);
    if (!parsed) {
      setParseError('Could not parse JSON. Check the format and try again.');
      return;
    }
    setParsedData(parsed);
    setScoreOverrides({});
  }

  function handleApply() {
    if (!parsedData) return;
    const overrides = {};
    for (const metric of VASCO_METRICS) {
      const raw = parsedData[metric.key];
      if (!raw) continue;
      // Use manual override if set, otherwise derive from data
      if (scoreOverrides[metric.key] != null) {
        overrides[metric.competency] = scoreOverrides[metric.key];
      } else {
        const status = raw.status || ratioToStatus(raw.actual, raw.target);
        const score = statusToScore(status);
        if (score != null) overrides[metric.competency] = score;
      }
    }
    if (Object.keys(overrides).length === 0) {
      setApplyStatus('error');
      return;
    }
    onApplyImport?.(overrides);
    setApplyStatus('success');
  }

  const hasData = parsedData !== null;
  const appliedCount = VASCO_METRICS.filter(m => parsedData?.[m.key] != null).length;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
    >
      {/* Header */}
      <motion.div variants={fadeUpItem}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'rgba(96,165,250,0.12)',
            border: '1px solid rgba(96,165,250,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
          }}>
            V
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', margin: 0 }}>
              Vasco Import
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              Import GTM metric data from Vasco to auto-score diagnostic competencies.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Connection section */}
      <motion.div variants={fadeUpItem} className="card" style={{ padding: 'var(--space-4)' }}>
        <div style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)',
          marginBottom: 'var(--space-3)',
        }}>
          Vasco Connection (coming soon via MCP)
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
              Customer Vasco Org ID
            </label>
            <input
              value={orgId}
              onChange={e => setOrgId(e.target.value)}
              placeholder="e.g. org_abc123"
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: 'var(--text-sm)',
                fontFamily: 'inherit',
              }}
            />
          </div>
          <button
            disabled
            title="Vasco MCP integration coming soon"
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: 7,
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: 'rgba(255,255,255,0.25)',
              fontSize: 'var(--text-sm)',
              cursor: 'not-allowed',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            Fetch from Vasco
          </button>
        </div>
        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', margin: 'var(--space-2) 0 0' }}>
          Direct API connection via Vasco MCP available soon. Each customer requires their own Vasco org token (SOC 2 compliant).
        </p>
      </motion.div>

      {/* Paste import */}
      <motion.div variants={fadeUpItem} className="card" style={{ padding: 'var(--space-4)' }}>
        <div style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: 'var(--text-muted)',
          marginBottom: 'var(--space-3)',
        }}>
          Paste Vasco Export (JSON)
        </div>
        <textarea
          value={jsonPaste}
          onChange={e => { setJsonPaste(e.target.value); setParseError(null); setParsedData(null); }}
          placeholder={`{\n  "metrics": [\n    { "key": "win_rate", "actual": 0.22, "target": 0.28, "status": "red" },\n    { "key": "pipeline_coverage", "actual": 2.1, "target": 3.0, "status": "yellow" }\n  ]\n}`}
          rows={6}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            borderRadius: 6,
            border: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.03)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            resize: 'vertical',
            lineHeight: 1.5,
          }}
        />
        {parseError && (
          <p style={{ fontSize: 'var(--text-xs)', color: '#fca5a5', margin: 'var(--space-1) 0 0' }}>
            {parseError}
          </p>
        )}
        <button
          onClick={handleParse}
          style={{
            marginTop: 'var(--space-2)',
            padding: '0.45rem 1.1rem',
            borderRadius: 7,
            border: 'none',
            background: 'rgba(124,58,237,0.18)',
            color: '#a78bfa',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid rgba(124,58,237,0.3)',
          }}
        >
          Parse &amp; Preview
        </button>
      </motion.div>

      {/* Metric mapping table */}
      {hasData && (
        <motion.div
          variants={fadeUpItem}
          className="card"
          style={{ padding: 'var(--space-4)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--space-3)',
          }}>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-muted)',
            }}>
              Metric Mapping — {appliedCount} of {VASCO_METRICS.length} matched
            </div>
            <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
              Edit score to override
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {/* Column headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 90px 70px 80px 80px',
              gap: '0.5rem',
              padding: '0.35rem 0.5rem',
              borderBottom: '1px solid var(--border-color)',
            }}>
              {['Metric', 'Pillar', 'Status', 'Score', 'Override'].map(h => (
                <div key={h} style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                  {h}
                </div>
              ))}
            </div>

            {VASCO_METRICS.map(metric => {
              const raw = parsedData[metric.key];
              const hasMeasure = raw != null;
              const status = raw?.status || ratioToStatus(raw?.actual, raw?.target);
              const derivedScore = statusToScore(status);
              const overrideScore = scoreOverrides[metric.key];
              const finalScore = overrideScore ?? derivedScore;
              const pillarColor = PILLAR_COLORS[metric.pillar] || 'rgba(255,255,255,0.4)';

              const statusColors = {
                green: { text: '#86efac', bg: 'rgba(34,197,94,0.1)' },
                yellow: { text: '#fde047', bg: 'rgba(234,179,8,0.1)' },
                red: { text: '#fca5a5', bg: 'rgba(239,68,68,0.1)' },
              };
              const sc = statusColors[status] || { text: 'rgba(255,255,255,0.25)', bg: 'transparent' };

              return (
                <div
                  key={metric.key}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 90px 70px 80px 80px',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: 6,
                    background: hasMeasure ? 'rgba(255,255,255,0.02)' : 'transparent',
                    alignItems: 'center',
                    opacity: hasMeasure ? 1 : 0.35,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'rgba(255,255,255,0.85)' }}>
                      {metric.label}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>
                      → {metric.competency}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    color: pillarColor,
                    background: `${pillarColor}15`,
                    padding: '0.15rem 0.4rem',
                    borderRadius: 4,
                    textAlign: 'center',
                  }}>
                    {metric.pillar}
                  </div>
                  <div>
                    {status && (
                      <span style={{
                        display: 'inline-block',
                        padding: '0.15rem 0.45rem',
                        borderRadius: 4,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        color: sc.text,
                        background: sc.bg,
                        textTransform: 'capitalize',
                      }}>
                        {status}
                      </span>
                    )}
                    {raw?.actual != null && (
                      <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                        {typeof raw.actual === 'number' && raw.actual < 1
                          ? `${(raw.actual * 100).toFixed(0)}%`
                          : raw.actual}
                        {raw.target != null && (
                          <> / {typeof raw.target === 'number' && raw.target < 1
                            ? `${(raw.target * 100).toFixed(0)}%`
                            : raw.target}</>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: finalScore != null
                      ? (finalScore >= 4 ? '#86efac' : finalScore >= 2.5 ? '#fde047' : '#fca5a5')
                      : 'rgba(255,255,255,0.2)',
                    textAlign: 'center',
                  }}>
                    {finalScore != null ? finalScore.toFixed(1) : '—'}
                  </div>
                  <div>
                    {hasMeasure && (
                      <input
                        type="number"
                        min={1}
                        max={5}
                        step={0.1}
                        value={overrideScore ?? ''}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          setScoreOverrides(prev => ({
                            ...prev,
                            [metric.key]: isNaN(val) ? undefined : Math.min(5, Math.max(1, val)),
                          }));
                        }}
                        placeholder={derivedScore?.toFixed(1) ?? '—'}
                        style={{
                          width: '60px',
                          padding: '0.3rem 0.4rem',
                          borderRadius: 5,
                          border: '1px solid var(--border-color)',
                          background: 'rgba(255,255,255,0.05)',
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: 'var(--text-xs)',
                          fontFamily: 'inherit',
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Apply button */}
          <div style={{
            marginTop: 'var(--space-4)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={handleApply}
              style={{
                padding: '0.55rem 1.4rem',
                borderRadius: 9,
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: 'white',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(124,58,237,0.3)',
              }}
            >
              Apply to Diagnostic
            </button>
            {applyStatus === 'success' && (
              <span style={{ fontSize: 'var(--text-xs)', color: '#86efac' }}>
                Scores applied as consultant overrides. Rerun the diagnostic to see changes.
              </span>
            )}
            {applyStatus === 'error' && (
              <span style={{ fontSize: 'var(--text-xs)', color: '#fca5a5' }}>
                No matching metrics found to apply.
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Not-yet-matched metrics note */}
      {!hasData && (
        <motion.div variants={fadeUpItem} style={{
          fontSize: 'var(--text-xs)',
          color: 'rgba(255,255,255,0.25)',
          textAlign: 'center',
          padding: 'var(--space-3)',
        }}>
          Paste Vasco JSON above and click "Parse &amp; Preview" to see the metric mapping.
          Supported metrics: {VASCO_METRICS.map(m => m.label).join(', ')}.
        </motion.div>
      )}

      {/* ── CRM Health / Systems View ── */}
      <motion.div variants={fadeUpItem} className="card" style={{ padding: 'var(--space-4)' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
          CRM Health — Systems View Data
        </div>
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', margin: '0 0 var(--space-4)' }}>
          Enter data from the Vasco Radar screen. This populates the Systems tab bowtie and integrity display.
        </p>

        {/* Integrity score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: 'var(--space-4)' }}>
          <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', minWidth: 130 }}>Integrity Score (0–100)</label>
          <input
            type="number" min={0} max={100}
            value={integrityScore}
            onChange={e => setIntegrityScore(e.target.value)}
            placeholder="e.g. 90"
            style={{ width: 80, padding: '0.35rem 0.5rem', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontFamily: 'inherit' }}
          />
        </div>

        {/* Bowtie stages */}
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>Lifecycle Bowtie Stages</div>
        <div style={{ display: 'grid', gridTemplateColumns: '110px 72px 90px 90px', gap: '0.4rem', marginBottom: '0.3rem' }}>
          {['Stage', 'Count', 'Errors Before', 'Errors After'].map(h => (
            <div key={h} style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>{h}</div>
          ))}
        </div>
        {stages.map((s, i) => (
          <div key={s.label} style={{ display: 'grid', gridTemplateColumns: '110px 72px 90px 90px', gap: '0.4rem', alignItems: 'center', marginBottom: '0.35rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{s.label}</div>
            {numField(s.count,        (v) => updateStage(i, 'count', v),        '—')}
            {numField(s.errorsBefore, (v) => updateStage(i, 'errorsBefore', v), '—')}
            {numField(s.errorsAfter,  (v) => updateStage(i, 'errorsAfter', v),  '—')}
          </div>
        ))}

        {/* Event status */}
        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', margin: 'var(--space-4) 0 0.5rem' }}>Event Status</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: 'var(--space-4)' }}>
          {[['succeeded', '#86efac'], ['warning', '#fde047'], ['failed', '#fca5a5'], ['ignored', 'rgba(255,255,255,0.3)']].map(([key, color]) => (
            <div key={key}>
              <label style={{ fontSize: '0.62rem', color, textTransform: 'capitalize', display: 'block', marginBottom: '0.2rem' }}>{key}</label>
              <input
                type="number" min={0}
                value={eventStatus[key]}
                onChange={e => setEventStatus(prev => ({ ...prev, [key]: e.target.value }))}
                placeholder="0"
                style={{ width: '100%', padding: '0.35rem 0.5rem', borderRadius: 6, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontFamily: 'inherit', textAlign: 'right' }}
              />
            </div>
          ))}
        </div>

        {/* Issues */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 'var(--space-3) 0 0.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>Issues</div>
          <button onClick={() => setIssues(prev => [...prev, { severity: 'fail', category: 'Mapping', name: '', eventCount: '', description: '' }])}
            style={{ fontSize: '0.65rem', color: '#a78bfa', background: 'none', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 4, padding: '0.1rem 0.5rem', cursor: 'pointer' }}>
            + Add
          </button>
        </div>
        {issues.map((iss, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 90px 1fr 70px', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
            <select value={iss.severity} onChange={e => setIssues(prev => prev.map((x, j) => j === i ? { ...x, severity: e.target.value } : x))}
              style={{ padding: '0.25rem', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: iss.severity === 'fail' ? '#fca5a5' : '#fde047', fontSize: '0.72rem', fontFamily: 'inherit' }}>
              <option value="fail">Fail</option>
              <option value="warning">Warning</option>
            </select>
            <input value={iss.category} onChange={e => setIssues(prev => prev.map((x, j) => j === i ? { ...x, category: e.target.value } : x))}
              placeholder="Mapping"
              style={{ padding: '0.25rem 0.4rem', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontFamily: 'inherit' }} />
            <input value={iss.name} onChange={e => setIssues(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
              placeholder="Issue name"
              style={{ padding: '0.25rem 0.4rem', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontFamily: 'inherit' }} />
            <input type="number" value={iss.eventCount} onChange={e => setIssues(prev => prev.map((x, j) => j === i ? { ...x, eventCount: e.target.value } : x))}
              placeholder="Events"
              style={{ padding: '0.25rem 0.4rem', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontFamily: 'inherit', textAlign: 'right' }} />
          </div>
        ))}

        {/* Employees */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 'var(--space-3) 0 0.5rem' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>Employee Integrity</div>
          <button onClick={() => setEmployees(prev => [...prev, { name: '', score: '', events: '' }])}
            style={{ fontSize: '0.65rem', color: '#a78bfa', background: 'none', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 4, padding: '0.1rem 0.5rem', cursor: 'pointer' }}>
            + Add
          </button>
        </div>
        {employees.map((emp, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 70px', gap: '0.4rem', alignItems: 'center', marginBottom: '0.35rem' }}>
            <input value={emp.name} onChange={e => setEmployees(prev => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
              placeholder="Full name"
              style={{ padding: '0.25rem 0.4rem', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontFamily: 'inherit' }} />
            <input type="number" min={0} max={100} value={emp.score} onChange={e => setEmployees(prev => prev.map((x, j) => j === i ? { ...x, score: e.target.value } : x))}
              placeholder="Score"
              style={{ padding: '0.25rem 0.4rem', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontFamily: 'inherit', textAlign: 'right' }} />
            <input type="number" min={0} value={emp.events} onChange={e => setEmployees(prev => prev.map((x, j) => j === i ? { ...x, events: e.target.value } : x))}
              placeholder="Events"
              style={{ padding: '0.25rem 0.4rem', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', fontFamily: 'inherit', textAlign: 'right' }} />
          </div>
        ))}

        {/* Save button */}
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button
            onClick={handleSaveCrmHealth}
            disabled={crmSaveStatus === 'saving'}
            style={{
              padding: '0.55rem 1.4rem', borderRadius: 9, border: 'none',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: 'white', fontSize: 'var(--text-sm)', fontWeight: 700,
              cursor: crmSaveStatus === 'saving' ? 'wait' : 'pointer',
              boxShadow: '0 4px 16px rgba(37,99,235,0.3)',
              opacity: crmSaveStatus === 'saving' ? 0.7 : 1,
            }}
          >
            {crmSaveStatus === 'saving' ? 'Saving…' : 'Save to Systems View'}
          </button>
          {crmSaveStatus === 'saved' && <span style={{ fontSize: 'var(--text-xs)', color: '#86efac' }}>Saved — refresh the Systems tab to see it.</span>}
          {crmSaveStatus === 'error' && <span style={{ fontSize: 'var(--text-xs)', color: '#fca5a5' }}>Save failed. Check console.</span>}
        </div>
      </motion.div>
    </motion.div>
  );
}
