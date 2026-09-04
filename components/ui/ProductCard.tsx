"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Plus, Star, Zap } from "lucide-react";
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
 * Structure follows the console-tile rule: the cover is the object, the link
 * is a full-tile overlay, and the two real controls (wishlist, add) sit above
 * that overlay — so the tile is one link plus two buttons, not a nest of
 * interactive elements. Both controls stay visible on touch, where there is no
 * hover to reveal them.
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
      className={cx("group/tile relative", className)}
    >
      <div
        className={cx(
          "ring-focus glass relative overflow-hidden rounded-tile",
          docking && "animate-dock",
        )}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-deck-sunk">
          <PosterArt game={game} className="h-full w-full" />

          <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-start justify-between gap-2">
            <Badge className="border-white/25 bg-black/45 text-white backdrop-blur-sm">
              {game.platform}
            </Badge>
            {pct > 0 ? <PriceSticker pct={pct} size="sm" /> : null}
          </div>

        </div>

        <div className="p-3.5">
          <h3 className="line-clamp-1 font-display text-[0.95rem] font-bold leading-tight text-ink">
            {game.title}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-ink-muted">
            <Badge>{game.region}</Badge>
            {game.kind !== "Game" ? (
              <Badge tone={game.kind === "Pre-order" ? "preorder" : "special"}>{game.kind}</Badge>
            ) : null}
            <span className="truncate">{game.genre}</span>
            <span className="tnum inline-flex shrink-0 items-center gap-1">
              <Star width={12} height={12} className="fill-current text-preorder" aria-hidden />
              {game.rating.toFixed(1)}
            </span>
            <Badge tone="stock" className="ml-auto shrink-0">
              <Zap width={11} height={11} aria-hidden /> Instant
            </Badge>
          </div>

          <div className="mt-3 flex items-end justify-between gap-2">
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
