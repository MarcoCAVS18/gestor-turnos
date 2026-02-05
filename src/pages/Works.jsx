// src/pages/Works.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorks } from '../hooks/useWorks';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShareMessages from '../components/work/ShareMessages';
import PageHeader from '../components/layout/PageHeader';
import { Briefcase, Plus, Truck, Lock, Crown } from 'lucide-react';
import WorkCard from '../components/cards/work/WorkCard';
import DeliveryWorkCard from '../components/cards/work/DeliveryWorkCard';
import WorkModal from '../components/modals/work/WorkModal';
import DeleteAlert from '../components/alerts/DeleteAlert';
import { generateWorkDetails } from '../utils/workUtils';
import { usePremium, PREMIUM_COLORS } from '../contexts/PremiumContext';

// Empty state card component (like Calendar's empty state)
const EmptyWorkCard = ({ onClick, icon: Icon, title, subtitle, themeColor }) => (
  <button
    onClick={onClick}
    className="w-full aspect-[4/3] border-2 border-dashed border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all flex flex-col items-center justify-center gap-3 group"
  >
    <div
      className="w-14 h-14 rounded-full flex items-center justify-center transition-colors"
      style={{ backgroundColor: `${themeColor}15` }}
    >
      <Icon size={28} style={{ color: themeColor }} className="group-hover:scale-110 transition-transform" />
    </div>
    <div className="text-center">
      <p className="font-medium text-gray-700 group-hover:text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
    <Plus size={16} className="text-gray-400" />
  </button>
);

// Premium locked card component
const PremiumLockedCard = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-full aspect-[4/3] border-2 border-dashed rounded-xl transition-all flex flex-col items-center justify-center gap-3 group relative overflow-hidden"
    style={{
      borderColor: `${PREMIUM_COLORS.gold}50`,
      backgroundColor: `${PREMIUM_COLORS.gold}05`
    }}
  >
    {/* Blur overlay */}
    <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40" />

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
          <p className="font-medium text-gray-700">Premium Only</p>
        </div>
        <p className="text-sm text-gray-500">Upgrade to add more works</p>
      </div>
    </div>
  </button>
);

const Works = () => {
  const navigate = useNavigate();
  const { isPremium } = usePremium();
  const {
    loading,
    allWorks,
    isModalOpen,
    selectedWork,
    thematicColors,
    sharing,
    messages,
    openNewModal,
    openEditModal,
    closeModal,
    handleShareWork,
    deleteManager
  } = useWorks();

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
    <LoadingWrapper loading={loading}>
      <div className="px-4 py-6 pb-32 space-y-6">
        {/* Share messages */}
        <ShareMessages messages={messages} />

        {/* Header */}
        <PageHeader
          title="Works"
          subtitle="Manage your different jobs or employments."
          icon={Briefcase}
          action={{ onClick: openNewModal, icon: Plus, label: 'New Work' }}
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
                Traditional Works
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
                    onEdit={openEditModal}
                    onDelete={deleteManager.startDeletion}
                    onShare={handleShareWork}
                    showActions={true}
                    isSharing={isSharing}
                  />
                );
              })}

              {/* Show Premium locked card if user has 1 traditional work and is not premium */}
              {traditionalWorks.length === 1 && !isPremium && (
                <PremiumLockedCard onClick={handlePremiumClick} />
              )}

              {/* Show empty state cards if no traditional works */}
              {traditionalWorks.length === 0 && (
                <>
                  <EmptyWorkCard
                    onClick={openNewModal}
                    icon={Briefcase}
                    title="Add your first job"
                    subtitle="Create a work to start tracking"
                    themeColor={traditionalColor}
                  />
                  {/* Second card is locked for non-premium */}
                  {!isPremium ? (
                    <PremiumLockedCard onClick={handlePremiumClick} />
                  ) : (
                    <EmptyWorkCard
                      onClick={openNewModal}
                      icon={Briefcase}
                      title="Add another job"
                      subtitle="Track multiple jobs"
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
                Delivery Works
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
                    onEdit={openEditModal}
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
                    onClick={openNewModal}
                    icon={Truck}
                    title="Add delivery platform"
                    subtitle="Track your deliveries"
                    themeColor={deliveryColor}
                  />
                  <EmptyWorkCard
                    onClick={openNewModal}
                    icon={Truck}
                    title="Add another platform"
                    subtitle="Multiple apps supported"
                    themeColor={deliveryColor}
                  />
                </>
              )}

              {/* Show one empty card if only one delivery work */}
              {deliveryWorks.length === 1 && (
                <EmptyWorkCard
                  onClick={openNewModal}
                  icon={Truck}
                  title="Add another platform"
                  subtitle="Multiple apps supported"
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
            ? "All delivery shifts associated with this job will also be deleted."
            : "All shifts associated with this job will also be deleted."
        }
      />
    </LoadingWrapper>
  );
};

export default Works;
