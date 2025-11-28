import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useDataContext } from './DataContext';
import { useDeliveryContext } from './DeliveryContext';
import { useConfigContext } from './ConfigContext';
import * as calculationService from '../services/calculationService';
import { createSafeDate } from '../utils/time';

const StatsContext = createContext();

export const useStats = () => {
  return useContext(StatsContext);
};

export const StatsProvider = ({ children }) => {
  // Hooks de los contextos de datos y configuración
  const { trabajos, turnos, loading: dataLoading } = useDataContext();
  const { trabajosDelivery, turnosDelivery, loading: deliveryLoading } = useDeliveryContext();
  const { shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes, deliveryEnabled, weeklyHoursGoal, thematicColors, loading: configLoading } = useConfigContext();

  // Estado para el control de la semana
  const [offsetSemana, setOffsetSemana] = useState(0);

  // Combinar todos los trabajos y turnos
  const todosLosTrabajos = useMemo(() => [...trabajos, ...trabajosDelivery], [trabajos, trabajosDelivery]);
  const allTurnos = useMemo(() => [...turnos, ...turnosDelivery], [turnos, turnosDelivery]);

  // Loading unificado
  const loading = useMemo(() => dataLoading || deliveryLoading || configLoading, [dataLoading, deliveryLoading, configLoading]);

  // Crear una función de cálculo de pago pre-configurada
  const calculatePayment = useCallback((turno) => {
    return calculationService.calculatePayment(
      turno,
      todosLosTrabajos,
      shiftRanges,
      defaultDiscount,
      smokoEnabled,
      smokoMinutes
    );
  }, [todosLosTrabajos, shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes]);

  // Calcular estadísticas semanales para la semana actual y la anterior
  const datosActuales = useMemo(() => {
    return calculationService.calculateWeeklyStats({
      turnos,
      turnosDelivery,
      todosLosTrabajos,
      calculatePayment,
      shiftRanges,
      offsetSemanas: offsetSemana,
    });
  }, [turnos, turnosDelivery, todosLosTrabajos, calculatePayment, shiftRanges, offsetSemana]);

  const datosAnteriores = useMemo(() => {
    return calculationService.calculateWeeklyStats({
      turnos,
      turnosDelivery,
      todosLosTrabajos,
      calculatePayment,
      shiftRanges,
      offsetSemanas: offsetSemana - 1,
    });
  }, [turnos, turnosDelivery, todosLosTrabajos, calculatePayment, shiftRanges, offsetSemana]);

  // Calcular estadísticas de delivery
  const deliveryStats = useMemo(() => {
    return calculationService.calculateDeliveryStats({
      trabajosDelivery,
      turnosDelivery,
      periodo: 'mes' // Hardcoded to 'mes' as it was in Estadisticas.jsx
    });
  }, [trabajosDelivery, turnosDelivery]);

  // NEW: Calcular datos para gráfico de evolución semanal
  const weeklyEvolutionData = useMemo(() => {
    const weekNames = ['Esta semana', 'Sem pasada', 'Hace 2 sem', 'Hace 3 sem'];
    return [0, -1, -2, -3].map((offset, index) => {
      const stats = calculationService.calculateWeeklyStats({
        turnos,
        turnosDelivery,
        todosLosTrabajos,
        calculatePayment,
        shiftRanges,
        offsetSemanas: offset,
      });
      return {
        semana: weekNames[index],
        ganancia: stats.totalGanado || 0
      };
    }).reverse(); // Reverse to have the oldest week first
  }, [turnos, turnosDelivery, todosLosTrabajos, calculatePayment, shiftRanges]);


  // Memoized `turnosPorFecha` (lógica existente)
  const turnosPorFecha = useMemo(() => {
    const turnosMap = {};
    allTurnos.forEach(turno => {
      const fechaPrincipal = turno.fechaInicio || turno.fecha;
      if (fechaPrincipal) {
        if (!turnosMap[fechaPrincipal]) {
          turnosMap[fechaPrincipal] = [];
        }
        turnosMap[fechaPrincipal].push(turno);
      }

      const esNocturno = turno.cruzaMedianoche || (turno.horaInicio && turno.horaFin && turno.horaInicio.split(':')[0] > turno.horaFin.split(':')[0]);

      if (esNocturno && fechaPrincipal) {
        let fechaFin = turno.fechaFin;
        if (!fechaFin) {
          const fechaInicioDate = createSafeDate(fechaPrincipal);
          const fechaFinCalculada = new Date(fechaInicioDate);
          fechaFinCalculada.setDate(fechaFinCalculada.getDate() + 1);
          fechaFin = fechaFinCalculada.toISOString().split('T')[0];
        }
        if (fechaFin && fechaFin !== fechaPrincipal) {
          if (!turnosMap[fechaFin]) {
            turnosMap[fechaFin] = [];
          }
          if (!turnosMap[fechaFin].some(t => t.id === turno.id)) {
            turnosMap[fechaFin].push(turno);
          }
        }
      }
    });
    return turnosMap;
  }, [allTurnos]);
  
  // Memoized function to calculate monthly stats (lógica existente)
  const calculateMonthlyStats = useCallback((year, month) => {
    return calculationService.calculateMonthlyStats(year, month, turnos, turnosDelivery, calculatePayment);
  }, [turnos, turnosDelivery, calculatePayment]);

  // Memoized value for current month's stats (lógica existente)
  const currentMonthStats = useMemo(() => {
    const now = new Date();
    return calculateMonthlyStats(now.getFullYear(), now.getMonth());
  }, [calculateMonthlyStats]);

  const value = {
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
  };

  return (
    <StatsContext.Provider value={value}>
      {children}
    </StatsContext.Provider>
  );
};