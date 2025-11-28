import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useDataContext } from './DataContext';
import { useDeliveryContext } from './DeliveryContext';
import { useConfigContext } from './ConfigContext';
import * as calculationService from '../services/calculationService';

const CalculationsContext = createContext();

export const useCalculations = () => {
  return useContext(CalculationsContext);
};

export const CalculationsProvider = ({ children }) => {
  // Consumir datos de otros contextos
  const { trabajos } = useDataContext();
  const { trabajosDelivery } = useDeliveryContext();
  const { shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes } = useConfigContext();

  // Combinar todos los trabajos para pasarlos a las funciones de cálculo
  const allJobs = useMemo(() => [...trabajos, ...trabajosDelivery], [trabajos, trabajosDelivery]);

  // Crear versiones memoizadas y pre-configuradas de las funciones de cálculo
  const calculatePayment = useCallback((shift) => {
    return calculationService.calculatePayment(
      shift,
      allJobs,
      shiftRanges,
      defaultDiscount,
      smokoEnabled,
      smokoMinutes
    );
  }, [allJobs, shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes]);

  const calculateDailyTotal = useCallback((dailyShifts) => {
    // La función de cálculo necesita una referencia a la función calculatePayment principal
    // que ya tiene el contexto correcto (allJobs, settings, etc.)
    const calculatePaymentForDailyTotal = (shift) => calculatePayment(shift);
    return calculationService.calculateDailyTotal(dailyShifts, calculatePaymentForDailyTotal);
  }, [calculatePayment]);
  
  const value = {
    // Exponer las funciones de cálculo puras
    calculateHours: calculationService.calculateHours,
    // Exponer las funciones pre-configuradas
    calculatePayment,
    calculateDailyTotal,
  };

  return (
    <CalculationsContext.Provider value={value}>
      {children}
    </CalculationsContext.Provider>
  );
};