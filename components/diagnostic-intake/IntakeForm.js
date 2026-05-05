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
import { DEMO_INTAKE_ANSWERS } from '../../data/demo-v3-intake';
import SectionA from './SectionA_CompanyProfile';
import SectionB from './SectionB_Tools';
import SectionC from './SectionC_TeamOrg';
import SectionD from './SectionD_Processes';
import SectionE from './SectionE_Reporting';
import SectionF from './SectionF_PlanningEnablement';
import IntakeProgress from './IntakeProgress';
import IntakeReview from './IntakeReview';
import SalesforceConnect from './SalesforceConnect';
import HubSpotConnect from './HubSpotConnect';
import AnalyzingScreen from './AnalyzingScreen';
import IntakeContextPanel from './IntakeContextPanel';
import TranscriptUpload from '../diagnostic/v3/TranscriptUpload';

const SECTIONS = ['A', 'transcript', 'sf-connect', 'sf-analyzing', 'hs-connect', 'hs-analyzing', 'B', 'C', 'D', 'E', 'F', 'review'];
const SECTION_TITLES = {
  A: 'Company Profile',
  transcript: 'Discovery Transcript',
  'sf-connect': 'Connect CRM',
  'sf-analyzing': 'Analyzing',
  'hs-connect': 'Connect CRM',
  'hs-analyzing': 'Analyzing',
  B: 'GTM Tools',
  C: 'Team & Organization',
  D: 'Process Maturity',
  E: 'Reporting & Metrics',
  F: 'Planning & Enablement',
  review: 'Review & Submit',
};

export default function IntakeForm() {
  const router = useRouter();
  const { customer, isDemo, customerPath } = useCustomer();
  const [currentSection, setCurrentSection] = useState('A');
  const [answers, setAnswers] = useState(() => (isDemo ? { ...DEMO_INTAKE_ANSWERS } : {}));
  const [sectionsCompleted, setSectionsCompleted] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hubspotStatus, setHubspotStatus] = useState(null);
  const [hubspotError, setHubspotError] = useState(null);
  const [salesforceStatus, setSalesforceStatus] = useState(null);
  const [salesforceError, setSalesforceError] = useState(null);
  const [preFill, setPreFill] = useState({});
  const [contextNotes, setContextNotes] = useState(null);
  const [loadingIntake, setLoadingIntake] = useState(true);
  const [transcriptUploaded, setTranscriptUploaded] = useState(false);
  const [vascoPower10, setVascoPower10] = useState({});

  const crmMetadataExists = !!(salesforceStatus?.connected || hubspotStatus?.connected);
  const skipRules = getSkipRules(answers, crmMetadataExists);

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
            // If returning from OAuth, jump to appropriate section
            if (router.query.hubspot) {
              setCurrentSection('hs-analyzing');
            } else if (router.query.salesforce) {
              setCurrentSection('sf-analyzing');
            }
          }
        }

        // Load HubSpot status
        const hsRes = await fetch(`/api/hubspot/status/${customer.id}`);
        if (hsRes.ok) {
          const hsData = await hsRes.json();
          setHubspotStatus(hsData);
        }

        // Load Salesforce status
        const sfRes = await fetch(`/api/salesforce/status/${customer.id}`);
        if (sfRes.ok) {
          const sfData = await sfRes.json();
          setSalesforceStatus(sfData);
        }

        // Load Vasco Power 10 auto-fill (non-fatal — Section E falls back to manual entry)
        try {
          const vRes = await fetch(`/api/diagnostic/vasco-power10?customerId=${customer.id}`);
          if (vRes.ok) {
            const vData = await vRes.json();
            setVascoPower10(vData.vascoPower10 || {});
          }
        } catch (e) {
          // Non-fatal — Section E falls back to manual entry
        }
      } catch (err) {
        console.error('Error loading intake:', err);
      } finally {
        setLoadingIntake(false);
      }
    }

    loadExisting();
  }, [customer?.id, isDemo]);

  // Check for HubSpot / Salesforce callback params
  useEffect(() => {
    const { hubspot, portalName, reason, salesforce, orgName } = router.query;
    if (hubspot === 'connected') {
      setHubspotStatus((prev) => ({
        ...prev,
        connected: true,
        portalName: portalName || prev?.portalName,
        signalsReady: true,
      }));
      setHubspotError(null);
      setCurrentSection('hs-analyzing');
    } else if (hubspot === 'error') {
      setHubspotError(reason || 'HubSpot connection failed. You can continue without it or try again.');
    }

    if (salesforce === 'connected') {
      setSalesforceStatus((prev) => ({ ...prev, connected: true, signalsReady: true }));
      setSalesforceError(null);
      setCurrentSection('sf-analyzing');
    } else if (salesforce === 'error') {
      setSalesforceError(reason || 'Salesforce connection failed. Please try again.');
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
      if (section === 'A') {
        setCurrentSection('transcript');
      } else {
        const idx = SECTIONS.indexOf(currentSection);
        if (idx < SECTIONS.length - 1) {
          let nextIdx = idx + 1;
          // Skip utility sections when navigating forward
          while (nextIdx < SECTIONS.length - 1 && ['transcript', 'sf-connect', 'sf-analyzing', 'hs-connect', 'hs-analyzing'].includes(SECTIONS[nextIdx])) {
            nextIdx++;
          }
          setCurrentSection(SECTIONS[nextIdx]);
        }
      }
    },
    [answers, saveSection, currentSection]
  );

  // Handle final submit
  const handleSubmit = useCallback(async () => {
    if (isDemo || !customer?.id) return;
    setSubmitting(true);
    setError(null);

    try {
      // Check if CRM is connected
      const crmType = answers.A1;
      const crmConnected =
        (crmType === 'HubSpot' && hubspotStatus?.connected) ||
        (crmType === 'Salesforce' && salesforceStatus?.connected) ||
        (crmType === 'Both' && salesforceStatus?.connected && hubspotStatus?.connected);

      // Save intake with appropriate status
      const status = crmConnected ? 'complete' : 'awaiting_crm_data';

      const saveRes = await fetch('/api/diagnostic/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          answers,
          submitted: true,
          status,
        }),
      });
      if (!saveRes.ok) throw new Error('Failed to save intake answers');

      if (!crmConnected) {
        // Stay on review page — show waiting state
        setError(null);
        setSubmitting(false);
        return;
      }

      // Run the diagnostic engine (version determined by admin config)
      const diagVersion = customer.diagnosticVersion || 2;
      const runUrl = diagVersion === 3
        ? '/api/diagnostic/v3/run'
        : '/api/diagnostic/run';
      const runRes = await fetch(runUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customer.id }),
      });

      if (!runRes.ok) {
        const errData = await runRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Diagnostic engine failed');
      }

      // Navigate to results (v3 defaults to scorecard, v2 to layers)
      const defaultView = diagVersion === 3 ? 'scorecard' : 'layers';
      router.push(customerPath(`/diagnostic/gtm?view=${defaultView}`));
    } catch (err) {
      console.error('Error submitting diagnostic:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [customer?.id, isDemo, answers, customerPath, router, hubspotStatus, salesforceStatus]);

  // After transcript step, navigate to CRM connection or Section B
  const handleTranscriptNext = () => {
    if (answers.A1 === 'Both') {
      // Dual mode: connect SF first, then HS
      if (salesforceStatus?.connected && hubspotStatus?.connected) {
        setCurrentSection('B'); // both already connected
      } else if (salesforceStatus?.connected) {
        setCurrentSection('hs-connect'); // SF done, need HS
      } else {
        setCurrentSection('sf-connect'); // start with SF
      }
    } else if (answers.A1 === 'Salesforce') {
      setCurrentSection('sf-connect');
    } else if (answers.A1 === 'HubSpot') {
      if (hubspotStatus?.connected) {
        setCurrentSection('hs-analyzing');
      } else {
        setCurrentSection('hs-connect');
      }
    } else {
      setCurrentSection('B');
    }
  };

  const handleBack = () => {
    // From CRM connect steps, go back to transcript
    if (currentSection === 'sf-connect' || currentSection === 'hs-connect') {
      setCurrentSection('transcript');
      return;
    }
    // From B, go back to transcript (skip CRM utility steps)
    if (currentSection === 'B') {
      setCurrentSection('transcript');
      return;
    }
    const idx = SECTIONS.indexOf(currentSection);
    if (idx > 0) {
      let prevIdx = idx - 1;
      // Skip utility sections when going back
      while (prevIdx > 0 && ['transcript', 'sf-connect', 'sf-analyzing', 'hs-connect', 'hs-analyzing'].includes(SECTIONS[prevIdx])) {
        prevIdx--;
      }
      setCurrentSection(SECTIONS[prevIdx]);
    }
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
          href={customerPath('/diagnostic/gtm')}
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

      {/* Salesforce error banner */}
      {salesforceError && (
        <div style={salesforceErrorBannerStyle}>
          <span>{salesforceError}</span>
          <button onClick={() => setSalesforceError(null)} style={errorDismissStyle}>&times;</button>
        </div>
      )}

      {/* Progress */}
      <IntakeProgress
        sections={SECTIONS.filter((s) => !['review', 'sf-connect', 'sf-analyzing', 'hs-connect', 'hs-analyzing'].includes(s))}
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
              onSlackFormParsed={(result) => {
                // Merge parsed answers into current answers
                setAnswers((prev) => ({ ...prev, ...result.answers }));
                // Merge preFill (Slack form is lower priority than CRM inference)
                setPreFill((prev) => {
                  const merged = { ...prev };
                  for (const [key, val] of Object.entries(result.preFill)) {
                    if (!merged[key]) merged[key] = val;
                  }
                  return merged;
                });
                // Store context notes
                if (result.contextNotes && Object.keys(result.contextNotes).length > 0) {
                  setContextNotes(result.contextNotes);
                }
              }}
            />
          )}

          {currentSection === 'transcript' && (
            <div style={{ marginTop: '1.5rem' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: '0.25rem' }}>
                Discovery Call Transcript
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
                Upload a discovery call transcript to pre-fill the diagnostic form. This is optional &mdash; you can skip if you don&apos;t have one.
              </p>
              <TranscriptUpload
                customerId={customer?.id}
                onUploadComplete={() => setTranscriptUploaded(true)}
                onIntakeExtracted={(extractedPreFill) => {
                  // Transcript pre-fills are base layer (CRM overwrites later)
                  setPreFill((prev) => {
                    const merged = { ...prev };
                    for (const [key, val] of Object.entries(extractedPreFill)) {
                      if (!merged[key]) merged[key] = val;
                    }
                    return merged;
                  });
                  // Also set direct answers for Section A fields that were extracted
                  const directAnswerKeys = ['A1', 'A2', 'A3', 'A4', 'A5'];
                  setAnswers((prev) => {
                    const updated = { ...prev };
                    for (const key of directAnswerKeys) {
                      if (extractedPreFill[key] && !updated[key]) {
                        updated[key] = extractedPreFill[key].value;
                      }
                    }
                    return updated;
                  });
                }}
              />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  onClick={() => setCurrentSection('A')}
                  style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  onClick={handleTranscriptNext}
                  style={{ padding: '0.75rem 1.5rem', background: 'var(--ls-purple, #7c3aed)', color: 'white', border: 'none', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)', fontWeight: 600, cursor: 'pointer' }}
                >
                  {transcriptUploaded ? 'Continue' : 'Skip \u2014 No Transcript'}
                </button>
              </div>
            </div>
          )}

          {currentSection === 'sf-connect' && (
            <div style={{ marginTop: '1.5rem' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: '0.25rem' }}>
                Connect Salesforce
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
                Connect to the customer&apos;s Salesforce org so we can pre-fill the diagnostic form.
              </p>
              <SalesforceConnect
                customerId={customer?.id}
                slug={customer?.slug}
                status={salesforceStatus}
                onSaveAllAnswers={() => saveSection('A', answers)}
                onUploadSuccess={() => {
                  setSalesforceStatus((prev) => ({ ...prev, connected: true, signalsReady: true, source: 'upload' }));
                  setCurrentSection('sf-analyzing');
                }}
              />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                <button
                  onClick={() => setCurrentSection('transcript')}
                  style={{ flex: '0 0 auto', padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {currentSection === 'sf-analyzing' && (
            <AnalyzingScreen
              customerId={customer?.id}
              crmType="salesforce"
              onComplete={(inferredPreFill) => {
                // Merge CRM inference on top of any existing Slack form pre-fills
                // CRM inference takes precedence for overlapping fields
                setPreFill((prev) => ({ ...prev, ...inferredPreFill }));
                if (inferredPreFill.A2) {
                  setAnswers((prev) => ({ ...prev, A2: inferredPreFill.A2.value }));
                }
                // Dual mode: after SF, go to HS connect
                if (answers.A1 === 'Both') {
                  if (hubspotStatus?.connected) {
                    setCurrentSection('hs-analyzing');
                  } else {
                    setCurrentSection('hs-connect');
                  }
                } else {
                  setCurrentSection('B');
                }
              }}
              onError={(errMsg) => {
                setSalesforceError(errMsg);
                if (answers.A1 === 'Both') {
                  setCurrentSection('hs-connect');
                } else {
                  setCurrentSection('B');
                }
              }}
            />
          )}

          {currentSection === 'hs-connect' && (
            <div style={{ marginTop: '1.5rem' }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: '0.25rem' }}>
                Connect HubSpot
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
                Connect to the customer&apos;s HubSpot portal so we can pre-fill the diagnostic form.
                This typically takes about 15 seconds after you authorize.
              </p>
              <HubSpotConnect
                customerId={customer?.id}
                slug={customer?.slug}
                status={hubspotStatus}
                onSaveAllAnswers={() => saveSection('A', answers)}
              />
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
                <button
                  onClick={() => setCurrentSection('transcript')}
                  style={{ flex: '0 0 auto', padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  onClick={() => setCurrentSection('B')}
                  style={{ flex: '0 0 auto', padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  Skip — Connect Later
                </button>
              </div>
            </div>
          )}

          {currentSection === 'hs-analyzing' && (
            <AnalyzingScreen
              customerId={customer?.id}
              crmType="hubspot"
              onComplete={(inferredPreFill) => {
                setPreFill((prev) => ({ ...prev, ...inferredPreFill }));
                if (inferredPreFill.A2) {
                  setAnswers((prev) => ({ ...prev, A2: inferredPreFill.A2.value }));
                }
                setCurrentSection('B');
              }}
              onError={(errMsg) => {
                setHubspotError(errMsg);
                setCurrentSection('B');
              }}
            />
          )}

          {currentSection === 'B' && (
            <>
              <IntakeContextPanel contextNotes={contextNotes} />
              <SectionB
                answers={answers}
                skipRules={skipRules}
                onComplete={(a) => handleSectionComplete('B', a)}
                onBack={handleBack}
                preFill={preFill}
              />
            </>
          )}

          {currentSection === 'C' && (
            <>
              <IntakeContextPanel contextNotes={contextNotes} />
              <SectionC
                answers={answers}
                preFill={preFill}
                onComplete={(a) => handleSectionComplete('C', a)}
                onBack={handleBack}
              />
            </>
          )}

          {currentSection === 'D' && (
            <>
              <IntakeContextPanel contextNotes={contextNotes} />
              <SectionD
                answers={answers}
                skipRules={skipRules}
                onComplete={(a) => handleSectionComplete('D', a)}
                onBack={handleBack}
                preFill={preFill}
              />
            </>
          )}

          {currentSection === 'E' && (
            <>
              <IntakeContextPanel contextNotes={contextNotes} />
              <SectionE
                answers={answers}
                skipRules={skipRules}
                onComplete={(a) => handleSectionComplete('E', a)}
                onBack={handleBack}
                preFill={preFill}
                vascoPower10={vascoPower10}
              />
            </>
          )}

          {currentSection === 'F' && (
            <>
              <IntakeContextPanel contextNotes={contextNotes} />
              <SectionF
                answers={answers}
                preFill={preFill}
                onComplete={(a) => handleSectionComplete('F', a)}
                onBack={handleBack}
              />
            </>
          )}

          {currentSection === 'review' && (
            <IntakeReview
              answers={answers}
              sectionTitles={SECTION_TITLES}
              hubspotStatus={hubspotStatus}
              showHubSpotConnect={skipRules.showHubSpotConnect}
              salesforceStatus={salesforceStatus}
              showSalesforceConnect={skipRules.showSalesforceConnect}
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

const salesforceErrorBannerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  background: '#EFF6FF',
  border: '1px solid #93C5FD',
  borderRadius: 'var(--radius-md, 8px)',
  marginBottom: '1rem',
  fontSize: 'var(--text-sm)',
  color: '#1E40AF',
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
