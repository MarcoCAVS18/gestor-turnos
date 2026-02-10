// src/components/modals/shift/ShiftModal/index.jsx

import React, { useState, useEffect, useMemo, useId } from 'react';
import { Pen, Plus } from 'lucide-react';
import { useApp } from '../../../../contexts/AppContext';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { createSafeDate } from '../../../../utils/time';
import BaseModal from '../../base/BaseModal';
import ShiftForm from '../../../forms/shift/ShiftForm';
import DeliveryShiftForm from '../../../forms/shift/DeliveryShiftForm';
import BulkShiftConfirmModal from '../BulkShiftConfirmModal';

const ShiftModal = ({ isOpen, onClose, shift, workId, initialDate }) => {
  const {
    addShift,
    editShift,
    addDeliveryShift,
    editDeliveryShift,
    addBulkShifts,
    works,
    deliveryWork,
    shifts
  } = useApp();

  const [selectedWorkId, setSelectedWorkId] = useState(workId || '');
  const [formType, setFormType] = useState('traditional');
  const [loading, setLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [isBulkEnabled, setIsBulkEnabled] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [pendingShiftData, setPendingShiftData] = useState(null);
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
      setIsBulkEnabled(false);
      setPendingShiftData(null);
    } else if (shift) {
      setSelectedWorkId(shift.workId || '');
    } else if (workId) {
      setSelectedWorkId(workId);
    }
  }, [isOpen, shift, workId]);

  const handleSave = async (shiftData) => {
    try {
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

      // If bulk is enabled and this is a new shift, show confirmation modal
      if (isBulkEnabled && !shift && formType === 'traditional') {
        setPendingShiftData(finalData);
        setShowBulkConfirm(true);
        return;
      }

      // Normal single shift creation/edit
      setLoading(true);

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

  const handleBulkConfirm = async (shifts) => {
    try {
      await addBulkShifts(shifts);
      setShowBulkConfirm(false);
      setPendingShiftData(null);
      onClose();
    } catch (error) {
      console.error('Error creating bulk shifts:', error);
      throw error;
    }
  };

  const handleBulkToggle = (enabled) => {
    setIsBulkEnabled(enabled);
  };

  const handleWorkChange = (newWorkId) => {
    setSelectedWorkId(newWorkId);
  };

  const handleClose = () => {
    if (!showBulkConfirm) {
      setSelectedWorkId('');
      setFormType('traditional');
      setLoading(false);
      setIsFormDirty(false);
      setIsBulkEnabled(false);
      setPendingShiftData(null);
      onClose();
    }
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

  // Determine save button text
  const getSaveText = () => {
    if (shift) return 'Save Changes';
    if (isBulkEnabled && formType === 'traditional') return 'Continue';
    return 'Create Shift';
  };

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
      saveText={getSaveText()}
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
          onBulkToggle={handleBulkToggle}
          isBulkEnabled={isBulkEnabled}
          isMobile={isMobile}
          initialDate={initialDate}
        />
      )}

      {/* Bulk Shift Confirmation Modal */}
      <BulkShiftConfirmModal
        isOpen={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        baseShift={pendingShiftData}
        workName={allWorks.find(w => w.id === pendingShiftData?.workId)?.name || ''}
        existingShifts={shifts}
        onConfirm={handleBulkConfirm}
      />
    </BaseModal>
  );
};

export default ShiftModal;
