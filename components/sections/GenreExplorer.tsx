"use client";

import { useMemo, useState } from "react";
import type { Game } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/lib/cx";

/**
 * Genre chips filtering a live grid. Chips are the filter *and* the label, so
 * there is no separate "showing 12 of 40" line to keep in sync.
 */
export function GenreExplorer({ games, genres }: { games: Game[]; genres: string[] }) {
  const [genre, setGenre] = useState<string | null>(null);
  const [tint, setTint] = useState<string | null>(null);

  const shown = useMemo(
    () => (genre ? games.filter((g) => g.genre === genre) : games).slice(0, 10),
    [games, genre],
  );

  if (games.length === 0 || genres.length === 0) return null;

  return (
    <section className="border-y border-edge bg-deck-band py-12 md:py-14">
      <div className="mx-auto max-w-[1500px] px-4 md:px-6">
        <SectionHeading
          kicker="Browse by genre"
          title="What are you in the mood for?"
          href="/catalog"
        />

        <div className="mb-6 flex flex-wrap gap-2">
          <GenreChip active={genre === null} onClick={() => setGenre(null)}>
            Everything
          </GenreChip>
          {genres.map((g) => (
            <GenreChip key={g} active={genre === g} onClick={() => setGenre(g)}>
              {g}
            </GenreChip>
          ))}
        </div>

        <div
          className="ambient-stage"
          style={tint ? ({ "--ambient": tint } as React.CSSProperties) : undefined}
          onMouseLeave={() => setTint(null)}
        >
          {shown.length === 0 ? (
            <p className="glass rounded-panel px-5 py-8 text-center text-sm text-ink-muted">
              Nothing in {genre} right now. Stock changes through the day — try another genre.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {shown.map((g, i) => (
                <li
                  key={g.slug}
                  className="animate-tile-in"
                  data-stagger={((i % 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6}
                >
                  <ProductCard game={g} onActivate={setTint} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function GenreChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(
        "ring-focus ring-focus-flat rounded-chip px-4 py-2 text-sm font-semibold transition-colors",
        active ? "bg-signal text-on-signal" : "glass text-ink hover:text-signal-deep",
      )}
    >
      {children}
    </button>
  );
}
