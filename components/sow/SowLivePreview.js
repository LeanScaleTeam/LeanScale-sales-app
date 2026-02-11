/**
 * SowLivePreview - Real-time WYSIWYG SOW document preview
 *
 * Renders the SOW as it would appear in the final PDF document,
 * but as web-rendered HTML. Updates live as sections change.
 *
 * Props:
 *   sow              - The SOW object
 *   sections         - Array of sow_sections (live state from builder)
 *   diagnosticResult - Linked diagnostic result (optional)
 *   customerName     - Customer name for header
 *   zoom             - Zoom level (0.5, 0.75, 1)
 *   onZoomChange     - Callback when zoom changes
 *   activeSectionId  - Currently active section in builder (for scroll sync)
 */

import { useRef, useEffect, useMemo, useState } from 'react';

const COLORS = {
  primary: '#6C5CE7',
  primaryLight: '#EDE9FE',
  dark: '#1a1a2e',
  text: '#4A5568',
  textLight: '#718096',
  textMuted: '#A0AEC0',
  border: '#E2E8F0',
  bgLight: '#F7FAFC',
  green: '#276749',
  white: '#FFFFFF',
};

const STATUS_COLORS = {
  healthy: '#22c55e',
  careful: '#eab308',
  warning: '#ef4444',
  unable: '#1f2937',
};

// A4 dimensions at 96 DPI
const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const PAGE_PADDING = 50;
const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING * 2 - 40; // minus footer

function groupSectionsByFunction(sections) {
  const groups = {};
  for (const section of sections) {
    const key = section.function_area || 'General';
    if (!groups[key]) groups[key] = { label: key, sections: [], totalHours: 0, totalCost: 0 };
    const h = parseFloat(section.hours) || 0;
    const r = parseFloat(section.rate) || 0;
    groups[key].sections.push(section);
    groups[key].totalHours += h;
    groups[key].totalCost += h * r;
  }
  return Object.values(groups);
}

export default function SowLivePreview({
  sow,
  sections = [],
  diagnosticResult,
  customerName = '',
  zoom = 0.75,
  onZoomChange,
  activeSectionId,
  executiveSummary,
}) {
  const containerRef = useRef(null);
  const sectionRefs = useRef({});
  const [isPrintMode, setIsPrintMode] = useState(false);

  const content = sow?.content || {};
  const summary = executiveSummary ?? content.executive_summary ?? '';
  const diagnosticProcesses = diagnosticResult?.processes || [];
  const isDraft = sow?.status === 'draft';

  // Totals
  const totalHours = sections.reduce((sum, s) => sum + (parseFloat(s.hours) || 0), 0);
  const totalInvestment = sections.reduce((sum, s) => {
    return sum + (parseFloat(s.hours) || 0) * (parseFloat(s.rate) || 0);
  }, 0);

  const functionGroups = useMemo(() => groupSectionsByFunction(sections), [sections]);
  const hasMultipleGroups = functionGroups.length > 1;

  // Dates
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const validUntil = new Date(now.getTime() + 30 * 86400000);
  const formattedValidUntil = validUntil.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Scroll to active section
  useEffect(() => {
    if (activeSectionId && sectionRefs.current[activeSectionId]) {
      sectionRefs.current[activeSectionId].scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeSectionId]);

  if (!sow) return null;

  const zoomOptions = [0.5, 0.75, 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: '#F7FAFC',
        borderBottom: '1px solid #E2E8F0',
        fontSize: '12px',
        flexShrink: 0,
      }}>
        <span style={{ color: COLORS.textLight, fontWeight: 600 }}>
          📄 Live Preview
        </span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {zoomOptions.map(z => (
            <button
              key={z}
              onClick={() => onZoomChange?.(z)}
              style={{
                padding: '2px 8px',
                border: '1px solid',
                borderColor: zoom === z ? COLORS.primary : COLORS.border,
                borderRadius: '4px',
                background: zoom === z ? COLORS.primaryLight : COLORS.white,
                color: zoom === z ? COLORS.primary : COLORS.textLight,
                fontSize: '11px',
                fontWeight: zoom === z ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {Math.round(z * 100)}%
            </button>
          ))}
          <div style={{ width: 1, height: 16, background: COLORS.border, margin: '0 4px' }} />
          <button
            onClick={() => window.print()}
            style={{
              padding: '2px 8px',
              border: '1px solid ' + COLORS.border,
              borderRadius: '4px',
              background: COLORS.white,
              color: COLORS.textLight,
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            🖨 Print
          </button>
        </div>
      </div>

      {/* Document container */}
      <div
        ref={containerRef}
        className="sow-preview-scroll"
        style={{
          flex: 1,
          overflow: 'auto',
          background: '#E2E8F0',
          padding: '24px',
        }}
      >
        <div
          className="sow-document"
          style={{
            width: PAGE_WIDTH,
            margin: '0 auto',
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            marginBottom: (zoom < 1) ? -(PAGE_WIDTH * (1 - zoom) * 0.5) : 0,
          }}
        >
          {/* Page 1+ */}
          <div style={{
            background: COLORS.white,
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
            borderRadius: '2px',
            padding: PAGE_PADDING,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: '10px',
            color: COLORS.text,
            lineHeight: 1.5,
            position: 'relative',
            minHeight: PAGE_HEIGHT,
          }}>
            {/* Draft watermark */}
            {isDraft && (
              <div style={{
                position: 'absolute',
                top: '35%',
                left: '15%',
                fontSize: '80px',
                fontWeight: 'bold',
                color: 'rgba(108, 92, 231, 0.06)',
                transform: 'rotate(-35deg)',
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 0,
              }}>
                DRAFT
              </div>
            )}

            {/* Header */}
            <div style={{
              marginBottom: 30,
              borderBottom: `2px solid ${COLORS.primary}`,
              paddingBottom: 15,
              position: 'relative',
              zIndex: 1,
            }}>
              <div style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.dark, marginBottom: 4 }}>
                {sow.title}
              </div>
              <div style={{ fontSize: 10, color: COLORS.textLight }}>
                {customerName ? `Prepared for ${customerName}` : 'Statement of Work'}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                <MetaItem label="Date" value={formattedDate} />
                <MetaItem label="Type" value={sow.sow_type} />
                {totalHours > 0 && <MetaItem label="Total Hours" value={totalHours} />}
                {totalInvestment > 0 && <MetaItem label="Investment" value={`$${totalInvestment.toLocaleString()}`} />}
              </div>
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${COLORS.border}` }}>
                <span style={{ fontSize: 8, color: COLORS.textMuted }}>
                  Generated: {formattedDate} | Valid for 30 days (until {formattedValidUntil})
                  {isDraft ? ' | STATUS: DRAFT' : ''}
                </span>
              </div>
            </div>

            {/* Executive Summary */}
            {summary && (
              <div style={{ marginBottom: 20, position: 'relative', zIndex: 1 }}>
                <SectionHeading>Executive Summary</SectionHeading>
                <div style={{
                  background: COLORS.bgLight,
                  padding: 14,
                  borderRadius: 4,
                  borderLeft: `3px solid ${COLORS.primary}`,
                }}>
                  <div style={{ fontSize: 8, fontWeight: 'bold', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                    Overview
                  </div>
                  <div style={{ fontSize: 10, lineHeight: 1.6, color: COLORS.text }}>
                    {summary}
                  </div>
                </div>
              </div>
            )}

            {/* Page break indicator */}
            <PageBreakIndicator />

            {/* Scope of Work */}
            {sections.length > 0 && (
              <div style={{ position: 'relative', zIndex: 1 }}>
                <SectionHeading>Scope of Work</SectionHeading>
                {sections.map((section, idx) => {
                  const h = parseFloat(section.hours) || 0;
                  const r = parseFloat(section.rate) || 0;
                  const subtotal = h * r;
                  const deliverables = section.deliverables || [];
                  const linkedItems = section.diagnostic_items || [];
                  const isActive = section.id === activeSectionId;

                  return (
                    <div
                      key={section.id || idx}
                      ref={el => { if (section.id) sectionRefs.current[section.id] = el; }}
                      style={{
                        marginBottom: 14,
                        border: `1px solid ${isActive ? COLORS.primary : COLORS.border}`,
                        borderRadius: 4,
                        overflow: 'hidden',
                        transition: 'border-color 0.2s',
                        boxShadow: isActive ? `0 0 0 1px ${COLORS.primary}` : 'none',
                      }}
                    >
                      {/* Section header */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 14px',
                        background: COLORS.bgLight,
                        borderBottom: `1px solid ${COLORS.border}`,
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 'bold', color: COLORS.dark }}>
                          {idx + 1}. {section.title}
                        </span>
                        {subtotal > 0 && (
                          <span style={{ fontSize: 10, fontWeight: 'bold', color: COLORS.green }}>
                            ${subtotal.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Section body */}
                      <div style={{ padding: 14 }}>
                        {section.description && (
                          <div style={{ fontSize: 9.5, lineHeight: 1.5, color: COLORS.text, marginBottom: 8 }}>
                            {section.description}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: 20, marginTop: 4, flexWrap: 'wrap' }}>
                          {h > 0 && <span style={{ fontSize: 9, color: COLORS.textLight }}>Hours: {h}</span>}
                          {r > 0 && <span style={{ fontSize: 9, color: COLORS.textLight }}>Rate: ${r.toLocaleString()}/hr</span>}
                          {section.start_date && <span style={{ fontSize: 9, color: COLORS.textLight }}>Start: {new Date(section.start_date).toLocaleDateString()}</span>}
                          {section.end_date && <span style={{ fontSize: 9, color: COLORS.textLight }}>End: {new Date(section.end_date).toLocaleDateString()}</span>}
                        </div>

                        {deliverables.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 9, fontWeight: 'bold', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                              Deliverables
                            </div>
                            {deliverables.map((d, dIdx) => (
                              <div key={dIdx} style={{ display: 'flex', marginBottom: 3 }}>
                                <span style={{ fontSize: 9, color: COLORS.primary, marginRight: 6, width: 8 }}>•</span>
                                <span style={{ fontSize: 9, color: COLORS.text, flex: 1 }}>{d}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {linkedItems.length > 0 && diagnosticProcesses.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <div style={{ fontSize: 9, fontWeight: 'bold', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                              Addresses Diagnostic Findings
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {linkedItems.map((name, nIdx) => {
                                const proc = diagnosticProcesses.find(p => p.name === name);
                                const statusColor = proc ? STATUS_COLORS[proc.status] || '#9ca3af' : '#9ca3af';
                                return (
                                  <span key={nIdx} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                                    <span style={{ fontSize: 8, color: COLORS.textLight }}>{name}</span>
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Page break indicator */}
            {sections.length > 2 && <PageBreakIndicator />}

            {/* Investment Table */}
            {sections.length > 0 && (
              <div style={{ marginTop: 10, position: 'relative', zIndex: 1 }}>
                <SectionHeading>Investment Summary</SectionHeading>
                <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 4, overflow: 'hidden' }}>
                  {/* Table header */}
                  <div style={{ display: 'flex', background: COLORS.primary, padding: '8px 10px' }}>
                    <span style={{ ...thStyle, width: '40%' }}>Section</span>
                    <span style={{ ...thStyle, width: '15%', textAlign: 'right' }}>Hours</span>
                    <span style={{ ...thStyle, width: '20%', textAlign: 'right' }}>Rate</span>
                    <span style={{ ...thStyle, width: '25%', textAlign: 'right' }}>Subtotal</span>
                  </div>

                  {/* Rows grouped by function */}
                  {functionGroups.map((group, gIdx) => (
                    <div key={gIdx}>
                      {hasMultipleGroups && (
                        <div style={{ display: 'flex', padding: '6px 10px', background: COLORS.primaryLight }}>
                          <span style={{ fontSize: 8, fontWeight: 'bold', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {group.label}
                          </span>
                        </div>
                      )}
                      {group.sections.map((section, idx) => {
                        const h = parseFloat(section.hours) || 0;
                        const r = parseFloat(section.rate) || 0;
                        const subtotal = h * r;
                        return (
                          <div key={section.id || idx} style={{
                            display: 'flex',
                            padding: '7px 10px',
                            borderBottom: `1px solid ${COLORS.border}`,
                            background: idx % 2 === 1 ? COLORS.bgLight : COLORS.white,
                          }}>
                            <span style={{ width: '40%', fontSize: 9, fontWeight: 'bold', color: COLORS.dark }}>
                              {hasMultipleGroups ? '  ' : ''}{section.title}
                            </span>
                            <span style={{ width: '15%', fontSize: 9, textAlign: 'right', color: COLORS.text }}>
                              {h > 0 ? h : '—'}
                            </span>
                            <span style={{ width: '20%', fontSize: 9, textAlign: 'right', color: COLORS.text }}>
                              {r > 0 ? `$${r.toLocaleString()}` : '—'}
                            </span>
                            <span style={{ width: '25%', fontSize: 9, textAlign: 'right', fontWeight: 'bold', color: COLORS.green }}>
                              {subtotal > 0 ? `$${subtotal.toLocaleString()}` : '—'}
                            </span>
                          </div>
                        );
                      })}
                      {hasMultipleGroups && (
                        <div style={{ display: 'flex', padding: '6px 10px', background: COLORS.primaryLight, borderBottom: `1px solid ${COLORS.border}` }}>
                          <span style={{ width: '40%', fontSize: 8, fontWeight: 'bold', color: COLORS.primary }}>{group.label} Subtotal</span>
                          <span style={{ width: '15%', fontSize: 8, textAlign: 'right', fontWeight: 'bold', color: COLORS.primary }}>{group.totalHours || ''}</span>
                          <span style={{ width: '20%' }} />
                          <span style={{ width: '25%', fontSize: 9, textAlign: 'right', fontWeight: 'bold', color: COLORS.primary }}>${group.totalCost.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Grand Total */}
                  <div style={{ display: 'flex', padding: '10px', background: COLORS.dark }}>
                    <span style={{ width: '40%', fontSize: 10, fontWeight: 'bold', color: '#fff' }}>Grand Total</span>
                    <span style={{ width: '15%', fontSize: 10, textAlign: 'right', fontWeight: 'bold', color: '#fff' }}>{totalHours || ''}</span>
                    <span style={{ width: '20%' }} />
                    <span style={{ width: '25%', fontSize: 12, textAlign: 'right', fontWeight: 'bold', color: '#fff' }}>${totalInvestment.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Assumptions */}
            {content.assumptions && (
              <div style={{ marginTop: 20, position: 'relative', zIndex: 1 }}>
                <SectionHeading>Assumptions</SectionHeading>
                {Array.isArray(content.assumptions) ? (
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 9, color: COLORS.text }}>
                    {content.assumptions.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: 3, lineHeight: 1.5 }}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: 9, color: COLORS.text, lineHeight: 1.6 }}>{content.assumptions}</div>
                )}
              </div>
            )}

            {/* Acceptance Criteria */}
            {content.acceptance_criteria && (
              <div style={{ marginTop: 20, position: 'relative', zIndex: 1 }}>
                <SectionHeading>Acceptance Criteria</SectionHeading>
                {Array.isArray(content.acceptance_criteria) ? (
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 9, color: COLORS.text }}>
                    {content.acceptance_criteria.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: 3, lineHeight: 1.5 }}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <div style={{ fontSize: 9, color: COLORS.text, lineHeight: 1.6 }}>{content.acceptance_criteria}</div>
                )}
              </div>
            )}

            {/* Footer */}
            <div style={{
              position: 'absolute',
              bottom: 30,
              left: PAGE_PADDING,
              right: PAGE_PADDING,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1px solid ${COLORS.border}`,
              paddingTop: 8,
            }}>
              <span style={{ fontSize: 8, color: COLORS.textMuted }}>
                {customerName ? `${customerName} — ` : ''}{sow.title}
              </span>
              <span style={{ fontSize: 8, color: COLORS.primary, fontWeight: 'bold' }}>LeanScale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .sow-document, .sow-document * { visibility: visible; }
          .sow-document {
            position: absolute;
            left: 0;
            top: 0;
            transform: none !important;
            width: 100% !important;
          }
          .sow-preview-scroll {
            overflow: visible !important;
            background: white !important;
            padding: 0 !important;
          }
          .page-break-indicator { display: none !important; }
        }
      `}</style>
    </div>
  );
}

function SectionHeading({ children }) {
  return (
    <div style={{
      fontSize: 14,
      fontWeight: 'bold',
      color: COLORS.dark,
      marginBottom: 10,
      marginTop: 20,
    }}>
      {children}
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <span style={{ fontSize: 9, color: COLORS.textMuted }}>
      {label}: <span style={{ fontWeight: 'bold', color: COLORS.text }}>{value}</span>
    </span>
  );
}

function PageBreakIndicator() {
  return (
    <div className="page-break-indicator" style={{
      position: 'relative',
      margin: '16px 0',
      borderTop: '2px dashed #CBD5E0',
      textAlign: 'center',
    }}>
      <span style={{
        position: 'relative',
        top: '-9px',
        background: '#fff',
        padding: '0 8px',
        fontSize: '9px',
        color: '#A0AEC0',
        fontStyle: 'italic',
      }}>
        ✂ approximate page break
      </span>
    </div>
  );
}

const thStyle = {
  fontSize: 8,
  fontWeight: 'bold',
  color: '#fff',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
};
