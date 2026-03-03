import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { processes as staticProcesses, managedServicesHealth, statusToLabel } from '../../data/diagnostic-data';
import { strategicProjects, managedServices } from '../../data/services-catalog';
import { useCustomer } from '../../context/CustomerContext';
import { getCustomerServerSideProps } from '../../lib/getCustomer';
import { functionColors } from '../../lib/function-colors';
import { applyRoadmapOverrides } from '../../lib/diagnostic-engine/v3/apply-roadmap-overrides';

export const getServerSideProps = getCustomerServerSideProps;

const allStrategicProjects = [
  ...strategicProjects.crossFunctional,
  ...strategicProjects.marketing,
  ...strategicProjects.sales,
  ...strategicProjects.customerSuccess,
  ...strategicProjects.partnerships,
];

const allManagedServices = [
  ...(managedServices.crossFunctional || []),
  ...(managedServices.marketing || []),
  ...(managedServices.sales || []),
  ...(managedServices.customerSuccess || []),
  ...(managedServices.partnerships || []),
];

const DIAG_TYPE_TO_SOW_TYPE = { gtm: 'embedded', clay: 'clay', cpq: 'q2c' };

const statusColors = {
  healthy: '#22c55e',
  careful: '#eab308',
  warning: '#ef4444',
  unable: '#6b7280',
};

const phaseColors = {
  FOUNDATION: { bg: '#dbeafe', border: '#3b82f6', bar: '#3b82f6' },
  BUILD:      { bg: '#dcfce7', border: '#22c55e', bar: '#22c55e' },
  OPTIMIZE:   { bg: '#fef3c7', border: '#f59e0b', bar: '#f59e0b' },
  SCALE:      { bg: '#fce7f3', border: '#ec4899', bar: '#ec4899' },
};

const PHASE_LABELS = {
  FOUNDATION: 'Foundation',
  BUILD: 'Build',
  OPTIMIZE: 'Optimize',
  SCALE: 'Scale',
};

const PHASE_PRIORITY = {
  FOUNDATION: 'Critical',
  BUILD: 'High',
  OPTIMIZE: 'Medium',
  SCALE: 'Low',
};

function getServiceDetails(serviceId, serviceType) {
  if (!serviceId) return null;
  if (serviceType === 'strategic') {
    return allStrategicProjects.find(s => s.id === serviceId);
  }
  if (serviceType === 'managed') {
    return allManagedServices.find(s => s.id === serviceId);
  }
  return null;
}

/**
 * Build engagement items from v3 roadmap projects.
 * Maps phase-based roadmap data to the same shape used by the page.
 */
function buildV3EngagementItems(roadmap, catalogMap, monthlyHours) {
  if (!roadmap?.phases) return [];

  // Compute phase timeline for startWeek/durationWeeks
  const phaseTimeline = computePhaseTimeline(roadmap, catalogMap, monthlyHours);

  const items = [];
  for (const phase of roadmap.phases) {
    if (!phase.projects || phase.projects.length === 0) continue;

    const timeline = phaseTimeline[phase.key] || { start: 1, duration: 4 };

    for (const project of phase.projects) {
      const catEntry = catalogMap && project.serviceId ? catalogMap[project.serviceId] : null;
      const lowHours = catEntry?.hours_low || project.hours || 20;
      const highHours = catEntry?.hours_high || project.hours || 40;

      // Derive status from avgGap
      let status = 'healthy';
      if (project.avgGap >= 3) status = 'warning';
      else if (project.avgGap >= 2) status = 'careful';

      items.push({
        name: project.service?.name || project.serviceId,
        icon: project.service?.icon || '📋',
        description: project.service?.description || '',
        hasPlaybook: project.service?.hasPlaybook || false,
        serviceId: project.serviceId,
        phase: phase.key,
        phaseLabel: PHASE_LABELS[phase.key] || phase.name,
        type: 'strategic',
        lowHours,
        highHours,
        priority: PHASE_PRIORITY[phase.key] || 'Medium',
        priorityScore: project.priority?.score || 0,
        status,
        isCustom: project.isCustom || false,
        startWeek: timeline.start,
        durationWeeks: timeline.duration,
        competencyCount: project.competencyCount || 0,
        projectedImpact: project.projectedImpact || [],
      });
    }
  }
  return items;
}

/**
 * Compute phase-based timeline: each phase runs sequentially,
 * duration based on total hours and monthly capacity.
 */
function computePhaseTimeline(roadmap, catalogMap, monthlyHours) {
  const phaseOrder = ['FOUNDATION', 'BUILD', 'OPTIMIZE', 'SCALE'];
  let currentWeek = 1;
  const result = {};

  for (const phaseKey of phaseOrder) {
    const phase = roadmap.phases.find(p => p.key === phaseKey);
    if (!phase || !phase.projects || phase.projects.length === 0) continue;

    let totalHours = 0;
    for (const proj of phase.projects) {
      const cat = catalogMap?.[proj.serviceId];
      const low = cat?.hours_low || proj.hours || 20;
      const high = cat?.hours_high || proj.hours || 40;
      totalHours += (low + high) / 2;
    }

    const weeksPerMonth = 4.33;
    const weeksNeeded = Math.max(1, Math.ceil(totalHours / (monthlyHours / weeksPerMonth)));
    result[phaseKey] = { start: currentWeek, duration: weeksNeeded };
    currentWeek += weeksNeeded;
  }
  return result;
}

export default function EngagementOverview() {
  const router = useRouter();
  const { customer, customerPath, isDemo } = useCustomer();
  const diagnosticType = customer.diagnosticType || 'gtm';
  const configuredVersion = customer?.diagnosticVersion || 2;
  const isV3 = configuredVersion === 3 && diagnosticType === 'gtm';

  // Redirect if engagement page is hidden for this customer
  useEffect(() => {
    if (customer?.hideEngagement) {
      router.replace(customerPath('/try-leanscale'));
    }
  }, [customer?.hideEngagement, customerPath, router]);

  const [dbProcesses, setDbProcesses] = useState(null);
  const [v3Roadmap, setV3Roadmap] = useState(null);
  const [catalogMap, setCatalogMap] = useState(null);
  const [existingSowId, setExistingSowId] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch diagnostic data and service catalog from DB for real customers
  useEffect(() => {
    async function fetchData() {
      const customerId = customer?.id;
      if (!customerId || isDemo) {
        setDataLoading(false);
        return;
      }

      try {
        const diagType = customer.diagnosticType || 'gtm';

        // SOW lookup runs regardless of version
        const sowRes = await fetch(`/api/sow?customerId=${customerId}`);
        const sowJson = await sowRes.json();
        const sows = sowJson.data || [];
        if (sows.length > 0) {
          setExistingSowId(sows[0].id);
        }

        if (configuredVersion === 3 && diagType === 'gtm') {
          // --- v3 path: load roadmap ---
          const v3Res = await fetch(`/api/diagnostic/v3/results?customerId=${customerId}`);
          if (v3Res.ok) {
            const v3Json = await v3Res.json();
            if (v3Json.success && v3Json.data?.roadmap) {
              const roadmap = applyRoadmapOverrides(v3Json.data.roadmap, v3Json.data.roadmap_overrides);
              setV3Roadmap(roadmap);

              // Catalog lookup for hours/rates
              const slugs = [...new Set(
                (roadmap.phases || []).flatMap(p => (p.projects || []).map(proj => proj.serviceId)).filter(Boolean)
              )];
              if (slugs.length > 0) {
                const catalogRes = await fetch('/api/service-catalog?' + new URLSearchParams({ slugs: slugs.join(',') }));
                const catalogJson = await catalogRes.json();
                if (catalogJson.success && catalogJson.data) {
                  const map = {};
                  for (const svc of catalogJson.data) {
                    if (svc.slug) map[svc.slug] = svc;
                  }
                  setCatalogMap(map);
                }
              }
            }
          }
        } else {
          // --- v1/v2 path ---
          const diagRes = await fetch(`/api/diagnostics/${diagType}?customerId=${customerId}`);
          const diagJson = await diagRes.json();

          if (diagJson.success && diagJson.data?.processes) {
            setDbProcesses(diagJson.data.processes);

            const slugs = [...new Set(
              diagJson.data.processes.filter(p => p.serviceId).map(p => p.serviceId)
            )];
            if (slugs.length > 0) {
              const catalogRes = await fetch('/api/service-catalog?' + new URLSearchParams({ slugs: slugs.join(',') }));
              const catalogJson = await catalogRes.json();
              if (catalogJson.success && catalogJson.data) {
                const map = {};
                for (const svc of catalogJson.data) {
                  if (svc.slug) map[svc.slug] = svc;
                }
                setCatalogMap(map);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error fetching engagement data:', err);
      } finally {
        setDataLoading(false);
      }
    }

    fetchData();
  }, [customer?.id, isDemo, configuredVersion]);

  // Use DB processes if available, otherwise fall back to static
  const processes = dbProcesses || staticProcesses;

  const hourTiers = [
    { hours: 50, label: 'Starter', price: 15000, color: '#10b981' },
    { hours: 100, label: 'Growth', price: 25000, color: '#7c3aed' },
    { hours: 225, label: 'Scale', price: 50000, color: '#f59e0b' },
  ];
  const [selectedTier, setSelectedTier] = useState(hourTiers[1]);

  const engagementItems = useMemo(() => {
    if (v3Roadmap) {
      return buildV3EngagementItems(v3Roadmap, catalogMap, selectedTier.hours);
    }

    // --- v1 path ---
    const priorityProcesses = processes
      .filter(p => p.addToEngagement)
      .map((p, idx) => {
        const service = getServiceDetails(p.serviceId, p.serviceType);
        const catEntry = catalogMap && p.serviceId ? catalogMap[p.serviceId] : null;
        const lowHours = catEntry?.hours_low || (service?.hours_low) || (20 + (idx * 8));
        const highHours = catEntry?.hours_high || (service?.hours_high) || (40 + (idx * 12));
        return {
          ...p,
          type: 'strategic',
          icon: service?.icon || '📋',
          description: service?.description || '',
          hasPlaybook: service?.hasPlaybook || false,
          lowHours,
          highHours,
          startWeek: idx + 1,
          durationWeeks: 3 + Math.floor(idx / 3),
          priority: idx < 5 ? 'High' : 'Medium',
        };
      });

    const priorityManaged = managedServicesHealth
      .filter(m => m.addToEngagement)
      .map((m, idx) => {
        const service = allManagedServices.find(s => s.id === m.serviceId);
        const catEntry = catalogMap && m.serviceId ? catalogMap[m.serviceId] : null;
        const hoursPerMonth = catEntry?.hours_low || m.hoursPerMonth || 8;
        return {
          ...m,
          type: 'managed',
          icon: service?.icon || '🔧',
          description: service?.description || '',
          hasPlaybook: false,
          lowHours: hoursPerMonth,
          highHours: catEntry?.hours_high || hoursPerMonth * 1.5,
          startWeek: 1,
          durationWeeks: 52,
          priority: 'Ongoing',
        };
      });

    return [...priorityProcesses, ...priorityManaged];
  }, [v3Roadmap, processes, catalogMap, selectedTier.hours]);

  const [selectedItems, setSelectedItems] = useState({});

  // Initialize selectedItems when engagementItems changes
  useEffect(() => {
    setSelectedItems(
      engagementItems.reduce((acc, item) => ({ ...acc, [item.name]: true }), {})
    );
  }, [engagementItems]);

  const toggleItem = (name) => {
    setSelectedItems(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const selectedProjects = engagementItems.filter(p => selectedItems[p.name]);
  const strategicItems = selectedProjects.filter(p => p.type === 'strategic');
  const managedItems = selectedProjects.filter(p => p.type === 'managed');

  const totalLowHours = strategicItems.reduce((sum, p) => sum + p.lowHours, 0);
  const totalHighHours = strategicItems.reduce((sum, p) => sum + p.highHours, 0);
  const avgProjectHours = Math.round((totalLowHours + totalHighHours) / 2);
  const monthlyManagedHours = managedItems.reduce((sum, p) => sum + p.lowHours, 0);

  // V3 stats
  const activePhaseCount = v3Roadmap
    ? v3Roadmap.phases.filter(p => p.projects && p.projects.length > 0).length
    : 0;
  const avgPriorityScore = v3Roadmap && strategicItems.length > 0
    ? Math.round(strategicItems.reduce((sum, p) => sum + (p.priorityScore || 0), 0) / strategicItems.length * 100)
    : 0;

  const calculateDuration = (tier) => {
    const availableForProjects = tier.hours - monthlyManagedHours;
    if (availableForProjects <= 0) return { months: '∞', weeks: '∞', note: 'Not enough hours for projects' };
    const hoursForCalc = v3Roadmap ? tier.hours : availableForProjects;
    const monthsLow = totalLowHours / hoursForCalc;
    const monthsHigh = totalHighHours / hoursForCalc;
    const avgMonths = (monthsLow + monthsHigh) / 2;
    return {
      monthsLow: Math.ceil(monthsLow),
      monthsHigh: Math.ceil(monthsHigh),
      avgMonths: Math.round(avgMonths * 10) / 10,
      weeksLow: Math.ceil(monthsLow * 4.33),
      weeksHigh: Math.ceil(monthsHigh * 4.33),
      availableForProjects: hoursForCalc,
    };
  };

  const weeks = Array.from({ length: 26 }, (_, i) => i + 1);
  // Dynamic start date: next Monday from today
  const timelineStart = useMemo(() => {
    const today = new Date();
    const day = today.getDay();
    const daysUntilMonday = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);
    nextMonday.setHours(0, 0, 0, 0);
    return nextMonday;
  }, []);
  const getWeekLabel = (week) => {
    const startDate = new Date(timelineStart);
    startDate.setDate(timelineStart.getDate() + (week - 1) * 7);
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  // Get color for a project row in the Gantt chart
  function getProjectColor(project) {
    if (v3Roadmap) {
      return phaseColors[project.phase] || phaseColors.FOUNDATION;
    }
    return functionColors[project.function] || { bg: '#e5e7eb', border: '#9ca3af' };
  }

  // Engagement overview is only available for GTM diagnostics
  if (diagnosticType !== 'gtm') {
    return (
      <Layout title="Engagement Overview">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Engagement Overview</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            The engagement overview is currently only available for GTM diagnostics.
          </p>
          <Link href={customerPath('/dashboard')}>
            <button className="btn" style={{ background: '#7c3aed', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
              Back to Dashboard
            </button>
          </Link>
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
          <p className="page-subtitle">Prioritized Projects Based on Your Diagnostic Results</p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              {v3Roadmap ? 'Roadmap Projects' : 'Strategic Projects'}
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#7c3aed' }}>
              {strategicItems.length}
            </div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              {v3Roadmap ? 'Phases' : 'Managed Services'}
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#7c3aed' }}>
              {v3Roadmap ? activePhaseCount : managedItems.length}
            </div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>Project Hours (Est.)</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#7c3aed' }}>
              {totalLowHours}-{totalHighHours}
            </div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
              {v3Roadmap ? 'Avg Priority Score' : 'Managed Svc Hours/Mo'}
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#7c3aed' }}>
              {v3Roadmap ? `${avgPriorityScore}%` : monthlyManagedHours}
            </div>
          </div>
        </div>

        {/* Timeline Calculator */}
        <section className="card" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⏱️</span> Timeline Calculator
          </h2>
          <p style={{ color: '#c4b5fd', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            See how long your engagement will take based on different monthly hour commitments
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {hourTiers.map((tier) => {
              const duration = calculateDuration(tier);
              const isSelected = selectedTier.hours === tier.hours;
              return (
                <div
                  key={tier.hours}
                  onClick={() => setSelectedTier(tier)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
                    border: isSelected ? `2px solid ${tier.color}` : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: tier.color, textTransform: 'uppercase' }}>{tier.label}</span>
                    <span style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>${tier.price.toLocaleString()}/mo</span>
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: '0.25rem' }}>
                    {tier.hours} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: '#c4b5fd' }}>hrs/mo</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#a5b4fc', marginTop: '0.75rem' }}>
                    {duration.availableForProjects > 0 ? (
                      <>
                        <div style={{ fontWeight: 600, color: 'white', fontSize: '1.25rem' }}>
                          {duration.monthsLow === duration.monthsHigh ? `~${duration.monthsLow}` : `${duration.monthsLow}-${duration.monthsHigh}`} months
                        </div>
                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                          {duration.availableForProjects} hrs/mo for projects
                        </div>
                      </>
                    ) : (
                      <span style={{ color: '#f87171' }}>Insufficient hours</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: v3Roadmap ? '1fr 1fr' : '1fr 1fr 1fr', gap: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '0.25rem' }}>Total Project Hours</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{totalLowHours}-{totalHighHours}</div>
            </div>
            {!v3Roadmap && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '0.25rem' }}>Managed Svc (ongoing)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>{monthlyManagedHours} hrs/mo</div>
              </div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginBottom: '0.25rem' }}>Selected Plan</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: selectedTier.color }}>{selectedTier.hours} hrs/mo</div>
            </div>
          </div>
        </section>

        {/* Gantt Timeline */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
            Project Timeline (Starting {timelineStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
          </h2>
          <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
            <div style={{ minWidth: '1200px' }}>
              {/* Week headers */}
              <div style={{ display: 'grid', gridTemplateColumns: '280px repeat(26, 1fr)', gap: '2px', marginBottom: '0.5rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.75rem', padding: '0.5rem' }}>Project</div>
                {weeks.map(week => (
                  <div key={week} style={{ fontSize: '0.6rem', textAlign: 'center', padding: '0.25rem', background: week % 2 === 0 ? '#f9fafb' : '#fff', borderRadius: '2px' }}>
                    {week % 4 === 1 ? getWeekLabel(week) : ''}
                  </div>
                ))}
              </div>

              {/* Project rows */}
              {strategicItems.map((project) => {
                const colors = getProjectColor(project);
                return (
                  <div key={project.name} style={{ display: 'grid', gridTemplateColumns: '280px repeat(26, 1fr)', gap: '2px', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.75rem' }}>
                      <span>{project.icon}</span>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</span>
                      {project.hasPlaybook && (
                        <Link href={customerPath(`/playbooks/${project.serviceId}`)} style={{ color: '#7c3aed', fontSize: '0.65rem' }}>
                          Playbook
                        </Link>
                      )}
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
                            background: isActive ? colors.bg : week % 2 === 0 ? '#f9fafb' : '#fff',
                            borderLeft: isStart ? `3px solid ${colors.border}` : 'none',
                            borderRight: isEnd ? `3px solid ${colors.border}` : 'none',
                            borderRadius: isStart ? '4px 0 0 4px' : isEnd ? '0 4px 4px 0' : '0',
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })}

              {/* Managed services (v1 only) */}
              {!v3Roadmap && managedItems.length > 0 && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.5rem', color: '#7c3aed' }}>Ongoing Managed Services</div>
                  {managedItems.map(service => (
                    <div key={service.name} style={{ display: 'grid', gridTemplateColumns: '280px repeat(26, 1fr)', gap: '2px', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.75rem' }}>
                        <span>{service.icon}</span>
                        <span>{service.name}</span>
                      </div>
                      {weeks.map(week => (
                        <div
                          key={week}
                          style={{
                            height: '28px',
                            background: 'linear-gradient(90deg, #ddd6fe 0%, #c4b5fd 50%, #ddd6fe 100%)',
                            opacity: 0.7,
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {v3Roadmap
            ? Object.entries(phaseColors).map(([phase, colors]) => (
                <div key={phase} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                  <div style={{ width: '16px', height: '16px', background: colors.bg, border: `2px solid ${colors.border}`, borderRadius: '3px' }} />
                  <span>{PHASE_LABELS[phase]}</span>
                </div>
              ))
            : Object.entries(functionColors).map(([func, colors]) => (
                <div key={func} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                  <div style={{ width: '16px', height: '16px', background: colors.bg, border: `2px solid ${colors.border}`, borderRadius: '3px' }} />
                  <span>{func}</span>
                </div>
              ))
          }
        </div>

        {/* Project Table */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>
            {v3Roadmap ? 'Roadmap Projects' : 'Strategic Projects'}
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>Add</th>
                  <th>Project</th>
                  <th>{v3Roadmap ? 'Phase' : 'Function'}</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Hours</th>
                  <th>{v3Roadmap ? 'Competencies' : 'Outcome'}</th>
                  <th>Playbook</th>
                </tr>
              </thead>
              <tbody>
                {engagementItems.filter(p => p.type === 'strategic').map(project => (
                  <tr key={project.name} style={{ opacity: selectedItems[project.name] ? 1 : 0.5 }}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems[project.name]}
                        onChange={() => toggleItem(project.name)}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{project.icon}</span>
                        <span style={{ fontWeight: 500 }}>{project.name}</span>
                        {project.isCustom && (
                          <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.3rem', background: '#f3f0ff', color: '#7c3aed', borderRadius: '3px', fontWeight: 600 }}>Custom</span>
                        )}
                      </div>
                      {project.description && (
                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem' }}>{project.description}</div>
                      )}
                    </td>
                    <td>
                      {v3Roadmap ? (
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          background: phaseColors[project.phase]?.bg || '#f3f4f6',
                          border: `1px solid ${phaseColors[project.phase]?.border || '#e5e7eb'}`,
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                        }}>
                          {project.phaseLabel}
                        </span>
                      ) : (
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          background: functionColors[project.function]?.bg || '#f3f4f6',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                        }}>
                          {project.function}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        background: `${statusColors[project.status]}20`,
                        color: statusColors[project.status],
                      }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[project.status] }} />
                        {statusToLabel(project.status)}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: project.priority === 'Critical' ? '#fef2f2' : project.priority === 'High' ? '#fff7ed' : '#f3f4f6',
                        color: project.priority === 'Critical' ? '#dc2626' : project.priority === 'High' ? '#ea580c' : '#374151',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}>
                        {project.priority}
                        {v3Roadmap && project.priorityScore > 0 && (
                          <span style={{ marginLeft: '0.25rem', fontWeight: 400, opacity: 0.7 }}>
                            ({Math.round(project.priorityScore * 100)}%)
                          </span>
                        )}
                      </span>
                    </td>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}>{project.lowHours}-{project.highHours}</td>
                    <td style={{ fontSize: '0.75rem' }}>
                      {v3Roadmap ? (
                        project.competencyCount > 0
                          ? `${project.competencyCount} competenc${project.competencyCount === 1 ? 'y' : 'ies'}`
                          : '-'
                      ) : (
                        project.outcome || '-'
                      )}
                    </td>
                    <td>
                      {project.hasPlaybook && project.serviceId ? (
                        <Link href={customerPath(`/playbooks/${project.serviceId}`)} style={{ color: '#7c3aed', fontSize: '0.75rem', textDecoration: 'underline' }}>
                          View Playbook
                        </Link>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Managed Services (v1 only) */}
        {!v3Roadmap && managedItems.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Recommended Managed Services</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {engagementItems.filter(p => p.type === 'managed').map(service => (
                <div key={service.name} className="card" style={{ padding: '1rem', opacity: selectedItems[service.name] ? 1 : 0.6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="checkbox"
                        checked={selectedItems[service.name]}
                        onChange={() => toggleItem(service.name)}
                      />
                      <span style={{ fontSize: '1.25rem' }}>{service.icon}</span>
                      <span style={{ fontWeight: 600 }}>{service.name}</span>
                    </div>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      background: `${statusColors[service.status]}20`,
                      color: statusColors[service.status],
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusColors[service.status] }} />
                      {statusToLabel(service.status)}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#666', margin: 0 }}>{service.description}</p>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: '#7c3aed', fontWeight: 500 }}>
                    ~{service.lowHours} hrs/month
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', color: 'white', textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Ready to Get Started?</h3>
          <p style={{ margin: '0 0 1rem 0', opacity: 0.9 }}>Let&apos;s discuss your engagement plan and timeline.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {existingSowId && (
              <Link href={customerPath(`/sow/${existingSowId}`)}>
                <button className="btn" style={{ background: 'white', color: '#7c3aed', border: 'none', padding: '0.75rem 1.5rem' }}>
                  View Statement of Work
                </button>
              </Link>
            )}
            <Link href={customerPath('/buy-leanscale/availability')}>
              <button className="btn" style={{ background: existingSowId ? 'transparent' : 'white', color: existingSowId ? 'white' : '#7c3aed', border: existingSowId ? '2px solid white' : 'none', padding: '0.75rem 1.5rem' }}>
                Check Cohort Availability
              </button>
            </Link>
            <Link href={customerPath('/buy-leanscale')}>
              <button className="btn" style={{ background: 'transparent', color: 'white', border: '2px solid white', padding: '0.75rem 1.5rem' }}>
                Start Engagement
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
