"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Check, Copy } from "lucide-react";
import {
  MAX_NAME,
  MAX_RESPONSES,
  bestSlots,
  decodeState,
  encodeState,
  mergeStates,
  normalizeName,
  slotLabel,
  slotsPerDay,
  tally,
  upsertReply,
  type PollState,
} from "@/lib/meet";
import { AvailabilityGrid } from "@/components/meet/AvailabilityGrid";
import { Card, buttonClass } from "@/components/ui";

const FIELD =
  "min-h-11 w-full rounded-lg border border-border bg-background px-3 text-foreground focus:border-gold";

const dayFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "UTC",
  weekday: "short",
  month: "short",
  day: "numeric",
});

interface PollViewProps {
  state: PollState;
  /** Writes the new state into the URL fragment. */
  onUpdate: (state: PollState) => void;
  onReset: () => void;
}

export function PollView({ state, onUpdate, onReset }: PollViewProps) {
  const { poll } = state;
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<ReadonlySet<number>>(new Set());
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [mergeText, setMergeText] = useState("");
  const [copied, setCopied] = useState(false);

  const tallies = useMemo(() => tally(state), [state]);
  const best = useMemo(() => bestSlots(state), [state]);
  const link = useMemo(
    () =>
      typeof window === "undefined"
        ? ""
        : `${window.location.origin}${window.location.pathname}#${encodeState(state)}`,
    [state],
  );

  function setCell(cell: number, value: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (value) next.add(cell);
      else next.delete(cell);
      return next;
    });
  }

  function describeCell(cell: number): string {
    const perDay = slotsPerDay(poll);
    const day = poll.dates[Math.floor(cell / perDay)];
    return `${dayFormat.format(new Date(`${day}T12:00:00Z`))}, ${slotLabel(poll, cell % perDay)}`;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = normalizeName(name);
    if (!clean) {
      setMessage({ kind: "error", text: "Enter your name first." });
      return;
    }
    if (selected.size === 0) {
      setMessage({ kind: "error", text: "Click the times you are free." });
      return;
    }
    const isNew = !state.replies.some((r) => r.name.toLowerCase() === clean.toLowerCase());
    if (isNew && state.replies.length >= MAX_RESPONSES) {
      setMessage({ kind: "error", text: `This poll is full (${MAX_RESPONSES} people).` });
      return;
    }
    onUpdate(upsertReply(state, { name: clean, cells: [...selected] }));
    setMessage({ kind: "ok", text: "Saved. Copy the link below and send it to the group." });
    setSelected(new Set());
    setCopied(false);
  }

  function handleMerge(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const other = decodeState(mergeText);
    if (!other) {
      setMessage({ kind: "error", text: "That does not look like a valid poll link." });
      return;
    }
    const merged = mergeStates(state, other);
    if (!merged) {
      setMessage({ kind: "error", text: "That link is for a different poll." });
      return;
    }
    const replaced = other.replies
      .filter((o) =>
        state.replies.some(
          (r) => r.name.toLowerCase() === o.name.toLowerCase() && r.cells.join() !== o.cells.join(),
        ),
      )
      .map((o) => o.name);
    const dropped = state.replies.length + other.replies.length - replaced.length > MAX_RESPONSES;
    onUpdate(merged);
    setMergeText("");
    setMessage({
      kind: "ok",
      text:
        "Merged their answers into this poll." +
        (replaced.length ? ` Updated answers for: ${replaced.join(", ")}.` : "") +
        (dropped ? ` Poll limit of ${MAX_RESPONSES} people reached, extra answers were dropped.` : ""),
    });
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setMessage({ kind: "ok", text: "Link copied." });
    } catch {
      setMessage({ kind: "error", text: "Could not copy. Select the link and copy it manually." });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{poll.title}</h2>
          <p className="mt-1 text-sm text-muted">
            {state.replies.length} {state.replies.length === 1 ? "person has" : "people have"}{" "}
            answered
          </p>
        </div>
        <button type="button" onClick={onReset} className={buttonClass("secondary")}>
          New poll
        </button>
      </div>

      <div aria-live="polite" className="min-h-6">
        {message && (
          <p className={message.kind === "ok" ? "text-mint" : "text-[#ff8a98]"}>
            {message.text}
          </p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-lg font-semibold">1. Your availability</h3>
          <p className="mt-1 text-sm text-muted">Click or drag over the times you are free.</p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium">
                Your name
              </label>
              <input
                id="name"
                className={FIELD}
                value={name}
                maxLength={MAX_NAME}
                onChange={(e) => setName(e.target.value)}
                autoComplete="given-name"
              />
            </div>
            <AvailabilityGrid mode="edit" poll={poll} selected={selected} onSetCell={setCell} />
            <button type="submit" className={buttonClass("primary", "w-full")}>
              Add my availability
            </button>
          </form>
        </Card>

        <Card className="p-5">
          <h3 className="text-lg font-semibold">2. Group results</h3>
          <p className="mt-1 text-sm text-muted">Greener means more people are free.</p>
          <div className="mt-4">
            <AvailabilityGrid
              mode="results"
              poll={poll}
              tallies={tallies}
              total={state.replies.length}
            />
          </div>
          {best.length > 0 && (
            <div className="mt-5">
              <h4 className="text-sm font-semibold">Best times</h4>
              <ol className="mt-2 space-y-1 text-sm">
                {best.map((b) => (
                  <li key={b.cell} className="text-muted">
                    <span className="font-mono text-gold">
                      {b.count}/{state.replies.length}
                    </span>{" "}
                    <span className="text-foreground">{describeCell(b.cell)}</span>{" "}
                    <span className="break-words">({b.names.join(", ")})</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="text-lg font-semibold">3. Share the link</h3>
        <p className="mt-1 text-sm text-muted">
          This link contains everyone&apos;s answers so far. After you add yours, send the updated
          link back to the group. If two people answer at the same time, paste the other link below
          to combine them.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            readOnly
            aria-label="Poll link"
            value={link}
            onFocus={(e) => e.currentTarget.select()}
            className={`${FIELD} font-mono text-xs`}
          />
          <button type="button" onClick={handleCopy} className={buttonClass("secondary")}>
            {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>

        <form onSubmit={handleMerge} className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="merge" className="sr-only">
            Paste another link to merge
          </label>
          <input
            id="merge"
            className={FIELD}
            value={mergeText}
            onChange={(e) => setMergeText(e.target.value)}
            placeholder="Paste another person's link to merge answers"
          />
          <button type="submit" className={buttonClass("secondary")}>
            Merge
          </button>
        </form>
      </Card>
    </div>
  );
}
