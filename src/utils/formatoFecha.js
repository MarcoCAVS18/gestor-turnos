// src/utils/formatoFecha.js

/**
 * Formatea una fecha ISO a formato largo en español
 * @param ***REMOVED***string***REMOVED*** fechaStr - Fecha en formato ISO "YYYY-MM-DD"
 * @returns ***REMOVED***string***REMOVED*** Fecha formateada (ej: "lunes, 15 de mayo de 2023")
 */
export const formatearFechaLarga = (fechaStr) => ***REMOVED***
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', ***REMOVED*** 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    ***REMOVED***);
  ***REMOVED***;
  
  /**
   * Formatea una fecha ISO a formato corto en español
   * @param ***REMOVED***string***REMOVED*** fechaStr - Fecha en formato ISO "YYYY-MM-DD"
   * @returns ***REMOVED***string***REMOVED*** Fecha formateada (ej: "15/05/2023")
   */
  export const formatearFechaCorta = (fechaStr) => ***REMOVED***
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', ***REMOVED*** 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    ***REMOVED***);
  ***REMOVED***;
  
  /**
   * Obtiene el nombre del mes en español
   * @param ***REMOVED***number***REMOVED*** mes - Número de mes (0-11)
   * @returns ***REMOVED***string***REMOVED*** Nombre del mes en español
   */
  export const obtenerNombreMes = (mes) => ***REMOVED***
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    return meses[mes];
  ***REMOVED***;
  
  /**
   * Obtiene el nombre del día de la semana en español
   * @param ***REMOVED***number***REMOVED*** dia - Número de día (0-6, donde 0 es domingo)
   * @returns ***REMOVED***string***REMOVED*** Nombre del día en español
   */
  export const obtenerNombreDia = (dia) => ***REMOVED***
    const dias = [
      'domingo', 'lunes', 'martes', 'miércoles', 
      'jueves', 'viernes', 'sábado'
    ];
    
    return dias[dia];
  ***REMOVED***;
  
  /**
   * Obtiene la abreviatura del día de la semana en español
   * @param ***REMOVED***number***REMOVED*** dia - Número de día (0-6, donde 0 es domingo)
   * @returns ***REMOVED***string***REMOVED*** Abreviatura del día en español
   */
  export const obtenerAbreviaturaDia = (dia) => ***REMOVED***
    const abreviaturas = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return abreviaturas[dia];
  ***REMOVED***;
  
  /**
   * Verifica si una fecha es hoy
   * @param ***REMOVED***Date***REMOVED*** fecha - Fecha a verificar
   * @returns ***REMOVED***boolean***REMOVED*** - true si es hoy, false en caso contrario
   */
  export const esHoy = (fecha) => ***REMOVED***
    const hoy = new Date();
    return fecha.getDate() === hoy.getDate() &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear();
  ***REMOVED***;
  
  /**
   * Convierte una fecha de objeto Date a formato ISO (YYYY-MM-DD)
   * @param ***REMOVED***Date***REMOVED*** fecha - Fecha a convertir
   * @returns ***REMOVED***string***REMOVED*** Fecha en formato ISO
   */
  export const fechaAIso = (fecha) => ***REMOVED***
    return fecha.toISOString().split('T')[0];
  ***REMOVED***;
  
  /**
   * Formatea hora en formato 24h (HH:MM)
   * @param ***REMOVED***Date***REMOVED*** fecha - Fecha y hora a formatear
   * @returns ***REMOVED***string***REMOVED*** Hora formateada "HH:MM"
   */
  export const formatearHora = (fecha) => ***REMOVED***
    return fecha.toLocaleTimeString('es-ES', ***REMOVED***
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    ***REMOVED***);
  ***REMOVED***;
  
  /**
   * Obtiene el primer día del mes actual
   * @param ***REMOVED***number***REMOVED*** anio - Año
   * @param ***REMOVED***number***REMOVED*** mes - Mes (0-11)
   * @returns ***REMOVED***Date***REMOVED*** Primer día del mes
   */
  export const obtenerPrimerDiaMes = (anio, mes) => ***REMOVED***
    return new Date(anio, mes, 1);
  ***REMOVED***;
  
  /**
   * Obtiene el último día del mes actual
   * @param ***REMOVED***number***REMOVED*** anio - Año
   * @param ***REMOVED***number***REMOVED*** mes - Mes (0-11)
   * @returns ***REMOVED***Date***REMOVED*** Último día del mes
   */
  export const obtenerUltimoDiaMes = (anio, mes) => ***REMOVED***
    return new Date(anio, mes + 1, 0);
  ***REMOVED***;
  
  /**
   * Obtiene el rango de fechas para un mes
   * @param ***REMOVED***number***REMOVED*** anio - Año
   * @param ***REMOVED***number***REMOVED*** mes - Mes (0-11)
   * @returns ***REMOVED***Object***REMOVED*** Objeto con fechaInicio y fechaFin en formato ISO
   */
  export const obtenerRangoMes = (anio, mes) => ***REMOVED***
    const fechaInicio = obtenerPrimerDiaMes(anio, mes);
    const fechaFin = obtenerUltimoDiaMes(anio, mes);
    
    return ***REMOVED***
      fechaInicio: fechaAIso(fechaInicio),
      fechaFin: fechaAIso(fechaFin)
    ***REMOVED***;
  ***REMOVED***;
  
  /**
   * Agrupa turnos por fecha
   * @param ***REMOVED***Array***REMOVED*** turnos - Lista de turnos
   * @returns ***REMOVED***Object***REMOVED*** Turnos agrupados por fecha
   */
  export const agruparTurnosPorFecha = (turnos) => ***REMOVED***
    return turnos.reduce((acc, turno) => ***REMOVED***
      if (!acc[turno.fecha]) ***REMOVED***
        acc[turno.fecha] = [];
      ***REMOVED***
      acc[turno.fecha].push(turno);
      return acc;
    ***REMOVED***, ***REMOVED******REMOVED***);
  ***REMOVED***;
  
  /**
   * Ordena fechas de más reciente a más antigua
   * @param ***REMOVED***Array***REMOVED*** fechas - Lista de fechas en formato ISO
   * @returns ***REMOVED***Array***REMOVED*** Fechas ordenadas
   */
  export const ordenarFechasDescendente = (fechas) => ***REMOVED***
    return [...fechas].sort((a, b) => new Date(b) - new Date(a));
  ***REMOVED***;
  
  /**
   * Obtiene el nombre del día y el número del día de una fecha
   * @param ***REMOVED***string***REMOVED*** fechaStr - Fecha en formato ISO
   * @returns ***REMOVED***Object***REMOVED*** Objeto con nombreDia y numeroDia
   */
  export const obtenerDiaYNumero = (fechaStr) => ***REMOVED***
    const fecha = new Date(fechaStr);
    const nombreDia = obtenerNombreDia(fecha.getDay());
    const numeroDia = fecha.getDate();
    
    return ***REMOVED*** nombreDia, numeroDia ***REMOVED***;
  ***REMOVED***;