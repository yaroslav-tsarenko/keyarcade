"use client";

import Link from "next/link";
import type { Game } from "@/lib/mock-data";
import { TileRail } from "@/components/ui/Rail";
import { cx } from "@/lib/cx";

/** Each storefront gets its own colour, so a platform row is recognisable
 *  before you read the label — the way a console badges its own store. */
const PLATFORM_TINT: Record<string, string> = {
  Steam: "#1b2838",
  Epic: "#2a2a2a",
  Xbox: "#107c10",
  PlayStation: "#0070d1",
  Nintendo: "#e60012",
  GOG: "#7b5cf0",
  "Ubisoft Connect": "#0a58ca",
  "EA App": "#ea4b1f",
  "Battle.net": "#1275d1",
  Rockstar: "#f2a900",
};

export function PlatformShowcase({
  rows,
}: {
  rows: { platform: string; games: Game[] }[];
}) {
  if (rows.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1500px] px-4 md:px-6">
      <div className="space-y-10">
        {rows.map((row) => (
          <div
            key={row.platform}
            className="ambient-stage"
            style={
              {
                "--ambient": PLATFORM_TINT[row.platform] ?? "var(--signal)",
                "--ambient-strength": "0.14",
              } as React.CSSProperties
            }
          >
            <div className="mb-4 flex items-end justify-between gap-4">
              <h3 className="flex items-center gap-2.5 font-display text-xl font-extrabold text-ink">
                <span
                  aria-hidden
                  className={cx("size-2.5 rounded-chip")}
                  style={{ backgroundColor: PLATFORM_TINT[row.platform] ?? "var(--signal)" }}
                />
                {row.platform}
              </h3>
              <Link
                href={`/catalog?platform=${encodeURIComponent(row.platform)}`}
                className="ring-focus ring-focus-flat rounded-control px-3 py-1.5 text-sm font-semibold text-signal-deep transition-colors hover:bg-signal-tint"
              >
                All {row.platform} keys
              </Link>
            </div>
            <TileRail games={row.games} ariaLabel={`${row.platform} keys`} />
          </div>
        ))}
      </div>
    </section>
  );
}
