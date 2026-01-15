'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header({ showNav = true }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-pb-border bg-pb-bg/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pb-green to-pb-orange flex items-center justify-center">
              <span className="font-bold text-black text-sm">PB</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-semibold text-white">Portfolio Builder</div>
              <div className="text-xs text-pb-text-dim font-mono">pbtracker.app</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {showNav && (
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/portfolio/HRGP" className="text-sm text-pb-text-muted hover:text-white transition-colors">
                High-Risk Growth
              </Link>
              <Link href="/portfolio/SFGP" className="text-sm text-pb-text-muted hover:text-white transition-colors">
                Safe Growth
              </Link>
              <Link href="/calculator" className="text-sm text-pb-text-muted hover:text-white transition-colors">
                Calculator
              </Link>
            </nav>
          )}

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-ghost text-sm">
              Log In
            </Link>
            <Link href="/signup" className="btn btn-primary text-sm">
              Sign Up
            </Link>
            
            {/* Mobile menu button */}
            {showNav && (
              <button 
                className="md:hidden p-2 text-pb-text-muted hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {showNav && mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-pb-border">
            <div className="flex flex-col gap-2">
              <Link href="/portfolio/HRGP" className="px-3 py-2 text-sm text-pb-text-muted hover:text-white hover:bg-pb-bg-elevated rounded-lg transition-colors">
                High-Risk Growth
              </Link>
              <Link href="/portfolio/SFGP" className="px-3 py-2 text-sm text-pb-text-muted hover:text-white hover:bg-pb-bg-elevated rounded-lg transition-colors">
                Safe Growth
              </Link>
              <Link href="/calculator" className="px-3 py-2 text-sm text-pb-text-muted hover:text-white hover:bg-pb-bg-elevated rounded-lg transition-colors">
                Calculator
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
