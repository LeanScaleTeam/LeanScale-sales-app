import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getCustomerServer } from '../../lib/getCustomer';
import { supabaseAdmin } from '../../lib/supabase';
import { staggerContainer, fadeUpItem } from '../../lib/animations';
import { power10Metrics as defaultPower10Metrics } from '../../data/power10-metrics';
import {
  LineChart, Line, XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function countReportable(power10Snapshot) {
  if (!Array.isArray(power10Snapshot)) return null;
  return power10Snapshot.filter(m => m.ableToReport === 'healthy' || m.ableToReport === 'careful').length;
}

function getOverallScore(scoresSnapshot) {
  return scoresSnapshot?.overall ?? null;
}

function formatPeriod(start, end) {
  if (!start && !end) return null;
  const fmt = d => new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (start && end) return `${fmt(start)} – ${fmt(end)}`;
  if (start) return `From ${fmt(start)}`;
  return `Until ${fmt(end)}`;
}

const QUARTER_PRESETS = ['Q0', 'Q1', 'Q2', 'Q3', 'Q4'];
const YEARS = [2024, 2025, 2026, 2027];

// ─── New QBR Modal ────────────────────────────────────────────────────────────

function NewQBRModal({ customer, onClose, onCreated }) {
  const currentYear = new Date().getFullYear();
  const [qPart, setQPart]   = useState('Q1');
  const [year, setYear]     = useState(currentYear);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd,   setPeriodEnd]   = useState('');
  const [hoursBudgeted, setHoursBudgeted] = useState('');
  const [prefill, setPrefill] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error,  setError]    = useState(null);

  const quarter = `${qPart}-${year}`;
  const isBaseline = qPart === 'Q0';
  const label = isBaseline
    ? `${year} Kickoff Baseline`
    : `${qPart} ${year} Business Review`;

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      let power10Snapshot = [];
      let scoresSnapshot  = {};

      if (prefill) {
        // Fetch current v3 diagnostic snapshot
        const r = await fetch(`/api/diagnostic/v3/results?customerId=${customer.id}`);
        if (r.ok) {
          const json = await r.json();
          const overrides = json.data?.engagement_overrides?.power10 || {};
          // Build power10 snapshot from default metrics + any saved overrides
          power10Snapshot = defaultPower10Metrics.map(m => ({
            ...m,
            ableToReport:      overrides[m.name]?.ableToReport      ?? m.ableToReport,
            statusAgainstPlan: overrides[m.name]?.statusAgainstPlan ?? m.statusAgainstPlan,
          }));
          scoresSnapshot = {
            overall:  json.data?.overall_score  ?? null,
            byPillar: json.data?.pillar_scores  ?? {},
          };
        }
      }

      const res = await fetch('/api/qbr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          quarter,
          quarterLabel: label,
          isBaseline,
          periodStart: periodStart || null,
          periodEnd:   periodEnd   || null,
          hoursBudgeted: hoursBudgeted ? Number(hoursBudgeted) : null,
          power10Snapshot,
          scoresSnapshot,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create QBR');
      onCreated(json.qbr);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }} onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#100d1e',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
          padding: '2rem',
          width: '100%', maxWidth: 480,
          boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        }}
      >
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'rgba(255,255,255,0.95)', margin: '0 0 1.5rem', letterSpacing: '-0.01em' }}>
          New QBR
        </h2>

        {/* Quarter selector */}
        <label style={labelStyle}>Quarter</label>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <select value={qPart} onChange={e => setQPart(e.target.value)} style={selectStyle}>
            {QUARTER_PRESETS.map(q => <option key={q} value={q}>{q}</option>)}
          </select>
          <select value={year} onChange={e => setYear(Number(e.target.value))} style={selectStyle}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div style={{ fontSize: '0.7rem', color: '#a78bfa', marginBottom: '1.25rem' }}>
          Label: <strong>{label}</strong>
        </div>

        {/* Period */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle}>Period Start</label>
            <input type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Period End</label>
            <input type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)} style={inputStyle} />
          </div>
        </div>

        {/* Hours */}
        <label style={labelStyle}>Hours Budgeted</label>
        <input
          type="number" min="0" value={hoursBudgeted}
          onChange={e => setHoursBudgeted(e.target.value)}
          placeholder="e.g. 80"
          style={{ ...inputStyle, marginBottom: '1.25rem' }}
        />

        {/* Pre-fill toggle */}
        <label style={{
          display: 'flex', alignItems: 'center', gap: '0.65rem',
          cursor: 'pointer', marginBottom: '1.5rem',
        }}>
          <div
            onClick={() => setPrefill(p => !p)}
            style={{
              width: 36, height: 20, borderRadius: 10,
              background: prefill ? '#7c3aed' : 'rgba(255,255,255,0.12)',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0,
            }}
          >
            <div style={{
              position: 'absolute', top: 2,
              left: prefill ? 18 : 2,
              width: 16, height: 16, borderRadius: '50%',
              background: 'white', transition: 'left 0.2s',
            }} />
          </div>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
            Pre-fill Power 10 from current diagnostic
          </span>
        </label>

        {error && (
          <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginBottom: '1rem' }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
          <button onClick={handleCreate} disabled={saving} style={primaryBtnStyle}>
            {saving ? 'Creating…' : 'Create QBR'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── QBR Card ─────────────────────────────────────────────────────────────────

function QBRCard({ qbr, slug, isAdmin }) {
  const reportable = countReportable(qbr.power10_snapshot);
  const score = getOverallScore(qbr.scores_snapshot);
  const period = formatPeriod(qbr.period_start, qbr.period_end);
  const completedCount = (qbr.projects_completed || []).length;
  const winsCount = (qbr.wins || []).length;
  const isDraft = qbr.status === 'draft';
  const isBaseline = qbr.is_baseline;

  return (
    <motion.div variants={fadeUpItem}>
      <Link href={`/c/${slug}/qbr/${encodeURIComponent(qbr.quarter)}`} style={{ textDecoration: 'none' }}>
        <div style={{
          background: isBaseline ? 'rgba(124,58,237,0.08)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${isBaseline ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)'}`,
          borderRadius: 14,
          padding: '1.4rem',
          cursor: 'pointer',
          transition: 'all 0.18s ease',
          height: '100%',
          display: 'flex', flexDirection: 'column', gap: '0.75rem',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = isBaseline ? 'rgba(124,58,237,0.55)' : 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = isBaseline ? 'rgba(124,58,237,0.3)' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, color: isBaseline ? '#a78bfa' : 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                {isBaseline ? 'Kickoff Baseline' : qbr.quarter}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                {qbr.quarter_label || qbr.quarter}
              </div>
            </div>
            <div style={{
              padding: '0.15rem 0.5rem',
              borderRadius: 20,
              fontSize: '0.58rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.06em',
              background: isDraft ? 'rgba(255,255,255,0.06)' : 'rgba(34,197,94,0.12)',
              color: isDraft ? 'rgba(255,255,255,0.3)' : '#86efac',
              border: `1px solid ${isDraft ? 'rgba(255,255,255,0.1)' : 'rgba(34,197,94,0.3)'}`,
            }}>
              {isDraft ? 'Draft' : 'Published'}
            </div>
          </div>

          {/* Period */}
          {period && (
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)' }}>{period}</div>
          )}

          {/* Stats */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {reportable !== null && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#a78bfa', lineHeight: 1 }}>{reportable}/10</div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>Reportable</div>
              </div>
            )}
            {completedCount > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#86efac', lineHeight: 1 }}>{completedCount}</div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>Projects</div>
              </div>
            )}
            {winsCount > 0 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>{winsCount}</div>
                <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>Wins</div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div style={{ fontSize: '0.72rem', color: isBaseline ? '#a78bfa' : 'rgba(255,255,255,0.4)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            View QBR <span>→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Trend Chart ──────────────────────────────────────────────────────────────

function TrendChart({ qbrs }) {
  // Include all QBRs in trend, using quarter label for display
  const data = qbrs.map(q => ({
    quarter: q.quarter.replace('-', ' '),
    reportable: countReportable(q.power10_snapshot),
    wins: Array.isArray(q.wins) ? q.wins.length : 0,
    projects: Array.isArray(q.projects_completed) ? q.projects_completed.length : 0,
  }));

  if (data.length < 2) return null;

  const hasWins     = data.some(d => d.wins > 0);
  const hasProjects = data.some(d => d.projects > 0);

  return (
    <motion.div variants={fadeUpItem} style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '1.25rem',
      marginBottom: '2rem',
    }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
        Progress Over Time
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: -20 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="quarter" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <ReTooltip
            contentStyle={{ background: '#100d1e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 12, color: '#fff' }}
            labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
          />
          <Line type="monotone" dataKey="reportable" stroke="#a78bfa" strokeWidth={2} dot={{ fill: '#a78bfa', r: 4 }} name="Power 10 Reportable" />
          {hasWins     && <Line type="monotone" dataKey="wins"     stroke="#fbbf24" strokeWidth={2} dot={{ fill: '#fbbf24', r: 4 }} name="Wins" strokeDasharray="4 2" />}
          {hasProjects && <Line type="monotone" dataKey="projects" stroke="#86efac" strokeWidth={2} dot={{ fill: '#86efac', r: 4 }} name="Projects Completed" strokeDasharray="2 3" />}
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <div style={{ width: 12, height: 2, background: '#a78bfa', borderRadius: 1 }} />
          <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>Power 10 Reportable</span>
        </div>
        {hasWins && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: 12, height: 2, background: '#fbbf24', borderRadius: 1, borderTop: '1px dashed #fbbf24' }} />
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>Wins</span>
          </div>
        )}
        {hasProjects && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div style={{ width: 12, height: 2, background: '#86efac', borderRadius: 1 }} />
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)' }}>Projects Completed</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function QBRHub({ customer, qbrs: initialQBRs, isAdmin }) {
  const router = useRouter();
  const [qbrs, setQBRs] = useState(initialQBRs || []);
  const [showModal, setShowModal] = useState(false);

  if (!customer) return null;

  function handleCreated(qbr) {
    setShowModal(false);
    router.push(`/c/${customer.slug}/qbr/${encodeURIComponent(qbr.quarter)}`);
  }

  return (
    <Layout title={`${customer.customerName} — QBR Hub`}>
      <div style={{ background: '#070512', minHeight: '100vh' }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(160deg, #0a0118 0%, #170930 50%, #0a0118 100%)',
          padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 600, height: 400,
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                {customer.customerLogo && (
                  <img src={customer.customerLogo} alt={customer.customerName} style={{ height: 40, marginBottom: '1rem', objectFit: 'contain' }} />
                )}
                <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 900, color: 'white', margin: 0, letterSpacing: '-0.025em', lineHeight: 1.05 }}>
                  {customer.customerName}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '0.15rem 0.6rem', borderRadius: 20,
                    background: 'rgba(163,230,53,0.12)',
                    border: '1px solid rgba(163,230,53,0.25)',
                    fontSize: '0.65rem', fontWeight: 700, color: '#a3e635',
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                  }}>
                    Active Customer
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}>
                    {qbrs.length} quarter{qbrs.length !== 1 ? 's' : ''} on record
                  </span>
                </div>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                    color: 'white', fontWeight: 700,
                    padding: '0.65rem 1.4rem',
                    fontSize: '0.85rem', border: 'none', borderRadius: 10, cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
                    flexShrink: 0,
                  }}
                >
                  + New QBR
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="show">

            {qbrs.length === 0 ? (
              <motion.div variants={fadeUpItem} style={{
                textAlign: 'center', padding: '4rem 2rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed rgba(255,255,255,0.1)',
                borderRadius: 16,
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📋</div>
                <h2 style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, margin: '0 0 0.5rem' }}>No QBRs yet</h2>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
                  Create the first QBR to establish the baseline from the diagnostic.
                </p>
                {isAdmin && (
                  <button onClick={() => setShowModal(true)} style={primaryBtnStyle}>
                    Create Q0 Baseline
                  </button>
                )}
              </motion.div>
            ) : (
              <>
                <TrendChart qbrs={qbrs} />
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1rem',
                }}>
                  {qbrs.map(qbr => (
                    <QBRCard key={qbr.id} qbr={qbr} slug={customer.slug} isAdmin={isAdmin} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>

        {showModal && (
          <NewQBRModal
            customer={customer}
            onClose={() => setShowModal(false)}
            onCreated={handleCreated}
          />
        )}
      </div>
    </Layout>
  );
}

// ─── Shared Styles ────────────────────────────────────────────────────────────

const labelStyle = {
  display: 'block', fontSize: '0.68rem', fontWeight: 600,
  color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase',
  letterSpacing: '0.06em', marginBottom: '0.35rem',
};
const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
  color: 'rgba(255,255,255,0.85)', padding: '0.5rem 0.75rem',
  fontSize: '0.85rem', boxSizing: 'border-box',
};
const selectStyle = {
  ...inputStyle, cursor: 'pointer', flex: 1,
};
const primaryBtnStyle = {
  flex: 1, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
  color: 'white', fontWeight: 700, padding: '0.65rem 1.25rem',
  fontSize: '0.85rem', border: 'none', borderRadius: 10, cursor: 'pointer',
};
const cancelBtnStyle = {
  flex: 1, background: 'rgba(255,255,255,0.06)',
  color: 'rgba(255,255,255,0.6)', fontWeight: 600,
  padding: '0.65rem 1.25rem',
  fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, cursor: 'pointer',
};

// ─── Server Side ──────────────────────────────────────────────────────────────

export async function getServerSideProps(context) {
  const customer = await getCustomerServer(context);

  if (!customer) return { notFound: true };
  if (customer.customerType !== 'active') {
    return { redirect: { destination: '/diagnostic/gtm', permanent: false } };
  }

  // Check admin session
  const cookies = context.req.cookies || {};
  const isAdmin = Object.keys(cookies).some(
    key => key.startsWith('sb-') && key.endsWith('-auth-token')
  ) || !!(cookies['admin-session']);

  // Load all QBRs
  let qbrs = [];
  if (supabaseAdmin) {
    const { data } = await supabaseAdmin
      .from('customer_qbrs')
      .select('*')
      .eq('customer_id', customer.id)
      .order('quarter', { ascending: true });
    qbrs = (data || []).filter(q => isAdmin || q.status === 'published');
  }

  return {
    props: {
      customer: JSON.parse(JSON.stringify(customer)),
      qbrs:     JSON.parse(JSON.stringify(qbrs)),
      isAdmin,
    },
  };
}
