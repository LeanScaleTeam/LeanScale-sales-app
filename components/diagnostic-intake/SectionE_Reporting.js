/**
 * Section E: Reporting & Data (13-15 questions, CRM-adaptive)
 *
 * Renamed from SectionD. D1 (dashboard count) and D5 (report distribution)
 * are hidden for Salesforce customers since they're auto-detected from
 * CRM metadata. HubSpot/Other customers see the full set.
 */

import { useState } from 'react';

const REPORTING_QUESTIONS = [
  { key: 'D1', label: 'How many custom dashboards exist in your CRM?', options: ['10+', '5-10', '1-4', 'None'], hideWhenAutoDetected: true },
  { key: 'D2', label: 'Are dashboards trusted for decision-making?', options: ['Yes, primary tool', 'Somewhat', 'Not really', 'No dashboards'] },
  { key: 'D3', label: 'How is sales forecasting done?', options: ['AI/tool-assisted', 'CRM forecast tool', 'Spreadsheet', 'Gut feel', 'Not done'] },
  { key: 'D4', label: 'Do you have a growth model / revenue plan?', options: ['Yes, comprehensive', 'Partial', 'No'] },
  { key: 'D5', label: 'How are reports distributed to the team?', options: ['Automated schedule', 'Manual email', 'On-demand', 'Not distributed'], hideWhenAutoDetected: true },
  { key: 'D6', label: 'Are playbooks documented?', options: ['Yes in enablement platform', 'Yes in docs', 'Tribal knowledge', 'No'] },
];

const POWER_10_METRICS = [
  { key: 'D5_arr', label: 'Can you report ARR by segment in your CRM?' },
  { key: 'D5_bookings', label: 'Can you report new + expansion bookings in your CRM?' },
  { key: 'D5_pipeline', label: 'Can you report pipeline created by source and stage?' },
  { key: 'D5_mql', label: 'Can you report MQLs by source and channel?' },
  { key: 'D5_gross_churn', label: 'Can you report revenue churn excluding expansions?' },
  { key: 'D5_grr', label: 'Can you report gross dollar retention %?' },
  { key: 'D5_nrr', label: 'Can you report net dollar retention %?' },
  { key: 'D5_mql_opp', label: 'Can you report MQL-to-opportunity conversion rate?' },
  { key: 'D5_opp_cw', label: 'Can you report opportunity-to-closed-won rate?' },
  { key: 'D5_cycle', label: 'Can you report average sales cycle time?' },
];

const POWER_10_OPTIONS = ['Automated', 'Manual calc', "Can't report"];

export default function SectionE_Reporting({ answers, skipRules, preFill = {}, vascoPower10 = {}, onComplete, onBack }) {
  // Filter reporting questions based on CRM-adaptive visibility
  const visibleReporting = REPORTING_QUESTIONS.filter((q) => {
    if (q.hideWhenAutoDetected && (skipRules.hasSalesforceSignals || skipRules.hasHubSpotSignals)) return false;
    return true;
  });

  const allQuestions = [...visibleReporting, ...POWER_10_METRICS.map((m) => ({ ...m, options: POWER_10_OPTIONS }))];
  const [local, setLocal] = useState(() => {
    const init = {};
    // Initialize from all questions (including hidden ones for data preservation)
    for (const q of [...REPORTING_QUESTIONS, ...POWER_10_METRICS.map((m) => ({ ...m, options: POWER_10_OPTIONS }))]) {
      const vasco = vascoPower10[q.key];
      const vascoDefault = vasco?.available ? 'Automated' : '';
      init[q.key] = answers[q.key] || vascoDefault || preFill[q.key]?.value || '';
    }
    return init;
  });
  const [overridden, setOverridden] = useState(new Set());

  const handleSelect = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    setOverridden((prev) => new Set(prev).add(key));
  };

  const answeredCount = allQuestions.filter((q) => local[q.key]).length;
  const allAnswered = answeredCount === allQuestions.length;

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Reporting & Metrics</h2>
      <p style={styles.sectionDesc}>
        Tell us about your reporting maturity. ({answeredCount}/{allQuestions.length} answered)
      </p>

      {/* General reporting questions */}
      {visibleReporting.map((q) => {
        const pf = preFill[q.key];
        const showBadge = pf && local[q.key] === pf.value && !overridden.has(q.key);
        return (
          <div key={q.key} style={styles.question}>
            <label style={styles.label}>{q.label}</label>
            <div style={styles.optionGrid}>
              {q.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(q.key, opt)}
                  style={{
                    ...styles.optionBtn,
                    ...(local[q.key] === opt ? styles.optionSelected : {}),
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showBadge && (
              <div style={styles.autoDetectedHint}>
                {pf.source === 'slack-form' ? 'From intake form' : `Auto-detected: ${pf.evidence}`}
              </div>
            )}
          </div>
        );
      })}

      {/* Power 10 metrics */}
      <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--font-semibold)', marginBottom: '0.25rem' }}>
          Revenue Metrics (Power 10)
        </h3>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          For each metric, can you currently report it from your CRM?
        </p>
      </div>

      {POWER_10_METRICS.map((m) => {
        const vasco = vascoPower10[m.key];
        const showVascoBadge = vasco?.available && !overridden.has(m.key);
        const showNotSyncedBadge = vasco && !vasco.available && typeof vasco.source === 'string' && vasco.source.includes('not synced');
        return (
          <div key={m.key} style={styles.question}>
            <label style={styles.label}>{m.label}</label>
            <div style={styles.optionGrid}>
              {POWER_10_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(m.key, opt)}
                  style={{
                    ...styles.optionBtn,
                    ...(local[m.key] === opt ? styles.optionSelected : {}),
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {showVascoBadge && (
              <div style={styles.autoDetectedHint}>
                From Vasco: {vasco.formatted} ({vasco.asOf}){vasco.stale ? ' · stale' : ''}
              </div>
            )}
            {showNotSyncedBadge && (
              <div style={{ ...styles.autoDetectedHint, background: '#FEF3C7', color: '#92400E' }}>
                Vasco snapshot doesn&apos;t include this metric yet
              </div>
            )}
          </div>
        );
      })}

      <div style={styles.navRow}>
        <button onClick={onBack} style={styles.backBtn}>Back</button>
        <button
          onClick={() => onComplete(local)}
          disabled={!allAnswered}
          style={{ ...styles.continueBtn, opacity: allAnswered ? 1 : 0.5 }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

const styles = {
  section: { marginTop: '1.5rem' },
  sectionTitle: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: '0.25rem' },
  sectionDesc: { color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' },
  question: { marginBottom: '1.25rem' },
  label: { display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: '0.5rem', color: 'var(--text-primary)' },
  optionGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  optionBtn: { padding: '0.5rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', background: 'white', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'all 0.15s' },
  optionSelected: { background: 'var(--ls-purple)', color: 'white', borderColor: 'var(--ls-purple)' },
  navRow: { display: 'flex', gap: '0.75rem', marginTop: '2rem' },
  backBtn: { flex: '0 0 auto', padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)', cursor: 'pointer' },
  continueBtn: { flex: 1, padding: '0.75rem', background: 'var(--ls-purple)', color: 'white', border: 'none', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' },
  autoDetectedHint: { marginTop: '0.25rem', fontSize: '11px', color: '#1E40AF', background: '#EFF6FF', display: 'inline-block', padding: '0.125rem 0.5rem', borderRadius: '9999px' },
};
