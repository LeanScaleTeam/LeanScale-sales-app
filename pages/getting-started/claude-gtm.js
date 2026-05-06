import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useCustomer } from '../../context/CustomerContext';

const stats = [
  { value: '7', label: 'GTM functions covered' },
  { value: '40+', label: 'Co-pilot prompts built' },
  { value: '4 wks', label: 'Start to finish' },
  { value: '$50K', label: 'Fixed. No surprises.' },
];

const infrastructure = [
  {
    title: 'Claude Code',
    icon: '⌨️',
    tag: 'Agentic Dev',
    tagColor: '#a3e635',
    tagText: '#1a2e05',
    description: 'Agentic coding environment wired into your GTM stack. Build, automate, and deploy without switching tools.',
    items: [
      'Environment setup & team onboarding',
      'MCP server config for CRM + data tools',
      'Custom slash commands per GTM role',
      'Automated workflow hooks & triggers',
      'Custom prompt library per GTM role',
    ],
  },
  {
    title: 'Claude for Work',
    icon: '🏢',
    tag: 'Team Workspace',
    tagColor: '#7c3aed',
    tagText: '#fff',
    description: 'Shared AI workspace for your revenue org — collaborate on prompts, share outputs, and keep your best work in one place.',
    items: [
      'Org-level workspace provisioned',
      'Team permissions & access controls',
      'Shared projects per GTM function',
      'Slack + Notion integration',
      'Company knowledge base loaded',
    ],
  },
  {
    title: 'Claude Chat',
    icon: '💬',
    tag: 'Role Co-Pilot',
    tagColor: '#e8722a',
    tagText: '#fff',
    description: 'Role-specific Chat configs so every rep, manager, and marketer has a tailored AI co-pilot from day one.',
    items: [
      'Custom system prompts per role',
      'ICP, playbook & product context pre-loaded',
      'Daily workflow prompt templates',
      'Admin guide for managing configs',
      'Onboarding flow for each persona',
    ],
  },
];

const gtmRoles = [
  {
    role: 'BDR',
    title: 'Business Development',
    color: '#a3e635',
    textColor: '#1a2e05',
    agents: [
      { name: 'Prospect Research', prompt: 'Research [company] — summarize tech stack, recent funding, hiring signals, and top GTM problems. Format for a 3-line personalization hook.' },
      { name: 'Outreach Personalizer', prompt: 'Write a 3-line cold opener for [contact] at [company] referencing [signal]. No generic lines. Sound like a human.' },
      { name: 'Objection Handler', prompt: 'My prospect said "[objection]". Two responses: one for email, one for 30-sec voicemail. Crisp, no fluff.' },
      { name: 'Meeting Prep Brief', prompt: 'Discovery call with [company] tomorrow. Pull: who they are, what they care about, 5 questions I shouldn\'t miss.' },
    ],
  },
  {
    role: 'AE',
    title: 'Account Executive',
    color: '#7c3aed',
    textColor: '#fff',
    agents: [
      { name: 'Discovery Builder', prompt: 'I\'m selling [product] to [role] at [company type]. Give me 8 discovery questions that surface urgency, economic impact, and change drivers.' },
      { name: 'Proposal Drafter', prompt: 'Draft an exec summary for a proposal to [company]. Solving [pain]. Investment [price]. 3 paragraphs, outcome-led.' },
      { name: 'Deal Coach', prompt: 'Deal status: [summary]. What are the 3 biggest risks and my best next move to advance this week?' },
      { name: 'Follow-Up Sequence', prompt: 'Great call with [prospect], no reply in [X] days. Write a 3-touch follow-up — each message different, each short.' },
    ],
  },
  {
    role: 'Sales Mgr',
    title: 'Sales Management',
    color: '#e8722a',
    textColor: '#fff',
    agents: [
      { name: 'Pipeline Review Prep', prompt: 'Team pipeline this week: [data]. Identify 3 deals most at risk. One coaching action per rep.' },
      { name: 'Forecast Narrative', prompt: 'Forecast narrative for the board: [pipeline, commit, best case]. What\'s at risk. What\'s de-risked since last week.' },
      { name: 'Rep Coaching Brief', prompt: '[Rep] is struggling with [skill]. Coaching plan: what to observe, reinforce, and a drill they can run this week.' },
      { name: 'Win/Loss Debrief', prompt: 'We [won/lost] [company]. Reason: [reason]. What does this signal about ICP fit, process, or competitive position?' },
    ],
  },
  {
    role: 'Marketing',
    title: 'Marketing',
    color: '#06b6d4',
    textColor: '#fff',
    agents: [
      { name: 'Campaign Brief', prompt: 'Campaign brief for [initiative]: goal, target audience, core message, 3 content angles to test.' },
      { name: 'Content Repurposer', prompt: 'Repurpose this [content] into: a LinkedIn post, nurture email opener, and 1-slide talk track for sales.' },
      { name: 'ICP Signal Finder', prompt: 'Here are 10 best customers: [list]. Find the 5 patterns they share that we\'re not currently targeting.' },
      { name: 'ABM Account Research', prompt: 'ABM campaign for [account]: strategic priorities, key stakeholders, 3 pain points our product maps to.' },
    ],
  },
  {
    role: 'CS',
    title: 'Customer Success',
    color: '#10b981',
    textColor: '#fff',
    agents: [
      { name: 'QBR Prep Builder', prompt: 'QBR with [customer] next week: usage summary, value vs. goals, top risks, 3 expansion angles.' },
      { name: 'Health Score Alert', prompt: 'Health score dropped from [X] to [Y]. Draft an outreach that opens a conversation without alarming them.' },
      { name: 'Expansion Finder', prompt: '[Customer] uses [products] today. What expansion plays should I pitch and what\'s my opening line?' },
      { name: 'Renewal Letter', prompt: 'Renewal letter for [customer]. [X months] with us, achieved [outcome]. Investment [ARR]. Make the ROI case briefly.' },
    ],
  },
  {
    role: 'RevOps',
    title: 'Revenue Operations',
    color: '#f59e0b',
    textColor: '#1a2e05',
    agents: [
      { name: 'Data Hygiene Audit', prompt: 'Sample CRM records: [10 rows]. Top 5 data quality issues and a field-level fix for each.' },
      { name: 'Attribution Analyst', prompt: 'We closed [X] deals last quarter. Touch points for 5: [paste]. What attribution model fits our buying journey?' },
      { name: 'Dashboard Narrative', prompt: 'Pipeline metrics this month: [paste]. 3-paragraph board narrative: what happened, why, what we\'re doing.' },
      { name: 'Territory Analyzer', prompt: 'Territory split: [paste]. Imbalances in coverage, opportunity density, rep capacity. One rebalancing move.' },
    ],
  },
  {
    role: 'Enablement',
    title: 'Sales Enablement',
    color: '#a855f7',
    textColor: '#fff',
    agents: [
      { name: 'Playbook Creator', prompt: 'One-page playbook for [motion/stage]: objective, key questions, common objections, ideal next step.' },
      { name: 'Onboarding Builder', prompt: 'New [role] starts in [X] days. Build a 30-day learning plan with daily topics, resources, milestones.' },
      { name: 'Objection Library', prompt: 'Top 10 objections: [list]. For each: 2-sentence response + follow-up question that advances the deal.' },
      { name: 'Call Analysis Brief', prompt: 'Call transcript: [paste]. Score on discovery depth, talk ratio, next step clarity. 3 coaching points.' },
    ],
  },
];

const phases = [
  { week: 'WK 1', title: 'Infrastructure & Setup', color: '#a3e635', items: ['Claude Code env deployed', 'Claude for Work org provisioned', 'MCP servers connected to CRM', 'Role-specific Chat configs live'] },
  { week: 'WK 2', title: 'Prompts & Configuration', color: '#7c3aed', items: ['BDR + AE prompts built & tested', 'Sales Mgr + RevOps prompts built', 'Marketing + CS prompts built', 'All 7 roles configured in Claude'] },
  { week: 'WK 3', title: 'Integration & Iteration', color: '#e8722a', items: ['CRM workflow hooks wired', 'Slack + Notion integrations on', 'Team testing sessions per role', 'Prompts tuned from real usage'] },
  { week: 'WK 4', title: 'Training & Handoff', color: '#10b981', items: ['Live training for all GTM roles', 'Admin guide for prompt management', 'Prompt library documented', '30-day usage review scheduled'] },
];

export default function ClaudeGTM() {
  const { customer, customerPath } = useCustomer();
  const [activeRole, setActiveRole] = useState(0);
  const [hoveredInfra, setHoveredInfra] = useState(null);
  const diagnosticHref = customer.hasDiagnosticResult
    ? `/diagnostic/${customer.diagnosticType || 'gtm'}`
    : '/diagnostic/start';

  const role = gtmRoles[activeRole];

  return (
    <Layout title="Claude GTM Transformation">
      <style jsx global>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes float-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .claude-hero-badge { animation: float-up 0.5s ease both; }
        .claude-stat-item { animation: float-up 0.5s ease both; }
        .claude-role-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .claude-agent-card:hover { border-color: rgba(255,255,255,0.15) !important; background: rgba(255,255,255,0.05) !important; }
        .claude-infra-card:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(0,0,0,0.3) !important; }
        .claude-phase-node:hover .phase-ring { opacity: 1 !important; }
      `}</style>

      {/* ── HERO ── */}
      <div style={{
        background: 'linear-gradient(160deg, #060412 0%, #0f0720 30%, #1a0a2e 60%, #0f0720 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 2rem 5rem',
        textAlign: 'center',
      }}>
        {/* Mesh grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        {/* Dual glow */}
        <div style={{ position: 'absolute', top: '-10%', left: '15%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: '0%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(232,114,42,0.14) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '40%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(163,230,53,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          {/* Badge */}
          <div className="claude-hero-badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.75rem',
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)', borderRadius: '9999px',
            padding: '0.45rem 1.1rem', marginBottom: '2rem',
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em',
            color: 'rgba(255,255,255,0.55)',
          }}>
            <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#e8722a', boxShadow: '0 0 6px #e8722a' }} />
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#e8722a', animation: 'pulse-ring 2s ease-out infinite' }} />
            </span>
            LEANSCALE × ANTHROPIC
            <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.15)' }} />
            <span style={{ color: '#e8722a' }}>NEW</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900,
            lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: '1.25rem',
            color: '#fff',
          }}>
            Claude GTM<br />
            <span style={{
              background: 'linear-gradient(135deg, #e8722a 0%, #f5a96b 40%, #a3e635 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Transformation.
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.5)', maxWidth: 580, margin: '0 auto 1rem', lineHeight: 1.7 }}>
            Full Claude stack across your GTM org — Code, Co-Work, and Chat — with 40+ purpose-built co-pilot prompts for every revenue function.
          </p>

          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.3)', marginBottom: '2.5rem', letterSpacing: '0.02em' }}>
            $50,000 fixed &nbsp;·&nbsp; 4 weeks &nbsp;·&nbsp; Done.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#agents" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'linear-gradient(135deg, #e8722a 0%, #d4621e 100%)',
              color: '#fff', padding: '0.85rem 2rem', borderRadius: '9999px',
              fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem',
              boxShadow: '0 0 32px rgba(232,114,42,0.35)',
              transition: 'all 0.2s ease',
            }}>
              See the prompts →
            </a>
            <a href="#infrastructure" style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', padding: '0.85rem 2rem', borderRadius: '9999px',
              fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem',
              transition: 'all 0.2s ease',
            }}>
              What&apos;s included
            </a>
          </div>
        </div>
      </div>

      {/* ── STATS BAND ── */}
      <div style={{ background: '#080614', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '2.25rem 2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.5rem' }}>
          {stats.map((s, i) => (
            <div key={i} className="claude-stat-item" style={{ textAlign: 'center', padding: '1rem', animationDelay: `${i * 0.08}s` }}>
              <div style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1, color: '#fff', marginBottom: '0.35rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── INFRASTRUCTURE ── */}
      <div id="infrastructure" style={{ background: '#0a0618', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#e8722a', marginBottom: '0.75rem' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#e8722a' }} />
              The Foundation
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Three Claude products.<br />One unified GTM stack.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 500, margin: '0 auto', fontSize: '1rem', lineHeight: 1.65 }}>
              We deploy and wire the full Claude suite into your existing tools — CRM, Slack, Notion, and beyond.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            {infrastructure.map((infra, i) => (
              <div
                key={infra.title}
                className="claude-infra-card"
                onMouseEnter={() => setHoveredInfra(i)}
                onMouseLeave={() => setHoveredInfra(null)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${hoveredInfra === i ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: '16px', padding: '1.75rem',
                  transition: 'all 0.25s ease',
                  position: 'relative', overflow: 'hidden',
                  boxShadow: hoveredInfra === i ? '0 16px 48px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                {/* Top accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${infra.tagColor}88, ${infra.tagColor}22)` }} />
                {/* Icon + tag */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.75rem', lineHeight: 1 }}>{infra.icon}</span>
                  <span style={{ background: infra.tagColor, color: infra.tagText, fontSize: '0.65rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {infra.tag}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>{infra.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: '1.25rem' }}>{infra.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {infra.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>
                      <span style={{ color: infra.tagColor, marginTop: 2, flexShrink: 0, fontSize: '0.7rem' }}>▸</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ── GTM AGENTS ── */}
      <div id="agents" style={{ background: '#060412', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7c3aed', marginBottom: '0.75rem' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#7c3aed' }} />
              GTM Co-Pilot Prompts
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              7 functions. 40+ prompts.<br />Every role covered.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: 500, margin: '0 auto', fontSize: '1rem', lineHeight: 1.65 }}>
              Purpose-built prompts you run directly in Claude — no automation required. Click any role to preview.
            </p>
          </div>

          {/* Role tab bar */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
            {gtmRoles.map((r, i) => (
              <button
                key={r.role}
                className="claude-role-btn"
                onClick={() => setActiveRole(i)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '9999px',
                  border: `1px solid ${activeRole === i ? r.color : 'rgba(255,255,255,0.1)'}`,
                  background: activeRole === i ? r.color : 'rgba(255,255,255,0.03)',
                  color: activeRole === i ? r.textColor : 'rgba(255,255,255,0.5)',
                  fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer',
                  transition: 'all 0.15s ease', letterSpacing: '0.02em',
                  fontFamily: 'inherit',
                  boxShadow: activeRole === i ? `0 0 20px ${r.color}44` : 'none',
                }}
              >
                {r.role}
              </button>
            ))}
          </div>

          {/* Active role panel */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${role.color}22`,
            borderTop: `2px solid ${role.color}`,
            borderRadius: '16px', overflow: 'hidden',
          }}>
            {/* Role header */}
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ background: role.color, color: role.textColor, fontWeight: 800, fontSize: '0.72rem', padding: '0.3rem 0.7rem', borderRadius: '6px', letterSpacing: '0.06em' }}>{role.role}</span>
                <span style={{ fontSize: '1rem', fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{role.title}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>{role.agents.length} prompts included</span>
            </div>

            {/* Agent cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0', borderBottom: 'none' }}>
              {role.agents.map((agent, i) => (
                <div
                  key={i}
                  className="claude-agent-card"
                  style={{
                    padding: '1.25rem 1.75rem',
                    borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    transition: 'all 0.15s ease',
                    cursor: 'default',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: role.color, flexShrink: 0, boxShadow: `0 0 6px ${role.color}` }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{agent.name}</span>
                  </div>
                  {/* Prompt shown as terminal line */}
                  <div style={{
                    background: 'rgba(0,0,0,0.4)', borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: role.color, fontSize: '0.7rem', marginTop: '0.1rem', flexShrink: 0 }}>›_</span>
                      <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.55, fontStyle: 'italic' }}>{agent.prompt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role dots navigator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '1.25rem' }}>
            {gtmRoles.map((r, i) => (
              <button key={i} onClick={() => setActiveRole(i)} style={{
                width: activeRole === i ? 24 : 8,
                height: 8, borderRadius: '9999px', border: 'none', cursor: 'pointer', padding: 0,
                background: activeRole === i ? r.color : 'rgba(255,255,255,0.15)',
                transition: 'all 0.2s ease',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── TIMELINE ── */}
      <div style={{ background: '#0a0618', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#10b981', marginBottom: '0.75rem' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981' }} />
              The 4-Week Plan
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Infrastructure live. Team trained.<br />One month.
            </h2>
          </div>

          {/* Timeline nodes + connectors */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', position: 'relative', marginBottom: '2rem' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: 28, left: '12.5%', right: '12.5%', height: 2, background: 'linear-gradient(90deg, #a3e635, #7c3aed, #e8722a, #10b981)', opacity: 0.35, zIndex: 0 }} />
            {phases.map((phase, i) => (
              <div key={i} className="claude-phase-node" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                {/* Node */}
                <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
                  <div className="phase-ring" style={{
                    position: 'absolute', inset: -6, borderRadius: '50%',
                    border: `2px solid ${phase.color}`, opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }} />
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: `${phase.color}18`,
                    border: `2px solid ${phase.color}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 20px ${phase.color}22`,
                  }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: phase.color, letterSpacing: '0.04em' }}>{phase.week}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '0 0.5rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', marginBottom: '0.75rem', lineHeight: 1.3 }}>{phase.title}</div>
                  {phase.items.map((item, j) => (
                    <div key={j} style={{ fontSize: '0.73rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: '0.15rem' }}>{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee bar */}
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderLeft: '3px solid #a3e635',
            borderRadius: '12px', padding: '1.25rem 1.75rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
          }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#a3e635', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.2rem' }}>What you walk away with</div>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>Full Claude stack deployed, 40+ co-pilot prompts configured, and every GTM team member trained and using AI on day 30.</div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', whiteSpace: 'nowrap' }}>$50,000</div>
          </div>
        </div>
      </div>

      {/* ── WHAT'S INCLUDED ── */}
      <div style={{ background: '#080614', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>
              Full Scope
            </div>
            <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Everything included.<br />Nothing upsold.</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            {[
              ['⌨️', 'Claude Code Setup'],
              ['🏢', 'Claude for Work Org'],
              ['💬', 'Role Chat Configs (7)'],
              ['🤖', '40+ Co-Pilot Prompts'],
              ['🔌', 'CRM Integrations'],
              ['🔗', 'Slack + Notion Hooks'],
              ['🛠️', 'MCP Server Config'],
              ['📖', 'Admin Playbook'],
              ['🎓', 'Training — All Roles'],
              ['📋', 'Prompt Template Library'],
              ['🔄', '30-Day Usage Review'],
            ].map(([icon, label], i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px', fontSize: '0.82rem', fontWeight: 500, color: 'rgba(255,255,255,0.55)',
                transition: 'border-color 0.15s, color 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
              >
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHO IT'S FOR / NOT FOR ── */}
      <div style={{ background: '#0a0618', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a3e635', marginBottom: '1rem' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#a3e635' }} />
              Who This Is For
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>Teams going all-in on Claude.</h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              You&apos;ve seen the demos. You know AI is changing the GTM game. This gets your team ahead of it — fully deployed, not just experimenting.
            </p>
            {[
              'B2B SaaS with 10–200 person GTM teams',
              'Organizations using or evaluating Claude',
              'Revenue leaders who want AI in real workflow',
              'Teams with a CRM and at least one data tool',
              'Companies where speed-to-adoption matters',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', padding: '0.35rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)' }}>
                <span style={{ color: '#a3e635', fontWeight: 700, flexShrink: 0 }}>+</span> {item}
              </div>
            ))}
          </div>

          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#ef4444', marginBottom: '1rem' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ef4444' }} />
              Who This Is NOT For
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>Not the right fit for everyone.</h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              If you&apos;re still evaluating whether AI is worth it, start with GTM Embedded. This is for teams committing to Claude across the org.
            </p>
            {[
              'Teams that want a 1-tool or 1-function pilot only',
              'Orgs not yet on any CRM or engagement platform',
              'Companies without exec sponsorship for AI adoption',
              'Teams that want to build everything from scratch',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', padding: '0.35rem 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>
                <span style={{ color: '#ef4444', flexShrink: 0 }}>–</span> {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FINAL CTA ── */}
      <div style={{
        background: 'linear-gradient(160deg, #060412 0%, #0f0720 40%, #1a0a18 100%)',
        padding: '6rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(232,114,42,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '50%', right: '20%', transform: 'translate(50%, -50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.75rem', lineHeight: 1.1 }}>
            Your team using Claude.<br />
            <span style={{ background: 'linear-gradient(135deg, #e8722a 0%, #f5a96b 40%, #a3e635 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              By next month.
            </span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem', maxWidth: 420, margin: '0 auto 0.5rem', lineHeight: 1.65 }}>
            7 GTM functions. 40+ co-pilot prompts. Full Claude infrastructure.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem', marginBottom: '2.5rem' }}>
            $50,000 fixed · No hourly billing · No scope creep
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={customerPath(diagnosticHref)} style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #e8722a 0%, #d4621e 100%)',
              color: '#fff', padding: '0.9rem 2.25rem',
              borderRadius: '9999px', fontWeight: 700, textDecoration: 'none',
              fontSize: '0.95rem', boxShadow: '0 0 32px rgba(232,114,42,0.3)',
            }}>
              {customer.hasDiagnosticResult ? 'View Diagnostic' : 'Start Diagnostic'}
            </Link>
            <a href="#agents" style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.65)', padding: '0.9rem 2.25rem',
              borderRadius: '9999px', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem',
            }}>
              View all prompts
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
