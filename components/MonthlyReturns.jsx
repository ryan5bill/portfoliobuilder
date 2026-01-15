'use client';

import { MONTHS } from '@/lib/sampleData';
import { calculateYTD, formatPercent } from '@/lib/theme';

function getReturnClass(value) {
  if (value == null) return '';
  if (value >= 20) return 'return-high-pos';
  if (value >= 10) return 'return-med-pos';
  if (value > 0) return 'return-low-pos';
  if (value >= -10) return 'return-low-neg';
  if (value >= -20) return 'return-med-neg';
  return 'return-high-neg';
}

export default function MonthlyReturns({ portfolio }) {
  const years = Object.keys(portfolio.monthlyReturns).sort();
  
  if (years.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">Monthly Returns (%)</h3>
        </div>
        <div className="card-body text-center text-pb-text-muted py-12">
          No returns data available yet.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="font-semibold">Monthly Returns (%)</h3>
        <span className="text-xs font-mono text-pb-text-dim">
          {years[0]} - {years[years.length - 1]}
        </span>
      </div>
      <div className="card-body overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-pb-text-dim uppercase">Year</th>
              {MONTHS.map(month => (
                <th key={month} className="px-2 py-2 text-center text-xs font-medium text-pb-text-dim uppercase w-14">
                  {month}
                </th>
              ))}
              <th className="px-3 py-2 text-center text-xs font-medium text-pb-text-dim uppercase w-16">YTD</th>
            </tr>
          </thead>
          <tbody>
            {years.map(year => {
              const yearData = portfolio.monthlyReturns[year];
              const ytd = calculateYTD(yearData);
              
              return (
                <tr key={year} className="hover:bg-pb-bg-hover">
                  <td className="px-3 py-2 font-mono font-medium">{year}</td>
                  {MONTHS.map(month => {
                    const value = yearData?.[month];
                    return (
                      <td key={month} className="px-1 py-1">
                        <div className={`return-cell ${getReturnClass(value)}`}>
                          {value != null ? (value >= 0 ? '+' : '') + value.toFixed(1) : '—'}
                        </div>
                      </td>
                    );
                  })}
                  <td className="px-1 py-1">
                    <div 
                      className="return-cell font-semibold"
                      style={{ color: ytd >= 0 ? '#00d4aa' : '#ff6b00' }}
                    >
                      {ytd != null ? formatPercent(ytd) : '—'}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
