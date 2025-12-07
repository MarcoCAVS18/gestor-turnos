// src/services/calculationService.js
import { determinarTipoTurno } from '../utils/shiftDetailsUtils';
import { createSafeDate } from '../utils/time';
import { getMonthRange } from '../utils/time';

/**
 * Calcula las horas trabajadas entre una hora de inicio y fin.
 * @param {string} start - Hora de inicio (e.g., "08:00")
 * @param {string} end - Hora de fin (e.g., "16:00")
 * @returns {number} - Total de horas
 */
export const calculateHours = (start, end) => {
  if (!start || !end) return 0;
  const [startHour, startMin] = start.split(':').map(n => parseInt(n));
  const [endHour, endMin] = end.split(':').map(n => parseInt(n));

  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  // Si el turno cruza la medianoche
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  return (endMinutes - startMinutes) / 60;
};

/**
 * Calcula el pago de un turno, considerando rangos horarios, tarifas y descansos.
 * @param {object} shift - El objeto del turno.
 * @param {Array} allJobs - Array de todos los trabajos (normales y delivery).
 * @param {object} shiftRanges - Configuración de los rangos horarios.
 * @param {number} defaultDiscount - Descuento por defecto.
 * @param {boolean} smokoEnabled - Si el descanso (smoko) está habilitado.
 * @param {number} smokoMinutes - Duración del descanso en minutos.
 * @returns {object} - Objeto con el detalle del pago.
 */
export const calculatePayment = (shift, allJobs, shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes) => {
  const job = allJobs.find(j => j.id === shift.trabajoId);

  if (!job) return {
    total: 0,
    totalWithDiscount: 0,
    hours: 0,
    tips: 0,
    isDelivery: false,
    breakdown: { diurno: 0, tarde: 0, noche: 0, sabado: 0, domingo: 0 },
    appliedRates: {}
  };

  // Si es un turno de delivery, devuelve las ganancias totales directamente
  if (shift.type === 'delivery' || shift.tipo === 'delivery') {
    const hours = calculateHours(shift.horaInicio, shift.horaFin);
    return {
      total: shift.gananciaTotal || 0,
      totalWithDiscount: shift.gananciaTotal || 0,
      hours,
      tips: shift.propinas || 0,
      isDelivery: true,
      breakdown: { delivery: shift.gananciaTotal || 0 },
      appliedRates: { 'delivery': shift.gananciaPorHora || (shift.gananciaTotal / hours) || 0 }
    };
  }

  const { horaInicio, horaFin, fechaInicio, cruzaMedianoche = false, tuvoDescanso = true } = shift;

  if (!horaInicio || !horaFin || !fechaInicio) {
    return { total: 0, totalWithDiscount: 0, hours: 0, tips: 0, isDelivery: false, appliedRates: {} };
  }

  const [startHour, startMin] = horaInicio.split(':').map(n => parseInt(n));
  const [endHour, endMin] = horaFin.split(':').map(n => parseInt(n));

  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  if (cruzaMedianoche) {
    endMinutes += 24 * 60;
  } else if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  const totalMinutes = endMinutes - startMinutes;
  let workingMinutes = totalMinutes;
  if (smokoEnabled && tuvoDescanso && totalMinutes > smokoMinutes) {
    workingMinutes = totalMinutes - smokoMinutes;
  }

  const hours = workingMinutes / 60;

  const date = createSafeDate(fechaInicio);
  const dayOfWeek = date.getDay();

  let total = 0;
  let breakdown = { diurno: 0, tarde: 0, noche: 0, sabado: 0, domingo: 0 };
  let appliedRates = {};

  if (dayOfWeek === 0) { // Domingo
    total = hours * job.tarifas.domingo;
    breakdown.domingo = total;
    appliedRates['domingo'] = job.tarifas.domingo;
  } else if (dayOfWeek === 6) { // Sábado
    total = hours * job.tarifas.sabado;
    breakdown.sabado = total;
    appliedRates['sabado'] = job.tarifas.sabado;
  } else {
    const ranges = shiftRanges || {
      dayStart: 6, dayEnd: 14,
      afternoonStart: 14, afternoonEnd: 20,
      nightStart: 20
    };

    const dayStartMin = ranges.dayStart * 60;
    const dayEndMin = ranges.dayEnd * 60;
    const afternoonStartMin = ranges.afternoonStart * 60;
    const afternoonEndMin = ranges.afternoonEnd * 60;

    const minutesToProcess = Math.min(workingMinutes, totalMinutes);

    for (let minute = 0; minute < minutesToProcess; minute++) {
      const actualMinute = startMinutes + (minute * totalMinutes / workingMinutes);
      const currentMinuteInDay = Math.floor(actualMinute) % (24 * 60);
      let rate = job.tarifaBase;
      let rateType = 'noche';

      if (currentMinuteInDay >= dayStartMin && currentMinuteInDay < dayEndMin) {
        rate = job.tarifas.diurno;
        rateType = 'diurno';
      } else if (currentMinuteInDay >= afternoonStartMin && currentMinuteInDay < afternoonEndMin) {
        rate = job.tarifas.tarde;
        rateType = 'tarde';
      } else {
        rate = job.tarifas.noche;
        rateType = 'noche';
      }
      
      if(rate > 0) appliedRates[rateType] = rate;

      const ratePerMinute = rate / 60;
      total += ratePerMinute;
      breakdown[rateType] += ratePerMinute;
    }
  }

  const totalWithDiscount = total * (1 - defaultDiscount / 100);

  return {
    total,
    totalWithDiscount,
    hours,
    tips: 0,
    isDelivery: false,
    breakdown,
    appliedRates,
    isNightShift: cruzaMedianoche || false,
    smokoApplied: smokoEnabled && tuvoDescanso && totalMinutes > smokoMinutes,
    smokoMinutes: smokoEnabled && tuvoDescanso ? smokoMinutes : 0,
    totalMinutesWorked: workingMinutes,
    totalMinutesScheduled: totalMinutes
  };
};

/**
 * Calcula el total de horas y ganancias para un conjunto de turnos diarios.
 * @param {Array} dailyShifts - Array de turnos para un día.
 * @param {Function} calculatePaymentFn - La función para calcular el pago de un turno.
 * @returns {object} - Objeto con `hours` y `total`.
 */
export const calculateDailyTotal = (dailyShifts, calculatePaymentFn) => {
  return dailyShifts.reduce((total, shift) => {
    if (shift.type === 'delivery') {
      const netEarnings = (shift.gananciaTotal || 0) - (shift.gastoCombustible || 0);
      return {
        hours: total.hours, // Las horas de delivery se calculan por separado si es necesario
        total: total.total + netEarnings
      };
    } else {
      const result = calculatePaymentFn(shift);
      return {
        hours: total.hours + result.hours,
        total: total.total + result.total
      };
    }
  }, { hours: 0, total: 0 });
};

/**
 * Calcula las estadísticas mensuales basadas en los turnos.
 * @param {number} year - Año.
 * @param {number} month - Mes (0-11).
 * @param {Array} turnos - Array de turnos tradicionales.
 * @param {Array} turnosDelivery - Array de turnos de delivery.
 * @param {Function} calculatePaymentFn - La función para calcular el pago.
 * @returns {object} - Estadísticas mensuales.
 */
export const calculateMonthlyStats = (year, month, turnos, turnosDelivery, calculatePaymentFn) => {
  const { start, end } = getMonthRange(year, month);
  const allShifts = [...turnos, ...turnosDelivery];

  const monthlyShifts = allShifts.filter(shift => {
    const shiftDate = shift.fechaInicio || shift.fecha;
    return shiftDate >= start && shiftDate <= end;
  });

  let totalHours = 0;
  let totalEarnings = 0;
  let totalTips = 0;
  let totalDeliveries = 0;
  let totalKilometers = 0;
  let totalFuelCost = 0;

  monthlyShifts.forEach(shift => {
    if (shift.type === 'delivery' || shift.tipo === 'delivery') {
      totalEarnings += shift.gananciaTotal || 0;
      totalTips += shift.propinas || 0;
      totalDeliveries += shift.numeroPedidos || 0;
      totalKilometers += shift.kilometros || 0;
      totalFuelCost += shift.gastoCombustible || 0;
      totalHours += calculateHours(shift.horaInicio, shift.horaFin);
    } else {
      const payment = calculatePaymentFn(shift);
      totalHours += payment.hours;
      totalEarnings += payment.total;
    }
  });

  return {
    totalHours,
    totalEarnings,
    totalTips,
    totalDeliveries,
    totalKilometers,
    totalFuelCost,
    netEarnings: totalEarnings - totalFuelCost,
    shiftsCount: monthlyShifts.length,
    averageHoursPerShift: monthlyShifts.length > 0 ? totalHours / monthlyShifts.length : 0,
    averageEarningsPerShift: monthlyShifts.length > 0 ? totalEarnings / monthlyShifts.length : 0,
    averageEarningsPerHour: totalHours > 0 ? totalEarnings / totalHours : 0
  };
};

/**
 * Formats a given number of minutes into a string like "1H 30M".
 * @param {number} minutos - The total minutes to format.
 * @returns {string} - The formatted time string.
 */
export const formatMinutesToHoursAndMinutes = (minutos) => {
  if (!minutos || minutos === 0) return '0 MIN';
  
  if (minutos < 60) {
    return `${minutos} MIN`;
  }
  
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  
  if (minutosRestantes === 0) {
    return `${horas}H`;
  }
  
  return `${horas}H ${minutosRestantes}M`;
};

/**
 * Calculates a comprehensive set of weekly statistics based on shifts and other data.
 */
export const calculateWeeklyStats = ({
  turnos,
  turnosDelivery,
  todosLosTrabajos,
  calculatePayment,
  shiftRanges,
  offsetSemanas = 0,
}) => {
  const turnosTradicionales = Array.isArray(turnos) ? turnos : [];
  const turnosDeliveryValidos = Array.isArray(turnosDelivery) ? turnosDelivery : [];
  const todosLosTurnos = [...turnosTradicionales, ...turnosDeliveryValidos];
  const trabajosValidos = Array.isArray(todosLosTrabajos) ? todosLosTrabajos : [];

  const obtenerFechasSemana = (offset) => {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1; 
    const fechaInicio = new Date(hoy);
    fechaInicio.setDate(hoy.getDate() - diffInicio + (offset * 7));
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaInicio.getDate() + 6);
    fechaFin.setHours(23, 59, 59, 999);
    return { fechaInicio, fechaFin };
  };

  const { fechaInicio, fechaFin } = obtenerFechasSemana(offsetSemanas);

  const turnosSemana = todosLosTurnos.filter(turno => {
    const fechaClave = turno.fechaInicio || turno.fecha;
    if (!fechaClave) return false;
    const fechaTurno = createSafeDate(fechaClave);
    return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
  });

  const initialState = {
    fechaInicio,
    fechaFin,
    totalGanado: 0,
    horasTrabajadas: 0,
    totalTurnos: 0,
    gananciaPorDia: { "Lunes": {}, "Martes": {}, "Miércoles": {}, "Jueves": {}, "Viernes": {}, "Sábado": {}, "Domingo": {} },
    gananciaPorTrabajo: [],
    tiposDeTurno: {},
    diasTrabajados: 0,
    promedioHorasPorDia: 0,
    promedioPorHora: 0,
    diaMasProductivo: { dia: 'Ninguno', ganancia: 0 }
  };

  if (turnosSemana.length === 0) return initialState;

  const acc = {
    totalGanado: 0,
    horasTrabajadas: 0,
    gananciaPorDia: { "Lunes": { ganancia: 0, horas: 0, turnos: 0 }, "Martes": { ganancia: 0, horas: 0, turnos: 0 }, "Miércoles": { ganancia: 0, horas: 0, turnos: 0 }, "Jueves": { ganancia: 0, horas: 0, turnos: 0 }, "Viernes": { ganancia: 0, horas: 0, turnos: 0 }, "Sábado": { ganancia: 0, horas: 0, turnos: 0 }, "Domingo": { ganancia: 0, horas: 0, turnos: 0 } },
    gananciaPorTrabajo: {},
    tiposDeTurno: {}
  };

  turnosSemana.forEach(turno => {
    const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return;

    const resultado = calculatePayment(turno);
    const ganancia = resultado.totalWithDiscount || 0;
    const horas = resultado.hours || 0;

    acc.totalGanado += ganancia;
    acc.horasTrabajadas += horas;

    const fechaTurno = createSafeDate(turno.fechaInicio || turno.fecha);
    const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const nombreDia = nombresDias[fechaTurno.getDay()];
    
    acc.gananciaPorDia[nombreDia].ganancia += ganancia;
    acc.gananciaPorDia[nombreDia].horas += horas;
    acc.gananciaPorDia[nombreDia].turnos += 1;

    if (!acc.gananciaPorTrabajo[trabajo.id]) {
      acc.gananciaPorTrabajo[trabajo.id] = { id: trabajo.id, nombre: trabajo.nombre, color: trabajo.color || trabajo.colorAvatar || '#EC4899', ganancia: 0, horas: 0, turnos: 0, tipo: trabajo.tipo || 'tradicional' };
    }
    acc.gananciaPorTrabajo[trabajo.id].ganancia += ganancia;
    acc.gananciaPorTrabajo[trabajo.id].horas += horas;
    acc.gananciaPorTrabajo[trabajo.id].turnos += 1;

    let tipoTurno = 'mixto';
    if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') tipoTurno = 'delivery';
    else if (fechaTurno.getDay() === 6) tipoTurno = 'sabado';
    else if (fechaTurno.getDay() === 0) tipoTurno = 'domingo';
    else if (shiftRanges) tipoTurno = determinarTipoTurno(turno, shiftRanges);

    if (!acc.tiposDeTurno[tipoTurno]) {
      acc.tiposDeTurno[tipoTurno] = { turnos: 0, horas: 0, ganancia: 0 };
    }
    acc.tiposDeTurno[tipoTurno].turnos += 1;
    acc.tiposDeTurno[tipoTurno].horas += horas;
    acc.tiposDeTurno[tipoTurno].ganancia += ganancia;
  });

  const diasTrabajados = Object.values(acc.gananciaPorDia).filter(dia => dia.turnos > 0).length;
  const promedioHorasPorDia = diasTrabajados > 0 ? acc.horasTrabajadas / diasTrabajados : 0;
  const promedioPorHora = acc.horasTrabajadas > 0 ? acc.totalGanado / acc.horasTrabajadas : 0;
  
  const diaMasProductivo = Object.entries(acc.gananciaPorDia).reduce(
    (max, [dia, datos]) => (datos.ganancia > max.ganancia ? { dia, ...datos } : max),
    { dia: 'Ninguno', ganancia: 0 }
  );

  return {
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
  };
}

export const calculateDeliveryStats = ({ trabajosDelivery, turnosDelivery, periodo = 'mes' }) => {
    const trabajosDeliveryValidos = Array.isArray(trabajosDelivery) ? trabajosDelivery : [];
    const turnosDeliveryValidos = Array.isArray(turnosDelivery) ? turnosDelivery : [];
    
    if (turnosDeliveryValidos.length === 0) {
      return {
        totalGanado: 0,
        totalPropinas: 0,
        totalPedidos: 0,
        totalKilometros: 0,
        totalGastos: 0,
        gananciaLiquida: 0,
        promedioPorPedido: 0,
        promedioPorKilometro: 0,
        promedioPorHora: 0,
        promedioPropinasPorPedido: 0,
        mejorDia: null,
        mejorTurno: null,
        turnosPorPlataforma: {},
        estadisticasPorVehiculo: {},
        estadisticasPorDia: {},
        tendencia: 0,
        diasTrabajados: 0,
        turnosRealizados: 0,
        totalHoras: 0,
        eficienciaCombustible: 0,
        costoPorKilometro: 0
      };
    }
    
    const hoy = new Date();
    let fechaInicio;
    
    switch (periodo) {
      case 'semana':
        fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() - 7);
        break;
      case 'mes':
        fechaInicio = new Date(hoy);
        fechaInicio.setMonth(hoy.getMonth() - 1);
        break;
      case 'año':
        fechaInicio = new Date(hoy);
        fechaInicio.setFullYear(hoy.getFullYear() - 1);
        break;
      default:
        fechaInicio = new Date(0); 
    }
    
    const turnosPeriodo = turnosDeliveryValidos.filter(turno => {
      const fechaTurno = new Date(turno.fecha);
      return fechaTurno >= fechaInicio;
    });
        
    let totalGanado = 0;
    let totalPropinas = 0;
    let totalPedidos = 0;
    let totalKilometros = 0;
    let totalGastos = 0;
    let totalHoras = 0;
    
    const estadisticasPorDia = {};
    const turnosPorPlataforma = {};
    const estadisticasPorVehiculo = {};
    
    turnosPeriodo.forEach(turno => {
      const trabajo = trabajosDeliveryValidos.find(t => t.id === turno.trabajoId);
      if (!trabajo) {
        console.warn('⚠️ Trabajo delivery no encontrado para turno:', turno.id);
        return;
      }
      
      const gananciaBase = turno.gananciaTotal || 0;
      const propinas = turno.propinas || 0;
      const pedidos = turno.numeroPedidos || 0;
      const kilometros = turno.kilometros || 0;
      const gastos = turno.gastoCombustible || 0;
      
      totalGanado += gananciaBase;
      totalPropinas += propinas;
      totalPedidos += pedidos;
      totalKilometros += kilometros;
      totalGastos += gastos;
      
      const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
      const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
      let horas = (horaFin + minFin/60) - (horaIni + minIni/60);
      if (horas < 0) horas += 24;
      totalHoras += horas;
      
      if (!estadisticasPorDia[turno.fecha]) {
        estadisticasPorDia[turno.fecha] = {
          ganancia: 0,
          propinas: 0,
          pedidos: 0,
          kilometros: 0,
          gastos: 0,
          horas: 0,
          turnos: []
        };
      }
      
      estadisticasPorDia[turno.fecha].ganancia += gananciaBase;
      estadisticasPorDia[turno.fecha].propinas += propinas;
      estadisticasPorDia[turno.fecha].pedidos += pedidos;
      estadisticasPorDia[turno.fecha].kilometros += kilometros;
      estadisticasPorDia[turno.fecha].gastos += gastos;
      estadisticasPorDia[turno.fecha].horas += horas;
      estadisticasPorDia[turno.fecha].turnos.push({
        ...turno,
        trabajo,
        horas
      });
      
      const plataforma = trabajo.plataforma || trabajo.nombre;
      if (!turnosPorPlataforma[plataforma]) {
        turnosPorPlataforma[plataforma] = {
          nombre: trabajo.nombre,
          color: trabajo.colorAvatar || trabajo.color || '#10B981',
          totalGanado: 0,
          totalPedidos: 0,
          totalPropinas: 0,
          totalHoras: 0,
          totalKilometros: 0,
          totalGastos: 0,
          turnos: 0
        };
      }
      
      turnosPorPlataforma[plataforma].totalGanado += gananciaBase;
      turnosPorPlataforma[plataforma].totalPedidos += pedidos;
      turnosPorPlataforma[plataforma].totalPropinas += propinas;
      turnosPorPlataforma[plataforma].totalHoras += horas;
      turnosPorPlataforma[plataforma].totalKilometros += kilometros;
      turnosPorPlataforma[plataforma].totalGastos += gastos;
      turnosPorPlataforma[plataforma].turnos += 1;
      
      const vehiculo = trabajo.vehiculo || 'No especificado';
      if (!estadisticasPorVehiculo[vehiculo]) {
        estadisticasPorVehiculo[vehiculo] = {
          nombre: vehiculo,
          totalGanado: 0,
          totalPedidos: 0,
          totalKilometros: 0,
          totalGastos: 0,
          totalHoras: 0,
          turnos: 0,
          eficiencia: 0 
        };
      }
      
      estadisticasPorVehiculo[vehiculo].totalGanado += gananciaBase;
      estadisticasPorVehiculo[vehiculo].totalPedidos += pedidos;
      estadisticasPorVehiculo[vehiculo].totalKilometros += kilometros;
      estadisticasPorVehiculo[vehiculo].totalGastos += gastos;
      estadisticasPorVehiculo[vehiculo].totalHoras += horas;
      estadisticasPorVehiculo[vehiculo].turnos += 1;
    });
    
    Object.values(estadisticasPorVehiculo).forEach(vehiculo => {
      if (vehiculo.totalGastos > 0) {
        vehiculo.eficiencia = vehiculo.totalKilometros / vehiculo.totalGastos;
      }
    });
    
    let mejorDia = null;
    let mejorGanancia = 0;
    
    Object.entries(estadisticasPorDia).forEach(([fecha, stats]) => {
      const gananciaLiquida = stats.ganancia - stats.gastos;
      
      if (gananciaLiquida > mejorGanancia) {
        mejorGanancia = gananciaLiquida;
        mejorDia = {
          fecha,
          ganancia: stats.ganancia,
          gananciaLiquida,
          pedidos: stats.pedidos,
          horas: stats.horas,
          kilometros: stats.kilometros,
          gastos: stats.gastos
        };
      }
    });
    
    let mejorTurno = null;
    let mejorGananciaTurno = 0;
    
    turnosPeriodo.forEach(turno => {
      const gananciaLiquida = (turno.gananciaTotal || 0) - (turno.gastoCombustible || 0);
      if (gananciaLiquida > mejorGananciaTurno) {
        mejorGananciaTurno = gananciaLiquida;
        mejorTurno = {
          ...turno,
          gananciaLiquida,
          trabajo: trabajosDeliveryValidos.find(t => t.id === turno.trabajoId)
        };
      }
    });
    
    const gananciaLiquida = totalGanado - totalGastos;
    const promedioPorPedido = totalPedidos > 0 ? totalGanado / totalPedidos : 0;
    const promedioPorKilometro = totalKilometros > 0 ? totalGanado / totalKilometros : 0;
    const promedioPorHora = totalHoras > 0 ? totalGanado / totalHoras : 0;
    const promedioPropinasPorPedido = totalPedidos > 0 ? totalPropinas / totalPedidos : 0;
    const eficienciaCombustible = totalGastos > 0 ? totalKilometros / totalGastos : 0;
    const costoPorKilometro = totalKilometros > 0 ? totalGastos / totalKilometros : 0;
    
    const resultado = {
      totalGanado,
      totalPropinas,
      totalPedidos,
      totalKilometros,
      totalGastos,
      gananciaLiquida,
      totalHoras,
      
      promedioPorPedido,
      promedioPorKilometro,
      promedioPorHora,
      promedioPropinasPorPedido,
      eficienciaCombustible,
      costoPorKilometro,
      
      mejorDia,
      mejorTurno,
      
      turnosPorPlataforma,
      estadisticasPorVehiculo,
      estadisticasPorDia,
      
      diasTrabajados: Object.keys(estadisticasPorDia).length,
      turnosRealizados: turnosPeriodo.length
    };

    return resultado;
}
