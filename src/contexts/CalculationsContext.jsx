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
  // Consumir datos de otros contextos
  const ***REMOVED*** trabajos ***REMOVED*** = useDataContext();
  const ***REMOVED*** trabajosDelivery ***REMOVED*** = useDeliveryContext();
  const ***REMOVED*** shiftRanges, defaultDiscount, smokoEnabled, smokoMinutes ***REMOVED*** = useConfigContext();

  // Combinar todos los trabajos para pasarlos a las funciones de cálculo
  const allJobs = useMemo(() => [...trabajos, ...trabajosDelivery], [trabajos, trabajosDelivery]);

  // Crear versiones memoizadas y pre-configuradas de las funciones de cálculo
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
    // La función de cálculo necesita una referencia a la función calculatePayment principal
    // que ya tiene el contexto correcto (allJobs, settings, etc.)
    const calculatePaymentForDailyTotal = (shift) => calculatePayment(shift);
    return calculationService.calculateDailyTotal(dailyShifts, calculatePaymentForDailyTotal);
  ***REMOVED***, [calculatePayment]);
  
  const value = ***REMOVED***
    // Exponer las funciones de cálculo puras
    calculateHours: calculationService.calculateHours,
    // Exponer las funciones pre-configuradas
    calculatePayment,
    calculateDailyTotal,
  ***REMOVED***;

  return (
    <CalculationsContext.Provider value=***REMOVED***value***REMOVED***>
      ***REMOVED***children***REMOVED***
    </CalculationsContext.Provider>
  );
***REMOVED***;