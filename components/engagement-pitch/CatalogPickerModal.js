import { useState, useEffect, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { strategicProjects, managedServices as managedServicesCatalog, functionLabels } from '../../data/services-catalog';

const PHASE_IDS = ['stabilize', 'activate', 'optimize', 'scale'];
const PHASE_LABELS = { stabilize: 'Stabilize', activate: 'Activate', optimize: 'Optimize', scale: 'Scale' };

const FUNCTION_TABS = [
  { id: 'all', label: 'All' },
  { id: 'crossFunctional', label: 'Cross Functional' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'sales', label: 'Sales' },
  { id: 'customerSuccess', label: 'CS' },
  { id: 'partnerships', label: 'Partnerships' },
];

/**
 * CatalogPickerModal — search/browse the services catalog and add items
 * to a specific roadmap phase (projects mode) or to managed services (services mode).
 */
export default function CatalogPickerModal({
  open,
  onClose,
  mode = 'projects',       // 'projects' | 'services'
  defaultPhase = 'activate',
  overrides,
  onOverride,
  currentItems = [],       // current managed services (services mode)
  phases = [],             // current roadmap phases (projects mode)
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedPhase, setSelectedPhase] = useState(defaultPhase);

  // Reset state when modal opens or defaultPhase changes
  useEffect(() => {
    if (open) {
      setSelectedPhase(defaultPhase);
      setSearch('');
      setActiveTab('all');
    }
  }, [open, defaultPhase]);

  const catalogSource = mode === 'projects' ? strategicProjects : managedServicesCatalog;

  const allCatalogItems = useMemo(() => {
    const result = [];
    for (const [catKey, items] of Object.entries(catalogSource)) {
      const fn = functionLabels[catKey] || 'Cross Functional';
      for (const item of items) {
        result.push({ ...item, catKey, primaryFunction: fn });
      }
    }
    return result;
  }, [catalogSource]);

  const filteredItems = useMemo(() => {
    return allCatalogItems.filter(item => {
      if (activeTab !== 'all' && item.catKey !== activeTab) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!item.name.toLowerCase().includes(s) && !(item.description || '').toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [allCatalogItems, activeTab, search]);

  function isIncluded(serviceId) {
    if (mode === 'projects') {
      return phases.some(p => (p.projects || []).some(pr => pr.serviceId === serviceId));
    }
    return currentItems.some(ms => ms.serviceId === serviceId);
  }

  function handleAdd(serviceId) {
    if (mode === 'projects') {
      onOverride('roadmap', serviceId, { included: true, phase: selectedPhase, priority: 'optional', excluded: false });
    } else {
      onOverride('roadmap', serviceId, { included: true, excluded: false });
    }
  }

  function handleRemove(serviceId) {
    onOverride('roadmap', serviceId, { excluded: true, included: false });
  }

  // Right panel: projects in selected phase, or all current managed services
  const rightItems = mode === 'projects'
    ? ((phases.find(p => p.id === selectedPhase)?.projects || []).filter(p => p.type !== 'managed'))
    : currentItems;

  return (
    <Dialog.Root open={open} onOpenChange={o => { if (!o) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="diagnostic-modal-overlay" />
        <Dialog.Content className="catalog-picker-content">

          {/* Header */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)',
            flexShrink: 0,
          }}>
            <Dialog.Title style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
              {mode === 'projects' ? 'Add Project to Roadmap' : 'Add Managed Service'}
            </Dialog.Title>
            <Dialog.Close style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: '0.2rem',
            }}>
              ✕
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="catalog-picker-body">

            {/* Left: catalog browser */}
            <div className="catalog-picker-left">

              {/* Phase selector (projects mode only) */}
              {mode === 'projects' && (
                <div style={{ padding: '0.7rem 1rem 0.1rem', display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  {PHASE_IDS.map(pid => (
                    <button
                      key={pid}
                      onClick={() => setSelectedPhase(pid)}
                      style={{
                        padding: '0.22rem 0.6rem', borderRadius: 6, fontSize: '0.7rem',
                        fontWeight: 600, cursor: 'pointer', border: '1px solid',
                        background: selectedPhase === pid ? 'rgba(124,58,237,0.18)' : 'transparent',
                        borderColor: selectedPhase === pid ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.1)',
                        color: selectedPhase === pid ? '#c4b5fd' : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {PHASE_LABELS[pid]}
                    </button>
                  ))}
                </div>
              )}

              {/* Function tabs */}
              <div style={{
                padding: '0.5rem 1rem 0', display: 'flex', gap: '0.15rem',
                borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
              }}>
                {FUNCTION_TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '0.28rem 0.6rem 0.38rem', border: 'none',
                      fontSize: '0.67rem', fontWeight: 600, cursor: 'pointer',
                      background: 'transparent',
                      color: activeTab === tab.id ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
                      borderBottom: `2px solid ${activeTab === tab.id ? 'rgba(124,58,237,0.7)' : 'transparent'}`,
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div style={{ padding: '0.6rem 1rem 0.4rem', flexShrink: 0 }}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: '100%', padding: '0.4rem 0.75rem', borderRadius: 7,
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.8)', fontSize: '0.76rem', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Item list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '0 0.75rem 1rem' }}>
                {filteredItems.length === 0 && (
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem', textAlign: 'center', paddingTop: '1.5rem' }}>
                    No items found
                  </p>
                )}
                {filteredItems.map(item => {
                  const included = isIncluded(item.id);
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.55rem',
                        padding: '0.5rem 0.6rem', borderRadius: 8, marginBottom: '0.3rem',
                        border: '1px solid',
                        borderColor: included ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.06)',
                        background: included ? 'rgba(124,58,237,0.06)' : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon || '📋'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.3 }}>
                          {item.name}
                        </div>
                        <div style={{
                          fontSize: '0.67rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.3,
                          marginTop: '0.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {item.description}
                        </div>
                      </div>
                      <button
                        onClick={() => included ? handleRemove(item.id) : handleAdd(item.id)}
                        style={{
                          padding: '0.18rem 0.5rem', borderRadius: 5, fontSize: '0.67rem',
                          fontWeight: 600, cursor: 'pointer', border: '1px solid', flexShrink: 0,
                          background: included ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.05)',
                          borderColor: included ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.15)',
                          color: included ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                        }}
                      >
                        {included ? '✓ Added' : '+ Add'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: current items in selected phase / managed services */}
            <div className="catalog-picker-right">
              <div style={{
                fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.07em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '0.65rem',
              }}>
                {mode === 'projects' ? `${PHASE_LABELS[selectedPhase]} Phase` : 'Managed Services'}
              </div>
              {rightItems.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.7rem', textAlign: 'center', marginTop: '1.5rem', lineHeight: 1.4 }}>
                  Nothing here yet
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {rightItems.map(item => (
                    <div key={item.serviceId || item.id} style={{
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                      padding: '0.4rem 0.55rem', borderRadius: 7,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}>
                      <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{item.icon || '📋'}</span>
                      <span style={{
                        flex: 1, fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {item.name}
                      </span>
                      <button
                        onClick={() => handleRemove(item.serviceId || item.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem',
                          padding: '0.1rem', flexShrink: 0, lineHeight: 1,
                        }}
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
