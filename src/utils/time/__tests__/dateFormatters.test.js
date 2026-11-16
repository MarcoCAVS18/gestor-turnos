// These tests are timezone-sensitive on purpose. Run them with `npm run test:tz`,
// which repeats the suite under Australia/Sydney, America/Argentina/Buenos_Aires
// and UTC. A date bug that only shows ahead of UTC (or only behind it) passes
// silently in a single-timezone run.
import { toLocalDateKey, addDaysToDateKey, createSafeDate, formatRelativeDate, isToday } from '../dateFormatters';

describe('toLocalDateKey', () => {
  test('uses the local calendar day at any time of day', () => {
    expect(toLocalDateKey(new Date(2026, 10, 17, 0, 0, 0))).toBe('2026-11-17');
    expect(toLocalDateKey(new Date(2026, 10, 17, 8, 8, 0))).toBe('2026-11-17');
    expect(toLocalDateKey(new Date(2026, 10, 17, 23, 59, 59))).toBe('2026-11-17');
  });

  test('pads month and day', () => {
    expect(toLocalDateKey(new Date(2026, 0, 5, 12))).toBe('2026-01-05');
  });

  test('defaults to today', () => {
    const now = new Date();
    expect(createSafeDate(toLocalDateKey()).toDateString()).toBe(now.toDateString());
  });

  test('round-trips with createSafeDate', () => {
    ['2026-01-01', '2026-03-29', '2026-10-04', '2026-12-31'].forEach((key) => {
      expect(toLocalDateKey(createSafeDate(key))).toBe(key);
    });
  });
});

describe('addDaysToDateKey', () => {
  test('next day', () => {
    expect(addDaysToDateKey('2026-11-13', 1)).toBe('2026-11-14');
  });

  test('rolls over month and year', () => {
    expect(addDaysToDateKey('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDaysToDateKey('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDaysToDateKey('2028-02-28', 1)).toBe('2028-02-29');
  });

  test('subtracts days', () => {
    expect(addDaysToDateKey('2026-03-01', -1)).toBe('2026-02-28');
  });

  test('is stable across daylight-saving changes (AU, NZ, EU dates)', () => {
    // 2026-10-04: DST starts in Sydney. 2026-04-05: DST ends in Sydney.
    // 2026-03-29 / 2026-10-25: EU changes.
    expect(addDaysToDateKey('2026-10-03', 1)).toBe('2026-10-04');
    expect(addDaysToDateKey('2026-10-04', 1)).toBe('2026-10-05');
    expect(addDaysToDateKey('2026-04-04', 1)).toBe('2026-04-05');
    expect(addDaysToDateKey('2026-04-05', 1)).toBe('2026-04-06');
    expect(addDaysToDateKey('2026-03-28', 1)).toBe('2026-03-29');
    expect(addDaysToDateKey('2026-10-25', 1)).toBe('2026-10-26');
  });
});

describe('relative labels', () => {
  const today = toLocalDateKey();

  test('formatRelativeDate recognises today, yesterday and tomorrow', () => {
    expect(formatRelativeDate(today)).toBe('Today');
    expect(formatRelativeDate(addDaysToDateKey(today, -1))).toBe('Yesterday');
    expect(formatRelativeDate(addDaysToDateKey(today, 1))).toBe('Tomorrow');
  });

  test('isToday', () => {
    expect(isToday(today)).toBe(true);
    expect(isToday(addDaysToDateKey(today, -1))).toBe(false);
  });
});
