
import LoginForm from '@components/LoginForm';
import { useAuth } from '@hooks/useAuth';
import  { useEffect } from 'react';
import { useNavigate } from 'react-router';
import Spinner from '@components/Spinner';
function Login(){
  const navigate = useNavigate()
  const { isAuthenticated, isLoading } = useAuth();
  console.log(isAuthenticated);
  useEffect(() => {
      if(isAuthenticated){
        navigate("/", { replace: true})
      }
  }, [isAuthenticated]);

  return (
    <>
      {isLoading ? <Spinner/> : <LoginForm/>}
    </>
  )
};

export default Login;


