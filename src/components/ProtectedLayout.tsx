import { Outlet } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import ErrorBoundary from '@services/errorBoundry';
import { ErrorProvider } from '@contexts/ErrorContext';
import Login from '@pages/login';
import ErrorPage from '@pages/error';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  return (
    <ErrorProvider>
      <ErrorBoundary fallback={<ErrorPage />}>
        \{!isAuthenticated ? <Login /> : <Outlet />}
      </ErrorBoundary>
    </ErrorProvider>
  );
}

export default ProtectedRoute;
