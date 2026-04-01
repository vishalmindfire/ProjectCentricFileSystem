import { Outlet } from 'react-router-dom';
import ErrorBoundary from '@services/errorBoundry';
import { ErrorProvider } from '@contexts/ErrorContext';
import ErrorPage from '@pages/error';

const ErrorBoundaryLayout = () => (
 <ErrorProvider>
   <ErrorBoundary fallback={<ErrorPage />}>
     <Outlet />
   </ErrorBoundary>
 </ErrorProvider>
);
export default ErrorBoundaryLayout;