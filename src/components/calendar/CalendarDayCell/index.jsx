// src/components/calendar/CalendarDayCell/index.jsx
import React from 'react';

const CalendarDayCell = (***REMOVED***
  dia,
  esHoy,
  esSeleccionado,
  coloresTrabajos,
  thematicColors,
  onClick
***REMOVED***) => ***REMOVED***
  return (
    <button
      onClick=***REMOVED***onClick***REMOVED***
      className=***REMOVED***`
        p-2 text-center relative 
        hover:bg-gray-50 
        flex flex-col justify-center items-center
        $***REMOVED***!dia.mesActual ? 'text-gray-400' : 'text-gray-800'***REMOVED***
      `***REMOVED***
      style=***REMOVED******REMOVED***
        backgroundColor: esSeleccionado
          ? thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)'
          : 'transparent'
      ***REMOVED******REMOVED***
    >
      ***REMOVED***/* Círculo para día actual */***REMOVED***
      ***REMOVED***esHoy && (
        <div
          className="absolute inset-0 m-auto rounded-full w-10 h-10 animate-pulse"
          style=***REMOVED******REMOVED***
            border: `2px solid $***REMOVED***thematicColors?.base || '#EC4899'***REMOVED***`
          ***REMOVED******REMOVED***
        />
      )***REMOVED***

      ***REMOVED***/* Contenedor para número del día */***REMOVED***
      <div
        className="rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
        style=***REMOVED******REMOVED***
          backgroundColor: esHoy
            ? thematicColors?.base || '#EC4899'
            : (esSeleccionado && !esHoy)
              ? thematicColors?.transparent20 || 'rgba(236, 72, 153, 0.2)'
              : 'transparent',
          color: esHoy
            ? thematicColors?.textContrast || '#ffffff'
            : 'inherit',
          fontWeight: esHoy ? 'bold' : 'normal',
          transform: esHoy ? 'scale(1.1)' : 'scale(1)',
          boxShadow: esHoy
            ? `0 4px 12px $***REMOVED***thematicColors?.transparent50 || 'rgba(236, 72, 153, 0.5)'***REMOVED***`
            : 'none'
        ***REMOVED******REMOVED***
      >
        <span>***REMOVED***dia.dia***REMOVED***</span>
      </div>

      ***REMOVED***/* Indicadores de turnos */***REMOVED***
      ***REMOVED***dia.tieneTurnos && (
        <div className="absolute bottom-1 flex justify-center gap-1">
          ***REMOVED***coloresTrabajos.length === 1 ? (
            <div
              className="w-4 h-1 rounded"
              style=***REMOVED******REMOVED*** backgroundColor: coloresTrabajos[0] ***REMOVED******REMOVED***
            />
          ) : coloresTrabajos.length === 2 ? (
            <>
              <div
                className="w-2 h-1 rounded"
                style=***REMOVED******REMOVED*** backgroundColor: coloresTrabajos[0] ***REMOVED******REMOVED***
              />
              <div
                className="w-2 h-1 rounded"
                style=***REMOVED******REMOVED*** backgroundColor: coloresTrabajos[1] ***REMOVED******REMOVED***
              />
            </>
          ) : coloresTrabajos.length >= 3 ? (
            <>
              <div
                className="w-1 h-1 rounded-full"
                style=***REMOVED******REMOVED*** backgroundColor: coloresTrabajos[0] ***REMOVED******REMOVED***
              />
              <div
                className="w-1 h-1 rounded-full"
                style=***REMOVED******REMOVED*** backgroundColor: coloresTrabajos[1] ***REMOVED******REMOVED***
              />
              <div
                className="w-1 h-1 rounded-full"
                style=***REMOVED******REMOVED*** backgroundColor: coloresTrabajos[2] ***REMOVED******REMOVED***
              />
            </>
          ) : null***REMOVED***
        </div>
      )***REMOVED***
    </button>
  );
***REMOVED***;

export default CalendarDayCell;