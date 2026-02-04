// src/pages/legal/ClearEverything.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, CheckCircle, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BackLink from '../../components/ui/BackLink';
import Button from '../../components/ui/Button';
import Flex from '../../components/ui/Flex';
import { useClearProfile } from '../../hooks/useClearProfile';
import { useThemeColors } from '../../hooks/useThemeColors';

const ClearEverything = () => {
  const navigate = useNavigate();
  const colors = useThemeColors();
  const { clearing, clearProfile, result } = useClearProfile();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState(null);

  const handleClearProfile = async () => {
    if (confirmText !== 'CLEAR') return;

    try {
      setError(null);
      await clearProfile();
      setShowConfirmModal(false);
      setConfirmText('');
    } catch (err) {
      setError(err.message || 'Failed to clear data');
    }
  };

  const handleGoBack = () => {
    navigate('/settings');
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <BackLink to="/settings">Back to Settings</BackLink>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Clear Everything</h1>
          <p className="text-sm text-gray-600">Start fresh while keeping your preferences.</p>
        </div>
        <img
          src="/assets/SVG/logo.svg"
          alt="GestAPP"
          className="w-16 h-16 sm:w-20 sm:h-20 opacity-20"
          style={{ filter: 'grayscale(100%)' }}
        />
      </div>

      {result ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Data Cleared Successfully</h3>
          <p className="text-green-700 mb-4">
            {result.worksDeleted} work{result.worksDeleted !== 1 ? 's' : ''} and {result.shiftsDeleted} shift{result.shiftsDeleted !== 1 ? 's' : ''} have been removed.
          </p>
          <p className="text-sm text-green-600 mb-6">
            Your preferences and account settings have been preserved.
          </p>
          <Button
            onClick={handleGoBack}
            themeColor={colors.primary}
            icon={RefreshCw}
          >
            Go to Settings
          </Button>
        </motion.div>
      ) : (
        <>
          <div className="prose prose-lg text-gray-700">
            <p className="text-lg leading-relaxed">
              If you want to start fresh with <strong>GestAPP</strong> without deleting your account, you can clear all your work and shift data while keeping your personal preferences.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Will Be Deleted</h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>All your registered <strong>works</strong> (jobs and delivery platforms)</li>
              <li>All your recorded <strong>shifts</strong> and their associated data</li>
              <li>All your <strong>earnings history</strong> and statistics</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Will Be Preserved</h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Your <strong>account</strong> and login credentials</li>
              <li>Your <strong>preferences</strong> (theme color, emoji, default discount, etc.)</li>
              <li>Your <strong>shift range settings</strong></li>
              <li>Smoko and delivery mode preferences</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <p className="text-yellow-800 font-semibold flex items-center gap-2">
                <AlertTriangle size={18} />
                Important Warning
              </p>
              <p className="text-yellow-700 mt-1">
                This action is <strong>irreversible</strong>. Once you clear your data, all your work history, shifts, and earnings records will be permanently deleted and cannot be recovered.
              </p>
            </div>
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
      <AnimatePresence>
        {showConfirmModal && (
          <Flex
            variant="center"
            className="fixed inset-0 bg-black/70 backdrop-blur-sm p-4"
            style={{ zIndex: 10000 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
            >
              {/* Header */}
              <div className="bg-red-500 p-6 text-center">
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    setConfirmText('');
                    setError(null);
                  }}
                  disabled={clearing}
                  className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>

                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-4 flex items-center justify-center">
                  <AlertTriangle size={32} className="text-white" />
                </div>

                <h2 className="text-xl font-bold text-white mb-2">
                  Confirm Data Deletion
                </h2>
                <p className="text-white/80 text-sm">
                  This action cannot be undone
                </p>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <p className="text-gray-600 text-center">
                  Type <strong className="text-red-600">CLEAR</strong> below to confirm that you want to delete all your works and shifts.
                </p>

                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="Type CLEAR to confirm"
                  disabled={clearing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center font-mono text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />

                {error && (
                  <p className="text-red-600 text-sm text-center">{error}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowConfirmModal(false);
                      setConfirmText('');
                      setError(null);
                    }}
                    disabled={clearing}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleClearProfile}
                    disabled={confirmText !== 'CLEAR' || clearing}
                    loading={clearing}
                    loadingText="Clearing..."
                    icon={Trash2}
                    iconPosition="left"
                    className="flex-1"
                    bgColor={confirmText === 'CLEAR' ? '#EF4444' : '#9CA3AF'}
                    textColor="white"
                  >
                    Clear Data
                  </Button>
                </div>
              </div>
            </motion.div>
          </Flex>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClearEverything;
