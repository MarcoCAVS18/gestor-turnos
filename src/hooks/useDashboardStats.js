// src/hooks/useDashboardStats.js

import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

export const useDashboardStats = () => ***REMOVED***
  const ***REMOVED*** trabajos, turnos, calcularPago ***REMOVED*** = useApp();

  const estadisticas = useMemo(() => ***REMOVED***
    if (turnos.length === 0) ***REMOVED***
      return ***REMOVED***
        totalGanado: 0,
        horasTrabajadas: 0,
        promedioPorHora: 0,
        trabajoMasRentable: null,
        diasTrabajados: 0,
        turnosEstaSemana: 0,
        gananciasEstaSemana: 0,
        tendenciaSemanal: 0,
        proximoTurno: null,
        trabajosFavoritos: [],
        proyeccionMensual: 0
      ***REMOVED***;
    ***REMOVED***

    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorTrabajo = ***REMOVED******REMOVED***;
    const fechasUnicas = new Set();
    
    // Calcular fecha de inicio de esta semana
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1); // Lunes
    inicioSemana.setHours(0, 0, 0, 0);
    
    const inicioSemanaAnterior = new Date(inicioSemana);
    inicioSemanaAnterior.setDate(inicioSemana.getDate() - 7);
    
    let turnosEstaSemana = 0;
    let gananciasEstaSemana = 0;
    let gananciasSemanaAnterior = 0;

    turnos.forEach(turno => ***REMOVED***
      const trabajo = trabajos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;

      const ***REMOVED*** totalConDescuento, horas ***REMOVED*** = calcularPago(turno);
      totalGanado += totalConDescuento;
      horasTrabajadas += horas;
      fechasUnicas.add(turno.fecha);

      // Estadísticas por trabajo
      if (!gananciaPorTrabajo[trabajo.id]) ***REMOVED***
        gananciaPorTrabajo[trabajo.id] = ***REMOVED***
          trabajo,
          ganancia: 0,
          horas: 0,
          turnos: 0
        ***REMOVED***;
      ***REMOVED***
      gananciaPorTrabajo[trabajo.id].ganancia += totalConDescuento;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      gananciaPorTrabajo[trabajo.id].turnos += 1;

      // Estadísticas semanales
      const fechaTurno = new Date(turno.fecha + 'T00:00:00');
      if (fechaTurno >= inicioSemana) ***REMOVED***
        turnosEstaSemana++;
        gananciasEstaSemana += totalConDescuento;
      ***REMOVED*** else if (fechaTurno >= inicioSemanaAnterior && fechaTurno < inicioSemana) ***REMOVED***
        gananciasSemanaAnterior += totalConDescuento;
      ***REMOVED***
    ***REMOVED***);

    // Encontrar trabajo más rentable
    const trabajoMasRentable = Object.values(gananciaPorTrabajo)
      .sort((a, b) => b.ganancia - a.ganancia)[0] || null;

    // Calcular tendencia semanal
    const tendenciaSemanal = gananciasSemanaAnterior > 0 
      ? ((gananciasEstaSemana - gananciasSemanaAnterior) / gananciasSemanaAnterior) * 100 
      : 0;

    // Encontrar próximo turno
    const hoyStr = hoy.toISOString().split('T')[0];
    const turnosFuturos = turnos.filter(turno => turno.fecha >= hoyStr)
      .sort((a, b) => ***REMOVED***
        if (a.fecha === b.fecha) ***REMOVED***
          return a.horaInicio.localeCompare(b.horaInicio);
        ***REMOVED***
        return a.fecha.localeCompare(b.fecha);
      ***REMOVED***);
    
    const proximoTurno = turnosFuturos[0] || null;

    // Top 3 trabajos favoritos
    const trabajosFavoritos = Object.values(gananciaPorTrabajo)
      .sort((a, b) => b.turnos - a.turnos)
      .slice(0, 3);

    // Proyección mensual
    const proyeccionMensual = gananciasEstaSemana * 4.33; // Promedio de semanas por mes

    return ***REMOVED***
      totalGanado,
      horasTrabajadas,
      promedioPorHora: horasTrabajadas > 0 ? totalGanado / horasTrabajadas : 0,
      trabajoMasRentable,
      diasTrabajados: fechasUnicas.size,
      turnosEstaSemana,
      gananciasEstaSemana,
      tendenciaSemanal,
      proximoTurno,
      trabajosFavoritos,
      proyeccionMensual
    ***REMOVED***;
  ***REMOVED***, [turnos, trabajos, calcularPago]);

  // Función para formatear fecha
  const formatearFecha = (fechaStr) => ***REMOVED***
    const fecha = new Date(fechaStr + 'T00:00:00');
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    
    const fechaLocal = fecha.toDateString();
    const hoyLocal = hoy.toDateString();
    const mañanaLocal = mañana.toDateString();
    
    if (fechaLocal === hoyLocal) return 'Hoy';
    if (fechaLocal === mañanaLocal) return 'Mañana';
    
    return fecha.toLocaleDateString('es-ES', ***REMOVED*** 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    ***REMOVED***);
  ***REMOVED***;

  return ***REMOVED***
    ...estadisticas,
    formatearFecha
  ***REMOVED***;
***REMOVED***;