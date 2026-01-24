// src/pages/legal/DeleteAccount.jsx

import React from 'react';

const DeleteAccount = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 bg-white min-h-screen">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Deletion</h1>
        <p className="text-lg text-gray-600">We are sorry to see you go.</p>
      </div>
      
      <div className="prose prose-lg text-gray-700">
        <p className="text-lg leading-relaxed">
          If you wish to permanently delete your <strong>GestAPP</strong> account and all associated data, please follow the instructions below. Please be aware that this action is irreversible.
        </p>
        
        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How to Request Deletion</h2>
        <p>
          To ensure the security of your data, we do not support instant account deletion directly from the app for security reasons. Please send an email to:
        </p>
        <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-pink-500 my-4">
          <p className="font-mono text-pink-700 font-bold">support@gestapp.com</p>
        </div>
        
        <p>Please include the following information in the body of your email to verify your identity:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>The email address associated with your account.</li>
          <li>Your Display Name (as it appears in the app).</li>
          <li>A brief reason for leaving (optional, but helps us improve).</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Happens Next?</h2>
        <p>
          Once we receive your request:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2">
          <li>We will verify your ownership of the account.</li>
          <li>You will receive a confirmation email at the address associated with the account.</li>
          <li>Your account and all personal data (including work shifts, earnings history, and profile settings) will be permanently erased from our servers within <strong>30 days</strong>.</li>
        </ol>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <p className="text-yellow-800 font-semibold">
            Important Note:
          </p>
          <p className="text-yellow-700 mt-1">
            Deleting your account means you will lose access to all your historical data, shift records, and earnings calculations. This data cannot be recovered once the deletion process is complete.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccount;