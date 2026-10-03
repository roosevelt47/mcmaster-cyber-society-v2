import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { CHALLENGES } from "@/data/challenges";
import {
  EMPTY_PROGRESS,
  challengeForDay,
  currentStreak,
  hashAnswer,
  isCorrect,
  normalizeAnswer,
  parseProgress,
  recordSolve,
} from "@/lib/daily";

describe("answers", () => {
  it("normalizes case and whitespace", () => {
    expect(normalizeAnswer("  Hello   World ")).toBe("hello world");
  });

  it("matches the CLI hashing script (node crypto)", async () => {
    const expected = createHash("sha256").update("x|hello world").digest("hex");
    expect(await hashAnswer("x", "  HELLO world ")).toBe(expected);
  });

  it("accepts the right answer and rejects wrong or empty ones", async () => {
    const challenge = CHALLENGES.find((c) => c.id === "caesar-3");
    expect(challenge).toBeDefined();
    if (!challenge) return;
    expect(await isCorrect(challenge, "Hello Hackers")).toBe(true);
    expect(await isCorrect(challenge, "khoor kdfnhuv")).toBe(false);
    expect(await isCorrect(challenge, "   ")).toBe(false);
  });

  it("never stores a plaintext-looking answer hash twice", () => {
    const hashes = CHALLENGES.map((c) => c.answerHash);
    expect(new Set(hashes).size).toBe(hashes.length);
    expect(new Set(CHALLENGES.map((c) => c.id)).size).toBe(CHALLENGES.length);
    for (const h of hashes) expect(h).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("daily selection", () => {
  it("is deterministic and rotates daily", () => {
    expect(challengeForDay("2026-10-12")).toBe(challengeForDay("2026-10-12"));
    expect(challengeForDay("2026-10-12")).not.toBe(challengeForDay("2026-10-13"));
  });

  it("cycles through every challenge", () => {
    const seen = new Set<string>();
    for (let d = 1; d <= CHALLENGES.length; d++) {
      seen.add(challengeForDay(`2026-11-${String(d).padStart(2, "0")}`).id);
    }
    expect(seen.size).toBe(CHALLENGES.length);
  });
});

describe("streaks", () => {
  it("counts consecutive days ending today", () => {
    expect(currentStreak(["2026-10-10", "2026-10-11", "2026-10-12"], "2026-10-12")).toBe(3);
  });

  it("keeps the streak alive until the day is over", () => {
    expect(currentStreak(["2026-10-10", "2026-10-11"], "2026-10-12")).toBe(2);
  });

  it("resets after a missed day", () => {
    expect(currentStreak(["2026-10-09", "2026-10-10"], "2026-10-12")).toBe(0);
    expect(currentStreak([], "2026-10-12")).toBe(0);
  });

  it("handles month and year boundaries", () => {
    expect(currentStreak(["2026-12-31", "2027-01-01"], "2027-01-01")).toBe(2);
  });
});

describe("progress storage", () => {
  it("ignores corrupt or hostile localStorage content", () => {
    expect(parseProgress(null)).toBe(EMPTY_PROGRESS);
    expect(parseProgress("not json")).toBe(EMPTY_PROGRESS);
    expect(parseProgress("42")).toBe(EMPTY_PROGRESS);
    const parsed = parseProgress(
      JSON.stringify({ solvedDays: ["2026-10-12", "<script>", 5], solvedIds: ["caesar-3", "nope", {}] }),
    );
    expect(parsed.solvedDays).toEqual(["2026-10-12"]);
    expect(parsed.solvedIds).toEqual(["caesar-3"]);
  });

  it("recordSolve is immutable and only extends the streak for today's challenge", () => {
    const practice = recordSolve(EMPTY_PROGRESS, "caesar-3", "2026-10-12", false);
    expect(practice.solvedDays).toEqual([]);
    expect(practice.solvedIds).toEqual(["caesar-3"]);
    const daily = recordSolve(practice, "hex-flag", "2026-10-12", true);
    expect(daily.solvedDays).toEqual(["2026-10-12"]);
    expect(EMPTY_PROGRESS.solvedIds).toEqual([]);
  });
});
