// src/pages/legal/PrivacyPolicy.jsx

import BackLink from '../../components/ui/BackLink';
import { Shield, CreditCard, Database, Lock, Globe, Cookie, Bell, Construction } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="px-4 py-6 space-y-6">
      <BackLink to="/settings">Back to Settings</BackLink>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: February 5, 2026</p>
        </div>
        <img
          src="/assets/SVG/logo.svg"
          alt="Orary"
          className="w-40 h-40 sm:w-48 sm:h-48 opacity-10"
          style={{ filter: 'grayscale(100%)' }}
        />
      </div>

      {/* Development Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Construction className="text-blue-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="font-semibold text-blue-800">Application Under Development</p>
            <p className="text-blue-700 text-sm mt-1">
              Orary is currently in active development. This privacy policy may be updated as we add new features and services. We recommend reviewing this page periodically for any changes.
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-lg text-gray-700">
        <p>
          At <strong>Orary</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, store, and protect your information when you use our shift management application. By using Orary, you consent to the data practices described in this policy.
        </p>

        {/* Section 1: Information Collection */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6 not-prose">
          <div className="flex items-start gap-3">
            <Database className="text-gray-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-800">1. Information We Collect</p>
              <p className="text-gray-600 text-sm mt-2">We collect information to provide better services to all our users. This includes:</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.1 Account Information</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Authentication Data:</strong> Email address, display name, and profile photo (when using Google Sign-In or email registration).</li>
          <li><strong>Account Preferences:</strong> Language settings, theme preferences, notification settings, and other customization options.</li>
          <li><strong>Profile Information:</strong> Any additional information you choose to provide in your profile.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.2 Work and Shift Data</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Work Configurations:</strong> Job names, hourly rates, penalty rates (day/afternoon/night/weekend), and work descriptions.</li>
          <li><strong>Shift Records:</strong> Clock-in/clock-out times, break durations, shift dates, and associated work assignments.</li>
          <li><strong>Delivery Work Data:</strong> Platform information (e.g., DoorDash, Uber Eats), vehicle type, delivery earnings, tips, and kilometer/mileage tracking.</li>
          <li><strong>Earnings Calculations:</strong> Computed earnings based on your configured rates (these are estimates only).</li>
          <li><strong>Tax and Deduction Settings:</strong> Tax rates, superannuation percentages, and custom deductions you configure.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.3 Live Mode Data</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Session Data:</strong> Start time, pause/resume events, total duration, and computed earnings during live tracking sessions.</li>
          <li><strong>Usage Metrics:</strong> Number of Live Mode sessions used per month (for free tier usage limits).</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1.4 Technical Information</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Device Information:</strong> Device type, operating system, browser type and version.</li>
          <li><strong>Connection Data:</strong> IP address, approximate location (country/region level only).</li>
          <li><strong>Usage Analytics:</strong> Feature usage patterns, navigation paths, and error logs to improve the application.</li>
        </ul>

        {/* Section 2: Payments and Stripe */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-8 not-prose">
          <div className="flex items-start gap-3">
            <CreditCard className="text-purple-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-purple-800">2. Payment Processing & Stripe</p>
              <p className="text-purple-700 text-sm mt-2">
                Orary uses Stripe as our payment processor for Premium subscriptions. This section explains how payment data is handled.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Payment Data Collection</h3>
        <p>When you subscribe to Orary Premium, you will be redirected to Stripe's secure payment portal. We <strong>do not</strong> collect, store, or have access to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Your credit card number or CVV</li>
          <li>Your full bank account details</li>
          <li>Any other sensitive payment information</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Information We Receive from Stripe</h3>
        <p>To manage your subscription, we receive and store only:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Stripe Customer ID:</strong> A unique identifier that links your Orary account to your Stripe customer profile.</li>
          <li><strong>Subscription Status:</strong> Whether your subscription is active, cancelled, or past due.</li>
          <li><strong>Billing Period:</strong> Current subscription period start and end dates.</li>
          <li><strong>Payment Status:</strong> Whether payments are successful or require action.</li>
          <li><strong>Last 4 Digits:</strong> Only the last 4 digits of your payment card (for display purposes in your account settings).</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Stripe's Privacy Practices</h3>
        <p>
          Stripe is a certified PCI Service Provider Level 1, which is the most stringent level of certification available in the payments industry. When you provide payment information to Stripe, it is handled according to their privacy policy. We encourage you to review{' '}
          <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Stripe's Privacy Policy</a> for more information on how they handle your data.
        </p>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.4 Subscription Management</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Billing:</strong> Subscription fees ($2.99 AUD/month) are charged automatically through Stripe on your billing date.</li>
          <li><strong>Cancellation:</strong> You can cancel your subscription at any time from the app. Cancellation takes effect at the end of your current billing period.</li>
          <li><strong>Refunds:</strong> We do not provide refunds for partial billing periods. For billing disputes, please contact support.</li>
          <li><strong>Data After Cancellation:</strong> Your work and shift data remains intact after cancellation. Only Premium features become unavailable.</li>
        </ul>

        {/* Section 3: How We Use Information */}
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
        <p>We use the data we collect to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Provide Core Services:</strong> Enable shift tracking, earnings calculations, statistics visualization, and data synchronization.</li>
          <li><strong>Sync Across Devices:</strong> Keep your data synchronized securely across all your devices.</li>
          <li><strong>Process Payments:</strong> Manage Premium subscriptions and billing through Stripe.</li>
          <li><strong>Improve the Application:</strong> Analyze usage patterns to fix bugs, optimize performance, and develop new features.</li>
          <li><strong>Communicate with You:</strong> Send important updates about your account, security alerts, and service changes.</li>
          <li><strong>Provide Support:</strong> Respond to your questions and resolve technical issues.</li>
        </ul>

        {/* Section 4: Data Storage and Security */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-8 not-prose">
          <div className="flex items-start gap-3">
            <Lock className="text-green-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-green-800">4. Data Storage & Security</p>
              <p className="text-green-700 text-sm mt-2">
                Your data is stored securely using industry-standard encryption and security practices.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Where Your Data is Stored</h3>
        <p>
          Orary uses Firebase (Google Cloud Platform) for data storage and authentication. Your data is stored in secure data centers with the following protections:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Encryption in transit (TLS/SSL) and at rest (AES-256)</li>
          <li>Automatic backup and disaster recovery</li>
          <li>Strict access controls and authentication</li>
          <li>Regular security audits and compliance certifications</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Security Measures</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Authentication:</strong> Secure login via Firebase Authentication with optional Google Sign-In.</li>
          <li><strong>Data Isolation:</strong> Each user's data is strictly isolated and accessible only to that user.</li>
          <li><strong>Secure API Calls:</strong> All communication between the app and our servers is encrypted.</li>
          <li><strong>No Plain Text Storage:</strong> Sensitive data is never stored in plain text.</li>
        </ul>

        {/* Section 5: Data Sharing */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mt-8 not-prose">
          <div className="flex items-start gap-3">
            <Globe className="text-orange-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-orange-800">5. Data Sharing & Third Parties</p>
              <p className="text-orange-700 text-sm mt-2">
                We do not sell your personal data. We only share data with trusted service providers essential to operating Orary.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Service Providers We Use</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Firebase (Google):</strong> Authentication, database storage, and hosting.</li>
          <li><strong>Stripe:</strong> Payment processing for Premium subscriptions.</li>
          <li><strong>Google Calendar API:</strong> Optional calendar synchronization (only with your explicit permission).</li>
          <li><strong>Netlify:</strong> Web application hosting and deployment.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Work Sharing Feature</h3>
        <p>
          When you use the "Share Work" feature, a temporary share link is created containing your work configuration (name, rates, settings). This data:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Expires automatically after 7 days</li>
          <li>Has a maximum of 10 uses</li>
          <li>Does not include your personal information or shift history</li>
          <li>Can be deactivated by you at any time</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.3 Legal Disclosure</h3>
        <p>
          We may disclose your information if required by law, court order, or governmental regulation, or to protect the rights, property, or safety of Orary, our users, or others.
        </p>

        {/* Section 6: Cookies and Local Storage */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-8 not-prose">
          <div className="flex items-start gap-3">
            <Cookie className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-yellow-800">6. Cookies & Local Storage</p>
              <p className="text-yellow-700 text-sm mt-2">
                Orary uses essential cookies and local storage for application functionality.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4">We use the following types of storage:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Authentication Cookies:</strong> To keep you logged in securely.</li>
          <li><strong>Local Storage:</strong> To cache your preferences and improve performance.</li>
          <li><strong>IndexedDB:</strong> For offline functionality and data caching.</li>
        </ul>
        <p className="mt-4">
          We do not use advertising cookies or tracking cookies for marketing purposes. All cookies are essential for the application to function properly.
        </p>

        {/* Section 7: Your Rights */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mt-8 not-prose">
          <div className="flex items-start gap-3">
            <Shield className="text-indigo-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-indigo-800">7. Your Privacy Rights</p>
              <p className="text-indigo-700 text-sm mt-2">
                You have full control over your personal data. Here are your rights under GDPR, CCPA, and other privacy regulations.
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 Your Rights Include</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Right to Access:</strong> Request a copy of all data we have about you.</li>
          <li><strong>Right to Rectification:</strong> Correct any inaccurate information in your profile.</li>
          <li><strong>Right to Erasure:</strong> Delete your account and all associated data permanently.</li>
          <li><strong>Right to Data Portability:</strong> Export your data in a machine-readable format.</li>
          <li><strong>Right to Restrict Processing:</strong> Limit how we use your data.</li>
          <li><strong>Right to Object:</strong> Object to certain types of data processing.</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for optional data processing at any time.</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 How to Exercise Your Rights</h3>
        <p>You can exercise these rights directly within the app:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>View/Edit Data:</strong> Access and modify your data through Settings.</li>
          <li><strong>Clear Data:</strong> Use "Clear Everything" to erase all work and shift data while keeping your account.</li>
          <li><strong>Delete Account:</strong> Use "Delete Account" to permanently remove your account and all data.</li>
          <li><strong>Export Data:</strong> Use the export feature (coming soon) to download your data.</li>
        </ul>
        <p className="mt-4">
          You can also contact us at{' '}
          <a href="mailto:privacy@orary.app" className="text-pink-600 hover:underline">privacy@orary.app</a>{' '}
          for any privacy-related requests.
        </p>

        {/* Section 8: Data Retention */}
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Data Retention</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Active Accounts:</strong> We retain your data for as long as your account is active.</li>
          <li><strong>Deleted Accounts:</strong> When you delete your account, all data is permanently removed within 30 days.</li>
          <li><strong>Backup Copies:</strong> Backup copies may persist for up to 90 days for disaster recovery purposes, after which they are permanently deleted.</li>
          <li><strong>Legal Requirements:</strong> We may retain certain data longer if required by law (e.g., billing records for tax purposes).</li>
        </ul>

        {/* Section 9: Children's Privacy */}
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Children's Privacy</h2>
        <p>
          Orary is not intended for use by individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that a child under 16 has provided us with personal information, we will take steps to delete such information.
        </p>

        {/* Section 10: International Data Transfers */}
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws. When we transfer your information, we ensure appropriate safeguards are in place to protect your data, including standard contractual clauses approved by relevant authorities.
        </p>

        {/* Section 11: Changes to Privacy Policy */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-8 not-prose">
          <div className="flex items-start gap-3">
            <Bell className="text-gray-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-gray-800">11. Changes to This Policy</p>
              <p className="text-gray-700 text-sm mt-2">
                We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting a notice in the app or sending you an email. We encourage you to review this policy periodically.
              </p>
            </div>
          </div>
        </div>

        {/* Section 12: Contact */}
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Contact Us</h2>
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li><strong>Email:</strong>{' '}
            <a href="mailto:privacy@orary.app" className="text-pink-600 hover:underline">privacy@orary.app</a>
          </li>
          <li><strong>Support:</strong>{' '}
            <a href="mailto:support@orary.app" className="text-pink-600 hover:underline">support@orary.app</a>
          </li>
        </ul>
        <p className="mt-4 text-sm text-gray-500">
          We aim to respond to all privacy inquiries within 30 days.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
