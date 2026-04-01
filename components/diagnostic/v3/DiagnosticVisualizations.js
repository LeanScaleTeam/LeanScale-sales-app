/**
 * DiagnosticVisualizations — 5 interactive Recharts visualizations from v3 diagnostic data.
 *
 * 1. Pillar Radar Chart
 * 2. Score Distribution Bar Chart
 * 3. Department Comparison Horizontal Bar Chart
 * 4. Overall Health Gauge (animated SVG ring — no Recharts equivalent)
 * 5. Findings Severity Donut (Recharts PieChart)
 */
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  PieChart, Pie,
  ResponsiveContainer,
} from 'recharts';
import { fadeUpItem, staggerContainer } from '../../../lib/animations';
import { PILLAR_ORDER, PILLAR_LABELS, DEPT_LABELS } from '../../../lib/diagnostic-engine/v3/constants-v3';

const SCORE_COLORS = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#22c55e',
  5: '#3b82f6',
};

const SCORE_LABELS = {
  1: 'Non-Existent',
  2: 'Below Average',
  3: 'Average',
  4: 'Above Average',
  5: 'Best Practice',
};

function getScoreColor(score) {
  if (score >= 4) return '#22c55e';
  if (score >= 3) return '#eab308';
  if (score >= 2) return '#f97316';
  return '#ef4444';
}

// Custom dark tooltip
function DarkTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'rgba(15, 10, 30, 0.95)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8,
      padding: '0.5rem 0.75rem',
      fontSize: '0.8rem',
      color: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(8px)',
    }}>
      {label && <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.fill || '#a78bfa' }}>
          {formatter ? formatter(p.value, p.name, p) : `${p.name}: ${p.value}`}
        </div>
      ))}
    </div>
  );
}

// ─── 1. Pillar Radar Chart ────────────────────────────────────

function PillarRadar({ pillarScores }) {
  const data = useMemo(() => {
    return PILLAR_ORDER
      .filter(p => pillarScores?.[p]?._avg != null)
      .map(p => ({
        pillar: PILLAR_LABELS[p],
        score: parseFloat(pillarScores[p]._avg.toFixed(1)),
        fullMark: 5,
      }));
  }, [pillarScores]);

  if (data.length < 3) return null;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} cx="50%" cy="50%" outerRadius="72%">
        <PolarGrid stroke="rgba(255,255,255,0.08)" />
        <PolarAngleAxis
          dataKey="pillar"
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 5]}
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }}
          tickCount={6}
          axisLine={false}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#a3e635"
          fill="#7c3aed"
          fillOpacity={0.3}
          strokeWidth={2}
          dot={{ r: 4, fill: '#a3e635', strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#a3e635', stroke: '#fff', strokeWidth: 2 }}
        />
        <Tooltip content={<DarkTooltip formatter={(val) => `${val} / 5.0`} />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}

// ─── 2. Score Distribution ────────────────────────────────────

function ScoreDistribution({ competencies }) {
  const data = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (!competencies) return [];

    competencies.forEach(comp => {
      const scores = Object.values(comp.departments || {}).filter(s => s !== null);
      scores.forEach(s => {
        const rounded = Math.round(Math.min(5, Math.max(1, s)));
        counts[rounded] = (counts[rounded] || 0) + 1;
      });
    });

    return Object.entries(counts).map(([score, count]) => ({
      score: `${score}`,
      label: SCORE_LABELS[score],
      count,
      fill: SCORE_COLORS[score],
    }));
  }, [competencies]);

  if (data.every(d => d.count === 0)) return null;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} barSize={40} margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis
          dataKey="score"
          tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          content={<DarkTooltip formatter={(val, name, p) => `${val} competencies — ${p.payload.label}`} />}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={800}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} fillOpacity={0.7} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── 3. Department Comparison ─────────────────────────────────

function DeptComparison({ departmentScores }) {
  const data = useMemo(() => {
    return Object.entries(departmentScores || {})
      .filter(([, v]) => v != null)
      .map(([dept, score]) => ({
        dept: DEPT_LABELS[dept] || dept,
        score: parseFloat(score.toFixed(1)),
        fill: getScoreColor(score),
      }));
  }, [departmentScores]);

  if (data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={data.length * 55 + 40}>
      <BarChart data={data} layout="vertical" barSize={24} margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 5]}
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="dept"
          tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={110}
        />
        <Tooltip
          content={<DarkTooltip formatter={(val) => `${val} / 5.0`} />}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
        />
        <Bar dataKey="score" radius={[0, 6, 6, 0]} animationDuration={800}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} fillOpacity={0.6} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── 4. Overall Health Gauge ──────────────────────────────────

function HealthGauge({ overallScore, competencies }) {
  const [animatedOffset, setAnimatedOffset] = useState(427.3);
  const score = overallScore ?? 0;
  const r = 68;
  const circ = 2 * Math.PI * r;
  const targetOffset = circ - ((score / 5) * circ);
  const color = getScoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedOffset(targetOffset), 100);
    return () => clearTimeout(timer);
  }, [targetOffset]);

  const severity = useMemo(() => {
    let critical = 0, needsWork = 0, healthy = 0;
    (competencies || []).forEach(comp => {
      const scores = Object.values(comp.departments || {}).filter(s => s !== null);
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
      if (avg === null) return;
      if (avg < 2.5) critical++;
      else if (avg < 4) needsWork++;
      else healthy++;
    });
    return { critical, needsWork, healthy };
  }, [competencies]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="80" cy="80" r={r} fill="none"
            stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={animatedOffset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color, lineHeight: 1.1 }}>
            {score ? score.toFixed(1) : '--'}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>out of 5.0</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <SeverityStat value={severity.critical} label="Critical Issues" color="#ef4444" />
        <SeverityStat value={severity.needsWork} label="Needs Improvement" color="#fbbf24" />
        <SeverityStat value={severity.healthy} label="Healthy" color="#22c55e" />
      </div>
    </div>
  );
}

function SeverityStat({ value, label, color }) {
  return (
    <div>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>{label}</div>
    </div>
  );
}

// ─── 5. Findings Severity Donut ───────────────────────────────

function SeverityDonut({ competencies }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const breakdown = useMemo(() => {
    let critical = 0, needsWork = 0, healthy = 0;
    (competencies || []).forEach(comp => {
      const scores = Object.values(comp.departments || {}).filter(s => s !== null);
      const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
      if (avg === null) return;
      if (avg < 2.5) critical++;
      else if (avg < 4) needsWork++;
      else healthy++;
    });
    return [
      { name: 'Critical', value: critical, fill: '#ef4444' },
      { name: 'Needs Work', value: needsWork, fill: '#fbbf24' },
      { name: 'Healthy', value: healthy, fill: '#22c55e' },
    ];
  }, [competencies]);

  const total = breakdown.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
      <ResponsiveContainer width={220} height={220}>
        <PieChart>
          <Pie
            data={breakdown}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
            animationDuration={800}
            onMouseEnter={(_, i) => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {breakdown.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.fill}
                fillOpacity={activeIndex === null || activeIndex === i ? 0.85 : 0.3}
                style={{ transition: 'fill-opacity 0.2s ease', cursor: 'pointer' }}
              />
            ))}
          </Pie>
          <Tooltip
            content={<DarkTooltip formatter={(val, name) => `${val} competencies (${Math.round((val / total) * 100)}%)`} />}
          />
          {/* Center label */}
          <text x="50%" y="46%" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="22" fontWeight="700" dominantBaseline="middle">
            {total}
          </text>
          <text x="50%" y="58%" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" dominantBaseline="middle">
            Total
          </text>
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {breakdown.map((seg, i) => (
          <div
            key={seg.name}
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              cursor: 'pointer',
              opacity: activeIndex === null || activeIndex === i ? 1 : 0.4,
              transition: 'opacity 0.2s ease',
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: seg.fill, flexShrink: 0 }} />
            <span style={{ fontWeight: 700, minWidth: '1.5rem' }}>{seg.value}</span>
            <span>{seg.name}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: 4, fontSize: '0.75rem' }}>
              ({Math.round((seg.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Container ───────────────────────────────────────────

export default function DiagnosticVisualizations({
  overallScore,
  pillarScores,
  departmentScores,
  competencies,
}) {
  if (!pillarScores && !departmentScores && !competencies) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '1.5rem',
        marginBottom: 0,
      }}
    >
      {pillarScores && (
        <motion.div variants={fadeUpItem} style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Pillar Radar</h3>
            <p style={cardDescStyle}>Shape of strengths vs gaps across 6 pillars</p>
          </div>
          <PillarRadar pillarScores={pillarScores} />
        </motion.div>
      )}

      <motion.div variants={fadeUpItem} style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h3 style={cardTitleStyle}>Overall Health</h3>
          <p style={cardDescStyle}>Diagnostic score with severity breakdown</p>
        </div>
        <HealthGauge overallScore={overallScore} competencies={competencies} />
      </motion.div>

      {competencies && competencies.length > 0 && (
        <motion.div variants={fadeUpItem} style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Score Distribution</h3>
            <p style={cardDescStyle}>Competency scores across maturity levels</p>
          </div>
          <ScoreDistribution competencies={competencies} />
        </motion.div>
      )}

      {departmentScores && (
        <motion.div variants={fadeUpItem} style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Department Comparison</h3>
            <p style={cardDescStyle}>Which teams need the most attention</p>
          </div>
          <DeptComparison departmentScores={departmentScores} />
        </motion.div>
      )}

      {competencies && competencies.length > 0 && (
        <motion.div variants={fadeUpItem} style={{ ...cardStyle, gridColumn: '1 / -1' }}>
          <div style={cardHeaderStyle}>
            <h3 style={cardTitleStyle}>Findings Breakdown</h3>
            <p style={cardDescStyle}>Distribution of critical vs healthy competencies</p>
          </div>
          <SeverityDonut competencies={competencies} />
        </motion.div>
      )}
    </motion.div>
  );
}

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: 14,
  padding: '1.5rem',
  backdropFilter: 'blur(12px)',
  transition: 'border-color 0.2s ease',
};

const cardHeaderStyle = {
  marginBottom: '1rem',
};

const cardTitleStyle = {
  margin: 0,
  fontSize: '0.95rem',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.85)',
  letterSpacing: '-0.01em',
};

const cardDescStyle = {
  margin: '0.2rem 0 0',
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.35)',
  lineHeight: 1.4,
};
