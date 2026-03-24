import Layout from '../../components/Layout';
import IntakeForm from '../../components/IntakeForm';
import { clayIntakeConfig } from '../../data/intake-configs/clay-intake';
import { useCustomer } from '../../context/CustomerContext';

export default function ClayIntakePage() {
  const { customer } = useCustomer();
  const customerSlug = customer?.slug || 'demo';

  return (
    <Layout title="Clay Project Intake">
      <div style={{
        background: 'linear-gradient(160deg, #0a0118 0%, #1a0a2e 30%, #2d1845 60%, #1a0a2e 100%)',
        color: 'white',
        padding: 'clamp(3rem, 6vw, 5rem) 0 clamp(2rem, 4vw, 4rem)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(124,58,237,0.2)',
            border: '1px solid rgba(124,58,237,0.4)',
            borderRadius: '9999px',
            padding: '0.4rem 1rem',
            marginBottom: '1.5rem',
            fontSize: '0.8rem',
            color: '#c4b5fd',
            letterSpacing: '0.05em',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a3e635', boxShadow: '0 0 8px #a3e635' }} />
            Clay x LeanScale
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            marginBottom: '1rem',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Clay Project{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a3e635 0%, #84cc16 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Intake
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 550,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Tell us about your Clay needs. We will review your responses and build a custom scope and timeline.
          </p>
        </div>
      </div>

      <div style={{ background: 'white', maxWidth: 800, margin: '0 auto', padding: 'clamp(2rem, 4vw, 3rem) 1.5rem' }}>
        <IntakeForm config={clayIntakeConfig} customerSlug={customerSlug} />
      </div>
    </Layout>
  );
}
