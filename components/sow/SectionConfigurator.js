/**
 * SectionConfigurator - Enhanced section editor with inline editing for all fields
 *
 * Replaces basic SectionEditor cards with full configurability:
 * title, description, hours, rate, investment, dates, deliverables, discount, billing
 */

import { useState, useRef, useCallback, useEffect } from 'react';

const RATE_PRESETS = [200, 225, 250, 275, 300];
const BILLING_OPTIONS = ['Monthly', 'Quarterly', 'Milestone-based', 'On completion'];

export default function SectionConfigurator({
  section,
  onUpdate,
  onDelete,
  diagnosticItems = {},
  defaultRate,
  velocity = 40, // hours per week
  currency = 'USD',
}) {
  const [expanded, setExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(section.title || '');
  const [descDraft, setDescDraft] = useState(section.description || '');
  const [newDeliverable, setNewDeliverable] = useState('');
  const debounceRef = useRef(null);

  const h = parseFloat(section.hours) || 0;
  const r = parseFloat(section.rate) || parseFloat(defaultRate) || 0;
  const discount = parseFloat(section.discount) || 0;
  const subtotal = h * r;
  const discountedTotal = subtotal * (1 - discount / 100);
  const deliverables = section.deliverables || [];
  const billingSchedule = section.billing_schedule || 'Monthly';

  // Sync title/desc from parent
  useEffect(() => { setTitleDraft(section.title || ''); }, [section.title]);
  useEffect(() => { setDescDraft(section.description || ''); }, [section.description]);

  const debouncedUpdate = useCallback((updates) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onUpdate(updates), 800);
  }, [onUpdate]);

  const immediateUpdate = useCallback((updates) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onUpdate(updates);
  }, [onUpdate]);

  function handleTitleSave() {
    setEditingTitle(false);
    if (titleDraft.trim() && titleDraft !== section.title) {
      immediateUpdate({ title: titleDraft.trim() });
    }
  }

  function handleDescChange(e) {
    setDescDraft(e.target.value);
    debouncedUpdate({ description: e.target.value });
  }

  function handleHoursChange(val) {
    const newHours = Math.max(0, val);
    immediateUpdate({ hours: newHours });
  }

  function handleRateChange(val) {
    immediateUpdate({ rate: parseFloat(val) || 0 });
  }

  function handleDiscountChange(val) {
    const d = Math.min(100, Math.max(0, parseFloat(val) || 0));
    immediateUpdate({ discount: d });
  }

  function handleDateChange(field, value) {
    immediateUpdate({ [field]: value || null });
  }

  function handleBillingChange(val) {
    immediateUpdate({ billingSchedule: val });
  }

  // Auto-calculate end date from hours + velocity + start date
  function autoCalcEndDate() {
    if (!section.start_date || !h || !velocity) return;
    const weeks = Math.ceil(h / velocity);
    const start = new Date(section.start_date);
    start.setDate(start.getDate() + weeks * 7);
    immediateUpdate({ endDate: start.toISOString().split('T')[0] });
  }

  // Deliverables management
  function addDeliverable() {
    const trimmed = newDeliverable.trim();
    if (!trimmed) return;
    immediateUpdate({ deliverables: [...deliverables, trimmed] });
    setNewDeliverable('');
  }

  function removeDeliverable(idx) {
    immediateUpdate({ deliverables: deliverables.filter((_, i) => i !== idx) });
  }

  function toggleDeliverable(idx) {
    // Toggle by prefixing with [EXCLUDED] marker
    const updated = [...deliverables];
    if (updated[idx].startsWith('[EXCLUDED] ')) {
      updated[idx] = updated[idx].replace('[EXCLUDED] ', '');
    } else {
      updated[idx] = '[EXCLUDED] ' + updated[idx];
    }
    immediateUpdate({ deliverables: updated });
  }

  function moveDeliverable(idx, dir) {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= deliverables.length) return;
    const updated = [...deliverables];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    immediateUpdate({ deliverables: updated });
  }

  const currencySymbol = { USD: '$', EUR: '€', GBP: '£' }[currency] || '$';

  return (
    <div style={{
      background: 'var(--bg-white)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      transition: 'box-shadow 0.15s',
    }}>
      {/* Header row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-4) var(--space-5)',
        borderBottom: expanded ? '1px solid var(--border-color)' : 'none',
        background: expanded ? '#FAFBFE' : 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1, minWidth: 0 }}>
          <div style={{ width: 4, height: 32, background: 'var(--ls-purple-light)', borderRadius: 2, flexShrink: 0 }} />
          
          {editingTitle ? (
            <input
              type="text"
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => { if (e.key === 'Enter') handleTitleSave(); if (e.key === 'Escape') { setEditingTitle(false); setTitleDraft(section.title); } }}
              autoFocus
              style={{
                flex: 1,
                padding: '0.25rem 0.5rem',
                border: '1px solid #6C5CE7',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                outline: 'none',
              }}
            />
          ) : (
            <h3
              onClick={(e) => { e.stopPropagation(); setEditingTitle(true); }}
              style={{
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: 'var(--gray-900)',
                margin: 0,
                cursor: 'text',
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title="Click to edit title"
            >
              {section.title || 'Untitled Section'}
            </h3>
          )}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexShrink: 0 }}>
          {h > 0 && <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{h}h</span>}
          {discountedTotal > 0 && (
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--status-healthy-text)' }}>
              {currencySymbol}{discountedTotal.toLocaleString()}
              {discount > 0 && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 4 }}>
                  {currencySymbol}{subtotal.toLocaleString()}
                </span>
              )}
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 'var(--text-base)', padding: '0.25rem' }}
          >
            {expanded ? '▾' : '▸'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); if (confirm('Delete this section?')) onDelete(); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E53E3E', fontSize: 'var(--text-sm)', padding: '0.25rem' }}
            title="Delete section"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Expanded configurator */}
      {expanded && (
        <div style={{ padding: 'var(--space-5)' }}>
          {/* Description */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={descDraft}
              onChange={handleDescChange}
              rows={3}
              placeholder="Describe scope and objectives..."
              style={{
                width: '100%',
                padding: 'var(--space-3)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                lineHeight: 1.6,
              }}
            />
          </div>

          {/* Hours + Rate + Investment row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            {/* Hours */}
            <div>
              <label style={labelStyle}>Hours</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <button onClick={() => handleHoursChange(h - 5)} style={stepBtnStyle}>−</button>
                <input
                  type="number"
                  value={h || ''}
                  onChange={(e) => handleHoursChange(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  style={numInputStyle}
                />
                <button onClick={() => handleHoursChange(h + 5)} style={stepBtnStyle}>+</button>
              </div>
            </div>

            {/* Rate */}
            <div>
              <label style={labelStyle}>Rate (per hour)</label>
              <input
                type="number"
                value={r || ''}
                onChange={(e) => handleRateChange(e.target.value)}
                placeholder={defaultRate ? `${defaultRate} (default)` : '250'}
                style={{ ...numInputStyle, width: '100%' }}
              />
              <div style={{ display: 'flex', gap: 2, marginTop: 4, flexWrap: 'wrap' }}>
                {RATE_PRESETS.map(preset => (
                  <button
                    key={preset}
                    onClick={() => handleRateChange(preset)}
                    style={{
                      padding: '1px 6px',
                      background: r === preset ? '#6C5CE7' : '#F7FAFC',
                      color: r === preset ? 'white' : 'var(--text-secondary)',
                      border: `1px solid ${r === preset ? '#6C5CE7' : '#E2E8F0'}`,
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    {currencySymbol}{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Investment (calculated) */}
            <div>
              <label style={labelStyle}>Investment</label>
              <div style={{
                padding: 'var(--space-2) var(--space-3)',
                background: '#F0FDF4',
                border: '1px solid #C6F6D5',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-base)',
                fontWeight: 'var(--font-semibold)',
                color: '#276749',
                textAlign: 'center',
              }}>
                {currencySymbol}{discountedTotal.toLocaleString()}
              </div>
              {discount > 0 && (
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'center', marginTop: 2 }}>
                  Before discount: {currencySymbol}{subtotal.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Discount + Billing row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div>
              <label style={labelStyle}>Discount (%)</label>
              <input
                type="number"
                value={discount || ''}
                onChange={(e) => handleDiscountChange(e.target.value)}
                placeholder="0"
                min="0"
                max="100"
                style={{ ...numInputStyle, width: '100%' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Billing Schedule</label>
              <select
                value={billingSchedule}
                onChange={(e) => handleBillingChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-2) var(--space-3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  background: 'var(--bg-white)',
                }}
              >
                {BILLING_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 'var(--space-4)', marginBottom: 'var(--space-4)', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>Start Date</label>
              <input
                type="date"
                value={section.start_date ? section.start_date.split('T')[0] : ''}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-2) var(--space-3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                }}
              />
            </div>
            <div>
              <label style={labelStyle}>End Date</label>
              <input
                type="date"
                value={section.end_date ? section.end_date.split('T')[0] : ''}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--space-2) var(--space-3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                }}
              />
            </div>
            <button
              onClick={autoCalcEndDate}
              disabled={!section.start_date || !h}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                background: section.start_date && h ? '#6C5CE7' : '#E2E8F0',
                color: section.start_date && h ? 'white' : '#A0AEC0',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                cursor: section.start_date && h ? 'pointer' : 'default',
                whiteSpace: 'nowrap',
              }}
              title={`Auto-calculate from ${velocity}h/week velocity`}
            >
              Auto-calc
            </button>
          </div>

          {/* Deliverables */}
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <label style={labelStyle}>Deliverables</label>
            {deliverables.length > 0 && (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', marginBottom: 'var(--space-2)' }}>
                {deliverables.map((d, idx) => {
                  const excluded = d.startsWith('[EXCLUDED] ');
                  const displayText = excluded ? d.replace('[EXCLUDED] ', '') : d;
                  return (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)',
                      padding: '0.3rem 0',
                      borderBottom: '1px solid #F7FAFC',
                      opacity: excluded ? 0.5 : 1,
                    }}>
                      <input
                        type="checkbox"
                        checked={!excluded}
                        onChange={() => toggleDeliverable(idx)}
                        style={{ flexShrink: 0 }}
                      />
                      <span style={{
                        flex: 1,
                        fontSize: 'var(--text-sm)',
                        color: 'var(--text-primary)',
                        textDecoration: excluded ? 'line-through' : 'none',
                      }}>
                        {displayText}
                      </span>
                      <button onClick={() => moveDeliverable(idx, -1)} disabled={idx === 0} style={tinyBtnStyle} title="Move up">↑</button>
                      <button onClick={() => moveDeliverable(idx, 1)} disabled={idx === deliverables.length - 1} style={tinyBtnStyle} title="Move down">↓</button>
                      <button onClick={() => removeDeliverable(idx)} style={{ ...tinyBtnStyle, color: '#E53E3E' }} title="Remove">×</button>
                    </li>
                  );
                })}
              </ul>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <input
                type="text"
                value={newDeliverable}
                onChange={(e) => setNewDeliverable(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addDeliverable(); } }}
                placeholder="Add deliverable..."
                style={{
                  flex: 1,
                  padding: 'var(--space-2) var(--space-3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                }}
              />
              <button
                onClick={addDeliverable}
                disabled={!newDeliverable.trim()}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  background: newDeliverable.trim() ? '#6C5CE7' : '#E2E8F0',
                  color: newDeliverable.trim() ? 'white' : '#A0AEC0',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  cursor: newDeliverable.trim() ? 'pointer' : 'default',
                }}
              >
                + Add
              </button>
            </div>
          </div>

          {/* Diagnostic items badge */}
          {section.diagnostic_items?.length > 0 && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', paddingTop: 'var(--space-2)', borderTop: '1px solid #F7FAFC' }}>
              📊 Linked to {section.diagnostic_items.length} diagnostic item{section.diagnostic_items.length !== 1 ? 's' : ''}
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

const numInputStyle = {
  flex: 1,
  padding: 'var(--space-2) var(--space-3)',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-md)',
  fontSize: 'var(--text-sm)',
  textAlign: 'center',
  width: '100%',
  boxSizing: 'border-box',
};

const stepBtnStyle = {
  width: 28,
  height: 28,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#F7FAFC',
  border: '1px solid var(--border-color)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  fontSize: 'var(--text-base)',
  color: 'var(--text-primary)',
  flexShrink: 0,
};

const tinyBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--text-muted)',
  fontSize: 'var(--text-sm)',
  padding: '0 2px',
  flexShrink: 0,
};
