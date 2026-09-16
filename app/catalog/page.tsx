import type { Metadata } from "next";
import { getCatalogWall } from "@/lib/catalog";
import { PLATFORMS, GENRES, KINDS, type Platform, type Genre, type ProductKind } from "@/lib/mock-data";
import { CatalogBrowser, type Sort } from "@/components/sections/CatalogBrowser";

export const metadata: Metadata = {
  title: "Catalog",
  description: "Browse every game key and digital code on the Keyarcade shop floor.",
};

function parsePlatform(v?: string): Platform | undefined {
  return PLATFORMS.find((p) => p.toLowerCase() === v?.toLowerCase());
}
function parseGenre(v?: string): Genre | undefined {
  return GENRES.find((g) => g.toLowerCase() === v?.toLowerCase());
}
function parseKind(v?: string): ProductKind | undefined {
  return KINDS.find((k) => k.toLowerCase() === v?.toLowerCase());
}

// New releases and Top charts are catalogue *views*, not just the raw wall:
// each lands on a distinct initial ordering so the page visibly differs from
// the default shelf.
function parseSort(v?: string): { sort?: Sort; heading?: string } {
  if (v === "new") return { sort: "Newest", heading: "New releases" };
  if (v === "top") return { sort: "Price: high to low", heading: "Top charts" };
  return {};
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; genre?: string; kind?: string; deals?: string; sort?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const platform = parsePlatform(sp.platform);
  const genre = parseGenre(sp.genre);
  const kind = parseKind(sp.kind);
  const deals = sp.deals === "1";
  const { sort, heading: sortHeading } = parseSort(sp.sort);
  const q = sp.q?.trim() || undefined;

  // Gift cards rarely match by our derived "kind" alone, so when a shopper asks
  // for them we search Kinguin by name too — otherwise the landing is empty.
  const effectiveQ = q ?? (kind === "Gift card" ? "gift card" : undefined);

  // Push platform + genre + search down to Kinguin so a filtered landing (a
  // platform tile, a genre chip) is drawn from the full 120k+ catalogue, not
  // carved out of one small page. Pull several pages deep so the wall is
  // hundreds of keys and the client-side filters have real breadth to work with.
  const wall = await getCatalogWall({ platform, genre, q: effectiveQ });
  // Kinguin already filtered by genre, but a title tagged e.g. [Action, Racing,
  // Sport] can be classified under a different facet by our local mapper, which
  // the client-side genre filter would then drop. Trust Kinguin's match and
  // label every returned key with the genre the shopper actually asked for.
  const games = genre ? wall.games.map((g) => ({ ...g, genre })) : wall.games;

  // Never pre-select a filter that would empty the page: if the returned pool
  // has nothing of this kind, land unfiltered rather than on "no results".
  const kindMatches = kind ? games.some((g) => g.kind === kind) : false;
  const initialKind = kindMatches ? kind : undefined;

  const heading = q
    ? `“${q}”`
    : deals
      ? "Best-price keys"
      : sortHeading
        ? sortHeading
        : kind
          ? `${kind}s`
          : genre
            ? `${genre} keys`
            : platform
              ? `${platform} keys`
              : "All keys";

  // Re-key on the active facets so navigating between tabs (e.g. Steam → Epic,
  // New releases → Top charts) remounts the browser with fresh filter state,
  // instead of leaving the previous tab's selection stuck in place.
  const browserKey = `${platform ?? ""}|${genre ?? ""}|${kind ?? ""}|${sp.sort ?? ""}|${deals}|${q ?? ""}`;

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
        <CatalogBrowser
          key={browserKey}
          games={games}
          initialPlatform={platform}
          initialGenre={genre}
          initialKind={initialKind}
          initialSort={sort}
          deals={deals}
        />
      )}
    </div>
  );
}
