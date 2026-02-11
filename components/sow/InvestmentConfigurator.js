/**
 * InvestmentConfigurator - Retainer-based tier pricing controls
 *
 * PRICING MODEL: Retainer tiers (not rate × hours)
 * Shows tier selector, total hours, "Fits in [Tier]" indicator,
 * duration estimate, and optional custom tier for non-standard deals.
 */

import { useState } from 'react';
import { TIERS } from '../../lib/engagement-engine';

const PAYMENT_TERMS = ['Net 15', 'Net 30', 'Net 45', 'Net 60'];
const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
];

function recommendTier(totalHours) {
  return TIERS.find(t => totalHours / t.hours <= 6) || TIERS[TIERS.length - 1];
}

export default function InvestmentConfigurator({
  sections = [],
  tierConfig = {},
  onTierConfigChange,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [showCustom, setShowCustom] = useState(!!tierConfig.customTier);

  const {
    selectedTierId = null,
    customTier = null,
    paymentTerms = 'Net 30',
    currency = 'USD',
  } = tierConfig;

  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const sym = currencyObj.symbol;

  // Calculate total hours from sections
  const totalHours = sections.reduce((sum, s) => sum + (parseFloat(s.hours) || 0), 0);

  // Determine active tier
  const autoTier = recommendTier(totalHours);
  const activeTier = customTier
    || (selectedTierId ? TIERS.find(t => t.id === selectedTierId) : null)
    || autoTier;

  const monthlyPrice = activeTier.price;
  const estimatedDuration = activeTier.hours > 0 ? Math.ceil(totalHours / activeTier.hours) : 0;
  const totalEngagementValue = monthlyPrice * estimatedDuration;

  // Does the total hours fit in each tier within 6 months?
  function fitsInTier(tier) {
    return totalHours / tier.hours <= 6;
  }

  function update(key, value) {
    onTierConfigChange?.({ ...tierConfig, [key]: value });
  }

  function selectTier(tierId) {
    setShowCustom(false);
    onTierConfigChange?.({ ...tierConfig, selectedTierId: tierId, customTier: null });
  }

  function updateCustomTier(field, value) {
    const current = customTier || { hours: 150, price: 35000, label: 'Custom' };
    const updated = { ...current, [field]: value };
    onTierConfigChange?.({ ...tierConfig, customTier: updated, selectedTierId: null });
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
            Investment — Retainer Tier
          </h3>
          <span style={{
            padding: '1px 8px',
            background: '#EDF2F7',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
          }}>
            {activeTier.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: '#276749' }}>
            {sym}{monthlyPrice.toLocaleString()}/mo
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{collapsed ? '▸' : '▾'}</span>
        </div>
      </div>

      {!collapsed && (
        <div style={{ padding: 'var(--space-5)' }}>
          {/* Tier selector */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <label style={labelStyle}>Select Tier</label>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              {TIERS.map(tier => {
                const isActive = !customTier && activeTier.id === tier.id;
                const fits = fitsInTier(tier);
                return (
                  <button
                    key={tier.id}
                    onClick={() => selectTier(tier.id)}
                    style={{
                      flex: 1,
                      padding: 'var(--space-3) var(--space-4)',
                      background: isActive ? '#6C5CE7' : '#F7FAFC',
                      color: isActive ? 'white' : 'var(--text-primary)',
                      border: `2px solid ${isActive ? '#6C5CE7' : fits ? '#48BB78' : '#E2E8F0'}`,
                      borderRadius: 'var(--radius-lg)',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)' }}>
                      {tier.label}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9 }}>
                      {tier.hours}h/mo — {sym}{tier.price.toLocaleString()}/mo
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', marginTop: 4, opacity: 0.7 }}>
                      {fits ? `✅ Fits (${Math.ceil(totalHours / tier.hours)} mo)` : `⚠️ ${Math.ceil(totalHours / tier.hours)} months needed`}
                    </div>
                  </button>
                );
              })}
              {/* Custom tier toggle */}
              <button
                onClick={() => {
                  setShowCustom(!showCustom);
                  if (!showCustom && !customTier) {
                    updateCustomTier('label', 'Custom');
                  }
                }}
                style={{
                  flex: 1,
                  padding: 'var(--space-3) var(--space-4)',
                  background: customTier ? '#6C5CE7' : '#F7FAFC',
                  color: customTier ? 'white' : 'var(--text-primary)',
                  border: `2px solid ${customTier ? '#6C5CE7' : '#E2E8F0'}`,
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-base)' }}>Custom</div>
                <div style={{ fontSize: 'var(--text-sm)', opacity: 0.9 }}>Non-standard deal</div>
              </button>
            </div>
          </div>

          {/* Custom tier inputs */}
          {showCustom && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 'var(--space-4)',
              marginBottom: 'var(--space-4)',
              padding: 'var(--space-4)',
              background: '#F7FAFC',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
            }}>
              <div>
                <label style={labelStyle}>Label</label>
                <input
                  type="text"
                  value={customTier?.label || 'Custom'}
                  onChange={(e) => updateCustomTier('label', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Hours/Month</label>
                <input
                  type="number"
                  value={customTier?.hours || 150}
                  onChange={(e) => updateCustomTier('hours', parseInt(e.target.value) || 0)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Monthly Price ({sym})</label>
                <input
                  type="number"
                  value={customTier?.price || 35000}
                  onChange={(e) => updateCustomTier('price', parseInt(e.target.value) || 0)}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {/* Payment terms / currency */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-5)' }}>
            <div>
              <label style={labelStyle}>Payment Terms</label>
              <select value={paymentTerms} onChange={(e) => update('paymentTerms', e.target.value)} style={inputStyle}>
                {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Currency</label>
              <select value={currency} onChange={(e) => update('currency', e.target.value)} style={inputStyle}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div style={{
            background: '#F7FAFC',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
          }}>
            <SummaryRow label="Total Project Hours" value={`${totalHours.toLocaleString()}h`} />
            <SummaryRow label={`Selected Tier`} value={`${activeTier.label} (${activeTier.hours}h/mo)`} bold />
            <SummaryRow label="Monthly Investment" value={`${sym}${monthlyPrice.toLocaleString()}/mo`} />
            <SummaryRow label="Estimated Duration" value={`${estimatedDuration} month${estimatedDuration !== 1 ? 's' : ''}`} />
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
              <span>{sym}{totalEngagementValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)',
    }}>
      <span>{label}</span>
      <span style={{ fontWeight: bold ? 'var(--font-semibold)' : 'normal' }}>{value}</span>
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
