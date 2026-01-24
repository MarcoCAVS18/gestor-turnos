// src/components/modals/work/WorkModal/index.jsx

import React, { useState, useEffect, useId } from 'react';
import { Pen, Plus } from 'lucide-react';
import { useApp } from '../../../../contexts/AppContext';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import BaseModal from '../../base/BaseModal';
import WorkForm from '../../../forms/work/WorkForm';
import WorkTypeSelector from '../../base/WorkTypeSelector';
import DeliveryWorkModal from '../DeliveryWorkModal';

const WorkModal = ({ isOpen, onClose, work }) => {
  const { addJob, editJob, deliveryEnabled } = useApp();
  const isMobile = useIsMobile();
  const [showSelector, setShowSelector] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const formId = useId();

  // Determine if showing selector
  useEffect(() => {
    if (isOpen && !work && deliveryEnabled) {
      setShowSelector(true);
      setSelectedType(null);
    } else {
      setShowSelector(false);
      if (isOpen && !work && !deliveryEnabled) {
        setSelectedType('traditional');
      }
    }
  }, [isOpen, work, deliveryEnabled]);

  const handleSelectType = (type) => {
    setSelectedType(type);
    setShowSelector(false);
  };

  const handleSave = async (workData) => {
    try {
      setLoading(true);

      if (work) {
        await editJob(work.id, workData);
      } else {
        await addJob(workData);
      }

      setSelectedType(null);
      setShowSelector(false);
      setLoading(false);
      onClose();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedType(null);
    setShowSelector(false);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  // If it is an existing delivery work, use the delivery modal directly
  if (work && work.type === 'delivery') {
    return (
      <DeliveryWorkModal
        isOpen={true}
        onClose={handleClose}
        work={work}
      />
    );
  }

  // If delivery was selected as type
  if (selectedType === 'delivery') {
    return (
      <DeliveryWorkModal
        isOpen={true}
        onClose={handleClose}
        work={null}
      />
    );
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={work ? 'Edit Work' : 'New Work'}
      icon={work ? Pen : Plus}
      loading={loading}
      maxWidth="lg"
      showActions={!showSelector}
      onCancel={handleClose}
      formId={formId}
      saveText={work ? 'Save Changes' : 'Create Work'}
    >
      {showSelector ? (
        <WorkTypeSelector
          onSelectType={handleSelectType}
          isMobile={isMobile}
        />
      ) : (
        <WorkForm
          id={formId}
          work={work}
          onSubmit={handleSave}
          isMobile={isMobile}
        />
      )}
    </BaseModal>
  );
};

export default WorkModal;
