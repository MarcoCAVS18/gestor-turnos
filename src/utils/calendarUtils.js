// src/utils/calendarUtils.js

export const crearFechaLocal = (year, month, day) => new Date(year, month, day);

export const fechaLocalAISO = (fecha) => ***REMOVED***
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `$***REMOVED***year***REMOVED***-$***REMOVED***month***REMOVED***-$***REMOVED***day***REMOVED***`;
***REMOVED***;

export const fechaEsHoy = (fecha, fechaActual) => ***REMOVED***
  return fecha.getDate() === fechaActual.getDate() &&
         fecha.getMonth() === fechaActual.getMonth() &&
         fecha.getFullYear() === fechaActual.getFullYear();
***REMOVED***;

export const obtenerTurnosMes = (turnos, anioActual, mesActual) => ***REMOVED***
  const primerDia = crearFechaLocal(anioActual, mesActual, 1);
  const ultimoDia = crearFechaLocal(anioActual, mesActual + 1, 0);
  
  const primerDiaStr = fechaLocalAISO(primerDia);
  const ultimoDiaStr = fechaLocalAISO(ultimoDia);
  
  return turnos.filter(turno => 
    turno.fecha >= primerDiaStr && turno.fecha <= ultimoDiaStr
  );
***REMOVED***;

export const verificarTurnosEnFecha = (fecha, turnos) => ***REMOVED***
  const fechaStr = fechaLocalAISO(fecha);
  return turnos.some(turno => turno.fecha === fechaStr);
***REMOVED***;

export const obtenerTurnosDelDia = (fecha, turnos) => ***REMOVED***
  const fechaStr = fechaLocalAISO(fecha);
  return turnos.filter(turno => turno.fecha === fechaStr);
***REMOVED***;

export const obtenerColoresTrabajos = (turnosDelDia, trabajos) => ***REMOVED***
  const coloresUnicos = new Set();
  
  turnosDelDia.forEach(turno => ***REMOVED***
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (trabajo) ***REMOVED***
      // Para trabajos de delivery, usar un color específico o el color del trabajo
      if (trabajo.tipo === 'delivery') ***REMOVED***
        coloresUnicos.add(trabajo.colorAvatar || trabajo.color || '#10B981');
      ***REMOVED*** else ***REMOVED***
        coloresUnicos.add(trabajo.color);
      ***REMOVED***
    ***REMOVED***
  ***REMOVED***);
  
  return Array.from(coloresUnicos).slice(0, 3);
***REMOVED***;