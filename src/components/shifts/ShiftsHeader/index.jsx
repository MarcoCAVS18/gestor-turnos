// src/components/shifts/ShiftsHeader.jsx

import React from 'react';
import ***REMOVED*** Calendar, Plus ***REMOVED*** from 'lucide-react';
import PageHeader from '../../layout/PageHeader';

const ShiftsHeader = (props) => ***REMOVED***
  const ***REMOVED*** 
    hasShifts, 
    allJobs, 
    onNewShift, 
    thematicColors, 
  ***REMOVED*** = props;

  return (
    <PageHeader
      title="Mis Turnos"
      subtitle="Registra y visualiza tus horas trabajadas"
      icon=***REMOVED***Calendar***REMOVED***
      action=***REMOVED***hasShifts && allJobs.length > 0 && ***REMOVED***
        onClick: onNewShift,
        icon: Plus,
        label: "Nuevo",
        mobileLabel: "Nuevo",
        themeColor: thematicColors?.base,
      ***REMOVED******REMOVED***
    />
  );
***REMOVED***;

export default ShiftsHeader;