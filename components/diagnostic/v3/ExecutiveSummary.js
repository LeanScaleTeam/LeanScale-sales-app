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

// ── Shared card style ──
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
    .filter((c) => c.pillar === pillar)
    .map((c) => ({ ...c, avg: getCompetencyAvg(c) }))
    .filter((c) => c.avg !== null)
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
    type: overrides?.engagement_type || 'TBD',
    investment: overrides?.monthly_investment
      ? `$${Number(overrides.monthly_investment).toLocaleString()}/mo`
      : 'TBD',
    hours: overrides?.monthly_hours ? `${overrides.monthly_hours} hrs/mo` : 'TBD',
    startDate: formatDate(overrides?.start_date),
  };
}

// ── Shared section heading ──
function SectionHeading({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
      <div style={{ width: '4px', height: '1.4rem', background: 'var(--ls-lime-green)', borderRadius: '2px', flexShrink: 0 }} />
      <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.01em' }}>
        {children}
      </h2>
    </div>
  );
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
    return mergedRoadmap.phases.flatMap((p) =>
      (p.projects || []).map((proj) => ({
        ...proj,
        // Projects from the engine store name under service.name; overridden/custom projects store it under .name
        name: proj.name || proj.service?.name || proj.serviceId,
        description: proj.description || proj.service?.description,
        phaseName: p.name,
        phaseColor: PHASE_COLORS[(p.key || p.name)?.toUpperCase()] || p.color || '#718096',
      }))
    );
  }, [mergedRoadmap]);

  const engagement = useMemo(() => resolveEngagement(engagementOverrides), [engagementOverrides]);

  const overallScore = v3Result?.overall_score;
  const overallLabel = V3_STATUS_LABELS[Math.round(overallScore)] || 'No Data';
  const ringColor = overallScore ? V3_STATUS_COLORS[Math.round(overallScore)] : '#CBD5E0';

  // Pending state
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

  const profile = v3Result.company_profile || {};
  const pillarScores = v3Result.pillar_scores || {};
  const deptScores = v3Result.department_scores || {};
  const dataCoverage = v3Result.data_coverage;

  const strategicNote =
    engagementOverrides?.notes ||
    (consultantAssessments?.length > 0 ? consultantAssessments[0]?.finding || consultantAssessments[0]?.note : null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>

      {/* ── Section 1: Hero ── */}
      <div style={{ ...card, background: 'linear-gradient(135deg, rgba(100,37,133,0.25) 0%, rgba(48,25,52,0.4) 100%)', borderColor: 'rgba(124,58,237,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Score ring */}
          <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '7rem', height: '7rem', borderRadius: '50%',
              border: `5px solid ${ringColor}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.2)',
              boxShadow: `0 0 24px ${ringColor}40`,
            }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: ringColor, lineHeight: 1 }}>
                {overallScore.toFixed(1)}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginTop: '0.2rem' }}>
                out of 5.0
              </span>
            </div>
            <span style={{
              fontSize: '0.7rem', fontWeight: 700, color: ringColor,
              textTransform: 'uppercase', letterSpacing: '0.05em',
            }}>
              {overallLabel}
            </span>
          </div>

          {/* Company info */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.3rem' }}>
              GTM Diagnostic
            </div>
            <h1 style={{ margin: '0 0 0.5rem', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, color: 'rgba(255,255,255,0.95)', lineHeight: 1.2 }}>
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
                  ARR: {profile.arrRange}
                </span>
              )}
              {profile.repCount && profile.repCount !== 'unknown' && (
                <span style={badgeStyle('rgba(66,153,225,0.2)', 'rgba(144,205,244,0.9)')}>
                  {profile.repCount} Reps
                </span>
              )}
              {profile.gtmMotion && profile.gtmMotion !== 'unknown' && (
                <span style={badgeStyle('rgba(237,137,54,0.2)', 'rgba(251,211,141,0.9)')}>
                  {profile.gtmMotion}
                </span>
              )}
              {dataCoverage?.coveragePercent != null && (
                <span style={badgeStyle('rgba(255,255,255,0.05)', 'rgba(255,255,255,0.4)')}>
                  {dataCoverage.coveragePercent}% data coverage
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Summary Bar ── */}
      <div style={card}>
        <SectionHeading>Engagement at a Glance</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0' }}>
          {[
            { label: 'Engagement Type', value: engagement.type },
            { label: 'Monthly Investment', value: engagement.investment },
            { label: 'Monthly Hours', value: engagement.hours },
            { label: 'Start Date', value: engagement.startDate },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              style={{
                padding: '1rem 1.25rem',
                borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.4rem' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: item.value === 'TBD' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.9)' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 3: GTM Health Scorecard Table ── */}
      <div style={card}>
        <SectionHeading>GTM Health by Function</SectionHeading>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'rgba(100,37,133,0.4)' }}>
                {['GTM Function', 'Health', 'Key Finding', 'Business Impact'].map((h) => (
                  <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.9)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PILLAR_ORDER.map((pillar, i) => {
                const score = pillarScores[pillar]?._avg;
                const { dot, color } = healthDot(score);
                const worst = getWorstCompetencyForPillar(competencies, pillar);
                return (
                  <tr key={pillar} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.0)' : 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>
                      {PILLAR_LABELS[pillar]}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>{dot}</span>
                        <span style={{ fontWeight: 700, color, fontSize: '0.9rem' }}>
                          {score != null ? score.toFixed(1) : '—'}
                        </span>
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.825rem' }}>
                      {worst ? worst.name : '—'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.825rem' }}>
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
      {criticalFindings.length > 0 && (
        <div style={card}>
          <SectionHeading>
            Critical Findings
            <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(229,62,62,0.2)', color: '#FC8181' }}>
              {criticalFindings.length}
            </span>
          </SectionHeading>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {criticalFindings.map((comp) => {
              const isCritical = comp.avg <= 1.5;
              const accentColor = isCritical ? '#E53E3E' : '#ED8936';
              return (
                <div
                  key={comp.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderTop: `3px solid ${accentColor}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: '1rem',
                    position: 'relative',
                  }}
                >
                  <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.45rem', borderRadius: '4px', background: isCritical ? 'rgba(229,62,62,0.2)' : 'rgba(237,137,54,0.2)', color: accentColor }}>
                    {comp.avg?.toFixed(1)}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', paddingRight: '2rem', marginBottom: '0.3rem', lineHeight: 1.3 }}>
                    {comp.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {PILLAR_LABELS[comp.pillar]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Section 5: Pillar + Department Breakdown ── */}
      <div style={card}>
        <SectionHeading>Pillar Breakdown</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {PILLAR_ORDER.map((pillar) => {
            const score = pillarScores[pillar]?._avg;
            const color = score != null ? V3_STATUS_COLORS[Math.round(score)] : '#CBD5E0';
            return (
              <div key={pillar} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-lg)', padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{PILLAR_LABELS[pillar]}</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color }}>{score != null ? score.toFixed(1) : '—'}</span>
                </div>
                <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: score ? `${(score / 5) * 100}%` : '0%', background: color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          Department View
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
          {DEPARTMENTS.map((dept) => {
            const score = deptScores[dept]?._avg;
            const color = score != null ? V3_STATUS_COLORS[Math.round(score)] : '#CBD5E0';
            return (
              <div key={dept} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-lg)', padding: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{DEPT_LABELS[dept]}</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color }}>{score != null ? score.toFixed(1) : '—'}</span>
                </div>
                <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: score ? `${(score / 5) * 100}%` : '0%', background: color, borderRadius: '2px', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Section 6: Top Priorities ── */}
      {allProjects.length > 0 && (
        <div style={card}>
          <SectionHeading>Top Priorities</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {allProjects.slice(0, 8).map((proj, i) => (
              <div
                key={proj.id || proj.serviceId || i}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                <div style={{ width: '1.6rem', height: '1.6rem', borderRadius: '50%', background: 'rgba(124,58,237,0.3)', border: '1px solid rgba(124,58,237,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.72rem', fontWeight: 800, color: 'rgba(167,139,250,0.9)' }}>
                  {i + 1}
                </div>
                <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>
                  {proj.name}
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '999px', background: `${proj.phaseColor}22`, color: proj.phaseColor, textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                  {proj.phaseName}
                </span>
                {(proj.hours || proj.estimatedHours) && (
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                    {proj.hours || proj.estimatedHours}h
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section 7: Interconnected Gaps ── */}
      {gapItems.length > 0 && (
        <div style={card}>
          <SectionHeading>How These Gaps Compound</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {gapItems.map((comp, i) => (
              <div key={comp.id || i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: 'var(--ls-lime-green)', fontWeight: 800, fontSize: '1rem', lineHeight: 1.4, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{comp.name}</strong>
                  {' '}is at {comp.avg?.toFixed(1)}/5 — {PILLAR_IMPACT[comp.pillar]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Section 8: Strategic Moment ── */}
      {strategicNote && (
        <div style={{ ...card, borderLeft: '4px solid var(--ls-lime-green)', borderRadius: 'var(--radius-xl)', padding: '1.5rem 1.75rem' }}>
          <SectionHeading>Key Context</SectionHeading>
          <blockquote style={{ margin: 0, fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, borderLeft: 'none', padding: 0 }}>
            &ldquo;{strategicNote}&rdquo;
          </blockquote>
        </div>
      )}
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
