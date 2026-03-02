/**
 * AnalyzingScreen — Progress UI shown while downloading CRM metadata
 * and running intake inference.
 *
 * Shows 3 animated steps, then calls onComplete with the preFill map.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { key: 'connect', label: 'Connecting to your CRM...' },
  { key: 'download', label: 'Downloading org metadata...' },
  { key: 'analyze', label: 'Analyzing your configuration...' },
];

export default function AnalyzingScreen({ customerId, crmType = 'salesforce', onComplete, onError }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (!customerId) return;

    let cancelled = false;

    async function runAnalysis() {
      // Step 1: Connected (already done via OAuth callback)
      await delay(800);
      if (cancelled) return;
      setCompletedSteps((prev) => [...prev, 'connect']);
      setCurrentStep(1);

      // Step 2: Metadata downloaded (already done in callback)
      await delay(1200);
      if (cancelled) return;
      setCompletedSteps((prev) => [...prev, 'download']);
      setCurrentStep(2);

      // Step 3: Run inference
      try {
        const inferUrl = crmType === 'hubspot' ? '/api/hubspot/infer' : '/api/salesforce/infer';
        const res = await fetch(inferUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId }),
        });

        if (!res.ok) {
          throw new Error('Failed to analyze CRM data');
        }

        const data = await res.json();

        if (cancelled) return;
        setCompletedSteps((prev) => [...prev, 'analyze']);

        // Brief pause to show completion before advancing
        await delay(600);
        if (cancelled) return;
        onComplete(data.preFill || {});
      } catch (err) {
        if (!cancelled && onError) {
          onError(err.message);
        }
      }
    }

    runAnalysis();
    return () => { cancelled = true; };
  }, [customerId]);

  return (
    <div style={styles.container}>
      <div style={styles.iconWrapper}>
        <motion.div
          data-testid="spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={styles.spinner}
        />
      </div>
      <h2 style={styles.title}>Analyzing Your CRM</h2>
      <p style={styles.subtitle}>This takes a few seconds...</p>

      <div style={styles.steps}>
        {STEPS.map((step, i) => {
          const isComplete = completedSteps.includes(step.key);
          const isCurrent = i === currentStep && !isComplete;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.3 }}
              style={styles.stepRow}
            >
              <div style={{
                ...styles.stepIcon,
                background: isComplete ? 'var(--status-healthy)' : isCurrent ? '#0B5CAB' : 'var(--gray-300)',
              }}>
                {isComplete ? (
                  <span style={{ color: 'white', fontSize: '10px' }}>&#10003;</span>
                ) : isCurrent ? (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    style={{ color: 'white', fontSize: '10px' }}
                  >
                    &#8226;
                  </motion.span>
                ) : (
                  <span style={{ color: 'white', fontSize: '10px' }}>&#8226;</span>
                )}
              </div>
              <span style={{
                ...styles.stepLabel,
                color: isComplete ? 'var(--status-healthy-text)' : isCurrent ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: isCurrent ? 'var(--font-semibold)' : 'var(--font-normal)',
              }}>
                {isComplete ? step.label.replace('...', '') + ' \u2713' : step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '3rem 1rem',
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  spinner: {
    width: '3rem',
    height: '3rem',
    border: '3px solid var(--gray-200)',
    borderTopColor: '#0B5CAB',
    borderRadius: '50%',
  },
  title: {
    fontSize: 'var(--text-xl)',
    fontWeight: 'var(--font-bold)',
    marginBottom: '0.25rem',
  },
  subtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-secondary)',
    marginBottom: '2rem',
  },
  steps: {
    display: 'inline-flex',
    flexDirection: 'column',
    gap: '0.75rem',
    textAlign: 'left',
  },
  stepRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  stepIcon: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepLabel: {
    fontSize: 'var(--text-sm)',
  },
};
