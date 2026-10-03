// "When2meet without a server": the whole poll (and every response) lives in the URL fragment.
// Fragments are never sent to the server, so availability stays private to people with the link.
// All input is untrusted (it comes from a pasted link), so every field is validated and bounded.

export const MAX_DAYS = 14;
export const MAX_TITLE = 80;
export const MAX_NAME = 30;
export const MAX_RESPONSES = 50;
export const MAX_CODE_LENGTH = 24_000;
const SLOT_MINUTES = 30;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface Poll {
  title: string;
  /** Sorted, unique YYYY-MM-DD strings. */
  dates: readonly string[];
  /** Whole hours, 0-23. */
  startHour: number;
  /** Whole hours, startHour+1 to 24. */
  endHour: number;
}

export interface Reply {
  name: string;
  /** Selected cell indexes, sorted. Cell = dayIndex * slotsPerDay + slotIndex. */
  cells: readonly number[];
}

export interface PollState {
  poll: Poll;
  replies: readonly Reply[];
}

export function slotsPerDay(poll: Poll): number {
  return ((poll.endHour - poll.startHour) * 60) / SLOT_MINUTES;
}

export function cellCount(poll: Poll): number {
  return poll.dates.length * slotsPerDay(poll);
}

export function cellIndex(poll: Poll, dayIndex: number, slotIndex: number): number {
  return dayIndex * slotsPerDay(poll) + slotIndex;
}

/** "6:30 PM" style label for a slot row. */
export function slotLabel(poll: Poll, slotIndex: number): string {
  const totalMinutes = poll.startHour * 60 + slotIndex * SLOT_MINUTES;
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const suffix = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function isRealDate(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function normalizeName(name: string): string {
  return name.replace(/\s+/g, " ").trim().slice(0, MAX_NAME);
}

export function validatePoll(input: Poll): Poll | null {
  const title = input.title.replace(/\s+/g, " ").trim();
  const dates = [...new Set(input.dates)].toSorted();
  const okHours =
    Number.isInteger(input.startHour) &&
    Number.isInteger(input.endHour) &&
    input.startHour >= 0 &&
    input.endHour <= 24 &&
    input.endHour > input.startHour;
  if (!title || title.length > MAX_TITLE) return null;
  if (dates.length === 0 || dates.length > MAX_DAYS || !dates.every(isRealDate)) return null;
  if (!okHours) return null;
  return { title, dates, startHour: input.startHour, endHour: input.endHour };
}

// ---- Compact (de)serialisation -------------------------------------------------------------

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(code: string): string {
  const padded = code.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return new TextDecoder("utf-8", { fatal: true }).decode(
    Uint8Array.from(binary, (c) => c.charCodeAt(0)),
  );
}

function packCells(cells: readonly number[], total: number): string {
  const bytes = new Uint8Array(Math.ceil(total / 8));
  for (const cell of cells) bytes[cell >> 3] |= 1 << (cell & 7);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function unpackCells(packed: string, total: number): number[] | null {
  try {
    const padded = packed.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
    if (binary.length !== Math.ceil(total / 8)) return null;
    const cells: number[] = [];
    for (let i = 0; i < total; i++) {
      if (binary.charCodeAt(i >> 3) & (1 << (i & 7))) cells.push(i);
    }
    return cells;
  } catch {
    return null;
  }
}

export function encodeState(state: PollState): string {
  const total = cellCount(state.poll);
  return toBase64Url(
    JSON.stringify({
      v: 1,
      t: state.poll.title,
      d: state.poll.dates,
      s: state.poll.startHour,
      e: state.poll.endHour,
      r: state.replies.map((r) => [r.name, packCells(r.cells, total)]),
    }),
  );
}

/** Accepts a bare code, "#code", or a full link. Returns null for anything invalid. */
export function decodeState(input: string): PollState | null {
  try {
    const trimmed = input.trim();
    const hashAt = trimmed.lastIndexOf("#");
    const code = hashAt >= 0 ? trimmed.slice(hashAt + 1) : trimmed;
    if (!code || code.length > MAX_CODE_LENGTH || !/^[A-Za-z0-9_-]+$/.test(code)) return null;

    const data: unknown = JSON.parse(fromBase64Url(code));
    if (typeof data !== "object" || data === null) return null;
    const { v, t, d, s, e, r } = data as Record<string, unknown>;
    if (v !== 1 || typeof t !== "string" || !Array.isArray(d) || !Array.isArray(r)) return null;
    if (typeof s !== "number" || typeof e !== "number" || !d.every((x) => typeof x === "string")) {
      return null;
    }

    const poll = validatePoll({ title: t, dates: d as string[], startHour: s, endHour: e });
    // Re-encoding must be canonical, otherwise two links for one poll would never merge.
    if (!poll || !poll.dates.every((date, i) => date === d[i]) || poll.dates.length !== d.length) {
      return null;
    }

    const total = cellCount(poll);
    const replies: Reply[] = [];
    for (const entry of r.slice(0, MAX_RESPONSES)) {
      if (!Array.isArray(entry) || typeof entry[0] !== "string" || typeof entry[1] !== "string") {
        return null;
      }
      const name = normalizeName(entry[0]);
      const cells = unpackCells(entry[1], total);
      if (!name || !cells) return null;
      replies.push({ name, cells });
    }
    return { poll, replies: dedupeReplies(replies) };
  } catch {
    return null;
  }
}

// ---- Replies and tallies ------------------------------------------------------------------

function dedupeReplies(replies: readonly Reply[]): Reply[] {
  const byName = new Map<string, Reply>();
  for (const reply of replies) byName.set(reply.name.toLowerCase(), reply);
  return [...byName.values()].slice(0, MAX_RESPONSES);
}

/** Add or replace (by name, case-insensitive) one person's availability. */
export function upsertReply(state: PollState, reply: Reply): PollState {
  const clean: Reply = {
    name: normalizeName(reply.name),
    cells: [...new Set(reply.cells)].filter((c) => c >= 0 && c < cellCount(state.poll)).toSorted((a, b) => a - b),
  };
  return { poll: state.poll, replies: dedupeReplies([...state.replies, clean]) };
}

export function isSamePoll(a: Poll, b: Poll): boolean {
  return (
    a.title === b.title &&
    a.startHour === b.startHour &&
    a.endHour === b.endHour &&
    a.dates.length === b.dates.length &&
    a.dates.every((d, i) => d === b.dates[i])
  );
}

export function mergeStates(base: PollState, other: PollState): PollState | null {
  if (!isSamePoll(base.poll, other.poll)) return null;
  return other.replies.reduce(upsertReply, base);
}

export interface CellTally {
  count: number;
  names: readonly string[];
}

export function tally(state: PollState): CellTally[] {
  const total = cellCount(state.poll);
  const names: string[][] = Array.from({ length: total }, () => []);
  for (const reply of state.replies) {
    for (const cell of reply.cells) names[cell]?.push(reply.name);
  }
  return names.map((n) => ({ count: n.length, names: n }));
}

export interface BestSlot {
  cell: number;
  count: number;
  names: readonly string[];
}

/** Cells with the most people free, ties broken by earliest time. */
export function bestSlots(state: PollState, limit = 5): BestSlot[] {
  return tally(state)
    .map((t, cell) => ({ cell, count: t.count, names: t.names }))
    .filter((t) => t.count > 0)
    .toSorted((a, b) => b.count - a.count || a.cell - b.cell)
    .slice(0, limit);
}

/** Build a date list starting at `start`, optionally skipping weekends. */
export function buildDates(start: string, days: number, skipWeekends: boolean): string[] {
  if (!isRealDate(start)) return [];
  const [y, m, d] = start.split("-").map(Number);
  const dates: string[] = [];
  const cursor = new Date(Date.UTC(y, m - 1, d));
  for (let guard = 0; dates.length < Math.min(days, MAX_DAYS) && guard < 60; guard++) {
    const weekday = cursor.getUTCDay();
    if (!skipWeekends || (weekday !== 0 && weekday !== 6)) {
      dates.push(cursor.toISOString().slice(0, 10));
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}
