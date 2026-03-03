/**
 * DataCoverage — Shows data source coverage percentages
 *
 * Progress bars for API, Transcript, and Consultant coverage
 * with tier-aware breakdown and CTAs to fill gaps.
 */

export default function DataCoverage({ dataCoverage, onUploadTranscript, onStartConsultant }) {
  if (!dataCoverage) return null;

  const {
    coveragePercent, apiPercent, transcriptPercent, consultantPercent,
    totalCells, scoredCells,
    tiers,
    consultantNeeded,
  } = dataCoverage;

  const hasTiers = Boolean(tiers);

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>Data Coverage</h4>

      {/* Overall */}
      <div style={styles.barContainer}>
        <div style={styles.barLabel}>
          <span>Overall</span>
          <span style={styles.barValue}>{coveragePercent}% ({scoredCells}/{totalCells} cells)</span>
        </div>
        <div style={styles.barTrack}>
          <div
            style={{
              ...styles.barFill,
              width: `${coveragePercent}%`,
              background: coveragePercent >= 70 ? '#48BB78' : coveragePercent >= 40 ? '#ECC94B' : '#E53E3E',
            }}
          />
        </div>
      </div>

      {/* By source */}
      <div style={styles.sources}>
        <SourceBar label="CRM API" percent={apiPercent} color="#3182CE" />
        <SourceBar label="Transcript" percent={transcriptPercent} color="#805AD5" />
        <SourceBar label="Consultant" percent={consultantPercent} color="#38A169" />
      </div>

      {/* Tier breakdown */}
      {hasTiers && (
        <div style={styles.tierBreakdown}>
          <h5 style={styles.subTitle}>Consultant Workload</h5>
          <div style={styles.tierRow}>
            <span style={styles.tierLabel}>Required</span>
            <div style={styles.tierTrack}>
              <div style={{
                ...styles.tierFill,
                width: `${tiers.required.percent}%`,
                backgroundColor: tiers.required.percent === 100 ? '#48BB78' : '#E53E3E',
              }} />
            </div>
            <span style={styles.tierValue}>
              {tiers.required.scored}/{tiers.required.total}
            </span>
          </div>
          <div style={styles.tierRow}>
            <span style={styles.tierLabel}>Review</span>
            <div style={styles.tierTrack}>
              <div style={{
                ...styles.tierFill,
                width: `${tiers.review.percent}%`,
                backgroundColor: tiers.review.percent === 100 ? '#48BB78' : '#ECC94B',
              }} />
            </div>
            <span style={styles.tierValue}>
              {tiers.review.scored}/{tiers.review.total}
            </span>
          </div>
          <div style={styles.tierRow}>
            <span style={styles.tierLabel}>Auto</span>
            <div style={styles.tierTrack}>
              <div style={{
                ...styles.tierFill,
                width: `${tiers.auto.percent}%`,
                backgroundColor: '#3182CE',
              }} />
            </div>
            <span style={styles.tierValue}>
              {tiers.auto.scored}/{tiers.auto.total}
            </span>
          </div>
        </div>
      )}

      {/* CTAs */}
      <div style={styles.ctas}>
        {transcriptPercent < 30 && onUploadTranscript && (
          <button style={styles.ctaBtn} onClick={onUploadTranscript}>
            Upload a Transcript
          </button>
        )}

        {/* Tier 1 completion-based CTA */}
        {hasTiers && tiers.required.percent < 100 && onStartConsultant && (
          <button style={{ ...styles.ctaBtn, ...styles.ctaBtnSecondary }} onClick={onStartConsultant}>
            Complete Required Assessment ({tiers.required.total - tiers.required.scored} remaining)
          </button>
        )}

        {/* Tier 2 review CTA — only when Tier 1 is mostly done */}
        {hasTiers && tiers.review.scored < tiers.review.total && tiers.required.percent >= 80 && onStartConsultant && (
          <button style={{ ...styles.ctaBtn, ...styles.ctaBtnTertiary }} onClick={onStartConsultant}>
            Review {tiers.review.total - tiers.review.scored} API Scores (optional)
          </button>
        )}

        {/* Fallback for old results without tiers */}
        {!hasTiers && consultantPercent < 20 && onStartConsultant && (
          <button style={{ ...styles.ctaBtn, ...styles.ctaBtnSecondary }} onClick={onStartConsultant}>
            Complete Consultant Assessment
          </button>
        )}
      </div>
    </div>
  );
}

function SourceBar({ label, percent, color }) {
  return (
    <div style={styles.sourceRow}>
      <span style={styles.sourceLabel}>{label}</span>
      <div style={styles.sourceTrack}>
        <div style={{ ...styles.sourceFill, width: `${percent}%`, backgroundColor: color }} />
      </div>
      <span style={styles.sourcePercent}>{percent}%</span>
    </div>
  );
}

const styles = {
  container: {
    padding: '1.25rem',
    border: '1px solid var(--border-color, #E2E8F0)',
    borderRadius: 'var(--radius-lg, 12px)',
    background: 'white',
  },
  title: {
    margin: '0 0 1rem',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  barContainer: {
    marginBottom: '1rem',
  },
  barLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: '#4A5568',
    marginBottom: '0.35rem',
  },
  barValue: {
    fontWeight: 600,
  },
  barTrack: {
    height: '8px',
    borderRadius: '4px',
    background: '#EDF2F7',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  sources: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  sourceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  sourceLabel: {
    fontSize: '0.75rem',
    color: '#718096',
    minWidth: '5.5rem',
  },
  sourceTrack: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    background: '#EDF2F7',
    overflow: 'hidden',
  },
  sourceFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  sourcePercent: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#4A5568',
    minWidth: '2.5rem',
    textAlign: 'right',
  },
  tierBreakdown: {
    marginBottom: '1rem',
    padding: '0.75rem',
    background: '#F7FAFC',
    borderRadius: 'var(--radius-md, 8px)',
  },
  subTitle: {
    margin: '0 0 0.5rem',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#4A5568',
  },
  tierRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.35rem',
  },
  tierLabel: {
    fontSize: '0.7rem',
    color: '#718096',
    minWidth: '4rem',
  },
  tierTrack: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    background: '#EDF2F7',
    overflow: 'hidden',
  },
  tierFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  tierValue: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#4A5568',
    minWidth: '3rem',
    textAlign: 'right',
  },
  ctas: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  ctaBtn: {
    padding: '0.5rem 1rem',
    borderRadius: 'var(--radius-md, 8px)',
    border: 'none',
    background: 'var(--ls-purple, #6C5CE7)',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  ctaBtnSecondary: {
    background: 'transparent',
    border: '1px solid var(--ls-purple, #6C5CE7)',
    color: 'var(--ls-purple, #6C5CE7)',
  },
  ctaBtnTertiary: {
    background: 'transparent',
    border: '1px solid #A0AEC0',
    color: '#718096',
    fontSize: '0.75rem',
  },
};
