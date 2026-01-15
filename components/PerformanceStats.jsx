'use client';

import { useMemo } from 'react';
import { MONTHS } from '@/lib/sampleData';
import { formatPercent } from '@/lib/theme';

export default function PerformanceStats({ portfolio }) {
  const stats = useMemo(() => {
    const allReturns = [];
    const years = Object.keys(portfolio.monthlyReturns).sort();
    
    // Collect all monthly returns
    years.forEach(year => {
      MONTHS.forEach(month => {
        const ret = portfolio.monthlyReturns[year]?.[month];
        if (ret != null) {
          allReturns.push({ year, month, value: ret });
        }
      });
    });

    if (allReturns.length === 0) return null;

    const values = allReturns.map(r => r.value);
    const positiveMonths = values.filter(v => v > 0);
    const negativeMonths = values.filter(v => v < 0);

    // Calculate total return (compounded)
    const totalReturn = values.reduce((acc, v) => acc * (1 + v / 100), 1);
    
    // Best and worst months
    const sorted = [...allReturns].sort((a, b) => b.value - a.value);
    const best = sorted[0];
    const worst = sorted[sorted.length - 1];

    // Current streak
    let streak = 0;
    let streakType = null;
    for (let i = allReturns.length - 1; i >= 0; i--) {
      const isPositive = allReturns[i].value > 0;
      if (streakType === null) {
        streakType = isPositive ? 'positive' : 'negative';
        streak = 1;
      } else if ((isPositive && streakType === 'positive') || (!isPositive && streakType === 'negative')) {
        streak++;
      } else {
        break;
      }
    }

    // Average monthly return
    const avgReturn = values.reduce((a, b) => a + b, 0) / values.length;

    // Standard deviation
    const variance = values.reduce((acc, v) => acc + Math.pow(v - avgReturn, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Sharpe-like ratio (simplified, assuming 0% risk-free rate)
    const sharpe = avgReturn / stdDev;

    // Max drawdown (simplified)
    let peak = 100;
    let maxDrawdown = 0;
    let running = 100;
    values.forEach(v => {
      running *= (1 + v / 100);
      if (running > peak) peak = running;
      const drawdown = (peak - running) / peak * 100;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    return {
      totalReturn: (totalReturn - 1) * 100,
      totalMonths: allReturns.length,
      winRate: (positiveMonths.length / allReturns.length) * 100,
      positiveMonths: positiveMonths.length,
      negativeMonths: negativeMonths.length,
      avgGain: positiveMonths.length ? positiveMonths.reduce((a, b) => a + b, 0) / positiveMonths.length : 0,
      avgLoss: negativeMonths.length ? negativeMonths.reduce((a, b) => a + b, 0) / negativeMonths.length : 0,
      bestMonth: best,
      worstMonth: worst,
      streak,
      streakType,
      avgReturn,
      stdDev,
      sharpe,
      maxDrawdown
    };
  }, [portfolio.monthlyReturns]);

  if (!stats) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">Performance Stats</h3>
        </div>
        <div className="card-body text-center text-pb-text-muted py-12">
          Not enough data to calculate statistics.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="font-semibold">Performance Statistics</h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Return */}
          <div className="bg-pb-bg rounded-lg p-4">
            <div className="text-xs text-pb-text-dim mb-1">Total Return</div>
            <div className="font-mono font-bold text-xl" style={{ color: portfolio.color }}>
              {formatPercent(stats.totalReturn)}
            </div>
            <div className="text-xs text-pb-text-dim mt-1">{stats.totalMonths} months</div>
          </div>

          {/* Win Rate */}
          <div className="bg-pb-bg rounded-lg p-4">
            <div className="text-xs text-pb-text-dim mb-1">Win Rate</div>
            <div className={`font-mono font-bold text-xl ${stats.winRate >= 50 ? 'text-pb-green' : 'text-pb-orange'}`}>
              {stats.winRate.toFixed(0)}%
            </div>
            <div className="text-xs text-pb-text-dim mt-1">
              {stats.positiveMonths}W / {stats.negativeMonths}L
            </div>
          </div>

          {/* Best Month */}
          <div className="bg-pb-bg rounded-lg p-4">
            <div className="text-xs text-pb-text-dim mb-1">Best Month</div>
            <div className="font-mono font-bold text-xl text-pb-green">
              {formatPercent(stats.bestMonth.value)}
            </div>
            <div className="text-xs text-pb-text-dim mt-1">
              {stats.bestMonth.month} {stats.bestMonth.year}
            </div>
          </div>

          {/* Worst Month */}
          <div className="bg-pb-bg rounded-lg p-4">
            <div className="text-xs text-pb-text-dim mb-1">Worst Month</div>
            <div className="font-mono font-bold text-xl text-pb-orange">
              {formatPercent(stats.worstMonth.value)}
            </div>
            <div className="text-xs text-pb-text-dim mt-1">
              {stats.worstMonth.month} {stats.worstMonth.year}
            </div>
          </div>

          {/* Average Gain */}
          <div className="bg-pb-bg rounded-lg p-4">
            <div className="text-xs text-pb-text-dim mb-1">Avg Winning Month</div>
            <div className="font-mono font-bold text-xl text-pb-green">
              {formatPercent(stats.avgGain)}
            </div>
          </div>

          {/* Average Loss */}
          <div className="bg-pb-bg rounded-lg p-4">
            <div className="text-xs text-pb-text-dim mb-1">Avg Losing Month</div>
            <div className="font-mono font-bold text-xl text-pb-orange">
              {formatPercent(stats.avgLoss)}
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-pb-bg rounded-lg p-4">
            <div className="text-xs text-pb-text-dim mb-1">Current Streak</div>
            <div className={`font-mono font-bold text-xl ${stats.streakType === 'positive' ? 'text-pb-green' : 'text-pb-orange'}`}>
              {stats.streak} {stats.streakType === 'positive' ? '🔥' : '❄️'}
            </div>
            <div className="text-xs text-pb-text-dim mt-1">
              {stats.streakType === 'positive' ? 'winning' : 'losing'} months
            </div>
          </div>

          {/* Max Drawdown */}
          <div className="bg-pb-bg rounded-lg p-4">
            <div className="text-xs text-pb-text-dim mb-1">Max Drawdown</div>
            <div className="font-mono font-bold text-xl text-pb-orange">
              -{stats.maxDrawdown.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Advanced Stats */}
        <div className="mt-6 pt-6 border-t border-pb-border">
          <h4 className="text-sm font-semibold text-pb-text-dim mb-4">Risk Metrics</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-pb-text-dim mb-1">Avg Monthly Return</div>
              <div className="font-mono font-semibold">{formatPercent(stats.avgReturn)}</div>
            </div>
            <div>
              <div className="text-xs text-pb-text-dim mb-1">Volatility (Std Dev)</div>
              <div className="font-mono font-semibold">{stats.stdDev.toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-xs text-pb-text-dim mb-1">Return/Risk Ratio</div>
              <div className={`font-mono font-semibold ${stats.sharpe >= 0.5 ? 'text-pb-green' : 'text-pb-text'}`}>
                {stats.sharpe.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
