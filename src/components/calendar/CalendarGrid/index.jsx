// src/components/calendar/CalendarGrid/index.jsx

import React from 'react';
import CalendarDayCell from '../CalendarDayCell';
import ***REMOVED*** fechaLocalAISO, obtenerColoresTrabajos ***REMOVED*** from '../../../utils/calendarUtils';

const CalendarGrid = (***REMOVED*** 
  dias, 
  fechaActual, 
  diaSeleccionadoActual, 
  trabajos, 
  coloresTemáticos, 
  onDiaClick 
***REMOVED***) => ***REMOVED***
  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const fechaActualISO = fechaLocalAISO(fechaActual);

  return (
    <>
      ***REMOVED***/* Encabezados de días */***REMOVED***
      <div className="grid grid-cols-7 bg-gray-100">
        ***REMOVED***diasSemana.map(dia => (
          <div key=***REMOVED***dia***REMOVED*** className="py-2 text-center text-gray-600 text-sm font-medium">
            ***REMOVED***dia***REMOVED***
          </div>
        ))***REMOVED***
      </div>

      ***REMOVED***/* Grid de días */***REMOVED***
      <div className="grid grid-cols-7">
        ***REMOVED***dias.map((dia, index) => ***REMOVED***
          const fechaDiaISO = fechaLocalAISO(dia.fecha);
          const esHoy = fechaDiaISO === fechaActualISO;
          const esSeleccionado = fechaDiaISO === diaSeleccionadoActual;
          const coloresTrabajos = obtenerColoresTrabajos(dia.turnosDelDia, trabajos);

          return (
            <CalendarDayCell
              key=***REMOVED***index***REMOVED***
              dia=***REMOVED***dia***REMOVED***
              esHoy=***REMOVED***esHoy***REMOVED***
              esSeleccionado=***REMOVED***esSeleccionado***REMOVED***
              coloresTrabajos=***REMOVED***coloresTrabajos***REMOVED***
              coloresTemáticos=***REMOVED***coloresTemáticos***REMOVED***
              onClick=***REMOVED***() => onDiaClick(dia.fecha)***REMOVED***
            />
          );
        ***REMOVED***)***REMOVED***
      </div>
    </>
  );
***REMOVED***;

export default CalendarGrid;