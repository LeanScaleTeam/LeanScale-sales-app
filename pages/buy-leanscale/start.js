import { useState } from 'react';
import Layout from '../../components/Layout';
import customerConfig from '../../data/customer-config';

export default function GettingStarted() {
  const [formData, setFormData] = useState({
    yourName: '',
    companyName: '',
    billingEmail: '',
    signerName: '',
    signerTitle: '',
    signerEmail: '',
    monthlyHours: '50',
    cancellation: 'quarterly',
    paymentTerms: 'quarterly',
    startDate: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to your backend/webhook
    console.log('Form submitted:', formData);
    alert('Form submitted! Our team will be in touch shortly.');
  };

  return (
    <Layout title="Getting Started">
      <div className="container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="page-header" style={{ textAlign: 'center' }}>
          <h1 className="page-title" style={{ justifyContent: 'center' }}>
            <span>⚡</span> Getting Started
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
            {/* Contact Info */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Your Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="yourName"
                  className="form-input"
                  value={formData.yourName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Signer Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="signerName"
                  className="form-input"
                  value={formData.signerName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Company Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  className="form-input"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Signer Title <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="signerTitle"
                  className="form-input"
                  value={formData.signerTitle}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Billing Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="billingEmail"
                  className="form-input"
                  value={formData.billingEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Signer Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="signerEmail"
                  className="form-input"
                  value={formData.signerEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid var(--ls-light-gray)' }} />

            {/* Engagement Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              {/* Monthly Hours */}
              <div className="form-group">
                <label className="form-label">
                  Monthly Hours <span className="required">*</span>
                </label>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
                  Total hours available per month
                </div>
                {['50', '100', '225'].map((hours) => (
                  <div key={hours} style={{ marginBottom: '0.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="monthlyHours"
                        value={hours}
                        checked={formData.monthlyHours === hours}
                        onChange={handleChange}
                      />
                      {hours}
                    </label>
                  </div>
                ))}
              </div>

              {/* Cancellation Notice */}
              <div className="form-group">
                <label className="form-label">
                  Cancellation Notice <span className="required">*</span>
                </label>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
                  Shown in days
                </div>
                {[
                  { value: 'monthly', label: 'Month-to-Month' },
                  { value: 'quarterly', label: 'Quarterly (Default)' },
                  { value: 'annual', label: 'Annual' },
                ].map((option) => (
                  <div key={option.value} style={{ marginBottom: '0.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="cancellation"
                        value={option.value}
                        checked={formData.cancellation === option.value}
                        onChange={handleChange}
                      />
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Payment Terms */}
              <div className="form-group">
                <label className="form-label">
                  Payment Terms <span className="required">*</span>
                </label>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
                  Invoice schedule
                </div>
                {[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly (Default)' },
                  { value: 'annually', label: 'Annually' },
                ].map((option) => (
                  <div key={option.value} style={{ marginBottom: '0.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="paymentTerms"
                        value={option.value}
                        checked={formData.paymentTerms === option.value}
                        onChange={handleChange}
                      />
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label className="form-label">
                  Start Date <span className="required">*</span>
                </label>
                <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.5rem' }}>
                  Updated real-time
                </div>
                {customerConfig.startDates.map((dateOption) => (
                  <div key={dateOption.date} style={{ marginBottom: '0.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="startDate"
                        value={dateOption.date}
                        checked={formData.startDate === dateOption.date}
                        onChange={handleChange}
                      />
                      {new Date(dateOption.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                      {' - '}
                      {dateOption.status === 'waitlist'
                        ? 'Waitlist Only'
                        : `${dateOption.spotsLeft} Spots Left`}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
