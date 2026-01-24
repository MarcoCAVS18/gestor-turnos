// src/components/modals/work/WorkModal/index.jsx

import React, ***REMOVED*** useState, useEffect, useId ***REMOVED*** from 'react';
import ***REMOVED*** Pen, Plus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useApp ***REMOVED*** from '../../../../contexts/AppContext';
import ***REMOVED*** useIsMobile ***REMOVED*** from '../../../../hooks/useIsMobile';
import BaseModal from '../../base/BaseModal';
import WorkForm from '../../../forms/work/WorkForm';
import WorkTypeSelector from '../../base/WorkTypeSelector';
import DeliveryWorkModal from '../DeliveryWorkModal';

const WorkModal = (***REMOVED*** isOpen, onClose, work ***REMOVED***) => ***REMOVED***
  const ***REMOVED*** addJob, editJob, deliveryEnabled ***REMOVED*** = useApp();
  const isMobile = useIsMobile();
  const [showSelector, setShowSelector] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [loading, setLoading] = useState(false);
  const formId = useId();

  // Determine if showing selector
  useEffect(() => ***REMOVED***
    if (isOpen && !work && deliveryEnabled) ***REMOVED***
      setShowSelector(true);
      setSelectedType(null);
    ***REMOVED*** else ***REMOVED***
      setShowSelector(false);
      if (isOpen && !work && !deliveryEnabled) ***REMOVED***
        setSelectedType('traditional');
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***, [isOpen, work, deliveryEnabled]);

  const handleSelectType = (type) => ***REMOVED***
    setSelectedType(type);
    setShowSelector(false);
  ***REMOVED***;

  const handleSave = async (workData) => ***REMOVED***
    try ***REMOVED***
      setLoading(true);

      if (work) ***REMOVED***
        await editJob(work.id, workData);
      ***REMOVED*** else ***REMOVED***
        await addJob(workData);
      ***REMOVED***

      setSelectedType(null);
      setShowSelector(false);
      setLoading(false);
      onClose();
    ***REMOVED*** catch (error) ***REMOVED***
      setLoading(false);
    ***REMOVED***
  ***REMOVED***;

  const handleClose = () => ***REMOVED***
    setSelectedType(null);
    setShowSelector(false);
    setLoading(false);
    onClose();
  ***REMOVED***;

  if (!isOpen) return null;

  // If it is an existing delivery work, use the delivery modal directly
  if (work && work.type === 'delivery') ***REMOVED***
    return (
      <DeliveryWorkModal
        isOpen=***REMOVED***true***REMOVED***
        onClose=***REMOVED***handleClose***REMOVED***
        work=***REMOVED***work***REMOVED***
      />
    );
  ***REMOVED***

  // If delivery was selected as type
  if (selectedType === 'delivery') ***REMOVED***
    return (
      <DeliveryWorkModal
        isOpen=***REMOVED***true***REMOVED***
        onClose=***REMOVED***handleClose***REMOVED***
        work=***REMOVED***null***REMOVED***
      />
    );
  ***REMOVED***

  return (
    <BaseModal
      isOpen=***REMOVED***isOpen***REMOVED***
      onClose=***REMOVED***handleClose***REMOVED***
      title=***REMOVED***work ? 'Edit Work' : 'New Work'***REMOVED***
      icon=***REMOVED***work ? Pen : Plus***REMOVED***
      loading=***REMOVED***loading***REMOVED***
      maxWidth="lg"
      showActions=***REMOVED***!showSelector***REMOVED***
      onCancel=***REMOVED***handleClose***REMOVED***
      formId=***REMOVED***formId***REMOVED***
      saveText=***REMOVED***work ? 'Save Changes' : 'Create Work'***REMOVED***
    >
      ***REMOVED***showSelector ? (
        <WorkTypeSelector
          onSelectType=***REMOVED***handleSelectType***REMOVED***
          isMobile=***REMOVED***isMobile***REMOVED***
        />
      ) : (
        <WorkForm
          id=***REMOVED***formId***REMOVED***
          work=***REMOVED***work***REMOVED***
          onSubmit=***REMOVED***handleSave***REMOVED***
          isMobile=***REMOVED***isMobile***REMOVED***
        />
      )***REMOVED***
    </BaseModal>
  );
***REMOVED***;

export default WorkModal;
