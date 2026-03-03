/**
 * SalesforceConnect — OAuth button + metadata zip upload + connection status
 */

import { useState, useRef } from 'react';

export default function SalesforceConnect({ customerId, slug, status, onSaveAllAnswers, onUploadSuccess }) {
  const [isSandbox, setIsSandbox] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [savingForOAuth, setSavingForOAuth] = useState(false);
  const fileInputRef = useRef(null);

  const isConnected = status?.connected;

  if (isConnected) {
    return (
      <div style={styles.connectedBanner}>
        <div style={styles.connectedIcon}>&#10003;</div>
        <div>
          <div style={styles.connectedTitle}>Salesforce Connected</div>
          <div style={styles.connectedDetail}>
            {status.instanceUrl || status.orgId}
            {status.isSandbox && ' (Sandbox)'}
            {status.signalsReady && ' — CRM data downloaded'}
            {status.source === 'upload' && ' — via metadata upload'}
          </div>
        </div>
      </div>
    );
  }

  const handleConnectOAuth = async () => {
    setSavingForOAuth(true);
    try {
      if (onSaveAllAnswers) await onSaveAllAnswers();
      window.location.href = `/api/salesforce/authorize?customerId=${customerId}&slug=${slug}&sandbox=${isSandbox}`;
    } catch {
      setSavingForOAuth(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      if (onSaveAllAnswers) await onSaveAllAnswers();

      const formData = new FormData();
      formData.append('customerId', customerId);
      formData.append('file', file);

      const res = await fetch('/api/salesforce/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }

      setUploadSuccess(true);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div style={styles.connectedBanner}>
        <div style={styles.connectedIcon}>&#10003;</div>
        <div>
          <div style={styles.connectedTitle}>Salesforce Metadata Uploaded</div>
          <div style={styles.connectedDetail}>CRM metadata processed successfully</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.connectBanner}>
      {/* OAuth path */}
      <div style={styles.oauthSection}>
        <div style={styles.connectTitle}>Connect Salesforce</div>
        <div style={styles.connectDesc}>
          Log in to the customer&apos;s Salesforce org to automatically pull CRM metadata.
        </div>
        <div style={styles.oauthRow}>
          <button
            onClick={handleConnectOAuth}
            disabled={savingForOAuth}
            style={{ ...styles.connectBtn, opacity: savingForOAuth ? 0.6 : 1 }}
          >
            {savingForOAuth ? 'Saving...' : 'Connect via OAuth'}
          </button>
          <label style={styles.sandboxToggle}>
            <input
              type="checkbox"
              checked={isSandbox}
              onChange={(e) => setIsSandbox(e.target.checked)}
              style={styles.checkbox}
            />
            <span style={styles.sandboxLabel}>Sandbox</span>
          </label>
        </div>
      </div>

      {/* Divider */}
      <div style={styles.divider}>
        <span style={styles.dividerText}>or</span>
      </div>

      {/* Upload path */}
      <div style={styles.uploadSection}>
        <div style={styles.uploadTitle}>Upload Metadata Export</div>
        <div
          style={styles.dropzone}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFileUpload({ target: { files: [file] } });
          }}
        >
          {uploading ? (
            <span>Processing metadata...</span>
          ) : (
            <span>Drag &amp; drop metadata zip here, or click to browse</span>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        {uploadError && (
          <div style={styles.uploadError}>{uploadError}</div>
        )}

        {/* Instructions toggle */}
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          style={styles.instructionsToggle}
        >
          {showInstructions ? 'Hide' : 'How to export metadata'}
        </button>

        {showInstructions && (
          <div style={styles.instructions}>
            <ol style={styles.instructionsList}>
              <li>Install the Salesforce CLI: <a href="https://developer.salesforce.com/tools/salesforcecli" target="_blank" rel="noopener noreferrer" style={styles.link}>developer.salesforce.com/tools/salesforcecli</a></li>
              <li>Authenticate to the customer org:<br />
                <code style={styles.code}>sf org login web --alias customer-org</code>
              </li>
              <li>Retrieve metadata:<br />
                <code style={styles.code}>
                  sf project retrieve start \<br />
                  &nbsp;&nbsp;--metadata CustomObject,CustomField,Flow,WorkflowRule,ValidationRule \<br />
                  &nbsp;&nbsp;--metadata ApexTrigger,ApexClass,Profile,PermissionSet \<br />
                  &nbsp;&nbsp;--metadata Role,DuplicateRule,ConnectedApp,NamedCredential \<br />
                  &nbsp;&nbsp;--metadata Layout,RecordType,Report,Dashboard \<br />
                  &nbsp;&nbsp;--target-org customer-org
                </code>
              </li>
              <li>Upload the resulting zip file above.</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  connectedBanner: {
    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem',
    background: 'var(--status-healthy-bg)', border: '1px solid var(--status-healthy)',
    borderRadius: 'var(--radius-md, 8px)', marginBottom: '0.75rem',
  },
  connectedIcon: {
    width: '2rem', height: '2rem', borderRadius: '50%', background: 'var(--status-healthy)',
    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 'bold', fontSize: 'var(--text-sm)', flexShrink: 0,
  },
  connectedTitle: {
    fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: 'var(--status-healthy-text)',
  },
  connectedDetail: {
    fontSize: 'var(--text-xs)', color: 'var(--status-healthy-text)', opacity: 0.8,
  },
  connectBanner: {
    padding: '1.25rem', background: '#EFF6FF', border: '1px solid #93C5FD',
    borderRadius: 'var(--radius-md, 8px)', marginBottom: '0.75rem',
  },
  oauthSection: { marginBottom: '1rem' },
  connectTitle: {
    fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: '#1E40AF',
  },
  connectDesc: {
    fontSize: 'var(--text-xs)', color: '#1E40AF', opacity: 0.8, marginTop: '0.25rem', marginBottom: '0.75rem',
  },
  oauthRow: { display: 'flex', alignItems: 'center', gap: '1rem' },
  connectBtn: {
    padding: '0.5rem 1.25rem', background: '#0B5CAB', color: 'white', border: 'none',
    borderRadius: 'var(--radius-md, 8px)', fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-semibold)', cursor: 'pointer',
  },
  sandboxToggle: { display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' },
  checkbox: { cursor: 'pointer' },
  sandboxLabel: { fontSize: 'var(--text-xs)', color: '#1E40AF' },
  divider: {
    textAlign: 'center', margin: '1rem 0', borderTop: '1px solid #BFDBFE', position: 'relative',
  },
  dividerText: {
    position: 'relative', top: '-0.6rem', background: '#EFF6FF', padding: '0 0.75rem',
    fontSize: 'var(--text-xs)', color: '#6B7280',
  },
  uploadSection: {},
  uploadTitle: {
    fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)', color: '#1E40AF', marginBottom: '0.5rem',
  },
  dropzone: {
    border: '2px dashed #93C5FD', borderRadius: 'var(--radius-md, 8px)', padding: '1.5rem',
    textAlign: 'center', cursor: 'pointer', fontSize: 'var(--text-xs)', color: '#6B7280',
    transition: 'border-color 0.2s',
  },
  uploadError: {
    fontSize: 'var(--text-xs)', color: '#991b1b', marginTop: '0.5rem',
  },
  instructionsToggle: {
    background: 'none', border: 'none', fontSize: 'var(--text-xs)', color: '#1E40AF',
    cursor: 'pointer', textDecoration: 'underline', marginTop: '0.75rem', padding: 0,
  },
  instructions: {
    marginTop: '0.75rem', padding: '1rem', background: 'white',
    borderRadius: 'var(--radius-md, 8px)', border: '1px solid #DBEAFE',
  },
  instructionsList: {
    margin: 0, paddingLeft: '1.25rem', fontSize: 'var(--text-xs)', color: '#374151',
    lineHeight: 1.8,
  },
  code: {
    display: 'block', background: '#F3F4F6', padding: '0.5rem', borderRadius: '4px',
    fontSize: 'var(--text-xs)', fontFamily: 'monospace', marginTop: '0.25rem',
    overflowX: 'auto', whiteSpace: 'pre',
  },
  link: { color: '#1E40AF' },
};
