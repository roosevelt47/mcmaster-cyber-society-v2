"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { CheckCircle2, Flame, Lightbulb } from "lucide-react";
import { CHALLENGES, type Challenge } from "@/data/challenges";
import { challengeForDay, currentStreak, isCorrect, recordSolve } from "@/lib/daily";
import { dayKey } from "@/lib/format";
import { useDailyProgress } from "@/lib/use-daily-progress";
import { Badge, Card, buttonClass } from "@/components/ui";

const MAX_ANSWER_LENGTH = 200;

function subscribeToClock(onChange: () => void): () => void {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}

const getToday = (): string => dayKey(new Date());
const getServerToday = (): null => null;

type Feedback = "idle" | "correct" | "wrong" | "error";

export function DailyChallenge() {
  const today = useSyncExternalStore(subscribeToClock, getToday, getServerToday);
  if (!today) {
    return <Card className="h-64 animate-pulse" aria-busy="true" aria-label="Loading challenge" />;
  }
  return <Board today={today} />;
}

function Board({ today }: { today: string }) {
  const [progress, saveProgress] = useDailyProgress();
  const todays = challengeForDay(today);
  const [selectedId, setSelectedId] = useState<string>(todays.id);
  const selected = CHALLENGES.find((c) => c.id === selectedId) ?? todays;
  const streak = currentStreak(progress.solvedDays, today);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div>
        <ChallengeCard
          // Remount on challenge change so the answer, hint and feedback reset cleanly.
          key={selected.id}
          challenge={selected}
          isToday={selected.id === todays.id}
          alreadySolved={progress.solvedIds.includes(selected.id)}
          onSolved={() =>
            saveProgress(recordSolve(progress, selected.id, today, selected.id === todays.id))
          }
        />
      </div>

      <aside className="space-y-4">
        <Card>
          <div className="flex items-center gap-3">
            <Flame className="size-8 text-gold" aria-hidden="true" />
            <div>
              <p className="font-mono text-3xl font-bold text-gold">{streak}</p>
              <p className="text-sm text-muted">day streak</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted">
            Saved in this browser only. Solve today&apos;s challenge to keep it going.
          </p>
        </Card>

        <Card>
          <h2 className="mb-3 font-semibold">All challenges</h2>
          <ul className="space-y-1">
            {CHALLENGES.map((c) => {
              const solved = progress.solvedIds.includes(c.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    aria-current={c.id === selected.id ? "true" : undefined}
                    className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-surface-2 ${
                      c.id === selected.id ? "bg-surface-2 text-foreground" : "text-muted"
                    }`}
                  >
                    <span>
                      {c.title}
                      {c.id === todays.id && <span className="ml-2 text-xs text-gold">today</span>}
                    </span>
                    {solved && (
                      <CheckCircle2 className="size-4 shrink-0 text-mint" aria-label="Solved" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      </aside>
    </div>
  );
}

interface ChallengeCardProps {
  challenge: Challenge;
  isToday: boolean;
  alreadySolved: boolean;
  onSolved: () => void;
}

function ChallengeCard({ challenge, isToday, alreadySolved, onSolved }: ChallengeCardProps) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback>("idle");
  const [showHint, setShowHint] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const solved = alreadySolved || feedback === "correct";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsChecking(true);
    try {
      const ok = await isCorrect(challenge, answer);
      setFeedback(ok ? "correct" : "wrong");
      if (ok && !alreadySolved) onSolved();
    } catch {
      // crypto.subtle only exists on secure origins (https or localhost).
      setFeedback("error");
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="gold">{isToday ? "Today's challenge" : "Practice"}</Badge>
        <Badge>{challenge.category}</Badge>
        <Badge tone="mint">{"★".repeat(challenge.difficulty)}</Badge>
      </div>
      <h2 className="mt-4 text-2xl font-bold">{challenge.title}</h2>
      <p className="mt-2 text-muted">{challenge.prompt}</p>

      <pre
        className="mt-5 overflow-x-auto whitespace-pre-wrap break-all rounded-lg border border-border bg-background p-4 font-mono text-base text-mint"
        tabIndex={0}
        role="region"
        aria-label="Challenge data"
      >
        {challenge.data}
      </pre>

      <form onSubmit={handleSubmit} className="mt-5">
        <label htmlFor="answer" className="mb-2 block text-sm font-medium">
          Your answer
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="answer"
            name="answer"
            type="text"
            value={answer}
            maxLength={MAX_ANSWER_LENGTH}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            onChange={(e) => {
              setAnswer(e.target.value);
              setFeedback("idle");
            }}
            className="min-h-11 flex-1 rounded-lg border border-border bg-background px-4 font-mono text-foreground placeholder:text-muted focus:border-gold"
            placeholder="type the decoded text"
          />
          <button type="submit" disabled={isChecking} className={buttonClass("primary")}>
            Check
          </button>
        </div>
      </form>

      <div aria-live="polite" className="mt-4 min-h-6">
        {feedback === "correct" && (
          <p className="flex items-center gap-2 font-semibold text-mint">
            <CheckCircle2 className="size-5" aria-hidden="true" /> Correct. Nice work!
          </p>
        )}
        {feedback === "wrong" && (
          <p className="text-[#ff8a98]">Not quite. Check your spelling or try the hint.</p>
        )}
        {feedback === "error" && (
          <p className="text-[#ff8a98]">
            Could not check your answer in this browser. Open the site over https and try again.
          </p>
        )}
        {feedback === "idle" && solved && (
          <p className="text-mint">You already solved this one.</p>
        )}
      </div>

      <div className="mt-2">
        <button
          type="button"
          onClick={() => setShowHint((v) => !v)}
          aria-expanded={showHint}
          className="inline-flex min-h-11 items-center gap-2 text-sm text-gold hover:underline"
        >
          <Lightbulb className="size-4" aria-hidden="true" />
          {showHint ? "Hide hint" : "Need a hint?"}
        </button>
        {showHint && <p className="mt-1 text-sm text-muted">{challenge.hint}</p>}
      </div>
    </Card>
  );
}
