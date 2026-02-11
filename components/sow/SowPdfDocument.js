/**
 * SowPdfDocument - React PDF template for SOW export
 *
 * PRICING MODEL: Retainer-based tiers (not rate × hours)
 * Investment table shows section hours breakdown, selected tier,
 * monthly price, estimated duration, and total engagement value.
 */

import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from '@react-pdf/renderer';

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
  greenBg: '#F0FDF4',
  red: '#9B2C2C',
  yellow: '#975A16',
  watermark: 'rgba(108, 92, 231, 0.06)',
};

const STATUS_COLORS = {
  healthy: '#22c55e',
  careful: '#eab308',
  warning: '#ef4444',
  unable: '#1f2937',
};

const TIERS = [
  { id: 'starter', hours: 50, price: 15000, label: 'Starter' },
  { id: 'growth', hours: 100, price: 25000, label: 'Growth' },
  { id: 'scale', hours: 225, price: 50000, label: 'Scale' },
];

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingBottom: 70,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: COLORS.text,
  },
  watermark: {
    position: 'absolute',
    top: '35%',
    left: '15%',
    fontSize: 80,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.watermark,
    transform: 'rotate(-35deg)',
    opacity: 1,
  },
  header: {
    marginBottom: 30,
    borderBottom: `2px solid ${COLORS.primary}`,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.dark,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  headerMeta: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  metaItem: {
    fontSize: 9,
    color: COLORS.textMuted,
  },
  metaValue: {
    fontFamily: 'Helvetica-Bold',
    color: COLORS.text,
  },
  validityBar: {
    marginTop: 6,
    paddingTop: 6,
    borderTop: `1px solid ${COLORS.border}`,
  },
  validityText: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  tocContainer: {
    marginBottom: 20,
    padding: 14,
    backgroundColor: COLORS.bgLight,
    borderRadius: 4,
    border: `1px solid ${COLORS.border}`,
  },
  tocTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.dark,
    marginBottom: 10,
  },
  tocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottom: `1px dotted ${COLORS.border}`,
  },
  tocItemText: {
    fontSize: 9,
    color: COLORS.text,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Helvetica-Bold',
    color: COLORS.dark,
    marginBottom: 10,
    marginTop: 20,
  },
  execSummaryContainer: {
    marginBottom: 20,
    minPresenceAhead: 100,
  },
  summaryBox: {
    backgroundColor: COLORS.bgLight,
    padding: 14,
    borderRadius: 4,
    borderLeft: `3px solid ${COLORS.primary}`,
  },
  summaryLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.6,
    color: COLORS.text,
  },
  scopeCard: {
    marginBottom: 14,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scopeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10 14',
    backgroundColor: COLORS.bgLight,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  scopeTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.dark,
  },
  scopeBody: {
    padding: 14,
  },
  scopeDescription: {
    fontSize: 9.5,
    lineHeight: 1.5,
    color: COLORS.text,
    marginBottom: 8,
  },
  scopeMeta: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 4,
  },
  scopeMetaItem: {
    fontSize: 9,
    color: COLORS.textLight,
  },
  deliverablesHeading: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
  },
  deliverableItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  deliverableBullet: {
    fontSize: 9,
    color: COLORS.primary,
    marginRight: 6,
    width: 8,
  },
  deliverableText: {
    fontSize: 9,
    color: COLORS.text,
    flex: 1,
  },
  diagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 3,
  },
  diagDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 4,
  },
  diagName: {
    fontSize: 8,
    color: COLORS.textLight,
  },
  // Investment table — hours breakdown only (no rate column)
  table: {
    marginTop: 10,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: '8 10',
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    padding: '7 10',
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tableRowAlt: {
    backgroundColor: COLORS.bgLight,
  },
  tableCell: {
    fontSize: 9,
    color: COLORS.text,
  },
  tableCellBold: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.dark,
  },
  subtotalRow: {
    flexDirection: 'row',
    padding: '6 10',
    backgroundColor: COLORS.primaryLight,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  tableFooter: {
    flexDirection: 'row',
    padding: '10 10',
    backgroundColor: COLORS.dark,
  },
  tableFooterCell: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: 'white',
  },
  // Two-column layout for hours breakdown
  colSection: { width: '60%' },
  colHours: { width: '20%', textAlign: 'right' },
  colPercent: { width: '20%', textAlign: 'right' },
  // Tier summary box
  tierBox: {
    marginTop: 12,
    padding: 14,
    backgroundColor: COLORS.greenBg,
    borderRadius: 4,
    border: `1px solid ${COLORS.green}`,
  },
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tierLabel: {
    fontSize: 9,
    color: COLORS.text,
  },
  tierValue: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.dark,
  },
  tierTotal: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.green,
  },
  // Timeline
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
  },
  timelineLabel: {
    width: 120,
    fontSize: 8,
    color: COLORS.text,
    textAlign: 'right',
    paddingRight: 8,
  },
  timelineDates: {
    fontSize: 8,
    color: COLORS.textLight,
  },
  timelineBar: {
    height: 10,
    borderRadius: 2,
    minWidth: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: `1px solid ${COLORS.border}`,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
  footerBrand: {
    fontSize: 8,
    color: COLORS.primary,
    fontFamily: 'Helvetica-Bold',
  },
  footerPageNumber: {
    fontSize: 8,
    color: COLORS.textMuted,
  },
});

const BAR_COLORS = ['#6C5CE7', '#00B894', '#FDCB6E', '#E17055', '#0984E3', '#A29BFE'];

export default function SowPdfDocument({
  sow,
  sections = [],
  diagnosticResult,
  customerName = '',
  versionNumber,
}) {
  const content = sow.content || {};
  const diagnosticProcesses = diagnosticResult?.processes || [];
  const isDraft = sow.status === 'draft';

  // Calculate total hours
  const totalHours = sow.total_hours
    ? parseFloat(sow.total_hours)
    : sections.reduce((sum, s) => sum + (parseFloat(s.hours) || 0), 0);

  // Determine tier from SOW content or auto-recommend
  const tierConfig = content.tier_config || {};
  const selectedTier = tierConfig.customTier
    || (tierConfig.selectedTierId ? TIERS.find(t => t.id === tierConfig.selectedTierId) : null)
    || TIERS.find(t => totalHours / t.hours <= 6)
    || TIERS[TIERS.length - 1];

  const monthlyPrice = selectedTier.price;
  const estimatedDuration = selectedTier.hours > 0 ? Math.ceil(totalHours / selectedTier.hours) : 0;
  const totalEngagementValue = monthlyPrice * estimatedDuration;

  // Dates
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const formattedValidUntil = validUntil.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const watermarkText = isDraft ? 'DRAFT' : versionNumber ? `v${versionNumber}` : null;

  // TOC
  const tocEntries = [];
  if (content.executive_summary) tocEntries.push('Executive Summary');
  if (sections.length > 0) tocEntries.push('Scope of Work');
  if (sections.some(s => s.start_date && s.end_date)) tocEntries.push('Timeline');
  if (sections.length > 0) tocEntries.push('Investment Summary');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* WATERMARK */}
        {watermarkText && <Text style={styles.watermark} fixed>{watermarkText}</Text>}

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{sow.title}</Text>
          <Text style={styles.headerSubtitle}>
            {customerName ? `Prepared for ${customerName}` : 'Statement of Work'}
          </Text>
          <View style={styles.headerMeta}>
            <Text style={styles.metaItem}>Date: <Text style={styles.metaValue}>{formattedDate}</Text></Text>
            <Text style={styles.metaItem}>Type: <Text style={styles.metaValue}>{sow.sow_type}</Text></Text>
            {versionNumber && <Text style={styles.metaItem}>Version: <Text style={styles.metaValue}>v{versionNumber}</Text></Text>}
            {totalHours > 0 && <Text style={styles.metaItem}>Total Hours: <Text style={styles.metaValue}>{totalHours}</Text></Text>}
            <Text style={styles.metaItem}>Tier: <Text style={styles.metaValue}>{selectedTier.label}</Text></Text>
            <Text style={styles.metaItem}>Monthly: <Text style={styles.metaValue}>${monthlyPrice.toLocaleString()}/mo</Text></Text>
          </View>
          <View style={styles.validityBar}>
            <Text style={styles.validityText}>
              Generated: {formattedDate} | Valid for 30 days (until {formattedValidUntil})
              {isDraft ? ' | STATUS: DRAFT' : ''}
            </Text>
          </View>
        </View>

        {/* TOC */}
        {tocEntries.length > 0 && (
          <View style={styles.tocContainer} wrap={false}>
            <Text style={styles.tocTitle}>Table of Contents</Text>
            {tocEntries.map((entry, idx) => (
              <View key={idx} style={styles.tocItem}>
                <Text style={styles.tocItemText}>{idx + 1}. {entry}</Text>
              </View>
            ))}
            {sections.map((section, idx) => (
              <View key={`sub-${idx}`} style={[styles.tocItem, { paddingLeft: 16 }]}>
                <Text style={[styles.tocItemText, { color: COLORS.textLight, fontSize: 8 }]}>
                  {idx + 1}. {section.title}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* EXECUTIVE SUMMARY */}
        {content.executive_summary && (
          <View style={styles.execSummaryContainer} minPresenceAhead={100}>
            <Text style={styles.sectionHeading}>Executive Summary</Text>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Overview</Text>
              <Text style={styles.summaryText}>{content.executive_summary}</Text>
            </View>
          </View>
        )}

        {/* SCOPE OF WORK */}
        {sections.length > 0 && (
          <View>
            <Text style={styles.sectionHeading}>Scope of Work</Text>
            {sections.map((section, idx) => {
              const h = parseFloat(section.hours) || 0;
              const deliverables = section.deliverables || [];
              const linkedItems = section.diagnostic_items || [];

              return (
                <View key={section.id || idx} style={styles.scopeCard} wrap={false} minPresenceAhead={80}>
                  <View style={styles.scopeHeader}>
                    <Text style={styles.scopeTitle}>{idx + 1}. {section.title}</Text>
                    {h > 0 && (
                      <Text style={[styles.tableCell, { color: COLORS.primary, fontFamily: 'Helvetica-Bold' }]}>
                        {h}h
                      </Text>
                    )}
                  </View>
                  <View style={styles.scopeBody}>
                    {section.description && <Text style={styles.scopeDescription}>{section.description}</Text>}
                    <View style={styles.scopeMeta}>
                      {h > 0 && <Text style={styles.scopeMetaItem}>Estimated Hours: {h}</Text>}
                      {section.start_date && <Text style={styles.scopeMetaItem}>Start: {new Date(section.start_date).toLocaleDateString()}</Text>}
                      {section.end_date && <Text style={styles.scopeMetaItem}>End: {new Date(section.end_date).toLocaleDateString()}</Text>}
                    </View>
                    {deliverables.length > 0 && (
                      <View style={{ marginTop: 8 }}>
                        <Text style={styles.deliverablesHeading}>Deliverables</Text>
                        {deliverables.map((d, dIdx) => (
                          <View key={dIdx} style={styles.deliverableItem}>
                            <Text style={styles.deliverableBullet}>•</Text>
                            <Text style={styles.deliverableText}>{d}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    {linkedItems.length > 0 && diagnosticProcesses.length > 0 && (
                      <View style={{ marginTop: 8 }}>
                        <Text style={styles.deliverablesHeading}>Addresses Diagnostic Findings</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                          {linkedItems.map((name, nIdx) => {
                            const proc = diagnosticProcesses.find(p => p.name === name);
                            const statusColor = proc ? STATUS_COLORS[proc.status] || '#9ca3af' : '#9ca3af';
                            return (
                              <View key={nIdx} style={styles.diagItem}>
                                <View style={[styles.diagDot, { backgroundColor: statusColor }]} />
                                <Text style={styles.diagName}>{name}</Text>
                              </View>
                            );
                          })}
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* TIMELINE */}
        {sections.some(s => s.start_date && s.end_date) && (
          <View wrap={false} style={{ marginTop: 10 }} minPresenceAhead={60}>
            <Text style={styles.sectionHeading}>Timeline</Text>
            {sections
              .filter(s => s.start_date && s.end_date)
              .map((section, idx) => {
                const startStr = new Date(section.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const endStr = new Date(section.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const color = BAR_COLORS[idx % BAR_COLORS.length];
                return (
                  <View key={section.id || idx} style={styles.timelineRow}>
                    <Text style={styles.timelineLabel}>{section.title}</Text>
                    <View style={[styles.timelineBar, { backgroundColor: color, width: 100 }]} />
                    <Text style={[styles.timelineDates, { marginLeft: 6 }]}>{startStr} — {endStr}</Text>
                  </View>
                );
              })}
          </View>
        )}

        {/* INVESTMENT SUMMARY — Retainer Model */}
        {sections.length > 0 && (
          <View wrap={false} style={{ marginTop: 10 }} minPresenceAhead={80}>
            <Text style={styles.sectionHeading}>Investment Summary</Text>

            {/* Hours Breakdown Table */}
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.colSection]}>Section</Text>
                <Text style={[styles.tableHeaderCell, styles.colHours]}>Hours</Text>
                <Text style={[styles.tableHeaderCell, styles.colPercent]}>% of Total</Text>
              </View>
              {sections.map((section, idx) => {
                const h = parseFloat(section.hours) || 0;
                const pct = totalHours > 0 ? Math.round((h / totalHours) * 100) : 0;
                const isAlt = idx % 2 === 1;
                return (
                  <View key={section.id || idx} style={[styles.tableRow, isAlt ? styles.tableRowAlt : {}]}>
                    <Text style={[styles.tableCellBold, styles.colSection]}>{section.title}</Text>
                    <Text style={[styles.tableCell, styles.colHours]}>{h > 0 ? String(h) : '—'}</Text>
                    <Text style={[styles.tableCell, styles.colPercent]}>{h > 0 ? `${pct}%` : '—'}</Text>
                  </View>
                );
              })}
              <View style={styles.tableFooter}>
                <Text style={[styles.tableFooterCell, styles.colSection]}>Total Hours</Text>
                <Text style={[styles.tableFooterCell, styles.colHours]}>{totalHours}</Text>
                <Text style={[styles.tableFooterCell, styles.colPercent]}>100%</Text>
              </View>
            </View>

            {/* Tier & Investment Summary */}
            <View style={styles.tierBox}>
              <View style={styles.tierRow}>
                <Text style={styles.tierLabel}>Selected Tier</Text>
                <Text style={styles.tierValue}>{selectedTier.label} ({selectedTier.hours}h/month)</Text>
              </View>
              <View style={styles.tierRow}>
                <Text style={styles.tierLabel}>Monthly Investment</Text>
                <Text style={styles.tierValue}>${monthlyPrice.toLocaleString()}/month</Text>
              </View>
              <View style={styles.tierRow}>
                <Text style={styles.tierLabel}>Estimated Engagement Duration</Text>
                <Text style={styles.tierValue}>{estimatedDuration} month{estimatedDuration !== 1 ? 's' : ''}</Text>
              </View>
              <View style={[styles.tierRow, { marginTop: 6, paddingTop: 6, borderTop: `1px solid ${COLORS.green}` }]}>
                <Text style={styles.tierTotal}>Total Engagement Value</Text>
                <Text style={styles.tierTotal}>${totalEngagementValue.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        )}

        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{customerName ? `${customerName} — ` : ''}{sow.title}</Text>
          <Text style={styles.footerPageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
          <Text style={styles.footerBrand}>LeanScale</Text>
        </View>
      </Page>
    </Document>
  );
}
