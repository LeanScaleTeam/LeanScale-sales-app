/**
 * Diagnostic v3 Export — Full Markdown for SOW generation
 * GET /api/diagnostic/v3/export?customerId=...
 *
 * Produces a comprehensive markdown document covering all diagnostic data,
 * engagement terms, consultant notes, and transcript signals — suitable
 * for feeding into the SOW maker or generating a full statement of work.
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

    // Fetch consultant assessments with notes
    const { data: consultantRows } = await supabaseAdmin
      .from('consultant_assessments')
      .select('competency_id, department, score, notes, assessed_by, assessed_at')
      .eq('customer_id', customerId);

    // Fetch transcript project signals (evidence from discovery calls)
    const { data: signalRows } = await supabaseAdmin
      .from('transcript_project_signals')
      .select('service_id, signal_type, confidence, evidence, reasoning')
      .eq('customer_id', customerId);

    // Deduplicate signals: keep highest confidence per service_id
    const signalMap = {};
    for (const row of signalRows || []) {
      if (!signalMap[row.service_id] || row.confidence > signalMap[row.service_id].confidence) {
        signalMap[row.service_id] = row;
      }
    }

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
      engagementOverrides: data.engagement_overrides,
      consultantRows: consultantRows || [],
      projectSignals: Object.values(signalMap),
      updatedAt: data.updated_at || data.created_at,
    });

    // Return as downloadable markdown file
    const filename = `${companyName.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()}-diagnostic-sow-brief.md`;
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(markdown);
  } catch (err) {
    console.error('v3 export error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function fmt(val, fallback = 'Not specified') {
  return val != null && val !== '' ? val : fallback;
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
  engagementOverrides,
  consultantRows,
  projectSignals,
  updatedAt,
}) {
  const lines = [];
  const date = new Date(updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // ── Header ──────────────────────────────────────────────────────────────────
  lines.push(`# GTM Diagnostic — ${companyName}`);
  lines.push(`*Generated: ${date} | LeanScale GTM Diagnostic v3*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // ── Engagement Terms ─────────────────────────────────────────────────────────
  lines.push('## Engagement Terms');
  if (engagementOverrides && Object.keys(engagementOverrides).length > 0) {
    const e = engagementOverrides;
    lines.push(`| Field | Value |`);
    lines.push(`|-------|-------|`);
    lines.push(`| Engagement Type | ${fmt(e.engagement_type)} |`);
    lines.push(`| Monthly Investment | ${e.monthly_investment ? `$${Number(e.monthly_investment).toLocaleString()}/mo` : 'Not specified'} |`);
    lines.push(`| Monthly Hours | ${e.monthly_hours ? `${e.monthly_hours} hrs/mo` : 'Not specified'} |`);
    lines.push(`| Start Date | ${fmt(e.start_date)} |`);
    lines.push(`| Minimum Commitment | ${fmt(e.minimum_commitment, '3 months')} |`);
    if (e.notes) {
      lines.push('');
      lines.push('**Strategic Notes:**');
      lines.push('');
      lines.push(`> ${e.notes}`);
    }
  } else {
    lines.push('*Engagement terms not yet defined.*');
  }
  lines.push('');

  // ── Company Profile ──────────────────────────────────────────────────────────
  lines.push('## Company Profile');
  if (companyProfile) {
    lines.push(`| Field | Value |`);
    lines.push(`|-------|-------|`);
    lines.push(`| CRM | ${fmt(companyProfile.crm)} |`);
    lines.push(`| Sales Team Size | ${fmt(companyProfile.repCount)} |`);
    lines.push(`| ARR Range | ${fmt(companyProfile.arrRange)} |`);
    lines.push(`| GTM Motion | ${fmt(companyProfile.gtmMotion)} |`);
    lines.push(`| Partner Channel | ${companyProfile.hasPartners ? 'Yes' : 'No'} |`);
    if (companyProfile.notes) {
      lines.push(`| Notes | ${companyProfile.notes} |`);
    }
  }
  lines.push('');

  // ── Overall Score ────────────────────────────────────────────────────────────
  lines.push('## Overall GTM Health Score');
  const roundedOverall = Math.round(overallScore * 10) / 10;
  const overallStatus = V3_STATUS[Math.round(overallScore)] || 'N/A';
  lines.push(`**${roundedOverall} / 5.0** — ${overallStatus}`);
  lines.push('');

  // ── Pillar Scores ─────────────────────────────────────────────────────────────
  lines.push('## Pillar Scores');
  lines.push('| Pillar | Score | Rating |');
  lines.push('|--------|-------|--------|');
  for (const pillar of PILLAR_ORDER) {
    const score = pillarScores?.[pillar]?._avg ?? pillarScores?.[pillar];
    if (score !== null && score !== undefined) {
      const rounded = Math.round(score * 10) / 10;
      lines.push(`| ${PILLAR_LABELS[pillar]} | ${rounded} | ${V3_STATUS[Math.round(score)] || 'N/A'} |`);
    }
  }
  lines.push('');

  // ── Department Scores ─────────────────────────────────────────────────────────
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

  // ── Full Competency Scorecard ─────────────────────────────────────────────────
  lines.push('## Full Competency Scorecard');
  lines.push('*All competencies with scores across relevant departments. Use this as evidence for the SOW.*');
  lines.push('');

  for (const pillar of PILLAR_ORDER) {
    const pillarComps = V3_COMPETENCIES.filter((c) => c.pillar === pillar);
    const hasAnyScore = pillarComps.some((comp) => {
      const depts = expandDepartments(comp.departments);
      return depts.some((dept) => scoreCard?.[comp.id]?.[dept] !== null && scoreCard?.[comp.id]?.[dept] !== undefined);
    });
    if (!hasAnyScore) continue;

    lines.push(`### ${PILLAR_LABELS[pillar]}`);
    lines.push('');

    for (const comp of pillarComps) {
      const depts = expandDepartments(comp.departments);
      const scores = [];
      for (const dept of depts) {
        const val = scoreCard?.[comp.id]?.[dept];
        if (val !== null && val !== undefined) {
          scores.push({ dept, score: val });
        }
      }
      if (scores.length === 0) continue;

      const avg = scores.reduce((s, d) => s + d.score, 0) / scores.length;
      const avgRounded = Math.round(avg * 10) / 10;
      const status = V3_STATUS[Math.round(avg)] || 'N/A';
      const flag = avg <= 2 ? ' 🔴' : avg <= 3 ? ' 🟡' : ' 🟢';

      lines.push(`#### ${comp.name}${flag} — avg ${avgRounded}/5 (${status})`);
      if (comp.description) {
        lines.push(`*${comp.description}*`);
      }
      lines.push('');

      // Dept breakdown
      const deptLine = scores.map((d) => `${DEPT_LABELS[d.dept] || d.dept}: ${d.score}/5`).join(' | ');
      lines.push(`> ${deptLine}`);

      // Consultant notes for this competency
      const compNotes = consultantRows.filter(
        (r) => r.competency_id === comp.id && r.notes && r.notes !== 'Admin override'
      );
      if (compNotes.length > 0) {
        lines.push('');
        lines.push('**Consultant Notes:**');
        for (const n of compNotes) {
          const deptLabel = DEPT_LABELS[n.department] || n.department;
          lines.push(`- [${deptLabel}] ${n.notes}`);
        }
      }
      lines.push('');
    }
  }

  // ── Gap Analysis (≤3 focus) ──────────────────────────────────────────────────
  lines.push('## Critical Gaps (Score ≤ 3)');
  lines.push('*Competencies requiring immediate attention, grouped by pillar.*');
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
        const deptList = deptGaps.map((d) => `${DEPT_LABELS[d.dept]}: ${d.score}/5`).join(', ');
        lines.push(`- **${comp.name}** — ${deptList}`);
        if (comp.description) {
          lines.push(`  - ${comp.description}`);
        }
      }
      lines.push('');
    }
  }

  // ── Transcript & Discovery Signals ───────────────────────────────────────────
  if (projectSignals.length > 0) {
    lines.push('## Discovery Call Signals');
    lines.push('*Evidence from transcript analysis — use these as "WHAT WE FOUND" blocks in the SOW.*');
    lines.push('');

    // Group by signal_type
    const confirmed = projectSignals.filter((s) => s.signal_type === 'confirmed');
    const inferred = projectSignals.filter((s) => s.signal_type === 'inferred');
    const mentioned = projectSignals.filter((s) => !['confirmed', 'inferred'].includes(s.signal_type));

    const renderSignals = (signals, label) => {
      if (signals.length === 0) return;
      lines.push(`### ${label}`);
      for (const s of signals) {
        lines.push(`#### ${s.service_id}`);
        if (s.evidence) {
          lines.push(`**Evidence:** ${s.evidence}`);
        }
        if (s.reasoning) {
          lines.push(`**Reasoning:** ${s.reasoning}`);
        }
        lines.push(`*Confidence: ${s.confidence !== undefined ? `${Math.round(s.confidence * 100)}%` : 'N/A'}*`);
        lines.push('');
      }
    };

    renderSignals(confirmed, 'Confirmed Signals');
    renderSignals(inferred, 'Inferred Signals');
    renderSignals(mentioned, 'Mentioned / Other');
  }

  // ── Consultant Assessment Notes ───────────────────────────────────────────────
  const consultantWithNotes = consultantRows.filter((r) => r.notes && r.notes !== 'Admin override');
  if (consultantWithNotes.length > 0) {
    lines.push('## Consultant Assessment Notes');
    lines.push('*Qualitative observations from the LeanScale consultant review.*');
    lines.push('');

    // Group by competency_id
    const byComp = {};
    for (const row of consultantWithNotes) {
      if (!byComp[row.competency_id]) byComp[row.competency_id] = [];
      byComp[row.competency_id].push(row);
    }

    for (const [compId, rows] of Object.entries(byComp)) {
      const comp = V3_COMPETENCIES.find((c) => c.id === compId);
      lines.push(`### ${comp?.name || compId}`);
      for (const r of rows) {
        const deptLabel = DEPT_LABELS[r.department] || r.department;
        lines.push(`- **[${deptLabel}]** Score: ${r.score}/5 — ${r.notes}`);
      }
      lines.push('');
    }
  }

  // ── Recommended Roadmap ───────────────────────────────────────────────────────
  if (roadmap?.phases) {
    const totalProjects = roadmap.phases.reduce((s, p) => s + (p.projects?.length || 0), 0);
    lines.push('## Recommended Roadmap');
    lines.push(`*${totalProjects} total projects across ${roadmap.phases.length} phases.*`);
    lines.push('');

    for (const phase of roadmap.phases) {
      if (!phase.projects?.length) continue;

      lines.push(`### Phase: ${phase.name}`);
      if (phase.description) lines.push(`*${phase.description}*`);
      lines.push('');

      for (const project of phase.projects) {
        const name = project.service?.name || project.serviceId;
        const isCustom = project.isCustom ? ' *(catalog)*' : '';
        lines.push(`#### ${name}${isCustom}`);

        if (project.service?.description) {
          lines.push(`${project.service.description}`);
          lines.push('');
        }

        // Transcript signal evidence for this project
        const signal = projectSignals.find((s) => s.service_id === project.serviceId);
        if (signal?.evidence) {
          lines.push(`**WHAT WE FOUND:** ${signal.evidence}`);
          if (signal.reasoning) {
            lines.push(`*${signal.reasoning}*`);
          }
          lines.push('');
        }

        // Competencies this project addresses
        if (project.competencies?.length > 0) {
          const compList = project.competencies
            .map((c) => {
              const deptStr = c.departments
                ?.map((d) => `${DEPT_LABELS[d.name] || d.name}: ${d.currentScore}/5`)
                .join(', ');
              return `${c.name}${deptStr ? ` (${deptStr})` : ''}`;
            })
            .join('; ');
          lines.push(`*Addresses: ${compList}*`);
          lines.push('');
        }
      }
    }
  }

  // ── Data Coverage ─────────────────────────────────────────────────────────────
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
        lines.push(`- **${label}:** ${typeof val === 'number' ? `${Math.round(val * 100)}% coverage` : val}`);
      }
    }
    lines.push('');
  }

  lines.push('---');
  lines.push(`*LeanScale GTM Diagnostic — ${companyName} — ${date}*`);
  lines.push('*Use this document as input for SOW generation, proposal drafting, or executive presentation preparation.*');

  return lines.join('\n');
}
