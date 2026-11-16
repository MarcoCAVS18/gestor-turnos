// src/hooks/usePayslipsData.js
// Fuente única de datos de recibos (payslips): suscripción Firestore en tiempo
// real + valores derivados (agregados, desglose, año fiscal, cobertura de
// turnos por período). La consumen la página Documentos (via PayslipCard) y
// la página Cálculos.

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useConfigContext } from '../contexts/ConfigContext';
import { useDataContext } from '../contexts/DataContext';
import * as firebaseService from '../services/firebaseService';
import {
  calculateAggregateRefund,
  buildPayslipBreakdown,
  SUPPORTED_COUNTRIES,
  getCurrentFiscalYear,
  groupPayslipsByFiscalYear,
  buildFiscalYearSummary,
  getPayslipShiftCoverage,
} from '../services/payslipService';
import { isComplete, toNumeric } from '../components/stats/PayslipCard/helpers';
import logger from '../utils/logger';

export const usePayslipsData = () => {
  const { currentUser } = useAuth() || {};
  const { holidayCountry } = useConfigContext() || {};
  const { shifts = [] } = useDataContext() || {};

  // Lista suscrita en tiempo real desde Firestore (cross-device)
  const [payslips, setPayslips] = useState([]);

  useEffect(() => {
    if (!currentUser?.uid) return undefined;
    const unsub = firebaseService.subscribeToPayslips(currentUser.uid, {
      setPayslips: (next) => setPayslips(next),
      setError: (err) => logger.warn('subscribeToPayslips error', err),
    });
    return unsub;
  }, [currentUser?.uid]);

  // País aplicable (solo los soportados por el parser de recibos)
  const country = useMemo(() => {
    if (holidayCountry && SUPPORTED_COUNTRIES.includes(holidayCountry)) {
      return holidayCountry;
    }
    return null;
  }, [holidayCountry]);

  const currencyCode = { AU: 'AUD', NZ: 'NZD', GB: 'GBP', IE: 'EUR' }[country] || 'AUD';
  const formatMoney = useCallback((amount) => {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 2,
      }).format(amount || 0);
    } catch {
      return `$${Number(amount || 0).toFixed(2)}`;
    }
  }, [currencyCode]);

  // Solo entran al cálculo los completos
  const completePayslips = useMemo(
    () => payslips.filter(isComplete).map(toNumeric),
    [payslips]
  );

  const aggregate = useMemo(
    () => calculateAggregateRefund(completePayslips, country),
    [completePayslips, country]
  );

  const breakdown = useMemo(
    () => buildPayslipBreakdown(completePayslips),
    [completePayslips]
  );

  // Resumen del año fiscal vigente
  const fiscalSummary = useMemo(() => {
    if (!country) return null;
    const currentFY = getCurrentFiscalYear(country);
    if (!currentFY) return null;
    const groups = groupPayslipsByFiscalYear(completePayslips, country);
    const inCurrentFY = groups[currentFY.label]?.payslips || [];
    return {
      currentFY,
      inCurrentFY,
      summary: inCurrentFY.length > 0 ? buildFiscalYearSummary(inCurrentFY, currentFY, country) : null,
    };
  }, [completePayslips, country]);

  // Cobertura de turnos por payslip (día por día) — base del detector de
  // discrepancias nómina vs horas. Comparten esto Documentos y Cálculos.
  const coverageByPayslipId = useMemo(() => {
    const map = {};
    completePayslips.forEach((p) => {
      map[p.id] = getPayslipShiftCoverage(shifts, p);
    });
    return map;
  }, [completePayslips, shifts]);

  return {
    payslips,
    completePayslips,
    country,
    formatMoney,
    aggregate,
    breakdown,
    fiscalSummary,
    coverageByPayslipId,
  };
};

export default usePayslipsData;
