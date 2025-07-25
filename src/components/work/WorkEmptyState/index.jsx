// src/components/work/WorkEmptyState/index.jsx
import React from 'react';
import { Briefcase, Plus } from 'lucide-react';

const WorkEmptyState = ({ thematicColors, onNuevoTrabajo }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div 
        className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
        style={{ backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
      >
        <Briefcase 
          className="w-10 h-10" 
          style={{ color: thematicColors?.base || '#EC4899' }}
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay trabajos aún</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Crea tu primer trabajo para empezar a registrar turnos y gestionar tus ingresos.
      </p>
      <button
        onClick={onNuevoTrabajo}
        className="text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2 hover:shadow-md"
        style={{ backgroundColor: thematicColors?.base || '#EC4899' }}
        onMouseEnter={(e) => {
          if (thematicColors?.dark) {
            e.target.style.backgroundColor = thematicColors.dark;
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = thematicColors?.base || '#EC4899';
        }}
      >
        <Plus className="w-4 h-4" />
        <span>Crear Nuevo Trabajo</span>
      </button>
    </div>
  );
};

export default WorkEmptyState;