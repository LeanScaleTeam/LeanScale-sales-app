# Salesforce CRM-First Intake Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Reverse the Salesforce intake flow so consultants connect CRM first, then review a pre-filled form with auto-detected answers and fill only the gaps.

**Architecture:** New `intake-inferrer-sf.js` module reads stored Salesforce metadata and maps it to intake question answers with confidence levels. A new `/api/salesforce/infer` endpoint wraps it. IntakeForm gains two new intermediate steps (`sf-connect`, `sf-analyzing`) between Section A and Section B when A1=Salesforce. Each section component accepts an optional `preFill` prop that pre-selects answers and shows "Auto-detected" badges.

**Tech Stack:** Next.js API routes, Supabase, existing Salesforce metadata, React (framer-motion for transitions).

**Design doc:** `docs/plans/2026-02-25-salesforce-crm-first-intake-design.md`

---

### Task 1: Inference Engine

**Files:**
- Create: `lib/diagnostic-engine/intake-inferrer-sf.js`

**Context:** This module reads the same `salesforce_metadata` already stored in Supabase and produces a `preFill` map. It runs server-side. The metadata shape is defined in `lib/salesforce-downloader.js` — `objects` is a dict of Object describes (Lead, Contact, Account, Opportunity, Case, Campaign), `users` is an array of active User records, `flows` is an array of active Flow records, `connectedApps` is an array, etc. See `lib/diagnostic-engine/signal-extractor-sf.js` for how the metadata is typically consumed.

**Step 1: Create the inference engine**

```js
/**
 * Salesforce Intake Inferrer
 *
 * Takes raw Salesforce metadata (same shape as salesforce_metadata table)
 * and produces a pre-fill map for intake form questions.
 *
 * Each entry: { value: string|string[], confidence: 'high'|'medium', evidence: string }
 */

// Tool name patterns for B1 detection (ConnectedApp names + field prefixes)
const TOOL_PATTERNS = {
  sales_engagement: [/outreach/i, /salesloft/i, /apollo/i, /groove/i, /xactly/i],
  conversation_intel: [/gong/i, /chorus/i, /clari/i, /wingman/i, /refract/i],
  data_enrichment: [/zoominfo/i, /clearbit/i, /apollo/i, /clay/i, /cognism/i, /lusha/i, /6sense/i, /demandbase/i, /advizor/i],
  csp: [/gainsight/i, /churnzero/i, /vitally/i, /totango/i, /planhat/i],
  lead_routing: [/leandata/i, /chili\s*piper/i, /distribution\s*engine/i, /round\s*robin/i],
  esign: [/docusign/i, /pandadoc/i, /conga/i, /adobe\s*sign/i],
  bi_analytics: [/tableau/i, /looker/i, /power\s*bi/i, /domo/i, /sisense/i],
  support: [/zendesk/i, /intercom/i, /freshdesk/i, /servicecloud/i, /service\s*cloud/i],
};

// Qualification methodology field patterns
const QUAL_PATTERNS = {
  'MEDDIC/MEDDPICC': [/meddic/i, /meddpicc/i, /decision.criteria/i, /metrics.*identified/i, /champion/i, /economic.buyer/i],
  'BANT': [/bant/i, /budget.*authority/i],
  'SPICED': [/spiced/i, /situation.*pain/i],
  'Custom framework': [/qualification.*score/i, /sales.*stage.*criteria/i],
};

/**
 * Infer intake answers from Salesforce metadata.
 * @param {object} metadata - Row from salesforce_metadata table
 * @returns {object} Pre-fill map keyed by question ID
 */
export function inferIntakeAnswers(metadata) {
  const preFill = {};
  if (!metadata) return preFill;

  const {
    objects, stages, users, flows, workflowRules, validationRules,
    connectedApps, namedCredentials, recordTypes, reports, dashboards,
    profiles, permissionSets, roles,
  } = metadata;

  // ── A2: Sales rep count ──
  const userList = Array.isArray(users) ? users : [];
  const salesProfiles = ['sales', 'business development', 'account executive', 'sdr', 'bdr', 'ae ', 'account manager'];
  const salesUsers = userList.filter((u) => {
    const profileName = (u.Profile?.Name || '').toLowerCase();
    return salesProfiles.some((p) => profileName.includes(p)) || profileName.includes('standard user');
  });
  const repCount = salesUsers.length || userList.length;
  let a2Value;
  if (repCount <= 5) a2Value = '1-5';
  else if (repCount <= 15) a2Value = '6-15';
  else if (repCount <= 50) a2Value = '16-50';
  else a2Value = '50+';
  preFill.A2 = { value: a2Value, confidence: 'high', evidence: `${repCount} active sales users` };

  // ── B1: GTM tools ──
  const appNames = [
    ...(Array.isArray(connectedApps) ? connectedApps : []).map((a) => a.Name || a.MasterLabel || ''),
    ...(Array.isArray(namedCredentials) ? namedCredentials : []).map((n) => n.MasterLabel || n.DeveloperName || ''),
  ];
  // Also check field names on Lead/Contact for enrichment tool prefixes
  const allFieldNames = [];
  if (objects && typeof objects === 'object') {
    for (const obj of Object.values(objects)) {
      if (obj?.fields) {
        for (const f of obj.fields) {
          allFieldNames.push(f.name || '');
        }
      }
    }
  }
  const searchText = [...appNames, ...allFieldNames].join(' ');

  const detectedTools = [];
  const toolEvidence = [];
  for (const [toolKey, patterns] of Object.entries(TOOL_PATTERNS)) {
    for (const pattern of patterns) {
      const match = searchText.match(pattern);
      if (match) {
        if (!detectedTools.includes(toolKey)) {
          detectedTools.push(toolKey);
          toolEvidence.push(`${toolKey}: ${match[0]}`);
        }
        break;
      }
    }
  }
  if (detectedTools.length > 0) {
    preFill.B1_tools = { value: detectedTools, confidence: 'medium', evidence: toolEvidence.join(', ') };
  }

  // ── C1: How do inbound leads reach CRM ──
  const flowList = Array.isArray(flows) ? flows : [];
  const leadFlows = flowList.filter((f) => {
    const label = (f.Label || f.FullName || '').toLowerCase();
    return label.includes('lead') && (label.includes('create') || label.includes('capture') || label.includes('web'));
  });
  // Check for Web-to-Lead fields on Lead
  const leadObj = objects?.Lead;
  const hasWebToLead = leadObj?.fields?.some((f) =>
    (f.name || '').toLowerCase().includes('web') || f.name === 'LeadSource'
  );
  if (leadFlows.length > 0 || hasWebToLead) {
    const evidence = leadFlows.length > 0
      ? `${leadFlows.length} lead capture flow(s): ${leadFlows.map((f) => f.Label || f.FullName).slice(0, 3).join(', ')}`
      : 'Web-to-Lead configured';
    preFill.C1 = { value: 'CRM forms (HubSpot/SF)', confidence: 'medium', evidence };
  }

  // ── C3: MQL definition ──
  const leadFields = leadObj?.fields || [];
  const scoringFields = leadFields.filter((f) => /score|mql|qualified|rating/i.test(f.name || ''));
  if (scoringFields.length > 0) {
    const hasScoring = scoringFields.some((f) => /score/i.test(f.name));
    preFill.C3 = {
      value: hasScoring ? 'Yes, with lead scoring' : 'Yes, criteria-based',
      confidence: 'medium',
      evidence: `Fields: ${scoringFields.map((f) => f.name).slice(0, 4).join(', ')}`,
    };
  }

  // ── C4: Qualification methodology ──
  const oppObj = objects?.Opportunity;
  const oppFields = oppObj?.fields || [];
  const oppFieldNames = oppFields.map((f) => f.name || '').join(' ');
  for (const [methodology, patterns] of Object.entries(QUAL_PATTERNS)) {
    if (patterns.some((p) => p.test(oppFieldNames))) {
      const matchedFields = oppFields.filter((f) =>
        patterns.some((p) => p.test(f.name || ''))
      );
      preFill.C4 = {
        value: methodology,
        confidence: 'medium',
        evidence: `Fields: ${matchedFields.map((f) => f.name).slice(0, 3).join(', ')}`,
      };
      break;
    }
  }

  // ── C5: Required fields on deal stages ──
  const valRuleList = Array.isArray(validationRules) ? validationRules : [];
  const oppValidations = valRuleList.filter((r) => {
    const entity = r.EntityDefinition?.QualifiedApiName || r.EntityDefinitionId || '';
    return /opportunity/i.test(entity);
  });
  if (oppValidations.length >= 4) {
    preFill.C5 = { value: 'Yes, all stages', confidence: 'high', evidence: `${oppValidations.length} validation rules on Opportunity` };
  } else if (oppValidations.length > 0) {
    preFill.C5 = { value: 'Some stages', confidence: 'high', evidence: `${oppValidations.length} validation rules on Opportunity` };
  } else {
    preFill.C5 = { value: 'No required fields', confidence: 'high', evidence: 'No validation rules on Opportunity' };
  }

  // ── C6: Closed-lost reasons ──
  const lossReasonField = oppFields.find((f) =>
    /closed.*lost.*reason|loss.*reason|close.*reason/i.test(f.name || f.label || '')
  );
  if (lossReasonField) {
    const isRequired = lossReasonField.nillable === false || lossReasonField.required === true;
    preFill.C6 = {
      value: isRequired ? 'Required field' : 'Optional field',
      confidence: 'high',
      evidence: `Field: ${lossReasonField.name}${isRequired ? ' (required)' : ''}`,
    };
  } else {
    preFill.C6 = { value: 'Not tracked', confidence: 'high', evidence: 'No loss reason field on Opportunity' };
  }

  // ── C8: Renewal tracking ──
  const rtList = Array.isArray(recordTypes) ? recordTypes : [];
  const renewalRT = rtList.find((rt) =>
    /renewal/i.test(rt.SobjectType || '') || /renewal/i.test(rt.Name || rt.DeveloperName || '')
  );
  if (renewalRT) {
    preFill.C8 = { value: 'Automated in CRM/CSP', confidence: 'medium', evidence: `RecordType: ${renewalRT.Name || renewalRT.DeveloperName || 'Renewal'}` };
  }

  // ── C10: Dedup process ──
  // Note: duplicate_rule_count comes from computed_signals, but we check metadata directly
  // DuplicateRules aren't in our current metadata download, so check for dedup-related flows
  const dedupFlows = flowList.filter((f) =>
    /dedup|duplicate|merge|matching/i.test(f.Label || f.FullName || '')
  );
  if (dedupFlows.length > 0) {
    preFill.C10 = { value: 'Automated tool', confidence: 'medium', evidence: `${dedupFlows.length} dedup flow(s)` };
  }

  // ── C11: Email nurture ──
  const hasPardot = appNames.some((n) => /pardot|marketing\s*cloud|mcae|exact\s*target/i.test(n));
  if (hasPardot) {
    preFill.C11 = { value: 'Yes, in CRM/MAP', confidence: 'medium', evidence: 'Marketing automation connected' };
  }

  // ── D1: Dashboard count ──
  const dashList = Array.isArray(dashboards) ? dashboards : [];
  const dashCount = dashList.length;
  let d1Value;
  if (dashCount >= 10) d1Value = '10+';
  else if (dashCount >= 5) d1Value = '5-10';
  else if (dashCount >= 1) d1Value = '1-4';
  else d1Value = 'None';
  preFill.D1 = { value: d1Value, confidence: 'high', evidence: `${dashCount} dashboards found` };

  return preFill;
}
```

**Step 2: Commit**

```bash
git add lib/diagnostic-engine/intake-inferrer-sf.js
git commit -m "feat: add Salesforce intake inference engine"
```

---

### Task 2: Infer API Endpoint

**Files:**
- Create: `pages/api/salesforce/infer.js`

**Context:** This endpoint loads metadata from `salesforce_metadata` table and runs the inference engine. Pattern follows existing endpoints in `pages/api/salesforce/`.

**Step 1: Create the endpoint**

```js
/**
 * Salesforce Intake Inference
 * POST /api/salesforce/infer
 *
 * Reads stored Salesforce metadata and returns pre-fill answers for the intake form.
 */

import { supabaseAdmin } from '../../../lib/supabase';
import { inferIntakeAnswers } from '../../../lib/diagnostic-engine/intake-inferrer-sf';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    const { data: metadata, error } = await supabaseAdmin
      .from('salesforce_metadata')
      .select('*')
      .eq('customer_id', customerId)
      .order('fetched_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !metadata) {
      return res.status(404).json({ error: 'No Salesforce metadata found for this customer' });
    }

    // Remap snake_case DB columns to camelCase for the inferrer
    const metadataForInfer = {
      objects: metadata.objects,
      stages: metadata.stages,
      users: metadata.users,
      flows: metadata.flows,
      workflowRules: metadata.workflow_rules,
      validationRules: metadata.validation_rules,
      apexTriggers: metadata.apex_triggers,
      apexClasses: metadata.apex_classes,
      profiles: metadata.profiles,
      permissionSets: metadata.permission_sets,
      roles: metadata.roles,
      reports: metadata.reports,
      dashboards: metadata.dashboards,
      connectedApps: metadata.connected_apps,
      namedCredentials: metadata.named_credentials,
      recordTypes: metadata.record_types,
    };

    const preFill = inferIntakeAnswers(metadataForInfer);

    return res.status(200).json({ success: true, preFill });
  } catch (err) {
    console.error('Salesforce infer error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Step 2: Commit**

```bash
git add pages/api/salesforce/infer.js
git commit -m "feat: add /api/salesforce/infer endpoint"
```

---

### Task 3: Analyzing Screen Component

**Files:**
- Create: `components/diagnostic-intake/AnalyzingScreen.js`

**Context:** This component shows a 3-step progress animation during metadata download and inference. It auto-advances when done. Uses framer-motion for animations (already a project dependency). The component is shown when Salesforce OAuth callback returns or after upload.

**Step 1: Create the component**

```js
/**
 * AnalyzingScreen — Progress UI shown while downloading Salesforce metadata
 * and running intake inference.
 *
 * Shows 3 animated steps, then calls onComplete with the preFill map.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  { key: 'connect', label: 'Connecting to Salesforce...' },
  { key: 'download', label: 'Downloading org metadata...' },
  { key: 'analyze', label: 'Analyzing your configuration...' },
];

export default function AnalyzingScreen({ customerId, onComplete, onError }) {
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
        const res = await fetch('/api/salesforce/infer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customerId }),
        });

        if (!res.ok) {
          throw new Error('Failed to analyze Salesforce data');
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
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={styles.spinner}
        />
      </div>
      <h2 style={styles.title}>Analyzing Salesforce Org</h2>
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
                {isComplete ? step.label.replace('...', '') + ' ✓' : step.label}
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
```

**Step 2: Commit**

```bash
git add components/diagnostic-intake/AnalyzingScreen.js
git commit -m "feat: add AnalyzingScreen component for CRM-first flow"
```

---

### Task 4: Update IntakeForm Orchestrator

**Files:**
- Modify: `components/diagnostic-intake/IntakeForm.js`

**Context:** This is the main orchestrator. We need to:
1. Add `sf-connect` and `sf-analyzing` to SECTIONS (conditionally active)
2. Add `preFill` state
3. Change OAuth callback handling — when `?salesforce=connected`, go to `sf-analyzing` instead of `review`
4. Route Section A completion to `sf-connect` when A1=Salesforce
5. Render the new steps
6. Pass `preFill` to Section B, C, D components
7. Hide sf-connect/sf-analyzing from progress bar

**Step 1: Add imports, state, and section routing**

At the top of `IntakeForm.js`, add the new imports after the existing ones:

```js
import SalesforceConnect from './SalesforceConnect';
import AnalyzingScreen from './AnalyzingScreen';
```

Change the SECTIONS constant and add section titles:

```js
const SECTIONS = ['A', 'sf-connect', 'sf-analyzing', 'B', 'C', 'D', 'review'];
const SECTION_TITLES = {
  A: 'Company Profile',
  'sf-connect': 'Connect CRM',
  'sf-analyzing': 'Analyzing',
  B: 'GTM Tools',
  C: 'Processes',
  D: 'Reporting & Metrics',
  review: 'Review & Submit',
};
```

Add `preFill` state alongside existing state declarations:

```js
const [preFill, setPreFill] = useState({});
```

**Step 2: Update the callback param handler**

In the `useEffect` that checks for `router.query` params, change the Salesforce connected handler to go to `sf-analyzing` instead of `review`:

Replace:
```js
if (salesforce === 'connected') {
  setSalesforceStatus((prev) => ({ ...prev, connected: true, signalsReady: true }));
  setSalesforceError(null);
}
```

With:
```js
if (salesforce === 'connected') {
  setSalesforceStatus((prev) => ({ ...prev, connected: true, signalsReady: true }));
  setSalesforceError(null);
  // CRM-first flow: go to analyzing step
  setCurrentSection('sf-analyzing');
}
```

Also update the load-on-mount `useEffect` — when returning from Salesforce OAuth with saved answers, go to `sf-analyzing`:

Replace:
```js
if (router.query.hubspot || router.query.salesforce) {
  setCurrentSection('review');
}
```

With:
```js
if (router.query.hubspot) {
  setCurrentSection('review');
} else if (router.query.salesforce) {
  setCurrentSection('sf-analyzing');
}
```

**Step 3: Update section completion routing**

In `handleSectionComplete`, replace the generic next-section logic with CRM-aware routing:

Replace:
```js
// Navigate to next section
const idx = SECTIONS.indexOf(section);
if (idx < SECTIONS.length - 1) {
  setCurrentSection(SECTIONS[idx + 1]);
}
```

With:
```js
// Navigate to next section (CRM-aware routing)
if (section === 'A' && sectionAnswers.A1 === 'Salesforce') {
  // Salesforce CRM-first: go to connect step
  setCurrentSection('sf-connect');
} else {
  const idx = SECTIONS.indexOf(currentSection);
  if (idx < SECTIONS.length - 1) {
    setCurrentSection(SECTIONS[idx + 1]);
  }
}
```

Note: we use `currentSection` (not `section`) for the fallback index because the section param is the section name (e.g., 'A'), and we need the current position in the SECTIONS array.

**Step 4: Add handleBack awareness for SF steps**

Update `handleBack` to skip SF-specific steps when going backwards from B:

Replace:
```js
const handleBack = () => {
  const idx = SECTIONS.indexOf(currentSection);
  if (idx > 0) setCurrentSection(SECTIONS[idx - 1]);
};
```

With:
```js
const handleBack = () => {
  if (currentSection === 'B' && answers.A1 === 'Salesforce') {
    // Skip back over sf-analyzing and sf-connect to Section A
    setCurrentSection('A');
  } else {
    const idx = SECTIONS.indexOf(currentSection);
    if (idx > 0) setCurrentSection(SECTIONS[idx - 1]);
  }
};
```

**Step 5: Update the progress bar to hide SF steps**

Update the IntakeProgress props to filter out `sf-connect` and `sf-analyzing`:

Replace:
```js
<IntakeProgress
  sections={SECTIONS.filter((s) => s !== 'review')}
  sectionTitles={SECTION_TITLES}
  currentSection={currentSection}
  sectionsCompleted={sectionsCompleted}
/>
```

With:
```js
<IntakeProgress
  sections={SECTIONS.filter((s) => !['review', 'sf-connect', 'sf-analyzing'].includes(s))}
  sectionTitles={SECTION_TITLES}
  currentSection={currentSection}
  sectionsCompleted={sectionsCompleted}
/>
```

**Step 6: Add new section renders**

Inside the `<AnimatePresence>` block, after the Section A render and before Section B, add:

```js
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
    />
    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem' }}>
      <button
        onClick={() => setCurrentSection('A')}
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
    onComplete={(inferredPreFill) => {
      setPreFill(inferredPreFill);
      // Auto-fill A2 from inference
      if (inferredPreFill.A2) {
        setAnswers((prev) => ({ ...prev, A2: inferredPreFill.A2.value }));
      }
      setCurrentSection('B');
    }}
    onError={(errMsg) => {
      setSalesforceError(errMsg);
      // Still advance to form — they can fill manually
      setCurrentSection('B');
    }}
  />
)}
```

**Step 7: Pass preFill to section components**

Update the Section B, C, D renders to include the `preFill` prop:

```js
{currentSection === 'B' && (
  <SectionB
    answers={answers}
    skipRules={skipRules}
    preFill={preFill}
    onComplete={(a) => handleSectionComplete('B', a)}
    onBack={handleBack}
  />
)}

{currentSection === 'C' && (
  <SectionC
    answers={answers}
    skipRules={skipRules}
    preFill={preFill}
    onComplete={(a) => handleSectionComplete('C', a)}
    onBack={handleBack}
  />
)}

{currentSection === 'D' && (
  <SectionD
    answers={answers}
    skipRules={skipRules}
    preFill={preFill}
    onComplete={(a) => handleSectionComplete('D', a)}
    onBack={handleBack}
  />
)}
```

**Step 8: Commit**

```bash
git add components/diagnostic-intake/IntakeForm.js
git commit -m "feat: wire CRM-first flow into IntakeForm orchestrator"
```

---

### Task 5: Update Section A — Hide A2 for Salesforce

**Files:**
- Modify: `components/diagnostic-intake/SectionA_CompanyProfile.js`

**Context:** When A1=Salesforce, A2 (rep count) is inferred from API data. We hide it from Section A so it doesn't get asked twice. A1, A3, A4, A5 remain.

**Step 1: Update the component**

Change the QUESTIONS array to include a `hideWhen` property on A2, and filter questions based on current answers:

Replace the static `QUESTIONS` and the render logic:

```js
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
```

In the component body, filter questions and update the `allAnswered` check:

```js
const visibleQuestions = QUESTIONS.filter((q) => {
  if (q.hideWhenSalesforce && local.A1 === 'Salesforce') return false;
  return true;
});

const allAnswered = visibleQuestions.every((q) => local[q.key]);
```

Update the render to use `visibleQuestions` instead of `QUESTIONS`:

```js
{visibleQuestions.map((q) => (
  // ... existing render code
))}
```

**Step 2: Commit**

```bash
git add components/diagnostic-intake/SectionA_CompanyProfile.js
git commit -m "feat: hide A2 in Section A when Salesforce selected"
```

---

### Task 6: Update Section B — Pre-fill Tools

**Files:**
- Modify: `components/diagnostic-intake/SectionB_Tools.js`

**Context:** Section B has a checklist of tool categories. When `preFill.B1_tools` exists, pre-check those tools and show an "Auto-detected" badge.

**Step 1: Accept preFill prop and initialize from it**

Add `preFill = {}` to the component props:

```js
export default function SectionB({ answers, skipRules, preFill = {}, onComplete, onBack }) {
```

Update the `selectedTools` initializer to include pre-filled tools:

```js
const [selectedTools, setSelectedTools] = useState(() => {
  const saved = answers.B1_tools || [];
  const savedArr = Array.isArray(saved) ? saved : [];
  const preFilled = preFill.B1_tools?.value || [];
  // Merge: saved answers take priority, then add pre-filled ones
  const merged = [...new Set([...savedArr, ...preFilled])];
  return merged;
});
const [overriddenTools, setOverriddenTools] = useState(new Set());
```

Update `toggleTool` to track overrides:

```js
const toggleTool = (key) => {
  setSelectedTools((prev) =>
    prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
  );
  setOverriddenTools((prev) => new Set(prev).add(key));
};
```

**Step 2: Add badge to pre-filled tools**

After each checkbox label, add the badge when the tool was pre-filled and not overridden:

```js
{TOOL_CATEGORIES.map((tool) => {
  const isPreFilled = preFill.B1_tools?.value?.includes(tool.key) && !overriddenTools.has(tool.key);
  return (
    <div key={tool.key}>
      <label style={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={selectedTools.includes(tool.key)}
          onChange={() => toggleTool(tool.key)}
          style={{ marginRight: '0.5rem' }}
        />
        <span style={{ fontSize: 'var(--text-sm)' }}>{tool.label}</span>
        {isPreFilled && (
          <span style={styles.autoDetectedBadge}>Auto-detected</span>
        )}
      </label>
      {/* ... existing follow-up questions ... */}
    </div>
  );
})}
```

Add the badge style to the styles object:

```js
autoDetectedBadge: {
  marginLeft: '0.5rem',
  padding: '0.125rem 0.5rem',
  background: '#EFF6FF',
  color: '#1E40AF',
  fontSize: '10px',
  borderRadius: '9999px',
  fontWeight: 'var(--font-medium)',
},
```

**Step 3: Commit**

```bash
git add components/diagnostic-intake/SectionB_Tools.js
git commit -m "feat: pre-fill tools in Section B from Salesforce metadata"
```

---

### Task 7: Update Section C — Pre-fill Processes

**Files:**
- Modify: `components/diagnostic-intake/SectionC_Processes.js`

**Context:** Several C-section questions can be pre-filled (C1, C3, C4, C5, C6, C8, C10, C11). Accept `preFill` prop, initialize answers from it, and show badge with evidence.

**Step 1: Accept preFill and initialize**

Add `preFill = {}` to props:

```js
export default function SectionC({ answers, skipRules, preFill = {}, onComplete, onBack }) {
```

Update the state initializer to merge pre-filled values:

```js
const [local, setLocal] = useState(() => {
  const init = {};
  for (const q of ALL_QUESTIONS) {
    // Saved answers take priority, then pre-fill, then empty
    init[q.key] = answers[q.key] || preFill[q.key]?.value || '';
  }
  return init;
});
const [overridden, setOverridden] = useState(new Set());
```

Update the selection handler to track overrides:

```js
const handleSelect = (key, value) => {
  setLocal((prev) => ({ ...prev, [key]: value }));
  setOverridden((prev) => new Set(prev).add(key));
};
```

Update the button `onClick` in the render:

```js
onClick={() => handleSelect(q.key, opt)}
```

**Step 2: Add badge below pre-filled questions**

After each question's option grid, show the badge if pre-filled and not overridden:

```js
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
```

Add the hint style:

```js
autoDetectedHint: {
  marginTop: '0.25rem',
  fontSize: '11px',
  color: '#1E40AF',
  background: '#EFF6FF',
  display: 'inline-block',
  padding: '0.125rem 0.5rem',
  borderRadius: '9999px',
},
```

**Step 3: Commit**

```bash
git add components/diagnostic-intake/SectionC_Processes.js
git commit -m "feat: pre-fill process questions in Section C from Salesforce metadata"
```

---

### Task 8: Update Section D — Pre-fill Reporting

**Files:**
- Modify: `components/diagnostic-intake/SectionD_Reporting.js`

**Context:** Only D1 (dashboard count) is pre-filled. Same pattern as Section C.

**Step 1: Accept preFill and initialize**

Add `preFill = {}` to props:

```js
export default function SectionD({ answers, skipRules, preFill = {}, onComplete, onBack }) {
```

Update state initializer:

```js
const allQuestions = [...REPORTING_QUESTIONS, ...POWER_10_METRICS.map((m) => ({ ...m, options: POWER_10_OPTIONS }))];
const [local, setLocal] = useState(() => {
  const init = {};
  for (const q of allQuestions) {
    init[q.key] = answers[q.key] || preFill[q.key]?.value || '';
  }
  return init;
});
const [overridden, setOverridden] = useState(new Set());
```

Add override tracking to selection:

```js
const handleSelect = (key, value) => {
  setLocal((prev) => ({ ...prev, [key]: value }));
  setOverridden((prev) => new Set(prev).add(key));
};
```

**Step 2: Add badge to pre-filled questions**

Update the REPORTING_QUESTIONS render (not Power 10 — those are always manual):

```js
{REPORTING_QUESTIONS.map((q) => {
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
```

Update Power 10 buttons to use `handleSelect` too:

```js
onClick={() => handleSelect(m.key, opt)}
```

Add the hint style:

```js
autoDetectedHint: {
  marginTop: '0.25rem',
  fontSize: '11px',
  color: '#1E40AF',
  background: '#EFF6FF',
  display: 'inline-block',
  padding: '0.125rem 0.5rem',
  borderRadius: '9999px',
},
```

**Step 3: Commit**

```bash
git add components/diagnostic-intake/SectionD_Reporting.js
git commit -m "feat: pre-fill dashboard count in Section D from Salesforce metadata"
```

---

### Task 9: Build Verification

**Step 1: Run the build**

```bash
npm run build
```

Expected: Clean build, zero errors.

**Step 2: Verify all files exist**

```bash
ls -la lib/diagnostic-engine/intake-inferrer-sf.js pages/api/salesforce/infer.js components/diagnostic-intake/AnalyzingScreen.js
```

**Step 3: Commit everything**

```bash
git add -A
git commit -m "feat: complete Salesforce CRM-first intake flow"
```
