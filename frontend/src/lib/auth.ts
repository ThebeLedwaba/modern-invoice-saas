import api from './api';
import type { User, LoginRequest, RegisterRequest, TokenResponse } from '../types';

export const login = async (credentials: LoginRequest): Promise<TokenResponse> => {
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await api.post<TokenResponse>('/auth/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    return response.data;
};

export const register = async (data: RegisterRequest): Promise<User> => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
    const response = await api.get<User>('/auth/me');
    return response.data;
};

export const setAuthToken = (token: string) => {
    localStorage.setItem('access_token', token);
};

export const removeAuthToken = () => {
    localStorage.removeItem('access_token');
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem('access_token');
};
