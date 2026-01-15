'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MemberLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/calculator', label: 'Calculator', icon: '🧮' },
    { href: '/my-portfolio', label: 'My Portfolio', icon: '💼' },
    { href: '/alerts', label: 'Trade Alerts', icon: '🔔' },
    { href: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-pb-bg">
      {/* Header */}
      <header className="border-b border-pb-border bg-pb-bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-pb-green to-pb-orange flex items-center justify-center">
                <span className="font-bold text-black text-sm">PB</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-semibold text-white text-sm">Portfolio Builder</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-pb-bg-elevated text-white'
                        : 'text-pb-text-muted hover:text-white hover:bg-pb-bg-elevated/50'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Link href="/settings" className="w-8 h-8 rounded-full bg-pb-bg-elevated flex items-center justify-center text-sm">
                👤
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden border-t border-pb-border overflow-x-auto">
          <div className="flex px-4 py-2 gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-pb-bg-elevated text-white'
                      : 'text-pb-text-muted'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
    </div>
  );
}
