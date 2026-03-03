/**
 * Fetches playbook content from playbooks.leanscale.team for all playbooks.
 * Supports three content types: advisory, methodology, implementation.
 *
 * Usage:
 *   node scripts/fetch-advisory-content.js                  # fetch advisory only (default)
 *   node scripts/fetch-advisory-content.js --type methodology
 *   node scripts/fetch-advisory-content.js --type implementation
 *   node scripts/fetch-advisory-content.js --type all       # fetch all three
 *   node scripts/fetch-advisory-content.js --force           # refetch existing files
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://playbooks.leanscale.team';

// Map local playbook IDs to their site URL paths
// Most IDs match directly; these are the exceptions
const ID_OVERRIDES = {
  'automated-inbound-data-enrichment': 'automated-inbound',
  'lead-and-opportunity-attribution': 'attribution',
  'revenue-recognition': 'revrec',
  'hubspot-to-salesforce-crm-migration': 'hubspot-sfdc-migration',
  'speed-to-lead': 'speed-to-lead-sla-tracking',
};

// IDs with no advisory page on the site
const SKIP_IDS = ['quote-to-cash', 'ai-automated-inbound'];

// Core playbook IDs (rest are extended)
const CORE_IDS = [
  'growth-model', 'gtm-lifecycle', 'market-map', 'automated-inbound',
  'attribution', 'sales-territory-design', 'lead-routing',
  'speed-to-lead-sla-tracking', 'hubspot-sfdc-migration',
  'cpq-implementation', 'revrec', 'billing', 'metering',
  'pricing-and-packaging',
];

function getSiteId(localId) {
  return ID_OVERRIDES[localId] || localId;
}

function getTier(siteId) {
  return CORE_IDS.includes(siteId) ? 'core' : 'extended';
}

function getContentUrl(localId, contentType) {
  const siteId = getSiteId(localId);
  const tier = getTier(siteId);
  return `${BASE_URL}/docs/${tier}/${siteId}/${contentType}`;
}

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const makeRequest = (requestUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }
      const urlObj = new URL(requestUrl);
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        headers: { 'User-Agent': 'LeanScale-PlaybookSync/1.0' },
      };
      https.get(options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const redirectUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : `https://${urlObj.hostname}${res.headers.location}`;
          makeRequest(redirectUrl, redirectCount + 1);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    };
    makeRequest(url);
  });
}

// Convert HTML to clean markdown-like text
function htmlToText(html) {
  let text = html;

  // Remove script/style tags
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');

  // Convert headings
  text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n');
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n');
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n');
  text = text.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '#### $1\n\n');
  text = text.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '##### $1\n\n');

  // Convert bold/italic
  text = text.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  text = text.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  text = text.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  text = text.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');

  // Convert list items
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');

  // Convert table rows
  text = text.replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, (match, content) => {
    const cells = [];
    content.replace(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi, (_, cellContent) => {
      cells.push(cellContent.replace(/<[^>]+>/g, '').trim());
    });
    return '| ' + cells.join(' | ') + ' |\n';
  });

  // Convert paragraphs and line breaks
  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  text = text.replace(/<hr\s*\/?>/gi, '\n---\n\n');

  // Remove remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&#x27;/g, "'");
  text = text.replace(/&mdash;/g, '—');
  text = text.replace(/&ndash;/g, '–');
  text = text.replace(/&rarr;/g, '→');

  // Clean up whitespace
  text = text.replace(/\n{3,}/g, '\n\n');
  text = text.trim();

  return text;
}

function extractArticleContent(html) {
  // Docusaurus wraps content in <article> or <div class="markdown">
  const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) return articleMatch[1];

  const markdownMatch = html.match(/<div class="markdown">([\s\S]*?)<\/div>\s*<\/div>/i);
  if (markdownMatch) return markdownMatch[1];

  // Fallback: extract main content area
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return mainMatch[1];

  return html;
}

function parseAdvisoryContent(html) {
  const article = extractArticleContent(html);
  const text = htmlToText(article);

  const sections = {};

  // Parse sections by ## headings
  const sectionRegex = /^## (.+?)$/gm;
  const headings = [];
  let match;

  while ((match = sectionRegex.exec(text)) !== null) {
    headings.push({ title: match[1].trim(), index: match.index });
  }

  for (let i = 0; i < headings.length; i++) {
    const start = headings[i].index + headings[i].title.length + 4; // ## + title + \n\n
    const end = i + 1 < headings.length ? headings[i + 1].index : text.length;
    const content = text.slice(start, end).trim();

    // Normalize heading titles to camelCase keys
    const key = headingToKey(headings[i].title);
    if (key && content) {
      sections[key] = content;
    }
  }

  return sections;
}

function headingToKey(heading) {
  const normalized = heading.replace(/[^a-zA-Z0-9\s]/g, '').trim().toLowerCase();
  const map = {
    'project overview': 'projectOverview',
    'key unlocks': 'keyUnlocks',
    'business outcomes': 'businessOutcomes',
    'beneficiaries': 'beneficiaries',
    'pain points solved': 'painPointsSolved',
    'supporting data': 'supportingData',
    'key frameworks': 'keyFrameworks',
    'primary tools': 'primaryTools',
    'stakeholder roles': 'stakeholderRoles',
    'scoping factors': 'scopingFactors',
    'implementation approaches': 'implementationApproaches',
    'discovery questions': 'discoveryQuestions',
    'preimplementation information needed': 'preImplementationInfo',
    'overcoming belief barriers': 'beliefBarriers',
    'metrics impact  success measurement': 'metricsImpact',
    'metrics impact success measurement': 'metricsImpact',
  };
  return map[normalized] || null;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const CONTENT_TYPES = ['advisory', 'methodology', 'implementation'];

function getContentTypes() {
  const typeArg = process.argv.find(a => a.startsWith('--type='));
  if (typeArg) {
    const val = typeArg.split('=')[1];
    if (val === 'all') return CONTENT_TYPES;
    if (CONTENT_TYPES.includes(val)) return [val];
  }
  const typeIdx = process.argv.indexOf('--type');
  if (typeIdx !== -1 && process.argv[typeIdx + 1]) {
    const val = process.argv[typeIdx + 1];
    if (val === 'all') return CONTENT_TYPES;
    if (CONTENT_TYPES.includes(val)) return [val];
  }
  return ['advisory']; // default
}

async function main() {
  const types = getContentTypes();
  const force = process.argv.includes('--force');

  // Ensure all output directories exist
  for (const type of types) {
    const dir = path.join(__dirname, '..', 'data', type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Read existing playbook content to get the list of IDs
  const contentFile = fs.readFileSync(
    path.join(__dirname, '..', 'data', 'playbook-content.js'),
    'utf8'
  );

  const idMatches = contentFile.match(/'([a-z][a-z0-9-]+)':\s*\{/g);
  const localIds = idMatches.map(m => m.match(/'([^']+)'/)[1]);

  console.log(`Found ${localIds.length} playbook IDs in playbook-content.js`);
  console.log(`Fetching content types: ${types.join(', ')}`);

  for (const contentType of types) {
    console.log(`\n--- ${contentType.toUpperCase()} ---`);
    const outputDir = path.join(__dirname, '..', 'data', contentType);

    let successCount = 0;
    let errorCount = 0;
    let skipCount = 0;

    for (const localId of localIds) {
      if (SKIP_IDS.includes(localId)) {
        console.log(`  SKIP: ${localId} (no page)`);
        skipCount++;
        continue;
      }

      const mdPath = path.join(outputDir, `${localId}.md`);
      if (fs.existsSync(mdPath) && !force) {
        skipCount++;
        continue;
      }

      const url = getContentUrl(localId, contentType);
      process.stdout.write(`  Fetching: ${localId} (${contentType})... `);

      try {
        const html = await fetchPage(url);
        const article = extractArticleContent(html);
        const markdown = htmlToText(article);

        if (markdown.length > 100) {
          fs.writeFileSync(mdPath, markdown);
          console.log(`OK (${markdown.length} chars)`);
          successCount++;
        } else {
          console.log('WARN: content too short, skipping');
        }
      } catch (err) {
        console.log(`ERROR: ${err.message}`);
        errorCount++;
      }

      await sleep(200);
    }

    console.log(`${contentType}: ${successCount} fetched, ${skipCount} skipped, ${errorCount} errors`);
  }

  console.log(`\nRun 'node scripts/build-playbook-content-json.js' to compile into JSON`);
}

main().catch(console.error);
