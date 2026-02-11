/**
 * TimelineConfigurator - Visual Gantt-style timeline editor
 *
 * Shows horizontal bars for each section, supports drag-to-resize,
 * drag-to-move, overlap detection, auto-schedule, and velocity controls.
 */

import { useState, useMemo, useCallback, useRef } from 'react';

const COLORS = ['#6C5CE7', '#00B894', '#0984E3', '#E17055', '#FDCB6E', '#A29BFE', '#55EFC4', '#74B9FF'];
const DAY_MS = 86400000;

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffDays(a, b) {
  return Math.round((new Date(b) - new Date(a)) / DAY_MS);
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function toDateStr(d) {
  return d.toISOString().split('T')[0];
}

export default function TimelineConfigurator({
  sections = [],
  onUpdateSection,
  velocity = 40,
  onVelocityChange,
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(null); // { sectionId, type: 'move'|'resize', startX, origStart, origEnd }
  const containerRef = useRef(null);

  // Compute timeline bounds
  const { timelineStart, timelineEnd, totalDays } = useMemo(() => {
    const validSections = sections.filter(s => s.start_date);
    if (validSections.length === 0) {
      const today = new Date();
      return {
        timelineStart: today,
        timelineEnd: addDays(today, 90),
        totalDays: 90,
      };
    }
    let minDate = new Date(validSections[0].start_date);
    let maxDate = validSections[0].end_date ? new Date(validSections[0].end_date) : addDays(minDate, 14);
    validSections.forEach(s => {
      const start = new Date(s.start_date);
      const end = s.end_date ? new Date(s.end_date) : addDays(start, 14);
      if (start < minDate) minDate = start;
      if (end > maxDate) maxDate = end;
    });
    // Add padding
    minDate = addDays(minDate, -7);
    maxDate = addDays(maxDate, 14);
    const days = Math.max(30, diffDays(minDate, maxDate));
    return { timelineStart: minDate, timelineEnd: maxDate, totalDays: days };
  }, [sections]);

  // Detect overlaps
  const overlaps = useMemo(() => {
    const warnings = [];
    const dated = sections.filter(s => s.start_date && s.end_date);
    for (let i = 0; i < dated.length; i++) {
      for (let j = i + 1; j < dated.length; j++) {
        const a = dated[i], b = dated[j];
        if (new Date(a.start_date) < new Date(b.end_date) && new Date(b.start_date) < new Date(a.end_date)) {
          warnings.push(`"${a.title}" overlaps with "${b.title}"`);
        }
      }
    }
    return warnings;
  }, [sections]);

  // Auto-schedule: sequence sections one after another
  function autoSchedule() {
    const today = new Date();
    let cursor = today;
    sections.forEach((s, idx) => {
      const hours = parseFloat(s.hours) || 40;
      const weeks = Math.max(1, Math.ceil(hours / velocity));
      const startDate = toDateStr(cursor);
      const endDate = toDateStr(addDays(cursor, weeks * 7));
      onUpdateSection(s.id, { startDate, endDate });
      cursor = addDays(cursor, weeks * 7);
    });
  }

  // Mouse handlers for drag
  const handleMouseDown = useCallback((e, sectionId, type) => {
    e.preventDefault();
    const section = sections.find(s => s.id === sectionId);
    if (!section?.start_date) return;
    setDragging({
      sectionId,
      type,
      startX: e.clientX,
      origStart: section.start_date,
      origEnd: section.end_date || toDateStr(addDays(new Date(section.start_date), 14)),
    });
  }, [sections]);

  const handleMouseMove = useCallback((e) => {
    if (!dragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pxPerDay = rect.width / totalDays;
    const deltaPx = e.clientX - dragging.startX;
    const deltaDays = Math.round(deltaPx / pxPerDay);

    if (dragging.type === 'move') {
      const newStart = toDateStr(addDays(new Date(dragging.origStart), deltaDays));
      const newEnd = toDateStr(addDays(new Date(dragging.origEnd), deltaDays));
      onUpdateSection(dragging.sectionId, { startDate: newStart, endDate: newEnd });
    } else if (dragging.type === 'resize') {
      const newEnd = toDateStr(addDays(new Date(dragging.origEnd), deltaDays));
      if (new Date(newEnd) > new Date(dragging.origStart)) {
        onUpdateSection(dragging.sectionId, { endDate: newEnd });
      }
    }
  }, [dragging, totalDays, onUpdateSection]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  const sectionsWithDates = sections.filter(s => s.start_date);
  const sectionsWithoutDates = sections.filter(s => !s.start_date);

  return (
    <div
      style={{
        background: 'var(--bg-white)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        marginTop: 'var(--space-6)',
        overflow: 'hidden',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
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
          <span style={{ fontSize: 'var(--text-lg)' }}>📅</span>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', color: 'var(--gray-900)', margin: 0 }}>
            Timeline
          </h3>
          {overlaps.length > 0 && (
            <span style={{
              padding: '1px 8px',
              background: '#FED7D7',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-xs)',
              color: '#E53E3E',
            }}>
              {overlaps.length} overlap{overlaps.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <span style={{ color: 'var(--text-muted)' }}>{collapsed ? '▸' : '▾'}</span>
      </div>

      {!collapsed && (
        <div style={{ padding: 'var(--space-5)' }}>
          {/* Controls row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                Velocity
              </label>
              <input
                type="number"
                value={velocity}
                onChange={(e) => onVelocityChange?.(Math.max(1, parseInt(e.target.value) || 40))}
                style={{
                  width: 60,
                  padding: '0.25rem 0.5rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-sm)',
                  textAlign: 'center',
                }}
              />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>hrs/week</span>
            </div>
            <button
              onClick={autoSchedule}
              style={{
                padding: 'var(--space-2) var(--space-4)',
                background: '#6C5CE7',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--font-medium)',
                cursor: 'pointer',
              }}
            >
              ⚡ Auto-Schedule
            </button>
          </div>

          {/* Overlap warnings */}
          {overlaps.length > 0 && (
            <div style={{
              padding: 'var(--space-2) var(--space-3)',
              background: '#FFF5F5',
              border: '1px solid #FED7D7',
              borderRadius: 'var(--radius-md)',
              marginBottom: 'var(--space-4)',
              fontSize: 'var(--text-xs)',
              color: '#E53E3E',
            }}>
              ⚠️ {overlaps.join(' • ')}
            </div>
          )}

          {/* Gantt chart */}
          <div ref={containerRef} style={{ position: 'relative', minHeight: 40 }}>
            {/* Month markers */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              marginBottom: 'var(--space-2)',
              paddingBottom: 'var(--space-1)',
              borderBottom: '1px solid #EDF2F7',
            }}>
              <span>{formatDate(timelineStart)}</span>
              <span>{formatDate(addDays(timelineStart, Math.floor(totalDays / 2)))}</span>
              <span>{formatDate(timelineEnd)}</span>
            </div>

            {/* Bars */}
            {sectionsWithDates.length === 0 ? (
              <div style={{
                padding: 'var(--space-6)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: 'var(--text-sm)',
              }}>
                No sections have dates yet. Set start dates on sections above, or click Auto-Schedule.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {sectionsWithDates.map((section, idx) => {
                  const start = new Date(section.start_date);
                  const end = section.end_date ? new Date(section.end_date) : addDays(start, 14);
                  const leftPct = Math.max(0, (diffDays(timelineStart, start) / totalDays) * 100);
                  const widthPct = Math.max(2, (diffDays(start, end) / totalDays) * 100);
                  const color = COLORS[idx % COLORS.length];
                  const hours = parseFloat(section.hours) || 0;

                  return (
                    <div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', height: 32 }}>
                      <div style={{
                        width: 120,
                        fontSize: 'var(--text-xs)',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                      }}>
                        {section.title}
                      </div>
                      <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                        <div
                          onMouseDown={(e) => handleMouseDown(e, section.id, 'move')}
                          style={{
                            position: 'absolute',
                            left: `${leftPct}%`,
                            width: `${widthPct}%`,
                            height: '100%',
                            background: color,
                            borderRadius: 'var(--radius-sm)',
                            cursor: dragging ? 'grabbing' : 'grab',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            color: 'white',
                            fontWeight: 'var(--font-semibold)',
                            userSelect: 'none',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            minWidth: 20,
                          }}
                          title={`${formatDate(start)} → ${formatDate(end)}${hours ? ` (${hours}h)` : ''}`}
                        >
                          {widthPct > 8 && <span>{hours ? `${hours}h` : ''}</span>}
                          {/* Resize handle */}
                          <div
                            onMouseDown={(e) => { e.stopPropagation(); handleMouseDown(e, section.id, 'resize'); }}
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: 0,
                              width: 6,
                              height: '100%',
                              cursor: 'ew-resize',
                              background: 'rgba(0,0,0,0.15)',
                              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Sections without dates */}
            {sectionsWithoutDates.length > 0 && (
              <div style={{
                marginTop: 'var(--space-3)',
                padding: 'var(--space-2) var(--space-3)',
                background: '#FFFBEB',
                border: '1px solid #FEF3C7',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                color: '#92400E',
              }}>
                📌 {sectionsWithoutDates.length} section{sectionsWithoutDates.length !== 1 ? 's' : ''} without dates:{' '}
                {sectionsWithoutDates.map(s => s.title).join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
