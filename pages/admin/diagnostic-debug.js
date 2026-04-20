import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

const SCORE_COLORS = {
  1: '#E53E3E',
  2: '#ED8936',
  3: '#ECC94B',
  4: '#48BB78',
  5: '#38A169',
};

const IMPACT_ICONS = {
  positive: { icon: '\u2713', color: '#38A169' },
  negative: { icon: '\u2717', color: '#E53E3E' },
  neutral: { icon: '\u25CB', color: '#A0AEC0' },
};

const SOURCE_COLORS = {
  API_ONLY: '#3182CE',
  API_PLUS: '#2B6CB0',
  INTAKE: '#805AD5',
  TRANSCRIPT: '#D69E2E',
  CONSULTANT: '#DD6B20',
};

const inactiveNavLink = {
  padding: '0.5rem 1rem',
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '0.875rem',
  color: '#333',
};

const activeNavLink = {
  padding: '0.5rem 1rem',
  background: '#7c3aed',
  color: 'white',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '0.875rem',
};

export default function DiagnosticDebug() {
  const { user, signOut, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [debugData, setDebugData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activePillar, setActivePillar] = useState(null);
  const [expandedComps, setExpandedComps] = useState({});
  const [rerunning, setRerunning] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) loadCustomers();
  }, [isAuthenticated]);

  // Pre-select customer from URL query (?customerId=...)
  useEffect(() => {
    if (router.isReady && router.query.customerId && !selectedCustomerId) {
      setSelectedCustomerId(String(router.query.customerId));
    }
  }, [router.isReady, router.query.customerId]);

  useEffect(() => {
    if (selectedCustomerId) loadDebugData();
    else { setDebugData(null); setError(null); }
  }, [selectedCustomerId]);

  async function loadCustomers() {
    try {
      const { data } = await supabase
        .from('customers')
        .select('id, slug, name, is_demo')
        .order('name');
      setCustomers(data || []);
    } catch (err) {
      console.error('Error loading customers:', err);
    }
  }

  async function loadDebugData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/diagnostic-debug?customerId=${selectedCustomerId}`);
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Failed to load debug data');
        setDebugData(null);
        return;
      }
      const json = await res.json();
      setDebugData(json.data);
      setActivePillar(null);
      setExpandedComps({});
    } catch (err) {
      setError(err.message);
      setDebugData(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleRerun() {
    setRerunning(true);
    try {
      const res = await fetch('/api/diagnostic/v3/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: selectedCustomerId, preserveRoadmap: true }),
      });
      if (res.ok) {
        await loadDebugData();
      } else {
        const err = await res.json();
        setError(err.error || 'Re-run failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRerunning(false);
    }
  }

  function toggleComp(compId) {
    setExpandedComps(prev => ({ ...prev, [compId]: !prev[compId] }));
  }

  if (authLoading || !isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  // Group competency signals by pillar
  const signalsByPillar = {};
  if (debugData?.competencySignals) {
    for (const comp of debugData.competencySignals) {
      const pillar = comp.pillar || 'unknown';
      if (!signalsByPillar[pillar]) signalsByPillar[pillar] = [];
      signalsByPillar[pillar].push(comp);
    }
  }

  const pillarsToShow = activePillar
    ? [activePillar]
    : (debugData?.pillarOrder || []);

  return (
    <>
      <Head>
        <title>Diagnostic Debug | LeanScale Admin</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        {/* Header */}
        <header style={{
          background: 'white',
          padding: '1rem 2rem',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>LeanScale Admin</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>{user?.email}</span>
            <button
              onClick={async () => { await signOut(); router.push('/admin/login'); }}
              style={{
                padding: '0.5rem 1rem',
                background: '#eee',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Sign Out
            </button>
          </div>
        </header>

        <main style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <Link href="/admin" style={inactiveNavLink}>Dashboard</Link>
            <Link href="/admin/customers" style={inactiveNavLink}>Customers</Link>
            <Link href="/admin/diagnostics" style={inactiveNavLink}>Diagnostics</Link>
            <Link href="/admin/diagnostic-debug" style={activeNavLink}>Debug</Link>
            <Link href="/admin/availability" style={inactiveNavLink}>Availability</Link>
            <Link href="/admin/submissions" style={inactiveNavLink}>Submissions</Link>
            <Link href="/admin/vasco-upload" style={inactiveNavLink}>Vasco Upload</Link>
          </nav>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Diagnostic Debug View
          </h2>

          {/* Customer Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: '1px solid #ddd',
                fontSize: '0.875rem',
                minWidth: '300px',
              }}
            >
              <option value="">Select a customer...</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.is_demo ? '(demo)' : ''} — {c.slug}
                </option>
              ))}
            </select>
          </div>

          {loading && <p style={{ color: '#666' }}>Loading debug data...</p>}
          {error && <p style={{ color: '#E53E3E' }}>{error}</p>}

          {debugData && (
            <>
              {/* Summary Bar */}
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1rem 1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                gap: '2rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                border: '1px solid #eee',
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Overall Score</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: SCORE_COLORS[Math.round(debugData.overallScore)] || '#333' }}>
                    {debugData.overallScore?.toFixed(1)}/5
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>CRM Type</span>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>{debugData.crmType}</div>
                </div>
                {debugData.dataCoverage && (
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Data Coverage</span>
                    <div style={{ fontSize: '0.875rem', display: 'flex', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                      {(() => {
                        // Build a list of percentage-style coverage items.
                        // Percentage keys can be values in [0, 1] (legacy) or [0, 100] (current).
                        const isPctKey = (k) => k === 'percent' || /Percent$/.test(k);
                        const toPct = (val) => {
                          if (typeof val !== 'number') return null;
                          // Normalize: values <= 1 are fractional, > 1 are already 0-100
                          return val <= 1 ? Math.round(val * 100) : Math.round(val);
                        };
                        const items = [];
                        for (const [source, value] of Object.entries(debugData.dataCoverage)) {
                          if (typeof value === 'number' && isPctKey(source)) {
                            const pct = toPct(value);
                            if (pct != null) items.push({ key: source, label: source.replace(/Percent$/, ''), pct });
                          } else if (value && typeof value === 'object') {
                            for (const [subKey, subVal] of Object.entries(value)) {
                              if (subVal && typeof subVal === 'object' && typeof subVal.percent === 'number') {
                                items.push({ key: `${source}.${subKey}`, label: subKey, pct: toPct(subVal.percent) });
                              } else if (typeof subVal === 'number' && isPctKey(subKey)) {
                                items.push({ key: `${source}.${subKey}`, label: subKey, pct: toPct(subVal) });
                              }
                            }
                          }
                        }
                        return items.filter(i => i.pct != null).map(({ key, label, pct }) => (
                          <span key={key} style={{
                            background: '#f0f0f0',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                          }}>
                            {label}: {pct}%
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                )}
                <div style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#888' }}>
                  Updated: {new Date(debugData.updatedAt).toLocaleString()}
                </div>
              </div>

              {/* Re-run banner for legacy results */}
              {!debugData.competencySignals && (
                <div style={{
                  background: '#FFFBEB',
                  border: '1px solid #F6E05E',
                  borderRadius: '8px',
                  padding: '1rem 1.5rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <p style={{ margin: 0, color: '#744210' }}>
                    This diagnostic was run before signal tracking was enabled. Re-run to populate debug data.
                  </p>
                  <button
                    onClick={handleRerun}
                    disabled={rerunning}
                    style={{
                      padding: '0.5rem 1rem',
                      background: rerunning ? '#ccc' : '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: rerunning ? 'default' : 'pointer',
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {rerunning ? 'Re-running...' : 'Re-run Diagnostic'}
                  </button>
                </div>
              )}

              {/* Pillar Filter Tabs */}
              {debugData.competencySignals && (
                <>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setActivePillar(null)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: activePillar === null ? '#7c3aed' : 'white',
                        color: activePillar === null ? 'white' : '#333',
                        border: activePillar === null ? 'none' : '1px solid #ddd',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                      }}
                    >
                      All Pillars
                    </button>
                    {(debugData.pillarOrder || []).map(p => (
                      <button
                        key={p}
                        onClick={() => setActivePillar(p)}
                        style={{
                          padding: '0.4rem 0.75rem',
                          background: activePillar === p ? '#7c3aed' : 'white',
                          color: activePillar === p ? 'white' : '#333',
                          border: activePillar === p ? 'none' : '1px solid #ddd',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 500,
                        }}
                      >
                        {debugData.pillarLabels?.[p] || p}
                        {debugData.pillarScores?.[p] != null && (
                          <span style={{ marginLeft: '0.4rem', opacity: 0.7 }}>
                            ({debugData.pillarScores[p].toFixed(1)})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Competency Cards */}
                  {pillarsToShow.map(pillar => {
                    const comps = signalsByPillar[pillar] || [];
                    if (comps.length === 0) return null;
                    return (
                      <div key={pillar} style={{ marginBottom: '2rem' }}>
                        <h3 style={{
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          marginBottom: '0.75rem',
                          color: '#444',
                          borderBottom: '2px solid #7c3aed',
                          paddingBottom: '0.5rem',
                        }}>
                          {debugData.pillarLabels?.[pillar] || pillar}
                        </h3>
                        {comps.map(comp => {
                          const rubric = debugData.rubricMap?.[comp.id] || {};
                          const isExpanded = expandedComps[comp.id];
                          const deptEntries = Object.entries(comp.departments || {});
                          const maxScore = deptEntries.length > 0
                            ? Math.max(...deptEntries.map(([, s]) => s))
                            : null;

                          return (
                            <div key={comp.id} style={{
                              background: 'white',
                              borderRadius: '8px',
                              border: '1px solid #eee',
                              marginBottom: '0.5rem',
                              overflow: 'hidden',
                            }}>
                              {/* Collapsed header */}
                              <div
                                onClick={() => toggleComp(comp.id)}
                                style={{
                                  padding: '0.75rem 1rem',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.75rem',
                                  userSelect: 'none',
                                }}
                              >
                                <span style={{ fontSize: '0.75rem', color: '#888', width: '1rem' }}>
                                  {isExpanded ? '\u25BC' : '\u25B6'}
                                </span>
                                <span style={{
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  color: '#7c3aed',
                                  minWidth: '3rem',
                                }}>
                                  {comp.id}
                                </span>
                                <span style={{ fontWeight: 500, flex: 1 }}>{comp.name}</span>
                                {/* Department score badges */}
                                {deptEntries.map(([dept, score]) => (
                                  <span key={dept} style={{
                                    background: SCORE_COLORS[score] || '#ccc',
                                    color: 'white',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                  }}>
                                    {(debugData.deptLabels?.[dept] || dept).slice(0, 3).toUpperCase()}: {score}
                                  </span>
                                ))}
                                {/* Source badge */}
                                <span style={{
                                  background: SOURCE_COLORS[comp.source] || '#718096',
                                  color: 'white',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '4px',
                                  fontSize: '0.65rem',
                                  fontWeight: 500,
                                }}>
                                  {comp.source}
                                </span>
                              </div>

                              {/* Expanded detail */}
                              {isExpanded && (
                                <div style={{
                                  padding: '0.75rem 1rem 1rem 2.75rem',
                                  borderTop: '1px solid #f0f0f0',
                                  background: '#fafafa',
                                }}>
                                  {/* Rubric info */}
                                  {rubric.rubric && maxScore != null && (
                                    <div style={{ marginBottom: '0.75rem' }}>
                                      <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                                        <strong>Current level ({maxScore}):</strong>{' '}
                                        <span style={{ color: '#555' }}>{rubric.rubric[maxScore]}</span>
                                      </div>
                                      {maxScore < 5 && rubric.rubric[maxScore + 1] && (
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                          <strong>Next level ({maxScore + 1}):</strong>{' '}
                                          {rubric.rubric[maxScore + 1]}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Description */}
                                  {rubric.description && (
                                    <p style={{ fontSize: '0.8rem', color: '#666', margin: '0 0 0.75rem 0', fontStyle: 'italic' }}>
                                      {rubric.description}
                                    </p>
                                  )}

                                  {/* Signals */}
                                  {comp.signals && comp.signals.length > 0 ? (
                                    <div style={{
                                      background: 'white',
                                      border: '1px solid #e8e8e8',
                                      borderRadius: '6px',
                                      padding: '0.5rem 0.75rem',
                                    }}>
                                      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#888', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                                        Signals ({comp.signals.length})
                                      </div>
                                      {comp.signals.map((sig, i) => {
                                        const impact = IMPACT_ICONS[sig.impact] || IMPACT_ICONS.neutral;
                                        return (
                                          <div key={i} style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: '0.5rem',
                                            padding: '0.25rem 0',
                                            borderBottom: i < comp.signals.length - 1 ? '1px solid #f5f5f5' : 'none',
                                          }}>
                                            <span style={{ color: impact.color, fontWeight: 700, fontSize: '0.85rem', width: '1rem', textAlign: 'center' }}>
                                              {impact.icon}
                                            </span>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 500, minWidth: '180px' }}>
                                              {sig.name}
                                            </span>
                                            <span style={{ fontSize: '0.8rem', color: '#555', flex: 1 }}>
                                              {typeof sig.value === 'object' ? JSON.stringify(sig.value) : String(sig.value ?? '')}
                                            </span>
                                            <span style={{
                                              fontSize: '0.65rem',
                                              background: '#f0f0f0',
                                              padding: '0.1rem 0.4rem',
                                              borderRadius: '3px',
                                              color: '#888',
                                            }}>
                                              {sig.source}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    <p style={{ fontSize: '0.8rem', color: '#999', margin: 0 }}>No signals recorded for this competency.</p>
                                  )}

                                  {/* Service IDs */}
                                  {comp.serviceIds && comp.serviceIds.length > 0 && (
                                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                      {comp.serviceIds.map(sid => (
                                        <span key={sid} style={{
                                          fontSize: '0.65rem',
                                          background: '#EBF4FF',
                                          color: '#2B6CB0',
                                          padding: '0.1rem 0.4rem',
                                          borderRadius: '3px',
                                        }}>
                                          {sid}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              )}

              {/* Score Card Raw (collapsed) */}
              <details style={{ marginTop: '2rem' }}>
                <summary style={{ cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, color: '#666' }}>
                  Raw Score Card JSON
                </summary>
                <pre style={{
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: '6px',
                  padding: '1rem',
                  fontSize: '0.75rem',
                  overflow: 'auto',
                  maxHeight: '400px',
                  marginTop: '0.5rem',
                }}>
                  {JSON.stringify(debugData.scoreCard, null, 2)}
                </pre>
              </details>
            </>
          )}
        </main>
      </div>
    </>
  );
}
