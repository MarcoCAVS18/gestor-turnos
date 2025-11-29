// src/components/work/WorkEmptyState/index.jsx - REFACTORIZADO

import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';
import Flex from '../../ui/Flex';

const WorkEmptyState = ({ onNuevoTrabajo }) => {
  const colors = useThemeColors();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <Flex variant="center"
        className="p-4 rounded-full w-20 h-20 mx-auto mb-4"
        style={{ backgroundColor: colors.transparent10 }}
      >
        <Briefcase 
          className="w-10 h-10" 
          style={{ color: colors.primary }}
        />
      </Flex>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay trabajos aún</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Crea tu primer trabajo para empezar a registrar turnos y gestionar tus ingresos.
      </p>
      <button
        onClick={onNuevoTrabajo}
        className="text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2 hover:shadow-md"
        style={{ backgroundColor: colors.primary }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = colors.primaryDark;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = colors.primary;
        }}
      >
        <Plus className="w-4 h-4" />
        <span>Crear Nuevo Trabajo</span>
      </button>
    </div>
  );
};

export default WorkEmptyState;