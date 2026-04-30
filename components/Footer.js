import Link from 'next/link';
import { useCustomer } from '../context/CustomerContext';

const linkStyle = {
  color: 'rgba(255,255,255,0.65)',
  textDecoration: 'none',
  fontSize: '0.85rem',
  lineHeight: 1.9,
  display: 'inline-block',
};

const colHeadingStyle = {
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'rgba(255,255,255,0.5)',
  margin: '0 0 0.85rem',
};

export default function Footer() {
  const { customerPath } = useCustomer();
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: '#0a0118',
        color: 'rgba(255, 255, 255, 0.65)',
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem) 1.5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'clamp(1.5rem, 3vw, 3rem)',
          marginBottom: '2.5rem',
        }}
      >
        {/* Brand column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <img
              src="/leanscale-logo.png"
              alt="LeanScale"
              style={{ height: 28, filter: 'brightness(0) invert(1)' }}
            />
          </div>
          <p style={{
            fontSize: '0.85rem',
            lineHeight: 1.6,
            margin: 0,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 280,
          }}>
            Dedicated GTM operators embedded in your team. RevOps and Marketing Ops, run alongside you.
          </p>
        </div>

        {/* About column */}
        <div>
          <h4 style={colHeadingStyle}>About</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link href={customerPath('/about/about')} style={linkStyle}>About Us</Link></li>
            <li><Link href={customerPath('/about/security')} style={linkStyle}>Security</Link></li>
            <li><Link href={customerPath('/about/services')} style={linkStyle}>Services</Link></li>
            <li><Link href={customerPath('/about/references')} style={linkStyle}>References</Link></li>
            <li><Link href={customerPath('/about/glossary')} style={linkStyle}>GTM Ops Glossary</Link></li>
          </ul>
        </div>

        {/* Engagement column */}
        <div>
          <h4 style={colHeadingStyle}>Engagement</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link href={customerPath('/getting-started/embedded')} style={linkStyle}>Pricing &amp; Tiers</Link></li>
            <li><Link href={customerPath('/getting-started/availability')} style={linkStyle}>Cohort Availability</Link></li>
            <li><Link href={customerPath('/getting-started/team')} style={linkStyle}>Your Team</Link></li>
          </ul>
        </div>

        {/* Diagnostic column */}
        <div>
          <h4 style={colHeadingStyle}>Diagnostic</h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link href={customerPath('/diagnostic')} style={linkStyle}>Overview</Link></li>
            <li><Link href={customerPath('/diagnostic/start')} style={linkStyle}>Start Diagnostic</Link></li>
          </ul>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          fontSize: '0.78rem',
          color: 'rgba(255,255,255,0.45)',
        }}
      >
        <span>© {year} LeanScale. All rights reserved.</span>
        <span>GTM operations for B2B tech.</span>
      </div>
    </footer>
  );
}
