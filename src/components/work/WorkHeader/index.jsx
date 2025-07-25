import React from 'react';
import ***REMOVED*** Briefcase, Plus ***REMOVED*** from 'lucide-react';

const WorkHeader = (***REMOVED*** 
  todosLosTrabajos, 
  thematicColors, 
  onNuevoTrabajo 
***REMOVED***) => ***REMOVED***
  const tieneTrabajos = todosLosTrabajos.length > 0;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div 
          className="p-2 rounded-lg"
          style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)' ***REMOVED******REMOVED***
        >
          <Briefcase 
            className="w-6 h-6" 
            style=***REMOVED******REMOVED*** color: thematicColors?.base || '#EC4899' ***REMOVED******REMOVED***
          />
        </div>
        <div>
          <h1 className="text-xl font-semibold">Mis Trabajos</h1>
        </div>
      </div>

      ***REMOVED***tieneTrabajos && (
        <button
          onClick=***REMOVED***onNuevoTrabajo***REMOVED***
          className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm hover:shadow-md"
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
          <span>Nuevo</span>
        </button>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default WorkHeader;