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
 *   createdBy: string,
 *   autoGenerate: boolean (default true) — auto-create sections from diagnostic,
 *   groupBy: 'function' | 'outcome' (default 'function'),
 *   defaultRate: number (default 200),
 *   startDate: string (ISO date, optional),
 * }
 *
 * Creates a new SOW linked to the diagnostic result with status 'draft'.
 * When autoGenerate is true, also creates sections from priority diagnostic items.
 */

import { createSow, updateSow } from '../../../lib/sow';
import { getDiagnosticResult } from '../../../lib/diagnostics';
import { bulkCreateSections } from '../../../lib/sow-sections';
import {
  autoGenerateSow,
  selectPriorityItems,
} from '../../../lib/sow-auto-builder';

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
      autoGenerate = true,
      groupBy = 'function',
      defaultRate = 200,
      startDate,
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

    const processes = diagnosticResult.processes || [];

    // Compute an overall rating from the diagnostic processes
    const statusCounts = { warning: 0, unable: 0, careful: 0, healthy: 0 };
    processes.forEach(p => {
      if (statusCounts[p.status] !== undefined) {
        statusCounts[p.status]++;
      }
    });

    let overallRating = 'healthy';
    const criticalPct = (statusCounts.warning + statusCounts.unable) / (processes.length || 1);
    if (criticalPct > 0.5) overallRating = 'critical';
    else if (criticalPct > 0.3) overallRating = 'warning';
    else if (criticalPct > 0.1) overallRating = 'moderate';

    // Generate executive summary if auto-generating
    let executiveSummary = '';
    let sectionDefs = [];
    let priorityItems = [];

    if (autoGenerate) {
      const result = await autoGenerateSow({
        processes,
        groupBy,
        defaultRate,
        sowStartDate: startDate,
        customerName,
        diagnosticType: diagnosticType || 'gtm',
      });
      executiveSummary = result.executiveSummary;
      sectionDefs = result.sections;
      priorityItems = result.priorityItems;
    }

    // Auto-generate title
    const title = customerName
      ? `${customerName} Statement of Work`
      : 'Statement of Work';

    // Create the SOW with diagnostic links
    const sow = await createSow({
      customerId,
      title,
      sowType,
      content: {
        executive_summary: executiveSummary,
        client_info: customerName ? { company: customerName } : {},
        scope: [],
        deliverables_table: [],
        timeline: [],
        investment: { total: 0, payment_terms: '', breakdown: [] },
        team: [],
        assumptions: autoGenerate ? [
          'Client will provide timely access to required systems and stakeholders.',
          'Scope changes will be managed through a change request process.',
          'All work will be performed remotely unless otherwise agreed.',
        ] : [],
        acceptance_criteria: autoGenerate ? [
          'Deliverables reviewed and approved by client stakeholder.',
          'Knowledge transfer session completed for each section.',
        ] : [],
      },
      createdBy,
    });

    if (!sow) {
      return res.status(500).json({ success: false, error: 'Failed to create SOW' });
    }

    // Update the SOW with diagnostic-linked fields
    await updateSow(sow.id, {
      diagnostic_result_ids: [diagnosticResultId],
      overall_rating: overallRating,
      diagnostic_snapshot: {
        processes: processes.map(p => ({
          name: p.name,
          status: p.status,
          addToEngagement: p.addToEngagement,
          function: p.function,
          outcome: p.outcome,
          serviceId: p.serviceId,
          serviceType: p.serviceType,
        })),
        snapshotAt: new Date().toISOString(),
      },
    });

    // Auto-generate sections
    let generatedSections = [];
    if (autoGenerate && sectionDefs.length > 0) {
      generatedSections = await bulkCreateSections(sow.id, sectionDefs);

      // Update SOW totals
      let totalHours = 0, totalInvestment = 0;
      let minDate = null, maxDate = null;
      generatedSections.forEach(s => {
        const h = parseFloat(s.hours) || 0;
        const r = parseFloat(s.rate) || 0;
        totalHours += h;
        totalInvestment += h * r;
        if (s.start_date && (!minDate || s.start_date < minDate)) minDate = s.start_date;
        if (s.end_date && (!maxDate || s.end_date > maxDate)) maxDate = s.end_date;
      });

      await updateSow(sow.id, {
        total_hours: totalHours,
        total_investment: totalInvestment,
        start_date: minDate,
        end_date: maxDate,
      });
    }

    return res.status(201).json({
      success: true,
      data: {
        ...sow,
        diagnostic_result_ids: [diagnosticResultId],
        overall_rating: overallRating,
        sections: generatedSections,
      },
      diagnosticProcesses: processes,
      meta: {
        autoGenerated: autoGenerate,
        sectionsCreated: generatedSections.length,
        priorityItemCount: priorityItems.length,
      },
    });
  } catch (error) {
    console.error('Error creating SOW from diagnostic:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
