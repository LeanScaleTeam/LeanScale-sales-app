# Signal Extraction & Recommendation Tuning Plan

**Goal:** Reduce missed service recommendations so consultants spend less time adding services post-diagnostic.

**Approach:** Tune existing pipeline (Approach A) — prompt improvements, threshold adjustments, and mapping expansions. No architectural changes.

**Root cause:** Services exist in catalog. Transcripts contain the signals. The engine isn't connecting them due to: conservative prompt, high confidence floor, narrow competency→service mappings, and thin catalog descriptions in the LLM prompt.

---

## Step 1: Rewrite Signal Extractor Prompt

**File:** `lib/diagnostic-engine/v3/transcript-project-extractor.js` → `buildSystemPrompt()`

### Changes:

**1a. Shift from conservative to extraction-maximizing tone**

Replace:
```
- Do NOT map generic complaints to specific projects without clear connection
```
With:
```
- When a prospect describes a pain point, actively infer which services would address it — even if the service isn't named directly
- It's better to surface a borderline signal (with lower confidence) than to miss a real need
- Only skip mapping when there is truly no reasonable connection
```

**1b. Add few-shot inference examples to the system prompt**

Add a `MAPPING EXAMPLES` section after the rules with ~8-10 examples showing:
- Explicit: "we need forecasting" → `forecasting-process-implementation` (confidence: 0.9)
- Pain point: "our reps don't know what to say on discovery calls" → `sales-enablement-platform-implementation` (0.7) + `conversation-intelligence-platform-implementation` (0.6)
- Tool gap: "we're still using spreadsheets for commissions" → `commission-tool-implementation` (0.8) + `commission-plan-design-and-implementation` (0.6)
- Aspiration: "we want to move upmarket to enterprise" → `abm-abs-process-and-system` (0.6) + `sales-territory-design` (0.5)
- Multi-signal: "leads are falling through the cracks" → `lead-routing` (0.7) + `lead-lifecycle` (0.6) + `speed-to-lead` (0.6)

**1c. Add trigger phrases / synonyms to catalog entries in the prompt**

Instead of:
```
- forecasting-process-implementation: Structured forecasting methodology... [sales]
```

Generate and inject:
```
- forecasting-process-implementation: Structured forecasting methodology... [sales]
  TRIGGERS: "can't predict revenue", "forecast accuracy", "commit vs best case", "pipeline coverage", "sandbagging", "deal slippage"
```

This gives the LLM colloquial anchors to match against. Build a `TRIGGER_PHRASES` map in the extractor file (~5-8 phrases per high-frequency service, focusing on the top 30-40 services consultants add most often).

**1d. Remove the deduplication instruction**

Current: "Do NOT duplicate signals — if forecasting is mentioned multiple times, submit ONE signal with the strongest evidence"

This is fine for the same service, but should clarify: a single pain point CAN and SHOULD map to multiple services when relevant. Change to:
```
- A single pain point or quote can map to MULTIPLE services if it implies several needs
- Do NOT submit the same service_id more than once — pick the strongest evidence for each
```

---

## Step 2: Lower Confidence Floor & Add Transparency

**File:** `lib/diagnostic-engine/v3/generate-roadmap.js` → `mergeSignalProjects()`

### Changes:

**2a. Lower confidence filter from 0.4 → 0.2**

```js
// Before
if (signal.confidence < 0.4) continue;

// After
if (signal.confidence < 0.2) continue;
```

**2b. Add `low_confidence` flag for signals between 0.2 and 0.4**

```js
const transcriptSignal = {
  type: signal.signal_type,
  confidence: signal.confidence,
  evidence: signal.evidence,
  reasoning: signal.reasoning,
  lowConfidence: signal.confidence < 0.4, // Flag for UI
};
```

This lets the admin/results UI show these as "suggested" rather than "recommended" — consultants can quickly approve rather than manually adding from scratch.

**2c. Adjust synthetic gap score for low-confidence signal-only projects**

Currently: `avgGap: signal.confidence >= 0.7 ? 3 : 2`

Add a tier: `avgGap: signal.confidence >= 0.7 ? 3 : signal.confidence >= 0.4 ? 2 : 1`

This puts low-confidence signal-only projects at the bottom of their phase rather than competing with high-confidence ones.

---

## Step 3: Widen Competency → serviceIds Mappings

**File:** `lib/diagnostic-engine/v3/constants-v3.js` → `V3_COMPETENCIES`

### Audit & Additions:

| Competency | Current serviceIds | Add |
|---|---|---|
| PL-1 (Operating plan) | growth-model, gtm-reporting-pack | `executive-reporting-suite` |
| PL-2 (Capacity plan) | quotas-and-target-setting, gtm-org-chart | `growth-model` |
| PL-4 (OKR/KPI) | executive-reporting-suite | `monthly-quarterly-gtm-reporting-pack` |
| PE-3 (Onboarding 30/60/90) | gtm-org-chart | `sales-enablement-platform-implementation` |
| PE-4 (Comp plan) | commission-plan-design | `commission-tool-implementation` |
| PR-1 (Lead lifecycle) | lead-lifecycle, gtm-lifecycle | `lead-routing`, `speed-to-lead` |
| PR-2 (Sales lifecycle) | sales-lifecycle | `sales-qualification-methodology`, `forecasting-process-implementation` |
| PR-3 (Customer lifecycle) | customer-lifecycle, onboarding | `renewal-management`, `customer-health-model` |
| PR-5 (Cross-functional handoffs) | mktg-to-sales, sales-to-cs | `lead-routing` |
| PR-6 (Sales methodology) | sales-qualification | `conversation-intelligence-platform-implementation` |
| PR-8 (ABM) | abm-abs, market-map | `automated-outbound-process` |
| PR-10 (Pipeline mgmt) | forecasting, rev-intel | `opportunity-management-ux-improvements` |
| SY-1 (CRM config) | hubspot/sf-impl, foundational-automations | `crm-deduplication`, `activity-capture` |
| SY-6 (Intelligence tools) | automated-inbound-enrichment, clay-impl | `zoominfo-impl`, `6sense-impl` |
| RP-1 (Exec dashboards) | executive-reporting-suite | `arr-reporting` |
| RP-6 (Forecasting) | forecasting, growth-model | `revenue-intelligence-process` |
| EN-1 (ICP content) | sales-enablement-platform | `market-map` |
| EN-3 (Coaching) | conversation-intelligence | `sales-enablement-platform-implementation` |
| EN-5 (Playbooks) | sales-enablement-platform | `conversation-intelligence-platform-implementation` |

This adds ~25 missing connections across 19 competencies.

---

## Step 4: Increase max_tokens for Signal Extraction

**File:** `lib/diagnostic-engine/v3/transcript-project-extractor.js` → `callOpenRouter()`

Change `max_tokens: 4096` → `max_tokens: 8192`

Longer transcripts with many signals may hit the token limit, causing the model to truncate its output and drop later signals. Doubling the limit is cheap insurance.

---

## Step 5: Validation & Testing

### 5a. Unit test: trigger phrase coverage
- For each service in the catalog, verify it has trigger phrases defined
- For the top 30 services, verify at least 5 trigger phrases each

### 5b. Regression test with sample transcripts
- Run 3-5 real transcripts through the old prompt vs new prompt
- Compare signal counts and service IDs
- Verify no regressions (services that were correctly identified before should still be)

### 5c. Consultant feedback loop
- Add a "missing service" button on the results page that logs what consultants add manually
- After 2-4 weeks, analyze which services are still being added manually → next round of tuning

---

## Implementation Order

1. **Step 3** (widen serviceIds) — Pure data change, zero risk, immediate impact
2. **Step 1a+1d** (prompt tone shift) — Biggest single impact on inference misses
3. **Step 2** (confidence floor) — Surfaces borderline signals
4. **Step 1c** (trigger phrases) — Biggest effort but highest long-term value
5. **Step 1b** (few-shot examples) — Amplifies prompt changes
6. **Step 4** (max_tokens) — Quick safety net
7. **Step 5** (validation) — Ongoing

---

## Files Changed

| File | Change Type |
|---|---|
| `lib/diagnostic-engine/v3/constants-v3.js` | Data: widen serviceIds |
| `lib/diagnostic-engine/v3/transcript-project-extractor.js` | Prompt: rewrite + trigger phrases + max_tokens |
| `lib/diagnostic-engine/v3/generate-roadmap.js` | Logic: confidence floor + low_confidence flag |

## Out of Scope (for now)

- Approach B (4th extraction pass) — revisit if A doesn't close enough gap
- Approach C (two-stage architecture) — only if fundamental limits hit
- UI changes to surface low-confidence signals differently — separate ticket
- Intake form extraction improvements — different bottleneck
