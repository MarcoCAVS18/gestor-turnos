// src/components/work/WorkHeader/index.jsx - REFACTORIZADO

import React from 'react';
import { Briefcase, Plus } from 'lucide-react';
import { useThemeColors } from '../../../hooks/useThemeColors';

const WorkHeader = ({ 
  todosLosTrabajos, 
  onNuevoTrabajo 
}) => {
  const colors = useThemeColors();
  const tieneTrabajos = todosLosTrabajos.length > 0;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: colors.transparent10 }}
        >
          <Briefcase 
            className="w-6 h-6" 
            style={{ color: colors.primary }}
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Mis Trabajos</h1>
        </div>
      </div>

      {tieneTrabajos && (
        <button
          onClick={onNuevoTrabajo}
          className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
          style={{ backgroundColor: colors.primary }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = colors.primaryDark;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = colors.primary;
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo</span>
        </button>
      )}
    </div>
  );
};

export default WorkHeader;