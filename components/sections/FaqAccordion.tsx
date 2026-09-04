"use client";

import { useState } from "react";
import { Search, Plus, Minus } from "lucide-react";
import { FAQ } from "@/lib/mock-data";

export function FaqAccordion() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  const q = query.trim().toLowerCase();
  const items = FAQ.filter(
    (f) => q === "" || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q),
  );

  return (
    <div>
      <div className="flex items-center gap-2 rounded-control border border-edge bg-[var(--glass)] px-4 py-3 lift-md">
        <Search width={20} height={20} className="text-ink-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search questions — try “region” or “refund”"
          className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-ink-muted/60"
          aria-label="Search FAQ"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {items.length === 0 && (
          <p className="rounded-control border border-edge bg-[var(--glass)] p-5 text-sm font-semibold text-ink-muted">
            No answer matches “{query}”. Try another word, or message support below.
          </p>
        )}
        {items.map((f) => {
          const realIndex = FAQ.indexOf(f);
          const isOpen = open === realIndex;
          return (
            <div key={realIndex} className="rounded-tile border border-edge bg-[var(--glass)] lift-md">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : realIndex)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="text-lg leading-tight text-ink">{f.q}</span>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-control border border-edge bg-[var(--glass)]">
                  {isOpen ? <Minus width={16} height={16} strokeWidth={3} /> : <Plus width={16} height={16} strokeWidth={3} />}
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-edge px-5 py-4">
                  <p className="max-w-2xl text-[15px] leading-relaxed text-ink-muted">{f.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
