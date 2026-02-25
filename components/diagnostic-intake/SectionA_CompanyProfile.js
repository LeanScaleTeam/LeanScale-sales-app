/**
 * Section A: Company Profile (5 questions, always shown)
 */

import { useState } from 'react';

const QUESTIONS = [
  {
    key: 'A1',
    label: 'What is your primary CRM?',
    options: ['HubSpot', 'Salesforce', 'Other'],
  },
  {
    key: 'A2',
    label: 'How many total sales reps?',
    options: ['1-5', '6-15', '16-50', '50+'],
    hideWhenSalesforce: true,
  },
  {
    key: 'A3',
    label: 'What is your approximate ARR range?',
    options: ['<$1M', '$1-5M', '$5-20M', '$20-50M', '$50M+'],
  },
  {
    key: 'A4',
    label: 'What is your primary GTM motion?',
    options: ['Inbound-led', 'Outbound-led', 'Product-led', 'Partner-led', 'Blended'],
  },
  {
    key: 'A5',
    label: 'Do you have a partner/channel program?',
    options: ['Yes, active', 'Building', 'No'],
  },
];

export default function SectionA({ answers, onComplete }) {
  const [local, setLocal] = useState(() => {
    const init = {};
    for (const q of QUESTIONS) init[q.key] = answers[q.key] || '';
    return init;
  });

  const visibleQuestions = QUESTIONS.filter((q) => {
    if (q.hideWhenSalesforce && local.A1 === 'Salesforce') return false;
    return true;
  });

  const allAnswered = visibleQuestions.every((q) => local[q.key]);

  const handleSelect = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Company Profile</h2>
      <p style={styles.sectionDesc}>Tell us about your organization so we can tailor the diagnostic.</p>

      {visibleQuestions.map((q) => (
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
        </div>
      ))}

      <button
        onClick={() => onComplete(local)}
        disabled={!allAnswered}
        style={{
          ...styles.continueBtn,
          opacity: allAnswered ? 1 : 0.5,
          cursor: allAnswered ? 'pointer' : 'not-allowed',
        }}
      >
        Continue
      </button>
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
  optionBtn: {
    padding: '0.5rem 1rem',
    border: '1px solid var(--border-color)',
    borderRadius: 'var(--radius-md, 8px)',
    background: 'white',
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  optionSelected: {
    background: 'var(--ls-purple)',
    color: 'white',
    borderColor: 'var(--ls-purple)',
  },
  continueBtn: {
    display: 'block',
    width: '100%',
    padding: '0.75rem',
    background: 'var(--ls-purple)',
    color: 'white',
    border: 'none',
    borderRadius: 'var(--radius-md, 8px)',
    fontSize: 'var(--text-base)',
    fontWeight: 'var(--font-semibold)',
    marginTop: '2rem',
  },
};
