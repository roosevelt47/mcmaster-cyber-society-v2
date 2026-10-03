"use client";

import { useMemo, useSyncExternalStore } from "react";
import { decodeState, encodeState, type PollState } from "@/lib/meet";
import { CreatePoll } from "@/components/meet/CreatePoll";
import { PollView } from "@/components/meet/PollView";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

const getHash = (): string => window.location.hash;
const getServerHash = (): null => null;

/** The URL fragment is the only storage: no server, no database, nothing to leak. */
export function MeetPlanner() {
  const hash = useSyncExternalStore(subscribe, getHash, getServerHash);
  const state = useMemo(() => (hash ? decodeState(hash) : null), [hash]);

  if (hash === null) {
    return <div className="h-64 animate-pulse rounded-xl border border-border bg-surface" aria-busy="true" aria-label="Loading planner" role="status" />;
  }

  function writeState(next: PollState) {
    window.location.hash = encodeState(next);
  }

  if (!state) {
    return (
      <>
        {hash && (
          <p role="alert" className="mb-4 text-center text-[#ff8a98]">
            That poll link is invalid or damaged. Create a new poll below.
          </p>
        )}
        <CreatePoll onCreate={(code) => (window.location.hash = code)} />
      </>
    );
  }

  return (
    <PollView
      // Reset local form state when the link switches to a different poll.
      key={JSON.stringify(state.poll)}
      state={state}
      onUpdate={writeState}
      onReset={() => {
        // Clear the fragment without leaving a history entry pointing at the old poll.
        history.pushState(null, "", window.location.pathname);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }}
    />
  );
}
