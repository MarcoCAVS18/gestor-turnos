// src/components/calendar/CalendarDayCell/index.jsx
import React from 'react';

const CalendarDayCell = ({
  dia,
  esHoy,
  esSeleccionado,
  coloresTrabajos,
  coloresTemáticos,
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        p-2 text-center relative 
        hover:bg-gray-50 
        flex flex-col justify-center items-center
        ${!dia.mesActual ? 'text-gray-400' : 'text-gray-800'}
      `}
      style={{
        backgroundColor: esSeleccionado
          ? coloresTemáticos?.transparent10 || 'rgba(236, 72, 153, 0.1)'
          : 'transparent'
      }}
    >
      {/* Círculo para día actual */}
      {esHoy && (
        <div
          className="absolute inset-0 m-auto rounded-full w-10 h-10 animate-pulse"
          style={{
            border: `2px solid ${coloresTemáticos?.base || '#EC4899'}`
          }}
        />
      )}

      {/* Contenedor para número del día */}
      <div
        className="rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
        style={{
          backgroundColor: esHoy
            ? coloresTemáticos?.base || '#EC4899'
            : (esSeleccionado && !esHoy)
              ? coloresTemáticos?.transparent20 || 'rgba(236, 72, 153, 0.2)'
              : 'transparent',
          color: esHoy
            ? coloresTemáticos?.textContrast || '#ffffff'
            : 'inherit',
          fontWeight: esHoy ? 'bold' : 'normal',
          transform: esHoy ? 'scale(1.1)' : 'scale(1)',
          boxShadow: esHoy
            ? `0 4px 12px ${coloresTemáticos?.transparent50 || 'rgba(236, 72, 153, 0.5)'}`
            : 'none'
        }}
      >
        <span>{dia.dia}</span>
      </div>

      {/* Indicadores de turnos */}
      {dia.tieneTurnos && (
        <div className="absolute bottom-1 flex justify-center gap-1">
          {coloresTrabajos.length === 1 ? (
            <div
              className="w-4 h-1 rounded"
              style={{ backgroundColor: coloresTrabajos[0] }}
            />
          ) : coloresTrabajos.length === 2 ? (
            <>
              <div
                className="w-2 h-1 rounded"
                style={{ backgroundColor: coloresTrabajos[0] }}
              />
              <div
                className="w-2 h-1 rounded"
                style={{ backgroundColor: coloresTrabajos[1] }}
              />
            </>
          ) : coloresTrabajos.length >= 3 ? (
            <>
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: coloresTrabajos[0] }}
              />
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: coloresTrabajos[1] }}
              />
              <div
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: coloresTrabajos[2] }}
              />
            </>
          ) : null}
        </div>
      )}
    </button>
  );
};

export default CalendarDayCell;