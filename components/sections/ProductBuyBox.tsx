"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Zap, ShieldCheck, Heart, Check } from "lucide-react";
import type { Game } from "@/lib/mock-data";
import { discountPct } from "@/lib/mock-data";
import { PriceTag } from "@/components/ui/PriceTag";
import { PriceSticker } from "@/components/ui/PriceSticker";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/ui/CartProvider";
import { useWishlist } from "@/components/ui/WishlistProvider";

export function ProductBuyBox({ game }: { game: Game }) {
  const pct = discountPct(game);
  const router = useRouter();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const saved = has(game.slug);

  const isPreorder = game.kind === "Pre-order";

  function addToCart() {
    add(game, qty);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  function buyNow() {
    add(game, qty);
    router.push("/checkout");
  }

  return (
    <div className="rounded-tile border border-edge bg-[var(--glass)] p-5 lift-lg">
      <div className="flex items-start justify-between gap-4">
        <PriceTag price={game.price} wasPrice={game.wasPrice} size="lg" />
        {pct > 0 && <PriceSticker pct={pct} slug={game.slug} size="lg" />}
      </div>

      <p className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-stock">
        <Zap width={15} height={15} strokeWidth={3} />
        {isPreorder ? "Key ships on launch day" : "In stock · delivered in a minute"}
      </p>

      <div className="mt-5 flex items-center gap-3">
        <span className="text-sm font-semibold text-ink-muted">Qty</span>
        <QtyStepper onChange={setQty} />
      </div>

      <div className="mt-5 flex flex-col gap-3">
        <Button type="button" onClick={addToCart} variant={added ? "coral" : "signal"} size="lg" className="w-full">
          {added ? (
            <>
              <Check width={18} height={18} strokeWidth={3} /> Added to cart
            </>
          ) : (
            <>
              <ShoppingCart width={18} height={18} strokeWidth={2.5} />
              {isPreorder ? "Pre-order key" : "Add to cart"}
            </>
          )}
        </Button>
        <div className="flex gap-3">
          <Button type="button" onClick={buyNow} variant="glass" size="md" className="flex-1">
            Buy now
          </Button>
          <button
            type="button"
            onClick={() => toggle(game.slug)}
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            aria-pressed={saved}
            className={`grid h-auto w-12 place-items-center rounded-control border border-edge lift-sm transition-[filter] hover:brightness-[1.06] ${
              saved ? "bg-signal text-ink-invert" : "bg-[var(--glass)] text-ink"
            }`}
          >
            <Heart width={18} height={18} strokeWidth={2.5} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        {added && (
          <Link href="/cart" className="text-center text-sm font-semibold text-ink underline-offset-4 hover:underline">
            View cart →
          </Link>
        )}
      </div>

      <p className="mt-5 flex items-center gap-2 border-t border-edge pt-4 text-xs font-semibold text-ink-muted">
        <ShieldCheck width={16} height={16} strokeWidth={2.5} className="text-stock" />
        Original keys, sold once. Bad code? We replace or refund it.
      </p>
    </div>
  );
}
