#!/usr/bin/env node
/**
 * Pre-extracts enrichment fields from playbook advisory markdown at build time.
 *
 * Reads data/playbook-content.js (which contains full advisory markdown)
 * and writes data/playbook-enrichment-data.js with only the structured fields
 * needed by EngagementPitch (description, impactTemplate, outcomeStatement,
 * outcomes, power10Metrics).
 *
 * This moves ~8.6MB of markdown parsing from runtime (client bundle) to
 * build time, reducing the diagnostic page bundle by ~8MB.
 */

import { createRequire } from 'module';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Extraction helpers (duplicated from lib/playbook-enrichment.js) ──────────
// Must be CJS-compatible here since this runs as a build script.

function getSection(advisory, headerPattern) {
  if (!advisory) return null;
  const regex = new RegExp(`### ${headerPattern}\\n([\\s\\S]*?)(?=\\n### |\\n## |\\n# |$)`);
  const match = advisory.match(regex);
  return match ? match[1].trim() : null;
}

function parseTableRows(tableText) {
  if (!tableText) return [];
  const lines = tableText.split('\n').filter(l => l.trim().startsWith('|'));
  return lines.slice(2).map(line => {
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    return { col1: cells[0] || '', col2: cells[1] || '' };
  });
}

function parseBullets(text) {
  if (!text) return [];
  return text
    .split('\n')
    .filter(l => /^\s*[-*]\s/.test(l))
    .map(l => l.replace(/^\s*[-*]\s+/, '').trim())
    .filter(Boolean);
}

function cleanMarkdown(text) {
  if (!text) return text;
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s*\[\d+\]/g, '')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function extractProblemStatement(advisory) {
  const dataSection = getSection(advisory, 'The Data Behind the Problem');
  if (dataSection) {
    const bullets = parseBullets(dataSection);
    if (bullets.length > 0) return cleanMarkdown(bullets.slice(0, 3).join(' '));
    const tableRows = parseTableRows(dataSection);
    if (tableRows.length > 0) return cleanMarkdown(tableRows.slice(0, 2).map(r => r.col2 || r.col1).join(' '));
    const para = dataSection.split('\n\n')[0];
    if (para && para.length > 20) {
      const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
      return cleanMarkdown(sentences.slice(0, 2).join(' '));
    }
  }
  const painSection = getSection(advisory, 'Pain Points this Project Solves');
  if (painSection) {
    const rows = parseTableRows(painSection);
    if (rows.length > 0) return cleanMarkdown(rows.slice(0, 2).map(r => r.col1).join('. ') + '.');
  }
  return null;
}

function extractImpactStatement(advisory) {
  const section = getSection(advisory, 'What business outcomes does this project drive\\?');
  if (!section) return null;
  const primaryMatch = section.match(/\*\*Primary Outcomes?:\*\*\n([\s\S]*?)(?=\*\*Secondary|$)/);
  const bullets = parseBullets(primaryMatch ? primaryMatch[1] : section);
  if (bullets.length === 0) return null;
  return cleanMarkdown(bullets.slice(0, 3).join('. ') + '.');
}

function extractImpactTemplate(advisory) {
  const section = getSection(advisory, 'Expected Outcomes');
  if (!section) {
    const impact = extractImpactStatement(advisory);
    if (impact) return `At {arrRange} ARR, this directly impacts your business: ${impact}`;
    return null;
  }
  const lines = section.split('\n').filter(l => l.trim().startsWith('|'));
  const dataLines = lines.slice(2);
  for (const line of dataLines) {
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length >= 3) {
      const metric = cleanMarkdown(cells[0]);
      const before = cleanMarkdown(cells[1]);
      const after = cleanMarkdown(cells[2]);
      if (metric && before && after) {
        return `For a company at {arrRange} ARR with {repCount} reps: ${metric} typically moves from ${before} to ${after}.`;
      }
    }
  }
  return null;
}

function extractOutcomeStatement(advisory) {
  const section = getSection(advisory, 'How to Measure Success');
  if (!section) return null;
  const leadingMatch = section.match(/\*\*Leading Indicators?[^*]*\*\*:?\n([\s\S]*?)(?=\*\*Lagging|$)/i);
  const bullets = parseBullets(leadingMatch ? leadingMatch[1] : section);
  if (bullets.length === 0) return null;
  return cleanMarkdown(bullets.slice(0, 3).join('. ') + '.');
}

function extractOutcomeTags(advisory) {
  const section = getSection(advisory, 'What business outcomes does this project drive\\?');
  if (!section) return [];
  const bullets = parseBullets(section);
  if (bullets.length === 0) return [];
  return bullets.slice(0, 2).map(b => {
    const clean = cleanMarkdown(b);
    return clean.length > 50 ? clean.slice(0, 47) + '...' : clean;
  });
}

function extractPower10Metrics(advisory) {
  const section = getSection(advisory, 'Power 10 Metrics Impacted');
  if (!section) return [];
  const lines = section.split('\n').filter(l => l.trim().startsWith('|'));
  return lines.slice(2)
    .map(line => {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      return cells[0] ? cleanMarkdown(cells[0]) : null;
    })
    .filter(Boolean);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const contentPath = join(__dirname, '..', 'data', 'playbook-content.js');
  const outputPath = join(__dirname, '..', 'data', 'playbook-enrichment-data.js');

  // Dynamic import of the ES module
  const { playbookContent } = await import(contentPath);

  const enrichmentData = {};
  let extracted = 0;
  let skipped = 0;

  for (const [slug, pb] of Object.entries(playbookContent)) {
    if (!pb?.advisory || pb.status === 'stub') {
      skipped++;
      continue;
    }

    const advisory = pb.advisory;
    enrichmentData[slug] = {
      description: extractProblemStatement(advisory),
      impactTemplate: extractImpactTemplate(advisory),
      outcomeStatement: extractOutcomeStatement(advisory),
      outcomes: extractOutcomeTags(advisory),
      power10Metrics: extractPower10Metrics(advisory),
    };
    extracted++;
  }

  const js = `// AUTO-GENERATED by scripts/extract-enrichment-data.js
// Do not edit manually. Run: node --experimental-vm-modules scripts/extract-enrichment-data.js
// Generated: ${new Date().toISOString()}
// Source: data/playbook-content.js (advisory markdown pre-extracted at build time)
export const playbookEnrichmentData = ${JSON.stringify(enrichmentData, null, 2)};
`;

  writeFileSync(outputPath, js);

  const sizeBefore = readFileSync(contentPath).length;
  const sizeAfter = Buffer.byteLength(js);
  console.log(`Extracted enrichment data from ${extracted} playbooks (${skipped} skipped)`);
  console.log(`Size: ${(sizeBefore / 1024 / 1024).toFixed(1)}MB → ${(sizeAfter / 1024).toFixed(0)}KB`);
  console.log(`Output: ${outputPath}`);
}

main().catch(err => { console.error(err); process.exit(1); });
