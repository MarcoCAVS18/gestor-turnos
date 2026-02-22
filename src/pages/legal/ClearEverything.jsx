// src/pages/legal/ClearEverything.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import BackLink from '../../components/ui/BackLink';
import Button from '../../components/ui/Button';
import ConfirmActionModal from '../../components/modals/ConfirmActionModal';
import { useClearProfile } from '../../hooks/useClearProfile';
import { useAuth } from '../../contexts/AuthContext';
import { usePremium } from '../../contexts/PremiumContext';

const ClearEverything = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { clearing, clearProfile } = useClearProfile();
  const { isPremium, cancelSubscription } = usePremium();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState(null);
  const [clearingComplete, setClearingComplete] = useState(false);

  const handleClearProfile = async (e) => {
    e.preventDefault();

    try {
      setError(null);

      // If user has Premium, cancel subscription first
      if (isPremium) {
        await cancelSubscription();
      }

      await clearProfile();
      setShowConfirmModal(false);
      setClearingComplete(true);

      // Wait a moment to show success message, then logout
      setTimeout(async () => {
        try {
          await logout();
          navigate('/login', {
            state: {
              message: 'Your data has been cleared successfully. Please log in again to continue.'
            }
          });
        } catch {
          navigate('/login');
        }
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to clear data');
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <BackLink back />

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Clear Everything</h1>
          <p className="text-sm text-gray-600">Start fresh while keeping your account.</p>
        </div>
        <img
          src="/assets/SVG/logo.svg"
          alt="Orary"
          className="w-40 h-40 sm:w-48 sm:h-48 opacity-10"
          style={{ filter: 'grayscale(100%)' }}
        />
      </div>

      {clearingComplete ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4">
            <img
              src="/assets/SVG/logo.svg"
              alt="Orary"
              className="w-full h-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Data Cleared Successfully</h3>
          <p className="text-green-700 mb-4">
            Your session is being closed...
          </p>
          <p className="text-sm text-green-600">
            You will be redirected to the login page. Use your credentials to log in again.
          </p>
        </motion.div>
      ) : (
        <>
          <div className="prose prose-lg text-gray-700">
            <p className="text-lg leading-relaxed">
              If you want to start fresh with <strong>Orary</strong> without deleting your account, you can clear all your work and shift data while keeping your login credentials.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Will Be Deleted</h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>All your registered <strong>works</strong> (jobs and delivery platforms)</li>
              <li>All your recorded <strong>shifts</strong> and their associated data</li>
              <li>All your <strong>earnings history</strong> and statistics</li>
              <li>Your <strong>preferences</strong> and settings</li>
              {isPremium && (
                <li>Your <strong>Premium subscription</strong> will be cancelled</li>
              )}
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Will Be Preserved</h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Your <strong>account</strong> and login credentials</li>
              <li>Your <strong>email</strong> and <strong>display name</strong></li>
            </ul>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-200">
            <Button
              onClick={() => setShowConfirmModal(true)}
              variant="solid"
              icon={Trash2}
              iconPosition="left"
              className="w-full sm:w-auto"
              bgColor="#EF4444"
              textColor="white"
            >
              Clear All Data
            </Button>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmActionModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleClearProfile}
        loading={clearing}
        variant="clear-data"
        isPremium={isPremium}
      />
    </div>
  );
};

export default ClearEverything;
