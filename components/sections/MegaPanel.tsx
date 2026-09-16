"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Game } from "@/lib/mock-data";
import { discountPct } from "@/lib/mock-data";
import { PosterArt } from "@/components/ui/PosterArt";
import { PriceTag } from "@/components/ui/PriceTag";
import { PriceSticker } from "@/components/ui/PriceSticker";
import { Badge } from "@/components/ui/Badge";
import { cx } from "@/lib/cx";

interface Featured {
  deal: Game | null;
  covers: Game[];
}

// Fetched once per page load and shared by both panels — hovering the tabs
// back and forth should never re-request.
let cache: Featured | null = null;
let inflight: Promise<Featured> | null = null;

function loadFeatured(): Promise<Featured> {
  if (cache) return Promise.resolve(cache);
  inflight ??= fetch("/api/featured")
    .then((r) => r.json())
    .then((d: Featured) => {
      cache = d;
      return d;
    })
    .catch(() => ({ deal: null, covers: [] }));
  return inflight;
}

export function MegaPanel({
  kind,
  links,
  onClose,
}: {
  kind: "platforms" | "genres";
  links: { label: string; href: string }[];
  onClose: () => void;
}) {
  const [featured, setFeatured] = useState<Featured | null>(cache);

  useEffect(() => {
    let alive = true;
    loadFeatured().then((d) => {
      if (alive) setFeatured(d);
    });
    return () => {
      alive = false;
    };
  }, []);

  const deal = featured?.deal ?? null;
  const covers = featured?.covers ?? [];
  const pct = deal ? discountPct(deal) : 0;

  return (
    <div
      className="glass-panel absolute inset-x-0 top-full border-x-0 border-b border-t-0 shadow-none"
      onMouseLeave={onClose}
    >
      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-7 md:px-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="min-w-0">
          <p className="eyebrow mb-3">{kind === "platforms" ? "Platforms" : "Genres"}</p>
          <ul className="grid max-w-md grid-cols-2 gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="ring-focus ring-focus-flat block rounded-control px-3 py-2 text-sm font-semibold text-ink transition-colors hover:bg-chip"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {covers.length > 0 ? (
            <>
              <p className="eyebrow mb-2.5 mt-6">In stock now</p>
              <ul className="no-scrollbar -m-2 flex max-w-md gap-2.5 overflow-x-auto p-2">
                {covers.slice(0, 8).map((g) => (
                  <li key={g.slug} className="shrink-0">
                    <Link
                      href={`/product/${g.slug}`}
                      className="ring-focus block w-16 overflow-hidden rounded-[12px]"
                      title={g.title}
                    >
                      <span className="sr-only">{g.title}</span>
                      <span className="block aspect-[3/4]">
                        <PosterArt game={g} className="h-full w-full" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <div className="min-w-0">
          <p className="eyebrow mb-3">Featured deal</p>
          {deal ? (
            <Link
              href={`/product/${deal.slug}`}
              className={cx("ring-focus glass group block overflow-hidden rounded-tile")}
            >
              <span className="relative block aspect-[16/10] w-full overflow-hidden bg-deck-sunk">
                <PosterArt game={deal} className="h-full w-full" />
                {pct > 0 ? (
                  <span className="absolute right-2.5 top-2.5">
                    <PriceSticker pct={pct} size="sm" />
                  </span>
                ) : null}
              </span>
              <span className="block p-3.5">
                <span className="line-clamp-1 block font-display text-sm font-bold text-ink">
                  {deal.title}
                </span>
                <span className="mt-2 flex items-center justify-between gap-2">
                  <PriceTag price={deal.price} wasPrice={deal.wasPrice} size="sm" />
                  <Badge tone="signal">
                    Open <ArrowRight width={12} height={12} aria-hidden />
                  </Badge>
                </span>
              </span>
            </Link>
          ) : (
            <div className="skeleton h-44 rounded-tile" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
