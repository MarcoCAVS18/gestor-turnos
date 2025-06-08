// src/components/calendar/CalendarHeader/index.jsx

import React from 'react';
import ***REMOVED*** ChevronLeft, ChevronRight ***REMOVED*** from 'lucide-react';

const CalendarHeader = (***REMOVED*** 
  mesActual, 
  anioActual, 
  onCambiarMes, 
  onIrAHoy, 
  coloresTemáticos 
***REMOVED***) => ***REMOVED***
  const getNombreMes = () => ***REMOVED***
    return new Date(anioActual, mesActual, 1).toLocaleDateString('es-ES', ***REMOVED*** month: 'long' ***REMOVED***);
  ***REMOVED***;

  return (
    <div
      className="p-4 text-white flex justify-between items-center"
      style=***REMOVED******REMOVED*** backgroundColor: coloresTemáticos?.base || '#EC4899' ***REMOVED******REMOVED***
    >
      <button
        onClick=***REMOVED***() => onCambiarMes(-1)***REMOVED***
        className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
      >
        <ChevronLeft size=***REMOVED***20***REMOVED*** />
      </button>
      
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold capitalize">
          ***REMOVED***getNombreMes()***REMOVED*** ***REMOVED***anioActual***REMOVED***
        </h3>
        <button
          onClick=***REMOVED***onIrAHoy***REMOVED***
          className="text-xs px-3 py-1 rounded-full mt-1 transition-colors bg-white bg-opacity-20 hover:bg-opacity-30"
        >
          Hoy
        </button>
      </div>
      
      <button
        onClick=***REMOVED***() => onCambiarMes(1)***REMOVED***
        className="text-white p-2 rounded-full transition-colors hover:bg-black hover:bg-opacity-20"
      >
        <ChevronRight size=***REMOVED***20***REMOVED*** />
      </button>
    </div>
  );
***REMOVED***;

export default CalendarHeader;