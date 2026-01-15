import Link from 'next/link';
import Header from '@/components/Header';
import { PORTFOLIO_DATA } from '@/lib/sampleData';
import { calculateTotalReturn, formatPercent } from '@/lib/theme';

export default function HomePage() {
  const hrgpReturn = calculateTotalReturn(PORTFOLIO_DATA.portfolios.HRGP.monthlyReturns);
  const sfgpReturn = calculateTotalReturn(PORTFOLIO_DATA.portfolios.SFGP.monthlyReturns);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-pb-green/5 via-transparent to-pb-orange/5" />
          
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-white">Build Your</span>{' '}
              <span className="text-pb-green">Track Record</span>
            </h1>
            
            <p className="text-xl text-pb-text-muted max-w-2xl mx-auto mb-10">
              Follow model portfolios with proven returns. Calculate exact allocations. 
              Track your trades. Build a track record you can be proud of.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn btn-primary text-lg px-8 py-3">
                Get Started Free
              </Link>
              <Link href="/portfolio/HRGP" className="btn btn-secondary text-lg px-8 py-3">
                View Track Record
              </Link>
            </div>
          </div>
        </section>

        {/* Portfolio Cards */}
        <section className="py-16 px-4 bg-pb-bg-card/50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">Model Portfolios</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* HRGP Card */}
              <Link href="/portfolio/HRGP" className="card hover:border-pb-green/50 transition-colors group">
                <div className="card-header flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-pb-green">HRGP</span>
                    <h3 className="font-semibold text-lg">High-Risk Growth</h3>
                  </div>
                  <div className="text-3xl font-bold font-mono text-pb-green">
                    {formatPercent(hrgpReturn)}
                  </div>
                </div>
                <div className="card-body">
                  <p className="text-pb-text-muted text-sm mb-4">
                    Concentrated positions in AI infrastructure and crypto for maximum growth potential.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pb-text-dim">Since Dec 2020</span>
                    <span className="text-pb-green group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>

              {/* SFGP Card */}
              <Link href="/portfolio/SFGP" className="card hover:border-pb-orange/50 transition-colors group">
                <div className="card-header flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-pb-orange">SFGP</span>
                    <h3 className="font-semibold text-lg">Safe Growth</h3>
                  </div>
                  <div className="text-3xl font-bold font-mono text-pb-orange">
                    {formatPercent(sfgpReturn)}
                  </div>
                </div>
                <div className="card-body">
                  <p className="text-pb-text-muted text-sm mb-4">
                    Diversified leveraged ETF strategy for steady, consistent growth with lower volatility.
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-pb-text-dim">Since Dec 2018</span>
                    <span className="text-pb-orange group-hover:translate-x-1 transition-transform">
                      View Details →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-pb-green/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-pb-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Follow Model Portfolios</h3>
                <p className="text-sm text-pb-text-muted">
                  Choose HRGP for aggressive growth or SFGP for steady returns. View complete track records.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-pb-orange/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-pb-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Calculate Your Allocation</h3>
                <p className="text-sm text-pb-text-muted">
                  Enter your investment amount. Get exact share counts for each position. Copy and execute.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-pb-green/10 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-pb-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Track Your Results</h3>
                <p className="text-sm text-pb-text-muted">
                  Log your trades. Calculate your returns. Compare performance against the model.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-pb-green/10 to-pb-orange/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Build Your Track Record?</h2>
            <p className="text-pb-text-muted mb-8">
              Join traders who follow proven strategies and track their progress.
            </p>
            <Link href="/signup" className="btn btn-primary text-lg px-8 py-3">
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-pb-border py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-pb-text-dim">
            © 2026 Portfolio Builder. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-pb-text-dim">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
