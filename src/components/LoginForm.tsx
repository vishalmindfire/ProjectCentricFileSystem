import { useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { login } from '@services/authService';
import { AuthContext } from '@contexts/AuthContext';
import InputBox from '@components/InputBox';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '@utils/validator';
import Modal from '@components/Modal';
import LoginFormModule from '@styles/loginForm.module.css';

function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string>('');
  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const logIn = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userEmail = emailRef.current?.value ?? '';
    const userPassword = passRef.current?.value ?? '';
    let error = false;
    error = !validateEmail({ value: userEmail, setError: setEmailError }) || error;
    error = !validatePassword({ value: userPassword, setError: setPasswordError }) || error;
    if (error) {
      return;
    }
    const response = await login(userEmail, userPassword, dispatch).catch((err) => {
      setModalMessage(err.message);
      openModal();
      return { success: false, user: null };
    });
    if (response.success) {
      navigate('/projects', { replace: true });
    }
  };

  return (
    <div className={LoginFormModule.loginContainer}>
      <div className={LoginFormModule.loginContent}>
        <div className={LoginFormModule.loginAccent}></div>
        <div className={LoginFormModule.loginHeader}>
          <h1>Login</h1>
        </div>
        <div className={LoginFormModule.loginBody}>
          <form onSubmit={logIn} className={LoginFormModule.loginForm}>
            <InputBox
              label="Email Address"
              name="email"
              id="email"
              type="text"
              error={emailError}
              data-testid="email-input"
              ref={emailRef}
              defaultValue=""
              placeholder=" "
            />
            <InputBox
              label="Password"
              name="password"
              id="password"
              type="password"
              error={passwordError}
              data-testid="password-input"
              ref={passRef}
              defaultValue=""
              placeholder=" "
            />

            <InputBox
              name="login"
              id="login"
              value="Log In"
              type="submit"
              data-testid="login-button"
            />
          </form>
        </div>
      </div>
      {showModal &&
        createPortal(
          <Modal title="Message" type="message" open="true" onClose={closeModal}>
            <div>{modalMessage}</div>
          </Modal>,
          document.body
        )}
    </div>
  );
}

export default LoginForm;
