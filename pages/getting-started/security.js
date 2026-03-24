import Layout from '../../components/Layout';

const securityMeasures = [
  {
    feature: 'Data Encryption',
    description: 'All sensitive data is encrypted at rest and in transit.',
    icon: '🔐',
  },
  {
    feature: 'Access Controls',
    description: 'Restricted access to sensitive information based on user roles.',
    icon: '🛡️',
  },
  {
    feature: 'Regular Audits',
    description: 'Conducting periodic security audits to identify and mitigate risks.',
    icon: '📋',
  },
  {
    feature: 'Employee Training',
    description: 'Regular training sessions for employees on data protection and privacy practices.',
    icon: '🎓',
  },
  {
    feature: 'Incident Response',
    description: 'Established procedures for responding to data breaches and security incidents.',
    icon: '🚨',
  },
];

const privacySections = [
  {
    title: 'Data Collection',
    body: 'We collect information that you provide directly to us and information that is automatically collected through your interactions with our website.',
  },
  {
    title: 'Use of Information',
    body: 'We use your information to provide services, improve our offerings, and communicate with you.',
  },
  {
    title: 'Sharing of Information',
    body: 'We do not sell or rent your personal information to third parties. We may share your information with trusted partners who assist us in operating our website and conducting our business.',
  },
  {
    title: 'Data Security',
    body: 'We implement a variety of security measures to maintain the safety of your personal information. This includes encryption, firewalls, and secure server hosting.',
  },
  {
    title: 'Your Rights',
    body: 'You have the right to access, correct, or delete your personal information. Contact us if you wish to exercise these rights.',
  },
];

export default function Security() {
  return (
    <Layout title="Security">
      {/* Dark Gradient Hero */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
          padding: 'clamp(3rem, 8vw, 6rem) 1.5rem',
          textAlign: 'center',
        }}
      >
        {/* Radial glow decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-40%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          {/* Pill badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '999px',
              padding: '0.4rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#a3e635',
              }}
            />
            Trust &amp; Compliance
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 800,
              color: '#fff',
              lineHeight: 1.15,
              margin: '0 0 1rem',
            }}
          >
            Your <span style={{ color: '#a3e635' }}>Security</span> &amp;{' '}
            <span style={{ color: '#a3e635' }}>Privacy</span> Matter
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            We prioritize your security and privacy. Our commitment to protecting your information is fundamental to our operations.
          </p>
        </div>
      </section>

      {/* Content on white background */}
      <div
        style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: 'clamp(2rem, 5vw, 3.5rem) 1.5rem',
        }}
      >
        {/* Privacy Policy Card */}
        <section
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
            padding: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#111827',
              marginTop: 0,
              marginBottom: '0.5rem',
            }}
          >
            Privacy Policy
          </h2>
          <p
            style={{
              color: '#374151',
              lineHeight: 1.7,
              marginBottom: '2rem',
            }}
          >
            We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information.
          </p>

          {privacySections.map((section) => (
            <div key={section.title} style={{ marginBottom: '1.5rem' }}>
              <h3
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600,
                  fontSize: '1.05rem',
                  color: '#111827',
                  marginTop: 0,
                  marginBottom: '0.4rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#a3e635',
                    flexShrink: 0,
                  }}
                />
                {section.title}
              </h3>
              <p
                style={{
                  color: '#374151',
                  lineHeight: 1.7,
                  margin: 0,
                  paddingLeft: '1rem',
                }}
              >
                {section.body}
              </p>
            </div>
          ))}
        </section>

        {/* Security Measures */}
        <section style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#111827',
              marginTop: 0,
              marginBottom: '0.5rem',
            }}
          >
            Security Measures
          </h2>
          <p
            style={{
              color: '#374151',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
            }}
          >
            To further demonstrate our commitment to security, we have implemented the following measures:
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {securityMeasures.map((measure) => (
              <div
                key={measure.feature}
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  padding: '1.5rem',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>
                  {measure.icon}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: '#111827',
                    marginBottom: '0.35rem',
                  }}
                >
                  {measure.feature}
                </div>
                <p
                  style={{
                    color: '#374151',
                    lineHeight: 1.6,
                    fontSize: '0.92rem',
                    margin: 0,
                  }}
                >
                  {measure.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* W9 Form Card */}
        <section
          style={{
            background: '#fff',
            borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
            padding: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#111827',
              marginTop: 0,
              marginBottom: '0.5rem',
            }}
          >
            W9 Form
          </h2>
          <p
            style={{
              color: '#374151',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            To ensure transparency and compliance with tax regulations, we provide our W9 form upon request. Please reach out to our support team for access.
          </p>
        </section>
      </div>

      {/* Dark Gradient Footer CTA */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
          padding: 'clamp(2.5rem, 6vw, 4rem) 1.5rem',
          textAlign: 'center',
        }}
      >
        {/* Radial glow */}
        <div
          style={{
            position: 'absolute',
            bottom: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
              fontWeight: 700,
              color: '#fff',
              marginTop: 0,
              marginBottom: '0.75rem',
            }}
          >
            Questions About Our Security Practices?
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
              fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
            }}
          >
            At LeanScale, we are dedicated to maintaining the highest standards of security and privacy for our clients. Your trust is paramount.
          </p>
          <a
            href="mailto:support@leanscale.com"
            style={{
              display: 'inline-block',
              padding: '0.75rem 2rem',
              background: '#7c3aed',
              color: '#fff',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.95rem',
              textDecoration: 'none',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#6d28d9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#7c3aed';
            }}
          >
            Contact Our Team
          </a>
        </div>
      </section>
    </Layout>
  );
}
