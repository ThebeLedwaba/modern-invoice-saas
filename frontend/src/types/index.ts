export interface User {
    id: number;
    email: string;
    username: string;
    full_name: string | null;
    is_active: boolean;
    is_superuser: boolean;
    created_at: string;
    updated_at: string;
}

export interface Client {
    id: number;
    user_id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country: string | null;
    tax_id: string | null;
    notes: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface InvoiceItem {
    id?: number;
    invoice_id?: number;
    description: string;
    quantity: number;
    unit_price: number;
    amount?: number;
    created_at?: string;
    updated_at?: string;
}

export interface Invoice {
    id: number;
    user_id: number;
    client_id: number;
    invoice_number: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    issue_date: string;
    due_date: string;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    discount_amount: number;
    total: number;
    notes: string | null;
    terms: string | null;
    created_at: string;
    updated_at: string;
    items: InvoiceItem[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    username: string;
    full_name?: string;
    password: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}
