'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Simple password auth for admin (replace with Supabase auth later)
function AdminAuth({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const token = sessionStorage.getItem('admin_auth');
    if (token === 'authenticated') {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      if (res.ok) {
        sessionStorage.setItem('admin_auth', 'authenticated');
        setIsAuthenticated(true);
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-pb-bg flex items-center justify-center">
        <div className="text-pb-text-muted">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-pb-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="card">
            <div className="card-header text-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pb-green to-pb-orange flex items-center justify-center mx-auto mb-3">
                <span className="font-bold text-black">PB</span>
              </div>
              <h1 className="text-xl font-bold">Admin Login</h1>
              <p className="text-sm text-pb-text-dim mt-1">Enter admin password to continue</p>
            </div>
            <form onSubmit={handleLogin} className="card-body">
              <div className="mb-4">
                <label className="block text-sm text-pb-text-muted mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

// Admin sidebar navigation
function AdminSidebar() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/portfolios', label: 'Portfolios', icon: '💼' },
    { href: '/admin/alerts', label: 'Trade Alerts', icon: '🔔' },
    { href: '/admin/users', label: 'Users', icon: '👥' },
    { href: '/admin/broadcasts', label: 'Broadcasts', icon: '📢' },
    { href: '/admin/claude', label: 'AI Assistant', icon: '🤖' },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    window.location.reload();
  };

  return (
    <aside className="w-64 bg-pb-bg-card border-r border-pb-border min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-pb-border">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pb-green to-pb-orange flex items-center justify-center">
            <span className="font-bold text-black text-sm">PB</span>
          </div>
          <div>
            <div className="font-semibold text-white text-sm">Portfolio Builder</div>
            <div className="text-xs text-pb-text-dim">Admin Panel</div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-pb-green/10 text-pb-green'
                      : 'text-pb-text-muted hover:bg-pb-bg-elevated hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-pb-border">
        <Link href="/" className="flex items-center gap-2 text-sm text-pb-text-muted hover:text-white mb-3">
          ← Back to Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full btn btn-secondary text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminAuth>
      <div className="flex min-h-screen bg-pb-bg">
        <AdminSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </AdminAuth>
  );
}
