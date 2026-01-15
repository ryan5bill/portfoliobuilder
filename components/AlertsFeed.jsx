'use client';

import { formatCurrency } from '@/lib/theme';

export default function AlertsFeed({ alerts, limit = 10, showPortfolioTag = true }) {
  const displayAlerts = alerts?.slice(0, limit) || [];

  if (displayAlerts.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold">Trade Alerts</h3>
        </div>
        <div className="card-body text-center text-pb-text-muted py-12">
          No trade alerts yet.
        </div>
      </div>
    );
  }

  const getActionBadge = (action) => {
    switch (action?.toUpperCase()) {
      case 'BUY':
        return <span className="badge badge-buy">BUY</span>;
      case 'SELL':
        return <span className="badge badge-sell">SELL</span>;
      case 'REBALANCE':
        return <span className="badge bg-purple-500/20 text-purple-400">REBALANCE</span>;
      case 'HOLD':
        return <span className="badge badge-hold">HOLD</span>;
      default:
        return <span className="badge badge-hold">{action}</span>;
    }
  };

  const getPortfolioColor = (portfolio) => {
    if (portfolio === 'HRGP') return '#00d4aa';
    if (portfolio === 'SFGP') return '#ff6b00';
    return '#888';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <h3 className="font-semibold">Trade Alerts</h3>
        <span className="text-xs text-pb-text-dim">{displayAlerts.length} alerts</span>
      </div>
      <div className="card-body p-0">
        <div className="divide-y divide-pb-border/50">
          {displayAlerts.map((alert, index) => (
            <div key={alert.id || index} className="p-4 hover:bg-pb-bg-hover transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getActionBadge(alert.action)}
                    {alert.ticker && alert.ticker !== 'REBALANCE' && (
                      <span className="font-mono font-semibold text-white">{alert.ticker}</span>
                    )}
                    {showPortfolioTag && alert.portfolio && (
                      <span 
                        className="text-xs font-mono px-1.5 py-0.5 rounded"
                        style={{ 
                          backgroundColor: getPortfolioColor(alert.portfolio) + '20',
                          color: getPortfolioColor(alert.portfolio)
                        }}
                      >
                        {alert.portfolio}
                      </span>
                    )}
                  </div>
                  
                  {alert.details && (
                    <p className="text-sm text-pb-text-muted mb-2">{alert.details}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-pb-text-dim">
                    <span>{formatDate(alert.date)}</span>
                    {alert.shares && (
                      <span className="font-mono">{alert.shares} shares</span>
                    )}
                    {alert.price && (
                      <span className="font-mono">@ ${alert.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                
                {alert.shares && alert.price && (
                  <div className="text-right">
                    <div className="font-mono text-sm" style={{ color: alert.action === 'BUY' ? '#00d4aa' : '#ff6b00' }}>
                      {formatCurrency(alert.shares * alert.price)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
