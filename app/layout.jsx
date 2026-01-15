import './globals.css';

export const metadata = {
  title: 'Portfolio Builder | pbtracker.app',
  description: 'Track model portfolios and build your own investment track record',
  keywords: ['portfolio', 'tracker', 'investment', 'stocks', 'trading'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-pb-bg text-pb-text antialiased">
        {children}
      </body>
    </html>
  );
}
