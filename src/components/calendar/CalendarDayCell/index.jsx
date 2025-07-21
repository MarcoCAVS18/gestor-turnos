// src/components/calendar/CalendarDayCell/index.jsx - VERSIÓN ACTUALIZADA

import React from 'react';

const CalendarDayCell = ({
  dia,
  esHoy,
  esSeleccionado,
  coloresTrabajos,
  thematicColors,
  onClick
}) => {
  
  // NUEVO: Analizar tipos de turnos en este día (solo si hay turnos)
  const analizarTurnos = () => {
    if (!dia.turnosDelDia || dia.turnosDelDia.length === 0) {
      return null;
    }

    const analisis = {
      normales: [],
      inicianNocturno: [],
      terminanNocturno: [],
      colores: new Set()
    };

    dia.turnosDelDia.forEach(turno => {
      const fechaStr = dia.fecha.toISOString().split('T')[0];
      
      // Verificar si es un turno nocturno
      const esNocturno = turno.cruzaMedianoche;
      const fechaPrincipal = turno.fechaInicio || turno.fecha;
      
      // Obtener color del trabajo (usar los colores ya calculados)
      const colorIndex = analisis.normales.length + analisis.inicianNocturno.length + analisis.terminanNocturno.length;
      const colorTurno = coloresTrabajos[colorIndex % coloresTrabajos.length] || '#6B7280';
      analisis.colores.add(colorTurno);
      
      if (esNocturno) {
        if (fechaPrincipal === fechaStr) {
          // Turno que inicia este día
          analisis.inicianNocturno.push(turno);
        } else if (turno.fechaFin === fechaStr) {
          // Turno que termina este día
          analisis.terminanNocturno.push(turno);
        }
      } else {
        // Turno normal
        analisis.normales.push(turno);
      }
    });

    return {
      ...analisis,
      colores: Array.from(analisis.colores),
      tieneNocturnos: analisis.inicianNocturno.length > 0 || analisis.terminanNocturno.length > 0
    };
  };

  const analisisTurnos = analizarTurnos();

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
          ? thematicColors?.transparent10 || 'rgba(236, 72, 153, 0.1)'
          : 'transparent'
      }}
    >
      {/* Círculo para día actual */}
      {esHoy && (
        <div
          className="absolute inset-0 m-auto rounded-full w-10 h-10 animate-pulse"
          style={{
            border: `2px solid ${thematicColors?.base || '#EC4899'}`
          }}
        />
      )}

      {/* Contenedor para número del día */}
      <div
        className="rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
        style={{
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
            ? `0 4px 12px ${thematicColors?.transparent50 || 'rgba(236, 72, 153, 0.5)'}`
            : 'none'
        }}
      >
        <span>{dia.dia}</span>
      </div>

      {/* NUEVO: Indicadores de turnos mejorados */}
      {dia.tieneTurnos && analisisTurnos && (
        <div className="absolute bottom-1 flex justify-center gap-0.5 w-full px-1">
          {/* Indicadores para turnos que terminan hoy (empezaron ayer) */}
          {analisisTurnos.terminanNocturno.length > 0 && (
            <div className="flex gap-0.5">
              {analisisTurnos.terminanNocturno.slice(0, 2).map((turno, index) => (
                <div
                  key={`fin-${index}`}
                  className="w-1 h-2 rounded-l-full"
                  style={{ 
                    backgroundColor: coloresTrabajos[index % coloresTrabajos.length] || '#6B7280',
                    opacity: 0.8
                  }}
                  title="Turno nocturno que termina hoy"
                />
              ))}
            </div>
          )}
          
          {/* Indicadores para turnos normales */}
          {analisisTurnos.normales.length > 0 && (
            <div className="flex gap-0.5">
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
          
          {/* Indicadores para turnos que inician hoy (terminan mañana) */}
          {analisisTurnos.inicianNocturno.length > 0 && (
            <div className="flex gap-0.5">
              {analisisTurnos.inicianNocturno.slice(0, 2).map((turno, index) => (
                <div
                  key={`inicio-${index}`}
                  className="w-1 h-2 rounded-r-full"
                  style={{ 
                    backgroundColor: coloresTrabajos[index % coloresTrabajos.length] || '#6B7280',
                    opacity: 0.8
                  }}
                  title="Turno nocturno que inicia hoy"
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* NUEVO: Indicador especial para días con múltiples tipos de turnos */}
      {analisisTurnos && analisisTurnos.tieneNocturnos && (
        <div 
          className="absolute top-1 right-1 w-2 h-2 rounded-full opacity-60"
          style={{ backgroundColor: '#8B5CF6' }}
          title="Incluye turnos nocturnos"
        />
      )}
    </button>
  );
};

export default CalendarDayCell;