import { differenceInCalendarDays, formatISO, parseISO } from "date-fns";
import type { IsoDate } from "../../types/domain";

export function todayIso(): IsoDate {
  return formatISO(new Date(), { representation: "date" });
}

export function toIsoDate(date: Date): IsoDate {
  return formatISO(date, { representation: "date" });
}

export function daysUntil(target: IsoDate, today: IsoDate): number {
  return differenceInCalendarDays(parseISO(target), parseISO(today));
}

export function isIsoDate(value: string | undefined): value is IsoDate {
  if (!value) return false;
  const parsed = parseISO(value);
  return !Number.isNaN(parsed.getTime()) && value.length >= 10;
}
