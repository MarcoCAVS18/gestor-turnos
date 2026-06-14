// src/components/stats/PayslipCard/helpers.js
// Helpers puros y constantes compartidas por todos los sub-componentes
// de PayslipCard. Sin React, sin contextos — solo lógica de datos.

// Estados internos del flujo de la card
export const VIEW = {
  IDLE: 'idle',           // sin payslips cargados — drop zone
  PARSING: 'parsing',     // procesando PDFs
  LIST: 'list',           // lista + dashboard agregado
  FORM: 'form',           // editar / agregar manual un payslip
  GENERATOR: 'generator', // configurador de turnos
};

// Crea un payslip vacío con id único
export const emptyPayslip = () => ({
  id: Math.random().toString(36).slice(2, 10),
  periodStart: '',
  periodEnd: '',
  hours: '',
  gross: '',
  tax: '',
  source: 'manual',  // 'manual' | 'pdf'
  fileName: null,
  // parseStatus: 'ok'    -> el parser detectó al menos gross y tax
  //              'failed' -> el PDF no se pudo leer / no tenía datos mínimos
  //              null     -> no aplica (entrada manual)
  parseStatus: null,
});

// Convierte un payslip al shape numérico que usan los cálculos
export const toNumeric = (p) => ({
  ...p,
  gross: Number(p.gross) || 0,
  tax: Number(p.tax) || 0,
  hours: Number(p.hours) || 0,
});

// ¿Tiene los datos mínimos para entrar al cálculo?
export const isComplete = (p) =>
  Number(p.gross) > 0 &&
  Number(p.tax) >= 0 &&
  p.periodStart &&
  p.periodEnd;

// Formato corto de un rango de período: "24 feb. → 2 mar." (sin año si los
// dos extremos caen en el mismo año). Usa el locale del browser.
export const formatPeriodShort = (start, end) => {
  if (!start || !end) return '—';
  try {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return `${start} → ${end}`;
    const sameYear = s.getFullYear() === e.getFullYear();
    const opts = sameYear
      ? { day: 'numeric', month: 'short' }
      : { day: 'numeric', month: 'short', year: '2-digit' };
    const fmt = new Intl.DateTimeFormat(undefined, opts);
    return `${fmt.format(s)} → ${fmt.format(e)}`;
  } catch {
    return `${start} → ${end}`;
  }
};
