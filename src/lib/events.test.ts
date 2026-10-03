import { describe, expect, it } from "vitest";
import { EVENTS } from "@/data/events";
import { buildIcs, googleCalendarUrl } from "@/lib/calendar";
import { getEventBySlug, getNextEvent, getPastEvents, getUpcomingEvents, isPastEvent } from "@/lib/events";
import { dayKey, isMultiDay } from "@/lib/format";

const NOW = Date.parse("2026-10-03T12:00:00-04:00");

describe("event queries", () => {
  it("splits upcoming and past with no overlap and no loss", () => {
    const upcoming = getUpcomingEvents(NOW);
    const past = getPastEvents(NOW);
    expect(upcoming.length + past.length).toBe(EVENTS.length);
    expect(upcoming.every((e) => !isPastEvent(e, NOW))).toBe(true);
  });

  it("sorts upcoming soonest-first and past newest-first", () => {
    const upcoming = getUpcomingEvents(NOW).map((e) => Date.parse(e.start));
    const past = getPastEvents(NOW).map((e) => Date.parse(e.start));
    expect(upcoming).toEqual([...upcoming].sort((a, b) => a - b));
    expect(past).toEqual([...past].sort((a, b) => b - a));
  });

  it("getNextEvent is the soonest upcoming, or null when nothing is left", () => {
    expect(getNextEvent(NOW)).toEqual(getUpcomingEvents(NOW)[0]);
    expect(getNextEvent(Date.parse("2100-01-01T00:00:00Z"))).toBeNull();
  });

  it("keeps a running event upcoming until it ends", () => {
    const ctf = getEventBySlug("v1t-ctf-2025");
    expect(ctf).toBeDefined();
    if (!ctf) return;
    expect(isPastEvent(ctf, Date.parse("2025-11-01T12:00:00-04:00"))).toBe(false);
    expect(isPastEvent(ctf, Date.parse("2025-11-04T12:00:00-05:00"))).toBe(true);
  });

  it("has unique slugs and valid ISO dates", () => {
    expect(new Set(EVENTS.map((e) => e.slug)).size).toBe(EVENTS.length);
    for (const e of EVENTS) {
      expect(Number.isNaN(Date.parse(e.start))).toBe(false);
      if (e.end) expect(Date.parse(e.end)).toBeGreaterThanOrEqual(Date.parse(e.start));
    }
  });
});

describe("formatting", () => {
  it("uses Toronto calendar days, not UTC", () => {
    // 11pm Toronto on Oct 12 is already Oct 13 in UTC.
    expect(dayKey(new Date("2026-10-13T03:00:00Z"))).toBe("2026-10-12");
  });

  it("detects multi-day events", () => {
    expect(isMultiDay("2025-10-31T00:00:00-04:00", "2025-11-02T23:59:00-05:00")).toBe(true);
    expect(isMultiDay("2025-10-29T18:00:00-04:00", "2025-10-29T19:00:00-04:00")).toBe(false);
  });
});

describe("calendar export", () => {
  const event = {
    slug: "test",
    // A lone \r is a line break for some ICS parsers, so it must be escaped too.
    title: "Hack; the, planet\rDESCRIPTION:injected",
    start: "2026-10-14T18:00:00-04:00",
    end: "2026-10-14T19:00:00-04:00",
    location: "ETB 228",
    type: "workshop" as const,
    description: "Line one\nLine two",
  };

  it("emits UTC times and escapes text so values cannot inject properties", () => {
    const ics = buildIcs(event);
    expect(ics).toContain("DTSTART:20261014T220000Z");
    expect(ics).toContain("DTEND:20261014T230000Z");
    expect(ics).toContain("SUMMARY:Hack\\; the\\, planet\\nDESCRIPTION:injected");
    expect(ics.split("\r\n").filter((l) => l.startsWith("DESCRIPTION:"))).toHaveLength(1);
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("builds a Google Calendar link with encoded params", () => {
    const url = new URL(googleCalendarUrl(event));
    expect(url.origin).toBe("https://calendar.google.com");
    expect(url.searchParams.get("dates")).toBe("20261014T220000Z/20261014T230000Z");
    expect(url.searchParams.get("text")).toBe(event.title);
  });
});
