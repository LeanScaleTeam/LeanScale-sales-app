/**
 * Compiles advisory markdown files from data/advisory/ into data/playbook-advisory.json
 *
 * Each markdown file should be named {playbook-id}.md and contain the full advisory
 * content from playbooks.leanscale.team.
 *
 * Usage: node scripts/build-advisory-json.js
 */
const fs = require('fs');
const path = require('path');

const ADVISORY_DIR = path.join(__dirname, '..', 'data', 'advisory');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'playbook-advisory.json');

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

function getSourceUrl(localId) {
  const slug = getSiteSlug(localId);
  const tier = CORE_SLUGS.includes(slug) ? 'core' : 'extended';
  return `https://playbooks.leanscale.team/docs/${tier}/${slug}/advisory`;
}

function parseSections(markdown) {
  const sections = {};

  // Match both formats: "## 1) Project Overview" and "## Project Overview"
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

    const key = titleToKey(matches[i].title);
    if (key && content) {
      sections[key] = content;
    }
  }

  return sections;
}

function titleToKey(title) {
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

function main() {
  if (!fs.existsSync(ADVISORY_DIR)) {
    console.log('No data/advisory/ directory found. Run fetch-advisory-content.js first.');
    process.exit(1);
  }

  const files = fs.readdirSync(ADVISORY_DIR).filter(f => f.endsWith('.md'));
  console.log(`Found ${files.length} advisory markdown files`);

  const advisory = {};

  for (const file of files) {
    const localId = file.replace('.md', '');
    const filePath = path.join(ADVISORY_DIR, file);
    const markdown = fs.readFileSync(filePath, 'utf8');

    const sections = parseSections(markdown);
    const sectionCount = Object.keys(sections).length;

    if (sectionCount > 0) {
      advisory[localId] = {
        sourceUrl: getSourceUrl(localId),
        fetchedAt: new Date().toISOString(),
        sections,
      };
      console.log(`  ${localId}: ${sectionCount} sections`);
    } else {
      console.log(`  ${localId}: WARNING - no sections parsed`);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(advisory, null, 2));
  console.log(`\nWrote ${Object.keys(advisory).length} playbooks to ${OUTPUT_FILE}`);
}

main();
