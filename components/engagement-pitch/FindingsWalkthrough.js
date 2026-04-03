import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { staggerContainer, fadeUpItem } from '../../lib/animations';
import FindingCard from './FindingCard';
import { calculateImpact, parseIntakeContext } from '../../lib/impact-calculator';
import { lookupService } from '../../lib/diagnostic-engine/service-mapping';

// Pillar → theme mapping (6 pillars → 4 themes)
const PILLAR_THEMES = {
  planning: 'Strategy & Planning',
  people: 'Team & Enablement',
  enablement: 'Team & Enablement',
  process: 'Revenue Process',
  systems: 'Systems & Visibility',
  reporting: 'Systems & Visibility',
};

const THEME_CONFIG = {
  'Strategy & Planning': { color: '#a78bfa', borderColor: 'rgba(167, 139, 250, 0.3)' },
  'Team & Enablement': { color: '#60a5fa', borderColor: 'rgba(96, 165, 250, 0.3)' },
  'Revenue Process': { color: '#fdba74', borderColor: 'rgba(251, 146, 60, 0.3)' },
  'Systems & Visibility': { color: '#86efac', borderColor: 'rgba(34, 197, 94, 0.3)' },
};

const THEME_ORDER = ['Revenue Process', 'Strategy & Planning', 'Team & Enablement', 'Systems & Visibility'];

/**
 * FindingsWalkthrough — Step 2 of the Engagement Details.
 * Shows finding cards grouped by priority, function, or theme.
 */
export default function FindingsWalkthrough({
  items,
  companyProfile,
  onServiceClick,
  editMode,
  overrides,
  onOverride,
  customerPath,
  transcriptAssessments,
}) {
  const [groupBy, setGroupBy] = useState('priority'); // 'priority' | 'function' | 'themes'
  const [excludedOpen, setExcludedOpen] = useState(false);

  const context = parseIntakeContext(companyProfile);

  // Apply finding overrides on top of items
  const effectiveItems = items.map(it => ({
    ...it,
    status: overrides?.findings?.[it.id]?.status ?? it.status,
    excluded: overrides?.findings?.[it.id]?.excluded ?? false,
    description: overrides?.findings?.[it.id]?.description ?? it.description,
    outcomeStatement: overrides?.findings?.[it.id]?.outcomeStatement ?? it.outcomeStatement,
    impactOverride: overrides?.findings?.[it.id]?.impactOverride ?? null,
  }));

  // Separate excluded items; in read mode hide them entirely
  const excludedItems = effectiveItems.filter(i => i.excluded);
  const activeItems = effectiveItems.filter(it => {
    if (it.excluded) return false;
    return it.status === 'warning' || it.status === 'careful';
  });

  // Group active items
  const grouped = groupBy === 'function'
    ? groupByFunction(activeItems)
    : groupBy === 'themes'
    ? groupByThemes(activeItems)
    : groupByPriority(activeItems);

  const criticalCount = activeItems.filter(i => i.status === 'warning').length;
  const needsWorkCount = activeItems.filter(i => i.status === 'careful').length;
  const onTrackCount = effectiveItems.filter(i => i.status === 'healthy').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
            Key Findings
          </h2>
          {/* Summary bar */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <SummaryPill count={criticalCount} label="Critical" color="#fca5a5" bg="rgba(239,68,68,0.1)" border="rgba(239,68,68,0.25)" />
            <SummaryPill count={needsWorkCount} label="Needs Work" color="#fde047" bg="rgba(234,179,8,0.08)" border="rgba(234,179,8,0.2)" />
            <SummaryPill count={onTrackCount} label="On Track" color="#86efac" bg="rgba(34,197,94,0.08)" border="rgba(34,197,94,0.2)" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-1)', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-md, 8px)', padding: '2px', flexShrink: 0 }}>
          <GroupButton active={groupBy === 'priority'} onClick={() => setGroupBy('priority')}>Priority</GroupButton>
          <GroupButton active={groupBy === 'function'} onClick={() => setGroupBy('function')}>By Function</GroupButton>
          <GroupButton active={groupBy === 'themes'} onClick={() => setGroupBy('themes')}>By Theme</GroupButton>
        </div>
      </div>

      {/* Finding Groups */}
      {grouped.map(group => (
        <motion.div
          key={group.label}
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h3
            variants={fadeUpItem}
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-semibold)',
              color: group.color || 'rgba(255, 255, 255, 0.9)',
              marginBottom: 'var(--space-3)',
              paddingBottom: 'var(--space-2)',
              borderBottom: `2px solid ${group.borderColor || 'var(--border-color)'}`,
            }}
          >
            {group.label}
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginLeft: 'var(--space-2)' }}>
              ({group.items.length})
            </span>
          </motion.h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {group.items.map(item => (
              <FindingCard
                key={item.id}
                item={item}
                impact={calculateImpact(item, context)}
                services={resolveServices(item.serviceIds)}
                onServiceClick={onServiceClick}
                editMode={editMode}
                onOverride={onOverride}
                customerPath={customerPath}
                transcriptAssessments={transcriptAssessments}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Excluded findings — collapsed section, edit mode only */}
      {editMode && excludedItems.length > 0 && (
        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: 'var(--space-4)' }}>
          <button
            onClick={() => setExcludedOpen(o => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginBottom: excludedOpen ? 'var(--space-4)' : 0,
            }}
          >
            <span style={{
              fontSize: 'var(--text-xs)',
              color: 'rgba(255,255,255,0.3)',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              {excludedOpen ? '▾' : '▸'} Not included in pitch ({excludedItems.length})
            </span>
          </button>
          <AnimatePresence>
            {excludedOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {excludedItems.map(item => (
                    <FindingCard
                      key={item.id}
                      item={item}
                      impact={calculateImpact(item, context)}
                      services={resolveServices(item.serviceIds)}
                      onServiceClick={onServiceClick}
                      editMode={editMode}
                      onOverride={onOverride}
                      customerPath={customerPath}
                      transcriptAssessments={transcriptAssessments}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function groupByPriority(items) {
  const warning = items.filter(i => i.status === 'warning');
  const careful = items.filter(i => i.status === 'careful');
  const groups = [];
  if (warning.length > 0) {
    groups.push({
      label: 'Critical — Immediate Attention',
      items: warning,
      color: '#fca5a5',
      borderColor: 'rgba(239, 68, 68, 0.3)',
    });
  }
  if (careful.length > 0) {
    groups.push({
      label: 'Needs Improvement',
      items: careful,
      color: '#fde047',
      borderColor: 'rgba(234, 179, 8, 0.3)',
    });
  }
  return groups;
}

function groupByFunction(items) {
  const functionOrder = ['Sales', 'Marketing', 'Customer Success', 'Cross Functional', 'Partnerships'];
  const functionColors = {
    'Sales': { color: '#86efac', border: 'rgba(34, 197, 94, 0.3)' },
    'Marketing': { color: '#60a5fa', border: 'rgba(96, 165, 250, 0.3)' },
    'Customer Success': { color: '#fdba74', border: 'rgba(251, 146, 60, 0.3)' },
    'Cross Functional': { color: 'rgba(255, 255, 255, 0.5)', border: 'rgba(255, 255, 255, 0.1)' },
    'Partnerships': { color: '#a78bfa', border: 'rgba(167, 139, 250, 0.3)' },
  };

  const byFunc = {};
  for (const item of items) {
    const func = item.primaryFunction || 'Cross Functional';
    if (!byFunc[func]) byFunc[func] = [];
    byFunc[func].push(item);
  }

  return functionOrder
    .filter(f => byFunc[f]?.length > 0)
    .map(f => ({
      label: `${f} — What Your ${f === 'Cross Functional' ? 'Whole Org' : f + ' Team'} Needs`,
      items: byFunc[f],
      color: functionColors[f]?.color || 'rgba(255, 255, 255, 0.5)',
      borderColor: functionColors[f]?.border || 'rgba(255, 255, 255, 0.1)',
    }));
}

function groupByThemes(items) {
  const byTheme = {};
  for (const item of items) {
    const theme = PILLAR_THEMES[item.pillar] || 'Revenue Process';
    if (!byTheme[theme]) byTheme[theme] = [];
    byTheme[theme].push(item);
  }

  return THEME_ORDER
    .filter(t => byTheme[t]?.length > 0)
    .map(t => ({
      label: t,
      items: byTheme[t],
      color: THEME_CONFIG[t]?.color || 'rgba(255,255,255,0.5)',
      borderColor: THEME_CONFIG[t]?.borderColor || 'rgba(255,255,255,0.1)',
    }));
}

function resolveServices(serviceIds) {
  if (!serviceIds) return [];
  return serviceIds
    .map(sid => lookupService(sid))
    .filter(Boolean);
}

function SummaryPill({ count, label, color, bg, border }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.2rem 0.6rem',
      borderRadius: '20px',
      background: bg,
      border: `1px solid ${border}`,
      fontSize: 'var(--text-xs)',
      fontWeight: 600,
      color,
    }}>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: 700,
        lineHeight: 1,
      }}>
        {count}
      </span>
      <span style={{ fontWeight: 400, opacity: 0.8 }}>{label}</span>
    </div>
  );
}

function GroupButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '0.3rem 0.75rem',
        fontSize: '0.75rem',
        fontWeight: active ? 600 : 400,
        borderRadius: 'var(--radius-md, 6px)',
        border: 'none',
        background: active ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
        color: active ? '#a78bfa' : 'rgba(255, 255, 255, 0.4)',
        cursor: 'pointer',
        boxShadow: 'none',
      }}
    >
      {children}
    </button>
  );
}
