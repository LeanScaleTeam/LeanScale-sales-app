/**
 * Impact Calculator
 *
 * Calculates business impact statements for diagnostic findings.
 * Uses intake data (ARR, rep count) where available, falls back to benchmarks.
 */

/**
 * Parse intake answers into usable numbers for impact calculations.
 */
export function parseIntakeContext(companyProfile = {}) {
  const { arrRange, repCount, gtmMotion } = companyProfile;

  // Parse ARR midpoint
  const arrMap = {
    '<$1M': 500000,
    '$1-5M': 3000000,
    '$5-20M': 12500000,
    '$20-50M': 35000000,
    '$50M+': 75000000,
  };

  // Parse rep count midpoint
  const repMap = {
    '1-5': 3,
    '6-15': 10,
    '16-50': 30,
    '50+': 75,
  };

  return {
    arrMidpoint: arrMap[arrRange] || null,
    arrRange: arrRange || null,
    repMidpoint: repMap[repCount] || null,
    repCount: repCount || null,
    gtmMotion: gtmMotion || null,
    hasData: !!(arrRange && repCount && arrMap[arrRange] && repMap[repCount]),
  };
}

/**
 * Format a dollar amount for display.
 */
function formatDollars(amount) {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${Math.round(amount / 1000)}K`;
  return `$${Math.round(amount)}`;
}

/**
 * Generate an impact statement for a diagnostic item.
 *
 * @param {object} item - Diagnostic item with impactTemplate, power10Metrics, etc.
 * @param {object} context - Parsed intake context from parseIntakeContext()
 * @returns {object} { statement, type, confidence }
 */
export function calculateImpact(item, context) {
  if (!item) return { statement: null, type: 'none', confidence: 'low' };

  // Try to fill the template with real data
  if (item.impactTemplate && context.hasData) {
    let statement = item.impactTemplate;
    statement = statement.replace('{repCount}', context.repCount || 'your');
    statement = statement.replace('{arrRange}', context.arrRange || 'your');

    // Calculate specific dollar impacts where possible
    if (context.arrMidpoint && context.repMidpoint) {
      const hours = Math.round(context.repMidpoint * 2); // rough estimate of wasted hours/week
      statement = statement.replace('{hours}', hours.toString());

      // For pipeline-related items, estimate pipeline impact
      if (item.power10Metrics?.includes('Pipeline production')) {
        const estimatedPipelineImpact = context.arrMidpoint * 0.05; // 5% of ARR
        statement += ` Estimated pipeline impact: ~${formatDollars(estimatedPipelineImpact)}/year.`;
      }
    }

    return {
      statement,
      type: 'calculated',
      confidence: 'high',
    };
  }

  // Fall back to the template with benchmark language
  if (item.impactTemplate) {
    let statement = item.impactTemplate;
    statement = statement.replace('{repCount}', 'your');
    statement = statement.replace('{arrRange}', 'your current');
    statement = statement.replace('{hours}', '10-15');
    return {
      statement,
      type: 'benchmark',
      confidence: 'medium',
    };
  }

  // Last resort: generic impact based on status
  return {
    statement: null,
    type: 'none',
    confidence: 'low',
  };
}

/**
 * Calculate Power 10 summary stats from power10 data.
 */
export function calculatePower10Summary(power10Data) {
  if (!power10Data || power10Data.length === 0) {
    return { reportable: 0, onTrack: 0, total: 10, punchline: '' };
  }

  const reportable = power10Data.filter(
    m => m.ableToReport === 'healthy' || m.ableToReport === 'careful'
  ).length;

  const onTrack = power10Data.filter(
    m => m.statusAgainstPlan === 'healthy'
  ).length;

  const blindSpots = 10 - reportable;

  let punchline;
  if (reportable <= 3) {
    punchline = `You can reliably report on ${reportable} of 10 metrics. That means you're flying ${blindSpots * 10}% blind.`;
  } else if (reportable <= 6) {
    punchline = `You can report on ${reportable} of 10 metrics — progress, but ${blindSpots} key metrics are still invisible.`;
  } else if (onTrack < reportable) {
    punchline = `You can report on ${reportable} of 10 metrics, but only ${onTrack} ${onTrack === 1 ? 'is' : 'are'} on track.`;
  } else {
    punchline = `Strong visibility — ${reportable} of 10 metrics are reportable and ${onTrack} are on track.`;
  }

  return { reportable, onTrack, total: 10, punchline };
}

/**
 * Estimate total cost of inaction across all findings.
 */
export function estimateTotalCostOfInaction(items, context) {
  if (!context.hasData || !context.arrMidpoint) return null;

  const warningCount = items.filter(i => i.status === 'warning').length;
  const carefulCount = items.filter(i => i.status === 'careful').length;

  // Conservative estimate: each warning = 2-5% impact, each careful = 1-2%
  const lowEstimate = context.arrMidpoint * (warningCount * 0.02 + carefulCount * 0.01);
  const highEstimate = context.arrMidpoint * (warningCount * 0.05 + carefulCount * 0.02);

  return {
    low: formatDollars(lowEstimate),
    high: formatDollars(highEstimate),
    statement: `Based on your ${context.arrRange} ARR, these gaps represent an estimated ${formatDollars(lowEstimate)} to ${formatDollars(highEstimate)} in annual revenue impact.`,
  };
}
