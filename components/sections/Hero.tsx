"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Clock, ShieldCheck, Zap } from "lucide-react";
import type { StageSlot } from "@/lib/catalog";
import { discountPct } from "@/lib/mock-data";
import { PosterArt, coverTint } from "@/components/ui/PosterArt";
import { PriceTag } from "@/components/ui/PriceTag";
import { PriceSticker } from "@/components/ui/PriceSticker";
import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { ButtonLink } from "@/components/ui/Button";
import { PLATFORM_LINKS } from "@/lib/nav";
import { cx } from "@/lib/cx";

const ADVANCE_MS = 7000;
/** Only the curated head auto-advances; the rest of the queue is browsed. */
const AUTO_SLOTS = 4;
/** Rows per page in the queue, from lg up. */
const PAGE_SIZE = 3;

/**
 * The hero is a dashboard, not a banner: one large stage and, beside it, the
 * queue of everything waiting behind it. Picking a row promotes it into the
 * stage, exactly like flipping through a console's featured row — and the
 * stage's cover tints the whole band behind it.
 *
 * The queue is exactly as tall as the stage and scrolls inside itself, so the
 * band's height is set by the product on show rather than by how many rows
 * happen to be queued.
 */
export function Hero({ stage }: { stage: StageSlot[] }) {
  const [index, setIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const current = stage[index] ?? stage[0];
  const autoCount = Math.min(AUTO_SLOTS, stage.length);
  const pageCount = Math.max(1, Math.ceil(stage.length / PAGE_SIZE));

  useEffect(() => {
    if (paused || autoCount < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      // Auto-advance stays inside the curated head; cycling the whole queue
      // would keep yanking the list out from under whoever is reading it.
      () => setIndex((i) => (i < autoCount ? (i + 1) % autoCount : i)),
      ADVANCE_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, autoCount]);

  // The page follows the selection, so an auto-advance never leaves the
  // highlighted row on a page nobody is looking at.
  useEffect(() => {
    setPage(Math.floor(index / PAGE_SIZE));
  }, [index]);

  if (!current) return null;

  const game = current.game;
  const pct = discountPct(game);
  // Real catalogue titles run long; the stage steps its display size down
  // rather than letting one product push the price and CTA off the fold.
  const titleSize =
    game.title.length > 52
      ? "text-2xl sm:text-3xl lg:text-4xl"
      : game.title.length > 30
        ? "text-3xl sm:text-4xl lg:text-5xl"
        : "text-stage";

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: React.TouchEvent) {
    const start = touchX.current;
    const end = e.changedTouches[0]?.clientX;
    touchX.current = null;
    if (start == null || end == null || stage.length < 2) return;
    const dx = end - start;
    if (Math.abs(dx) < 48) return;
    setIndex((i) => (dx < 0 ? (i + 1) % stage.length : (i - 1 + stage.length) % stage.length));
  }

  return (
    <section
      className="ambient-stage border-b border-edge bg-deck-band"
      style={{ "--ambient": coverTint(game), "--ambient-strength": "0.42" } as React.CSSProperties}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured games"
    >
      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-6 md:py-9">
        <div className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_306px]">
          {/* The stage */}
          <div
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="glass grid gap-5 rounded-panel p-4 sm:grid-cols-[minmax(0,240px)_minmax(0,1fr)] sm:items-center sm:gap-7 sm:p-6"
          >
            <Link
              href={`/product/${game.slug}`}
              className="ring-focus ring-idle relative mx-auto block w-full max-w-[190px] overflow-hidden rounded-tile bg-deck-sunk sm:mx-0 sm:max-w-none"
              aria-label={`${game.title} — open product page`}
            >
              <span key={game.slug} className="animate-tile-in block aspect-[3/4] w-full">
                <PosterArt game={game} priority className="h-full w-full" />
              </span>
              {pct > 0 ? (
                <span className="absolute right-3 top-3">
                  <PriceSticker pct={pct} size="md" />
                </span>
              ) : null}
            </Link>

            <div className="min-w-0">
              <p className="eyebrow">{current.label}</p>

              <h1
                className={cx(
                  "mt-2.5 line-clamp-3 text-balance font-display font-extrabold leading-[1.08] text-ink",
                  titleSize,
                )}
              >
                {game.title}
              </h1>

              <p className="mt-3 line-clamp-2 max-w-lg text-ink-muted">{game.tagline}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Badge>{game.platform}</Badge>
                <Badge>{game.genre}</Badge>
                <Badge>{game.region}</Badge>
                <Badge tone="stock">
                  <Zap width={11} height={11} aria-hidden /> Instant delivery
                </Badge>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <PriceTag price={game.price} wasPrice={game.wasPrice} size="lg" />
                <ButtonLink href={`/product/${game.slug}`} size="lg">
                  Get the key
                </ButtonLink>
              </div>

              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-muted">
                <li className="inline-flex items-center gap-2">
                  <Clock width={15} height={15} className="text-signal" aria-hidden /> Delivered in a minute
                </li>
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck width={15} height={15} className="text-signal" aria-hidden /> Official distributors
                </li>
              </ul>
            </div>
          </div>

          {/* The queue — a horizontal strip on phones; from lg a paged column
              beside the stage. Three rows to a page and a page rail down the
              right edge, so there is no scrollbar to hunt for and every page
              is the same shape. The panel is taken out of flow at lg so the
              band's height comes from the stage, not from the queue. */}
          {stage.length > 1 ? (
            <div className="relative">
              <div className="glass flex flex-col rounded-panel p-2.5 lg:absolute lg:inset-0 lg:p-3">
                <div className="flex items-baseline justify-between px-1 pb-2">
                  <p className="eyebrow">Up next</p>
                  <p className="tnum text-xs text-ink-faint">
                    {index + 1}/{stage.length}
                  </p>
                </div>

                <div className="flex min-h-0 flex-1 gap-2">
                  <div
                    role="group"
                    aria-label="Up next"
                    className={cx(
                      "no-scrollbar -m-1 flex min-w-0 flex-1 gap-2.5 overflow-x-auto p-1",
                      "lg:min-h-0 lg:flex-col lg:gap-2 lg:overflow-visible",
                    )}
                  >
                    {stage.map((slot, i) => {
                      const active = i === index;
                      const off = discountPct(slot.game);
                      const onPage = Math.floor(i / PAGE_SIZE) === page;
                      return (
                        <button
                          key={slot.game.slug}
                          type="button"
                          onClick={() => setIndex(i)}
                          aria-current={active}
                          aria-label={`Show ${slot.game.title}`}
                          className={cx(
                            "ring-focus ring-focus-flat flex w-[228px] shrink-0 items-center gap-3 rounded-tile p-2 text-left",
                            "transition-colors duration-[var(--dur-2)]",
                            // Off-page rows leave the layout entirely at lg,
                            // so a page is exactly three rows tall.
                            "lg:w-auto lg:min-h-0 lg:min-w-0 lg:flex-1 lg:shrink",
                            !onPage && "lg:hidden",
                            // Each row is its own surface, so a page reads as
                            // three items rather than one striped list.
                            "border",
                            active
                              ? "border-signal/35 bg-signal-tint"
                              : "border-edge/70 bg-deck hover:border-edge hover:bg-deck-band",
                          )}
                        >
                          <span className="size-12 shrink-0 overflow-hidden rounded-[10px] bg-deck-sunk lg:size-14">
                            <PosterArt game={slot.game} className="h-full w-full" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="eyebrow block truncate">{slot.label}</span>
                            <span className="mt-0.5 block truncate text-sm font-semibold text-ink">
                              {slot.game.title}
                            </span>
                            <span className="mt-0.5 flex items-baseline gap-1.5">
                              <Price
                                eur={slot.game.price}
                                className="tnum text-xs font-bold text-signal-deep"
                              />
                              {off > 0 && slot.game.wasPrice ? (
                                <Price
                                  eur={slot.game.wasPrice}
                                  className="tnum text-[0.6875rem] text-ink-faint line-through"
                                />
                              ) : null}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Page rail — the scrollbar's job, done as a control you
                      can actually aim at. */}
                  {pageCount > 1 ? (
                    <div
                      role="tablist"
                      aria-label="Queue pages"
                      aria-orientation="vertical"
                      className="hidden shrink-0 flex-col justify-center gap-1.5 lg:flex"
                    >
                      {Array.from({ length: pageCount }).map((_, i) => (
                        <button
                          key={i}
                          role="tab"
                          type="button"
                          aria-selected={i === page}
                          aria-label={`Page ${i + 1} of ${pageCount}`}
                          onClick={() => setPage(i)}
                          className="ring-focus ring-focus-flat group grid w-5 place-items-center rounded-chip py-1"
                        >
                          <span
                            className={cx(
                              "w-1.5 rounded-chip transition-all duration-[var(--dur-2)]",
                              i === page
                                ? "h-8 bg-signal"
                                : "h-1.5 bg-chip-ink/30 group-hover:h-3 group-hover:bg-chip-ink/55",
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Platform quick-rail */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="eyebrow mr-1">Jump to</span>
          {PLATFORM_LINKS.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="ring-focus ring-focus-flat glass rounded-chip px-3.5 py-1.5 text-sm font-semibold text-ink"
            >
              {p.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
