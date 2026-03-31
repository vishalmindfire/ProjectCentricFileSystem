
import LoginForm from '@components/LoginForm';
import { useAuth } from '@hooks/useAuth';
import Home from '@pages/home';

function Login(){
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  if(isAuthenticated){
    return <Home/>
  }
  return (
    <LoginForm/>
  )
};

export default Login;


