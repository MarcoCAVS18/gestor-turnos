// src/services/payslipService.js
// Servicio frontend para parseo de payslips y cálculo de devolución de impuestos.
// Llama a la Cloud Function parsePDF y calcula el refund según los tramos
// impositivos de Australia (ATO), Nueva Zelanda (IRD), Reino Unido (HMRC) e
// Irlanda (Revenue). Solo impuesto a la renta; no incluye NI/USC/PRSI/levies.

import { auth } from './firebase';
import logger from '../utils/logger';

const PROJECT_ID = process.env.REACT_APP_FIREBASE_PROJECT_ID || 'gestionturnos-7ec99';
const FUNCTIONS_BASE_URL = process.env.REACT_APP_USE_EMULATOR === 'true'
  ? `http://localhost:5001/${PROJECT_ID}/us-central1`
  : `https://us-central1-${PROJECT_ID}.cloudfunctions.net`;

// Tramos impositivos por país (anuales).
// Cada tramo: { upTo: límite superior (null = infinito), rate: porcentaje en decimal }
export const TAX_BRACKETS = {
  NZ: [
    { upTo: 14000, rate: 0.105 },
    { upTo: 48000, rate: 0.175 },
    { upTo: 70000, rate: 0.30 },
    { upTo: 180000, rate: 0.33 },
    { upTo: null, rate: 0.39 },
  ],
  AU: [
    { upTo: 18200, rate: 0 },
    { upTo: 45000, rate: 0.19 },
    { upTo: 120000, rate: 0.325 },
    { upTo: 180000, rate: 0.37 },
    { upTo: null, rate: 0.45 },
  ],
  // UK 2025/26 (England, Wales & NI — Scotland differs). Income tax only.
  GB: [
    { upTo: 12570, rate: 0 },     // Personal Allowance
    { upTo: 50270, rate: 0.20 },  // Basic rate
    { upTo: 125140, rate: 0.40 }, // Higher rate
    { upTo: null, rate: 0.45 },   // Additional rate
  ],
  // Ireland 2025 (single). Income tax only; tax credits applied below.
  IE: [
    { upTo: 44000, rate: 0.20 },  // Standard rate band
    { upTo: null, rate: 0.40 },   // Higher rate
  ],
};

// Flat tax credits subtracted from the computed annual income tax (floored at 0).
// Ireland's system is credit-based, so ignoring these would massively overestimate
// tax for low earners. Others have no credit (UK uses a 0% Personal Allowance band).
export const TAX_CREDITS = {
  IE: 4000, // 2025 single: personal €2,000 + employee (PAYE) €2,000
};

export const SUPPORTED_COUNTRIES = Object.keys(TAX_BRACKETS);

/**
 * Calcula el impuesto anual sobre un ingreso bruto aplicando los tramos del país.
 * @param {number} annualGross - Ingreso bruto anual estimado
 * @param {string} country - Código ISO del país (AU | NZ)
 * @returns {number} Impuesto total anual
 */
export function calculateAnnualTax(annualGross, country) {
  const brackets = TAX_BRACKETS[country];
  if (!brackets || annualGross <= 0) return 0;

  let tax = 0;
  let lastLimit = 0;

  for (const bracket of brackets) {
    const limit = bracket.upTo ?? Infinity;
    if (annualGross > lastLimit) {
      const taxableInThisBracket = Math.min(annualGross, limit) - lastLimit;
      tax += taxableInThisBracket * bracket.rate;
    }
    lastLimit = limit;
    if (annualGross <= limit) break;
  }

  // Apply flat tax credits (e.g. Ireland), never below zero.
  const credit = TAX_CREDITS[country] || 0;
  return Math.max(0, tax - credit);
}

/**
 * Anualiza un ingreso bruto del período según las fechas de inicio y fin.
 * Si no hay fechas válidas, asume que el período representa una semana.
 * @param {number} gross - Ingreso bruto del período
 * @param {string|null} periodStart - Fecha inicio (YYYY-MM-DD)
 * @param {string|null} periodEnd - Fecha fin (YYYY-MM-DD)
 * @returns {number} Bruto anualizado estimado
 */
export function annualiseGross(gross, periodStart, periodEnd) {
  if (!gross || gross <= 0) return 0;

  if (periodStart && periodEnd) {
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
      const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);
      return (gross / days) * 365;
    }
  }

  // Fallback: asumir período semanal
  return gross * 52;
}

/**
 * Calcula el refund estimado para un único payslip.
 * refund = tax retenido − tax correcto sobre gross anualizado
 * Si el resultado es negativo, refund = 0 (no hay devolución).
 * Mantenido para compatibilidad; el cálculo agregado vive en `calculateAggregateRefund`.
 */
export function calculateRefund({ gross, tax, periodStart, periodEnd, country }) {
  const grossNum = Number(gross) || 0;
  const taxNum = Number(tax) || 0;

  if (!SUPPORTED_COUNTRIES.includes(country) || grossNum <= 0) {
    return { refund: 0, owed: 0, annualGross: 0, expectedTax: 0, expectedTaxPeriod: 0 };
  }

  const annualGross = annualiseGross(grossNum, periodStart, periodEnd);
  const expectedAnnualTax = calculateAnnualTax(annualGross, country);
  const ratio = annualGross > 0 ? grossNum / annualGross : 0;
  const expectedTaxPeriod = expectedAnnualTax * ratio;

  const diff = taxNum - expectedTaxPeriod;
  return {
    refund: diff > 0 ? diff : 0,
    owed: diff < 0 ? Math.abs(diff) : 0,
    annualGross,
    expectedTax: expectedAnnualTax,
    expectedTaxPeriod,
  };
}

/**
 * Calcula el refund agregado para una lista de payslips.
 * Anualiza por *días efectivamente cubiertos* (suma de duraciones de cada
 * período), no por el span total entre la primera y la última fecha.
 * Esto evita distorsiones cuando hay períodos no correlativos (ej: huecos).
 *
 * @param {Array<object>} payslips - Lista de { gross, tax, periodStart, periodEnd, hours }
 * @param {string} country - Código país (AU | NZ)
 */
export function calculateAggregateRefund(payslips, country) {
  if (!Array.isArray(payslips) || payslips.length === 0 || !SUPPORTED_COUNTRIES.includes(country)) {
    return {
      refund: 0,
      owed: 0,
      totalGross: 0,
      totalTax: 0,
      totalNet: 0,
      totalHours: 0,
      coveredDays: 0,
      annualGross: 0,
      expectedTax: 0,
      expectedTaxPeriod: 0,
    };
  }

  let totalGross = 0;
  let totalTax = 0;
  let totalHours = 0;
  let coveredDays = 0;

  for (const p of payslips) {
    const g = Number(p.gross) || 0;
    const t = Number(p.tax) || 0;
    const h = Number(p.hours) || 0;
    totalGross += g;
    totalTax += t;
    totalHours += h;

    if (p.periodStart && p.periodEnd) {
      const start = new Date(p.periodStart);
      const end = new Date(p.periodEnd);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
        coveredDays += Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      } else {
        coveredDays += 7; // fallback semanal
      }
    } else {
      coveredDays += 7;
    }
  }

  const annualGross = coveredDays > 0 ? (totalGross / coveredDays) * 365 : totalGross * 52;
  const expectedAnnualTax = calculateAnnualTax(annualGross, country);
  const ratio = annualGross > 0 ? totalGross / annualGross : 0;
  const expectedTaxPeriod = expectedAnnualTax * ratio;

  const diff = totalTax - expectedTaxPeriod;
  return {
    refund: diff > 0 ? diff : 0,
    owed: diff < 0 ? Math.abs(diff) : 0,
    totalGross,
    totalTax,
    totalNet: totalGross - totalTax,
    totalHours,
    coveredDays,
    annualGross,
    expectedTax: expectedAnnualTax,
    expectedTaxPeriod,
  };
}

// ===== AÑO FISCAL =====
//
// Australia: 1 julio (year) → 30 junio (year + 1)  -> etiqueta "FY 2025-26"
// Nueva Zelanda: 1 abril (year) → 31 marzo (year + 1) -> etiqueta "FY 2025-26"
//
// Definimos el FY *etiquetado por el año en que comienza* (convención AU/NZ).

const FY_DEFS = {
  AU: { startMonth: 7, startDay: 1 }, // julio (1-indexed)
  NZ: { startMonth: 4, startDay: 1 }, // abril
  GB: { startMonth: 4, startDay: 6 }, // UK tax year: 6 abril → 5 abril
  IE: { startMonth: 1, startDay: 1, calendarYear: true }, // año calendario
};

/**
 * Devuelve el año fiscal en el que cae una fecha para un país dado.
 * @param {string|Date} date - Fecha
 * @param {string} country - 'AU' | 'NZ'
 * @returns {{ startDate: string, endDate: string, label: string, startYear: number } | null}
 */
export function getFiscalYearForDate(date, country) {
  const def = FY_DEFS[country];
  if (!def || !date) return null;

  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return null;

  const month = d.getUTCMonth() + 1; // 1-indexed
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();

  // Si la fecha es anterior al inicio del FY, pertenece al FY del año anterior
  const beforeStart =
    month < def.startMonth || (month === def.startMonth && day < def.startDay);
  const startYear = beforeStart ? year - 1 : year;

  const startDate = `${startYear}-${String(def.startMonth).padStart(2, '0')}-${String(def.startDay).padStart(2, '0')}`;
  // Fin del FY: día anterior al startDay del año siguiente
  const endDateObj = new Date(Date.UTC(startYear + 1, def.startMonth - 1, def.startDay));
  endDateObj.setUTCDate(endDateObj.getUTCDate() - 1);
  const endDate = endDateObj.toISOString().slice(0, 10);

  // Calendar-year countries (e.g. Ireland) are labelled by the single year.
  const yyShort = String((startYear + 1) % 100).padStart(2, '0');
  const label = def.calendarYear ? `${startYear}` : `FY ${startYear}-${yyShort}`;

  return { startDate, endDate, label, startYear };
}

/**
 * Devuelve el año fiscal vigente hoy para un país.
 */
export function getCurrentFiscalYear(country) {
  return getFiscalYearForDate(new Date(), country);
}

/**
 * Agrupa los payslips por año fiscal según `periodEnd` (la fecha de cierre
 * suele ser cuando el pago se imputa). Devuelve un objeto:
 *   { [label]: { fy, payslips: [] } }
 */
export function groupPayslipsByFiscalYear(payslips, country) {
  if (!Array.isArray(payslips) || !FY_DEFS[country]) return {};
  const groups = {};
  for (const p of payslips) {
    const refDate = p.periodEnd || p.periodStart;
    if (!refDate) continue;
    const fy = getFiscalYearForDate(refDate, country);
    if (!fy) continue;
    if (!groups[fy.label]) groups[fy.label] = { fy, payslips: [] };
    groups[fy.label].payslips.push(p);
  }
  return groups;
}

/**
 * Construye un resumen del año fiscal a partir de los payslips que caen dentro.
 * Incluye totales del período cubierto + proyección anual lineal por tramos.
 *
 * Nota importante: la proyección NO contempla deducciones, offsets, levies,
 * residency status, WHM rates, KiwiSaver, ACC, etc. Es una referencia.
 *
 * @param {Array} payslipsInFY - Payslips ya filtrados al FY
 * @param {object} fy - Definición del FY (de getFiscalYearForDate)
 * @param {string} country - 'AU' | 'NZ'
 */
export function buildFiscalYearSummary(payslipsInFY, fy, country) {
  if (!fy || !SUPPORTED_COUNTRIES.includes(country)) return null;

  let totalGross = 0;
  let totalTax = 0;
  let coveredDays = 0;

  for (const p of payslipsInFY) {
    totalGross += Number(p.gross) || 0;
    totalTax += Number(p.tax) || 0;
    if (p.periodStart && p.periodEnd) {
      const s = new Date(p.periodStart);
      const e = new Date(p.periodEnd);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e >= s) {
        coveredDays += Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
      } else {
        coveredDays += 7;
      }
    } else {
      coveredDays += 7;
    }
  }

  // Días totales del año fiscal (365 o 366)
  const fyStart = new Date(fy.startDate + 'T00:00:00Z');
  const fyEnd = new Date(fy.endDate + 'T00:00:00Z');
  const daysInFY = Math.round((fyEnd - fyStart) / (1000 * 60 * 60 * 24)) + 1;

  // Cap a daysInFY por seguridad si los payslips se solapan o están mal cargados
  const safeCovered = Math.min(coveredDays, daysInFY);
  const coverageRatio = daysInFY > 0 ? safeCovered / daysInFY : 0;

  // Proyección lineal a fin del FY
  const projectedAnnualGross = coverageRatio > 0 ? totalGross / coverageRatio : 0;
  const projectedAnnualTaxByBrackets = calculateAnnualTax(projectedAnnualGross, country);

  // Tax esperado por tramos solo sobre lo cubierto (referencia)
  const expectedTaxOnCovered = projectedAnnualTaxByBrackets * coverageRatio;
  const diffOnCovered = totalTax - expectedTaxOnCovered;

  return {
    fy,
    country,
    totalGross,
    totalTax,
    totalNet: totalGross - totalTax,
    coveredDays: safeCovered,
    daysInFY,
    coverageRatio,
    projectedAnnualGross,
    projectedAnnualTaxByBrackets,
    expectedTaxOnCovered,
    // Diff informal (sin deducciones / offsets / levies / WHM)
    informalRefund: diffOnCovered > 0 ? diffOnCovered : 0,
    informalOwed: diffOnCovered < 0 ? Math.abs(diffOnCovered) : 0,
  };
}

/**
 * Genera una huella simple de un payslip para detectar duplicados.
 * Combina período + gross + tax (todos los campos que en la práctica
 * identifican a un payslip único).
 */
export function payslipFingerprint(p) {
  if (!p) return '';
  const start = p.periodStart || '';
  const end = p.periodEnd || '';
  const gross = Number(p.gross || 0).toFixed(2);
  const tax = Number(p.tax || 0).toFixed(2);
  return `${start}|${end}|${gross}|${tax}`;
}

/**
 * Detecta si un payslip nuevo se solapa o duplica a alguno existente.
 * - Duplicado exacto: misma fingerprint.
 * - Solapamiento: rangos de fechas que se cruzan.
 *
 * @returns {{ isDuplicate: boolean, isOverlap: boolean }}
 */
export function detectConflict(existing, candidate) {
  if (!candidate) return { isDuplicate: false, isOverlap: false };

  const fp = payslipFingerprint(candidate);
  for (const p of existing) {
    if (payslipFingerprint(p) === fp) {
      return { isDuplicate: true, isOverlap: true };
    }
  }

  if (!candidate.periodStart || !candidate.periodEnd) {
    return { isDuplicate: false, isOverlap: false };
  }

  for (const p of existing) {
    if (!p.periodStart || !p.periodEnd) continue;
    if (candidate.periodStart <= p.periodEnd && candidate.periodEnd >= p.periodStart) {
      return { isDuplicate: false, isOverlap: true };
    }
  }
  return { isDuplicate: false, isOverlap: false };
}

/**
 * Construye un breakdown de uno o varios payslips agregando bruto, tax y neto.
 * Acepta un único objeto o un array de payslips. Útil para el dashboard
 * cuando el usuario carga múltiples períodos.
 * @param {object|array} input - Payslip individual o lista de payslips
 * @returns {{ items: Array, totals: { gross: number, tax: number, net: number, hours: number } }}
 */
export function buildPayslipBreakdown(input) {
  const list = Array.isArray(input) ? input : [input];

  const items = list
    .filter(Boolean)
    .map((p) => {
      const gross = Number(p.gross) || 0;
      const tax = Number(p.tax) || 0;
      const hours = Number(p.hours) || 0;
      return {
        periodStart: p.periodStart || null,
        periodEnd: p.periodEnd || null,
        gross,
        tax,
        net: gross - tax,
        hours,
      };
    });

  const totals = items.reduce(
    (acc, it) => ({
      gross: acc.gross + it.gross,
      tax: acc.tax + it.tax,
      net: acc.net + it.net,
      hours: acc.hours + it.hours,
    }),
    { gross: 0, tax: 0, net: 0, hours: 0 }
  );

  return { items, totals };
}

/**
 * Verifica si existe algún turno que caiga dentro del rango del payslip.
 * Compara `startDate` (YYYY-MM-DD) de cada turno contra el período.
 * @param {Array} shifts - Turnos existentes (de DataContext)
 * @param {string} periodStart - Fecha inicio (YYYY-MM-DD)
 * @param {string} periodEnd - Fecha fin (YYYY-MM-DD)
 * @returns {boolean}
 */
export function hasShiftsInPeriod(shifts, periodStart, periodEnd) {
  if (!Array.isArray(shifts) || !periodStart || !periodEnd) return false;
  return shifts.some((s) => {
    const date = s.startDate || s.date;
    if (!date) return false;
    return date >= periodStart && date <= periodEnd;
  });
}

/**
 * Envía el PDF a la Cloud Function parsePDF para extraer los campos.
 * @param {File} file - Archivo PDF subido por el usuario
 * @returns {Promise<{ success: boolean, data?: object }>}
 */
export async function parsePayslipPDF(file) {
  if (!file) throw new Error('No file provided');

  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const token = await user.getIdToken();

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${FUNCTIONS_BASE_URL}/parsePDF`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 429) {
      throw new Error('rate-limit');
    }

    if (!response.ok) {
      return { success: false };
    }

    const json = await response.json();
    return json;
  } catch (error) {
    logger.warn('parsePayslipPDF error:', error);
    return { success: false };
  }
}
