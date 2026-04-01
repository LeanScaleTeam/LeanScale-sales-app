import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpItem } from '../../lib/animations';
import FindingCard from './FindingCard';
import { calculateImpact, parseIntakeContext } from '../../lib/impact-calculator';
import { lookupService } from '../../lib/diagnostic-engine/service-mapping';

/**
 * FindingsWalkthrough — Step 2 of the Engagement Details.
 * Shows finding cards grouped by function or priority, filtered to actionable items only.
 */
export default function FindingsWalkthrough({ items, companyProfile, onServiceClick, editMode, overrides, onOverride, customerPath }) {
  const [groupBy, setGroupBy] = useState('priority'); // 'priority' | 'function'

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

  // In edit mode show excluded items (dimmed); in read mode hide them
  const actionableItems = effectiveItems.filter(it => {
    if (it.excluded && !editMode) return false;
    return it.status === 'warning' || it.status === 'careful' || (editMode && it.excluded);
  });

  // Group items
  const grouped = groupBy === 'function'
    ? groupByFunction(actionableItems)
    : groupByPriority(actionableItems);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-1)' }}>
            Key Findings
          </h2>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            {actionableItems.filter(i => !i.excluded).length} areas that need attention
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-1)', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-md, 8px)', padding: '2px' }}>
          <GroupButton active={groupBy === 'priority'} onClick={() => setGroupBy('priority')}>Priority</GroupButton>
          <GroupButton active={groupBy === 'function'} onClick={() => setGroupBy('function')}>By Function</GroupButton>
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
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function groupByPriority(items) {
  const warning = items.filter(i => i.status === 'warning');
  const careful = items.filter(i => i.status === 'careful');
  const excluded = items.filter(i => i.excluded);
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
  if (excluded.length > 0) {
    groups.push({
      label: 'Excluded',
      items: excluded,
      color: 'rgba(255, 255, 255, 0.3)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
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

function resolveServices(serviceIds) {
  if (!serviceIds) return [];
  return serviceIds
    .map(sid => lookupService(sid))
    .filter(Boolean);
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
