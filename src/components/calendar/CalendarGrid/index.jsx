// src/components/calendar/CalendarGrid/index.jsx

import React from 'react';
import CalendarDayCell from '../CalendarDayCell';
import { fechaLocalAISO, obtenerColoresTrabajos } from '../../../utils/calendarUtils';

const CalendarGrid = ({ 
  dias, 
  fechaActual, 
  diaSeleccionadoActual, 
  trabajos, 
  coloresTemáticos, 
  onDiaClick 
}) => {
  const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const fechaActualISO = fechaLocalAISO(fechaActual);

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
          const coloresTrabajos = obtenerColoresTrabajos(dia.turnosDelDia, trabajos);

          return (
            <CalendarDayCell
              key={index}
              dia={dia}
              esHoy={esHoy}
              esSeleccionado={esSeleccionado}
              coloresTrabajos={coloresTrabajos}
              coloresTemáticos={coloresTemáticos}
              onClick={() => onDiaClick(dia.fecha)}
            />
          );
        })}
      </div>
    </>
  );
};

export default CalendarGrid;