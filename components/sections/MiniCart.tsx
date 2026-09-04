"use client";

import Link from "next/link";
import { useCart } from "@/components/ui/CartProvider";
import { Price } from "@/components/ui/Price";
import { PosterArt } from "@/components/ui/PosterArt";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

/** The cart dropdown. Shows the last few lines and the running total, so the
 *  header answers "what's in there?" without leaving the page. */
export function MiniCart({ onClose }: { onClose: () => void }) {
  const { lines, subtotalEur, count } = useCart();

  return (
    <div
      className="glass-panel absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-panel"
      role="dialog"
      aria-label="Cart"
    >
      <div className="flex items-center justify-between border-b border-edge px-4 py-3">
        <span className="eyebrow text-ink">Cart</span>
        <span className="tnum text-xs text-ink-muted">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </div>

      {lines.length === 0 ? (
        <p className="px-4 py-6 text-sm text-ink-muted">
          Nothing here yet. Add a key and it shows up instantly.
        </p>
      ) : (
        <ul className="max-h-72 overflow-y-auto">
          {lines.slice(0, 4).map((line) => (
            <li key={line.game.slug} className="flex items-center gap-3 px-4 py-2.5">
              <Link
                href={`/product/${line.game.slug}`}
                onClick={onClose}
                className="ring-focus ring-focus-flat size-11 shrink-0 overflow-hidden rounded-[10px]"
              >
                <PosterArt game={line.game} className="h-full w-full" />
              </Link>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">
                  {line.game.title}
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <Badge>{line.game.platform}</Badge>
                  <span className="tnum text-xs text-ink-muted">×{line.qty}</span>
                </span>
              </span>
              <Price
                eur={line.game.price * line.qty}
                className="tnum shrink-0 text-sm font-bold text-ink"
              />
            </li>
          ))}
        </ul>
      )}

      {lines.length > 4 ? (
        <p className="px-4 pb-1 text-xs text-ink-muted">
          + {lines.length - 4} more in the cart
        </p>
      ) : null}

      <div className="border-t border-edge p-3">
        <div className="mb-3 flex items-baseline justify-between px-1">
          <span className="text-sm text-ink-muted">Subtotal</span>
          <Price eur={subtotalEur} className="tnum font-display text-lg font-extrabold text-ink" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ButtonLink href="/cart" variant="glass" size="sm" onClick={onClose}>
            View cart
          </ButtonLink>
          <ButtonLink href="/checkout" size="sm" onClick={onClose}>
            Checkout
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
