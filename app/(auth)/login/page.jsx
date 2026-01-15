'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [method, setMethod] = useState('email'); // 'email' or 'phone'
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier) return;
    
    setLoading(true);
    setError('');
    
    // Simulate sending OTP
    await new Promise(r => setTimeout(r, 1000));
    
    // In production, this would call /api/auth/send-code
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-pb-bg flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pb-green to-pb-orange flex items-center justify-center">
                <span className="font-bold text-black">PB</span>
              </div>
              <span className="font-semibold text-lg">Portfolio Builder</span>
            </Link>
          </div>

          <div className="card">
            <div className="card-body text-center">
              <div className="text-4xl mb-4">✉️</div>
              <h2 className="text-xl font-bold mb-2">Check your {method === 'email' ? 'inbox' : 'phone'}</h2>
              <p className="text-pb-text-muted mb-6">
                We sent a login code to <span className="text-white font-medium">{identifier}</span>
              </p>
              <Link href="/verify" className="btn btn-primary w-full mb-4">
                Enter Code
              </Link>
              <button 
                onClick={() => setSent(false)} 
                className="text-sm text-pb-text-muted hover:text-white"
              >
                Use a different {method}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pb-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pb-green to-pb-orange flex items-center justify-center">
              <span className="font-bold text-black">PB</span>
            </div>
            <span className="font-semibold text-lg">Portfolio Builder</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-pb-text-muted mt-1">Sign in to your account</p>
        </div>

        <div className="card">
          <div className="card-body">
            {/* Method Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setMethod('email')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  method === 'email' 
                    ? 'bg-pb-bg-elevated text-white' 
                    : 'text-pb-text-muted hover:text-white'
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setMethod('phone')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  method === 'phone' 
                    ? 'bg-pb-bg-elevated text-white' 
                    : 'text-pb-text-muted hover:text-white'
                }`}
              >
                Phone
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm text-pb-text-muted mb-2">
                  {method === 'email' ? 'Email address' : 'Phone number'}
                </label>
                <input
                  type={method === 'email' ? 'email' : 'tel'}
                  className={`input ${method === 'phone' ? 'font-mono' : ''}`}
                  placeholder={method === 'email' ? 'you@example.com' : '+1 (555) 000-0000'}
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  autoFocus
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading || !identifier}
              >
                {loading ? 'Sending code...' : 'Continue'}
              </button>
            </form>

            <p className="text-xs text-pb-text-dim text-center mt-4">
              We'll send you a one-time login code
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-pb-text-muted mt-6">
          Don't have an account?{' '}
          <Link href="/signup" className="text-pb-green hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
