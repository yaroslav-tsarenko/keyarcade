"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Game } from "@/lib/mock-data";
import { TileRail } from "@/components/ui/Rail";
import { cx } from "@/lib/cx";

/**
 * Two rows sharing one rail. Tabs rather than stacked sections, because a
 * shopper is choosing between "out now" and "coming" — not reading both.
 */
export function ReleaseTabs({ fresh, preorders }: { fresh: Game[]; preorders: Game[] }) {
  const tabs = [
    { id: "new", label: "New releases", games: fresh, href: "/catalog?sort=new" },
    { id: "pre", label: "Pre-orders", games: preorders, href: "/catalog?kind=Pre-order" },
  ].filter((t) => t.games.length > 0);

  const [active, setActive] = useState(0);
  const base = useId();
  const current = tabs[active];

  if (!current) return null;

  return (
    <section className="mx-auto max-w-[1500px] px-4 md:px-6">
      <div className="mb-5">
        <span className="eyebrow block">Out now &amp; coming</span>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-rail text-ink">Fresh on the deck</h2>
          <Link
            href={current.href}
            className="ring-focus ring-focus-flat group inline-flex items-center gap-1.5 rounded-control px-3 py-2 text-sm font-semibold text-signal-deep transition-colors hover:bg-signal-tint"
          >
            See all
            <ArrowRight
              width={16}
              height={16}
              className="transition-transform duration-[var(--dur-2)] group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {tabs.length > 1 ? (
          <div role="tablist" aria-label="Release timing" className="mt-3.5 flex gap-1.5">
            {tabs.map((t, i) => {
              const selected = i === active;
              return (
                <button
                  key={t.id}
                  role="tab"
                  id={`${base}-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`${base}-panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={cx(
                    "ring-focus ring-focus-flat rounded-chip px-4 py-1.5 text-sm font-semibold transition-colors",
                    selected
                      ? "bg-signal text-on-signal"
                      : "glass text-ink-muted hover:text-ink",
                  )}
                >
                  {t.label}
                  <span className="tnum ml-1.5 opacity-60">{t.games.length}</span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-${t.id}`}
          hidden={i !== active}
        >
          <TileRail games={t.games} ariaLabel={t.label} />
        </div>
      ))}
    </section>
  );
}
