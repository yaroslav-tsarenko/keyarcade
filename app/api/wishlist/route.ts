import { NextResponse } from "next/server";
import { getCatalogGame } from "@/lib/catalog";

/** Resolves saved slugs to live products. The wishlist lives in the browser,
 *  so this is how it becomes real listings with current prices. */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("slugs") ?? "";
  const slugs = raw.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 40);
  if (slugs.length === 0) return NextResponse.json({ games: [] });

  const settled = await Promise.all(slugs.map((s) => getCatalogGame(s).catch(() => null)));
  return NextResponse.json({ games: settled.filter(Boolean) });
}
