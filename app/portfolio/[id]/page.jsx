import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import MonthlyReturns from '@/components/MonthlyReturns';
import PositionsTable from '@/components/PositionsTable';
import Calculator from '@/components/Calculator';
import EquityCurve from '@/components/EquityCurve';
import PerformanceStats from '@/components/PerformanceStats';
import { getPortfolio } from '@/lib/sampleData';
import { calculateTotalReturn, calculatePortfolioValue, formatCurrency, formatPercent } from '@/lib/theme';

export function generateStaticParams() {
  return [{ id: 'HRGP' }, { id: 'SFGP' }];
}

export function generateMetadata({ params }) {
  const portfolio = getPortfolio(params.id);
  if (!portfolio) return { title: 'Portfolio Not Found' };
  
  return {
    title: `${portfolio.name} (${portfolio.ticker}) | Portfolio Builder`,
    description: portfolio.description,
  };
}

export default function PortfolioPage({ params }) {
  const portfolio = getPortfolio(params.id);
  
  if (!portfolio) {
    notFound();
  }

  const totalReturn = calculateTotalReturn(portfolio.monthlyReturns);
  const currentValue = calculatePortfolioValue(portfolio.positions);
  const totalDeposits = portfolio.deposits?.reduce((sum, d) => sum + d.amount, 0) || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Portfolio Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span 
                  className="px-3 py-1 rounded-lg text-sm font-mono font-semibold"
                  style={{ backgroundColor: portfolio.color + '20', color: portfolio.color }}
                >
                  {portfolio.ticker}
                </span>
                <span className="text-pb-text-dim text-sm">
                  Since {new Date(portfolio.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{portfolio.name}</h1>
              <p className="text-pb-text-muted mt-1">{portfolio.description}</p>
            </div>
            <div className="text-right">
              <div 
                className="text-4xl font-bold font-mono"
                style={{ color: portfolio.color }}
              >
                {formatPercent(totalReturn)}
              </div>
              <div className="text-sm text-pb-text-dim">Total Return</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="stat-box">
              <div className="stat-label">Current Value</div>
              <div className="stat-value" style={{ color: portfolio.color }}>
                {currentValue > 0 ? formatCurrency(currentValue) : '—'}
              </div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Starting Balance</div>
              <div className="stat-value">{formatCurrency(portfolio.startingBalance)}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Deposits</div>
              <div className="stat-value">{formatCurrency(totalDeposits)}</div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Positions</div>
              <div className="stat-value">{portfolio.positions.length}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Equity Curve */}
          <section>
            <EquityCurve portfolio={portfolio} />
          </section>

          {/* Monthly Returns */}
          <section>
            <MonthlyReturns portfolio={portfolio} />
          </section>

          {/* Performance Stats */}
          <section>
            <PerformanceStats portfolio={portfolio} />
          </section>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Positions */}
            <section>
              <PositionsTable portfolio={portfolio} />
            </section>

            {/* Calculator */}
            <section>
              <Calculator portfolio={portfolio} />
            </section>
          </div>

          {/* Recent Trades */}
          {portfolio.trades && portfolio.trades.length > 0 && (
            <section>
              <div className="card">
                <div className="card-header flex items-center justify-between">
                  <h3 className="font-semibold">Recent Trades</h3>
                  <span className="text-xs text-pb-text-dim font-mono">{portfolio.trades.length} trades</span>
                </div>
                <div className="card-body p-0 overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Ticker</th>
                        <th className="text-center">Action</th>
                        <th className="text-right">Shares</th>
                        <th className="text-right">Price</th>
                        <th className="text-right">Total</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.trades.slice(0, 10).map((trade, i) => (
                        <tr key={i}>
                          <td className="font-mono text-pb-text-muted">{trade.date}</td>
                          <td className="font-mono font-semibold">{trade.ticker}</td>
                          <td className="text-center">
                            <span className={`badge ${trade.action === 'BUY' ? 'badge-buy' : trade.action === 'SELL' ? 'badge-sell' : 'badge-hold'}`}>
                              {trade.action}
                            </span>
                          </td>
                          <td className="font-mono text-right">{trade.shares || '—'}</td>
                          <td className="font-mono text-right">{trade.price ? `$${trade.price.toFixed(2)}` : '—'}</td>
                          <td className="font-mono text-right">
                            {trade.shares && trade.price ? formatCurrency(trade.shares * trade.price) : '—'}
                          </td>
                          <td className="text-pb-text-dim text-sm">{trade.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-pb-border py-6 px-4 mt-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-pb-text-dim">
          © 2026 Portfolio Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
