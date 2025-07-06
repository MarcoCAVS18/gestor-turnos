// src/components/shifts/ShiftsHeader.jsx

import React from 'react';
import { Calendar, Plus } from 'lucide-react';

const ShiftsHeader = (props) => {
  const { 
    hasShifts, 
    allJobs, 
    sortedDays, 
    daysShown, 
    onNewShift, 
    thematicColors, 
    daysPerPage 
  } = props;

  return (
    <div className="flex justify-between items-center pt-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: thematicColors?.transparent10 }}>
          <Calendar className="w-6 h-6" style={{ color: thematicColors?.base }} />
        </div>
        <div>
          <h1 className="text-xl font-semibold mb-4 pt-4">Mis Turnos</h1>
          {hasShifts && sortedDays.length > daysPerPage && (
            <p className="text-sm text-gray-500 -mt-2">
              Mostrando {Math.min(daysShown, sortedDays.length)} de {sortedDays.length} días
            </p>
          )}
        </div>
      </div>
      {hasShifts && allJobs.length > 0 && (
        <button 
          onClick={onNewShift} 
          className="text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 shadow-sm" 
          style={{ backgroundColor: thematicColors?.base, filter: 'brightness(1.1)' }} 
          onMouseEnter={(e) => { e.target.style.filter = 'brightness(1.0)'; }} 
          onMouseLeave={(e) => { e.target.style.filter = 'brightness(1.1)'; }}
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo</span>
        </button>
      )}
    </div>
  );
};

export default ShiftsHeader;