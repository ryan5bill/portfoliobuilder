'use client';

import { useState } from 'react';
import { PORTFOLIO_DATA } from '@/lib/sampleData';
import Calculator from '@/components/Calculator';
import { calculateTotalReturn, formatPercent } from '@/lib/theme';

export default function CalculatorPage() {
  const [activePortfolio, setActivePortfolio] = useState('HRGP');
  const portfolio = PORTFOLIO_DATA.portfolios[activePortfolio];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Position Calculator</h1>
        <p className="text-pb-text-muted">
          Enter your investment amount to calculate exact share allocations.
        </p>
      </div>

      {/* Portfolio Selector */}
      <div className="flex gap-3">
        <button
          onClick={() => setActivePortfolio('HRGP')}
          className={`portfolio-tab hrgp ${activePortfolio === 'HRGP' ? 'active' : ''}`}
        >
          HRGP – {formatPercent(calculateTotalReturn(PORTFOLIO_DATA.portfolios.HRGP.monthlyReturns))}
        </button>
        <button
          onClick={() => setActivePortfolio('SFGP')}
          className={`portfolio-tab sfgp ${activePortfolio === 'SFGP' ? 'active' : ''}`}
        >
          SFGP – {formatPercent(calculateTotalReturn(PORTFOLIO_DATA.portfolios.SFGP.monthlyReturns))}
        </button>
      </div>

      {/* Calculator */}
      <Calculator portfolio={portfolio} />

      {/* How It Works */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">How It Works</h3>
        </div>
        <div className="card-body">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="w-10 h-10 rounded-lg bg-pb-green/10 flex items-center justify-center mb-3">
                <span className="text-pb-green">1</span>
              </div>
              <h4 className="font-semibold mb-2">Enter Amount</h4>
              <p className="text-sm text-pb-text-muted">
                Input how much you want to invest. This could be your initial investment or an amount to add.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-pb-green/10 flex items-center justify-center mb-3">
                <span className="text-pb-green">2</span>
              </div>
              <h4 className="font-semibold mb-2">Get Allocations</h4>
              <p className="text-sm text-pb-text-muted">
                The calculator divides your investment by the unit cost to determine your units, then allocates shares by each position's ratio.
              </p>
            </div>
            <div>
              <div className="w-10 h-10 rounded-lg bg-pb-green/10 flex items-center justify-center mb-3">
                <span className="text-pb-green">3</span>
              </div>
              <h4 className="font-semibold mb-2">Execute Trades</h4>
              <p className="text-sm text-pb-text-muted">
                Copy the share counts and place your orders. Round down to whole shares if your broker doesn't support fractional.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Cost Explanation */}
      <div className="card bg-pb-bg-elevated border-pb-border-light">
        <div className="card-body">
          <h4 className="font-semibold mb-3">Understanding Unit Cost</h4>
          <p className="text-sm text-pb-text-muted mb-4">
            The <span className="text-white font-medium">unit cost</span> is the minimum amount needed to buy one share of each position 
            at its current price, weighted by the position's ratio.
          </p>
          <div className="bg-pb-bg rounded-lg p-4 font-mono text-sm">
            <div className="text-pb-text-dim mb-2">Formula:</div>
            <div className="text-white">
              Unit Cost = Σ (Position Price × Ratio)
            </div>
          </div>
          <p className="text-sm text-pb-text-muted mt-4">
            For example, if {activePortfolio} has positions with ratios 1:1:3:1:2, and you invest 8.33 units, 
            you would buy 8 shares of the 1x positions, 25 shares of the 3x position, and 17 shares of the 2x position.
          </p>
        </div>
      </div>
    </div>
  );
}
