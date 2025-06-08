// src/components/calendar/CalendarSummary/index.jsx

import React from 'react';

const CalendarSummary = (***REMOVED*** totalTurnos, coloresTemáticos ***REMOVED***) => ***REMOVED***
  if (totalTurnos === 0) return null;

  return (
    <div
      className="p-2 text-xs text-center font-medium"
      style=***REMOVED******REMOVED***
        backgroundColor: coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)',
        color: coloresTemáticos?.dark || '#BE185D'
      ***REMOVED******REMOVED***
    >
      ***REMOVED***totalTurnos***REMOVED*** ***REMOVED***totalTurnos === 1 ? 'turno' : 'turnos'***REMOVED*** este mes
    </div>
  );
***REMOVED***;

export default CalendarSummary;