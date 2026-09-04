"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Plus, Zap } from "lucide-react";
import type { Game } from "@/lib/mock-data";
import { discountPct } from "@/lib/mock-data";
import { useCart } from "@/components/ui/CartProvider";
import { useWishlist } from "@/components/ui/WishlistProvider";
import { PosterArt, coverTint } from "./PosterArt";
import { PriceTag } from "./PriceTag";
import { PriceSticker } from "./PriceSticker";
import { Badge } from "./Badge";
import { cx } from "@/lib/cx";

/**
 * The one tile component the whole store is built from.
 *
 * Every tile is the same height and its price row sits on the same line as its
 * neighbours', whatever the catalogue throws at it: real key titles run long,
 * and half of them carry no rating at all. So the title gets a fixed two-line
 * box, the meta row never wraps, and the footer is pushed to the bottom.
 *
 * Structure follows the console-tile rule: the cover is the object, the link is
 * a full-tile overlay, and the two real controls (wishlist, add) sit above that
 * overlay — one link plus two buttons, not a nest of interactive elements.
 *
 * `onActivate` hands the cover's dominant colour up to the rail so the ambient
 * wash behind it can follow the cursor.
 */
export function ProductCard({
  game,
  className,
  onActivate,
}: {
  game: Game;
  className?: string;
  onActivate?: (tint: string) => void;
}) {
  const pct = discountPct(game);
  const { add } = useCart();
  const { has, toggle, ready } = useWishlist();
  const [docking, setDocking] = useState(false);
  const wished = ready && has(game.slug);

  function onAdd() {
    add(game, 1);
    // The "insert" moment — the tile briefly docks into its slot.
    setDocking(true);
    window.setTimeout(() => setDocking(false), 400);
  }

  return (
    <article
      onMouseEnter={() => onActivate?.(coverTint(game))}
      onFocusCapture={() => onActivate?.(coverTint(game))}
      className={cx("group/tile relative h-full", className)}
    >
      <div
        className={cx(
          "ring-focus glass relative flex h-full flex-col overflow-hidden rounded-tile",
          docking && "animate-dock",
        )}
      >
        <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden bg-deck-sunk">
          <PosterArt game={game} className="h-full w-full" />

          <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
            <Badge className="max-w-[60%] truncate border-white/25 bg-black/45 text-white backdrop-blur-sm">
              {game.platform}
            </Badge>
            {pct > 0 ? <PriceSticker pct={pct} size="sm" /> : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-3.5">
          {/* Two fixed lines, so every title block occupies the same space. */}
          <h3 className="line-clamp-2 min-h-[2.5rem] font-display text-[0.95rem] font-bold leading-tight text-ink">
            {game.title}
          </h3>

          {/* Exactly two facts, one line, never wrapping — the tile's height
              must not depend on how much metadata a listing happens to carry.
              Region decides whether a key will activate; delivery is why
              someone buys here. Genre and rating live on the product page. */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
            <Badge className="min-w-0 shrink truncate">
              {game.kind === "Game" ? game.region : game.kind}
            </Badge>
            <Badge tone="stock" className="ml-auto shrink-0">
              <Zap width={11} height={11} aria-hidden /> Instant
            </Badge>
          </div>

          {/* Pushed to the bottom so prices line up across the whole rail. */}
          <div className="mt-auto flex items-end justify-between gap-2 pt-3">
            <PriceTag price={game.price} wasPrice={game.wasPrice} size="sm" />
            <button
              type="button"
              onClick={onAdd}
              aria-label={`Add ${game.title} to cart`}
              className="ring-focus ring-focus-flat relative z-20 grid size-9 shrink-0 place-items-center rounded-chip bg-signal text-on-signal lift-sm transition-[filter] hover:brightness-110"
            >
              <Plus width={17} height={17} aria-hidden />
            </button>
          </div>
        </div>

        {/* Whole-tile hit area, under the buttons. */}
        <Link
          href={`/product/${game.slug}`}
          className="absolute inset-0 z-10 rounded-tile"
          aria-label={`${game.title} — ${game.platform}, ${game.region}`}
        >
          <span className="sr-only">View {game.title}</span>
        </Link>
      </div>

      <button
        type="button"
        onClick={() => toggle(game.slug)}
        aria-pressed={wished}
        aria-label={wished ? `Remove ${game.title} from wishlist` : `Save ${game.title} to wishlist`}
        className={cx(
          "ring-focus ring-focus-flat absolute right-2.5 z-20 grid size-9 place-items-center rounded-chip",
          "border border-white/25 bg-black/45 text-white backdrop-blur-sm transition-opacity hover:bg-black/60",
          "md:opacity-0 md:focus-visible:opacity-100 md:group-hover/tile:opacity-100",
          wished && "md:opacity-100",
          pct > 0 ? "top-11" : "top-2.5",
        )}
      >
        <Heart width={16} height={16} className={cx(wished && "fill-coral text-coral")} aria-hidden />
      </button>
    </article>
  );
}
