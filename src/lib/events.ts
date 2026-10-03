import { EVENTS, type ClubEvent } from "@/data/events";

function endTime(event: ClubEvent): number {
  return Date.parse(event.end ?? event.start);
}

/** Events that have not finished yet, soonest first. */
export function getUpcomingEvents(now: number = Date.now()): ClubEvent[] {
  return EVENTS.filter((e) => endTime(e) >= now).toSorted(
    (a, b) => Date.parse(a.start) - Date.parse(b.start),
  );
}

/** Finished events, most recent first. */
export function getPastEvents(now: number = Date.now()): ClubEvent[] {
  return EVENTS.filter((e) => endTime(e) < now).toSorted(
    (a, b) => Date.parse(b.start) - Date.parse(a.start),
  );
}

export function getNextEvent(now: number = Date.now()): ClubEvent | null {
  return getUpcomingEvents(now)[0] ?? null;
}

export function getEventBySlug(slug: string): ClubEvent | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

export function isPastEvent(event: ClubEvent, now: number = Date.now()): boolean {
  return endTime(event) < now;
}
