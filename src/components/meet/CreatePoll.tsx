"use client";

import { useState, type FormEvent } from "react";
import { dayKey } from "@/lib/format";
import { MAX_DAYS, MAX_TITLE, buildDates, encodeState, validatePoll } from "@/lib/meet";
import { Card, buttonClass } from "@/components/ui";

const FIELD =
  "min-h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground focus:border-gold";

const HOURS = Array.from({ length: 25 }, (_, h) => h);

/** Keep the raw text while typing; clamp to a valid day count on blur and submit. */
function clampDays(raw: string): number {
  return Math.min(MAX_DAYS, Math.max(1, Math.trunc(Number(raw)) || 1));
}

function hourLabel(hour: number): string {
  if (hour === 0 || hour === 24) return "12:00 AM";
  if (hour === 12) return "12:00 PM";
  return hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
}

export function CreatePoll({ onCreate }: { onCreate: (code: string) => void }) {
  const [title, setTitle] = useState("");
  const [start, setStart] = useState(() => dayKey(new Date()));
  const [days, setDays] = useState("5");
  const [skipWeekends, setSkipWeekends] = useState(true);
  const [startHour, setStartHour] = useState(9);
  const [endHour, setEndHour] = useState(21);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const poll = validatePoll({
      title,
      dates: buildDates(start, clampDays(days), skipWeekends),
      startHour,
      endHour,
    });
    if (!poll) {
      setError("Check the title, start date and that the end time is after the start time.");
      return;
    }
    setError(null);
    onCreate(encodeState({ poll, replies: [] }));
  }

  return (
    <Card className="mx-auto max-w-xl p-6">
      <h2 className="text-xl font-bold">Create a meeting poll</h2>
      <p className="mt-1 text-sm text-muted">
        No account and no server. Everything is stored in the link you share.
      </p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label htmlFor="title" className="mb-1 block text-sm font-medium">
            What is the meeting?
          </label>
          <input
            id="title"
            className={FIELD}
            value={title}
            maxLength={MAX_TITLE}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="CTF team practice"
            required
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="start" className="mb-1 block text-sm font-medium">
              First day
            </label>
            <input
              id="start"
              type="date"
              className={FIELD}
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="days" className="mb-1 block text-sm font-medium">
              Number of days (max {MAX_DAYS})
            </label>
            <input
              id="days"
              type="number"
              min={1}
              max={MAX_DAYS}
              className={FIELD}
              value={days}
              onChange={(e) => setDays(e.target.value)}
              onBlur={() => setDays(String(clampDays(days)))}
            />
          </div>
          <div>
            <label htmlFor="from" className="mb-1 block text-sm font-medium">
              Earliest time
            </label>
            <select
              id="from"
              className={FIELD}
              value={startHour}
              onChange={(e) => setStartHour(Number(e.target.value))}
            >
              {HOURS.slice(0, 24).map((h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="to" className="mb-1 block text-sm font-medium">
              Latest time
            </label>
            <select
              id="to"
              className={FIELD}
              value={endHour}
              onChange={(e) => setEndHour(Number(e.target.value))}
            >
              {HOURS.slice(1).map((h) => (
                <option key={h} value={h}>
                  {hourLabel(h)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input
            type="checkbox"
            className="size-5 accent-[#c4122f]"
            checked={skipWeekends}
            onChange={(e) => setSkipWeekends(e.target.checked)}
          />
          Skip weekends
        </label>
        {error && (
          <p role="alert" className="text-sm text-[#ff8a98]">
            {error}
          </p>
        )}
        <button type="submit" className={buttonClass("primary", "w-full")}>
          Create poll
        </button>
      </form>
    </Card>
  );
}
