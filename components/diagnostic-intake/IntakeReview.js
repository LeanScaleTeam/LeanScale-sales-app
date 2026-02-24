/**
 * IntakeReview — Summary of all answers before submit
 */

export default function IntakeReview({ answers, sectionTitles, hubspotStatus, onSubmit, onBack, onEditSection, submitting }) {
  const answerKeys = Object.keys(answers).filter((k) => answers[k]);

  const sectionA = answerKeys.filter((k) => k.startsWith('A'));
  const sectionB = answerKeys.filter((k) => k.startsWith('B'));
  const sectionC = answerKeys.filter((k) => k.startsWith('C') || k.startsWith('M') || k.startsWith('R4'));
  const sectionD = answerKeys.filter((k) => k.startsWith('D'));

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Review & Submit</h2>
      <p style={styles.sectionDesc}>Review your answers before running the diagnostic.</p>

      {/* HubSpot status */}
      <div style={styles.reviewCard}>
        <div style={styles.cardHeader}>
          <span>HubSpot Connection</span>
          {hubspotStatus?.connected ? (
            <span style={styles.badgeGreen}>Connected</span>
          ) : (
            <span style={styles.badgeGray}>Not Connected</span>
          )}
        </div>
        {hubspotStatus?.connected && (
          <div style={styles.cardDetail}>Portal: {hubspotStatus.portalName}</div>
        )}
      </div>

      {/* Section summaries */}
      {[
        { key: 'A', keys: sectionA },
        { key: 'B', keys: sectionB },
        { key: 'C', keys: sectionC },
        { key: 'D', keys: sectionD },
      ].map(({ key, keys }) => (
        <div key={key} style={styles.reviewCard}>
          <div style={styles.cardHeader}>
            <span>{sectionTitles[key]}</span>
            <button onClick={() => onEditSection(key)} style={styles.editBtn}>Edit</button>
          </div>
          <div style={styles.answerList}>
            {keys.length === 0 ? (
              <div style={styles.noAnswers}>No answers yet</div>
            ) : (
              keys.slice(0, 5).map((k) => (
                <div key={k} style={styles.answerRow}>
                  <span style={styles.answerKey}>{k}</span>
                  <span style={styles.answerVal}>
                    {typeof answers[k] === 'object' ? JSON.stringify(answers[k]).slice(0, 50) : answers[k]}
                  </span>
                </div>
              ))
            )}
            {keys.length > 5 && (
              <div style={styles.moreAnswers}>+{keys.length - 5} more answers</div>
            )}
          </div>
        </div>
      ))}

      {/* Submit */}
      <div style={styles.navRow}>
        <button onClick={onBack} style={styles.backBtn}>Back</button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          style={{
            ...styles.submitBtn,
            opacity: submitting ? 0.6 : 1,
          }}
        >
          {submitting ? 'Running Diagnostic...' : 'Run Diagnostic'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  section: { marginTop: '1.5rem' },
  sectionTitle: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: '0.25rem' },
  sectionDesc: { color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' },
  reviewCard: {
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md, 8px)',
    padding: '1rem',
    marginBottom: '0.75rem',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    marginBottom: '0.5rem',
  },
  cardDetail: { fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' },
  badgeGreen: { fontSize: 'var(--text-xs)', padding: '0.15rem 0.5rem', background: 'var(--status-healthy-bg)', color: 'var(--status-healthy-text)', borderRadius: '9999px' },
  badgeGray: { fontSize: 'var(--text-xs)', padding: '0.15rem 0.5rem', background: 'var(--gray-100)', color: 'var(--gray-600)', borderRadius: '9999px' },
  editBtn: { fontSize: 'var(--text-xs)', color: 'var(--ls-purple)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' },
  answerList: { fontSize: 'var(--text-xs)' },
  answerRow: { display: 'flex', gap: '0.5rem', padding: '0.15rem 0' },
  answerKey: { color: 'var(--text-muted)', minWidth: '3rem' },
  answerVal: { color: 'var(--text-primary)' },
  noAnswers: { color: 'var(--text-muted)', fontStyle: 'italic' },
  moreAnswers: { color: 'var(--text-muted)', marginTop: '0.25rem' },
  navRow: { display: 'flex', gap: '0.75rem', marginTop: '2rem' },
  backBtn: { flex: '0 0 auto', padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)', cursor: 'pointer' },
  submitBtn: { flex: 1, padding: '0.75rem', background: 'var(--ls-purple)', color: 'white', border: 'none', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' },
};
