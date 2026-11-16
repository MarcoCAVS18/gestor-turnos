// src/hooks/useMonthlyStats.js
// Fundación de la expansión de Estadísticas (ver STATS_EXPANSION_ROADMAP):
// navegación mensual + stats del mes visible reutilizando el motor único
// (calculationService.calculateMonthlyStats vía StatsContext). El export
// mantiene su propio procesador — no se toca para preservar sus números.

import { useState, useMemo, useCallback } from 'react';
import { useStats } from '../contexts/StatsContext';
import {
  calculateMonthlyHoursGoal,
  calculateMonthWeeklyBreakdown,
} from '../services/calculationService';

const TREND_MONTHS = 6;

export const useMonthlyStats = () => {
  const {
    calculateMonthlyStats,
    weeklyHoursGoal,
    loading,
    allShifts,
    calculatePayment,
  } = useStats();

  // 0 = mes actual, -1 = mes pasado, etc. No se permite navegar al futuro.
  const [monthOffset, setMonthOffset] = useState(0);

  const { year, month } = useMemo(() => {
    // setDate(1) antes de setMonth evita el desborde de fin de mes
    // (ej.: 31 de julio + setMonth(-1) saltaría el 31 de junio inexistente)
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthOffset);
    return { year: d.getFullYear(), month: d.getMonth() };
  }, [monthOffset]);

  const monthlyData = useMemo(
    () => calculateMonthlyStats(year, month),
    [calculateMonthlyStats, year, month]
  );

  const previousMonthData = useMemo(() => {
    const d = new Date(year, month - 1, 1);
    return calculateMonthlyStats(d.getFullYear(), d.getMonth());
  }, [calculateMonthlyStats, year, month]);

  // Últimos N meses terminando en el mes visible, de más viejo a más nuevo
  const monthlyTrend = useMemo(() => {
    return Array.from({ length: TREND_MONTHS }, (_, i) => {
      const d = new Date(year, month - (TREND_MONTHS - 1 - i), 1);
      const stats = calculateMonthlyStats(d.getFullYear(), d.getMonth());
      return { year: d.getFullYear(), month: d.getMonth(), ...stats };
    });
  }, [calculateMonthlyStats, year, month]);

  const monthlyHoursGoal = useMemo(
    () => calculateMonthlyHoursGoal(weeklyHoursGoal, year, month),
    [weeklyHoursGoal, year, month]
  );

  // Semanas lunes-a-domingo del mes con cumplimiento por semana (Tus horas)
  const monthWeeks = useMemo(
    () => calculateMonthWeeklyBreakdown(year, month, allShifts, calculatePayment, weeklyHoursGoal),
    [year, month, allShifts, calculatePayment, weeklyHoursGoal]
  );

  // null cuando el usuario no configuró meta semanal
  const goalProgress = monthlyHoursGoal
    ? Math.min(monthlyData.totalHours / monthlyHoursGoal, 1)
    : null;
  const goalMet = monthlyHoursGoal
    ? monthlyData.totalHours >= monthlyHoursGoal
    : null;

  const goToPreviousMonth = useCallback(() => setMonthOffset((o) => o - 1), []);
  const goToNextMonth = useCallback(() => setMonthOffset((o) => Math.min(o + 1, 0)), []);

  return {
    loading,
    monthOffset,
    setMonthOffset,
    goToPreviousMonth,
    goToNextMonth,
    year,
    month,
    monthlyData,
    previousMonthData,
    monthlyTrend,
    monthWeeks,
    weeklyHoursGoal,
    monthlyHoursGoal,
    goalProgress,
    goalMet,
  };
};

export default useMonthlyStats;
