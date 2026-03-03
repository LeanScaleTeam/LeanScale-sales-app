# HubSpot Diagnostic Coverage Expansion

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand HubSpot diagnostic API coverage from ~50% to ~70% by adding 8 new API endpoints and wiring their data through the full signal extraction → scoring pipeline.

**Architecture:** Add new fetch calls to `hubspot-downloader.js` (parallel with existing calls), persist new data columns in `hubspot_metadata`, extract new signals in both `signal-extractor.js` and `signal-extractor-v3.js`, and add new intake inferences in `intake-inferrer-hs.js`. No UI changes needed — the grader and scoring pipeline already consume these signals.

**Tech Stack:** HubSpot REST API v3/v4, Supabase Postgres (migration), Next.js API routes.

---

## Coverage Map: What Each Task Unlocks

| Task | New API Endpoint | Competencies Improved |
|------|-----------------|----------------------|
| 1 | Supabase migration (new columns) | Prerequisite for all |
| 2 | `GET /crm/v3/objects/tasks` | PR-10 (pipeline mgmt), PL-5 (review cadence) |
| 3 | `GET /crm/v3/objects/meetings` | PL-5 (review cadence), EN-3 (coaching) |
| 4 | `GET /crm/v3/objects/calls` | EN-3 (coaching), SY-6 (CI tools) |
| 5 | `GET /crm/v3/schemas` | SY-1 (CRM config), SY-7 (integration health) |
| 6 | Signal extraction for tasks/meetings/calls | Wires tasks 2-4 into scoring |
| 7 | `GET /marketing/v3/campaigns` | PR-9 (attribution), PR-8 (ABM) |
| 8 | `GET /crm/v3/objects/goal_targets` | RP-6 (forecasting), RP-5 (revenue metrics) |
| 9 | Signal extraction for campaigns/goals | Wires tasks 7-8 into scoring |
| 10 | Intake inferrer updates | Improves intake pre-fill for new signals |
| 11 | OAuth scope update | Enables campaign + goals APIs |

---

### Task 1: Supabase Migration — Add New Metadata Columns

**Files:**
- Create: `supabase/migrations/016_hubspot_activity_data.sql`

**Step 1: Write the migration**

```sql
-- Add expanded HubSpot activity and campaign data columns
ALTER TABLE hubspot_metadata
  ADD COLUMN IF NOT EXISTS tasks JSONB,
  ADD COLUMN IF NOT EXISTS meetings JSONB,
  ADD COLUMN IF NOT EXISTS calls JSONB,
  ADD COLUMN IF NOT EXISTS custom_object_schemas JSONB,
  ADD COLUMN IF NOT EXISTS campaigns JSONB,
  ADD COLUMN IF NOT EXISTS goals JSONB;
```

**Step 2: Apply locally**

Run: `npx supabase db push` or apply directly via Supabase dashboard.

**Step 3: Commit**

```bash
git add supabase/migrations/016_hubspot_activity_data.sql
git commit -m "feat: add hubspot activity/campaign columns to metadata table"
```

---

### Task 2: Downloader — Fetch Tasks (Activity Data)

**Files:**
- Modify: `lib/hubspot-downloader.js:23-39` (add to Promise.all)
- Modify: `lib/hubspot-downloader.js:54-72` (add to upsert)

**Step 1: Add task download function to `hubspot-downloader.js`**

Add after the `downloadContactSources` function (after line 224):

```js
/**
 * Download recent tasks for activity volume and completion signals.
 * Searches tasks created in last 90 days, pages up to 300.
 */
async function downloadTasks(headers) {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    let allTasks = [];
    let after = undefined;

    for (let page = 0; page < 3; page++) {
      const body = {
        filterGroups: [{
          filters: [
            { propertyName: 'hs_createdate', operator: 'GTE', value: ninetyDaysAgo },
          ],
        }],
        properties: ['hs_task_subject', 'hs_task_status', 'hs_task_type', 'hubspot_owner_id'],
        limit: 100,
      };
      if (after) body.after = after;

      const res = await fetch(`${API_BASE}/crm/v3/objects/tasks/search`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) break;
      const data = await res.json();
      allTasks = allTasks.concat(data.results || []);
      after = data.paging?.next?.after;
      if (!after) break;
    }

    const completed = allTasks.filter((t) => t.properties?.hs_task_status === 'COMPLETED');
    return {
      tasks: allTasks,
      total: allTasks.length,
      completed_count: completed.length,
      completion_rate: allTasks.length > 0 ? Math.round((completed.length / allTasks.length) * 100) : 0,
    };
  } catch (err) {
    console.warn('HubSpot tasks download error:', err.message);
    return null;
  }
}
```

**Step 2: Wire into Promise.all**

In the `downloadAndStoreMetadata` function, modify the destructure at line 27 to include `tasks`:

```js
const [properties, pipelines, workflows, forms, lists, owners, marketingEmails, sequences, dealAggregates, contactSources, tasks] =
    await Promise.all([
      downloadProperties(headers),
      downloadPipelines(headers),
      downloadWorkflows(headers),
      fetchJSON(`${API_BASE}/marketing/v3/forms`, headers),
      fetchJSON(`${API_BASE}/contacts/v1/lists?count=250`, headers),
      fetchJSON(`${API_BASE}/crm/v3/owners`, headers),
      fetchJSON(`${API_BASE}/marketing/v3/emails?limit=100`, headers),
      fetchJSON(`${API_BASE}/automation/v4/actions/sequences`, headers),
      downloadDealAggregates(headers),
      downloadContactSources(headers),
      downloadTasks(headers),
    ]);
```

**Step 3: Add to upsert payload**

In the upsert object (around line 54-72), add `tasks` to the stored data:

```js
tasks,
```

**Step 4: Commit**

```bash
git add lib/hubspot-downloader.js
git commit -m "feat: download HubSpot tasks for activity signals"
```

---

### Task 3: Downloader — Fetch Meetings

**Files:**
- Modify: `lib/hubspot-downloader.js` (add function + wire into Promise.all + upsert)

**Step 1: Add meeting download function**

Add after the `downloadTasks` function:

```js
/**
 * Download recent meetings for review cadence and coaching signals.
 * Searches meetings in last 90 days, pages up to 300.
 */
async function downloadMeetings(headers) {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    let allMeetings = [];
    let after = undefined;

    for (let page = 0; page < 3; page++) {
      const body = {
        filterGroups: [{
          filters: [
            { propertyName: 'hs_createdate', operator: 'GTE', value: ninetyDaysAgo },
          ],
        }],
        properties: ['hs_meeting_title', 'hs_meeting_outcome', 'hubspot_owner_id', 'hs_meeting_start_time'],
        limit: 100,
      };
      if (after) body.after = after;

      const res = await fetch(`${API_BASE}/crm/v3/objects/meetings/search`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) break;
      const data = await res.json();
      allMeetings = allMeetings.concat(data.results || []);
      after = data.paging?.next?.after;
      if (!after) break;
    }

    return {
      meetings: allMeetings,
      total: allMeetings.length,
    };
  } catch (err) {
    console.warn('HubSpot meetings download error:', err.message);
    return null;
  }
}
```

**Step 2: Wire into Promise.all and upsert**

Add `meetings` to the destructure and Promise.all array (same pattern as Task 2). Add `meetings` to the upsert payload.

**Step 3: Commit**

```bash
git add lib/hubspot-downloader.js
git commit -m "feat: download HubSpot meetings for cadence signals"
```

---

### Task 4: Downloader — Fetch Calls

**Files:**
- Modify: `lib/hubspot-downloader.js`

**Step 1: Add call download function**

```js
/**
 * Download recent calls for coaching and conversation intelligence signals.
 * Searches calls in last 90 days, pages up to 200.
 */
async function downloadCalls(headers) {
  try {
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    let allCalls = [];
    let after = undefined;

    for (let page = 0; page < 2; page++) {
      const body = {
        filterGroups: [{
          filters: [
            { propertyName: 'hs_createdate', operator: 'GTE', value: ninetyDaysAgo },
          ],
        }],
        properties: ['hs_call_title', 'hs_call_duration', 'hs_call_recording_url', 'hubspot_owner_id', 'hs_call_direction'],
        limit: 100,
      };
      if (after) body.after = after;

      const res = await fetch(`${API_BASE}/crm/v3/objects/calls/search`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) break;
      const data = await res.json();
      allCalls = allCalls.concat(data.results || []);
      after = data.paging?.next?.after;
      if (!after) break;
    }

    const withRecording = allCalls.filter((c) => c.properties?.hs_call_recording_url);
    return {
      calls: allCalls,
      total: allCalls.length,
      with_recording: withRecording.length,
      recording_rate: allCalls.length > 0 ? Math.round((withRecording.length / allCalls.length) * 100) : 0,
    };
  } catch (err) {
    console.warn('HubSpot calls download error:', err.message);
    return null;
  }
}
```

**Step 2: Wire into Promise.all and upsert**

Same pattern — add `calls` to destructure, Promise.all, and upsert.

**Step 3: Commit**

```bash
git add lib/hubspot-downloader.js
git commit -m "feat: download HubSpot calls for coaching signals"
```

---

### Task 5: Downloader — Fetch Custom Object Schemas

**Files:**
- Modify: `lib/hubspot-downloader.js`

**Step 1: Add schema download**

This uses a scope already granted (`crm.schemas.custom.read`):

```js
/**
 * Download custom object schemas for CRM maturity signal.
 */
async function downloadCustomObjectSchemas(headers) {
  return fetchJSON(`${API_BASE}/crm/v3/schemas`, headers);
}
```

**Step 2: Wire into Promise.all and upsert**

Add `customObjectSchemas` to destructure, `downloadCustomObjectSchemas(headers)` to the Promise.all array, and `custom_object_schemas: customObjectSchemas` to the upsert.

**Step 3: Commit**

```bash
git add lib/hubspot-downloader.js
git commit -m "feat: download HubSpot custom object schemas"
```

---

### Task 6: Signal Extraction — Tasks, Meetings, Calls, Custom Objects

**Files:**
- Modify: `lib/diagnostic-engine/signal-extractor.js:15-16` (add new metadata fields to destructure)
- Modify: `lib/diagnostic-engine/signal-extractor.js:20-107` (add new signals to return object)
- Modify: `lib/diagnostic-engine/v3/signal-extractor-v3.js:21-94` (update v3 signals)

**Step 1: Update base signal extractor**

In `signal-extractor.js`, modify the destructure at line 16:

```js
const { properties, pipelines, workflows, forms, lists, owners, marketing_emails, tasks, meetings, calls, custom_object_schemas } = metadata || {};
```

Add these new signal blocks before the closing `};` of the return object (before line 107):

```js
    // ── Activity Signals ──
    task_90day_count: tasks?.total || 0,
    task_completion_rate: tasks?.completion_rate || 0,
    meeting_90day_count: meetings?.total || 0,
    call_90day_count: calls?.total || 0,
    call_recording_rate: calls?.recording_rate || 0,
    has_call_recording: (calls?.with_recording || 0) > 0,

    // ── Custom Object Maturity ──
    custom_object_count: (custom_object_schemas?.results || []).length,
    has_custom_objects: (custom_object_schemas?.results || []).length > 0,
```

**Step 2: Update v3 signal extractor**

In `signal-extractor-v3.js`, update the destructure at line 25:

```js
const { properties, pipelines, workflows, forms, lists, owners, marketing_emails, tasks, meetings, calls } = metadata || {};
```

Add meeting-based review cadence detection (replace the hardcoded territory/forecasting section, keeping those as-is, but adding new signals before them around line 78):

```js
  // Review cadence from meetings (PL-5)
  const meetingList = meetings?.meetings || [];
  const cadencePatterns = /QBR|quarterly.*review|weekly.*review|WBR|pipeline.*review|forecast.*call|1.?on.?1|one.?on.?one|standup|stand.?up/i;
  const cadenceMeetings = meetingList.filter((m) => cadencePatterns.test(m.properties?.hs_meeting_title || ''));
  base.recurring_review_event_count = cadenceMeetings.length;
  base.has_review_cadence = cadenceMeetings.length > 0;

  // Coaching activity from meetings + calls (EN-3)
  const coachingMeetings = meetingList.filter((m) =>
    /coaching|deal.*review|1.?on.?1.*rep|coaching.*session/i.test(m.properties?.hs_meeting_title || '')
  );
  base.coaching_activity_count = coachingMeetings.length;

  // Call recording adoption (EN-3, SY-6)
  base.call_recording_rate = calls?.recording_rate || 0;
  base.has_call_recording = (calls?.with_recording || 0) > 0;
```

**Step 3: Commit**

```bash
git add lib/diagnostic-engine/signal-extractor.js lib/diagnostic-engine/v3/signal-extractor-v3.js
git commit -m "feat: extract activity signals from tasks, meetings, calls"
```

---

### Task 7: Downloader — Fetch Campaigns (Requires New Scope)

**Files:**
- Modify: `lib/hubspot-downloader.js`

**Step 1: Add campaign download function**

```js
/**
 * Download marketing campaigns for attribution and ABM signals.
 * Uses marketing events API — requires 'marketing-events' scope.
 */
async function downloadCampaigns(headers) {
  try {
    const data = await fetchJSON(`${API_BASE}/marketing/v3/campaigns?limit=100`, headers);
    if (!data) return null;

    const campaigns = data?.results || [];
    return {
      campaigns,
      total: campaigns.length,
    };
  } catch (err) {
    console.warn('HubSpot campaigns download error:', err.message);
    return null;
  }
}
```

Note: The HubSpot campaigns API may return a different shape. The `/marketing/v3/campaigns` endpoint returns campaign objects with `id`, `name`, `type`. If this endpoint 404s (scope not granted), the `fetchJSON` graceful-fail returns null, which is safe — the signal extractor handles null.

**Step 2: Wire into Promise.all and upsert**

Add `campaigns` to destructure, `downloadCampaigns(headers)` to Promise.all, and `campaigns` to upsert.

**Step 3: Commit**

```bash
git add lib/hubspot-downloader.js
git commit -m "feat: download HubSpot campaigns for attribution signals"
```

---

### Task 8: Downloader — Fetch Goals (Requires New Scope)

**Files:**
- Modify: `lib/hubspot-downloader.js`

**Step 1: Add goals download function**

```js
/**
 * Download goals/targets for forecasting signal.
 * Requires 'crm.objects.goals.read' scope.
 */
async function downloadGoals(headers) {
  try {
    const data = await fetchJSON(`${API_BASE}/crm/v3/objects/goal_targets?limit=100`, headers);
    if (!data) return null;

    const goals = data?.results || [];
    return {
      goals,
      total: goals.length,
    };
  } catch (err) {
    console.warn('HubSpot goals download error:', err.message);
    return null;
  }
}
```

**Step 2: Wire into Promise.all and upsert**

Add `goals` to destructure, `downloadGoals(headers)` to Promise.all, and `goals` to upsert.

**Step 3: Commit**

```bash
git add lib/hubspot-downloader.js
git commit -m "feat: download HubSpot goals for forecasting signals"
```

---

### Task 9: Signal Extraction — Campaigns and Goals

**Files:**
- Modify: `lib/diagnostic-engine/v3/signal-extractor-v3.js`

**Step 1: Add campaign signals**

Replace the hardcoded `base.campaign_count = base.campaign_count || 0;` at line 86 with:

```js
  // Campaign attribution (PR-9, PR-8)
  const campaignData = metadata?.campaigns;
  const campaignList = campaignData?.campaigns || [];
  base.campaign_count = campaignList.length;
  base.has_abm_campaigns = campaignList.some((c) =>
    /abm|target.*account|account.*based/i.test(c.name || c.type || '')
  );
```

**Step 2: Add goals/forecasting signals**

Replace the hardcoded `base.has_forecasting_config = false;` at line 92 with:

```js
  // Forecasting config (RP-6)
  const goalData = metadata?.goals;
  const goalList = goalData?.goals || [];
  base.has_forecasting_config = goalList.length > 0 || base.has_forecasting_config;
  base.goal_count = goalList.length;
```

**Step 3: Commit**

```bash
git add lib/diagnostic-engine/v3/signal-extractor-v3.js
git commit -m "feat: extract campaign and goals signals for HS diagnostics"
```

---

### Task 10: Intake Inferrer Updates

**Files:**
- Modify: `lib/diagnostic-engine/intake-inferrer-hs.js`

**Step 1: Add new metadata to normalize section**

In `inferHubSpotIntakeAnswers` around line 91-103, add:

```js
  const tasks = metadata.tasks || null;
  const meetings = metadata.meetings || null;
  const calls = metadata.calls || null;
  const campaigns = metadata.campaigns || null;
  const goals = metadata.goals || null;
```

**Step 2: Add new inference for review cadence**

Add after the `inferE3` call (after line 134):

```js
  inferPL5(preFill, meetings);
  inferRP6Goals(preFill, goals, dealProps);
```

**Step 3: Write the new inference functions**

Add before the `// ── Utility Helpers ──` section (before line 824):

```js
/**
 * PL-5: Review cadence — check meeting titles for QBR/WBR/pipeline review patterns.
 * Found -> "Weekly and monthly"
 */
function inferPL5(preFill, meetings) {
  if (!meetings || !meetings.meetings) return;

  const meetingList = meetings.meetings;
  const weeklyPattern = /weekly|WBR|1.?on.?1|one.?on.?one|standup|pipeline.*review/i;
  const monthlyPattern = /monthly|MBR|forecast/i;
  const quarterlyPattern = /QBR|quarterly/i;

  const hasWeekly = meetingList.some((m) => weeklyPattern.test(m.properties?.hs_meeting_title || ''));
  const hasMonthly = meetingList.some((m) => monthlyPattern.test(m.properties?.hs_meeting_title || ''));
  const hasQuarterly = meetingList.some((m) => quarterlyPattern.test(m.properties?.hs_meeting_title || ''));

  if (!hasWeekly && !hasMonthly && !hasQuarterly) return;

  const cadences = [];
  if (hasWeekly) cadences.push('weekly');
  if (hasMonthly) cadences.push('monthly');
  if (hasQuarterly) cadences.push('quarterly');

  preFill.PL5_cadence = {
    value: cadences.join(' + '),
    confidence: 'medium',
    evidence: `Meeting cadence detected: ${cadences.join(', ')} review meetings found in last 90 days`,
  };
}

/**
 * RP-6: Forecasting — enhance with goals data.
 * Goals API shows active forecasting, stronger than just the property check.
 */
function inferRP6Goals(preFill, goals, dealProps) {
  if (preFill.D3) return; // Already inferred from deal properties

  if (!goals || !goals.goals || goals.goals.length === 0) return;

  preFill.D3 = {
    value: 'CRM forecast tool',
    confidence: 'medium',
    evidence: `${goals.goals.length} goal target(s) configured in HubSpot Goals`,
  };
}
```

**Step 4: Commit**

```bash
git add lib/diagnostic-engine/intake-inferrer-hs.js
git commit -m "feat: add review cadence and goals inference to HS intake"
```

---

### Task 11: OAuth Scope Update (For Campaigns + Goals)

**Files:**
- Modify: `lib/hubspot.js:16-38`

**Step 1: Add new optional scopes**

Add these to the `OPTIONAL_SCOPES` array at `lib/hubspot.js:16-38`:

```js
  'crm.objects.goals.read',
```

Note: The `marketing-events` scope for campaigns may not be needed — the `/marketing/v3/campaigns` endpoint may work with existing scopes. Test first. If it 404s, add `'marketing-events'` to the optional scopes array. Tasks, meetings, and calls are accessible under the existing `crm.objects.contacts.read` scope (HubSpot engagement objects share contact-level scopes).

**Step 2: Commit**

```bash
git add lib/hubspot.js
git commit -m "feat: add goals scope to HubSpot OAuth"
```

**Important:** Existing connected HubSpot portals will NOT automatically get the new scope. Users will need to reconnect (re-authorize) to grant the new scope. The downloader handles this gracefully — `fetchJSON` returns null for 403/404, and signal extractors treat null as "no data."

---

## Post-Implementation Verification

After all tasks are complete:

1. **Local test:** Connect a HubSpot test portal, trigger `/api/hubspot/download`, check `hubspot_metadata` for new columns populated
2. **Signal check:** Call `/api/diagnostic/v3/crm-signals?customerId=X` and verify new signals appear (task counts, meeting cadence, call recording rate, etc.)
3. **Graceful degradation:** Disconnect and reconnect without new scopes — verify null handling works (no errors, signals fall back to zero/false)

## Expected Coverage After Implementation

| Competency | Before | After | Delta |
|------------|--------|-------|-------|
| PR-9 Attribution | 2/5 max (deal source only) | 4/5 max (+ campaigns) | +2 |
| PR-10 Pipeline Mgmt | 1/5 (no activity data) | 3/5 (task volume, completion) | +2 |
| PL-5 Review Cadence | 0 (no signal) | 3/5 (meeting cadence) | +3 |
| EN-3 Coaching | 2/5 (property detect only) | 4/5 (+ calls, recordings, meetings) | +2 |
| RP-6 Forecasting | 1/5 (property only) | 3/5 (+ goals API) | +2 |
| SY-1 CRM Config | 3/5 | 4/5 (+ custom objects) | +1 |
| SY-6 Intelligence | 3/5 | 4/5 (+ call recording data) | +1 |
| SY-7 Integration | 2/5 | 3/5 (+ custom objects as maturity) | +1 |

**Estimated overall: ~50% → ~68-72% API-informed competency coverage**
