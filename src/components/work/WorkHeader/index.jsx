// src/components/work/WorkHeader/index.jsx - REFACTORIZADO

import React from 'react';
import ***REMOVED*** Briefcase, Plus ***REMOVED*** from 'lucide-react';
import ***REMOVED*** useThemeColors ***REMOVED*** from '../../../hooks/useThemeColors';

const WorkHeader = (***REMOVED*** 
  todosLosTrabajos, 
  onNuevoTrabajo 
***REMOVED***) => ***REMOVED***
  const colors = useThemeColors();
  const tieneTrabajos = todosLosTrabajos.length > 0;

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div 
          className="p-2 rounded-lg"
          style=***REMOVED******REMOVED*** backgroundColor: colors.transparent10 ***REMOVED******REMOVED***
        >
          <Briefcase 
            className="w-6 h-6" 
            style=***REMOVED******REMOVED*** color: colors.primary ***REMOVED******REMOVED***
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
          style=***REMOVED******REMOVED*** backgroundColor: colors.primary ***REMOVED******REMOVED***
          onMouseEnter=***REMOVED***(e) => ***REMOVED***
            e.target.style.backgroundColor = colors.primaryDark;
          ***REMOVED******REMOVED***
          onMouseLeave=***REMOVED***(e) => ***REMOVED***
            e.target.style.backgroundColor = colors.primary;
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