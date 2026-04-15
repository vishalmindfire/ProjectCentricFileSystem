import { useContext, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { login } from '@services/authService';
import { AuthContext } from '@contexts/AuthContext';
import InputBox from '@components/InputBox';
import { useNavigate } from 'react-router-dom';
import Modal from '@components/Modal';

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
    if (!userEmail) {
      setEmailError('Email is required');
      return;
    } else {
      setEmailError(null);
    }
    if (!userPassword) {
      setPasswordError('Password is required');
      return;
    } else {
      setPasswordError(null);
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
    <>
      <form onSubmit={logIn} className="login-form">
        <div className="login-header">
          <h1>Login</h1>
        </div>
        <div className="login-body">
          <InputBox
            label="Email"
            name="email"
            id="email"
            type="text"
            error={emailError}
            data-testid="email-input"
            ref={emailRef}
            defaultValue=""
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
          />
        </div>
        <InputBox name="login" id="login" value="Log In" type="submit" data-testid="login-button" />
      </form>

      {showModal &&
        createPortal(
          <Modal title="Message" type="message" open="true" onClose={closeModal}>
            <div>{modalMessage}</div>
          </Modal>,
          document.body
        )}
    </>
  );
}

export default LoginForm;
