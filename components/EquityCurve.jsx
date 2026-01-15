'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { MONTHS } from '@/lib/sampleData';

export default function EquityCurve({ portfolio, showBenchmark = true }) {
  const [timeRange, setTimeRange] = useState('ALL');

  // Generate equity curve data from monthly returns
  const chartData = useMemo(() => {
    const data = [];
    let portfolioValue = 100; // Start at 100 for easy % comparison
    let spyValue = 100; // Benchmark
    
    // SPY approximate monthly returns (simplified for demo)
    const spyReturns = {
      '2020': { Dec: 3.7 },
      '2021': { Jan: -1.1, Feb: 2.6, Mar: 4.2, Apr: 5.2, May: 0.6, Jun: 2.2, Jul: 2.3, Aug: 2.9, Sep: -4.8, Oct: 6.9, Nov: -0.8, Dec: 4.4 },
      '2022': { Jan: -5.3, Feb: -3.1, Mar: 3.6, Apr: -8.8, May: 0.0, Jun: -8.4, Jul: 9.1, Aug: -4.2, Sep: -9.3, Oct: 7.9, Nov: 5.4, Dec: -5.9 },
      '2023': { Jan: 6.2, Feb: -2.6, Mar: 3.5, Apr: 1.5, May: 0.3, Jun: 6.5, Jul: 3.1, Aug: -1.8, Sep: -4.9, Oct: -2.2, Nov: 8.9, Dec: 4.4 },
      '2024': { Jan: 1.6, Feb: 5.2, Mar: 3.1, Apr: -4.2, May: 4.8, Jun: 3.5, Jul: 1.1, Aug: 2.3, Sep: 2.0, Oct: -1.0, Nov: 5.7, Dec: -2.5 },
      '2025': { Jan: 2.0 },
    };

    const years = Object.keys(portfolio.monthlyReturns).sort();
    
    years.forEach(year => {
      MONTHS.forEach(month => {
        const portfolioReturn = portfolio.monthlyReturns[year]?.[month];
        const spyReturn = spyReturns[year]?.[month];
        
        if (portfolioReturn != null) {
          portfolioValue *= (1 + portfolioReturn / 100);
          spyValue *= (1 + (spyReturn || 0) / 100);
          
          data.push({
            date: `${month} ${year.slice(-2)}`,
            fullDate: `${month} ${year}`,
            portfolio: Math.round(portfolioValue * 100) / 100,
            spy: Math.round(spyValue * 100) / 100,
            portfolioReturn,
            spyReturn: spyReturn || 0
          });
        }
      });
    });

    return data;
  }, [portfolio.monthlyReturns]);

  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (timeRange === 'ALL') return chartData;
    
    const now = new Date();
    let cutoff;
    
    switch (timeRange) {
      case 'YTD':
        cutoff = new Date(now.getFullYear(), 0, 1);
        break;
      case '1Y':
        cutoff = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case '3Y':
        cutoff = new Date(now.setFullYear(now.getFullYear() - 3));
        break;
      default:
        return chartData;
    }
    
    // For simplicity, just take last N entries
    const months = timeRange === 'YTD' ? 2 : timeRange === '1Y' ? 12 : 36;
    return chartData.slice(-months);
  }, [chartData, timeRange]);

  // Calculate stats
  const stats = useMemo(() => {
    if (filteredData.length < 2) return null;
    
    const first = filteredData[0];
    const last = filteredData[filteredData.length - 1];
    
    return {
      portfolioReturn: ((last.portfolio - first.portfolio) / first.portfolio) * 100,
      spyReturn: ((last.spy - first.spy) / first.spy) * 100,
      outperformance: ((last.portfolio - first.portfolio) / first.portfolio) * 100 - 
                      ((last.spy - first.spy) / first.spy) * 100
    };
  }, [filteredData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    
    return (
      <div className="bg-pb-bg-card border border-pb-border rounded-lg p-3 shadow-lg">
        <div className="text-xs text-pb-text-dim mb-2">{payload[0]?.payload?.fullDate}</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: portfolio.color }}></div>
            <span className="text-sm">{portfolio.ticker}:</span>
            <span className="font-mono font-semibold" style={{ color: portfolio.color }}>
              {payload[0]?.value?.toFixed(1)}
            </span>
          </div>
          {showBenchmark && payload[1] && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              <span className="text-sm">SPY:</span>
              <span className="font-mono font-semibold text-gray-400">
                {payload[1]?.value?.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (chartData.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">Equity Curve</h3>
        </div>
        <div className="card-body text-center text-pb-text-muted py-12">
          Not enough data to display chart.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="font-semibold">Equity Curve</h3>
        <div className="flex gap-1">
          {['YTD', '1Y', '3Y', 'ALL'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                timeRange === range
                  ? 'bg-pb-bg-elevated text-white'
                  : 'text-pb-text-muted hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      <div className="card-body">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-xs text-pb-text-dim mb-1">{portfolio.ticker} Return</div>
              <div className="font-mono font-bold text-lg" style={{ color: portfolio.color }}>
                {stats.portfolioReturn >= 0 ? '+' : ''}{stats.portfolioReturn.toFixed(1)}%
              </div>
            </div>
            {showBenchmark && (
              <>
                <div className="text-center">
                  <div className="text-xs text-pb-text-dim mb-1">SPY Return</div>
                  <div className="font-mono font-bold text-lg text-gray-400">
                    {stats.spyReturn >= 0 ? '+' : ''}{stats.spyReturn.toFixed(1)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-pb-text-dim mb-1">Alpha</div>
                  <div className={`font-mono font-bold text-lg ${stats.outperformance >= 0 ? 'text-pb-green' : 'text-pb-orange'}`}>
                    {stats.outperformance >= 0 ? '+' : ''}{stats.outperformance.toFixed(1)}%
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Chart */}
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#666', fontSize: 10 }}
                axisLine={{ stroke: '#333' }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fill: '#666', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={['dataMin - 10', 'dataMax + 10']}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={100} stroke="#333" strokeDasharray="3 3" />
              {showBenchmark && (
                <Line 
                  type="monotone" 
                  dataKey="spy" 
                  stroke="#666" 
                  strokeWidth={1.5}
                  dot={false}
                  name="SPY"
                />
              )}
              <Line 
                type="monotone" 
                dataKey="portfolio" 
                stroke={portfolio.color} 
                strokeWidth={2}
                dot={false}
                name={portfolio.ticker}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5" style={{ backgroundColor: portfolio.color }}></div>
            <span>{portfolio.ticker}</span>
          </div>
          {showBenchmark && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-gray-500"></div>
              <span className="text-gray-400">SPY (Benchmark)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
