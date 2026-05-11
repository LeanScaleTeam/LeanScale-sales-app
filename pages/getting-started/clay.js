import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { useCustomer } from '../../context/CustomerContext';

const claybooks = [
  { id: 1, name: 'Market Map', price: 45000, prereqs: 'None', description: 'Builds your complete ICP/TAM database in Clay, enriches every account, scores for fit, assigns tiers, and pushes to CRM.', complexity: 'High', scope: 'Up to 50,000 accounts' },
  { id: 2, name: 'Persona Mapping', price: 6250, prereqs: 'Market Map', description: 'Adds contact-level enrichment to your Market Map. Identifies key personas, enriches contacts, scores for relevance.', complexity: 'Medium', scope: 'Up to 100,000 contacts' },
  { id: 3, name: 'Automated Inbound Enrichment', price: 6875, prereqs: 'Market Map recommended', description: 'Enriches inbound leads in real-time. Filters junk, deduplicates, scores, tiers, and routes.', complexity: 'Medium', scope: 'Unlimited inbound volume' },
  { id: 4, name: 'Automated Outbound', price: 7500, prereqs: 'Market Map', description: 'Builds targeted outbound lists, enriches contacts, personalizes at scale, pushes to sales engagement platform.', complexity: 'Medium-High', scope: 'Up to 10,000 contacts/month' },
  { id: 5, name: 'Lead Scoring', price: 5000, prereqs: 'ICP definition', description: 'ICP-driven lead scoring combining firmographic fit with enriched data signals, syncs to CRM/MAP.', complexity: 'Medium', scope: 'Inbound and existing database' },
  { id: 6, name: 'ABM Target Account Enrichment', price: 7500, prereqs: 'Named account list', description: 'Deep enrichment for named accounts, buying committee mapping, intent signals, ABM-ready segments.', complexity: 'Medium-High', scope: 'Up to 500 named accounts' },
  { id: 7, name: 'CRM Data Cleanup', price: 4375, prereqs: 'CRM access', description: 'Enriches and standardizes existing CRM data. Fills gaps, corrects errors, normalizes fields.', complexity: 'Low-Medium', scope: 'Up to 25,000 records' },
  { id: 8, name: 'Customer Segmentation', price: 6250, prereqs: 'Customer list', description: 'Enriches customer base for CS coverage models, expansion targeting, and retention analysis.', complexity: 'Medium', scope: 'Up to 10,000 customers' },
  { id: 9, name: 'Event Lead Enrichment', price: 3125, prereqs: 'ICP definition', description: 'Enriches event leads, scores against ICP, deduplicates, routes hot leads for follow-up.', complexity: 'Low-Medium', scope: 'Up to 5,000 leads per event' },
  { id: 10, name: 'Signal-Based Prospecting', price: 8750, prereqs: 'Market Map', description: 'Monitors intent signals across your TAM and surfaces accounts showing buying signals.', complexity: 'High', scope: 'Up to 25,000 accounts' },
];

const bundles = [
  { name: 'GTM Foundation Bundle', price: 23000, savings: 2625, includes: ['Market Map', 'Persona Mapping', 'Automated Inbound Enrichment'] },
  { name: 'Full Outbound Stack Bundle', price: 30000, savings: 5000, includes: ['Market Map', 'Persona Mapping', 'Automated Outbound', 'Signal-Based Prospecting'] },
  { name: 'Complete GTM Infrastructure', price: 55000, savings: 13125, includes: ['All 10 Claybooks', 'Unified architecture', 'Cross-table deduplication', 'Priority 8-week delivery'] },
];

const stats = [
  { value: '$5.45B+', label: 'Capital Raised by Clients' },
  { value: '395K+', label: 'YouTube Subscribers' },
  { value: '200+', label: 'B2B Projects Executed' },
];

const useCases = [
  {
    number: '01',
    tag: 'THE FOUNDATION',
    title: 'Market Map',
    description: 'The foundation every other Clay use case is built on. Preload and enrich your CRM with every account from your TAM, all contacts, their propensity to buy, and potential revenue.',
    benefits: ['Better territory design', 'Higher marketing conversion rates', 'Smarter credit management', 'Cleaner lead routing'],
  },
  {
    number: '02',
    tag: 'THE ACTIVATION',
    title: 'Automated Outbound',
    description: "Clay's AI agent monitors for buying signals and enriches target accounts. High-precision, signal-based outbound focused on highest probability opportunities.",
    benefits: ['Job changes monitoring', 'Funding rounds detection', 'Product launches tracking', 'News events signals'],
  },
  {
    number: '03',
    tag: 'THE ACCELERATION',
    title: 'Real-Time Inbound Enrichment',
    description: 'For every web form submission, seconds later, Clay runs enrichment evaluation against your market map. If it\'s a good fit, Clay adds, enriches, scores, and guides routing automatically.',
    benefits: ['Demo requests', 'Trial signups', 'Instant scoring', 'Automated routing'],
  },
  {
    number: '04',
    tag: 'THE EVOLUTION',
    title: 'Custom Use-Cases',
    description: 'The custom automations, scoring models, partner workflows, or territory rules we build once the core systems are dialed in.',
    benefits: ['Custom automations', 'Scoring models', 'Partner workflows', 'Territory rules'],
  },
];

const whatClayIs = [
  'Your enrichment brain built to enrich, scrape, and automate across 150+ data sources',
  'Smarter spend via waterfall enrichment with full transparency over sources',
  'AI firepower with built-in agents like Claygent for running prompts and scoring leads',
  'Automated data enrichment at scale - pull firmographics, scrape job posts, score leads',
  'The intelligence layer that supercharges your existing tools and workflows',
];

const whatClayIsNot = [
  'Built for reps to click around and manually prospect like Apollo or ZoomInfo',
  'A replacement for your CRM, Gong, Outreach, or other core GTM tools',
  'A plug-and-play solution that works without strategic implementation',
  'Designed to operate in isolation without connecting to your GTM stack',
  'A simple data provider that just gives you more of the same information',
];

export default function ClayPartnership() {
  const { customerPath } = useCustomer();
  return (
    <Layout title="Clay x LeanScale">
      {/* Dark Gradient Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        padding: 'clamp(2.5rem, 6vw, 4rem) 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle radial glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '9999px',
            padding: '0.375rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            color: 'rgba(255,255,255,0.85)',
            fontWeight: 500,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#a3e635',
              display: 'inline-block',
            }} />
            Clay Enterprise Partner
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ background: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0118' }}>LeanScale</span>
            </div>
            <span style={{ fontSize: '2rem', color: '#a3e635' }}>×</span>
            <div style={{ background: '#E8DED1', padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0a0118' }}>Clay</span>
            </div>
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 800,
            color: 'white',
            marginBottom: '0.75rem',
            lineHeight: 1.15,
          }}>
            Stop burning credits.{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Start growing revenue.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 600,
            margin: '0 auto 2rem',
            lineHeight: 1.6,
          }}>
            See how the fastest growing B2B startups use Clay as their intelligence layer to multiply every part of their Go-to-Market engine.
          </p>

          <div style={{
            maxWidth: 800,
            margin: '0 auto 2rem',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src="https://fast.wistia.net/embed/iframe/w4exgaxw97?seo=true&videoFoam=false"
                title="Clay x LeanScale"
                allow="autoplay; fullscreen"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>

          <a
            href="https://go.leanscale.team/clay/start#booking-form"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              color: '#0a0118',
              padding: '0.875rem 2rem',
              borderRadius: '12px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
            }}
          >
            Get Free Clay Diagnostic
          </a>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.75rem' }}>
            No Cost. No pitch. Just insights.
          </p>
        </div>
      </div>

      {/* Main Content on white */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2.5rem 1.5rem 3rem' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#7c3aed' }}>{stat.value}</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* What Clay Is / Is Not */}
        <div style={{
          background: '#f9fafb',
          borderRadius: '16px',
          padding: 'clamp(1.5rem, 4vw, 3rem)',
          marginBottom: '3rem',
          border: '1px solid rgba(0,0,0,0.06)',
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>
            Understanding what Clay actually is
          </h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
            versus common misconceptions
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>
                <span style={{ fontSize: '1.25rem' }}>✕</span> What Clay is NOT
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {whatClayIsNot.map((item, i) => (
                  <li key={i} style={{
                    padding: '0.75rem 1rem',
                    background: '#fef2f2',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    color: '#991b1b',
                    fontSize: '0.9rem',
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', marginBottom: '1rem', fontSize: '1rem', fontWeight: 700 }}>
                <span style={{ fontSize: '1.25rem' }}>✓</span> What Clay IS
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {whatClayIs.map((item, i) => (
                  <li key={i} style={{
                    padding: '0.75rem 1rem',
                    background: '#ecfdf5',
                    borderRadius: '8px',
                    marginBottom: '0.5rem',
                    color: '#065f46',
                    fontSize: '0.9rem',
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Use Case Pyramid */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem', fontWeight: 600 }}>
            The Clay Use-Case Pyramid
          </p>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>
            The 4 proven use-cases that drive real business outcomes.
          </h2>
          <p style={{ color: '#6b7280', maxWidth: 600, margin: '0 auto' }}>
            These are the use-cases we implement for startups daily, turning Clay from a cool tool into a core intelligence layer.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
          {useCases.map((useCase, i) => (
            <div key={i} style={{
              background: 'white',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: '16px',
              padding: '1.5rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{
                  background: '#7c3aed',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {useCase.number}
                </span>
                <span style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {useCase.tag}
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>{useCase.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                {useCase.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {useCase.benefits.map((benefit, j) => (
                  <span key={j} style={{
                    background: '#f3f4f6',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    color: '#374151',
                  }}>
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* F1 Engine CTA - Dark gradient section */}
        <div style={{
          background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
          borderRadius: '20px',
          padding: 'clamp(2rem, 4vw, 3rem) 2rem',
          textAlign: 'center',
          color: 'white',
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 700,
              marginBottom: '1rem',
            }}>
              Clay is a Formula 1 engine
            </h2>
            <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              But useless without the car. Clay needs the pit crew, race plan, and the rest of the car.
              Without having a strategy to implement Clay, you won&apos;t see the impact.
            </p>
            <p style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.5rem', color: 'white' }}>
              That&apos;s why we offer a free Clay diagnostic.
            </p>
            <a
              href="https://go.leanscale.team/clay/start#booking-form"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                color: '#0a0118',
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '1rem',
                transition: 'all 0.2s ease',
              }}
            >
              Get Free Clay Diagnostic →
            </a>
          </div>
        </div>

        {/* Claybook Pricing Section */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ color: '#7c3aed', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem', fontWeight: 600 }}>
              Claybook Pricing Menu
            </p>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' }}>
              Fixed pricing for Clay implementations
            </h2>
            <p style={{ color: '#6b7280', maxWidth: 600, margin: '0 auto' }}>
              Each Claybook is a pre-built Clay workflow including enrichment waterfall, scoring logic, CRM mapping, integration setup, documentation, and training.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {claybooks.map((book) => (
              <div key={book.id} style={{
                background: 'white',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '16px',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <span style={{
                      background: '#f3f4f6',
                      color: '#6b7280',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      marginRight: '0.5rem',
                    }}>
                      #{book.id}
                    </span>
                    <span style={{
                      background: book.complexity === 'High' ? '#fef3c7' : book.complexity === 'Medium-High' ? '#fef3c7' : '#d1fae5',
                      color: book.complexity === 'High' ? '#92400e' : book.complexity === 'Medium-High' ? '#92400e' : '#065f46',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                    }}>
                      {book.complexity}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#7c3aed' }}>
                    ${book.price.toLocaleString()}
                  </div>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#111827' }}>{book.name}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  {book.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  <span>{book.scope}</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#6b7280' }}>
                  <strong>Prereqs:</strong> {book.prereqs}
                </div>
              </div>
            ))}
          </div>

          {/* Bundles */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', textAlign: 'center', color: '#111827' }}>Bundles (Save More)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {bundles.map((bundle, i) => (
                <div key={i} style={{
                  background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  color: 'white',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '300px',
                    height: '200px',
                    background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
                    pointerEvents: 'none',
                  }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                      display: 'inline-block',
                      background: 'rgba(163,230,53,0.15)',
                      border: '1px solid rgba(163,230,53,0.3)',
                      borderRadius: '9999px',
                      padding: '0.2rem 0.75rem',
                      fontSize: '0.7rem',
                      color: '#a3e635',
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                    }}>
                      Save ${bundle.savings.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
                      ${bundle.price.toLocaleString()}
                    </div>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', fontWeight: 600 }}>{bundle.name}</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                      {bundle.includes.map((item, j) => (
                        <li key={j} style={{ marginBottom: '0.25rem' }}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div style={{
          background: '#f9fafb',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: 700,
          margin: '0 auto 3rem',
          border: '1px solid rgba(0,0,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ fontSize: '2rem', color: '#7c3aed' }}>&ldquo;</div>
            <div>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#374151', marginBottom: '1rem', fontStyle: 'italic' }}>
                By partnering with LeanScale, we successfully automated account and contact enrichment processes using Clay.
                The outcome was a significant reduction in manual processing time, improved data accuracy, and enhanced sales
                intelligence capabilities. Our sales team is now able to focus on high-value activities.
              </p>
              <div style={{ fontWeight: 600, color: '#111827' }}>Kelsey L.</div>
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>RevOps at Fountain</div>
            </div>
          </div>
        </div>

        {/* Bottom CTA - Dark gradient footer */}
        <div style={{
          padding: 'clamp(2rem, 4vw, 3rem) 2rem',
          background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
          borderRadius: '20px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '2rem',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              fontWeight: 700,
              color: 'white',
              marginBottom: '0.5rem',
            }}>
              Ready to unlock Clay&apos;s full potential?
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.6)',
              maxWidth: 500,
              margin: '0 auto 1.5rem',
              lineHeight: 1.6,
            }}>
              Get started with a free diagnostic or explore our implementation options.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://go.leanscale.team/clay/start"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                  color: '#0a0118',
                  fontWeight: 700,
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  border: 'none',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                Visit Clay x LeanScale →
              </a>
              <a
                href="https://www.clay.com/experts/partner/leanscale"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'white',
                  fontWeight: 600,
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                View on Clay Directory
              </a>
              <Link href={customerPath('/getting-started/one-time-projects')} style={{
                display: 'inline-block',
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                fontWeight: 600,
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}>
                Custom Enrichment Project
              </Link>
              <Link href={customerPath('/getting-started/clay-intake')} style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                color: '#0a0118',
                fontWeight: 700,
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                border: 'none',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}>
                Start Clay Project Intake →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
