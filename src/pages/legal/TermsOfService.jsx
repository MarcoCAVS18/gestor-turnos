// src/pages/legal/TermsOfService.jsx

import BackLink from '../../components/ui/BackLink';

const TermsOfService = () => {
  return (
    <div className="px-4 py-6 space-y-6">
      <BackLink to="/settings">Back to Settings</BackLink>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: December 15, 2025</p>
        </div>
        <img
          src="/assets/SVG/logo.svg"
          alt="GestAPP"
          className="w-16 h-16 sm:w-20 sm:h-20 opacity-20"
          style={{ filter: 'grayscale(100%)' }}
        />
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

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
        <p>As a user of GestAPP, you agree to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Provide accurate and current information when creating your account.</li>
          <li>Maintain the security of your password and account.</li>
          <li>Accept full responsibility for all activities that occur under your account.</li>
          <li>Not use the application for any illegal purpose or to harass other users.</li>
          <li>Understand that calculations provided by the app are estimates based on user input and should not be used as official legal or tax documents without verification.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
        <p>
          The GestAPP application, its design, text, graphics, and the code underlying the service are owned by GestAPP and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit permission.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access to GestAPP at our sole discretion, without prior notice or liability, for any reason, including but not limited to a breach of these Terms.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, GestAPP shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Governing Law</h2>
        <p>
          These Terms shall be governed and construed in accordance with the laws of your jurisdiction, without regard to its conflict of law provisions.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;