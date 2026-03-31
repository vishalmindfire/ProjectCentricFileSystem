import { useContext, useState } from 'react';

import { login } from '@services/authService';
import { AuthContext } from '@contexts/AuthContext';
import InputBox from '@components/InputBox';
import { useNavigate } from 'react-router-dom';

function LoginForm(){
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const logIn = async (e : React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userEmail = document.getElementById('email') as HTMLInputElement;
        const userPassword = document.getElementById('password') as HTMLInputElement;
        if(!userEmail.value){
            setEmailError("Email is required");
            return;
        }else{
            setEmailError(null);
        }
        if(!userPassword.value){
            setPasswordError("Password is required");
            return;
        }else{
            setPasswordError(null);
        }

        const response = await login(userEmail.value, userPassword.value, dispatch).catch(err => {
            console.error('Login failed:', err);
            alert('Login failed. Please check your credentials and try again.');
            return { success: false, user: null };
        });
        if(response.success){
           navigate('/projects', { replace: true });
        }
    }

    const onEmailChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value){
            setEmailError(null);
        }else{
            setEmailError("test error");
        }
        console.log("Input value changed:", event.target.value);
    }

    const onPasswordChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.value){
            setPasswordError("test error");
        }else{
            setPasswordError(null);
        }
        console.log("Input value changed:", event.target.value);
    }
  return (
    <form onSubmit={logIn} className="login-form">
        <div className='login-header'>
            <h1>Login</h1>
        </div>
        <div className='login-body'>
            <InputBox label="Email" name="email" id="email" type="text" onChange={onEmailChangeEventHandler} error={emailError} data-testid="email-input" />
            <InputBox label="Password" name="password" id="password" type="password" onChange={onPasswordChangeEventHandler} error={passwordError} data-testid="password-input" />
        </div>
        <InputBox name="login" id="login" value="Log In" type="submit"/>
    </form>
  )
};

export default LoginForm;


