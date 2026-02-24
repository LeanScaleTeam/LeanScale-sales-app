/**
 * API endpoint to create a SOW pre-loaded with diagnostic items
 * POST /api/sow/from-diagnostic
 *
 * Body: {
 *   customerId: UUID,
 *   diagnosticResultId: UUID,
 *   diagnosticType: 'gtm' | 'clay' | 'cpq',
 *   customerName: string (for auto-generating title),
 *   sowType: 'clay' | 'q2c' | 'embedded' | 'custom',
 *   createdBy: string
 * }
 *
 * Creates a new SOW linked to the diagnostic result with auto-populated
 * sections based on diagnostic data and service catalog.
 */

import { createSow, updateSow } from '../../../lib/sow';
import { getDiagnosticResult } from '../../../lib/diagnostics';
import { bulkCreateSections } from '../../../lib/sow-sections';
import { getServicesBySlugs } from '../../../lib/service-catalog';
import { generateSectionsFromDiagnostic, generateExecutiveSummary, generateSectionsFromDiagnosticV2, generateExecutiveSummaryV2 } from '../../../lib/sow-auto-generate';

const VALID_SOW_TYPES = ['clay', 'q2c', 'embedded', 'custom'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      customerId,
      diagnosticResultId,
      diagnosticType,
      customerName,
      sowType,
      createdBy,
    } = req.body;

    if (!customerId) {
      return res.status(400).json({ success: false, error: 'customerId is required' });
    }
    if (!diagnosticResultId) {
      return res.status(400).json({ success: false, error: 'diagnosticResultId is required' });
    }
    if (!sowType || !VALID_SOW_TYPES.includes(sowType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid sowType. Must be one of: ${VALID_SOW_TYPES.join(', ')}`,
      });
    }

    // Fetch the diagnostic result to get processes data
    const diagnosticResult = await getDiagnosticResult(customerId, diagnosticType || 'gtm');

    if (!diagnosticResult) {
      return res.status(404).json({
        success: false,
        error: 'Diagnostic result not found for this customer',
      });
    }

    // Detect v1 vs v2
    const isV2 = diagnosticResult.version === 2 && diagnosticResult.items;

    let overallRating;
    let generatedSections;
    let executiveSummary;
    let processes;

    if (isV2) {
      // --- v2 path ---
      const items = diagnosticResult.items || [];
      const scores = diagnosticResult.scores || {};

      overallRating = scores.overallStatus || 'moderate';

      // Collect all serviceIds from v2 items
      const slugs = [...new Set(items.flatMap(it => it.serviceIds || []))];
      const catalogMap = slugs.length > 0 ? await getServicesBySlugs(slugs) : new Map();

      generatedSections = generateSectionsFromDiagnosticV2(items, catalogMap);
      executiveSummary = generateExecutiveSummaryV2(items, scores, customerName);
      processes = items; // for snapshot
    } else {
      // --- v1 path ---
      processes = diagnosticResult.processes || [];
      const statusCounts = { warning: 0, unable: 0, careful: 0, healthy: 0 };
      processes.forEach(p => {
        if (statusCounts[p.status] !== undefined) {
          statusCounts[p.status]++;
        }
      });

      overallRating = 'healthy';
      const criticalPct = (statusCounts.warning + statusCounts.unable) / (processes.length || 1);
      if (criticalPct > 0.5) overallRating = 'critical';
      else if (criticalPct > 0.3) overallRating = 'warning';
      else if (criticalPct > 0.1) overallRating = 'moderate';

      // Look up service catalog entries by slug for auto-generation
      const slugs = [...new Set(processes.filter(p => p.serviceId).map(p => p.serviceId))];
      const catalogMap = slugs.length > 0 ? await getServicesBySlugs(slugs) : new Map();

      generatedSections = generateSectionsFromDiagnostic(processes, catalogMap);
      executiveSummary = generateExecutiveSummary(
        processes, customerName, diagnosticType, overallRating
      );
    }

    // Auto-generate title
    const title = customerName
      ? `${customerName} Statement of Work`
      : 'Statement of Work';

    // Create the SOW
    const sow = await createSow({
      customerId,
      title,
      sowType,
      content: {
        executive_summary: executiveSummary,
        client_info: customerName ? { company: customerName } : {},
        scope: generatedSections.map(s => ({ title: s.title, description: s.description, deliverables: s.deliverables })),
        deliverables_table: [],
        timeline: [],
        investment: { total: 0, payment_terms: '', breakdown: [] },
        team: [],
        assumptions: [],
        acceptance_criteria: [],
      },
      createdBy,
    });

    if (!sow) {
      return res.status(500).json({ success: false, error: 'Failed to create SOW' });
    }

    // Create sections in the database
    let sections = [];
    if (generatedSections.length > 0) {
      sections = await bulkCreateSections(sow.id, generatedSections);
    }

    // Calculate totals from generated sections
    let totalHours = 0;
    let totalInvestment = 0;
    for (const s of generatedSections) {
      if (s.hours) totalHours += s.hours;
      if (s.hours && s.rate) totalInvestment += s.hours * s.rate;
    }

    // Build diagnostic snapshot (v1 vs v2)
    const diagnosticSnapshot = isV2
      ? {
          version: 2,
          items: processes.map(it => ({ id: it.id, name: it.name, layer: it.layer, status: it.status })),
          scores: diagnosticResult.scores,
          snapshotAt: new Date().toISOString(),
        }
      : {
          processes: processes.map(p => ({
            name: p.name,
            status: p.status,
            addToEngagement: p.addToEngagement,
          })),
          snapshotAt: new Date().toISOString(),
        };

    // Calculate SOW-level dates from section dates
    const sectionStarts = generatedSections.filter(s => s.startDate).map(s => new Date(s.startDate));
    const sectionEnds = generatedSections.filter(s => s.endDate).map(s => new Date(s.endDate));
    const sowStartDate = sectionStarts.length > 0 ? new Date(Math.min(...sectionStarts)) : null;
    const sowEndDate = sectionEnds.length > 0 ? new Date(Math.max(...sectionEnds)) : null;

    // Update the SOW with diagnostic links, totals, and dates
    await updateSow(sow.id, {
      diagnostic_result_ids: [diagnosticResultId],
      overall_rating: overallRating,
      diagnostic_snapshot: diagnosticSnapshot,
      total_hours: totalHours || null,
      total_investment: totalInvestment || null,
      start_date: sowStartDate ? sowStartDate.toISOString().split('T')[0] : null,
      end_date: sowEndDate ? sowEndDate.toISOString().split('T')[0] : null,
    });

    return res.status(201).json({
      success: true,
      data: {
        ...sow,
        sections,
        diagnostic_result_ids: [diagnosticResultId],
        overall_rating: overallRating,
        total_hours: totalHours,
        total_investment: totalInvestment,
      },
      diagnosticProcesses: processes,
    });
  } catch (error) {
    console.error('Error creating SOW from diagnostic:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
