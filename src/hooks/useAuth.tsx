import { AuthContext, type AuthState } from '@contexts/AuthContext';
import { useContext } from 'react';

export const useAuth = (): AuthState => {
  const { state } = useContext(AuthContext);
  console.log(state);
  return state;
};
