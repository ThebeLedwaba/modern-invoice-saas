import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ username, password });
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Login failed. Please try again.');
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
                        Streamline your invoicing workflow today.
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-brand-100">
                            <CheckCircle2 className="w-5 h-5 text-brand-400" />
                            <span>Automated client management</span>
                        </div>
                        <div className="flex items-center space-x-3 text-brand-100">
                            <CheckCircle2 className="w-5 h-5 text-brand-400" />
                            <span>Professional invoice templates</span>
                        </div>
                        <div className="flex items-center space-x-3 text-brand-100">
                            <CheckCircle2 className="w-5 h-5 text-brand-400" />
                            <span>Real-time revenue tracking</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-brand-300">
                    © 2024 InvoicePro Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl shadow-soft border border-slate-100">
                    <div className="mb-8 text-center sm:text-left">
                        <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Welcome back</h1>
                        <p className="text-slate-500">Please enter your details to sign in.</p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm px-4 py-3 rounded-lg mb-6 flex items-start">
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label htmlFor="username" className="block text-sm font-semibold text-slate-700">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                    Password
                                </label>
                                <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700">Forgot password?</a>
                            </div>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-600 text-white py-3.5 rounded-xl font-semibold hover:bg-brand-700 active:scale-[0.99] transition-all flex items-center justify-center shadow-lg shadow-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                'Signing in...'
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">
                                Sign up for free
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
