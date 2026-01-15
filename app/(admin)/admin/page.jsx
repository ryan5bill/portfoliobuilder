'use client';

import Link from 'next/link';
import { PORTFOLIO_DATA, TRADE_ALERTS } from '@/lib/sampleData';
import { calculateTotalReturn, calculatePortfolioValue, formatCurrency, formatPercent } from '@/lib/theme';

export default function AdminDashboard() {
  const hrgp = PORTFOLIO_DATA.portfolios.HRGP;
  const sfgp = PORTFOLIO_DATA.portfolios.SFGP;
  
  const stats = [
    {
      label: 'HRGP Return',
      value: formatPercent(calculateTotalReturn(hrgp.monthlyReturns)),
      color: '#00d4aa',
    },
    {
      label: 'SFGP Return',
      value: formatPercent(calculateTotalReturn(sfgp.monthlyReturns)),
      color: '#ff6b00',
    },
    {
      label: 'Trade Alerts',
      value: TRADE_ALERTS.length,
      color: '#ffffff',
    },
    {
      label: 'Last Updated',
      value: new Date().toLocaleDateString(),
      color: '#888888',
    },
  ];

  const quickActions = [
    { label: 'Edit HRGP Positions', href: '/admin/portfolios?portfolio=HRGP', icon: '💼' },
    { label: 'Edit SFGP Positions', href: '/admin/portfolios?portfolio=SFGP', icon: '💼' },
    { label: 'Post Trade Alert', href: '/admin/alerts', icon: '🔔' },
    { label: 'Send Broadcast', href: '/admin/broadcasts', icon: '📢' },
    { label: 'Ask Claude', href: '/admin/claude', icon: '🤖' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-pb-text-muted">Manage portfolios, alerts, and users</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="card">
            <div className="card-body">
              <div className="text-sm text-pb-text-dim mb-1">{stat.label}</div>
              <div className="text-2xl font-bold font-mono" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {quickActions.map((action, i) => (
            <Link
              key={i}
              href={action.href}
              className="card hover:border-pb-border-light transition-colors"
            >
              <div className="card-body text-center py-6">
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm">{action.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Trade Alerts</h2>
          <Link href="/admin/alerts" className="text-sm text-pb-green hover:underline">
            View All →
          </Link>
        </div>
        <div className="card">
          <div className="card-body p-0">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Portfolio</th>
                  <th>Ticker</th>
                  <th>Action</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {TRADE_ALERTS.slice(0, 5).map((alert) => (
                  <tr key={alert.id}>
                    <td className="font-mono text-pb-text-muted">{alert.date}</td>
                    <td>
                      <span 
                        className="px-2 py-0.5 rounded text-xs font-mono"
                        style={{ 
                          backgroundColor: alert.portfolio === 'HRGP' ? '#00d4aa20' : alert.portfolio === 'SFGP' ? '#ff6b0020' : '#ffffff10',
                          color: alert.portfolio === 'HRGP' ? '#00d4aa' : alert.portfolio === 'SFGP' ? '#ff6b00' : '#888'
                        }}
                      >
                        {alert.portfolio}
                      </span>
                    </td>
                    <td className="font-mono font-semibold">{alert.ticker}</td>
                    <td>
                      <span className={`badge ${alert.action === 'BUY' ? 'badge-buy' : alert.action === 'SELL' ? 'badge-sell' : 'badge-hold'}`}>
                        {alert.action}
                      </span>
                    </td>
                    <td className="text-pb-text-muted text-sm">{alert.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Portfolio Summary</h2>
        <div className="grid lg:grid-cols-2 gap-4">
          {/* HRGP */}
          <div className="card" style={{ borderColor: '#00d4aa40' }}>
            <div className="card-header flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-pb-green">HRGP</span>
                <h3 className="font-semibold">{hrgp.name}</h3>
              </div>
              <Link href="/admin/portfolios?portfolio=HRGP" className="btn btn-secondary text-sm">
                Edit
              </Link>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-pb-text-dim">Return</div>
                  <div className="font-mono text-pb-green">{formatPercent(calculateTotalReturn(hrgp.monthlyReturns))}</div>
                </div>
                <div>
                  <div className="text-pb-text-dim">Value</div>
                  <div className="font-mono">{formatCurrency(calculatePortfolioValue(hrgp.positions))}</div>
                </div>
                <div>
                  <div className="text-pb-text-dim">Positions</div>
                  <div className="font-mono">{hrgp.positions.length}</div>
                </div>
              </div>
            </div>
          </div>

          {/* SFGP */}
          <div className="card" style={{ borderColor: '#ff6b0040' }}>
            <div className="card-header flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-pb-orange">SFGP</span>
                <h3 className="font-semibold">{sfgp.name}</h3>
              </div>
              <Link href="/admin/portfolios?portfolio=SFGP" className="btn btn-secondary text-sm">
                Edit
              </Link>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-pb-text-dim">Return</div>
                  <div className="font-mono text-pb-orange">{formatPercent(calculateTotalReturn(sfgp.monthlyReturns))}</div>
                </div>
                <div>
                  <div className="text-pb-text-dim">Value</div>
                  <div className="font-mono">{formatCurrency(calculatePortfolioValue(sfgp.positions))}</div>
                </div>
                <div>
                  <div className="text-pb-text-dim">Positions</div>
                  <div className="font-mono">{sfgp.positions.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
