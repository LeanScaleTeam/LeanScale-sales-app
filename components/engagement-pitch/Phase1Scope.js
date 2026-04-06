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

export default function Phase1Scope({ roadmap, customerPath, editMode, onSelectCohort, selectedStartDate }) {
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);

  // Sync selectedCohort from persisted start_date when cohorts load
  useEffect(() => {
    if (selectedStartDate && cohorts.length > 0) {
      const match = cohorts.find(c => c.date === selectedStartDate);
      if (match) setSelectedCohort(match.cohortNumber);
    }
  }, [selectedStartDate, cohorts]);

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
                onClick={() => {
                  if (!isBookable) return;
                  const next = isSelected ? null : cohort.cohortNumber;
                  setSelectedCohort(next);
                  onSelectCohort?.(next ? cohort.date : null);
                }}
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
              onClick={() => window.open('https://meet.reclaimai.com/u/7f49bc93-ac0e-47eb-9e6a-0936f035cfa8', '_blank')}
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

      {/* Admin: Availability Manager */}
      {editMode && <AvailabilityManager />}

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

// ─── Availability Manager (admin only) ───────────────────────────────────────

const STATUS_OPTIONS = ['available', 'limited', 'waitlist', 'sold_out'];

const STATUS_LABELS = {
  available: { label: 'Open', color: '#86efac' },
  limited: { label: 'Almost Full', color: '#fde047' },
  waitlist: { label: 'Waitlist', color: '#fdba74' },
  sold_out: { label: 'Sold Out', color: 'rgba(255,255,255,0.3)' },
};

function AvailabilityManager() {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newDraft, setNewDraft] = useState({ date: '', cohort_number: '', status: 'available', spots_total: 4, spots_left: 4 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function fetchAll() {
    setLoading(true);
    fetch('/api/admin/availability')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setCohorts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { fetchAll(); }, []);

  async function saveEdit(id) {
    setSaving(true);
    setError(null);
    const res = await fetch('/api/admin/availability', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...editDraft }),
    });
    setSaving(false);
    if (res.ok) { setEditingId(null); fetchAll(); }
    else { const err = await res.json(); setError(err.error || 'Save failed'); }
  }

  async function deleteRow(id) {
    if (!confirm('Delete this cohort date?')) return;
    const res = await fetch('/api/admin/availability', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchAll();
  }

  async function addCohort() {
    setSaving(true);
    setError(null);
    const res = await fetch('/api/admin/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDraft),
    });
    setSaving(false);
    if (res.ok) {
      setShowAdd(false);
      setNewDraft({ date: '', cohort_number: '', status: 'available', spots_total: 4, spots_left: 4 });
      fetchAll();
    } else {
      const err = await res.json();
      setError(err.error || 'Add failed');
    }
  }

  const inputStyle = {
    padding: '0.3rem 0.5rem',
    borderRadius: 5,
    border: '1px solid var(--border-color)',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '0.75rem',
    fontFamily: 'inherit',
    width: '100%',
  };

  return (
    <motion.div variants={fadeUpItem} style={{ marginTop: '0.5rem' }}>
      <div style={{
        borderTop: '1px dashed rgba(255,255,255,0.1)',
        paddingTop: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.3)' }}>
              Admin — Manage Cohort Availability
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
              Changes reflect immediately on the public availability view.
            </div>
          </div>
          <button
            onClick={() => setShowAdd(s => !s)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: 7,
              border: '1px solid rgba(124,58,237,0.35)',
              background: 'rgba(124,58,237,0.1)',
              color: '#a78bfa',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Add Cohort
          </button>
        </div>

        {error && (
          <div style={{ fontSize: '0.72rem', color: '#fca5a5', marginBottom: '0.75rem' }}>
            {error}
          </div>
        )}

        {/* Add form */}
        {showAdd && (
          <div style={{
            padding: '1rem',
            borderRadius: 10,
            background: 'rgba(124,58,237,0.06)',
            border: '1px solid rgba(124,58,237,0.2)',
            marginBottom: '0.75rem',
            display: 'grid',
            gridTemplateColumns: '1fr 80px 120px 70px 70px auto',
            gap: '0.5rem',
            alignItems: 'end',
          }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem' }}>Date</div>
              <input type="date" value={newDraft.date} onChange={e => setNewDraft(d => ({ ...d, date: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem' }}># Cohort</div>
              <input type="number" value={newDraft.cohort_number} onChange={e => setNewDraft(d => ({ ...d, cohort_number: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem' }}>Status</div>
              <select value={newDraft.status} onChange={e => setNewDraft(d => ({ ...d, status: e.target.value }))} style={{ ...inputStyle, background: 'rgba(255,255,255,0.07)' }}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s].label}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem' }}>Total</div>
              <input type="number" min={1} value={newDraft.spots_total} onChange={e => setNewDraft(d => ({ ...d, spots_total: parseInt(e.target.value) || 4 }))} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem' }}>Left</div>
              <input type="number" min={0} value={newDraft.spots_left} onChange={e => setNewDraft(d => ({ ...d, spots_left: parseInt(e.target.value) || 0 }))} style={inputStyle} />
            </div>
            <button
              onClick={addCohort}
              disabled={saving || !newDraft.date || !newDraft.cohort_number}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: 6,
                border: 'none',
                background: '#7c3aed',
                color: 'white',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1,
              }}
            >
              Add
            </button>
          </div>
        )}

        {/* Cohort table */}
        {loading ? (
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '1rem' }}>Loading…</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px 80px 130px 65px 65px auto',
              gap: '0.5rem',
              padding: '0.3rem 0.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}>
              {['Date', 'Cohort #', 'Status', 'Total', 'Left', ''].map(h => (
                <div key={h} style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.2)' }}>{h}</div>
              ))}
            </div>

            {cohorts.map(c => {
              const isEditing = editingId === c.id;
              const sc = STATUS_LABELS[c.status] || STATUS_LABELS.available;

              return (
                <div
                  key={c.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '100px 80px 130px 65px 65px auto',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    borderRadius: 7,
                    background: isEditing ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.02)',
                    alignItems: 'center',
                  }}
                >
                  {isEditing ? (
                    <>
                      <input type="date" value={editDraft.date || c.date} onChange={e => setEditDraft(d => ({ ...d, date: e.target.value }))} style={inputStyle} />
                      <input type="number" value={editDraft.cohort_number ?? c.cohort_number} onChange={e => setEditDraft(d => ({ ...d, cohort_number: e.target.value }))} style={inputStyle} />
                      <select value={editDraft.status ?? c.status} onChange={e => setEditDraft(d => ({ ...d, status: e.target.value }))} style={{ ...inputStyle, background: 'rgba(255,255,255,0.07)' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s].label}</option>)}
                      </select>
                      <input type="number" min={1} value={editDraft.spots_total ?? c.spots_total} onChange={e => setEditDraft(d => ({ ...d, spots_total: parseInt(e.target.value) || 4 }))} style={inputStyle} />
                      <input type="number" min={0} value={editDraft.spots_left ?? c.spots_left} onChange={e => setEditDraft(d => ({ ...d, spots_left: parseInt(e.target.value) || 0 }))} style={inputStyle} />
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button onClick={() => saveEdit(c.id)} disabled={saving} style={{ padding: '0.3rem 0.65rem', borderRadius: 5, border: 'none', background: '#7c3aed', color: 'white', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer' }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ padding: '0.3rem 0.65rem', borderRadius: 5, border: '1px solid var(--border-color)', background: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{c.date}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>#{c.cohort_number}</div>
                      <div>
                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          color: sc.color,
                          background: `${sc.color}18`,
                          padding: '0.15rem 0.5rem',
                          borderRadius: 4,
                        }}>
                          {sc.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{c.spots_total}</div>
                      <div style={{ fontSize: '0.72rem', color: c.spots_left <= 1 ? '#f87171' : 'rgba(255,255,255,0.5)' }}>{c.spots_left}</div>
                      <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button
                          onClick={() => { setEditingId(c.id); setEditDraft({}); }}
                          style={{ padding: '0.25rem 0.6rem', borderRadius: 5, border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.62rem', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteRow(c.id)}
                          style={{ padding: '0.25rem 0.6rem', borderRadius: 5, border: '1px solid rgba(239,68,68,0.2)', background: 'none', color: 'rgba(239,68,68,0.6)', fontSize: '0.62rem', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {cohorts.length === 0 && !loading && (
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: '1rem' }}>
                No cohorts configured. Add one above.
              </div>
            )}
          </div>
        )}
      </div>
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
