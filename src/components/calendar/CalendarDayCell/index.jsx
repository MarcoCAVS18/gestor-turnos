// src/components/calendar/CalendarDayCell/index.jsx - VERSIÓN ACTUALIZADA

import React from 'react';

const CalendarDayCell = (***REMOVED***
  dia,
  esHoy,
  esSeleccionado,
  coloresTrabajos,
  thematicColors,
  onClick
***REMOVED***) => ***REMOVED***
  
  // NUEVO: Analizar tipos de turnos en este día (solo si hay turnos)
  const analizarTurnos = () => ***REMOVED***
    if (!dia.turnosDelDia || dia.turnosDelDia.length === 0) ***REMOVED***
      return null;
    ***REMOVED***

    const analisis = ***REMOVED***
      normales: [],
      inicianNocturno: [],
      terminanNocturno: [],
      colores: new Set()
    ***REMOVED***;

    dia.turnosDelDia.forEach(turno => ***REMOVED***
      const fechaStr = dia.fecha.toISOString().split('T')[0];
      
      // Verificar si es un turno nocturno
      const esNocturno = turno.cruzaMedianoche;
      const fechaPrincipal = turno.fechaInicio || turno.fecha;
      
      // Obtener color del trabajo (usar los colores ya calculados)
      const colorIndex = analisis.normales.length + analisis.inicianNocturno.length + analisis.terminanNocturno.length;
      const colorTurno = coloresTrabajos[colorIndex % coloresTrabajos.length] || '#6B7280';
      analisis.colores.add(colorTurno);
      
      if (esNocturno) ***REMOVED***
        if (fechaPrincipal === fechaStr) ***REMOVED***
          // Turno que inicia este día
          analisis.inicianNocturno.push(turno);
        ***REMOVED*** else if (turno.fechaFin === fechaStr) ***REMOVED***
          // Turno que termina este día
          analisis.terminanNocturno.push(turno);
        ***REMOVED***
      ***REMOVED*** else ***REMOVED***
        // Turno normal
        analisis.normales.push(turno);
      ***REMOVED***
    ***REMOVED***);

    return ***REMOVED***
      ...analisis,
      colores: Array.from(analisis.colores),
      tieneNocturnos: analisis.inicianNocturno.length > 0 || analisis.terminanNocturno.length > 0
    ***REMOVED***;
  ***REMOVED***;

  const analisisTurnos = analizarTurnos();

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

      ***REMOVED***/* NUEVO: Indicadores de turnos mejorados */***REMOVED***
      ***REMOVED***dia.tieneTurnos && analisisTurnos && (
        <div className="absolute bottom-1 flex justify-center gap-0.5 w-full px-1">
          ***REMOVED***/* Indicadores para turnos que terminan hoy (empezaron ayer) */***REMOVED***
          ***REMOVED***analisisTurnos.terminanNocturno.length > 0 && (
            <div className="flex gap-0.5">
              ***REMOVED***analisisTurnos.terminanNocturno.slice(0, 2).map((turno, index) => (
                <div
                  key=***REMOVED***`fin-$***REMOVED***index***REMOVED***`***REMOVED***
                  className="w-1 h-2 rounded-l-full"
                  style=***REMOVED******REMOVED*** 
                    backgroundColor: coloresTrabajos[index % coloresTrabajos.length] || '#6B7280',
                    opacity: 0.8
                  ***REMOVED******REMOVED***
                  title="Turno nocturno que termina hoy"
                />
              ))***REMOVED***
            </div>
          )***REMOVED***
          
          ***REMOVED***/* Indicadores para turnos normales */***REMOVED***
          ***REMOVED***analisisTurnos.normales.length > 0 && (
            <div className="flex gap-0.5">
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
          
          ***REMOVED***/* Indicadores para turnos que inician hoy (terminan mañana) */***REMOVED***
          ***REMOVED***analisisTurnos.inicianNocturno.length > 0 && (
            <div className="flex gap-0.5">
              ***REMOVED***analisisTurnos.inicianNocturno.slice(0, 2).map((turno, index) => (
                <div
                  key=***REMOVED***`inicio-$***REMOVED***index***REMOVED***`***REMOVED***
                  className="w-1 h-2 rounded-r-full"
                  style=***REMOVED******REMOVED*** 
                    backgroundColor: coloresTrabajos[index % coloresTrabajos.length] || '#6B7280',
                    opacity: 0.8
                  ***REMOVED******REMOVED***
                  title="Turno nocturno que inicia hoy"
                />
              ))***REMOVED***
            </div>
          )***REMOVED***
        </div>
      )***REMOVED***
      
      ***REMOVED***/* NUEVO: Indicador especial para días con múltiples tipos de turnos */***REMOVED***
      ***REMOVED***analisisTurnos && analisisTurnos.tieneNocturnos && (
        <div 
          className="absolute top-1 right-1 w-2 h-2 rounded-full opacity-60"
          style=***REMOVED******REMOVED*** backgroundColor: '#8B5CF6' ***REMOVED******REMOVED***
          title="Incluye turnos nocturnos"
        />
      )***REMOVED***
    </button>
  );
***REMOVED***;

export default CalendarDayCell;