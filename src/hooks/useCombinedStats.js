
// src/hooks/useCombinedStats.js
import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { calculateWeeklyStats } from '../utils/statsCalculations';

export const useCombinedStats = ({
  periodo = 'mes',
  offsetSemanas = 0,
  weeklyHoursGoal,
  datosAnteriores,
}) => {
  const {
    turnos,
    turnosDelivery,
    todosLosTrabajos,
    calculatePayment,
    shiftRanges,
    trabajosDelivery,
  } = useApp();

  const weeklyStats = useMemo(() => {
    return calculateWeeklyStats({
      turnos,
      turnosDelivery,
      todosLosTrabajos,
      calculatePayment,
      shiftRanges,
      offsetSemanas,
    });
  }, [
    turnos,
    turnosDelivery,
    todosLosTrabajos,
    calculatePayment,
    shiftRanges,
    offsetSemanas,
  ]);

  const deliveryStats = useMemo(() => {
    const trabajosDeliveryValidos = Array.isArray(trabajosDelivery)
      ? trabajosDelivery
      : [];
    const turnosDeliveryValidos = Array.isArray(turnosDelivery)
      ? turnosDelivery
      : [];

    if (turnosDeliveryValidos.length === 0) {
      return {
        totalGanado: 0,
        totalPropinas: 0,
        totalPedidos: 0,
        totalKilometros: 0,
        totalGastos: 0,
        gananciaLiquida: 0,
        promedioPorPedido: 0,
        promedioPorKilometro: 0,
        promedioPorHora: 0,
        promedioPropinasPorPedido: 0,
        mejorDia: null,
        mejorTurno: null,
        turnosPorPlataforma: {},
        estadisticasPorVehiculo: {},
        estadisticasPorDia: {},
        tendencia: 0,
        diasTrabajados: 0,
        turnosRealizados: 0,
        totalHoras: 0,
        eficienciaCombustible: 0,
        costoPorKilometro: 0,
      };
    }

    const hoy = new Date();
    let fechaInicio;

    switch (periodo) {
      case 'semana':
        fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() - 7);
        break;
      case 'mes':
        fechaInicio = new Date(hoy);
        fechaInicio.setMonth(hoy.getMonth() - 1);
        break;
      case 'año':
        fechaInicio = new Date(hoy);
        fechaInicio.setFullYear(hoy.getFullYear() - 1);
        break;
      default:
        fechaInicio = new Date(0);
    }

    const turnosPeriodo = turnosDeliveryValidos.filter((turno) => {
      const fechaTurno = new Date(turno.fecha);
      return fechaTurno >= fechaInicio;
    });

    let totalGanado = 0;
    let totalPropinas = 0;
    let totalPedidos = 0;
    let totalKilometros = 0;
    let totalGastos = 0;
    let totalHoras = 0;

    const estadisticasPorDia = {};
    const turnosPorPlataforma = {};
    const estadisticasPorVehiculo = {};

    turnosPeriodo.forEach((turno) => {
      const trabajo = trabajosDeliveryValidos.find(
        (t) => t.id === turno.trabajoId
      );
      if (!trabajo) {
        console.warn('⚠️ Trabajo delivery no encontrado para turno:', turno.id);
        return;
      }

      const gananciaBase = turno.gananciaTotal || 0;
      const propinas = turno.propinas || 0;
      const pedidos = turno.numeroPedidos || 0;
      const kilometros = turno.kilometros || 0;
      const gastos = turno.gastoCombustible || 0;

      totalGanado += gananciaBase;
      totalPropinas += propinas;
      totalPedidos += pedidos;
      totalKilometros += kilometros;
      totalGastos += gastos;

      const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
      const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
      let horas = horaFin + minFin / 60 - (horaIni + minIni / 60);
      if (horas < 0) horas += 24;
      totalHoras += horas;

      if (!estadisticasPorDia[turno.fecha]) {
        estadisticasPorDia[turno.fecha] = {
          ganancia: 0,
          propinas: 0,
          pedidos: 0,
          kilometros: 0,
          gastos: 0,
          horas: 0,
          turnos: [],
        };
      }

      estadisticasPorDia[turno.fecha].ganancia += gananciaBase;
      estadisticasPorDia[turno.fecha].propinas += propinas;
      estadisticasPorDia[turno.fecha].pedidos += pedidos;
      estadisticasPorDia[turno.fecha].kilometros += kilometros;
      estadisticasPorDia[turno.fecha].gastos += gastos;
      estadisticasPorDia[turno.fecha].horas += horas;
      estadisticasPorDia[turno.fecha].turnos.push({
        ...turno,
        trabajo,
        horas,
      });

      const plataforma = trabajo.plataforma || trabajo.nombre;
      if (!turnosPorPlataforma[plataforma]) {
        turnosPorPlataforma[plataforma] = {
          nombre: trabajo.nombre,
          color: trabajo.colorAvatar || trabajo.color || '#10B981',
          totalGanado: 0,
          totalPedidos: 0,
          totalPropinas: 0,
          totalHoras: 0,
          totalKilometros: 0,
          totalGastos: 0,
          turnos: 0,
        };
      }

      turnosPorPlataforma[plataforma].totalGanado += gananciaBase;
      turnosPorPlataforma[plataforma].totalPedidos += pedidos;
      turnosPorPlataforma[plataforma].totalPropinas += propinas;
      turnosPorPlataforma[plataforma].totalHoras += horas;
      turnosPorPlataforma[plataforma].totalKilometros += kilometros;
      turnosPorPlataforma[plataforma].totalGastos += gastos;
      turnosPorPlataforma[plataforma].turnos += 1;

      const vehiculo = trabajo.vehiculo || 'No especificado';
      if (!estadisticasPorVehiculo[vehiculo]) {
        estadisticasPorVehiculo[vehiculo] = {
          nombre: vehiculo,
          totalGanado: 0,
          totalPedidos: 0,
          totalKilometros: 0,
          totalGastos: 0,
          totalHoras: 0,
          turnos: 0,
          eficiencia: 0,
        };
      }

      estadisticasPorVehiculo[vehiculo].totalGanado += gananciaBase;
      estadisticasPorVehiculo[vehiculo].totalPedidos += pedidos;
      estadisticasPorVehiculo[vehiculo].totalKilometros += kilometros;
      estadisticasPorVehiculo[vehiculo].totalGastos += gastos;
      estadisticasPorVehiculo[vehiculo].totalHoras += horas;
      estadisticasPorVehiculo[vehiculo].turnos += 1;
    });

    Object.values(estadisticasPorVehiculo).forEach((vehiculo) => {
      if (vehiculo.totalGastos > 0) {
        vehiculo.eficiencia = vehiculo.totalKilometros / vehiculo.totalGastos;
      }
    });

    let mejorDia = null;
    let mejorGanancia = 0;

    Object.entries(estadisticasPorDia).forEach(([fecha, stats]) => {
      const gananciaLiquida = stats.ganancia - stats.gastos;

      if (gananciaLiquida > mejorGanancia) {
        mejorGanancia = gananciaLiquida;
        mejorDia = {
          fecha,
          ganancia: stats.ganancia,
          gananciaLiquida,
          pedidos: stats.pedidos,
          horas: stats.horas,
          kilometros: stats.kilometros,
          gastos: stats.gastos,
        };
      }
    });

    let mejorTurno = null;
    let mejorGananciaTurno = 0;

    turnosPeriodo.forEach((turno) => {
      const gananciaLiquida =
        (turno.gananciaTotal || 0) - (turno.gastoCombustible || 0);
      if (gananciaLiquida > mejorGananciaTurno) {
        mejorGananciaTurno = gananciaLiquida;
        mejorTurno = {
          ...turno,
          gananciaLiquida,
          trabajo: trabajosDeliveryValidos.find(
            (t) => t.id === turno.trabajoId
          ),
        };
      }
    });

    const gananciaLiquida = totalGanado - totalGastos;
    const promedioPorPedido =
      totalPedidos > 0 ? totalGanado / totalPedidos : 0;
    const promedioPorKilometro =
      totalKilometros > 0 ? totalGanado / totalKilometros : 0;
    const promedioPorHora = totalHoras > 0 ? totalGanado / totalHoras : 0;
    const promedioPropinasPorPedido =
      totalPedidos > 0 ? totalPropinas / totalPedidos : 0;
    const eficienciaCombustible =
      totalGastos > 0 ? totalKilometros / totalGastos : 0;
    const costoPorKilometro =
      totalKilometros > 0 ? totalGastos / totalKilometros : 0;

    const resultado = {
      totalGanado,
      totalPropinas,
      totalPedidos,
      totalKilometros,
      totalGastos,
      gananciaLiquida,
      totalHoras,
      promedioPorPedido,
      promedioPorKilometro,
      promedioPorHora,
      promedioPropinasPorPedido,
      eficienciaCombustible,
      costoPorKilometro,
      mejorDia,
      mejorTurno,
      turnosPorPlataforma,
      estadisticasPorVehiculo,
      estadisticasPorDia,
      diasTrabajados: Object.keys(estadisticasPorDia).length,
      turnosRealizados: turnosPeriodo.length,
    };

    return resultado;
  }, [trabajosDelivery, turnosDelivery, periodo]);

  return { weeklyStats, deliveryStats, weeklyHoursGoal, datosAnteriores };
};
