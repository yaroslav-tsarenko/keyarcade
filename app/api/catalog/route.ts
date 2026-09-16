import { NextResponse } from "next/server";
import { getCatalog, CATALOG_PAGE_SIZE } from "@/lib/catalog";
import type { Genre } from "@/lib/mock-data";

/**
 * One more page of the catalog wall. The catalog page pre-loads the first few
 * pages server-side; the browser calls this to keep "Load more" going through
 * the full match set (often thousands of keys) rather than stopping at the
 * pre-loaded pool. Filters (platform/genre/search) are passed straight through
 * to Kinguin so a deep genre or platform landing keeps returning relevant keys.
 */
export async function GET(request: Request) {
  const sp = new URL(request.url).searchParams;
  const platform = sp.get("platform") ?? undefined;
  const genre = (sp.get("genre") ?? undefined) as Genre | undefined;
  const q = sp.get("q")?.trim() || undefined;
  const page = Math.max(1, Number(sp.get("page") ?? "1") || 1);

  const { games } = await getCatalog({ limit: CATALOG_PAGE_SIZE, page, platform, genre, q });

  // Kinguin already filtered by genre; trust that match and label each key with
  // the requested genre so the client-side genre facet stays coherent (mirrors
  // the catalog page's own normalisation).
  const shaped = genre ? games.map((g) => ({ ...g, genre })) : games;

  return NextResponse.json(
    { games: shaped },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
  );
}
