/**
 * TechStackGrid — GTM Tech Stack Scorecard
 *
 * Consultant-facing: auto-detects tools from CRM signals, allows adding
 * tools via search, and setting 3-state status (Adopted/Underutilized/Gap).
 *
 * Customer-facing: clean scorecard grid organized by category showing
 * the full GTM stack with status indicators and gap identification.
 *
 * Props:
 * - computedSignals: object - CRM computed signals for auto-detection
 * - crmType: string - 'salesforce' | 'hubspot' | 'dual'
 * - editMode: boolean - consultant edit mode
 * - overrides: object - saved manual overrides from engagement_overrides
 * - onOverride: function(section, key, value) - save callback
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { staggerContainer, fadeUpItem } from '../../../lib/animations';

// ─── Categories ──────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'crm', label: 'CRM', icon: '●', color: '#3b82f6' },
  { id: 'marketing-automation', label: 'Marketing Automation', icon: '●', color: '#ec4899' },
  { id: 'sales-engagement', label: 'Sales Engagement', icon: '●', color: '#f59e0b' },
  { id: 'conversation-intel', label: 'Conversation Intelligence', icon: '●', color: '#f59e0b' },
  { id: 'forecasting', label: 'Revenue Intelligence & Forecasting', icon: '●', color: '#8b5cf6' },
  { id: 'data-enrichment', label: 'Data Enrichment & Intelligence', icon: '●', color: '#6366f1' },
  { id: 'abm', label: 'Account-Based Marketing', icon: '●', color: '#6366f1' },
  { id: 'cs-platform', label: 'Customer Success', icon: '●', color: '#06b6d4' },
  { id: 'support', label: 'Customer Support & Ticketing', icon: '●', color: '#06b6d4' },
  { id: 'partner', label: 'Partner & Channel Management', icon: '●', color: '#a855f7' },
  { id: 'enablement', label: 'Sales Enablement & Content', icon: '●', color: '#f59e0b' },
  { id: 'cpq-billing', label: 'CPQ, Billing & E-Signature', icon: '●', color: '#3b82f6' },
  { id: 'commission', label: 'Commission Management', icon: '●', color: '#3b82f6' },
  { id: 'bi-analytics', label: 'Business Intelligence', icon: '●', color: '#3b82f6' },
  { id: 'integration', label: 'Integration & Data Infrastructure', icon: '●', color: '#3b82f6' },
  { id: 'product-analytics', label: 'Product Analytics & PLG', icon: '●', color: '#06b6d4' },
];

// ─── Tool Catalog ────────────────────────────────────────────────────────────

const TOOLS = [
  // CRM
  { id: 'salesforce', name: 'Salesforce', category: 'crm', detectFn: (s, crm) => (crm === 'salesforce' || crm === 'dual') ? 'adopted' : null },
  { id: 'hubspot-crm', name: 'HubSpot CRM', category: 'crm', detectFn: (s, crm) => (crm === 'hubspot' || crm === 'dual') ? 'adopted' : null },
  { id: 'dynamics', name: 'Microsoft Dynamics 365', category: 'crm', detectFn: () => null },
  { id: 'pipedrive', name: 'Pipedrive', category: 'crm', detectFn: () => null },
  { id: 'zoho-crm', name: 'Zoho CRM', category: 'crm', detectFn: () => null },

  // Marketing Automation
  { id: 'hubspot-mktg', name: 'HubSpot Marketing', category: 'marketing-automation', detectFn: (s, crm) => (crm === 'hubspot' || crm === 'dual') ? 'adopted' : null },
  { id: 'marketo', name: 'Marketo', category: 'marketing-automation', detectFn: (s) => s.has_marketing_automation_package ? 'adopted' : null },
  { id: 'pardot', name: 'Pardot / Marketing Cloud', category: 'marketing-automation', detectFn: (s) => s.has_marketing_automation_package ? 'adopted' : null },
  { id: 'eloqua', name: 'Eloqua', category: 'marketing-automation', detectFn: (s) => s.has_marketing_automation_package ? 'adopted' : null },
  { id: 'activecampaign', name: 'ActiveCampaign', category: 'marketing-automation', detectFn: () => null },
  { id: 'mailchimp', name: 'Mailchimp', category: 'marketing-automation', detectFn: () => null },
  { id: 'klaviyo', name: 'Klaviyo', category: 'marketing-automation', detectFn: () => null },
  { id: 'braze', name: 'Braze', category: 'marketing-automation', detectFn: () => null },
  { id: 'iterable', name: 'Iterable', category: 'marketing-automation', detectFn: () => null },
  { id: 'customer-io', name: 'Customer.io', category: 'marketing-automation', detectFn: () => null },
  { id: 'brevo', name: 'Brevo', category: 'marketing-automation', detectFn: () => null },

  // Sales Engagement
  { id: 'outreach', name: 'Outreach', category: 'sales-engagement', detectFn: (s) => s.has_sales_engagement_tool ? 'adopted' : null },
  { id: 'salesloft', name: 'SalesLoft', category: 'sales-engagement', detectFn: (s) => s.has_sales_engagement_tool ? 'adopted' : null },
  { id: 'apollo', name: 'Apollo.io', category: 'sales-engagement', detectFn: (s) => { const t = s.enrichment_tools || []; return t.some(x => /apollo/i.test(x.name || x)) ? 'adopted' : null; } },
  { id: 'amplemarket', name: 'Amplemarket', category: 'sales-engagement', detectFn: () => null },
  { id: 'groove', name: 'Groove (Clari)', category: 'sales-engagement', detectFn: () => null },
  { id: 'instantly', name: 'Instantly', category: 'sales-engagement', detectFn: () => null },
  { id: 'mixmax', name: 'Mixmax', category: 'sales-engagement', detectFn: () => null },
  { id: 'reply-io', name: 'Reply.io', category: 'sales-engagement', detectFn: () => null },
  { id: 'lemlist', name: 'Lemlist', category: 'sales-engagement', detectFn: () => null },

  // Conversation Intelligence
  { id: 'gong', name: 'Gong', category: 'conversation-intel', detectFn: (s) => s.has_conversation_intelligence ? 'adopted' : null },
  { id: 'chorus', name: 'Chorus', category: 'conversation-intel', detectFn: (s) => s.has_conversation_intelligence ? 'adopted' : null },
  { id: 'clari-copilot', name: 'Clari Copilot', category: 'conversation-intel', detectFn: () => null },
  { id: 'fireflies', name: 'Fireflies.ai', category: 'conversation-intel', detectFn: () => null },
  { id: 'avoma', name: 'Avoma', category: 'conversation-intel', detectFn: () => null },
  { id: 'jiminny', name: 'Jiminny', category: 'conversation-intel', detectFn: () => null },
  { id: 'otter', name: 'Otter.ai', category: 'conversation-intel', detectFn: () => null },

  // Revenue Intelligence & Forecasting
  { id: 'clari', name: 'Clari', category: 'forecasting', detectFn: (s) => s.has_forecasting_config ? 'adopted' : null },
  { id: 'aviso', name: 'Aviso', category: 'forecasting', detectFn: () => null },
  { id: 'boostup', name: 'BoostUp', category: 'forecasting', detectFn: () => null },
  { id: 'insightsquared', name: 'InsightSquared', category: 'forecasting', detectFn: () => null },
  { id: 'people-ai', name: 'People.ai', category: 'forecasting', detectFn: () => null },
  { id: 'scratchpad', name: 'Scratchpad', category: 'forecasting', detectFn: () => null },
  { id: 'weflow', name: 'Weflow', category: 'forecasting', detectFn: () => null },
  { id: 'ebsta', name: 'Ebsta', category: 'forecasting', detectFn: () => null },

  // Data Enrichment & Intelligence
  { id: 'zoominfo', name: 'ZoomInfo', category: 'data-enrichment', detectFn: (s) => { const t = s.enrichment_tools || []; return t.some(x => /zoominfo|zi_/i.test(x.name || x)) ? 'adopted' : null; } },
  { id: 'clearbit', name: 'Clearbit', category: 'data-enrichment', detectFn: (s) => { const t = s.enrichment_tools || []; return t.some(x => /clearbit/i.test(x.name || x)) ? 'adopted' : null; } },
  { id: 'clay', name: 'Clay', category: 'data-enrichment', detectFn: (s) => { const t = s.enrichment_tools || []; return t.some(x => /clay/i.test(x.name || x)) ? 'adopted' : null; } },
  { id: 'cognism', name: 'Cognism', category: 'data-enrichment', detectFn: (s) => { const t = s.enrichment_tools || []; return t.some(x => /cognism/i.test(x.name || x)) ? 'adopted' : null; } },
  { id: 'lusha', name: 'Lusha', category: 'data-enrichment', detectFn: (s) => { const t = s.enrichment_tools || []; return t.some(x => /lusha/i.test(x.name || x)) ? 'adopted' : null; } },
  { id: 'bombora', name: 'Bombora', category: 'data-enrichment', detectFn: () => null },
  { id: 'leadiq', name: 'LeadIQ', category: 'data-enrichment', detectFn: () => null },
  { id: 'seamless', name: 'Seamless.AI', category: 'data-enrichment', detectFn: () => null },

  // ABM
  { id: '6sense', name: '6sense', category: 'abm', detectFn: (s) => s.has_abm_tool ? 'adopted' : null },
  { id: 'demandbase', name: 'Demandbase', category: 'abm', detectFn: (s) => s.has_abm_tool ? 'adopted' : null },
  { id: 'terminus', name: 'Terminus', category: 'abm', detectFn: (s) => s.has_abm_tool ? 'adopted' : null },
  { id: 'rollworks', name: 'RollWorks', category: 'abm', detectFn: (s) => s.has_abm_tool ? 'adopted' : null },
  { id: 'madison-logic', name: 'Madison Logic', category: 'abm', detectFn: () => null },
  { id: 'metadata-io', name: 'Metadata.io', category: 'abm', detectFn: () => null },
  { id: 'triblio', name: 'Triblio', category: 'abm', detectFn: () => null },

  // Customer Success
  { id: 'gainsight', name: 'Gainsight', category: 'cs-platform', detectFn: (s) => s.has_cs_platform_installed ? 'adopted' : null },
  { id: 'churnzero', name: 'ChurnZero', category: 'cs-platform', detectFn: (s) => s.has_cs_platform_installed ? 'adopted' : null },
  { id: 'vitally', name: 'Vitally', category: 'cs-platform', detectFn: (s) => s.has_cs_platform_installed ? 'adopted' : null },
  { id: 'totango', name: 'Totango', category: 'cs-platform', detectFn: (s) => s.has_cs_platform_installed ? 'adopted' : null },
  { id: 'planhat', name: 'Planhat', category: 'cs-platform', detectFn: (s) => s.has_cs_platform_installed ? 'adopted' : null },
  { id: 'catalyst', name: 'Catalyst', category: 'cs-platform', detectFn: (s) => s.has_cs_platform_installed ? 'adopted' : null },
  { id: 'clientsuccess', name: 'ClientSuccess', category: 'cs-platform', detectFn: () => null },

  // Support & Ticketing
  { id: 'zendesk', name: 'Zendesk', category: 'support', detectFn: (s) => s.has_support_tool ? 'adopted' : null },
  { id: 'intercom', name: 'Intercom', category: 'support', detectFn: (s) => s.has_support_tool ? 'adopted' : null },
  { id: 'freshdesk', name: 'Freshdesk', category: 'support', detectFn: (s) => s.has_support_tool ? 'adopted' : null },
  { id: 'service-cloud', name: 'Salesforce Service Cloud', category: 'support', detectFn: (s, crm) => (crm === 'salesforce' || crm === 'dual') && s.ticket_pipeline_customized ? 'adopted' : null },
  { id: 'helpscout', name: 'Help Scout', category: 'support', detectFn: () => null },
  { id: 'front', name: 'Front', category: 'support', detectFn: () => null },

  // Partner / PRM
  { id: 'partnerstack', name: 'PartnerStack', category: 'partner', detectFn: (s) => s.has_prm_tool ? 'adopted' : null },
  { id: 'crossbeam', name: 'Crossbeam / Reveal', category: 'partner', detectFn: () => null },
  { id: 'impartner', name: 'Impartner', category: 'partner', detectFn: () => null },
  { id: 'impact', name: 'Impact.com', category: 'partner', detectFn: () => null },
  { id: 'allbound', name: 'Allbound', category: 'partner', detectFn: () => null },

  // Sales Enablement
  { id: 'highspot', name: 'Highspot', category: 'enablement', detectFn: (s) => s.has_enablement_platform ? 'adopted' : null },
  { id: 'seismic', name: 'Seismic', category: 'enablement', detectFn: (s) => s.has_enablement_platform ? 'adopted' : null },
  { id: 'showpad', name: 'Showpad', category: 'enablement', detectFn: (s) => s.has_enablement_platform ? 'adopted' : null },
  { id: 'guru', name: 'Guru', category: 'enablement', detectFn: (s) => s.has_enablement_platform ? 'adopted' : null },
  { id: 'mindtickle', name: 'Mindtickle', category: 'enablement', detectFn: (s) => s.has_enablement_platform ? 'adopted' : null },
  { id: 'allego', name: 'Allego', category: 'enablement', detectFn: () => null },
  { id: 'mediafly', name: 'Mediafly', category: 'enablement', detectFn: () => null },

  // CPQ, Billing & E-Signature
  { id: 'sf-cpq', name: 'Salesforce CPQ', category: 'cpq-billing', detectFn: () => null },
  { id: 'dealhub', name: 'DealHub', category: 'cpq-billing', detectFn: () => null },
  { id: 'conga', name: 'Conga', category: 'cpq-billing', detectFn: () => null },
  { id: 'docusign', name: 'DocuSign', category: 'cpq-billing', detectFn: () => null },
  { id: 'pandadoc', name: 'PandaDoc', category: 'cpq-billing', detectFn: () => null },
  { id: 'zuora', name: 'Zuora', category: 'cpq-billing', detectFn: () => null },
  { id: 'chargebee', name: 'Chargebee', category: 'cpq-billing', detectFn: () => null },
  { id: 'stripe-billing', name: 'Stripe Billing', category: 'cpq-billing', detectFn: () => null },
  { id: 'proposify', name: 'Proposify', category: 'cpq-billing', detectFn: () => null },

  // Commission Management
  { id: 'captivateiq', name: 'CaptivateIQ', category: 'commission', detectFn: (s) => s.has_commission_tool ? 'adopted' : null },
  { id: 'spiff', name: 'Spiff', category: 'commission', detectFn: (s) => s.has_commission_tool ? 'adopted' : null },
  { id: 'xactly', name: 'Xactly', category: 'commission', detectFn: (s) => s.has_commission_tool ? 'adopted' : null },
  { id: 'performio', name: 'Performio', category: 'commission', detectFn: (s) => s.has_commission_tool ? 'adopted' : null },
  { id: 'everstage', name: 'Everstage', category: 'commission', detectFn: (s) => s.has_commission_tool ? 'adopted' : null },

  // Business Intelligence
  { id: 'looker', name: 'Looker', category: 'bi-analytics', detectFn: () => null },
  { id: 'tableau', name: 'Tableau', category: 'bi-analytics', detectFn: () => null },
  { id: 'powerbi', name: 'Power BI', category: 'bi-analytics', detectFn: () => null },
  { id: 'domo', name: 'Domo', category: 'bi-analytics', detectFn: () => null },

  // Integration & Data Infrastructure
  { id: 'zapier', name: 'Zapier', category: 'integration', detectFn: () => null },
  { id: 'workato', name: 'Workato', category: 'integration', detectFn: () => null },
  { id: 'make', name: 'Make', category: 'integration', detectFn: () => null },
  { id: 'tray-io', name: 'Tray.io', category: 'integration', detectFn: () => null },
  { id: 'mulesoft', name: 'MuleSoft', category: 'integration', detectFn: () => null },
  { id: 'celigo', name: 'Celigo', category: 'integration', detectFn: () => null },
  { id: 'fivetran', name: 'Fivetran', category: 'integration', detectFn: () => null },
  { id: 'segment', name: 'Segment', category: 'integration', detectFn: () => null },
  { id: 'census', name: 'Census', category: 'integration', detectFn: () => null },
  { id: 'hightouch', name: 'Hightouch', category: 'integration', detectFn: () => null },

  // Product Analytics & PLG
  { id: 'amplitude', name: 'Amplitude', category: 'product-analytics', detectFn: () => null },
  { id: 'mixpanel', name: 'Mixpanel', category: 'product-analytics', detectFn: () => null },
  { id: 'pendo', name: 'Pendo', category: 'product-analytics', detectFn: () => null },
  { id: 'heap', name: 'Heap', category: 'product-analytics', detectFn: () => null },
  { id: 'fullstory', name: 'FullStory', category: 'product-analytics', detectFn: () => null },
  { id: 'posthog', name: 'PostHog', category: 'product-analytics', detectFn: () => null },
  { id: 'appcues', name: 'Appcues', category: 'product-analytics', detectFn: () => null },
  { id: 'launchdarkly', name: 'LaunchDarkly', category: 'product-analytics', detectFn: () => null },

  // Lead Routing (cross-functional but important enough to track)
  { id: 'leandata', name: 'LeanData', category: 'crm', detectFn: () => null },
  { id: 'chili-piper', name: 'Chili Piper', category: 'crm', detectFn: () => null },
];

// ─── Status Config ───────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  adopted:       { dot: '#22c55e', bg: 'rgba(34,197,94,0.08)',  border: '1px solid rgba(34,197,94,0.35)',  label: 'Adopted' },
  underutilized: { dot: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.35)', label: 'Underutilized' },
  gap:           { dot: '#f87171', bg: 'rgba(248,113,113,0.08)', border: '1px dashed rgba(239,68,68,0.4)',  label: 'Gap' },
};

const STATUS_CYCLE = ['adopted', 'underutilized', 'gap'];

// ─── Search Component ────────────────────────────────────────────────────────

function ToolSearch({ onAdd, activeToolIds }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return TOOLS
      .filter(t => !activeToolIds.has(t.id))
      .filter(t => t.name.toLowerCase().includes(q) || CATEGORIES.find(c => c.id === t.category)?.label.toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, activeToolIds]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        transition: 'border-color 0.15s',
        ...(focused ? { borderColor: 'rgba(124,58,237,0.5)' } : {}),
      }}>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>+</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search tools to add..."
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '0.75rem',
            fontFamily: 'inherit',
          }}
        />
      </div>
      <AnimatePresence>
        {focused && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 4,
              background: '#12101e',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '0.25rem',
              zIndex: 100,
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
              maxHeight: 240,
              overflowY: 'auto',
            }}
          >
            {results.map(tool => {
              const cat = CATEGORIES.find(c => c.id === tool.category);
              return (
                <div
                  key={tool.id}
                  onMouseDown={() => { onAdd(tool.id); setQuery(''); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.6rem',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{tool.name}</span>
                  <span style={{ fontSize: '0.6rem', color: cat?.color || 'rgba(255,255,255,0.3)' }}>{cat?.label}</span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Category Row ────────────────────────────────────────────────────────────

function CategoryRow({ category, tools, statuses, editMode, onStatusChange, onRemove }) {
  const hasTools = tools.length > 0;
  const adoptedCount = tools.filter(t => statuses[t.id] === 'adopted').length;
  const underCount = tools.filter(t => statuses[t.id] === 'underutilized').length;
  const gapCount = tools.filter(t => statuses[t.id] === 'gap').length;

  return (
    <motion.div
      variants={fadeUpItem}
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr 100px',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.65rem 0.85rem',
        background: hasTools ? 'rgba(255,255,255,0.02)' : 'transparent',
        border: `1px solid ${hasTools ? 'rgba(255,255,255,0.06)' : 'rgba(239,68,68,0.15)'}`,
        borderRadius: 10,
        transition: 'background 0.15s',
      }}
    >
      {/* Category label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: 4, height: 24, borderRadius: 2, background: category.color, flexShrink: 0 }} />
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.85)',
          letterSpacing: '-0.01em',
        }}>
          {category.label}
        </span>
      </div>

      {/* Tools */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', minHeight: 28 }}>
        {hasTools ? tools.map(tool => {
          const status = statuses[tool.id] || 'adopted';
          const sc = STATUS_CONFIG[status];
          return (
            <Tooltip.Root key={tool.id}>
              <Tooltip.Trigger asChild>
                <div
                  onClick={() => editMode && onStatusChange(tool.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.25rem 0.55rem',
                    borderRadius: 6,
                    background: sc.bg,
                    border: sc.border,
                    cursor: editMode ? 'pointer' : 'default',
                    transition: 'all 0.15s',
                    userSelect: 'none',
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.66rem', fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>
                    {tool.name}
                  </span>
                  {editMode && (
                    <span
                      onClick={(e) => { e.stopPropagation(); onRemove(tool.id); }}
                      style={{
                        fontSize: '0.6rem',
                        color: 'rgba(255,255,255,0.25)',
                        cursor: 'pointer',
                        marginLeft: '0.15rem',
                        lineHeight: 1,
                      }}
                    >
                      x
                    </span>
                  )}
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content side="top" sideOffset={6} style={{ zIndex: 1000 }}>
                  <div style={{
                    background: '#12101e',
                    border: '1px solid rgba(255,255,255,0.14)',
                    borderRadius: 8,
                    padding: '0.5rem 0.65rem',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                  }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{tool.name}</div>
                    <div style={{ fontSize: '0.62rem', color: sc.dot, fontWeight: 600, marginTop: '0.15rem' }}>{sc.label}</div>
                    {editMode && <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>Click to change status</div>}
                  </div>
                  <Tooltip.Arrow style={{ fill: '#12101e' }} />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          );
        }) : (
          <span style={{
            fontSize: '0.65rem',
            color: 'rgba(248,113,113,0.6)',
            fontStyle: 'italic',
            padding: '0.25rem 0',
          }}>
            No tools detected — potential gap
          </span>
        )}
      </div>

      {/* Status summary */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        {adoptedCount > 0 && <MiniStat count={adoptedCount} color="#22c55e" />}
        {underCount > 0 && <MiniStat count={underCount} color="#fbbf24" />}
        {gapCount > 0 && <MiniStat count={gapCount} color="#f87171" />}
        {!hasTools && <MiniStat count="—" color="#f87171" />}
      </div>
    </motion.div>
  );
}

function MiniStat({ count, color }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.2rem',
    }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: '0.6rem', fontWeight: 600, color }}>{count}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function TechStackGrid({
  computedSignals = {},
  crmType = 'salesforce',
  editMode = false,
  overrides = {},
  onOverride,
}) {
  // Merge auto-detected + manual overrides
  const savedTools = overrides?.techStack?.tools || {};

  const { toolStatuses, activeToolIds } = useMemo(() => {
    const statuses = {};

    // Auto-detect from CRM signals
    for (const tool of TOOLS) {
      const detected = tool.detectFn(computedSignals, crmType);
      if (detected) {
        statuses[tool.id] = detected;
      }
    }

    // Apply saved overrides (manual additions + status changes)
    for (const [id, status] of Object.entries(savedTools)) {
      if (status === '__removed') {
        delete statuses[id];
      } else {
        statuses[id] = status;
      }
    }

    return { toolStatuses: statuses, activeToolIds: new Set(Object.keys(statuses)) };
  }, [computedSignals, crmType, savedTools]);

  function handleStatusChange(toolId) {
    const current = toolStatuses[toolId] || 'adopted';
    const idx = STATUS_CYCLE.indexOf(current);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    onOverride?.('techStack', 'tools', { ...savedTools, [toolId]: next });
  }

  function handleAdd(toolId) {
    onOverride?.('techStack', 'tools', { ...savedTools, [toolId]: 'adopted' });
  }

  function handleRemove(toolId) {
    onOverride?.('techStack', 'tools', { ...savedTools, [toolId]: '__removed' });
  }

  // Summary counts
  const totalTools = activeToolIds.size;
  const adoptedCount = Object.values(toolStatuses).filter(s => s === 'adopted').length;
  const underCount = Object.values(toolStatuses).filter(s => s === 'underutilized').length;
  const gapCategories = CATEGORIES.filter(cat => !TOOLS.some(t => t.category === cat.id && activeToolIds.has(t.id))).length;

  return (
    <Tooltip.Provider delayDuration={150}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{
          background: 'rgba(8, 6, 18, 0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16,
          padding: '1.5rem',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <motion.div variants={fadeUpItem} style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', fontWeight: 800, margin: '0 0 0.25rem', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.97)' }}>
              GTM Tech Stack
            </h2>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
              {totalTools} tools across {CATEGORIES.length - gapCategories} categories{underCount > 0 ? ` \u00b7 ${underCount} underutilized` : ''}{gapCategories > 0 ? ` \u00b7 ${gapCategories} gaps` : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Stat value={adoptedCount} label="adopted" color="#86efac" bg="rgba(34,197,94,0.08)" border="rgba(34,197,94,0.2)" />
            {underCount > 0 && (
              <Stat value={underCount} label="underutilized" color="#fde68a" bg="rgba(251,191,36,0.08)" border="rgba(251,191,36,0.2)" />
            )}
            {gapCategories > 0 && (
              <Stat value={gapCategories} label={gapCategories === 1 ? 'gap' : 'gaps'} color="#fca5a5" bg="rgba(239,68,68,0.08)" border="rgba(239,68,68,0.2)" />
            )}
          </div>
        </motion.div>

        {/* Auto-detected banner (edit mode only) */}
        {editMode && (
          <motion.div variants={fadeUpItem} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            background: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.15)',
            borderRadius: 8,
            marginBottom: '0.75rem',
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
              {Object.values(toolStatuses).filter(s => s === 'adopted').length} tools auto-detected from CRM signals.
              Click any tool to change status. Use search below to add missing tools.
            </span>
          </motion.div>
        )}

        {/* Search (edit mode only) */}
        {editMode && (
          <motion.div variants={fadeUpItem} style={{ marginBottom: '1rem' }}>
            <ToolSearch onAdd={handleAdd} activeToolIds={activeToolIds} />
          </motion.div>
        )}

        {/* Category Rows */}
        <motion.div variants={fadeUpItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {CATEGORIES.map(cat => {
            const catTools = TOOLS.filter(t => t.category === cat.id && activeToolIds.has(t.id));
            // In customer view, skip empty categories that are less relevant
            // In edit mode, always show all categories
            if (!editMode && catTools.length === 0) {
              // Still show the gap row
            }
            return (
              <CategoryRow
                key={cat.id}
                category={cat}
                tools={catTools}
                statuses={toolStatuses}
                editMode={editMode}
                onStatusChange={handleStatusChange}
                onRemove={handleRemove}
              />
            );
          })}
        </motion.div>

        {/* Legend */}
        <motion.div variants={fadeUpItem} style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          paddingTop: '0.75rem',
          marginTop: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '0.58rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)', marginRight: '0.25rem' }}>
            Legend
          </span>
          {Object.entries(STATUS_CONFIG).map(([key, sc]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: sc.dot }} />
              <span style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                {sc.label}
              </span>
            </div>
          ))}
          {editMode && (
            <span style={{ fontSize: '0.6rem', color: '#a78bfa', marginLeft: 'auto', fontStyle: 'italic' }}>
              Click any tool to cycle status
            </span>
          )}
        </motion.div>
      </motion.div>
    </Tooltip.Provider>
  );
}

// ─── Stat Pill (matches GTMLandscape pattern) ────────────────────────────────

function Stat({ value, label, color, bg, border }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.3rem 0.7rem',
      borderRadius: 20,
      background: bg,
      border: `1px solid ${border}`,
    }}>
      <span style={{ fontSize: '0.9rem', fontWeight: 700, color, letterSpacing: '-0.01em', lineHeight: 1 }}>{value}</span>
      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>{label}</span>
    </div>
  );
}
