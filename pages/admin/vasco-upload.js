import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

// Derive a default architect name from the signed-in user's email
// jake@leanscale.team → "Jake"
function architectFromEmail(email) {
  if (!email || typeof email !== 'string') return '';
  const local = email.split('@')[0] || '';
  const first = local.split(/[.\-_]/)[0] || '';
  return first ? first.charAt(0).toUpperCase() + first.slice(1).toLowerCase() : '';
}

export default function VascoUploadPage() {
  const { user, signOut, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]); // parallel to files: { customer_slug, quarter, architect, integrity, months, error? }
  const [expanded, setExpanded] = useState({}); // { [index]: boolean }
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [applying, setApplying] = useState({});
  const [autoApply, setAutoApply] = useState(true);
  const [architectOverride, setArchitectOverride] = useState('');
  const [recentUploads, setRecentUploads] = useState([]);
  const [recentLoading, setRecentLoading] = useState(false);

  useEffect(() => {
    if (user?.email && !architectOverride) {
      setArchitectOverride(architectFromEmail(user.email));
    }
  }, [user?.email]);

  async function loadRecent() {
    setRecentLoading(true);
    try {
      const res = await fetch('/api/admin/vasco-upload');
      const data = await res.json();
      setRecentUploads(data.recent || []);
    } catch {
      // silent
    } finally {
      setRecentLoading(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) loadRecent();
  }, [isAuthenticated]);

  if (!authLoading && !isAuthenticated) {
    if (typeof window !== 'undefined') router.push('/admin/login');
    return null;
  }

  async function handleFiles(fileList) {
    const jsonFiles = Array.from(fileList).filter(f => f.name.endsWith('.json'));
    if (jsonFiles.length === 0) return;
    const newPreviews = await Promise.all(jsonFiles.map(async (f) => {
      try {
        const text = await f.text();
        const s = JSON.parse(text);
        const dc = s.vasco || s.crm || {};
        return {
          customer_slug: s.customer_slug,
          customer_name: s.customer_name,
          quarter: s.quarter,
          architect: s.architect,
          source: s.source || 'vasco',
          integrity: dc.integrity_score?.score ?? null,
          months: dc.volume_metrics?.data?.length || 0,
          snapshot_date: s.snapshot_date,
        };
      } catch (err) {
        return { error: `Unparseable: ${err.message}` };
      }
    }));
    setFiles(prev => [...prev, ...jsonFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  }

  async function uploadAll(mode = 'prompt') {
    setUploading(true);
    setResults([]);
    const newResults = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const text = await file.text();
        const snapshot = JSON.parse(text);

        const res = await fetch('/api/admin/vasco-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            snapshot,
            mode,
            architectOverride: architectOverride || undefined,
          }),
        });

        const data = await res.json();
        const idx = newResults.length;
        newResults.push({
          file: file.name,
          status: res.ok ? 'success' : (res.status === 409 ? 'conflict' : 'error'),
          httpStatus: res.status,
          data,
        });
        setResults([...newResults]);

        // Auto-apply on success
        if (res.ok && autoApply && data.customer?.id && data.snapshotId) {
          setApplying(prev => ({ ...prev, [idx]: true }));
          try {
            const applyRes = await fetch('/api/admin/vasco-apply', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customerId: data.customer.id, snapshotId: data.snapshotId }),
            });
            const applyData = await applyRes.json();
            newResults[idx] = { ...newResults[idx], applied: applyRes.ok, applyData };
            setResults([...newResults]);
          } catch (err) {
            newResults[idx] = { ...newResults[idx], applied: false, applyData: { error: err.message } };
            setResults([...newResults]);
          } finally {
            setApplying(prev => ({ ...prev, [idx]: false }));
          }
        }
      } catch (err) {
        newResults.push({ file: file.name, status: 'error', data: { error: err.message } });
        setResults([...newResults]);
      }
    }
    setUploading(false);
    loadRecent();
  }

  async function retryWithCustomer(index, customerId) {
    const file = files[index];
    if (!file || !customerId) return;
    try {
      const text = await file.text();
      const snapshot = JSON.parse(text);
      const res = await fetch('/api/admin/vasco-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          snapshot,
          mode: 'prompt',
          customerIdOverride: customerId,
          architectOverride: architectOverride || undefined,
        }),
      });
      const data = await res.json();
      const newResults = [...results];
      newResults[index] = {
        file: file.name,
        status: res.ok ? 'success' : (res.status === 409 ? 'conflict' : 'error'),
        httpStatus: res.status,
        data,
      };
      setResults(newResults);
      if (res.ok && autoApply && data.customer?.id && data.snapshotId) {
        applyToDiagnostic(index);
      }
      loadRecent();
    } catch (err) {
      const newResults = [...results];
      newResults[index] = { file: file.name, status: 'error', data: { error: err.message } };
      setResults(newResults);
    }
  }

  async function applyToDiagnostic(index) {
    const result = results[index];
    if (!result?.data?.customer?.id || !result?.data?.snapshotId) return;
    setApplying(prev => ({ ...prev, [index]: true }));
    try {
      const res = await fetch('/api/admin/vasco-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: result.data.customer.id,
          snapshotId: result.data.snapshotId,
        }),
      });
      const data = await res.json();
      const newResults = [...results];
      newResults[index] = {
        ...result,
        applied: res.ok,
        applyData: data,
      };
      setResults(newResults);
    } catch (err) {
      const newResults = [...results];
      newResults[index] = { ...result, applied: false, applyData: { error: err.message } };
      setResults(newResults);
    } finally {
      setApplying(prev => ({ ...prev, [index]: false }));
    }
  }

  async function overwriteConflicts() {
    setUploading(true);
    const conflictFiles = files.filter((_, i) => results[i]?.status === 'conflict');
    const newResults = [...results];

    for (let i = 0; i < files.length; i++) {
      if (results[i]?.status !== 'conflict') continue;
      const file = files[i];
      try {
        const text = await file.text();
        const snapshot = JSON.parse(text);
        const res = await fetch('/api/admin/vasco-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ snapshot, mode: 'overwrite' }),
        });
        const data = await res.json();
        newResults[i] = {
          file: file.name,
          status: res.ok ? 'success' : 'error',
          data,
        };
        setResults([...newResults]);
      } catch (err) {
        newResults[i] = { file: file.name, status: 'error', data: { error: err.message } };
      }
    }
    setUploading(false);
  }

  const successCount = results.filter(r => r.status === 'success').length;
  const conflictCount = results.filter(r => r.status === 'conflict').length;
  const errorCount = results.filter(r => r.status === 'error').length;

  return (
    <>
      <Head>
        <title>Vasco Upload | LeanScale Admin</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        <header style={{
          background: 'white', padding: '1rem 2rem', borderBottom: '1px solid #eee',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>LeanScale Admin</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#666' }}>{user?.email}</span>
            <button onClick={signOut} style={{
              padding: '0.5rem 1rem', background: '#eee', border: 'none',
              borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem',
            }}>Sign Out</button>
          </div>
        </header>

        <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <Link href="/admin" style={navLinkStyle}>Dashboard</Link>
            <Link href="/admin/customers" style={navLinkStyle}>Customers</Link>
            <Link href="/admin/diagnostics" style={navLinkStyle}>Diagnostics</Link>
            <Link href="/admin/availability" style={navLinkStyle}>Availability</Link>
            <Link href="/admin/submissions" style={navLinkStyle}>Submissions</Link>
            <Link href="/admin/vasco-upload" style={{ ...navLinkStyle, background: '#7c3aed', color: 'white', border: 'none' }}>Vasco Upload</Link>
          </nav>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            QBR Snapshot Upload
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Drop one or more JSON files produced by a QBR snapshot skill. Each file
            will be validated and written to <code>vasco_snapshots</code>.
            {' '}Accepted sources: <strong>Vasco</strong>, <strong>HubSpot</strong>, <strong>Salesforce</strong>.
          </p>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
            Docs:
            {' '}<a href="https://github.com/LeanScaleTeam/Skills-and-SOPs/tree/main/vasco-qbr-snapshot" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed' }}>Vasco</a>
            {' · '}<a href="https://github.com/LeanScaleTeam/Skills-and-SOPs/tree/main/hubspot-qbr-snapshot" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed' }}>HubSpot</a>
            {' · '}<a href="https://github.com/LeanScaleTeam/Skills-and-SOPs/tree/main/salesforce-qbr-snapshot" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed' }}>Salesforce</a>
          </div>

          {/* Options row */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1rem', padding: '0.75rem 1rem', background: 'white', borderRadius: '8px', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#374151' }}>
              <input
                type="checkbox"
                checked={autoApply}
                onChange={(e) => setAutoApply(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Auto-apply to diagnostic after upload
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151' }}>
              <span>Architect:</span>
              <input
                type="text"
                value={architectOverride}
                onChange={(e) => setArchitectOverride(e.target.value)}
                placeholder="Your name"
                style={{ padding: '0.3rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '0.85rem', width: '140px' }}
              />
              <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>overrides value in JSON</span>
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              handleFiles(e.dataTransfer.files);
            }}
            style={{
              background: 'white',
              border: `2px dashed ${dragActive ? '#7c3aed' : '#d1d5db'}`,
              borderRadius: '12px',
              padding: '3rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              transition: 'border-color 0.2s',
            }}
          >
            <div style={{ fontSize: '1rem', marginBottom: '0.5rem', color: '#374151' }}>
              Drop JSON files here, or
            </div>
            <label style={{
              display: 'inline-block', padding: '0.5rem 1.5rem', background: '#7c3aed', color: 'white',
              borderRadius: '6px', cursor: 'pointer', fontWeight: 500,
            }}>
              Browse files
              <input
                type="file"
                accept="application/json,.json"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                style={{ display: 'none' }}
              />
            </label>
            <div style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.75rem' }}>
              Files must match the <code>vasco-qbr-snapshot</code> schema v1.0
            </div>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Queued files ({files.length})</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setFiles([]); setPreviews([]); setResults([]); setExpanded({}); }} disabled={uploading} style={secondaryButtonStyle}>
                    Clear
                  </button>
                  <button onClick={() => uploadAll('prompt')} disabled={uploading} style={primaryButtonStyle}>
                    {uploading ? 'Uploading…' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
                  </button>
                </div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                {files.map((f, i) => {
                  const r = results[i];
                  const p = previews[i];
                  const color = r?.status === 'success' ? '#16a34a'
                              : r?.status === 'conflict' ? '#d97706'
                              : r?.status === 'error' ? '#dc2626'
                              : '#6b7280';
                  const icon = r?.status === 'success' ? '✓'
                             : r?.status === 'conflict' ? '⚠'
                             : r?.status === 'error' ? '✗'
                             : '·';
                  const slug = r?.data?.customer?.slug;
                  const isOpen = expanded[i];
                  return (
                    <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', color }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 600 }}>{icon}</span>
                        <span>{f.name}</span>
                        {r?.data?.customer && <span style={{ color: '#6b7280' }}> → {r.data.customer.name}</span>}
                        {r?.data?.source && <span style={{ color: '#6b7280' }}> [{r.data.source}]</span>}
                        {r?.data?.action && <span style={{ color: '#6b7280' }}> ({r.data.action})</span>}
                        {r?.data?.error && <span style={{ color: '#dc2626' }}> — {r.data.error}</span>}
                        {!r && p && !p.error && (
                          <button
                            onClick={() => setExpanded(prev => ({ ...prev, [i]: !prev[i] }))}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#7c3aed', cursor: 'pointer', fontSize: '0.75rem' }}
                          >
                            {isOpen ? 'Hide preview' : 'Preview'}
                          </button>
                        )}
                      </div>

                      {/* Pre-upload preview */}
                      {!r && p && !p.error && isOpen && (
                        <div style={{ marginTop: '0.5rem', marginLeft: '1.5rem', padding: '0.75rem', background: '#f9fafb', borderRadius: '6px', fontSize: '0.8rem', color: '#374151', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.25rem 1rem' }}>
                          <span style={{ color: '#6b7280' }}>Customer:</span><span>{p.customer_name} <code style={{ color: '#6b7280' }}>({p.customer_slug})</code></span>
                          <span style={{ color: '#6b7280' }}>Quarter:</span><span>{p.quarter || <em style={{ color: '#d97706' }}>missing — will be inferred from date</em>}</span>
                          <span style={{ color: '#6b7280' }}>Snapshot date:</span><span>{p.snapshot_date}</span>
                          <span style={{ color: '#6b7280' }}>Architect (in file):</span><span>{p.architect || <em style={{ color: '#6b7280' }}>none</em>}</span>
                          <span style={{ color: '#6b7280' }}>Source:</span><span>{p.source}</span>
                          <span style={{ color: '#6b7280' }}>Integrity:</span><span>{p.integrity != null ? `${p.integrity.toFixed(1)}%` : '—'}</span>
                          <span style={{ color: '#6b7280' }}>Volume data:</span><span>{p.months} month{p.months !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {!r && p?.error && (
                        <div style={{ marginTop: '0.25rem', marginLeft: '1.5rem', color: '#dc2626', fontSize: '0.75rem' }}>{p.error}</div>
                      )}

                      {r?.data?.details && <div style={{ color: '#dc2626', fontSize: '0.75rem', paddingLeft: '1.5rem' }}>{r.data.details.join('; ')}</div>}

                      {/* Customer picker on 404 */}
                      {r?.httpStatus === 404 && r?.data?.candidates?.length > 0 && (
                        <div style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', fontSize: '0.8rem' }}>
                          <div style={{ color: '#374151', marginBottom: '0.25rem' }}>Did you mean:</div>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {r.data.candidates.map(c => (
                              <button
                                key={c.id}
                                onClick={() => retryWithCustomer(i, c.id)}
                                style={{ ...secondaryButtonStyle, padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                              >
                                {c.name} <code style={{ color: '#6b7280' }}>({c.slug})</code>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {r?.httpStatus === 404 && !r?.data?.candidates?.length && (
                        <div style={{ marginTop: '0.25rem', paddingLeft: '1.5rem', color: '#6b7280', fontSize: '0.75rem' }}>
                          No matching customers. Check <Link href="/admin/customers" style={{ color: '#7c3aed' }}>Customers</Link> and update the <code>customer_slug</code> in your JSON.
                        </div>
                      )}

                      {/* Conflict diff */}
                      {r?.status === 'conflict' && r?.data?.existing && r?.data?.incoming && (
                        <div style={{ marginTop: '0.5rem', marginLeft: '1.5rem', padding: '0.5rem 0.75rem', background: '#fffbeb', borderRadius: '6px', fontSize: '0.75rem', color: '#78350f' }}>
                          <div><strong>Existing:</strong> integrity {r.data.existing.integrity_score != null ? `${r.data.existing.integrity_score.toFixed(1)}%` : '—'}, {r.data.existing.months || 0} months, architect {r.data.existing.architect || '—'}, uploaded {new Date(r.data.existing.uploaded_at).toLocaleDateString()}</div>
                          <div><strong>Incoming:</strong> integrity {r.data.incoming.integrity_score != null ? `${r.data.incoming.integrity_score.toFixed(1)}%` : '—'}, {r.data.incoming.months || 0} months, architect {r.data.incoming.architect || '—'}</div>
                        </div>
                      )}

                      {r?.status === 'success' && slug && (
                        <div style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => applyToDiagnostic(i)}
                            disabled={applying[i] || r.applied}
                            style={{
                              ...primaryButtonStyle,
                              padding: '0.3rem 0.75rem',
                              fontSize: '0.8rem',
                              background: r.applied ? '#16a34a' : '#7c3aed',
                              opacity: applying[i] ? 0.6 : 1,
                            }}
                          >
                            {applying[i] ? 'Applying…' : r.applied ? '✓ Applied' : 'Apply to Diagnostic'}
                          </button>
                          <a
                            href={`https://clients.leanscale.team/c/${slug}/qbr`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-block', padding: '0.3rem 0.75rem', fontSize: '0.8rem', color: '#374151' }}
                          >
                            View QBR ↗
                          </a>
                          <a
                            href={`https://clients.leanscale.team/c/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ ...secondaryButtonStyle, textDecoration: 'none', display: 'inline-block', padding: '0.3rem 0.75rem', fontSize: '0.8rem', color: '#374151' }}
                          >
                            View Customer ↗
                          </a>
                          {r.applyData?.error && (
                            <span style={{ color: '#dc2626', fontSize: '0.75rem' }}>— {r.applyData.error}</span>
                          )}
                          {r.applied && r.applyData?.applied && (
                            <span style={{ color: '#16a34a', fontSize: '0.75rem' }}>
                              · {r.applyData.applied.competency_count || 0} competencies, {r.applyData.applied.trends_months || 0} months of trends
                            </span>
                          )}
                          {r.applied && r.applyData?.applied?.period_comparison && (
                            <div style={{ width: '100%', marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>
                              vs {r.applyData.applied.period_comparison.prior_quarter || r.applyData.applied.period_comparison.prior_snapshot_date}:
                              {r.applyData.applied.period_comparison.integrity_delta != null && <span> integrity {r.applyData.applied.period_comparison.integrity_delta > 0 ? '+' : ''}{r.applyData.applied.period_comparison.integrity_delta}pts</span>}
                              {r.applyData.applied.period_comparison.leads_delta != null && <span> · leads {r.applyData.applied.period_comparison.leads_delta > 0 ? '+' : ''}{r.applyData.applied.period_comparison.leads_delta}</span>}
                              {r.applyData.applied.period_comparison.won_delta != null && <span> · won {r.applyData.applied.period_comparison.won_delta > 0 ? '+' : ''}{r.applyData.applied.period_comparison.won_delta}</span>}
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              {conflictCount > 0 && !uploading && (
                <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fef3c7', borderRadius: '8px', fontSize: '0.85rem' }}>
                  {conflictCount} file{conflictCount > 1 ? 's' : ''} already exist for this date.
                  {' '}
                  <button onClick={overwriteConflicts} style={{ ...primaryButtonStyle, padding: '0.25rem 0.75rem', fontSize: '0.85rem' }}>
                    Overwrite existing
                  </button>
                </div>
              )}
              {results.length > 0 && (
                <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
                  {successCount} succeeded · {conflictCount} conflicts · {errorCount} errors
                </div>
              )}
            </div>
          )}

          {/* Recent uploads */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Recent uploads</h3>
              <button onClick={loadRecent} disabled={recentLoading} style={{ ...secondaryButtonStyle, fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                {recentLoading ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
            {recentUploads.length === 0 && !recentLoading && (
              <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>No snapshots uploaded yet.</div>
            )}
            {recentUploads.length > 0 && (
              <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#6b7280', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '0.4rem 0.5rem' }}>Customer</th>
                    <th style={{ padding: '0.4rem 0.5rem' }}>Quarter</th>
                    <th style={{ padding: '0.4rem 0.5rem' }}>Architect</th>
                    <th style={{ padding: '0.4rem 0.5rem' }}>Source</th>
                    <th style={{ padding: '0.4rem 0.5rem' }}>Integrity</th>
                    <th style={{ padding: '0.4rem 0.5rem' }}>Uploaded</th>
                    <th style={{ padding: '0.4rem 0.5rem' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {recentUploads.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.4rem 0.5rem' }}>{r.customer?.name} <code style={{ color: '#6b7280' }}>({r.customer?.slug})</code></td>
                      <td style={{ padding: '0.4rem 0.5rem' }}>{r.quarter || '—'}</td>
                      <td style={{ padding: '0.4rem 0.5rem' }}>{r.architect || '—'}</td>
                      <td style={{ padding: '0.4rem 0.5rem' }}>{r.source}</td>
                      <td style={{ padding: '0.4rem 0.5rem' }}>{r.integrity_score?.score != null ? `${r.integrity_score.score.toFixed(1)}%` : '—'}</td>
                      <td style={{ padding: '0.4rem 0.5rem', color: '#6b7280' }}>{new Date(r.uploaded_at).toLocaleDateString()}</td>
                      <td style={{ padding: '0.4rem 0.5rem' }}>
                        {r.customer?.slug && (
                          <a href={`https://clients.leanscale.team/c/${r.customer.slug}/qbr`} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed', textDecoration: 'none', fontSize: '0.75rem' }}>View QBR ↗</a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Instructions */}
          <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1.5rem', fontSize: '0.9rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: 0, marginBottom: '0.75rem' }}>How to generate a snapshot file</h3>
            <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              <li>Set up your Vasco MCP connection in Claude.ai (one-time)</li>
              <li>Run the <code>vasco-qbr-snapshot</code> skill for your assigned customer</li>
              <li>Review the inferred matrix statuses and adjust as needed</li>
              <li>Drop the generated <code>.json</code> file here</li>
            </ol>
          </div>
        </main>
      </div>
    </>
  );
}

const navLinkStyle = {
  padding: '0.5rem 1rem',
  background: 'white',
  border: '1px solid #ddd',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '0.875rem',
  color: '#333',
};

const primaryButtonStyle = {
  padding: '0.5rem 1rem',
  background: '#7c3aed',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: '0.875rem',
};

const secondaryButtonStyle = {
  padding: '0.5rem 1rem',
  background: '#f3f4f6',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.875rem',
};
