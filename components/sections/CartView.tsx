"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Tag, ShoppingBag, ArrowRight } from "lucide-react";
import { discountPct } from "@/lib/mock-data";
import { lookupPromo } from "@/lib/site-config";
import { PosterArt } from "@/components/ui/PosterArt";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { useCart } from "@/components/ui/CartProvider";

export function CartView() {
  const { lines, subtotalEur, setQty, remove, ready } = useCart();
  const [promo, setPromo] = useState("");
  const [applied, setApplied] = useState<{ code: string; off: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  function applyPromo() {
    const hit = lookupPromo(promo);
    if (!hit) {
      setApplied(null);
      setPromoError("That code isn’t valid. Try BLK10.");
      return;
    }
    setApplied(hit);
    setPromoError(null);
  }

  const listTotal = lines.reduce((s, l) => s + (l.game.wasPrice ?? l.game.price) * l.qty, 0);
  const savedOnDeals = listTotal - subtotalEur;
  const promoOff = applied ? subtotalEur * applied.off : 0;
  const total = subtotalEur - promoOff;

  // Avoid flashing the empty state before localStorage is read.
  if (!ready) {
    return <div className="py-16" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-tile border border-edge bg-preorder-tint lift-md">
          <ShoppingBag width={38} height={38} strokeWidth={2.5} />
        </div>
        <h1 className="mt-6 text-stage text-ink">Cart&apos;s empty</h1>
        <p className="mx-auto mt-3 max-w-sm font-semibold text-ink-muted">
          Nothing on the counter yet. The shelf is deep and half of it&apos;s on
          sale — go grab a key.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/catalog" variant="signal" size="lg">
            Browse the shelf
          </ButtonLink>
          <ButtonLink href="/catalog?deals=1" variant="glass" size="lg">
            See today&apos;s deals
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
      {/* line items */}
      <div>
        <ul className="flex flex-col gap-4">
          {lines.map(({ game, qty }) => {
            const pct = discountPct(game);
            return (
              <li
                key={game.slug}
                className="flex gap-4 rounded-tile border border-edge bg-[var(--glass)] p-3 lift-md sm:p-4"
              >
                <Link
                  href={`/product/${game.slug}`}
                  className="w-20 shrink-0 overflow-hidden rounded-control border border-edge bg-ink sm:w-24"
                >
                  <div className="aspect-[3/4]">
                    <PosterArt game={game} className="h-full w-full" />
                  </div>
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link href={`/product/${game.slug}`} className="block">
                        <h3 className="truncate text-lg leading-tight text-ink">{game.title}</h3>
                      </Link>
                      <p className="mt-0.5 eyebrow">
                        {game.platform} · {game.region}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        <Badge tone="system">{game.kind}</Badge>
                        {pct > 0 && <Badge tone="deal">−{pct}%</Badge>}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(game.slug)}
                      aria-label={`Remove ${game.title} from cart`}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-control border border-edge bg-[var(--glass)] lift-sm transition-[filter] hover:brightness-[1.06]"
                    >
                      <Trash2 width={16} height={16} strokeWidth={2.5} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-end justify-between gap-2">
                    <QtyStepper
                      initial={qty}
                      onChange={(n) => setQty(game.slug, n)}
                    />
                    <div className="text-right">
                      <Price eur={game.price * qty} className="block font-body text-xl font-black tabular-nums text-ink" />
                      {game.wasPrice && (
                        <Price eur={game.wasPrice * qty} className="text-xs font-bold text-ink-muted line-through" />
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <Link
          href="/catalog"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink underline-offset-4 hover:underline"
        >
          ← Keep browsing
        </Link>
      </div>

      {/* summary */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-tile border border-edge bg-ink p-5 text-ink-invert lift-md">
          <h2 className="text-2xl text-ink-invert">Order summary</h2>

          {/* promo */}
          <div className="mt-4">
            <label htmlFor="promo" className="eyebrow mb-2 block">
              Promo code
            </label>
            <div className="flex gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-control border-2 border-bone/30 bg-ink px-3">
                <Tag width={15} height={15} className="text-preorder" />
                <input
                  id="promo"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  placeholder="BLK10"
                  className="w-full bg-transparent py-2 text-sm font-semibold text-ink-invert outline-none placeholder:text-ink-invert/40"
                />
              </div>
              <button
                type="button"
                onClick={applyPromo}
                className="rounded-control bg-preorder-tint px-4 py-2 text-sm font-semibold text-ink"
              >
                Apply
              </button>
            </div>
            {applied && (
              <p className="mt-2 text-xs font-bold text-preorder">
                Code {applied.code} applied — {Math.round(applied.off * 100)}% off this order.
              </p>
            )}
            {promoError && (
              <p className="mt-2 text-xs font-bold text-signal-deep">{promoError}</p>
            )}
          </div>

          <dl className="mt-5 flex flex-col gap-2 border-t border-bone/15 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-invert/75">Subtotal</dt>
              <dd><Price eur={subtotalEur} className="font-bold tabular-nums" /></dd>
            </div>
            {savedOnDeals > 0 && (
              <div className="flex justify-between text-preorder">
                <dt>Deal savings</dt>
                <dd className="font-bold tabular-nums">−<Price eur={savedOnDeals} /></dd>
              </div>
            )}
            {applied && promoOff > 0 && (
              <div className="flex justify-between text-preorder">
                <dt>Promo ({applied.code})</dt>
                <dd className="font-bold tabular-nums">−<Price eur={promoOff} /></dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-invert/75">Delivery</dt>
              <dd className="font-bold text-stock">Instant · free</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-baseline justify-between border-t border-bone/15 pt-4">
            <span className="text-xl text-ink-invert">Total</span>
            <Price eur={total} className="font-display text-4xl text-preorder" />
          </div>

          <ButtonLink href="/checkout" variant="signal" size="lg" className="mt-5 w-full">
            Checkout <ArrowRight width={18} height={18} strokeWidth={3} />
          </ButtonLink>
          <p className="mt-3 text-center text-xs text-ink-invert/50">
            Keys delivered to your email the moment payment clears.
          </p>
        </div>
      </div>
    </div>
  );
}
