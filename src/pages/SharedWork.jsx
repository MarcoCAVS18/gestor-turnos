// src/pages/SharedWork.jsx

import { Share2, Plus, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSharedWork } from '../hooks/useSharedWork';
import { useAuth } from '../contexts/AuthContext';
import WorkPreviewCard from '../components/shared/WorkPreviewCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Loader from '../components/other/Loader';
import PageHeader from '../components/layout/PageHeader';

const SharedWork = () => {
  const { t } = useTranslation();
  const { sharedWork, loading, error, adding, addWork } = useSharedWork();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // If no authenticated user, redirect to login
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="text-center py-8">
          <AlertCircle size={48} className="mx-auto mb-4 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('sharedWork.signInTitle')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('sharedWork.signInDesc')}
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/login', { 
                state: { redirectTo: window.location.pathname } 
              })}
              className="w-full"
            >
              {t('auth.login.continue')}
            </Button>
            <Button
              onClick={() => navigate('/register', { 
                state: { redirectTo: window.location.pathname } 
              })}
              variant="outline"
              className="w-full"
            >
              {t('auth.register.register')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Card className="text-center py-8">
          <Share2 size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{t('sharedWork.errorTitle')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Button
            onClick={() => navigate('/works')}
            variant="outline"
            icon={ArrowLeft}
          >
            {t('sharedWork.goToWorks')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title={t('sharedWork.title')}
        subtitle={t('sharedWork.subtitle')}
        icon={Share2}
      />
      {/* Work preview */}
      {sharedWork && <WorkPreviewCard work={sharedWork} />}

      {/* Action buttons */}
      <div className="space-y-3">
        <Button
          onClick={addWork}
          disabled={adding}
          loading={adding}
          loadingText={t('sharedWork.adding')}
          className="w-full"
          icon={Plus}
        >
          {t('sharedWork.addToMyWorks')}
        </Button>
        
        <Button
          onClick={() => navigate('/works')}
          variant="outline"
          className="w-full"
          icon={ArrowLeft}
        >
          {t('sharedWork.goToWorks')}
        </Button>
      </div>

      {/* Help message */}
      <Card className="text-center py-4" padding="sm">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('sharedWork.helpMessage')}
        </p>
      </Card>
    </div>
  );
};

export default SharedWork;
