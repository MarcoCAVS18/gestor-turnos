// src/components/work/WorkHeader/index.jsx

import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import PageHeader from '../../layout/PageHeader';

const WorkHeader = ({ 
  todosLosTrabajos, 
  onNuevoTrabajo 
}) => {
  const colors = useThemeColors();
  const tieneTrabajos = todosLosTrabajos.length > 0;

  return (
    <PageHeader
      title="Mis Trabajos"
      subtitle="Gestiona tus diferentes fuentes de ingresos"
      icon={Briefcase}
      action={tieneTrabajos && {
        onClick: onNuevoTrabajo,
        icon: Plus,
        label: "Nuevo",
        mobileLabel: "Nuevo",
        themeColor: colors.primary,
      }}
    />
  );
};

export default WorkHeader;