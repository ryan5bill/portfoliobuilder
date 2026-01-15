'use client';

import { useState } from 'react';
import { TRADE_ALERTS } from '@/lib/sampleData';
import { formatCurrency } from '@/lib/theme';

export default function AlertsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredAlerts = TRADE_ALERTS.filter(alert => {
    const matchesFilter = filter === 'all' || alert.portfolio === filter || alert.action === filter;
    const matchesSearch = search === '' || 
      alert.ticker.toLowerCase().includes(search.toLowerCase()) ||
      alert.details?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Stats
  const buyCount = TRADE_ALERTS.filter(a => a.action === 'BUY').length;
  const sellCount = TRADE_ALERTS.filter(a => a.action === 'SELL').length;
  const rebalanceCount = TRADE_ALERTS.filter(a => a.action === 'REBALANCE').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Trade Alerts</h1>
        <p className="text-pb-text-muted">All trade alerts and portfolio updates.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-pb-text-dim">Total Alerts</div>
            <div className="text-2xl font-bold font-mono">{TRADE_ALERTS.length}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-pb-text-dim">Buys</div>
            <div className="text-2xl font-bold font-mono text-pb-green">{buyCount}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-pb-text-dim">Sells</div>
            <div className="text-2xl font-bold font-mono text-pb-orange">{sellCount}</div>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="text-sm text-pb-text-dim">Rebalances</div>
            <div className="text-2xl font-bold font-mono text-purple-400">{rebalanceCount}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            className="input"
            placeholder="Search by ticker or details..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input w-40"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All Alerts</option>
          <optgroup label="Portfolio">
            <option value="HRGP">HRGP Only</option>
            <option value="SFGP">SFGP Only</option>
            <option value="BOTH">Both Portfolios</option>
          </optgroup>
          <optgroup label="Action">
            <option value="BUY">Buys Only</option>
            <option value="SELL">Sells Only</option>
            <option value="REBALANCE">Rebalances Only</option>
          </optgroup>
        </select>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="card">
            <div className="card-body text-center py-12 text-pb-text-muted">
              No alerts match your filters.
            </div>
          </div>
        ) : (
          filteredAlerts.map((alert, index) => (
            <div key={alert.id || index} className="card hover:border-pb-border-light transition-colors">
              <div className="card-body">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="px-2 py-1 rounded text-xs font-bold uppercase"
                        style={{
                          backgroundColor: getActionColor(alert.action) + '20',
                          color: getActionColor(alert.action)
                        }}
                      >
                        {alert.action}
                      </span>
                      {alert.ticker && alert.ticker !== 'REBALANCE' && (
                        <span className="font-mono font-bold text-lg">{alert.ticker}</span>
                      )}
                      <span
                        className="px-2 py-0.5 rounded text-xs font-mono"
                        style={{
                          backgroundColor: getPortfolioColor(alert.portfolio) + '20',
                          color: getPortfolioColor(alert.portfolio)
                        }}
                      >
                        {alert.portfolio}
                      </span>
                    </div>

                    {/* Details */}
                    {alert.details && (
                      <p className="text-pb-text-muted mb-3">{alert.details}</p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-6 text-sm text-pb-text-dim">
                      <span>{formatDate(alert.date)}</span>
                      {alert.shares && (
                        <span className="font-mono">{alert.shares} shares</span>
                      )}
                      {alert.price && (
                        <span className="font-mono">@ ${alert.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  {/* Total */}
                  {alert.shares && alert.price && (
                    <div className="text-right">
                      <div className="text-xs text-pb-text-dim mb-1">Total</div>
                      <div 
                        className="font-mono font-bold text-lg"
                        style={{ color: alert.action === 'BUY' ? '#00d4aa' : '#ff6b00' }}
                      >
                        {formatCurrency(alert.shares * alert.price)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div className="card bg-pb-bg-elevated">
        <div className="card-body">
          <h4 className="font-semibold mb-3">Alert Types</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pb-green"></span>
              <span>BUY - Add this position</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pb-orange"></span>
              <span>SELL - Exit this position</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-400"></span>
              <span>REBALANCE - Adjust allocations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-gray-400"></span>
              <span>HOLD - Position update (no action)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
