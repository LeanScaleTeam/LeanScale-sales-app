import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { playbooks, resolvePlaybookSlug } from '../../data/services-catalog';
import { playbookContent } from '../../data/playbook-content';
import { useCustomer } from '../../context/CustomerContext';
import PlaybookTabBar from '../../components/playbook/PlaybookTabBar';
import PlaybookScoreOverlay from '../../components/playbook/PlaybookScoreOverlay';

// ── Markdown Rendering ──

function formatInlineText(text) {
  if (!text) return text;
  const parts = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Match bold, italic, inline code, and links
    const patterns = [
      { regex: /\*\*(.+?)\*\*/, render: (m, k) => <strong key={k}>{m[1]}</strong> },
      { regex: /\*(.+?)\*/, render: (m, k) => <em key={k}>{m[1]}</em> },
      { regex: /`([^`]+)`/, render: (m, k) => <code key={k} style={{ background: '#f3f4f6', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.85em' }}>{m[1]}</code> },
      { regex: /\[([^\]]+)\]\(([^)]+)\)/, render: (m, k) => <a key={k} href={m[2]} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed' }}>{m[1]}</a> },
    ];

    let earliest = null;
    let earliestIdx = remaining.length;
    let earliestPattern = null;

    for (const p of patterns) {
      const match = remaining.match(p.regex);
      if (match && match.index < earliestIdx) {
        earliest = match;
        earliestIdx = match.index;
        earliestPattern = p;
      }
    }

    if (earliest && earliestPattern) {
      const before = remaining.slice(0, earliestIdx);
      if (before) parts.push(before);
      parts.push(earliestPattern.render(earliest, keyIdx++));
      remaining = remaining.slice(earliestIdx + earliest[0].length);
    } else {
      parts.push(remaining);
      break;
    }
  }
  return parts.length === 1 ? parts[0] : parts;
}

function renderMarkdownContent(text) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let currentList = [];
  let listType = null;
  let listIndent = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      const Tag = listType === 'ul' ? 'ul' : 'ol';
      elements.push(
        <Tag key={elements.length} style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
          {currentList.map((item, i) => (
            <li key={i} style={{ marginBottom: '0.25rem', lineHeight: 1.6 }}>{formatInlineText(item)}</li>
          ))}
        </Tag>
      );
      currentList = [];
      listType = null;
    }
  };

  const flushTable = (tableRows) => {
    if (tableRows.length < 2) return;
    const headers = tableRows[0];
    const dataRows = tableRows.slice(1);
    elements.push(
      <div key={elements.length} style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', lineHeight: 1.5 }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{
                  padding: '0.5rem 0.75rem', borderBottom: '2px solid #e5e7eb',
                  textAlign: 'left', fontWeight: 600, color: '#374151', background: '#f9fafb',
                }}>{formatInlineText(h.trim())}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: '0.5rem 0.75rem', borderBottom: '1px solid #f3f4f6', color: '#4b5563',
                  }}>{formatInlineText(cell.trim())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  let tableRows = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table row
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      const cells = line.split('|').slice(1, -1);
      if (line.match(/^\|[\s-:|]+\|$/)) {
        // Separator row — skip
        continue;
      }
      tableRows.push(cells);
      continue;
    } else if (tableRows.length > 0) {
      flushTable(tableRows);
      tableRows = [];
    }

    if (line.match(/^---+$/)) {
      flushList();
      elements.push(<hr key={elements.length} style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '1.5rem 0' }} />);
    } else if (line.startsWith('##### ')) {
      flushList();
      elements.push(<h5 key={elements.length} style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.25rem', color: '#4b5563' }}>{formatInlineText(line.slice(6))}</h5>);
    } else if (line.startsWith('#### ')) {
      flushList();
      elements.push(<h4 key={elements.length} style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: '#374151' }}>{formatInlineText(line.slice(5))}</h4>);
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={elements.length} style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem', color: '#7c3aed' }}>{formatInlineText(line.slice(4))}</h3>);
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={elements.length} style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>{formatInlineText(line.slice(3))}</h2>);
    } else if (line.startsWith('# ') && !line.startsWith('## ')) {
      flushList();
      elements.push(<h1 key={elements.length} style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem', color: '#1f2937' }}>{formatInlineText(line.slice(2))}</h1>);
    } else if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={elements.length} style={{ borderLeft: '3px solid #D6BCFA', paddingLeft: '1rem', margin: '1rem 0', color: '#6b7280', fontStyle: 'italic' }}>
          {formatInlineText(line.slice(2))}
        </blockquote>
      );
    } else if (line.match(/^[-*]\s/)) {
      if (listType !== 'ul') { flushList(); listType = 'ul'; }
      currentList.push(line.replace(/^[-*]\s/, ''));
    } else if (line.match(/^\d+\.\s/)) {
      if (listType !== 'ol') { flushList(); listType = 'ol'; }
      currentList.push(line.replace(/^\d+\.\s/, ''));
    } else if (line.trim()) {
      flushList();
      elements.push(<p key={elements.length} style={{ margin: '0.5rem 0', lineHeight: 1.6 }}>{formatInlineText(line)}</p>);
    }
  }

  flushList();
  if (tableRows.length > 0) flushTable(tableRows);
  return elements;
}

// ── Loom Video Embed ──

function LoomEmbed({ loomId }) {
  if (!loomId) return null;
  return (
    <div style={{
      position: 'relative', paddingBottom: '56.25%', height: 0,
      marginBottom: '1.5rem', borderRadius: '0.5rem', overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <iframe
        src={`https://www.loom.com/embed/${loomId}`}
        frameBorder="0"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </div>
  );
}

// ── Page Component ──

const TABS = [
  { key: 'advisory', label: 'Advisory' },
  { key: 'methodology', label: 'Methodology' },
  { key: 'implementation', label: 'Implementation' },
];

export default function PlaybookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { customerPath, diagnosticScores } = useCustomer();
  const [activeTab, setActiveTab] = useState('advisory');

  const slug = id ? resolvePlaybookSlug(id) : null;
  const playbook = id ? playbooks.find(p => p.id === id) : null;
  const content = slug ? (playbookContent[slug] || playbookContent[id]) : null;

  if (!router.isReady) {
    return (
      <Layout title="Loading...">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <p style={{ color: '#666' }}>Loading playbook...</p>
        </div>
      </Layout>
    );
  }

  if (!playbook) {
    return (
      <Layout title="Playbook Not Found">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1>Playbook Not Found</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            The playbook you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href={customerPath('/why-leanscale/services')} className="btn btn-primary">
            Browse All Services
          </Link>
        </div>
      </Layout>
    );
  }

  if (!content || content.status === 'stub') {
    return (
      <Layout title={`${playbook.name} Playbook`}>
        <div className="container" style={{ maxWidth: 900 }}>
          <BackLink customerPath={customerPath} />
          <PlaybookHeader playbook={playbook} />
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', color: '#718096', marginBottom: '1rem' }}>
              This playbook is coming soon.
            </p>
            <p style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>
              In the meantime, start a diagnostic to see how this project fits your GTM roadmap.
            </p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link href={customerPath('/try-leanscale/start')} className="btn btn-primary">
                Start GTM Diagnostic
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const loomId = content.meta?.loomEmbedId;

  return (
    <Layout title={`${playbook.name} Playbook`}>
      <div className="container" style={{ maxWidth: 900 }}>
        <BackLink customerPath={customerPath} />
        <PlaybookHeader playbook={playbook} tier={content.meta?.tier} />

        {diagnosticScores && content.meta?.competencyIds?.length > 0 && (
          <PlaybookScoreOverlay
            playbookSlug={slug}
            scores={diagnosticScores}
            competencyIds={content.meta.competencyIds}
          />
        )}

        <PlaybookTabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {/* Advisory */}
        {activeTab === 'advisory' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            {loomId && <LoomEmbed loomId={loomId} />}
            <div style={{ color: '#374151' }}>
              {renderMarkdownContent(content.advisory)}
            </div>
          </div>
        )}

        {/* Methodology */}
        {activeTab === 'methodology' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ color: '#374151' }}>
              {renderMarkdownContent(content.methodology)}
            </div>
          </div>
        )}

        {/* Implementation */}
        {activeTab === 'implementation' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ color: '#374151' }}>
              {renderMarkdownContent(content.implementation)}
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href={customerPath('/try-leanscale/start')} className="btn btn-primary" style={{ marginRight: '1rem' }}>
            Start GTM Diagnostic
          </Link>
          <Link href={customerPath('/why-leanscale/services')} className="btn" style={{ background: 'white', border: '1px solid #e5e7eb', color: '#374151' }}>
            Browse More Services
          </Link>
        </div>
      </div>
    </Layout>
  );
}

// ── Sub-components ──

function BackLink({ customerPath }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <Link
        href={customerPath('/why-leanscale/services')}
        style={{ color: '#7c3aed', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}
      >
        ← Back to Services Catalog
      </Link>
    </div>
  );
}

function PlaybookHeader({ playbook, tier }) {
  return (
    <div className="page-header" style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <span style={{
          display: 'inline-block', padding: '0.25rem 0.75rem',
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          color: 'white', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600,
        }}>
          ONE-TIME PROJECT
        </span>
        {tier && (
          <span style={{
            display: 'inline-block', padding: '0.25rem 0.75rem',
            background: tier === 'core' ? '#EBF8FF' : '#F7FAFC',
            color: tier === 'core' ? '#2B6CB0' : '#718096',
            borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600,
            border: `1px solid ${tier === 'core' ? '#BEE3F8' : '#E2E8F0'}`,
          }}>
            {tier === 'core' ? 'CORE' : 'EXTENDED'}
          </span>
        )}
      </div>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{playbook.name}</h1>
      <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.5 }}>
        {playbook.description}
      </p>
    </div>
  );
}
