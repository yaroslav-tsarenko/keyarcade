import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { discountPct } from "@/lib/mock-data";

/**
 * A handful of real products for chrome that needs covers — the navigation
 * mega-panel. Kept separate from the page payload so opening a menu never
 * blocks the page, and cached so hovering the tab repeatedly is free.
 */
export async function GET() {
  const { games } = await getCatalog({ limit: 24 });
  const withArt = games.filter((g) => g.image);
  const pool = withArt.length >= 6 ? withArt : games;
  const best = [...pool].sort((a, b) => discountPct(b) - discountPct(a));

  return NextResponse.json(
    {
      deal: best[0] ?? null,
      covers: pool.slice(0, 8),
    },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900" } },
  );
}
