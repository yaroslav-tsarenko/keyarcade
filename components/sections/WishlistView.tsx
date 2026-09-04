"use client";

import { useEffect, useState } from "react";
import type { Game } from "@/lib/mock-data";
import { useWishlist } from "@/components/ui/WishlistProvider";
import { ProductCard } from "@/components/ui/ProductCard";
import { ButtonLink } from "@/components/ui/Button";

export function WishlistView() {
  const { slugs, ready } = useWishlist();
  const [games, setGames] = useState<Game[] | null>(null);
  const [tint, setTint] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (slugs.length === 0) {
      setGames([]);
      return;
    }
    let alive = true;
    fetch(`/api/wishlist?slugs=${encodeURIComponent(slugs.join(","))}`)
      .then((r) => r.json())
      .then((d: { games: Game[] }) => {
        if (alive) setGames(d.games ?? []);
      })
      .catch(() => alive && setGames([]));
    return () => {
      alive = false;
    };
  }, [ready, slugs]);

  if (!ready || games === null) {
    return (
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="skeleton aspect-[3/4] rounded-tile" aria-hidden />
        ))}
      </ul>
    );
  }

  if (games.length === 0) {
    return (
      <div className="glass rounded-panel px-6 py-12 text-center">
        <h2 className="font-display text-xl font-bold text-ink">Nothing saved yet</h2>
        <p className="mx-auto mt-2 max-w-sm text-pretty text-ink-muted">
          Tap the heart on any tile and it lands here, with its price kept
          current.
        </p>
        <ButtonLink href="/catalog" className="mt-6">
          Browse the catalogue
        </ButtonLink>
      </div>
    );
  }

  return (
    <div
      className="ambient-stage"
      style={tint ? ({ "--ambient": tint } as React.CSSProperties) : undefined}
      onMouseLeave={() => setTint(null)}
    >
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {games.map((g) => (
          <li key={g.slug}>
            <ProductCard game={g} onActivate={setTint} />
          </li>
        ))}
      </ul>
    </div>
  );
}
