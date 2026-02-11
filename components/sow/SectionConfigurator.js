/**
 * SectionConfigurator - Enhanced section editor with inline editing for all fields
 *
 * Retainer-based model: no per-section rates or pricing.
 * Hours are the key metric — catalog provides "suggested" hours,
 * rep sets "actual" hours. Pricing is handled globally by TierSelector.
 */

import { useState, useRef, useCallback, useEffect } from 'react';

export default function SectionConfigurator({
  section,
  onUpdate,
  onDelete,
  diagnosticItems = {},
  velocity = 40, // hours per week
}) {
  const [expanded, setExpanded] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(section.title || '');
  const [descDraft, setDescDraft] = useState(section.description || '');
  const [newDeliverable, setNewDeliverable] = useState('');
  const debounceRef = useRef(null);

  const h = parseFloat(section.hours) || 0;
  const suggestedHours = parseFloat(section.suggested_hours) || null;
  const deliverables = section.deliverables || [];

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

  function handleDateChange(field, value) {
    immediateUpdate({ [field]: value || null });
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

  // Hours delta indicator
  const hoursDelta = suggestedHours && h ? h - suggestedHours : null;

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
          {h > 0 && (
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--ls-purple-light)' }}>
              {h}h
            </span>
          )}
          {deliverables.length > 0 && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              {deliverables.filter(d => !d.startsWith('[EXCLUDED] ')).length}/{deliverables.length} deliverables
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

          {/* Hours row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            {/* Actual Hours */}
            <div>
              <label style={labelStyle}>Hours (Actual)</label>
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
              {hoursDelta !== null && (
                <div style={{
                  fontSize: 'var(--text-xs)',
                  color: hoursDelta > 0 ? '#E53E3E' : hoursDelta < 0 ? '#276749' : 'var(--text-muted)',
                  marginTop: 4,
                  textAlign: 'center',
                }}>
                  {hoursDelta > 0 ? `+${hoursDelta}h over suggested` : hoursDelta < 0 ? `${hoursDelta}h under suggested` : 'Matches suggested'}
                </div>
              )}
            </div>

            {/* Suggested Hours (from catalog, read-only) */}
            <div>
              <label style={labelStyle}>Hours (Suggested)</label>
              <div style={{
                padding: 'var(--space-2) var(--space-3)',
                background: suggestedHours ? '#EDF2F7' : '#F7FAFC',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                textAlign: 'center',
                color: suggestedHours ? 'var(--text-primary)' : 'var(--text-muted)',
              }}>
                {suggestedHours ? `${suggestedHours}h (catalog)` : 'No catalog estimate'}
              </div>
              {suggestedHours && h === 0 && (
                <button
                  onClick={() => handleHoursChange(suggestedHours)}
                  style={{
                    marginTop: 4,
                    width: '100%',
                    padding: '2px 0',
                    background: 'none',
                    border: '1px solid #6C5CE7',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '10px',
                    color: '#6C5CE7',
                    cursor: 'pointer',
                  }}
                >
                  Use suggested
                </button>
              )}
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
