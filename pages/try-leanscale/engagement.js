import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { processes, statusToLabel } from '../../data/diagnostic-data';

// Sample engagement projects (filtered from processes where addToEngagement is true)
const engagementProjects = processes
  .filter((p) => p.addToEngagement)
  .map((p, i) => ({
    ...p,
    function: ['Cross Functional', 'Marketing', 'Sales', 'Customer Success', 'Partnerships'][i % 5],
    lowHours: 20 + (i * 5),
    highHours: 40 + (i * 8),
    gtmOutcome: ['Increase Pipeline', 'Improve Sales Data', 'Increase MQL to SQL', 'Reduce Churn', 'Foundational'][i % 5],
    startDate: `2026-0${2 + Math.floor(i / 4)}-01`,
    endDate: `2026-0${3 + Math.floor(i / 4)}-15`,
  }));

const functionColors = {
  'Cross Functional': '#e0e7ff',
  'Marketing': '#dcfce7',
  'Sales': '#fef3c7',
  'Customer Success': '#fce7f3',
  'Partnerships': '#dbeafe',
};

export default function EngagementOverview() {
  const [selectedProjects, setSelectedProjects] = useState(
    engagementProjects.reduce((acc, p) => ({ ...acc, [p.name]: true }), {})
  );

  const toggleProject = (name) => {
    setSelectedProjects({ ...selectedProjects, [name]: !selectedProjects[name] });
  };

  const totalLowHours = engagementProjects
    .filter((p) => selectedProjects[p.name])
    .reduce((sum, p) => sum + p.lowHours, 0);

  const totalHighHours = engagementProjects
    .filter((p) => selectedProjects[p.name])
    .reduce((sum, p) => sum + p.highHours, 0);

  return (
    <Layout title="Engagement Overview">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>📋</span> Engagement Overview
          </h1>
          <p className="page-subtitle">Recommended Projects for 2026</p>
        </div>

        {/* Summary */}
        <div className="card" style={{ marginBottom: '2rem', display: 'flex', gap: '2rem' }}>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Selected Projects</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>
              {Object.values(selectedProjects).filter(Boolean).length}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Estimated Hours (Low)</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalLowHours}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>Estimated Hours (High)</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>{totalHighHours}</div>
          </div>
        </div>

        {/* Roadmap View */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Roadmap</h2>
          <div className="card" style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', gap: '1rem', minWidth: 800 }}>
              {/* Month Headers */}
              {['Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026'].map((month) => (
                <div key={month} style={{ flex: 1, textAlign: 'center', fontWeight: 500, padding: '0.5rem' }}>
                  {month}
                </div>
              ))}
            </div>

            {/* Project Bars */}
            {engagementProjects
              .filter((p) => selectedProjects[p.name])
              .map((project) => (
                <div
                  key={project.name}
                  style={{
                    margin: '0.5rem 0',
                    padding: '0.5rem 1rem',
                    background: functionColors[project.function],
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                  }}
                >
                  {project.name}
                </div>
              ))}
          </div>
        </section>

        {/* Engagement Details Table */}
        <section>
          <h2 style={{ marginBottom: '1rem' }}>Engagement Details</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Add</th>
                  <th>Function</th>
                  <th>Diagnostic Name</th>
                  <th>Health Status</th>
                  <th>Low Hours</th>
                  <th>High Hours</th>
                  <th>GTM Outcome</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {engagementProjects.map((project) => (
                  <tr key={project.name}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedProjects[project.name]}
                        onChange={() => toggleProject(project.name)}
                      />
                    </td>
                    <td>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: functionColors[project.function],
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                      }}>
                        {project.function}
                      </span>
                    </td>
                    <td>{project.name}</td>
                    <td>
                      <span className={`status-badge status-${project.status}`}>
                        {statusToLabel(project.status)}
                      </span>
                    </td>
                    <td>{project.lowHours}</td>
                    <td>{project.highHours}</td>
                    <td style={{ fontSize: '0.875rem' }}>{project.gtmOutcome}</td>
                    <td style={{ fontSize: '0.875rem' }}>{project.startDate}</td>
                    <td style={{ fontSize: '0.875rem' }}>{project.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/buy-leanscale/calculator">
            <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
              Continue to Engagement Calculator →
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
