'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newCode = [...code];
    
    // Handle paste
    if (value.length > 1) {
      const digits = value.slice(0, 6).split('');
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newCode[index + i] = digit;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    newCode[index] = value;
    setCode(newCode);

    // Auto-advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) return;

    setLoading(true);
    setError('');

    // Simulate verification
    await new Promise(r => setTimeout(r, 1000));

    // In production, this would call /api/auth/verify
    // For demo, accept any 6-digit code
    if (fullCode === '123456') {
      router.push('/dashboard');
    } else {
      setError('Invalid code. Try 123456 for demo.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    // Simulate resend
    await new Promise(r => setTimeout(r, 500));
    alert('Code resent! (Demo: use 123456)');
  };

  const isComplete = code.every(c => c !== '');

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
          <h1 className="text-2xl font-bold">Enter verification code</h1>
          <p className="text-pb-text-muted mt-1">We sent a 6-digit code to your email/phone</p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Code Input */}
              <div className="flex gap-2 justify-center mb-6">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-mono font-bold bg-pb-bg border border-pb-border rounded-lg focus:outline-none focus:border-pb-green transition-colors"
                  />
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full mb-4"
                disabled={loading || !isComplete}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-pb-text-muted hover:text-white"
                >
                  Didn't receive a code? <span className="text-pb-green">Resend</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-pb-text-muted mt-6">
          <Link href="/login" className="text-pb-green hover:underline">
            ← Back to login
          </Link>
        </p>

        {/* Demo hint */}
        <div className="mt-6 p-3 bg-pb-bg-elevated rounded-lg text-center">
          <p className="text-xs text-pb-text-dim">Demo: Enter <span className="font-mono text-pb-green">123456</span> to continue</p>
        </div>
      </div>
    </div>
  );
}
