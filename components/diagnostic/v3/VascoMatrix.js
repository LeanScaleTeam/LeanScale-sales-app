/**
 * VascoMatrix — Renders the GTM Matrix status grid, tech stack, and Claude
 * insights from a vasco-qbr-snapshot upload. Designed to sit in the diagnostic
 * CRM Health section alongside VascoTrends.
 */

const STATUS_STYLES = {
  'OK':               { bg: 'rgba(34,197,94,0.12)',  text: '#86efac', border: 'rgba(34,197,94,0.3)' },
  'Set':              { bg: 'rgba(34,197,94,0.12)',  text: '#86efac', border: 'rgba(34,197,94,0.3)' },
  'Working':          { bg: 'rgba(59,130,246,0.12)', text: '#93c5fd', border: 'rgba(59,130,246,0.3)' },
  'To Double Check':  { bg: 'rgba(234,179,8,0.12)',  text: '#fde047', border: 'rgba(234,179,8,0.3)' },
  'Needs Refinement': { bg: 'rgba(234,179,8,0.12)',  text: '#fde047', border: 'rgba(234,179,8,0.3)' },
  'Needs Work':       { bg: 'rgba(249,115,22,0.14)', text: '#fdba74', border: 'rgba(249,115,22,0.3)' },
  'Need':             { bg: 'rgba(239,68,68,0.12)',  text: '#fca5a5', border: 'rgba(239,68,68,0.3)' },
  'Not Set':          { bg: 'rgba(239,68,68,0.12)',  text: '#fca5a5', border: 'rgba(239,68,68,0.3)' },
  'Paused':           { bg: 'rgba(156,163,175,0.14)', text: '#d1d5db', border: 'rgba(156,163,175,0.3)' },
  'N/A':              { bg: 'rgba(75,85,99,0.14)',   text: 'rgba(255,255,255,0.4)', border: 'rgba(75,85,99,0.3)' },
};

const DEFAULT_STATUS = { bg: 'rgba(75,85,99,0.14)', text: 'rgba(255,255,255,0.4)', border: 'rgba(75,85,99,0.3)' };

const CATEGORY_LABELS = {
  crm_connection: 'CRM Connection',
  planning: 'Planning',
  reporting: 'Reporting & ICP',
  unit_economics: 'Unit Economics',
};

const FIELD_LABELS = {
  lifecycle_stages: 'Lifecycle Stages + Journey',
  motions: 'Motions',
  channels: 'Channels',
  employees: 'Employees',
  data_radar: 'Data Radar (Value Delivered)',
  top_down_summary: '2026 Top-Down Summary',
  top_down_acquisition_targets: 'Acquisition Targets',
  digest_activation: 'Digest Activation',
  bottom_up: 'Bottom-Up Individual Targets',
  bi_dashboards: 'BI Dashboards',
  icp: 'ICP (Dimensions + Profiles)',
};

const TECH_STACK_LABELS = {
  crm: 'CRM',
  call_recording: 'Call Recording',
  billing: 'Billing',
  erp: 'ERP',
  data_warehouse: 'Data Warehouse',
  marketing_analytics: 'Marketing Analytics',
  product_analytics: 'Product Analytics',
  project_management: 'Project Management',
  hr: 'HR',
};

function StatusPill({ status, inferred }) {
  if (!status) return null;
  const s = STATUS_STYLES[status] || DEFAULT_STATUS;
  return (
    <span
      title={inferred ? 'Inferred by Claude from Vasco data' : 'Set by architect'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 12,
        background: s.bg, border: `1px solid ${s.border}`, color: s.text,
        fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.02em',
      }}
    >
      {inferred && <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>◆</span>}
      {status}
    </span>
  );
}

function renderFieldRow(fieldKey, value) {
  if (!value) return null;
  const label = FIELD_LABELS[fieldKey] || fieldKey;
  return (
    <div key={fieldKey} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div>
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>{label}</div>
        {value.notes && (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: 2 }}>
            {value.notes}
          </div>
        )}
      </div>
      <StatusPill status={value.status} inferred={value.inferred} />
    </div>
  );
}

function Section({ title, rows }) {
  const visible = rows.filter(Boolean);
  if (visible.length === 0) return null;
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.7rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: '0.35rem',
        padding: '0 0.75rem',
      }}>
        {title}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 8 }}>
        {visible}
      </div>
    </div>
  );
}

export default function VascoMatrix({ matrix, techStack, insights, architect, quarter, periodComparison, snapshotDate }) {
  if (!matrix && !techStack && !insights) return null;

  return (
    <div style={{
      marginTop: '1.5rem',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: '1.5rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: 600, margin: 0 }}>
          GTM Matrix
        </h3>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>
          {quarter && <span>{quarter}</span>}
          {quarter && architect && <span> · </span>}
          {architect && <span>{architect}</span>}
          {(quarter || architect) && snapshotDate && <span> · </span>}
          {snapshotDate && <span>as of {snapshotDate}</span>}
        </div>
      </div>

      {/* Period comparison banner */}
      {periodComparison && (
        <div style={{
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 8,
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          display: 'flex', gap: '1.5rem', flexWrap: 'wrap',
          fontSize: '0.8rem',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>
            vs {periodComparison.prior_quarter || periodComparison.prior_snapshot_date}:
          </span>
          {periodComparison.integrity_delta != null && (
            <Delta label="Integrity" value={periodComparison.integrity_delta} suffix="pts" />
          )}
          {periodComparison.leads_delta != null && (
            <Delta label="Leads" value={periodComparison.leads_delta} />
          )}
          {periodComparison.won_delta != null && (
            <Delta label="Won" value={periodComparison.won_delta} />
          )}
          {periodComparison.win_rate_delta != null && (
            <Delta label="Win Rate" value={periodComparison.win_rate_delta} suffix="pts" />
          )}
          {periodComparison.net_arr_delta != null && (
            <Delta label="Net ARR" value={Math.round(periodComparison.net_arr_delta / 1000)} suffix="K" dollar />
          )}
        </div>
      )}

      {/* Matrix grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        {matrix?.crm_connection && (
          <Section
            title={CATEGORY_LABELS.crm_connection}
            rows={Object.entries(matrix.crm_connection).map(([k, v]) => renderFieldRow(k, v))}
          />
        )}
        {matrix?.planning && (
          <Section
            title={CATEGORY_LABELS.planning}
            rows={Object.entries(matrix.planning).map(([k, v]) => renderFieldRow(k, v))}
          />
        )}
        {matrix?.reporting && (
          <Section
            title={CATEGORY_LABELS.reporting}
            rows={Object.entries(matrix.reporting).map(([k, v]) => renderFieldRow(k, v))}
          />
        )}
        {matrix?.unit_economics && (
          <Section
            title={CATEGORY_LABELS.unit_economics}
            rows={[renderFieldRow('unit_economics', matrix.unit_economics)]}
          />
        )}
      </div>

      {/* Tech Stack */}
      {techStack && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', marginBottom: '0.5rem',
          }}>
            Tech Stack
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem' }}>
            {Object.entries(techStack).map(([k, v]) => (
              <div key={k} style={{
                background: 'rgba(255,255,255,0.03)',
                padding: '0.5rem 0.75rem',
                borderRadius: 6,
                fontSize: '0.8rem',
                display: 'flex', justifyContent: 'space-between', gap: '0.5rem',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {TECH_STACK_LABELS[k] || k}
                </span>
                <span style={{ color: v ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)', fontWeight: v ? 500 : 400 }}>
                  {v || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claude insights */}
      {insights?.recommendations && insights.recommendations.length > 0 && (
        <div>
          <div style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.08em', marginBottom: '0.5rem',
          }}>
            Recommendations
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            {insights.recommendations.map((rec, i) => (
              <li key={i} style={{ marginBottom: '0.25rem' }}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Delta({ label, value, suffix = '', dollar = false }) {
  const positive = value > 0;
  const negative = value < 0;
  const color = positive ? '#86efac' : negative ? '#fca5a5' : 'rgba(255,255,255,0.7)';
  const arrow = positive ? '↑' : negative ? '↓' : '·';
  return (
    <span>
      <span style={{ color: 'rgba(255,255,255,0.5)' }}>{label}: </span>
      <span style={{ color, fontWeight: 600 }}>
        {arrow} {dollar && '$'}{Math.abs(value).toLocaleString()}{suffix}
      </span>
    </span>
  );
}
