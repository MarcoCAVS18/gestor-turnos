// Timezone-sensitive: run with `npm run test:tz`. Before 2026-11 the week key
// came from toISOString(), so ahead of UTC every week was keyed (and labelled)
// from Sunday instead of Monday.
import { calculateTotalVisaDays, getMondayOfWeek, getMonthlyBreakdown, getVisaDaysForWeek, estimateVisaDaysFromWeekTotals } from '../australia88Service';
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

  test('rostered shifts that have not been worked yet do not count', () => {
    const now = new Date('2026-11-11T12:00:00'); // Wednesday midday
    const shifts = [
      shift('farm', '2026-11-09'), shift('farm', '2026-11-10'), // worked: 16 h
      shift('farm', '2026-11-11'),                                // in progress at 12:00
      shift('farm', '2026-11-12'), shift('farm', '2026-11-13'), // rostered
      shift('farm', '2026-11-18'),                                // next week
    ];
    const { weeklyBreakdown, totalDays } = calculateTotalVisaDays(shifts, works, now);
    expect(weeklyBreakdown).toHaveLength(1);
    expect(weeklyBreakdown[0].hours).toBe(16);
    expect(totalDays).toBe(2); // two 8 h days, each capped at 1
  });

  test('no eligible job means no days', () => {
    const result = calculateTotalVisaDays([shift('cafe', '2026-11-09')], works);
    expect(result.totalDays).toBe(0);
    expect(result.weeklyBreakdown).toEqual([]);
  });
});

// Counting method (audit V88-1): full-time week = 7, otherwise each day worked
// counts at most once, pro rata to a standard day. Defaults 38 h / 7.6 h.
describe('getVisaDaysForWeek', () => {
  const week = (...hoursPerDay) => hoursPerDay.map((hours, i) => ({ date: `2026-11-${String(9 + i).padStart(2, '0')}`, hours }));

  test.each([
    ['5 x 8 h (40 h): full-time week', week(8, 8, 8, 8, 8), 7],
    ['6 x 7 h (42 h): full-time week', week(7, 7, 7, 7, 7, 7), 7],
    ['5 x 7.6 h (38 h): exactly full-time', week(7.6, 7.6, 7.6, 7.6, 7.6), 7],
    ['4 x 9 h (36 h): 4 days, a long day is still one day', week(9, 9, 9, 9), 4],
    ['1 x 7.5 h: about one day', week(7.5), 1],
    ['1 x 12 h: still one day', week(12), 1],
    ['3 x 4 h: pro rata', week(4, 4, 4), 1.6],
    ['5 x 6 h (30 h): 5 days but under full-time hours', week(6, 6, 6, 6, 6), 3.9],
    ['no hours', [], 0],
  ])('%s -> %p', (_label, entries, expected) => {
    expect(getVisaDaysForWeek(entries).visaDays).toBe(expected);
  });

  test('two employers on the same date add up, capped at one day', () => {
    const r = getVisaDaysForWeek([{ date: '2026-11-09', hours: 5 }, { date: '2026-11-09', hours: 5 }]);
    expect(r.visaDays).toBe(1);
    expect(r.daysWorked).toBe(1);
  });

  test('per-job thresholds: a 35 h full-time industry', () => {
    const entries = week(7, 7, 7, 7, 7).map((e) => ({ ...e, fullTimeWeeklyHours: 35, standardDayHours: 7 }));
    expect(getVisaDaysForWeek(entries)).toEqual({ visaDays: 7, daysWorked: 5, isFullTime: true });
  });
});

describe('calculateTotalVisaDays with job thresholds and paid hours', () => {
  test('uses the job thresholds and the hours function passed in', () => {
    const hospo = [{ id: 'bar', type: 'regular', australia88Eligible: true, australia88FullTimeHours: 30, australia88StandardDayHours: 6 }];
    const shifts = ['09', '10', '11', '12', '13'].map((d) => shift('bar', `2026-11-${d}`, '18:00', '24:00'.replace('24', '00')));
    // 6 h raw per shift; with a 30 min unpaid break they are 5.5 h paid
    const raw = calculateTotalVisaDays(shifts, hospo, new Date('2026-12-01'));
    expect(raw.weeklyBreakdown[0].isFullTime).toBe(true); // 30 h >= 30
    expect(raw.totalDays).toBe(7);
    const paid = calculateTotalVisaDays(shifts, hospo, new Date('2026-12-01'), () => 5.5);
    expect(paid.weeklyBreakdown[0].isFullTime).toBe(false); // 27.5 h < 30
    expect(paid.totalDays).toBe(4.6); // 5 x 5.5/6 = 4.58
  });
});

describe('estimateVisaDaysFromWeekTotals (public calculator)', () => {
  test.each([
    [5, 40, 7], [4, 36, 4], [1, 7.5, 1], [3, 12, 1.6], [5, 30, 3.9], [0, 10, 0], [3, 0, 0],
  ])('%p days / %p h -> %p', (days, hours, expected) => {
    expect(estimateVisaDaysFromWeekTotals(days, hours)).toBe(expected);
  });
});
