'use client';

import { useState } from 'react';
import { formatCurrency, formatPercent } from '@/lib/theme';

export default function MyPortfolioPage() {
  const [following, setFollowing] = useState('HRGP');
  const [trades, setTrades] = useState([]);
  const [showAddTrade, setShowAddTrade] = useState(false);
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    ticker: '',
    action: 'BUY',
    shares: '',
    price: '',
    notes: ''
  });

  const handleAddTrade = () => {
    if (!form.ticker || !form.shares || !form.price) return;

    const newTrade = {
      id: Date.now(),
      date: form.date,
      ticker: form.ticker.toUpperCase(),
      action: form.action,
      shares: parseFloat(form.shares),
      price: parseFloat(form.price),
      notes: form.notes
    };

    setTrades([newTrade, ...trades]);
    setForm({
      date: new Date().toISOString().split('T')[0],
      ticker: '',
      action: 'BUY',
      shares: '',
      price: '',
      notes: ''
    });
    setShowAddTrade(false);
  };

  const handleDeleteTrade = (id) => {
    if (confirm('Delete this trade?')) {
      setTrades(trades.filter(t => t.id !== id));
    }
  };

  // Calculate portfolio stats
  const totalInvested = trades
    .filter(t => t.action === 'BUY')
    .reduce((sum, t) => sum + (t.shares * t.price), 0);
  
  const totalSold = trades
    .filter(t => t.action === 'SELL')
    .reduce((sum, t) => sum + (t.shares * t.price), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Portfolio</h1>
          <p className="text-pb-text-muted">Track your trades and compare to the model portfolio.</p>
        </div>
        <button onClick={() => setShowAddTrade(true)} className="btn btn-primary">
          + Add Trade
        </button>
      </div>

      {/* Following Selector */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <span className="text-sm text-pb-text-muted">Following:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFollowing('HRGP')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  following === 'HRGP'
                    ? 'bg-pb-green/20 text-pb-green'
                    : 'bg-pb-bg-elevated text-pb-text-muted hover:text-white'
                }`}
              >
                HRGP
              </button>
              <button
                onClick={() => setFollowing('SFGP')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  following === 'SFGP'
                    ? 'bg-pb-orange/20 text-pb-orange'
                    : 'bg-pb-bg-elevated text-pb-text-muted hover:text-white'
                }`}
              >
                SFGP
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-pb-text-dim mb-1">Total Invested</div>
            <div className="text-xl font-bold font-mono text-pb-green">{formatCurrency(totalInvested)}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-pb-text-dim mb-1">Total Sold</div>
            <div className="text-xl font-bold font-mono text-pb-orange">{formatCurrency(totalSold)}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-pb-text-dim mb-1">Trades</div>
            <div className="text-xl font-bold font-mono">{trades.length}</div>
          </div>
        </div>
      </div>

      {/* Add Trade Form */}
      {showAddTrade && (
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold">Add Trade</h3>
            <button onClick={() => setShowAddTrade(false)} className="text-pb-text-muted hover:text-white">×</button>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-6 gap-4 mb-4">
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Date</label>
                <input
                  type="date"
                  className="input font-mono"
                  value={form.date}
                  onChange={e => setForm({...form, date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Ticker *</label>
                <input
                  className="input font-mono"
                  placeholder="AAPL"
                  value={form.ticker}
                  onChange={e => setForm({...form, ticker: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Action</label>
                <select
                  className="input"
                  value={form.action}
                  onChange={e => setForm({...form, action: e.target.value})}
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Shares *</label>
                <input
                  type="number"
                  step="0.01"
                  className="input font-mono"
                  placeholder="100"
                  value={form.shares}
                  onChange={e => setForm({...form, shares: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  className="input font-mono"
                  placeholder="150.00"
                  value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Notes</label>
                <input
                  className="input"
                  placeholder="Optional"
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleAddTrade} className="btn btn-primary">Add Trade</button>
              <button onClick={() => setShowAddTrade(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Trades Table */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="font-semibold">Trade History</h3>
          <span className="text-sm text-pb-text-dim">{trades.length} trades</span>
        </div>
        <div className="card-body p-0">
          {trades.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="font-semibold mb-2">No trades yet</h3>
              <p className="text-pb-text-muted mb-4">Start tracking your portfolio by adding your first trade.</p>
              <button onClick={() => setShowAddTrade(true)} className="btn btn-primary">
                Add Your First Trade
              </button>
            </div>
          ) : (
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id}>
                    <td className="font-mono text-pb-text-muted">{trade.date}</td>
                    <td className="font-mono font-semibold">{trade.ticker}</td>
                    <td className="text-center">
                      <span className={`badge ${trade.action === 'BUY' ? 'badge-buy' : 'badge-sell'}`}>
                        {trade.action}
                      </span>
                    </td>
                    <td className="font-mono text-right">{trade.shares}</td>
                    <td className="font-mono text-right">${trade.price.toFixed(2)}</td>
                    <td className="font-mono text-right">{formatCurrency(trade.shares * trade.price)}</td>
                    <td className="text-pb-text-muted text-sm">{trade.notes}</td>
                    <td>
                      <button 
                        onClick={() => handleDeleteTrade(trade.id)} 
                        className="btn btn-danger text-xs px-2 py-1"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Coming Soon */}
      <div className="card bg-pb-bg-elevated border-dashed">
        <div className="card-body text-center py-8">
          <div className="text-3xl mb-3">🚀</div>
          <h3 className="font-semibold mb-2">Coming Soon</h3>
          <p className="text-sm text-pb-text-muted max-w-md mx-auto">
            Automatic return calculations, CSV import, performance comparison vs model portfolio, 
            and detailed analytics.
          </p>
        </div>
      </div>
    </div>
  );
}
