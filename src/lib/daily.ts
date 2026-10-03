import { CHALLENGES, type Challenge } from "@/data/challenges";

const DAY_KEY = /^\d{4}-\d{2}-\d{2}$/;
const MS_PER_DAY = 86_400_000;

export function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, " ");
}

/** sha256(`${id}|${normalizedAnswer}`) as lowercase hex. Must match scripts/hash-answer.mjs. */
export async function hashAnswer(challengeId: string, answer: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${challengeId}|${normalizeAnswer(answer)}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function isCorrect(challenge: Challenge, answer: string): Promise<boolean> {
  if (!normalizeAnswer(answer)) return false;
  return (await hashAnswer(challenge.id, answer)) === challenge.answerHash;
}

function dayNumber(dayKey: string): number {
  const [y, m, d] = dayKey.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / MS_PER_DAY);
}

/** Everyone gets the same challenge on the same calendar day. */
export function challengeForDay(
  dayKey: string,
  challenges: readonly Challenge[] = CHALLENGES,
): Challenge {
  const index = ((dayNumber(dayKey) % challenges.length) + challenges.length) % challenges.length;
  return challenges[index];
}

function previousDay(dayKey: string): string {
  return new Date((dayNumber(dayKey) - 1) * MS_PER_DAY).toISOString().slice(0, 10);
}

/** Consecutive days solved, ending today (or yesterday, so the streak survives until midnight). */
export function currentStreak(solvedDays: readonly string[], today: string): number {
  const solved = new Set(solvedDays);
  let cursor = solved.has(today) ? today : previousDay(today);
  let streak = 0;
  while (solved.has(cursor)) {
    streak += 1;
    cursor = previousDay(cursor);
  }
  return streak;
}

export interface DailyProgress {
  /** Day keys (YYYY-MM-DD) on which the daily challenge was solved. */
  solvedDays: readonly string[];
  /** Challenge ids solved at any time (including practice). */
  solvedIds: readonly string[];
}

export const EMPTY_PROGRESS: DailyProgress = { solvedDays: [], solvedIds: [] };

/** Parse untrusted localStorage content into a safe, bounded progress object. */
export function parseProgress(raw: string | null): DailyProgress {
  if (!raw) return EMPTY_PROGRESS;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return EMPTY_PROGRESS;
    const { solvedDays, solvedIds } = data as Record<string, unknown>;
    const knownIds = new Set(CHALLENGES.map((c) => c.id));
    return {
      solvedDays: Array.isArray(solvedDays)
        ? solvedDays.filter((d): d is string => typeof d === "string" && DAY_KEY.test(d)).slice(-400)
        : [],
      solvedIds: Array.isArray(solvedIds)
        ? solvedIds.filter((id): id is string => typeof id === "string" && knownIds.has(id))
        : [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

export function recordSolve(
  progress: DailyProgress,
  challengeId: string,
  dayKey: string,
  isTodaysChallenge: boolean,
): DailyProgress {
  return {
    solvedIds: progress.solvedIds.includes(challengeId)
      ? progress.solvedIds
      : [...progress.solvedIds, challengeId],
    solvedDays:
      isTodaysChallenge && !progress.solvedDays.includes(dayKey)
        ? [...progress.solvedDays, dayKey]
        : progress.solvedDays,
  };
}
