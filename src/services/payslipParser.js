// src/services/payslipParser.js
// FREE, client-side payslip parsing — runs entirely in the user's browser, so
// it adds no server or AI cost and scales to any number of users.
//
// Strategy: pdfjs-dist extracts the text WITH x/y coordinates, so we can
// reconstruct visual rows and match a label to the amount on its own line
// (payslips are tabular — pdf-parse flattened that and broke matching). Falls
// back to a whole-text search. Scanned/image PDFs have no text layer → returns
// { success:false, reason:'no-text' } so the caller can use OCR / the Cloud
// Function fallback.
//
// pdfjs is dynamically imported so it stays out of the main bundle.

// ---------- pdfjs loader (lazy, self-hosted worker) ----------
let _pdfjs = null;
async function getPdfjs() {
  if (_pdfjs) return _pdfjs;
  const lib = await import('pdfjs-dist/build/pdf');
  lib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/pdf.worker.min.js`;
  _pdfjs = lib;
  return lib;
}

async function loadPdf(file) {
  const pdfjsLib = await getPdfjs();
  const buf = await file.arrayBuffer();
  // verbosity 0 = errors only — silences noisy font warnings like
  // "Required 'glyf' table is not found" (pdf.js recovers on its own).
  // isEvalSupported: false — users upload arbitrary PDFs. pdf.js <= 4.1 compiles
  // font glyph programs with `new Function`, which lets a crafted PDF run
  // JavaScript in the page (GHSA-wgrm-67xf-hhpq). Disabling eval closes that
  // path at a small rendering-speed cost; keep it until pdfjs-dist is >= 4.2.67.
  return pdfjsLib.getDocument({ data: buf, verbosity: 0, isEvalSupported: false }).promise;
}

// OCR assets are served from our own origin (public/tesseract, copied by
// scripts/copy-ocr-assets.js). The CSP blocks tesseract.js's defaults: files
// from cdn.jsdelivr.net and a worker started from a blob: URL.
const OCR_BASE = `${process.env.PUBLIC_URL || ''}/tesseract`;

// Same check wasm-feature-detect uses: does this engine accept a SIMD opcode?
const supportsWasmSimd = () => {
  try {
    return WebAssembly.validate(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]));
  } catch {
    return false;
  }
};

const getOcrOptions = () => ({
  workerPath: `${OCR_BASE}/worker.min.js`,
  workerBlobURL: false,
  // only the two cores we ship (see copy-ocr-assets.js)
  corePath: `${OCR_BASE}/${supportsWasmSimd() ? 'tesseract-core-simd-lstm.wasm.js' : 'tesseract-core-lstm.wasm.js'}`,
  langPath: OCR_BASE,
  gzip: true,
});

// Lazy Tesseract loader — heavy (~10 MB of wasm + lang data, fetched once and
// cached), so it's only pulled in when a PDF has no text layer (scanned).
let _tesseract = null;
async function getTesseract() {
  if (_tesseract) return _tesseract;
  _tesseract = (await import('tesseract.js')).default;
  return _tesseract;
}

// ---------- text + layout extraction ----------
// Returns { lines: [{ text, y, page }], fullText } with rows reconstructed from
// item coordinates (top-to-bottom, left-to-right).
async function getLayoutLines(pdf) {
  const lines = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const rows = {};
    for (const item of content.items) {
      if (!item.str || !item.str.trim()) continue;
      const x = item.transform[4];
      const y = item.transform[5];
      // Bucket y (~3px) so fragments on the same visual row group together.
      const key = `${p}:${Math.round(y / 3)}`;
      (rows[key] = rows[key] || []).push({ str: item.str, x, y });
    }
    for (const items of Object.values(rows)) {
      items.sort((a, b) => a.x - b.x);
      const text = items.map((i) => i.str).join(' ').replace(/\s+/g, ' ').trim();
      // items se conserva para poder emparejar labels con valores por columna
      // (formatos donde los labels están en una fila y los montos en la de abajo).
      if (text) lines.push({ text, y: items[0].y, page: p, items });
    }
  }

  lines.sort((a, b) => a.page - b.page || b.y - a.y); // top of page first
  const fullText = lines.map((l) => l.text).join('\n');
  return { lines, fullText };
}

// ---------- shared helpers (ported from the Cloud Function) ----------
const MONTH_MAP = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4,
  may: 5, jun: 6, june: 6, jul: 7, july: 7, aug: 8, august: 8,
  sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11,
  dec: 12, december: 12,
};

function normalizeDate(str) {
  if (!str) return null;
  const raw = String(str).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const monthNameRe = /^(\d{1,2})[\s\-./]+([A-Za-z]+)[\s\-./]+(\d{2,4})$/;
  const monthFirstRe = /^([A-Za-z]+)[\s\-./]+(\d{1,2}),?[\s\-./]+(\d{2,4})$/;
  let day, month, year, m;

  if ((m = raw.match(monthNameRe))) {
    day = parseInt(m[1], 10);
    month = MONTH_MAP[m[2].toLowerCase().slice(0, 9)] || MONTH_MAP[m[2].toLowerCase().slice(0, 3)];
    year = parseInt(m[3], 10);
  } else if ((m = raw.match(monthFirstRe))) {
    month = MONTH_MAP[m[1].toLowerCase().slice(0, 9)] || MONTH_MAP[m[1].toLowerCase().slice(0, 3)];
    day = parseInt(m[2], 10);
    year = parseInt(m[3], 10);
  } else {
    const parts = raw.split(/[/\-.]/);
    if (parts.length !== 3) return null;
    if (parts[0].length === 4) {
      year = parseInt(parts[0], 10); month = parseInt(parts[1], 10); day = parseInt(parts[2], 10);
    } else {
      day = parseInt(parts[0], 10); month = parseInt(parts[1], 10); year = parseInt(parts[2], 10);
    }
  }

  if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) return null;
  if (year < 100) year += 2000;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function extractAllDates(text) {
  const patterns = [
    /\b\d{1,2}[/\-.]\d{1,2}[/\-.]\d{2,4}\b/g,
    /\b\d{4}-\d{2}-\d{2}\b/g,
    /\b\d{1,2}[\s-]+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*[\s-]+\d{2,4}\b/gi,
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*[\s-]+\d{1,2},?[\s-]+\d{2,4}\b/gi,
  ];
  const found = [];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(text)) !== null) {
      const norm = normalizeDate(m[0]);
      if (norm) found.push({ date: norm, index: m.index });
    }
  }
  found.sort((a, b) => a.index - b.index);
  const seen = new Set();
  return found.filter(({ date }) => (seen.has(date) ? false : (seen.add(date), true)));
}

// ---------- pay-period detection ----------
const toDate = (s) => new Date(`${s}T00:00:00`);
const fmtDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const daysBetween = (a, b) => Math.round(Math.abs(toDate(b) - toDate(a)) / 86400000);
const addDays = (s, n) => { const d = toDate(s); d.setDate(d.getDate() + n); return fmtDate(d); };

const PERIOD_LINE_RE = /(?:pay\s*period|period\s*(?:ending|end|from|covered|of)|for\s*period|per[ií]odo\s*(?:de\s*(?:pago|liquidaci[oó]n))?|p[ée]riode\s*(?:de\s*paie)?)[:\s]*([^\n]{3,120})/i;
// "Fortnight to 26/01/2025" / "Week ending 12/05" — el label nombra el FIN del
// período y su longitud a la vez (formato muy común en AU/NZ). El grupo 1
// captura la palabra de frecuencia; la fecha puede estar en la misma línea o
// en la fila de valores de abajo (layout tabular header/values).
const PERIOD_END_STRICT_RE = /\b(fortnight|week|wk|month|quincena|semana)\s*(?:ending|ended|end|to)\b/i;
const FREQ_BY_WORD = {
  fortnight: 'fortnightly', quincena: 'fortnightly',
  week: 'weekly', wk: 'weekly', semana: 'weekly',
  month: 'monthly', mes: 'monthly',
};
// Typical pay-period lengths in days (weekly, fortnightly, ~monthly).
const TYPICAL_GAPS = [6, 7, 13, 14, 27, 28, 29, 30, 31];

// "Fortnight to / Week ending" en una fila de labels con la fecha en la misma
// línea o en la fila siguiente (por cercanía de columna x cuando hay items).
// Devuelve { end, frequency } o null.
function pickPeriodEndFromLabel(lines) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (YTD_RE.test(line.text)) continue;
    const m = line.text.match(PERIOD_END_STRICT_RE);
    if (!m) continue;
    const frequency = FREQ_BY_WORD[m[1].toLowerCase()] || null;

    // 1) Fecha en la misma línea, después del label.
    const after = line.text.slice(m.index + m[0].length);
    const sameLine = extractAllDates(after);
    if (sameLine.length > 0) return { end: sameLine[0].date, frequency };

    // 2) Fila de valores debajo: elegir la fecha cuya x esté más cerca de la
    //    columna del label (evita agarrar el Pay Date de la columna vecina).
    const labelItem = (line.items || []).find((it) => PERIOD_END_STRICT_RE.test(it.str));
    for (let j = i + 1; j <= i + 2 && j < lines.length; j++) {
      const below = lines[j];
      if (below.page !== line.page) break;
      const dated = (below.items || [])
        .map((it) => ({ it, date: extractAllDates(it.str)[0]?.date || null }))
        .filter((d) => d.date);
      if (dated.length === 0) continue;
      if (labelItem) {
        dated.sort((a, b) => Math.abs(a.it.x - labelItem.x) - Math.abs(b.it.x - labelItem.x));
      }
      return { end: dated[0].date, frequency };
    }
  }
  return null;
}

// Returns { periodStart, periodEnd } (YYYY-MM-DD or null).
function pickPeriod(normalized, frequency, lines = []) {
  let start = null;
  let end = null;

  // 0) "Fortnight to X" / "Week ending X": fija el fin Y la frecuencia.
  const labelled = pickPeriodEndFromLabel(lines);
  if (labelled) {
    end = labelled.end;
    frequency = labelled.frequency || frequency;
  }

  // 1) A line explicitly labelled as the pay period (most reliable).
  if (!end) {
    const line = normalized.match(PERIOD_LINE_RE);
    if (line) {
      const d = extractAllDates(line[1]).map((x) => x.date).sort();
      if (d.length >= 2) { start = d[0]; end = d[d.length - 1]; }
      else if (d.length === 1) { end = d[0]; }
    }
  }

  // 2) Otherwise pick the most pay-period-like pair among all dates.
  if (!start || !end) {
    const dates = [...new Set(extractAllDates(normalized).map((x) => x.date))].sort();
    if (dates.length >= 2 && (!start && !end)) {
      let best = null;
      for (let i = 0; i < dates.length; i++) {
        for (let j = i + 1; j < dates.length; j++) {
          const gap = daysBetween(dates[i], dates[j]);
          if (gap < 1 || gap > 45) continue;
          const score = Math.min(...TYPICAL_GAPS.map((g) => Math.abs(gap - g)));
          if (!best || score < best.score || (score === best.score && gap < best.gap)) {
            best = { start: dates[i], end: dates[j], gap, score };
          }
        }
      }
      if (best) { start = best.start; end = best.end; }
      else { start = dates[0]; end = dates[1]; }
    } else if (dates.length === 1) {
      end = end || dates[0];
    }
  }

  // 3) Derive a missing start from the end + detected frequency.
  if (end && !start && frequency) {
    const span = frequency === 'weekly' ? 6 : frequency === 'fortnightly' ? 13 : frequency === 'monthly' ? 29 : null;
    if (span) start = addDays(end, -span);
  }

  return { periodStart: start, periodEnd: end };
}

const YTD_RE = /\b(ytd|year\s*to\s*date|y\.t\.d|acumulado|cumul)\b/i;

// Money token: thousand-grouped (1,234 / 1.234 / 12 345) with optional decimals,
// OR a plain number with optional decimals. Tolerant of $, comma, dot and space.
const MONEY_RE = /\d{1,3}(?:[.,\s]\d{3})+(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?/g;
// Stricter: only clearly-monetary tokens (grouping or 2 decimals) — used by the
// best-effort fallback so years/IDs (e.g. 2026) aren't mistaken for money.
const MONEY_DECIMAL_RE = /\d{1,3}(?:[.,\s]\d{3})+(?:[.,]\d{1,2})?|\d+[.,]\d{2}/g;

// Parse a money/number token to a number. Convention: '.' is the decimal and
// ',' the thousands separator (AU/NZ/UK/IE), with support for the European
// "1.234,56" form when BOTH separators are present.
// "1,234.56" → 1234.56 · "1.234,56" → 1234.56 · "24.9800" → 24.98 ·
// "12 345" → 12345 · "950,00" → 950 · "950" → 950
function parseMoney(raw) {
  const s = String(raw).replace(/[^\d.,]/g, '');
  if (!s) return null;
  const hasDot = s.includes('.');
  const hasComma = s.includes(',');
  let normalized;

  if (hasDot && hasComma) {
    // The right-most separator is the decimal one; strip the other (thousands).
    const decSep = s.lastIndexOf('.') > s.lastIndexOf(',') ? '.' : ',';
    const thouSep = decSep === '.' ? ',' : '.';
    normalized = s.split(thouSep).join('').replace(decSep, '.');
  } else if (hasComma) {
    const parts = s.split(',');
    const last = parts[parts.length - 1];
    // A single comma with 1-2 trailing digits is a decimal ("950,00"); any
    // other comma usage is a thousands separator ("1,234" / "12,345").
    normalized = (parts.length === 2 && (last.length === 1 || last.length === 2))
      ? `${parts[0]}.${last}`
      : parts.join('');
  } else if (hasDot) {
    // One dot → decimal point ("24.9800", "950.00"); multiple dots → European
    // thousands grouping ("1.234.567").
    normalized = s.split('.').length === 2 ? s : s.split('.').join('');
  } else {
    normalized = s;
  }

  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
}

// First money amount AFTER the label on its row. Summary rows are usually
// "Label  <this pay>  <YTD>" — the period value is the first, so taking the
// first (not the max) avoids grabbing the larger YTD figure. Skips YTD rows.
function findAmountOnLine(lines, labelRegex) {
  const re = new RegExp(labelRegex.source, 'i');
  for (const line of lines) {
    if (YTD_RE.test(line.text)) continue;
    const m = re.exec(line.text);
    if (!m) continue;
    const after = line.text.slice(m.index + m[0].length);
    const tokens = after.match(MONEY_RE) || [];
    for (const tok of tokens) {
      const v = parseMoney(tok);
      if (v !== null && v > 0) return v;
    }
  }
  return null;
}

// Fallback: first money amount right after the label, on the SAME line only
// ([ \t] not \s, so it never jumps across a newline into another column's row).
function findAmountNear(text, labelRegex) {
  const re = new RegExp(labelRegex.source + '[ \\t:.\\-]*\\$?[ \\t]*(\\d[\\d.,]*\\d|\\d)', 'i');
  const m = text.match(re);
  return m ? parseMoney(m[1]) : null;
}

// Labels are ordered specific → generic, and cover EN / ES / FR.
const GROSS_LABELS = [
  /total\s*gross\s*(?:earnings|pay|wages)?/i,
  /gross\s*(?:earnings|pay|wages|amount|income|salary)/i,
  /gross\s*for\s*period/i,
  /\btotal\s*earnings\b/i,
  /\btotal\s*pay\b/i,
  // ES
  /total\s*devengad[oa]s?/i,
  /total\s*haberes/i,
  /(?:total\s*|salario\s*|sueldo\s*|ingreso\s*|remuneraci[oó]n\s*|importe\s*)bruto/i,
  // FR
  /(?:salaire|r[ée]mun[ée]ration|montant|total)\s*brut/i,
  /\bgross\b/i, /\bbruto\b/i, /\bbrut\b/i,
];
const TAX_LABELS = [
  /payg\s*withholding/i, /\bpayg\b/i, /\bpaye\b/i,
  /tax\s*withheld/i, /withholding\s*tax/i, /income\s*tax/i, /tax\s*deducted/i,
  // ES
  /impuesto\s*(?:a\s*las\s*ganancias|sobre\s*la\s*renta)?/i,
  /retenci[oó]n(?:es)?/i, /\bisr\b/i, /\birpf\b/i,
  // FR
  /imp[oô]t\s*(?:sur\s*le\s*revenu)?/i,
  /retenue(?:\s*[aà]\s*la\s*source)?/i, /pr[ée]l[èe]vement(?:\s*[aà]\s*la\s*source)?/i,
  /\btax\b/i, /\bimpuesto\b/i, /\bimp[oô]t\b/i,
];
const HOURS_LABELS = [
  /total\s*hours\s*worked/i, /total\s*hours/i, /hours\s*worked/i, /ordinary\s*hours/i,
  // ES
  /horas\s*(?:trabajadas|totales|ordinarias)/i,
  // FR
  /heures\s*(?:travaill[ée]es|totales|normales)/i,
  /\bhours\b/i, /\bhoras\b/i, /\bheures\b/i,
];
// Net / take-home — used to derive gross or tax by arithmetic when one is missing.
const NET_LABELS = [
  /nett?\s*(?:pay|income|amount|earnings)/i, /take[-\s]?home(?:\s*pay)?/i,
  /\bnett?\s*for\s*period\b/i,
  // ES
  /(?:l[ií]quido|neto|importe\s*neto|salario\s*neto|sueldo\s*neto)\s*(?:a\s*(?:pagar|percibir|cobrar))?/i,
  /l[ií]quido\s*a\s*percibir/i,
  // FR
  /(?:salaire|montant|total)\s*net/i, /net\s*[aà]\s*payer/i,
  /\bnett?\b/i, /\bneto\b/i,
];

function findByLabels(lines, fullText, labels) {
  for (const label of labels) {
    const v = findAmountOnLine(lines, label);
    if (v !== null) return v;
  }
  for (const label of labels) {
    const v = findAmountNear(fullText, label);
    if (v !== null) return v;
  }
  return null;
}

// ---------- label arriba / valor abajo (layouts tabulares tipo AU) ----------
// Muchos payslips ponen los labels del resumen en una fila ("Gross ... Tax ...
// NET INCOME") y los montos en la fila siguiente ("2003.93 ... 300.00 1703.93").
// Emparejamos por cercanía de columna x entre el item del label y el item
// numérico de las filas de abajo. Los regex son ANCLADOS al item completo para
// que "Pre Tax Allows/Deds" no matchee como "Tax".
const GROSS_ITEM_RE = /^\$?\s*gross(?:\s+(?:pay|income|earnings|wages|taxable\s*income))?\s*$/i;
const TAX_ITEM_RE = /^\$?\s*(?:tax|payg|paye|impuesto|imp[oô]t)\s*$/i;
const NET_ITEM_RE = /^\$?\s*net(?:t)?(?:\s+(?:income|pay|amount|earnings))?\s*$/i;
const MONEY_ITEM_RE = /^\$?\s*(?:\d{1,3}(?:[.,]\d{3})+(?:[.,]\d{1,2})?|\d+[.,]\d{1,2}|\.\d{1,2})\s*$/;

function findAmountBelowLabel(lines, itemLabelRe, maxColDist = 80) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (YTD_RE.test(line.text) || !line.items) continue;
    const labelItem = line.items.find((it) => itemLabelRe.test(it.str.trim()));
    if (!labelItem) continue;

    for (let j = i + 1; j <= i + 2 && j < lines.length; j++) {
      const below = lines[j];
      if (below.page !== line.page || !below.items) break;
      if (YTD_RE.test(below.text)) continue;
      const candidates = below.items
        .filter((it) => MONEY_ITEM_RE.test(it.str.trim()))
        .map((it) => ({ it, dist: Math.abs(it.x - labelItem.x) }))
        .filter((c) => c.dist <= maxColDist)
        .sort((a, b) => a.dist - b.dist);
      if (candidates.length > 0) {
        const v = parseMoney(candidates[0].it.str);
        if (v !== null && v >= 0) return v;
      }
    }
  }
  return null;
}

// All currency-like amounts in the document (skipping YTD rows), biggest first.
// Used as a best-effort fallback when no labelled gross/tax was found.
// Stops at the "Year to date" section, whose value rows don't carry the word
// YTD on each line and would otherwise leak large YTD totals into the guess.
function collectAmounts(lines) {
  const ytdSection = lines.findIndex((l) => /year\s*to\s*date|\bytd\b/i.test(l.text));
  const scope = ytdSection >= 0 ? lines.slice(0, ytdSection) : lines;
  const out = [];
  for (const line of scope) {
    if (YTD_RE.test(line.text)) continue;
    const nums = line.text.match(MONEY_DECIMAL_RE) || [];
    for (const n of nums) {
      const v = parseMoney(n);
      if (v && v > 0 && v < 1e7) out.push(v);
    }
  }
  return [...new Set(out)].sort((a, b) => b - a);
}

// ---------- worked-hours extraction ----------
// Hours rarely have a single "total hours" label; they live in a Qty/Hours
// column across the worked-time earnings rows. We detect each earnings row by
// the rate × hours = amount relationship and sum the hours of the WORKED rows
// (excluding allowances, loadings/penalties, leave, super, tax…).
const HOURS_COL_RE = /\b(hours|hrs|qty|units|horas|heures)\b/i;
const RATE_COL_RE = /\b(rate|tasa|taux)\b/i;
const AMOUNT_COL_RE = /\b(amount|value|importe|montant|this\s*pay)\b/i;
const HOURS_EXCLUDE_RE = /leave|laundry|allowance|loading|penalt|super|\btax\b|deduction|sacrifice|disburs|gross|net\s*pay|\btotal\b|balance|entitlement|accru|guarantee/i;

// Numbers in a line, in order, with a flag for a leading $ (marks the rate).
// Handles leading-dot decimals like ".50" / ".2500" (common on payslips).
function numbersIn(text) {
  const out = [];
  const re = /(\$)?\s*(\d[\d,]*(?:\.\d+)?|\.\d+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const val = parseFloat(m[2].replace(/,/g, ''));
    if (!isNaN(val)) {
      out.push({ val, hasDollar: !!m[1], idx: m.index, hasDecimal: m[2].includes('.') });
    }
  }
  return out;
}

// Un triple tarifa × horas = monto real siempre tiene decimales en alguno de
// los tres números. Los enteros sueltos de fechas/IDs ("01/03/2025" → 1×3=3)
// pueden formar productos casuales — este guard los descarta.
const tripleHasDecimals = (a, b, hit) => a.hasDecimal || b.hasDecimal || hit.hasDecimal;

// Texto descriptivo ANTES del primer número del triple detectado. Las filas de
// dos columnas se fusionan visualmente ("Ordinary 24.98 61.5 1536.27 *AustralianSuper
// E 230.45"): si la exclusión se testea sobre la línea completa, la palabra de
// la columna derecha (super, tax…) mata una fila de horas legítima. Testeamos
// solo el prefijo de la fila de earnings.
function descriptionBefore(text, nums, a, b, hitIdx) {
  const first = Math.min(a.idx, b.idx, hitIdx !== undefined ? hitIdx : Infinity);
  return text.slice(0, first);
}

function extractHours(lines) {
  // Column order from the earnings header: is Hours/Qty before Rate?
  let hoursBeforeRate = null;
  for (const line of lines) {
    if (!AMOUNT_COL_RE.test(line.text)) continue; // ensure it's the column header
    const h = line.text.search(HOURS_COL_RE);
    const r = line.text.search(RATE_COL_RE);
    if (h >= 0 && r >= 0) { hoursBeforeRate = h < r; break; }
  }

  let total = 0;
  let found = false;
  for (const line of lines) {
    const text = line.text;
    if (YTD_RE.test(text)) continue;
    const nums = numbersIn(text);
    if (nums.length < 3) continue;

    // Find a rate × hours = amount triple (amount = product of two others).
    let a = null;
    let b = null;
    let hit = null;
    for (let i = 0; i < nums.length && !a; i++) {
      for (let j = i + 1; j < nums.length && !a; j++) {
        const prod = nums[i].val * nums[j].val;
        if (prod <= 0) continue;
        const h = nums.find((n, k) => k !== i && k !== j && Math.abs(n.val - prod) / prod < 0.01);
        if (h && tripleHasDecimals(nums[i], nums[j], h)) { a = nums[i]; b = nums[j]; hit = h; }
      }
    }
    if (!a) continue;

    // La exclusión se evalúa SOLO sobre la descripción de la fila (antes del
    // primer número), no sobre la línea completa — ver descriptionBefore().
    if (HOURS_EXCLUDE_RE.test(descriptionBefore(text, nums, a, b, hit.idx))) continue;

    // Which factor is hours? $ marks the rate; else use the header column order.
    let hrs = null;
    let rate = null;
    if (a.hasDollar !== b.hasDollar) {
      hrs = (a.hasDollar ? b : a).val;
      rate = (a.hasDollar ? a : b).val;
    } else if (hoursBeforeRate !== null) {
      hrs = hoursBeforeRate ? a.val : b.val;
      rate = hoursBeforeRate ? b.val : a.val;
    }
    // Tarifas irrisorias (< $5/h) delatan allowances por unidad (laundry $2.40,
    // meal $0.25…) aunque el keyword no los atrape — no son horas trabajadas.
    if (rate !== null && rate < 5) continue;
    if (hrs !== null && hrs > 0 && hrs < 200) { total += hrs; found = true; }
  }

  return found && total > 0 && total < 1000 ? Math.round(total * 100) / 100 : null;
}

// Period gross = sum of each earnings row's amount (rate × qty = amount). That
// product is always the PERIOD value, never a YTD total — so this is immune to
// the "gross grabbed the YTD column" problem. Includes ordinary/penalties/
// loadings/allowances (all earnings); excludes tax/super/deductions/net/YTD.
const EARN_EXCLUDE_RE = /\btax\b|payg|paye|impuesto|imp[oô]t|\bsuper\b|superannuation|guarantee|deduction|sacrifice|disburs|net\s*pay|\bnett\b|ytd|year\s*to\s*date|balance|\btotal\b/i;
function sumEarningsAmounts(lines) {
  let sum = 0;
  let count = 0;
  for (const line of lines) {
    if (YTD_RE.test(line.text)) continue;
    const nums = numbersIn(line.text);
    if (nums.length < 3) continue;
    let amt = null;
    let first = null;
    for (let i = 0; i < nums.length && amt === null; i++) {
      for (let j = i + 1; j < nums.length && amt === null; j++) {
        const prod = nums[i].val * nums[j].val;
        if (prod <= 0) continue;
        const hit = nums.find((n, k) => k !== i && k !== j && Math.abs(n.val - prod) / prod < 0.01);
        if (hit && tripleHasDecimals(nums[i], nums[j], hit)) {
          amt = hit.val;
          first = Math.min(nums[i].idx, nums[j].idx, hit.idx);
        }
      }
    }
    if (amt === null) continue;
    // Igual que en extractHours: la exclusión mira solo la descripción de la
    // fila, no la línea completa (columnas fusionadas).
    if (EARN_EXCLUDE_RE.test(line.text.slice(0, first))) continue;
    if (amt > 0) { sum += amt; count += 1; }
  }
  return count > 0 ? Math.round(sum * 100) / 100 : null;
}

// Best-effort employer/company name from the letterhead. Tries a company-suffix
// line (… Pty Ltd / Ltd / Inc / LLC) first, then a labelled "Employer/Company/
// Paid by" line. Returns a trimmed name or null.
const COMPANY_SUFFIX_RE = /^(.*?\b(?:pty\s*ltd|p\/l|ltd|limited|inc|llc|gmbh|s\.?l\.?))\b/i;
const EMPLOYER_LABEL_RE = /(?:employer|company|paid\s*by|empleador|empresa|raz[oó]n\s*social|employeur|entreprise)\s*[:-]?\s+(.+)/i;
const EMPLOYER_STRIP_RE = /^(employer|company|paid\s*by|empleador|empresa|employeur|entreprise)\s*[:-]?\s*/i;

function cleanEmployer(raw) {
  if (!raw) return null;
  // Cut off ABN/tax-id and anything after a big number block.
  let s = raw.replace(/\b(abn|a\.b\.n|acn|tfn|ir[dn])\b.*$/i, '').replace(/\s{2,}.*$/, '').trim();
  s = s.replace(/\s+\d[\d\s./-]{4,}.*$/, '').trim(); // trailing number runs
  return s.length >= 3 ? s.slice(0, 60) : null;
}

function extractEmployer(lines) {
  for (const line of lines) {
    const m = line.text.match(COMPANY_SUFFIX_RE);
    if (m && m[1]) {
      const v = cleanEmployer(m[1].replace(EMPLOYER_STRIP_RE, ''));
      if (v) return v;
    }
  }
  for (const line of lines) {
    const m = line.text.match(EMPLOYER_LABEL_RE);
    if (m && m[1]) {
      const v = cleanEmployer(m[1]);
      if (v) return v;
    }
  }
  return null;
}

// Best-effort employee (person) name and work location — display-only fields
// shown in the summary card. Both are heuristic: shown only when found.
const EMPLOYEE_LABEL_RE = /(?:employee(?:\s*name)?|name\s*of\s*employee|empleado|trabajador|salari[ée])\s*[:-]?\s+(.+)/i;
const LOCATION_LABEL_RE = /(?:work\s*location|location|branch|site|store|department|sucursal|ubicaci[oó]n|localidad|lieu)\s*[:-]?\s+(.+)/i;
// Address line with an Australian state + 4-digit postcode, used as a fallback
// for the work location when there is no explicit label.
const AU_LOCATION_RE = /\b([A-Z][A-Za-z' .-]{2,30}),?\s+(NSW|VIC|QLD|WA|SA|TAS|ACT|NT)\s+(\d{4})\b/;

function cleanPersonName(raw) {
  if (!raw) return null;
  // Drop tax-id / number tails, then keep only the leading name-like words.
  let s = raw.replace(/\b(abn|tfn|acn|ir[dn]|no\.?|number|#).*$/i, '').replace(/\s{2,}.*$/, '').trim();
  const m = s.match(/^[A-Za-zÀ-ÿ'’.-]+(?:\s+[A-Za-zÀ-ÿ'’.-]+){0,3}/);
  s = m ? m[0].trim() : '';
  return s.length >= 3 ? s.slice(0, 60) : null;
}

function extractEmployee(lines) {
  for (const line of lines) {
    const m = line.text.match(EMPLOYEE_LABEL_RE);
    if (m && m[1]) {
      const v = cleanPersonName(m[1]);
      if (v) return v;
    }
  }
  return null;
}

function extractLocation(lines) {
  for (const line of lines) {
    const m = line.text.match(LOCATION_LABEL_RE);
    if (m && m[1]) {
      const v = cleanEmployer(m[1]); // reuse cleaner: trims trailing numbers/ids
      if (v) return v;
    }
  }
  for (const line of lines) {
    const m = line.text.match(AU_LOCATION_RE);
    if (m) return `${m[1].trim()}, ${m[2]} ${m[3]}`;
  }
  return null;
}

// Exportada para tests (fixtures de layouts reales sin necesidad de pdfjs).
export function extractFields(lines, fullText) {
  const normalized = fullText.replace(/\r/g, '\n').replace(/[ \t]+/g, ' ');
  const lower = normalized.toLowerCase();

  // Mismo renglón primero; si no, label arriba / valor abajo (tablas AU).
  const grossLabel = findByLabels(lines, normalized, GROSS_LABELS)
    ?? findAmountBelowLabel(lines, GROSS_ITEM_RE);
  const grossEarn = sumEarningsAmounts(lines); // robust period gross, never YTD
  let tax = findByLabels(lines, normalized, TAX_LABELS)
    ?? findAmountBelowLabel(lines, TAX_ITEM_RE);
  const net = findByLabels(lines, normalized, NET_LABELS)
    ?? findAmountBelowLabel(lines, NET_ITEM_RE);

  let guessed = false;

  // Prefer the labelled gross, but if it's much larger than the earnings sum it
  // almost certainly grabbed a YTD total → trust the earnings sum instead.
  let gross = grossLabel;
  if (grossEarn !== null) {
    if (gross === null) gross = grossEarn;
    else if (gross > grossEarn * 1.5) gross = grossEarn;
  }

  // Cross-derive from net when a figure is missing (gross = net + tax, etc.).
  if (gross === null && net !== null && tax !== null && net > 0 && tax >= 0) {
    gross = net + tax;
  } else if (gross !== null && tax === null && net !== null && net > 0 && net < gross) {
    tax = gross - net;
  }

  // Last resort: largest amount before the YTD section. Flagged as a guess.
  if (gross === null) {
    const amounts = collectAmounts(lines);
    if (amounts.length > 0) {
      gross = amounts[0];
      guessed = true;
    }
  }

  // Sanity: tax can never be >= gross. If it is, the tax match is wrong —
  // drop it and flag for review instead of saving a bad value.
  if (gross !== null && tax !== null && tax >= gross) {
    tax = null;
    guessed = true;
  }

  // Hours: sum worked-time rows (rate × hours = amount). Fall back to a
  // directly-labelled total (e.g. "Total hours: 38") if that finds nothing.
  let hours = extractHours(lines);
  if (hours === null) {
    for (const label of HOURS_LABELS) {
      for (const line of lines) {
        if (YTD_RE.test(line.text) || !label.test(line.text)) continue;
        const m = line.text.match(new RegExp(label.source + '[\\s:.-]*([\\d]+(?:\\.\\d+)?)', 'i'));
        if (m) {
          const v = parseFloat(m[1]);
          if (!isNaN(v) && v > 0 && v < 1000) { hours = v; break; }
        }
      }
      if (hours !== null) break;
    }
  }

  let frequency = null;
  if (/\bfortnight(?:ly)?\b|\bbi[-\s]?weekly\b|quincen(?:a|al)|quinzaine/i.test(lower)) frequency = 'fortnightly';
  else if (/\bweekly\b|\bweek\s*(?:ending|ended|end)\b|semanal|hebdomadaire/i.test(lower)) frequency = 'weekly';
  else if (/\bmonthly\b|mensual|mensuel/i.test(lower)) frequency = 'monthly';

  // Period: labelled line → plausible date pair → derive from frequency.
  const { periodStart, periodEnd } = pickPeriod(normalized, frequency, lines);

  const employer = extractEmployer(lines);
  const employee = extractEmployee(lines);
  const location = extractLocation(lines);

  return { data: { gross, tax, hours, periodStart, periodEnd, frequency, employer, employee, location }, guessed };
}

// Render up to `maxPages` pages to images and OCR them (scanned PDFs).
async function ocrPdf(pdf, maxPages = 2) {
  const Tesseract = await getTesseract();
  const pages = Math.min(pdf.numPages, maxPages);
  let text = '';
  for (let p = 1; p <= pages; p++) {
    const page = await pdf.getPage(p);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
    const { data } = await Tesseract.recognize(canvas, 'eng', getOcrOptions());
    text += '\n' + (data?.text || '');
  }
  return text.trim();
}

// OCR text has no coordinates, so treat each text line as a row for matching.
const linesFromText = (text) =>
  text.split('\n').map((t) => t.trim()).filter(Boolean).map((t) => ({ text: t, y: 0, page: 1 }));

/**
 * Parse a payslip PDF entirely in the browser (free, no server/AI cost).
 * Tries the text layer first; falls back to on-device OCR for scanned PDFs.
 * @param {File} file
 * @returns {Promise<{ success: boolean, data?: object, method?: string, reason?: string }>}
 */
export async function parsePayslipClient(file) {
  if (!file) return { success: false, reason: 'no-file' };

  let pdf;
  try {
    pdf = await loadPdf(file);
  } catch (e) {
    return { success: false, reason: 'error' };
  }

  // 1) Digital PDF — read the text layer with coordinates.
  try {
    const { lines, fullText } = await getLayoutLines(pdf);
    if (fullText && fullText.replace(/\s/g, '').length >= 12) {
      const { data, guessed } = extractFields(lines, fullText);
      if (data && (data.gross !== null || data.tax !== null)) {
        return { success: true, data, method: guessed ? 'pdf-guess' : 'pdf' };
      }
    }
  } catch (e) { /* fall through to OCR */ }

  // 2) Scanned/image PDF — OCR on the user's device.
  try {
    const text = await ocrPdf(pdf);
    if (text && text.replace(/\s/g, '').length >= 12) {
      const { data } = extractFields(linesFromText(text), text);
      if (data && (data.gross !== null || data.tax !== null)) {
        return { success: true, data, method: 'ocr' };
      }
    }
  } catch (e) { /* fall through */ }

  return { success: false, reason: 'no-fields' };
}
