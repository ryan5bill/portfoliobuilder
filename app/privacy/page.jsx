import Header from '@/components/Header';

export const metadata = {
  title: 'Privacy Policy | Portfolio Builder',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-6 text-pb-text-muted">
          <p className="text-pb-text">
            Last updated: January 2025
          </p>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Email address (for account creation and notifications)</li>
              <li>Phone number (optional, for SMS alerts)</li>
              <li>Name (optional)</li>
              <li>Trade data you choose to log</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Send you trade alerts and notifications you've subscribed to</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns to improve the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">3. Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. We may share 
              information with:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Service providers who assist in operating our Service (e.g., email providers)</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, 
              no method of transmission over the Internet is 100% secure, and we cannot guarantee 
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Access and receive a copy of your data</li>
              <li>Update or correct your information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">6. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to maintain your session and remember 
              your preferences. You can control cookies through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">7. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes 
              by posting the new policy on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mt-8 mb-4">8. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at privacy@pbtracker.app.
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
