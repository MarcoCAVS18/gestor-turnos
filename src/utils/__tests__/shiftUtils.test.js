import { shiftCrossesMidnight, resolveShiftEndDate, normalizeShiftDates } from '../shiftUtils';

describe('shiftCrossesMidnight', () => {
  test('detects overnight shifts from the times', () => {
    expect(shiftCrossesMidnight({ startTime: '22:00', endTime: '02:00' })).toBe(true);
    expect(shiftCrossesMidnight({ startTime: '07:00', endTime: '15:30' })).toBe(false);
  });

  test('honours the explicit flag and tolerates missing times', () => {
    expect(shiftCrossesMidnight({ crossesMidnight: true, startTime: '09:00', endTime: '17:00' })).toBe(true);
    expect(shiftCrossesMidnight({ startTime: null, endTime: null })).toBe(false);
  });
});

describe('resolveShiftEndDate', () => {
  test('overnight shift ends the next local day', () => {
    expect(resolveShiftEndDate({ startDate: '2026-11-13' }, true)).toBe('2026-11-14');
    expect(resolveShiftEndDate({ startDate: '2026-12-31' }, true)).toBe('2027-01-01');
  });

  test('same-day shift ends on its start date', () => {
    expect(resolveShiftEndDate({ startDate: '2026-11-13' }, false)).toBe('2026-11-13');
  });

  test('keeps an explicit end date and falls back to the legacy `date` field', () => {
    expect(resolveShiftEndDate({ startDate: '2026-11-13', endDate: '2026-11-15' }, true)).toBe('2026-11-15');
    expect(resolveShiftEndDate({ date: '2026-11-13' }, true)).toBe('2026-11-14');
  });
});

describe('normalizeShiftDates', () => {
  test('repairs an overnight shift stored with endDate === startDate', () => {
    const stored = { id: 'a', startDate: '2026-11-13', endDate: '2026-11-13', startTime: '22:00', endTime: '02:00', crossesMidnight: true };
    expect(normalizeShiftDates(stored).endDate).toBe('2026-11-14');
  });

  test('repairs an overnight shift with no end date', () => {
    expect(normalizeShiftDates({ date: '2026-11-13', startTime: '23:00', endTime: '05:00' }).endDate).toBe('2026-11-14');
  });

  test('leaves correct shifts untouched (same object)', () => {
    const overnight = { startDate: '2026-11-13', endDate: '2026-11-14', startTime: '22:00', endTime: '02:00' };
    const day = { startDate: '2026-11-13', endDate: '2026-11-13', startTime: '07:00', endTime: '15:30' };
    const multiDay = { startDate: '2026-11-13', endDate: '2026-11-15', startTime: '09:00', endTime: '08:00', crossesMidnight: true };
    expect(normalizeShiftDates(overnight)).toBe(overnight);
    expect(normalizeShiftDates(day)).toBe(day);
    expect(normalizeShiftDates(multiDay)).toBe(multiDay);
  });
});

describe('isShiftCompleted', () => {
  const { isShiftCompleted } = require('../shiftUtils');
  const at = (key, hhmm) => { const d = new Date(`${key}T00:00:00`); const [h, m] = hhmm.split(':').map(Number); d.setHours(h, m, 0, 0); return d; };
  const shift = { startDate: '2026-11-17', startTime: '07:00', endTime: '15:30' };

  test('not completed before or during the shift, completed once it ends', () => {
    expect(isShiftCompleted(shift, at('2026-11-17', '06:00'))).toBe(false);
    expect(isShiftCompleted(shift, at('2026-11-17', '12:00'))).toBe(false);
    expect(isShiftCompleted(shift, at('2026-11-17', '15:30'))).toBe(true);
    expect(isShiftCompleted(shift, at('2026-11-18', '00:00'))).toBe(true);
  });

  test('overnight shift completes the next morning', () => {
    const night = { startDate: '2026-11-20', startTime: '22:00', endTime: '02:00' };
    expect(isShiftCompleted(night, at('2026-11-20', '23:59'))).toBe(false);
    expect(isShiftCompleted(night, at('2026-11-21', '01:59'))).toBe(false);
    expect(isShiftCompleted(night, at('2026-11-21', '02:00'))).toBe(true);
  });

  test('shift without times completes when its day ends; no date is never completed', () => {
    expect(isShiftCompleted({ date: '2026-11-17' }, at('2026-11-17', '23:00'))).toBe(false);
    expect(isShiftCompleted({ date: '2026-11-17' }, at('2026-11-18', '00:00'))).toBe(true);
    expect(isShiftCompleted({}, new Date())).toBe(false);
  });
});
