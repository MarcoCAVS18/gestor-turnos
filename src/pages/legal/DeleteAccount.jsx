// src/pages/legal/DeleteAccount.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import { clearUserData } from '../../services/firebaseService';
import BackLink from '../../components/ui/BackLink';
import Button from '../../components/ui/Button';
import ConfirmActionModal from '../../components/modals/ConfirmActionModal';
import { useAuth } from '../../contexts/AuthContext';
import { usePremium } from '../../contexts/PremiumContext';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isPremium, cancelSubscription } = usePremium();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [reAuthError, setReAuthError] = useState(null);
  const [deletionComplete, setDeletionComplete] = useState(false);

  const handleDeleteAccount = async (e, reAuthData) => {
    e.preventDefault();

    if (!currentUser) {
      setError('No user logged in');
      return;
    }

    try {
      setDeleting(true);
      setError(null);
      setReAuthError(null);

      // Re-authenticate user before deletion
      if (reAuthData?.isGoogleUser) {
        // Re-authenticate with Google popup
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(auth.currentUser, provider);
      } else {
        // Re-authenticate with email/password
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          reAuthData?.password || ''
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
      }

      // If user has Premium, cancel subscription first
      if (isPremium) {
        await cancelSubscription();
      }

      // 1. Clear all user data (works, shifts, etc.)
      await clearUserData(currentUser.uid);

      // 2. Delete user document from Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await deleteDoc(userDocRef);

      // 3. Delete user from Firebase Auth
      await deleteUser(auth.currentUser);

      setShowConfirmModal(false);
      setDeletionComplete(true);

      // Redirect to login after showing success message
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: 'Your account has been deleted successfully. We hope to see you again!'
          }
        });
      }, 3000);

    } catch (err) {
      // Handle re-authentication errors
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setReAuthError('Incorrect password. Please try again.');
        setDeleting(false);
        return;
      }
      if (err.code === 'auth/popup-closed-by-user') {
        setReAuthError('Google sign-in was cancelled. Please try again.');
        setDeleting(false);
        return;
      }
      if (err.code === 'auth/popup-blocked') {
        setReAuthError('Popup was blocked. Please allow popups and try again.');
        setDeleting(false);
        return;
      }
      if (err.code === 'auth/requires-recent-login') {
        setReAuthError('Session expired. Please try again.');
        setDeleting(false);
        return;
      }

      // Handle other errors
      setError(err.message || 'Failed to delete account. Please try again or contact support.');
      setDeleting(false);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <BackLink to="/settings">Back to Settings</BackLink>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Account Deletion</h1>
          <p className="text-sm text-gray-600">We are sorry to see you go.</p>
        </div>
        <img
          src="/assets/SVG/logo.svg"
          alt="Orary"
          className="w-40 h-40 sm:w-48 sm:h-48 opacity-10"
          style={{ filter: 'grayscale(100%)' }}
        />
      </div>

      {deletionComplete ? (
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
          <h3 className="text-xl font-semibold text-green-800 mb-2">Account Deleted</h3>
          <p className="text-green-700 mb-4">
            Your account has been permanently deleted.
          </p>
          <p className="text-sm text-green-600">
            Thank you for using Orary. We hope to see you again!
          </p>
        </motion.div>
      ) : (
        <>
          <div className="prose prose-lg text-gray-700">
            <p className="text-lg leading-relaxed">
              If you wish to permanently delete your <strong>Orary</strong> account and all associated data, you can do so below. Please be aware that this action is <strong className="text-red-600">irreversible</strong>.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Will Be Deleted</h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Your <strong>account</strong> and login credentials</li>
              <li>All your registered <strong>works</strong> (jobs and delivery platforms)</li>
              <li>All your recorded <strong>shifts</strong> and their associated data</li>
              <li>All your <strong>earnings history</strong> and statistics</li>
              <li>Your <strong>profile</strong> and all personal information</li>
              {isPremium && (
                <li>Your <strong>Premium subscription</strong> will be cancelled</li>
              )}
            </ul>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
              <p className="text-red-800 font-semibold flex items-center gap-2">
                <AlertTriangle size={18} />
                Permanent Deletion Warning
              </p>
              <p className="text-red-700 mt-1">
                This action <strong>cannot be undone</strong>. Once you delete your account, all your data will be permanently erased from our servers and cannot be recovered under any circumstances.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-200 space-y-4">
            <Button
              onClick={() => setShowConfirmModal(true)}
              variant="solid"
              icon={Trash2}
              iconPosition="left"
              className="w-full sm:w-auto"
              bgColor="#EF4444"
              textColor="white"
            >
              Delete My Account
            </Button>

            {/* Alternative: Email deletion */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 font-medium flex items-center gap-2 mb-2">
                <Mail size={18} />
                Prefer to request deletion by email?
              </p>
              <p className="text-sm text-gray-600 mb-2">
                If you prefer, you can also request account deletion by sending an email to:
              </p>
              <div className="bg-white p-3 rounded-lg border border-gray-200">
                <p className="font-mono text-pink-700 font-bold">support@orary.app</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Include your registered email and display name for verification. Deletion will be processed within 30 days.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmActionModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setReAuthError(null);
        }}
        onConfirm={handleDeleteAccount}
        loading={deleting}
        variant="delete-account"
        isPremium={isPremium}
        reAuthError={reAuthError}
      />
    </div>
  );
};

export default DeleteAccount;
