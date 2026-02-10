// src/contexts/CalculationsContext.jsx

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
  // Consume data from other contexts
  const { works } = useDataContext();
  const { deliveryWork } = useDeliveryContext();
  const {
    shiftRanges,
    defaultDiscount,
    smokoEnabled,
    smokoMinutes,
    holidayCountry,
    holidayRegion,
    useAutoHolidays
  } = useConfigContext();

  // Combine all work to pass to calculation functions
  const allJobs = useMemo(() => [...works, ...deliveryWork], [works, deliveryWork]);

  // Create memoized and pre-configured versions of the calculation functions
  const calculatePayment = useCallback((shift) => {
    return calculationService.calculatePayment(
      shift,
      allJobs,
      shiftRanges,
      defaultDiscount,
      smokoEnabled,
      smokoMinutes,
      {
        country: holidayCountry,
        region: holidayRegion,
        useAutoHolidays
      }
    );
  }, [allJobs, shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes, holidayCountry, holidayRegion, useAutoHolidays]);

  const calculateDailyTotal = useCallback((dailyShifts) => {
    const calculatePaymentForDailyTotal = (shift) => calculatePayment(shift);
    return calculationService.calculateDailyTotal(dailyShifts, calculatePaymentForDailyTotal);
  }, [calculatePayment]);
  
  const value = {
    // Expose pure calculation functions
    calculateHours: calculationService.calculateHours,
    // Expose pre-configured functions
    calculatePayment,
    calculateDailyTotal,
  };

  return (
    <CalculationsContext.Provider value={value}>
      {children}
    </CalculationsContext.Provider>
  );
};