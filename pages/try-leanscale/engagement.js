import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useCustomer } from '../../context/CustomerContext';
import { FUNCTION_ORDER } from '../../lib/engagement-engine';
import { statusToLabel } from '../../data/diagnostic-data';

// ─── Colors ────────────────────────────────────────────────────────────────────

const functionColors = {
  'Cross Functional': { bg: '#e0e7ff', border: '#818cf8' },
  'Marketing': { bg: '#dcfce7', border: '#4ade80' },
  'Sales': { bg: '#fef3c7', border: '#fbbf24' },
  'Customer Success': { bg: '#fce7f3', border: '#f472b6' },
  'Partnerships': { bg: '#dbeafe', border: '#60a5fa' },
};

const statusColors = {
  healthy: '#22c55e',
  careful: '#eab308',
  warning: '#ef4444',
  unable: '#6b7280',
};

// ─── Data Hook ─────────────────────────────────────────────────────────────────

function useEngagementData() {
  const { customer, isDemo } = useCustomer();
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoData, setIsDemoData] = useState(false);

  useEffect(() => {
    const url = isDemo || !customer?.id
      ? '/api/engagement'
      : `/api/engagement?customerId=${customer.id}`;

    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setRecommendation(json.data);
          setIsDemoData(!!json.isDemo);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [customer?.id, isDemo]);

  return { recommendation, isLoading, isDemoData };
}

// ─── Sub-Components ────────────────────────────────────────────────────────────

function MetricBox({ label, value, color = 'white' }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '1.75rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '0.7rem', color: '#c4b5fd', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}

function LoadingSkeleton() {
  const shimmer = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '8px',
  };
  return (
    <div className="container">
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div style={{ ...shimmer, height: '180px', marginBottom: '1.5rem' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[1, 2, 3].map(i => <div key={i} style={{ ...shimmer, height: '120px' }} />)}
      </div>
      <div style={{ ...shimmer, height: '300px', marginBottom: '1.5rem' }} />
      <div style={{ ...shimmer, height: '200px' }} />
    </div>
  );
}

function EngagementSummaryCard({ summary, customerName, isDemoData }) {
  const { recommendedTier, avgProjectHours, managedHoursPerMonth,
    estimatedDurationMonths, estimatedInvestment, projectCount,
    highPriorityCount, managedServiceCount } = summary;

  return (
    <section className="card" style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
      color: 'white',
      marginBottom: '2rem',
    }}>
      {customerName && !isDemoData && (
        <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '0.5rem' }}>
          Recommended for {customerName}
        </div>
      )}
      <h2 style={{ fontSize: '1.5rem', margin: '0 0 1.5rem' }}>
        {recommendedTier.label} Engagement — {recommendedTier.hours} hrs/mo
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
        <MetricBox label="Projects" value={projectCount} />
        <MetricBox label="Total Hours" value={avgProjectHours} />
        <MetricBox label="Duration" value={`~${estimatedDurationMonths} mo`} />
        <MetricBox label="Investment (6mo)" value={`$${(estimatedInvestment / 1000).toFixed(0)}K`} />
      </div>

      <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#c4b5fd' }}>
        {highPriorityCount} high-priority · {managedServiceCount} managed services ({managedHoursPerMonth} hrs/mo)
      </div>
    </section>
  );
}

function TierComparison({ tiers }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Tier Comparison</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {tiers.map(tier => (
          <div key={tier.id} className="card" style={{
            padding: '1.5rem',
            border: tier.isRecommended ? '2px solid #7c3aed' : '1px solid #e5e7eb',
            position: 'relative',
          }}>
            {tier.isRecommended && (
              <div style={{
                position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                background: '#7c3aed', color: 'white', fontSize: '0.65rem', fontWeight: 700,
                padding: '0.2rem 0.75rem', borderRadius: '10px',
              }}>
                RECOMMENDED
              </div>
            )}
            <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#7c3aed', marginBottom: '0.5rem' }}>
              {tier.label}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {tier.hours} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#666' }}>hrs/mo</span>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>
              ${tier.price.toLocaleString()}/mo
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.75rem' }}>
              ~{tier.estimatedMonths} months
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectRow({ project }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: statusColors[project.status] || '#9ca3af',
          flexShrink: 0,
        }} />
        <div>
          <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{project.name}</div>
          {project.outcome && (
            <div style={{ fontSize: '0.7rem', color: '#888' }}>{project.outcome}</div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <span style={{
          fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px',
          background: project.priorityLabel === 'High' ? '#fef2f2' : '#f3f4f6',
          color: project.priorityLabel === 'High' ? '#dc2626' : '#374151',
          fontWeight: 500,
        }}>
          {project.priorityLabel}
        </span>
        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#7c3aed', whiteSpace: 'nowrap' }}>
          {project.hoursLow}–{project.hoursHigh}h
        </span>
      </div>
    </div>
  );
}

function FunctionBreakdown({ functionGroups }) {
  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Recommended Projects</h2>
      {FUNCTION_ORDER.map(func => {
        const projects = functionGroups[func];
        if (!projects?.length) return null;

        const groupHoursLow = projects.reduce((s, p) => s + p.hoursLow, 0);
        const groupHoursHigh = projects.reduce((s, p) => s + p.hoursHigh, 0);

        return (
          <div key={func} className="card" style={{ marginBottom: '1rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  width: '12px', height: '12px', borderRadius: '3px',
                  background: functionColors[func]?.bg || '#e5e7eb',
                  border: `2px solid ${functionColors[func]?.border || '#9ca3af'}`,
                  display: 'inline-block',
                }} />
                {func} ({projects.length} project{projects.length > 1 ? 's' : ''})
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#7c3aed', fontWeight: 600 }}>
                {groupHoursLow}–{groupHoursHigh} hours
              </span>
            </div>
            {projects.map(project => (
              <ProjectRow key={project.name} project={project} />
            ))}
          </div>
        );
      })}
    </section>
  );
}

function EngagementTimeline({ projectSequence, totalWeeks = 26 }) {
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);
  const getWeekLabel = (week) => {
    const startDate = new Date(2026, 1, 2 + (week - 1) * 7);
    return startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!projectSequence?.length) return null;

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Suggested Timeline</h2>
      <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <div style={{ minWidth: '1200px' }}>
          {/* Week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: `280px repeat(${totalWeeks}, 1fr)`, gap: '2px', marginBottom: '0.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.75rem', padding: '0.5rem' }}>Project</div>
            {weeks.map(w => (
              <div key={w} style={{ fontSize: '0.6rem', textAlign: 'center', padding: '0.25rem', background: w % 2 === 0 ? '#f9fafb' : '#fff', borderRadius: '2px' }}>
                {w % 4 === 1 ? getWeekLabel(w) : ''}
              </div>
            ))}
          </div>

          {/* Project bars */}
          {projectSequence.map(project => (
            <div key={project.name} style={{ display: 'grid', gridTemplateColumns: `280px repeat(${totalWeeks}, 1fr)`, gap: '2px', marginBottom: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.75rem' }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: statusColors[project.status] || '#9ca3af',
                  flexShrink: 0,
                }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {project.name}
                </span>
              </div>
              {weeks.map(week => {
                const isActive = week >= project.startWeek && week < project.startWeek + project.durationWeeks;
                const isStart = week === project.startWeek;
                const isEnd = week === project.startWeek + project.durationWeeks - 1;
                return (
                  <div
                    key={week}
                    style={{
                      height: '28px',
                      background: isActive ? (functionColors[project.function]?.bg || '#e5e7eb') : (week % 2 === 0 ? '#f9fafb' : '#fff'),
                      borderLeft: isStart ? `3px solid ${functionColors[project.function]?.border || '#9ca3af'}` : 'none',
                      borderRight: isEnd ? `3px solid ${functionColors[project.function]?.border || '#9ca3af'}` : 'none',
                      borderRadius: isStart ? '4px 0 0 4px' : isEnd ? '0 4px 4px 0' : '0',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
        {Object.entries(functionColors).map(([func, colors]) => (
          <div key={func} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
            <div style={{ width: '16px', height: '16px', background: colors.bg, border: `2px solid ${colors.border}`, borderRadius: '3px' }} />
            <span>{func}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BuildSowCTA({ recommendation, customerPath: getPath }) {
  const router = useRouter();

  const handleBuildSow = async () => {
    try {
      const res = await fetch('/api/sow/from-engagement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: recommendation.customerId,
          diagnosticResultId: recommendation.diagnosticResultId,
          recommendation,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.id) {
        router.push(getPath(`/sow/${json.data.id}/build`));
      }
    } catch (err) {
      console.error('Error creating SOW:', err);
    }
  };

  return (
    <div className="card" style={{
      padding: '2rem',
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      color: 'white',
      textAlign: 'center',
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Ready to formalize this engagement?</h3>
      <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>
        Build a SOW pre-populated with {recommendation.summary.projectCount} projects
        and {recommendation.summary.avgProjectHours} estimated hours.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleBuildSow}
          className="btn"
          style={{ background: 'white', color: '#7c3aed', border: 'none', fontWeight: 700, padding: '0.75rem 2rem' }}
        >
          Build SOW from Recommendations
        </button>
        <Link href={getPath('/buy-leanscale/availability')}>
          <button className="btn" style={{ background: 'transparent', color: 'white', border: '2px solid white', padding: '0.75rem 1.5rem' }}>
            Check Cohort Availability
          </button>
        </Link>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function EngagementOverview() {
  const { customerPath, customer, displayName } = useCustomer();
  const { recommendation, isLoading, isDemoData } = useEngagementData();

  if (isLoading) {
    return (
      <Layout title="Engagement Overview">
        <LoadingSkeleton />
      </Layout>
    );
  }

  if (!recommendation) {
    return (
      <Layout title="Engagement Overview">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1>Unable to load engagement data</h1>
          <p>Please try again later.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Engagement Overview">
      <div className="container">
        <div className="page-header" style={{ textAlign: 'center' }}>
          <h1 className="page-title" style={{ justifyContent: 'center' }}>
            <span>📋</span> Engagement Overview
          </h1>
          <p className="page-subtitle">
            {isDemoData
              ? 'Sample Engagement — Complete a Diagnostic for Personalized Recommendations'
              : 'Personalized Recommendations Based on Your Diagnostic Results'}
          </p>
        </div>

        {/* Demo banner */}
        {isDemoData && (
          <div style={{
            background: '#fef3c7', border: '1px solid #fbbf24',
            borderRadius: '8px', padding: '0.75rem 1rem',
            fontSize: '0.85rem', marginBottom: '1.5rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <span>ℹ️</span>
            <span>
              This is a sample engagement overview. Complete your{' '}
              <Link href={customerPath('/try-leanscale/diagnostic')} style={{ color: '#7c3aed', fontWeight: 600 }}>
                GTM Diagnostic
              </Link>
              {' '}to see personalized recommendations.
            </span>
          </div>
        )}

        {/* Summary Card */}
        <EngagementSummaryCard
          summary={recommendation.summary}
          customerName={displayName}
          isDemoData={isDemoData}
        />

        {/* Tier Comparison */}
        <TierComparison tiers={recommendation.tiers} />

        {/* Function Breakdown */}
        <FunctionBreakdown functionGroups={recommendation.functionGroups} />

        {/* Timeline */}
        <EngagementTimeline projectSequence={recommendation.projectSequence} />

        {/* Build SOW CTA */}
        <BuildSowCTA recommendation={recommendation} customerPath={customerPath} />
      </div>
    </Layout>
  );
}
