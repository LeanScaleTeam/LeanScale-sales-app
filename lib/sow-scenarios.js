/**
 * SOW Scenario data management
 *
 * Scenarios are stored in sow.content.scenarios as a JSONB array.
 * Each scenario: { id, name, description, sectionIds: [], isDefault: boolean }
 *
 * Sections remain in sow_sections but are associated with scenarios via sectionIds.
 * Default scenario = all sections (backward compatible).
 */

import { supabaseAdmin } from './supabase';
import { getSowById, updateSow } from './sow';
import { listSections } from './sow-sections';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get scenarios for a SOW. Returns default scenario if none exist.
 */
export async function listScenarios(sowId) {
  const sow = await getSowById(sowId);
  if (!sow) return [];

  const scenarios = sow.content?.scenarios || [];

  // Backward compat: if no scenarios, return a default one with all sections
  if (scenarios.length === 0) {
    const sections = await listSections(sowId);
    return [{
      id: 'default',
      name: 'Default',
      description: 'All sections included',
      sectionIds: sections.map(s => s.id),
      isDefault: true,
    }];
  }

  return scenarios;
}

/**
 * Create a new scenario
 */
export async function createScenario(sowId, { name, description, sectionIds = [], isDefault = false }) {
  const sow = await getSowById(sowId);
  if (!sow) return null;

  const scenarios = sow.content?.scenarios || [];
  const newScenario = {
    id: uuidv4(),
    name,
    description: description || '',
    sectionIds,
    isDefault,
  };

  // If this is set as default, unset others
  if (isDefault) {
    scenarios.forEach(s => { s.isDefault = false; });
  }

  // If first scenario being created, also create a "default" from existing sections
  if (scenarios.length === 0) {
    const sections = await listSections(sowId);
    const defaultScenario = {
      id: uuidv4(),
      name: 'Option A: Standard',
      description: 'All current sections',
      sectionIds: sections.map(s => s.id),
      isDefault: !isDefault,
    };
    scenarios.push(defaultScenario);
  }

  scenarios.push(newScenario);

  await updateSow(sowId, {
    content: { ...sow.content, scenarios },
  });

  return newScenario;
}

/**
 * Update an existing scenario
 */
export async function updateScenario(sowId, scenarioId, updates) {
  const sow = await getSowById(sowId);
  if (!sow) return null;

  const scenarios = sow.content?.scenarios || [];
  const idx = scenarios.findIndex(s => s.id === scenarioId);
  if (idx === -1) return null;

  if (updates.isDefault) {
    scenarios.forEach(s => { s.isDefault = false; });
  }

  scenarios[idx] = { ...scenarios[idx], ...updates };

  await updateSow(sowId, {
    content: { ...sow.content, scenarios },
  });

  return scenarios[idx];
}

/**
 * Delete a scenario
 */
export async function deleteScenario(sowId, scenarioId) {
  const sow = await getSowById(sowId);
  if (!sow) return false;

  const scenarios = (sow.content?.scenarios || []).filter(s => s.id !== scenarioId);

  // If we deleted the default, make the first one default
  if (scenarios.length > 0 && !scenarios.some(s => s.isDefault)) {
    scenarios[0].isDefault = true;
  }

  await updateSow(sowId, {
    content: { ...sow.content, scenarios },
  });

  return true;
}

/**
 * Duplicate a scenario with a new name
 */
export async function duplicateScenario(sowId, scenarioId, newName) {
  const sow = await getSowById(sowId);
  if (!sow) return null;

  const scenarios = sow.content?.scenarios || [];
  const source = scenarios.find(s => s.id === scenarioId);
  if (!source) return null;

  const duplicate = {
    id: uuidv4(),
    name: newName || `${source.name} (Copy)`,
    description: source.description,
    sectionIds: [...source.sectionIds],
    isDefault: false,
  };

  scenarios.push(duplicate);

  await updateSow(sowId, {
    content: { ...sow.content, scenarios },
  });

  return duplicate;
}

/**
 * Compute metrics for a scenario given its sections
 */
export function computeScenarioMetrics(sections, sectionIds) {
  const included = sections.filter(s => sectionIds.includes(s.id));
  let totalHours = 0;
  let totalInvestment = 0;
  let minDate = null;
  let maxDate = null;

  included.forEach(s => {
    const h = parseFloat(s.hours) || 0;
    const r = parseFloat(s.rate) || 0;
    totalHours += h;
    totalInvestment += h * r;
    if (s.start_date && (!minDate || s.start_date < minDate)) minDate = s.start_date;
    if (s.end_date && (!maxDate || s.end_date > maxDate)) maxDate = s.end_date;
  });

  // Duration in weeks
  let durationWeeks = null;
  if (minDate && maxDate) {
    const diff = new Date(maxDate) - new Date(minDate);
    durationWeeks = Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
  }

  return {
    sectionCount: included.length,
    totalHours,
    totalInvestment,
    durationWeeks,
    startDate: minDate,
    endDate: maxDate,
    sectionTitles: included.map(s => s.title),
  };
}

/**
 * Auto-assign badges to scenarios based on their metrics
 */
export function assignBadges(scenarioMetrics) {
  if (scenarioMetrics.length <= 1) return scenarioMetrics.map(m => ({ ...m, badges: [] }));

  const result = scenarioMetrics.map(m => ({ ...m, badges: [] }));

  // Best Value = lowest cost per hour
  const withCostPerHour = result.filter(m => m.totalHours > 0);
  if (withCostPerHour.length > 0) {
    const bestValue = withCostPerHour.reduce((best, m) =>
      (m.totalInvestment / m.totalHours) < (best.totalInvestment / best.totalHours) ? m : best
    );
    bestValue.badges.push('Best Value');
  }

  // Most Comprehensive = most sections
  const mostSections = result.reduce((best, m) =>
    m.sectionCount > best.sectionCount ? m : best
  );
  mostSections.badges.push('Most Comprehensive');

  // Fastest = shortest duration (if available)
  const withDuration = result.filter(m => m.durationWeeks != null);
  if (withDuration.length > 0) {
    const fastest = withDuration.reduce((best, m) =>
      m.durationWeeks < best.durationWeeks ? m : best
    );
    fastest.badges.push('Fastest');
  }

  return result;
}
