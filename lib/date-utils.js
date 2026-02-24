/**
 * Date calculation utilities for SOW timeline and engagement pages.
 */

/**
 * Auto-populate start/end dates for SOW sections based on hours and a monthly budget.
 * Sections are stacked sequentially by sort_order.
 *
 * @param {Array} sections - SOW sections with hours and sort_order
 * @param {Date|string} startDate - Engagement start date
 * @param {number} hoursPerMonth - Monthly hour budget (e.g., 100)
 * @returns {Array} Sections with computed startDate and endDate (ISO date strings)
 */
export function autoPopulateDates(sections, startDate, hoursPerMonth = 100) {
  if (!sections || sections.length === 0 || hoursPerMonth <= 0) return sections;

  const sorted = [...sections].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  let cursor = new Date(startDate);

  return sorted.map(section => {
    const hours = parseFloat(section.hours) || 0;
    if (hours <= 0) {
      // No hours — give it a 2-week default
      const sectionStart = new Date(cursor);
      const sectionEnd = new Date(cursor);
      sectionEnd.setDate(sectionEnd.getDate() + 14);
      cursor = new Date(sectionEnd);
      cursor.setDate(cursor.getDate() + 1);
      return {
        ...section,
        startDate: formatISO(sectionStart),
        endDate: formatISO(sectionEnd),
      };
    }

    const months = hours / hoursPerMonth;
    const days = Math.max(Math.ceil(months * 30), 7); // min 1 week

    const sectionStart = new Date(cursor);
    const sectionEnd = new Date(cursor);
    sectionEnd.setDate(sectionEnd.getDate() + days);

    // Next section starts the day after this one ends
    cursor = new Date(sectionEnd);
    cursor.setDate(cursor.getDate() + 1);

    return {
      ...section,
      startDate: formatISO(sectionStart),
      endDate: formatISO(sectionEnd),
    };
  });
}

/**
 * Calculate overall engagement duration from section dates.
 *
 * @param {Array} sections - SOW sections with start_date and end_date
 * @returns {{ months: number, weeks: number, startDate: Date|null, endDate: Date|null }}
 */
export function calculateEngagementDuration(sections) {
  const dated = (sections || []).filter(s => s.start_date && s.end_date);
  if (dated.length === 0) {
    return { months: 0, weeks: 0, startDate: null, endDate: null };
  }

  const allStarts = dated.map(s => new Date(s.start_date));
  const allEnds = dated.map(s => new Date(s.end_date));
  const startDate = new Date(Math.min(...allStarts));
  const endDate = new Date(Math.max(...allEnds));

  const diffMs = endDate - startDate;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const weeks = Math.ceil(diffDays / 7);
  const months = Math.round((diffDays / 30) * 10) / 10; // one decimal

  return { months, weeks, startDate, endDate };
}

/**
 * Format a date range as "Mon DD — Mon DD, YYYY" or "Mon YYYY — Mon YYYY".
 *
 * @param {Date|string} start
 * @param {Date|string} end
 * @param {'short'|'long'} format
 * @returns {string}
 */
export function formatDateRange(start, end, format = 'short') {
  if (!start || !end) return '';
  const s = new Date(start);
  const e = new Date(end);

  if (format === 'long') {
    return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${e.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }

  return `${s.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — ${e.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
}

/**
 * Format a Date as YYYY-MM-DD for HTML date inputs and DB storage.
 */
function formatISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
