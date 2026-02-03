export interface Invoice {
    id: number
    invoice_number: string
    client_id: number
    issue_date: string
    due_date: string
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
    subtotal: number
    tax_rate: number
    tax_amount: number
    discount: number
    total_amount: number
    notes?: string
    items: InvoiceItem[]
    created_at: string
    updated_at: string
}

export interface InvoiceItem {
    id?: number
    description: string
    quantity: number
    unit_price: number
    total: number
}

export interface InvoiceCreate {
    client_id: number
    invoice_number: string
    issue_date: string
    due_date: string
    tax_rate?: number
    discount?: number
    notes?: string
    items: Omit<InvoiceItem, 'id'>[]
}

export interface InvoiceUpdate {
    client_id?: number
    invoice_number?: string
    issue_date?: string
    due_date?: string
    status?: Invoice['status']
    tax_rate?: number
    discount?: number
    notes?: string
    items?: Omit<InvoiceItem, 'id'>[]
}
