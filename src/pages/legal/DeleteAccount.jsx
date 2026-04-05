// src/pages/legal/DeleteAccount.jsx

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Trash2, AlertTriangle, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
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
import { removeBiometricCredential } from '../../services/biometricService';
import BackLink from '../../components/ui/BackLink';
import Button from '../../components/ui/Button';
import ConfirmActionModal from '../../components/modals/ConfirmActionModal';
import { useAuth } from '../../contexts/AuthContext';
import { usePremium } from '../../contexts/PremiumContext';

const DeleteAccount = () => {
  const { t } = useTranslation();
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
      setError(t('deleteAccount.errors.noUser'));
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

      // 4. Clear first-time experience flags so re-registration starts fresh
      localStorage.removeItem('orary_demo_seen');
      localStorage.removeItem('orary_settings_onboarding_done');
      // 5. Clear biometric credentials so the button doesn't appear on the login screen
      removeBiometricCredential(currentUser.uid);

      setShowConfirmModal(false);
      setDeletionComplete(true);

      // Redirect to login after showing success message
      setTimeout(() => {
        navigate('/login', {
          state: {
            message: t('deleteAccount.success.redirectMessage')
          }
        });
      }, 3000);

    } catch (err) {
      // Handle re-authentication errors
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setReAuthError(t('deleteAccount.errors.wrongPassword'));
        setDeleting(false);
        return;
      }
      if (err.code === 'auth/popup-closed-by-user') {
        setReAuthError(t('deleteAccount.errors.popupClosed'));
        setDeleting(false);
        return;
      }
      if (err.code === 'auth/popup-blocked') {
        setReAuthError(t('deleteAccount.errors.popupBlocked'));
        setDeleting(false);
        return;
      }
      if (err.code === 'auth/requires-recent-login') {
        setReAuthError(t('deleteAccount.errors.sessionExpired'));
        setDeleting(false);
        return;
      }

      // Handle other errors
      setError(err.message || t('deleteAccount.errors.generic'));
      setDeleting(false);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      <BackLink back />

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{t('deleteAccount.title')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('deleteAccount.subtitle')}</p>
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
          className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-4">
            <img
              src="/assets/SVG/logo.svg"
              alt="Orary"
              className="w-full h-full"
            />
          </div>
          <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">{t('deleteAccount.success.title')}</h3>
          <p className="text-green-700 dark:text-green-400 mb-4">
            {t('deleteAccount.success.description')}
          </p>
          <p className="text-sm text-green-600 dark:text-green-500">
            {t('deleteAccount.success.farewell')}
          </p>
        </motion.div>
      ) : (
        <>
          <div className="prose prose-lg text-gray-700 dark:text-gray-300 dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: t('deleteAccount.intro') }} />

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">{t('deleteAccount.whatWillBeDeleted.title')}</h2>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li dangerouslySetInnerHTML={{ __html: t('deleteAccount.whatWillBeDeleted.account') }} />
              <li dangerouslySetInnerHTML={{ __html: t('deleteAccount.whatWillBeDeleted.works') }} />
              <li dangerouslySetInnerHTML={{ __html: t('deleteAccount.whatWillBeDeleted.shifts') }} />
              <li dangerouslySetInnerHTML={{ __html: t('deleteAccount.whatWillBeDeleted.earnings') }} />
              <li dangerouslySetInnerHTML={{ __html: t('deleteAccount.whatWillBeDeleted.profile') }} />
              {isPremium && (
                <li dangerouslySetInnerHTML={{ __html: t('deleteAccount.whatWillBeDeleted.premium') }} />
              )}
            </ul>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-6">
              <p className="text-red-800 dark:text-red-300 font-semibold flex items-center gap-2">
                <AlertTriangle size={18} />
                {t('deleteAccount.warning.title')}
              </p>
              <p className="text-red-700 dark:text-red-400 mt-1" dangerouslySetInnerHTML={{ __html: t('deleteAccount.warning.description') }} />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <Button
              onClick={() => setShowConfirmModal(true)}
              variant="solid"
              icon={Trash2}
              iconPosition="left"
              className="w-full sm:w-auto"
              bgColor="#EF4444"
              textColor="white"
            >
              {t('deleteAccount.deleteButton')}
            </Button>

            {/* Alternative: Email deletion */}
            <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2 mb-2">
                <Mail size={18} />
                {t('deleteAccount.emailAlternative.title')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {t('deleteAccount.emailAlternative.description')}
              </p>
              <div className="bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="font-mono text-pink-700 dark:text-pink-400 font-bold">support@orary.app</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t('deleteAccount.emailAlternative.note')}
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
