/**
 * IntakeReview — Summary of all answers before submit.
 * Also shows HubSpot connect option (after form is filled, before diagnostic runs).
 */

import { useState } from 'react';
import SalesforceConnect from './SalesforceConnect';

export default function IntakeReview({
  answers, sectionTitles, hubspotStatus,
  showHubSpotConnect, salesforceStatus, showSalesforceConnect,
  customerId, slug, onSaveAllAnswers,
  onSubmit, onBack, onEditSection, submitting,
}) {
  const [savingForOAuth, setSavingForOAuth] = useState(false);
  const answerKeys = Object.keys(answers).filter((k) => answers[k]);

  const sectionA = answerKeys.filter((k) => k.startsWith('A'));
  const sectionB = answerKeys.filter((k) => k.startsWith('B'));
  const sectionC = answerKeys.filter((k) => k.startsWith('C') || k.startsWith('M') || k.startsWith('R4'));
  const sectionD = answerKeys.filter((k) => k.startsWith('D'));

  const isHubSpotConnected = hubspotStatus?.connected;

  // Save all answers first, then redirect to HubSpot OAuth
  const handleConnectHubSpot = async () => {
    setSavingForOAuth(true);
    try {
      await onSaveAllAnswers();
      window.location.href = `/api/hubspot/authorize?customerId=${customerId}&slug=${slug}`;
    } catch {
      setSavingForOAuth(false);
    }
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Review & Submit</h2>
      <p style={styles.sectionDesc}>Review your answers before running the diagnostic.</p>

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

      {/* HubSpot status — shown if already connected (connect step is now mid-form) */}
      {showHubSpotConnect && isHubSpotConnected && (
        <div style={styles.hubspotConnected}>
          <div style={styles.hubspotConnectedIcon}>&#10003;</div>
          <div>
            <div style={styles.hubspotConnectedTitle}>HubSpot Connected</div>
            <div style={styles.hubspotConnectedDetail}>
              Portal: {hubspotStatus.portalName || hubspotStatus.portalId}
              {hubspotStatus.signalsReady && ' — CRM data downloaded'}
            </div>
          </div>
        </div>
      )}

      {/* Salesforce connection — shown after form is complete */}
      {showSalesforceConnect && (
        <SalesforceConnect
          customerId={customerId}
          slug={slug}
          status={salesforceStatus}
          onSaveAllAnswers={onSaveAllAnswers}
        />
      )}

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
  hubspotConnected: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: 'var(--status-healthy-bg)',
    border: '1px solid var(--status-healthy)',
    borderRadius: 'var(--radius-md, 8px)',
    marginBottom: '0.75rem',
  },
  hubspotConnectedIcon: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    background: 'var(--status-healthy)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: 'var(--text-sm)',
    flexShrink: 0,
  },
  hubspotConnectedTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    color: 'var(--status-healthy-text)',
  },
  hubspotConnectedDetail: {
    fontSize: 'var(--text-xs)',
    color: 'var(--status-healthy-text)',
    opacity: 0.8,
  },
  hubspotPrompt: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem',
    background: '#FFF7ED',
    border: '1px solid #FDBA74',
    borderRadius: 'var(--radius-md, 8px)',
    marginBottom: '0.75rem',
  },
  hubspotPromptTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    color: '#9A3412',
  },
  hubspotPromptDesc: {
    fontSize: 'var(--text-xs)',
    color: '#9A3412',
    opacity: 0.8,
    marginTop: '0.25rem',
  },
  hubspotBtn: {
    flexShrink: 0,
    padding: '0.5rem 1.25rem',
    background: '#FF7A59',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)',
    cursor: 'pointer',
  },
  navRow: { display: 'flex', gap: '0.75rem', marginTop: '2rem' },
  backBtn: { flex: '0 0 auto', padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)', cursor: 'pointer' },
  submitBtn: { flex: 1, padding: '0.75rem', background: 'var(--ls-purple)', color: 'white', border: 'none', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' },
};
