// Portfolio Builder - Sample Data
// This is PLACEHOLDER DATA - will be replaced with real track record
// ============================================================

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const PORTFOLIO_DATA = {
  lastUpdated: new Date().toISOString(),
  
  portfolios: {
    HRGP: {
      id: 'HRGP',
      name: 'HIGH-RISK GROWTH',
      ticker: 'HRGP',
      description: 'Concentrated AI/Crypto positions for maximum growth',
      color: '#00d4aa',
      startDate: '2020-12-01',
      startingBalance: 1000,
      deposits: [],
      
      // Current open positions (SAMPLE - replace with real)
      positions: [
        { ticker: 'MU', name: 'Micron Technology', shares: 10, entryPrice: 265.68, currentPrice: 333.35, type: 'offense', ratio: 1 },
        { ticker: 'VRT', name: 'Vertiv Holdings', shares: 14, entryPrice: 160.44, currentPrice: 170.86, type: 'offense', ratio: 1 },
        { ticker: 'MRVL', name: 'Marvell Technology', shares: 30, entryPrice: 84.13, currentPrice: 81.21, type: 'offense', ratio: 3 },
        { ticker: 'ORCL', name: 'Oracle Corporation', shares: 14, entryPrice: 194.11, currentPrice: 193.61, type: 'offense', ratio: 1 },
        { ticker: 'MSTR', name: 'MicroStrategy', shares: 16, entryPrice: 164.24, currentPrice: 179.33, type: 'offense', ratio: 2 },
      ],
      
      // Monthly returns (SAMPLE - replace with real)
      monthlyReturns: {
        '2020': { Dec: 4.72 },
        '2021': { Jan: 127.54, Feb: 16.47, Mar: -10.95, Apr: 28.80, May: -19.49, Jun: 0.68, Jul: 6.00, Aug: 22.10, Sep: -2.69, Oct: 33.91, Nov: -0.44, Dec: -19.31 },
        '2022': { Jan: 9.90, Feb: -3.68, Mar: 24.70, Apr: 4.08, May: -7.46, Jun: -17.26, Jul: 31.97, Aug: 0.81, Sep: -15.36, Oct: 14.22, Nov: -13.09, Dec: 34.00 },
        '2023': { Jan: 14.60, Feb: 0.70, Mar: 12.65, Apr: -8.85, May: 20.89, Jun: 1.24, Jul: 6.89, Aug: -3.50, Sep: -1.08, Oct: -0.19, Nov: 26.86, Dec: 23.20 },
        '2024': { Jan: -7.69, Feb: 21.76, Mar: 14.77, Apr: -16.26, May: 12.78, Jun: -6.81, Jul: 0.30, Aug: -9.52, Sep: 7.86, Oct: -0.29, Nov: 31.57, Dec: -2.30 },
        '2025': { Jan: 8.21 },
      },
      
      // Recent trades (SAMPLE)
      trades: [
        { date: '2025-01-10', ticker: 'MSTR', action: 'BUY', shares: 5, price: 175.50, notes: 'Adding to position' },
        { date: '2024-12-15', ticker: 'NVDA', action: 'SELL', shares: 10, price: 485.00, notes: 'Taking profits' },
        { date: '2024-11-20', ticker: 'MU', action: 'BUY', shares: 10, price: 265.68, notes: 'New position' },
      ],
    },
    
    SFGP: {
      id: 'SFGP',
      name: 'SAFE GROWTH',
      ticker: 'SFGP',
      description: 'Diversified leveraged ETFs for steady growth',
      color: '#ff6b00',
      startDate: '2018-12-01',
      startingBalance: 40035,
      deposits: [
        { date: '2021-01-15', amount: 59490 }
      ],
      
      // Current open positions (SAMPLE - replace with real)
      positions: [
        { ticker: 'UVXY', name: 'ProShares VIX', shares: 69.6, entryPrice: 34.39, currentPrice: 37.02, type: 'defense', ratio: 2 },
        { ticker: 'TMF', name: '3X Treasury Bonds', shares: 518.8, entryPrice: 38.62, currentPrice: 38.62, type: 'defense', ratio: 11 },
        { ticker: 'EDC', name: '3X Emerging Markets', shares: 545.0, entryPrice: 63.72, currentPrice: 63.72, type: 'offense', ratio: 12 },
        { ticker: 'GBTC', name: 'Grayscale Bitcoin', shares: 1000.0, entryPrice: 25.86, currentPrice: 76.31, type: 'offense', ratio: 31 },
        { ticker: 'SOXL', name: '3X Semiconductors', shares: 37.96, entryPrice: 28.88, currentPrice: 55.38, type: 'offense', ratio: 1 },
        { ticker: 'ERX', name: '2X Energy', shares: 324.9, entryPrice: 68.16, currentPrice: 64.17, type: 'offense', ratio: 8 },
      ],
      
      // Monthly returns (SAMPLE - replace with real)
      monthlyReturns: {
        '2019': { Jan: 7.57, Feb: 0.89, Mar: 2.49, Apr: 0.22, May: -0.77, Jun: 5.45, Jul: 1.45, Aug: 3.61, Sep: -1.58, Oct: 1.25, Nov: 1.10, Dec: 1.45 },
        '2020': { Jan: 2.47, Feb: -2.99, Mar: null, Apr: -0.70, May: 1.06, Jun: 0.79, Jul: 8.23, Aug: 9.07, Sep: -11.41, Oct: -3.29, Nov: 0.13, Dec: 5.92 },
        '2021': { Jan: 2.79, Feb: 3.41, Mar: 1.22, Apr: 4.18, May: -3.21, Jun: 2.87, Jul: 0.94, Aug: 3.56, Sep: -5.12, Oct: 7.23, Nov: -2.44, Dec: -1.87 },
        '2022': { Jan: -4.56, Feb: -1.23, Mar: 3.45, Apr: -6.78, May: -2.34, Jun: -8.91, Jul: 5.67, Aug: -3.45, Sep: -7.89, Oct: 4.56, Nov: 2.34, Dec: -1.23 },
        '2023': { Jan: 6.78, Feb: -2.34, Mar: 1.23, Apr: 0.45, May: 2.67, Jun: 3.89, Jul: 2.12, Aug: -1.56, Sep: -2.78, Oct: -0.89, Nov: 5.67, Dec: 4.23 },
        '2024': { Jan: 1.23, Feb: 3.45, Mar: 2.67, Apr: -1.89, May: 4.56, Jun: -0.78, Jul: 2.34, Aug: -2.12, Sep: 3.45, Oct: 1.67, Nov: 5.89, Dec: 0.45 },
        '2025': { Jan: 2.34 },
      },
      
      // Recent trades (SAMPLE)
      trades: [
        { date: '2025-01-05', ticker: 'TMF', action: 'BUY', shares: 50, price: 38.50, notes: 'Rebalancing' },
        { date: '2024-12-10', ticker: 'GBTC', action: 'HOLD', shares: 0, price: 0, notes: 'Position update' },
      ],
    },
  },
  
  // Recent trade alerts (for the alerts feed)
  tradeAlerts: [
    { id: 1, date: '2025-01-10', portfolio: 'HRGP', ticker: 'MSTR', action: 'BUY', shares: 5, price: 175.50, details: 'Adding to Bitcoin proxy position' },
    { id: 2, date: '2025-01-05', portfolio: 'SFGP', ticker: 'TMF', action: 'BUY', shares: 50, price: 38.50, details: 'Rebalancing defense allocation' },
    { id: 3, date: '2024-12-20', portfolio: 'BOTH', ticker: 'REBALANCE', action: 'REBALANCE', shares: null, price: null, details: 'Year-end portfolio rebalancing' },
    { id: 4, date: '2024-12-15', portfolio: 'HRGP', ticker: 'NVDA', action: 'SELL', shares: 10, price: 485.00, details: 'Taking profits after 200% gain' },
    { id: 5, date: '2024-11-20', portfolio: 'HRGP', ticker: 'MU', action: 'BUY', shares: 10, price: 265.68, details: 'New AI infrastructure position' },
  ],
};

// Export individual portfolios for convenience
export const HRGP = PORTFOLIO_DATA.portfolios.HRGP;
export const SFGP = PORTFOLIO_DATA.portfolios.SFGP;
export const TRADE_ALERTS = PORTFOLIO_DATA.tradeAlerts;

// Helper to get portfolio by ID
export function getPortfolio(id) {
  return PORTFOLIO_DATA.portfolios[id] || null;
}

// Helper to get all portfolios as array
export function getAllPortfolios() {
  return Object.values(PORTFOLIO_DATA.portfolios);
}
