// src/components/shifts/ShiftsHeader.jsx

import React from 'react';
import ***REMOVED*** Calendar, Plus ***REMOVED*** from 'lucide-react';

const ShiftsHeader = (props) => ***REMOVED***
  const ***REMOVED*** 
    hasShifts, 
    allJobs, 
    sortedDays, 
    daysShown, 
    onNewShift, 
    thematicColors, 
    daysPerPage 
  ***REMOVED*** = props;

  return (
    <div className="flex justify-between items-center pt-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg" style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.transparent10 ***REMOVED******REMOVED***>
          <Calendar className="w-6 h-6" style=***REMOVED******REMOVED*** color: thematicColors?.base ***REMOVED******REMOVED*** />
        </div>
        <div>
          <h1 className="text-xl font-semibold mb-4 pt-4">Mis Turnos</h1>
          ***REMOVED***hasShifts && sortedDays.length > daysPerPage && (
            <p className="text-sm text-gray-500 -mt-2">
              Mostrando ***REMOVED***Math.min(daysShown, sortedDays.length)***REMOVED*** de ***REMOVED***sortedDays.length***REMOVED*** días
            </p>
          )***REMOVED***
        </div>
      </div>
      ***REMOVED***hasShifts && allJobs.length > 0 && (
        <button 
          onClick=***REMOVED***onNewShift***REMOVED*** 
          className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm" 
          style=***REMOVED******REMOVED*** backgroundColor: thematicColors?.base, filter: 'brightness(1.1)' ***REMOVED******REMOVED*** 
          onMouseEnter=***REMOVED***(e) => ***REMOVED*** e.target.style.filter = 'brightness(1.0)'; ***REMOVED******REMOVED*** 
          onMouseLeave=***REMOVED***(e) => ***REMOVED*** e.target.style.filter = 'brightness(1.1)'; ***REMOVED******REMOVED***
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo</span>
        </button>
      )***REMOVED***
    </div>
  );
***REMOVED***;

export default ShiftsHeader;