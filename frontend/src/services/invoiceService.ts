import apiClient from './api'
import type { Invoice, InvoiceCreate, InvoiceUpdate } from '../types/invoice'

export const invoiceService = {
    /**
     * Get all invoices
     */
    async getInvoices(): Promise<Invoice[]> {
        return apiClient.get('/api/invoices')
    },

    /**
     * Get a single invoice by ID
     */
    async getInvoice(id: number): Promise<Invoice> {
        return apiClient.get(`/api/invoices/${id}`)
    },

    /**
     * Create a new invoice
     */
    async createInvoice(data: InvoiceCreate): Promise<Invoice> {
        return apiClient.post('/api/invoices', data)
    },

    /**
     * Update an existing invoice
     */
    async updateInvoice(id: number, data: InvoiceUpdate): Promise<Invoice> {
        return apiClient.put(`/api/invoices/${id}`, data)
    },

    /**
     * Delete an invoice
     */
    async deleteInvoice(id: number): Promise<void> {
        return apiClient.delete(`/api/invoices/${id}`)
    },

    /**
     * Send invoice via email
     */
    async sendInvoice(id: number, email: string): Promise<void> {
        return apiClient.post(`/api/invoices/${id}/send`, { email })
    },

    /**
     * Download invoice PDF
     */
    async downloadInvoicePDF(id: number): Promise<Blob> {
        return apiClient.get(`/api/invoices/${id}/pdf`, {
            responseType: 'blob',
        })
    },
}

export default invoiceService
