"use client";

import { Check } from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import {
  cellCount,
  cellIndex,
  slotLabel,
  slotsPerDay,
  type CellTally,
  type Poll,
} from "@/lib/meet";

const dayFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: "UTC",
  weekday: "short",
  month: "short",
  day: "numeric",
});

function dayLabel(date: string): string {
  return dayFormat.format(new Date(`${date}T12:00:00Z`));
}

interface BaseProps {
  poll: Poll;
}

interface EditableProps extends BaseProps {
  mode: "edit";
  selected: ReadonlySet<number>;
  /** Called per cell so the parent can use a functional state update (safe for fast drags). */
  onSetCell: (cell: number, value: boolean) => void;
}

interface ResultsProps extends BaseProps {
  mode: "results";
  tallies: readonly CellTally[];
  total: number;
}

const CELL = "h-9 w-full min-w-16 border border-border text-xs transition-colors";

// Even the strongest cell stays dark enough for light text to keep >= 4.5:1 contrast.
const MAX_HEAT_ALPHA = 0.5;

const ARROW_DELTAS: Readonly<Record<string, readonly [number, number]>> = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};

export function AvailabilityGrid(props: EditableProps | ResultsProps) {
  const { poll } = props;
  const rows = slotsPerDay(poll);
  // Mouse drag painting: remember whether this drag selects or clears cells.
  const paint = useRef<boolean | null>(null);
  // A mouse press toggles on pointerdown, so the follow-up click must be ignored.
  const handledByPointer = useRef(false);
  // Roving tabindex: the grid is one tab stop and arrow keys move between cells.
  const [focusCell, setFocusCell] = useState(0);

  function applyCell(cell: number, value: boolean) {
    if (props.mode !== "edit") return;
    props.onSetCell(cell, value);
  }

  function moveFocus(event: KeyboardEvent<HTMLButtonElement>, day: number, slot: number) {
    const delta = ARROW_DELTAS[event.key];
    if (!delta) return;
    event.preventDefault();
    const nextDay = Math.min(poll.dates.length - 1, Math.max(0, day + delta[0]));
    const nextSlot = Math.min(rows - 1, Math.max(0, slot + delta[1]));
    const next = cellIndex(poll, nextDay, nextSlot);
    if (next >= cellCount(poll)) return;
    setFocusCell(next);
    document.getElementById(`cell-${next}`)?.focus();
  }

  return (
    <div
      className="overflow-x-auto"
      onPointerUp={() => (paint.current = null)}
      onPointerLeave={() => (paint.current = null)}
    >
      <table className="w-full border-collapse select-none">
        <caption className="sr-only">
          {props.mode === "edit"
            ? "Select the times you are free. Use arrow keys to move and space to toggle."
            : "Group availability heatmap"}
        </caption>
        <thead>
          <tr>
            <th scope="col" className="w-20 p-1 text-left text-xs font-normal text-muted">
              <span className="sr-only">Time</span>
            </th>
            {poll.dates.map((date) => (
              <th key={date} scope="col" className="min-w-16 p-1 text-center text-xs font-medium">
                {dayLabel(date)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, slot) => (
            <tr key={slot}>
              <th
                scope="row"
                className="whitespace-nowrap p-1 pr-2 text-right text-xs font-normal text-muted"
              >
                {slot % 2 === 0 ? (
                  slotLabel(poll, slot)
                ) : (
                  <span className="sr-only">{slotLabel(poll, slot)}</span>
                )}
              </th>
              {poll.dates.map((date, day) => {
                const cell = cellIndex(poll, day, slot);
                const label = `${dayLabel(date)}, ${slotLabel(poll, slot)}`;

                if (props.mode === "results") {
                  const t = props.tallies[cell];
                  const alpha = props.total > 0 ? t.count / props.total : 0;
                  return (
                    <td key={date} className="p-0">
                      <div
                        className={`${CELL} flex items-center justify-center font-mono font-semibold text-foreground`}
                        style={{
                          backgroundColor: `rgba(74, 222, 128, ${alpha * MAX_HEAT_ALPHA})`,
                        }}
                        title={t.count ? `${t.count} free: ${t.names.join(", ")}` : "Nobody free"}
                        role="img"
                        aria-label={`${label}: ${t.count} of ${props.total} free${
                          t.names.length ? ` (${t.names.join(", ")})` : ""
                        }`}
                      >
                        {t.count > 0 && t.count}
                      </div>
                    </td>
                  );
                }

                const isOn = props.selected.has(cell);
                return (
                  <td key={date} className="p-0">
                    <button
                      id={`cell-${cell}`}
                      type="button"
                      aria-pressed={isOn}
                      aria-label={label}
                      tabIndex={cell === focusCell ? 0 : -1}
                      className={`${CELL} flex items-center justify-center ${
                        isOn ? "bg-brand hover:bg-brand-hover" : "bg-surface hover:bg-surface-2"
                      }`}
                      onFocus={() => setFocusCell(cell)}
                      onKeyDown={(e) => moveFocus(e, day, slot)}
                      onPointerDown={(e) => {
                        if (e.pointerType !== "mouse") return;
                        handledByPointer.current = true;
                        paint.current = !isOn;
                        applyCell(cell, !isOn);
                      }}
                      onPointerEnter={(e) => {
                        if (e.pointerType === "mouse" && paint.current !== null && e.buttons === 1) {
                          applyCell(cell, paint.current);
                        }
                      }}
                      onClick={() => {
                        // Mouse already toggled on pointerdown; this handles touch and keyboard.
                        if (handledByPointer.current) {
                          handledByPointer.current = false;
                          return;
                        }
                        applyCell(cell, !isOn);
                      }}
                    >
                      {isOn && <Check className="size-4 text-white" aria-hidden="true" />}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
