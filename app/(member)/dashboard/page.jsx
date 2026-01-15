'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PORTFOLIO_DATA, TRADE_ALERTS } from '@/lib/sampleData';
import { calculateTotalReturn, calculatePortfolioValue, formatCurrency, formatPercent } from '@/lib/theme';
import MonthlyReturns from '@/components/MonthlyReturns';
import AlertsFeed from '@/components/AlertsFeed';

export default function DashboardPage() {
  const [activePortfolio, setActivePortfolio] = useState('HRGP');
  const portfolio = PORTFOLIO_DATA.portfolios[activePortfolio];
  
  const hrgp = PORTFOLIO_DATA.portfolios.HRGP;
  const sfgp = PORTFOLIO_DATA.portfolios.SFGP;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-pb-text-muted">Here's what's happening with your portfolios.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/portfolio/HRGP" className="card hover:border-pb-green/50 transition-colors">
          <div className="card-body">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-pb-green">HRGP</span>
            </div>
            <div className="text-2xl font-bold font-mono text-pb-green">
              {formatPercent(calculateTotalReturn(hrgp.monthlyReturns))}
            </div>
            <div className="text-xs text-pb-text-dim mt-1">High-Risk Growth</div>
          </div>
        </Link>

        <Link href="/portfolio/SFGP" className="card hover:border-pb-orange/50 transition-colors">
          <div className="card-body">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-pb-orange">SFGP</span>
            </div>
            <div className="text-2xl font-bold font-mono text-pb-orange">
              {formatPercent(calculateTotalReturn(sfgp.monthlyReturns))}
            </div>
            <div className="text-xs text-pb-text-dim mt-1">Safe Growth</div>
          </div>
        </Link>

        <div className="card">
          <div className="card-body">
            <div className="text-xs text-pb-text-dim mb-2">Recent Alerts</div>
            <div className="text-2xl font-bold font-mono">{TRADE_ALERTS.length}</div>
            <div className="text-xs text-pb-text-dim mt-1">This month</div>
          </div>
        </div>

        <Link href="/my-portfolio" className="card hover:border-pb-border-light transition-colors">
          <div className="card-body">
            <div className="text-xs text-pb-text-dim mb-2">My Portfolio</div>
            <div className="text-2xl font-bold font-mono">—</div>
            <div className="text-xs text-pb-green mt-1">Start tracking →</div>
          </div>
        </Link>
      </div>

      {/* Portfolio Selector */}
      <div className="flex gap-3">
        <button
          onClick={() => setActivePortfolio('HRGP')}
          className={`portfolio-tab hrgp ${activePortfolio === 'HRGP' ? 'active' : ''}`}
        >
          HRGP – High-Risk Growth
        </button>
        <button
          onClick={() => setActivePortfolio('SFGP')}
          className={`portfolio-tab sfgp ${activePortfolio === 'SFGP' ? 'active' : ''}`}
        >
          SFGP – Safe Growth
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="card" style={{ borderColor: portfolio.color + '40' }}>
        <div className="card-header flex items-center justify-between">
          <div>
            <span className="text-xs font-mono" style={{ color: portfolio.color }}>{portfolio.ticker}</span>
            <h2 className="font-semibold">{portfolio.name}</h2>
          </div>
          <Link href={`/portfolio/${portfolio.ticker}`} className="btn btn-secondary text-sm">
            View Full Details →
          </Link>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-pb-text-dim mb-1">Total Return</div>
              <div className="text-xl font-bold font-mono" style={{ color: portfolio.color }}>
                {formatPercent(calculateTotalReturn(portfolio.monthlyReturns))}
              </div>
            </div>
            <div>
              <div className="text-xs text-pb-text-dim mb-1">Current Value</div>
              <div className="text-xl font-bold font-mono">
                {formatCurrency(calculatePortfolioValue(portfolio.positions))}
              </div>
            </div>
            <div>
              <div className="text-xs text-pb-text-dim mb-1">Positions</div>
              <div className="text-xl font-bold font-mono">{portfolio.positions.length}</div>
            </div>
            <div>
              <div className="text-xs text-pb-text-dim mb-1">Since</div>
              <div className="text-xl font-bold font-mono">
                {new Date(portfolio.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Returns */}
      <MonthlyReturns portfolio={portfolio} />

      {/* Current Positions */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="font-semibold">Current Positions</h3>
          <Link href="/calculator" className="text-sm text-pb-green hover:underline">
            Calculate My Allocation →
          </Link>
        </div>
        <div className="card-body p-0 overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Name</th>
                <th className="text-right">Shares</th>
                <th className="text-right">Price</th>
                <th className="text-right">Value</th>
                <th className="text-center">Ratio</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.positions.map((pos, i) => (
                <tr key={i}>
                  <td className="font-mono font-semibold" style={{ color: portfolio.color }}>{pos.ticker}</td>
                  <td className="text-pb-text-muted">{pos.name}</td>
                  <td className="font-mono text-right">{pos.shares}</td>
                  <td className="font-mono text-right">${pos.currentPrice.toFixed(2)}</td>
                  <td className="font-mono text-right">{formatCurrency(pos.shares * pos.currentPrice)}</td>
                  <td className="font-mono text-center">{pos.ratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Alerts */}
      <AlertsFeed alerts={TRADE_ALERTS} limit={5} />
    </div>
  );
}
