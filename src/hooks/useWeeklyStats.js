import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

export const useWeeklyStats = (offsetSemanas = 0) => ***REMOVED***
  // Usamos `calculatePayment` y `shiftRanges` del contexto.
  const ***REMOVED*** calculatePayment, todosLosTrabajos, turnos, turnosDelivery, shiftRanges ***REMOVED*** = useApp();

  return useMemo(() => ***REMOVED***
    const turnosTradicionales = Array.isArray(turnos) ? turnos : [];
    const turnosDeliveryValidos = Array.isArray(turnosDelivery) ? turnosDelivery : [];
    const todosLosTurnos = [...turnosTradicionales, ...turnosDeliveryValidos];
    const trabajosValidos = Array.isArray(todosLosTrabajos) ? todosLosTrabajos : [];

    const obtenerFechasSemana = (offset) => ***REMOVED***
      const hoy = new Date();
      const diaSemana = hoy.getDay();
      const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1; // Lunes como inicio
      const fechaInicio = new Date(hoy);
      fechaInicio.setDate(hoy.getDate() - diffInicio + (offset * 7));
      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + 6);
      fechaFin.setHours(23, 59, 59, 999);
      return ***REMOVED*** fechaInicio, fechaFin ***REMOVED***;
    ***REMOVED***;

    const ***REMOVED*** fechaInicio, fechaFin ***REMOVED*** = obtenerFechasSemana(offsetSemanas);

    // Filtrar usando `fechaInicio` para nuevos turnos o `fecha` para los antiguos.
    const turnosSemana = todosLosTurnos.filter(turno => ***REMOVED***
      const fechaClave = turno.fechaInicio || turno.fecha;
      if (!fechaClave) return false;
      const fechaTurno = new Date(fechaClave + 'T00:00:00');
      return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
    ***REMOVED***);

    const initialState = ***REMOVED***
      fechaInicio, fechaFin, totalGanado: 0, horasTrabajadas: 0, totalTurnos: 0,
      gananciaPorDia: ***REMOVED*** "Lunes": ***REMOVED******REMOVED***, "Martes": ***REMOVED******REMOVED***, "Miércoles": ***REMOVED******REMOVED***, "Jueves": ***REMOVED******REMOVED***, "Viernes": ***REMOVED******REMOVED***, "Sábado": ***REMOVED******REMOVED***, "Domingo": ***REMOVED******REMOVED*** ***REMOVED***,
      gananciaPorTrabajo: [], tiposDeTurno: ***REMOVED******REMOVED***, diasTrabajados: 0, promedioHorasPorDia: 0, promedioPorHora: 0, diaMasProductivo: ***REMOVED*** dia: 'Ninguno', ganancia: 0 ***REMOVED***
    ***REMOVED***;

    if (turnosSemana.length === 0) return initialState;

    // Inicializar acumuladores
    const acc = ***REMOVED***
      totalGanado: 0, horasTrabajadas: 0,
      gananciaPorDia: ***REMOVED*** "Lunes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Martes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Miércoles": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Jueves": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Viernes": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Sábado": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED***, "Domingo": ***REMOVED*** ganancia: 0, horas: 0, turnos: 0 ***REMOVED*** ***REMOVED***,
      gananciaPorTrabajo: ***REMOVED******REMOVED***, tiposDeTurno: ***REMOVED******REMOVED***
    ***REMOVED***;

    turnosSemana.forEach(turno => ***REMOVED***
      const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;

      // Usar `calculatePayment` como única fuente para horas y ganancias.
      const ***REMOVED*** hours, totalWithDiscount ***REMOVED*** = calculatePayment(turno);
      const ganancia = totalWithDiscount;

      acc.totalGanado += ganancia;
      acc.horasTrabajadas += hours;

      const fechaTurno = new Date((turno.fechaInicio || turno.fecha) + 'T00:00:00');
      const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const nombreDia = nombresDias[fechaTurno.getDay()];
      acc.gananciaPorDia[nombreDia].ganancia += ganancia;
      acc.gananciaPorDia[nombreDia].horas += hours;
      acc.gananciaPorDia[nombreDia].turnos += 1;
      
      if (!acc.gananciaPorTrabajo[trabajo.id]) ***REMOVED***
        acc.gananciaPorTrabajo[trabajo.id] = ***REMOVED*** id: trabajo.id, nombre: trabajo.nombre, color: trabajo.color || trabajo.avatarColor || '#EC4899', ganancia: 0, horas: 0, turnos: 0, tipo: trabajo.tipo || 'tradicional' ***REMOVED***;
      ***REMOVED***
      acc.gananciaPorTrabajo[trabajo.id].ganancia += ganancia;
      acc.gananciaPorTrabajo[trabajo.id].horas += hours;
      acc.gananciaPorTrabajo[trabajo.id].turnos += 1;
      
      const tipo = obtenerTipoTurno(turno.horaInicio, shiftRanges);
      if (!acc.tiposDeTurno[tipo]) ***REMOVED***
        acc.tiposDeTurno[tipo] = ***REMOVED*** turnos: 0, horas: 0, ganancia: 0 ***REMOVED***;
      ***REMOVED***
      acc.tiposDeTurno[tipo].turnos += 1;
      acc.tiposDeTurno[tipo].horas += hours;
      acc.tiposDeTurno[tipo].ganancia += ganancia;
    ***REMOVED***);

    const diasTrabajados = Object.values(acc.gananciaPorDia).filter(dia => dia.turnos > 0).length;
    const promedioHorasPorDia = diasTrabajados > 0 ? acc.horasTrabajadas / diasTrabajados : 0;
    const promedioPorHora = acc.horasTrabajadas > 0 ? acc.totalGanado / acc.horasTrabajadas : 0;
    const diaMasProductivo = Object.entries(acc.gananciaPorDia).reduce((max, [dia, datos]) => (datos.ganancia > max.ganancia ? ***REMOVED*** dia, ...datos ***REMOVED*** : max), ***REMOVED*** dia: 'Ninguno', ganancia: 0 ***REMOVED***);

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
      diaMasProductivo,
    ***REMOVED***;
  // Se actualiza el array de dependencias.
  ***REMOVED***, [todosLosTrabajos, turnos, turnosDelivery, offsetSemanas, calculatePayment, shiftRanges]);
***REMOVED***;

 // La función auxiliar ahora usa los `shiftRanges` del usuario para ser consistente.
const obtenerTipoTurno = (horaInicio, ranges) => ***REMOVED***
  try ***REMOVED***
    if (!horaInicio) return 'mixto';
    const hora = parseInt(horaInicio.split(':')[0]);
    const shiftRanges = ranges || ***REMOVED*** dayStart: 6, afternoonStart: 14, nightStart: 20 ***REMOVED***;

    if (hora >= shiftRanges.dayStart && hora < shiftRanges.afternoonStart) return 'diurno';
    if (hora >= shiftRanges.afternoonStart && hora < shiftRanges.nightStart) return 'tarde';
    return 'noche';
  ***REMOVED*** catch (error) ***REMOVED***
    return 'mixto';
  ***REMOVED***
***REMOVED***;