import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../../components/Layout';
import team from '../../data/team';
import { staggerContainer, fadeUpItem } from '../../lib/animations';

const architects = team.filter(m => m.role === 'Architect');
const engineers = team.filter(m => m.role === 'Engineer');

const TEAM_STATS = [
  { value: '120+', label: 'Engagements Delivered' },
  { value: '80+', label: 'Years Combined Experience' },
  { value: '25+', label: 'Certifications Held' },
  { value: '5', label: 'Countries Represented' },
];

// ─── Architect Card (horizontal, prominent) ────────────────────────────────────

function ArchitectCard({ member, isSelected, onToggle }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onToggle(member.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        gap: 0,
        background: isSelected
          ? 'rgba(124,58,237,0.1)'
          : hovered
          ? 'rgba(255,255,255,0.03)'
          : 'rgba(10,8,20,0.7)',
        border: isSelected
          ? '1.5px solid rgba(124,58,237,0.55)'
          : hovered
          ? '1px solid rgba(255,255,255,0.14)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: isSelected
          ? '0 0 32px rgba(124,58,237,0.18), inset 0 0 20px rgba(124,58,237,0.06)'
          : 'none',
        borderRadius: 16,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      {/* Photo strip */}
      <div style={{
        width: 150,
        flexShrink: 0,
        background: member.photo
          ? `url(${member.photo}) center/cover no-repeat`
          : 'rgba(124,58,237,0.2)',
        position: 'relative',
      }}>
        {/* Gradient fade to card bg */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isSelected
            ? 'linear-gradient(to right, transparent 55%, rgba(124,58,237,0.15))'
            : 'linear-gradient(to right, transparent 55%, rgba(10,8,20,0.7))',
          transition: 'background 0.2s',
        }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '1.25rem 1.25rem 1.25rem 1.1rem', minWidth: 0 }}>

        {/* Top row: name + toggle */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'rgba(255,255,255,0.97)', margin: '0 0 0.2rem', letterSpacing: '-0.01em' }}>
              {member.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                background: 'rgba(99,102,241,0.2)',
                color: '#818cf8',
                border: '1px solid rgba(99,102,241,0.3)',
                padding: '0.1rem 0.5rem',
                borderRadius: 4,
                fontSize: '0.62rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {member.title}
              </span>
              {member.location && (
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                  📍 {member.location}
                </span>
              )}
            </div>
          </div>

          {/* Selection indicator */}
          <div style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
            background: isSelected ? '#7c3aed' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s',
            boxShadow: isSelected ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
          }}>
            {isSelected ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
          </div>
        </div>

        {/* Headline */}
        <p style={{
          fontSize: '0.75rem',
          color: isSelected ? '#c4b5fd' : 'rgba(255,255,255,0.55)',
          fontStyle: 'italic',
          margin: '0.5rem 0 0.65rem',
          lineHeight: 1.5,
          transition: 'color 0.2s',
        }}>
          "{member.headline}"
        </p>

        {/* Specialty chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.75rem' }}>
          {(member.specialties || []).map(tag => (
            <span key={tag} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              padding: '0.1rem 0.45rem',
              fontSize: '0.58rem',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 600,
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Experience */}
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {member.experience.slice(0, 3).map((exp, i) => (
            <li key={i} style={{
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.55,
              paddingBottom: '0.2rem',
              paddingLeft: '0.85rem',
              position: 'relative',
            }}>
              <span style={{ position: 'absolute', left: 0, color: '#6366f1', fontWeight: 700 }}>›</span>
              {exp}
            </li>
          ))}
        </ul>

        {/* Personal */}
        <div style={{
          marginTop: '0.7rem',
          paddingTop: '0.65rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: '0.66rem',
          color: 'rgba(255,255,255,0.3)',
          fontStyle: 'italic',
          lineHeight: 1.5,
        }}>
          {member.personal}
        </div>
      </div>
    </div>
  );
}

// ─── Engineer Card (portrait, compact) ─────────────────────────────────────────

function EngineerCard({ member, isSelected, onToggle }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => onToggle(member.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isSelected
          ? 'rgba(124,58,237,0.1)'
          : hovered
          ? 'rgba(255,255,255,0.03)'
          : 'rgba(10,8,20,0.7)',
        border: isSelected
          ? '1.5px solid rgba(124,58,237,0.5)'
          : hovered
          ? '1px solid rgba(255,255,255,0.13)'
          : '1px solid rgba(255,255,255,0.07)',
        boxShadow: isSelected ? '0 0 24px rgba(124,58,237,0.16)' : 'none',
        borderRadius: 14,
        padding: '1.1rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      {/* Top row: photo + name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.7rem' }}>
        <div style={{
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: member.photo
            ? `url(${member.photo}) center/cover no-repeat`
            : 'rgba(245,158,11,0.2)',
          border: isSelected
            ? '2px solid rgba(124,58,237,0.7)'
            : '2px solid rgba(245,158,11,0.3)',
          flexShrink: 0,
          transition: 'border-color 0.2s',
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)', margin: 0, letterSpacing: '-0.01em' }}>
              {member.name}
            </h3>
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              border: isSelected ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
              background: isSelected ? '#7c3aed' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s',
              boxShadow: isSelected ? '0 0 8px rgba(124,58,237,0.5)' : 'none',
            }}>
              {isSelected && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(245,158,11,0.15)',
              color: '#fbbf24',
              border: '1px solid rgba(245,158,11,0.25)',
              padding: '0.08rem 0.4rem',
              borderRadius: 3,
              fontSize: '0.58rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {member.title || 'GTM Engineer'}
            </span>
            {member.location && (
              <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>📍 {member.location}</span>
            )}
          </div>
        </div>
      </div>

      {/* Headline */}
      <p style={{
        fontSize: '0.7rem',
        color: isSelected ? '#c4b5fd' : 'rgba(255,255,255,0.45)',
        fontStyle: 'italic',
        margin: '0 0 0.6rem',
        lineHeight: 1.5,
        transition: 'color 0.2s',
      }}>
        "{member.headline}"
      </p>

      {/* Specialties */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.65rem' }}>
        {(member.specialties || []).map(tag => (
          <span key={tag} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.09)',
            borderRadius: 3,
            padding: '0.08rem 0.4rem',
            fontSize: '0.56rem',
            color: 'rgba(255,255,255,0.45)',
            fontWeight: 600,
          }}>
            {tag}
          </span>
        ))}
      </div>

      {/* Experience */}
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {member.experience.slice(0, 2).map((exp, i) => (
          <li key={i} style={{
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.5,
            paddingBottom: '0.18rem',
            paddingLeft: '0.75rem',
            position: 'relative',
          }}>
            <span style={{ position: 'absolute', left: 0, color: '#f59e0b', opacity: 0.8, fontWeight: 700 }}>›</span>
            {exp}
          </li>
        ))}
      </ul>

      {/* Personal */}
      <div style={{
        marginTop: '0.65rem',
        paddingTop: '0.6rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontSize: '0.63rem',
        color: 'rgba(255,255,255,0.28)',
        fontStyle: 'italic',
        lineHeight: 1.45,
      }}>
        {member.personal}
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function YourTeam() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('leanscale-selected-team');
    if (stored) {
      try { setSelectedIds(JSON.parse(stored)); } catch { setSelectedIds([]); }
    }
  }, []);

  useEffect(() => {
    if (isClient) localStorage.setItem('leanscale-selected-team', JSON.stringify(selectedIds));
  }, [selectedIds, isClient]);

  const toggle = (id) => setSelectedIds(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  const selectedMembers = team.filter(m => selectedIds.includes(m.id));

  return (
    <Layout title="Your Team">
      <div style={{ background: '#070512', minHeight: '100vh' }}>

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(160deg, #0a0118 0%, #170930 50%, #0a0118 100%)',
          padding: 'clamp(3rem, 7vw, 5.5rem) 1.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800, height: 500,
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.22) 0%, transparent 65%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(163,230,53,0.1)',
              border: '1px solid rgba(163,230,53,0.25)',
              borderRadius: 9999, padding: '0.35rem 1rem',
              marginBottom: '1.75rem',
              fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontWeight: 500,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#a3e635', display: 'inline-block', flexShrink: 0 }} />
              These are the people who will actually do the work
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 6vw, 4rem)',
              fontWeight: 900, color: 'white',
              margin: '0 0 1rem', lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}>
              No juniors.<br />
              <span style={{
                background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 60%, #6366f1 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                No learning curve.
              </span>
            </h1>

            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 600, margin: '0 auto 2.75rem',
              lineHeight: 1.65,
            }}>
              Every LeanScale operator has run this play before.
              Meet the team that will be inside your CRM, building your systems,
              and shipping results from week one.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {TEAM_STATS.map(stat => (
                <div key={stat.label} style={{
                  padding: '0.6rem 1.35rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 12,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#a78bfa', lineHeight: 1, letterSpacing: '-0.02em' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sticky Pod Composer ───────────────────────────────────────────── */}
        {selectedMembers.length > 0 && (
          <div style={{
            position: 'sticky', top: 0, zIndex: 60,
            background: 'rgba(9,6,22,0.96)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(124,58,237,0.3)',
            padding: '0.7rem 1.5rem',
            display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
          }}>
            <span style={{
              fontSize: '0.65rem', fontWeight: 800, color: '#a78bfa',
              textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0,
            }}>
              Your Pod
            </span>
            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', flex: 1 }}>
              {selectedMembers.map(m => (
                <div key={m.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.35rem',
                  background: 'rgba(124,58,237,0.14)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  borderRadius: 20,
                  padding: '0.2rem 0.55rem 0.2rem 0.25rem',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    backgroundImage: m.photo ? `url(${m.photo})` : 'none',
                    backgroundColor: m.photo ? 'transparent' : '#7c3aed',
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    flexShrink: 0,
                    border: '1.5px solid rgba(124,58,237,0.45)',
                  }} />
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.88)', fontWeight: 600 }}>
                    {m.name.split(' ')[0]}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggle(m.id); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'rgba(255,255,255,0.35)', fontSize: '0.9rem', lineHeight: 1,
                      padding: '0 1px', display: 'flex', alignItems: 'center',
                    }}
                  >×</button>
                </div>
              ))}
            </div>
            <button
              onClick={() => window.open('https://meet.reclaimai.com/u/7f49bc93-ac0e-47eb-9e6a-0936f035cfa8', '_blank')}
              style={{
                background: 'linear-gradient(135deg, #a3e635, #84cc16)',
                color: '#050310', fontWeight: 700,
                padding: '0.45rem 1.1rem',
                fontSize: '0.78rem', border: 'none', borderRadius: 8, cursor: 'pointer',
                flexShrink: 0,
              }}>
              Book a Kickoff →
            </button>
          </div>
        )}

        {/* ── Team Content ─────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 1220, margin: '0 auto', padding: '3rem 1.5rem 5rem' }}>

          {/* GTM Architects */}
          <motion.div variants={staggerContainer} initial="hidden" animate="show" style={{ marginBottom: '3.5rem' }}>
            <motion.div variants={fadeUpItem} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ width: 3, height: 28, background: 'linear-gradient(to bottom, #818cf8, #6366f1)', borderRadius: 2, flexShrink: 0 }} />
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'rgba(255,255,255,0.95)', margin: '0 0 0.15rem', letterSpacing: '-0.01em' }}>
                  GTM Architects
                </h2>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                  Your strategic lead — owns the engagement, drives every decision, and runs the weekly cadence with your team
                </p>
              </div>
            </motion.div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '0.9rem',
            }}>
              {architects.map((member) => (
                <motion.div key={member.id} variants={fadeUpItem}>
                  <ArchitectCard
                    member={member}
                    isSelected={selectedIds.includes(member.id)}
                    onToggle={toggle}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            marginBottom: '3rem',
            color: 'rgba(255,255,255,0.12)',
            fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            paired with
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* GTM Engineers */}
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            <motion.div variants={fadeUpItem} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '1.5rem',
            }}>
              <div style={{ width: 3, height: 28, background: 'linear-gradient(to bottom, #fbbf24, #f59e0b)', borderRadius: 2, flexShrink: 0 }} />
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'rgba(255,255,255,0.95)', margin: '0 0 0.15rem', letterSpacing: '-0.01em' }}>
                  GTM Engineers
                </h2>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>
                  The builders — inside your systems every day, shipping the actual work
                </p>
              </div>
            </motion.div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '0.9rem',
            }}>
              {engineers.map((member) => (
                <motion.div key={member.id} variants={fadeUpItem}>
                  <EngineerCard
                    member={member}
                    isSelected={selectedIds.includes(member.id)}
                    onToggle={toggle}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
          <div style={{
            marginTop: '4rem',
            padding: 'clamp(2.5rem, 5vw, 4rem) 2rem',
            background: 'linear-gradient(160deg, #0c0820 0%, #1a0a38 50%, #0c0820 100%)',
            borderRadius: 20,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 600, height: 300,
              background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ color: 'white', marginBottom: '0.6rem', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {selectedIds.length > 0
                  ? `You've picked your pod. Let's make it official.`
                  : `Ready to put a face to the work?`
                }
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: '2rem', maxWidth: 520, margin: '0 auto 2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
                {selectedIds.length > 0
                  ? `${selectedIds.length} operator${selectedIds.length > 1 ? 's' : ''} selected. Book a kickoff call and we'll confirm your team assignment.`
                  : `Click any team member to add them to your pod, then book a kickoff call to get started.`
                }
              </p>
              <button
                onClick={() => window.open('https://meet.reclaimai.com/u/7f49bc93-ac0e-47eb-9e6a-0936f035cfa8', '_blank')}
                style={{
                  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                  color: '#050310', fontWeight: 800,
                  padding: '0.9rem 2.25rem',
                  fontSize: '1rem', border: 'none', borderRadius: 12, cursor: 'pointer',
                  letterSpacing: '-0.01em',
                }}>
                Book a Kickoff Call
              </button>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
