// src/utils/shiftUtils.js

/**
 * Determina la etiqueta de un turno (Diurno, Tarde, Noche) basado en la hora de inicio.
 * @param ***REMOVED***string***REMOVED*** horaInicio - La hora de inicio en formato "HH:mm".
 * @param ***REMOVED***object***REMOVED*** shiftRanges - El objeto de rangos desde los ajustes del usuario.
 * @returns ***REMOVED***string***REMOVED*** - La etiqueta del turno ('Diurno', 'Tarde', 'Noche').
 */
export const getTagForShift = (horaInicio, shiftRanges) => ***REMOVED***
  const [hour] = horaInicio.split(':').map(Number);
  const ranges = shiftRanges || ***REMOVED***
    dayStart: 6,
    afternoonStart: 14,
    nightStart: 20
  ***REMOVED***;

  if (hour >= ranges.dayStart && hour < ranges.afternoonStart) ***REMOVED***
    return 'Diurno';
  ***REMOVED***
  if (hour >= ranges.afternoonStart && hour < ranges.nightStart) ***REMOVED***
    return 'Tarde';
  ***REMOVED***
  return 'Noche';
***REMOVED***;