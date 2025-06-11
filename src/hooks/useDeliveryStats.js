// src/hooks/useDeliveryStats.js

import ***REMOVED*** useMemo ***REMOVED*** from 'react';
import ***REMOVED*** useApp ***REMOVED*** from '../contexts/AppContext';

export const useDeliveryStats = (periodo = 'mes') => ***REMOVED***
  const ***REMOVED*** turnos, trabajos ***REMOVED*** = useApp();
  
  return useMemo(() => ***REMOVED***
    // Filtrar solo trabajos y turnos de delivery
    const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');
    const turnosDelivery = turnos.filter(t => t.tipo === 'delivery');
    
    // Si no hay datos, retornar estructura vacía
    if (turnosDelivery.length === 0) ***REMOVED***
      return ***REMOVED***
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
        turnosPorPlataforma: ***REMOVED******REMOVED***,
        estadisticasPorDia: ***REMOVED******REMOVED***,
        tendencia: 0
      ***REMOVED***;
    ***REMOVED***
    
    // Calcular fechas según el periodo
    const hoy = new Date();
    let fechaInicio;
    
    switch (periodo) ***REMOVED***
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
    ***REMOVED***
    
    // Filtrar turnos por periodo
    const turnosPeriodo = turnosDelivery.filter(turno => ***REMOVED***
      const fechaTurno = new Date(turno.fecha);
      return fechaTurno >= fechaInicio;
    ***REMOVED***);
    
    // Calcular estadísticas básicas
    let totalGanado = 0;
    let totalPropinas = 0;
    let totalPedidos = 0;
    let totalKilometros = 0;
    let totalGastos = 0;
    let totalHoras = 0;
    
    const estadisticasPorDia = ***REMOVED******REMOVED***;
    const turnosPorPlataforma = ***REMOVED******REMOVED***;
    
    turnosPeriodo.forEach(turno => ***REMOVED***
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
      if (!estadisticasPorDia[turno.fecha]) ***REMOVED***
        estadisticasPorDia[turno.fecha] = ***REMOVED***
          ganancia: 0,
          propinas: 0,
          pedidos: 0,
          kilometros: 0,
          gastos: 0,
          horas: 0,
          turnos: []
        ***REMOVED***;
      ***REMOVED***
      
      estadisticasPorDia[turno.fecha].ganancia += turno.gananciaTotal || 0;
      estadisticasPorDia[turno.fecha].propinas += turno.propinas || 0;
      estadisticasPorDia[turno.fecha].pedidos += turno.cantidadPedidos || 0;
      estadisticasPorDia[turno.fecha].kilometros += turno.kilometros || 0;
      estadisticasPorDia[turno.fecha].gastos += turno.gastosCombustible || 0;
      estadisticasPorDia[turno.fecha].horas += horas;
      estadisticasPorDia[turno.fecha].turnos.push(***REMOVED***
        ...turno,
        trabajo,
        horas
      ***REMOVED***);
      
      // Estadísticas por plataforma
      const plataforma = trabajo.plataforma || trabajo.nombre;
      if (!turnosPorPlataforma[plataforma]) ***REMOVED***
        turnosPorPlataforma[plataforma] = ***REMOVED***
          nombre: trabajo.nombre,
          color: trabajo.color,
          icono: trabajo.icono,
          totalGanado: 0,
          totalPedidos: 0,
          totalPropinas: 0,
          totalHoras: 0,
          turnos: 0
        ***REMOVED***;
      ***REMOVED***
      
      turnosPorPlataforma[plataforma].totalGanado += turno.gananciaTotal || 0;
      turnosPorPlataforma[plataforma].totalPedidos += turno.cantidadPedidos || 0;
      turnosPorPlataforma[plataforma].totalPropinas += turno.propinas || 0;
      turnosPorPlataforma[plataforma].totalHoras += horas;
      turnosPorPlataforma[plataforma].turnos += 1;
    ***REMOVED***);
    
    // Encontrar mejor y peor día
    let mejorDia = null;
    let peorDia = null;
    let mejorGanancia = 0;
    let peorGanancia = Infinity;
    
    Object.entries(estadisticasPorDia).forEach(([fecha, stats]) => ***REMOVED***
      const gananciaLiquida = stats.ganancia - stats.gastos;
      
      if (gananciaLiquida > mejorGanancia) ***REMOVED***
        mejorGanancia = gananciaLiquida;
        mejorDia = ***REMOVED***
          fecha,
          ganancia: stats.ganancia,
          gananciaLiquida,
          pedidos: stats.pedidos,
          horas: stats.horas
        ***REMOVED***;
      ***REMOVED***
      
      if (gananciaLiquida < peorGanancia && gananciaLiquida > 0) ***REMOVED***
        peorGanancia = gananciaLiquida;
        peorDia = ***REMOVED***
          fecha,
          ganancia: stats.ganancia,
          gananciaLiquida,
          pedidos: stats.pedidos,
          horas: stats.horas
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***);
    
    // Encontrar mejor turno individual
    let mejorTurno = null;
    let mejorGananciaTurno = 0;
    
    turnosPeriodo.forEach(turno => ***REMOVED***
      const gananciaLiquida = (turno.gananciaTotal || 0) - (turno.gastosCombustible || 0);
      if (gananciaLiquida > mejorGananciaTurno) ***REMOVED***
        mejorGananciaTurno = gananciaLiquida;
        mejorTurno = ***REMOVED***
          ...turno,
          gananciaLiquida,
          trabajo: trabajosDelivery.find(t => t.id === turno.trabajoId)
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***);
    
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
    
    return ***REMOVED***
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
    ***REMOVED***;
  ***REMOVED***, [turnos, trabajos, periodo]);
***REMOVED***;

// Hook para estadísticas en tiempo real
export const useDeliveryRealtime = () => ***REMOVED***
  const ***REMOVED*** turnos, trabajos ***REMOVED*** = useApp();
  
  return useMemo(() => ***REMOVED***
    const hoy = new Date().toISOString().split('T')[0];
    const turnosHoy = turnos.filter(t => t.tipo === 'delivery' && t.fecha === hoy);
    const trabajosDelivery = trabajos.filter(t => t.tipo === 'delivery');
    
    let gananciaHoy = 0;
    let pedidosHoy = 0;
    let propinasHoy = 0;
    let kilometrosHoy = 0;
    
    turnosHoy.forEach(turno => ***REMOVED***
      gananciaHoy += turno.gananciaTotal || 0;
      pedidosHoy += turno.cantidadPedidos || 0;
      propinasHoy += turno.propinas || 0;
      kilometrosHoy += turno.kilometros || 0;
    ***REMOVED***);
    
    return ***REMOVED***
      activo: turnosHoy.length > 0,
      gananciaHoy,
      pedidosHoy,
      propinasHoy,
      kilometrosHoy,
      promedioPorPedidoHoy: pedidosHoy > 0 ? gananciaHoy / pedidosHoy : 0,
      turnosHoy: turnosHoy.length,
      plataformasActivas: [...new Set(turnosHoy.map(t => ***REMOVED***
        const trabajo = trabajosDelivery.find(w => w.id === t.trabajoId);
        return trabajo?.nombre || 'Desconocido';
      ***REMOVED***))]
    ***REMOVED***;
  ***REMOVED***, [turnos, trabajos]);
***REMOVED***;