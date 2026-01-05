import api from './api';
import type { Invoice, InvoiceItem } from '../types';

export const getInvoices = async (skip: number = 0, limit: number = 100) => {
    const response = await api.get<Invoice[]>('/invoices/', {
        params: { skip, limit },
    });
    return response.data;
};

export const getInvoice = async (invoiceId: number) => {
    const response = await api.get<Invoice>(`/invoices/${invoiceId}`);
    return response.data;
};

export interface CreateInvoiceInput {
    client_id: number;
    due_date: string;
    items: Omit<InvoiceItem, 'id' | 'invoice_id' | 'created_at' | 'updated_at' | 'amount'>[];
    tax_rate?: number;
    discount_amount?: number;
    notes?: string;
    terms?: string;
}

export const createInvoice = async (invoice: CreateInvoiceInput) => {
    const response = await api.post<Invoice>('/invoices/', invoice);
    return response.data;
};

export const updateInvoice = async (invoiceId: number, updates: Partial<Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'invoice_number' | 'items'>>) => {
    const response = await api.put<Invoice>(`/invoices/${invoiceId}`, updates);
    return response.data;
};

export const deleteInvoice = async (invoiceId: number) => {
    await api.delete(`/invoices/${invoiceId}`);
};
