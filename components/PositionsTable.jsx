'use client';

import { formatCurrency, formatPercent, calculatePortfolioValue } from '@/lib/theme';

export default function PositionsTable({ portfolio }) {
  const totalValue = calculatePortfolioValue(portfolio.positions);

  if (portfolio.positions.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">Current Positions</h3>
        </div>
        <div className="card-body text-center text-pb-text-muted py-12">
          No positions data available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="font-semibold">Current Positions</h3>
        <span className="font-mono text-sm" style={{ color: portfolio.color }}>
          {formatCurrency(totalValue)}
        </span>
      </div>
      <div className="card-body overflow-x-auto p-0">
        <table className="table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Name</th>
              <th className="text-right">Shares</th>
              <th className="text-right">Entry</th>
              <th className="text-right">Current</th>
              <th className="text-right">Value</th>
              <th className="text-right">P&L</th>
              <th className="text-center">Type</th>
              <th className="text-center">Ratio</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.positions.map((position, index) => {
              const value = position.shares * position.currentPrice;
              const pnl = ((position.currentPrice - position.entryPrice) / position.entryPrice) * 100;
              
              return (
                <tr key={index}>
                  <td className="font-mono font-semibold" style={{ color: portfolio.color }}>
                    {position.ticker}
                  </td>
                  <td className="text-pb-text-muted">{position.name}</td>
                  <td className="font-mono text-right">
                    {position.shares % 1 === 0 ? position.shares : position.shares.toFixed(2)}
                  </td>
                  <td className="font-mono text-right">${position.entryPrice.toFixed(2)}</td>
                  <td className="font-mono text-right">${position.currentPrice.toFixed(2)}</td>
                  <td className="font-mono text-right">{formatCurrency(value)}</td>
                  <td className="font-mono text-right" style={{ color: pnl >= 0 ? '#00d4aa' : '#ff6b00' }}>
                    {formatPercent(pnl)}
                  </td>
                  <td className="text-center">
                    <span className={`badge ${position.type === 'offense' ? 'badge-buy' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {position.type}
                    </span>
                  </td>
                  <td className="font-mono text-center">{position.ratio}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
