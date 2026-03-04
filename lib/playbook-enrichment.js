/**
 * Playbook Enrichment — Extract structured content from playbook advisory markdown
 * to prepopulate finding card PROBLEM, IMPACT, and OUTCOME sections.
 *
 * Used by the v3 adapter in EngagementPitch to turn thin competency descriptions
 * into compelling, data-backed narratives for prospect calls.
 */

import { playbookContent } from '../data/playbook-content';

/**
 * Extract a named ### section from advisory markdown.
 * Returns the content between the header and the next ### or ## header, trimmed.
 */
function getSection(advisory, headerPattern) {
  if (!advisory) return null;
  const regex = new RegExp(`### ${headerPattern}\\n([\\s\\S]*?)(?=\\n### |\\n## |\\n# |$)`);
  const match = advisory.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Extract plain text rows from a markdown table (skips header + separator rows).
 * Returns array of { col1, col2 } objects.
 */
function parseTableRows(tableText) {
  if (!tableText) return [];
  const lines = tableText.split('\n').filter(l => l.trim().startsWith('|'));
  // Skip header row and separator row (first two | lines)
  return lines.slice(2).map(line => {
    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    return { col1: cells[0] || '', col2: cells[1] || '' };
  });
}

/**
 * Extract bullet points from markdown text.
 * Returns array of strings (content after - or *).
 */
function parseBullets(text) {
  if (!text) return [];
  return text
    .split('\n')
    .filter(l => /^\s*[-*]\s/.test(l))
    .map(l => l.replace(/^\s*[-*]\s+/, '').trim())
    .filter(Boolean);
}

/**
 * Clean markdown formatting (bold, links, references) for display.
 */
function cleanMarkdown(text) {
  if (!text) return text;
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')       // bold
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')     // links
    .replace(/\s*\[\d+\]/g, '')             // reference numbers [1], [2]
    .replace(/&gt;/g, '>')                  // HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

// ─── Extractors ───────────────────────────────────────────────

/**
 * PROBLEM: Pain Points + Data Behind the Problem → 2-3 sentence description.
 */
export function extractProblemStatement(advisory) {
  // Try "Data Behind the Problem" first — it has stats and context
  const dataSection = getSection(advisory, 'The Data Behind the Problem');
  if (dataSection) {
    // Get first 2-3 meaningful sentences/bullets
    const bullets = parseBullets(dataSection);
    if (bullets.length > 0) {
      return cleanMarkdown(bullets.slice(0, 3).join(' '));
    }
    // If the section is a table (no bullets), extract data points column
    const tableRows = parseTableRows(dataSection);
    if (tableRows.length > 0) {
      // col2 is typically the data point; col1 is the problem area
      return cleanMarkdown(tableRows.slice(0, 2).map(r => r.col2 || r.col1).join(' '));
    }
    // Fallback: first paragraph
    const para = dataSection.split('\n\n')[0];
    if (para && para.length > 20) {
      // Trim to ~2 sentences
      const sentences = para.match(/[^.!?]+[.!?]+/g) || [para];
      return cleanMarkdown(sentences.slice(0, 2).join(' '));
    }
  }

  // Fallback to Pain Points table
  const painSection = getSection(advisory, 'Pain Points this Project Solves');
  if (painSection) {
    const rows = parseTableRows(painSection);
    if (rows.length > 0) {
      // Take first 2 pain points, quote them
      return cleanMarkdown(rows.slice(0, 2).map(r => r.col1).join('. ') + '.');
    }
  }

  return null;
}

/**
 * IMPACT: Business outcomes → concise bullet summary.
 * Also builds an impactTemplate with {arrRange} for calculateImpact().
 */
export function extractImpactStatement(advisory) {
  const section = getSection(advisory, 'What business outcomes does this project drive\\?');
  if (!section) return null;

  // Get primary outcomes (bullets after "Primary Outcomes:")
  const primaryMatch = section.match(/\*\*Primary Outcomes?:\*\*\n([\s\S]*?)(?=\*\*Secondary|$)/);
  const bullets = parseBullets(primaryMatch ? primaryMatch[1] : section);

  if (bullets.length === 0) return null;
  // Take first 2-3 primary outcomes
  return cleanMarkdown(bullets.slice(0, 3).join('. ') + '.');
}

/**
 * Build an impactTemplate string with {arrRange}/{repCount} placeholders
 * from the Expected Outcomes before/after data.
 */
export function extractImpactTemplate(advisory) {
  const section = getSection(advisory, 'Expected Outcomes');
  if (!section) {
    // Fall back to business outcomes as a static template
    const impact = extractImpactStatement(advisory);
    if (impact) return `At {arrRange} ARR, this directly impacts your business: ${impact}`;
    return null;
  }

  const rows = parseTableRows(section);
  if (rows.length === 0) return null;

  // Pick the most impactful row (first metric with a clear before/after)
  // Table format: Metric | Before | After | Source
  const lines = section.split('\n').filter(l => l.trim().startsWith('|'));
  const dataLines = lines.slice(2); // skip header + separator
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

/**
 * OUTCOME: How to Measure Success → leading indicators as forward-looking statement.
 */
export function extractOutcomeStatement(advisory) {
  const section = getSection(advisory, 'How to Measure Success');
  if (!section) return null;

  // Get leading indicators (early wins)
  const leadingMatch = section.match(/\*\*Leading Indicators?[^*]*\*\*:?\n([\s\S]*?)(?=\*\*Lagging|$)/i);
  const bullets = parseBullets(leadingMatch ? leadingMatch[1] : section);

  if (bullets.length === 0) return null;
  // Take first 2-3 leading indicators
  return cleanMarkdown(bullets.slice(0, 3).join('. ') + '.');
}

/**
 * Extract outcome category tags from business outcomes section.
 */
export function extractOutcomeTags(advisory) {
  const section = getSection(advisory, 'What business outcomes does this project drive\\?');
  if (!section) return [];

  const bullets = parseBullets(section);
  if (bullets.length === 0) return [];

  // Return first 2 outcomes as short tags (truncate to ~50 chars)
  return bullets.slice(0, 2).map(b => {
    const clean = cleanMarkdown(b);
    return clean.length > 50 ? clean.slice(0, 47) + '...' : clean;
  });
}

/**
 * Extract Power 10 metric names from the metrics impact table.
 */
export function extractPower10Metrics(advisory) {
  const section = getSection(advisory, 'Power 10 Metrics Impacted');
  if (!section) return [];

  const lines = section.split('\n').filter(l => l.trim().startsWith('|'));
  const dataLines = lines.slice(2); // skip header + separator

  return dataLines
    .map(line => {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      return cells[0] ? cleanMarkdown(cells[0]) : null;
    })
    .filter(Boolean);
}

// ─── Main Entry Point ─────────────────────────────────────────

/**
 * Given a list of serviceIds, find the best matching playbook and extract
 * structured content for finding card enrichment.
 *
 * Returns: { description, impactTemplate, outcomeStatement, outcomes, power10Metrics }
 */
export function enrichFromPlaybooks(serviceIds) {
  const empty = {
    description: null,
    impactTemplate: null,
    outcomeStatement: null,
    outcomes: [],
    power10Metrics: [],
  };

  if (!serviceIds || serviceIds.length === 0) return empty;

  // Find the first serviceId that has a playbook with advisory content
  let advisory = null;
  for (const sid of serviceIds) {
    const pb = playbookContent[sid];
    if (pb?.advisory) {
      advisory = pb.advisory;
      break;
    }
  }

  if (!advisory) return empty;

  return {
    description: extractProblemStatement(advisory),
    impactTemplate: extractImpactTemplate(advisory),
    outcomeStatement: extractOutcomeStatement(advisory),
    outcomes: extractOutcomeTags(advisory),
    power10Metrics: extractPower10Metrics(advisory),
  };
}
