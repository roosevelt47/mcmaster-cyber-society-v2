import { SITE } from "@/data/site";

const dateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: SITE.timeZone,
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

const longDateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: SITE.timeZone,
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const timeFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: SITE.timeZone,
  hour: "numeric",
  minute: "2-digit",
});

const dayKeyFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: SITE.timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

export function formatLongDate(iso: string): string {
  return longDateFormat.format(new Date(iso));
}

export function formatTimeRange(startIso: string, endIso?: string): string {
  const start = timeFormat.format(new Date(startIso));
  return endIso ? `${start} – ${timeFormat.format(new Date(endIso))}` : start;
}

/** True when the event spans more than one calendar day (multi-day CTFs). */
export function isMultiDay(startIso: string, endIso?: string): boolean {
  return !!endIso && dayKey(new Date(startIso)) !== dayKey(new Date(endIso));
}

/** YYYY-MM-DD in the club's time zone. */
export function dayKey(date: Date): string {
  return dayKeyFormat.format(date);
}
