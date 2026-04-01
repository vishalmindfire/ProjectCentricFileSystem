import { type User } from "@entities/User";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

type AuthAction =
  | { type: "LOGIN"; payload: { user: User } }
  | { type: "LOGOUT" };

const AuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, isAuthenticated: true, user: action.payload.user, isLoading: false };
    case "LOGOUT":
      return { ...state, isAuthenticated: false, user: null, isLoading: true };
    default:
      return state;
  }
};

export { type AuthState, type AuthAction, AuthReducer };
