import React, { createContext, useReducer } from 'react';
import { type AuthState, type AuthAction, AuthReducer } from '@reducers/authReducer';
import { isAuthenticated } from '@services/authService';   

const initialState: AuthState = {
    isAuthenticated: false,
    user: null
}

const AuthContext = createContext<{
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}>({
    state: initialState,
    dispatch: () => null,
});

const AuthProvider = (children:React.ReactNode) => {
    const [state, dispatch] = useReducer(AuthReducer, initialState)

    React.useEffect(() => {
        isAuthenticated(dispatch);
    }, []);

    return <AuthContext.Provider value={{state,dispatch}}>
            {children}
           </AuthContext.Provider>
}

export {type AuthAction,AuthContext, AuthReducer,AuthProvider};

