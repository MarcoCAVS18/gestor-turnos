// src/services/calculationService.js
import ***REMOVED*** getShiftGrossEarnings ***REMOVED*** from '../utils/shiftUtils';
import ***REMOVED*** determinarTipoTurno ***REMOVED*** from '../utils/shiftDetailsUtils';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';
import ***REMOVED*** getMonthRange ***REMOVED*** from '../utils/time';
import ***REMOVED*** DELIVERY_PLATFORMS_AUSTRALIA ***REMOVED*** from '../constants/delivery';

/**
 * Calcula las horas trabajadas entre una hora de inicio y fin.
 * @param ***REMOVED***string***REMOVED*** start - Hora de inicio (e.g., "08:00")
 * @param ***REMOVED***string***REMOVED*** end - Hora de fin (e.g., "16:00")
 * @returns ***REMOVED***number***REMOVED*** - Total de horas
 */
export const calculateHours = (start, end) => ***REMOVED***
  if (!start || !end) return 0;
  const [startHour, startMin] = start.split(':').map(n => parseInt(n));
  const [endHour, endMin] = end.split(':').map(n => parseInt(n));

  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  // Si el turno cruza la medianoche
  if (endMinutes <= startMinutes) ***REMOVED***
    endMinutes += 24 * 60;
  ***REMOVED***

  return (endMinutes - startMinutes) / 60;
***REMOVED***;

/**
 * Calcula el pago de un turno, considerando rangos horarios, tarifas y descansos.
 * @param ***REMOVED***object***REMOVED*** shift - El objeto del turno.
 * @param ***REMOVED***Array***REMOVED*** allJobs - Array de todos los trabajos (normales y delivery).
 * @param ***REMOVED***object***REMOVED*** shiftRanges - Configuración de los rangos horarios.
 * @param ***REMOVED***number***REMOVED*** defaultDiscount - Descuento por defecto.
 * @param ***REMOVED***boolean***REMOVED*** smokoEnabled - Si el descanso (smoko) está habilitado.
 * @param ***REMOVED***number***REMOVED*** smokoMinutes - Duración del descanso en minutos.
 * @returns ***REMOVED***object***REMOVED*** - Objeto con el detalle del pago.
 */
export const calculatePayment = (shift, allJobs, shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes) => ***REMOVED***
  const job = allJobs.find(j => j.id === shift.trabajoId);

  if (!job) return ***REMOVED***
    total: 0,
    totalWithDiscount: 0,
    hours: 0,
    tips: 0,
    isDelivery: false,
    breakdown: ***REMOVED*** diurno: 0, tarde: 0, noche: 0, sabado: 0, domingo: 0 ***REMOVED***,
    appliedRates: ***REMOVED******REMOVED***
  ***REMOVED***;

  // Si es un turno de delivery, devuelve las ganancias totales directamente
  if (shift.type === 'delivery' || shift.tipo === 'delivery') ***REMOVED***
    const hours = calculateHours(shift.horaInicio, shift.horaFin);
    const grossEarnings = getShiftGrossEarnings(shift);
    return ***REMOVED***
      total: grossEarnings,
      totalWithDiscount: grossEarnings,
      hours,
      tips: shift.propinas || 0,
      isDelivery: true,
      breakdown: ***REMOVED*** delivery: grossEarnings ***REMOVED***,
      appliedRates: ***REMOVED*** 'delivery': shift.gananciaPorHora || (grossEarnings / hours) || 0 ***REMOVED***
    ***REMOVED***;
  ***REMOVED***

  const ***REMOVED*** horaInicio, horaFin, fechaInicio, cruzaMedianoche = false, tuvoDescanso = true ***REMOVED*** = shift;

  // Prioriza el descanso específico del turno, si no, usa el global.
  const finalSmokoMinutes = shift.descansoMinutos ?? smokoMinutes;

  if (!horaInicio || !horaFin || !fechaInicio) ***REMOVED***
    return ***REMOVED*** total: 0, totalWithDiscount: 0, hours: 0, tips: 0, isDelivery: false, appliedRates: ***REMOVED******REMOVED*** ***REMOVED***;
  ***REMOVED***

  const [startHour, startMin] = horaInicio.split(':').map(n => parseInt(n));
  const [endHour, endMin] = horaFin.split(':').map(n => parseInt(n));

  let startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;

  if (cruzaMedianoche) ***REMOVED***
    endMinutes += 24 * 60;
  ***REMOVED*** else if (endMinutes <= startMinutes) ***REMOVED***
    endMinutes += 24 * 60;
  ***REMOVED***

  const totalMinutes = endMinutes - startMinutes;
  let workingMinutes = totalMinutes;
  if (smokoEnabled && tuvoDescanso && totalMinutes > finalSmokoMinutes) ***REMOVED***
    workingMinutes = totalMinutes - finalSmokoMinutes;
  ***REMOVED***

  const hours = workingMinutes / 60;

  const date = createSafeDate(fechaInicio);
  const dayOfWeek = date.getDay();

  let total = 0;
  let breakdown = ***REMOVED*** diurno: 0, tarde: 0, noche: 0, sabado: 0, domingo: 0 ***REMOVED***;
  let appliedRates = ***REMOVED******REMOVED***;

  if (dayOfWeek === 0) ***REMOVED*** // Domingo
    total = hours * job.tarifas.domingo;
    breakdown.domingo = total;
    appliedRates['domingo'] = job.tarifas.domingo;
  ***REMOVED*** else if (dayOfWeek === 6) ***REMOVED*** // Sábado
    total = hours * job.tarifas.sabado;
    breakdown.sabado = total;
    appliedRates['sabado'] = job.tarifas.sabado;
  ***REMOVED*** else ***REMOVED***
    const ranges = shiftRanges || ***REMOVED***
      dayStart: 6, dayEnd: 14,
      afternoonStart: 14, afternoonEnd: 20,
      nightStart: 20
    ***REMOVED***;

    const dayStartMin = ranges.dayStart * 60;
    const dayEndMin = ranges.dayEnd * 60;
    const afternoonStartMin = ranges.afternoonStart * 60;
    const afternoonEndMin = ranges.afternoonEnd * 60;

    const minutesToProcess = Math.min(workingMinutes, totalMinutes);

    for (let minute = 0; minute < minutesToProcess; minute++) ***REMOVED***
      const actualMinute = startMinutes + (minute * totalMinutes / workingMinutes);
      const currentMinuteInDay = Math.floor(actualMinute) % (24 * 60);
      let rate = job.tarifaBase;
      let rateType = 'noche';

      if (currentMinuteInDay >= dayStartMin && currentMinuteInDay < dayEndMin) ***REMOVED***
        rate = job.tarifas.diurno;
        rateType = 'diurno';
      ***REMOVED*** else if (currentMinuteInDay >= afternoonStartMin && currentMinuteInDay < afternoonEndMin) ***REMOVED***
        rate = job.tarifas.tarde;
        rateType = 'tarde';
      ***REMOVED*** else ***REMOVED***
        rate = job.tarifas.noche;
        rateType = 'noche';
      ***REMOVED***
      
      if(rate > 0) appliedRates[rateType] = rate;

      const ratePerMinute = rate / 60;
      total += ratePerMinute;
      breakdown[rateType] += ratePerMinute;
    ***REMOVED***
  ***REMOVED***

  const hoursBreakdown = ***REMOVED******REMOVED***;
  Object.keys(breakdown).forEach(rateType => ***REMOVED***
    if (breakdown[rateType] > 0 && appliedRates[rateType] > 0) ***REMOVED***
      hoursBreakdown[rateType] = breakdown[rateType] / appliedRates[rateType];
    ***REMOVED***
  ***REMOVED***);

  const totalWithDiscount = total * (1 - defaultDiscount / 100);

  return ***REMOVED***
    total,
    totalWithDiscount,
    hours,
    tips: 0,
    isDelivery: false,
    breakdown,
    hoursBreakdown,
    appliedRates,
    isNightShift: cruzaMedianoche || false,
    smokoApplied: smokoEnabled && tuvoDescanso && totalMinutes > finalSmokoMinutes,
    smokoMinutes: smokoEnabled && tuvoDescanso ? finalSmokoMinutes : 0,
    totalMinutesWorked: workingMinutes,
    totalMinutesScheduled: totalMinutes
  ***REMOVED***;
***REMOVED***;

/**
 * Calcula el total de horas y ganancias para un conjunto de turnos diarios.
 * @param ***REMOVED***Array***REMOVED*** dailyShifts - Array de turnos para un día.
 * @param ***REMOVED***Function***REMOVED*** calculatePaymentFn - La función para calcular el pago de un turno.
 * @returns ***REMOVED***object***REMOVED*** - Objeto con `hours` y `total`.
 */
export const calculateDailyTotal = (dailyShifts, calculatePaymentFn) => ***REMOVED***
  return dailyShifts.reduce((total, shift) => ***REMOVED***
    if (shift.type === 'delivery') ***REMOVED***
      const grossEarnings = getShiftGrossEarnings(shift);
      const netEarnings = grossEarnings - (shift.gastoCombustible || 0);
      return ***REMOVED***
        hours: total.hours, // Las horas de delivery se calculan por separado si es necesario
        total: total.total + netEarnings
      ***REMOVED***;
    ***REMOVED*** else ***REMOVED***
      const result = calculatePaymentFn(shift);
      return ***REMOVED***
        hours: total.hours + result.hours,
        total: total.total + result.total
      ***REMOVED***;
    ***REMOVED***
  ***REMOVED***, ***REMOVED*** hours: 0, total: 0 ***REMOVED***);
***REMOVED***;

/**
 * Calcula las estadísticas mensuales basadas en los turnos.
 * @param ***REMOVED***number***REMOVED*** year - Año.
 * @param ***REMOVED***number***REMOVED*** month - Mes (0-11).
 * @param ***REMOVED***Array***REMOVED*** turnos - Array de turnos tradicionales.
 * @param ***REMOVED***Array***REMOVED*** turnosDelivery - Array de turnos de delivery.
 * @param ***REMOVED***Function***REMOVED*** calculatePaymentFn - La función para calcular el pago.
 * @returns ***REMOVED***object***REMOVED*** - Estadísticas mensuales.
 */
export const calculateMonthlyStats = (year, month, turnos, turnosDelivery, calculatePaymentFn) => ***REMOVED***
  const ***REMOVED*** start, end ***REMOVED*** = getMonthRange(year, month);
  const allShifts = [...turnos, ...turnosDelivery];

  const monthlyShifts = allShifts.filter(shift => ***REMOVED***
    const shiftDate = shift.fechaInicio || shift.fecha;
    return shiftDate >= start && shiftDate <= end;
  ***REMOVED***);

  let totalHours = 0;
  let totalEarnings = 0;
  let totalTips = 0;
  let totalDeliveries = 0;
  let totalKilometers = 0;
  let totalFuelCost = 0;

  monthlyShifts.forEach(shift => ***REMOVED***
    if (shift.type === 'delivery' || shift.tipo === 'delivery') ***REMOVED***
      totalEarnings += getShiftGrossEarnings(shift);
      totalTips += shift.propinas || 0;
      totalDeliveries += shift.numeroPedidos || 0;
      totalKilometers += shift.kilometros || 0;
      totalFuelCost += shift.gastoCombustible || 0;
      totalHours += calculateHours(shift.horaInicio, shift.horaFin);
    ***REMOVED*** else ***REMOVED***
      const payment = calculatePaymentFn(shift);
      totalHours += payment.hours;
      totalEarnings += payment.total;
    ***REMOVED***
  ***REMOVED***);

  return ***REMOVED***
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
  ***REMOVED***;
***REMOVED***;

/**
 * Formats a given number of minutes into a string like "1H 30M".
 * @param ***REMOVED***number***REMOVED*** minutos - The total minutes to format.
 * @returns ***REMOVED***string***REMOVED*** - The formatted time string.
 */
export const formatMinutesToHoursAndMinutes = (minutos) => ***REMOVED***
  if (!minutos || minutos === 0) return '0 MIN';
  
  if (minutos < 60) ***REMOVED***
    return `$***REMOVED***minutos***REMOVED*** MIN`;
  ***REMOVED***
  
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  
  if (minutosRestantes === 0) ***REMOVED***
    return `$***REMOVED***horas***REMOVED***H`;
  ***REMOVED***
  
  return `$***REMOVED***horas***REMOVED***H $***REMOVED***minutosRestantes***REMOVED***M`;
***REMOVED***;

/**
 * Calculates a comprehensive set of weekly statistics based on shifts and other data.
 */
export const calculateWeeklyStats = (***REMOVED***
  turnos,
  turnosDelivery,
  todosLosTrabajos,
  calculatePayment,
  shiftRanges,
  offsetSemanas = 0,
***REMOVED***) => ***REMOVED***
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

  const turnosSemana = todosLosTurnos.filter(turno => ***REMOVED***
    const fechaClave = turno.fechaInicio || turno.fecha;
    if (!fechaClave) return false;
    const fechaTurno = createSafeDate(fechaClave);
    return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
  ***REMOVED***);

  const initialState = ***REMOVED***
    fechaInicio,
    fechaFin,
    totalGanado: 0,
    horasTrabajadas: 0,
    totalTurnos: 0,
    gananciaPorDia: ***REMOVED*** "Lunes": ***REMOVED******REMOVED***, "Martes": ***REMOVED******REMOVED***, "Miércoles": ***REMOVED******REMOVED***, "Jueves": ***REMOVED******REMOVED***, "Viernes": ***REMOVED******REMOVED***, "Sábado": ***REMOVED******REMOVED***, "Domingo": ***REMOVED******REMOVED*** ***REMOVED***,
    gananciaPorTrabajo: [],
    tiposDeTurno: ***REMOVED******REMOVED***,
    diasTrabajados: 0,
    promedioHorasPorDia: 0,
    promedioPorHora: 0,
    diaMasProductivo: ***REMOVED*** dia: 'Ninguno', ganancia: 0 ***REMOVED***
  ***REMOVED***;

  if (turnosSemana.length === 0) return initialState;

  const acc = ***REMOVED***
    totalGanado: 0,
    horasTrabajadas: 0,
    gananciaPorDia: ***REMOVED*** "Lunes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Martes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Miércoles": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Jueves": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Viernes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Sábado": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Domingo": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED*** ***REMOVED***,
    gananciaPorTrabajo: ***REMOVED******REMOVED***,
    tiposDeTurno: ***REMOVED******REMOVED***
  ***REMOVED***;

  turnosSemana.forEach(turno => ***REMOVED***
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

    if (!acc.gananciaPorTrabajo[trabajo.id]) ***REMOVED***
      acc.gananciaPorTrabajo[trabajo.id] = ***REMOVED*** id: trabajo.id, nombre: trabajo.nombre, color: trabajo.color || trabajo.colorAvatar || '#EC4899', ganancia: 0, horas: 0, turnos: 0, tipo: trabajo.tipo || 'tradicional' ***REMOVED***;
    ***REMOVED***
    acc.gananciaPorTrabajo[trabajo.id].ganancia += ganancia;
    acc.gananciaPorTrabajo[trabajo.id].horas += horas;
    acc.gananciaPorTrabajo[trabajo.id].turnos += 1;

    let tipoTurno = 'mixto';
    if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') tipoTurno = 'delivery';
    else if (fechaTurno.getDay() === 6) tipoTurno = 'sabado';
    else if (fechaTurno.getDay() === 0) tipoTurno = 'domingo';
    else if (shiftRanges) tipoTurno = determinarTipoTurno(turno, shiftRanges);

    if (!acc.tiposDeTurno[tipoTurno]) ***REMOVED***
      acc.tiposDeTurno[tipoTurno] = ***REMOVED*** turnos: 0, horas: 0, ganancia: 0 ***REMOVED***;
    ***REMOVED***
    acc.tiposDeTurno[tipoTurno].turnos += 1;
    acc.tiposDeTurno[tipoTurno].horas += horas;
    acc.tiposDeTurno[tipoTurno].ganancia += ganancia;
  ***REMOVED***);

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
***REMOVED***

export const calculateDeliveryStats = (***REMOVED*** trabajosDelivery, turnosDelivery, periodo = 'mes' ***REMOVED***) => ***REMOVED***
    const trabajosDeliveryValidos = Array.isArray(trabajosDelivery) ? trabajosDelivery : [];
    const turnosDeliveryValidos = Array.isArray(turnosDelivery) ? turnosDelivery : [];
    
    if (turnosDeliveryValidos.length === 0) ***REMOVED***
      return ***REMOVED***
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
        turnosPorPlataforma: ***REMOVED******REMOVED***,
        estadisticasPorVehiculo: ***REMOVED******REMOVED***,
        estadisticasPorDia: ***REMOVED******REMOVED***,
        tendencia: 0,
        diasTrabajados: 0,
        turnosRealizados: 0,
        totalHoras: 0,
        eficienciaCombustible: 0,
        costoPorKilometro: 0
      ***REMOVED***;
    ***REMOVED***
    
    const hoy = new Date();
    let fechaInicio;
    
    switch (periodo) ***REMOVED***
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
    ***REMOVED***
    
    const turnosPeriodo = turnosDeliveryValidos.filter(turno => ***REMOVED***
      const fechaTurno = new Date(turno.fecha);
      return fechaTurno >= fechaInicio;
    ***REMOVED***);
        
    let totalGanado = 0;
    let totalPropinas = 0;
    let totalPedidos = 0;
    let totalKilometros = 0;
    let totalGastos = 0;
    let totalHoras = 0;
    
    const estadisticasPorDia = ***REMOVED******REMOVED***;
    const turnosPorPlataforma = ***REMOVED******REMOVED***;
    const estadisticasPorVehiculo = ***REMOVED******REMOVED***;
    
    turnosPeriodo.forEach(turno => ***REMOVED***
      const trabajo = trabajosDeliveryValidos.find(t => t.id === turno.trabajoId);
      if (!trabajo) ***REMOVED***
        console.warn('⚠️ Trabajo delivery no encontrado para turno:', turno.id);
        return;
      ***REMOVED***
      
            const gananciaTurno = getShiftGrossEarnings(turno);
            const propinas = turno.propinas || 0;
            const pedidos = turno.numeroPedidos || 0;
            const kilometros = turno.kilometros || 0;
            const gastos = turno.gastoCombustible || 0;
            
            totalGanado += gananciaTurno;
            totalPropinas += propinas;
            totalPedidos += pedidos;
            totalKilometros += kilometros;
            totalGastos += gastos;
            
            const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
            const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
            let horas = (horaFin + minFin/60) - (horaIni + minIni/60);
            if (horas < 0) horas += 24;
            totalHoras += horas;
            
            if (!estadisticasPorDia[turno.fecha]) ***REMOVED***
              estadisticasPorDia[turno.fecha] = ***REMOVED***
                ganancia: 0,
                propinas: 0,
                pedidos: 0,
                kilometros: 0,
                gastos: 0,
                horas: 0,
                turnos: []
              ***REMOVED***;
            ***REMOVED***
            
            estadisticasPorDia[turno.fecha].ganancia += gananciaTurno;
            estadisticasPorDia[turno.fecha].propinas += propinas;
            estadisticasPorDia[turno.fecha].pedidos += pedidos;
            estadisticasPorDia[turno.fecha].kilometros += kilometros;
            estadisticasPorDia[turno.fecha].gastos += gastos;
            estadisticasPorDia[turno.fecha].horas += horas;
            estadisticasPorDia[turno.fecha].turnos.push(***REMOVED***
              ...turno,
              trabajo,
              horas
            ***REMOVED***);
            
            const plataforma = trabajo.plataforma || trabajo.nombre;
            if (!turnosPorPlataforma[plataforma]) ***REMOVED***
              const platformData = DELIVERY_PLATFORMS_AUSTRALIA.find(p => p.nombre === plataforma);
              turnosPorPlataforma[plataforma] = ***REMOVED***
                nombre: plataforma,
                color: platformData?.color || '#10B981',
                totalGanado: 0,
                totalPedidos: 0,
                totalPropinas: 0,
                totalHoras: 0,
                totalKilometros: 0,
                totalGastos: 0,
                turnos: 0
              ***REMOVED***;
            ***REMOVED***
            
            turnosPorPlataforma[plataforma].totalGanado += gananciaTurno;
            turnosPorPlataforma[plataforma].totalPedidos += pedidos;
            turnosPorPlataforma[plataforma].totalPropinas += propinas;
            turnosPorPlataforma[plataforma].totalHoras += horas;
            turnosPorPlataforma[plataforma].totalKilometros += kilometros;
            turnosPorPlataforma[plataforma].totalGastos += gastos;
            turnosPorPlataforma[plataforma].turnos += 1;
            
            const vehiculo = trabajo.vehiculo || 'No especificado';
            if (!estadisticasPorVehiculo[vehiculo]) ***REMOVED***
              estadisticasPorVehiculo[vehiculo] = ***REMOVED***
                nombre: vehiculo,
                totalGanado: 0,
                totalPedidos: 0,
                totalKilometros: 0,
                totalGastos: 0,
                totalHoras: 0,
                turnos: 0,
                eficiencia: 0 
              ***REMOVED***;
            ***REMOVED***
            
            estadisticasPorVehiculo[vehiculo].totalGanado += gananciaTurno;
            estadisticasPorVehiculo[vehiculo].totalPedidos += pedidos;
            estadisticasPorVehiculo[vehiculo].totalKilometros += kilometros;
            estadisticasPorVehiculo[vehiculo].totalGastos += gastos;
            estadisticasPorVehiculo[vehiculo].totalHoras += horas;
            estadisticasPorVehiculo[vehiculo].turnos += 1;
          ***REMOVED***);    
    Object.values(estadisticasPorVehiculo).forEach(vehiculo => ***REMOVED***
      if (vehiculo.totalGastos > 0) ***REMOVED***
        vehiculo.eficiencia = vehiculo.totalKilometros / vehiculo.totalGastos;
      ***REMOVED***
    ***REMOVED***);
    
    let mejorDia = null;
    let mejorGanancia = 0;
    
    Object.entries(estadisticasPorDia).forEach(([fecha, stats]) => ***REMOVED***
      const gananciaLiquida = stats.ganancia - stats.gastos;
      
      if (gananciaLiquida > mejorGanancia) ***REMOVED***
        mejorGanancia = gananciaLiquida;
        mejorDia = ***REMOVED***
          fecha,
          ganancia: stats.ganancia,
          gananciaLiquida,
          pedidos: stats.pedidos,
          horas: stats.horas,
          kilometros: stats.kilometros,
          gastos: stats.gastos
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***);
    
    let mejorTurno = null;
    let mejorGananciaTurno = 0;
    
    turnosPeriodo.forEach(turno => ***REMOVED***
      const gananciaBruta = getShiftGrossEarnings(turno);
      const gananciaLiquida = gananciaBruta - (turno.gastoCombustible || 0);
      if (gananciaLiquida > mejorGananciaTurno) ***REMOVED***
        mejorGananciaTurno = gananciaLiquida;
        mejorTurno = ***REMOVED***
          ...turno,
          gananciaLiquida,
          trabajo: trabajosDeliveryValidos.find(t => t.id === turno.trabajoId)
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***);
    
    const gananciaLiquida = totalGanado - totalGastos;
    const promedioPorPedido = totalPedidos > 0 ? totalGanado / totalPedidos : 0;
    const promedioPorKilometro = totalKilometros > 0 ? totalGanado / totalKilometros : 0;
    const promedioPorHora = totalHoras > 0 ? totalGanado / totalHoras : 0;
    const promedioPropinasPorPedido = totalPedidos > 0 ? totalPropinas / totalPedidos : 0;
    const eficienciaCombustible = totalGastos > 0 ? totalKilometros / totalGastos : 0;
    const costoPorKilometro = totalKilometros > 0 ? totalGastos / totalKilometros : 0;
    
    const resultado = ***REMOVED***
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
    ***REMOVED***;

    return resultado;
***REMOVED***
