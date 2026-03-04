import { useState } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpItem } from '../../lib/animations';
import FindingCard from './FindingCard';
import { calculateImpact, parseIntakeContext } from '../../lib/impact-calculator';
import { lookupService } from '../../lib/diagnostic-engine/service-mapping';

/**
 * FindingsWalkthrough — Step 2 of the Engagement Pitch.
 * Shows finding cards grouped by function or priority, filtered to actionable items only.
 */
export default function FindingsWalkthrough({ items, companyProfile, onServiceClick }) {
  const [groupBy, setGroupBy] = useState('priority'); // 'priority' | 'function'

  const context = parseIntakeContext(companyProfile);

  // Only show warning and careful items
  const actionableItems = items.filter(it => it.status === 'warning' || it.status === 'careful');

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
            {actionableItems.length} areas that need attention
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-1)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md, 8px)', padding: '2px' }}>
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
              color: group.color || '#1a1a2e',
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
  const groups = [];
  if (warning.length > 0) {
    groups.push({
      label: 'Critical — Immediate Attention',
      items: warning,
      color: '#991B1B',
      borderColor: '#FECACA',
    });
  }
  if (careful.length > 0) {
    groups.push({
      label: 'Needs Improvement',
      items: careful,
      color: '#854D0E',
      borderColor: '#FEF08A',
    });
  }
  return groups;
}

function groupByFunction(items) {
  const functionOrder = ['Sales', 'Marketing', 'Customer Success', 'Cross Functional', 'Partnerships'];
  const functionColors = {
    'Sales': { color: '#166534', border: '#BBF7D0' },
    'Marketing': { color: '#1E40AF', border: '#BFDBFE' },
    'Customer Success': { color: '#9A3412', border: '#FED7AA' },
    'Cross Functional': { color: '#475569', border: '#E2E8F0' },
    'Partnerships': { color: '#6B21A8', border: '#E9D5FF' },
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
      color: functionColors[f]?.color || '#475569',
      borderColor: functionColors[f]?.border || '#E2E8F0',
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
        background: active ? 'white' : 'transparent',
        color: active ? '#1a1a2e' : 'var(--text-muted)',
        cursor: 'pointer',
        boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {children}
    </button>
  );
}
