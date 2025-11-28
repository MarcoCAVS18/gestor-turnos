// src/utils/statsCalculations.js
import { determinarTipoTurno } from './shiftDetailsUtils';
import { createSafeDate } from './time';

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

/**
 * Calculates the duration of a shift in hours.
 * @param {object} turno - The shift object with horaInicio and horaFin.
 * @returns {number} - The duration in hours.
 */
export const calculateShiftHours = (turno) => {
  try {
    const [horaInicioH, horaInicioM] = turno.horaInicio.split(':').map(Number);
    const [horaFinH, horaFinM] = turno.horaFin.split(':').map(Number);

    const inicio = horaInicioH + horaInicioM / 60;
    let fin = horaFinH + horaFinM / 60;

    // Handle shifts that cross midnight
    if (fin < inicio) fin += 24;

    return Math.max(0, fin - inicio);
  } catch (error) {
    return 0;
  }
};

/**
 * Calculates the earnings for a specific shift.
 * @param {object} turno - The shift object.
 * @param {array} trabajosValidos - Array of valid work objects to find the matching job.
 * @returns {number} - The calculated earnings for the shift.
 */
export const calculateShiftEarnings = (turno, trabajosValidos) => {
  try {
    const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
    if (!trabajo) return 0;

    const horas = calculateShiftHours(turno);
    const tarifa = trabajo.tarifaBase || trabajo.salario || 0;
    const descuento = trabajo.descuento || 0;

    const gananciaBase = horas * tarifa;
    const descuentoAmount = gananciaBase * (descuento / 100);

    return Math.max(0, gananciaBase - descuentoAmount);
  } catch (error) {
    return 0;
  }
};

/**
 * Calculates the average earnings per order for a platform.
 * @param {object} plataforma - The platform object.
 * @returns {number} - Average earnings per order.
 */
export const calculateAveragePerOrder = (plataforma) => {
  return plataforma.totalPedidos > 0 ? plataforma.totalGanado / plataforma.totalPedidos : 0;
};

/**
 * Calculates the average earnings per hour for a platform.
 * @param {object} plataforma - The platform object.
 * @returns {number} - Average earnings per hour.
 */
export const calculateAveragePerHour = (plataforma) => {
  return plataforma.totalHoras > 0 ? plataforma.totalGanado / plataforma.totalHoras : 0;
};

/**
 * Calculates the net earnings for a platform.
 * @param {object} plataforma - The platform object.
 * @returns {number} - Net earnings.
 */
export const calculateNetEarnings = (plataforma) => {
  return plataforma.totalGanado - plataforma.totalGastos;
};

/**
 * Calculates the percentage of total earnings a platform contributes.
 * @param {object} plataforma - The platform object.
 * @param {number} totalGeneral - The total earnings across all platforms.
 * @returns {number} - Percentage of total earnings.
 */
export const calculateEarningsPercentage = (plataforma, totalGeneral) => {
  return totalGeneral > 0 ? (plataforma.totalGanado / totalGeneral) * 100 : 0;
};

/**
 * Sorts an array of platforms based on a specified key.
 * @param {array} plataformas - Array of platform objects.
 * @param {string} sortBy - The key to sort by.
 * @returns {array} - Sorted array of platform objects.
 */
export const sortPlatforms = (plataformas, sortBy) => {
  return [...plataformas].sort((a, b) => b[sortBy] - a[sortBy]);
};

/**
 * Calculates the cost per kilometer for a vehicle.
 * @param {object} vehiculo - The vehicle object.
 * @returns {number} - Cost per kilometer.
 */
export const calculateCostPerKm = (vehiculo) => {
  return vehiculo.totalKilometros > 0 ? vehiculo.totalGastos / vehiculo.totalKilometros : 0;
};

/**
 * Calculates the earnings per hour for a vehicle.
 * @param {object} vehiculo - The vehicle object.
 * @returns {number} - Earnings per hour.
 */
export const calculateVehicleEarningsPerHour = (vehiculo) => {
  return vehiculo.totalHoras > 0 ? vehiculo.totalGanado / vehiculo.totalHoras : 0;
};

/**
 * Finds the most efficient vehicle from a list.
 * @param {array} vehiculos - Array of vehicle objects.
 * @returns {object|null} - The most efficient vehicle object, or null if array is empty.
 */
export const findMostEfficientVehicle = (vehiculos) => {
  if (!vehiculos || vehiculos.length === 0) return null;
  return vehiculos.reduce((mejor, actual) => {
    return actual.eficiencia > mejor.eficiencia ? actual : mejor;
  }, vehiculos[0]);
};
