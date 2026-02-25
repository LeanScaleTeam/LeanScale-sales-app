/**
 * CompetencyDetailPanel — Shows detail for a single competency/department cell
 *
 * Displays scores from each source (API, transcript, consultant),
 * evidence quotes, consultant notes, linked services, and rubric reference.
 */

import {
  V3_STATUS,
  V3_STATUS_COLORS,
  V3_SOURCE_TYPES,
} from '../../../lib/diagnostic-engine/v3/constants-v3';
import { lookupServiceV3 } from '../../../lib/diagnostic-engine/v3/service-mapping-v3';

export default function CompetencyDetailPanel({
  competency,
  department,
  score,
  transcriptData,
  consultantData,
  editMode,
  onScoreChange,
}) {
  const statusColor = score !== null && score !== undefined
    ? V3_STATUS_COLORS[Math.round(score)] || '#CBD5E0'
    : '#CBD5E0';

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={{ ...styles.scoreChip, backgroundColor: statusColor, color: score && score <= 3 && score >= 3 ? '#1A202C' : '#FFF' }}>
            {score !== null && score !== undefined ? score : '--'}
          </span>
          <div>
            <div style={styles.compId}>{competency.id}</div>
            <div style={styles.compName}>{competency.name}</div>
          </div>
        </div>
        {editMode && onScoreChange && (
          <div style={styles.editControls}>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                style={{
                  ...styles.scoreBtn,
                  backgroundColor: s === score ? V3_STATUS_COLORS[s] : 'transparent',
                  color: s === score ? '#FFF' : '#4A5568',
                  border: `1px solid ${V3_STATUS_COLORS[s]}`,
                }}
                onClick={() => onScoreChange?.(competency.id, department, s)}
                title={V3_STATUS[s]}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <p style={styles.description}>{competency.description}</p>

      {/* Source indicators */}
      <div style={styles.sources}>
        <SourceBadge
          label="API"
          active={competency.source === V3_SOURCE_TYPES.API_ONLY || competency.source === V3_SOURCE_TYPES.API_PLUS}
        />
        <SourceBadge
          label="Transcript"
          active={!!transcriptData}
          confidence={transcriptData?.confidence}
        />
        <SourceBadge
          label="Consultant"
          active={!!consultantData}
        />
      </div>

      {/* Transcript evidence */}
      {transcriptData?.evidence?.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Transcript Evidence</div>
          {transcriptData.evidence.map((quote, i) => (
            <blockquote key={i} style={styles.quote}>
              &ldquo;{quote}&rdquo;
            </blockquote>
          ))}
          {transcriptData.assessment && (
            <p style={styles.assessment}>{transcriptData.assessment}</p>
          )}
        </div>
      )}

      {/* Consultant notes */}
      {consultantData?.notes && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Consultant Notes</div>
          <p style={styles.notes}>{consultantData.notes}</p>
        </div>
      )}

      {/* Rubric reference */}
      {competency.rubric && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Scoring Rubric</div>
          <div style={styles.rubric}>
            {Object.entries(competency.rubric).map(([level, desc]) => (
              <div
                key={level}
                style={{
                  ...styles.rubricRow,
                  fontWeight: Number(level) === score ? 600 : 400,
                  backgroundColor: Number(level) === score ? '#F3F0FF' : 'transparent',
                }}
              >
                <span style={{ ...styles.rubricScore, color: V3_STATUS_COLORS[level] }}>
                  {level}
                </span>
                <span style={styles.rubricLabel}>{V3_STATUS[level]}</span>
                <span style={styles.rubricDesc}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Linked services */}
      {competency.serviceIds?.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Recommended Services</div>
          <div style={styles.services}>
            {competency.serviceIds.map((sid) => {
              const service = lookupServiceV3(sid);
              if (!service) return null;
              return (
                <span key={sid} style={styles.serviceChip}>
                  {service.icon} {service.name}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function SourceBadge({ label, active, confidence }) {
  return (
    <span
      style={{
        ...styles.sourceBadge,
        backgroundColor: active ? '#EBF4FF' : '#F7FAFC',
        color: active ? '#3182CE' : '#A0AEC0',
        borderColor: active ? '#BEE3F8' : '#E2E8F0',
      }}
    >
      {label}
      {active && confidence !== undefined && (
        <span style={styles.confidence}> ({Math.round(confidence * 100)}%)</span>
      )}
    </span>
  );
}

const styles = {
  panel: {
    padding: '1rem',
    border: '1px solid var(--border-color, #E2E8F0)',
    borderRadius: 'var(--radius-md, 8px)',
    background: 'white',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  scoreChip: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    fontWeight: 700,
    fontSize: '0.875rem',
    flexShrink: 0,
  },
  compId: {
    fontSize: '0.7rem',
    color: '#718096',
    fontFamily: 'monospace',
  },
  compName: {
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  editControls: {
    display: 'flex',
    gap: '0.25rem',
  },
  scoreBtn: {
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    fontSize: '0.8rem',
    color: '#4A5568',
    margin: '0.25rem 0 0.75rem',
    lineHeight: 1.5,
  },
  sources: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.75rem',
  },
  sourceBadge: {
    fontSize: '0.7rem',
    padding: '0.15rem 0.5rem',
    borderRadius: '1rem',
    border: '1px solid',
    fontWeight: 500,
  },
  confidence: {
    fontSize: '0.65rem',
    opacity: 0.8,
  },
  section: {
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #EDF2F7',
  },
  sectionTitle: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#4A5568',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  quote: {
    fontSize: '0.8rem',
    fontStyle: 'italic',
    color: '#2D3748',
    borderLeft: '3px solid #CBD5E0',
    padding: '0.25rem 0.75rem',
    margin: '0.25rem 0',
    background: '#F7FAFC',
    borderRadius: '0 4px 4px 0',
  },
  assessment: {
    fontSize: '0.8rem',
    color: '#4A5568',
    margin: '0.5rem 0 0',
  },
  notes: {
    fontSize: '0.8rem',
    color: '#4A5568',
    margin: 0,
  },
  rubric: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  rubricRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
  },
  rubricScore: {
    fontWeight: 700,
    minWidth: '1rem',
  },
  rubricLabel: {
    fontWeight: 500,
    minWidth: '5rem',
    color: '#4A5568',
  },
  rubricDesc: {
    color: '#718096',
    flex: 1,
  },
  services: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  serviceChip: {
    fontSize: '0.75rem',
    padding: '0.2rem 0.6rem',
    borderRadius: '1rem',
    background: '#F3F0FF',
    color: '#6C5CE7',
    border: '1px solid #E9E4FF',
  },
};
