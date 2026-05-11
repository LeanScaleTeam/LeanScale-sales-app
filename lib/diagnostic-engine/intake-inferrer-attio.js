/**
 * Attio Intake Inferrer
 *
 * Reads attio_metadata and produces a pre-fill map for intake questions.
 * Each entry: { value, confidence: 'high'|'medium', evidence: string }
 *
 * Attio v1 scope — high-confidence inferences only. The lighter API surface
 * area (no workflows, no forms, no sequences) means more questions stay manual.
 */

const ARR_BUCKETS = [
  { label: 'Under $1M', max: 1_000_000 },
  { label: '$1M-$5M', max: 5_000_000 },
  { label: '$5M-$10M', max: 10_000_000 },
  { label: '$10M-$25M', max: 25_000_000 },
  { label: '$25M-$50M', max: 50_000_000 },
  { label: '$50M-$100M', max: 100_000_000 },
  { label: '$100M+', max: Infinity },
];

function bucketArr(amount) {
  for (const b of ARR_BUCKETS) {
    if (amount <= b.max) return b.label;
  }
  return '$100M+';
}

export function inferAttioIntakeAnswers(row) {
  const preFill = {};
  if (!row) return preFill;

  const members = row.workspace_members || [];
  const tasks = row.tasks || [];
  const aggregates = row.deal_aggregates || {};
  const webhooks = row.webhooks || [];
  const signals = row.computed_signals || {};

  // A1: CRM type — always Attio when this inferrer is called
  preFill.A1 = {
    value: 'Attio',
    confidence: 'high',
    evidence: 'Connected via Attio OAuth',
  };

  // A2: Rep count (bucket from workspace members — best-effort, not all members are reps)
  if (members.length > 0) {
    let bucket;
    if (members.length < 5) bucket = '1-5';
    else if (members.length < 11) bucket = '6-10';
    else if (members.length < 26) bucket = '11-25';
    else if (members.length < 51) bucket = '26-50';
    else if (members.length < 101) bucket = '51-100';
    else bucket = '100+';
    preFill.A2 = {
      value: bucket,
      confidence: 'medium',
      evidence: `${members.length} workspace members in Attio (includes non-rep roles)`,
    };
  }

  // A3: ARR range (from closed-won aggregates)
  if (aggregates.closed_won_amount > 0) {
    preFill.A3 = {
      value: bucketArr(aggregates.closed_won_amount),
      confidence: 'medium',
      evidence: `$${Math.round(aggregates.closed_won_amount).toLocaleString()} closed-won in ${aggregates.year || 'current year'}`,
    };
  }

  // B1_tools: detected GTM tooling (enrichment tools + webhook destinations)
  const tools = new Set();
  for (const tool of signals.enrichment_tools || []) tools.add(tool.name);
  for (const platform of signals.attio_webhook_platforms || []) {
    if (platform !== 'Custom') tools.add(platform);
  }
  if (tools.size > 0) {
    preFill.B1_tools = {
      value: [...tools],
      confidence: 'medium',
      evidence: `Detected from Attio attributes + webhook destinations`,
    };
  }

  // Activity volume (T1 / ops indicator)
  if (tasks.length > 0) {
    preFill._task_volume = {
      value: tasks.length,
      confidence: 'high',
      evidence: `${tasks.length} tasks found in Attio`,
    };
  }

  // Automation maturity flag (informational — used in Attio-specific intake question A_attio_1)
  if (webhooks.length > 0) {
    preFill.A_attio_webhooks_present = {
      value: 'Yes',
      confidence: 'high',
      evidence: `${webhooks.length} active webhook${webhooks.length === 1 ? '' : 's'} configured`,
    };
  }

  return preFill;
}
