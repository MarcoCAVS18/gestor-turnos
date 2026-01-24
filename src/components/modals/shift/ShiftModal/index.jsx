// src/components/modals/shift/ShiftModal/index.jsx

import React, { useState, useEffect, useMemo, useId } from 'react';
import { Pen, Plus } from 'lucide-react';
import { useApp } from '../../../../contexts/AppContext';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { createSafeDate } from '../../../../utils/time';
import BaseModal from '../../base/BaseModal';
import ShiftForm from '../../../forms/shift/ShiftForm';
import DeliveryShiftForm from '../../../forms/shift/DeliveryShiftForm';

const ShiftModal = ({ isOpen, onClose, shift, workId, initialDate }) => {
  const {
    addShift,
    editShift,
    addDeliveryShift,
    editDeliveryShift,
    works,
    deliveryWork
  } = useApp();

  const [selectedWorkId, setSelectedWorkId] = useState(workId || '');
  const [formType, setFormType] = useState('traditional');
  const [loading, setLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const isMobile = useIsMobile();
  const formId = useId();

  const allWorks = useMemo(() => {
    return [...works, ...deliveryWork];
  }, [works, deliveryWork]);

  useEffect(() => {
    if (shift?.type === 'delivery') {
      setFormType('delivery');
      return;
    }

    if (selectedWorkId) {
      const work = allWorks.find(w => w.id === selectedWorkId);

      if (work) {
        const isDelivery = work.type === 'delivery';
        const newType = isDelivery ? 'delivery' : 'traditional';

        if (formType !== newType) {
          setFormType(newType);
        }
      } else {
        setFormType('traditional');
      }
    } else {
      setFormType('traditional');
    }
  }, [selectedWorkId, allWorks, shift, formType]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedWorkId('');
      setFormType('traditional');
      setLoading(false);
      setIsFormDirty(false);
    } else if (shift) {
      setSelectedWorkId(shift.workId || '');
    } else if (workId) {
      setSelectedWorkId(workId);
    }
  }, [isOpen, shift, workId]);

  const handleSave = async (shiftData) => {
    try {
      setLoading(true);

      let finalData = { ...shiftData };

      if (initialDate && !shift) {
        let dateStr;
        if (initialDate instanceof Date) {
          const year = initialDate.getFullYear();
          const month = String(initialDate.getMonth() + 1).padStart(2, '0');
          const day = String(initialDate.getDate()).padStart(2, '0');
          dateStr = `${year}-${month}-${day}`;
        } else {
          dateStr = initialDate;
        }

        if (!finalData.startDate && !finalData.date) {
          finalData.startDate = dateStr;
        }
      }

      if (formType === 'delivery') {
        if (shift) {
          await editDeliveryShift(shift.id, finalData);
        } else {
          await addDeliveryShift(finalData);
        } 
      } else {
        if (shift) {
          await editShift(shift.id, finalData);
        } else {
          await addShift(finalData);
        }
      }

      setLoading(false);
      onClose();
    } catch (error) {
      console.error('Error saving shift:', error);
      setLoading(false);
    }
  };

  const handleWorkChange = (newWorkId) => {
    setSelectedWorkId(newWorkId);
  };

  const handleClose = () => {
    setSelectedWorkId('');
    setFormType('traditional');
    setLoading(false);
    setIsFormDirty(false);
    onClose();
  };

  if (!isOpen) return null;

  const title = shift ? 'Edit Shift' : 'New Shift';
  const subtitle = formType === 'delivery' ? '• Delivery' : null;

  let dateSubtitle = null;
  if (initialDate && !shift) {
    dateSubtitle = initialDate instanceof Date
      ? initialDate.toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        })
      : createSafeDate(initialDate).toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
  }

  const finalSubtitle = [subtitle, dateSubtitle].filter(Boolean).join(' ');

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      icon={shift ? Pen : Plus}
      subtitle={finalSubtitle || undefined}
      loading={loading}
      maxWidth="md"
      showActions={true}
      onCancel={handleClose}
      formId={formId}
      saveText={shift ? 'Save Changes' : 'Create Shift'}
      isSaveDisabled={shift ? !isFormDirty : false}
    >
      {formType === 'delivery' ? (
        <DeliveryShiftForm
          id={formId}
          shift={shift}
          workId={selectedWorkId}
          works={allWorks}
          onSubmit={handleSave}
          onWorkChange={handleWorkChange}
          onDirtyChange={setIsFormDirty}
          isMobile={isMobile}
          initialDate={initialDate}
        />
      ) : (
        <ShiftForm
          id={formId}
          shift={shift}
          workId={selectedWorkId}
          works={allWorks}
          onSubmit={handleSave}
          onWorkChange={handleWorkChange}
          onDirtyChange={setIsFormDirty}
          isMobile={isMobile}
          initialDate={initialDate}
        />
      )}
    </BaseModal>
  );
};

export default ShiftModal;
