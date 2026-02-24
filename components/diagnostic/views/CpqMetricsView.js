import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusDot, StatusBadge } from '../StatusLegend';
import { countStatuses } from '../../../data/diagnostic-registry';
import { cpqLifecycleOrder } from '../../../data/cpq-diagnostic-data';
import { staggerContainer, fadeUpItem, collapseExpand } from '../../../lib/animations';

/**
 * CpqMetricsView — KPI dashboard for CPQ diagnostics.
 *
 * Shows all metrics (from the `metric` field) grouped by lifecycle category,
 * with status badges and process references.
 */
export default function CpqMetricsView({ processes }) {
  const [expandedGroup, setExpandedGroup] = useState(null);

  // Group processes by lifecycle stage
  const stageOrder = cpqLifecycleOrder;
  const groups = stageOrder.map(stageName => {
    const items = processes.filter(p => p.function === stageName);
    const stats = countStatuses(items);
    return { name: stageName, items, stats, total: items.length };
  }).filter(g => g.total > 0);

  // Overall stats
  const trackable = processes.filter(p => p.status === 'healthy' || p.status === 'careful').length;
  const total = processes.length;
  const trackablePercent = total > 0 ? Math.round((trackable / total) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Dashboard header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 'var(--space-5)',
      }}>
        <h3 style={{
          fontSize: 'var(--text-lg, 1.125rem)',
          fontWeight: 'var(--font-semibold)',
          margin: '0 0 var(--space-1)',
          color: 'var(--text-primary)',
        }}>
          KPI Dashboard
        </h3>
        <p style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          margin: 0,
        }}>
          Key performance indicators across the Quote-to-Cash lifecycle
        </p>
      </div>

      {/* Overall health bar */}
      <div style={{
        background: 'white',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-4)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 'var(--text-2xl, 1.5rem)',
          fontWeight: 'var(--font-bold, 700)',
          color: trackablePercent > 50 ? 'var(--status-healthy, #22c55e)' : trackablePercent > 20 ? 'var(--status-careful, #eab308)' : 'var(--status-unable, #1f2937)',
        }}>
          {trackable}/{total}
        </div>
        <div style={{
          fontSize: 'var(--text-sm)',
          color: 'var(--text-muted)',
          marginTop: 'var(--space-1)',
        }}>
          KPIs currently trackable ({trackablePercent}%)
        </div>

        {/* Full-width stacked bar */}
        <div style={{
          display: 'flex',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden',
          background: 'var(--bg-subtle)',
          marginTop: 'var(--space-3)',
        }}>
          {(() => {
            const allStats = countStatuses(processes);
            return (
              <>
                {allStats.healthy > 0 && (
                  <div style={{ flex: allStats.healthy, background: 'var(--status-healthy, #22c55e)' }} />
                )}
                {allStats.careful > 0 && (
                  <div style={{ flex: allStats.careful, background: 'var(--status-careful, #eab308)' }} />
                )}
                {allStats.warning > 0 && (
                  <div style={{ flex: allStats.warning, background: 'var(--status-warning, #ef4444)' }} />
                )}
                {allStats.unable > 0 && (
                  <div style={{ flex: allStats.unable, background: 'var(--status-unable, #1f2937)' }} />
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* KPI groups by category */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
      >
        {groups.map((group) => {
          const isExpanded = expandedGroup === null || expandedGroup === group.name;
          const healthyInGroup = group.items.filter(p => p.status === 'healthy' || p.status === 'careful').length;

          return (
            <motion.div
              key={group.name}
              variants={fadeUpItem}
              style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}
            >
              {/* Group header */}
              <div
                onClick={() => setExpandedGroup(expandedGroup === group.name ? null : group.name)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-3) var(--space-4)',
                  cursor: 'pointer',
                  background: isExpanded ? 'var(--bg-subtle)' : 'white',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: 'var(--text-sm)',
                    fontWeight: 'var(--font-semibold)',
                  }}>
                    {group.name}
                  </h4>
                  <span style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                  }}>
                    {healthyInGroup}/{group.total} trackable
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  {/* Mini status dots */}
                  <div style={{ display: 'flex', gap: 'var(--space-1)', fontSize: 'var(--text-xs)' }}>
                    {group.stats.healthy > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <StatusDot status="healthy" size={6} /> {group.stats.healthy}
                      </span>
                    )}
                    {group.stats.careful > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <StatusDot status="careful" size={6} /> {group.stats.careful}
                      </span>
                    )}
                    {group.stats.warning > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <StatusDot status="warning" size={6} /> {group.stats.warning}
                      </span>
                    )}
                    {group.stats.unable > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        <StatusDot status="unable" size={6} /> {group.stats.unable}
                      </span>
                    )}
                  </div>
                  <span style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-muted)',
                    transition: 'transform 0.15s',
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                  }}>
                    &#9662;
                  </span>
                </div>
              </div>

              {/* KPI rows */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key="content"
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    variants={collapseExpand}
                  >
                    <div style={{ padding: '0 var(--space-4) var(--space-3)' }}>
                      <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: 'var(--text-sm)',
                      }}>
                        <thead>
                          <tr>
                            <th style={{
                              textAlign: 'left',
                              padding: 'var(--space-2) var(--space-2)',
                              borderBottom: '1px solid var(--border-color)',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--text-muted)',
                              fontWeight: 'var(--font-medium)',
                            }}>
                              KPI Metric
                            </th>
                            <th style={{
                              textAlign: 'center',
                              padding: 'var(--space-2) var(--space-2)',
                              borderBottom: '1px solid var(--border-color)',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--text-muted)',
                              fontWeight: 'var(--font-medium)',
                              width: '80px',
                            }}>
                              Status
                            </th>
                            <th style={{
                              textAlign: 'left',
                              padding: 'var(--space-2) var(--space-2)',
                              borderBottom: '1px solid var(--border-color)',
                              fontSize: 'var(--text-xs)',
                              color: 'var(--text-muted)',
                              fontWeight: 'var(--font-medium)',
                            }}>
                              Process
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.items.map((item, i) => (
                            <tr key={item.name} style={{
                              background: i % 2 === 0 ? 'white' : 'var(--bg-subtle)',
                            }}>
                              <td style={{
                                padding: 'var(--space-2)',
                                borderBottom: '1px solid var(--border-color)',
                                fontStyle: 'italic',
                              }}>
                                {item.metric || '-'}
                              </td>
                              <td style={{
                                padding: 'var(--space-2)',
                                borderBottom: '1px solid var(--border-color)',
                                textAlign: 'center',
                              }}>
                                <StatusBadge status={item.status} />
                              </td>
                              <td style={{
                                padding: 'var(--space-2)',
                                borderBottom: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)',
                                fontSize: 'var(--text-xs)',
                              }}>
                                {item.name}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Summary footer */}
      <div style={{
        marginTop: 'var(--space-4)',
        padding: 'var(--space-3) var(--space-4)',
        background: 'var(--bg-subtle)',
        borderRadius: 'var(--radius-lg)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        textAlign: 'center',
      }}>
        {trackable}/{total} KPIs currently trackable ({trackablePercent}%)
        {trackable === 0 && total > 0 && (
          <span> &mdash; full implementation recommended</span>
        )}
      </div>
    </motion.div>
  );
}
