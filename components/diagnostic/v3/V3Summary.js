/**
 * V3Summary — Overall score with 6-pillar breakdown and top priorities
 *
 * Split into 3 distinct visual sections:
 * 1. Score hero (large ring + company profile badges)
 * 2. Pillar breakdown (6 cards with gradient accents)
 * 3. Top priorities (standalone card)
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PILLAR_ORDER,
  PILLAR_LABELS,
  V3_STATUS,
  V3_STATUS_COLORS,
  DEPT_LABELS,
} from '../../../lib/diagnostic-engine/v3/constants-v3';
import { fadeUpItem, staggerContainer } from '../../../lib/animations';

// Softer colors for dark backgrounds
const SCORE_COLORS = {
  1: '#f87171', // soft red
  2: '#fb923c', // soft orange
  3: '#fbbf24', // soft yellow
  4: '#4ade80', // soft green
  5: '#34d399', // soft emerald
};

function getScoreColor(score) {
  if (!score && score !== 0) return '#CBD5E0';
  return SCORE_COLORS[Math.round(score)] || '#CBD5E0';
}

function AnimatedScoreRing({ score, label }) {
  const r = 62, circ = 2 * Math.PI * r;
  const pct = score ? (score / 5) * 100 : 0;
  const targetOffset = circ - (pct / 100) * circ;
  const [offset, setOffset] = useState(circ);
  const color = getScoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => setOffset(targetOffset), 150);
    return () => clearTimeout(timer);
  }, [targetOffset]);

  return (
    <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
      {/* Subtle glow behind the ring */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 100, height: 100, borderRadius: '50%',
        background: color, opacity: 0.08, filter: 'blur(20px)',
      }} />
      <svg width="150" height="150" viewBox="0 0 150 150" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
        <circle
          cx="75" cy="75" r={r} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)', textAlign: 'center',
      }}>
        <span style={{
          display: 'block', fontSize: '2.25rem', fontWeight: 700, lineHeight: 1,
          color: '#ffffff', letterSpacing: '-0.02em',
        }}>{score !== null ? score.toFixed(1) : '--'}</span>
        <span style={{
          display: 'block', fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.45)',
          fontWeight: 500, marginTop: '0.25rem', textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>{label || 'No Data'}</span>
      </div>
    </div>
  );
}

export default function V3Summary({
  overallScore,
  overallLabel,
  pillarScores,
  departmentScores,
  companyProfile,
  roadmapSummary,
  dataCoverage,
}) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      {/* Card 1: Score hero */}
      <motion.div variants={fadeUpItem} style={{
        ...glassCard,
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        padding: '1.75rem 2rem',
        flexWrap: 'wrap',
        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.06) 0%, rgba(255, 255, 255, 0.03) 100%)',
      }}>
        <AnimatedScoreRing score={overallScore} label={overallLabel} />
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{
              fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)',
            }}>
              Overall Score
            </span>
            <span style={{
              fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.3)', marginLeft: '0.5rem',
            }}>out of 5.0</span>
          </div>
          {dataCoverage && (
            <div style={{
              fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.35)', marginBottom: '0.75rem',
            }}>
              {dataCoverage.coveragePercent}% data coverage
            </div>
          )}
          {/* Company profile badges */}
          {companyProfile && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {companyProfile.crm && companyProfile.crm !== 'unknown' && (
                <span style={badgeStyle}>CRM: {companyProfile.crm}</span>
              )}
              {companyProfile.repCount && companyProfile.repCount !== 'unknown' && (
                <span style={badgeStyle}>Reps: {companyProfile.repCount}</span>
              )}
              {companyProfile.arrRange && companyProfile.arrRange !== 'unknown' && (
                <span style={badgeStyle}>ARR: {companyProfile.arrRange}</span>
              )}
              {companyProfile.gtmMotion && companyProfile.gtmMotion !== 'unknown' && (
                <span style={badgeStyle}>GTM: {companyProfile.gtmMotion}</span>
              )}
              {companyProfile.hasPartners && (
                <span style={badgeStyle}>Partners</span>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* Card 2: Pillar breakdown */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {PILLAR_ORDER.map((pillar) => {
          const score = pillarScores?.[pillar]?._avg;
          const color = getScoreColor(score);

          return (
            <motion.div
              key={pillar}
              variants={fadeUpItem}
              whileHover={{
                background: 'rgba(255, 255, 255, 0.07)',
                borderColor: 'rgba(255, 255, 255, 0.15)',
                y: -2,
              }}
              style={{
                padding: '1rem 1.1rem',
                borderRadius: 10,
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                transition: 'all 0.25s ease',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 2, background: color, opacity: 0.5,
              }} />
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                marginBottom: '0.6rem',
              }}>
                <span style={{
                  fontSize: '0.8rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.65)',
                }}>
                  {PILLAR_LABELS[pillar]}
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 700, color }}>
                  {score !== null && score !== undefined ? score.toFixed(1) : '--'}
                </span>
              </div>
              <div style={{
                height: 5, borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  width: score ? `${(score / 5) * 100}%` : '0%',
                  backgroundColor: color, opacity: 0.7,
                  transition: 'width 0.6s ease',
                }} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Card 3: Top priorities */}
      {roadmapSummary?.topPriorities?.length > 0 && (
        <motion.div variants={fadeUpItem} style={{ ...glassCard, padding: '1.25rem 1.5rem' }}>
          <h4 style={{
            margin: '0 0 0.75rem', fontSize: '0.9rem', fontWeight: 600,
            color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}>
            Top Priorities
          </h4>
          {roadmapSummary.topPriorities.map((p, i) => (
            <div key={p.serviceId} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0',
              borderBottom: i < roadmapSummary.topPriorities.length - 1
                ? '1px solid rgba(255,255,255,0.04)' : 'none',
            }}>
              <span style={{
                width: '1.5rem', height: '1.5rem', borderRadius: '50%',
                background: 'linear-gradient(135deg, #a3e635, #84cc16)',
                color: '#1a1a2e',
                fontWeight: 700, fontSize: '0.7rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{
                fontSize: '0.88rem', fontWeight: 500, flex: 1,
                color: 'rgba(255, 255, 255, 0.85)',
              }}>
                {p.name}
              </span>
              <span style={{
                fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.35)',
                textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.03em',
              }}>
                {p.phase}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

const glassCard = {
  background: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: 12,
  backdropFilter: 'blur(12px)',
};

const badgeStyle = {
  fontSize: '0.72rem',
  padding: '0.25rem 0.7rem',
  borderRadius: '1rem',
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: 'rgba(255, 255, 255, 0.6)',
  fontWeight: 500,
};
