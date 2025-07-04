// src/components/calendar/CalendarSummary/index.jsx

import React from 'react';

const CalendarSummary = (***REMOVED*** totalTurnos, thematicColors ***REMOVED***) => ***REMOVED***
  if (totalTurnos === 0) return null;

  return (
    <div
      className="p-2 text-xs text-center font-medium"
      style=***REMOVED******REMOVED***
        backgroundColor: thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)',
        color: thematicColors?.dark || '#BE185D'
      ***REMOVED******REMOVED***
    >
      ***REMOVED***totalTurnos***REMOVED*** ***REMOVED***totalTurnos === 1 ? 'turno' : 'turnos'***REMOVED*** este mes
    </div>
  );
***REMOVED***;

export default CalendarSummary;