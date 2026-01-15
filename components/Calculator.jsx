'use client';

import { useState, useMemo } from 'react';
import { formatCurrency } from '@/lib/theme';

export default function Calculator({ portfolio }) {
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);

  // Calculate unit cost (sum of ratio * currentPrice for all positions)
  const unitCost = useMemo(() => {
    return portfolio.positions.reduce((sum, pos) => sum + (pos.ratio * pos.currentPrice), 0);
  }, [portfolio.positions]);

  // Calculate allocations based on input amount
  const allocations = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return null;
    }

    const investAmount = parseFloat(amount);
    const units = investAmount / unitCost;

    return portfolio.positions.map(pos => ({
      ...pos,
      calculatedShares: Math.floor(units * pos.ratio * 100) / 100, // Round to 2 decimals
      calculatedValue: Math.floor(units * pos.ratio * 100) / 100 * pos.currentPrice,
    }));
  }, [amount, unitCost, portfolio.positions]);

  const totalAllocated = allocations?.reduce((sum, a) => sum + a.calculatedValue, 0) || 0;

  const copyToClipboard = () => {
    if (!allocations) return;
    
    const text = allocations
      .map(a => `${a.ticker}: ${a.calculatedShares} shares @ $${a.currentPrice.toFixed(2)}`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (portfolio.positions.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">Position Calculator</h3>
        </div>
        <div className="card-body text-center text-pb-text-muted py-12">
          No positions available for calculation.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="font-semibold">Position Calculator</h3>
        <span className="text-xs text-pb-text-dim">
          Unit Cost: <span className="font-mono" style={{ color: portfolio.color }}>{formatCurrency(unitCost)}</span>
        </span>
      </div>
      <div className="card-body">
        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm text-pb-text-muted mb-2">Investment Amount ($)</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-pb-text-dim">$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10,000"
                className="input pl-8 font-mono"
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={copyToClipboard}
              disabled={!allocations}
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Results */}
        {allocations && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 p-4 bg-pb-bg rounded-lg mb-4">
              <div>
                <div className="text-xs text-pb-text-dim">Units</div>
                <div className="font-mono text-lg">{(parseFloat(amount) / unitCost).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs text-pb-text-dim">Total Allocated</div>
                <div className="font-mono text-lg" style={{ color: portfolio.color }}>{formatCurrency(totalAllocated)}</div>
              </div>
            </div>

            {/* Position breakdown */}
            <div className="space-y-2">
              {allocations.map((allocation, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-pb-bg rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold" style={{ color: portfolio.color }}>
                      {allocation.ticker}
                    </span>
                    <span className="text-pb-text-dim text-sm">{allocation.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="font-mono text-sm">{allocation.calculatedShares} shares</div>
                      <div className="text-xs text-pb-text-dim">@ ${allocation.currentPrice.toFixed(2)}</div>
                    </div>
                    <div className="font-mono w-24 text-right">{formatCurrency(allocation.calculatedValue)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ratio legend */}
            <div className="mt-4 p-3 bg-pb-bg-elevated rounded-lg">
              <div className="text-xs text-pb-text-dim mb-2">Position Ratios</div>
              <div className="flex flex-wrap gap-2">
                {allocations.map((a, i) => (
                  <span key={i} className="text-xs font-mono px-2 py-1 bg-pb-bg rounded">
                    {a.ticker}: {a.ratio}x
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {!allocations && (
          <div className="text-center text-pb-text-muted py-8">
            Enter an investment amount to see your allocation breakdown.
          </div>
        )}
      </div>
    </div>
  );
}
