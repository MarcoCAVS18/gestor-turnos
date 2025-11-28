// src/utils/calendarUtils.js - VERSIÓN ACTUALIZADA COMPLETA

import { createSafeDate } from './time';

/**
 * Crea una fecha local evitando problemas de zona horaria
 */
export const crearFechaLocal = (year, month, day) => new Date(year, month, day);

/**
 * Convierte una fecha local a formato ISO string (YYYY-MM-DD)
 */
export const fechaLocalAISO = (fecha) => {
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Verifica si una fecha es hoy
 */
export const fechaEsHoy = (fecha, fechaActual) => {
  return fecha.getDate() === fechaActual.getDate() &&
         fecha.getMonth() === fechaActual.getMonth() &&
         fecha.getFullYear() === fechaActual.getFullYear();
};

/**
 * Obtiene los turnos del mes considerando turnos nocturnos
 */
export const obtenerTurnosMes = (turnos, anioActual, mesActual) => {
  const primerDia = crearFechaLocal(anioActual, mesActual, 1);
  const ultimoDia = crearFechaLocal(anioActual, mesActual + 1, 0);
  
  const primerDiaStr = fechaLocalAISO(primerDia);
  const ultimoDiaStr = fechaLocalAISO(ultimoDia);
  
  // Filtrar turnos que ocurren en el mes (considerando turnos nocturnos)
  return turnos.filter(turno => {
    // Fecha principal del turno
    const fechaPrincipal = turno.fechaInicio || turno.fecha;
    
    if (fechaPrincipal >= primerDiaStr && fechaPrincipal <= ultimoDiaStr) {
      return true;
    }
    
    // Si el turno tiene fechaFin diferente, verificar también esa fecha
    if (turno.fechaFin && turno.fechaFin !== fechaPrincipal) {
      return turno.fechaFin >= primerDiaStr && turno.fechaFin <= ultimoDiaStr;
    }
    
    return false;
  });
};

/**
 * Verifica si hay turnos en una fecha específica
 */
export const verificarTurnosEnFecha = (fecha, turnos) => {
  const fechaStr = fechaLocalAISO(fecha);
  
  return turnos.some(turno => {
    // Verificar fecha principal
    const fechaPrincipal = turno.fechaInicio || turno.fecha;
    if (fechaPrincipal === fechaStr) {
      return true;
    }
    
    // Verificar fecha de fin para turnos nocturnos
    if (turno.fechaFin && turno.fechaFin !== fechaPrincipal && turno.fechaFin === fechaStr) {
      return true;
    }
    
    return false;
  });
};

/**
 * Obtener turnos de un día específico (incluyendo nocturnos)
 */
export const obtenerTurnosDelDia = (fecha, turnos) => {
  const fechaStr = fechaLocalAISO(fecha);
  
  return turnos.filter(turno => {
    // Verificar fecha principal
    const fechaPrincipal = turno.fechaInicio || turno.fecha;
    if (fechaPrincipal === fechaStr) {
      return true;
    }
    
    // Verificar fecha de fin para turnos nocturnos
    if (turno.fechaFin && turno.fechaFin !== fechaPrincipal && turno.fechaFin === fechaStr) {
      return true;
    }
    
    return false;
  });
};

/**
 * Obtener colores considerando turnos nocturnos
 */
export const obtenerColoresTrabajos = (turnosDelDia, trabajos) => {
  const coloresUnicos = new Set();
  
  turnosDelDia.forEach(turno => {
    const trabajo = trabajos.find(t => t.id === turno.trabajoId);
    if (trabajo) {
      // Para trabajos de delivery, usar un color específico o el color del trabajo
      if (trabajo.tipo === 'delivery' || turno.tipo === 'delivery') {
        coloresUnicos.add(trabajo.colorAvatar || trabajo.color || '#10B981');
      } else {
        coloresUnicos.add(trabajo.color);
      }
    }
  });
  
  return Array.from(coloresUnicos).slice(0, 3);
};

/**
 * Determinar el tipo de turno en una fecha específica
 */
export const obtenerTipoTurnoEnFecha = (turno, fechaStr) => {
  const fechaPrincipal = turno.fechaInicio || turno.fecha;
  
  // Si es la fecha principal del turno
  if (fechaPrincipal === fechaStr) {
    if (turno.cruzaMedianoche) {
      return 'inicio-nocturno'; // Turno que empieza este día y termina al siguiente
    }
    return 'normal'; // Turno completo en este día
  }
  
  // Si es la fecha de fin de un turno nocturno
  if (turno.fechaFin && turno.fechaFin === fechaStr && turno.cruzaMedianoche) {
    return 'fin-nocturno'; // Turno que empezó el día anterior y termina este día
  }
  
  return 'normal';
};

/**
 * Formatear la información del turno para mostrar en el calendario
 */
export const formatearInfoTurnoParaCalendario = (turno, fechaStr, trabajo) => {
  const tipoTurno = obtenerTipoTurnoEnFecha(turno, fechaStr);
  
  let etiquetaHora = `${turno.horaInicio} - ${turno.horaFin}`;
  let etiquetaTipo = '';
  
  if (tipoTurno === 'inicio-nocturno') {
    etiquetaHora = `${turno.horaInicio} - ...`;
    etiquetaTipo = ' (inicia)';
  } else if (tipoTurno === 'fin-nocturno') {
    etiquetaHora = `... - ${turno.horaFin}`;
    etiquetaTipo = ' (termina)';
  }
  
  return {
    id: turno.id,
    trabajo: trabajo?.nombre || 'Trabajo no encontrado',
    etiquetaHora,
    etiquetaTipo,
    tipoTurno,
    color: trabajo?.color || trabajo?.colorAvatar || '#6B7280',
    esDelivery: turno.tipo === 'delivery' || trabajo?.tipo === 'delivery'
  };
};

/**
 * Obtiene los días de la semana en español
 */
export const getDiasSemana = () => {
  return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
};

/**
 * Obtiene los meses en español
 */
export const getMeses = () => {
  return [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
};

/**
 * Formatea una fecha relativa (hoy, ayer, etc.)
 */
export const formatearFechaRelativa = (fechaStr) => {
  const fecha = createSafeDate(fechaStr);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);
  const mañana = new Date(hoy);
  mañana.setDate(hoy.getDate() + 1);

  if (fecha.toDateString() === hoy.toDateString()) {
    return 'Hoy';
  } else if (fecha.toDateString() === ayer.toDateString()) {
    return 'Ayer';
  } else if (fecha.toDateString() === mañana.toDateString()) {
    return 'Mañana';
  } else {
    return fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }
};