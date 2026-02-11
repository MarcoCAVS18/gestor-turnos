// src/pages/legal/TermsOfService.jsx

import BackLink from '../../components/ui/BackLink';
import { AlertTriangle, Construction } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="px-4 py-6 space-y-6">
      <BackLink to="/settings">Back to Settings</BackLink>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: February 5, 2026</p>
        </div>
        <img
          src="/assets/SVG/logo.svg"
          alt="GestAPP"
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
              GestAPP is currently in active development. We are continuously working to improve the application and add new features. Some functionalities may change, and we appreciate your patience as we work towards making GestAPP the best tool for managing your work shifts.
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-lg text-gray-700">
        <p>
          Welcome to <strong>GestAPP</strong>. By downloading, accessing, or using this application, you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you must not access our service.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          These Terms constitute a legally binding agreement between you and GestAPP. We reserve the right to modify these terms at any time. Continued use of the app after changes constitutes acceptance of the new terms.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
        <p>
          GestAPP is a digital tool designed to help workers track their shifts, calculate earnings based on configurable rates, and visualize their work statistics. The service is provided "as is" and is intended for personal organizational purposes.
        </p>

        {/* Important Disclaimer about Calculations */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6 not-prose">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-amber-800">Important Disclaimer About Calculations</p>
              <ul className="text-amber-700 text-sm mt-2 space-y-2">
                <li>• All earnings calculations displayed in GestAPP are <strong>estimates</strong> based on the rates and preferences you configure within the application.</li>
                <li>• Your actual paycheck may include additional values not tracked by this application, such as bonuses, penalties, superannuation contributions, tax withholdings, or other payroll adjustments.</li>
                <li>• The values shown are <strong>not official</strong> and should not be used as legal or tax documents.</li>
                <li>• Always verify your actual earnings with your official payslips and employer records.</li>
                <li>• GestAPP is not responsible for any discrepancies between the estimated values and your actual received payment.</li>
              </ul>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
        <p>As a user of GestAPP, you agree to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Provide accurate and current information when creating your account.</li>
          <li>Maintain the security of your password and account.</li>
          <li>Accept full responsibility for all activities that occur under your account.</li>
          <li>Not use the application for any illegal purpose or to harass other users.</li>
          <li>Understand that calculations provided by the app are estimates based on user input and should not be used as official legal or tax documents without verification.</li>
          <li>Configure your hourly rates, shift types, and deductions accurately to obtain the most precise estimates.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Premium Subscription</h2>
        <p>
          GestAPP offers a Premium subscription with additional features. By subscribing:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>You agree to pay the recurring subscription fee ($2.99 AUD/month).</li>
          <li>Payments are processed securely through Stripe.</li>
          <li>You can cancel your subscription at any time from the app settings.</li>
          <li>Cancellation takes effect at the end of your current billing period.</li>
          <li>No refunds are provided for partial billing periods.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Intellectual Property</h2>
        <p>
          The GestAPP application, its design, text, graphics, and the code underlying the service are owned by GestAPP and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit permission.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to GestAPP at our sole discretion, without prior notice or liability, for any reason, including but not limited to a breach of these Terms.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, GestAPP shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
        </p>
        <p className="mt-2">
          <strong>Specifically, GestAPP is not liable for:</strong>
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Any financial decisions made based on the earnings estimates provided by the app.</li>
          <li>Discrepancies between estimated and actual earnings.</li>
          <li>Tax implications or legal matters related to your employment.</li>
          <li>Data loss due to user error or third-party service outages.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at{' '}
          <a href="mailto:support@gestapp.com" className="text-pink-600 hover:underline">support@gestapp.com</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
