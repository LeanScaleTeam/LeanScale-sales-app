/**
 * Section C: Processes (12-18 questions, conditional on profile)
 */

import { useState } from 'react';

const ALL_QUESTIONS = [
  { key: 'C1', label: 'How do inbound leads reach your CRM?', options: ['CRM forms (HubSpot/SF)', 'Website → API', 'Manual entry', 'Mix'] },
  { key: 'C2', label: 'What is your typical response time to new inbound leads?', options: ['<5 minutes', '<1 hour', 'Same day', '>24 hours', "Don't know"] },
  { key: 'C3', label: 'Do you have a documented MQL definition?', options: ['Yes, with lead scoring', 'Yes, criteria-based', 'Informal', 'No'] },
  { key: 'C4', label: 'Do you use a sales qualification methodology?', options: ['MEDDIC/MEDDPICC', 'BANT', 'SPICED', 'Custom framework', 'Multiple', 'None'] },
  { key: 'C5', label: 'Are deal stage transitions enforced with required fields?', options: ['Yes, all stages', 'Some stages', 'No required fields'] },
  { key: 'C6', label: 'Do you track closed-lost reasons?', options: ['Required field', 'Optional field', 'Not tracked'] },
  { key: 'C7', label: 'Is there a formal sales-to-CS handoff process?', options: ['Documented + automated', 'Documented', 'Informal', 'None'] },
  { key: 'C8', label: 'How are renewals tracked?', options: ['Automated in CRM/CSP', 'Manual tracking', 'Not systematically tracked'] },
  { key: 'C9', label: 'Do you collect NPS or CSAT?', options: ['Yes, automated program', 'Yes, ad hoc', 'No'] },
  { key: 'C10', label: 'Is there a deduplication process?', options: ['Automated tool', 'Periodic manual cleanup', 'No process'] },
  { key: 'C11', label: 'Do you run email nurture campaigns?', options: ['Yes, in CRM/MAP', 'Yes, other tool', 'No'] },
  { key: 'C12', label: 'Do you run events (webinars, conferences, dinners)?', options: ['Yes, regularly', 'Occasionally', 'No'] },
  // Partner questions (skipped if A5 = No)
  { key: 'M7_tracking', label: 'How are partner deals tracked?', options: ['Separate pipeline', 'Tags/fields', 'Not tracked'], tags: ['partner'] },
  // Attribution questions
  { key: 'M4_pipeline', label: 'Do you track marketing-sourced vs sales-sourced pipeline?', options: ['Yes, in CRM', 'Yes, externally', 'No'] },
  { key: 'M4_model', label: 'What attribution model do you use?', options: ['Multi-touch', 'First-touch', 'Last-touch', 'None'] },
  // Win/Loss
  { key: 'R4_winloss', label: 'Do you conduct win/loss analysis?', options: ['Formal process', 'Ad hoc', 'No'] },
  // Planning & cadence (v3 Phase 4)
  { key: 'C13', label: 'Do you have a documented operating/GTM plan?', options: ['Yes quarterly', 'Yes annual', 'Informal', 'No'] },
  { key: 'C14', label: 'Is there a headcount/capacity model?', options: ['Yes with revenue tie', 'Basic', 'No'] },
  { key: 'C15', label: 'How often are business reviews held?', options: ['D/W/M/Q', 'W/M/Q', 'Monthly', 'Quarterly', 'None'] },
  // Dashboards & coaching (v3 Phase 4)
  { key: 'C16', label: 'Do managers have dedicated dashboards?', options: ['Yes per team', 'Shared', 'No'] },
  { key: 'C17', label: 'Do ICs use CRM daily?', options: ['Yes with personal views', 'Yes basic', 'No'] },
  { key: 'C18', label: 'Is there a documented coaching program?', options: ['Yes with CI', 'Yes informal', 'No'] },
];

export default function SectionC({ answers, skipRules, preFill = {}, onComplete, onBack }) {
  const [local, setLocal] = useState(() => {
    const init = {};
    for (const q of ALL_QUESTIONS) {
      init[q.key] = answers[q.key] || preFill[q.key]?.value || '';
    }
    return init;
  });
  const [overridden, setOverridden] = useState(new Set());

  const handleSelect = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    setOverridden((prev) => new Set(prev).add(key));
  };

  // Filter questions based on skip rules
  const questions = ALL_QUESTIONS.filter((q) => {
    if (skipRules.skipPartnerQuestions && q.tags?.includes('partner')) return false;
    return true;
  });

  const answeredCount = questions.filter((q) => local[q.key]).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Processes</h2>
      <p style={styles.sectionDesc}>
        Tell us about your current GTM processes. ({answeredCount}/{questions.length} answered)
      </p>

      {questions.map((q) => {
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
                Auto-detected: {pf.evidence}
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
  question: { marginBottom: '1.5rem' },
  label: { display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: '0.5rem', color: 'var(--text-primary)' },
  optionGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  optionBtn: { padding: '0.5rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', background: 'white', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'all 0.15s' },
  optionSelected: { background: 'var(--ls-purple)', color: 'white', borderColor: 'var(--ls-purple)' },
  navRow: { display: 'flex', gap: '0.75rem', marginTop: '2rem' },
  backBtn: { flex: '0 0 auto', padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)', cursor: 'pointer' },
  continueBtn: { flex: 1, padding: '0.75rem', background: 'var(--ls-purple)', color: 'white', border: 'none', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' },
  autoDetectedHint: { marginTop: '0.25rem', fontSize: '11px', color: '#1E40AF', background: '#EFF6FF', display: 'inline-block', padding: '0.125rem 0.5rem', borderRadius: '9999px' },
};
