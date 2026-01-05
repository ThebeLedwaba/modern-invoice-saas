import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col font-body">
            {/* Welcome Section */}
            <div className="mb-10 animate-slide-up">
                <h1 className="text-4xl font-heading font-bold text-slate-900 mb-2">
                    Good Morning, <span className="text-gradient">{user?.full_name || user?.username}</span>
                </h1>
                <p className="text-slate-500">Here's what's happening with your business today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                {/* Total Clients Card */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-brand-50 text-brand-600 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        </div>
                        <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium mb-1">Total Clients</p>
                    <h3 className="text-3xl font-bold text-slate-900">0</h3>
                </div>

                {/* Total Invoices Card */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-accent-50 text-accent-600 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+5%</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium mb-1">Total Invoices</p>
                    <h3 className="text-3xl font-bold text-slate-900">0</h3>
                </div>

                {/* Revenue Card */}
                <div className="bg-white rounded-2xl p-6 shadow-soft border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <span className="flex items-center text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+24%</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-bold text-slate-900">$0.00</h3>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                {/* Manage Clients Card */}
                <Link to="/clients" className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-soft border border-slate-100 hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-32 h-32 text-brand-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">Manage Clients</h3>
                        <p className="text-slate-500 mb-6 max-w-xs">Add, edit, and manage all your client information in one place.</p>
                        <span className="inline-flex items-center font-semibold text-brand-600 group-hover:translate-x-1 transition-transform">
                            Go to Clients <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                    </div>
                </Link>

                {/* Create Invoices Card */}
                <Link to="/invoices" className="group relative overflow-hidden rounded-2xl bg-white p-8 shadow-soft border border-slate-100 hover:shadow-xl transition-all duration-300">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <svg className="w-32 h-32 text-accent-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-accent-600 transition-colors">Create Invoices</h3>
                        <p className="text-slate-500 mb-6 max-w-xs">Generate professional invoices with custom line items and tax calculations.</p>
                        <span className="inline-flex items-center font-semibold text-accent-600 group-hover:translate-x-1 transition-transform">
                            Create Invoice <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                    </div>
                </Link>
            </div>

            {/* Quick Stats - simplified */}
            <div className="bg-white rounded-2xl shadow-soft p-8 border border-slate-100 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Getting Started</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-50 text-brand-600 font-bold text-lg">1</div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-1">Create Clients</h4>
                            <p className="text-slate-500 text-sm">Add your client details to get started.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-50 text-accent-600 font-bold text-lg">2</div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-1">Generate Invoices</h4>
                            <p className="text-slate-500 text-sm">Create and assign professional invoices.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 font-bold text-lg">3</div>
                        <div>
                            <h4 className="font-semibold text-slate-900 mb-1">Track Payments</h4>
                            <p className="text-slate-500 text-sm">Monitor your revenue flow.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
