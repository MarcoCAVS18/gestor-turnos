// src/utils/shiftUtils.js

/**
 * Calculates the gross earnings for a shift, handling different data structures.
 * For delivery shifts, it ensures tips are included.
 * @param ***REMOVED***object***REMOVED*** shift - The shift object.
 * @returns ***REMOVED***number***REMOVED*** - The gross earnings.
 */
export const getShiftGrossEarnings = (shift) => ***REMOVED***
  if (shift.type !== 'delivery' && shift.tipo !== 'delivery') ***REMOVED***
    // For non-delivery shifts, we assume there's a 'total' field from a calculation
    // or we can just return 0 if it's not about earnings.
    // This function is primarily for delivery gross earnings.
    return shift.total || 0;
  ***REMOVED***

  // For new shifts, gananciaTotal is already calculated as gananciaBase + propinas.
  // So if gananciaBase exists, gananciaTotal is correct.
  if (shift.gananciaBase !== undefined) ***REMOVED***
    return shift.gananciaTotal || 0;
  ***REMOVED***

  // For old shifts, gananciaTotal does NOT include propinas.
  // So we have to add them.
  return (shift.gananciaTotal || 0) + (shift.propinas || 0);
***REMOVED***;


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