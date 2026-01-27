// Diagnostic data parsed from CSV
// Health statuses: 🟢 = healthy, 🟡 = careful, 🔴 = warning, ⚫ = unable

export const processes = [
  { name: "Activity Capture", status: "warning", addToEngagement: true },
  { name: "Automated Inbound Data Enrichment", status: "warning", addToEngagement: true },
  { name: "Customer Lifecycle (GTM Lifecycle)", status: "warning", addToEngagement: true },
  { name: "Forecasting Process Implementation", status: "warning", addToEngagement: true },
  { name: "Market Map", status: "careful", addToEngagement: true },
  { name: "Lead & Opportunity Attribution", status: "careful", addToEngagement: true },
  { name: "Lead Lifecycle (GTM Lifecycle)", status: "warning", addToEngagement: true },
  { name: "Lead Routing", status: "warning", addToEngagement: true },
  { name: "Marketing-to-Sales Handoff & SLA Tracking", status: "careful", addToEngagement: true },
  { name: "Sales Lifecycle (GTM Lifecycle)", status: "unable", addToEngagement: true },
  { name: "Sales Territory Design and System Implementation", status: "careful", addToEngagement: true },
  { name: "ABM / ABS Process and System", status: "careful", addToEngagement: false },
  { name: "AI Automated Inbound", status: "careful", addToEngagement: false },
  { name: "ARR Reporting", status: "careful", addToEngagement: false },
  { name: "Automated Outbound Process", status: "unable", addToEngagement: false },
  { name: "CLM Implementation", status: "healthy", addToEngagement: false },
  { name: "Commission Tool Implementation", status: "careful", addToEngagement: false },
  { name: "Conversation Intelligence Implementation", status: "warning", addToEngagement: false },
  { name: "CPQ Implementation", status: "unable", addToEngagement: false },
  { name: "CRM Deduplication", status: "unable", addToEngagement: false },
  { name: "CRM Deduplication Ongoing Tool", status: "healthy", addToEngagement: false },
  { name: "Customer Health Model", status: "warning", addToEngagement: false },
  { name: "Customer Segmentation", status: "healthy", addToEngagement: false },
  { name: "Customer Success Platform Implementation", status: "careful", addToEngagement: false },
  { name: "E-Signature Implementation", status: "healthy", addToEngagement: false },
  { name: "Email Operations: Nurture Program Build & Management", status: "healthy", addToEngagement: false },
  { name: "Email Operations: Subscription & Compliance Framework", status: "healthy", addToEngagement: false },
  { name: "Email Operations: Templates & Build Process", status: "careful", addToEngagement: false },
  { name: "Event Operations: Event Platform Implementation", status: "warning", addToEngagement: false },
  { name: "Event Operations: Lead List Intake Process", status: "unable", addToEngagement: false },
  { name: "Executive Reporting Suite", status: "careful", addToEngagement: false },
  { name: "Foundational Automations and Reporting Logic", status: "warning", addToEngagement: false },
  { name: "Growth Model", status: "unable", addToEngagement: false },
  { name: "GTM Lifecycle", status: "healthy", addToEngagement: false },
  { name: "Lead Scoring Model Design (Product-Led)", status: "warning", addToEngagement: false },
  { name: "Lead Scoring Model Design (Sales-Led)", status: "unable", addToEngagement: false },
  { name: "Marketing Automation Platform Implementation", status: "healthy", addToEngagement: false },
  { name: "Marketing Database Segmentation", status: "careful", addToEngagement: false },
  { name: "NPS and Voice of Customer Launch", status: "warning", addToEngagement: false },
  { name: "Physical Event Process and ROI Reporting", status: "unable", addToEngagement: false },
  { name: "PLG GTM Design", status: "careful", addToEngagement: false },
  { name: "Quotas and Target Setting", status: "unable", addToEngagement: false },
  { name: "Quote to Cash", status: "healthy", addToEngagement: false },
  { name: "Renewal Management", status: "unable", addToEngagement: false },
  { name: "Renewal, Churn, NRR/GRR Reporting", status: "healthy", addToEngagement: false },
  { name: "Revenue Recognition", status: "warning", addToEngagement: false },
  { name: "Sales Engagement Platform", status: "warning", addToEngagement: false },
  { name: "Sales Qualification Methodology", status: "healthy", addToEngagement: false },
  { name: "Speed-to-Lead", status: "healthy", addToEngagement: false },
  { name: "Support AI Chatbot / Chat Platform", status: "unable", addToEngagement: false },
  { name: "Support System Implementation", status: "warning", addToEngagement: false },
  { name: "Website Lead Capture & Form Configuration", status: "warning", addToEngagement: false },
  { name: "Partnership Success Platform Implementation", status: "unable", addToEngagement: false },
  { name: "CRM → ERP Integration", status: "unable", addToEngagement: false },
];

export const power10Metrics = [
  { name: "ARR", status: "na" },
  { name: "Bookings", status: "na" },
  { name: "Gross churn", status: "na" },
  { name: "Gross retention", status: "na" },
  { name: "MQL -> Opportunity conversion rate", status: "na" },
  { name: "MQL production", status: "na" },
  { name: "Net retention", status: "na" },
  { name: "Opportunity/Deal - CW cycle time", status: "na" },
  { name: "Opportunity/Deal -> CW conversion rate", status: "na" },
  { name: "Pipeline production", status: "na" },
];

export const tools = [
  { name: "CLM", status: "healthy" },
  { name: "Commission Management", status: "careful" },
  { name: "CPQ", status: "warning" },
  { name: "CRM", status: "unable" },
  { name: "Customer Success Platform (CSP)", status: "healthy" },
  { name: "Customer Support Platform", status: "careful" },
  { name: "Data Analytics", status: "warning" },
  { name: "Data Enrichment", status: "unable" },
  { name: "Lead Routing", status: "healthy" },
  { name: "Marketing Automation Platform (MAP)", status: "healthy" },
  { name: "Partner Success Platform", status: "careful" },
  { name: "Revenue Intelligence", status: "warning" },
  { name: "Sales Enablement", status: "unable" },
  { name: "Sales Engagement Platform", status: "healthy" },
  { name: "Territory Planning", status: "careful" },
  { name: "De-duplication Tool", status: "healthy" },
  { name: "Support AI Chatbot", status: "unable" },
];

// Helper to count statuses
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

// Map emoji to status
export function emojiToStatus(emoji) {
  if (emoji === '🟢') return 'healthy';
  if (emoji === '🟡') return 'careful';
  if (emoji === '🔴') return 'warning';
  if (emoji === '⚫') return 'unable';
  return 'na';
}

export function statusToLabel(status) {
  if (status === 'healthy') return 'Healthy';
  if (status === 'careful') return 'Careful';
  if (status === 'warning') return 'Warning';
  if (status === 'unable') return 'Unable to Report';
  return 'N/A';
}
