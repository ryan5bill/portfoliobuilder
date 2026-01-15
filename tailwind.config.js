/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        'pb-green': '#00d4aa',
        'pb-green-dark': '#00b894',
        'pb-orange': '#ff6b00',
        'pb-orange-dark': '#e65c00',
        
        // Background colors
        'pb-bg': '#0a0a0a',
        'pb-bg-card': '#111111',
        'pb-bg-elevated': '#1a1a1a',
        
        // Border colors
        'pb-border': '#222222',
        'pb-border-light': '#333333',
        
        // Text colors
        'pb-text': '#e0e0e0',
        'pb-text-muted': '#888888',
        'pb-text-dim': '#666666',
      },
      fontFamily: {
        'sans': ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
