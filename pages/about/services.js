import { useState, useMemo } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useCustomer } from '../../context/CustomerContext';
import {
  strategicProjects,
  managedServices,
  playbooks,
  functionLabels,
  categoryLabels
} from '../../data/services-catalog';

const strategicCount = Object.values(strategicProjects).flat().length;
const managedCount = Object.values(managedServices).flat().length;
const allServicesCount = strategicCount + managedCount;

const tabs = [
  { id: 'strategic', label: 'One-Time Projects', count: strategicCount },
  { id: 'managed', label: 'Managed Services', count: managedCount },
];

const functionOptions = ['all', 'crossFunctional', 'marketing', 'sales', 'customerSuccess', 'partnerships'];

export default function ServicesCatalog() {
  const { customer, customerPath } = useCustomer();
  const diagnosticType = customer.diagnosticType || 'gtm';
  const diagnosticHref = customer.hasDiagnosticResult
    ? `/diagnostic/${diagnosticType}`
    : '/diagnostic/start';
  const [activeTab, setActiveTab] = useState('strategic');
  const [functionFilter, setFunctionFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getServicesForTab = (tab) => {
    switch (tab) {
      case 'strategic':
        return strategicProjects;
      case 'managed':
        return managedServices;
      default:
        return {};
    }
  };

  const filteredServices = useMemo(() => {
    const services = getServicesForTab(activeTab);

    let result = [];
    const functionsToShow = functionFilter === 'all'
      ? Object.keys(services)
      : [functionFilter];

    functionsToShow.forEach(fn => {
      if (services[fn]) {
        const filtered = services[fn].filter(service =>
          searchQuery === '' ||
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (service.vendor && service.vendor.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        if (filtered.length > 0) {
          result.push({ function: fn, services: filtered });
        }
      }
    });

    return result;
  }, [activeTab, functionFilter, searchQuery]);

  const totalCount = useMemo(() => {
    return filteredServices.reduce((sum, group) => sum + group.services.length, 0);
  }, [filteredServices]);

  const getPlaybookForService = (serviceId) => {
    return playbooks.find(p => p.id === serviceId);
  };

  return (
    <Layout title="Services Catalog">
      {/* ── Dark Gradient Hero ── */}
      <section style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        padding: 'clamp(3rem, 8vw, 6rem) 1.5rem clamp(2.5rem, 6vw, 4rem)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '9999px',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 500,
            backdropFilter: 'blur(8px)',
          }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#a3e635',
              boxShadow: '0 0 6px rgba(163,230,53,0.5)',
            }} />
            {allServicesCount} Services Available
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 1rem',
            color: '#ffffff',
            letterSpacing: '-0.02em',
          }}>
            Services{' '}
            <span style={{ color: '#a3e635' }}>Catalog</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 600,
            margin: '0 auto',
          }}>
            Browse Strategic Projects, Managed Services, and Tool Implementations —
            find the right solution for your GTM operations.
          </p>
        </div>
      </section>

      {/* ── Main Content on White ── */}
      <div style={{ background: '#fff', padding: '0 1.5rem 4rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '1.5rem 0 1.25rem',
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setFunctionFilter('all');
                }}
                style={{
                  padding: '0.6rem 1.25rem',
                  border: 'none',
                  background: activeTab === tab.id ? '#1a0a2e' : '#f3f4f6',
                  color: activeTab === tab.id ? '#ffffff' : '#4b5563',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  borderRadius: '9999px',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab.label}
                <span style={{
                  marginLeft: '0.5rem',
                  padding: '0.1rem 0.5rem',
                  background: activeTab === tab.id ? 'rgba(163,230,53,0.2)' : '#e5e7eb',
                  color: activeTab === tab.id ? '#a3e635' : '#6b7280',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Filter Bar */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}>
            <div style={{ flex: 1, minWidth: 250 }}>
              <label style={{
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.4rem',
                color: '#1f2937',
                fontSize: '0.85rem',
              }}>
                Search
              </label>
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            </div>

            <div style={{ minWidth: 200 }}>
              <label style={{
                fontWeight: 600,
                display: 'block',
                marginBottom: '0.4rem',
                color: '#1f2937',
                fontSize: '0.85rem',
              }}>
                Function
              </label>
              <select
                value={functionFilter}
                onChange={(e) => setFunctionFilter(e.target.value)}
                className="form-input"
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  background: '#fff',
                  cursor: 'pointer',
                }}
              >
                <option value="all">All Functions</option>
                {functionOptions.slice(1).map((fn) => (
                  <option key={fn} value={fn}>{functionLabels[fn]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Service Groups */}
          <div>
            {filteredServices.map((group) => (
              <div key={group.function} style={{ marginBottom: '2.5rem' }}>
                <h2 style={{
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  color: '#1f2937',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  letterSpacing: '-0.01em',
                }}>
                  <span style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: getFunctionColor(group.function),
                    flexShrink: 0,
                  }}></span>
                  {functionLabels[group.function]}
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    color: '#9ca3af',
                    marginLeft: '0.15rem',
                  }}>
                    ({group.services.length})
                  </span>
                </h2>

                <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))' }}>
                  {group.services.map((service) => {
                    const playbook = service.hasPlaybook ? getPlaybookForService(service.id) : null;

                    return (
                      <div key={service.id} style={{
                        padding: '1.25rem',
                        position: 'relative',
                        background: '#ffffff',
                        border: '1px solid #f0f0f0',
                        borderRadius: '12px',
                        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                        cursor: 'default',
                      }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
                          e.currentTarget.style.borderColor = '#e0e0e0';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.borderColor = '#f0f0f0';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{service.icon}</span>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 650, lineHeight: 1.3, color: '#111827' }}>
                              {service.name}
                            </h3>

                            {service.description && (
                              <p style={{
                                margin: '0.5rem 0 0 0',
                                color: '#6b7280',
                                fontSize: '0.8rem',
                                lineHeight: 1.5,
                              }}>
                                {service.description}
                              </p>
                            )}

                            {playbook && (
                              <Link
                                href={`/playbooks/${playbook.id}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  marginTop: '0.6rem',
                                  padding: '0.25rem 0.6rem',
                                  background: '#f0fdf4',
                                  color: '#15803d',
                                  borderRadius: '6px',
                                  fontSize: '0.7rem',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  border: '1px solid #dcfce7',
                                  transition: 'background 0.15s',
                                }}
                              >
                                📖 View Playbook
                              </Link>
                            )}
                          </div>
                        </div>

                        {service.hasPlaybook && (
                          <div style={{
                            position: 'absolute',
                            top: '0.6rem',
                            right: '0.6rem',
                            width: 7,
                            height: 7,
                            borderRadius: '50%',
                            background: '#a3e635',
                            boxShadow: '0 0 4px rgba(163,230,53,0.4)',
                          }} title="Has detailed playbook"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Result count */}
          <p style={{ marginTop: '1rem', color: '#9ca3af', textAlign: 'center', fontSize: '0.9rem' }}>
            Showing {totalCount} services
          </p>

          {/* ── Dark Gradient Footer CTA ── */}
          <div style={{
            marginTop: '3rem',
            padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 4vw, 3rem)',
            background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
            borderRadius: '16px',
            textAlign: 'center',
            color: '#ffffff',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Subtle glow accent */}
            <div style={{
              position: 'absolute',
              top: '-30%',
              right: '-10%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(ellipse, rgba(163,230,53,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)', fontWeight: 700 }}>
                Not sure where to <span style={{ color: '#a3e635' }}>start</span>?
              </h3>
              <p style={{ margin: '0 0 1.25rem 0', color: 'rgba(255,255,255,0.6)', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
                Take our GTM Diagnostic to identify which services will have the biggest impact on your revenue operations.
              </p>
              <Link
                href={customerPath(diagnosticHref)}
                style={{
                  display: 'inline-block',
                  padding: '0.7rem 1.75rem',
                  background: '#a3e635',
                  color: '#0a0118',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  boxShadow: '0 0 20px rgba(163,230,53,0.25)',
                }}
              >
                {customer.hasDiagnosticResult ? 'View Diagnostic' : 'Start Diagnostic'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function getFunctionColor(fn) {
  const colors = {
    crossFunctional: '#3b82f6',
    marketing: '#10b981',
    sales: '#f59e0b',
    customerSuccess: '#ec4899',
    partnerships: '#8b5cf6',
  };
  return colors[fn] || '#6b7280';
}
