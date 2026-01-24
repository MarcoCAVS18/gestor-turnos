// src/pages/Works.jsx

import React from 'react';
import ***REMOVED*** useWorks ***REMOVED*** from '../hooks/useWorks';
import LoadingWrapper from '../components/layout/LoadingWrapper';
import ShareMessages from '../components/work/ShareMessages';
import PageHeader from '../components/layout/PageHeader';
import ***REMOVED*** Briefcase, Plus ***REMOVED*** from 'lucide-react'; 
import WorkEmptyState from '../components/work/WorkEmptyState';
import WorkCard from '../components/cards/work/WorkCard';
import DeliveryWorkCard from '../components/cards/work/DeliveryWorkCard';
import WorkModal from '../components/modals/work/WorkModal';
import DeleteAlert from '../components/alerts/AlertaEliminacion';
import ***REMOVED*** generateWorkDetails ***REMOVED*** from '../utils/workUtils';

const Works = () => ***REMOVED***
  const ***REMOVED***
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
  ***REMOVED*** = useWorks();

  const hasWorks = allWorks.length > 0;

  // Separate traditional and delivery works
  const traditionalWorks = allWorks.filter(work => work.type !== 'delivery');
  const deliveryWorks = allWorks.filter(work => work.type === 'delivery');

  return (
    <LoadingWrapper loading=***REMOVED***loading***REMOVED***>
      <div className="px-4 py-6 pb-32 space-y-6">
        ***REMOVED***/* Share messages */***REMOVED***
        <ShareMessages messages=***REMOVED***messages***REMOVED*** />

        ***REMOVED***/* Header */***REMOVED***
        <PageHeader
          title="Works"
          subtitle="Manage your different jobs or employments."
          icon=***REMOVED***Briefcase***REMOVED***
          action=***REMOVED******REMOVED*** onClick: openNewModal, icon: Plus, label: 'New Work' ***REMOVED******REMOVED***
        />

        ***REMOVED***/* Main content */***REMOVED***
        ***REMOVED***!hasWorks ? (
          <WorkEmptyState 
            onNewWork=***REMOVED***openNewModal***REMOVED***
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            ***REMOVED***/* Traditional Works */***REMOVED***
            ***REMOVED***traditionalWorks.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div 
                    className="w-1 h-6 rounded-full mr-3"
                    style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.primary || '#EC4899' ***REMOVED******REMOVED***
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Traditional Works
                  </h2>
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    ***REMOVED***traditionalWorks.length***REMOVED***
                  </span>
                </div>
                
                ***REMOVED***/* Column layout for traditional works */***REMOVED***
                <div className="space-y-4">
                  ***REMOVED***traditionalWorks.map((work) => ***REMOVED***
                    const isSharing = sharing[work.id] || false;
                    
                    return (
                      <WorkCard
                        key=***REMOVED***work.id***REMOVED***
                        work=***REMOVED***work***REMOVED***
                        onEdit=***REMOVED***openEditModal***REMOVED***
                        onDelete=***REMOVED***deleteManager.startDeletion***REMOVED***
                        onShare=***REMOVED***handleShareWork***REMOVED***
                        showActions=***REMOVED***true***REMOVED***
                        isSharing=***REMOVED***isSharing***REMOVED***
                      />
                    );
                  ***REMOVED***)***REMOVED***
                </div>
              </div>
            )***REMOVED***

            ***REMOVED***/* Delivery Works */***REMOVED***
            ***REMOVED***deliveryWorks.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <div 
                    className="w-1 h-6 rounded-full mr-3"
                    style=***REMOVED******REMOVED*** backgroundColor: '#10B981' ***REMOVED******REMOVED***
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Delivery Works
                  </h2>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                    ***REMOVED***deliveryWorks.length***REMOVED***
                  </span>
                </div>
                
                ***REMOVED***/* Column layout for delivery works */***REMOVED***
                <div className="space-y-4">
                  ***REMOVED***deliveryWorks.map((work) => ***REMOVED***
                    const isSharing = sharing[work.id] || false;
                    
                    return (
                      <DeliveryWorkCard
                        key=***REMOVED***work.id***REMOVED***
                        work=***REMOVED***work***REMOVED***
                        onEdit=***REMOVED***openEditModal***REMOVED***
                        onDelete=***REMOVED***deleteManager.startDeletion***REMOVED***
                        onShare=***REMOVED***handleShareWork***REMOVED***
                        showActions=***REMOVED***true***REMOVED***
                        isSharing=***REMOVED***isSharing***REMOVED***
                      />
                    );
                  ***REMOVED***)***REMOVED***
                </div>
              </div>
            )***REMOVED***
          </div>
        )***REMOVED***
      </div>

      ***REMOVED***/* Modals */***REMOVED***
      <WorkModal
        isOpen=***REMOVED***isModalOpen***REMOVED***
        onClose=***REMOVED***closeModal***REMOVED***
        work=***REMOVED***selectedWork***REMOVED***
      />

      <DeleteAlert
        visible=***REMOVED***deleteManager.showDeleteModal***REMOVED***
        onCancel=***REMOVED***deleteManager.cancelDeletion***REMOVED***
        onConfirm=***REMOVED***deleteManager.confirmDeletion***REMOVED***
        deleting=***REMOVED***deleteManager.deleting***REMOVED***
        type="work"
        details=***REMOVED***generateWorkDetails(deleteManager.itemToDelete)***REMOVED***
        warning=***REMOVED***
          deleteManager.itemToDelete?.type === 'delivery'
            ? "All delivery shifts associated with this job will also be deleted."
            : "All shifts associated with this job will also be deleted."
        ***REMOVED***
      />
    </LoadingWrapper>
  );
***REMOVED***;

export default Works;