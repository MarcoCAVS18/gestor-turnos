// src/hooks/useWeeklyStats.js

import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

export const useWeeklyStats = (turnos = [], trabajos = [], offsetSemanas = 0) => {
  const { calcularPago, calcularHoras } = useApp();

  return useMemo(() => {
    const turnosValidos = Array.isArray(turnos) ? turnos : [];
    const trabajosValidos = Array.isArray(trabajos) ? trabajos : [];

    // Función para obtener fechas de una semana específica
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
    const fechaInicioISO = fechaInicio.toISOString().split('T')[0];
    const fechaFinISO = fechaFin.toISOString().split('T')[0];

    // Filtrar turnos de la semana específica
    const turnosSemana = turnosValidos.filter(turno => {
      return turno.fecha >= fechaInicioISO && turno.fecha <= fechaFinISO;
    });

    // Si no hay datos, retornar estructura por defecto
    if (turnosSemana.length === 0) {
      return {
        fechaInicio,
        fechaFin,
        totalGanado: 0,
        horasTrabajadas: 0,
        totalTurnos: 0,
        gananciaPorDia: {
          "Lunes": { ganancia: 0, horas: 0, turnos: 0 },
          "Martes": { ganancia: 0, horas: 0, turnos: 0 },
          "Miércoles": { ganancia: 0, horas: 0, turnos: 0 },
          "Jueves": { ganancia: 0, horas: 0, turnos: 0 },
          "Viernes": { ganancia: 0, horas: 0, turnos: 0 },
          "Sábado": { ganancia: 0, horas: 0, turnos: 0 },
          "Domingo": { ganancia: 0, horas: 0, turnos: 0 }
        },
        gananciaPorTrabajo: [],
        tiposDeTurno: {},
        diasTrabajados: 0,
        promedioHorasPorDia: 0,
        promedioPorHora: 0,
        diaMasProductivo: { dia: 'Ninguno', ganancia: 0, horas: 0, turnos: 0 }
      };
    }

    // Calcular estadísticas
    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorDia = {
      "Lunes": { ganancia: 0, horas: 0, turnos: 0 },
      "Martes": { ganancia: 0, horas: 0, turnos: 0 },
      "Miércoles": { ganancia: 0, horas: 0, turnos: 0 },
      "Jueves": { ganancia: 0, horas: 0, turnos: 0 },
      "Viernes": { ganancia: 0, horas: 0, turnos: 0 },
      "Sábado": { ganancia: 0, horas: 0, turnos: 0 },
      "Domingo": { ganancia: 0, horas: 0, turnos: 0 }
    };

    const gananciaPorTrabajo = {};
    const tiposDeTurno = {};

    turnosSemana.forEach(turno => {
      const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;

      const horas = calcularHoras ? calcularHoras(turno.horaInicio, turno.horaFin) : 0;
      const resultadoPago = calcularPago ? calcularPago(turno) : { totalConDescuento: 0, horas: 0 };
      const ganancia = resultadoPago.totalConDescuento || 0;

      totalGanado += ganancia;
      horasTrabajadas += horas;

      // Estadísticas por día
      const fecha = new Date(turno.fecha + 'T00:00:00');
      const diaSemana = fecha.getDay();
      const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const nombreDia = nombresDias[diaSemana];

      gananciaPorDia[nombreDia].ganancia += ganancia;
      gananciaPorDia[nombreDia].horas += horas;
      gananciaPorDia[nombreDia].turnos += 1;

      // Estadísticas por trabajo
      if (!gananciaPorTrabajo[trabajo.id]) {
        gananciaPorTrabajo[trabajo.id] = {
          nombre: trabajo.nombre,
          color: trabajo.color,
          ganancia: 0,
          horas: 0,
          turnos: 0
        };
      }
      gananciaPorTrabajo[trabajo.id].ganancia += ganancia;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      gananciaPorTrabajo[trabajo.id].turnos += 1;

      // Estadísticas por tipo de turno
      const tipo = obtenerTipoTurno(turno.horaInicio) || 'mixto';
      if (!tiposDeTurno[tipo]) {
        tiposDeTurno[tipo] = { turnos: 0, horas: 0, ganancia: 0 };
      }
      tiposDeTurno[tipo].turnos += 1;
      tiposDeTurno[tipo].horas += horas;
      tiposDeTurno[tipo].ganancia += ganancia;
    });

    // Calcular métricas adicionales
    const diasTrabajados = Object.values(gananciaPorDia).filter(dia => dia.turnos > 0).length;
    const promedioHorasPorDia = diasTrabajados > 0 ? horasTrabajadas / diasTrabajados : 0;
    const promedioPorHora = horasTrabajadas > 0 ? totalGanado / horasTrabajadas : 0;

    // Encontrar el día más productivo
    const diaMasProductivo = Object.entries(gananciaPorDia).reduce((max, [dia, datos]) => {
      return datos.ganancia > max.ganancia ? { dia, ...datos } : max;
    }, { dia: 'Ninguno', ganancia: 0, horas: 0, turnos: 0 });

    return {
      fechaInicio,
      fechaFin,
      totalGanado,
      horasTrabajadas,
      totalTurnos: turnosSemana.length,
      gananciaPorDia,
      gananciaPorTrabajo: Object.values(gananciaPorTrabajo).sort((a, b) => b.ganancia - a.ganancia),
      tiposDeTurno,
      diasTrabajados,
      promedioHorasPorDia,
      promedioPorHora,
      diaMasProductivo
    };
  }, [turnos, trabajos, offsetSemanas, calcularPago, calcularHoras]);
};

// Función auxiliar para tipo de turno (mantenemos esta)
const obtenerTipoTurno = (horaInicio) => {
  try {
    const hora = parseInt(horaInicio.split(':')[0]);

    if (hora >= 6 && hora < 14) return 'diurno';
    if (hora >= 14 && hora < 20) return 'tarde';
    if (hora >= 20 || hora < 6) return 'noche';

    return 'mixto';
  } catch (error) {
    return 'mixto';
  }
};