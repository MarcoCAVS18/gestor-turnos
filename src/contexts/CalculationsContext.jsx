// src/contexts/CalculationsContext.jsx

import React, ***REMOVED*** createContext, useContext, useMemo, useCallback ***REMOVED*** from 'react';
import ***REMOVED*** useDataContext ***REMOVED*** from './DataContext';
import ***REMOVED*** useDeliveryContext ***REMOVED*** from './DeliveryContext';
import ***REMOVED*** useConfigContext ***REMOVED*** from './ConfigContext';
import * as calculationService from '../services/calculationService';

const CalculationsContext = createContext();

export const useCalculations = () => ***REMOVED***
  return useContext(CalculationsContext);
***REMOVED***;

export const CalculationsProvider = (***REMOVED*** children ***REMOVED***) => ***REMOVED***
  // Consume data from other contexts
  const ***REMOVED*** trabajos ***REMOVED*** = useDataContext();
  const ***REMOVED*** trabajosDelivery ***REMOVED*** = useDeliveryContext();
  const ***REMOVED*** shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes ***REMOVED*** = useConfigContext();

  // Combine all work to pass to calculation functions
  const allJobs = useMemo(() => [...trabajos, ...trabajosDelivery], [trabajos, trabajosDelivery]);

  // Create memoized and pre-configured versions of the calculation functions
  const calculatePayment = useCallback((shift) => ***REMOVED***
    return calculationService.calculatePayment(
      shift,
      allJobs,
      shiftRanges,
      defaultDiscount,
      smokoEnabled,
      smokoMinutes
    );
  ***REMOVED***, [allJobs, shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes]);

  const calculateDailyTotal = useCallback((dailyShifts) => ***REMOVED***
    const calculatePaymentForDailyTotal = (shift) => calculatePayment(shift);
    return calculationService.calculateDailyTotal(dailyShifts, calculatePaymentForDailyTotal);
  ***REMOVED***, [calculatePayment]);
  
  const value = ***REMOVED***
    // Expose pure calculation functions
    calculateHours: calculationService.calculateHours,
    // Expose pre-configured functions
    calculatePayment,
    calculateDailyTotal,
  ***REMOVED***;

  return (
    <CalculationsContext.Provider value=***REMOVED***value***REMOVED***>
      ***REMOVED***children***REMOVED***
    </CalculationsContext.Provider>
  );
***REMOVED***;