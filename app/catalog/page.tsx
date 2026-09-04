import type { Metadata } from "next";
import { getCatalog } from "@/lib/catalog";
import { PLATFORMS, KINDS, type Platform, type ProductKind } from "@/lib/mock-data";
import { CatalogBrowser } from "@/components/sections/CatalogBrowser";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse every game key and digital code on the Keyarcade shop floor.",
};

function parsePlatform(v?: string): Platform | undefined {
  return PLATFORMS.find((p) => p.toLowerCase() === v?.toLowerCase());
}
function parseKind(v?: string): ProductKind | undefined {
  return KINDS.find((k) => k.toLowerCase() === v?.toLowerCase());
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; kind?: string; deals?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const platform = parsePlatform(sp.platform);
  const kind = parseKind(sp.kind);
  const deals = sp.deals === "1";
  const q = sp.q?.trim() || undefined;

  // Push platform + search down to Kinguin so a filtered landing (e.g. a
  // platform tile) comes back stocked instead of empty. Pull a wide page so
  // the client-side filters have enough to work with.
  const { games } = await getCatalog({ limit: 96, platform, q });

  const heading = q
    ? `“${q}”`
    : deals
      ? "Best-price keys"
      : kind
        ? `${kind}s`
        : platform
          ? `${platform} keys`
          : "All keys";

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-6 md:py-10">
      <header className="mb-6">
        <span className="eyebrow inline-block">
          The shelf
        </span>
        <h1 className="mt-2 text-stage text-ink">{heading}</h1>
        <p className="mt-2 max-w-xl font-semibold text-ink-muted">
          Every Steam, Epic, Xbox, PlayStation, Nintendo and GOG code we stock.
          Filter the wall down to the deal you came for.
        </p>
      </header>

      {games.length === 0 ? (
        <p className="rounded-tile border border-edge bg-[var(--glass)] p-8 text-center font-semibold text-ink-muted lift-md">
          The shelf is restocking — live keys are momentarily unavailable. Please
          try again in a minute.
        </p>
      ) : (
        <CatalogBrowser games={games} initialPlatform={platform} initialKind={kind} deals={deals} />
      )}
    </div>
  );
}
