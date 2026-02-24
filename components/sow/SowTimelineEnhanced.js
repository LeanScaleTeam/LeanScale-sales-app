/**
 * SowTimelineEnhanced — Rich, editable engagement-style timeline.
 *
 * Replaces the basic SowTimeline with function-colored bars, month markers,
 * inline date editing, and auto-populate capability.
 *
 * Props:
 *   sections             - Array of sow_sections with start_date, end_date
 *   diagnosticProcesses  - For function color derivation
 *   readOnly             - Boolean
 *   onSectionDateChange  - (sectionId, field, value) => void
 *   onAutoPopulate       - (hoursPerMonth) => void
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { functionColors, getSectionColor } from '../../lib/function-colors';
import { calculateEngagementDuration, formatDateRange } from '../../lib/date-utils';

export default function SowTimelineEnhanced({
  sections = [],
  diagnosticProcesses = [],
  readOnly = false,
  onSectionDateChange,
  onAutoPopulate,
}) {
  const [editingRow, setEditingRow] = useState(null);
  const [showAutoPopulate, setShowAutoPopulate] = useState(false);
  const [autoHoursPerMonth, setAutoHoursPerMonth] = useState(100);

  const dated = sections.filter(s => s.start_date && s.end_date);
  const undated = sections.filter(s => !s.start_date || !s.end_date);
  const duration = calculateEngagementDuration(sections);

  // Empty state
  if (dated.length === 0 && undated.length === 0) {
    return null;
  }

  if (dated.length === 0) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        color: '#718096',
        fontSize: '0.875rem',
        border: '1px solid #E2E8F0',
        borderRadius: '0.75rem',
        background: 'white',
      }}>
        <div style={{ marginBottom: '0.75rem' }}>No dates assigned to sections yet.</div>
        {!readOnly && onAutoPopulate && (
          <button
            onClick={() => onAutoPopulate(100)}
            style={{
              padding: '0.5rem 1.25rem',
              background: '#6C5CE7',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Auto-populate Dates
          </button>
        )}
      </div>
    );
  }

  // Calculate date range
  const allDates = dated.flatMap(s => [new Date(s.start_date), new Date(s.end_date)]);
  const minDate = new Date(Math.min(...allDates));
  const maxDate = new Date(Math.max(...allDates));
  const totalDays = Math.max((maxDate - minDate) / (1000 * 60 * 60 * 24), 1);

  // Generate month markers
  const months = [];
  const cursor = new Date(minDate);
  cursor.setDate(1);
  while (cursor <= maxDate) {
    const dayOffset = (cursor - minDate) / (1000 * 60 * 60 * 24);
    const pct = (dayOffset / totalDays) * 100;
    if (pct >= 0 && pct <= 100) {
      months.push({
        label: cursor.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        pct,
      });
    }
    cursor.setMonth(cursor.getMonth() + 1);
  }

  // Collect function names used for legend
  const usedFunctions = new Set();
  sections.forEach((section, idx) => {
    const color = getSectionColor(section, diagnosticProcesses, idx);
    for (const [name, c] of Object.entries(functionColors)) {
      if (c.bar === color.bar) usedFunctions.add(name);
    }
  });

  return (
    <div style={{
      background: 'white',
      border: '1px solid #E2E8F0',
      borderRadius: '0.75rem',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.25rem',
        borderBottom: '1px solid #EDF2F7',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {duration.startDate && duration.endDate && (
            <span style={{ fontSize: '0.8rem', color: '#4A5568', fontWeight: 500 }}>
              {formatDateRange(duration.startDate, duration.endDate)}
            </span>
          )}
          {duration.months > 0 && (
            <span style={{
              display: 'inline-block',
              padding: '0.2rem 0.6rem',
              background: '#F3F0FF',
              color: '#6C5CE7',
              borderRadius: '1rem',
              fontSize: '0.7rem',
              fontWeight: 600,
            }}>
              {duration.months < 1 ? `${duration.weeks} weeks` : `${Math.round(duration.months)} months`}
            </span>
          )}
        </div>

        {/* Auto-populate button */}
        {!readOnly && onAutoPopulate && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowAutoPopulate(!showAutoPopulate)}
              style={{
                padding: '0.35rem 0.75rem',
                background: showAutoPopulate ? '#6C5CE7' : '#F7FAFC',
                color: showAutoPopulate ? 'white' : '#6C5CE7',
                border: '1px solid #6C5CE7',
                borderRadius: '0.375rem',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              Auto-populate Dates
            </button>

            {/* Popover */}
            {showAutoPopulate && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                background: 'white',
                border: '1px solid #E2E8F0',
                borderRadius: '0.5rem',
                padding: '1rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                zIndex: 20,
                width: '220px',
              }}>
                <div style={{ fontSize: '0.75rem', color: '#4A5568', marginBottom: '0.5rem', fontWeight: 500 }}>
                  Hours per month:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {[50, 100, 225].map(tier => (
                    <button
                      key={tier}
                      onClick={() => setAutoHoursPerMonth(tier)}
                      style={{
                        flex: 1,
                        padding: '0.35rem',
                        background: autoHoursPerMonth === tier ? '#6C5CE7' : '#F7FAFC',
                        color: autoHoursPerMonth === tier ? 'white' : '#4A5568',
                        border: '1px solid #E2E8F0',
                        borderRadius: '0.25rem',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    onAutoPopulate(autoHoursPerMonth);
                    setShowAutoPopulate(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: '#6C5CE7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Apply ({autoHoursPerMonth} hrs/mo)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Timeline body */}
      <div style={{ padding: '1rem 1.25rem' }}>
        {/* Month markers */}
        <div style={{
          display: 'flex',
          position: 'relative',
          height: '1.5rem',
          marginLeft: '180px',
          marginBottom: '0.25rem',
        }}>
          {months.map((m, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${m.pct}%`,
                fontSize: '0.6rem',
                color: '#A0AEC0',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
                fontWeight: 500,
              }}
            >
              {m.label}
            </div>
          ))}
        </div>

        {/* Section rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {dated.map((section, idx) => {
            const color = getSectionColor(section, diagnosticProcesses, idx);
            const startOffset = (new Date(section.start_date) - minDate) / (1000 * 60 * 60 * 24);
            const endOffset = (new Date(section.end_date) - minDate) / (1000 * 60 * 60 * 24);
            const leftPct = (startOffset / totalDays) * 100;
            const widthPct = Math.max(((endOffset - startOffset) / totalDays) * 100, 2);
            const hours = parseFloat(section.hours) || 0;
            const isEditing = editingRow === section.id;

            const startStr = new Date(section.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const endStr = new Date(section.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const durationDays = Math.round(endOffset - startOffset);
            const durationWeeks = Math.ceil(durationDays / 7);

            return (
              <div key={section.id || idx}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Label */}
                  <div style={{
                    width: '180px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    overflow: 'hidden',
                  }}>
                    {/* Function color dot */}
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: color.bar,
                      flexShrink: 0,
                    }} />
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: '#4A5568',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                    }}>
                      {section.title}
                    </div>
                    {hours > 0 && (
                      <span style={{
                        fontSize: '0.6rem',
                        color: '#A0AEC0',
                        flexShrink: 0,
                      }}>
                        {hours}h
                      </span>
                    )}
                  </div>

                  {/* Bar container */}
                  <div
                    style={{
                      flex: 1,
                      position: 'relative',
                      height: '32px',
                      background: '#F7FAFC',
                      borderRadius: '0.25rem',
                      overflow: 'hidden',
                      cursor: !readOnly ? 'pointer' : 'default',
                    }}
                    onClick={() => {
                      if (!readOnly) setEditingRow(isEditing ? null : section.id);
                    }}
                  >
                    {/* Month grid lines */}
                    {months.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        style={{
                          position: 'absolute',
                          left: `${m.pct}%`,
                          top: 0,
                          bottom: 0,
                          width: '1px',
                          background: '#EDF2F7',
                        }}
                      />
                    ))}

                    {/* Section bar */}
                    <motion.div
                      layout
                      style={{
                        position: 'absolute',
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        top: '4px',
                        bottom: '4px',
                        background: color.bar,
                        borderRadius: '0.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                      }}
                      title={`${section.title}: ${startStr} - ${endStr} (${durationWeeks}w)`}
                    >
                      {widthPct > 12 && (
                        <span style={{
                          fontSize: '0.55rem',
                          color: 'white',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          padding: '0 0.25rem',
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        }}>
                          {startStr} — {endStr}
                        </span>
                      )}
                    </motion.div>
                  </div>

                  {/* Duration badge */}
                  <div style={{
                    width: '42px',
                    flexShrink: 0,
                    fontSize: '0.6rem',
                    color: '#A0AEC0',
                    textAlign: 'right',
                    fontWeight: 500,
                  }}>
                    {durationWeeks}w
                  </div>
                </div>

                {/* Inline date editor (admin mode) */}
                {isEditing && !readOnly && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      padding: '0.5rem 0 0.5rem 188px',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: '#A0AEC0' }}>Start:</span>
                      <input
                        type="date"
                        value={section.start_date ? section.start_date.split('T')[0] : ''}
                        onChange={(e) => onSectionDateChange?.(section.id, 'start_date', e.target.value || null)}
                        style={dateInputStyle}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ color: '#A0AEC0' }}>End:</span>
                      <input
                        type="date"
                        value={section.end_date ? section.end_date.split('T')[0] : ''}
                        onChange={(e) => onSectionDateChange?.(section.id, 'end_date', e.target.value || null)}
                        style={dateInputStyle}
                      />
                    </div>
                    <span style={{ color: '#A0AEC0', fontSize: '0.65rem', alignSelf: 'center' }}>
                      {durationWeeks} weeks ({durationDays} days)
                    </span>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Undated sections notice */}
        {undated.length > 0 && (
          <div style={{
            marginTop: '0.75rem',
            padding: '0.5rem 0.75rem',
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '0.375rem',
            fontSize: '0.7rem',
            color: '#92400E',
          }}>
            {undated.length} section{undated.length > 1 ? 's' : ''} without dates:{' '}
            {undated.map(s => s.title).join(', ')}
          </div>
        )}
      </div>

      {/* Footer: legend + date range */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.25rem',
        borderTop: '1px solid #EDF2F7',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        {/* Function color legend */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[...usedFunctions].map(name => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{
                width: 10,
                height: 10,
                background: functionColors[name].bg,
                border: `2px solid ${functionColors[name].border}`,
                borderRadius: '2px',
              }} />
              <span style={{ fontSize: '0.65rem', color: '#718096' }}>{name}</span>
            </div>
          ))}
        </div>

        {/* Date range */}
        <div style={{ fontSize: '0.65rem', color: '#A0AEC0' }}>
          {minDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          {' — '}
          {maxDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </div>
  );
}

const dateInputStyle = {
  border: '1px solid #E2E8F0',
  borderRadius: '0.25rem',
  padding: '0.2rem 0.4rem',
  fontSize: '0.75rem',
  color: '#4A5568',
  background: 'white',
};
