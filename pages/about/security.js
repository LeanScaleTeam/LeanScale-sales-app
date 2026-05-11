import Layout from '../../components/Layout';
import {
  HERO_BG,
  LIME,
  LIME_GRADIENT,
  LIME_GRADIENT_TEXT_STYLE,
  PURPLE,
  EYEBROW_LABEL_STYLE,
  DARK_HEADING,
} from '../../lib/designTokens';

const principles = [
  {
    number: '01',
    title: 'Vetted personnel',
    description: 'Comprehensive background checks before any access to customer systems is granted.',
  },
  {
    number: '02',
    title: 'Managed devices',
    description: 'Every endpoint enrolled in MDM, encrypted, and continuously monitored.',
  },
  {
    number: '03',
    title: 'Recurring training',
    description: 'Role-relevant cybersecurity certifications, refreshed annually for every team member.',
  },
];

const mdmCapabilities = [
  'Enforce security policies and password requirements across all company devices',
  'Mandate full-disk encryption on every managed endpoint',
  'Deploy software and keep operating systems current with the latest security updates',
  'Initiate remote locks and remote wipes if a device is lost, stolen, or compromised',
  'Provision and assign devices to employees with standardized, secure baseline configurations',
];

const complianceFrameworks = ['SOC 2', 'HIPAA', 'GDPR', 'PCI DSS', 'ISO standards'];

const requiredCourses = [
  {
    number: '01',
    title: 'Cybersecurity Training for Enhanced Online Protection',
    description:
      'Provides employees with awareness of cybercriminal activity, current cyber threats, and best practices for protecting sensitive data. Given the rising cost of breaches and regulatory penalties, a strong baseline cybersecurity posture is foundational to our operating model.',
  },
  {
    number: '02',
    title: 'Anti-Bribery & Anti-Corruption Prevention',
    description:
      'Equips employees with the knowledge to maintain honest, ethical business relationships. The course covers recognition of potentially corrupting situations — particularly involving gifts, invitations, and donations — and provides practical guidance for handling them appropriately.',
  },
];

const optionalCourses = [
  {
    tag: 'PCI DSS',
    category: 'Payments',
    title: 'PCI DSS',
    description:
      'Covers the Payment Card Industry Data Security Standard administered by the PCI Security Standards Council. Trains employees on PCI DSS requirements, their responsibilities for protecting cardholder and authentication data, and the consequences of non-compliance.',
  },
  {
    tag: 'GDPR',
    category: 'Privacy · IOSH Approved & CPD Certified',
    title: 'GDPR',
    description:
      'Introduces the European General Data Protection Regulation, which applies to any organization — including those outside Europe — that controls or processes personal data of individuals in the European Economic Area. Covers the key principles of lawful processing, secure handling of personal data, and breach response.',
  },
  {
    tag: 'HIPAA — BA',
    category: 'Healthcare',
    title: 'HIPAA for Business Associates',
    description:
      'Designed for employees who interact with protected health information (PHI) in a business associate capacity. Explains how HIPAA applies to their work, the importance of safeguarding patient information, and the consequences of HIPAA violations.',
  },
  {
    tag: 'HIPAA — CE',
    category: 'Healthcare',
    title: 'HIPAA for Covered Entities',
    description:
      'Designed for employees of covered entities under HIPAA — health plans, healthcare clearinghouses, and healthcare providers. Covers job-specific HIPAA responsibilities, the importance of patient information privacy and security, and the consequences of non-compliance.',
  },
];

const sectionLabelStyle = EYEBROW_LABEL_STYLE;

const sectionHeadingStyle = {
  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
  fontWeight: 800,
  color: DARK_HEADING,
  marginBottom: '0.75rem',
};

const cardStyle = {
  background: '#fff',
  borderRadius: '14px',
  padding: '2rem',
  border: '1px solid #e9e5f5',
  borderTop: '4px solid transparent',
  borderImage: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%) 1',
  borderImageSlice: '1',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function Security() {
  return (
    <Layout title="Security & Compliance">
      {/* ── Dark Gradient Hero ── */}
      <section
        style={{
          background: HERO_BG,
          padding: 'clamp(4rem, 10vw, 8rem) clamp(1rem, 5vw, 3rem)',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '999px',
            padding: '0.4rem 1.25rem',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginBottom: '2rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: LIME,
              display: 'inline-block',
            }}
          />
          LeanScale Trust & Compliance
        </div>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 auto 1.5rem',
            maxWidth: 820,
          }}
        >
          How LeanScale safeguards customer information, devices, and{' '}
          <span
            style={{
              ...LIME_GRADIENT_TEXT_STYLE,
            }}
          >
            data
          </span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.35rem)',
            lineHeight: 1.7,
            maxWidth: 720,
            margin: '0 auto 2.5rem',
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          A multi-layered program built for the standards enterprise teams expect — across our
          people, our platforms, and our processes.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 'clamp(1rem, 3vw, 3rem)',
            maxWidth: 800,
            margin: '0 auto',
            color: 'rgba(255,255,255,0.65)',
            fontSize: '0.85rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <div>
            <div style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '0.35rem' }}>Document</div>
            <div style={{ color: '#fff', fontWeight: 600 }}>Security &amp; Compliance Procedures</div>
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '0.35rem' }}>Owner</div>
            <div style={{ color: '#fff', fontWeight: 600 }}>LeanScale Operations</div>
          </div>
          <div>
            <div style={{ color: 'rgba(255,255,255,0.45)', marginBottom: '0.35rem' }}>Last Updated</div>
            <div style={{ color: '#fff', fontWeight: 600 }}>April 20, 2026</div>
          </div>
        </div>
      </section>

      {/* ── 01 Overview / How we think about trust ── */}
      <section
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
          background: '#fff',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={sectionLabelStyle}>01 · Overview</span>
            <h2 style={sectionHeadingStyle}>How we think about trust</h2>
            <p
              style={{
                maxWidth: 760,
                margin: '0 auto',
                lineHeight: 1.7,
                color: '#4a4a5a',
                fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              }}
            >
              LeanScale maintains a multi-layered security and compliance program designed to
              protect customer data and uphold the standards expected by enterprise organizations.
              This document outlines the procedures, platforms, and training that govern how our
              employees and contractors access, handle, and safeguard customer information. Our
              approach is grounded in three principles — rigorous personnel vetting, centrally
              managed and continuously monitored devices, and recurring, role-relevant training.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'clamp(1rem, 2vw, 1.5rem)',
            }}
          >
            {principles.map((p) => (
              <div key={p.number} style={cardStyle}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: PURPLE,
                    marginBottom: '0.5rem',
                  }}
                >
                  Principle {p.number}
                </div>
                <h3
                  style={{
                    fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                    fontWeight: 700,
                    color: '#1a0a2e',
                    marginBottom: '0.75rem',
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    lineHeight: 1.7,
                    margin: 0,
                    color: '#4a4a5a',
                    fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                  }}
                >
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 People / Background checks ── */}
      <section
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
          background: '#f5f3ff',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={sectionLabelStyle}>02 · People</span>
            <h2 style={sectionHeadingStyle}>Background checks</h2>
          </div>

          <div
            style={{
              ...cardStyle,
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: PURPLE,
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '999px',
                padding: '0.35rem 0.9rem',
                marginBottom: '1.25rem',
              }}
            >
              Checkr
            </div>
            <p
              style={{
                lineHeight: 1.7,
                color: '#2d2d3a',
                fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                marginBottom: '1rem',
              }}
            >
              Every employee and contractor is required to complete and pass a comprehensive
              background check through Checkr prior to onboarding at LeanScale.
            </p>
            <p
              style={{
                lineHeight: 1.7,
                color: '#4a4a5a',
                fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                margin: 0,
              }}
            >
              No personnel are granted access to customer systems, information, or data until this
              verification is successfully completed.
            </p>
          </div>
        </div>
      </section>

      {/* ── 03 Devices / Device management ── */}
      <section
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
          background: '#fafafa',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={sectionLabelStyle}>03 · Devices</span>
            <h2 style={sectionHeadingStyle}>Device management</h2>
            <p
              style={{
                maxWidth: 760,
                margin: '0 auto',
                lineHeight: 1.7,
                color: '#4a4a5a',
                fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              }}
            >
              All devices used by LeanScale employees to access customer information are secured
              and centrally managed through Rippling Device Management, our Mobile Device
              Management (MDM) platform. Rippling MDM lets us remotely manage company devices —
              enforcing security policies, deploying software, keeping operating systems up to
              date, assigning computers to employees, initiating remote locks and wipes, assisting
              with provisioning, and enforcing encryption and password policies — so security
              controls are applied consistently across our entire workforce, regardless of location.
            </p>
          </div>

          {/* Why centralized device management matters */}
          <div style={{ marginBottom: '3rem' }}>
            <h3
              style={{
                textAlign: 'center',
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: PURPLE,
                marginBottom: '1.5rem',
              }}
            >
              Why centralized device management matters
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(1rem, 2vw, 1.5rem)',
              }}
            >
              <div style={cardStyle}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: PURPLE,
                    marginBottom: '0.5rem',
                  }}
                >
                  01 · Enforce Security
                </div>
                <h4
                  style={{
                    fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
                    fontWeight: 700,
                    color: '#1a0a2e',
                    marginBottom: '0.75rem',
                  }}
                >
                  Cloud-era controls, applied consistently
                </h4>
                <p
                  style={{
                    lineHeight: 1.7,
                    margin: 0,
                    color: '#4a4a5a',
                    fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                  }}
                >
                  As more work runs through cloud services, employees access data, apps, and
                  network resources from anywhere with an internet connection. MDM closes the gap
                  that flexibility creates — automating deployment and enforcing critical settings
                  like disk encryption and password policy compliance on every endpoint.
                </p>
              </div>
              <div style={cardStyle}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: PURPLE,
                    marginBottom: '0.5rem',
                  }}
                >
                  02 · Remain Compliant
                </div>
                <h4
                  style={{
                    fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
                    fontWeight: 700,
                    color: '#1a0a2e',
                    marginBottom: '0.75rem',
                  }}
                >
                  Meets the standards regulators expect
                </h4>
                <p
                  style={{
                    lineHeight: 1.7,
                    margin: 0,
                    color: '#4a4a5a',
                    fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                  }}
                >
                  Beyond letting administrators adjust settings, install updates, or deploy apps
                  remotely, LeanScale is required to maintain systems-level controls to satisfy
                  security standards including HIPAA, GDPR, SOC 2, PCI, and ISO. MDM automation
                  makes those complex requirements attainable.
                </p>
              </div>
            </div>
          </div>

          {/* Through Rippling MDM, LeanScale is able to */}
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              border: '1px solid #e9e5f5',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              marginBottom: '2rem',
            }}
          >
            <h3
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: PURPLE,
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              Through Rippling MDM, LeanScale is able to
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {mdmCapabilities.map((item) => (
                <li
                  key={item}
                  style={{
                    padding: '0.85rem 0',
                    borderBottom: '1px solid #f0edf5',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                    color: '#2d2d3a',
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: LIME_GRADIENT,
                      flexShrink: 0,
                      marginTop: '0.55rem',
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance alignment */}
          <div
            style={{
              background: HERO_BG,
              borderRadius: '16px',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: '#fff',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
                marginBottom: '0.5rem',
              }}
            >
              Compliance alignment
            </div>
            <h3
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
                fontWeight: 700,
                marginBottom: '1.5rem',
                color: '#fff',
              }}
            >
              Supports leading industry frameworks &amp; regulations.
            </h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              {complianceFrameworks.map((f) => (
                <div
                  key={f}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem 1.25rem',
                    background: 'rgba(163,230,53,0.1)',
                    border: '1px solid rgba(163,230,53,0.35)',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: 'clamp(0.85rem, 1.3vw, 0.95rem)',
                    color: '#d9f99d',
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: LIME_GRADIENT,
                    }}
                  />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 Training / Cybersecurity training ── */}
      <section
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
          background: '#fff',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={sectionLabelStyle}>04 · Training</span>
            <h2 style={sectionHeadingStyle}>Cybersecurity training</h2>
            <p
              style={{
                maxWidth: 760,
                margin: '0 auto',
                lineHeight: 1.7,
                color: '#4a4a5a',
                fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              }}
            >
              All LeanScale employees are required to complete cybersecurity training through
              Rippling&apos;s Learning Management System prior to beginning any work that involves
              access to customer information.
            </p>
          </div>

          {/* 12-month cycle callout */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(163,230,53,0.08) 0%, rgba(124,58,237,0.06) 100%)',
              border: '1px solid rgba(124,58,237,0.18)',
              borderRadius: '14px',
              padding: 'clamp(1.5rem, 3vw, 2rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
              marginBottom: '3rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.5rem',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1,
                }}
              >
                12
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: PURPLE,
                }}
              >
                Month
                <br />
                Cycle
              </span>
            </div>
            <p
              style={{
                margin: 0,
                color: '#2d2d3a',
                fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                lineHeight: 1.6,
                flex: '1 1 280px',
              }}
            >
              Certifications are valid for twelve months, after which annual refresher training is
              required to maintain access.
            </p>
          </div>

          {/* Required courses */}
          <div style={{ marginBottom: '3rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <h3
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
                  fontWeight: 700,
                  color: '#0f0524',
                  margin: 0,
                }}
              >
                Required courses
              </h3>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                  borderRadius: '999px',
                  padding: '0.35rem 0.85rem',
                }}
              >
                Mandatory
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(1rem, 2vw, 1.5rem)',
              }}
            >
              {requiredCourses.map((c) => (
                <div key={c.number} style={cardStyle}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: PURPLE,
                      marginBottom: '0.5rem',
                    }}
                  >
                    Course {c.number}
                  </div>
                  <h4
                    style={{
                      fontSize: 'clamp(1.05rem, 1.8vw, 1.2rem)',
                      fontWeight: 700,
                      color: '#1a0a2e',
                      marginBottom: '0.75rem',
                      lineHeight: 1.3,
                    }}
                  >
                    {c.title}
                  </h4>
                  <p
                    style={{
                      lineHeight: 1.7,
                      margin: 0,
                      color: '#4a4a5a',
                      fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                    }}
                  >
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer-specific optional courses */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
              }}
            >
              <h3
                style={{
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
                  fontWeight: 700,
                  color: '#0f0524',
                  margin: 0,
                }}
              >
                Customer-specific optional courses
              </h3>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: PURPLE,
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid rgba(124,58,237,0.25)',
                  borderRadius: '999px',
                  padding: '0.35rem 0.85rem',
                }}
              >
                Assigned per engagement
              </span>
            </div>
            <p
              style={{
                color: '#4a4a5a',
                fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                lineHeight: 1.7,
                marginTop: 0,
                marginBottom: '1.5rem',
                maxWidth: 760,
              }}
            >
              In addition to the required curriculum, LeanScale provides optional courses that can
              be assigned to employees supporting customers with specific regulatory requirements.
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(1rem, 2vw, 1.5rem)',
              }}
            >
              {optionalCourses.map((c) => (
                <div key={c.tag} style={cardStyle}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                      marginBottom: '0.85rem',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: PURPLE,
                        background: 'rgba(124,58,237,0.08)',
                        border: '1px solid rgba(124,58,237,0.25)',
                        borderRadius: '6px',
                        padding: '0.3rem 0.6rem',
                      }}
                    >
                      {c.tag}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: PURPLE,
                        alignSelf: 'center',
                      }}
                    >
                      {c.category}
                    </span>
                  </div>
                  <h4
                    style={{
                      fontSize: 'clamp(1.05rem, 1.8vw, 1.2rem)',
                      fontWeight: 700,
                      color: '#1a0a2e',
                      marginBottom: '0.75rem',
                    }}
                  >
                    {c.title}
                  </h4>
                  <p
                    style={{
                      lineHeight: 1.7,
                      margin: 0,
                      color: '#4a4a5a',
                      fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                    }}
                  >
                    {c.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 Additional Notes / Platform history ── */}
      <section
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 3rem)',
          background: '#f5f3ff',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={sectionLabelStyle}>05 · Additional Notes</span>
            <h2 style={sectionHeadingStyle}>Platform history</h2>
          </div>

          <div
            style={{
              ...cardStyle,
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: PURPLE,
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderRadius: '999px',
                padding: '0.35rem 0.9rem',
                marginBottom: '1.25rem',
              }}
            >
              Migration
            </div>
            <p
              style={{
                lineHeight: 1.7,
                color: '#2d2d3a',
                fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
                marginBottom: '1rem',
              }}
            >
              Our previous security training provider was TitanHQ (Safe Titan), specializing in
              phishing and malware protection.
            </p>
            <p
              style={{
                lineHeight: 1.7,
                color: '#4a4a5a',
                fontSize: 'clamp(0.9rem, 1.4vw, 1rem)',
                margin: 0,
              }}
            >
              Following our move to Rippling&apos;s Learning Management System, all training and
              certification tracking has been consolidated into a single platform alongside our
              device management — giving us one source of truth for compliance, training records,
              and access control.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section
        style={{
          background: HERO_BG,
          padding: 'clamp(3rem, 8vw, 5rem) clamp(1rem, 5vw, 3rem)',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.55)',
            marginBottom: '0.75rem',
          }}
        >
          Contact
        </span>
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 800,
            marginBottom: '1rem',
          }}
        >
          Questions or additional{' '}
          <span
            style={{
              ...LIME_GRADIENT_TEXT_STYLE,
            }}
          >
            information
          </span>
          ?
        </h2>
        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
            color: 'rgba(255,255,255,0.7)',
            maxWidth: 640,
            margin: '0 auto 2rem',
            lineHeight: 1.7,
          }}
        >
          For questions about LeanScale&apos;s security and compliance program, or to request
          additional documentation related to a specific framework or customer requirement, please
          contact your LeanScale point of contact.
        </p>
      </section>
    </Layout>
  );
}
