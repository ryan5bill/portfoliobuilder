'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [step, setStep] = useState(1); // 1: info, 2: verify
  const [method, setMethod] = useState('email');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    following: 'HRGP'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (method === 'email' && !form.email) {
      setError('Email is required');
      return;
    }
    if (method === 'phone' && !form.phone) {
      setError('Phone is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    
    // In production, this would call /api/auth/signup
    setStep(2);
    setLoading(false);
  };

  if (step === 2) {
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
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-xl font-bold mb-2">Check your {method === 'email' ? 'inbox' : 'phone'}</h2>
              <p className="text-pb-text-muted mb-6">
                We sent a verification code to{' '}
                <span className="text-white font-medium">
                  {method === 'email' ? form.email : form.phone}
                </span>
              </p>
              <Link href="/verify" className="btn btn-primary w-full mb-4">
                Enter Code
              </Link>
              <button 
                onClick={() => setStep(1)} 
                className="text-sm text-pb-text-muted hover:text-white"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pb-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pb-green to-pb-orange flex items-center justify-center">
              <span className="font-bold text-black">PB</span>
            </div>
            <span className="font-semibold text-lg">Portfolio Builder</span>
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-pb-text-muted mt-1">Start tracking portfolios today</p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm text-pb-text-muted mb-2">Name (optional)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                />
              </div>

              {/* Method Toggle */}
              <div>
                <label className="block text-sm text-pb-text-muted mb-2">Sign up with</label>
                <div className="flex gap-2">
                  <button
                    type="button"
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
                    type="button"
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
              </div>

              {/* Email/Phone Input */}
              {method === 'email' ? (
                <div>
                  <label className="block text-sm text-pb-text-muted mb-2">Email address</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    autoFocus
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm text-pb-text-muted mb-2">Phone number</label>
                  <input
                    type="tel"
                    className="input font-mono"
                    placeholder="+1 (555) 000-0000"
                    value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})}
                    autoFocus
                  />
                </div>
              )}

              {/* Portfolio Selection */}
              <div>
                <label className="block text-sm text-pb-text-muted mb-2">Which portfolio interests you?</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({...form, following: 'HRGP'})}
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      form.following === 'HRGP'
                        ? 'border-pb-green bg-pb-green/10'
                        : 'border-pb-border hover:border-pb-border-light'
                    }`}
                  >
                    <div className="text-xs font-mono text-pb-green mb-1">HRGP</div>
                    <div className="font-semibold text-sm">High-Risk Growth</div>
                    <div className="text-xs text-pb-text-dim mt-1">AI & Crypto focused</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({...form, following: 'SFGP'})}
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      form.following === 'SFGP'
                        ? 'border-pb-orange bg-pb-orange/10'
                        : 'border-pb-border hover:border-pb-border-light'
                    }`}
                  >
                    <div className="text-xs font-mono text-pb-orange mb-1">SFGP</div>
                    <div className="font-semibold text-sm">Safe Growth</div>
                    <div className="text-xs text-pb-text-dim mt-1">Steady, diversified</div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-xs text-pb-text-dim text-center mt-4">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-pb-green hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-pb-green hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-pb-text-muted mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-pb-green hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
