// CPQ / Quote-to-Cash Diagnostic Data
// Defines processes, categories, and outcomes for the CPQ diagnostic

export const cpqCategories = [
  'Quoting Process',
  'Pricing & Catalog',
  'Contract Management',
  'Billing Integration',
  'Revenue Recognition',
  'System Integration',
];

// Lifecycle pipeline ordering (left-to-right in Q2C flow)
export const cpqLifecycleOrder = [
  'Quoting Process',
  'Pricing & Catalog',
  'Contract Management',
  'Billing Integration',
  'Revenue Recognition',
  'System Integration',
];

export const cpqOutcomes = [
  'Accelerate Deal Velocity',
  'Improve Quote Accuracy',
  'Reduce Revenue Leakage',
  'Ensure Compliance',
  'Optimize System Connectivity',
];

export const cpqProcesses = [
  // --- Quoting Process (6) ---
  {
    name: 'Quote Creation Speed',
    status: 'warning',
    addToEngagement: true,
    function: 'Quoting Process',
    outcome: 'Accelerate Deal Velocity',
    metric: 'Median time to valid quote',
    description: 'Measures how quickly sellers can produce a complete, accurate quote. Includes multi-year, upsell, and cross-sell paths.',
  },
  {
    name: 'Multi-Year Quote Handling',
    status: 'warning',
    addToEngagement: true,
    function: 'Quoting Process',
    outcome: 'Accelerate Deal Velocity',
    metric: 'Manual duplication steps per multi-year quote',
    description: 'Evaluates whether multi-year quotes auto-propagate pricing, uplift, and product mix across years vs. manual duplication.',
  },
  {
    name: 'Approval Workflow Efficiency',
    status: 'warning',
    addToEngagement: true,
    function: 'Quoting Process',
    outcome: 'Accelerate Deal Velocity',
    metric: 'Misrouted/unknown approval triggers per month',
    description: 'Assesses whether approval rules route consistently based on clear deal factors with OOO coverage and auto-approve for standard deals.',
  },
  {
    name: 'Quote Template Usage',
    status: 'careful',
    addToEngagement: false,
    function: 'Quoting Process',
    outcome: 'Improve Quote Accuracy',
    metric: 'Playbook coverage by product family',
    description: 'Tracks whether each product family has a dedicated playbook/template for consistent quoting.',
  },
  {
    name: 'Renewal Quote Intake',
    status: 'warning',
    addToEngagement: true,
    function: 'Quoting Process',
    outcome: 'Accelerate Deal Velocity',
    metric: 'Missing-input chases before quote build',
    description: 'Evaluates whether a standardized request form (fields, attachments, SOF link) exists so renewals can build without chasing inputs.',
  },
  {
    name: 'Quote Stage Progression',
    status: 'healthy',
    addToEngagement: false,
    function: 'Quoting Process',
    outcome: 'Accelerate Deal Velocity',
    metric: 'Stage-to-status match rate (DH to SFDC)',
    description: 'Assesses whether quote stages (Draft, Submitted, Approved, Sent, Signed) are consistently matched between DealHub and Salesforce.',
  },

  // --- Pricing & Catalog (6) ---
  {
    name: 'Product Catalog Completeness',
    status: 'warning',
    addToEngagement: true,
    function: 'Pricing & Catalog',
    outcome: 'Improve Quote Accuracy',
    metric: 'Zero-priced SKUs in catalog',
    description: 'Measures whether all products have valid pricing. Flags $0-priced SKUs that require manual price entry and cause errors.',
  },
  {
    name: 'SKU Standardization',
    status: 'warning',
    addToEngagement: true,
    function: 'Pricing & Catalog',
    outcome: 'Improve Quote Accuracy',
    metric: 'Duplicate/overlapping value set count',
    description: 'Checks whether product SKUs, packages, and value sets follow a coherent structure without redundancy.',
  },
  {
    name: 'Discount Governance',
    status: 'unable',
    addToEngagement: true,
    function: 'Pricing & Catalog',
    outcome: 'Reduce Revenue Leakage',
    metric: 'Products with no floor price',
    description: 'Assesses whether price floors and margin guardrails exist. Flags products allowing 100% discount without approval.',
  },
  {
    name: 'Bundle & Compatibility Rules',
    status: 'unable',
    addToEngagement: true,
    function: 'Pricing & Catalog',
    outcome: 'Improve Quote Accuracy',
    metric: 'Product families with bundle/constraint rules',
    description: 'Evaluates whether the system blocks incompatible SKU combinations and enforces bundle rules across all product families.',
  },
  {
    name: 'Product Field Validation',
    status: 'warning',
    addToEngagement: true,
    function: 'Pricing & Catalog',
    outcome: 'Improve Quote Accuracy',
    metric: 'SKUs with missing required fields',
    description: 'Checks whether products can be saved without all required fields (Description, Family, Tags, start/end dates).',
  },
  {
    name: 'Price List Management',
    status: 'careful',
    addToEngagement: false,
    function: 'Pricing & Catalog',
    outcome: 'Reduce Revenue Leakage',
    metric: 'Active price lists and rule consistency',
    description: 'Evaluates price list structure (standard vs. legacy), pricing rule consistency, and seat/employee-based toggle support.',
  },

  // --- Contract Management (5) ---
  {
    name: 'E-Signature Integration',
    status: 'unable',
    addToEngagement: true,
    function: 'Contract Management',
    outcome: 'Accelerate Deal Velocity',
    metric: 'Manual PDF exports and signer entry per quote',
    description: 'Assesses whether e-signature (DocuSign) is natively connected to CPQ with auto-populated signers, fields, and shared envelope dashboard.',
  },
  {
    name: 'Clause Logic Automation',
    status: 'warning',
    addToEngagement: true,
    function: 'Contract Management',
    outcome: 'Ensure Compliance',
    metric: 'Clause rendering errors per quarter',
    description: 'Evaluates whether standard clauses switch on/off correctly based on deal flags (e.g., ATC clause when auto-renew=false).',
  },
  {
    name: 'Contract Pricing Integrity',
    status: 'warning',
    addToEngagement: true,
    function: 'Contract Management',
    outcome: 'Reduce Revenue Leakage',
    metric: 'Contracts with free-text pricing override',
    description: 'Checks whether contracts pull prices and terms from the system exclusively or allow free-text pricing that drifts from approved quotes.',
  },
  {
    name: 'Quote Version Control',
    status: 'warning',
    addToEngagement: false,
    function: 'Contract Management',
    outcome: 'Ensure Compliance',
    metric: 'Version noise from cloning workaround',
    description: 'Assesses whether quote versions are immutable post-signature and whether a single version is clearly marked as the source of truth.',
  },
  {
    name: 'Amendment Change Tracking',
    status: 'warning',
    addToEngagement: false,
    function: 'Contract Management',
    outcome: 'Ensure Compliance',
    metric: 'Line-item changes without reason codes',
    description: 'Evaluates whether all contract changes (quantity, swaps, term, ramps) are tracked with structured reason codes at line-item level.',
  },

  // --- Billing Integration (5) ---
  {
    name: 'Invoice Automation Level',
    status: 'unable',
    addToEngagement: true,
    function: 'Billing Integration',
    outcome: 'Reduce Revenue Leakage',
    metric: 'Billing schedules configured in CPQ',
    description: 'Measures whether invoices follow the quote billing schedule for subscriptions, usage, one-time, and services. Currently requires manual NetSuite setup.',
  },
  {
    name: 'Credit & Adjustment Lineage',
    status: 'warning',
    addToEngagement: true,
    function: 'Billing Integration',
    outcome: 'Reduce Revenue Leakage',
    metric: 'Credits without proper duration/ARR math',
    description: 'Assesses whether credits and adjustments have full lineage, proper prorated math, and linkage to original quotes and invoices.',
  },
  {
    name: 'Co-Terming & Proration',
    status: 'warning',
    addToEngagement: true,
    function: 'Billing Integration',
    outcome: 'Reduce Revenue Leakage',
    metric: 'Deals with missing prorated amount field',
    description: 'Evaluates whether co-terming and proration math is consistent, auditable, and has dedicated fields vs. being tracked only in credits.',
  },
  {
    name: 'Billing Schedule Alignment',
    status: 'unable',
    addToEngagement: false,
    function: 'Billing Integration',
    outcome: 'Reduce Revenue Leakage',
    metric: 'Contract-end-date billing mismatches',
    description: 'Checks whether all billing aligns to contract end dates with one consistent rulebook for proration, grouping, and forecasting.',
  },
  {
    name: 'Order Creation Automation',
    status: 'healthy',
    addToEngagement: false,
    function: 'Billing Integration',
    outcome: 'Accelerate Deal Velocity',
    metric: 'Order auto-creation rate',
    description: 'Measures whether accepted quotes automatically create orders/subscriptions with line-by-line activation via Salesforce flows.',
  },

  // --- Revenue Recognition (4) ---
  {
    name: 'Product-Level Revenue Scheduling',
    status: 'unable',
    addToEngagement: true,
    function: 'Revenue Recognition',
    outcome: 'Ensure Compliance',
    metric: 'Products with rev rec datapoints',
    description: 'Assesses whether revenue is scheduled at the product level with quote-to-invoice-to-revenue traceability within 0.5%.',
  },
  {
    name: 'Audit Trail Completeness',
    status: 'careful',
    addToEngagement: false,
    function: 'Revenue Recognition',
    outcome: 'Ensure Compliance',
    metric: 'Field history and change log coverage',
    description: 'Tracks whether all revenue-impacting changes have field history in SF and change logs in DH per version.',
  },
  {
    name: 'ARR & Quote History Integrity',
    status: 'warning',
    addToEngagement: true,
    function: 'Revenue Recognition',
    outcome: 'Reduce Revenue Leakage',
    metric: 'Early-renewal ARR inconsistencies',
    description: 'Evaluates whether ARR is consistent for early renewals and quote histories are tamper-proof for audit and M&A readiness.',
  },
  {
    name: 'Evidence Pack Generation',
    status: 'unable',
    addToEngagement: false,
    function: 'Revenue Recognition',
    outcome: 'Ensure Compliance',
    metric: 'Automated evidence packs per quarter',
    description: 'Measures whether one-click export of catalog, pricing, approvals, quotes, orders, invoices, and revenue schedules is available for audits.',
  },

  // --- System Integration (4) ---
  {
    name: 'CRM-CPQ Data Sync',
    status: 'careful',
    addToEngagement: false,
    function: 'System Integration',
    outcome: 'Optimize System Connectivity',
    metric: 'Subscription data sync accuracy',
    description: 'Measures the reliability of data flow between CRM and CPQ, including subscription object data quality and locked field behavior.',
  },
  {
    name: 'Integration Boundary Clarity',
    status: 'warning',
    addToEngagement: true,
    function: 'System Integration',
    outcome: 'Optimize System Connectivity',
    metric: 'Hidden business rules across DH/SFDC boundary',
    description: 'Evaluates whether integrations contain hidden business rules, wrong field mappings, or split credit logic across systems.',
  },
  {
    name: 'Deployment & Testing Discipline',
    status: 'unable',
    addToEngagement: false,
    function: 'System Integration',
    outcome: 'Optimize System Connectivity',
    metric: 'UAT environments and regression test coverage',
    description: 'Assesses whether Dev-UAT-Prod deployment discipline, sandbox environments, and seeded regression tests exist.',
  },
  {
    name: 'Error Message Quality',
    status: 'warning',
    addToEngagement: true,
    function: 'System Integration',
    outcome: 'Optimize System Connectivity',
    metric: 'Clear self-serve validation errors',
    description: 'Evaluates whether error messages clearly state what is blocked, why, and how to fix it, with floor/margin hints and field links.',
  },
];

export function countStatuses(items) {
  return items.reduce(
    (acc, item) => {
      if (item.status === 'healthy') acc.healthy++;
      else if (item.status === 'careful') acc.careful++;
      else if (item.status === 'warning') acc.warning++;
      else if (item.status === 'unable' || item.status === 'na') acc.unable++;
      return acc;
    },
    { healthy: 0, careful: 0, warning: 0, unable: 0 }
  );
}

export function groupBy(items, field) {
  return items.reduce((acc, item) => {
    const key = item[field] || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}
