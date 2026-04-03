import DiagnosticResults from '../../components/diagnostic/DiagnosticResults';
import { getCustomerServerSideProps } from '../../lib/getCustomer';

export const getServerSideProps = getCustomerServerSideProps;

export default function ClayDiagnostic({ isAdminSession }) {
  return <DiagnosticResults diagnosticType="clay" isAdminSession={isAdminSession} />;
}
