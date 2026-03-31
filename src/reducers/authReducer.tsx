import { type User } from "@entities/User";

interface AuthState {
  isAuthenticated: boolean,
  user: User | null,
}

type AuthAction =
  | { type: 'LOGIN'; payload: { user: User } }
  | { type: 'LOGOUT' };

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch(action.type){
        case 'LOGIN':
            return { ...state, isAuthenticated: true, user: action.payload.user}
        case 'LOGOUT':
            return { ...state, isAuthenticated: false, user: null};
        default:
            return state;
    }
}

export { type AuthState, type AuthAction, AuthReducer };