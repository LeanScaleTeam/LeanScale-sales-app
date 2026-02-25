/**
 * IntakeForm — Orchestrator component for the diagnostic intake form.
 *
 * Manages section navigation, skip logic, save progress, and final submit.
 * Saves per-section to Supabase so clients can resume after OAuth redirect.
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomer } from '../../context/CustomerContext';
import { getSkipRules } from '../../lib/diagnostic-engine/skip-logic';
import SectionA from './SectionA_CompanyProfile';
import SectionB from './SectionB_Tools';
import SectionC from './SectionC_Processes';
import SectionD from './SectionD_Reporting';
import IntakeProgress from './IntakeProgress';
import IntakeReview from './IntakeReview';

const SECTIONS = ['A', 'B', 'C', 'D', 'review'];
const SECTION_TITLES = {
  A: 'Company Profile',
  B: 'GTM Tools',
  C: 'Processes',
  D: 'Reporting & Metrics',
  review: 'Review & Submit',
};

export default function IntakeForm() {
  const router = useRouter();
  const { customer, isDemo, customerPath } = useCustomer();
  const [currentSection, setCurrentSection] = useState('A');
  const [answers, setAnswers] = useState({});
  const [sectionsCompleted, setSectionsCompleted] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hubspotStatus, setHubspotStatus] = useState(null);
  const [hubspotError, setHubspotError] = useState(null);
  const [loadingIntake, setLoadingIntake] = useState(true);

  const skipRules = getSkipRules(answers);

  // Load existing intake answers on mount
  useEffect(() => {
    if (isDemo || !customer?.id) {
      setLoadingIntake(false);
      return;
    }

    async function loadExisting() {
      try {
        // Load saved intake answers
        const intakeRes = await fetch(`/api/diagnostic/intake?customerId=${customer.id}`);
        if (intakeRes.ok) {
          const intakeData = await intakeRes.json();
          if (intakeData.answers && Object.keys(intakeData.answers).length > 0) {
            setAnswers(intakeData.answers);
            setSectionsCompleted(intakeData.sectionsCompleted || []);
            // If returning from OAuth, jump to review section
            if (router.query.hubspot) {
              setCurrentSection('review');
            }
          }
        }

        // Load HubSpot status
        const hsRes = await fetch(`/api/hubspot/status/${customer.id}`);
        if (hsRes.ok) {
          const hsData = await hsRes.json();
          setHubspotStatus(hsData);
        }
      } catch (err) {
        console.error('Error loading intake:', err);
      } finally {
        setLoadingIntake(false);
      }
    }

    loadExisting();
  }, [customer?.id, isDemo]);

  // Check for HubSpot callback params
  useEffect(() => {
    const { hubspot, portalName, reason } = router.query;
    if (hubspot === 'connected') {
      setHubspotStatus((prev) => ({
        ...prev,
        connected: true,
        portalName: portalName || prev?.portalName,
        signalsReady: true,
      }));
      setHubspotError(null);
    } else if (hubspot === 'error') {
      setHubspotError(reason || 'HubSpot connection failed. You can continue without it or try again.');
    }
  }, [router.query]);

  // Save section answers to API
  const saveSection = useCallback(
    async (section, sectionAnswers) => {
      if (isDemo || !customer?.id) return;
      setSaving(true);
      setSaved(false);
      try {
        const res = await fetch('/api/diagnostic/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customerId: customer.id,
            section,
            answers: sectionAnswers,
          }),
        });
        if (!res.ok) throw new Error('Failed to save');
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        console.error('Error saving section:', err);
        setError('Failed to save your answers. Your progress may not be saved.');
        setTimeout(() => setError(null), 5000);
      } finally {
        setSaving(false);
      }
    },
    [customer?.id, isDemo]
  );

  // Handle section completion
  const handleSectionComplete = useCallback(
    (section, sectionAnswers) => {
      const merged = { ...answers, ...sectionAnswers };
      setAnswers(merged);
      setSectionsCompleted((prev) =>
        prev.includes(section) ? prev : [...prev, section]
      );
      saveSection(section, sectionAnswers);

      // Navigate to next section
      const idx = SECTIONS.indexOf(section);
      if (idx < SECTIONS.length - 1) {
        setCurrentSection(SECTIONS[idx + 1]);
      }
    },
    [answers, saveSection]
  );

  // Handle final submit
  const handleSubmit = useCallback(async () => {
    if (isDemo || !customer?.id) return;
    setSubmitting(true);
    setError(null);

    try {
      // Mark intake as submitted
      const saveRes = await fetch('/api/diagnostic/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          answers,
          submitted: true,
        }),
      });
      if (!saveRes.ok) throw new Error('Failed to save intake answers');

      // Run the diagnostic engine
      const runRes = await fetch('/api/diagnostic/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customer.id }),
      });

      if (!runRes.ok) {
        const errData = await runRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Diagnostic engine failed');
      }

      // Navigate to results
      router.push(customerPath('/try-leanscale/diagnostic?view=layers'));
    } catch (err) {
      console.error('Error submitting diagnostic:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [customer?.id, isDemo, answers, customerPath, router]);

  const handleBack = () => {
    const idx = SECTIONS.indexOf(currentSection);
    if (idx > 0) setCurrentSection(SECTIONS[idx - 1]);
  };

  if (loadingIntake) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ fontSize: 'var(--text-lg)', color: 'var(--text-secondary)' }}>
          Loading intake form...
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <a
          href={customerPath('/try-leanscale/diagnostic')}
          style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textDecoration: 'none' }}
        >
          &larr; Back to Diagnostic
        </a>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', marginBottom: '0.5rem', marginTop: '0.5rem' }}>
          GTM Diagnostic
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          Answer a few questions about your go-to-market operations. Takes 5-8 minutes.
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div style={errorBannerStyle}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={errorDismissStyle}>&times;</button>
        </div>
      )}

      {/* HubSpot error banner */}
      {hubspotError && (
        <div style={hubspotErrorBannerStyle}>
          <span>{hubspotError}</span>
          <button onClick={() => setHubspotError(null)} style={errorDismissStyle}>&times;</button>
        </div>
      )}

      {/* Progress */}
      <IntakeProgress
        sections={SECTIONS.filter((s) => s !== 'review')}
        sectionTitles={SECTION_TITLES}
        currentSection={currentSection}
        sectionsCompleted={sectionsCompleted}
      />

      {/* Section content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {currentSection === 'A' && (
            <SectionA
              answers={answers}
              onComplete={(a) => handleSectionComplete('A', a)}
            />
          )}

          {currentSection === 'B' && (
            <SectionB
              answers={answers}
              skipRules={skipRules}
              onComplete={(a) => handleSectionComplete('B', a)}
              onBack={handleBack}
            />
          )}

          {currentSection === 'C' && (
            <SectionC
              answers={answers}
              skipRules={skipRules}
              onComplete={(a) => handleSectionComplete('C', a)}
              onBack={handleBack}
            />
          )}

          {currentSection === 'D' && (
            <SectionD
              answers={answers}
              skipRules={skipRules}
              onComplete={(a) => handleSectionComplete('D', a)}
              onBack={handleBack}
            />
          )}

          {currentSection === 'review' && (
            <IntakeReview
              answers={answers}
              sectionTitles={SECTION_TITLES}
              hubspotStatus={hubspotStatus}
              showHubSpotConnect={skipRules.showHubSpotConnect}
              customerId={customer?.id}
              slug={customer?.slug}
              onSaveAllAnswers={() => saveSection('review', answers)}
              onSubmit={handleSubmit}
              onBack={handleBack}
              onEditSection={setCurrentSection}
              submitting={submitting}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Save indicator */}
      <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', minHeight: '1.25rem' }}>
        {saving && 'Saving...'}
        {saved && !saving && (
          <span style={{ color: 'var(--status-healthy)' }}>&#10003; Saved</span>
        )}
      </div>
    </div>
  );
}

const errorBannerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  background: '#fef2f2',
  border: '1px solid #fca5a5',
  borderRadius: 'var(--radius-md, 8px)',
  marginBottom: '1rem',
  fontSize: 'var(--text-sm)',
  color: '#991b1b',
};

const hubspotErrorBannerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  background: '#FFF7ED',
  border: '1px solid #FDBA74',
  borderRadius: 'var(--radius-md, 8px)',
  marginBottom: '1rem',
  fontSize: 'var(--text-sm)',
  color: '#9A3412',
};

const errorDismissStyle = {
  background: 'none',
  border: 'none',
  fontSize: 'var(--text-lg)',
  cursor: 'pointer',
  color: 'inherit',
  opacity: 0.6,
  padding: '0 0.25rem',
  lineHeight: 1,
};
