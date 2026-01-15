// Portfolio Builder Design System
// Bloomberg-terminal inspired dark theme

export const colors = {
  // Primary brand colors
  primary: '#00d4aa',      // Green - HRGP, positive returns
  primaryDark: '#00b894',
  secondary: '#ff6b00',    // Orange - SFGP, negative returns
  secondaryDark: '#e65c00',
  
  // Backgrounds
  bg: '#0a0a0a',
  bgCard: '#111111',
  bgElevated: '#1a1a1a',
  bgHover: '#0d0d0d',
  
  // Borders
  border: '#222222',
  borderLight: '#333333',
  borderFocus: '#00d4aa',
  
  // Text
  text: '#e0e0e0',
  textMuted: '#888888',
  textDim: '#666666',
  textWhite: '#ffffff',
  
  // Status colors
  success: '#00d4aa',
  warning: '#ffcc00',
  error: '#ff4757',
  info: '#38bdf8',
  
  // Return heatmap colors
  returnHighPos: '#00d4aa',
  returnMedPos: 'rgba(0, 212, 170, 0.5)',
  returnLowPos: 'rgba(0, 212, 170, 0.2)',
  returnLowNeg: 'rgba(255, 107, 0, 0.2)',
  returnMedNeg: 'rgba(255, 107, 0, 0.5)',
  returnHighNeg: '#ff6b00',
};

export const portfolioColors = {
  HRGP: '#00d4aa',
  SFGP: '#ff6b00',
};

export const fonts = {
  sans: "'IBM Plex Sans', system-ui, sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// Helper to get return cell class
export function getReturnClass(value) {
  if (value == null) return '';
  if (value >= 20) return 'bg-pb-green text-black';
  if (value >= 10) return 'bg-pb-green/50 text-white';
  if (value > 0) return 'bg-pb-green/20 text-white';
  if (value >= -10) return 'bg-pb-orange/20 text-white';
  if (value >= -20) return 'bg-pb-orange/50 text-white';
  return 'bg-pb-orange text-black';
}

// Format helpers
export function formatCurrency(value) {
  if (value == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value, showSign = true) {
  if (value == null) return '—';
  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value, decimals = 2) {
  if (value == null) return '—';
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// Calculate YTD from monthly returns
export function calculateYTD(yearData) {
  if (!yearData) return null;
  const values = Object.values(yearData).filter(v => v != null);
  if (values.length === 0) return null;
  const ytd = values.reduce((acc, val) => acc * (1 + val / 100), 1);
  return (ytd - 1) * 100;
}

// Calculate total return from all monthly returns
export function calculateTotalReturn(monthlyReturns) {
  let total = 1;
  Object.values(monthlyReturns).forEach(year => {
    Object.values(year).filter(v => v != null).forEach(val => {
      total *= (1 + val / 100);
    });
  });
  return (total - 1) * 100;
}

// Calculate portfolio value from positions
export function calculatePortfolioValue(positions) {
  return positions.reduce((sum, pos) => sum + (pos.shares * pos.currentPrice), 0);
}
