import Header from '@/components/Header';

export const metadata = {
  title: 'Terms of Service | Portfolio Builder',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-pb-text-muted">
          <p className="text-pb-text">
            Last updated: January 2025
          </p>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Portfolio Builder ("the Service"), you accept and agree to be bound by these 
              Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. Description of Service</h2>
            <p>
              Portfolio Builder provides portfolio tracking, trade alerts, and educational content related to 
              investing. The Service includes model portfolios, calculators, and tools to help users track 
              their own investments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Investment Disclaimer</h2>
            <p>
              <strong className="text-white">Important:</strong> The information provided through this Service 
              is for educational and informational purposes only. It should not be considered investment advice, 
              financial advice, trading advice, or any other type of advice.
            </p>
            <p className="mt-4">
              Past performance does not guarantee future results. You should consult with a qualified 
              financial advisor before making any investment decisions. You are solely responsible for 
              your investment decisions and any losses that may result.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account and password. You agree 
              to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Portfolio Builder shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to loss of 
              profits, data, or other intangible losses.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material 
              changes by posting the new terms on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">7. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@pbtracker.app.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-pb-border py-6 px-4">
        <div className="max-w-3xl mx-auto text-center text-sm text-pb-text-dim">
          © 2026 Portfolio Builder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
