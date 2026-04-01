import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fadeUpItem, staggerContainer } from '../../lib/animations';
import allTeam from '../../data/team';

/**
 * Phase1Scope — "Let's Start" step of the Engagement Pitch.
 * Hype-focused: cohort availability front and center with scarcity signals,
 * quick investment summary, and a compact 90-day preview.
 */

const STATUS_CONFIG = {
  available: {
    bg: 'rgba(34, 197, 94, 0.06)',
    border: 'rgba(34, 197, 94, 0.25)',
    text: '#86efac',
    glow: 'rgba(34, 197, 94, 0.12)',
    label: 'Open',
    dot: '#4ade80',
  },
  limited: {
    bg: 'rgba(250, 204, 21, 0.06)',
    border: 'rgba(250, 204, 21, 0.25)',
    text: '#fde047',
    glow: 'rgba(250, 204, 21, 0.1)',
    label: 'Almost Full',
    dot: '#facc15',
  },
  waitlist: {
    bg: 'rgba(251, 146, 60, 0.06)',
    border: 'rgba(251, 146, 60, 0.25)',
    text: '#fdba74',
    glow: 'rgba(251, 146, 60, 0.08)',
    label: 'Waitlist',
    dot: '#fb923c',
  },
  sold_out: {
    bg: 'rgba(255, 255, 255, 0.02)',
    border: 'rgba(255, 255, 255, 0.06)',
    text: 'rgba(255, 255, 255, 0.3)',
    glow: 'none',
    label: 'Sold Out',
    dot: 'rgba(255, 255, 255, 0.2)',
  },
};

function daysUntil(dateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function Phase1Scope({ roadmap, customerPath, editMode }) {
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);

  useEffect(() => {
    fetch('/api/availability')
      .then(res => res.ok ? res.json() : { dates: [] })
      .then(json => {
        // Show next 5 cohorts (mix of sold out + available for scarcity)
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const allUpcoming = (json.dates || []).filter(d => new Date(d.date + 'T00:00:00') >= now);
        setCohorts(allUpcoming.slice(0, 6));
      })
      .catch(() => setCohorts([]));
  }, []);

  if (!roadmap || !roadmap.phases) return null;

  const phase1 = roadmap.phases[0];
  if (!phase1) return null;
  const projects = phase1.projects || [];

  // Find the first bookable cohort (not sold out)
  const firstAvailable = cohorts.find(c => c.status !== 'sold_out');
  const urgencyDays = firstAvailable ? daysUntil(firstAvailable.date) : null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}
    >
      {/* Hero header */}
      <motion.div variants={fadeUpItem} style={{ textAlign: 'center', marginBottom: '0.25rem' }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 800,
          margin: 0,
          letterSpacing: '-0.03em',
          background: 'linear-gradient(135deg, #fff 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Reserve Your Spot
        </h2>
        <p style={{
          fontSize: '0.85rem',
          color: 'rgba(255, 255, 255, 0.5)',
          margin: '0.35rem auto 0',
          maxWidth: '420px',
        }}>
          We onboard in cohorts every 2 weeks. Spots are limited to ensure quality.
        </p>
      </motion.div>

      {/* Urgency banner */}
      {urgencyDays !== null && urgencyDays <= 21 && (
        <motion.div
          variants={fadeUpItem}
          style={{
            textAlign: 'center',
            padding: '0.6rem 1rem',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(250, 204, 21, 0.08) 100%)',
            border: '1px solid rgba(250, 204, 21, 0.2)',
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          <span style={{ color: '#fde047' }}>Next available cohort starts in {urgencyDays} days</span>
          {firstAvailable?.spotsLeft != null && (
            <span style={{ color: 'rgba(255,255,255,0.5)', marginLeft: '0.5rem' }}>
              — {firstAvailable.spotsLeft} spot{firstAvailable.spotsLeft !== 1 ? 's' : ''} remaining
            </span>
          )}
        </motion.div>
      )}

      {/* Cohort timeline — the main event */}
      <motion.div variants={fadeUpItem}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '0.6rem',
        }}>
          {cohorts.map(cohort => {
            const s = STATUS_CONFIG[cohort.status] || STATUS_CONFIG.available;
            const days = daysUntil(cohort.date);
            const dateObj = new Date(cohort.date + 'T00:00:00');
            const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const year = dateObj.getFullYear();
            const isBookable = cohort.status !== 'sold_out';
            const isSelected = selectedCohort === cohort.cohortNumber;
            const isSoldOut = cohort.status === 'sold_out';

            return (
              <motion.div
                key={cohort.cohortNumber}
                whileHover={isBookable ? { y: -3, scale: 1.02 } : {}}
                whileTap={isBookable ? { scale: 0.98 } : {}}
                onClick={() => isBookable && setSelectedCohort(isSelected ? null : cohort.cohortNumber)}
                style={{
                  padding: '1rem',
                  borderRadius: 12,
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(167, 139, 250, 0.08) 100%)'
                    : s.bg,
                  border: `1.5px solid ${isSelected ? '#7c3aed' : s.border}`,
                  cursor: isBookable ? 'pointer' : 'default',
                  opacity: isSoldOut ? 0.5 : 1,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s, background 0.2s',
                  boxShadow: isSelected ? '0 0 20px rgba(124, 58, 237, 0.15)' : 'none',
                }}
              >
                {/* Cohort label */}
                <div style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '0.35rem',
                }}>
                  Cohort {cohort.cohortNumber}
                </div>

                {/* Date */}
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: isSoldOut ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.95)',
                  letterSpacing: '-0.01em',
                }}>
                  {monthDay}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.35)',
                  marginBottom: '0.5rem',
                }}>
                  {year}
                </div>

                {/* Status badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  background: isSoldOut ? 'rgba(255,255,255,0.04)' : `${s.bg}`,
                  border: `1px solid ${s.border}`,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: s.text,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: s.dot,
                    animation: isBookable && cohort.status !== 'waitlist' ? 'pulse 2s infinite' : 'none',
                  }} />
                  {s.label}
                </div>

                {/* Spots */}
                {cohort.spotsLeft != null && isBookable && (
                  <div style={{
                    fontSize: '0.65rem',
                    color: cohort.spotsLeft <= 1 ? '#f87171' : 'rgba(255,255,255,0.4)',
                    fontWeight: cohort.spotsLeft <= 1 ? 600 : 400,
                    marginTop: '0.35rem',
                  }}>
                    {cohort.spotsLeft}/{cohort.spotsTotal || 3} spots left
                  </div>
                )}

                {/* Days countdown */}
                {isBookable && days > 0 && (
                  <div style={{
                    fontSize: '0.6rem',
                    color: 'rgba(255,255,255,0.25)',
                    marginTop: '0.15rem',
                  }}>
                    in {days} days
                  </div>
                )}

                {/* Selected check */}
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.6rem',
                    color: 'white',
                  }}>
                    ✓
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Selected cohort CTA */}
      {selectedCohort && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            textAlign: 'center',
            padding: '1.25rem',
            borderRadius: 14,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, rgba(167, 139, 250, 0.06) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.25)',
          }}
        >
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '0.6rem',
          }}>
            Ready to lock in Cohort {selectedCohort}?
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button
              style={{
                padding: '0.6rem 1.5rem',
                borderRadius: 10,
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: 'white',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
              }}
            >
              Book a Call to Reserve
            </button>
          </div>
          <div style={{
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.35)',
            marginTop: '0.5rem',
          }}>
            No commitment — we&apos;ll walk through scope and timing together
          </div>
        </motion.div>
      )}

      {/* Compact investment strip */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          padding: '1rem 1.5rem',
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <Stat value={`$${(roadmap.monthlyPrice / 1000).toFixed(0)}K`} label="per month" accent />
        <Stat value={roadmap.monthlyHours} label="hours/mo" />
        <Stat value={projects.length} label="projects" />
        <Stat value={phase1.timing} label="timeline" />
      </motion.div>

      {/* Your Team */}
      <YourTeam />

      {/* Pulse animation */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </motion.div>
  );
}

function Stat({ value, label, accent }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '1.25rem',
        fontWeight: 700,
        color: accent ? '#a78bfa' : 'rgba(255,255,255,0.9)',
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)' }}>{label}</div>
    </div>
  );
}

function YourTeam() {
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('leanscale-selected-team');
      if (stored) setSelectedIds(JSON.parse(stored));
    } catch {}
  }, []);

  // Show selected team, or fall back to a preview of 3 members
  const members = selectedIds.length > 0
    ? allTeam.filter(m => selectedIds.includes(m.id))
    : allTeam.slice(0, 3);

  const isPreview = selectedIds.length === 0;

  return (
    <motion.div variants={fadeUpItem}>
      <div style={{
        fontSize: '0.65rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'rgba(255,255,255,0.2)',
        marginBottom: '0.5rem',
      }}>
        {isPreview ? 'Meet the Team' : 'Your Team'}
      </div>
      <div style={{
        display: 'flex',
        gap: '0.6rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
      }}>
        {members.map(member => (
          <div
            key={member.id}
            style={{
              flex: '0 0 auto',
              width: 140,
              padding: '1rem 0.75rem',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center',
            }}
          >
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              margin: '0 auto 0.5rem',
              overflow: 'hidden',
              border: '2px solid rgba(124, 58, 237, 0.3)',
            }}>
              <img
                src={member.photo}
                alt={member.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '0.15rem',
            }}>
              {member.name.split(' ')[0]}
            </div>
            <div style={{
              fontSize: '0.6rem',
              color: '#a78bfa',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              {member.role}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
