import { useState } from 'react';
import Layout from '../../components/Layout';
import customerConfig from '../../data/customer-config';

export default function StartDiagnostic() {
  const [step, setStep] = useState(0);
  const [ndaSigned, setNdaSigned] = useState(false);

  return (
    <Layout title="Start Diagnostic">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span>🚀</span> Start Diagnostic
          </h1>
        </div>

        {/* NDA Section */}
        <section className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Step 1: Sign NDA</h2>
          <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>
            Before we begin the diagnostic process, please sign our mutual NDA to protect both parties.
          </p>
          <a
            href={customerConfig.ndaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            onClick={() => setNdaSigned(true)}
          >
            Sign NDA via DocuSign
          </a>
          {ndaSigned && (
            <span style={{ marginLeft: '1rem', color: 'var(--status-healthy)' }}>
              ✓ NDA link opened
            </span>
          )}
        </section>

        {/* Intake Form */}
        <section className="card">
          <h2 style={{ marginBottom: '1rem' }}>Step 2: Intake Form</h2>
          <p style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}>
            Help us prepare for your diagnostic by sharing some information about your current GTM stack.
          </p>

          {/* Progress Steps */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '2rem',
          }}>
            {['Tech Stack', 'Goals', 'Obstacles', 'Docs'].map((label, i) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: step === i ? 'var(--ls-purple)' : 'var(--ls-light-gray)',
                  color: step === i ? 'white' : 'var(--ls-black)',
                  borderRadius: '6px',
                  textAlign: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
                onClick={() => setStep(i)}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {step === 0 && (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Current Tech Stack</h3>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">CRM</label>
                <select className="form-input">
                  <option value="">Select your CRM</option>
                  <option value="salesforce">Salesforce</option>
                  <option value="hubspot">HubSpot</option>
                  <option value="zoho">Zoho</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Marketing Automation Platform</label>
                <select className="form-input">
                  <option value="">Select your MAP</option>
                  <option value="hubspot">HubSpot</option>
                  <option value="marketo">Marketo</option>
                  <option value="pardot">Pardot</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Your Goals</h3>
              <div className="form-group">
                <label className="form-label">What are your top 3 GTM priorities for the next 12 months?</label>
                <textarea className="form-input" rows={4} placeholder="e.g., Improve lead conversion, implement PLG motion, reduce churn..." />
              </div>
              <div className="form-group">
                <label className="form-label">What metrics are you trying to improve?</label>
                <textarea className="form-input" rows={3} placeholder="e.g., MQL to SQL conversion, pipeline velocity, win rate..." />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Current Obstacles</h3>
              <div className="form-group">
                <label className="form-label">What&apos;s your biggest GTM operations challenge today?</label>
                <textarea className="form-input" rows={4} placeholder="e.g., Data quality issues, lack of reporting, disconnected tools..." />
              </div>
              <div className="form-group">
                <label className="form-label">Have you tried to solve this before? What happened?</label>
                <textarea className="form-input" rows={3} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>Documentation</h3>
              <div className="form-group">
                <label className="form-label">Please share any relevant documentation (optional)</label>
                <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                  Examples: Architecture diagrams, process docs, org charts, existing reports
                </p>
                <input type="file" className="form-input" multiple />
              </div>
              <div className="form-group">
                <label className="form-label">Any additional context?</label>
                <textarea className="form-input" rows={3} />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
            <button
              className="btn"
              style={{ background: 'var(--ls-light-gray)' }}
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
            >
              ← Back
            </button>
            {step < 3 ? (
              <button
                className="btn btn-primary"
                onClick={() => setStep(step + 1)}
              >
                Next →
              </button>
            ) : (
              <button className="btn btn-primary">
                Submit Intake Form
              </button>
            )}
          </div>
        </section>

        {/* Or use Fillout */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#666', marginBottom: '0.5rem' }}>Or complete the form externally:</p>
          <a
            href={customerConfig.intakeFormLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{ background: 'var(--ls-light-gray)' }}
          >
            Open Fillout Form →
          </a>
        </div>
      </div>
    </Layout>
  );
}
