// src/hooks/useDeliveryStats.js

import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

export const useDeliveryStats = (periodo = 'mes') => {
  const { turnos, trabajos } = useApp();
  
  return useMemo(() => {
    // Filtrar solo trabajos y turnos de delivery
    const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');
    const turnosDelivery = turnos.filter(t => t.tipo === 'delivery');
    
    // Si no hay datos, retornar estructura vacía
    if (turnosDelivery.length === 0) {
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
        mejorDia: null,
        peorDia: null,
        mejorTurno: null,
        turnosPorPlataforma: {},
        estadisticasPorDia: {},
        tendencia: 0
      };
    }
    
    // Calcular fechas según el periodo
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
        fechaInicio = new Date(0); // Todos los tiempos
    }
    
    // Filtrar turnos por periodo
    const turnosPeriodo = turnosDelivery.filter(turno => {
      const fechaTurno = new Date(turno.fecha);
      return fechaTurno >= fechaInicio;
    });
    
    // Calcular estadísticas básicas
    let totalGanado = 0;
    let totalPropinas = 0;
    let totalPedidos = 0;
    let totalKilometros = 0;
    let totalGastos = 0;
    let totalHoras = 0;
    
    const estadisticasPorDia = {};
    const turnosPorPlataforma = {};
    
    turnosPeriodo.forEach(turno => {
      const trabajo = trabajosDelivery.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;
      
      // Sumar totales
      totalGanado += turno.gananciaTotal || 0;
      totalPropinas += turno.propinas || 0;
      totalPedidos += turno.cantidadPedidos || 0;
      totalKilometros += turno.kilometros || 0;
      totalGastos += turno.gastosCombustible || 0;
      
      // Calcular horas trabajadas
      const [horaIni, minIni] = turno.horaInicio.split(':').map(Number);
      const [horaFin, minFin] = turno.horaFin.split(':').map(Number);
      let horas = (horaFin + minFin/60) - (horaIni + minIni/60);
      if (horas < 0) horas += 24;
      totalHoras += horas;
      
      // Estadísticas por día
      if (!estadisticasPorDia[turno.fecha]) {
        estadisticasPorDia[turno.fecha] = {
          ganancia: 0,
          propinas: 0,
          pedidos: 0,
          kilometros: 0,
          gastos: 0,
          horas: 0,
          turnos: []
        };
      }
      
      estadisticasPorDia[turno.fecha].ganancia += turno.gananciaTotal || 0;
      estadisticasPorDia[turno.fecha].propinas += turno.propinas || 0;
      estadisticasPorDia[turno.fecha].pedidos += turno.cantidadPedidos || 0;
      estadisticasPorDia[turno.fecha].kilometros += turno.kilometros || 0;
      estadisticasPorDia[turno.fecha].gastos += turno.gastosCombustible || 0;
      estadisticasPorDia[turno.fecha].horas += horas;
      estadisticasPorDia[turno.fecha].turnos.push({
        ...turno,
        trabajo,
        horas
      });
      
      // Estadísticas por plataforma
      const plataforma = trabajo.plataforma || trabajo.nombre;
      if (!turnosPorPlataforma[plataforma]) {
        turnosPorPlataforma[plataforma] = {
          nombre: trabajo.nombre,
          color: trabajo.color,
          icono: trabajo.icono,
          totalGanado: 0,
          totalPedidos: 0,
          totalPropinas: 0,
          totalHoras: 0,
          turnos: 0
        };
      }
      
      turnosPorPlataforma[plataforma].totalGanado += turno.gananciaTotal || 0;
      turnosPorPlataforma[plataforma].totalPedidos += turno.cantidadPedidos || 0;
      turnosPorPlataforma[plataforma].totalPropinas += turno.propinas || 0;
      turnosPorPlataforma[plataforma].totalHoras += horas;
      turnosPorPlataforma[plataforma].turnos += 1;
    });
    
    // Encontrar mejor y peor día
    let mejorDia = null;
    let peorDia = null;
    let mejorGanancia = 0;
    let peorGanancia = Infinity;
    
    Object.entries(estadisticasPorDia).forEach(([fecha, stats]) => {
      const gananciaLiquida = stats.ganancia - stats.gastos;
      
      if (gananciaLiquida > mejorGanancia) {
        mejorGanancia = gananciaLiquida;
        mejorDia = {
          fecha,
          ganancia: stats.ganancia,
          gananciaLiquida,
          pedidos: stats.pedidos,
          horas: stats.horas
        };
      }
      
      if (gananciaLiquida < peorGanancia && gananciaLiquida > 0) {
        peorGanancia = gananciaLiquida;
        peorDia = {
          fecha,
          ganancia: stats.ganancia,
          gananciaLiquida,
          pedidos: stats.pedidos,
          horas: stats.horas
        };
      }
    });
    
    // Encontrar mejor turno individual
    let mejorTurno = null;
    let mejorGananciaTurno = 0;
    
    turnosPeriodo.forEach(turno => {
      const gananciaLiquida = (turno.gananciaTotal || 0) - (turno.gastosCombustible || 0);
      if (gananciaLiquida > mejorGananciaTurno) {
        mejorGananciaTurno = gananciaLiquida;
        mejorTurno = {
          ...turno,
          gananciaLiquida,
          trabajo: trabajosDelivery.find(t => t.id === turno.trabajoId)
        };
      }
    });
    
    // Calcular tendencia (comparar con periodo anterior)
    const diasPeriodo = Object.keys(estadisticasPorDia).length;
    const gananciaPromedioDiaria = diasPeriodo > 0 ? totalGanado / diasPeriodo : 0;
    
    // TODO: Implementar comparación con periodo anterior para tendencia
    const tendencia = 0;
    
    // Calcular promedios y totales finales
    const gananciaLiquida = totalGanado - totalGastos;
    const promedioPorPedido = totalPedidos > 0 ? totalGanado / totalPedidos : 0;
    const promedioPorKilometro = totalKilometros > 0 ? totalGanado / totalKilometros : 0;
    const promedioPorHora = totalHoras > 0 ? totalGanado / totalHoras : 0;
    
    return {
      // Totales
      totalGanado,
      totalPropinas,
      totalPedidos,
      totalKilometros,
      totalGastos,
      gananciaLiquida,
      totalHoras,
      
      // Promedios
      promedioPorPedido,
      promedioPorKilometro,
      promedioPorHora,
      promedioPropinasPorPedido: totalPedidos > 0 ? totalPropinas / totalPedidos : 0,
      
      // Mejores/Peores
      mejorDia,
      peorDia,
      mejorTurno,
      
      // Por categoría
      turnosPorPlataforma,
      estadisticasPorDia,
      
      // Tendencia
      tendencia,
      gananciaPromedioDiaria,
      
      // Metadata
      diasTrabajados: Object.keys(estadisticasPorDia).length,
      turnosRealizados: turnosPeriodo.length
    };
  }, [turnos, trabajos, periodo]);
};

// Hook para estadísticas en tiempo real
export const useDeliveryRealtime = () => {
  const { turnos, trabajos } = useApp();
  
  return useMemo(() => {
    const hoy = new Date().toISOString().split('T')[0];
    const turnosHoy = turnos.filter(t => t.tipo === 'delivery' && t.fecha === hoy);
    const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');
    
    let gananciaHoy = 0;
    let pedidosHoy = 0;
    let propinasHoy = 0;
    let kilometrosHoy = 0;
    
    turnosHoy.forEach(turno => {
      gananciaHoy += turno.gananciaTotal || 0;
      pedidosHoy += turno.cantidadPedidos || 0;
      propinasHoy += turno.propinas || 0;
      kilometrosHoy += turno.kilometros || 0;
    });
    
    return {
      activo: turnosHoy.length > 0,
      gananciaHoy,
      pedidosHoy,
      propinasHoy,
      kilometrosHoy,
      promedioPorPedidoHoy: pedidosHoy > 0 ? gananciaHoy / pedidosHoy : 0,
      turnosHoy: turnosHoy.length,
      plataformasActivas: [...new Set(turnosHoy.map(t => {
        const trabajo = trabajosDelivery.find(w => w.id === t.trabajoId);
        return trabajo?.nombre || 'Desconocido';
      }))]
    };
  }, [turnos, trabajos]);
};