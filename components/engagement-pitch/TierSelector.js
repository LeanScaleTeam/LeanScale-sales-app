import { motion } from 'framer-motion';
import { fadeUpItem, staggerContainer } from '../../lib/animations';
import { ENGAGEMENT_TIERS } from '../../data/engagement-tiers';

/**
 * TierSelector — Step 4 of the Engagement Pitch.
 * Shows the three engagement tiers with the roadmap pacing for each.
 */
export default function TierSelector({ selectedTierId, recommendedTierId, onSelectTier }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}
    >
      {/* Header */}
      <motion.div variants={fadeUpItem} style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-2)' }}>
          Engagement Options
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          The same roadmap at different speeds. Select a tier to see how the timeline adjusts.
        </p>
      </motion.div>

      {/* Tier Cards */}
      <motion.div
        variants={fadeUpItem}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--space-4)',
        }}
      >
        {ENGAGEMENT_TIERS.map(tier => {
          const isSelected = tier.id === selectedTierId;
          const isRecommended = tier.id === recommendedTierId;

          return (
            <div
              key={tier.id}
              onClick={() => onSelectTier(tier.id)}
              style={{
                position: 'relative',
                padding: 'var(--space-5)',
                borderRadius: 'var(--radius-xl, 16px)',
                border: isSelected
                  ? '2px solid #6C5CE7'
                  : '1px solid var(--border-color)',
                background: isSelected ? '#F8F7FF' : 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 4px 16px rgba(108, 92, 231, 0.15)' : 'none',
              }}
            >
              {isRecommended && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  padding: '0.15rem 0.75rem',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  background: '#6C5CE7',
                  color: 'white',
                  whiteSpace: 'nowrap',
                }}>
                  Recommended
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-bold)',
                  color: isSelected ? '#6C5CE7' : '#1a1a2e',
                  marginBottom: 'var(--space-1)',
                }}>
                  {tier.name}
                </h3>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: '#1a1a2e' }}>
                  ${(tier.monthlyPrice / 1000).toFixed(0)}K
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-normal)', color: 'var(--text-muted)' }}>/mo</span>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
                  {tier.monthlyHours} hours/month
                </div>
              </div>

              {/* Pacing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <PacingRow label="Stabilize" timing={tier.roadmapPacing.stabilize} />
                <PacingRow label="Activate" timing={tier.roadmapPacing.activate} />
                <PacingRow label="Optimize" timing={tier.roadmapPacing.optimize} />
                <PacingRow label="Scale" timing={tier.roadmapPacing.scale} />
              </div>

              <div style={{
                textAlign: 'center',
                padding: 'var(--space-2) 0',
                borderTop: '1px solid var(--border-color)',
              }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: '#6C5CE7' }}>
                  {tier.timeToGreen}
                </div>
                <div style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-muted)' }}>
                  to all 10 metrics green
                </div>
              </div>

              <p style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                textAlign: 'center',
                marginTop: 'var(--space-2)',
                fontStyle: 'italic',
              }}>
                {tier.summary}
              </p>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function PacingRow({ label, timing }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: 'var(--text-xs)',
    }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{
        fontWeight: 'var(--font-medium)',
        color: '#1a1a2e',
        padding: '0.1rem 0.4rem',
        borderRadius: '4px',
        background: 'var(--bg-subtle)',
      }}>
        {timing}
      </span>
    </div>
  );
}
