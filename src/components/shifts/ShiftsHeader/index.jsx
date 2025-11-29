// src/components/shifts/ShiftsHeader.jsx

import React from 'react';
import { Calendar, Plus } from 'lucide-react';
import PageHeader from '../../layout/PageHeader';

const ShiftsHeader = (props) => {
  const { 
    hasShifts, 
    allJobs, 
    onNewShift, 
    thematicColors, 
  } = props;

  return (
    <PageHeader
      title="Mis Turnos"
      subtitle="Registra y visualiza tus horas trabajadas"
      icon={Calendar}
      action={hasShifts && allJobs.length > 0 && {
        onClick: onNewShift,
        icon: Plus,
        label: "Nuevo",
        mobileLabel: "Nuevo",
        themeColor: thematicColors?.base,
      }}
    />
  );
};

export default ShiftsHeader;