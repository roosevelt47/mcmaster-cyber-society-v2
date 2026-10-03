import { describe, expect, it } from "vitest";
import {
  MAX_CODE_LENGTH,
  MAX_DAYS,
  bestSlots,
  buildDates,
  cellCount,
  decodeState,
  encodeState,
  mergeStates,
  slotLabel,
  tally,
  upsertReply,
  validatePoll,
  type Poll,
  type PollState,
} from "@/lib/meet";

const poll: Poll = {
  title: "CTF practice",
  dates: ["2026-10-12", "2026-10-13"],
  startHour: 9,
  endHour: 11,
};
const empty: PollState = { poll, replies: [] };

function b64url(text: string): string {
  return Buffer.from(text).toString("base64url");
}

describe("meet codec", () => {
  it("round-trips a poll with replies", () => {
    const state = upsertReply(upsertReply(empty, { name: "Ana", cells: [0, 3] }), {
      name: "Bo",
      cells: [3, 7],
    });
    expect(decodeState(encodeState(state))).toEqual(state);
  });

  it("accepts a full link or #fragment", () => {
    const code = encodeState(empty);
    expect(decodeState(`https://example.com/meet#${code}`)).toEqual(empty);
    expect(decodeState(`#${code}`)).toEqual(empty);
  });

  it.each([
    ["empty string", ""],
    ["not base64", "!!!not-valid!!!"],
    ["not json", b64url("hello")],
    ["wrong version", b64url(JSON.stringify({ v: 2, t: "x", d: ["2026-10-12"], s: 9, e: 10, r: [] }))],
    ["impossible date", b64url(JSON.stringify({ v: 1, t: "x", d: ["2026-02-30"], s: 9, e: 10, r: [] }))],
    ["end before start", b64url(JSON.stringify({ v: 1, t: "x", d: ["2026-10-12"], s: 12, e: 9, r: [] }))],
    ["too many days", b64url(JSON.stringify({ v: 1, t: "x", d: Array.from({ length: MAX_DAYS + 1 }, (_, i) => `2026-10-${String(i + 1).padStart(2, "0")}`), s: 9, e: 10, r: [] }))],
    ["unsorted dates", b64url(JSON.stringify({ v: 1, t: "x", d: ["2026-10-13", "2026-10-12"], s: 9, e: 10, r: [] }))],
    ["bad reply shape", b64url(JSON.stringify({ v: 1, t: "x", d: ["2026-10-12"], s: 9, e: 10, r: [["Ana"]] }))],
    ["wrong bitset length", b64url(JSON.stringify({ v: 1, t: "x", d: ["2026-10-12"], s: 9, e: 10, r: [["Ana", "AAAAAAAA"]] }))],
    ["oversized", "A".repeat(MAX_CODE_LENGTH + 1)],
  ])("rejects %s", (_label, input) => {
    expect(decodeState(input)).toBeNull();
  });

  it("does not interpret markup in titles or names (kept as inert text)", () => {
    const state = upsertReply(
      { poll: { ...poll, title: "<img src=x onerror=alert(1)>" }, replies: [] },
      { name: "<script>", cells: [0] },
    );
    const decoded = decodeState(encodeState(state));
    expect(decoded?.poll.title).toBe("<img src=x onerror=alert(1)>");
    expect(decoded?.replies[0].name).toBe("<script>");
  });
});

describe("meet logic", () => {
  it("validatePoll trims and rejects bad input", () => {
    expect(validatePoll({ ...poll, title: "  hi  " })?.title).toBe("hi");
    expect(validatePoll({ ...poll, title: "   " })).toBeNull();
    expect(validatePoll({ ...poll, dates: [] })).toBeNull();
    expect(validatePoll({ ...poll, startHour: 9.5 })).toBeNull();
  });

  it("cellCount uses 30 minute slots", () => {
    expect(cellCount(poll)).toBe(2 * 4);
    expect(slotLabel(poll, 0)).toBe("9:00 AM");
    expect(slotLabel(poll, 3)).toBe("10:30 AM");
    expect(slotLabel({ ...poll, startHour: 0 }, 0)).toBe("12:00 AM");
    expect(slotLabel({ ...poll, startHour: 12 }, 0)).toBe("12:00 PM");
  });

  it("upsertReply replaces by case-insensitive name and drops out-of-range cells", () => {
    const a = upsertReply(empty, { name: "Ana", cells: [0, 999, -1] });
    const b = upsertReply(a, { name: "ANA", cells: [1] });
    expect(b.replies).toHaveLength(1);
    expect(b.replies[0].cells).toEqual([1]);
  });

  it("tally and bestSlots rank by availability, earliest first on ties", () => {
    const state = [
      { name: "Ana", cells: [0, 2] },
      { name: "Bo", cells: [2, 5] },
    ].reduce(upsertReply, empty);
    expect(tally(state)[2]).toEqual({ count: 2, names: ["Ana", "Bo"] });
    expect(bestSlots(state).map((s) => s.cell)).toEqual([2, 0, 5]);
  });

  it("mergeStates combines same-poll replies and refuses different polls", () => {
    const a = upsertReply(empty, { name: "Ana", cells: [0] });
    const b = upsertReply(empty, { name: "Bo", cells: [1] });
    expect(mergeStates(a, b)?.replies.map((r) => r.name)).toEqual(["Ana", "Bo"]);
    expect(mergeStates(a, { poll: { ...poll, title: "Other" }, replies: [] })).toBeNull();
  });

  it("buildDates optionally skips weekends and caps the count", () => {
    // 2026-10-09 is a Friday.
    expect(buildDates("2026-10-09", 3, true)).toEqual(["2026-10-09", "2026-10-12", "2026-10-13"]);
    expect(buildDates("2026-10-09", 3, false)).toEqual(["2026-10-09", "2026-10-10", "2026-10-11"]);
    expect(buildDates("2026-10-09", 99, false)).toHaveLength(MAX_DAYS);
    expect(buildDates("nonsense", 3, false)).toEqual([]);
  });
});
