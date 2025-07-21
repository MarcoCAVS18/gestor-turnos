// src/components/calendar/CalendarGrid/index.jsx

import React from 'react';
import CalendarDayCell from '../CalendarDayCell';
import ***REMOVED*** fechaLocalAISO ***REMOVED*** from '../../../utils/calendarUtils';

const CalendarGrid = (***REMOVED*** 
  dias, 
  fechaActual, 
  diaSeleccionadoActual, 
  trabajos, 
  thematicColors, 
  onDiaClick 
***REMOVED***) => ***REMOVED***
  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const fechaActualISO = fechaLocalAISO(fechaActual);

  // Función para obtener colores de trabajos
  const obtenerColoresTrabajos = (turnosDelDia, todosLosTrabajos) => ***REMOVED***
    const coloresUnicos = new Set();
    
    if (!turnosDelDia || turnosDelDia.length === 0) ***REMOVED***
      return [];
    ***REMOVED***
    
    turnosDelDia.forEach(turno => ***REMOVED***
      const trabajo = todosLosTrabajos.find(t => t.id === turno.trabajoId);
      if (trabajo) ***REMOVED***
        // Para trabajos de delivery, usar color específico
        if (trabajo.tipo === 'delivery' || turno.tipo === 'delivery') ***REMOVED***
          coloresUnicos.add(trabajo.colorAvatar || trabajo.color || '#10B981');
        ***REMOVED*** else ***REMOVED***
          // Para trabajos tradicionales
          coloresUnicos.add(trabajo.color || '#EC4899');
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        // Si no se encuentra el trabajo, usar color por defecto según tipo
        if (turno.tipo === 'delivery') ***REMOVED***
          coloresUnicos.add('#10B981'); // Verde para delivery
        ***REMOVED*** else ***REMOVED***
          coloresUnicos.add('#EC4899'); // Rosa para tradicional
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***);
    
    return Array.from(coloresUnicos).slice(0, 3); // Máximo 3 colores
  ***REMOVED***;

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
          
          // Obtener colores correctamente
          const coloresTrabajos = obtenerColoresTrabajos(dia.turnosDelDia, trabajos);

          return (
            <CalendarDayCell
              key=***REMOVED***index***REMOVED***
              dia=***REMOVED***dia***REMOVED***
              esHoy=***REMOVED***esHoy***REMOVED***
              esSeleccionado=***REMOVED***esSeleccionado***REMOVED***
              coloresTrabajos=***REMOVED***coloresTrabajos***REMOVED***
              thematicColors=***REMOVED***thematicColors***REMOVED***
              onClick=***REMOVED***() => onDiaClick(dia.fecha)***REMOVED***
            />
          );
        ***REMOVED***)***REMOVED***
      </div>
    </>
  );
***REMOVED***;

export default CalendarGrid;