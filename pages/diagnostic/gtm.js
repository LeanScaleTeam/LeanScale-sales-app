import DiagnosticResults from '../../components/diagnostic/DiagnosticResults';
import { getCustomerServerSideProps } from '../../lib/getCustomer';

export const getServerSideProps = getCustomerServerSideProps;

export default function GTMDiagnostic({ isAdminSession }) {
  return <DiagnosticResults diagnosticType="gtm" isAdminSession={isAdminSession} />;
}
