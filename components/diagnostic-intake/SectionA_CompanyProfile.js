/**
 * Section A: Company Profile (5 questions, always shown)
 *
 * A1 is a multi-select of CRM/MAP systems. Stored as a string[] of canonical
 * keys: ['salesforce', 'hubspot_crm', 'hubspot_map', 'attio', 'other'].
 */

import { useState, useEffect } from 'react';
import SlackFormBanner from './SlackFormBanner';
import {
  SYSTEM_LIST,
  SYSTEM_LABELS,
  SYSTEM_KEYS,
  normalizeCrmSystems,
} from '../../lib/diagnostic-engine/crm-systems';

const A1_OPTIONS = [
  { value: SYSTEM_KEYS.SALESFORCE, label: SYSTEM_LABELS[SYSTEM_KEYS.SALESFORCE] },
  { value: SYSTEM_KEYS.HUBSPOT_CRM, label: SYSTEM_LABELS[SYSTEM_KEYS.HUBSPOT_CRM] },
  { value: SYSTEM_KEYS.HUBSPOT_MAP, label: SYSTEM_LABELS[SYSTEM_KEYS.HUBSPOT_MAP] },
  { value: SYSTEM_KEYS.ATTIO, label: SYSTEM_LABELS[SYSTEM_KEYS.ATTIO] },
  { value: SYSTEM_KEYS.OTHER, label: SYSTEM_LABELS[SYSTEM_KEYS.OTHER] },
];

const SIMPLE_QUESTIONS = [
  {
    key: 'A2',
    label: 'How many total sales reps?',
    options: ['1-5', '6-15', '16-50', '50+'],
    hideWhenHasSalesforce: true,
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

export default function SectionA({ answers, onComplete, onSlackFormParsed }) {
  const [a1, setA1] = useState(() => normalizeCrmSystems(answers.A1));
  const [local, setLocal] = useState(() => {
    const init = {};
    for (const q of SIMPLE_QUESTIONS) init[q.key] = answers[q.key] || '';
    return init;
  });

  // Sync local state if external answers prop changes (e.g., from intake load)
  useEffect(() => {
    const incoming = normalizeCrmSystems(answers.A1);
    if (incoming.length > 0 && a1.length === 0) setA1(incoming);
  }, [answers.A1]);

  const toggleA1 = (key) => {
    setA1((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const hasSalesforce = a1.includes(SYSTEM_KEYS.SALESFORCE);

  const visibleQuestions = SIMPLE_QUESTIONS.filter((q) => {
    if (q.hideWhenHasSalesforce && hasSalesforce) return false;
    return true;
  });

  const a1Answered = a1.length > 0;
  const simpleAnswered = visibleQuestions.every((q) => local[q.key]);
  const allAnswered = a1Answered && simpleAnswered;

  const handleSelect = (key, value) => {
    setLocal((prev) => ({ ...prev, [key]: value }));
  };

  const handleContinue = () => {
    onComplete({ A1: a1, ...local });
  };

  const handleSlackFormParsed = (result) => {
    // Slack-form-import → map legacy A1 string to new array shape
    if (result.answers?.A1 && typeof result.answers.A1 === 'string') {
      result.answers.A1 = normalizeCrmSystems(result.answers.A1);
    }
    if (Array.isArray(result.answers?.A1) && result.answers.A1.length > 0) {
      setA1(result.answers.A1);
    }
    for (const q of SIMPLE_QUESTIONS) {
      if (result.answers[q.key]) {
        setLocal((prev) => ({ ...prev, [q.key]: result.answers[q.key] }));
      }
    }
    if (onSlackFormParsed) onSlackFormParsed(result);
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Company Profile</h2>
      <p style={styles.sectionDesc}>Tell us about your organization so we can tailor the diagnostic.</p>

      <SlackFormBanner onParsed={handleSlackFormParsed} />

      {/* A1 — multi-select */}
      <div style={styles.question}>
        <label style={styles.label}>
          What CRM and marketing-automation systems do you use?
        </label>
        <p style={styles.helper}>
          Select all that apply. We&apos;ll ask you to connect each one in the next steps.
        </p>
        <div style={styles.optionGrid}>
          {A1_OPTIONS.map((opt) => {
            const selected = a1.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleA1(opt.value)}
                style={{
                  ...styles.optionBtn,
                  ...(selected ? styles.optionSelected : {}),
                }}
              >
                <span style={styles.checkmark}>{selected ? '✓ ' : ''}</span>
                {opt.label}
              </button>
            );
          })}
        </div>
        {a1.length === 0 && (
          <p style={styles.warning}>Select at least one system to continue.</p>
        )}
      </div>

      {/* Remaining single-select questions */}
      {visibleQuestions.map((q) => (
        <div key={q.key} style={styles.question}>
          <label style={styles.label}>{q.label}</label>
          <div style={styles.optionGrid}>
            {q.options.map((opt) => {
              const value = typeof opt === 'object' ? opt.value : opt;
              const label = typeof opt === 'object' ? opt.label : opt;
              return (
                <button
                  key={value}
                  onClick={() => handleSelect(q.key, value)}
                  style={{
                    ...styles.optionBtn,
                    ...(local[q.key] === value ? styles.optionSelected : {}),
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <button
        onClick={handleContinue}
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
  label: { display: 'block', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)', marginBottom: '0.25rem', color: 'var(--text-primary)' },
  helper: { fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginBottom: '0.5rem' },
  warning: { fontSize: 'var(--text-xs)', color: '#9A3412', marginTop: '0.5rem' },
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
  checkmark: { fontWeight: 'bold' },
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
