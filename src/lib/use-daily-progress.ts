"use client";

import { useCallback, useSyncExternalStore } from "react";
import { EMPTY_PROGRESS, parseProgress, type DailyProgress } from "@/lib/daily";

const STORAGE_KEY = "mcs:daily:v1";
const CHANGE_EVENT = "mcs:daily:change";

// useSyncExternalStore needs a referentially stable snapshot, so cache by raw string.
let cachedRaw: string | null = null;
let cachedValue: DailyProgress = EMPTY_PROGRESS;
// Used when localStorage is blocked, so progress still works for this tab.
let memoryProgress: DailyProgress | null = null;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // storage blocked (private mode, disabled cookies)
  }
}

function getSnapshot(): DailyProgress {
  const raw = readRaw();
  if (raw === null && memoryProgress) return memoryProgress;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = parseProgress(raw);
  }
  return cachedValue;
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** Progress persisted in this browser only. Works (without saving) if storage is unavailable. */
export function useDailyProgress(): readonly [DailyProgress, (next: DailyProgress) => void] {
  const progress = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_PROGRESS);

  const save = useCallback((next: DailyProgress) => {
    memoryProgress = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore: progress simply will not persist.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return [progress, save];
}
