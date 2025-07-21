// src/components/calendar/CalendarGrid/index.jsx

import React from 'react';
import CalendarDayCell from '../CalendarDayCell';
import { fechaLocalAISO } from '../../../utils/calendarUtils';

const CalendarGrid = ({ 
  dias, 
  fechaActual, 
  diaSeleccionadoActual, 
  trabajos, 
  thematicColors, 
  onDiaClick 
}) => {
  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const fechaActualISO = fechaLocalAISO(fechaActual);

  // Función para obtener colores de trabajos
  const obtenerColoresTrabajos = (turnosDelDia, todosLosTrabajos) => {
    const coloresUnicos = new Set();
    
    if (!turnosDelDia || turnosDelDia.length === 0) {
      return [];
    }
    
    turnosDelDia.forEach(turno => {
      const trabajo = todosLosTrabajos.find(t => t.id === turno.trabajoId);
      if (trabajo) {
        // Para trabajos de delivery, usar color específico
        if (trabajo.tipo === 'delivery' || turno.tipo === 'delivery') {
          coloresUnicos.add(trabajo.colorAvatar || trabajo.color || '#10B981');
        } else {
          // Para trabajos tradicionales
          coloresUnicos.add(trabajo.color || '#EC4899');
        }
      } else {
        // Si no se encuentra el trabajo, usar color por defecto según tipo
        if (turno.tipo === 'delivery') {
          coloresUnicos.add('#10B981'); // Verde para delivery
        } else {
          coloresUnicos.add('#EC4899'); // Rosa para tradicional
        }
      }
    });
    
    return Array.from(coloresUnicos).slice(0, 3); // Máximo 3 colores
  };

  return (
    <>
      {/* Encabezados de días */}
      <div className="grid grid-cols-7 bg-gray-100">
        {diasSemana.map(dia => (
          <div key={dia} className="py-2 text-center text-gray-600 text-sm font-medium">
            {dia}
          </div>
        ))}
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-7">
        {dias.map((dia, index) => {
          const fechaDiaISO = fechaLocalAISO(dia.fecha);
          const esHoy = fechaDiaISO === fechaActualISO;
          const esSeleccionado = fechaDiaISO === diaSeleccionadoActual;
          
          // Obtener colores correctamente
          const coloresTrabajos = obtenerColoresTrabajos(dia.turnosDelDia, trabajos);

          return (
            <CalendarDayCell
              key={index}
              dia={dia}
              esHoy={esHoy}
              esSeleccionado={esSeleccionado}
              coloresTrabajos={coloresTrabajos}
              thematicColors={thematicColors}
              onClick={() => onDiaClick(dia.fecha)}
            />
          );
        })}
      </div>
    </>
  );
};

export default CalendarGrid;