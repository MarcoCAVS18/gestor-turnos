// Timezone-sensitive: run with `npm run test:tz`. Before 2026-11 the week key
// came from toISOString(), so ahead of UTC every week was keyed (and labelled)
// from Sunday instead of Monday.
import { calculateTotalVisaDays, getMondayOfWeek, getMonthlyBreakdown, getVisaDaysFromWeeklyHours } from '../australia88Service';
import { toLocalDateKey } from '../../utils/time';

const works = [
  { id: 'farm', type: 'regular', australia88Eligible: true },
  { id: 'cafe', type: 'regular', australia88Eligible: false },
  { id: 'packing', type: 'regular', australia88Eligible: true },
];
const shift = (workId, date, startTime = '07:00', endTime = '15:00') => ({ workId, type: 'regular', startDate: date, date, startTime, endTime });

describe('week boundaries', () => {
  test('getMondayOfWeek returns the Monday of a Mon–Sun week', () => {
    // 2026-11-09 is a Monday, 2026-11-15 a Sunday.
    ['2026-11-09', '2026-11-11', '2026-11-15'].forEach((d) => {
      expect(toLocalDateKey(getMondayOfWeek(new Date(d + 'T00:00:00')))).toBe('2026-11-09');
    });
    expect(toLocalDateKey(getMondayOfWeek(new Date('2026-11-16T00:00:00')))).toBe('2026-11-16');
  });

  test('weekly breakdown is keyed and bounded Monday to Sunday', () => {
    const { weeklyBreakdown } = calculateTotalVisaDays([shift('farm', '2026-11-11')], works);
    expect(weeklyBreakdown).toHaveLength(1);
    const [week] = weeklyBreakdown;
    expect(week.weekKey).toBe('2026-11-09');
    expect(week.weekStart.getDay()).toBe(1);
    expect(toLocalDateKey(week.weekStart)).toBe('2026-11-09');
    expect(week.weekEnd.getDay()).toBe(0);
    expect(toLocalDateKey(week.weekEnd)).toBe('2026-11-15');
  });

  test('Sunday and the following Monday fall in different weeks', () => {
    const { weeklyBreakdown } = calculateTotalVisaDays([shift('farm', '2026-11-15'), shift('farm', '2026-11-16')], works);
    expect(weeklyBreakdown.map((w) => w.weekKey)).toEqual(['2026-11-09', '2026-11-16']);
  });

  test('a week starting on the 1st is attributed to that month', () => {
    // 2026-06-01 is a Monday.
    const { weeklyBreakdown } = calculateTotalVisaDays([shift('farm', '2026-06-03')], works);
    const [month] = getMonthlyBreakdown(weeklyBreakdown);
    expect(month.monthKey).toBe('2026-06');
  });
});

describe('what counts', () => {
  test('sums hours across all eligible jobs in the week and ignores the rest', () => {
    const shifts = [
      shift('farm', '2026-11-09'), shift('farm', '2026-11-10'),   // 16 h
      shift('packing', '2026-11-11'),                              // 8 h, second eligible employer
      shift('cafe', '2026-11-12'),                                 // not eligible
      { ...shift('farm', '2026-11-13'), type: 'delivery' },        // not a regular shift
    ];
    const { weeklyBreakdown } = calculateTotalVisaDays(shifts, works);
    expect(weeklyBreakdown).toHaveLength(1);
    expect(weeklyBreakdown[0].hours).toBe(24);
  });

  test('no eligible job means no days', () => {
    const result = calculateTotalVisaDays([shift('cafe', '2026-11-09')], works);
    expect(result.totalDays).toBe(0);
    expect(result.weeklyBreakdown).toEqual([]);
  });
});

// Pins the hours → days table as it is today. The table is under review
// (audit item V88-1): if the counting method changes, update these on purpose.
describe('getVisaDaysFromWeeklyHours (current table)', () => {
  test.each([
    [0, 0], [3.99, 0], [4, 1], [7.24, 1], [7.25, 2], [14.25, 3], [21.25, 4], [28.25, 5], [35.24, 5], [35.25, 7], [60, 7],
  ])('%p hours -> %p days', (hours, days) => {
    expect(getVisaDaysFromWeeklyHours(hours)).toBe(days);
  });
});
