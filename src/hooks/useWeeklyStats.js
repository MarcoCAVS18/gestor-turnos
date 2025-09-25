// src/hooks/useWeeklyStats.js - VERSION CORREGIDA para tipos de turno

import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';
import ***REMOVED*** determinarTipoTurno ***REMOVED*** from '../utils/shiftDetailsUtils';

export const useWeeklyStats = (offsetSemanas = 0) => ***REMOVED***
  const ***REMOVED*** calculatePayment, todosLosTrabajos, turnos, turnosDelivery, shiftRanges ***REMOVED*** = useApp();

  return useMemo(() => ***REMOVED***
    const turnosTradicionales = Array.isArray(turnos) ? turnos : [];
    const turnosDeliveryValidos = Array.isArray(turnosDelivery) ? turnosDelivery : [];
    const todosLosTurnos = [...turnosTradicionales, ...turnosDeliveryValidos];
    const trabajosValidos = Array.isArray(todosLosTrabajos) ? todosLosTrabajos : [];

    const obtenerFechasSemana = (offset) => ***REMOVED***
      const hoy = new Date();
      const diaSemana = hoy.getDay();
      const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1; 
      const fechaInicio = new Date(hoy);
      fechaInicio.setDate(hoy.getDate() - diffInicio + (offset * 7));
      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + 6);
      fechaFin.setHours(23, 59, 59, 999);
      return ***REMOVED*** fechaInicio, fechaFin ***REMOVED***;
    ***REMOVED***;

    const ***REMOVED*** fechaInicio, fechaFin ***REMOVED*** = obtenerFechasSemana(offsetSemanas);

    // Filtrar turnos de la semana
    const turnosSemana = todosLosTurnos.filter(turno => ***REMOVED***
      const fechaClave = turno.fechaInicio || turno.fecha;
      if (!fechaClave) return false;
      const fechaTurno = new Date(fechaClave + 'T00:00:00');
      return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
    ***REMOVED***);

    const initialState = ***REMOVED***
      fechaInicio,
      fechaFin,
      totalGanado: 0,
      horasTrabajadas: 0,
      totalTurnos: 0,
      gananciaPorDia: ***REMOVED***
        "Lunes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Martes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Miércoles": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Jueves": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Viernes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Sábado": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Domingo": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***
      ***REMOVED***,
      gananciaPorTrabajo: [],
      tiposDeTurno: ***REMOVED******REMOVED***, // Inicializado como objeto vacío, no undefined
      diasTrabajados: 0,
      promedioHorasPorDia: 0,
      promedioPorHora: 0,
      diaMasProductivo: ***REMOVED*** dia: 'Ninguno', ganancia: 0 ***REMOVED***
    ***REMOVED***;

    if (turnosSemana.length === 0) return initialState;

    // Inicializar acumuladores
    const acc = ***REMOVED***
      totalGanado: 0,
      horasTrabajadas: 0,
      gananciaPorDia: ***REMOVED***
        "Lunes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Martes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Miércoles": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Jueves": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Viernes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Sábado": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
        "Domingo": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***
      ***REMOVED***,
      gananciaPorTrabajo: ***REMOVED******REMOVED***,
      tiposDeTurno: ***REMOVED******REMOVED***
    ***REMOVED***;

    turnosSemana.forEach(turno => ***REMOVED***
      try ***REMOVED***
        const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
        if (!trabajo) ***REMOVED***
          console.warn('Trabajo no encontrado para turno:', turno.id);
          return;
        ***REMOVED***

        // Calcular horas y ganancia usando calculatePayment
        const resultado = calculatePayment(turno);
        const ganancia = resultado.totalWithDiscount || 0;
        const horas = resultado.hours || 0;

        acc.totalGanado += ganancia;
        acc.horasTrabajadas += horas;

        // Determinar día de la semana
        const fechaTurno = new Date((turno.fechaInicio || turno.fecha) + 'T00:00:00');
        const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const nombreDia = nombresDias[fechaTurno.getDay()];
        
        acc.gananciaPorDia[nombreDia].ganancia += ganancia;
        acc.gananciaPorDia[nombreDia].horas += horas;
        acc.gananciaPorDia[nombreDia].turnos += 1;

        // Estadísticas por trabajo
        if (!acc.gananciaPorTrabajo[trabajo.id]) ***REMOVED***
          acc.gananciaPorTrabajo[trabajo.id] = ***REMOVED***
            id: trabajo.id,
            nombre: trabajo.nombre,
            color: trabajo.color || trabajo.colorAvatar || '#EC4899',
            ganancia: 0,
            horas: 0,
            turnos: 0,
            tipo: trabajo.tipo || 'tradicional'
          ***REMOVED***;
        ***REMOVED***
        acc.gananciaPorTrabajo[trabajo.id].ganancia += ganancia;
        acc.gananciaPorTrabajo[trabajo.id].horas += horas;
        acc.gananciaPorTrabajo[trabajo.id].turnos += 1;

        // DETERMINAR TIPO DE TURNO CORRECTAMENTE
        let tipoTurno = 'mixto'; // Por defecto
        
        // Para turnos de delivery
        if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') ***REMOVED***
          tipoTurno = 'delivery';
        ***REMOVED*** 
        // Para turnos de fin de semana
        else if (fechaTurno.getDay() === 6) ***REMOVED*** // Sábado
          tipoTurno = 'sabado';
        ***REMOVED*** 
        else if (fechaTurno.getDay() === 0) ***REMOVED*** // Domingo
          tipoTurno = 'domingo';
        ***REMOVED***
        // Para turnos tradicionales de días de semana
        else if (shiftRanges) ***REMOVED***
          tipoTurno = determinarTipoTurno(turno, shiftRanges);
        ***REMOVED***

        // Agregar a estadísticas por tipo
        if (!acc.tiposDeTurno[tipoTurno]) ***REMOVED***
          acc.tiposDeTurno[tipoTurno] = ***REMOVED*** 
            turnos: 0, 
            horas: 0, 
            ganancia: 0 
          ***REMOVED***;
        ***REMOVED***
        acc.tiposDeTurno[tipoTurno].turnos += 1;
        acc.tiposDeTurno[tipoTurno].horas += horas;
        acc.tiposDeTurno[tipoTurno].ganancia += ganancia;

        console.log(`Turno $***REMOVED***turno.id***REMOVED***: $***REMOVED***turno.horaInicio***REMOVED***-$***REMOVED***turno.horaFin***REMOVED*** en $***REMOVED***nombreDia***REMOVED*** → Tipo: $***REMOVED***tipoTurno***REMOVED***`);

      ***REMOVED*** catch (error) ***REMOVED***
        console.error('Error procesando turno:', turno.id, error);
      ***REMOVED***
    ***REMOVED***);

    console.log('Tipos de turno calculados:', acc.tiposDeTurno);

    // Calcular estadísticas finales
    const diasTrabajados = Object.values(acc.gananciaPorDia).filter(dia => dia.turnos > 0).length;
    const promedioHorasPorDia = diasTrabajados > 0 ? acc.horasTrabajadas / diasTrabajados : 0;
    const promedioPorHora = acc.horasTrabajadas > 0 ? acc.totalGanado / acc.horasTrabajadas : 0;
    
    const diaMasProductivo = Object.entries(acc.gananciaPorDia).reduce(
      (max, [dia, datos]) => (datos.ganancia > max.ganancia ? ***REMOVED*** dia, ...datos ***REMOVED*** : max),
      ***REMOVED*** dia: 'Ninguno', ganancia: 0 ***REMOVED***
    );

    return ***REMOVED***
      fechaInicio,
      fechaFin,
      totalGanado: acc.totalGanado,
      horasTrabajadas: acc.horasTrabajadas,
      totalTurnos: turnosSemana.length,
      gananciaPorDia: acc.gananciaPorDia,
      gananciaPorTrabajo: Object.values(acc.gananciaPorTrabajo).sort((a, b) => b.ganancia - a.ganancia),
      tiposDeTurno: acc.tiposDeTurno, 
      diasTrabajados,
      promedioHorasPorDia,
      promedioPorHora,
      diaMasProductivo
    ***REMOVED***;
  ***REMOVED***, [todosLosTrabajos, turnos, turnosDelivery, offsetSemanas, calculatePayment, shiftRanges]);
***REMOVED***;