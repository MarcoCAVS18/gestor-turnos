// src/hooks/useDashboardStats.js
import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** formatRelativeDate ***REMOVED*** from '../utils/time';
import ***REMOVED*** calculateShiftHours ***REMOVED*** from '../utils/time/timeCalculations'; // Usamos tu utilidad centralizada

export const useDashboardStats = () => ***REMOVED***
  const ***REMOVED*** trabajos, trabajosDelivery, turnos, turnosDelivery, calculatePayment ***REMOVED*** = useApp();

  // Función para obtener fechas de la semana actual (Lunes a Domingo)
  const rangosTemporales = useMemo(() => ***REMOVED***
    const hoy = new Date();
    
    // --- SEMANA ---
    const diaSemana = hoy.getDay();
    const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1; // Lunes(1) -> 0, Domingo(0) -> 6
    
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - diffInicio);
    inicioSemana.setHours(0, 0, 0, 0);
    
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);
    finSemana.setHours(23, 59, 59, 999);

    // --- MES ---
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999);

    return ***REMOVED*** inicioSemana, finSemana, inicioMes, finMes ***REMOVED***;
  ***REMOVED***, []);

  const stats = useMemo(() => ***REMOVED***
    // Validación defensiva
    const turnosValidos = Array.isArray(turnos) ? turnos : [];
    const turnosDeliveryValidos = Array.isArray(turnosDelivery) ? turnosDelivery : [];
    const todosLosTrabajos = [...(trabajos || []), ...(trabajosDelivery || [])];
    const todosLosTurnos = [...turnosValidos, ...turnosDeliveryValidos];

    // Estructura inicial
    const defaultStats = ***REMOVED***
      totalGanado: 0,
      horasTrabajadas: 0,
      promedioPorHora: 0,
      turnosTotal: 0,
      trabajoMasRentable: null,
      proximoTurno: null,
      tendenciaSemanal: 0,
      trabajosFavoritos: [],
      proyeccionMensual: 0,
      // Objetos detallados para los componentes
      semanaActual: ***REMOVED***
        totalGanado: 0,
        horasTrabajadas: 0,
        totalTurnos: 0,
        diasTrabajados: 0
      ***REMOVED***,
      mesActual: ***REMOVED***
        totalGanado: 0,
        horasTrabajadas: 0,
        totalTurnos: 0,
        diasTrabajados: 0
      ***REMOVED***,
      todosLosTrabajos,
      todosLosTurnos
    ***REMOVED***;

    if (todosLosTurnos.length === 0) return defaultStats;

    try ***REMOVED***
      let totalGanado = 0;
      let totalHoras = 0;
      const gananciaPorTrabajo = ***REMOVED******REMOVED***;
      
      // Contadores temporales
      const contadoresSemana = ***REMOVED*** ganancia: 0, horas: 0, turnos: 0, fechas: new Set() ***REMOVED***;
      const contadoresMes = ***REMOVED*** ganancia: 0, horas: 0, turnos: 0, fechas: new Set() ***REMOVED***;
      
      const ***REMOVED*** inicioSemana, finSemana, inicioMes, finMes ***REMOVED*** = rangosTemporales;

      todosLosTurnos.forEach(turno => ***REMOVED***
        const trabajo = todosLosTrabajos.find(t => t.id === turno.trabajoId);
        if (!trabajo) return;

        // 1. Calcular Ganancia
        let ganancia = 0;
        if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') ***REMOVED***
          ganancia = parseFloat(turno.gananciaTotal || turno.totalGanado || 0);
        ***REMOVED*** else if (typeof calculatePayment === 'function') ***REMOVED***
          const resultado = calculatePayment(turno);
          ganancia = resultado.totalWithDiscount || resultado.totalConDescuento || 0;
        ***REMOVED***

        // 2. Calcular Horas (Usando tu utilidad)
        const horas = calculateShiftHours(turno.horaInicio, turno.horaFin);

        // 3. Acumulados Globales
        totalGanado += ganancia;
        totalHoras += horas;

        // 4. Estadísticas por Trabajo (para favoritos/rentable)
        if (!gananciaPorTrabajo[trabajo.id]) ***REMOVED***
          gananciaPorTrabajo[trabajo.id] = ***REMOVED*** trabajo, ganancia: 0, horas: 0, turnos: 0 ***REMOVED***;
        ***REMOVED***
        gananciaPorTrabajo[trabajo.id].ganancia += ganancia;
        gananciaPorTrabajo[trabajo.id].horas += horas;
        gananciaPorTrabajo[trabajo.id].turnos += 1;

        // 5. Análisis Temporal (Semana vs Mes)
        // Aseguramos que la fecha se interprete correctamente (agregando T00:00:00 para evitar offset de zona horaria)
        const fechaTurnoStr = turno.fechaInicio || turno.fecha;
        const fechaTurno = new Date(`$***REMOVED***fechaTurnoStr***REMOVED***T00:00:00`);

        // --- Semana Actual ---
        if (fechaTurno >= inicioSemana && fechaTurno <= finSemana) ***REMOVED***
          contadoresSemana.turnos++;
          contadoresSemana.ganancia += ganancia;
          contadoresSemana.horas += horas;
          contadoresSemana.fechas.add(fechaTurnoStr);
        ***REMOVED***

        // --- Mes Actual ---
        if (fechaTurno >= inicioMes && fechaTurno <= finMes) ***REMOVED***
          contadoresMes.turnos++;
          contadoresMes.ganancia += ganancia;
          contadoresMes.horas += horas;
          contadoresMes.fechas.add(fechaTurnoStr);
        ***REMOVED***
      ***REMOVED***);

      // Cálculos derivados
      const trabajoMasRentable = Object.values(gananciaPorTrabajo)
        .sort((a, b) => b.ganancia - a.ganancia)[0] || null;

      const trabajosFavoritos = Object.values(gananciaPorTrabajo)
        .sort((a, b) => b.turnos - a.turnos)
        .slice(0, 3);

      const proximoTurno = todosLosTurnos
        .filter(t => (t.fechaInicio || t.fecha) >= new Date().toISOString().split('T')[0])
        .sort((a, b) => (a.fechaInicio || a.fecha).localeCompare(b.fechaInicio || b.fecha))[0] || null;

      // Proyección simple basada en lo que va del mes (promedio diario * días totales mes)
      const diasEnMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const diaActual = new Date().getDate();
      const proyeccionMensual = diaActual > 0 
        ? (contadoresMes.ganancia / diaActual) * diasEnMes 
        : 0;

      return ***REMOVED***
        totalGanado,
        horasTrabajadas: totalHoras,
        promedioPorHora: totalHoras > 0 ? totalGanado / totalHoras : 0,
        turnosTotal: todosLosTurnos.length,
        trabajoMasRentable,
        proximoTurno,
        trabajosFavoritos,
        proyeccionMensual,
        // Datos Listos para Componentes
        semanaActual: ***REMOVED***
          totalGanado: contadoresSemana.ganancia,
          horasTrabajadas: contadoresSemana.horas,
          totalTurnos: contadoresSemana.turnos,
          diasTrabajados: contadoresSemana.fechas.size
        ***REMOVED***,
        mesActual: ***REMOVED***
          totalGanado: contadoresMes.ganancia,
          horasTrabajadas: contadoresMes.horas,
          totalTurnos: contadoresMes.turnos,
          diasTrabajados: contadoresMes.fechas.size
        ***REMOVED***,
        todosLosTrabajos,
        todosLosTurnos
      ***REMOVED***;

    ***REMOVED*** catch (error) ***REMOVED***
      console.error('Error calculando estadísticas:', error);
      return defaultStats;
    ***REMOVED***
  ***REMOVED***, [trabajos, trabajosDelivery, turnos, turnosDelivery, calculatePayment, rangosTemporales]);

  const formatearFecha = useMemo(() => formatRelativeDate, []);

  return ***REMOVED*** ...stats, formatearFecha ***REMOVED***;
***REMOVED***;