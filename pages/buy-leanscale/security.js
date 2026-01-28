import Layout from '../../components/Layout';

const securityMeasures = [
  {
    feature: 'Data Encryption',
    description: 'All sensitive data is encrypted at rest and in transit.',
  },
  {
    feature: 'Access Controls',
    description: 'Restricted access to sensitive information based on user roles.',
  },
  {
    feature: 'Regular Audits',
    description: 'Conducting periodic security audits to identify and mitigate risks.',
  },
  {
    feature: 'Employee Training',
    description: 'Regular training sessions for employees on data protection and privacy practices.',
  },
  {
    feature: 'Incident Response',
    description: 'Established procedures for responding to data breaches and security incidents.',
  },
];

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
          We prioritize your security and privacy. Our commitment to protecting your information is fundamental to our operations. Below is our privacy policy, alongside additional details about our security measures.
        </p>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--ls-purple)', marginBottom: '1rem' }}>Privacy Policy</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information.
          </p>

          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Data Collection:</h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            We collect information that you provide directly to us and information that is automatically collected through your interactions with our website.
          </p>

          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Use of Information:</h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            We use your information to provide services, improve our offerings, and communicate with you.
          </p>

          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Sharing of Information:</h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            We do not sell or rent your personal information to third parties. We may share your information with trusted partners who assist us in operating our website and conducting our business.
          </p>

          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Data Security:</h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            We implement a variety of security measures to maintain the safety of your personal information. This includes encryption, firewalls, and secure server hosting.
          </p>

          <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Your Rights:</h3>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            You have the right to access, correct, or delete your personal information. Contact us if you wish to exercise these rights.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--ls-purple)', marginBottom: '1rem' }}>W9 Form</h2>
          <p style={{ lineHeight: 1.7 }}>
            To ensure transparency and compliance with tax regulations, we provide our W9 form upon request. Please reach out to our support team for access.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--ls-purple)', marginBottom: '1rem' }}>Security Measures</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            To further demonstrate our commitment to security, we have implemented the following measures:
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600 }}>Security Feature</th>
                  <th style={{ textAlign: 'left', padding: '0.75rem 1rem', fontWeight: 600 }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {securityMeasures.map((measure, index) => (
                  <tr key={measure.feature} style={{ borderBottom: '1px solid #e5e7eb', background: index % 2 === 0 ? '#f9fafb' : 'white' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{measure.feature}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#4b5563' }}>{measure.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p style={{ lineHeight: 1.7, color: '#4b5563' }}>
          At LeanScale, we are dedicated to maintaining the highest standards of security and privacy for our clients. Your trust is paramount, and we strive to protect your information with the utmost care.
        </p>
      </div>
    </Layout>
  );
}
