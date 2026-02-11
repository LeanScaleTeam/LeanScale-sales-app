/**
 * ScopeBuilderMode — Integrated diagnostic-to-SOW scope builder
 *
 * Triggered by "Build Scope" button on the diagnostic page.
 * Splits screen: left = diagnostic items (compact), right = scope being built.
 * Drag items from diagnostic list to scope panel. Auto-groups by function.
 */

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useCustomer } from '../../context/CustomerContext';
import DiagnosticItemCard, { estimateHours } from './DiagnosticItemCard';
import ScopePanel from './ScopePanel';

export default function ScopeBuilderMode({
  processes,
  diagnosticResultId,
  diagnosticType,
  onClose,
}) {
  const router = useRouter();
  const { customer, customerPath } = useCustomer();

  // Sections: array of { title, items: [{ name, function, status, hours, serviceId }] }
  const [sections, setSections] = useState([]);
  const [finalizing, setFinalizing] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Track which items are in scope
  const scopedItemNames = useMemo(() => {
    const names = new Set();
    sections.forEach(s => s.items.forEach(i => names.add(i.name)));
    return names;
  }, [sections]);

  // Filtered items for the left panel
  const filteredProcesses = useMemo(() => {
    return processes.filter(p => {
      if (searchFilter && !p.name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      return true;
    });
  }, [processes, searchFilter, statusFilter]);

  // Drop handler: add item to scope, grouped by function
  const handleDropItem = useCallback((itemData) => {
    if (scopedItemNames.has(itemData.name)) return;

    const groupTitle = itemData.function || 'General';

    setSections(prev => {
      const existing = prev.find(s => s.title === groupTitle);
      if (existing) {
        // Don't add duplicates
        if (existing.items.some(i => i.name === itemData.name)) return prev;
        return prev.map(s =>
          s.title === groupTitle
            ? { ...s, items: [...s.items, itemData] }
            : s
        );
      }
      return [...prev, { title: groupTitle, items: [itemData] }];
    });
  }, [scopedItemNames]);

  // Toggle item in/out of scope (click handler)
  const handleToggleScope = useCallback((itemName) => {
    if (scopedItemNames.has(itemName)) {
      // Remove from whatever section it's in
      setSections(prev =>
        prev
          .map(s => ({ ...s, items: s.items.filter(i => i.name !== itemName) }))
          .filter(s => s.items.length > 0)
      );
    } else {
      // Add to scope
      const process = processes.find(p => p.name === itemName);
      if (!process) return;
      const itemData = {
        name: process.name,
        function: process.function || process.category || 'Other',
        status: process.status,
        hours: estimateHours(process),
        serviceId: process.serviceId || null,
      };
      handleDropItem(itemData);
    }
  }, [scopedItemNames, processes, handleDropItem]);

  // Remove item from a specific section
  const handleRemoveItem = useCallback((sectionTitle, itemName) => {
    setSections(prev =>
      prev
        .map(s =>
          s.title === sectionTitle
            ? { ...s, items: s.items.filter(i => i.name !== itemName) }
            : s
        )
        .filter(s => s.items.length > 0)
    );
  }, []);

  // Group similar: auto-group all non-scoped priority items by function
  const handleGroupSimilar = useCallback(() => {
    const priorityItems = processes.filter(
      p => !scopedItemNames.has(p.name) && (p.status === 'warning' || p.status === 'unable' || p.addToEngagement)
    );

    if (priorityItems.length === 0) return;

    const groups = {};
    priorityItems.forEach(p => {
      const fn = p.function || p.category || 'General';
      if (!groups[fn]) groups[fn] = [];
      groups[fn].push({
        name: p.name,
        function: fn,
        status: p.status,
        hours: estimateHours(p),
        serviceId: p.serviceId || null,
      });
    });

    setSections(prev => {
      const updated = [...prev];
      Object.entries(groups).forEach(([title, items]) => {
        const existing = updated.find(s => s.title === title);
        if (existing) {
          const newItems = items.filter(i => !existing.items.some(e => e.name === i.name));
          existing.items = [...existing.items, ...newItems];
        } else {
          updated.push({ title, items });
        }
      });
      return updated;
    });
  }, [processes, scopedItemNames]);

  // Finalize: create SOW from scope
  const handleFinalizeSOW = useCallback(async () => {
    if (!customer?.id || !diagnosticResultId) return;
    setFinalizing(true);

    try {
      const res = await fetch('/api/sow/from-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer.id,
          diagnosticResultId,
          diagnosticType,
          customerName: customer.customerName,
          sowType: diagnosticType === 'clay' ? 'clay' : diagnosticType === 'cpq' ? 'q2c' : 'custom',
          createdBy: 'scope-builder',
          scopeSections: sections.map((s, idx) => ({
            title: s.title + ' — GTM Operations',
            diagnosticItems: s.items.map(i => i.name),
            sortOrder: idx,
          })),
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.id) {
        router.push(customerPath(`/sow/${json.data.id}/build`));
      }
    } catch (err) {
      console.error('Error creating SOW from scope builder:', err);
    } finally {
      setFinalizing(false);
    }
  }, [customer, diagnosticResultId, diagnosticType, sections, router, customerPath]);

  const priorityCount = processes.filter(
    p => !scopedItemNames.has(p.name) && (p.status === 'warning' || p.status === 'unable' || p.addToEngagement)
  ).length;

  return (
    <div className="scope-builder-overlay">
      {/* Top bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'var(--space-3) var(--space-4)',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        color: 'white',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <span style={{ fontSize: 'var(--text-lg)' }}>🔧</span>
          <div>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', margin: 0 }}>
              Scope Builder
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: '#c4b5fd', margin: 0 }}>
              Drag diagnostic items to build your SOW scope
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          {priorityCount > 0 && (
            <button
              onClick={handleGroupSimilar}
              style={{
                padding: 'var(--space-1) var(--space-3)',
                background: 'rgba(255,255,255,0.15)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-medium)',
                cursor: 'pointer',
              }}
            >
              ⚡ Auto-add {priorityCount} priority items
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              padding: 'var(--space-1) var(--space-3)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
            }}
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* Split panel layout */}
      <div className="scope-builder-panels">
        {/* Left: Diagnostic items */}
        <div className="scope-builder-left">
          {/* Filter bar */}
          <div style={{
            display: 'flex',
            gap: 'var(--space-2)',
            marginBottom: 'var(--space-3)',
          }}>
            <input
              type="text"
              placeholder="Search items…"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                flex: 1,
                padding: 'var(--space-2) var(--space-3)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
              }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: 'var(--space-2)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                background: 'var(--bg-white)',
              }}
            >
              <option value="all">All Status</option>
              <option value="warning">Warning</option>
              <option value="unable">Unable</option>
              <option value="careful">Careful</option>
              <option value="healthy">Healthy</option>
            </select>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
            {filteredProcesses.length} items · Click or drag to add to scope
          </div>

          {/* Item list */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 320px)',
          }}>
            {filteredProcesses.map((item) => (
              <DiagnosticItemCard
                key={item.name}
                item={item}
                isInScope={scopedItemNames.has(item.name)}
                onToggleScope={handleToggleScope}
              />
            ))}
          </div>
        </div>

        {/* Right: Scope panel */}
        <div className="scope-builder-right">
          <ScopePanel
            sections={sections}
            onDropItem={handleDropItem}
            onRemoveItem={handleRemoveItem}
            onFinalizeSOW={handleFinalizeSOW}
            finalizing={finalizing}
          />
        </div>
      </div>
    </div>
  );
}
