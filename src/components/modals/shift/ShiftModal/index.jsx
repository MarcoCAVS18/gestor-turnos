// src/components/modals/shift/ShiftModal/index.jsx

import React, ***REMOVED*** useState, useEffect, useMemo, useId ***REMOVED*** from 'react';
import ***REMOVED*** Pen, Plus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../../hooks/useIsMobile';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../../../../utils/time';
import BaseModal from '../../base/BaseModal';
import ShiftForm from '../../../forms/shift/ShiftForm';
import DeliveryShiftForm from '../../../forms/shift/DeliveryShiftForm';

const ShiftModal = (***REMOVED*** isOpen, onClose, shift, workId, initialDate ***REMOVED***) => ***REMOVED***
  const ***REMOVED***
    addShift,
    editShift,
    addDeliveryShift,
    editDeliveryShift,
    works,
    deliveryWorks
  ***REMOVED*** = useApp();

  const [selectedWorkId, setSelectedWorkId] = useState(workId || '');
  const [formType, setFormType] = useState('traditional');
  const [loading, setLoading] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const isMobile = useIsMobile();
  const formId = useId();

  const allWorks = useMemo(() => ***REMOVED***
    return [...works, ...deliveryWorks];
  ***REMOVED***, [works, deliveryWorks]);

  useEffect(() => ***REMOVED***
    if (shift?.type === 'delivery') ***REMOVED***
      setFormType('delivery');
      return;
    ***REMOVED***

    if (selectedWorkId) ***REMOVED***
      const work = allWorks.find(w => w.id === selectedWorkId);

      if (work) ***REMOVED***
        const isDelivery = work.type === 'delivery';
        const newType = isDelivery ? 'delivery' : 'traditional';

        if (formType !== newType) ***REMOVED***
          setFormType(newType);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        setFormType('traditional');
      ***REMOVED***
    ***REMOVED*** else ***REMOVED***
      setFormType('traditional');
    ***REMOVED***
  ***REMOVED***, [selectedWorkId, allWorks, shift, formType]);

  useEffect(() => ***REMOVED***
    if (!isOpen) ***REMOVED***
      setSelectedWorkId('');
      setFormType('traditional');
      setLoading(false);
      setIsFormDirty(false);
    ***REMOVED*** else if (shift) ***REMOVED***
      setSelectedWorkId(shift.workId || '');
    ***REMOVED*** else if (workId) ***REMOVED***
      setSelectedWorkId(workId);
    ***REMOVED***
  ***REMOVED***, [isOpen, shift, workId]);

  const handleSave = async (shiftData) => ***REMOVED***
    try ***REMOVED***
      setLoading(true);

      let finalData = ***REMOVED*** ...shiftData ***REMOVED***;

      if (initialDate && !shift) ***REMOVED***
        let dateStr;
        if (initialDate instanceof Date) ***REMOVED***
          const year = initialDate.getFullYear();
          const month = String(initialDate.getMonth() + 1).padStart(2, '0');
          const day = String(initialDate.getDate()).padStart(2, '0');
          dateStr = `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
        ***REMOVED*** else ***REMOVED***
          dateStr = initialDate;
        ***REMOVED***

        if (!finalData.startDate && !finalData.date) ***REMOVED***
          finalData.startDate = dateStr;
        ***REMOVED***
      ***REMOVED***

      if (formType === 'delivery') ***REMOVED***
        if (shift) ***REMOVED***
          await editDeliveryShift(shift.id, finalData);
        ***REMOVED*** else ***REMOVED***
          await addDeliveryShift(finalData);
        ***REMOVED*** 
      ***REMOVED*** else ***REMOVED***
        if (shift) ***REMOVED***
          await editShift(shift.id, finalData);
        ***REMOVED*** else ***REMOVED***
          await addShift(finalData);
        ***REMOVED***
      ***REMOVED***

      setLoading(false);
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error saving shift:', error);
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const handleWorkChange = (newWorkId) => ***REMOVED***
    setSelectedWorkId(newWorkId);
  ***REMOVED***;

  const handleClose = () => ***REMOVED***
    setSelectedWorkId('');
    setFormType('traditional');
    setLoading(false);
    setIsFormDirty(false);
    onClose();
  ***REMOVED***;

  if (!isOpen) return null;

  const title = shift ? 'Edit Shift' : 'New Shift';
  const subtitle = formType === 'delivery' ? '• Delivery' : null;

  let dateSubtitle = null;
  if (initialDate && !shift) ***REMOVED***
    dateSubtitle = initialDate instanceof Date
      ? initialDate.toLocaleDateString('en-US', ***REMOVED***
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        ***REMOVED***)
      : createSafeDate(initialDate).toLocaleDateString('en-US', ***REMOVED***
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        ***REMOVED***);
  ***REMOVED***

  const finalSubtitle = [subtitle, dateSubtitle].filter(Boolean).join(' ');

  return (
    <BaseModal
      isOpen=***REMOVED***isOpen***REMOVED***
      onClose=***REMOVED***handleClose***REMOVED***
      title=***REMOVED***title***REMOVED***
      icon=***REMOVED***shift ? Pen : Plus***REMOVED***
      subtitle=***REMOVED***finalSubtitle || undefined***REMOVED***
      loading=***REMOVED***loading***REMOVED***
      maxWidth="md"
      showActions=***REMOVED***true***REMOVED***
      onCancel=***REMOVED***handleClose***REMOVED***
      formId=***REMOVED***formId***REMOVED***
      saveText=***REMOVED***shift ? 'Save Changes' : 'Create Shift'***REMOVED***
      isSaveDisabled=***REMOVED***shift ? !isFormDirty : false***REMOVED***
    >
      ***REMOVED***formType === 'delivery' ? (
        <DeliveryShiftForm
          id=***REMOVED***formId***REMOVED***
          shift=***REMOVED***shift***REMOVED***
          workId=***REMOVED***selectedWorkId***REMOVED***
          works=***REMOVED***allWorks***REMOVED***
          onSubmit=***REMOVED***handleSave***REMOVED***
          onWorkChange=***REMOVED***handleWorkChange***REMOVED***
          onDirtyChange=***REMOVED***setIsFormDirty***REMOVED***
          isMobile=***REMOVED***isMobile***REMOVED***
          initialDate=***REMOVED***initialDate***REMOVED***
        />
      ) : (
        <ShiftForm
          id=***REMOVED***formId***REMOVED***
          shift=***REMOVED***shift***REMOVED***
          workId=***REMOVED***selectedWorkId***REMOVED***
          works=***REMOVED***allWorks***REMOVED***
          onSubmit=***REMOVED***handleSave***REMOVED***
          onWorkChange=***REMOVED***handleWorkChange***REMOVED***
          onDirtyChange=***REMOVED***setIsFormDirty***REMOVED***
          isMobile=***REMOVED***isMobile***REMOVED***
          initialDate=***REMOVED***initialDate***REMOVED***
        />
      )***REMOVED***
    </BaseModal>
  );
***REMOVED***;

export default ShiftModal;
