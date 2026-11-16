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
  // true cuando el parseo fue de baja confianza (OCR o Cloud Function) y conviene
  // que el usuario verifique los montos. Se limpia al confirmar el formulario.
  lowConfidence: false,
  // Nombre del empleador detectado en el membrete (para "Agregar trabajo").
  employer: null,
  // Datos best-effort solo para mostrar en el resumen.
  employee: null,  // nombre de la persona
  location: null,  // ubicación / sucursal del trabajo
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

// Formato corto de un solo día: "lun. 24 feb." Usa el locale del browser.
export const formatDayShort = (dateStr) => {
  if (!dateStr) return '—';
  try {
    // 'YYYY-MM-DD' interpretado en horario local, evitando el corrimiento de
    // un día que causa `new Date('YYYY-MM-DD')` (lo parsea como UTC medianoche).
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
  } catch {
    return dateStr;
  }
};

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
