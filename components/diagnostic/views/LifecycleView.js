import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatusDot, StatusBadge } from '../StatusLegend';
import { countStatuses } from '../../../data/diagnostic-registry';
import { cpqLifecycleOrder } from '../../../data/cpq-diagnostic-data';
import { staggerContainer, fadeUpItem, collapseExpand } from '../../../lib/animations';

const STATUS_CYCLE = ['healthy', 'careful', 'warning', 'unable'];

/**
 * Get the worst status in a set of processes (for stage border coloring).
 */
function worstStatus(items) {
  const order = ['unable', 'warning', 'careful', 'healthy'];
  for (const s of order) {
    if (items.some(it => it.status === s)) return s;
  }
  return 'healthy';
}

/**
 * Status color map for stage card borders.
 */
const STATUS_BORDER_COLORS = {
  healthy: 'var(--status-healthy, #22c55e)',
  careful: 'var(--status-careful, #eab308)',
  warning: 'var(--status-warning, #ef4444)',
  unable: 'var(--status-unable, #1f2937)',
};

/**
 * LifecycleView — CPQ-specific pipeline visualization.
 *
 * Shows the Q2C lifecycle as a horizontal flow of stage cards:
 * Quote → Price → Contract → Bill → Revenue → Integrate
 *
 * Each stage shows a health summary and expands to show individual processes.
 */
export default function LifecycleView({
  processes,
  editMode,
  onStatusChange,
  onPriorityToggle,
  notes = [],
  onOpenNotes,
  linkedSows = [],
  highlightedItem,
  customerPath,
  onOpenModal,
}) {
  const [expandedStage, setExpandedStage] = useState(null);

  // Group processes by lifecycle stage
  const stageOrder = cpqLifecycleOrder;
  const stages = stageOrder.map(stageName => {
    const items = processes.filter(p => p.function === stageName);
    const stats = countStatuses(items);
    const healthyCount = stats.healthy + stats.careful;
    return { name: stageName, items, stats, healthyCount, total: items.length };
  }).filter(s => s.total > 0);

  // Short labels for pipeline display
  const shortLabels = {
    'Quoting Process': 'Quote',
    'Pricing & Catalog': 'Price',
    'Contract Management': 'Contract',
    'Billing Integration': 'Billing',
    'Revenue Recognition': 'Revenue',
    'System Integration': 'Integrate',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Pipeline header */}
      <div style={{
        textAlign: 'center',
        marginBottom: 'var(--space-4)',
        color: 'var(--text-secondary)',
        fontSize: 'var(--text-sm)',
      }}>
        Quote-to-Cash Lifecycle Pipeline
      </div>

      {/* Horizontal pipeline */}
      <div style={{
        display: 'flex',
        gap: '0',
        overflowX: 'auto',
        padding: 'var(--space-2) 0 var(--space-4)',
        WebkitOverflowScrolling: 'touch',
      }}>
        {stages.map((stage, idx) => {
          const worst = worstStatus(stage.items);
          const isExpanded = expandedStage === stage.name;
          const barTotal = stage.total;

          return (
            <div key={stage.name} style={{ display: 'flex', alignItems: 'center', flex: '1 1 0' }}>
              {/* Stage card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                onClick={() => setExpandedStage(isExpanded ? null : stage.name)}
                style={{
                  flex: '1 1 0',
                  minWidth: '130px',
                  background: isExpanded ? 'var(--bg-subtle)' : 'white',
                  border: `2px solid ${STATUS_BORDER_COLORS[worst]}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-3)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'background 0.15s, box-shadow 0.15s',
                  boxShadow: isExpanded
                    ? '0 4px 12px rgba(0,0,0,0.08)'
                    : '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                {/* Stage name */}
                <div style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 'var(--font-semibold)',
                  marginBottom: 'var(--space-1)',
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                }}>
                  {shortLabels[stage.name] || stage.name}
                </div>

                {/* Health count */}
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                  marginBottom: 'var(--space-2)',
                }}>
                  {stage.healthyCount}/{stage.total} healthy
                </div>

                {/* Mini stacked bar */}
                <div style={{
                  display: 'flex',
                  height: '6px',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  background: 'var(--bg-subtle)',
                }}>
                  {stage.stats.healthy > 0 && (
                    <div style={{
                      flex: stage.stats.healthy,
                      background: 'var(--status-healthy, #22c55e)',
                    }} />
                  )}
                  {stage.stats.careful > 0 && (
                    <div style={{
                      flex: stage.stats.careful,
                      background: 'var(--status-careful, #eab308)',
                    }} />
                  )}
                  {stage.stats.warning > 0 && (
                    <div style={{
                      flex: stage.stats.warning,
                      background: 'var(--status-warning, #ef4444)',
                    }} />
                  )}
                  {stage.stats.unable > 0 && (
                    <div style={{
                      flex: stage.stats.unable,
                      background: 'var(--status-unable, #1f2937)',
                    }} />
                  )}
                </div>

                {/* Expand indicator */}
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                  marginTop: 'var(--space-1)',
                  transition: 'transform 0.15s',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                }}>
                  &#9662;
                </div>
              </motion.div>

              {/* Arrow connector between stages */}
              {idx < stages.length - 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 2px',
                  color: 'var(--text-muted)',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                }}>
                  &#8594;
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Expanded stage detail panel */}
      <AnimatePresence mode="wait">
        {expandedStage && (() => {
          const stage = stages.find(s => s.name === expandedStage);
          if (!stage) return null;

          return (
            <motion.div
              key={expandedStage}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={collapseExpand}
              style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
              }}
            >
              {/* Stage detail header */}
              <div style={{
                padding: 'var(--space-4) var(--space-5)',
                borderBottom: '1px solid var(--border-color)',
                background: 'var(--bg-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: 'var(--text-base)',
                    fontWeight: 'var(--font-semibold)',
                  }}>
                    {stage.name}
                  </h3>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                  }}>
                    {stage.total} process{stage.total !== 1 ? 'es' : ''} &middot; {stage.healthyCount} healthy
                  </div>
                </div>

                {/* Status distribution */}
                <div style={{ display: 'flex', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
                  {stage.stats.healthy > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <StatusDot status="healthy" size={6} /> {stage.stats.healthy}
                    </span>
                  )}
                  {stage.stats.careful > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <StatusDot status="careful" size={6} /> {stage.stats.careful}
                    </span>
                  )}
                  {stage.stats.warning > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <StatusDot status="warning" size={6} /> {stage.stats.warning}
                    </span>
                  )}
                  {stage.stats.unable > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <StatusDot status="unable" size={6} /> {stage.stats.unable}
                    </span>
                  )}
                </div>
              </div>

              {/* Process rows */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                style={{ padding: 'var(--space-3) var(--space-4)' }}
              >
                {stage.items.map((item) => {
                  const noteCount = notes.filter(n => n.process_name === item.name).length;

                  return (
                    <motion.div
                      key={item.name}
                      variants={fadeUpItem}
                      data-process-name={item.name}
                      onClick={() => { if (editMode && onOpenModal) onOpenModal(item); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-3)',
                        borderBottom: '1px solid var(--border-color)',
                        cursor: editMode && onOpenModal ? 'pointer' : 'default',
                        ...(highlightedItem === item.name ? {
                          boxShadow: '0 0 0 2px #6C5CE7, 0 0 12px rgba(108, 92, 231, 0.3)',
                          borderRadius: 'var(--radius-sm)',
                        } : {}),
                      }}
                    >
                      {/* Status */}
                      <div style={{ flexShrink: 0 }}>
                        {editMode && onStatusChange ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const idx = STATUS_CYCLE.indexOf(item.status);
                              const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
                              onStatusChange(item.name, next);
                            }}
                            style={{
                              background: 'none',
                              border: '1px dashed var(--border-color)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '2px 6px',
                              cursor: 'pointer',
                            }}
                            title="Click to cycle status"
                          >
                            <StatusBadge status={item.status} />
                          </button>
                        ) : (
                          <StatusBadge status={item.status} />
                        )}
                      </div>

                      {/* Name + Metric */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 'var(--font-medium)',
                          fontSize: 'var(--text-sm)',
                        }}>
                          {item.name}
                        </div>
                        {item.metric && (
                          <div style={{
                            fontSize: 'var(--text-xs)',
                            color: 'var(--text-muted)',
                            fontStyle: 'italic',
                            marginTop: '1px',
                          }}>
                            {item.metric}
                          </div>
                        )}
                      </div>

                      {/* Outcome tag */}
                      {item.outcome && (
                        <span style={{
                          fontSize: 'var(--text-2xs, 0.65rem)',
                          background: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}>
                          {item.outcome}
                        </span>
                      )}

                      {/* Priority badge */}
                      {editMode && onPriorityToggle ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPriorityToggle(item.name);
                          }}
                          style={{
                            background: item.addToEngagement ? 'var(--ls-lime-green)' : 'var(--bg-subtle)',
                            color: item.addToEngagement ? 'var(--ls-purple)' : 'var(--text-secondary)',
                            border: '1px dashed var(--border-color)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 'var(--font-semibold)',
                            fontSize: 'var(--text-2xs, 0.65rem)',
                            cursor: 'pointer',
                            flexShrink: 0,
                          }}
                        >
                          {item.addToEngagement ? 'Priority' : '-'}
                        </button>
                      ) : (
                        item.addToEngagement && (
                          <span style={{
                            fontSize: 'var(--text-2xs, 0.65rem)',
                            background: 'var(--ls-lime-green)',
                            color: 'var(--ls-purple)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)',
                            fontWeight: 'var(--font-semibold)',
                            flexShrink: 0,
                          }}>
                            Priority
                          </span>
                        )
                      )}

                      {/* Notes button */}
                      {editMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenNotes?.(item.name);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            color: noteCount > 0 ? 'var(--ls-purple)' : 'var(--text-muted)',
                            padding: '2px',
                            flexShrink: 0,
                          }}
                        >
                          {noteCount > 0 ? `\uD83D\uDCAC ${noteCount}` : '\uD83D\uDCAC'}
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

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
        {processes.length} total processes across {stages.length} lifecycle stages
        {' '}&middot;{' '}
        {processes.filter(p => p.status === 'healthy' || p.status === 'careful').length}/{processes.length} healthy
      </div>
    </motion.div>
  );
}
