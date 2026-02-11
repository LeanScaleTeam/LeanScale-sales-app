/**
 * ScopePanel — Right-side scope builder panel
 *
 * Drop zone for diagnostic items. Shows sections being built with running totals.
 * Mini section cards with title, item count, hours, investment.
 * "Finalize as SOW" button and tier recommendation badge.
 */

import { useState, useMemo } from 'react';
import { StatusDot } from './StatusLegend';

const DEFAULT_RATE = 200;

const TIERS = [
  { id: 'starter', label: 'Starter', hours: 40, maxHours: 200 },
  { id: 'growth', label: 'Growth', hours: 80, maxHours: 500 },
  { id: 'scale', label: 'Scale', hours: 120, maxHours: 900 },
  { id: 'enterprise', label: 'Enterprise', hours: 160, maxHours: Infinity },
];

function getTierRecommendation(totalHours) {
  // Recommend the tier where monthly hours fit (total / 6 months)
  const monthlyHours = totalHours / 6;
  for (const tier of TIERS) {
    if (monthlyHours <= tier.hours) return tier;
  }
  return TIERS[TIERS.length - 1];
}

function SectionCard({ section, onRemoveItem }) {
  const sectionHours = section.items.reduce((sum, i) => sum + (i.hours || 0), 0);
  const sectionInvestment = sectionHours * DEFAULT_RATE;

  return (
    <div
      className="scope-section-card"
      style={{
        background: 'var(--bg-white)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-3)',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--space-2)',
      }}>
        <h4 style={{
          fontSize: 'var(--text-sm)',
          fontWeight: 'var(--font-semibold)',
          margin: 0,
          color: 'var(--text-primary)',
        }}>
          {section.title}
        </h4>
        <div style={{ display: 'flex', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
          <span style={{ color: 'var(--text-muted)' }}>{section.items.length} items</span>
          <span style={{ color: 'var(--ls-purple-light)', fontWeight: 'var(--font-semibold)' }}>
            {sectionHours}h
          </span>
          <span style={{ color: 'var(--status-healthy-text)', fontWeight: 'var(--font-semibold)' }}>
            ${sectionInvestment.toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {section.items.map((item) => (
          <div
            key={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: '4px var(--space-2)',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
            }}
          >
            <StatusDot status={item.status} size={6} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>{item.hours}h</span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemoveItem(section.title, item.name); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
                padding: '0 2px',
                lineHeight: 1,
              }}
              title="Remove from scope"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ScopePanel({
  sections,
  onDropItem,
  onRemoveItem,
  onRemoveSection,
  onFinalizeSOW,
  finalizing = false,
}) {
  const [dragOver, setDragOver] = useState(false);

  const totalHours = useMemo(() => {
    return sections.reduce((sum, s) =>
      sum + s.items.reduce((iSum, i) => iSum + (i.hours || 0), 0), 0);
  }, [sections]);

  const totalInvestment = totalHours * DEFAULT_RATE;
  const totalItems = sections.reduce((sum, s) => sum + s.items.length, 0);
  const tier = getTierRecommendation(totalHours);

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(true);
  }

  function handleDragLeave(e) {
    // Only trigger if leaving the panel entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOver(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      onDropItem?.(data);
    } catch {}
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="scope-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        minHeight: '400px',
        border: dragOver ? '2px dashed var(--ls-purple-light)' : '2px dashed var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-4)',
        background: dragOver ? 'rgba(124, 58, 237, 0.03)' : 'var(--bg-subtle)',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header with totals */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 'var(--space-3)',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', margin: 0 }}>
            Scope
          </h3>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
            {totalItems} items · {sections.length} sections
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
        }}>
          {/* Tier badge */}
          <span style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)',
            background: 'var(--ls-purple-light)',
            color: 'white',
            padding: '2px var(--space-2)',
            borderRadius: 'var(--radius-full)',
          }}>
            {tier.label}
          </span>
        </div>
      </div>

      {/* Investment summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-2)',
      }}>
        <div style={{
          background: 'var(--bg-white)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-2) var(--space-3)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Hours</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--ls-purple-light)' }}>
            {totalHours}
          </div>
        </div>
        <div style={{
          background: 'var(--bg-white)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-2) var(--space-3)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Investment</div>
          <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-bold)', color: 'var(--status-healthy-text)' }}>
            ${totalInvestment.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {sections.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
            fontSize: 'var(--text-sm)',
            textAlign: 'center',
            padding: 'var(--space-8)',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>📋</div>
            <p>Drag items here to build your scope</p>
            <p style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-1)' }}>
              Items are auto-grouped by function
            </p>
          </div>
        ) : (
          sections.map((section) => (
            <SectionCard
              key={section.title}
              section={section}
              onRemoveItem={onRemoveItem}
            />
          ))
        )}
      </div>

      {/* Finalize button */}
      {totalItems > 0 && (
        <button
          onClick={onFinalizeSOW}
          disabled={finalizing}
          style={{
            width: '100%',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--ls-purple-light)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--font-semibold)',
            cursor: finalizing ? 'wait' : 'pointer',
            opacity: finalizing ? 0.7 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          {finalizing ? 'Creating SOW…' : `Finalize as SOW (${totalItems} items · $${totalInvestment.toLocaleString()})`}
        </button>
      )}
    </div>
  );
}
