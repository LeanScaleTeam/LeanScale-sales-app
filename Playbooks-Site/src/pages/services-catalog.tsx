import React from 'react';
import Layout from '@theme/Layout';

export default function ServicesCatalog(): React.JSX.Element {
  return (
    <Layout
      title="Services Catalog"
      description="LeanScale Projects & Services Catalog"
    >
      <div style={{
        width: '100%',
        height: 'calc(100vh - 60px)', // Full height minus navbar
        overflow: 'hidden',
      }}>
        <iframe
          src="https://coda.io/embed/zbZT3N6700/_suvqEwyP?viewMode=embedplay&hideSections=true"
          width="100%"
          height="100%"
          style={{
            border: 'none',
            maxWidth: '100%',
          }}
          allow="fullscreen"
        />
      </div>
    </Layout>
  );
}
