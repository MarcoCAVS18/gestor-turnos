// src/hooks/useDashboardStats.js - Versión actualizada con datos semanales

import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

export const useDashboardStats = () => ***REMOVED***
  const ***REMOVED*** trabajos, trabajosDelivery, turnos, turnosDelivery, calculatePayment ***REMOVED*** = useApp();

  // Función auxiliar para calcular horas - memoizada
  const calcularHoras = useMemo(() => ***REMOVED***
    return (inicio, fin) => ***REMOVED***
      try ***REMOVED***
        const [horaIni, minIni] = inicio.split(':').map(n => parseInt(n));
        const [horaFn, minFn] = fin.split(':').map(n => parseInt(n));

        let inicioMinutos = horaIni * 60 + minIni;
        let finMinutos = horaFn * 60 + minFn;

        if (finMinutos <= inicioMinutos) ***REMOVED***
          finMinutos += 24 * 60;
        ***REMOVED***

        return (finMinutos - inicioMinutos) / 60;
      ***REMOVED*** catch (error) ***REMOVED***
        console.warn('Error calculando horas:', error);
        return 0;
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***, []);

  // Función para obtener fechas de la semana actual
  const obtenerFechasSemanaActual = useMemo(() => ***REMOVED***
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1; // Lunes como inicio
    
    const fechaInicio = new Date(hoy);
    fechaInicio.setDate(hoy.getDate() - diffInicio);
    fechaInicio.setHours(0, 0, 0, 0);
    
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaInicio.getDate() + 6);
    fechaFin.setHours(23, 59, 59, 999);
    
    return ***REMOVED*** fechaInicio, fechaFin ***REMOVED***;
  ***REMOVED***, []);

  const stats = useMemo(() => ***REMOVED***
    // Validación defensiva de datos
    const trabajosValidos = Array.isArray(trabajos) ? trabajos : [];
    const trabajosDeliveryValidos = Array.isArray(trabajosDelivery) ? trabajosDelivery : [];
    const turnosValidos = Array.isArray(turnos) ? turnos : [];
    const turnosDeliveryValidos = Array.isArray(turnosDelivery) ? turnosDelivery : [];

    const todosLosTrabajos = [...trabajosValidos, ...trabajosDeliveryValidos];
    const todosLosTurnos = [...turnosValidos, ...turnosDeliveryValidos];

    // Estado por defecto si no hay datos
    const defaultStats = ***REMOVED***
      totalGanado: 0,
      horasTrabajadas: 0,
      promedioPorHora: 0,
      turnosTotal: 0,
      trabajoMasRentable: null,
      proximoTurno: null,
      turnosEstaSemana: 0,
      gananciasEstaSemana: 0,
      tendenciaSemanal: 0,
      trabajosFavoritos: [],
      proyeccionMensual: 0,
      diasTrabajados: 0,
      // Nuevos datos para componentes
      semanaActual: ***REMOVED***
        totalGanado: 0,
        horasTrabajadas: 0,
        totalTurnos: 0,
        diasTrabajados: 0
      ***REMOVED***,
      todosLosTrabajos,
      todosLosTurnos
    ***REMOVED***;

    if (todosLosTurnos.length === 0) ***REMOVED***
      return defaultStats;
    ***REMOVED***

    try ***REMOVED***
      let totalGanado = 0;
      let horasTrabajadas = 0;
      const gananciaPorTrabajo = ***REMOVED******REMOVED***;
      const fechasUnicas = new Set();
      
      // Calcular fecha de inicio de esta semana
      const ***REMOVED*** fechaInicio, fechaFin ***REMOVED*** = obtenerFechasSemanaActual;
      
      const inicioSemanaAnterior = new Date(fechaInicio);
      inicioSemanaAnterior.setDate(fechaInicio.getDate() - 7);
      
      let turnosEstaSemana = 0;
      let gananciasEstaSemana = 0;
      let horasEstaSemana = 0;
      let gananciasSemanaAnterior = 0;
      const fechasUnicasSemana = new Set();

      todosLosTurnos.forEach(turno => ***REMOVED***
        try ***REMOVED***
          const trabajo = todosLosTrabajos?.find(t => t.id === turno.trabajoId);
          if (!trabajo) ***REMOVED***
            console.warn('⚠️ Dashboard: Trabajo no encontrado para turno:', turno.id);
            return;
          ***REMOVED***

          let ganancia = 0;
          let horas = 0;

          // Calcular ganancia según el tipo
          if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') ***REMOVED***
            ganancia = turno.gananciaTotal || 0;
            horas = calcularHoras(turno.horaInicio, turno.horaFin);
          ***REMOVED*** else ***REMOVED***
            if (typeof calculatePayment === 'function') ***REMOVED***
              const resultado = calculatePayment(turno);
              ganancia = resultado.totalWithDiscount || resultado.totalConDescuento || 0;
              horas = resultado.hours || resultado.horas || 0;
            ***REMOVED*** else ***REMOVED***
              console.warn('calculatePayment no está disponible');
              horas = calcularHoras(turno.horaInicio, turno.horaFin);
              ganancia = horas * (trabajo.tarifaBase || 0);
            ***REMOVED***
          ***REMOVED***

          totalGanado += ganancia;
          horasTrabajadas += horas;
          fechasUnicas.add(turno.fechaInicio || turno.fecha);

          // Estadísticas por trabajo
          if (!gananciaPorTrabajo[trabajo.id]) ***REMOVED***
            gananciaPorTrabajo[trabajo.id] = ***REMOVED***
              trabajo,
              ganancia: 0,
              horas: 0,
              turnos: 0
            ***REMOVED***;
          ***REMOVED***
          gananciaPorTrabajo[trabajo.id].ganancia += ganancia;
          gananciaPorTrabajo[trabajo.id].horas += horas;
          gananciaPorTrabajo[trabajo.id].turnos += 1;

          // Estadísticas semanales
          const fechaTurno = new Date((turno.fechaInicio || turno.fecha) + 'T00:00:00');
          if (fechaTurno >= fechaInicio && fechaTurno <= fechaFin) ***REMOVED***
            turnosEstaSemana++;
            gananciasEstaSemana += ganancia;
            horasEstaSemana += horas;
            fechasUnicasSemana.add(turno.fechaInicio || turno.fecha);
          ***REMOVED*** else if (fechaTurno >= inicioSemanaAnterior && fechaTurno < fechaInicio) ***REMOVED***
            gananciasSemanaAnterior += ganancia;
          ***REMOVED***
        ***REMOVED*** catch (error) ***REMOVED***
          console.error('Error procesando turno:', turno.id, error);
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
      const hoyStr = new Date().toISOString().split('T')[0];
      const turnosFuturos = todosLosTurnos.filter(turno => ***REMOVED***
        const fechaTurno = turno.fechaInicio || turno.fecha;
        return fechaTurno >= hoyStr;
      ***REMOVED***).sort((a, b) => ***REMOVED***
        const fechaA = a.fechaInicio || a.fecha;
        const fechaB = b.fechaInicio || b.fecha;
        if (fechaA === fechaB) ***REMOVED***
          return a.horaInicio.localeCompare(b.horaInicio);
        ***REMOVED***
        return fechaA.localeCompare(fechaB);
      ***REMOVED***);
      
      const proximoTurno = turnosFuturos[0] || null;

      // Top 3 trabajos favoritos
      const trabajosFavoritos = Object.values(gananciaPorTrabajo)
        .sort((a, b) => b.turnos - a.turnos)
        .slice(0, 3);

      // Proyección mensual
      const proyeccionMensual = gananciasEstaSemana * 4.33;

      const resultado = ***REMOVED***
        totalGanado: Number(totalGanado) || 0,
        horasTrabajadas: Number(horasTrabajadas) || 0,
        promedioPorHora: horasTrabajadas > 0 ? totalGanado / horasTrabajadas : 0,
        turnosTotal: todosLosTurnos.length,
        trabajoMasRentable,
        proximoTurno,
        turnosEstaSemana,
        gananciasEstaSemana: Number(gananciasEstaSemana) || 0,
        tendenciaSemanal: Number(tendenciaSemanal) || 0,
        trabajosFavoritos,
        proyeccionMensual: Number(proyeccionMensual) || 0,
        diasTrabajados: fechasUnicas.size,
        // Nuevos datos específicos para los componentes
        semanaActual: ***REMOVED***
          totalGanado: Number(gananciasEstaSemana) || 0,
          horasTrabajadas: Number(horasEstaSemana) || 0,
          totalTurnos: turnosEstaSemana,
          diasTrabajados: fechasUnicasSemana.size
        ***REMOVED***,
        todosLosTrabajos,
        todosLosTurnos
      ***REMOVED***;

      return resultado;
    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error crítico calculando estadísticas del dashboard:', error);
      return defaultStats;
    ***REMOVED***
  ***REMOVED***, [trabajos, trabajosDelivery, turnos, turnosDelivery, calculatePayment, calcularHoras, obtenerFechasSemanaActual]);

  // Función para formatear fecha
  const formatearFecha = useMemo(() => ***REMOVED***
    return (fechaStr) => ***REMOVED***
      try ***REMOVED***
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
      ***REMOVED*** catch (error) ***REMOVED***
        console.warn('Error formateando fecha:', fechaStr, error);
        return fechaStr;
      ***REMOVED***
    ***REMOVED***;
  ***REMOVED***, []);

  return ***REMOVED***
    ...stats,
    formatearFecha
  ***REMOVED***;
***REMOVED***;