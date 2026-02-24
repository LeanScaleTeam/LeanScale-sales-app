/**
 * Diagnostic v2 Intake Page
 * URL: /c/[slug]/diagnostic/intake (via middleware rewrite)
 *
 * Multi-step intake form that collects company profile, tools, processes,
 * and reporting data. Includes HubSpot OAuth connect button.
 */

import { getCustomerServerSideProps } from '../../lib/getCustomer';
import { CustomerProvider } from '../../context/CustomerContext';
import Layout from '../../components/Layout';
import IntakeForm from '../../components/diagnostic-intake/IntakeForm';

export const getServerSideProps = getCustomerServerSideProps;

export default function DiagnosticIntakePage({ customer }) {
  return (
    <CustomerProvider initialCustomer={customer}>
      <Layout title="GTM Diagnostic — Intake">
        <IntakeForm />
      </Layout>
    </CustomerProvider>
  );
}
