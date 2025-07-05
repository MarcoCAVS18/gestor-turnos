import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

export const useWeeklyStats = (offsetSemanas = 0) => {
  // Usamos `calculatePayment` y `shiftRanges` del contexto.
  const { calculatePayment, todosLosTrabajos, turnos, turnosDelivery, shiftRanges } = useApp();

  return useMemo(() => {
    const turnosTradicionales = Array.isArray(turnos) ? turnos : [];
    const turnosDeliveryValidos = Array.isArray(turnosDelivery) ? turnosDelivery : [];
    const todosLosTurnos = [...turnosTradicionales, ...turnosDeliveryValidos];
    const trabajosValidos = Array.isArray(todosLosTrabajos) ? todosLosTrabajos : [];

    const obtenerFechasSemana = (offset) => {
      const hoy = new Date();
      const diaSemana = hoy.getDay();
      const diffInicio = diaSemana === 0 ? 6 : diaSemana - 1; // Lunes como inicio
      const fechaInicio = new Date(hoy);
      fechaInicio.setDate(hoy.getDate() - diffInicio + (offset * 7));
      fechaInicio.setHours(0, 0, 0, 0);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + 6);
      fechaFin.setHours(23, 59, 59, 999);
      return { fechaInicio, fechaFin };
    };

    const { fechaInicio, fechaFin } = obtenerFechasSemana(offsetSemanas);

    // Filtrar usando `fechaInicio` para nuevos turnos o `fecha` para los antiguos.
    const turnosSemana = todosLosTurnos.filter(turno => {
      const fechaClave = turno.fechaInicio || turno.fecha;
      if (!fechaClave) return false;
      const fechaTurno = new Date(fechaClave + 'T00:00:00');
      return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
    });

    const initialState = {
      fechaInicio, fechaFin, totalGanado: 0, horasTrabajadas: 0, totalTurnos: 0,
      gananciaPorDia: { "Lunes": {}, "Martes": {}, "Miércoles": {}, "Jueves": {}, "Viernes": {}, "Sábado": {}, "Domingo": {} },
      gananciaPorTrabajo: [], tiposDeTurno: {}, diasTrabajados: 0, promedioHorasPorDia: 0, promedioPorHora: 0, diaMasProductivo: { dia: 'Ninguno', ganancia: 0 }
    };

    if (turnosSemana.length === 0) return initialState;

    // Inicializar acumuladores
    const acc = {
      totalGanado: 0, horasTrabajadas: 0,
      gananciaPorDia: { "Lunes": { ganancia: 0, horas: 0, turnos: 0 }, "Martes": { ganancia: 0, horas: 0, turnos: 0 }, "Miércoles": { ganancia: 0, horas: 0, turnos: 0 }, "Jueves": { ganancia: 0, horas: 0, turnos: 0 }, "Viernes": { ganancia: 0, horas: 0, turnos: 0 }, "Sábado": { ganancia: 0, horas: 0, turnos: 0 }, "Domingo": { ganancia: 0, horas: 0, turnos: 0 } },
      gananciaPorTrabajo: {}, tiposDeTurno: {}
    };

    turnosSemana.forEach(turno => {
      const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;

      // Usar `calculatePayment` como única fuente para horas y ganancias.
      const { hours, totalWithDiscount } = calculatePayment(turno);
      const ganancia = totalWithDiscount;

      acc.totalGanado += ganancia;
      acc.horasTrabajadas += hours;

      const fechaTurno = new Date((turno.fechaInicio || turno.fecha) + 'T00:00:00');
      const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const nombreDia = nombresDias[fechaTurno.getDay()];
      acc.gananciaPorDia[nombreDia].ganancia += ganancia;
      acc.gananciaPorDia[nombreDia].horas += hours;
      acc.gananciaPorDia[nombreDia].turnos += 1;
      
      if (!acc.gananciaPorTrabajo[trabajo.id]) {
        acc.gananciaPorTrabajo[trabajo.id] = { id: trabajo.id, nombre: trabajo.nombre, color: trabajo.color || trabajo.avatarColor || '#EC4899', ganancia: 0, horas: 0, turnos: 0, tipo: trabajo.tipo || 'tradicional' };
      }
      acc.gananciaPorTrabajo[trabajo.id].ganancia += ganancia;
      acc.gananciaPorTrabajo[trabajo.id].horas += hours;
      acc.gananciaPorTrabajo[trabajo.id].turnos += 1;
      
      const tipo = obtenerTipoTurno(turno.horaInicio, shiftRanges);
      if (!acc.tiposDeTurno[tipo]) {
        acc.tiposDeTurno[tipo] = { turnos: 0, horas: 0, ganancia: 0 };
      }
      acc.tiposDeTurno[tipo].turnos += 1;
      acc.tiposDeTurno[tipo].horas += hours;
      acc.tiposDeTurno[tipo].ganancia += ganancia;
    });

    const diasTrabajados = Object.values(acc.gananciaPorDia).filter(dia => dia.turnos > 0).length;
    const promedioHorasPorDia = diasTrabajados > 0 ? acc.horasTrabajadas / diasTrabajados : 0;
    const promedioPorHora = acc.horasTrabajadas > 0 ? acc.totalGanado / acc.horasTrabajadas : 0;
    const diaMasProductivo = Object.entries(acc.gananciaPorDia).reduce((max, [dia, datos]) => (datos.ganancia > max.ganancia ? { dia, ...datos } : max), { dia: 'Ninguno', ganancia: 0 });

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
      diaMasProductivo,
    };
  // Se actualiza el array de dependencias.
  }, [todosLosTrabajos, turnos, turnosDelivery, offsetSemanas, calculatePayment, shiftRanges]);
};

 // La función auxiliar ahora usa los `shiftRanges` del usuario para ser consistente.
const obtenerTipoTurno = (horaInicio, ranges) => {
  try {
    if (!horaInicio) return 'mixto';
    const hora = parseInt(horaInicio.split(':')[0]);
    const shiftRanges = ranges || { dayStart: 6, afternoonStart: 14, nightStart: 20 };

    if (hora >= shiftRanges.dayStart && hora < shiftRanges.afternoonStart) return 'diurno';
    if (hora >= shiftRanges.afternoonStart && hora < shiftRanges.nightStart) return 'tarde';
    return 'noche';
  } catch (error) {
    return 'mixto';
  }
};