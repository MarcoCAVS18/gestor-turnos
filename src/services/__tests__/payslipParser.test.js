// src/services/__tests__/payslipParser.test.js
// Fixtures de layouts reales contra extractFields (sin pdfjs: las líneas se
// construyen a mano con las coordenadas x que produciría getLayoutLines).
//
// Caso 1: payslip YHA Australia (fortnightly, dos columnas fusionadas,
// labels de resumen arriba y valores abajo) — el caso que rompía el detector:
//   - fechas: tomaba 26/01→28/01 (pay date) en vez de la quincena 13/01→26/01
//   - horas: 14.5 en vez de 76 (la fila Ordinary se excluía porque la columna
//     derecha fusionada contenía "*AustralianSuper")
//   - gross/tax: no encontraba los valores porque están DEBAJO de los labels

import { extractFields } from '../payslipParser';

// Construye una línea como las de getLayoutLines: [str, x] por item.
const L = (page, y, items) => ({
  page,
  y,
  items: items.map(([str, x]) => ({ str, x })),
  text: items
    .map(([s]) => s)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim(),
});

const buildFixture = (lines) => ({
  lines,
  fullText: lines.map((l) => l.text).join('\n'),
});

describe('extractFields — payslip YHA (AU, fortnightly, tabular)', () => {
  const { lines, fullText } = buildFixture([
    L(1, 900, [['MR Ignacio (Nacho) FLORES RODR', 40]]),
    L(1, 890, [['279 McLeod Street', 40]]),
    L(1, 880, [['CAIRNS NORTH QLD 4870', 40]]),
    L(1, 860, [['EMPLOYEE PAY DETAILS', 300]]),
    L(1, 850, [
      ['Fortnight to', 40], ['Pay Date', 160], ['Emp No.', 260], ['Name', 430], ['Status', 700],
    ]),
    L(1, 840, [
      ['26/01/2025', 40], ['28/01/2025', 160], ['003873', 260],
      ['FLORES RODRIGUEZ, Ignacio (Nac', 430], ['Full Time', 700],
    ]),
    L(1, 830, [
      ['Pay Point', 40], ['Pay Advice', 200], ['Classification', 300], ['Location', 500],
    ]),
    L(1, 820, [
      ['QL Queensland', 40], ['1 OF 1', 200], ['413 Cairns Central YHA', 500],
    ]),
    L(1, 800, [['ELEMENTS', 150], ['ALLOWANCES / DEDUCTIONS', 500]]),
    L(1, 790, [
      ['Description', 40], ['Rate', 120], ['Hours', 200], ['Value', 300],
      ['Description', 420], ['Tax Ind', 640], ['Value', 700],
    ]),
    L(1, 780, [
      ['Ordinary', 40], ['24.9800', 120], ['61.5000', 200], ['1536.27', 300],
      ['*AustralianSuper', 420], ['E', 640], ['230.45', 700],
    ]),
    L(1, 770, [
      ['Ord 1.25', 40], ['31.2250', 120], ['14.5000', 200], ['452.76', 300],
    ]),
    L(1, 760, [
      ['Laundry 1', 40], ['2.4000', 120], ['6.0000', 200], ['14.40', 300],
    ]),
    L(1, 750, [
      ['Laundry 2', 40], ['.2500', 120], ['2.0000', 200], ['.50', 300],
    ]),
    L(1, 730, [['SUMMARY OF EARNINGS', 300]]),
    L(1, 720, [
      ['Gross', 100], ['Taxable Income', 230], ['Pre Tax Allows/Deds', 350],
      ['Post Tax Allows/Deds', 470], ['Tax', 600], ['NET INCOME', 720],
    ]),
    L(1, 710, [
      ['2003.93', 100], ['2003.93', 230], ['14.90', 350],
      ['.00', 470], ['300.00', 600], ['1703.93', 720],
    ]),
    L(1, 700, [['* Employer Superannuation Contribution', 40]]),
    L(1, 680, [['PAY DISBURSEMENT DETAILS', 150], ['ENTITLEMENTS / ACCRUALS', 500]]),
    L(1, 670, [
      ['Method', 40], ['Account No.', 110], ['BSB Code', 210], ['Bank', 290],
      ['Amount', 340], ['Description', 420], ['Entitlement', 560], ['Prorata', 650], ['Total', 720],
    ]),
    L(1, 660, [
      ['EFT1', 40], ['662595189', 110], ['014-111', 210], ['ANZ', 290],
      ['1703.93', 340], ['Annual Lea', 420], ['33.77 (4.4)', 720],
    ]),
    L(1, 650, [['LS Leave', 420], ['.00 (.0)', 720]]),
    L(1, 600, [['YEAR TO DATE DETAILS', 300]]),
    L(1, 590, [
      ['YTD Gross', 100], ['YTD Taxable Income', 250], ['YTD Deductions', 430],
      ['YTD Tax', 580], ['YTD Net', 700],
    ]),
    L(1, 580, [
      ['12067.09', 100], ['12067.09', 250], ['1810.00', 580], ['10257.09', 700],
    ]),
    L(1, 540, [['YTD Allowances / Deductions', 300]]),
    L(1, 530, [
      ['Laundry 1', 40], ['86.40', 240], ['Laundry 2', 420], ['2.75', 640],
    ]),
    L(1, 520, [['Australian', 40], ['1386.29', 240]]),
    L(1, 500, [['YHA LTD', 40], ['(ABN) 94008387791', 600]]),
  ]);

  const { data } = extractFields(lines, fullText);

  test('período: quincena que TERMINA el 26/01 (no el pay date 28/01)', () => {
    expect(data.periodEnd).toBe('2025-01-26');
    expect(data.periodStart).toBe('2025-01-13');
  });

  test('frecuencia detectada desde "Fortnight to"', () => {
    expect(data.frequency).toBe('fortnightly');
  });

  test('horas: Ordinary 61.5 + Ord1.25 14.5 = 76 (laundry excluido, columna fusionada no rompe)', () => {
    expect(data.hours).toBe(76);
  });

  test('gross del período (no YTD): 2003.93', () => {
    expect(data.gross).toBe(2003.93);
  });

  test('tax del período (valor debajo del label): 300.00', () => {
    expect(data.tax).toBe(300);
  });

  test('employer desde el pie', () => {
    expect(data.employer).toBe('YHA LTD');
  });
});

describe('extractFields — regresión: formato simple de una línea', () => {
  const { lines, fullText } = buildFixture([
    L(1, 900, [['ACME Pty Ltd', 40]]),
    L(1, 880, [['Pay Period: 01/03/2025 - 14/03/2025', 40]]),
    L(1, 860, [['Gross Pay 1200.00', 40]]),
    L(1, 840, [['Tax Withheld 200.00', 40]]),
    L(1, 820, [['Net Pay 1000.00', 40]]),
    L(1, 800, [['Total Hours 60', 40]]),
  ]);

  const { data } = extractFields(lines, fullText);

  test('campos same-line siguen funcionando', () => {
    expect(data.periodStart).toBe('2025-03-01');
    expect(data.periodEnd).toBe('2025-03-14');
    expect(data.gross).toBe(1200);
    expect(data.tax).toBe(200);
    expect(data.hours).toBe(60);
    expect(data.employer).toBe('ACME Pty Ltd');
  });
});
