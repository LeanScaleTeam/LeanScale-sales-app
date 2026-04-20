import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function VascoUploadPage() {
  const { user, signOut, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  if (!authLoading && !isAuthenticated) {
    if (typeof window !== 'undefined') router.push('/admin/login');
    return null;
  }

  async function handleFiles(fileList) {
    const jsonFiles = Array.from(fileList).filter(f => f.name.endsWith('.json'));
    if (jsonFiles.length === 0) return;
    setFiles(prev => [...prev, ...jsonFiles]);
  }

  async function uploadAll(mode = 'prompt') {
    setUploading(true);
    setResults([]);
    const newResults = [];

    for (const file of files) {
      try {
        const text = await file.text();
        const snapshot = JSON.parse(text);

        const res = await fetch('/api/admin/vasco-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ snapshot, mode }),
        });

        const data = await res.json();
        newResults.push({
          file: file.name,
          status: res.ok ? 'success' : (res.status === 409 ? 'conflict' : 'error'),
          data,
        });
      } catch (err) {
        newResults.push({ file: file.name, status: 'error', data: { error: err.message } });
      }
      setResults([...newResults]);
    }
    setUploading(false);
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
            <Link href="/admin/vasco-upload" style={{ ...navLinkStyle, background: '#7c3aed', color: 'white', border: 'none' }}>Vasco Upload</Link>
          </nav>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Vasco QBR Bulk Upload
          </h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            Drop one or more JSON files produced by the <code>vasco-qbr-snapshot</code> skill.
            Each file will be validated and written to <code>vasco_snapshots</code>.
            {' '}<a href="https://github.com/LeanScaleTeam/Skills-and-SOPs/tree/main/vasco-qbr-snapshot" target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed' }}>Skill docs →</a>
          </p>

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
                  <button onClick={() => { setFiles([]); setResults([]); }} disabled={uploading} style={secondaryButtonStyle}>
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
                  const color = r?.status === 'success' ? '#16a34a'
                              : r?.status === 'conflict' ? '#d97706'
                              : r?.status === 'error' ? '#dc2626'
                              : '#6b7280';
                  const icon = r?.status === 'success' ? '✓'
                             : r?.status === 'conflict' ? '⚠'
                             : r?.status === 'error' ? '✗'
                             : '·';
                  return (
                    <li key={i} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6', color }}>
                      <span style={{ fontWeight: 600 }}>{icon}</span> {f.name}
                      {r?.data?.customer && <span style={{ color: '#6b7280' }}> → {r.data.customer.name}</span>}
                      {r?.data?.action && <span style={{ color: '#6b7280' }}> ({r.data.action})</span>}
                      {r?.data?.error && <span style={{ color: '#dc2626' }}> — {r.data.error}</span>}
                      {r?.data?.details && <div style={{ color: '#dc2626', fontSize: '0.75rem', paddingLeft: '1.5rem' }}>{r.data.details.join('; ')}</div>}
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
