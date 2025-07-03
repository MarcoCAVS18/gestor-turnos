// src/hooks/useWeeklyStats.js - Versión corregida

import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

export const useWeeklyStats = (offsetSemanas = 0) => ***REMOVED***
  const ***REMOVED*** calcularPago, calcularHoras, todosLosTrabajos, turnos, turnosDelivery ***REMOVED*** = useApp();

  return useMemo(() => ***REMOVED***
    // Combinar todos los turnos (tradicionales + delivery)
    const turnosTradicionales = Array.isArray(turnos) ? turnos : [];
    const turnosDeliveryValidos = Array.isArray(turnosDelivery) ? turnosDelivery : [];
    const todosLosTurnos = [...turnosTradicionales, ...turnosDeliveryValidos];
    
    // Usar todos los trabajos combinados del contexto
    const trabajosValidos = Array.isArray(todosLosTrabajos) ? todosLosTrabajos : [];

    console.log('📈 Calculando estadísticas semanales:', ***REMOVED***
      turnosTradicionales: turnosTradicionales.length,
      turnosDelivery: turnosDeliveryValidos.length,
      totalTurnos: todosLosTurnos.length,
      trabajosTotal: trabajosValidos.length,
      offsetSemanas
    ***REMOVED***);

    // Función para obtener fechas de una semana específica
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
    const fechaInicioISO = fechaInicio.toISOString().split('T')[0];
    const fechaFinISO = fechaFin.toISOString().split('T')[0];

    // Filtrar turnos de la semana específica (incluyendo delivery)
    const turnosSemana = todosLosTurnos.filter(turno => ***REMOVED***
      return turno.fecha >= fechaInicioISO && turno.fecha <= fechaFinISO;
    ***REMOVED***);

    console.log('📈 Turnos en semana filtrada:', ***REMOVED***
      total: turnosSemana.length,
      tradicionales: turnosSemana.filter(t => t.tipo !== 'delivery').length,
      delivery: turnosSemana.filter(t => t.tipo === 'delivery').length
    ***REMOVED***);

    // Si no hay datos, retornar estructura por defecto
    if (turnosSemana.length === 0) ***REMOVED***
      return ***REMOVED***
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
        tiposDeTurno: ***REMOVED******REMOVED***,
        diasTrabajados: 0,
        promedioHorasPorDia: 0,
        promedioPorHora: 0,
        diaMasProductivo: ***REMOVED*** dia: 'Ninguno', ganancia: 0, horas: 0, turnos: 0 ***REMOVED***
      ***REMOVED***;
    ***REMOVED***

    // Calcular estadísticas
    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorDia = ***REMOVED***
      "Lunes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Martes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Miércoles": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Jueves": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Viernes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Sábado": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***,
      "Domingo": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***
    ***REMOVED***;

    const gananciaPorTrabajo = ***REMOVED******REMOVED***;
    const tiposDeTurno = ***REMOVED******REMOVED***;

    turnosSemana.forEach(turno => ***REMOVED***
      const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
      if (!trabajo) ***REMOVED***
        console.warn('⚠️ Trabajo no encontrado para turno:', turno.id, 'trabajoId:', turno.trabajoId);
        return;
      ***REMOVED***

      let horas = 0;
      let ganancia = 0;

      // Calcular horas y ganancia según el tipo de turno
      if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') ***REMOVED***
        // Para turnos de delivery
        horas = calcularHoras ? calcularHoras(turno.horaInicio, turno.horaFin) : 0;
        ganancia = turno.gananciaTotal || 0; // Usar ganancia directa
        
        console.log('🚛 Procesando turno delivery:', ***REMOVED***
          id: turno.id,
          fecha: turno.fecha,
          horas,
          ganancia
        ***REMOVED***);
      ***REMOVED*** else ***REMOVED***
        // Para turnos tradicionales
        horas = calcularHoras ? calcularHoras(turno.horaInicio, turno.horaFin) : 0;
        const resultadoPago = calcularPago ? calcularPago(turno) : ***REMOVED*** totalConDescuento: 0 ***REMOVED***;
        ganancia = resultadoPago.totalConDescuento || 0;
        
        console.log('💼 Procesando turno tradicional:', ***REMOVED***
          id: turno.id,
          fecha: turno.fecha,
          horas,
          ganancia
        ***REMOVED***);
      ***REMOVED***

      totalGanado += ganancia;
      horasTrabajadas += horas;

      // Estadísticas por día
      const fecha = new Date(turno.fecha + 'T00:00:00');
      const diaSemana = fecha.getDay();
      const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const nombreDia = nombresDias[diaSemana];

      gananciaPorDia[nombreDia].ganancia += ganancia;
      gananciaPorDia[nombreDia].horas += horas;
      gananciaPorDia[nombreDia].turnos += 1;

      // Estadísticas por trabajo
      if (!gananciaPorTrabajo[trabajo.id]) ***REMOVED***
        gananciaPorTrabajo[trabajo.id] = ***REMOVED***
          id: trabajo.id,
          nombre: trabajo.nombre,
          color: trabajo.color || trabajo.colorAvatar || '#EC4899',
          ganancia: 0,
          horas: 0,
          turnos: 0,
          tipo: trabajo.tipo || 'tradicional'
        ***REMOVED***;
      ***REMOVED***
      gananciaPorTrabajo[trabajo.id].ganancia += ganancia;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      gananciaPorTrabajo[trabajo.id].turnos += 1;

      // Estadísticas por tipo de turno
      let tipo;
      if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') ***REMOVED***
        tipo = 'delivery';
      ***REMOVED*** else ***REMOVED***
        tipo = obtenerTipoTurno(turno.horaInicio) || 'mixto';
      ***REMOVED***
      
      if (!tiposDeTurno[tipo]) ***REMOVED***
        tiposDeTurno[tipo] = ***REMOVED*** turnos: 0, horas: 0, ganancia: 0 ***REMOVED***;
      ***REMOVED***
      tiposDeTurno[tipo].turnos += 1;
      tiposDeTurno[tipo].horas += horas;
      tiposDeTurno[tipo].ganancia += ganancia;
    ***REMOVED***);

    // Calcular métricas adicionales
    const diasTrabajados = Object.values(gananciaPorDia).filter(dia => dia.turnos > 0).length;
    const promedioHorasPorDia = diasTrabajados > 0 ? horasTrabajadas / diasTrabajados : 0;
    const promedioPorHora = horasTrabajadas > 0 ? totalGanado / horasTrabajadas : 0;

    // Encontrar el día más productivo
    const diaMasProductivo = Object.entries(gananciaPorDia).reduce((max, [dia, datos]) => ***REMOVED***
      return datos.ganancia > max.ganancia ? ***REMOVED*** dia, ...datos ***REMOVED*** : max;
    ***REMOVED***, ***REMOVED*** dia: 'Ninguno', ganancia: 0, horas: 0, turnos: 0 ***REMOVED***);

    const resultado = ***REMOVED***
      fechaInicio,
      fechaFin,
      totalGanado,
      horasTrabajadas,
      totalTurnos: turnosSemana.length,
      gananciaPorDia,
      gananciaPorTrabajo: Object.values(gananciaPorTrabajo).sort((a, b) => b.ganancia - a.ganancia),
      tiposDeTurno,
      diasTrabajados,
      promedioHorasPorDia,
      promedioPorHora,
      diaMasProductivo
    ***REMOVED***;

    console.log('📈 Estadísticas semanales finales:', resultado);
    return resultado;
  ***REMOVED***, [todosLosTrabajos, turnos, turnosDelivery, offsetSemanas, calcularPago, calcularHoras]);
***REMOVED***;

// Función auxiliar para tipo de turno (mantenemos esta)
const obtenerTipoTurno = (horaInicio) => ***REMOVED***
  try ***REMOVED***
    const hora = parseInt(horaInicio.split(':')[0]);

    if (hora >= 6 && hora < 14) return 'diurno';
    if (hora >= 14 && hora < 20) return 'tarde';
    if (hora >= 20 || hora < 6) return 'noche';

    return 'mixto';
  ***REMOVED*** catch (error) ***REMOVED***
    return 'mixto';
  ***REMOVED***
***REMOVED***;