import Head from 'next/head';
import Navigation from './Navigation';
import { useCustomer } from '../context/CustomerContext';

export default function Layout({ children, title = "LeanScale" }) {
  const { displayName, customerType } = useCustomer();
  const pageTitle = displayName ? `${displayName} | ${title}` : title;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="LeanScale - GTM Operations for Hypergrowth Startups" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      {customerType === 'active' && displayName && (
        <div style={{
          background: 'linear-gradient(90deg, #7c3aed 0%, #6d28d9 100%)',
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          padding: '0.4rem 1rem',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.03em',
        }}>
          Customer Portal — {displayName}
        </div>
      )}
      <Navigation />
      <main>{children}</main>
    </>
  );
}
