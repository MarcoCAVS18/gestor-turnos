import React from 'react';
import { Briefcase, Plus } from 'lucide-react';

const WorkHeader = ({ 
  todosLosTrabajos, 
  thematicColors, 
  onNuevoTrabajo 
}) => {
  const tieneTrabajos = todosLosTrabajos.length > 0;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div 
          className="p-2 rounded-lg"
          style={{ backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' }}
        >
          <Briefcase 
            className="w-6 h-6" 
            style={{ color: thematicColors?.base || '#EC4899' }}
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
          <span>Nuevo</span>
        </button>
      )}
    </div>
  );
};

export default WorkHeader;