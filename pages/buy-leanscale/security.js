import Layout from '../../components/Layout';

export default function Security() {
  return (
    <Layout title="Security">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="page-header">
          <h1 className="page-title">
            <span>🔒</span> Security
          </h1>
        </div>

        <p style={{ marginBottom: '2rem', lineHeight: 1.7 }}>
          We prioritize your security and privacy. Our commitment to protecting your information is fundamental.
          Below you&apos;ll find our privacy policy, alongside additional details about our security measures.
        </p>

        {/* Privacy Policy */}
        <section>
          <h2 style={{ color: 'var(--ls-purple)', marginBottom: '1rem' }}>Privacy Policy</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            We respect your privacy and are committed to protecting your personal data.
            This privacy policy explains how we collect, use, and safeguard your information.
          </p>

          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Data Collection:</h3>
            <p style={{ lineHeight: 1.7 }}>
              We collect information that you provide directly to us and information that is
              automatically collected through your interactions with our website.
            </p>
          </div>

          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Use of Information:</h3>
            <p style={{ lineHeight: 1.7 }}>
              We use your information to provide services, improve our offerings, and communicate with you.
            </p>
          </div>

          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Sharing of Information:</h3>
            <p style={{ lineHeight: 1.7 }}>
              We do not sell or rent your personal information to third parties. We may share your
              information with trusted partners who assist us in operating our website and conducting our business.
            </p>
          </div>

          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Data Security:</h3>
            <p style={{ lineHeight: 1.7 }}>
              We implement a variety of security measures to maintain the safety of your personal information.
              This includes encryption, firewalls, and secure server hosting.
            </p>
          </div>

          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Your Rights:</h3>
            <p style={{ lineHeight: 1.7 }}>
              You have the right to access, correct, or delete your personal information.
              Contact us if you wish to exercise these rights.
            </p>
          </div>
        </section>

        {/* W9 Form */}
        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ color: 'var(--ls-purple)', marginBottom: '1rem' }}>W9 Form</h2>
          <p style={{ lineHeight: 1.7 }}>
            To ensure transparency and compliance with tax regulations, we provide our W9 form upon request.
            Please reach out to our support team for access.
          </p>
        </section>

        {/* Security Measures */}
        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ color: 'var(--ls-purple)', marginBottom: '1rem' }}>Security Measures</h2>
          <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
            To further demonstrate our commitment to security, we have implemented the following measures:
          </p>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: 2 }}>
            <li>SOC 2 Type II compliant infrastructure</li>
            <li>256-bit SSL encryption for all data in transit</li>
            <li>AES-256 encryption for data at rest</li>
            <li>Regular third-party security audits</li>
            <li>Employee security training and background checks</li>
            <li>Role-based access controls</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
