"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  initial = 1,
  min = 1,
  max = 10,
  onChange,
}: {
  initial?: number;
  min?: number;
  max?: number;
  onChange?: (n: number) => void;
}) {
  const [n, setN] = useState(initial);
  const set = (v: number) => {
    const clamped = Math.max(min, Math.min(max, v));
    setN(clamped);
    onChange?.(clamped);
  };
  return (
    <div className="inline-flex items-center rounded-control border border-edge bg-[var(--glass)] lift-sm">
      <button
        type="button"
        onClick={() => set(n - 1)}
        disabled={n <= min}
        aria-label="Decrease quantity"
        className="grid h-10 w-10 place-items-center border-r-2 border-ink disabled:opacity-40"
      >
        <Minus width={16} height={16} strokeWidth={3} />
      </button>
      <span className="w-10 text-center font-body font-black tabular-nums" aria-live="polite">
        {n}
      </span>
      <button
        type="button"
        onClick={() => set(n + 1)}
        disabled={n >= max}
        aria-label="Increase quantity"
        className="grid h-10 w-10 place-items-center border-l-2 border-ink disabled:opacity-40"
      >
        <Plus width={16} height={16} strokeWidth={3} />
      </button>
    </div>
  );
}
