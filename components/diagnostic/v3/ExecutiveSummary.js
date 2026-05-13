import { useMemo } from 'react';
import {
  PILLAR_ORDER,
  PILLAR_LABELS,
  V3_STATUS_COLORS,
  DEPARTMENTS,
  DEPT_LABELS,
} from '../../../lib/diagnostic-engine/v3/constants-v3';

const V3_STATUS_LABELS = {
  1: 'Weak',
  2: 'Below Average',
  3: 'Average',
  4: 'Good',
  5: 'Best Practice',
};

const PILLAR_IMPACT = {
  planning: 'Quota attainment and forecast accuracy suffer',
  people: 'Rep ramp time is slow, team underperforms',
  process: 'Pipeline velocity and conversion rates are impacted',
  systems: 'Data quality and automation break down',
  reporting: 'Revenue visibility and board confidence are at risk',
  enablement: 'Win rates are inconsistent, ramp takes too long',
};

const PHASE_COLORS = {
  FOUNDATION: '#E53E3E',
  BUILD: '#ED8936',
  OPTIMIZE: '#48BB78',
  SCALE: '#4299E1',
};

const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 'var(--radius-xl)',
  padding: '1.5rem',
};

function healthDot(score) {
  if (score == null) return { dot: '—', color: '#718096' };
  if (score >= 4) return { dot: '🟢', color: '#48BB78' };
  if (score >= 2.5) return { dot: '🟡', color: '#ECC94B' };
  return { dot: '🔴', color: '#E53E3E' };
}

function getCompetencyAvg(comp) {
  const vals = Object.values(comp.departments || {}).filter((v) => v !== null && v !== undefined);
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function getWorstCompetencyForPillar(competencies, pillar) {
  const matches = competencies
    .filter((c) => c.pillar === pillar && c.avg != null)
    .sort((a, b) => a.avg - b.avg);
  return matches[0] || null;
}

function formatDate(raw) {
  if (!raw) return 'TBD';
  const d = new Date(raw + (raw.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(d)) return raw;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function resolveEngagement(overrides) {
  return {
    type: overrides?.engagement_type || null,
    investment: overrides?.monthly_investment
      ? `$${Number(overrides.monthly_investment).toLocaleString()}/mo`
      : null,
    hours: overrides?.monthly_hours ? `${overrides.monthly_hours} hrs/mo` : null,
    startDate: overrides?.start_date ? formatDate(overrides.start_date) : null,
  };
}

function SectionHeading({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div style={{ width: '4px', height: '1.4rem', background: 'var(--ls-lime-green)', borderRadius: '2px', flexShrink: 0 }} />
      <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.01em' }}>
        {children}
      </h2>
    </div>
  );
}

function badgeStyle(bg, color) {
  return {
    fontSize: '0.7rem',
    fontWeight: 600,
    padding: '0.2rem 0.55rem',
    borderRadius: '999px',
    background: bg,
    color,
    letterSpacing: '0.02em',
  };
}

export default function ExecutiveSummary({
  v3Result,
  mergedRoadmap,
  engagementOverrides,
  customer,
  consultantAssessments,
}) {
  const isReady = v3Result?.overall_score != null && v3Result?.pillar_scores;

  const competencies = useMemo(() => {
    if (!v3Result?.competencies) return [];
    return v3Result.competencies.map((c) => ({ ...c, avg: getCompetencyAvg(c) }));
  }, [v3Result]);

  const criticalFindings = useMemo(() => {
    return competencies
      .filter((c) => c.avg !== null && c.avg <= 2.5)
      .sort((a, b) => a.avg - b.avg)
      .slice(0, 5);
  }, [competencies]);

  const gapItems = useMemo(() => {
    const seen = new Set();
    return competencies
      .filter((c) => c.avg !== null)
      .sort((a, b) => a.avg - b.avg)
      .filter((c) => {
        if (seen.has(c.pillar)) return false;
        seen.add(c.pillar);
        return true;
      })
      .slice(0, 4);
  }, [competencies]);

  const allProjects = useMemo(() => {
    if (!mergedRoadmap?.phases) return [];
    // Defensive: company_profile.crm or crmType may be an array in multi-CRM
    // diagnostics if a legacy save snuck through. Coerce to a string before lowering.
    const crmRaw = v3Result?.company_profile?.crm ?? v3Result?.crmType ?? '';
    const crm = (Array.isArray(crmRaw) ? crmRaw.join(',') : String(crmRaw)).toLowerCase();
    const CRM_EXCLUDE = {
      salesforce: new Set(['hubspot-impl', 'salesforce-to-hubspot-crm-migration']),
      hubspot: new Set(['salesforce-impl', 'hubspot-to-salesforce-crm-migration']),
    };
    const excluded = CRM_EXCLUDE[crm] || new Set();
    return mergedRoadmap.phases.flatMap((p) =>
      (p.projects || [])
        .filter((proj) => !excluded.has(proj.serviceId))
        .map((proj) => ({
          ...proj,
          name: proj.name || proj.service?.name || proj.serviceId,
          description: proj.description || proj.service?.description,
          phaseName: p.name,
          phaseColor: PHASE_COLORS[(p.key || p.name)?.toUpperCase()] || p.color || '#718096',
        }))
    ).sort((a, b) => (b.priority?.score ?? 0) - (a.priority?.score ?? 0));
  }, [mergedRoadmap, v3Result]);

  const engagement = useMemo(() => resolveEngagement(engagementOverrides), [engagementOverrides]);

  const overallScore = v3Result?.overall_score ?? null;
  const scoreRounded = overallScore != null ? Math.round(overallScore) : null;
  const overallLabel = scoreRounded != null ? (V3_STATUS_LABELS[scoreRounded] || 'No Data') : 'No Data';
  const ringColor = scoreRounded != null ? (V3_STATUS_COLORS[scoreRounded] || '#CBD5E0') : '#CBD5E0';

  if (!isReady) {
    return (
      <div className="diagnostic-pending-state">
        <div className="diagnostic-pending-state__icon">⚡</div>
        <div className="diagnostic-pending-state__title">Executive Summary</div>
        <p className="diagnostic-pending-state__body">
          This view will be automatically populated once the full diagnostic has been completed and
          scored. It contains your GTM health overview, top priorities, and engagement summary —
          ready for a multi-stakeholder presentation.
        </p>
      </div>
    );
  }

  const rawProfile = v3Result.company_profile || {};
  // Multi-CRM defensive coercion: company_profile.crm may be an array
  // (['attio','hubspot_map']) for rows saved before the engine started
  // writing the legacy string. Normalize to a comma-joined string so all
  // string methods downstream (.toUpperCase, .toLowerCase, etc.) work.
  const profile = {
    ...rawProfile,
    crm: Array.isArray(rawProfile.crm)
      ? rawProfile.crm.join(',')
      : (rawProfile.crm ?? 'unknown'),
  };
  const pillarScores = v3Result.pillar_scores || {};
  const deptScores = v3Result.department_scores || {};
  const dataCoverage = v3Result.data_coverage;

  const strategicNote =
    engagementOverrides?.notes ||
    (consultantAssessments?.length > 0
      ? consultantAssessments[0]?.finding || consultantAssessments[0]?.note
      : null);

  const engagementItems = [
    { label: 'Engagement Type', value: engagement.type },
    { label: 'Monthly Investment', value: engagement.investment },
    { label: 'Monthly Hours', value: engagement.hours },
    { label: 'Start Date', value: engagement.startDate },
  ];
  const hasAnyEngagement = engagementItems.some((e) => e.value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

      {/* ── Section 1: Hero ── */}
      <div style={{
        ...card,
        background: 'linear-gradient(135deg, rgba(100,37,133,0.3) 0%, rgba(48,25,52,0.5) 100%)',
        borderColor: 'rgba(124,58,237,0.3)',
        padding: '2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>

          {/* Score ring */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '7.5rem', height: '7.5rem', borderRadius: '50%',
              border: `6px solid ${ringColor}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.25)',
              boxShadow: `0 0 32px ${ringColor}50, inset 0 0 20px ${ringColor}10`,
            }}>
              <span style={{ fontSize: '2.1rem', fontWeight: 800, color: ringColor, lineHeight: 1 }}>
                {overallScore != null ? overallScore.toFixed(1) : '—'}
              </span>
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)', fontWeight: 500, marginTop: '0.25rem', letterSpacing: '0.04em' }}>
                OUT OF 5.0
              </span>
            </div>
            <span style={{
              fontSize: '0.68rem', fontWeight: 700, color: ringColor,
              textTransform: 'uppercase', letterSpacing: '0.07em',
              background: `${ringColor}18`, padding: '0.2rem 0.6rem', borderRadius: '999px',
              border: `1px solid ${ringColor}35`,
            }}>
              {overallLabel}
            </span>
          </div>

          {/* Company info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)', marginBottom: '0.35rem' }}>
              GTM Diagnostic Report
            </div>
            <h1 style={{ margin: '0 0 0.6rem', fontSize: 'clamp(1.3rem, 3vw, 1.9rem)', fontWeight: 800, color: 'rgba(255,255,255,0.97)', lineHeight: 1.15 }}>
              {customer?.customerName || 'Executive Summary'}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
              {profile.crm && profile.crm !== 'unknown' && (
                <span style={badgeStyle('rgba(124,58,237,0.3)', 'rgba(167,139,250,0.9)')}>
                  {profile.crm.toUpperCase()}
                </span>
              )}
              {profile.arrRange && profile.arrRange !== 'unknown' && (
                <span style={badgeStyle('rgba(72,187,120,0.2)', 'rgba(154,230,180,0.9)')}>
                  ARR {profile.arrRange}
                </span>
              )}
              {profile.repCount && profile.repCount !== 'unknown' && (
                <span style={badgeStyle('rgba(66,153,225,0.2)', 'rgba(144,205,244,0.9)')}>
                  {profile.repCount} reps
                </span>
              )}
              {profile.gtmMotion && profile.gtmMotion !== 'unknown' && (
                <span style={badgeStyle('rgba(237,137,54,0.2)', 'rgba(251,211,141,0.9)')}>
                  {profile.gtmMotion}
                </span>
              )}
              {dataCoverage?.coveragePercent != null && (
                <span style={badgeStyle('rgba(255,255,255,0.06)', 'rgba(255,255,255,0.4)')}>
                  {dataCoverage.coveragePercent}% coverage
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Engagement at a Glance ── */}
      {hasAnyEngagement && (
        <div style={card}>
          <SectionHeading>Engagement at a Glance</SectionHeading>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '0',
          }}>
            {engagementItems.map((item, i, arr) => {
              const isPending = !item.value;
              return (
                <div
                  key={item.label}
                  style={{
                    padding: '0.9rem 1.1rem',
                    borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.35)', marginBottom: '0.45rem' }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: '1.05rem', fontWeight: 700,
                    color: isPending ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.92)',
                    fontStyle: isPending ? 'italic' : 'normal',
                  }}>
                    {item.value || 'TBD'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Section 3: GTM Health by Function ── */}
      <div style={card}>
        <SectionHeading>GTM Health by Function</SectionHeading>
        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'rgba(100,37,133,0.5)' }}>
                {['GTM Function', 'Health', 'Weakest Area', 'Business Impact'].map((h) => (
                  <th key={h} style={{ padding: '0.8rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PILLAR_ORDER.map((pillar, i) => {
                const score = pillarScores[pillar]?._avg ?? null;
                const { dot, color } = healthDot(score);
                const worst = getWorstCompetencyForPillar(competencies, pillar);
                return (
                  <tr key={pillar} style={{
                    background: i % 2 === 0 ? 'rgba(255,255,255,0.0)' : 'rgba(255,255,255,0.025)',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 600, color: 'rgba(255,255,255,0.88)', whiteSpace: 'nowrap', fontSize: '0.875rem' }}>
                      {PILLAR_LABELS[pillar]}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{ fontSize: '0.9rem' }}>{dot}</span>
                        <span style={{ fontWeight: 800, color, fontSize: '0.95rem' }}>
                          {score != null ? score.toFixed(1) : '—'}
                        </span>
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', maxWidth: '200px' }}>
                      {worst ? worst.name : <span style={{ color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>No data</span>}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>
                      {PILLAR_IMPACT[pillar]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 4: Critical Findings ── */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '4px', height: '1.4rem', background: 'var(--ls-lime-green)', borderRadius: '2px' }} />
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
              Critical Findings
            </h2>
          </div>
          {criticalFindings.length > 0 && (
            <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'rgba(229,62,62,0.2)', color: '#FC8181', border: '1px solid rgba(229,62,62,0.3)' }}>
              {criticalFindings.length} area{criticalFindings.length !== 1 ? 's' : ''} need attention
            </span>
          )}
        </div>

        {criticalFindings.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: 'rgba(72,187,120,0.08)', border: '1px solid rgba(72,187,120,0.2)', borderRadius: 'var(--radius-lg)' }}>
            <span style={{ fontSize: '1.25rem' }}>🎉</span>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(154,230,180,0.9)', marginBottom: '0.2rem' }}>
                All areas scoring above critical threshold
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                No competencies scored below 2.5. Focus shifts to optimization.
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem' }}>
            {criticalFindings.map((comp) => {
              const isCritical = comp.avg <= 1.5;
              const accentColor = isCritical ? '#E53E3E' : '#ED8936';
              return (
                <div
                  key={comp.id}
                  style={{
                    background: isCritical ? 'rgba(229,62,62,0.06)' : 'rgba(237,137,54,0.06)',
                    border: `1px solid ${accentColor}25`,
                    borderTop: `3px solid ${accentColor}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem',
                    position: 'relative',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '0.7rem', right: '0.7rem',
                    fontSize: '0.72rem', fontWeight: 800,
                    padding: '0.15rem 0.45rem', borderRadius: '4px',
                    background: `${accentColor}25`, color: accentColor,
                  }}>
                    {comp.avg != null ? comp.avg.toFixed(1) : '—'}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.84rem', color: 'rgba(255,255,255,0.88)', paddingRight: '2.5rem', marginBottom: '0.35rem', lineHeight: 1.35 }}>
                    {comp.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: `${accentColor}99`, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    {PILLAR_LABELS[comp.pillar]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Section 5: Pillar + Department Breakdown ── */}
      <div style={card}>
        <SectionHeading>Score Breakdown</SectionHeading>

        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
          By GTM Function
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {PILLAR_ORDER.map((pillar) => {
            const score = pillarScores[pillar]?._avg ?? null;
            const rounded = score != null ? Math.round(score) : null;
            const color = rounded != null ? (V3_STATUS_COLORS[rounded] || '#CBD5E0') : '#CBD5E0';
            const pct = score != null ? Math.max(4, (score / 5) * 100) : 0;
            return (
              <div key={pillar} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '0.85rem', transition: 'border-color 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{PILLAR_LABELS[pillar]}</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color }}>{score != null ? score.toFixed(1) : '—'}</span>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.7s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>
          By Department
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.6rem' }}>
          {DEPARTMENTS.map((dept) => {
            const score = deptScores[dept] != null ? (typeof deptScores[dept] === 'object' ? deptScores[dept]._avg : deptScores[dept]) : null;
            const rounded = score != null ? Math.round(score) : null;
            const color = rounded != null ? (V3_STATUS_COLORS[rounded] || '#CBD5E0') : '#CBD5E0';
            const pct = score != null ? Math.max(4, (score / 5) * 100) : 0;
            return (
              <div key={dept} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-lg)', padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{DEPT_LABELS[dept]}</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color }}>{score != null ? score.toFixed(1) : '—'}</span>
                </div>
                <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.7s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 6: Top Priorities ── */}
      {allProjects.length > 0 && (() => {
        const scoredProjects = allProjects.filter(p => !p.isCustom);
        const displayProjects = scoredProjects.length > 0 ? scoredProjects : allProjects;
        return (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '4px', height: '1.4rem', background: 'var(--ls-lime-green)', borderRadius: '2px' }} />
              <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                Top Priorities
              </h2>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>
              {displayProjects.length} scored project{displayProjects.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {displayProjects.slice(0, 8).map((proj, i) => (
              <div
                key={proj.id || proj.serviceId || i}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  background: 'rgba(255,255,255,0.025)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{
                  width: '1.65rem', height: '1.65rem', borderRadius: '50%',
                  background: 'rgba(124,58,237,0.25)',
                  border: '1px solid rgba(124,58,237,0.45)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: i + 1 >= 10 ? '0.6rem' : '0.72rem',
                  fontWeight: 800, color: 'rgba(167,139,250,0.9)',
                }}>
                  {i + 1}
                </div>
                <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.82)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {proj.name}
                </span>
                <span style={{
                  fontSize: '0.62rem', fontWeight: 700,
                  padding: '0.18rem 0.5rem', borderRadius: '999px',
                  background: `${proj.phaseColor}20`, color: proj.phaseColor,
                  border: `1px solid ${proj.phaseColor}35`,
                  textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  {proj.phaseName}
                </span>
              </div>
            ))}
          </div>
          {displayProjects.length > 8 && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>
              +{displayProjects.length - 8} more — see Full Details
            </div>
          )}
        </div>
        );
      })()}

      {/* ── Section 7: How These Gaps Compound ── */}
      {gapItems.length > 0 && (
        <div style={card}>
          <SectionHeading>How These Gaps Compound</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {gapItems.map((comp, i) => {
              const { color } = healthDot(comp.avg);
              return (
                <div
                  key={comp.id || i}
                  style={{
                    display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                    padding: '0.85rem 1rem',
                    background: 'rgba(255,255,255,0.025)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderLeft: `3px solid ${color}60`,
                  }}
                >
                  <span style={{ color: 'var(--ls-lime-green)', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.5, flexShrink: 0 }}>→</span>
                  <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>
                    <strong style={{ color: 'rgba(255,255,255,0.88)' }}>{comp.name}</strong>
                    <span style={{ color: color, fontWeight: 700, fontSize: '0.8rem', marginLeft: '0.4rem' }}>
                      {comp.avg != null ? comp.avg.toFixed(1) : '—'}/5
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}> — </span>
                    {PILLAR_IMPACT[comp.pillar]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Section 8: Key Context ── */}
      {strategicNote && (
        <div style={{
          ...card,
          borderLeft: '4px solid var(--ls-lime-green)',
          background: 'rgba(232,255,207,0.04)',
          padding: '1.75rem',
        }}>
          <SectionHeading>Key Context</SectionHeading>
          <div style={{ position: 'relative', paddingLeft: '1rem' }}>
            <span style={{
              position: 'absolute', left: '-0.25rem', top: '-0.5rem',
              fontSize: '3rem', color: 'rgba(232,255,207,0.12)', lineHeight: 1, fontFamily: 'Georgia, serif',
              pointerEvents: 'none',
            }}>&ldquo;</span>
            <p style={{ margin: 0, fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.72)', lineHeight: 1.75 }}>
              {strategicNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
