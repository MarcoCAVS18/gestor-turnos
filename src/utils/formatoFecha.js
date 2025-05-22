// src/utils/formatoFecha.js

/**
 * Formatea una fecha ISO a formato largo en español
 * @param {string} fechaStr 
 * @returns {string} 
 */
export const formatearFechaLarga = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  /**
   * Formatea una fecha ISO a formato corto en español
   * @param {string} fechaStr 
   * @returns {string} 
   */
  export const formatearFechaCorta = (fechaStr) => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };
  
  /**
   * Obtiene el nombre del mes en español
   * @param {number} mes 
   * @returns {string} 
   */
  export const obtenerNombreMes = (mes) => {
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    return meses[mes];
  };
  
  /**
   * Obtiene el nombre del día de la semana en español
   * @param {number} dia 
   * @returns {string}
   */
  export const obtenerNombreDia = (dia) => {
    const dias = [
      'domingo', 'lunes', 'martes', 'miércoles', 
      'jueves', 'viernes', 'sábado'
    ];
    
    return dias[dia];
  };
  
  /**
   * Obtiene la abreviatura del día de la semana en español
   * @param {number} dia 
   * @returns {string} 
   */
  export const obtenerAbreviaturaDia = (dia) => {
    const abreviaturas = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return abreviaturas[dia];
  };
  
  /**
   * Verifica si una fecha es hoy
   * @param {Date} fecha 
   * @returns {boolean} 
   */
  export const esHoy = (fecha) => {
    const hoy = new Date();
    return fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear();
  };
  
  /**
   * Convierte una fecha de objeto Date a formato ISO (YYYY-MM-DD)
   * @param {Date} fecha
   * @returns {string} 
   */
  export const fechaAIso = (fecha) => {
    return fecha.toISOString().split('T')[0];
  };
  
  /**
   * Formatea hora en formato 24h (HH:MM)
   * @param {Date} fecha
   * @returns {string}
   */
  export const formatearHora = (fecha) => {
    return fecha.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };
  
  /**
   * Obtiene el primer día del mes actual
   * @param {number} anio
   * @param {number} mes 
   * @returns {Date}
   */
  export const obtenerPrimerDiaMes = (anio, mes) => {
    return new Date(anio, mes, 1);
  };
  
  /**
   * Obtiene el último día del mes actual
   * @param {number} anio 
   * @param {number} mes 
   * @returns {Date} 
   */
  export const obtenerUltimoDiaMes = (anio, mes) => {
    return new Date(anio, mes + 1, 0);
  };
  
  /**
   * Obtiene el rango de fechas para un mes
   * @param {number} anio 
   * @param {number} mes 
   * @returns {Object} 
   */
  export const obtenerRangoMes = (anio, mes) => {
    const fechaInicio = obtenerPrimerDiaMes(anio, mes);
    const fechaFin = obtenerUltimoDiaMes(anio, mes);
    
    return {
      fechaInicio: fechaAIso(fechaInicio),
      fechaFin: fechaAIso(fechaFin)
    };
  };
  
  /**
   * Agrupa turnos por fecha
   * @param {Array} turnos 
   * @returns {Object} 
   */
  export const agruparTurnosPorFecha = (turnos) => {
    return turnos.reduce((acc, turno) => {
      if (!acc[turno.fecha]) {
        acc[turno.fecha] = [];
      }
      acc[turno.fecha].push(turno);
      return acc;
    }, {});
  };
  
  /**
   * Ordena fechas de más reciente a más antigua
   * @param {Array} fechas 
   * @returns {Array} 
   */
  export const ordenarFechasDescendente = (fechas) => {
    return [...fechas].sort((a, b) => new Date(b) - new Date(a));
  };
  
  /**
   * Obtiene el nombre del día y el número del día de una fecha
   * @param {string} fechaStr 
   * @returns {Object} 
   */
  export const obtenerDiaYNumero = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const nombreDia = obtenerNombreDia(fecha.getDay());
    const numeroDia = fecha.getDate();
    
    return { nombreDia, numeroDia };
  };