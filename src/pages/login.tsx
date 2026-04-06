import { useEffect } from 'react';
import LoginForm from '@components/LoginForm';
import { useAuth } from '@hooks/useAuth';
import { useNavigate } from 'react-router';
import Spinner from '@components/Spinner';
function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/projects', { replace: true });
    }
  }, [isAuthenticated]);

  return <>{!isLoading && isAuthenticated ? <Spinner /> : <LoginForm />}</>;
}

export default Login;
