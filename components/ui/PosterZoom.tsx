"use client";

import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import type { Game } from "@/lib/mock-data";
import { PosterArt } from "./PosterArt";

// Product-page cover that opens a full, uncropped view of the artwork on click.
export function PosterZoom({ game }: { game: Game }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block h-full w-full cursor-zoom-in"
        aria-label={`Enlarge ${game.title} cover`}
      >
        <PosterArt game={game} priority className="h-full w-full" />
        <span className="pointer-events-none absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-control border border-edge bg-[var(--glass)]/90 text-ink lift-sm opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn width={18} height={18} strokeWidth={2.5} />
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-[color-mix(in_oklab,var(--deck-sunk)_85%,transparent)] p-4" role="dialog" aria-modal="true">
          <button aria-label="Close" onClick={() => setOpen(false)} className="absolute inset-0" />
          <div className="relative max-h-[92vh] w-full max-w-md">
            <div className="overflow-hidden glass rounded-panel p-2">
              {game.image ? (
                // Full artwork, uncropped — the whole image is visible here.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={game.image} alt={`${game.title} cover`} className="max-h-[85vh] w-full object-contain" />
              ) : (
                <div className="aspect-[3/4]">
                  <PosterArt game={game} className="h-full w-full" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute -right-3 -top-3 grid h-10 w-10 place-items-center rounded-full border-2 border-ink bg-[var(--glass)] text-ink lift-md"
            >
              <X strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
