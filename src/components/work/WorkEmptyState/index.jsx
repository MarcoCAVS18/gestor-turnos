// src/components/work/WorkEmptyState/index.jsx
import React from 'react';
import ***REMOVED*** Briefcase, Plus ***REMOVED*** from 'lucide-react';

const WorkEmptyState = (***REMOVED*** thematicColors, onNuevoTrabajo ***REMOVED***) => ***REMOVED***
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div 
        className="p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center"
        style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
      >
        <Briefcase 
          className="w-10 h-10" 
          style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay trabajos aún</h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        Crea tu primer trabajo para empezar a registrar turnos y gestionar tus ingresos.
      </p>
      <button
        onClick=***REMOVED***onNuevoTrabajo***REMOVED***
        className="text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center space-x-2 hover:shadow-md"
        style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
        onMouseEnter=***REMOVED***(e) => ***REMOVED***
          if (thematicColors?.dark) ***REMOVED***
            e.target.style.backgroundColor = thematicColors.dark;
          ***REMOVED***
        ***REMOVED******REMOVED***
        onMouseLeave=***REMOVED***(e) => ***REMOVED***
          e.target.style.backgroundColor = thematicColors?.base || '#EC4899';
        ***REMOVED******REMOVED***
      >
        <Plus className="w-4 h-4" />
        <span>Crear Nuevo Trabajo</span>
      </button>
    </div>
  );
***REMOVED***;

export default WorkEmptyState;