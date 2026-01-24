// src/pages/Works.jsx

import React from 'react';
import { useWorks } from '../hooks/useWorks';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShareMessages from '../components/work/ShareMessages';
import PageHeader from '../components/layout/PageHeader';
import { Briefcase, Plus } from 'lucide-react'; 
import WorkEmptyState from '../components/work/WorkEmptyState';
import WorkCard from '../components/cards/work/WorkCard';
import DeliveryWorkCard from '../components/cards/work/DeliveryWorkCard';
import WorkModal from '../components/modals/work/WorkModal';
import DeleteAlert from '../components/alerts/DeleteAlert';
import { generateWorkDetails } from '../utils/workUtils';

const Works = () => {
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

  const hasWorks = allWorks.length > 0;

  // Separate traditional and delivery works
  const traditionalWorks = allWorks.filter(work => work.type !== 'delivery');
  const deliveryWorks = allWorks.filter(work => work.type === 'delivery');

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

        {/* Main content */}
        {!hasWorks ? (
          <WorkEmptyState 
            onNewWork={openNewModal}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Traditional Works */}
            {traditionalWorks.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div 
                    className="w-1 h-6 rounded-full mr-3"
                    style={{ backgroundColor: thematicColors?.primary || '#EC4899' }}
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Traditional Works
                  </h2>
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {traditionalWorks.length}
                  </span>
                </div>
                
                {/* Column layout for traditional works */}
                <div className="space-y-4">
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
                </div>
              </div>
            )}

            {/* Delivery Works */}
            {deliveryWorks.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div 
                    className="w-1 h-6 rounded-full mr-3"
                    style={{ backgroundColor: '#10B981' }}
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Delivery Works
                  </h2>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    {deliveryWorks.length}
                  </span>
                </div>
                
                {/* Column layout for delivery works */}
                <div className="space-y-4">
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
                </div>
              </div>
            )}
          </div>
        )}
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