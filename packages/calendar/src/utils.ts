/** @private */
function createDateWithOverflow(year: number, month: number, day: number): Date {
  const date = new Date();
  date.setFullYear(year, month, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** @private */
function getStartingYear(minDate: Date | null, maxDate: Date | null): number {
  if (maxDate) {
    return maxDate.getFullYear() - YEARS_PER_PAGE + 1;
  } else if (minDate) {
    return minDate.getFullYear();
  }
  return 0;
}

/** @private */
function euclideanModulo(a: number, b: number): number {
  return ((a % b) + b) % b;
}

/** @internal */
export function addCalendarDays(date: Date, days: number): Date {
  return createDateWithOverflow(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** @internal */
export function addCalendarMonths(date: Date, months: number): Date {
  let newDate = createDateWithOverflow(date.getFullYear(), date.getMonth() + months, date.getDate());
  if (newDate.getMonth() != (((date.getMonth() + months) % 12) + 12) % 12) {
    newDate = createDateWithOverflow(newDate.getFullYear(), newDate.getMonth(), 0);
  }
  return newDate;
}

/** @internal */
export function addCalendarYears(date: Date, years: number): Date {
  return addCalendarMonths(date, years * 12);
}

/** @internal */
export function getNumDaysInMonth(date: Date): number {
  return createDateWithOverflow(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/** @internal */
export function compareDate(first: Date, second: Date): number {
  return (
    first.getFullYear() - second.getFullYear() ||
    first.getMonth() - second.getMonth() ||
    first.getDate() - second.getDate()
  );
}

/** @internal */
export function sameDate(first: Date | null, second: Date | null): boolean {
  return first && second ? compareDate(first, second) == 0 : first == second;
}

/** @internal */
export function parseDate(value: string | null): Date | null {
  return !value ? null : new Date(value);
}

/** @internal */
export function getActiveOffset(activeDate: Date, minDate: Date | null, maxDate: Date | null): number {
  return euclideanModulo(activeDate.getFullYear() - getStartingYear(minDate, maxDate), YEARS_PER_PAGE);
}

/** @internal */
export function minYearOfPage(activeDate: Date, minDate: Date | null, maxDate: Date | null): number {
  return activeDate.getFullYear() - getActiveOffset(activeDate, minDate, maxDate);
}

/** @internal */
export function maxYearOfPage(activeDate: Date, minDate: Date | null, maxDate: Date | null): number {
  return minYearOfPage(activeDate, minDate, maxDate) + YEARS_PER_PAGE - 1;
}

/** @internal */
export function clampDate(date: Date, minDate: Date | null, maxDate: Date | null): Date {
  if (minDate && compareDate(date, minDate) < 0) return minDate;
  if (maxDate && compareDate(date, maxDate) > 0) return maxDate;
  return date;
}

/** @internal */ export const YEARS_PER_PAGE = 24;
/** @internal */ export const YEARS_PER_ROW = 4;
/** @internal */ export const MONTHS_PER_ROW = 4;
