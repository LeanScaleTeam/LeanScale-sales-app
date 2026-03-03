/**
 * Section C: Team & Organization (5 questions, always shown)
 *
 * New section covering team structure, ramp time, territories,
 * and compensation — areas only humans can answer.
 */

import { useState } from 'react';

const QUESTIONS = [
  {
    key: 'T1',
    label: 'How many people are in your GTM org total?',
    caption: 'Include sales, marketing, CS, and ops roles.',
    options: ['1-10', '11-25', '26-50', '51-100', '100+'],
  },
  {
    key: 'T2',
    label: 'How long does it take a new rep to reach full productivity?',
    options: ['<30 days', '30-60 days', '60-90 days', '90+ days', "Don't know"],
  },
  {
    key: 'T3',
    label: 'How are territories or accounts assigned?',
    options: ['Named accounts', 'Geographic', 'Round-robin', 'No formal process'],
  },
  {
    key: 'T4',
    label: 'Is there a documented comp plan with variable components?',
    options: ['Yes with accelerators', 'Yes basic', 'Informal', 'No'],
  },
  {
    key: 'T5',
    label: 'How is your team structured?',
    options: ['By function (SDR/AE/AM)', 'By segment', 'By geography', 'Flat/generalist'],
  },
];

export default function SectionC_TeamOrg({ answers, preFill = {}, onComplete, onBack }) {
  const [local, setLocal] = useState(() => {
    const init = {};
    for (const q of QUESTIONS) init[q.key] = answers[q.key] || preFill[q.key]?.value || '';
    return init;
  });
  const [overridden, setOverridden] = useState(new Set());

  const allAnswered = QUESTIONS.every((q) => local[q.key]);

  const handleSelect = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
    setOverridden((prev) => new Set(prev).add(key));
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Team & Organization</h2>
      <p style={styles.sectionDesc}>Tell us about your GTM team structure and how it operates.</p>

      {QUESTIONS.map((q) => (
        <div key={q.key} style={styles.question}>
          <label style={styles.label}>{q.label}</label>
          {q.caption && <p style={styles.caption}>{q.caption}</p>}
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
          {(() => {
            const pf = preFill[q.key];
            const showBadge = pf && local[q.key] === pf.value && !overridden.has(q.key);
            return showBadge ? (
              <div style={styles.autoDetectedHint}>
                Auto-detected: {pf.evidence}
              </div>
            ) : null;
          })()}
        </div>
      ))}

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
  caption: { fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '-0.25rem 0 0.5rem' },
  optionGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  optionBtn: { padding: '0.5rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', background: 'white', fontSize: 'var(--text-sm)', cursor: 'pointer', transition: 'all 0.15s' },
  optionSelected: { background: 'var(--ls-purple)', color: 'white', borderColor: 'var(--ls-purple)' },
  navRow: { display: 'flex', gap: '0.75rem', marginTop: '2rem' },
  backBtn: { padding: '0.6rem 1.5rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', background: 'white', fontSize: 'var(--text-sm)', cursor: 'pointer' },
  continueBtn: { padding: '0.6rem 1.5rem', border: 'none', borderRadius: 'var(--radius-md, 8px)', background: 'var(--ls-purple)', color: 'white', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' },
  autoDetectedHint: { marginTop: '0.25rem', fontSize: '11px', color: '#1E40AF', background: '#EFF6FF', display: 'inline-block', padding: '0.125rem 0.5rem', borderRadius: '9999px' },
};
