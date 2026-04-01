/**
 * buildPresenterSlides — Pure function that builds the 13-slide presenter deck
 *
 * Input:  { v3Result, transcriptAssessments, companyProfile, power10Data, roadmap }
 * Output: Array of slide objects for PresenterMode
 */

import {
  PILLAR_ORDER,
  PILLAR_LABELS,
  DEPARTMENTS,
  DEPT_LABELS,
  V3_STATUS,
  V3_COMPETENCIES,
  expandDepartments,
} from './constants-v3';

function getTopWeakCompetencies(scoreCard, pillar, dept, limit = 3) {
  const comps = V3_COMPETENCIES.filter(
    (c) => c.pillar === pillar && expandDepartments(c.departments).includes(dept)
  );
  return comps
    .map((c) => ({
      id: c.id,
      name: c.name,
      score: scoreCard?.[c.id]?.[dept] ?? null,
    }))
    .filter((c) => c.score !== null)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit);
}

function getGlobalWeakCompetencies(scoreCard, limit = 5) {
  const all = [];
  for (const comp of V3_COMPETENCIES) {
    for (const dept of expandDepartments(comp.departments)) {
      const score = scoreCard?.[comp.id]?.[dept];
      if (score !== null && score !== undefined) {
        all.push({
          id: comp.id,
          name: comp.name,
          pillar: comp.pillar,
          department: dept,
          score,
        });
      }
    }
  }
  return all.sort((a, b) => a.score - b.score).slice(0, limit);
}

function groupEvidenceByPillar(transcriptAssessments) {
  const grouped = {};
  for (const [key, data] of Object.entries(transcriptAssessments || {})) {
    if (!data.evidence || data.evidence.length === 0) continue;
    const [compId] = key.split('_');
    const comp = V3_COMPETENCIES.find((c) => c.id === compId);
    const pillar = comp?.pillar || 'unknown';
    if (!grouped[pillar]) grouped[pillar] = [];
    grouped[pillar].push({
      competency: comp?.name || compId,
      quotes: data.evidence,
      assessment: data.assessment,
    });
  }
  return grouped;
}

export default function buildPresenterSlides({
  v3Result,
  transcriptAssessments = {},
  companyProfile = {},
  power10Data = [],
  roadmap = {},
}) {
  const slides = [];

  // 1. Title
  slides.push({
    id: 'title',
    type: 'title',
    title: companyProfile?.company_name || 'GTM Diagnostic',
    subtitle: 'Go-to-Market Diagnostic Assessment',
    content: {
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    },
    speakerNotes: 'Welcome and set context. This diagnostic covers 6 pillars across 4 departments with ~124 competencies.',
  });

  // 2. Executive Summary
  slides.push({
    id: 'executive-summary',
    type: 'executive-summary',
    title: 'Executive Summary',
    subtitle: `Overall Score: ${v3Result?.overall_score?.toFixed(1) || 'N/A'} / 5.0`,
    content: {
      overallScore: v3Result?.overall_score,
      pillarScores: v3Result?.pillar_scores,
      departmentScores: v3Result?.department_scores,
    },
    speakerNotes: 'High-level overview. Focus on the overall score and which pillars need the most attention.',
  });

  // 3. Performance-to-Plan
  slides.push({
    id: 'performance-to-plan',
    type: 'performance-to-plan',
    title: 'Performance to Plan',
    subtitle: 'Power10 metric health across your GTM organization',
    content: { metrics: power10Data },
    speakerNotes: 'Walk through each metric. Focus on metrics marked as "unable to report" — these are blind spots.',
  });

  // 4-9. Pillar Deep Dives
  for (const pillar of PILLAR_ORDER) {
    const pillarScore = v3Result?.pillar_scores?.[pillar];
    const deptScores = {};
    for (const dept of DEPARTMENTS) {
      deptScores[dept] = pillarScore?.[dept] ?? null;
    }

    const weakest = [];
    for (const dept of DEPARTMENTS) {
      weakest.push(...getTopWeakCompetencies(v3Result?.score_card, pillar, dept, 2));
    }
    weakest.sort((a, b) => a.score - b.score);
    const topWeak = weakest.slice(0, 3);

    // Gather evidence for this pillar
    const pillarEvidence = [];
    for (const [key, data] of Object.entries(transcriptAssessments || {})) {
      if (!data.evidence || data.evidence.length === 0) continue;
      const [compId] = key.split('_');
      const comp = V3_COMPETENCIES.find((c) => c.id === compId);
      if (comp?.pillar === pillar) {
        pillarEvidence.push({
          competency: comp.name,
          quotes: data.evidence.slice(0, 2),
        });
      }
    }

    slides.push({
      id: `pillar-${pillar}`,
      type: 'pillar-deep-dive',
      title: PILLAR_LABELS[pillar],
      subtitle: `Average: ${pillarScore?._avg?.toFixed(1) || 'N/A'} / 5.0`,
      content: {
        pillar,
        avgScore: pillarScore?._avg,
        deptScores,
        weakestCompetencies: topWeak,
        evidence: pillarEvidence.slice(0, 3),
      },
      speakerNotes: `Deep dive into ${PILLAR_LABELS[pillar]}. Highlight the weakest competencies and any transcript evidence.`,
    });
  }

  // 10. "Your Words, Our Findings"
  const groupedEvidence = groupEvidenceByPillar(transcriptAssessments);
  slides.push({
    id: 'your-words',
    type: 'your-words',
    title: 'Your Words, Our Findings',
    subtitle: 'Direct evidence from stakeholder interviews',
    content: { groupedEvidence },
    speakerNotes: 'These are direct quotes from the team. Let them land — they validate the scoring.',
  });

  // 11. Key Findings
  const globalWeak = getGlobalWeakCompetencies(v3Result?.score_card, 5);
  slides.push({
    id: 'key-findings',
    type: 'key-findings',
    title: 'Key Findings',
    subtitle: 'Top areas requiring immediate attention',
    content: { weakestCompetencies: globalWeak },
    speakerNotes: 'These are the top 5 weakest competencies across all pillars and departments.',
  });

  // 12. Roadmap Overview
  const phases = ['FOUNDATION', 'BUILD', 'OPTIMIZE', 'SCALE'];
  const roadmapSummary = phases.map((phase) => ({
    phase,
    projects: (roadmap?.[phase] || []).slice(0, 3).map((p) => ({
      name: p.serviceId || p.name,
      competencyCount: p.competencyCount || 0,
    })),
  }));

  slides.push({
    id: 'roadmap-overview',
    type: 'roadmap-overview',
    title: 'Recommended Roadmap',
    subtitle: 'Prioritized path from foundation to scale',
    content: { phases: roadmapSummary },
    speakerNotes: 'Walk through the 4 phases. Foundation items are urgent; Scale items are aspirational.',
  });

  // 13. Next Steps
  slides.push({
    id: 'next-steps',
    type: 'next-steps',
    title: 'Next Steps',
    subtitle: 'Recommended actions to move forward',
    content: {
      steps: [
        'Review diagnostic findings with leadership team',
        'Prioritize foundation-phase initiatives',
        'Establish baseline metrics for tracking improvement',
        'Schedule follow-up assessment in 90 days',
      ],
    },
    speakerNotes: 'Close with clear next steps. Offer to schedule a follow-up to track progress.',
  });

  return slides;
}
