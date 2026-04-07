import React, { createContext, useReducer } from 'react';
import Spinner from '@components/Spinner';
import { type AuthState, type AuthAction, AuthReducer } from '@reducers/authReducer';
import { isAuthenticated } from '@services/authService';

type ProviderProps = {
  children: React.ReactNode;
};
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const AuthProvider = (props: ProviderProps): React.ReactNode => {
  const [state, dispatch] = useReducer(AuthReducer, initialState);
  React.useEffect(() => {
    isAuthenticated(dispatch);
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {state.isLoading ? <Spinner /> : props.children}
    </AuthContext.Provider>
  );
};

export { type AuthState, type AuthAction, AuthContext, AuthReducer, AuthProvider };
