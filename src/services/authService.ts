import { type AuthAction } from '@contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;
interface LoginResponse {
  success: boolean;
  user: { id: string; name: string; email: string };
}
export const login = async (
  email: string,
  password: string,
  dispatch: React.Dispatch<AuthAction>
): Promise<LoginResponse> => {
  const bodyContent = {
    email: email,
    password: password,
  };

  try {
    console.log(API_URL);
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyContent),
      credentials: 'include',
    });

    const data = await response.json();
    console.log(data);
    if (!response.ok || !data.success) {
      throw new Error('Login Failed');
    }
    dispatch({ type: 'LOGIN', payload: { user: data.user } });
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Login error', error);
    throw error;
  }
};

export const logout = async (dispatch: React.Dispatch<AuthAction>): Promise<boolean> => {
  await fetch(`${API_URL}/logout`, { method: 'GET', credentials: 'include' });
  dispatch({ type: 'LOGOUT' });
  return true;
};

export const isAuthenticated = async (dispatch: React.Dispatch<AuthAction>): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/checkAuth`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 401 || response.status === 403) {
      dispatch({ type: 'LOGOUT' });
      return false;
    }

    const data = await response.json();
    dispatch({ type: 'LOGIN', payload: { user: data.user } });
    return true;
  } catch (error) {
    dispatch({ type: 'LOGOUT' });
    console.log(error);
    return false;
  }
};
