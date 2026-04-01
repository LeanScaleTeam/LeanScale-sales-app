/**
 * PresenterMode — Full-screen slide-based diagnostic walkthrough
 *
 * 13-slide flow with keyboard navigation, Framer Motion transitions,
 * speaker notes panel, and progress indicator.
 *
 * Keys: ←/→ navigate, Escape exit, N toggle notes
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import {
  PILLAR_LABELS,
  DEPARTMENTS,
  DEPT_LABELS,
  V3_STATUS,
  V3_STATUS_COLORS,
} from '../../../lib/diagnostic-engine/v3/constants-v3';
import { presenterSlideRight, presenterSlideLeft, collapseExpand } from '../../../lib/animations';
import { statusColors, statusLabels } from '../../../data/power10-metrics';

const STATUS_TO_NUMERIC = { healthy: 4, careful: 3, warning: 2, unable: 1 };
const SHORT_NAMES = {
  'ARR': 'ARR', 'Bookings': 'Bookings', 'Gross churn': 'Churn',
  'Gross retention': 'GRR', 'MQL -> Opportunity conversion rate': 'MQL→Opp',
  'MQL production': 'MQL Prod', 'Net retention': 'NRR',
  'Opportunity/Deal - CW cycle time': 'Cycle Time',
  'Opportunity/Deal -> CW conversion rate': 'Opp→CW', 'Pipeline production': 'Pipeline',
};

// ── Slide Templates ──

function TitleSlide({ slide }) {
  return (
    <div style={slideStyles.centered}>
      <div style={{ fontSize: '1rem', color: 'rgba(163, 230, 53, 0.8)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>
        LeanScale
      </div>
      <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 800, color: '#fff', margin: '0 0 1rem 0', lineHeight: 1.1 }}>
        {slide.title}
      </h1>
      <p style={{ fontSize: 'clamp(1.2rem, 2.5vw, 2rem)', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
        {slide.subtitle}
      </p>
      <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', marginTop: '2rem' }}>
        {slide.content.date}
      </div>
    </div>
  );
}

function ExecutiveSummarySlide({ slide }) {
  const { overallScore, pillarScores } = slide.content;
  return (
    <div style={slideStyles.padded}>
      <h2 style={slideStyles.slideTitle}>{slide.title}</h2>
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center', marginTop: '2rem' }}>
        {/* Score ring */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={slideStyles.scoreRing}>
            <span style={{ fontSize: 'clamp(2rem, 4vw, 4rem)', fontWeight: 800, color: '#fff' }}>
              {overallScore?.toFixed(1) || 'N/A'}
            </span>
            <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)' }}> / 5.0</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontSize: '1.1rem' }}>Overall Score</div>
        </div>
        {/* Pillar bars */}
        <div style={{ flex: 1 }}>
          {pillarScores && Object.entries(pillarScores).map(([key, val]) => {
            const avg = val?._avg;
            if (avg === null || avg === undefined) return null;
            return (
              <div key={key} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.1rem' }}>{PILLAR_LABELS[key]}</span>
                  <span style={{ color: '#a3e635', fontWeight: 700, fontSize: '1.1rem' }}>{avg.toFixed(1)}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 6, height: 12, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(avg / 5) * 100}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${V3_STATUS_COLORS[Math.round(avg)]}, ${V3_STATUS_COLORS[Math.min(5, Math.round(avg) + 1)] || '#34d399'})`,
                    borderRadius: 6,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PerformanceToPlanSlide({ slide }) {
  const { metrics } = slide.content;
  if (!metrics || metrics.length === 0) {
    return (
      <div style={slideStyles.padded}>
        <h2 style={slideStyles.slideTitle}>{slide.title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem' }}>No Power10 metrics available</p>
      </div>
    );
  }
  const radarData = metrics.map((m) => ({
    metric: SHORT_NAMES[m.name] || m.name,
    reporting: STATUS_TO_NUMERIC[m.ableToReport] || 0,
    performance: STATUS_TO_NUMERIC[m.statusAgainstPlan] || 0,
  }));

  return (
    <div style={slideStyles.padded}>
      <h2 style={slideStyles.slideTitle}>{slide.title}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
        <div>
          {metrics.map((m) => (
            <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1rem' }}>{m.name}</span>
              <span style={{ color: statusColors[m.statusAgainstPlan], fontWeight: 600, fontSize: '1rem' }}>
                {statusLabels[m.statusAgainstPlan]}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }} />
              <Radar name="Reporting" dataKey="reporting" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} />
              <Radar name="Performance" dataKey="performance" stroke="#a3e635" fill="#a3e635" fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function PillarDeepDiveSlide({ slide }) {
  const { pillar, avgScore, deptScores, weakestCompetencies, evidence } = slide.content;
  return (
    <div style={slideStyles.padded}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.5rem' }}>
        <h2 style={{ ...slideStyles.slideTitle, margin: 0 }}>{slide.title}</h2>
        <span style={{ fontSize: '1.5rem', color: '#a3e635', fontWeight: 700 }}>{avgScore?.toFixed(1) || 'N/A'}</span>
      </div>

      {/* Department scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {DEPARTMENTS.map((dept) => {
          const score = deptScores[dept];
          return (
            <div key={dept} style={slideStyles.deptCard}>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.3rem' }}>{DEPT_LABELS[dept]}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: score ? V3_STATUS_COLORS[Math.round(score)] : 'rgba(255,255,255,0.3)' }}>
                {score?.toFixed(1) || '--'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{score ? V3_STATUS[Math.round(score)] : 'No Data'}</div>
            </div>
          );
        })}
      </div>

      {/* Weakest competencies */}
      {weakestCompetencies?.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Areas Needing Attention
          </h3>
          {weakestCompetencies.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: V3_STATUS_COLORS[Math.round(c.score)], fontWeight: 700, fontSize: '1.2rem', minWidth: '2.5rem' }}>
                {c.score.toFixed(1)}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.05rem' }}>{c.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Evidence quotes */}
      {evidence?.length > 0 && (
        <div>
          {evidence.slice(0, 2).map((ev, i) => (
            <div key={i} style={slideStyles.quoteBlock}>
              <div style={{ fontSize: '0.8rem', color: '#a3e635', marginBottom: '0.3rem' }}>{ev.competency}</div>
              {ev.quotes.slice(0, 1).map((q, qi) => (
                <div key={qi} style={{ color: 'rgba(255,255,255,0.75)', fontStyle: 'italic', fontSize: '1rem' }}>
                  &ldquo;{q}&rdquo;
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function YourWordsSlide({ slide }) {
  const { groupedEvidence } = slide.content;
  const pillars = Object.entries(groupedEvidence || {});
  return (
    <div style={slideStyles.padded}>
      <h2 style={slideStyles.slideTitle}>{slide.title}</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>{slide.subtitle}</p>
      {pillars.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>No transcript evidence available</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: pillars.length > 3 ? '1fr 1fr' : '1fr', gap: '1.5rem' }}>
          {pillars.map(([pillar, entries]) => (
            <div key={pillar}>
              <h3 style={{ color: '#a3e635', fontSize: '1rem', marginBottom: '0.75rem' }}>{PILLAR_LABELS[pillar] || pillar}</h3>
              {entries.slice(0, 2).map((entry, i) => (
                <div key={i} style={slideStyles.quoteBlock}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem' }}>{entry.competency}</div>
                  {entry.quotes.slice(0, 1).map((q, qi) => (
                    <div key={qi} style={{ color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                      &ldquo;{q}&rdquo;
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function KeyFindingsSlide({ slide }) {
  const { weakestCompetencies } = slide.content;
  return (
    <div style={slideStyles.padded}>
      <h2 style={slideStyles.slideTitle}>{slide.title}</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', marginBottom: '2rem' }}>{slide.subtitle}</p>
      <div>
        {(weakestCompetencies || []).map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: V3_STATUS_COLORS[Math.round(c.score)], minWidth: '3rem' }}>
              {c.score.toFixed(1)}
            </span>
            <div>
              <div style={{ color: '#fff', fontSize: '1.15rem', fontWeight: 600 }}>{c.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                {PILLAR_LABELS[c.pillar]} &middot; {DEPT_LABELS[c.department]}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapOverviewSlide({ slide }) {
  const { phases } = slide.content;
  const phaseLabels = { FOUNDATION: 'Foundation', BUILD: 'Build', OPTIMIZE: 'Optimize', SCALE: 'Scale' };
  const phaseColors = { FOUNDATION: '#f87171', BUILD: '#fbbf24', OPTIMIZE: '#34d399', SCALE: '#60a5fa' };
  return (
    <div style={slideStyles.padded}>
      <h2 style={slideStyles.slideTitle}>{slide.title}</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.1rem', marginBottom: '2rem' }}>{slide.subtitle}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        {(phases || []).map((p) => (
          <div key={p.phase} style={{ ...slideStyles.deptCard, borderTop: `3px solid ${phaseColors[p.phase]}` }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: phaseColors[p.phase], marginBottom: '0.75rem' }}>
              {phaseLabels[p.phase]}
            </div>
            {p.projects.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', fontSize: '0.9rem' }}>No projects</div>
            ) : (
              p.projects.map((proj, i) => (
                <div key={i} style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem', padding: '0.3rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {proj.name}
                  {proj.competencyCount > 0 && (
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}> ({proj.competencyCount})</span>
                  )}
                </div>
              ))
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NextStepsSlide({ slide }) {
  const { steps } = slide.content;
  return (
    <div style={slideStyles.centered}>
      <h2 style={{ ...slideStyles.slideTitle, marginBottom: '2rem' }}>{slide.title}</h2>
      <div style={{ textAlign: 'left', maxWidth: '600px' }}>
        {(steps || []).map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <span style={{ background: '#a3e635', color: '#1a1a2e', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
              {i + 1}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '1.2rem', paddingTop: '0.15rem' }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SLIDE_RENDERERS = {
  'title': TitleSlide,
  'executive-summary': ExecutiveSummarySlide,
  'performance-to-plan': PerformanceToPlanSlide,
  'pillar-deep-dive': PillarDeepDiveSlide,
  'your-words': YourWordsSlide,
  'key-findings': KeyFindingsSlide,
  'roadmap-overview': RoadmapOverviewSlide,
  'next-steps': NextStepsSlide,
};

// ── Main Component ──

export default function PresenterMode({ slides, onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const containerRef = useRef(null);

  const totalSlides = slides.length;
  const slide = slides[currentSlide];

  const goNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((s) => s + 1);
    }
  }, [currentSlide, totalSlides]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((s) => s - 1);
    }
  }, [currentSlide]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
      else if (e.key === 'Escape') { onClose(); }
      else if (e.key === 'n' || e.key === 'N') { setShowNotes((v) => !v); }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, onClose]);

  // Focus container on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const variants = direction === 1 ? presenterSlideRight : presenterSlideLeft;
  const SlideRenderer = SLIDE_RENDERERS[slide?.type];

  return (
    <div ref={containerRef} tabIndex={-1} style={presenterStyles.overlay}>
      {/* Progress bar */}
      <div style={presenterStyles.progressBar}>
        <div style={{ ...presenterStyles.progressFill, width: `${((currentSlide + 1) / totalSlides) * 100}%` }} />
      </div>

      {/* Slide counter */}
      <div style={presenterStyles.counter}>
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* Close button */}
      <button onClick={onClose} style={presenterStyles.closeBtn} title="Exit (Esc)">
        &times;
      </button>

      {/* Slide content */}
      <div style={presenterStyles.slideArea}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide?.id || currentSlide}
            variants={variants}
            initial="hidden"
            animate="show"
            exit="exit"
            style={presenterStyles.slideContent}
          >
            {SlideRenderer ? <SlideRenderer slide={slide} /> : (
              <div style={slideStyles.centered}>
                <h2 style={slideStyles.slideTitle}>{slide?.title || 'Slide'}</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>{slide?.subtitle}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <div style={presenterStyles.navRow}>
        <button
          onClick={goPrev}
          disabled={currentSlide === 0}
          style={{ ...presenterStyles.navBtn, opacity: currentSlide === 0 ? 0.3 : 1 }}
        >
          &#8592;
        </button>
        <button
          onClick={() => setShowNotes((v) => !v)}
          style={{ ...presenterStyles.navBtn, fontSize: '0.85rem', padding: '0.4rem 1rem' }}
        >
          {showNotes ? 'Hide Notes' : 'Notes (N)'}
        </button>
        <button
          onClick={goNext}
          disabled={currentSlide === totalSlides - 1}
          style={{ ...presenterStyles.navBtn, opacity: currentSlide === totalSlides - 1 ? 0.3 : 1 }}
        >
          &#8594;
        </button>
      </div>

      {/* Speaker notes */}
      <AnimatePresence>
        {showNotes && slide?.speakerNotes && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={presenterStyles.notesPanel}
          >
            <div style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
              {slide.speakerNotes}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Styles ──

const presenterStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1040 40%, #1e0a3a 100%)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'var(--font-primary, "Plus Jakarta Sans", sans-serif)',
    outline: 'none',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    background: 'rgba(255,255,255,0.1)',
    zIndex: 2,
  },
  progressFill: {
    height: '100%',
    background: '#a3e635',
    transition: 'width 0.3s ease',
    borderRadius: '0 2px 2px 0',
  },
  counter: {
    position: 'absolute',
    top: 16,
    left: 24,
    color: 'rgba(255,255,255,0.4)',
    fontSize: '0.85rem',
    zIndex: 2,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 20,
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '1.8rem',
    cursor: 'pointer',
    zIndex: 2,
    lineHeight: 1,
    padding: '0.25rem',
  },
  slideArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    padding: '3rem 2rem 1rem',
  },
  slideContent: {
    width: '100%',
    maxWidth: '1100px',
    minHeight: '400px',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    padding: '0.75rem',
  },
  navBtn: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    borderRadius: 8,
    padding: '0.5rem 1.25rem',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  notesPanel: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(0,0,0,0.3)',
    overflow: 'hidden',
  },
};

const slideStyles = {
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minHeight: '400px',
  },
  padded: {
    padding: '1rem 0',
  },
  slideTitle: {
    fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
    fontWeight: 700,
    color: '#ffffff',
    margin: '0 0 0.5rem 0',
  },
  scoreRing: {
    width: 160,
    height: 160,
    borderRadius: '50%',
    border: '4px solid rgba(163, 230, 53, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    background: 'rgba(255,255,255,0.03)',
  },
  deptCard: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10,
    padding: '1rem',
    textAlign: 'center',
  },
  quoteBlock: {
    borderLeft: '3px solid #a3e635',
    paddingLeft: '1rem',
    marginBottom: '1rem',
  },
};
