/**
 * Demo v3 Intake Answers
 *
 * Curated set representing a mid-maturity B2B SaaS company on Salesforce.
 * Produces a realistic mix of scores (2-4 range) to showcase the diagnostic
 * value proposition to demo visitors.
 *
 * Profile: ~30-rep SaaS, $10-20M ARR, blended GTM, building partner program.
 * Strong in CRM basics / pipeline, weak in planning / enablement / coaching.
 */
export const DEMO_INTAKE_ANSWERS = {
  // Section A: Company Profile
  A1: 'Salesforce',
  A2: '16-50',
  A3: '$5-20M',
  A4: 'Blended',
  A5: 'Building',

  // Section B: Tools (partial adoption — has basics, missing advanced)
  B1_tools: [
    'sales_engagement',
    'data_enrichment',
    'support',
  ],

  // Section C: Processes (mixed maturity)
  C1: 'Mix',
  C2: 'Same day',
  C3: 'Yes, criteria-based',
  C4: 'BANT',
  C5: 'Some stages',
  C6: 'Optional field',
  C7: 'Informal',
  C8: 'Manual tracking',
  C9: 'Yes, ad hoc',
  C10: 'Periodic manual cleanup',
  C11: 'Yes, in CRM/MAP',
  C12: 'Occasionally',
  C13: 'Informal',
  C14: 'Basic',
  C15: 'Monthly',
  C16: 'Shared',
  C17: 'Yes basic',
  C18: 'No',

  // Section D: Reporting & Dashboards
  D2: 'Somewhat',
  D3: 'Spreadsheet',
  D5: 'Manual email',
  D6: 'Tribal knowledge',

  // Power 10 Metrics (4 of 10 reportable → score ~3)
  D5_arr: 'Manual calc',
  D5_bookings: 'Manual calc',
  D5_pipeline: 'Automated',
  D5_mql: 'Not reported',
  D5_gross_churn: 'Not reported',
  D5_grr: 'Not reported',
  D5_nrr: 'Manual calc',
  D5_mql_opp: 'Not reported',
  D5_opp_cw: 'Manual calc',
  D5_cycle: 'Not reported',

  // Attribution & Win/Loss
  M4_pipeline: 'Yes, in CRM',
  M4_model: 'First-touch',
  M7_tracking: 'Tags/fields',
  R4_winloss: 'Ad hoc',
};
