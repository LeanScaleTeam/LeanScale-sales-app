/**
 * Shared function color definitions for engagement and SOW pages.
 *
 * Maps GTM function names to color palettes used in timelines,
 * stats cards, and section indicators.
 */

export const functionColors = {
  'Cross Functional': { bg: '#e0e7ff', border: '#818cf8', bar: '#818cf8' },
  'Marketing':        { bg: '#dcfce7', border: '#4ade80', bar: '#4ade80' },
  'Sales':            { bg: '#fef3c7', border: '#fbbf24', bar: '#fbbf24' },
  'Customer Success': { bg: '#fce7f3', border: '#f472b6', bar: '#f472b6' },
  'Partnerships':     { bg: '#dbeafe', border: '#60a5fa', bar: '#60a5fa' },
};

// Fallback palette for custom sections not matching a known function
const fallbackPalette = [
  { bg: '#f3f0ff', border: '#6C5CE7', bar: '#6C5CE7' },
  { bg: '#e6fff9', border: '#00B894', bar: '#00B894' },
  { bg: '#fff9e6', border: '#FDCB6E', bar: '#FDCB6E' },
  { bg: '#fff0ed', border: '#E17055', bar: '#E17055' },
  { bg: '#e8f4fd', border: '#0984E3', bar: '#0984E3' },
  { bg: '#f0edff', border: '#A29BFE', bar: '#A29BFE' },
];

/**
 * Determine the color palette for a SOW section.
 *
 * Resolution order:
 * 1. Section title matches a known function name
 * 2. Linked diagnostic_items → first process's function
 * 3. Fallback palette by index
 *
 * @param {object} section - SOW section object
 * @param {Array} diagnosticProcesses - Diagnostic processes for lookup
 * @param {number} index - Section index (for fallback color)
 * @returns {{ bg: string, border: string, bar: string }}
 */
export function getSectionColor(section, diagnosticProcesses = [], index = 0) {
  // 1. Check if section title matches a known function
  if (functionColors[section.title]) {
    return functionColors[section.title];
  }

  // Also check partial match (e.g., "Marketing Operations" contains "Marketing")
  for (const [funcName, colors] of Object.entries(functionColors)) {
    if (section.title && section.title.includes(funcName)) {
      return colors;
    }
  }

  // 2. Check linked diagnostic items for function
  const linkedItems = section.diagnostic_items || [];
  if (linkedItems.length > 0 && diagnosticProcesses.length > 0) {
    const firstLinked = diagnosticProcesses.find(p => linkedItems.includes(p.name));
    if (firstLinked?.function && functionColors[firstLinked.function]) {
      return functionColors[firstLinked.function];
    }
  }

  // 3. Fallback to palette by index
  return fallbackPalette[index % fallbackPalette.length];
}
