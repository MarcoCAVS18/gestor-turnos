import React, ***REMOVED*** createContext, useContext, useState, useMemo, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** useDataContext ***REMOVED*** from './DataContext';
import ***REMOVED*** useDeliveryContext ***REMOVED*** from './DeliveryContext';
import ***REMOVED*** useConfigContext ***REMOVED*** from './ConfigContext';
import * as calculationService from '../services/calculationService';
import ***REMOVED*** createSafeDate ***REMOVED*** from '../utils/time';

const StatsContext = createContext();

export const useStats = () => ***REMOVED***
  return useContext(StatsContext);
***REMOVED***;

export const StatsProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  // Hooks de los contextos de datos y configuración
  const ***REMOVED*** trabajos, turnos, loading: dataLoading ***REMOVED*** = useDataContext();
  const ***REMOVED*** trabajosDelivery, turnosDelivery, loading: deliveryLoading ***REMOVED*** = useDeliveryContext();
  const ***REMOVED*** shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes, deliveryEnabled, weeklyHoursGoal, thematicColors, loading: configLoading ***REMOVED*** = useConfigContext();

  // Estado para el control de la semana
  const [offsetSemana, setOffsetSemana] = useState(0);

  // Combinar todos los trabajos y turnos
  const todosLosTrabajos = useMemo(() => [...trabajos, ...trabajosDelivery], [trabajos, trabajosDelivery]);
  const allTurnos = useMemo(() => [...turnos, ...turnosDelivery], [turnos, turnosDelivery]);

  // Loading unificado
  const loading = useMemo(() => dataLoading || deliveryLoading || configLoading, [dataLoading, deliveryLoading, configLoading]);

  // Crear una función de cálculo de pago pre-configurada
  const calculatePayment = useCallback((turno) => ***REMOVED***
    return calculationService.calculatePayment(
      turno,
      todosLosTrabajos,
      shiftRanges,
      defaultDiscount,
      smokoEnabled,
      smokoMinutes
    );
  ***REMOVED***, [todosLosTrabajos, shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes]);

  // Calcular estadísticas semanales para la semana actual y la anterior
  const datosActuales = useMemo(() => ***REMOVED***
    return calculationService.calculateWeeklyStats(***REMOVED***
      turnos,
      turnosDelivery,
      todosLosTrabajos,
      calculatePayment,
      shiftRanges,
      offsetSemanas: offsetSemana,
    ***REMOVED***);
  ***REMOVED***, [turnos, turnosDelivery, todosLosTrabajos, calculatePayment, shiftRanges, offsetSemana]);

  const datosAnteriores = useMemo(() => ***REMOVED***
    return calculationService.calculateWeeklyStats(***REMOVED***
      turnos,
      turnosDelivery,
      todosLosTrabajos,
      calculatePayment,
      shiftRanges,
      offsetSemanas: offsetSemana - 1,
    ***REMOVED***);
  ***REMOVED***, [turnos, turnosDelivery, todosLosTrabajos, calculatePayment, shiftRanges, offsetSemana]);

  // Calcular estadísticas de delivery
  const deliveryStats = useMemo(() => ***REMOVED***
    return calculationService.calculateDeliveryStats(***REMOVED***
      trabajosDelivery,
      turnosDelivery,
      periodo: 'mes' // Hardcoded to 'mes' as it was in Estadisticas.jsx
    ***REMOVED***);
  ***REMOVED***, [trabajosDelivery, turnosDelivery]);

  // NEW: Calcular datos para gráfico de evolución semanal
  const weeklyEvolutionData = useMemo(() => ***REMOVED***
    const weekNames = ['Esta semana', 'Sem pasada', 'Hace 2 sem', 'Hace 3 sem'];
    return [0, -1, -2, -3].map((offset, index) => ***REMOVED***
      const stats = calculationService.calculateWeeklyStats(***REMOVED***
        turnos,
        turnosDelivery,
        todosLosTrabajos,
        calculatePayment,
        shiftRanges,
        offsetSemanas: offset,
      ***REMOVED***);
      return ***REMOVED***
        semana: weekNames[index],
        ganancia: stats.totalGanado || 0
      ***REMOVED***;
    ***REMOVED***).reverse(); // Reverse to have the oldest week first
  ***REMOVED***, [turnos, turnosDelivery, todosLosTrabajos, calculatePayment, shiftRanges]);


  // Memoized `turnosPorFecha` (lógica existente)
  const turnosPorFecha = useMemo(() => ***REMOVED***
    const turnosMap = ***REMOVED******REMOVED***;
    allTurnos.forEach(turno => ***REMOVED***
      const fechaPrincipal = turno.fechaInicio || turno.fecha;
      if (fechaPrincipal) ***REMOVED***
        if (!turnosMap[fechaPrincipal]) ***REMOVED***
          turnosMap[fechaPrincipal] = [];
        ***REMOVED***
        turnosMap[fechaPrincipal].push(turno);
      ***REMOVED***

      const esNocturno = turno.cruzaMedianoche || (turno.horaInicio && turno.horaFin && turno.horaInicio.split(':')[0] > turno.horaFin.split(':')[0]);

      if (esNocturno && fechaPrincipal) ***REMOVED***
        let fechaFin = turno.fechaFin;
        if (!fechaFin) ***REMOVED***
          const fechaInicioDate = createSafeDate(fechaPrincipal);
          const fechaFinCalculada = new Date(fechaInicioDate);
          fechaFinCalculada.setDate(fechaFinCalculada.getDate() + 1);
          fechaFin = fechaFinCalculada.toISOString().split('T')[0];
        ***REMOVED***
        if (fechaFin && fechaFin !== fechaPrincipal) ***REMOVED***
          if (!turnosMap[fechaFin]) ***REMOVED***
            turnosMap[fechaFin] = [];
          ***REMOVED***
          if (!turnosMap[fechaFin].some(t => t.id === turno.id)) ***REMOVED***
            turnosMap[fechaFin].push(turno);
          ***REMOVED***
        ***REMOVED***
      ***REMOVED***
    ***REMOVED***);
    return turnosMap;
  ***REMOVED***, [allTurnos]);
  
  // Memoized function to calculate monthly stats (lógica existente)
  const calculateMonthlyStats = useCallback((year, month) => ***REMOVED***
    return calculationService.calculateMonthlyStats(year, month, turnos, turnosDelivery, calculatePayment);
  ***REMOVED***, [turnos, turnosDelivery, calculatePayment]);

  // Memoized value for current month's stats (lógica existente)
  const currentMonthStats = useMemo(() => ***REMOVED***
    const now = new Date();
    return calculateMonthlyStats(now.getFullYear(), now.getMonth());
  ***REMOVED***, [calculateMonthlyStats]);

  const value = ***REMOVED***
    // Estado de carga
    loading,
    
    // Datos y funciones existentes
    allTurnos,
    turnosPorFecha,
    calculateMonthlyStats,
    currentMonthStats,

    // Nuevos datos y funciones para estadísticas semanales
    datosActuales,
    datosAnteriores,
    offsetSemana,
    setOffsetSemana,
    todosLosTrabajos,
    weeklyEvolutionData,
    
    // Estadísticas de delivery
    deliveryStats,

    // Configuración importante
    deliveryEnabled,
    weeklyHoursGoal,
    thematicColors,
    smokoEnabled,
    smokoMinutes,

    // Para no romper otras dependencias que puedan usarlo directamente
    calculatePayment, 
  ***REMOVED***;

  return (
    <StatsContext.Provider value=***REMOVED***value***REMOVED***>
      ***REMOVED***children***REMOVED***
    </StatsContext.Provider>
  );
***REMOVED***;