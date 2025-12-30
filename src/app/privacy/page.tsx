import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Rumble Raffle - Learn how we collect, use, and protect your personal information.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL || 'https://rumbleraffle.com'}/privacy`,
  },
};

export default function PrivacyPage() {
  const lastUpdated = "December 30, 2024";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back to Home */}
        <Link href="/" className="text-purple-400 hover:text-purple-300 mb-8 inline-block">
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-bevan)] mb-4 text-white">
            Privacy Policy
          </h1>
          <p className="text-gray-400">
            Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-purple max-w-none">
          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700 space-y-8">

            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 mb-4">
                Welcome to Rumble Raffle ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and use our services, and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-purple-400 mb-3 mt-4">2.1 Information You Provide</h3>
              <p className="text-gray-300 mb-2">We collect information you provide directly to us, including:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Account information (name, email address, password)</li>
                <li>Profile information (display name, preferences)</li>
                <li>League and participant data you create or manage</li>
                <li>Communications with us (support requests, feedback)</li>
              </ul>

              <h3 className="text-xl font-semibold text-purple-400 mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p className="text-gray-300 mb-2">When you use our services, we automatically collect:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, features used)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Log data (access times, error logs)</li>
              </ul>

              <h3 className="text-xl font-semibold text-purple-400 mb-3 mt-6">2.3 Third-Party Information</h3>
              <p className="text-gray-300">
                We may receive information about you from third-party services if you choose to connect your account with external platforms (e.g., social media login providers).
              </p>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-300 mb-2">We use the information we collect to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Create and manage your account</li>
                <li>Process your transactions and send related information</li>
                <li>Send you technical notices, updates, and security alerts</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Send you marketing and promotional communications (with your consent)</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, prevent, and address technical issues and fraudulent activity</li>
                <li>Personalize and improve your experience</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            {/* Email Marketing */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Email Marketing</h2>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">4.1 Marketing Communications</h3>
              <p className="text-gray-300 mb-4">
                With your consent, we may send you marketing emails about new features, special offers, wrestling events, and other information we think you might find interesting. You can opt-in to receive these communications during account registration or through your account settings.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">4.2 Transactional Emails</h3>
              <p className="text-gray-300 mb-4">
                We will send you transactional emails related to your account and league activities, such as:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Account verification and password reset emails</li>
                <li>League invitations and notifications</li>
                <li>Important service updates and security alerts</li>
              </ul>
              <p className="text-gray-300 mt-4">
                You cannot opt-out of transactional emails as they are necessary for the operation of our services.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3 mt-6">4.3 Unsubscribe</h3>
              <p className="text-gray-300">
                You can unsubscribe from marketing emails at any time by clicking the "Unsubscribe" link at the bottom of any marketing email or by adjusting your email preferences in your account settings.
              </p>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. How We Share Your Information</h2>
              <p className="text-gray-300 mb-4">
                We do not sell your personal information. We may share your information in the following circumstances:
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">5.1 With Your Consent</h3>
              <p className="text-gray-300 mb-4">
                We may share your information when you give us permission to do so.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">5.2 Service Providers</h3>
              <p className="text-gray-300 mb-4">
                We may share your information with third-party service providers who perform services on our behalf, such as:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Hosting and cloud storage providers</li>
                <li>Email delivery services</li>
                <li>Analytics providers</li>
                <li>Payment processors</li>
                <li>Customer support tools</li>
              </ul>

              <h3 className="text-xl font-semibold text-purple-400 mb-3 mt-6">5.3 Legal Requirements</h3>
              <p className="text-gray-300 mb-4">
                We may disclose your information if required by law or in response to valid requests by public authorities (e.g., court orders, subpoenas).
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">5.4 Business Transfers</h3>
              <p className="text-gray-300">
                If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
              <p className="text-gray-300 mb-4">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments</li>
                <li>Access controls and authentication</li>
                <li>Secure cloud infrastructure</li>
              </ul>
              <p className="text-gray-300 mt-4">
                However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your personal data, we cannot guarantee its absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
              <p className="text-gray-300">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this privacy policy, unless a longer retention period is required or permitted by law. When we no longer need your personal data, we will securely delete or anonymize it.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Your Privacy Rights</h2>
              <p className="text-gray-300 mb-4">
                Depending on your location, you may have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>
              <p className="text-gray-300 mt-4">
                To exercise these rights, please contact us at the email address provided below.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Cookies and Tracking Technologies</h2>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-4">
                <p className="text-purple-200 font-semibold mb-2">Current Cookie Usage</p>
                <p className="text-gray-300">
                  We currently only use essential authentication cookies required for our service to function. We do not use analytics, marketing, or tracking cookies at this time.
                </p>
              </div>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">Essential Cookies</h3>
              <p className="text-gray-300 mb-4">
                We use authentication cookies provided by Supabase to manage user sessions and keep you logged in. These cookies are strictly necessary for the website to function properly and cannot be disabled if you want to use our services.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3 mt-6">Future Cookie Usage</h3>
              <p className="text-gray-300 mb-4">
                In the future, we may implement additional cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong>Analytics Cookies:</strong> To help us understand how visitors use our website and improve user experience</li>
                <li><strong>Functional Cookies:</strong> To enable enhanced functionality and personalization</li>
              </ul>

              <p className="text-gray-300 mt-4">
                If we introduce non-essential cookies in the future, we will update this policy and obtain your consent where required by law.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3 mt-6">Managing Cookies</h3>
              <p className="text-gray-300">
                You can control and manage cookies through your browser settings. However, disabling essential cookies will prevent you from using certain features of our services, such as staying logged in.
              </p>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">10. Third-Party Links</h2>
              <p className="text-gray-300">
                Our services may contain links to third-party websites, applications, or services. We are not responsible for the privacy practices of these third parties. We encourage you to read the privacy policies of any third-party sites you visit.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">11. Children's Privacy</h2>
              <p className="text-gray-300">
                Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information.
              </p>
            </section>

            {/* International Data Transfers */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">12. International Data Transfers</h2>
              <p className="text-gray-300">
                Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws. We ensure appropriate safeguards are in place to protect your personal data in accordance with this privacy policy.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">13. Changes to This Privacy Policy</h2>
              <p className="text-gray-300">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date. We encourage you to review this privacy policy periodically for any changes.
              </p>
            </section>

            {/* Contact Us */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">14. Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
                <p className="text-gray-300 mb-2">
                  <strong className="text-white">Email:</strong>{" "}
                  <a href="mailto:privacy@rumbleraffle.com" className="text-purple-400 hover:text-purple-300">
                    privacy@rumbleraffle.com
                  </a>
                </p>
                <p className="text-gray-300 mb-2">
                  <strong className="text-white">Website:</strong>{" "}
                  <Link href="/" className="text-purple-400 hover:text-purple-300">
                    https://rumbleraffle.com
                  </Link>
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">Developer Contact:</strong>{" "}
                  <a href="https://seanmun.com/" className="text-purple-400 hover:text-purple-300" target="_blank" rel="noopener noreferrer">
                    https://seanmun.com
                  </a>
                </p>
              </div>
            </section>

            {/* GDPR/CCPA Notice */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">15. Additional Information for EU and California Residents</h2>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">15.1 GDPR (EU Residents)</h3>
              <p className="text-gray-300 mb-4">
                If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR), including the right to lodge a complaint with a supervisory authority.
              </p>

              <h3 className="text-xl font-semibold text-purple-400 mb-3">15.2 CCPA (California Residents)</h3>
              <p className="text-gray-300 mb-4">
                If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA), including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>The right to know what personal information we collect</li>
                <li>The right to delete personal information</li>
                <li>The right to opt-out of the sale of personal information (we do not sell personal information)</li>
                <li>The right to non-discrimination for exercising your privacy rights</li>
              </ul>
            </section>

          </div>
        </div>

        {/* Back to Top */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-2">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
