// src/pages/Works.jsx

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWorks } from '../hooks/useWorks';
import { useLiveModeContext } from '../contexts/LiveModeContext';
import ShareMessages from '../components/work/ShareMessages';
import PageHeader from '../components/layout/PageHeader';
import { Briefcase, Plus, Truck, Lock, Crown, Radio } from 'lucide-react';
import WorkCard from '../components/cards/work/WorkCard';
import DeliveryWorkCard from '../components/cards/work/DeliveryWorkCard';
import WorkModal from '../components/modals/work/WorkModal';
import DeleteAlert from '../components/alerts/DeleteAlert';
import { generateWorkDetails } from '../utils/workUtils';
import { usePremium, PREMIUM_COLORS } from '../contexts/PremiumContext';

// Empty state card component - matches BaseWorkCard height
const EmptyWorkCard = ({ onClick, icon: Icon, title, subtitle, themeColor }) => (
  <button
    onClick={onClick}
    className="w-full min-h-[280px] h-full border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl hover:border-gray-400 dark:hover:border-slate-500 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all flex flex-col items-center justify-center gap-3 group"
  >
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
      style={{ backgroundColor: `${themeColor}15` }}
    >
      <Icon size={28} style={{ color: themeColor }} className="group-hover:scale-110 transition-transform" />
    </div>
    <div className="text-center">
      <p className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">{title}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
    </div>
    <Plus size={16} className="text-gray-400 dark:text-gray-500" />
  </button>
);

// Premium locked card component - matches BaseWorkCard height
const PremiumLockedCard = ({ onClick, label, sublabel }) => (
  <button
    onClick={onClick}
    className="w-full min-h-[280px] h-full border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
    style={{
      borderColor: `${PREMIUM_COLORS.gold}50`,
      backgroundColor: `${PREMIUM_COLORS.gold}05`
    }}
  >
    {/* Blur overlay */}
    <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 dark:bg-slate-900/40" />

    {/* Content */}
    <div className="relative z-10 flex flex-col items-center gap-3">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${PREMIUM_COLORS.gold}20` }}
      >
        <Lock size={24} style={{ color: PREMIUM_COLORS.gold }} />
      </div>
      <div className="text-center">
        <div className="flex items-center gap-1.5 justify-center mb-1">
          <Crown size={14} style={{ color: PREMIUM_COLORS.gold }} />
          <p className="font-medium text-gray-700 dark:text-gray-200">{label}</p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{sublabel}</p>
      </div>
    </div>
  </button>
);

const Works = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const { isActive: isLiveModeActive, selectedWork: liveWork } = useLiveModeContext();
  const {
    allWorks,
    isModalOpen,
    selectedWork,
    defaultWorkType,
    thematicColors,
    sharing,
    messages,
    openNewModal,
    openEditModal,
    closeModal,
    handleShareWork,
    deleteManager
  } = useWorks();

  const [liveModeError, setLiveModeError] = useState('');

  // Auto-clear live mode error after 4 seconds
  useEffect(() => {
    if (!liveModeError) return;
    const timer = setTimeout(() => setLiveModeError(''), 4000);
    return () => clearTimeout(timer);
  }, [liveModeError]);

  // Guarded edit: block if the work is in use by Live Mode
  const handleEditWork = (work) => {
    if (isLiveModeActive && liveWork?.id === work.id) {
      setLiveModeError(t('works.liveModeActiveError', { workName: work.name }));
      return;
    }
    openEditModal(work);
  };

  // Separate traditional and delivery works
  const traditionalWorks = allWorks.filter(work => work.type !== 'delivery');
  const deliveryWorks = allWorks.filter(work => work.type === 'delivery');

  // Colors for each section
  const traditionalColor = thematicColors?.primary || '#EC4899';
  const deliveryColor = '#10B981';

  // Navigate to premium page
  const handlePremiumClick = () => {
    navigate('/premium');
  };

  return (
    <>
      <Helmet>
        <title>My Jobs - Orary</title>
        <meta name="description" content="Manage your jobs and workplaces. Add, edit, and organize your work positions." />
      </Helmet>
      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Share messages */}
        <ShareMessages messages={messages} />

        {/* Live Mode edit-blocked banner */}
        {liveModeError && (
          <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-orange-800 dark:text-orange-300">
            <Radio size={16} className="flex-shrink-0 mt-0.5 animate-pulse" />
            <p className="text-sm font-medium">{liveModeError}</p>
          </div>
        )}

        {/* Header */}
        <PageHeader
          title={t('works.title')}
          subtitle={t('works.subtitle')}
          icon={Briefcase}
          action={{ onClick: () => openNewModal(), icon: Plus, label: t('works.addWork') }}
        />

        {/* Main content - Always show grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traditional Works Section */}
          <div>
            <div className="flex items-center mb-4">
              <div
                className="w-1 h-6 rounded-full mr-3"
                style={{ backgroundColor: traditionalColor }}
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {t('works.traditionalSection')}
              </h2>
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {traditionalWorks.length}
              </span>
            </div>

            {/* Grid of cards - max 2 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {traditionalWorks.map((work) => {
                const isSharing = sharing[work.id] || false;

                return (
                  <WorkCard
                    key={work.id}
                    work={work}
                    onEdit={handleEditWork}
                    onDelete={deleteManager.startDeletion}
                    onShare={handleShareWork}
                    showActions={true}
                    isSharing={isSharing}
                  />
                );
              })}

              {/* Show Premium locked card if user has 1 traditional work and is not premium */}
              {traditionalWorks.length === 1 && !isPremium && (
                <PremiumLockedCard
                  onClick={handlePremiumClick}
                  label={t('works.premiumOnly')}
                  sublabel={t('works.premiumUpgrade')}
                />
              )}

              {/* Show empty state cards if no traditional works */}
              {traditionalWorks.length === 0 && (
                <>
                  <EmptyWorkCard
                    onClick={() => openNewModal('traditional')}
                    icon={Briefcase}
                    title={t('works.addFirstJob')}
                    subtitle={t('works.createToTrack')}
                    themeColor={traditionalColor}
                  />
                  {/* Second card is locked for non-premium */}
                  {!isPremium ? (
                    <PremiumLockedCard
                      onClick={handlePremiumClick}
                      label={t('works.premiumOnly')}
                      sublabel={t('works.premiumUpgrade')}
                    />
                  ) : (
                    <EmptyWorkCard
                      onClick={() => openNewModal('traditional')}
                      icon={Briefcase}
                      title={t('works.addAnotherJob')}
                      subtitle={t('works.trackMultiple')}
                      themeColor={traditionalColor}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Delivery Works Section */}
          <div>
            <div className="flex items-center mb-4">
              <div
                className="w-1 h-6 rounded-full mr-3"
                style={{ backgroundColor: deliveryColor }}
              />
              <h2 className="text-lg font-semibold text-gray-800">
                {t('works.deliverySection')}
              </h2>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                {deliveryWorks.length}
              </span>
            </div>

            {/* Grid of cards - max 2 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliveryWorks.map((work) => {
                const isSharing = sharing[work.id] || false;

                return (
                  <DeliveryWorkCard
                    key={work.id}
                    work={work}
                    onEdit={handleEditWork}
                    onDelete={deleteManager.startDeletion}
                    onShare={handleShareWork}
                    showActions={true}
                    isSharing={isSharing}
                  />
                );
              })}

              {/* Show empty state cards if no delivery works */}
              {deliveryWorks.length === 0 && (
                <>
                  <EmptyWorkCard
                    onClick={() => openNewModal('delivery')}
                    icon={Truck}
                    title={t('works.addDeliveryPlatform')}
                    subtitle={t('works.trackDeliveries')}
                    themeColor={deliveryColor}
                  />
                  <EmptyWorkCard
                    onClick={() => openNewModal('delivery')}
                    icon={Truck}
                    title={t('works.addAnotherPlatform')}
                    subtitle={t('works.multipleApps')}
                    themeColor={deliveryColor}
                  />
                </>
              )}

              {/* Show one empty card if only one delivery work */}
              {deliveryWorks.length === 1 && (
                <EmptyWorkCard
                  onClick={() => openNewModal('delivery')}
                  icon={Truck}
                  title={t('works.addAnotherPlatform')}
                  subtitle={t('works.multipleApps')}
                  themeColor={deliveryColor}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <WorkModal
        isOpen={isModalOpen}
        onClose={closeModal}
        work={selectedWork}
        defaultWorkType={defaultWorkType}
      />

      <DeleteAlert
        visible={deleteManager.showDeleteModal}
        onCancel={deleteManager.cancelDeletion}
        onConfirm={deleteManager.confirmDeletion}
        deleting={deleteManager.deleting}
        type="work"
        details={generateWorkDetails(deleteManager.itemToDelete)}
        warning={
          deleteManager.itemToDelete?.type === 'delivery'
            ? t('works.deleteWarningDelivery')
            : t('works.deleteWarning')
        }
      />
    </>
  );
};

export default Works;
