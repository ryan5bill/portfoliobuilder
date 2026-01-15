'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PORTFOLIO_DATA, MONTHS } from '@/lib/sampleData';
import { formatCurrency, formatPercent, calculateTotalReturn, calculatePortfolioValue, calculateYTD } from '@/lib/theme';

function getReturnClass(value) {
  if (value == null) return '';
  if (value >= 20) return 'return-high-pos';
  if (value >= 10) return 'return-med-pos';
  if (value > 0) return 'return-low-pos';
  if (value >= -10) return 'return-low-neg';
  if (value >= -20) return 'return-med-neg';
  return 'return-high-neg';
}

export default function PortfolioEditorPage() {
  const searchParams = useSearchParams();
  const initialPortfolio = searchParams.get('portfolio') || 'HRGP';
  
  const [activePortfolio, setActivePortfolio] = useState(initialPortfolio);
  const [portfolioData, setPortfolioData] = useState(PORTFOLIO_DATA.portfolios);
  const [activeTab, setActiveTab] = useState('positions');
  const [editingPosition, setEditingPosition] = useState(null);
  const [editingReturn, setEditingReturn] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const portfolio = portfolioData[activePortfolio];

  // Position form
  const [positionForm, setPositionForm] = useState({
    ticker: '', name: '', shares: '', entryPrice: '', currentPrice: '', type: 'offense', ratio: '1'
  });

  // Return form
  const [returnForm, setReturnForm] = useState({
    year: new Date().getFullYear().toString(),
    month: MONTHS[new Date().getMonth()],
    value: ''
  });

  const handleSavePosition = () => {
    if (!positionForm.ticker || !positionForm.shares || !positionForm.currentPrice) return;

    const newPosition = {
      ticker: positionForm.ticker.toUpperCase(),
      name: positionForm.name,
      shares: parseFloat(positionForm.shares),
      entryPrice: parseFloat(positionForm.entryPrice) || parseFloat(positionForm.currentPrice),
      currentPrice: parseFloat(positionForm.currentPrice),
      type: positionForm.type,
      ratio: parseInt(positionForm.ratio) || 1
    };

    setPortfolioData(prev => {
      const positions = [...prev[activePortfolio].positions];
      if (editingPosition !== null) {
        positions[editingPosition] = newPosition;
      } else {
        positions.push(newPosition);
      }
      return {
        ...prev,
        [activePortfolio]: { ...prev[activePortfolio], positions }
      };
    });

    setPositionForm({ ticker: '', name: '', shares: '', entryPrice: '', currentPrice: '', type: 'offense', ratio: '1' });
    setEditingPosition(null);
    setHasChanges(true);
  };

  const handleDeletePosition = (index) => {
    if (!confirm('Delete this position?')) return;
    setPortfolioData(prev => ({
      ...prev,
      [activePortfolio]: {
        ...prev[activePortfolio],
        positions: prev[activePortfolio].positions.filter((_, i) => i !== index)
      }
    }));
    setHasChanges(true);
  };

  const handleEditPosition = (index) => {
    const pos = portfolio.positions[index];
    setPositionForm({
      ticker: pos.ticker,
      name: pos.name,
      shares: pos.shares.toString(),
      entryPrice: pos.entryPrice.toString(),
      currentPrice: pos.currentPrice.toString(),
      type: pos.type,
      ratio: pos.ratio.toString()
    });
    setEditingPosition(index);
  };

  const handleSaveReturn = () => {
    if (returnForm.value === '') return;

    setPortfolioData(prev => {
      const returns = { ...prev[activePortfolio].monthlyReturns };
      if (!returns[returnForm.year]) returns[returnForm.year] = {};
      returns[returnForm.year][returnForm.month] = parseFloat(returnForm.value);
      return {
        ...prev,
        [activePortfolio]: { ...prev[activePortfolio], monthlyReturns: returns }
      };
    });

    setReturnForm({ ...returnForm, value: '' });
    setEditingReturn(null);
    setHasChanges(true);
  };

  const handleDeleteReturn = (year, month) => {
    if (!confirm(`Delete ${month} ${year} return?`)) return;
    setPortfolioData(prev => {
      const returns = { ...prev[activePortfolio].monthlyReturns };
      if (returns[year]) {
        delete returns[year][month];
        if (Object.keys(returns[year]).length === 0) delete returns[year];
      }
      return {
        ...prev,
        [activePortfolio]: { ...prev[activePortfolio], monthlyReturns: returns }
      };
    });
    setHasChanges(true);
  };

  const handleExport = () => {
    const data = {
      lastUpdated: new Date().toISOString(),
      portfolios: portfolioData
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    setHasChanges(false);
  };

  const years = Object.keys(portfolio.monthlyReturns).sort();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Portfolio Editor</h1>
          <p className="text-pb-text-muted">Edit positions and monthly returns</p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-pb-orange">● Unsaved changes</span>
          )}
          <button onClick={handleExport} className="btn btn-primary">
            Export JSON
          </button>
        </div>
      </div>

      {/* Portfolio Selector */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActivePortfolio('HRGP')}
          className={`portfolio-tab hrgp ${activePortfolio === 'HRGP' ? 'active' : ''}`}
        >
          HRGP – High-Risk Growth
        </button>
        <button
          onClick={() => setActivePortfolio('SFGP')}
          className={`portfolio-tab sfgp ${activePortfolio === 'SFGP' ? 'active' : ''}`}
        >
          SFGP – Safe Growth
        </button>
      </div>

      {/* Summary Card */}
      <div className="card mb-6" style={{ borderColor: portfolio.color + '40' }}>
        <div className="card-body">
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-pb-text-dim mb-1">Total Return</div>
              <div className="text-2xl font-bold font-mono" style={{ color: portfolio.color }}>
                {formatPercent(calculateTotalReturn(portfolio.monthlyReturns))}
              </div>
            </div>
            <div>
              <div className="text-xs text-pb-text-dim mb-1">Current Value</div>
              <div className="text-2xl font-bold font-mono">
                {formatCurrency(calculatePortfolioValue(portfolio.positions))}
              </div>
            </div>
            <div>
              <div className="text-xs text-pb-text-dim mb-1">Positions</div>
              <div className="text-2xl font-bold font-mono">{portfolio.positions.length}</div>
            </div>
            <div>
              <div className="text-xs text-pb-text-dim mb-1">Since</div>
              <div className="text-2xl font-bold font-mono">
                {new Date(portfolio.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('positions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'positions' ? 'bg-pb-bg-elevated text-white' : 'text-pb-text-muted hover:text-white'
          }`}
        >
          Positions
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'returns' ? 'bg-pb-bg-elevated text-white' : 'text-pb-text-muted hover:text-white'
          }`}
        >
          Monthly Returns
        </button>
      </div>

      {/* Positions Tab */}
      {activeTab === 'positions' && (
        <div className="space-y-6">
          {/* Add/Edit Position Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">{editingPosition !== null ? 'Edit Position' : 'Add Position'}</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-7 gap-4">
                <div>
                  <label className="block text-xs text-pb-text-dim mb-1">Ticker *</label>
                  <input
                    className="input font-mono"
                    placeholder="AAPL"
                    value={positionForm.ticker}
                    onChange={e => setPositionForm({...positionForm, ticker: e.target.value})}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-pb-text-dim mb-1">Name</label>
                  <input
                    className="input"
                    placeholder="Apple Inc."
                    value={positionForm.name}
                    onChange={e => setPositionForm({...positionForm, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-pb-text-dim mb-1">Shares *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input font-mono"
                    placeholder="100"
                    value={positionForm.shares}
                    onChange={e => setPositionForm({...positionForm, shares: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-pb-text-dim mb-1">Entry $</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input font-mono"
                    placeholder="150.00"
                    value={positionForm.entryPrice}
                    onChange={e => setPositionForm({...positionForm, entryPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-pb-text-dim mb-1">Current $ *</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input font-mono"
                    placeholder="175.00"
                    value={positionForm.currentPrice}
                    onChange={e => setPositionForm({...positionForm, currentPrice: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs text-pb-text-dim mb-1">Ratio</label>
                  <input
                    type="number"
                    className="input font-mono"
                    placeholder="1"
                    value={positionForm.ratio}
                    onChange={e => setPositionForm({...positionForm, ratio: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <select
                  className="input w-32"
                  value={positionForm.type}
                  onChange={e => setPositionForm({...positionForm, type: e.target.value})}
                >
                  <option value="offense">Offense</option>
                  <option value="defense">Defense</option>
                </select>
                <button onClick={handleSavePosition} className="btn btn-primary">
                  {editingPosition !== null ? 'Update Position' : 'Add Position'}
                </button>
                {editingPosition !== null && (
                  <button
                    onClick={() => {
                      setEditingPosition(null);
                      setPositionForm({ ticker: '', name: '', shares: '', entryPrice: '', currentPrice: '', type: 'offense', ratio: '1' });
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Positions Table */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Current Positions</h3>
            </div>
            <div className="card-body p-0">
              {portfolio.positions.length === 0 ? (
                <div className="p-8 text-center text-pb-text-muted">No positions yet</div>
              ) : (
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
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.positions.map((pos, i) => {
                      const value = pos.shares * pos.currentPrice;
                      const pnl = ((pos.currentPrice - pos.entryPrice) / pos.entryPrice) * 100;
                      return (
                        <tr key={i}>
                          <td className="font-mono font-semibold" style={{ color: portfolio.color }}>{pos.ticker}</td>
                          <td className="text-pb-text-muted">{pos.name}</td>
                          <td className="font-mono text-right">{pos.shares}</td>
                          <td className="font-mono text-right">${pos.entryPrice.toFixed(2)}</td>
                          <td className="font-mono text-right">${pos.currentPrice.toFixed(2)}</td>
                          <td className="font-mono text-right">{formatCurrency(value)}</td>
                          <td className="font-mono text-right" style={{ color: pnl >= 0 ? '#00d4aa' : '#ff6b00' }}>
                            {formatPercent(pnl)}
                          </td>
                          <td className="text-center">
                            <span className={`badge ${pos.type === 'offense' ? 'badge-buy' : 'bg-yellow-500/20 text-yellow-400'}`}>
                              {pos.type}
                            </span>
                          </td>
                          <td className="font-mono text-center">{pos.ratio}</td>
                          <td>
                            <div className="flex gap-1">
                              <button onClick={() => handleEditPosition(i)} className="btn btn-secondary text-xs px-2 py-1">Edit</button>
                              <button onClick={() => handleDeletePosition(i)} className="btn btn-danger text-xs px-2 py-1">×</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Returns Tab */}
      {activeTab === 'returns' && (
        <div className="space-y-6">
          {/* Add Return Form */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Add Monthly Return</h3>
            </div>
            <div className="card-body">
              <div className="flex gap-4 items-end">
                <div>
                  <label className="block text-xs text-pb-text-dim mb-1">Year</label>
                  <select
                    className="input font-mono w-24"
                    value={returnForm.year}
                    onChange={e => setReturnForm({...returnForm, year: e.target.value})}
                  >
                    {Array.from({length: 10}, (_, i) => 2018 + i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-pb-text-dim mb-1">Month</label>
                  <select
                    className="input w-24"
                    value={returnForm.month}
                    onChange={e => setReturnForm({...returnForm, month: e.target.value})}
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-pb-text-dim mb-1">Return (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input font-mono"
                    placeholder="12.34 or -5.67"
                    value={returnForm.value}
                    onChange={e => setReturnForm({...returnForm, value: e.target.value})}
                  />
                </div>
                <button onClick={handleSaveReturn} className="btn btn-primary">Add Return</button>
              </div>
            </div>
          </div>

          {/* Returns Heatmap */}
          <div className="card">
            <div className="card-header">
              <h3 className="font-semibold">Monthly Returns (%)</h3>
            </div>
            <div className="card-body overflow-x-auto">
              {years.length === 0 ? (
                <div className="p-8 text-center text-pb-text-muted">No returns data yet</div>
              ) : (
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-pb-text-dim">Year</th>
                      {MONTHS.map(m => (
                        <th key={m} className="px-2 py-2 text-center text-xs font-medium text-pb-text-dim w-16">{m}</th>
                      ))}
                      <th className="px-3 py-2 text-center text-xs font-medium text-pb-text-dim w-20">YTD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {years.map(year => {
                      const yearData = portfolio.monthlyReturns[year];
                      const ytd = calculateYTD(yearData);
                      return (
                        <tr key={year}>
                          <td className="px-3 py-2 font-mono font-medium">{year}</td>
                          {MONTHS.map(month => {
                            const value = yearData?.[month];
                            return (
                              <td key={month} className="px-1 py-1">
                                <div
                                  className={`return-cell cursor-pointer hover:ring-2 hover:ring-white/20 ${getReturnClass(value)}`}
                                  onClick={() => {
                                    if (value != null) {
                                      if (confirm(`Delete ${month} ${year}?`)) {
                                        handleDeleteReturn(year, month);
                                      }
                                    } else {
                                      setReturnForm({ year, month, value: '' });
                                    }
                                  }}
                                  title={value != null ? 'Click to delete' : 'Click to add'}
                                >
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
