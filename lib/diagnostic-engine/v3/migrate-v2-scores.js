/**
 * v2 → v3 Score Migration
 *
 * Translates existing v2 diagnostic results into v3 competency cells.
 * v2 uses 3-point scale (warning=1, careful=2, healthy=3)
 * v3 uses 5-point scale (1=Weak, 2=Below Average, 3=Average, 4=Good, 5=Best Practice)
 *
 * Only overlapping items are migrated. Non-overlapping v3 competencies
 * remain null (unscored) for transcript/consultant input.
 */

/**
 * Mapping from v2 item IDs to v3 competency/department targets.
 */
const V2_TO_V3_MAP = [
  { v2Id: 'F1', v3Id: 'SY-1', departments: 'all' },
  { v2Id: 'F2', v3Id: 'PR-2', departments: ['sales'] },
  { v2Id: 'F3', v3Id: 'PR-1', departments: ['marketing'] },
  { v2Id: 'F4', v3Id: 'SY-1', departments: 'all' },  // merges with F1 into SY-1
  { v2Id: 'F5', v3Id: 'PE-6', departments: 'all' },   // org structure
  { v2Id: 'M3', v3Id: 'PR-6', departments: ['sales'] },
  { v2Id: 'M4', v3Id: 'PR-9', departments: ['marketing'] },
  { v2Id: 'M6', v3Id: 'PR-3', departments: ['cs'] },
  { v2Id: 'M7', v3Id: 'PR-4', departments: ['partners'] },
  { v2Id: 'R2', v3Id: 'RP-5', departments: ['sales'] },
  { v2Id: 'R3', v3Id: 'RP-6', departments: ['sales'] },
  { v2Id: 'P5', v3Id: 'SY-7', departments: 'all' },
];

/**
 * Convert v2 status to v3 score.
 * warning(1) → 1, careful(2) → 3, healthy(3) → 4
 */
const V2_TO_V3_SCALE = {
  warning: 1,
  careful: 3,
  healthy: 4,
};

const ALL_DEPARTMENTS = ['marketing', 'sales', 'cs', 'partners'];

/**
 * Migrate v2 diagnostic items to v3 transcript-score format.
 *
 * Returns a map suitable for passing as `transcriptAssessments` to the v3 engine,
 * keyed by `competencyId_department`.
 *
 * @param {Array} v2Items - v2 diagnostic items array [{ id, status, ... }]
 * @returns {object} Map of { [key]: { score, confidence, evidence: [] } }
 */
export function migrateV2Scores(v2Items) {
  if (!v2Items || !Array.isArray(v2Items)) return {};

  const migrated = {};

  // Build v2 item lookup
  const v2Map = new Map();
  for (const item of v2Items) {
    v2Map.set(item.id, item);
  }

  // For SY-1, we need to combine F1 + F4 scores
  const sy1Scores = [];

  for (const mapping of V2_TO_V3_MAP) {
    const v2Item = v2Map.get(mapping.v2Id);
    if (!v2Item || v2Item.status === 'unable') continue;

    const v3Score = V2_TO_V3_SCALE[v2Item.status];
    if (v3Score === undefined) continue;

    const departments = mapping.departments === 'all' ? ALL_DEPARTMENTS : mapping.departments;

    // Special handling for SY-1 (multiple v2 items contribute)
    if (mapping.v3Id === 'SY-1') {
      sy1Scores.push(v3Score);
      continue;
    }

    for (const dept of departments) {
      const key = `${mapping.v3Id}_${dept}`;
      // Don't overwrite if already set with a higher score
      if (!migrated[key] || migrated[key].score < v3Score) {
        migrated[key] = {
          score: v3Score,
          confidence: 0.6, // Medium confidence — migrated data
          evidence: [],
          assessment: `Migrated from v2 item ${mapping.v2Id} (${v2Item.status})`,
          reasoning: `v2 score converted: ${v2Item.status} → ${v3Score}/5`,
        };
      }
    }
  }

  // Compute SY-1 as average of contributing v2 items
  if (sy1Scores.length > 0) {
    const avgScore = Math.round(sy1Scores.reduce((a, b) => a + b, 0) / sy1Scores.length);
    for (const dept of ALL_DEPARTMENTS) {
      const key = `SY-1_${dept}`;
      migrated[key] = {
        score: avgScore,
        confidence: 0.6,
        evidence: [],
        assessment: `Migrated from v2 items F1, F4 (averaged)`,
        reasoning: `v2 scores averaged and converted to v3 scale`,
      };
    }
  }

  return migrated;
}

/**
 * Check if a customer has a v2 result that can be migrated.
 *
 * @param {object} v2Result - Full v2 diagnostic result
 * @returns {{ canMigrate: boolean, itemCount: number, coverageEstimate: string }}
 */
export function assessMigrationCoverage(v2Result) {
  if (!v2Result || v2Result.version !== 2 || !v2Result.items) {
    return { canMigrate: false, itemCount: 0, coverageEstimate: '0%' };
  }

  const validItems = v2Result.items.filter((i) => i.status !== 'unable');
  const mappableIds = new Set(V2_TO_V3_MAP.map((m) => m.v2Id));
  const mappable = validItems.filter((i) => mappableIds.has(i.id));

  // Estimate: v2 covers ~35% of v3 competency cells
  const coveragePercent = Math.round((mappable.length / 39) * 35); // 39 total v3 competencies

  return {
    canMigrate: mappable.length > 0,
    itemCount: mappable.length,
    coverageEstimate: `~${Math.min(coveragePercent, 35)}%`,
  };
}
