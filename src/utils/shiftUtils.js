// src/utils/shiftUtils.js

/**
 * Calculates the gross earnings for a shift, handling different data structures.
 * For delivery shifts, it ensures tips are included.
 * @param {object} shift - The shift object.
 * @returns {number} - The gross earnings.
 */
export const getShiftGrossEarnings = (shift) => {
  if (shift.type !== 'delivery' && shift.tipo !== 'delivery') {
    // For non-delivery shifts, we assume there's a 'total' field from a calculation
    // or we can just return 0 if it's not about earnings.
    // This function is primarily for delivery gross earnings.
    return shift.total || 0;
  }

  // For new shifts, gananciaTotal is already calculated as gananciaBase + propinas.
  // So if gananciaBase exists, gananciaTotal is correct.
  if (shift.gananciaBase !== undefined) {
    return shift.gananciaTotal || 0;
  }

  // For old shifts, gananciaTotal does NOT include propinas.
  // So we have to add them.
  return (shift.gananciaTotal || 0) + (shift.propinas || 0);
};


/**
 * Determina la etiqueta de un turno (Diurno, Tarde, Noche) basado en la hora de inicio.
 * @param {string} horaInicio - La hora de inicio en formato "HH:mm".
 * @param {object} shiftRanges - El objeto de rangos desde los ajustes del usuario.
 * @returns {string} - La etiqueta del turno ('Diurno', 'Tarde', 'Noche').
 */
export const getTagForShift = (horaInicio, shiftRanges) => {
  const [hour] = horaInicio.split(':').map(Number);
  const ranges = shiftRanges || {
    dayStart: 6,
    afternoonStart: 14,
    nightStart: 20
  };

  if (hour >= ranges.dayStart && hour < ranges.afternoonStart) {
    return 'Diurno';
  }
  if (hour >= ranges.afternoonStart && hour < ranges.nightStart) {
    return 'Tarde';
  }
  return 'Noche';
};