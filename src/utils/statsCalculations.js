// src/utils/statsCalculations.js
import ***REMOVED*** determinarTipoTurno ***REMOVED*** from './shiftDetailsUtils';
import ***REMOVED*** createSafeDate ***REMOVED*** from './time';

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

/**
 * Calculates the duration of a shift in hours.
 * @param ***REMOVED***object***REMOVED*** turno - The shift object with horaInicio and horaFin.
 * @returns ***REMOVED***number***REMOVED*** - The duration in hours.
 */
export const calculateShiftHours = (turno) => ***REMOVED***
  try ***REMOVED***
    const [horaInicioH, horaInicioM] = turno.horaInicio.split(':').map(Number);
    const [horaFinH, horaFinM] = turno.horaFin.split(':').map(Number);

    const inicio = horaInicioH + horaInicioM / 60;
    let fin = horaFinH + horaFinM / 60;

    // Handle shifts that cross midnight
    if (fin < inicio) fin += 24;

    return Math.max(0, fin - inicio);
  ***REMOVED*** catch (error) ***REMOVED***
    return 0;
  ***REMOVED***
***REMOVED***;

/**
 * Calculates the earnings for a specific shift.
 * @param ***REMOVED***object***REMOVED*** turno - The shift object.
 * @param ***REMOVED***array***REMOVED*** trabajosValidos - Array of valid work objects to find the matching job.
 * @returns ***REMOVED***number***REMOVED*** - The calculated earnings for the shift.
 */
export const calculateShiftEarnings = (turno, trabajosValidos) => ***REMOVED***
  try ***REMOVED***
    const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return 0;

    const horas = calculateShiftHours(turno);
    const tarifa = trabajo.tarifaBase || trabajo.salario || 0;
    const descuento = trabajo.descuento || 0;

    const gananciaBase = horas * tarifa;
    const descuentoAmount = gananciaBase * (descuento / 100);

    return Math.max(0, gananciaBase - descuentoAmount);
  ***REMOVED*** catch (error) ***REMOVED***
    return 0;
  ***REMOVED***
***REMOVED***;

/**
 * Calculates the average earnings per order for a platform.
 * @param ***REMOVED***object***REMOVED*** plataforma - The platform object.
 * @returns ***REMOVED***number***REMOVED*** - Average earnings per order.
 */
export const calculateAveragePerOrder = (plataforma) => ***REMOVED***
  return plataforma.totalPedidos > 0 ? plataforma.totalGanado / plataforma.totalPedidos : 0;
***REMOVED***;

/**
 * Calculates the average earnings per hour for a platform.
 * @param ***REMOVED***object***REMOVED*** plataforma - The platform object.
 * @returns ***REMOVED***number***REMOVED*** - Average earnings per hour.
 */
export const calculateAveragePerHour = (plataforma) => ***REMOVED***
  return plataforma.totalHoras > 0 ? plataforma.totalGanado / plataforma.totalHoras : 0;
***REMOVED***;

/**
 * Calculates the net earnings for a platform.
 * @param ***REMOVED***object***REMOVED*** plataforma - The platform object.
 * @returns ***REMOVED***number***REMOVED*** - Net earnings.
 */
export const calculateNetEarnings = (plataforma) => ***REMOVED***
  return plataforma.totalGanado - plataforma.totalGastos;
***REMOVED***;

/**
 * Calculates the percentage of total earnings a platform contributes.
 * @param ***REMOVED***object***REMOVED*** plataforma - The platform object.
 * @param ***REMOVED***number***REMOVED*** totalGeneral - The total earnings across all platforms.
 * @returns ***REMOVED***number***REMOVED*** - Percentage of total earnings.
 */
export const calculateEarningsPercentage = (plataforma, totalGeneral) => ***REMOVED***
  return totalGeneral > 0 ? (plataforma.totalGanado / totalGeneral) * 100 : 0;
***REMOVED***;

/**
 * Sorts an array of platforms based on a specified key.
 * @param ***REMOVED***array***REMOVED*** plataformas - Array of platform objects.
 * @param ***REMOVED***string***REMOVED*** sortBy - The key to sort by.
 * @returns ***REMOVED***array***REMOVED*** - Sorted array of platform objects.
 */
export const sortPlatforms = (plataformas, sortBy) => ***REMOVED***
  return [...plataformas].sort((a, b) => b[sortBy] - a[sortBy]);
***REMOVED***;

/**
 * Calculates the cost per kilometer for a vehicle.
 * @param ***REMOVED***object***REMOVED*** vehiculo - The vehicle object.
 * @returns ***REMOVED***number***REMOVED*** - Cost per kilometer.
 */
export const calculateCostPerKm = (vehiculo) => ***REMOVED***
  return vehiculo.totalKilometros > 0 ? vehiculo.totalGastos / vehiculo.totalKilometros : 0;
***REMOVED***;

/**
 * Calculates the earnings per hour for a vehicle.
 * @param ***REMOVED***object***REMOVED*** vehiculo - The vehicle object.
 * @returns ***REMOVED***number***REMOVED*** - Earnings per hour.
 */
export const calculateVehicleEarningsPerHour = (vehiculo) => ***REMOVED***
  return vehiculo.totalHoras > 0 ? vehiculo.totalGanado / vehiculo.totalHoras : 0;
***REMOVED***;

/**
 * Finds the most efficient vehicle from a list.
 * @param ***REMOVED***array***REMOVED*** vehiculos - Array of vehicle objects.
 * @returns ***REMOVED***object|null***REMOVED*** - The most efficient vehicle object, or null if array is empty.
 */
export const findMostEfficientVehicle = (vehiculos) => ***REMOVED***
  if (!vehiculos || vehiculos.length === 0) return null;
  return vehiculos.reduce((mejor, actual) => ***REMOVED***
    return actual.eficiencia > mejor.eficiencia ? actual : mejor;
  ***REMOVED***, vehiculos[0]);
***REMOVED***;
