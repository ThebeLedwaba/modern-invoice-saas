import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        full_name: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await register({
                email: formData.email,
                username: formData.username,
                full_name: formData.full_name || undefined,
                password: formData.password,
            });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-body">
            {/* Left Side - Brand & Testimonial */}
            <div className="hidden lg:flex w-1/2 bg-brand-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                    </svg>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                            <span className="font-heading font-bold text-xl">I</span>
                        </div>
                        <span className="font-heading font-bold text-2xl tracking-tight">InvoicePro</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-md">
                    <h2 className="text-4xl font-heading font-bold mb-6 leading-tight">
                        Join thousands of businesses managing their finances better.
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-brand-100">
                            <CheckCircle2 className="w-5 h-5 text-brand-400" />
                            <span>Get paid faster with professional invoices</span>
                        </div>
                        <div className="flex items-center space-x-3 text-brand-100">
                            <CheckCircle2 className="w-5 h-5 text-brand-400" />
                            <span>Track clients and payments effortlessly</span>
                        </div>
                        <div className="flex items-center space-x-3 text-brand-100">
                            <CheckCircle2 className="w-5 h-5 text-brand-400" />
                            <span>Secure, cloud-based data storage</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-brand-300">
                    © 2024 InvoicePro Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 overflow-y-auto">
                <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-soft border border-slate-100">
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Create Account</h1>
                        <p className="text-slate-500">Join us today and start invoicing.</p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm px-4 py-3 rounded-lg mb-6 flex items-start">
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                                    placeholder="Username"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="full_name" className="block text-sm font-semibold text-slate-700">
                                    Full Name
                                </label>
                                <input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                                placeholder="Create a password"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                                placeholder="Confirm your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-semibold hover:bg-brand-700 active:scale-[0.99] transition-all flex items-center justify-center shadow-lg shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'Creating account...' : <>Sign Up <ArrowRight className="w-5 h-5 ml-2" /></>}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500">
                            Already have an account?{' '}
                            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
