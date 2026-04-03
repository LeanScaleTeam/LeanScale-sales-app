/**
 * Diagnostic v3 Export — Markdown brief for SOW generation
 * GET /api/diagnostic/v3/export?customerId=...
 *
 * Produces a structured markdown document focused on gaps and roadmap,
 * suitable for feeding into the SOW maker skill.
 */

import { supabaseAdmin } from '../../../../lib/supabase';
import {
  V3_STATUS,
  PILLAR_ORDER,
  PILLAR_LABELS,
  DEPT_LABELS,
  V3_COMPETENCIES,
  expandDepartments,
} from '../../../../lib/diagnostic-engine/v3/constants-v3';
import { applyRoadmapOverrides } from '../../../../lib/diagnostic-engine/v3/apply-roadmap-overrides';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.query;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }

  try {
    // Fetch diagnostic result
    const { data, error } = await supabaseAdmin
      .from('diagnostic_results_v3')
      .select('*')
      .eq('customer_id', customerId)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'No v3 diagnostic result found' });
      }
      return res.status(500).json({ error: 'Failed to fetch result' });
    }

    // Fetch customer name
    const { data: customer } = await supabaseAdmin
      .from('customers')
      .select('name, slug')
      .eq('id', customerId)
      .maybeSingle();

    const companyName = customer?.name || customer?.slug || 'Unknown Company';

    // Apply roadmap overrides if they exist
    const roadmap = data.roadmap_overrides
      ? applyRoadmapOverrides(data.roadmap, data.roadmap_overrides)
      : data.roadmap;

    const markdown = generateMarkdown({
      companyName,
      companyProfile: data.company_profile,
      overallScore: data.overall_score,
      pillarScores: data.pillar_scores,
      departmentScores: data.department_scores,
      scoreCard: data.score_card,
      roadmap,
      dataCoverage: data.data_coverage,
      updatedAt: data.updated_at || data.created_at,
    });

    // Return as downloadable markdown file
    const filename = `${companyName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()}-diagnostic-brief.md`;
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(markdown);
  } catch (err) {
    console.error('v3 export error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function generateMarkdown({
  companyName,
  companyProfile,
  overallScore,
  pillarScores,
  departmentScores,
  scoreCard,
  roadmap,
  dataCoverage,
  updatedAt,
}) {
  const lines = [];

  // Header
  lines.push(`# GTM Diagnostic Brief — ${companyName}`);
  lines.push(`Generated: ${new Date(updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`);
  lines.push('');

  // Company Profile
  lines.push('## Company Profile');
  if (companyProfile) {
    lines.push(`- **CRM:** ${companyProfile.crm || 'Unknown'}`);
    lines.push(`- **Sales Team Size:** ${companyProfile.repCount || 'Unknown'}`);
    lines.push(`- **ARR Range:** ${companyProfile.arrRange || 'Unknown'}`);
    lines.push(`- **GTM Motion:** ${companyProfile.gtmMotion || 'Unknown'}`);
    lines.push(`- **Partner Channel:** ${companyProfile.hasPartners ? 'Yes' : 'No'}`);
  }
  lines.push('');

  // Overall Score
  lines.push('## Overall Score');
  const roundedOverall = Math.round(overallScore * 10) / 10;
  lines.push(`**${roundedOverall} / 5.0** (${V3_STATUS[Math.round(overallScore)] || 'N/A'})`);
  lines.push('');

  // Pillar Scores
  lines.push('## Pillar Scores');
  lines.push('| Pillar | Score | Rating |');
  lines.push('|--------|-------|--------|');
  for (const pillar of PILLAR_ORDER) {
    const score = pillarScores?.[pillar];
    if (score !== null && score !== undefined) {
      const rounded = Math.round(score * 10) / 10;
      lines.push(`| ${PILLAR_LABELS[pillar]} | ${rounded} | ${V3_STATUS[Math.round(score)] || 'N/A'} |`);
    }
  }
  lines.push('');

  // Department Scores
  lines.push('## Department Scores');
  lines.push('| Department | Score | Rating |');
  lines.push('|------------|-------|--------|');
  for (const [dept, label] of Object.entries(DEPT_LABELS)) {
    const score = departmentScores?.[dept];
    if (score !== null && score !== undefined) {
      const rounded = Math.round(score * 10) / 10;
      lines.push(`| ${label} | ${rounded} | ${V3_STATUS[Math.round(score)] || 'N/A'} |`);
    }
  }
  lines.push('');

  // Gap Analysis — competencies scoring 3 or below, grouped by pillar
  lines.push('## Gap Analysis');
  lines.push('Competencies scoring Average (3) or below, indicating areas that need improvement.');
  lines.push('');

  for (const pillar of PILLAR_ORDER) {
    const pillarComps = V3_COMPETENCIES.filter((c) => c.pillar === pillar);
    const gaps = [];

    for (const comp of pillarComps) {
      const depts = expandDepartments(comp.departments);
      const deptGaps = [];

      for (const dept of depts) {
        const cellScore = scoreCard?.[comp.id]?.[dept];
        if (cellScore !== null && cellScore !== undefined && cellScore <= 3) {
          deptGaps.push({ dept, score: cellScore });
        }
      }

      if (deptGaps.length > 0) {
        gaps.push({ comp, deptGaps });
      }
    }

    if (gaps.length > 0) {
      lines.push(`### ${PILLAR_LABELS[pillar]}`);
      for (const { comp, deptGaps } of gaps) {
        const deptList = deptGaps
          .map((d) => `${DEPT_LABELS[d.dept]}: ${d.score}/5`)
          .join(', ');
        lines.push(`- **${comp.name}** (${comp.id}) — ${deptList}`);
        if (comp.description) {
          lines.push(`  - ${comp.description}`);
        }
      }
      lines.push('');
    }
  }

  // Roadmap
  if (roadmap?.phases) {
    lines.push('## Recommended Roadmap');
    lines.push(`Total projects: ${roadmap.totalProjects || roadmap.phases.reduce((s, p) => s + p.projects.length, 0)}`);
    lines.push('');

    for (const phase of roadmap.phases) {
      if (phase.projects.length === 0) continue;

      lines.push(`### Phase: ${phase.name}`);
      lines.push(`${phase.description || ''}`);
      lines.push('');

      for (const project of phase.projects) {
        const name = project.service?.name || project.serviceId;
        lines.push(`- **${name}**`);

        if (project.service?.description) {
          lines.push(`  - ${project.service.description}`);
        }

        // Show which competencies this project addresses
        if (project.competencies?.length > 0) {
          const compList = project.competencies
            .map((c) => {
              const deptStr = c.departments
                ?.map((d) => `${DEPT_LABELS[d.name] || d.name}: ${d.currentScore}/5`)
                .join(', ');
              return `${c.name} (${deptStr || 'all'})`;
            })
            .join('; ');
          lines.push(`  - Addresses: ${compList}`);
        }

        if (project.projectedImpact) {
          const impact = project.projectedImpact;
          if (impact.competenciesImproved) {
            lines.push(`  - Projected impact: ${impact.competenciesImproved} competencies improved`);
          }
        }
      }
      lines.push('');
    }
  }

  // Data Coverage Summary
  if (dataCoverage) {
    lines.push('## Data Coverage');
    const sources = [
      { key: 'api', label: 'CRM API Signals' },
      { key: 'intake', label: 'Intake Form' },
      { key: 'transcript', label: 'Discovery Transcript' },
      { key: 'consultant', label: 'Consultant Assessment' },
    ];
    for (const { key, label } of sources) {
      const val = dataCoverage[key];
      if (val !== null && val !== undefined) {
        lines.push(`- **${label}:** ${typeof val === 'number' ? `${Math.round(val * 100)}%` : val}`);
      }
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('*This brief was generated from the LeanScale GTM Diagnostic. Use it as input for SOW generation.*');

  return lines.join('\n');
}
