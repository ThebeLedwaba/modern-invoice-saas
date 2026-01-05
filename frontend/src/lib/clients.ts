import api from './api';
import type { Client } from '../types';

export const getClients = async (skip: number = 0, limit: number = 100) => {
    const response = await api.get<Client[]>('/clients/', {
        params: { skip, limit },
    });
    return response.data;
};

export const getClient = async (clientId: number) => {
    const response = await api.get<Client>(`/clients/${clientId}`);
    return response.data;
};

export const createClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'is_active'>) => {
    const response = await api.post<Client>('/clients/', client);
    return response.data;
};

export const updateClient = async (clientId: number, updates: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at' | 'user_id'>>) => {
    const response = await api.put<Client>(`/clients/${clientId}`, updates);
    return response.data;
};

export const deleteClient = async (clientId: number) => {
    await api.delete(`/clients/${clientId}`);
};
