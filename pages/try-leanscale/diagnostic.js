import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import HealthBar from '../../components/HealthBar';
import { processes, tools, power10Metrics, countStatuses, statusToLabel } from '../../data/diagnostic-data';

const views = [
  { id: 'power10', label: 'Power10 GTM Metric Health', icon: '📈' },
  { id: 'tools', label: 'GTM Tool Health', icon: '🔧' },
  { id: 'processes', label: 'Processes Overall Health', icon: '⚙️' },
  { id: 'by-outcome', label: 'by GTM Outcome', icon: '🎯' },
  { id: 'by-metric', label: 'by GTM Metric (Power10)', icon: '📊' },
  { id: 'by-function', label: 'by Function', icon: '👥' },
];

export default function GTMDiagnostic() {
  const [activeView, setActiveView] = useState('processes');

  const processStats = countStatuses(processes);
  const toolStats = countStatuses(tools);

  return (
    <Layout title="GTM Diagnostic">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>📊</span> GTM Diagnostic
          </h1>
        </div>

        {/* View Selector */}
        <div className="card-grid" style={{ marginBottom: '2rem' }}>
          {views.map((view) => (
            <div
              key={view.id}
              className="card"
              style={{
                cursor: 'pointer',
                border: activeView === view.id ? '2px solid var(--ls-purple)' : undefined,
                background: activeView === view.id ? '#f5f3ff' : undefined,
              }}
              onClick={() => setActiveView(view.id)}
            >
              <span style={{ fontSize: '1.5rem' }}>{view.icon}</span>
              <h3 className="card-title" style={{ marginTop: '0.5rem' }}>{view.label}</h3>
            </div>
          ))}
        </div>

        {/* Power10 Metrics View */}
        {activeView === 'power10' && (
          <section>
            <h2 style={{ marginBottom: '1.5rem' }}>Power10 GTM Metric Health</h2>
            <div className="card-grid">
              {power10Metrics.map((metric) => (
                <div key={metric.name} className="card">
                  <h3 className="card-title">{metric.name}</h3>
                  <span className="status-badge status-unable">N/A</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1rem', color: '#666', fontStyle: 'italic' }}>
              Note: Metric health statuses are populated during the diagnostic session.
            </p>
          </section>
        )}

        {/* Tools View */}
        {activeView === 'tools' && (
          <section>
            <h2 style={{ marginBottom: '1rem' }}>GTM Tool Health</h2>
            <p style={{ marginBottom: '1rem' }}>{tools.length} Tool Inspection Points</p>
            <HealthBar data={toolStats} />

            <div style={{ marginTop: '2rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tool</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tools.map((tool) => (
                    <tr key={tool.name}>
                      <td>{tool.name}</td>
                      <td>
                        <span className={`status-badge status-${tool.status}`}>
                          {statusToLabel(tool.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Processes View */}
        {activeView === 'processes' && (
          <section>
            <h2 style={{ marginBottom: '1rem' }}>Processes Overall Health</h2>
            <p style={{ marginBottom: '1rem' }}>{processes.length} Process Inspection Points</p>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
              <span>{processStats.healthy} ({((processStats.healthy / processes.length) * 100).toFixed(0)}%) Healthy</span>
              <span>{processStats.careful} ({((processStats.careful / processes.length) * 100).toFixed(0)}%) Careful</span>
              <span>{processStats.warning} ({((processStats.warning / processes.length) * 100).toFixed(0)}%) Warning</span>
              <span>{processStats.unable} ({((processStats.unable / processes.length) * 100).toFixed(0)}%) Unable</span>
            </div>

            <HealthBar data={processStats} />

            <div style={{ marginTop: '2rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Process</th>
                    <th>Status</th>
                    <th>Add to Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((process) => (
                    <tr key={process.name}>
                      <td>{process.name}</td>
                      <td>
                        <span className={`status-badge status-${process.status}`}>
                          {statusToLabel(process.status)}
                        </span>
                      </td>
                      <td>{process.addToEngagement ? '✓' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* By Outcome View */}
        {activeView === 'by-outcome' && (
          <section>
            <h2 style={{ marginBottom: '1.5rem' }}>by GTM Outcome</h2>
            <p style={{ color: '#666' }}>
              Process health grouped by desired GTM outcome (Increase Pipeline, Improve Sales Data, etc.)
            </p>
            <div className="card" style={{ marginTop: '1rem', padding: '2rem', textAlign: 'center' }}>
              <p>Outcome-based grouping coming soon.</p>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                This view will show the same {processes.length} processes grouped by their associated GTM outcomes.
              </p>
            </div>
          </section>
        )}

        {/* By Metric View */}
        {activeView === 'by-metric' && (
          <section>
            <h2 style={{ marginBottom: '1.5rem' }}>by GTM Metric (Power10)</h2>
            <p style={{ color: '#666' }}>
              Process health grouped by which Power10 metric they impact.
            </p>
            <div className="card" style={{ marginTop: '1rem', padding: '2rem', textAlign: 'center' }}>
              <p>Metric-based grouping coming soon.</p>
            </div>
          </section>
        )}

        {/* By Function View */}
        {activeView === 'by-function' && (
          <section>
            <h2 style={{ marginBottom: '1.5rem' }}>by Function</h2>
            {['Cross Functional', 'Marketing', 'Sales', 'Customer Success', 'Partnerships'].map((func) => (
              <div key={func} className="card" style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{func}</h3>
                <p style={{ color: '#666' }}>Process items for {func} function</p>
              </div>
            ))}
          </section>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Link href="/try-leanscale" className="btn" style={{ background: 'var(--ls-light-gray)' }}>
            ← Go Back
          </Link>
          <Link href="/try-leanscale/engagement" className="btn btn-primary">
            Next up: Engagement Overview →
          </Link>
        </div>
      </div>
    </Layout>
  );
}
