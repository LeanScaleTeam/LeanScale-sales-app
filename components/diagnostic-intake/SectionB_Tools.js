/**
 * Section B: GTM Tools (checklist + per-tool follow-ups)
 */

import { useState } from 'react';

const TOOL_CATEGORIES = [
  { key: 'sales_engagement', label: 'Sales engagement (Outreach, Salesloft, Apollo sequences)' },
  { key: 'conversation_intel', label: 'Conversation intelligence (Gong, Chorus)' },
  { key: 'data_enrichment', label: 'Data enrichment (ZoomInfo, Clearbit, Apollo, Clay, AdvizorPro)' },
  { key: 'csp', label: 'Customer success platform (Gainsight, ChurnZero, Vitally)' },
  { key: 'lead_routing', label: 'Lead routing (LeanData, Chili Piper)' },
  { key: 'esign', label: 'E-signature (DocuSign, PandaDoc, HubSpot e-sign)' },
  { key: 'bi_analytics', label: 'BI/Analytics (Tableau, Looker, Power BI)' },
  { key: 'support', label: 'Support/Ticketing (Zendesk, Intercom, Freshdesk)' },
];

const ADOPTION_OPTIONS = ['Fully adopted by team', 'Partial adoption', 'Just implemented'];

export default function SectionB({ answers, skipRules, preFill = {}, onComplete, onBack }) {
  const [selectedTools, setSelectedTools] = useState(() => {
    const saved = answers.B1_tools || [];
    const savedArr = Array.isArray(saved) ? saved : [];
    const preFilled = preFill.B1_tools?.value || [];
    const merged = [...new Set([...savedArr, ...preFilled])];
    return merged;
  });
  const [overriddenTools, setOverriddenTools] = useState(new Set());
  const [toolDetails, setToolDetails] = useState(() => answers.B2_details || {});

  const toggleTool = (key) => {
    setSelectedTools((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
    setOverriddenTools((prev) => new Set(prev).add(key));
  };

  const setDetail = (toolKey, field, value) => {
    setToolDetails((prev) => ({
      ...prev,
      [toolKey]: { ...prev[toolKey], [field]: value },
    }));
  };

  const handleContinue = () => {
    onComplete({
      B1_tools: selectedTools,
      B2_details: toolDetails,
    });
  };

  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>GTM Tools</h2>
      <p style={styles.sectionDesc}>Which of these tools do you use? (check all that apply)</p>

      <div style={{ marginBottom: '1.5rem' }}>
        {TOOL_CATEGORIES.map((tool) => {
          const isPreFilled = preFill.B1_tools?.value?.includes(tool.key) && !overriddenTools.has(tool.key);
          return (
          <div key={tool.key}>
            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={selectedTools.includes(tool.key)}
                onChange={() => toggleTool(tool.key)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontSize: 'var(--text-sm)' }}>{tool.label}</span>
              {isPreFilled && (
                <span style={styles.autoDetectedBadge}>Auto-detected</span>
              )}
            </label>

            {/* Follow-up: adoption level */}
            {selectedTools.includes(tool.key) && (
              <div style={styles.followUp}>
                <label style={styles.followUpLabel}>Adoption level:</label>
                <div style={styles.optionGrid}>
                  {ADOPTION_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDetail(tool.key, 'adoption', opt)}
                      style={{
                        ...styles.optionBtn,
                        ...(toolDetails[tool.key]?.adoption === opt ? styles.optionSelected : {}),
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <label style={{ ...styles.followUpLabel, marginTop: '0.5rem' }}>Integrated with CRM?</label>
                <div style={styles.optionGrid}>
                  {['Yes', 'Partially', 'No'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setDetail(tool.key, 'integrated', opt)}
                      style={{
                        ...styles.optionBtn,
                        ...(toolDetails[tool.key]?.integrated === opt ? styles.optionSelected : {}),
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          );
        })}
      </div>

      <div style={styles.navRow}>
        <button onClick={onBack} style={styles.backBtn}>Back</button>
        <button onClick={handleContinue} style={styles.continueBtn}>Continue</button>
      </div>
    </div>
  );
}

const styles = {
  section: { marginTop: '1.5rem' },
  sectionTitle: { fontSize: 'var(--text-xl)', fontWeight: 'var(--font-semibold)', marginBottom: '0.25rem' },
  sectionDesc: { color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' },
  checkboxRow: { display: 'flex', alignItems: 'center', padding: '0.5rem 0', cursor: 'pointer' },
  followUp: { marginLeft: '1.5rem', marginBottom: '1rem', padding: '0.75rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md, 8px)' },
  followUpLabel: { display: 'block', fontSize: 'var(--text-xs)', fontWeight: 'var(--font-medium)', marginBottom: '0.25rem', color: 'var(--text-secondary)' },
  optionGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.375rem' },
  optionBtn: { padding: '0.35rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', background: 'white', fontSize: 'var(--text-xs)', cursor: 'pointer' },
  optionSelected: { background: 'var(--ls-purple)', color: 'white', borderColor: 'var(--ls-purple)' },
  navRow: { display: 'flex', gap: '0.75rem', marginTop: '2rem' },
  backBtn: { flex: '0 0 auto', padding: '0.75rem 1.5rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)', cursor: 'pointer' },
  continueBtn: { flex: 1, padding: '0.75rem', background: 'var(--ls-purple)', color: 'white', border: 'none', borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-base)', fontWeight: 'var(--font-semibold)', cursor: 'pointer' },
  autoDetectedBadge: {
    marginLeft: '0.5rem',
    padding: '0.125rem 0.5rem',
    background: '#EFF6FF',
    color: '#1E40AF',
    fontSize: '10px',
    borderRadius: '9999px',
    fontWeight: 'var(--font-medium)',
  },
};
