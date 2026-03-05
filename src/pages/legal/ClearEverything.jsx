// src/pages/legal/ClearEverything.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import BackLink from '../../components/ui/BackLink';
import Button from '../../components/ui/Button';
import ConfirmActionModal from '../../components/modals/ConfirmActionModal';
import { useClearProfile } from '../../hooks/useClearProfile';
import { useAuth } from '../../contexts/AuthContext';
import { usePremium } from '../../contexts/PremiumContext';

const ClearEverything = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { clearing, clearProfile } = useClearProfile();
  const { isPremium, cancelSubscription } = usePremium();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState(null);

  const handleClearProfile = async (e) => {
    e.preventDefault();

    try {
      setError(null);

      // If user has Premium, cancel subscription first
      if (isPremium) {
        await cancelSubscription();
      }

      await clearProfile();

      try {
        await logout();
        navigate('/login', {
          state: {
            message: t('clearEverything.successMessage')
          }
        });
      } catch {
        navigate('/login');
      }

    } catch (err) {
      setShowConfirmModal(false);
      setError(err.message || t('clearEverything.errorMessage'));
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <BackLink back />

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{t('clearEverything.title')}</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('clearEverything.subtitle')}</p>
        </div>
        <img
          src="/assets/SVG/logo.svg"
          alt="Orary"
          className="w-40 h-40 sm:w-48 sm:h-48 opacity-10"
          style={{ filter: 'grayscale(100%)' }}
        />
      </div>

      <div className="prose prose-lg text-gray-700 dark:text-gray-300 dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: t('clearEverything.intro') }} />

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">{t('clearEverything.whatWillBeDeleted.title')}</h2>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li dangerouslySetInnerHTML={{ __html: t('clearEverything.whatWillBeDeleted.works') }} />
            <li dangerouslySetInnerHTML={{ __html: t('clearEverything.whatWillBeDeleted.shifts') }} />
            <li dangerouslySetInnerHTML={{ __html: t('clearEverything.whatWillBeDeleted.earnings') }} />
            <li dangerouslySetInnerHTML={{ __html: t('clearEverything.whatWillBeDeleted.preferences') }} />
            {isPremium && (
              <li dangerouslySetInnerHTML={{ __html: t('clearEverything.whatWillBeDeleted.premium') }} />
            )}
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">{t('clearEverything.whatWillBePreserved.title')}</h2>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li dangerouslySetInnerHTML={{ __html: t('clearEverything.whatWillBePreserved.account') }} />
            <li dangerouslySetInnerHTML={{ __html: t('clearEverything.whatWillBePreserved.profile') }} />
          </ul>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={() => setShowConfirmModal(true)}
            variant="solid"
            icon={Trash2}
            iconPosition="left"
            className="w-full sm:w-auto"
            bgColor="#EF4444"
            textColor="white"
          >
            {t('clearEverything.clearButton')}
          </Button>
        </div>

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
