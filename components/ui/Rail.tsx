"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Game } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";
import { cx } from "@/lib/cx";

/**
 * A console rail: a horizontal row of tiles with snap points, momentum on
 * touch, drag-to-scroll on desktop, edge fades, and arrow controls that
 * disappear at the ends. Arrow keys move the rail when it holds focus.
 */
export function Rail({
  children,
  ariaLabel,
  className,
}: {
  children: ReactNode;
  ariaLabel: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.82, 720), behavior: "smooth" });
  };

  // Mouse drag-to-scroll; touch already scrolls natively.
  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    drag.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.down || !ref.current) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    ref.current.scrollLeft = drag.current.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.down = false;
  };
  // Swallow the click that ends a drag, so dragging never opens a product.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      nudge(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      nudge(-1);
    }
  };

  return (
    <div className={cx("relative", className)}>
      <RailArrow side="left" hidden={atStart} onClick={() => nudge(-1)} />
      <RailArrow side="right" hidden={atEnd} onClick={() => nudge(1)} />

      <div
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        tabIndex={0}
        onScroll={sync}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        className={cx(
          "no-scrollbar rail-snap rail-fade -mx-4 flex gap-4 overflow-x-auto px-4 pb-6 pt-2",
          "scroll-px-4 [touch-action:pan-y] focus-visible:outline-none md:cursor-grab md:gap-5 md:active:cursor-grabbing",
        )}
      >
        {children}
      </div>
    </div>
  );
}

function RailArrow({
  side,
  hidden,
  onClick,
}: {
  side: "left" | "right";
  hidden: boolean;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={hidden}
      aria-label={side === "left" ? "Scroll left" : "Scroll right"}
      className={cx(
        "ring-focus ring-focus-flat glass-panel absolute top-[36%] z-20 hidden size-10 place-items-center rounded-chip",
        "text-ink transition-opacity duration-[var(--dur-2)] disabled:pointer-events-none disabled:opacity-0 md:grid",
        side === "left" ? "-left-4" : "-right-4",
      )}
    >
      <Icon width={19} height={19} aria-hidden />
    </button>
  );
}

/**
 * A rail of game tiles. Owns the ambient tint: whatever tile the cursor or
 * keyboard is on washes its dominant colour across the space behind the row,
 * the way a console dashboard changes mood per game.
 */
export function TileRail({
  games,
  ariaLabel,
  numbered = false,
  tileClassName = "w-[164px] shrink-0 sm:w-[186px] lg:w-[208px]",
}: {
  games: Game[];
  ariaLabel: string;
  /** Renders oversized rank numerals behind the tiles (Top Charts). */
  numbered?: boolean;
  tileClassName?: string;
}) {
  const [tint, setTint] = useState<string | null>(null);

  return (
    <div
      className="ambient-stage"
      style={tint ? ({ "--ambient": tint } as React.CSSProperties) : undefined}
      onMouseLeave={() => setTint(null)}
    >
      <Rail ariaLabel={ariaLabel}>
        {games.map((game, i) => (
          <div key={game.slug} className={cx("relative", numbered && "pl-8", tileClassName)}>
            {numbered ? (
              <span
                aria-hidden
                className="tnum pointer-events-none absolute -left-1 bottom-6 z-0 font-display text-[5rem] font-extrabold leading-none text-ink/10"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            ) : null}
            <ProductCard game={game} onActivate={setTint} className="relative z-[1]" />
          </div>
        ))}
      </Rail>
    </div>
  );
}
