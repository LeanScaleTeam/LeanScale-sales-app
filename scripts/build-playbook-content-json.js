/**
 * Compiles playbook markdown files from data/{advisory,methodology,implementation}/
 * into data/playbook-advisory.json (advisory sections only, backward compatible)
 * and data/playbook-extended.json (all three content types).
 *
 * Usage: node scripts/build-playbook-content-json.js
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const ADVISORY_DIR = path.join(DATA_DIR, 'advisory');
const METHODOLOGY_DIR = path.join(DATA_DIR, 'methodology');
const IMPLEMENTATION_DIR = path.join(DATA_DIR, 'implementation');
const ADVISORY_OUTPUT = path.join(DATA_DIR, 'playbook-advisory.json');
const EXTENDED_OUTPUT = path.join(DATA_DIR, 'playbook-extended.json');

// ID overrides: local playbook ID -> site URL slug
const ID_TO_SITE_SLUG = {
  'automated-inbound-data-enrichment': 'automated-inbound',
  'lead-and-opportunity-attribution': 'attribution',
  'revenue-recognition': 'revrec',
  'hubspot-to-salesforce-crm-migration': 'hubspot-sfdc-migration',
  'speed-to-lead': 'speed-to-lead-sla-tracking',
};

const CORE_SLUGS = [
  'growth-model', 'gtm-lifecycle', 'market-map', 'automated-inbound',
  'attribution', 'sales-territory-design', 'lead-routing',
  'speed-to-lead-sla-tracking', 'hubspot-sfdc-migration',
  'cpq-implementation', 'revrec', 'billing', 'metering',
  'pricing-and-packaging',
];

function getSiteSlug(localId) {
  return ID_TO_SITE_SLUG[localId] || localId;
}

function getSourceUrl(localId, contentType) {
  const slug = getSiteSlug(localId);
  const tier = CORE_SLUGS.includes(slug) ? 'core' : 'extended';
  return `https://playbooks.leanscale.team/docs/${tier}/${slug}/${contentType}`;
}

// --- Advisory section parser ---
function parseAdvisorySections(markdown) {
  const sections = {};
  const sectionRegex = /^## (?:\d+\)\s+)?(.+?)$/gm;
  const matches = [];
  let match;

  while ((match = sectionRegex.exec(markdown)) !== null) {
    matches.push({
      title: match[1].trim(),
      index: match.index,
      fullMatch: match[0],
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].fullMatch.length;
    const end = i + 1 < matches.length ? matches[i + 1].index : markdown.length;
    const content = markdown.slice(start, end).trim();

    const key = advisoryTitleToKey(matches[i].title);
    if (key && content) {
      sections[key] = content;
    }
  }

  return sections;
}

function advisoryTitleToKey(title) {
  const normalized = title.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
  const map = {
    'project overview': 'projectOverview',
    'tools  systems': 'toolsAndSystems',
    'tools systems': 'toolsAndSystems',
    'tools and systems': 'toolsAndSystems',
    'stakeholders  roles': 'stakeholdersAndRoles',
    'stakeholders roles': 'stakeholdersAndRoles',
    'stakeholders and roles': 'stakeholdersAndRoles',
    'scoping': 'scoping',
    'discovery questions': 'discoveryQuestions',
    'overcoming common belief barriers': 'beliefBarriers',
    'common objections': 'beliefBarriers',
    'overcoming belief barriers': 'beliefBarriers',
    'belief barriers': 'beliefBarriers',
    'metrics impact success measurement': 'metricsImpact',
    'metrics impact and success measurement': 'metricsImpact',
    'metrics success measurement': 'metricsImpact',
    'references': 'references',
    'scoping factors': 'scoping',
  };
  return map[normalized] || null;
}

// --- Methodology section parser ---
function parseMethodologySections(markdown) {
  const sections = {};
  const sectionRegex = /^## (?:\d+\)\s+)?(.+?)$/gm;
  const matches = [];
  let match;

  while ((match = sectionRegex.exec(markdown)) !== null) {
    matches.push({
      title: match[1].trim(),
      index: match.index,
      fullMatch: match[0],
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].fullMatch.length;
    const end = i + 1 < matches.length ? matches[i + 1].index : markdown.length;
    const content = markdown.slice(start, end).trim();

    const key = methodologyTitleToKey(matches[i].title);
    if (key && content) {
      sections[key] = content;
    }
  }

  return sections;
}

function methodologyTitleToKey(title) {
  const normalized = title.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
  const map = {
    'core concepts': 'coreConcepts',
    'decision frameworks': 'decisionFrameworks',
    'benchmarks  standards': 'benchmarks',
    'benchmarks standards': 'benchmarks',
    'benchmarks and standards': 'benchmarks',
    'calculations  scoring': 'calculations',
    'calculations scoring': 'calculations',
    'calculations and scoring': 'calculations',
    'edge cases': 'edgeCases',
    'references': 'references',
  };
  return map[normalized] || null;
}

// --- Implementation section parser ---
function parseImplementationSections(markdown) {
  const sections = {};
  const sectionRegex = /^## (?:\d+\)\s+)?(.+?)$/gm;
  const matches = [];
  let match;

  while ((match = sectionRegex.exec(markdown)) !== null) {
    matches.push({
      title: match[1].trim(),
      index: match.index,
      fullMatch: match[0],
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].fullMatch.length;
    const end = i + 1 < matches.length ? matches[i + 1].index : markdown.length;
    const content = markdown.slice(start, end).trim();

    const key = implementationTitleToKey(matches[i].title);
    if (key && content) {
      sections[key] = content;
    }
  }

  return sections;
}

function implementationTitleToKey(title) {
  const normalized = title.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim();
  const map = {
    'project onepager': 'projectOnePager',
    'project one pager': 'projectOnePager',
    'phase  strategy': 'phaseStrategy',
    'phase strategy': 'phaseStrategy',
    'phase  engineering': 'phaseEngineering',
    'phase engineering': 'phaseEngineering',
    'phase  enablement': 'phaseEnablement',
    'phase enablement': 'phaseEnablement',
    'phase  handoff': 'phaseHandoff',
    'phase handoff': 'phaseHandoff',
    'deliverables summary': 'deliverables',
    'deliverables  assets summary': 'deliverables',
    'references': 'references',
  };
  return map[normalized] || null;
}

// --- Generic raw content parser (stores full markdown under ## headings) ---
function parseRawSections(markdown) {
  const sections = {};
  const sectionRegex = /^## (?:\d+\)\s+)?(.+?)$/gm;
  const matches = [];
  let match;

  while ((match = sectionRegex.exec(markdown)) !== null) {
    matches.push({
      title: match[1].trim(),
      index: match.index,
      fullMatch: match[0],
    });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index + matches[i].fullMatch.length;
    const end = i + 1 < matches.length ? matches[i + 1].index : markdown.length;
    const content = markdown.slice(start, end).trim();
    if (content) {
      sections[matches[i].title] = content;
    }
  }

  return sections;
}

function readDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md'));
}

function main() {
  const advisoryFiles = readDir(ADVISORY_DIR);
  const methodologyFiles = readDir(METHODOLOGY_DIR);
  const implementationFiles = readDir(IMPLEMENTATION_DIR);

  console.log(`Found: ${advisoryFiles.length} advisory, ${methodologyFiles.length} methodology, ${implementationFiles.length} implementation files`);

  // Collect all unique IDs across all content types
  const allIds = new Set();
  advisoryFiles.forEach(f => allIds.add(f.replace('.md', '')));
  methodologyFiles.forEach(f => allIds.add(f.replace('.md', '')));
  implementationFiles.forEach(f => allIds.add(f.replace('.md', '')));

  // Build advisory-only output (backward compatible)
  const advisory = {};
  // Build extended output (all three types)
  const extended = {};

  for (const localId of [...allIds].sort()) {
    const advisoryPath = path.join(ADVISORY_DIR, `${localId}.md`);
    const methodologyPath = path.join(METHODOLOGY_DIR, `${localId}.md`);
    const implementationPath = path.join(IMPLEMENTATION_DIR, `${localId}.md`);

    const entry = {
      sourceUrls: {},
      fetchedAt: new Date().toISOString(),
    };

    // Advisory
    if (fs.existsSync(advisoryPath)) {
      const md = fs.readFileSync(advisoryPath, 'utf8');
      const sections = parseAdvisorySections(md);
      const count = Object.keys(sections).length;
      if (count > 0) {
        advisory[localId] = {
          sourceUrl: getSourceUrl(localId, 'advisory'),
          fetchedAt: entry.fetchedAt,
          sections,
        };
        entry.advisory = sections;
        entry.sourceUrls.advisory = getSourceUrl(localId, 'advisory');
        process.stdout.write(`  ${localId}: advisory=${count}`);
      }
    }

    // Methodology
    if (fs.existsSync(methodologyPath)) {
      const md = fs.readFileSync(methodologyPath, 'utf8');
      const sections = parseMethodologySections(md);
      const rawSections = parseRawSections(md);
      const count = Object.keys(sections).length;
      const rawCount = Object.keys(rawSections).length;
      // Use structured sections if we got good matches, else use raw
      if (count > 0) {
        entry.methodology = sections;
        entry.sourceUrls.methodology = getSourceUrl(localId, 'methodology');
        process.stdout.write(` methodology=${count}`);
      } else if (rawCount > 0) {
        entry.methodologyRaw = rawSections;
        entry.sourceUrls.methodology = getSourceUrl(localId, 'methodology');
        process.stdout.write(` methodology(raw)=${rawCount}`);
      }
    }

    // Implementation
    if (fs.existsSync(implementationPath)) {
      const md = fs.readFileSync(implementationPath, 'utf8');
      const sections = parseImplementationSections(md);
      const rawSections = parseRawSections(md);
      const count = Object.keys(sections).length;
      const rawCount = Object.keys(rawSections).length;
      if (count > 0) {
        entry.implementation = sections;
        entry.sourceUrls.implementation = getSourceUrl(localId, 'implementation');
        process.stdout.write(` implementation=${count}`);
      } else if (rawCount > 0) {
        entry.implementationRaw = rawSections;
        entry.sourceUrls.implementation = getSourceUrl(localId, 'implementation');
        process.stdout.write(` implementation(raw)=${rawCount}`);
      }
    }

    if (entry.advisory || entry.methodology || entry.methodologyRaw || entry.implementation || entry.implementationRaw) {
      extended[localId] = entry;
      console.log('');
    }
  }

  // Write backward-compatible advisory JSON
  fs.writeFileSync(ADVISORY_OUTPUT, JSON.stringify(advisory, null, 2));
  console.log(`\nWrote ${Object.keys(advisory).length} playbooks to ${ADVISORY_OUTPUT}`);

  // Write extended JSON with all content types
  fs.writeFileSync(EXTENDED_OUTPUT, JSON.stringify(extended, null, 2));
  const withMethodology = Object.values(extended).filter(e => e.methodology || e.methodologyRaw).length;
  const withImplementation = Object.values(extended).filter(e => e.implementation || e.implementationRaw).length;
  console.log(`Wrote ${Object.keys(extended).length} playbooks to ${EXTENDED_OUTPUT}`);
  console.log(`  With methodology: ${withMethodology}`);
  console.log(`  With implementation: ${withImplementation}`);
}

main();
