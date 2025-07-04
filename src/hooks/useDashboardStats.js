// src/hooks/useDashboardStats.js

import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

export const useDashboardStats = () => {
  const { trabajos, trabajosDelivery, turnos, turnosDelivery, calcularPago } = useApp();

  // Función para calcular horas - definida fuera del useMemo
  const calcularHoras = (inicio, fin) => {
    const [horaIni, minIni] = inicio.split(':').map(n => parseInt(n));
    const [horaFn, minFn] = fin.split(':').map(n => parseInt(n));

    let inicioMinutos = horaIni * 60 + minIni;
    let finMinutos = horaFn * 60 + minFn;

    if (finMinutos <= inicioMinutos) {
      finMinutos += 24 * 60;
    }

    return (finMinutos - inicioMinutos) / 60;
  };

  const stats = useMemo(() => {
    // Combinar todos los trabajos y turnos
    const todosLosTrabajos = [...(trabajos || []), ...(trabajosDelivery || [])];
    const turnosTradicionales = Array.isArray(turnos) ? turnos : [];
    const turnosDeliveryValidos = Array.isArray(turnosDelivery) ? turnosDelivery : [];
    const todosLosTurnos = [...turnosTradicionales, ...turnosDeliveryValidos];

    if (todosLosTurnos.length === 0) {
      return {
        totalGanado: 0,
        horasTrabajadas: 0,
        promedioPorHora: 0,
        turnosTotal: 0,
        trabajoMasRentable: null,
        proximoTurno: null,
        turnosEstaSemana: 0,
        gananciasEstaSemana: 0,
        tendenciaSemanal: 0,
        trabajosFavoritos: [],
        proyeccionMensual: 0,
        diasTrabajados: 0
      };
    }

    let totalGanado = 0;
    let horasTrabajadas = 0;
    const gananciaPorTrabajo = {};
    const fechasUnicas = new Set();
    
    // Calcular fecha de inicio de esta semana
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay() + 1);
    inicioSemana.setHours(0, 0, 0, 0);
    
    const inicioSemanaAnterior = new Date(inicioSemana);
    inicioSemanaAnterior.setDate(inicioSemana.getDate() - 7);
    
    let turnosEstaSemana = 0;
    let gananciasEstaSemana = 0;
    let gananciasSemanaAnterior = 0;

    todosLosTurnos.forEach(turno => {
      const trabajo = todosLosTrabajos?.find(t => t.id === turno.trabajoId);
      if (!trabajo) {
        console.warn('⚠️ Dashboard: Trabajo no encontrado para turno:', turno.id);
        return;
      }

      let ganancia = 0;
      let horas = 0;

      // Calcular ganancia según el tipo
      if (turno.tipo === 'delivery' || trabajo.tipo === 'delivery') {
        ganancia = turno.gananciaTotal || 0;
        horas = calcularHoras(turno.horaInicio, turno.horaFin);
      } else {
        const resultado = calcularPago(turno);
        ganancia = resultado.totalConDescuento || 0;
        horas = resultado.horas || 0;
      }

      totalGanado += ganancia;
      horasTrabajadas += horas;
      fechasUnicas.add(turno.fecha);

      // Estadísticas por trabajo
      if (!gananciaPorTrabajo[trabajo.id]) {
        gananciaPorTrabajo[trabajo.id] = {
          trabajo,
          ganancia: 0,
          horas: 0,
          turnos: 0
        };
      }
      gananciaPorTrabajo[trabajo.id].ganancia += ganancia;
      gananciaPorTrabajo[trabajo.id].horas += horas;
      gananciaPorTrabajo[trabajo.id].turnos += 1;

      // Estadísticas semanales
      const fechaTurno = new Date(turno.fecha + 'T00:00:00');
      if (fechaTurno >= inicioSemana) {
        turnosEstaSemana++;
        gananciasEstaSemana += ganancia;
      } else if (fechaTurno >= inicioSemanaAnterior && fechaTurno < inicioSemana) {
        gananciasSemanaAnterior += ganancia;
      }
    });

    // Encontrar trabajo más rentable
    const trabajoMasRentable = Object.values(gananciaPorTrabajo)
      .sort((a, b) => b.ganancia - a.ganancia)[0] || null;

    // Calcular tendencia semanal
    const tendenciaSemanal = gananciasSemanaAnterior > 0 
      ? ((gananciasEstaSemana - gananciasSemanaAnterior) / gananciasSemanaAnterior) * 100 
      : 0;

    // Encontrar próximo turno
    const hoyStr = hoy.toISOString().split('T')[0];
    const turnosFuturos = todosLosTurnos.filter(turno => turno.fecha >= hoyStr)
      .sort((a, b) => {
        if (a.fecha === b.fecha) {
          return a.horaInicio.localeCompare(b.horaInicio);
        }
        return a.fecha.localeCompare(b.fecha);
      });
    
    const proximoTurno = turnosFuturos[0] || null;

    // Top 3 trabajos favoritos
    const trabajosFavoritos = Object.values(gananciaPorTrabajo)
      .sort((a, b) => b.turnos - a.turnos)
      .slice(0, 3);

    // Proyección mensual
    const proyeccionMensual = gananciasEstaSemana * 4.33;

    const resultado = {
      totalGanado,
      horasTrabajadas,
      promedioPorHora: horasTrabajadas > 0 ? totalGanado / horasTrabajadas : 0,
      turnosTotal: todosLosTurnos.length,
      trabajoMasRentable,
      proximoTurno,
      turnosEstaSemana,
      gananciasEstaSemana,
      tendenciaSemanal,
      trabajosFavoritos,
      proyeccionMensual,
      diasTrabajados: fechasUnicas.size
    };

    return resultado;
  }, [trabajos, trabajosDelivery, turnos, turnosDelivery, calcularPago]);

  // Función para formatear fecha
  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr + 'T00:00:00');
    const hoy = new Date();
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);
    
    const fechaLocal = fecha.toDateString();
    const hoyLocal = hoy.toDateString();
    const mañanaLocal = mañana.toDateString();
    
    if (fechaLocal === hoyLocal) return 'Hoy';
    if (fechaLocal === mañanaLocal) return 'Mañana';
    
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return {
    ...stats,
    formatearFecha
  };
};