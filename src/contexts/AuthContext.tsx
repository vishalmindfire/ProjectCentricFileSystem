import React, { createContext, useReducer } from 'react';
import { type AuthState, type AuthAction, AuthReducer } from '@reducers/authReducer';
import { isAuthenticated } from '@services/authService';   

type ProviderProps = {
  children: React.ReactNode; 
};
const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    isLoading: true
}

const AuthContext = createContext<{
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}>({
    state: initialState,
    dispatch: () => null,
});

const AuthProvider = (props: ProviderProps) : React.ReactNode=> {
    const [state, dispatch] = useReducer(AuthReducer, initialState);
    React.useEffect(() => {
        if(!state.isAuthenticated){
            isAuthenticated(dispatch);
        }
    }, []);

    return <AuthContext.Provider value={{state,dispatch}}>
            {props.children}
           </AuthContext.Provider>
}

export {type AuthState,type AuthAction,AuthContext, AuthReducer,AuthProvider};

