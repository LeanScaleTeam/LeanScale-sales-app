/**
 * TierSelector - Global retainer tier and pricing controls
 *
 * LeanScale uses retainer-based pricing (NOT rate × hours):
 *   Starter: 50h/mo @ $15,000/mo
 *   Growth:  100h/mo @ $25,000/mo
 *   Scale:   225h/mo @ $50,000/mo
 *
 * Auto-recommends tier based on total section hours.
 * Supports manual override and custom tiers.
 */

import { useState, useMemo } from 'react';

const TIERS = [
  { id: 'starter', name: 'Starter', hoursPerMonth: 50, monthlyPrice: 15000, color: '#00B894', icon: '🌱' },
  { id: 'growth', name: 'Growth', hoursPerMonth: 100, monthlyPrice: 25000, color: '#6C5CE7', icon: '🚀' },
  { id: 'scale', name: 'Scale', hoursPerMonth: 225, monthlyPrice: 50000, color: '#E17055', icon: '⚡' },
];

export default function TierSelector({
  sections = [],
  config = {},
  onConfigChange,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const {
    tierId = null,        // 'starter' | 'growth' | 'scale' | 'custom'
    customHours = 150,
    customPrice = 35000,
    manualOverride = false,
  } = config;

  const totalHours = sections.reduce((sum, s) => sum + (parseFloat(s.hours) || 0), 0);

  // Auto-recommend tier: smallest tier that covers total hours in ≤12 months
  const recommended = useMemo(() => {
    if (totalHours === 0) return 'growth';
    for (const t of TIERS) {
      const months = Math.ceil(totalHours / t.hoursPerMonth);
      if (months <= 12) return t.id;
    }
    return 'scale';
  }, [totalHours]);

  const activeTierId = tierId || recommended;
  const isCustom = activeTierId === 'custom';
  const activeTier = isCustom
    ? { id: 'custom', name: 'Custom', hoursPerMonth: customHours, monthlyPrice: customPrice, color: '#636E72', icon: '✏️' }
    : TIERS.find(t => t.id === activeTierId) || TIERS[1];

  const estimatedMonths = activeTier.hoursPerMonth > 0
    ? Math.ceil(totalHours / activeTier.hoursPerMonth)
    : 0;
  const totalEngagementValue = activeTier.monthlyPrice * estimatedMonths;

  function selectTier(id) {
    onConfigChange?.({ ...config, tierId: id, manualOverride: id !== recommended });
  }

  function updateCustom(key, value) {
    onConfigChange?.({ ...config, tierId: 'custom', manualOverride: true, [key]: value });
  }

  function update(key, value) {
    onConfigChange?.({ ...config, [key]: value });
  }

  return (
    <div style={{
      background: 'var(--bg-white)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      marginBottom: 'var(--space-6)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--space-4) var(--space-5)',
          cursor: 'pointer',
          background: '#FAFBFE',
          borderBottom: collapsed ? 'none' : '1px solid var(--border-color)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-lg)' }}>💰</span>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--gray-900)', margin: 0 }}>
            Retainer Tier & Pricing
          </h3>
          <span style={{
            padding: '1px 8px',
            background: activeTier.color + '22',
            color: activeTier.color,
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            fontWeight: 'var(--font-semibold)',
          }}>
            {activeTier.icon} {activeTier.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: '#276749' }}>
            ${totalEngagementValue.toLocaleString()}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{collapsed ? '▸' : '▾'}</span>
        </div>
      </div>

      {!collapsed && (
        <div style={{ padding: 'var(--space-5)' }}>
          {/* Tier cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-5)' }}>
            {TIERS.map(tier => {
              const isActive = activeTierId === tier.id;
              const isRec = tier.id === recommended && !manualOverride;
              const months = tier.hoursPerMonth > 0 ? Math.ceil(totalHours / tier.hoursPerMonth) : 0;
              return (
                <button
                  key={tier.id}
                  onClick={() => selectTier(tier.id)}
                  style={{
                    padding: 'var(--space-4)',
                    background: isActive ? tier.color + '11' : 'var(--bg-white)',
                    border: `2px solid ${isActive ? tier.color : '#E2E8F0'}`,
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    position: 'relative',
                    transition: 'border-color 0.15s, background 0.15s',
                  }}
                >
                  {isRec && (
                    <div style={{
                      position: 'absolute',
                      top: -8,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '1px 8px',
                      background: tier.color,
                      color: 'white',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '10px',
                      fontWeight: 'var(--font-semibold)',
                      whiteSpace: 'nowrap',
                    }}>
                      Recommended
                    </div>
                  )}
                  <div style={{ fontSize: 'var(--text-xl)', marginBottom: 4 }}>{tier.icon}</div>
                  <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--gray-900)' }}>
                    {tier.name}
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: tier.color, fontWeight: 'var(--font-semibold)', margin: '4px 0' }}>
                    ${(tier.monthlyPrice / 1000).toFixed(0)}K/mo
                  </div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                    {tier.hoursPerMonth}h/month
                  </div>
                  {totalHours > 0 && (
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 4 }}>
                      ~{months} month{months !== 1 ? 's' : ''}
                    </div>
                  )}
                </button>
              );
            })}

            {/* Custom tier */}
            <button
              onClick={() => selectTier('custom')}
              style={{
                padding: 'var(--space-4)',
                background: isCustom ? '#636E7211' : 'var(--bg-white)',
                border: `2px solid ${isCustom ? '#636E72' : '#E2E8F0'}`,
                borderRadius: 'var(--radius-lg)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <div style={{ fontSize: 'var(--text-xl)', marginBottom: 4 }}>✏️</div>
              <div style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: 'var(--gray-900)' }}>
                Custom
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 4 }}>
                Non-standard deal
              </div>
            </button>
          </div>

          {/* Custom tier inputs */}
          {isCustom && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-5)',
              padding: 'var(--space-4)',
              background: '#F7FAFC',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
            }}>
              <div>
                <label style={labelStyle}>Monthly Hours</label>
                <input
                  type="number"
                  value={customHours}
                  onChange={(e) => updateCustom('customHours', Math.max(1, parseInt(e.target.value) || 50))}
                  min="1"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Monthly Price ($)</label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => updateCustom('customPrice', Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  step="1000"
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Duration calculator summary */}
          <div style={{
            background: '#F7FAFC',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              <span>Total Scope Hours</span>
              <span style={{ fontWeight: 'var(--font-semibold)' }}>{totalHours.toLocaleString()}h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              <span>Tier Capacity</span>
              <span>{activeTier.hoursPerMonth}h/month</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              <span>Estimated Duration</span>
              <span style={{ fontWeight: 'var(--font-semibold)' }}>
                {estimatedMonths} month{estimatedMonths !== 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              <span>Monthly Retainer</span>
              <span>${activeTier.monthlyPrice.toLocaleString()}/mo</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 'var(--space-2)',
              borderTop: '2px solid var(--border-color)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-bold)',
              color: '#276749',
            }}>
              <span>Total Engagement Value</span>
              <span>${totalEngagementValue.toLocaleString()}</span>
            </div>
          </div>

          {manualOverride && tierId !== recommended && (
            <div style={{
              marginTop: 'var(--space-3)',
              padding: 'var(--space-2) var(--space-3)',
              background: '#FFFBEB',
              border: '1px solid #FEF3C7',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              color: '#92400E',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>⚠️ Manual override — auto-recommended tier is <strong>{TIERS.find(t => t.id === recommended)?.name || recommended}</strong></span>
              <button
                onClick={() => selectTier(recommended)}
                style={{
                  background: 'none',
                  border: '1px solid #92400E',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1px 8px',
                  fontSize: '10px',
                  color: '#92400E',
                  cursor: 'pointer',
                }}
              >
                Use recommended
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  display: 'block',
  fontSize: 'var(--text-xs)',
  fontWeight: 'var(--font-semibold)',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: 4,
};

const inputStyle = {
  width: '100%',
  padding: 'var(--space-2) var(--space-3)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-sm)',
  boxSizing: 'border-box',
};
