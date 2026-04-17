import type { SetStateAction } from 'react';

interface Props {
  value: string;
  setError: React.Dispatch<SetStateAction<string | null>>;
}

export const validateEmail = ({ value, setError }: Props) => {
  const email = value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    setError('Email address is required');
    return false;
  }

  if (!emailRegex.test(email)) {
    setError('Please enter a valid email address');
    return false;
  }

  return true;
};

export const validatePassword = ({ value, setError }: Props) => {
  const password = value;

  if (!password) {
    setError('Password is required');
    return false;
  }

  if (password.length < 4) {
    setError('Password must be at least 4 characters long');
    return false;
  }

  return true;
};
