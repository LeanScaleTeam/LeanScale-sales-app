import { useState } from 'react';
import Layout from '../../components/Layout';

const projects = [
  { id: 1, name: 'Market Map', status: 'Available', icon: '🗺️' },
  { id: 2, name: 'Automated Inbound Enrichment', status: 'Available', icon: '🚀' },
  { id: 3, name: 'Automated Outbound Outreach', status: 'Available', icon: '📤' },
  { id: 4, name: 'Custom Enrichment Signals', status: 'Available', icon: '🧩', badge: 'Clay' },
  { id: 5, name: 'CRM Migration', status: 'Available', icon: '🏠' },
  { id: 6, name: 'Quote-to-Cash', status: 'Available', icon: '💰' },
  { id: 7, name: 'Lead Attribution Rebuild', status: 'Coming Q1 2026', icon: '🔍' },
  { id: 8, name: 'Lead Routing Rebuild', status: 'Coming Q1 2026', icon: '🛤️' },
];

export default function OneTimeProjects() {
  const [expandedProject, setExpandedProject] = useState(null);

  return (
    <Layout title="One-Time Projects">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>📋</span> One-Time Projects
          </h1>
          <p className="page-subtitle">3 Months, $45,000 Each</p>
        </div>

        <div className="card-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="card"
              style={{ cursor: 'pointer' }}
              onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{project.icon}</div>
              <h3 className="card-title">{project.name}</h3>
              <div style={{ marginTop: '0.5rem' }}>
                <span
                  className={`status-badge ${project.status === 'Available' ? 'status-healthy' : 'status-careful'}`}
                >
                  {project.status}
                </span>
                {project.badge && (
                  <span
                    style={{
                      marginLeft: '0.5rem',
                      background: '#7c3aed',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                    }}
                  >
                    {project.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Expanded Project Detail */}
        {expandedProject && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <h2>{projects.find((p) => p.id === expandedProject)?.name}</h2>
            <h4 style={{ marginTop: '1rem', color: '#666' }}>Project Overview</h4>
            <p style={{ marginTop: '0.5rem', lineHeight: 1.7 }}>
              This is a 3-month engagement where LeanScale will work with your team to implement
              and optimize this capability within your GTM stack. Includes discovery, design,
              implementation, testing, and training.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <strong>Deliverables:</strong>
              <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
                <li>Discovery and requirements documentation</li>
                <li>Solution architecture and design</li>
                <li>Full implementation and configuration</li>
                <li>Testing and quality assurance</li>
                <li>Team training and documentation</li>
                <li>30-day post-launch support</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
