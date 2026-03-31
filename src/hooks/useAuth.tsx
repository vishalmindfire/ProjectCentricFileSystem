import {AuthContext, type AuthState} from '@contexts/AuthContext';
import { useContext } from 'react';

export const useAuth = (): AuthState => {
    const {state} = useContext(AuthContext);
    return state;
}