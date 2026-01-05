import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getCurrentUser, login as loginApi, register as registerApi, setAuthToken, removeAuthToken, getAuthToken } from '../lib/auth';
import type { User, LoginRequest, RegisterRequest } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = getAuthToken();
            if (token) {
                try {
                    const currentUser = await getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    removeAuthToken();
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        const response = await loginApi(credentials);
        setAuthToken(response.access_token);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
    };

    const register = async (data: RegisterRequest) => {
        console.log('AuthContext: Starting registration...');
        await registerApi(data);
        console.log('AuthContext: Registration API call successful, auto-logging in...');
        // Auto-login after registration
        await login({ username: data.username, password: data.password });
        console.log('AuthContext: Auto-login successful');
    };

    const logout = () => {
        removeAuthToken();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
