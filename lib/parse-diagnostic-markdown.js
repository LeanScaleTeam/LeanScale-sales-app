import { processes as defaultProcesses, power10MetricNames } from '../data/diagnostic-data';

/**
 * Browser-compatible markdown table parser for diagnostic data
 *
 * Parses markdown tables into the same data shape consumed by
 * DiagnosticResults and the diagnostic-data.js exports.
 *
 * Supports two formats:
 * 1. Template format: ## Processes / ## Tools / ## Power10 Metrics tables
 * 2. Tool Diagnostic Report format: ## Diagnostic Checklist Results, ## Installed Packages, etc.
 *
 * Works client-side (no fs/path dependencies) — pure string parsing.
 */

const VALID_STATUSES = ['healthy', 'careful', 'warning', 'unable'];

/** Map usage levels from Tool Diagnostic Reports to v1 statuses */
const USAGE_TO_STATUS = {
  'very active': 'healthy',
  'active': 'healthy',
  'low usage': 'careful',
  'installed': 'warning',
  'not found': 'unable',
  'none': 'unable',
};

/** Map report tool categories to process serviceIds */
const CATEGORY_TO_PROCESS = {
  'clm': 'clm-implementation',
  'cpq': 'cpq-implementation',
  'customer support': 'support-system-implementation',
  'data enrichment': 'automated-inbound-data-enrichment',
  'marketing automation': 'marketing-automation-platform-implementation',
  'revenue intelligence': 'revenue-intelligence-platform-implementation',
  'sales engagement': 'sales-engagement-platform-implementation',
  'commission management': 'commission-tool-implementation',
  'customer success': 'customer-success-platform-implementation',
  'partner success': 'partnership-success-platform-implementation',
  'lead routing': 'lead-routing',
  'sales enablement': 'sales-enablement-platform-implementation',
  'territory planning': 'sales-territory-design',
  'de-duplication': 'crm-deduplication',
  'data analytics': 'executive-reporting-suite',
  'support ai chatbot': 'support-system-implementation',
};

/**
 * Column mappings per diagnostic type
 * Maps expected column headers (lowercased) to our internal field names
 */
const COLUMN_MAPS = {
  gtm: {
    process: 'name',
    tool: 'name',
    service: 'name',
    name: 'name',
    status: 'status',
    include: 'addToEngagement',
    function: 'function',
    category: 'function',
    outcome: 'outcome',
    metric: 'metric',
    service_id: 'serviceId',
    service_type: 'serviceType',
    hours_month: 'hoursPerMonth',
    description: 'description',
  },
  clay: {
    process: 'name',
    name: 'name',
    status: 'status',
    include: 'addToEngagement',
    category: 'function', // mapped to 'function' field for groupBy compatibility
    function: 'function',
    outcome: 'outcome',
    metric: 'metric',
    description: 'description',
  },
  cpq: {
    process: 'name',
    name: 'name',
    status: 'status',
    include: 'addToEngagement',
    category: 'function',
    function: 'function',
    outcome: 'outcome',
    metric: 'metric',
    description: 'description',
  },
};

/**
 * Parse a markdown string containing diagnostic tables
 *
 * @param {string} markdown - The markdown content to parse
 * @param {string} diagnosticType - 'gtm' | 'clay' | 'cpq'
 * @returns {{ processes: Array, tools: Array, warnings: string[] }}
 */
export function parseDiagnosticMarkdown(markdown, diagnosticType = 'gtm') {
  // Auto-detect Tool Diagnostic Report format
  if (markdown.includes('## Diagnostic Checklist Results')) {
    return parseToolDiagnosticReport(markdown, diagnosticType);
  }

  const columnMap = COLUMN_MAPS[diagnosticType] || COLUMN_MAPS.gtm;
  const lines = markdown.split('\n');
  const warnings = [];

  let processes = [];
  let tools = [];
  let power10Metrics = [];
  let currentSection = null;

  const power10ColumnMap = {
    metric: 'name',
    name: 'name',
    able_to_report: 'ableToReport',
    status_against_plan: 'statusAgainstPlan',
    current_performance: 'currentPerformance',
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Detect section headers
    if (line.startsWith('## ')) {
      const heading = line.replace(/^##\s+/, '').toLowerCase();
      if (heading.includes('process')) {
        currentSection = 'processes';
      } else if (heading.includes('power10') || heading.includes('power 10')) {
        currentSection = 'power10';
      } else if (heading.includes('tool')) {
        currentSection = 'tools';
      } else if (heading.includes('status legend') || heading.includes('how to edit')) {
        currentSection = null;
      }
      continue;
    }

    // Parse table rows
    if (line.startsWith('|') && currentSection) {
      const mapToUse = currentSection === 'power10' ? power10ColumnMap : columnMap;
      const { rows, endIndex, parseWarnings } = parseMarkdownTable(lines, i, mapToUse);
      warnings.push(...parseWarnings);

      if (currentSection === 'processes') {
        processes = rows;
      } else if (currentSection === 'tools') {
        tools = rows;
      } else if (currentSection === 'power10') {
        power10Metrics = rows.map(r => ({
          name: r.name || '',
          ableToReport: r.ableToReport || 'unable',
          statusAgainstPlan: r.statusAgainstPlan || 'unable',
          currentPerformance: r.currentPerformance || null,
        }));
      }

      i = endIndex - 1;
      currentSection = null;
    }
  }

  // If no section headers found, try parsing the whole thing as a single table
  if (processes.length === 0 && tools.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('|')) {
        const { rows, endIndex, parseWarnings } = parseMarkdownTable(lines, i, columnMap);
        warnings.push(...parseWarnings);
        processes = rows;
        break;
      }
    }
  }

  // Validate
  if (processes.length === 0) {
    warnings.push('No processes found in the markdown. Make sure the table has a header row.');
  }

  const emptyNames = processes.filter(p => !p.name);
  if (emptyNames.length > 0) {
    warnings.push(`${emptyNames.length} process(es) have empty names.`);
  }

  const invalidStatuses = processes.filter(p => p.status && !VALID_STATUSES.includes(p.status));
  if (invalidStatuses.length > 0) {
    warnings.push(
      `${invalidStatuses.length} process(es) have invalid statuses. Valid: ${VALID_STATUSES.join(', ')}. ` +
      `Invalid items: ${invalidStatuses.map(p => `"${p.name}" (${p.status})`).join(', ')}`
    );
    // Auto-fix invalid statuses to 'unable'
    invalidStatuses.forEach(p => { p.status = 'unable'; });
  }

  return { processes, tools, power10Metrics, warnings };
}

/**
 * Parse a markdown table starting at the given line index
 */
function parseMarkdownTable(lines, startIndex, columnMap) {
  const rows = [];
  let headers = [];
  let i = startIndex;
  const parseWarnings = [];

  while (i < lines.length && lines[i].trim().startsWith('|')) {
    const line = lines[i].trim();
    const cells = line.split('|').slice(1, -1).map(c => c.trim());

    if (headers.length === 0) {
      // First row = headers
      headers = cells.map(h =>
        h.toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
      );
      i++;
      // Skip separator row (|---|---|...)
      if (i < lines.length && lines[i].includes('---')) {
        i++;
      }
      continue;
    }

    // Data row
    const row = {};
    cells.forEach((cell, idx) => {
      const header = headers[idx];
      if (!header) return;

      const fieldName = columnMap[header];
      if (!fieldName) return;

      if (fieldName === 'addToEngagement') {
        row[fieldName] = cell === '✓' || cell === '✔' || cell === 'x' || cell === 'X' || cell === 'yes' || cell === 'true';
      } else if (fieldName === 'status') {
        row[fieldName] = cell.toLowerCase().trim();
      } else {
        row[fieldName] = cell;
      }
    });

    // Only add rows with at least a name
    if (row.name) {
      // Ensure required fields have defaults
      if (!row.status) row.status = 'unable';
      if (row.addToEngagement === undefined) row.addToEngagement = false;
      if (!row.function) row.function = '';
      if (!row.outcome) row.outcome = '';
      if (!row.metric) row.metric = '';
      rows.push(row);
    }

    i++;
  }

  return { rows, endIndex: i, parseWarnings };
}

/**
 * Parse a Tool Diagnostic Report markdown file (e.g., Ocrolus format).
 * Extracts tools from multiple sections and maps to v1 diagnostic shape.
 */
function parseToolDiagnosticReport(markdown, diagnosticType) {
  const lines = markdown.split('\n');
  const warnings = [];
  const toolsMap = new Map(); // keyed by lowercase tool name
  const metadata = {};
  const crmOverview = {};

  // --- Parse header metadata (bold key-value pairs before first ---) ---
  for (const line of lines) {
    if (line.trim() === '---') break;
    const metaMatch = line.match(/^\*\*(.+?):\*\*\s*(.+)/);
    if (metaMatch) {
      const key = metaMatch[1].trim();
      const val = metaMatch[2].trim();
      if (key === 'Date') metadata.date = val;
      else if (key === 'Org Alias') metadata.orgAlias = val;
      else if (key === 'Username') metadata.username = val;
      else if (key === 'Instance URL') metadata.instanceUrl = val;
      else if (key === 'Org ID') metadata.orgId = val;
    }
  }

  // --- Parse sections ---
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('## ')) {
      const heading = line.replace(/^##\s+/, '');
      const headingLower = heading.toLowerCase();
      if (headingLower.includes('crm overview')) {
        currentSection = 'crm_overview';
      } else if (headingLower.includes('diagnostic checklist results')) {
        currentSection = 'checklist';
      } else if (headingLower.includes('installed packages')) {
        currentSection = 'packages';
      } else if (headingLower.includes('connected apps')) {
        currentSection = 'connected_apps';
      } else if (headingLower.includes('additional tools found')) {
        currentSection = 'additional_tools';
      } else if (headingLower.includes('usage summary')) {
        currentSection = 'usage_summary';
      } else if (headingLower.includes('summary')) {
        currentSection = 'summary';
      } else if (headingLower.includes('named credentials') || headingLower.includes('remote sites')) {
        currentSection = null; // skip
      } else {
        currentSection = null;
      }
      continue;
    }

    // Parse table rows
    if (line.startsWith('|') && currentSection) {
      const { rawRows, endIndex } = parseRawTable(lines, i);
      i = endIndex - 1;

      if (currentSection === 'crm_overview') {
        parseCrmOverview(rawRows, crmOverview);
      } else if (currentSection === 'checklist') {
        parseChecklistResults(rawRows, toolsMap);
      } else if (currentSection === 'packages') {
        parseInstalledPackages(rawRows, toolsMap);
      } else if (currentSection === 'connected_apps') {
        parseConnectedApps(rawRows, toolsMap);
      } else if (currentSection === 'additional_tools') {
        parseAdditionalTools(rawRows, toolsMap);
      } else if (currentSection === 'usage_summary') {
        parseUsageSummary(rawRows, toolsMap);
      }

      currentSection = null;
    }
  }

  // --- Build tools array ---
  const tools = Array.from(toolsMap.values()).map(t => ({
    name: t.name,
    status: t.status || 'unable',
    addToEngagement: t.status === 'healthy' || t.status === 'careful',
    category: t.category || '',
    serviceId: t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    notes: t.notes || '',
    oauthTokens: t.oauthTokens || null,
    recordCount: t.recordCount || null,
    packageVersion: t.packageVersion || null,
  }));

  // --- Match processes from default list ---
  const processes = defaultProcesses.map(p => {
    const proc = { ...p };
    // Find matching category for this process
    for (const [category, serviceId] of Object.entries(CATEGORY_TO_PROCESS)) {
      if (serviceId === proc.serviceId) {
        // Find best tool status for this category
        const categoryTools = tools.filter(t => t.category.toLowerCase() === category);
        if (categoryTools.length > 0) {
          // Use the best (healthiest) status among matching tools
          const statusPriority = { healthy: 0, careful: 1, warning: 2, unable: 3 };
          categoryTools.sort((a, b) => (statusPriority[a.status] || 3) - (statusPriority[b.status] || 3));
          proc.status = categoryTools[0].status;
        }
        break;
      }
    }
    return proc;
  });

  // --- Infer Power10 metrics from CRM overview ---
  const power10Metrics = (power10MetricNames || []).map(name => {
    const metric = { name, ableToReport: 'unable', statusAgainstPlan: 'unable', currentPerformance: null };
    if (name === 'Pipeline production' && (crmOverview.Opportunities || 0) > 0) {
      metric.ableToReport = 'healthy';
    } else if (name === 'MQL production' && (crmOverview.Leads || 0) > 0) {
      metric.ableToReport = 'healthy';
    }
    return metric;
  });

  if (tools.length === 0) {
    warnings.push('No tools found in the diagnostic report.');
  }

  return { processes, tools, power10Metrics, warnings, metadata, crmOverview };
}

/** Parse a raw markdown table into arrays of cell values with headers */
function parseRawTable(lines, startIndex) {
  const rawRows = [];
  let headers = [];
  let i = startIndex;

  while (i < lines.length && lines[i].trim().startsWith('|')) {
    const cells = lines[i].trim().split('|').slice(1, -1).map(c => c.trim());

    if (headers.length === 0) {
      headers = cells;
      i++;
      if (i < lines.length && lines[i].includes('---')) i++;
      continue;
    }

    const row = {};
    cells.forEach((cell, idx) => {
      if (headers[idx]) row[headers[idx]] = cell;
    });
    rawRows.push(row);
    i++;
  }

  return { rawRows, endIndex: i, headers };
}

function usageLevelToStatus(level) {
  if (!level) return 'unable';
  return USAGE_TO_STATUS[level.toLowerCase().trim()] || 'unable';
}

function parseNumberFromString(str) {
  if (!str) return 0;
  return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
}

function getOrCreateTool(toolsMap, name) {
  const key = name.toLowerCase().replace(/\*\*/g, '').trim();
  const cleanName = name.replace(/\*\*/g, '').trim();
  if (!toolsMap.has(key)) {
    toolsMap.set(key, { name: cleanName });
  }
  return toolsMap.get(key);
}

function parseCrmOverview(rows, crmOverview) {
  for (const row of rows) {
    const obj = row['Object'] || row['object'] || '';
    const count = row['Record Count'] || row['record count'] || '';
    if (obj && count) {
      crmOverview[obj.trim()] = parseNumberFromString(count);
    }
  }
}

function parseChecklistResults(rows, toolsMap) {
  for (const row of rows) {
    const category = (row['Category'] || '').trim();
    const toolFound = (row['Tool Found'] || '').replace(/\*\*/g, '').trim();
    const usageLevel = (row['Usage Level'] || '').trim();
    const notes = (row['Notes'] || '').trim();
    const status = usageLevelToStatus(usageLevel);

    if (toolFound === 'NOT FOUND' || !toolFound) {
      // Create a placeholder with the category name
      const tool = getOrCreateTool(toolsMap, category);
      tool.category = category;
      tool.status = 'unable';
      tool.notes = notes || `Not found - no ${category} tool detected`;
    } else {
      const tool = getOrCreateTool(toolsMap, toolFound);
      tool.category = category;
      tool.status = status;
      tool.notes = notes;
    }
  }
}

function parseInstalledPackages(rows, toolsMap) {
  for (const row of rows) {
    const pkgName = (row['Package Name'] || '').replace(/\*\*/g, '').trim();
    if (!pkgName) continue;

    // Try to match to existing tool by checking if tool name is contained in package name or vice versa
    let matched = false;
    for (const [key, tool] of toolsMap) {
      if (pkgName.toLowerCase().includes(key) || key.includes(pkgName.toLowerCase().split(' ')[0])) {
        tool.packageVersion = (row['Version'] || '').trim();
        const usageSignal = (row['Usage Signal'] || '').trim();
        if (usageSignal) tool.notes = tool.notes ? `${tool.notes}; Package: ${usageSignal}` : `Package: ${usageSignal}`;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const tool = getOrCreateTool(toolsMap, pkgName);
      tool.category = tool.category || 'Installed Package';
      tool.packageVersion = (row['Version'] || '').trim();
      const usageSignal = (row['Usage Signal'] || '').trim();
      if (usageSignal) {
        // Infer status from usage signal text
        const signalLower = usageSignal.toLowerCase();
        if (signalLower.includes('very active')) tool.status = 'healthy';
        else if (signalLower.includes('active')) tool.status = 'healthy';
        else tool.status = tool.status || 'warning';
        tool.notes = usageSignal;
      }
    }
  }
}

function parseConnectedApps(rows, toolsMap) {
  for (const row of rows) {
    const appName = (row['App Name'] || '').replace(/\*\*/g, '').trim();
    if (!appName) continue;

    const tokens = parseNumberFromString(row['OAuth Tokens'] || '');
    const category = (row['Category'] || '').trim();
    const notes = (row['Notes'] || '').trim();

    // Match to existing tool
    let matched = false;
    for (const [key, tool] of toolsMap) {
      const appLower = appName.toLowerCase();
      if (appLower.includes(key) || key.includes(appLower.split(' ')[0])) {
        tool.oauthTokens = (tool.oauthTokens || 0) + tokens;
        matched = true;
        break;
      }
    }

    if (!matched) {
      const tool = getOrCreateTool(toolsMap, appName);
      tool.category = tool.category || category || 'Connected App';
      tool.oauthTokens = tokens;
      // Infer status from notes/tokens
      if (notes.includes('VERY ACTIVE')) tool.status = 'healthy';
      else if (notes.includes('ACTIVE')) tool.status = 'healthy';
      else if (notes.includes('LOW USAGE')) tool.status = 'careful';
      else if (tokens > 20) tool.status = tool.status || 'healthy';
      else if (tokens > 0) tool.status = tool.status || 'careful';
      else tool.status = tool.status || 'warning';
      if (notes) tool.notes = tool.notes ? `${tool.notes}; ${notes}` : notes;
    }
  }
}

function parseAdditionalTools(rows, toolsMap) {
  for (const row of rows) {
    const toolName = (row['Tool'] || '').replace(/\*\*/g, '').trim();
    if (!toolName) continue;

    const tool = getOrCreateTool(toolsMap, toolName);
    tool.category = tool.category || (row['Type'] || '').trim();
    const usageSignal = (row['Usage Signal'] || '').trim();
    const notes = (row['Notes'] || '').trim();
    if (usageSignal) {
      const tokens = parseNumberFromString(usageSignal);
      if (tokens > 0) tool.oauthTokens = (tool.oauthTokens || 0) + tokens;
    }
    if (notes) tool.notes = tool.notes ? `${tool.notes}; ${notes}` : notes;
    if (!tool.status) tool.status = 'warning';
  }
}

function parseUsageSummary(rows, toolsMap) {
  for (const row of rows) {
    const toolName = (row['Tool'] || '').replace(/\*\*/g, '').trim();
    if (!toolName) continue;

    const totalRecords = parseNumberFromString(row['Total Records'] || '');
    const last90 = parseNumberFromString(row['Last 90 Days'] || '');
    const status = (row['Status'] || '').trim();

    for (const [key, tool] of toolsMap) {
      if (toolName.toLowerCase().includes(key) || key.includes(toolName.toLowerCase())) {
        tool.recordCount = totalRecords;
        if (status.toLowerCase() === 'active' && last90 > 0 && (!tool.status || tool.status === 'warning')) {
          tool.status = 'healthy';
        }
        break;
      }
    }
  }
}

/**
 * Generate a markdown template for a given diagnostic type
 * Useful for showing users the expected format
 */
export function generateMarkdownTemplate(diagnosticType = 'gtm') {
  if (diagnosticType === 'gtm') {
    return `## Processes

| Process | Status | Include | Function | Outcome | Metric | Service ID |
|---------|--------|---------|----------|---------|--------|------------|
| Example Process | healthy | ✓ | Marketing | Increase Pipeline | MQL production | example-process |

## Tools

| Tool | Status | Include | Category | Service ID |
|------|--------|---------|----------|------------|
| Example Tool | healthy | | CRM | example-tool |

## Power10 Metrics

| Metric | Able to Report | Status Against Plan | Current Performance |
|--------|---------------|--------------------|--------------------|
| ARR | healthy | careful | |
| Bookings | careful | unable | |
`;
  }

  const label = diagnosticType === 'clay' ? 'Clay' : 'Q2C';
  return `## Processes

| Process | Status | Include | Category | Outcome | Metric |
|---------|--------|---------|----------|---------|--------|
| Example Process | healthy | ✓ | ${label} Category | Improve Efficiency | Key Metric |
`;
}
