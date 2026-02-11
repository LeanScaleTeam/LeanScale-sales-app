/**
 * InvestmentConfigurator - Global SOW pricing controls
 *
 * Controls: default rate, global discount, payment terms, currency, tax,
 * pricing mode, and live summary calculations.
 */

import { useState } from 'react';

const PRICING_MODES = ['Fixed Price', 'Time & Materials', 'Retainer'];
const PAYMENT_TERMS = ['Net 15', 'Net 30', 'Net 45', 'Net 60'];
const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
];

export default function InvestmentConfigurator({
  sections = [],
  config = {},
  onConfigChange,
  onApplyRateToAll,
}) {
  const [collapsed, setCollapsed] = useState(false);

  const {
    defaultRate = 250,
    globalDiscount = 0,
    paymentTerms = 'Net 30',
    currency = 'USD',
    taxRate = 0,
    pricingMode = 'Fixed Price',
  } = config;

  const currencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const sym = currencyObj.symbol;

  // Calculate totals from sections
  const subtotal = sections.reduce((sum, s) => {
    const h = parseFloat(s.hours) || 0;
    const r = parseFloat(s.rate) || parseFloat(defaultRate) || 0;
    const sectionDiscount = parseFloat(s.discount) || 0;
    const sectionTotal = h * r * (1 - sectionDiscount / 100);
    return sum + sectionTotal;
  }, 0);

  const totalHours = sections.reduce((sum, s) => sum + (parseFloat(s.hours) || 0), 0);
  const globalDiscountAmount = subtotal * (globalDiscount / 100);
  const afterDiscount = subtotal - globalDiscountAmount;
  const taxAmount = afterDiscount * (taxRate / 100);
  const grandTotal = afterDiscount + taxAmount;

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
            Investment Configuration
          </h3>
          <span style={{
            padding: '1px 8px',
            background: '#EDF2F7',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
          }}>
            {pricingMode}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-bold)', color: '#276749' }}>
            {sym}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>{collapsed ? '▸' : '▾'}</span>
        </div>
      </div>

      {!collapsed && (
        <div style={{ padding: 'var(--space-5)' }}>
          {/* Pricing Mode */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={labelStyle}>Pricing Mode</label>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {PRICING_MODES.map(mode => (
                <button
                  key={mode}
                  onClick={() => update('pricingMode', mode)}
                  style={{
                    flex: 1,
                    padding: 'var(--space-2) var(--space-3)',
                    background: pricingMode === mode ? '#6C5CE7' : '#F7FAFC',
                    color: pricingMode === mode ? 'white' : 'var(--text-primary)',
                    border: `1px solid ${pricingMode === mode ? '#6C5CE7' : '#E2E8F0'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: pricingMode === mode ? 'var(--font-semibold)' : 'normal',
                    cursor: 'pointer',
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Controls grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            {/* Default Rate */}
            <div>
              <label style={labelStyle}>Default Rate</label>
              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                <input
                  type="number"
                  value={defaultRate}
                  onChange={(e) => update('defaultRate', parseFloat(e.target.value) || 0)}
                  style={inputStyle}
                />
                <button
                  onClick={() => onApplyRateToAll?.(defaultRate)}
                  style={{
                    padding: '0 var(--space-2)',
                    background: '#6C5CE7',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '10px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                  title="Apply this rate to all sections"
                >
                  Apply All
                </button>
              </div>
            </div>

            {/* Global Discount */}
            <div>
              <label style={labelStyle}>Global Discount (%)</label>
              <input
                type="number"
                value={globalDiscount || ''}
                onChange={(e) => update('globalDiscount', Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                placeholder="0"
                min="0"
                max="100"
                style={inputStyle}
              />
            </div>

            {/* Payment Terms */}
            <div>
              <label style={labelStyle}>Payment Terms</label>
              <select
                value={paymentTerms}
                onChange={(e) => update('paymentTerms', e.target.value)}
                style={inputStyle}
              >
                {PAYMENT_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Currency */}
            <div>
              <label style={labelStyle}>Currency</label>
              <select
                value={currency}
                onChange={(e) => update('currency', e.target.value)}
                style={inputStyle}
              >
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* Tax Rate */}
          <div style={{ marginBottom: 'var(--space-5)' }}>
            <label style={labelStyle}>Tax Rate (%)</label>
            <input
              type="number"
              value={taxRate || ''}
              onChange={(e) => update('taxRate', Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0 (optional)"
              min="0"
              style={{ ...inputStyle, maxWidth: 200 }}
            />
          </div>

          {/* Summary */}
          <div style={{
            background: '#F7FAFC',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-4)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              <span>Total Hours</span>
              <span style={{ fontWeight: 'var(--font-semibold)' }}>{totalHours.toLocaleString()}h</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>{sym}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
            {globalDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: '#E53E3E' }}>
                <span>Global Discount ({globalDiscount}%)</span>
                <span>−{sym}{globalDiscountAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
              </div>
            )}
            {taxRate > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                <span>Tax ({taxRate}%)</span>
                <span>+{sym}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
              </div>
            )}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 'var(--space-2)',
              borderTop: '2px solid var(--border-color)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-bold)',
              color: '#276749',
            }}>
              <span>Grand Total</span>
              <span>{sym}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
            </div>
          </div>
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
