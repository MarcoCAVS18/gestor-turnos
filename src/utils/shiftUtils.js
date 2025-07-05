// src/utils/shiftUtils.js

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