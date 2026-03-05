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
import { generateSectionsFromDiagnostic, generateExecutiveSummary, generateSectionsFromDiagnosticV2, generateExecutiveSummaryV2, generateSectionsFromDiagnosticV3, generateExecutiveSummaryV3 } from '../../../lib/sow-auto-generate';
import { supabaseAdmin } from '../../../lib/supabase';
import { applyRoadmapOverrides } from '../../../lib/diagnostic-engine/v3/apply-roadmap-overrides';

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
      diagnosticVersion: requestedVersion,
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

    let overallRating;
    let generatedSections;
    let executiveSummary;
    let processes;
    let diagnosticSnapshot;
    let isV3 = false;

    // --- v3 path ---
    if (requestedVersion === 3) {
      const { data: v3Result, error: v3Error } = await supabaseAdmin
        .from('diagnostic_results_v3')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (v3Error || !v3Result) {
        return res.status(404).json({
          success: false,
          error: 'No v3 diagnostic result found for this customer',
        });
      }

      isV3 = true;

      // Apply roadmap overrides if present
      const roadmap = applyRoadmapOverrides(v3Result.roadmap, v3Result.roadmap_overrides);

      // Apply engagement overrides (exclusions + priority) on top
      const engOv = v3Result.engagement_overrides?.roadmap || {};
      if (Object.keys(engOv).length > 0 && roadmap?.phases) {
        for (const phase of roadmap.phases) {
          phase.projects = phase.projects.filter(p => !engOv[p.serviceId]?.excluded);
          // Carry priority into project for SOW section generation
          for (const proj of phase.projects) {
            if (engOv[proj.serviceId]?.priority) {
              proj.engagementPriority = engOv[proj.serviceId].priority;
            }
          }
          phase.projectCount = phase.projects.length;
        }
        roadmap.totalProjects = roadmap.phases.reduce((s, p) => s + p.projectCount, 0);
      }

      // Collect service slugs from all roadmap projects
      const phases = roadmap?.phases || [];
      const slugs = [...new Set(phases.flatMap(p => p.projects.map(proj => proj.serviceId)))];
      const catalogMap = slugs.length > 0 ? await getServicesBySlugs(slugs) : new Map();

      generatedSections = generateSectionsFromDiagnosticV3(roadmap, catalogMap);
      executiveSummary = generateExecutiveSummaryV3(roadmap, v3Result.pillar_scores, customerName);

      overallRating = v3Result.overall_score >= 3.5 ? 'healthy'
        : v3Result.overall_score >= 2.5 ? 'moderate'
        : 'critical';

      processes = v3Result.score_card; // for snapshot

      diagnosticSnapshot = {
        version: 3,
        overall_score: v3Result.overall_score,
        pillar_scores: v3Result.pillar_scores,
        department_scores: v3Result.department_scores,
        roadmapSummary: {
          totalProjects: roadmap.totalProjects,
          byPhase: roadmap.summary?.byPhase,
        },
        snapshotAt: new Date().toISOString(),
      };
    } else {
      // v1/v2 path — fetch from existing table
      const diagnosticResult = await getDiagnosticResult(customerId, diagnosticType || 'gtm');

      if (!diagnosticResult) {
        return res.status(404).json({
          success: false,
          error: 'Diagnostic result not found for this customer',
        });
      }

      const isV2 = diagnosticResult.version === 2 && diagnosticResult.items;

      if (isV2) {
        // --- v2 path ---
        const items = diagnosticResult.items || [];
        const scores = diagnosticResult.scores || {};

        overallRating = scores.overallStatus || 'moderate';

        const slugs = [...new Set(items.flatMap(it => it.serviceIds || []))];
        const catalogMap = slugs.length > 0 ? await getServicesBySlugs(slugs) : new Map();

        generatedSections = generateSectionsFromDiagnosticV2(items, catalogMap);
        executiveSummary = generateExecutiveSummaryV2(items, scores, customerName);
        processes = items;

        diagnosticSnapshot = {
          version: 2,
          items: processes.map(it => ({ id: it.id, name: it.name, layer: it.layer, status: it.status })),
          scores: diagnosticResult.scores,
          snapshotAt: new Date().toISOString(),
        };
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

        const slugs = [...new Set(processes.filter(p => p.serviceId).map(p => p.serviceId))];
        const catalogMap = slugs.length > 0 ? await getServicesBySlugs(slugs) : new Map();

        generatedSections = generateSectionsFromDiagnostic(processes, catalogMap);
        executiveSummary = generateExecutiveSummary(
          processes, customerName, diagnosticType, overallRating
        );

        diagnosticSnapshot = {
          processes: processes.map(p => ({
            name: p.name,
            status: p.status,
            addToEngagement: p.addToEngagement,
          })),
          snapshotAt: new Date().toISOString(),
        };
      }
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
    return res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
}
