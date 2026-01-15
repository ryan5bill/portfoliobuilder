'use client';

import { useState } from 'react';
import { TRADE_ALERTS } from '@/lib/sampleData';
import { formatCurrency } from '@/lib/theme';

export default function AlertsManagerPage() {
  const [alerts, setAlerts] = useState(TRADE_ALERTS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    portfolio: 'HRGP',
    ticker: '',
    action: 'BUY',
    shares: '',
    price: '',
    details: ''
  });

  const handleSave = () => {
    if (!form.ticker) return;

    const newAlert = {
      id: editingId || Date.now(),
      date: form.date,
      portfolio: form.portfolio,
      ticker: form.ticker.toUpperCase(),
      action: form.action,
      shares: form.shares ? parseFloat(form.shares) : null,
      price: form.price ? parseFloat(form.price) : null,
      details: form.details
    };

    if (editingId) {
      setAlerts(prev => prev.map(a => a.id === editingId ? newAlert : a));
    } else {
      setAlerts(prev => [newAlert, ...prev]);
    }

    resetForm();
  };

  const handleEdit = (alert) => {
    setForm({
      date: alert.date,
      portfolio: alert.portfolio,
      ticker: alert.ticker,
      action: alert.action,
      shares: alert.shares?.toString() || '',
      price: alert.price?.toString() || '',
      details: alert.details || ''
    });
    setEditingId(alert.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this alert?')) {
      setAlerts(prev => prev.filter(a => a.id !== id));
    }
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split('T')[0],
      portfolio: 'HRGP',
      ticker: '',
      action: 'BUY',
      shares: '',
      price: '',
      details: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(alerts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade-alerts-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'BUY': return '#00d4aa';
      case 'SELL': return '#ff6b00';
      case 'REBALANCE': return '#a855f7';
      default: return '#888';
    }
  };

  const getPortfolioColor = (portfolio) => {
    if (portfolio === 'HRGP') return '#00d4aa';
    if (portfolio === 'SFGP') return '#ff6b00';
    return '#888';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Trade Alerts</h1>
          <p className="text-pb-text-muted">Create and manage trade alerts for subscribers</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleExport} className="btn btn-secondary">Export JSON</button>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            + New Alert
          </button>
        </div>
      </div>

      {/* Alert Form */}
      {showForm && (
        <div className="card mb-6">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold">{editingId ? 'Edit Alert' : 'New Trade Alert'}</h3>
            <button onClick={resetForm} className="text-pb-text-muted hover:text-white">×</button>
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
                <label className="block text-xs text-pb-text-dim mb-1">Portfolio</label>
                <select
                  className="input"
                  value={form.portfolio}
                  onChange={e => setForm({...form, portfolio: e.target.value})}
                >
                  <option value="HRGP">HRGP</option>
                  <option value="SFGP">SFGP</option>
                  <option value="BOTH">BOTH</option>
                </select>
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
                  <option value="HOLD">HOLD</option>
                  <option value="REBALANCE">REBALANCE</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Shares</label>
                <input
                  type="number"
                  className="input font-mono"
                  placeholder="100"
                  value={form.shares}
                  onChange={e => setForm({...form, shares: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs text-pb-text-dim mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="input font-mono"
                  placeholder="150.00"
                  value={form.price}
                  onChange={e => setForm({...form, price: e.target.value})}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs text-pb-text-dim mb-1">Details / Notes</label>
              <input
                className="input"
                placeholder="Brief description of the trade..."
                value={form.details}
                onChange={e => setForm({...form, details: e.target.value})}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} className="btn btn-primary">
                {editingId ? 'Update Alert' : 'Create Alert'}
              </button>
              <button onClick={resetForm} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Table */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h3 className="font-semibold">All Alerts</h3>
          <span className="text-sm text-pb-text-dim">{alerts.length} alerts</span>
        </div>
        <div className="card-body p-0">
          {alerts.length === 0 ? (
            <div className="p-8 text-center text-pb-text-muted">No alerts yet</div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Portfolio</th>
                  <th>Ticker</th>
                  <th>Action</th>
                  <th className="text-right">Shares</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Total</th>
                  <th>Details</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="font-mono text-pb-text-muted">{alert.date}</td>
                    <td>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-mono"
                        style={{
                          backgroundColor: getPortfolioColor(alert.portfolio) + '20',
                          color: getPortfolioColor(alert.portfolio)
                        }}
                      >
                        {alert.portfolio}
                      </span>
                    </td>
                    <td className="font-mono font-semibold">{alert.ticker}</td>
                    <td>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold uppercase"
                        style={{
                          backgroundColor: getActionColor(alert.action) + '20',
                          color: getActionColor(alert.action)
                        }}
                      >
                        {alert.action}
                      </span>
                    </td>
                    <td className="font-mono text-right">{alert.shares || '—'}</td>
                    <td className="font-mono text-right">{alert.price ? `$${alert.price.toFixed(2)}` : '—'}</td>
                    <td className="font-mono text-right">
                      {alert.shares && alert.price ? formatCurrency(alert.shares * alert.price) : '—'}
                    </td>
                    <td className="text-pb-text-muted text-sm max-w-xs truncate">{alert.details}</td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(alert)} className="btn btn-secondary text-xs px-2 py-1">Edit</button>
                        <button onClick={() => handleDelete(alert.id)} className="btn btn-danger text-xs px-2 py-1">×</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
