import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";

/**
 * Instant search for the header combobox. Returns a short, already-shaped
 * result list so the dropdown can render without pulling the whole catalogue
 * payload into the client.
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const { games } = await getCatalog({ limit: 12, q });
  const results = games.slice(0, 6).map((g) => ({
    slug: g.slug,
    title: g.title,
    platform: g.platform,
    price: g.price,
    wasPrice: g.wasPrice,
    image: g.image ?? null,
    hue: g.hue,
  }));

  return NextResponse.json(
    { results },
    // Identical queries are common while typing; a short shared cache keeps
    // the upstream catalogue call off the critical path.
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}
