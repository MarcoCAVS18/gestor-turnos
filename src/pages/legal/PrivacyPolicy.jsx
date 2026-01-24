// src/pages/legal/PrivacyPolicy.jsx

import React from 'react';

const PrivacyPolicy = () => ***REMOVED***
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 bg-white min-h-screen">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated: December 15, 2025</p>
      </div>

      <div className="prose prose-lg text-gray-700">
        <p>
          At <strong>GestAPP</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your information when you use our shift management application.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
        <p>We collect information to provide better services to all our users. This includes:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Account Information:</strong> Name, email address, and profile photo (when you sign up or use Google Sign-In).</li>
          <li><strong>Work Data:</strong> Shift times, earnings, work locations, and tax/deduction settings you input to manage your income.</li>
          <li><strong>Device Data:</strong> IP address, device type, and operating system version for maintenance and security purposes.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use the data we collect to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Provide, maintain, and improve the core features of GestAPP (shift tracking, calculations, and statistics).</li>
          <li>Sync your data securely across your devices using our cloud infrastructure.</li>
          <li>Communicate with you regarding support requests, security updates, or service changes.</li>
          <li>Analyze usage patterns to optimize the performance of the application.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Data Sharing & Security</h2>
        <p>
          We do not sell your personal data to third parties. Your data is stored securely on Firebase (Google Cloud Platform) servers.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><strong>Third-Party Services:</strong> We use Google Authentication for login and Firebase for real-time database storage. These services process data only as necessary to provide the functionality of GestAPP.</li>
          <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect our rights.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Your Rights (GDPR & CCPA)</h2>
        <p>You have the right to access, correct, or delete your personal data at any time. You can download your data or request account deletion directly from the app settings or by contacting support.</p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at***REMOVED***' '***REMOVED***
          <a href="mailto:privacy@gestapp.com" className="text-pink-600 hover:underline">privacy@gestapp.com</a>.
        </p>
      </div>
    </div>
  );
***REMOVED***;

export default PrivacyPolicy;