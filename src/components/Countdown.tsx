"use client";

import { useSyncExternalStore } from "react";

const SECOND = 1000;

function subscribe(onChange: () => void): () => void {
  const id = setInterval(onChange, SECOND);
  return () => clearInterval(id);
}

// Snapshot is whole seconds so React only re-renders once per second.
function getSnapshot(): number {
  return Math.floor(Date.now() / SECOND);
}

// Server and first client render agree on "no value", avoiding a hydration mismatch.
function getServerSnapshot(): null {
  return null;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function Countdown({ targetIso }: { targetIso: string }) {
  const nowSeconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const target = Math.floor(Date.parse(targetIso) / SECOND);
  if (Number.isNaN(target)) return null;

  if (nowSeconds === null) {
    return <CountdownShell parts={["--", "--", "--", "--"]} label="Calculating time until event" />;
  }

  const remaining = target - nowSeconds;
  if (remaining <= 0) {
    return (
      <p className="font-mono text-lg text-mint" role="status">
        Happening now
      </p>
    );
  }

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;
  return (
    <CountdownShell
      parts={[String(days), pad(hours), pad(minutes), pad(seconds)]}
      label={`${days} ${days === 1 ? "day" : "days"}, ${hours} ${hours === 1 ? "hour" : "hours"} and ${minutes} ${minutes === 1 ? "minute" : "minutes"} until the event`}
    />
  );
}

const UNITS = ["days", "hrs", "min", "sec"] as const;

function CountdownShell({ parts, label }: { parts: readonly string[]; label: string }) {
  return (
    <div className="flex gap-2 sm:gap-3" role="timer" aria-label={label}>
      {parts.map((value, i) => (
        <div
          key={UNITS[i]}
          className="min-w-14 rounded-lg sm:min-w-16 border border-border bg-background px-3 py-2 text-center"
          aria-hidden="true"
        >
          <div className="font-mono text-2xl font-bold tabular-nums text-gold">{value}</div>
          <div className="text-xs text-muted">{UNITS[i]}</div>
        </div>
      ))}
    </div>
  );
}
