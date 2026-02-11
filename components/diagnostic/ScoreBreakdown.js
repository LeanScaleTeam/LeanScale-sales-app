import { useState, useMemo, useCallback } from 'react';
import { calculateHealthScore, whatIfScore, DEFAULT_FUNCTION_WEIGHTS, STATUS_VALUES } from '../../data/benchmark-data';
import { StatusBadge } from './StatusLegend';

/**
 * HorizontalBar — simple horizontal bar chart for a score percentage
 */
function HorizontalBar({ percentage, color = '#7c3aed', height = 20 }) {
  return (
    <div style={{
      width: '100%',
      height,
      background: '#f3f4f6',
      borderRadius: height / 2,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        width: `${Math.max(percentage, 2)}%`,
        height: '100%',
        background: color,
        borderRadius: height / 2,
        transition: 'width 0.3s ease',
      }} />
      <span style={{
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--font-bold)',
        color: percentage > 60 ? 'white' : '#374151',
      }}>
        {percentage}%
      </span>
    </div>
  );
}

function getScoreColor(score) {
  if (score >= 75) return '#16a34a';
  if (score >= 50) return '#f59e0b';
  if (score >= 25) return '#f97316';
  return '#dc2626';
}

/**
 * ScoreBreakdown — weighted health score with function breakdown and what-if analysis
 */
export default function ScoreBreakdown({ processes, functionWeights: initialWeights }) {
  const [weights, setWeights] = useState(initialWeights || DEFAULT_FUNCTION_WEIGHTS);
  const [whatIfChanges, setWhatIfChanges] = useState({});
  const [showWhatIf, setShowWhatIf] = useState(false);

  const currentScore = useMemo(
    () => calculateHealthScore(processes, weights),
    [processes, weights]
  );

  const projectedScore = useMemo(
    () => Object.keys(whatIfChanges).length > 0 ? whatIfScore(processes, whatIfChanges, weights) : null,
    [processes, whatIfChanges, weights]
  );

  const handleWeightChange = useCallback((fn, value) => {
    setWeights(prev => ({ ...prev, [fn]: parseFloat(value) || 1.0 }));
  }, []);

  const handleWhatIfToggle = useCallback((processName, currentStatus) => {
    setWhatIfChanges(prev => {
      const next = { ...prev };
      if (next[processName]) {
        delete next[processName];
      } else {
        next[processName] = 'healthy';
      }
      return next;
    });
  }, []);

  const whatIfCount = Object.keys(whatIfChanges).length;
  const scoreDelta = projectedScore ? projectedScore.total - currentScore.total : 0;

  // Get the worst-performing processes for the what-if suggestions
  const worstProcesses = useMemo(() => {
    return processes
      .filter(p => p.status !== 'na' && p.status !== 'healthy')
      .sort((a, b) => (STATUS_VALUES[a.status] || 0) - (STATUS_VALUES[b.status] || 0))
      .slice(0, 10);
  }, [processes]);

  return (
    <div>
      {/* Overall Score */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        marginBottom: 'var(--space-6)',
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 'var(--text-xs)', opacity: 0.8, marginBottom: 'var(--space-2)' }}>
          Weighted Health Score
        </div>
        <div style={{
          fontSize: '4rem',
          fontWeight: 'var(--font-bold)',
          lineHeight: 1,
          color: getScoreColor(currentScore.total),
        }}>
          {currentScore.total}
        </div>
        <div style={{ fontSize: 'var(--text-sm)', opacity: 0.7, marginTop: 'var(--space-1)' }}>out of 100</div>

        {projectedScore && (
          <div style={{
            marginTop: 'var(--space-4)',
            padding: 'var(--space-3)',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: 'var(--radius-md)',
            display: 'inline-block',
          }}>
            <span style={{ fontSize: 'var(--text-sm)' }}>
              If you fix {whatIfCount} item{whatIfCount !== 1 ? 's' : ''}:{' '}
            </span>
            <span style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
              color: getScoreColor(projectedScore.total),
            }}>
              {projectedScore.total}
            </span>
            <span style={{
              fontSize: 'var(--text-sm)',
              color: scoreDelta > 0 ? '#4ade80' : '#f87171',
              marginLeft: 'var(--space-2)',
            }}>
              ({scoreDelta > 0 ? '+' : ''}{scoreDelta})
            </span>
          </div>
        )}
      </div>

      {/* Function Breakdown */}
      <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', marginBottom: 'var(--space-4)' }}>
          Score by Function
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {Object.entries(currentScore.byFunction)
            .sort((a, b) => a[1].percentage - b[1].percentage)
            .map(([fn, data]) => (
              <div key={fn}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 'var(--space-1)',
                }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{fn}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      {data.count} processes
                    </span>
                    <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Weight:
                      <select
                        value={weights[fn] ?? 1.0}
                        onChange={(e) => handleWeightChange(fn, e.target.value)}
                        style={{
                          fontSize: 'var(--text-xs)',
                          padding: '0.1rem',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-sm)',
                          background: 'white',
                        }}
                      >
                        <option value={0.25}>0.25x</option>
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1.0}>1.0x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2.0}>2.0x</option>
                      </select>
                    </label>
                  </div>
                </div>
                <HorizontalBar
                  percentage={data.percentage}
                  color={getScoreColor(data.percentage)}
                />
                {/* Show projected bar if what-if is active */}
                {projectedScore?.byFunction[fn] && projectedScore.byFunction[fn].percentage !== data.percentage && (
                  <div style={{ marginTop: 4, opacity: 0.6 }}>
                    <HorizontalBar
                      percentage={projectedScore.byFunction[fn].percentage}
                      color="#7c3aed"
                      height={10}
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* What-If Analysis */}
      <div className="card" style={{ padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', margin: 0 }}>
            🔮 What-If Analysis
          </h3>
          {whatIfCount > 0 && (
            <button
              onClick={() => setWhatIfChanges({})}
              style={{
                fontSize: 'var(--text-xs)',
                background: 'var(--bg-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-1) var(--space-2)',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
              }}
            >
              Clear selections
            </button>
          )}
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
          Select processes to see how fixing them would impact your overall score.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {worstProcesses.map(p => {
            const isSelected = !!whatIfChanges[p.name];
            return (
              <button
                key={p.name}
                onClick={() => handleWhatIfToggle(p.name, p.status)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 'var(--space-2) var(--space-3)',
                  background: isSelected ? '#f0fdf4' : 'var(--bg-subtle)',
                  border: isSelected ? '2px solid #4ade80' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    border: '2px solid',
                    borderColor: isSelected ? '#16a34a' : '#d1d5db',
                    background: isSelected ? '#16a34a' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.7rem',
                    flexShrink: 0,
                  }}>
                    {isSelected ? '✓' : ''}
                  </span>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-medium)' }}>{p.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{p.function}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <StatusBadge status={p.status} />
                  {isSelected && (
                    <>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>→</span>
                      <StatusBadge status="healthy" />
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {worstProcesses.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            🎉 All processes are healthy — nothing to fix!
          </div>
        )}
      </div>
    </div>
  );
}
