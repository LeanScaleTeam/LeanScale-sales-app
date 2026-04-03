import DiagnosticResults from '../../components/diagnostic/DiagnosticResults';
import { getCustomerServerSideProps } from '../../lib/getCustomer';

export const getServerSideProps = getCustomerServerSideProps;

export default function CPQDiagnostic({ isAdminSession }) {
  return <DiagnosticResults diagnosticType="cpq" isAdminSession={isAdminSession} />;
}
