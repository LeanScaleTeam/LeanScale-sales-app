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
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch) {
      const beforeBold = remaining.slice(0, boldMatch.index);
      if (beforeBold) parts.push(beforeBold);
      parts.push(<strong key={keyIdx++}>{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
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
  let inTable = false;
  let tableRows = [];

  const flushList = () => {
    if (currentList.length > 0) {
      if (listType === 'ul') {
        elements.push(
          <ul key={elements.length} style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
            {currentList.map((item, i) => (
              <li key={i} style={{ marginBottom: '0.25rem', lineHeight: 1.6 }}>{formatInlineText(item)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={elements.length} style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>
            {currentList.map((item, i) => (
              <li key={i} style={{ marginBottom: '0.25rem', lineHeight: 1.6 }}>{formatInlineText(item)}</li>
            ))}
          </ol>
        );
      }
      currentList = [];
      listType = null;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); // skip separator row
      elements.push(
        <div key={elements.length} style={{ overflowX: 'auto', margin: '1rem 0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr>
                {headerRow.map((cell, i) => (
                  <th key={i} style={{ padding: '0.5rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                    {formatInlineText(cell.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>
                      {formatInlineText(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table detection
    if (line.match(/^\|.+\|$/)) {
      flushList();
      inTable = true;
      const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable();
    }

    if (line.match(/^---+$/)) {
      flushList();
      elements.push(
        <hr key={elements.length} style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '1.5rem 0' }} />
      );
    } else if (line.startsWith('# ') && !line.startsWith('## ')) {
      flushList();
      elements.push(
        <h1 key={elements.length} style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem', color: '#1f2937' }}>
          {formatInlineText(line.replace(/^#\s*/, ''))}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={elements.length} style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
          {formatInlineText(line.replace(/^##\s*/, ''))}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={elements.length} style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem', color: '#7c3aed' }}>
          {formatInlineText(line.replace(/^###\s*/, ''))}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4 key={elements.length} style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: '#374151' }}>
          {formatInlineText(line.replace(/^####\s*/, ''))}
        </h4>
      );
    } else if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={elements.length} style={{ borderLeft: '3px solid #D6BCFA', paddingLeft: '1rem', margin: '1rem 0', color: '#6b7280', fontStyle: 'italic' }}>
          {formatInlineText(line.replace(/^>\s*/, ''))}
        </blockquote>
      );
    } else if (line.match(/^\*\*[^*]+:\*\*/) || line.startsWith('**Step Overview:**') || line.startsWith('**End State:**')) {
      flushList();
      elements.push(
        <p key={elements.length} style={{ margin: '0.5rem 0', lineHeight: 1.6, fontStyle: 'italic', color: '#4b5563' }}>
          {formatInlineText(line)}
        </p>
      );
    } else if (line.match(/^[-*]\s/)) {
      if (listType !== 'ul') {
        flushList();
        listType = 'ul';
      }
      currentList.push(line.replace(/^[-*]\s/, ''));
    } else if (line.match(/^\d+\.\s/)) {
      if (listType !== 'ol') {
        flushList();
        listType = 'ol';
      }
      currentList.push(line.replace(/^\d+\.\s/, ''));
    } else if (line.trim()) {
      flushList();
      elements.push(
        <p key={elements.length} style={{ margin: '0.5rem 0', lineHeight: 1.6 }}>
          {formatInlineText(line)}
        </p>
      );
    }
  }

  flushList();
  if (inTable) flushTable();
  return elements;
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

  // Resolve through aliases
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
            The playbook you're looking for doesn't exist or has been moved.
          </p>
          <Link href={customerPath('/why-leanscale/services')} className="btn btn-primary">
            Browse All Services
          </Link>
        </div>
      </Layout>
    );
  }

  // Stub playbook — no content yet
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

  // Published playbook — 3-tab view
  const tabContent = content[activeTab];

  return (
    <Layout title={`${playbook.name} Playbook`}>
      <div className="container" style={{ maxWidth: 900 }}>
        <BackLink customerPath={customerPath} />
        <PlaybookHeader playbook={playbook} tier={content.meta?.tier} />

        {/* Score overlay banner (only shown during active diagnostic) */}
        {diagnosticScores && content.meta?.competencyIds?.length > 0 && (
          <PlaybookScoreOverlay
            playbookSlug={slug}
            scores={diagnosticScores}
            competencyIds={content.meta.competencyIds}
          />
        )}

        {/* Tab navigation */}
        <PlaybookTabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {/* Tab content */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{ color: '#374151' }}>
            {renderMarkdownContent(tabContent)}
          </div>
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link
            href={customerPath('/try-leanscale/start')}
            className="btn btn-primary"
            style={{ marginRight: '1rem' }}
          >
            Start GTM Diagnostic
          </Link>
          <Link
            href={customerPath('/why-leanscale/services')}
            className="btn"
            style={{ background: 'white', border: '1px solid #e5e7eb', color: '#374151' }}
          >
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
          display: 'inline-block',
          padding: '0.25rem 0.75rem',
          background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
          color: 'white',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: 600,
        }}>
          ONE-TIME PROJECT
        </span>
        {tier && (
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            background: tier === 'core' ? '#EBF8FF' : '#F7FAFC',
            color: tier === 'core' ? '#2B6CB0' : '#718096',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
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
