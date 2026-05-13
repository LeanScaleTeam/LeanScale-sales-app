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

function getCompetencyAvg(comp) {
  const vals = Object.values(comp.departments || {}).filter((v) => v !== null && v !== undefined);
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function healthDot(score) {
  if (score == null) return { dot: '—', color: '#718096' };
  if (score >= 4) return { dot: '🟢', color: '#48BB78' };
  if (score >= 2.5) return { dot: '🟡', color: '#ECC94B' };
  return { dot: '🔴', color: '#E53E3E' };
}

function getWorstCompetencyForPillar(competencies, pillar) {
  const matches = competencies
    .filter((c) => c.pillar === pillar)
    .map((c) => ({ ...c, avgScore: getCompetencyAvg(c) }))
    .filter((c) => c.avgScore !== null)
    .sort((a, b) => a.avgScore - b.avgScore);
  return matches[0] || null;
}

function findMatchingCompetency(competencies, projectName, serviceId) {
  if (!competencies.length) return null;
  // First: direct serviceId match via competency's serviceIds array
  if (serviceId) {
    const direct = competencies.find(
      (c) => Array.isArray(c.serviceIds) && c.serviceIds.includes(serviceId)
    );
    if (direct) return { ...direct, avg: getCompetencyAvg(direct) };
  }
  // Fallback: word matching on project name
  if (!projectName) return null;
  const words = projectName.toLowerCase().split(/[\s\-_]+/).filter((w) => w.length >= 3);
  if (!words.length) return null;
  let best = null;
  let bestScore = 0;
  for (const comp of competencies) {
    const nameLower = (comp.name || '').toLowerCase();
    const matches = words.filter((w) => nameLower.includes(w)).length;
    if (matches > bestScore) {
      bestScore = matches;
      best = comp;
    }
  }
  return bestScore > 0 ? { ...best, avg: getCompetencyAvg(best) } : null;
}

function getProjectPriority(project, phaseIndex) {
  if (phaseIndex === 0) return 'CRITICAL';
  if ((project.hours || project.estimatedHours || 0) >= 20) return 'HIGH';
  return 'STANDARD';
}

function formatDate(raw) {
  if (!raw) return 'To be confirmed';
  const d = new Date(raw + (raw.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(d)) return raw;
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function phaseTimeRange(startDate, phaseIndex) {
  const weekStart = phaseIndex * 4 + 1;
  const weekEnd = weekStart + 3;
  if (!startDate) return `Weeks ${weekStart}–${weekEnd}`;
  const base = new Date(startDate + (startDate.length === 10 ? 'T00:00:00' : ''));
  if (isNaN(base)) return `Weeks ${weekStart}–${weekEnd}`;
  const s = new Date(base);
  s.setDate(s.getDate() + phaseIndex * 28);
  const e = new Date(s);
  e.setDate(e.getDate() + 27);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(s)} – ${fmt(e)}`;
}

function resolveEngagement(overrides) {
  return {
    type: overrides?.engagement_type || 'To be confirmed',
    investment: overrides?.monthly_investment
      ? `$${Number(overrides.monthly_investment).toLocaleString()}/mo`
      : 'To be confirmed',
    hours: overrides?.monthly_hours ? `${overrides.monthly_hours} hrs/mo` : 'To be confirmed',
    startDate: formatDate(overrides?.start_date),
    billingCycle: 'Monthly',
    cancellation: '90 days written notice',
  };
}

// ── Shared heading style ──
function DocHeading({ children, level = 'h2' }) {
  const Tag = level;
  const isH2 = level === 'h2';
  return (
    <Tag style={{
      margin: '0 0 1.25rem',
      fontSize: isH2 ? '1.3rem' : '1rem',
      fontWeight: 700,
      color: 'rgba(255,255,255,0.9)',
      paddingLeft: '0.85rem',
      borderLeft: `4px solid ${isH2 ? 'var(--ls-lime-green)' : 'rgba(232,255,207,0.3)'}`,
      lineHeight: 1.3,
    }}>
      {children}
    </Tag>
  );
}

function SectionDivider() {
  return <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem', marginTop: '2rem' }} />;
}

function PriorityBadge({ priority }) {
  const map = {
    CRITICAL: { bg: 'rgba(153,27,27,0.4)', color: '#FCA5A5', border: '1px solid rgba(239,68,68,0.3)' },
    HIGH: { bg: 'rgba(146,64,14,0.4)', color: '#FCD34D', border: '1px solid rgba(245,158,11,0.3)' },
    STANDARD: { bg: 'rgba(30,58,138,0.3)', color: '#93C5FD', border: '1px solid rgba(96,165,250,0.25)' },
  };
  const s = map[priority] || map.STANDARD;
  return (
    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.2rem 0.6rem', borderRadius: '4px', background: s.bg, color: s.color, border: s.border }}>
      {priority}
    </span>
  );
}

function HoursBadge({ hours }) {
  if (!hours) return null;
  return (
    <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '0.2rem 0.55rem', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
      ~{hours} hrs
    </span>
  );
}

function WhatWeFound({ competency }) {
  if (!competency) return null;
  const { dot, color } = healthDot(competency.avg);
  const avg = competency.avg;
  const label = avg != null ? (V3_STATUS_LABELS[Math.round(avg)] || '') : '';
  return (
    <div style={{
      background: 'rgba(124,58,237,0.1)',
      border: '1px solid rgba(124,58,237,0.25)',
      borderLeft: '3px solid rgba(124,58,237,0.7)',
      padding: '0.8rem 1rem',
      borderRadius: '0 8px 8px 0',
      margin: '0.75rem 0 0.5rem',
    }}>
      <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(167,139,250,0.85)', marginBottom: '0.45rem' }}>
        What We Found
      </div>
      <div style={{ fontSize: '0.825rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
        <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{competency.name}</strong>
        {' '}scored{' '}
        <span style={{ fontWeight: 800, color }}>{dot} {avg != null ? avg.toFixed(1) : '—'}/5</span>
        {label && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}> ({label})</span>}
        {' '}in the <strong style={{ color: 'rgba(167,139,250,0.7)' }}>{PILLAR_LABELS[competency.pillar]}</strong> pillar.
      </div>
    </div>
  );
}

function WhyItMatters({ pillar }) {
  if (!pillar || !PILLAR_IMPACT[pillar]) return null;
  return (
    <div style={{
      background: 'rgba(232,255,207,0.06)',
      border: '1px solid rgba(232,255,207,0.15)',
      borderLeft: '3px solid rgba(232,255,207,0.5)',
      padding: '0.8rem 1rem',
      borderRadius: '0 8px 8px 0',
      margin: '0.5rem 0 0.75rem',
    }}>
      <div style={{ fontSize: '0.6rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(232,255,207,0.65)', marginBottom: '0.35rem' }}>
        Why This Matters
      </div>
      <p style={{ margin: 0, fontSize: '0.825rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
        {PILLAR_IMPACT[pillar]}. Addressing this directly improves pipeline velocity and forecast confidence across the revenue team.
      </p>
    </div>
  );
}

export default function DiagnosticDetails({
  v3Result,
  mergedRoadmap,
  engagementOverrides,
  customer,
  consultantAssessments,
}) {
  const isReady = v3Result?.overall_score != null && v3Result?.pillar_scores;

  const competencies = useMemo(() => {
    if (!v3Result?.competencies) return [];
    return v3Result.competencies;
  }, [v3Result]);

  const engagement = useMemo(() => resolveEngagement(engagementOverrides), [engagementOverrides]);

  const rawProfile = v3Result?.company_profile || {};
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
  const pillarScores = v3Result?.pillar_scores || {};
  const overallScore = v3Result?.overall_score;

  const crmExcluded = useMemo(() => {
    // Defensive: company_profile.crm or crmType may be an array in multi-CRM
    // diagnostics if a legacy save snuck through. Coerce to a string before lowering.
    const crmRaw = v3Result?.company_profile?.crm ?? v3Result?.crmType ?? '';
    const crm = (Array.isArray(crmRaw) ? crmRaw.join(',') : String(crmRaw)).toLowerCase();
    const CRM_EXCLUDE = {
      salesforce: new Set(['hubspot-impl', 'salesforce-to-hubspot-crm-migration']),
      hubspot: new Set(['salesforce-impl', 'hubspot-to-salesforce-crm-migration']),
    };
    return CRM_EXCLUDE[crm] || new Set();
  }, [v3Result]);

  const allProjects = useMemo(() => {
    if (!mergedRoadmap?.phases) return [];
    return mergedRoadmap.phases.flatMap((phase, pi) =>
      (phase.projects || [])
        .filter((proj) => !crmExcluded.has(proj.serviceId))
        .map((proj, idx) => ({
          ...proj,
          // Engine stores name under service.name; custom/overridden projects use .name directly
          name: proj.name || proj.service?.name || proj.serviceId,
          description: proj.description || proj.service?.description,
          phaseName: phase.name,
          phaseColor: PHASE_COLORS[(phase.key || phase.name)?.toUpperCase()] || phase.color || '#718096',
          phaseIndex: pi,
          globalIndex: pi * 100 + idx + 1,
          priority: getProjectPriority(proj, pi),
        }))
    );
  }, [mergedRoadmap, crmExcluded]);

  const totalHours = useMemo(() => {
    return allProjects.reduce((sum, p) => {
      const h = Number(p.hours || p.estimatedHours || 0);
      return sum + (isNaN(h) ? 0 : h);
    }, 0);
  }, [allProjects]);

  const gapItems = useMemo(() => {
    if (!competencies.length) return [];
    const seen = new Set();
    return competencies
      .map((c) => ({ ...c, avg: getCompetencyAvg(c) }))
      .filter((c) => c.avg !== null)
      .sort((a, b) => a.avg - b.avg)
      .filter((c) => {
        if (seen.has(c.pillar)) return false;
        seen.add(c.pillar);
        return true;
      })
      .slice(0, 4);
  }, [competencies]);

  const strategicNote =
    engagementOverrides?.notes ||
    (consultantAssessments?.length > 0 ? consultantAssessments[0]?.finding || consultantAssessments[0]?.note : null);

  // Narrative helpers — only include pillars with real scores
  const sortedPillars = useMemo(() => {
    return PILLAR_ORDER
      .map((p) => ({ pillar: p, score: pillarScores[p]?._avg ?? null }))
      .filter((p) => p.score != null && p.score > 0)
      .sort((a, b) => a.score - b.score);
  }, [pillarScores]);

  const bestPillar = sortedPillars.length > 0 ? sortedPillars[sortedPillars.length - 1] : null;
  const worstPillar = sortedPillars.length > 0 ? sortedPillars[0] : null;
  const secondWorstPillar = sortedPillars.length > 1 ? sortedPillars[1] : null;

  // Pending state
  if (!isReady) {
    return (
      <div className="diagnostic-pending-state">
        <div className="diagnostic-pending-state__icon">📋</div>
        <div className="diagnostic-pending-state__title">Full Details</div>
        <p className="diagnostic-pending-state__body">
          This view renders the full diagnostic details once scoring is complete — covering
          all deliverables, findings, timeline, investment summary, and working relationship terms.
        </p>
      </div>
    );
  }

  return (
    <div className="diagnostic-details-doc" style={{ maxWidth: '820px', margin: '0 auto', paddingBottom: '4rem' }}>

      {/* ── Cover ── */}
      <div style={{ background: 'linear-gradient(135deg, rgba(100,37,133,0.3) 0%, rgba(48,25,52,0.5) 100%)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(232,255,207,0.6)', marginBottom: '0.5rem' }}>
          GTM Diagnostic Details
        </div>
        <h1 style={{ margin: '0 0 0.25rem', fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: 'rgba(255,255,255,0.95)' }}>
          {customer?.customerName || 'Client'} — GTM Operations
        </h1>
        <p style={{ margin: '0.75rem 0 1.5rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>
          Prepared by LeanScale
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Engagement', value: engagement.type },
            { label: 'Investment', value: engagement.investment },
            { label: 'Start', value: engagement.startDate },
          ].map((item) => (
            <div key={item.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>
                {item.label}
              </div>
              <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginTop: '0.15rem' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 1. Client Information ── */}
      <section>
        <DocHeading>Client Information</DocHeading>
        <div style={{ ...tableWrap, overflowX: 'auto' }}>
          <table style={tableStyle}>
            <tbody>
              {[
                ['Company', customer?.customerName || '—'],
                ['CRM', profile.crm || '—'],
                ['ARR Range', profile.arrRange || '—'],
                ['Sales Team Size', profile.repCount || '—'],
                ['GTM Motion', profile.gtmMotion || '—'],
                ['Has Partners', profile.hasPartners ? 'Yes' : 'No'],
              ].map(([label, value]) => (
                <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', width: '40%', whiteSpace: 'nowrap' }}>
                    {label}
                  </td>
                  <td style={{ padding: '0.6rem 1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SectionDivider />

      {/* ── 2. GTM Operations Assessment ── */}
      <section>
        <DocHeading>GTM Operations Assessment</DocHeading>

        {/* Narrative */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
          <p style={bodyText}>
            {customer?.customerName || 'This company'}&apos;s GTM operations score{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{overallScore?.toFixed(1)}/5</strong>{' '}
            ({V3_STATUS_LABELS[Math.round(overallScore)] || 'No Data'}) across the six assessment pillars.
            {bestPillar?.score > 0 && (
              <> The strongest area is <strong style={{ color: V3_STATUS_COLORS[Math.round(bestPillar.score)] }}>{PILLAR_LABELS[bestPillar.pillar]}</strong> ({bestPillar.score.toFixed(1)}), indicating a relative foundation to build from.</>
            )}
            {worstPillar?.score > 0 && (
              <> The most critical gap is in <strong style={{ color: V3_STATUS_COLORS[Math.round(worstPillar.score)] }}>{PILLAR_LABELS[worstPillar.pillar]}</strong> ({worstPillar.score.toFixed(1)}), which needs immediate attention.</>
            )}
          </p>
          {worstPillar && secondWorstPillar && (
            <p style={bodyText}>
              The combination of weak <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{PILLAR_LABELS[worstPillar.pillar]}</strong> and{' '}
              <strong style={{ color: 'rgba(255,255,255,0.75)' }}>{PILLAR_LABELS[secondWorstPillar.pillar]}</strong> creates a compounding pattern:{' '}
              {PILLAR_IMPACT[worstPillar.pillar].toLowerCase()}, and simultaneously,{' '}
              {PILLAR_IMPACT[secondWorstPillar.pillar].toLowerCase()}. These two gaps reinforce each other and must be addressed together.
            </p>
          )}
          <p style={bodyText}>
            {profile.arrRange && profile.arrRange !== 'unknown'
              ? `At ${profile.arrRange} ARR`
              : 'At this stage'}, the operational debt in these areas directly limits the go-to-market team&apos;s ability to scale efficiently.
            {profile.repCount && profile.repCount !== 'unknown' && (
              <> With a team of {profile.repCount} reps in the field, every systemic gap multiplies across headcount.</>
            )}{' '}
            LeanScale will address the highest-leverage gaps first to create compounding returns.
          </p>
        </div>

        {/* Scorecard table */}
        <DocHeading level="h3">Health Scorecard</DocHeading>
        <div style={{ ...tableWrap, overflowX: 'auto', marginBottom: '1.75rem' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: 'rgba(100,37,133,0.35)' }}>
                {['GTM Function', 'Health', 'Key Finding', 'Business Impact'].map((h) => (
                  <th key={h} style={{ padding: '0.7rem 1rem', textAlign: 'left', color: 'rgba(255,255,255,0.85)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PILLAR_ORDER.map((pillar, i) => {
                const score = pillarScores[pillar]?._avg;
                const { dot, color } = healthDot(score);
                const worst = getWorstCompetencyForPillar(competencies.map(c => ({ ...c, avg: getCompetencyAvg(c) })), pillar);
                return (
                  <tr key={pillar} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.7rem 1rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                      {PILLAR_LABELS[pillar]}
                    </td>
                    <td style={{ padding: '0.7rem 1rem', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>{dot}</span>
                        <span style={{ fontWeight: 700, color, fontSize: '0.875rem' }}>{score != null ? score.toFixed(1) : '—'}</span>
                      </span>
                    </td>
                    <td style={{ padding: '0.7rem 1rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.825rem' }}>
                      {worst ? worst.name : '—'}
                    </td>
                    <td style={{ padding: '0.7rem 1rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.825rem' }}>
                      {PILLAR_IMPACT[pillar]}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Interconnected Gaps */}
        {gapItems.length > 0 && (
          <>
            <DocHeading level="h3">How These Gaps Compound</DocHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {gapItems.map((comp, i) => (
                <div key={comp.id || i} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--ls-lime-green)', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.5, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.55 }}>
                    <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{comp.name}</strong>
                    {' '}({comp.avg?.toFixed(1)}/5) — {PILLAR_IMPACT[comp.pillar]}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Strategic Moment */}
        {strategicNote && (
          <div style={{ borderLeft: '4px solid var(--ls-lime-green)', padding: '1rem 1.25rem', background: 'rgba(232,255,207,0.06)', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(232,255,207,0.6)', marginBottom: '0.4rem' }}>
              Key Context
            </div>
            <blockquote style={{ margin: 0, fontSize: '0.925rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>
              &ldquo;{strategicNote}&rdquo;
            </blockquote>
          </div>
        )}
      </section>

      <SectionDivider />

      {/* ── 3. Project Scope ── */}
      <section>
        <DocHeading>Project Scope</DocHeading>

        {!mergedRoadmap?.phases?.length ? (
          <p style={{ ...bodyText, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
            Roadmap will appear once projects are configured in the Roadmap tab.
          </p>
        ) : (
          <>
            {mergedRoadmap.phases.map((phase, phaseIndex) => {
              const phaseColor = PHASE_COLORS[(phase.key || phase.name)?.toUpperCase()] || phase.color || '#718096';
              // Normalize and apply same CRM filter as Deliverables Summary
              const projects = (phase.projects || [])
                .filter((p) => !crmExcluded.has(p.serviceId))
                .map((p) => ({
                  ...p,
                  name: p.name || p.service?.name || p.serviceId,
                  description: p.description || p.service?.description,
                }));
              if (!projects.length) return null;
              // Count only non-excluded projects from previous phases for consistent numbering
              let globalNum = mergedRoadmap.phases.slice(0, phaseIndex).reduce(
                (s, p) => s + (p.projects?.filter((proj) => !crmExcluded.has(proj.serviceId))?.length || 0), 0
              );

              return (
                <div key={phase.id || phase.key || phase.name || phaseIndex} style={{ marginBottom: '2.5rem' }}>
                  {/* Phase header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: `2px solid ${phaseColor}44` }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: phaseColor, flexShrink: 0 }} />
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: phaseColor, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {phase.name}
                    </h3>
                  </div>

                  {/* Projects in this phase */}
                  {projects.map((project, projIndex) => {
                    globalNum += 1;
                    const priority = getProjectPriority(project, phaseIndex);
                    const hours = project.hours || project.estimatedHours;
                    const matchedComp = findMatchingCompetency(competencies, project.name, project.serviceId);
                    const pillarForProject = project.pillar || matchedComp?.pillar;

                    return (
                      <div
                        key={project.id || project.serviceId || projIndex}
                        style={{ marginBottom: '2rem', paddingLeft: '0.75rem', borderLeft: '2px solid rgba(255,255,255,0.05)' }}
                      >
                        {/* Deliverable header */}
                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', minWidth: '1.5rem' }}>
                            {globalNum}.
                          </span>
                          <span style={{ fontSize: '0.975rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', flex: 1, minWidth: '140px' }}>
                            {project.name}
                          </span>
                          <PriorityBadge priority={priority} />
                          {hours && <HoursBadge hours={hours} />}
                        </div>

                        {/* Description */}
                        {project.description && (
                          <p style={{ ...bodyText, marginBottom: '0.5rem', marginLeft: '2rem' }}>
                            {project.description}
                          </p>
                        )}

                        {/* WHAT WE FOUND */}
                        <div style={{ marginLeft: '2rem' }}>
                          <WhatWeFound competency={matchedComp} />

                          {/* WHY THE HOURS */}
                          {hours && (
                            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', borderLeft: '2px solid rgba(217,175,208,0.35)', paddingLeft: '0.75rem', margin: '0.5rem 0', lineHeight: 1.55 }}>
                              <strong style={{ color: 'rgba(255,255,255,0.5)', fontStyle: 'normal' }}>
                                Why ~{hours} hours:{' '}
                              </strong>
                              This deliverable requires thorough discovery, configuration, testing, and documentation. Hour estimates reflect the complexity of your current environment and will be refined during onboarding.
                            </div>
                          )}

                          {/* WHY THIS MATTERS */}
                          <WhyItMatters pillar={pillarForProject} />
                        </div>
                      </div>
                    );
                  })}

                  {/* Phase summary */}
                  <div style={{ background: 'rgba(232,255,207,0.07)', border: '1px solid rgba(232,255,207,0.15)', borderRadius: 'var(--radius-lg)', padding: '0.85rem 1.1rem', marginTop: '0.5rem' }}>
                    <p style={{ margin: 0, fontSize: '0.825rem', color: 'rgba(232,255,207,0.8)', lineHeight: 1.55 }}>
                      <strong>{phase.name} complete:</strong>{' '}
                      {projects.map((p) => p.name).join(', ')}.
                    </p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>

      <SectionDivider />

      {/* ── 4. Deliverables Summary Table ── */}
      <section>
        <DocHeading>Deliverables Summary</DocHeading>
        {allProjects.length > 0 ? (
          <>
            <div style={{ ...tableWrap, overflowX: 'auto', marginBottom: '1rem' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'rgba(100,37,133,0.3)' }}>
                    {['#', 'Deliverable', 'Phase', 'Priority', 'Est. Hours', 'Systems'].map((h) => (
                      <th key={h} style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allProjects.map((proj, i) => (
                    <tr key={proj.id || proj.serviceId || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td style={tdStyle}>{i + 1}</td>
                      <td style={{ ...tdStyle, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{proj.name}</td>
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '999px', background: `${proj.phaseColor}22`, color: proj.phaseColor }}>
                          {proj.phaseName}
                        </span>
                      </td>
                      <td style={tdStyle}><PriorityBadge priority={proj.priority} /></td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.5)' }}>
                        {proj.hours || proj.estimatedHours ? `~${proj.hours || proj.estimatedHours}` : '—'}
                      </td>
                      <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.45)', fontSize: '0.775rem' }}>
                        {proj.systems || profile.crm || '—'}
                      </td>
                    </tr>
                  ))}
                  {totalHours > 0 && (
                    <tr style={{ background: 'rgba(232,255,207,0.06)', borderTop: '2px solid rgba(232,255,207,0.15)' }}>
                      <td colSpan={4} style={{ ...tdStyle, fontWeight: 700, color: 'rgba(232,255,207,0.8)', textAlign: 'right', paddingRight: '1rem' }}>
                        Total Estimated Hours
                      </td>
                      <td style={{ ...tdStyle, fontWeight: 800, color: 'rgba(232,255,207,0.9)', fontSize: '1rem' }}>
                        ~{totalHours}
                      </td>
                      <td style={tdStyle} />
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalHours > 0 && (
              <div style={{ background: 'rgba(232,255,207,0.07)', border: '1px solid rgba(232,255,207,0.15)', borderRadius: 'var(--radius-lg)', padding: '0.85rem 1.1rem' }}>
                <p style={{ margin: 0, fontSize: '0.825rem', color: 'rgba(232,255,207,0.8)' }}>
                  <strong>Total estimated project hours: ~{totalHours} hours</strong> across {mergedRoadmap?.phases?.length || 1} phase{mergedRoadmap?.phases?.length !== 1 ? 's' : ''}. Hour ranges will be refined during onboarding based on actual system complexity.
                </p>
              </div>
            )}
          </>
        ) : (
          <p style={{ ...bodyText, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
            No deliverables configured yet.
          </p>
        )}
      </section>

      <SectionDivider />

      {/* ── 5. Timeline ── */}
      <section>
        <DocHeading>Timeline</DocHeading>
        {mergedRoadmap?.phases?.length > 0 ? (
          <>
            <div style={{ ...tableWrap, overflowX: 'auto', marginBottom: '1rem' }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ background: 'rgba(100,37,133,0.3)' }}>
                    {['Period', 'Milestone', 'Focus Areas'].map((h) => (
                      <th key={h} style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mergedRoadmap.phases.map((phase, i) => {
                    const phaseColor = PHASE_COLORS[(phase.key || phase.name)?.toUpperCase()] || phase.color || '#718096';
                    const projects = (phase.projects || []).map((p) => ({
                      ...p,
                      name: p.name || p.service?.name || p.serviceId,
                    }));
                    return (
                      <tr key={phase.id || phase.key || i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                        <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: phaseColor, fontWeight: 600 }}>
                          {phaseTimeRange(engagementOverrides?.start_date, i)}
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
                          {phase.name}
                        </td>
                        <td style={{ ...tdStyle, color: 'rgba(255,255,255,0.5)', fontSize: '0.825rem' }}>
                          {projects.slice(0, 3).map((p) => p.name).join(', ')}
                          {projects.length > 3 && ` +${projects.length - 3} more`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid rgba(255,255,255,0.12)', padding: '0.75rem 1rem', borderRadius: '0 var(--radius-lg) var(--radius-lg) 0', fontSize: '0.825rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
              <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Flexibility built in:</strong>{' '}
              This timeline is a guide, not a contract. Priorities will flex based on business needs and what we discover during onboarding. That&apos;s what the weekly sync is for — we calibrate together.
            </div>
          </>
        ) : (
          <p style={{ ...bodyText, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>Timeline will be generated once the roadmap is configured.</p>
        )}
      </section>

      <SectionDivider />

      {/* ── 6. Investment ── */}
      <section>
        <DocHeading>Investment</DocHeading>
        <div style={{ ...tableWrap, overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: 'rgba(100,37,133,0.3)' }}>
                {['Monthly Investment', 'Monthly Hours', 'Billing Cycle', 'Cancellation'].map((h) => (
                  <th key={h} style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {[engagement.investment, engagement.hours, engagement.billingCycle, engagement.cancellation].map((val, i) => (
                  <td key={i} style={{ padding: '0.85rem', fontSize: '0.875rem', color: val === 'To be confirmed' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.8)', fontWeight: val === 'To be confirmed' ? 400 : 600, fontStyle: val === 'To be confirmed' ? 'italic' : 'normal' }}>
                    {val}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <SectionDivider />

      {/* ── 7. What's Included ── */}
      <section>
        <DocHeading>What&apos;s Included</DocHeading>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            `Dedicated LeanScale Architect embedded in ${customer?.customerName || 'your'} GTM operations`,
            'Vasco performance-to-plan platform (included at no additional cost)',
            'Access to LeanScale\'s full playbook library (68+ proven GTM playbooks)',
            'All project deliverables, documentation, and enablement materials',
            'Managed CRM administration and data hygiene',
            'Ad hoc reporting and data requests (within monthly hours)',
            `All work product and IP belongs to ${customer?.customerName || 'the client'}`,
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ color: 'var(--ls-lime-green)', fontWeight: 800, fontSize: '0.8rem', lineHeight: 1.5, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <SectionDivider />

      {/* ── 8. Working Relationship ── */}
      <section>
        <DocHeading>Working Relationship</DocHeading>
        <div style={{ ...tableWrap, overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: 'rgba(100,37,133,0.3)' }}>
                {['Area', 'Details'].map((h) => (
                  <th key={h} style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Communication', 'Shared Slack channel with your team. All requests via Slack or Teamwork.'],
                ['Meetings', 'Weekly 30-min sync. Monthly strategic review. On-demand for urgent items.'],
                ['Your Team', 'One internal champion needed for approvals and system access. Minimal time required.'],
                ['Oversight', 'You own strategy and decisions. LeanScale executes and advises.'],
                ['Responsiveness', 'Slack: same day. Critical issues: within 4 business hours.'],
                ['Project Management', 'All work tracked in Teamwork. Weekly status updates via Slack.'],
              ].map(([area, details], i) => (
                <tr key={area} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '0.7rem 0.85rem', fontSize: '0.825rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                    {area}
                  </td>
                  <td style={{ padding: '0.7rem 0.85rem', fontSize: '0.825rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.55 }}>
                    {details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SectionDivider />

      {/* ── 9. Onboarding Plan (Week 1) ── */}
      <section>
        <DocHeading>Onboarding Plan — Week 1</DocHeading>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, counterReset: 'onboarding', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {[
            'Architect introduction call — meet your dedicated LeanScale Architect',
            `Full system access verification${profile.crm && profile.crm !== 'unknown' ? ` — ${profile.crm.toUpperCase()}, connected tools, and data sources` : ' — all connected tools and data sources'}`,
            'Review of diagnostic findings and project scope',
            'Sprint 1 planning session — prioritize Week 1 deliverables',
            'Shared Slack channel setup and Teamwork project kickoff',
            'Baseline data export for benchmark tracking',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ width: '1.4rem', height: '1.4rem', borderRadius: '50%', background: 'rgba(124,58,237,0.25)', border: '1px solid rgba(124,58,237,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: 'rgba(167,139,250,0.9)', flexShrink: 0 }}>
                {i + 1}
              </span>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.55 }}>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Footer */}
      <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
        Prepared by LeanScale — leanscale.com
      </div>
    </div>
  );
}

// ── Shared table/cell styles ──
// Note: border-radius on <table> is unreliable; wrap with tableWrap div instead.
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: 'rgba(255,255,255,0.02)',
  fontSize: '0.875rem',
};

// Use this wrapper div around every table for consistent border-radius + overflow clipping
const tableWrap = {
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
};

const tdStyle = {
  padding: '0.7rem 0.85rem',
  color: 'rgba(255,255,255,0.65)',
  verticalAlign: 'middle',
};

const bodyText = {
  margin: 0,
  fontSize: '0.875rem',
  color: 'rgba(255,255,255,0.6)',
  lineHeight: 1.7,
};
