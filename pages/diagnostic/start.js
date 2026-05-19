import Link from 'next/link';
import Script from 'next/script';
import Layout from '../../components/Layout';
import { useCustomer } from '../../context/CustomerContext';

const stepHeaderStyle = {
  padding: '1.5rem 2rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  borderBottom: '1px solid rgba(0,0,0,0.06)',
};

const stepNumberStyle = {
  width: 40,
  height: 40,
  borderRadius: '12px',
  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1rem',
  fontWeight: 800,
  color: '#1a1a1a',
  flexShrink: 0,
};

const stepTitleStyle = {
  fontSize: '1.15rem',
  fontWeight: 700,
  margin: 0,
  color: '#1a1a1a',
};

const stepDescStyle = {
  fontSize: '0.85rem',
  color: '#6b7280',
  margin: '0.15rem 0 0',
  lineHeight: 1.5,
};

const cardShellStyle = {
  background: '#ffffff',
  borderRadius: '20px',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  overflow: 'hidden',
};

export default function StartDiagnostic() {
  const { customer, isDemo, customerPath } = useCustomer();

  // Default NDA link if not configured for customer
  const ndaLink = customer.ndaLink || 'https://powerforms.docusign.net/0758efed-0a42-4275-b5d9-f26875d64ae6?env=na4&acct=9287b4d2-50a6-4309-b7e8-7f0b785470c0&accountId=9287b4d2-50a6-4309-b7e8-7f0b785470c0';
  const intakeFormLink = customer.intakeFormLink || 'https://form.fillout.com/t/u5LcbcwuJqus';

  // HubSpot Partner Admin invite link (updated)
  const hubspotInviteLink = 'https://app-na2.hubspot.com/l/settings/users/partnerInviteLink/Mzk2ODEwNjk9NzgwODA5MDA';

  // Salesforce diagnostics email — substitute customer slug when known.
  // Demo / prospects fall back to a generic placeholder users replace themselves.
  const salesforceEmail = (!isDemo && customer.slug)
    ? `diagnostics+${customer.slug}@leanscale.team`
    : null;

  return (
    <Layout title="Start Diagnostic">
      {/* Wistia player runtime — needed for the <wistia-player> custom element in Step 3 */}
      <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" async />
      <Script src="https://fast.wistia.com/embed/gcxl2cqxhd.js" strategy="afterInteractive" async />

      {/* Dark Gradient Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        padding: 'clamp(3rem, 8vw, 5rem) 1.5rem clamp(2.5rem, 6vw, 4rem)',
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
          background: 'radial-gradient(ellipse, rgba(163,230,53,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 620, margin: '0 auto' }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(163,230,53,0.1)',
            border: '1px solid rgba(163,230,53,0.25)',
            borderRadius: '999px',
            padding: '0.4rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#a3e635',
            letterSpacing: '0.02em',
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#a3e635',
              display: 'inline-block',
              boxShadow: '0 0 6px rgba(163,230,53,0.6)',
            }} />
            Get Started
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            margin: '0 0 1rem',
            letterSpacing: '-0.02em',
          }}>
            Start{' '}
            <span style={{ color: '#a3e635' }}>Diagnostic</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.7,
            maxWidth: 480,
            margin: '0 auto',
          }}>
            Three quick steps to kick off your GTM Diagnostic — about 15 minutes.
          </p>
        </div>
      </section>

      {/* Step Cards */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Step 1: NDA */}
        <section style={{
          marginTop: '-1.5rem',
          marginBottom: '2rem',
          position: 'relative',
          zIndex: 2,
        }}>
          <div style={cardShellStyle}>
            <div style={stepHeaderStyle}>
              <div style={stepNumberStyle}>1</div>
              <div>
                <h2 style={stepTitleStyle}>Sign NDA</h2>
                <p style={stepDescStyle}>
                  Sign our mutual NDA to protect both parties before we begin
                </p>
              </div>
            </div>

            {/* Iframe Container */}
            <div style={{ padding: '1.5rem 2rem 2rem' }}>
              <div style={{
                width: '100%',
                minHeight: '600px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <iframe
                  src={ndaLink}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: 'none',
                  }}
                  title="Sign NDA via DocuSign"
                />
              </div>
              <p style={{
                marginTop: '0.75rem',
                fontSize: '0.8rem',
                color: '#6b7280',
              }}>
                Having trouble?{' '}
                <a
                  href={ndaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#a3e635', fontWeight: 600, textDecoration: 'none' }}
                >
                  Open in new tab
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Step 2: Intake Form */}
        <section style={{ marginBottom: '2rem' }}>
          <div style={cardShellStyle}>
            <div style={stepHeaderStyle}>
              <div style={stepNumberStyle}>2</div>
              <div>
                <h2 style={stepTitleStyle}>GTM Diagnostic Intake</h2>
                <p style={stepDescStyle}>
                  ~15 questions about your CRM, marketing automation, sales engagement, and reporting stack. Takes about 8 minutes.
                </p>
              </div>
            </div>

            {/* Iframe Container */}
            <div style={{ padding: '1.5rem 2rem 2rem' }}>
              <div style={{
                width: '100%',
                minHeight: '800px',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
              }}>
                <iframe
                  src={intakeFormLink}
                  style={{
                    width: '100%',
                    height: '800px',
                    border: 'none',
                  }}
                  title="GTM Diagnostic Intake Form"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: Provide System Access */}
        <section style={{ marginBottom: '2rem' }}>
          <div style={cardShellStyle}>
            <div style={stepHeaderStyle}>
              <div style={stepNumberStyle}>3</div>
              <div>
                <h2 style={stepTitleStyle}>Provide system access</h2>
                <p style={stepDescStyle}>
                  Temporary admin-level access to your CRM and marketing automation platform so we can run the diagnostic.
                </p>
              </div>
            </div>

            <div style={{ padding: '1.5rem 2rem 2rem' }}>
              {/* Wistia video embed */}
              <div style={{
                width: '100%',
                aspectRatio: '16 / 9',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#0a0118',
                marginBottom: '1.75rem',
              }}>
                {/* Wistia custom element — its runtime is loaded above via <Script /> */}
                {/* eslint-disable-next-line @next/next/no-sync-scripts */}
                <wistia-player
                  media-id="gcxl2cqxhd"
                  aspect="1.7777777777777777"
                  style={{ width: '100%', height: '100%', display: 'block' }}
                ></wistia-player>
              </div>

              {/* System rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Salesforce */}
                <SystemRow
                  icon="☁️"
                  name="Salesforce"
                  body={(
                    <>
                      <p style={{ margin: '0 0 0.5rem', color: '#374151', lineHeight: 1.6, fontSize: '0.9rem' }}>
                        Invite{' '}
                        {salesforceEmail ? (
                          <a
                            href={`mailto:${salesforceEmail}`}
                            style={{ color: '#1a1a1a', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid #d1d5db' }}
                          >
                            {salesforceEmail}
                          </a>
                        ) : (
                          <code style={{ background: '#f3f4f6', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                            diagnostics+YOURCOMPANY@leanscale.team
                          </code>
                        )}
                        {' '}as a Standard User (read-only is fine).
                      </p>
                      {!salesforceEmail && (
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>
                          Replace <code style={{ background: '#f3f4f6', padding: '0 0.3rem', borderRadius: '3px' }}>YOURCOMPANY</code> with your company name, or use the email your LeanScale point of contact provided.
                        </p>
                      )}
                    </>
                  )}
                />

                {/* HubSpot */}
                <SystemRow
                  icon="🔗"
                  name="HubSpot"
                  body={(
                    <>
                      <p style={{ margin: '0 0 0.75rem', color: '#374151', lineHeight: 1.6, fontSize: '0.9rem' }}>
                        Click the Partner Admin link below — it&apos;s a one-step process to grant access.
                      </p>
                      <a
                        href={hubspotInviteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: '#ff7a59',
                          color: '#ffffff',
                          padding: '0.55rem 1.1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                        }}
                      >
                        Open HubSpot Partner Admin link →
                      </a>
                    </>
                  )}
                />

                {/* Attio */}
                <SystemRow
                  icon="🅰️"
                  name="Attio"
                  body={(
                    <p style={{ margin: 0, color: '#374151', lineHeight: 1.6, fontSize: '0.9rem' }}>
                      No invite needed — connect via OAuth directly from the intake form. A Workspace Admin clicks <em>Connect Attio</em>, authorizes the read-only scopes, and we pull your data model, lists, members, tasks, and webhooks in about 30 seconds.
                    </p>
                  )}
                />

                {/* Other GTM tools */}
                <SystemRow
                  icon="🛠️"
                  name="Other GTM tools"
                  body={(
                    <p style={{ margin: 0, color: '#374151', lineHeight: 1.6, fontSize: '0.9rem' }}>
                      For everything else (data enrichment, sales engagement, BI, etc.) we&apos;ll guide you case-by-case — usually read-only access.
                    </p>
                  )}
                />
              </div>

              {/* Reassurance row */}
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem 1.25rem',
                background: '#f9fafb',
                border: '1px solid #ececf2',
                borderRadius: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '0.75rem',
              }}>
                <ReassuranceItem icon="🔒" title="Read-only" body="No edits or changes to your systems." />
                <ReassuranceItem icon="🛡️" title="No data stored" body="We don't collect or share data outside the diagnostic." />
                <ReassuranceItem icon="📑" title="NDA in place" body="Your information is fully protected." />
              </div>

              {/* Help footer */}
              <p style={{
                marginTop: '1rem',
                fontSize: '0.8rem',
                color: '#6b7280',
              }}>
                Need help?{' '}
                <a
                  href="mailto:diagnostics@leanscale.team"
                  style={{ color: '#1a1a1a', fontWeight: 600, textDecoration: 'none', borderBottom: '1px solid #d1d5db' }}
                >
                  diagnostics@leanscale.team
                </a>
                {' '}— our team will walk you through it.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA — preview the sample diagnostic */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{
            background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 50%, #2d1845 100%)',
            borderRadius: '20px',
            padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)',
            textAlign: 'center',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 540, height: 280,
              background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
              <span style={{
                display: 'inline-block',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#a3e635',
                marginBottom: '0.65rem',
              }}>
                See what you&apos;ll get
              </span>
              <h2 style={{
                fontSize: 'clamp(1.4rem, 3vw, 1.85rem)',
                fontWeight: 800,
                margin: '0 0 0.65rem',
                letterSpacing: '-0.02em',
              }}>
                Preview a sample diagnostic
              </h2>
              <p style={{
                color: 'rgba(255,255,255,0.7)',
                margin: '0 auto 1.5rem',
                lineHeight: 1.65,
                fontSize: '0.95rem',
                maxWidth: 480,
              }}>
                Here&apos;s what a completed GTM Diagnostic looks like — Power 10 Scorecard, Inspection Report (80+ checkpoints), and an execution-ready roadmap.
              </p>
              <Link
                href={customerPath('/diagnostic/gtm')}
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
                  color: '#0a0118',
                  fontWeight: 700,
                  padding: '0.85rem 1.85rem',
                  fontSize: '0.95rem',
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(163,230,53,0.3)',
                  letterSpacing: '-0.01em',
                }}
              >
                View sample diagnostic →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function SystemRow({ icon, name, body }) {
  return (
    <div style={{
      border: '1px solid #ececf2',
      borderRadius: '14px',
      padding: '1.25rem 1.25rem 1.25rem 1.25rem',
      display: 'flex',
      gap: '0.85rem',
      alignItems: 'flex-start',
    }}>
      <span style={{ fontSize: '1.1rem', flexShrink: 0, lineHeight: 1.4 }} aria-hidden="true">
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          fontSize: '0.95rem',
          fontWeight: 700,
          color: '#1a1a1a',
          margin: '0 0 0.4rem',
          letterSpacing: '-0.01em',
        }}>
          {name}
        </h3>
        {body}
      </div>
    </div>
  );
}

function ReassuranceItem({ icon, title, body }) {
  return (
    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '1rem', flexShrink: 0, lineHeight: 1.4 }} aria-hidden="true">
        {icon}
      </span>
      <div>
        <div style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#1a1a1a',
          marginBottom: '0.15rem',
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '0.78rem',
          color: '#4b5563',
          lineHeight: 1.5,
        }}>
          {body}
        </div>
      </div>
    </div>
  );
}
