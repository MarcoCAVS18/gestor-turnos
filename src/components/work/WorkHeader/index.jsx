// src/components/work/WorkHeader/index.jsx

import React from 'react';
import ***REMOVED*** Briefcase, Plus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';
import PageHeader from '../../layout/PageHeader';

const WorkHeader = (***REMOVED*** 
  todosLosTrabajos, 
  onNuevoTrabajo 
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const tieneTrabajos = todosLosTrabajos.length > 0;

  return (
    <PageHeader
      title="Mis Trabajos"
      subtitle="Gestiona tus diferentes fuentes de ingresos"
      icon=***REMOVED***Briefcase***REMOVED***
      action=***REMOVED***tieneTrabajos && ***REMOVED***
        onClick: onNuevoTrabajo,
        icon: Plus,
        label: "Nuevo",
        mobileLabel: "Nuevo",
        themeColor: colors.primary,
      ***REMOVED******REMOVED***
    />
  );
***REMOVED***;

export default WorkHeader;