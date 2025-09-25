// src/hooks/useWeeklyStats.js - VERSION CORREGIDA para tipos de turno

import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { determinarTipoTurno } from '../utils/shiftDetailsUtils';

export const useWeeklyStats = (offsetSemanas = 0) => {
  const { calculatePayment, todosLosTrabajos, turnos, turnosDelivery, shiftRanges } = useApp();

  return useMemo(() => {
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

    // Filtrar turnos de la semana
    const turnosSemana = todosLosTurnos.filter(turno => {
      const fechaClave = turno.fechaInicio || turno.fecha;
      if (!fechaClave) return false;
      const fechaTurno = new Date(fechaClave + 'T00:00:00');
      return fechaTurno >= fechaInicio && fechaTurno <= fechaFin;
    });

    const initialState = {
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
      tiposDeTurno: {}, // Inicializado como objeto vacío, no undefined
      diasTrabajados: 0,
      promedioHorasPorDia: 0,
      promedioPorHora: 0,
      diaMasProductivo: { dia: 'Ninguno', ganancia: 0 }
    };

    if (turnosSemana.length === 0) return initialState;

    // Inicializar acumuladores
    const acc = {
      totalGanado: 0,
      horasTrabajadas: 0,
      gananciaPorDia: {
        "Lunes": { ganancia: 0, horas: 0, turnos: 0 },
        "Martes": { ganancia: 0, horas: 0, turnos: 0 },
        "Miércoles": { ganancia: 0, horas: 0, turnos: 0 },
        "Jueves": { ganancia: 0, horas: 0, turnos: 0 },
        "Viernes": { ganancia: 0, horas: 0, turnos: 0 },
        "Sábado": { ganancia: 0, horas: 0, turnos: 0 },
        "Domingo": { ganancia: 0, horas: 0, turnos: 0 }
      },
      gananciaPorTrabajo: {},
      tiposDeTurno: {}
    };

    turnosSemana.forEach(turno => {
      try {
        const trabajo = trabajosValidos.find(t => t.id === turno.trabajoId);
        if (!trabajo) {
          console.warn('Trabajo no encontrado para turno:', turno.id);
          return;
        }

        // Calcular horas y ganancia usando calculatePayment
        const resultado = calculatePayment(turno);
        const ganancia = resultado.totalWithDiscount || 0;
        const horas = resultado.hours || 0;

        acc.totalGanado += ganancia;
        acc.horasTrabajadas += horas;

        // Determinar día de la semana
        const fechaTurno = new Date((turno.fechaInicio || turno.fecha) + 'T00:00:00');
        const nombresDias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const nombreDia = nombresDias[fechaTurno.getDay()];
        
        acc.gananciaPorDia[nombreDia].ganancia += ganancia;
        acc.gananciaPorDia[nombreDia].horas += horas;
        acc.gananciaPorDia[nombreDia].turnos += 1;

        // Estadísticas por trabajo
        if (!acc.gananciaPorTrabajo[trabajo.id]) {
          acc.gananciaPorTrabajo[trabajo.id] = {
            id: trabajo.id,
            nombre: trabajo.nombre,
            color: trabajo.color || trabajo.colorAvatar || '#EC4899',
            ganancia: 0,
            horas: 0,
            turnos: 0,
            tipo: trabajo.tipo || 'tradicional'
          };
        }
        acc.gananciaPorTrabajo[trabajo.id].ganancia += ganancia;
        acc.gananciaPorTrabajo[trabajo.id].horas += horas;
        acc.gananciaPorTrabajo[trabajo.id].turnos += 1;

        // DETERMINAR TIPO DE TURNO CORRECTAMENTE
        let tipoTurno = 'mixto'; // Por defecto
        
        // Para turnos de delivery
        if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') {
          tipoTurno = 'delivery';
        } 
        // Para turnos de fin de semana
        else if (fechaTurno.getDay() === 6) { // Sábado
          tipoTurno = 'sabado';
        } 
        else if (fechaTurno.getDay() === 0) { // Domingo
          tipoTurno = 'domingo';
        }
        // Para turnos tradicionales de días de semana
        else if (shiftRanges) {
          tipoTurno = determinarTipoTurno(turno, shiftRanges);
        }

        // Agregar a estadísticas por tipo
        if (!acc.tiposDeTurno[tipoTurno]) {
          acc.tiposDeTurno[tipoTurno] = { 
            turnos: 0, 
            horas: 0, 
            ganancia: 0 
          };
        }
        acc.tiposDeTurno[tipoTurno].turnos += 1;
        acc.tiposDeTurno[tipoTurno].horas += horas;
        acc.tiposDeTurno[tipoTurno].ganancia += ganancia;

        console.log(`Turno ${turno.id}: ${turno.horaInicio}-${turno.horaFin} en ${nombreDia} → Tipo: ${tipoTurno}`);

      } catch (error) {
        console.error('Error procesando turno:', turno.id, error);
      }
    });

    console.log('Tipos de turno calculados:', acc.tiposDeTurno);

    // Calcular estadísticas finales
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
  }, [todosLosTrabajos, turnos, turnosDelivery, offsetSemanas, calculatePayment, shiftRanges]);
};