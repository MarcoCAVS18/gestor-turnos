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
        promedioPropinasPorPedido: 0,
        mejorDia: null,
        mejorTurno: null,
        turnosPorPlataforma: ***REMOVED******REMOVED***,
        estadisticasPorVehiculo: ***REMOVED******REMOVED***,
        estadisticasPorDia: ***REMOVED******REMOVED***,
        tendencia: 0,
        diasTrabajados: 0,
        turnosRealizados: 0,
        totalHoras: 0,
        eficienciaCombustible: 0, // km por peso gastado
        costoPorKilometro: 0
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
    const estadisticasPorVehiculo = ***REMOVED******REMOVED***;
    
    turnosPeriodo.forEach(turno => ***REMOVED***
      const trabajo = trabajosDelivery.find(t => t.id === turno.trabajoId);
      if (!trabajo) return;
      
      // Sumar totales
      const gananciaBase = turno.gananciaBase || 0;
      const propinas = turno.propinas || 0;
      totalGanado += gananciaBase + propinas;
      totalPropinas += propinas;
      totalPedidos += turno.numeroPedidos || 0;
      totalKilometros += turno.kilometros || 0;
      totalGastos += turno.gastoCombustible || 0;
      
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
      
      estadisticasPorDia[turno.fecha].ganancia += gananciaBase + propinas;
      estadisticasPorDia[turno.fecha].propinas += propinas;
      estadisticasPorDia[turno.fecha].pedidos += turno.numeroPedidos || 0;
      estadisticasPorDia[turno.fecha].kilometros += turno.kilometros || 0;
      estadisticasPorDia[turno.fecha].gastos += turno.gastoCombustible || 0;
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
          color: trabajo.colorAvatar || trabajo.color,
          totalGanado: 0,
          totalPedidos: 0,
          totalPropinas: 0,
          totalHoras: 0,
          totalKilometros: 0,
          totalGastos: 0,
          turnos: 0
        ***REMOVED***;
      ***REMOVED***
      
      turnosPorPlataforma[plataforma].totalGanado += gananciaBase + propinas;
      turnosPorPlataforma[plataforma].totalPedidos += turno.numeroPedidos || 0;
      turnosPorPlataforma[plataforma].totalPropinas += propinas;
      turnosPorPlataforma[plataforma].totalHoras += horas;
      turnosPorPlataforma[plataforma].totalKilometros += turno.kilometros || 0;
      turnosPorPlataforma[plataforma].totalGastos += turno.gastoCombustible || 0;
      turnosPorPlataforma[plataforma].turnos += 1;
      
      // Estadísticas por vehículo
      const vehiculo = trabajo.vehiculo || 'No especificado';
      if (!estadisticasPorVehiculo[vehiculo]) ***REMOVED***
        estadisticasPorVehiculo[vehiculo] = ***REMOVED***
          nombre: vehiculo,
          totalGanado: 0,
          totalPedidos: 0,
          totalKilometros: 0,
          totalGastos: 0,
          totalHoras: 0,
          turnos: 0,
          eficiencia: 0 // km por peso gastado
        ***REMOVED***;
      ***REMOVED***
      
      estadisticasPorVehiculo[vehiculo].totalGanado += gananciaBase + propinas;
      estadisticasPorVehiculo[vehiculo].totalPedidos += turno.numeroPedidos || 0;
      estadisticasPorVehiculo[vehiculo].totalKilometros += turno.kilometros || 0;
      estadisticasPorVehiculo[vehiculo].totalGastos += turno.gastoCombustible || 0;
      estadisticasPorVehiculo[vehiculo].totalHoras += horas;
      estadisticasPorVehiculo[vehiculo].turnos += 1;
    ***REMOVED***);
    
    // Calcular eficiencia para cada vehículo
    Object.values(estadisticasPorVehiculo).forEach(vehiculo => ***REMOVED***
      if (vehiculo.totalGastos > 0) ***REMOVED***
        vehiculo.eficiencia = vehiculo.totalKilometros / vehiculo.totalGastos;
      ***REMOVED***
    ***REMOVED***);
    
    // Encontrar mejor y peor día
    let mejorDia = null;
    let mejorGanancia = 0;
    
    Object.entries(estadisticasPorDia).forEach(([fecha, stats]) => ***REMOVED***
      const gananciaLiquida = stats.ganancia - stats.gastos;
      
      if (gananciaLiquida > mejorGanancia) ***REMOVED***
        mejorGanancia = gananciaLiquida;
        mejorDia = ***REMOVED***
          fecha,
          ganancia: stats.ganancia,
          gananciaLiquida,
          pedidos: stats.pedidos,
          horas: stats.horas,
          kilometros: stats.kilometros,
          gastos: stats.gastos
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***);
    
    // Encontrar mejor turno individual
    let mejorTurno = null;
    let mejorGananciaTurno = 0;
    
    turnosPeriodo.forEach(turno => ***REMOVED***
      const gananciaLiquida = (turno.gananciaBase || 0) + (turno.propinas || 0) - (turno.gastoCombustible || 0);
      if (gananciaLiquida > mejorGananciaTurno) ***REMOVED***
        mejorGananciaTurno = gananciaLiquida;
        mejorTurno = ***REMOVED***
          ...turno,
          gananciaLiquida,
          trabajo: trabajosDelivery.find(t => t.id === turno.trabajoId)
        ***REMOVED***;
      ***REMOVED***
    ***REMOVED***);
    
    // Calcular promedios y totales finales
    const gananciaLiquida = totalGanado - totalGastos;
    const promedioPorPedido = totalPedidos > 0 ? totalGanado / totalPedidos : 0;
    const promedioPorKilometro = totalKilometros > 0 ? totalGanado / totalKilometros : 0;
    const promedioPorHora = totalHoras > 0 ? totalGanado / totalHoras : 0;
    const promedioPropinasPorPedido = totalPedidos > 0 ? totalPropinas / totalPedidos : 0;
    const eficienciaCombustible = totalGastos > 0 ? totalKilometros / totalGastos : 0;
    const costoPorKilometro = totalKilometros > 0 ? totalGastos / totalKilometros : 0;
    
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
      promedioPropinasPorPedido,
      eficienciaCombustible,
      costoPorKilometro,
      
      // Mejores/Peores
      mejorDia,
      mejorTurno,
      
      // Por categoría
      turnosPorPlataforma,
      estadisticasPorVehiculo,
      estadisticasPorDia,
      
      // Metadata
      diasTrabajados: Object.keys(estadisticasPorDia).length,
      turnosRealizados: turnosPeriodo.length
    ***REMOVED***;
  ***REMOVED***, [turnos, trabajos, periodo]);
***REMOVED***;