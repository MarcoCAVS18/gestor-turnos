// src/utils/calendarUtils.js

export const crearFechaLocal = (year, month, day) => new Date(year, month, day);

export const fechaLocalAISO = (fecha) => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const fechaEsHoy = (fecha, fechaActual) => {
  return fecha.getDate() === fechaActual.getDate() &&
         fecha.getMonth() === fechaActual.getMonth() &&
         fecha.getFullYear() === fechaActual.getFullYear();
};

export const obtenerTurnosMes = (turnos, anioActual, mesActual) => {
  const primerDia = crearFechaLocal(anioActual, mesActual, 1);
  const ultimoDia = crearFechaLocal(anioActual, mesActual + 1, 0);
  
  const primerDiaStr = fechaLocalAISO(primerDia);
  const ultimoDiaStr = fechaLocalAISO(ultimoDia);
  
  return turnos.filter(turno => 
    turno.fecha >= primerDiaStr && turno.fecha <= ultimoDiaStr
  );
};

export const verificarTurnosEnFecha = (fecha, turnos) => {
  const fechaStr = fechaLocalAISO(fecha);
  return turnos.some(turno => turno.fecha === fechaStr);
};

export const obtenerTurnosDelDia = (fecha, turnos) => {
  const fechaStr = fechaLocalAISO(fecha);
  return turnos.filter(turno => turno.fecha === fechaStr);
};

export const obtenerColoresTrabajos = (turnosDelDia, trabajos) => {
  const coloresUnicos = new Set();
  
  turnosDelDia.forEach(turno => {
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (trabajo) {
      // Para trabajos de delivery, usar un color específico o el color del trabajo
      if (trabajo.tipo === 'delivery') {
        coloresUnicos.add(trabajo.colorAvatar || trabajo.color || '#10B981');
      } else {
        coloresUnicos.add(trabajo.color);
      }
    }
  });
  
  return Array.from(coloresUnicos).slice(0, 3);
};