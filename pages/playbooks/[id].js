import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { playbooks } from '../../data/services-catalog';
import { playbookContent } from '../../data/playbook-content';
import advisoryData from '../../data/playbook-advisory.json';
import { useCustomer } from '../../context/CustomerContext';

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
  
  // Table rendering helper
  const flushTable = (tableRows) => {
    if (tableRows.length < 2) return;
    const headers = tableRows[0];
    const dataRows = tableRows.slice(2); // skip separator row
    elements.push(
      <div key={elements.length} style={{ overflowX: 'auto', margin: '0.75rem 0' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.85rem',
          lineHeight: 1.5,
        }}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i} style={{
                  padding: '0.5rem 0.75rem',
                  borderBottom: '2px solid #e5e7eb',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#374151',
                  background: '#f9fafb',
                }}>
                  {formatInlineText(h.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} style={{
                    padding: '0.5rem 0.75rem',
                    borderBottom: '1px solid #f3f4f6',
                    color: '#4b5563',
                  }}>
                    {formatInlineText(cell.trim())}
                  </td>
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

    // Table row detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      const cells = line.split('|').slice(1, -1); // remove empty first/last from split
      if (line.match(/^\|[\s-:|]+\|$/)) {
        // Separator row - just push a marker
        tableRows.push('separator');
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (tableRows.length > 0) {
      // End of table
      const headerAndData = tableRows.filter(r => r !== 'separator');
      if (headerAndData.length >= 2) {
        flushTable([headerAndData[0], 'separator', ...headerAndData.slice(1)]);
      }
      tableRows = [];
    }

    if (line.match(/^---+$/)) {
      flushList();
      elements.push(
        <hr key={elements.length} style={{
          border: 'none',
          borderTop: '1px solid #e5e7eb',
          margin: '1.5rem 0',
        }} />
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={elements.length} style={{ 
          fontSize: '1.25rem', 
          fontWeight: 700, 
          marginTop: '2rem',
          marginBottom: '0.75rem',
          color: '#1f2937',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '0.5rem',
        }}>
          {line.replace(/^##\s*/, '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={elements.length} style={{ 
          fontSize: '1rem', 
          fontWeight: 600, 
          marginTop: '1.5rem',
          marginBottom: '0.5rem',
          color: '#7c3aed',
        }}>
          {line.replace(/^###\s*/, '')}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      flushList();
      elements.push(
        <h4 key={elements.length} style={{ 
          fontSize: '0.95rem', 
          fontWeight: 600, 
          marginTop: '1rem',
          marginBottom: '0.5rem',
          color: '#374151',
        }}>
          {line.replace(/^####\s*/, '')}
        </h4>
      );
    } else if (line.startsWith('##### ')) {
      flushList();
      elements.push(
        <h5 key={elements.length} style={{ 
          fontSize: '0.9rem', 
          fontWeight: 600, 
          marginTop: '0.75rem',
          marginBottom: '0.25rem',
          color: '#4b5563',
        }}>
          {line.replace(/^#####\s*/, '')}
        </h5>
      );
    } else if (line.match(/^\*\*[^*]+:\*\*/) || line.startsWith('**Step Overview:**') || line.startsWith('**End State:**')) {
      flushList();
      elements.push(
        <p key={elements.length} style={{ 
          margin: '0.5rem 0', 
          lineHeight: 1.6,
          fontStyle: 'italic',
          color: '#4b5563',
        }}>
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
  // Flush any remaining table
  if (tableRows.length > 0) {
    const headerAndData = tableRows.filter(r => r !== 'separator');
    if (headerAndData.length >= 2) {
      flushTable([headerAndData[0], 'separator', ...headerAndData.slice(1)]);
    }
  }
  return elements;
}

export default function PlaybookDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { customerPath } = useCustomer();
  
  const playbook = id ? playbooks.find(p => p.id === id) : null;
  const content = id ? playbookContent[id] : null;
  const advisory = id ? advisoryData[id] : null;

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

  return (
    <Layout title={`${playbook.name} Playbook`}>
      <div className="container" style={{ maxWidth: 900 }}>
        <div style={{ marginBottom: '2rem' }}>
          <Link 
            href={customerPath('/why-leanscale/services')} 
            style={{ 
              color: '#7c3aed', 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.9rem',
            }}
          >
            ← Back to Services Catalog
          </Link>
        </div>

        <div className="page-header" style={{ textAlign: 'left' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
            color: 'white',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}>
            ONE-TIME PROJECT
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{playbook.name}</h1>
          <p style={{ fontSize: '1.1rem', color: '#666', lineHeight: 1.5 }}>
            {playbook.description}
          </p>
        </div>

        {content && (
          <>
            {content.definition && (content.definition.whatItIs || content.definition.whatItIsNot) && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>📋</span> Definition
                </h2>
                {content.definition.whatItIs && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10b981', marginBottom: '0.5rem' }}>
                      What it is:
                    </h3>
                    <p style={{ color: '#374151', lineHeight: 1.6, margin: 0 }}>
                      {content.definition.whatItIs}
                    </p>
                  </div>
                )}
                {content.definition.whatItIsNot && (
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444', marginBottom: '0.5rem' }}>
                      What it is NOT:
                    </h3>
                    <p style={{ color: '#374151', lineHeight: 1.6, margin: 0 }}>
                      {content.definition.whatItIsNot}
                    </p>
                  </div>
                )}
              </section>
            )}

            {content.icpValueProp && (content.icpValueProp.painSolves || content.icpValueProp.outcome) && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>💎</span> ICP Value Proposition
                </h2>
                {content.icpValueProp.painSolves && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f59e0b', marginBottom: '0.5rem' }}>
                      Pain it solves:
                    </h3>
                    <p style={{ color: '#374151', lineHeight: 1.6, margin: 0 }}>
                      {content.icpValueProp.painSolves}
                    </p>
                  </div>
                )}
                {content.icpValueProp.outcome && (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#10b981', marginBottom: '0.5rem' }}>
                      Outcome delivered:
                    </h3>
                    <p style={{ color: '#374151', lineHeight: 1.6, margin: 0 }}>
                      {content.icpValueProp.outcome}
                    </p>
                  </div>
                )}
                {content.icpValueProp.whoOwns && (
                  <div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#6366f1', marginBottom: '0.5rem' }}>
                      Who owns it:
                    </h3>
                    <p style={{ color: '#374151', lineHeight: 1.6, margin: 0 }}>
                      {content.icpValueProp.whoOwns}
                    </p>
                  </div>
                )}
              </section>
            )}

            {content.implementation && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>⚙️</span> Implementation Procedure
                </h2>
                <div style={{ color: '#374151' }}>
                  {renderMarkdownContent(content.implementation)}
                </div>
              </section>
            )}

            {content.dependencies && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>🔗</span> Dependencies & Inputs
                </h2>
                <div style={{ color: '#374151' }}>
                  {renderMarkdownContent(content.dependencies)}
                </div>
              </section>
            )}

            {content.pitfalls && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: 600, 
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>⚠️</span> Common Pitfalls
                </h2>
                <div style={{ color: '#374151' }}>
                  {renderMarkdownContent(content.pitfalls)}
                </div>
              </section>
            )}
          </>
        )}

        {advisory && advisory.sections && (
          <>
            {advisory.sections.projectOverview && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{
                  fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>🎯</span> Project Overview
                </h2>
                <div style={{ color: '#374151' }}>
                  {renderMarkdownContent(advisory.sections.projectOverview)}
                </div>
              </section>
            )}

            {advisory.sections.toolsAndSystems && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{
                  fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>🛠️</span> Tools & Systems
                </h2>
                <div style={{ color: '#374151' }}>
                  {renderMarkdownContent(advisory.sections.toolsAndSystems)}
                </div>
              </section>
            )}

            {advisory.sections.stakeholdersAndRoles && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{
                  fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>👥</span> Stakeholders & Roles
                </h2>
                <div style={{ color: '#374151' }}>
                  {renderMarkdownContent(advisory.sections.stakeholdersAndRoles)}
                </div>
              </section>
            )}

            {advisory.sections.scoping && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{
                  fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>📐</span> Scoping
                </h2>
                <div style={{ color: '#374151' }}>
                  {renderMarkdownContent(advisory.sections.scoping)}
                </div>
              </section>
            )}

            {advisory.sections.discoveryQuestions && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{
                  fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>❓</span> Discovery Questions
                </h2>
                <div style={{ color: '#374151' }}>
                  {renderMarkdownContent(advisory.sections.discoveryQuestions)}
                </div>
              </section>
            )}

            {advisory.sections.beliefBarriers && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{
                  fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>💬</span> Overcoming Belief Barriers
                </h2>
                <div style={{ color: '#374151' }}>
                  {renderMarkdownContent(advisory.sections.beliefBarriers)}
                </div>
              </section>
            )}

            {advisory.sections.metricsImpact && (
              <section className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                <h2 style={{
                  fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}>
                  <span style={{ fontSize: '1.25rem' }}>📊</span> Metrics Impact & Success Measurement
                </h2>
                <div style={{ color: '#374151' }}>
                  {renderMarkdownContent(advisory.sections.metricsImpact)}
                </div>
              </section>
            )}

            {advisory.sourceUrl && (
              <div style={{
                textAlign: 'right',
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginBottom: '1rem',
              }}>
                Source: <a href={advisory.sourceUrl} target="_blank" rel="noopener noreferrer"
                  style={{ color: '#7c3aed' }}>playbooks.leanscale.team</a>
              </div>
            )}
          </>
        )}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link
            href={customerPath("/try-leanscale/start")}
            className="btn btn-primary"
            style={{ marginRight: '1rem' }}
          >
            Start GTM Diagnostic
          </Link>
          <Link
            href={customerPath('/why-leanscale/services')}
            className="btn"
            style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              color: '#374151',
            }}
          >
            Browse More Services
          </Link>
        </div>
      </div>
    </Layout>
  );
}
