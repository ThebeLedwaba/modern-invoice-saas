import React, { useState, useEffect } from 'react';
import { getClients, createClient, updateClient, deleteClient } from '../lib/clients';
import type { Client } from '../types';

const Clients: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        tax_id: '',
        notes: '',
    });

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getClients();
            setClients(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to load clients');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            if (editingId) {
                await updateClient(editingId, formData);
            } else {
                await createClient(formData);
            }
            await loadClients();
            setShowForm(false);
            setEditingId(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                postal_code: '',
                country: '',
                tax_id: '',
                notes: '',
            });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to save client');
        }
    };

    const handleEdit = (client: Client) => {
        setFormData({
            name: client.name,
            email: client.email,
            phone: client.phone || '',
            address: client.address || '',
            city: client.city || '',
            state: client.state || '',
            postal_code: client.postal_code || '',
            country: client.country || '',
            tax_id: client.tax_id || '',
            notes: client.notes || '',
        });
        setEditingId(client.id);
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this client?')) {
            try {
                await deleteClient(id);
                await loadClients();
            } catch (err: any) {
                setError(err.response?.data?.detail || 'Failed to delete client');
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-body">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Client Management</h1>
                            <p className="text-gray-600">Manage and organize all your business clients</p>
                        </div>
                        <button
                            onClick={() => {
                                setShowForm(!showForm);
                                setEditingId(null);
                                setFormData({
                                    name: '',
                                    email: '',
                                    phone: '',
                                    address: '',
                                    city: '',
                                    state: '',
                                    postal_code: '',
                                    country: '',
                                    tax_id: '',
                                    notes: '',
                                });
                            }}
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
                                    <span>New Client</span>
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
                                <span>{editingId ? '✎' : '+'}</span>
                            </div>
                            {editingId ? 'Edit Client' : 'New Client'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Company name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="client@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tax ID
                                </label>
                                <input
                                    type="text"
                                    name="tax_id"
                                    value={formData.tax_id}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Tax ID or VAT number"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Street address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="State/Province"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Postal Code
                                </label>
                                <input
                                    type="text"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="ZIP code"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    placeholder="Country"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    rows={3}
                                    placeholder="Add any additional notes about this client..."
                                />
                            </div>
                            <div className="md:col-span-2 flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                                >
                                    {editingId ? 'Update' : 'Create'} Client
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
                        <p className="text-gray-600 text-lg">Loading clients...</p>
                    </div>
                ) : clients.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">📋</span>
                        </div>
                        <p className="text-gray-600 text-lg">No clients yet. Create one to get started!</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            City
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-indigo-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                        {client.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    {client.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {client.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {client.phone || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {client.city || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right space-x-3">
                                                <button
                                                    onClick={() => handleEdit(client)}
                                                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1 rounded-lg font-semibold transition-all"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
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

export default Clients;
