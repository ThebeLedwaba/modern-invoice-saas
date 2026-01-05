import React, { useState, useEffect } from 'react';
import { getInvoices, createInvoice, deleteInvoice } from '../lib/invoices';
import { getClients } from '../lib/clients';
import type { Invoice, Client } from '../types';

const Invoices: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        client_id: '',
        due_date: '',
        tax_rate: 0,
        discount_amount: 0,
        items: [{ description: '', quantity: 1, unit_price: 0 }],
        notes: '',
        terms: '',
    });

    useEffect(() => {
        loadInvoices();
        loadClients();
    }, []);

    const loadInvoices = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getInvoices();
            setInvoices(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    const loadClients = async () => {
        try {
            const data = await getClients();
            setClients(data);
        } catch (err: any) {
            console.error('Failed to load clients');
        }
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        newItems[index] = { ...newItems[index], [field]: value };
        setFormData({ ...formData, items: newItems });
    };

    const handleAddItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', quantity: 1, unit_price: 0 }],
        });
    };

    const handleRemoveItem = (index: number) => {
        setFormData({
            ...formData,
            items: formData.items.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.client_id || formData.items.some((i) => !i.description || !i.unit_price)) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            await createInvoice({
                client_id: parseInt(formData.client_id),
                due_date: formData.due_date,
                tax_rate: formData.tax_rate,
                discount_amount: formData.discount_amount,
                items: formData.items,
                notes: formData.notes,
                terms: formData.terms,
            });
            await loadInvoices();
            setShowForm(false);
            setFormData({
                client_id: '',
                due_date: '',
                tax_rate: 0,
                discount_amount: 0,
                items: [{ description: '', quantity: 1, unit_price: 0 }],
                notes: '',
                terms: '',
            });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create invoice');
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this invoice?')) {
            try {
                await deleteInvoice(id);
                await loadInvoices();
            } catch (err: any) {
                setError(err.response?.data?.detail || 'Failed to delete invoice');
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            case 'sent':
                return 'bg-blue-100 text-blue-800';
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'overdue':
                return 'bg-red-100 text-red-800';
            case 'cancelled':
                return 'bg-gray-400 text-gray-100';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getClientName = (clientId: number) => {
        const client = clients.find((c) => c.id === clientId);
        return client?.name || 'Unknown Client';
    };

    return (
        <div className="min-h-screen bg-slate-50 font-body">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Invoice Management</h1>
                            <p className="text-gray-600">Create and manage professional invoices</p>
                        </div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                        >
                            {showForm ? (
                                <>
                                    <span>✕</span>
                                    <span>Cancel</span>
                                </>
                            ) : (
                                <>
                                    <span>+</span>
                                    <span>New Invoice</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                        <span>{error}</span>
                    </div>
                )}

                {showForm && (
                    <div className="bg-white rounded-xl shadow-md p-8 mb-8 border-t-4 border-indigo-600">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                                <span>📄</span>
                            </div>
                            Create New Invoice
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Client <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.client_id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, client_id: e.target.value })
                                        }
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option value="">Select a client</option>
                                        {clients.map((client) => (
                                            <option key={client.id} value={client.id}>
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Due Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.due_date}
                                        onChange={(e) =>
                                            setFormData({ ...formData, due_date: e.target.value })
                                        }
                                        required
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tax Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.tax_rate}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                tax_rate: parseFloat(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Discount Amount
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.discount_amount}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                discount_amount: parseFloat(e.target.value),
                                            })
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            {/* Invoice Items */}
                            <div className="border-t-2 border-gray-100 pt-6">
                                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">📋</span>
                                    Invoice Items
                                </h3>
                                {formData.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(e) =>
                                                handleItemChange(index, 'description', e.target.value)
                                            }
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Quantity"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleItemChange(index, 'quantity', parseFloat(e.target.value))
                                            }
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Unit Price"
                                            value={item.unit_price}
                                            onChange={(e) =>
                                                handleItemChange(index, 'unit_price', parseFloat(e.target.value))
                                            }
                                            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddItem}
                                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition font-semibold"
                                >
                                    + Add Item
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-2 border-gray-100 pt-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Notes
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) =>
                                            setFormData({ ...formData, notes: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        rows={3}
                                        placeholder="Add payment instructions or special notes..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Terms
                                    </label>
                                    <textarea
                                        value={formData.terms}
                                        onChange={(e) =>
                                            setFormData({ ...formData, terms: e.target.value })
                                        }
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        rows={3}
                                        placeholder="Payment terms and conditions..."
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 border-t-2 border-gray-100 pt-6">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                                >
                                    Create Invoice
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="inline-block">
                            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                        </div>
                        <p className="text-gray-600 text-lg">Loading invoices...</p>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📄</span>
                        </div>
                        <p className="text-gray-600 text-lg">No invoices yet. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Invoice #
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Client
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Due Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-indigo-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        {invoice.invoice_number.charAt(0).toUpperCase()}
                                                    </div>
                                                    {invoice.invoice_number}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {getClientName(invoice.client_id)}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                                                        invoice.status
                                                    )}`}
                                                >
                                                    {invoice.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(invoice.due_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                                <span className="text-indigo-600">${invoice.total.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right space-x-3">
                                                <button className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1 rounded-lg font-semibold transition-all">
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(invoice.id)}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded-lg font-semibold transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Invoices;
