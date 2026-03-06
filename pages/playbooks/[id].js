import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '../../components/Layout';
import { playbooks, resolvePlaybookSlug } from '../../data/services-catalog';
import { playbookContent } from '../../data/playbook-content';
import { useCustomer } from '../../context/CustomerContext';
import PlaybookTabBar from '../../components/playbook/PlaybookTabBar';
import PlaybookScoreOverlay from '../../components/playbook/PlaybookScoreOverlay';

// ── Styled Markdown ──

const markdownComponents = {
  h1: ({ children }) => (
    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem', color: '#1f2937' }}>{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2rem', marginBottom: '0.75rem', color: '#1f2937', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginTop: '1.5rem', marginBottom: '0.5rem', color: '#7c3aed' }}>{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginTop: '1rem', marginBottom: '0.5rem', color: '#374151' }}>{children}</h4>
  ),
  h5: ({ children }) => (
    <h5 style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '0.75rem', marginBottom: '0.25rem', color: '#4b5563' }}>{children}</h5>
  ),
  p: ({ children }) => (
    <p style={{ margin: '0.5rem 0', lineHeight: 1.6 }}>{children}</p>
  ),
  ul: ({ children }) => (
    <ul style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol style={{ paddingLeft: '1.5rem', margin: '0.5rem 0' }}>{children}</ol>
  ),
  li: ({ children }) => (
    <li style={{ marginBottom: '0.25rem', lineHeight: 1.6 }}>{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote style={{ borderLeft: '3px solid #D6BCFA', paddingLeft: '1rem', margin: '1rem 0', color: '#6b7280', fontStyle: 'italic' }}>{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#7c3aed' }}>{children}</a>
  ),
  code: ({ inline, children, className }) => {
    if (inline) {
      return (
        <code style={{ background: '#f3f4f6', padding: '0.1rem 0.3rem', borderRadius: 3, fontSize: '0.85em' }}>{children}</code>
      );
    }
    return (
      <pre style={{
        background: '#1f2937', color: '#e5e7eb', padding: '1rem', borderRadius: '0.5rem',
        overflowX: 'auto', margin: '0.75rem 0', fontSize: '0.85rem', lineHeight: 1.5,
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
        whiteSpace: 'pre',
      }}>
        <code>{children}</code>
      </pre>
    );
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children }) => (
    <div style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', lineHeight: 1.5 }}>{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead>{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr>{children}</tr>,
  th: ({ children }) => (
    <th style={{ padding: '0.5rem 0.75rem', borderBottom: '2px solid #e5e7eb', textAlign: 'left', fontWeight: 600, color: '#374151', background: '#f9fafb' }}>{children}</th>
  ),
  td: ({ children }) => (
    <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #f3f4f6', color: '#4b5563' }}>{children}</td>
  ),
  hr: () => (
    <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '1.5rem 0' }} />
  ),
  strong: ({ children }) => <strong>{children}</strong>,
  em: ({ children }) => <em>{children}</em>,
};

function MarkdownContent({ content }) {
  if (!content) return null;
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
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
        src={`https://www.loom.com/embed/${loomId}?hideEmbedTopBar=true&hide_share=true`}
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
          <Link href={customerPath('/about/services')} className="btn btn-primary">
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
              <Link href={customerPath('/diagnostic/start')} className="btn btn-primary">
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
            <MarkdownContent content={content.advisory} />
          </div>
        )}

        {/* Methodology */}
        {activeTab === 'methodology' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <MarkdownContent content={content.methodology} />
          </div>
        )}

        {/* Implementation */}
        {activeTab === 'implementation' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <MarkdownContent content={content.implementation} />
          </div>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href={customerPath('/diagnostic/start')} className="btn btn-primary" style={{ marginRight: '1rem' }}>
            Start GTM Diagnostic
          </Link>
          <Link href={customerPath('/about/services')} className="btn" style={{ background: 'white', border: '1px solid #e5e7eb', color: '#374151' }}>
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
        href={customerPath('/about/services')}
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
