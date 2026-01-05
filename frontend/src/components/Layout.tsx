import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Bell,
  Search,
  Menu
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/clients', label: 'Clients', icon: Users },
    { path: '/invoices', label: 'Invoices', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-body text-slate-900 flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 shadow-soft hidden lg:flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-brand-500/30">
            <span className="text-white font-heading font-bold text-xl">I</span>
          </div>
          <span className="font-heading font-bold text-2xl text-slate-900 tracking-tight">InvoicePro</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive
                    ? 'bg-brand-50 text-brand-600 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-600" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-md">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="ml-3 flex-1 overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user?.full_name || user?.username}</p>
              <p className="text-xs text-slate-500 truncate">Pro Plan</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center">
            <button className="lg:hidden p-2 -ml-2 mr-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search invoices, clients..."
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-brand-500/20 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}