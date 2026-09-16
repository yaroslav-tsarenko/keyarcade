import "server-only";
import {
  discountPct,
  GENRES,
  PLATFORMS as ALL_PLATFORMS,
  type Game,
  type Platform,
  type Genre,
  type Region,
  type ProductKind,
} from "@/lib/mock-data";
import { listProducts, getProduct, isKinguinConfigured, type KinguinProduct } from "@/lib/kinguin";

// Retail markup applied on top of Kinguin's cheapest offer (their price is our
// cost). 1.30 = +30%. Change here and every quoted price on the site shifts.
const MARKUP = 1.3;

// Kinguin occasionally returns junk offers (mispriced collector listings, bad
// data) that surface as €1,000+ keys. Anything whose retail price lands above
// this ceiling is treated as noise and dropped from the storefront.
const MAX_RETAIL_EUR = 150;

// Server-side catalog. Pulls live products from Kinguin when configured and
// maps them onto our `Game` shape so the existing UI renders unchanged. Falls
// back to the local curated catalog whenever the API is unavailable, so the
// storefront always has stock to show.

// Kinguin's raw platform strings ("Uplay", "Origin", "Xbox Live", "GOG.com"…)
// don't match our labels verbatim, and several launchers aren't Steam at all.
// Map each known launcher onto the right label so e.g. a Ubisoft Connect title
// is never mislabelled "Steam" — a mismatch that drives refund claims.
const PLATFORM_SYNONYMS: [string, Platform][] = [
  ["playstation", "PlayStation"],
  ["psn", "PlayStation"],
  ["xbox", "Xbox"],
  ["nintendo", "Nintendo"],
  ["switch", "Nintendo"],
  ["ubisoft", "Ubisoft Connect"],
  ["uplay", "Ubisoft Connect"],
  ["ea app", "EA App"],
  ["ea play", "EA App"],
  ["origin", "EA App"],
  ["battle.net", "Battle.net"],
  ["battlenet", "Battle.net"],
  ["blizzard", "Battle.net"],
  ["rockstar", "Rockstar"],
  ["social club", "Rockstar"],
  ["gog", "GOG"],
  ["epic", "Epic"],
  ["steam", "Steam"],
];
const HUES: [string, string][] = [
  ["#b8300f", "#ffb800"],
  ["#5b2a86", "#d1417a"],
  ["#0e8c7f", "#182747"],
  ["#2a6df4", "#ffb800"],
  ["#182747", "#0e8c7f"],
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function mapPlatform(raw: string): Platform {
  const r = raw.toLowerCase();
  for (const [needle, platform] of PLATFORM_SYNONYMS) {
    if (r.includes(needle)) return platform;
  }
  return "Steam";
}

function mapRegion(raw: string): Region {
  const r = raw.toLowerCase();
  if (r.includes("cis") || r.includes("ru")) return "CIS";
  if (r.includes("eu")) return "EU";
  if (r.includes("us") || r.includes("na")) return "NA";
  if (r.includes("uk")) return "UK";
  return "Global";
}

// Kinguin's free-form genre strings ("First-Person Shooter", "Survival Horror",
// "Simulation"…) rarely match our fixed facet names verbatim, which left the
// Genre filter half-empty. Normalise each raw genre onto our enum so the facets
// actually populate.
function mapGenre(raw: string[]): Genre {
  for (const g of raw) {
    const s = g.toLowerCase();
    if (s.includes("shoot") || s.includes("fps")) return "Shooter";
    if (s.includes("horror")) return "Horror";
    if (s.includes("sport")) return "Sports";
    if (s.includes("sim")) return "Sim";
    if (s.includes("rpg") || s.includes("role")) return "RPG";
    if (s.includes("strateg")) return "Strategy";
    if (s.includes("racing") || s.includes("driv")) return "Racing";
    if (s.includes("indie") || s.includes("casual")) return "Indie";
    if (s.includes("action")) return "Action";
  }
  return "Action";
}

function mapKind(name: string): ProductKind {
  const n = name.toLowerCase();
  if (n.includes("gift card") || n.includes("gift code") || n.includes("wallet") || n.includes("psn") && n.includes("card"))
    return "Gift card";
  if (n.includes("pre-order") || n.includes("pre order") || n.includes("preorder"))
    return "Pre-order";
  if (n.includes(" dlc") || n.includes("season pass") || n.includes("expansion") || n.includes("add-on"))
    return "DLC";
  return "Game";
}

// Cost → retail: apply the markup, then round to a tidy .x9 style price point.
function retail(costEur: number): number {
  const marked = costEur * MARKUP;
  return Math.round(marked * 100) / 100;
}

function toGame(p: KinguinProduct): Game {
  const h = hash(p.id);
  return {
    slug: p.slug,
    title: p.name,
    platform: mapPlatform(p.platform),
    region: mapRegion(p.region),
    genre: mapGenre(p.genres),
    kind: mapKind(p.name),
    price: retail(p.priceEur),
    wasPrice: null,
    rating: 0,
    reviews: 0,
    releaseYear: p.releaseDate ? new Date(p.releaseDate).getFullYear() : new Date().getFullYear(),
    hue: HUES[h % HUES.length],
    tagline: p.description.replace(/<[^>]+>/g, "").slice(0, 120) || "Digital game key — instant delivery.",
    image: p.coverImage ?? p.screenshots[0] ?? null,
  };
}

// Live-only catalog: only real Kinguin products are shown. No mock fallback.
// `platform`/`q` are pushed down to Kinguin so filtered pages (e.g. a platform
// tile) come back populated instead of empty.
export interface CatalogQuery {
  limit?: number;
  page?: number;
  platform?: string;
  q?: string;
}

// Our canonical platform names differ from the exact strings Kinguin filters on
// (e.g. "Xbox" → "Xbox One", "GOG" → "GOG.com"), so translate before querying.
const KINGUIN_PLATFORM: Record<string, string> = {
  Steam: "Steam",
  Epic: "Epic Games",
  Xbox: "Xbox One",
  PlayStation: "PlayStation",
  Nintendo: "Nintendo",
  GOG: "GOG.com",
};

export async function getCatalog(
  opts: CatalogQuery | number = {},
): Promise<{ games: Game[]; live: boolean; total: number }> {
  const { limit = 48, page: pageNo = 1, platform, q } =
    typeof opts === "number" ? { limit: opts } : opts;
  if (!isKinguinConfigured()) return { games: [], live: false, total: 0 };
  try {
    const kinguinPlatform = platform ? (KINGUIN_PLATFORM[platform] ?? platform) : undefined;
    const page = await listProducts({ limit, page: pageNo, platform: kinguinPlatform, name: q });
    const games = page.items
      .filter((i) => i.priceEur > 0 && i.qty > 0)
      .map(toGame)
      .filter((g) => g.price <= MAX_RETAIL_EUR);
    // `total` is Kinguin's full match count for this query — the real size of
    // the live catalogue, not just the page we pulled.
    return { games, live: true, total: page.total };
  } catch (e) {
    console.error("Kinguin catalog fetch failed:", e);
    return { games: [], live: false, total: 0 };
  }
}

// Slugs are `slugify(name, kinguinId)`, so the trailing segment is the id we
// fetch by. Live products only.
export async function getCatalogGame(slug: string): Promise<Game | null> {
  if (!isKinguinConfigured()) return null;
  const id = slug.split("-").pop();
  if (!id) return null;
  try {
    const product = await getProduct(id);
    if (!product || product.priceEur <= 0) return null;
    const game = toGame(product);
    return game.price <= MAX_RETAIL_EUR ? game : null;
  } catch (e) {
    console.error("Kinguin product fetch failed:", e);
    return null;
  }
}

// Home-page data built entirely from live Kinguin products. Every rail below
// is a *view* of the same fetched pool — the store never invents a listing to
// fill a row, so an empty rail simply does not render.
export interface StageSlot {
  label: string;
  game: Game;
}

export interface HomeData {
  /** Hero stage: the headline slot first, then the queue beside it. */
  stage: StageSlot[];
  deals: Game[];
  topCharts: Game[];
  fresh: Game[];
  preorders: Game[];
  underTen: Game[];
  byPlatform: { platform: string; games: Game[] }[];
  genres: string[];
  ticker: string[];
  /** Full size of the live catalogue (Kinguin match count), for the trust band. */
  keysLive: number;
}

const EMPTY_HOME: HomeData = {
  stage: [],
  deals: [],
  topCharts: [],
  fresh: [],
  preorders: [],
  underTen: [],
  byPlatform: [],
  genres: [],
  ticker: [],
  keysLive: 0,
};

/** How many rows the hero queue holds. Enough to be worth scrolling, few
 *  enough that the whole list is still one glance per row. */
const STAGE_MAX = 14;

/** How many pages of live products to pull for the home pool. A wider pool
 *  means the rails stop repeating the same handful of titles and the smaller
 *  storefronts (Xbox, GOG…) have enough stock to fill a carousel. */
const HOME_PAGES = 3;
const HOME_PAGE_SIZE = 100;

export async function getHomeData(): Promise<HomeData> {
  // Pull several pages in parallel and merge into one de-duplicated pool.
  const pages = await Promise.all(
    Array.from({ length: HOME_PAGES }, (_, i) =>
      getCatalog({ limit: HOME_PAGE_SIZE, page: i + 1 }),
    ),
  );
  const bySlug = new Map<string, Game>();
  for (const p of pages) for (const g of p.games) if (!bySlug.has(g.slug)) bySlug.set(g.slug, g);
  const games = [...bySlug.values()];
  // The headline number is the true catalogue size, not how many keys happen
  // to be on show in the rails below.
  const total = Math.max(pages[0]?.total ?? 0, games.length);

  const withImg = games.filter((g) => g.image);
  const pool = withImg.length >= 12 ? withImg : games;
  if (pool.length === 0) return EMPTY_HOME;

  // The headline slot: the priciest title that still sits in a believable AAA
  // band, so the hero never leads with an outlier.
  const HERO_MAX_EUR = 70;
  const byPrice = [...pool].sort((a, b) => b.price - a.price);
  const headline =
    byPrice.find((g) => g.price <= HERO_MAX_EUR && g.image) ??
    byPrice.find((g) => g.price <= HERO_MAX_EUR) ??
    byPrice[0];

  const rest = pool.filter((g) => g.slug !== headline.slug);
  const deals = rest.filter((g) => discountPct(g) > 0).sort((a, b) => discountPct(b) - discountPct(a));
  const fresh = [...rest].sort((a, b) => b.releaseYear - a.releaseYear);
  const preorders = rest.filter((g) => g.kind === "Pre-order");

  // "Up next" tiles are labelled from what the product actually is — a slot is
  // skipped rather than filled with something that does not fit the label.
  const used = new Set([headline.slug]);
  const take = (g: Game | undefined, label: string): StageSlot | null => {
    if (!g || used.has(g.slug)) return null;
    used.add(g.slug);
    return { label, game: g };
  };
  // The four curated slots lead; the rest of the pool follows so the queue
  // beside the stage is a list worth scrolling rather than four tiles and a
  // lot of white. Tail labels state a fact about the row — the discount if
  // there is one, otherwise the storefront — never an invented category.
  const curated = [
    { label: "Featured", game: headline },
    take(deals[0], "Deal of the day"),
    take(fresh[0], "New release"),
    take(preorders[0] ?? deals[1], preorders[0] ? "Pre-order" : "Also on sale"),
  ].filter((s): s is StageSlot => s !== null);

  const tail = rest
    .filter((g) => !used.has(g.slug))
    .slice(0, STAGE_MAX - curated.length)
    .map((g) => {
      const off = discountPct(g);
      return { label: off > 0 ? `${off}% off` : g.platform, game: g };
    });

  const stage = [...curated, ...tail];

  // The category rails are handed *disjoint* slices of the pool so the store
  // stops showing the same handful of keys under every heading. Each rail keeps
  // its own character: cheap under €10, newest fresh, the pricier remainder as
  // the "chart". `used` already holds every key on the hero stage.
  const notUsed = (g: Game) => !used.has(g.slug);

  const cheap = rest.filter((g) => notUsed(g) && g.price < 10);
  const cheapest = rest.filter(notUsed).sort((a, b) => a.price - b.price);
  const underTen = (cheap.length >= 6 ? cheap.sort((a, b) => a.price - b.price) : cheapest).slice(0, 12);
  underTen.forEach((g) => used.add(g.slug));

  const freshRail = rest.filter(notUsed).sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 12);
  freshRail.forEach((g) => used.add(g.slug));

  // Rating/reviews aren't carried by the live feed, so the "chart" leads with
  // the pricier AAA remainder — a distinct set from the cheap and fresh rails.
  const topCharts = rest.filter(notUsed).sort((a, b) => b.price - a.price).slice(0, 10);
  topCharts.forEach((g) => used.add(g.slug));

  // Platform rows draw from the whole pool (a key belongs to exactly one
  // storefront, so these never overlap each other) and now have a much larger
  // pool to fill from, so smaller stores like Xbox reach a full carousel.
  const byPlatform = ALL_PLATFORMS.map((platform) => ({
    platform,
    games: pool.filter((g) => g.platform === platform).slice(0, 12),
  })).filter((row) => row.games.length >= 4);

  const genres = GENRES.filter((genre) => pool.some((g) => g.genre === genre));

  const ticker = pool.slice(0, 8).map((g) => {
    const name = g.title.replace(/\s+(CD Key|Key|Steam|Ubisoft Connect|PC).*$/i, "").slice(0, 36);
    return `${name} €${g.price.toFixed(2)}`;
  });

  return {
    stage,
    deals: deals.slice(0, 12),
    topCharts,
    fresh: freshRail,
    preorders: preorders.slice(0, 12),
    underTen,
    byPlatform,
    genres,
    ticker,
    keysLive: total,
  };
}
