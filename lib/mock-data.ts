// Fallback catalog. Used when the Kinguin API is unavailable so the storefront
// always renders. Prices are treated as EUR (the base currency). Live product
// data comes from lib/kinguin.ts when configured.

export type Platform =
  | "Steam"
  | "Epic"
  | "Xbox"
  | "PlayStation"
  | "Nintendo"
  | "GOG";

export type Region = "Global" | "EU" | "NA" | "UK" | "CIS";

export type Genre =
  | "Action"
  | "RPG"
  | "Shooter"
  | "Strategy"
  | "Racing"
  | "Indie"
  | "Horror"
  | "Sports"
  | "Sim";

export type ProductKind = "Game" | "DLC" | "Gift card" | "Pre-order";

export interface Game {
  slug: string;
  title: string;
  platform: Platform;
  region: Region;
  genre: Genre;
  kind: ProductKind;
  price: number; // current, in USD
  wasPrice: number | null; // strike-through, null when no discount
  rating: number; // 0–5
  reviews: number;
  releaseYear: number;
  featured?: boolean;
  // deterministic art palette
  hue: [string, string]; // [base, accent] hex
  tagline: string;
  // real cover art when available (live Kinguin products); null → SVG box art
  image?: string | null;
}

export const PLATFORMS: Platform[] = [
  "Steam",
  "Epic",
  "Xbox",
  "PlayStation",
  "Nintendo",
  "GOG",
];

export const GENRES: Genre[] = [
  "Action",
  "RPG",
  "Shooter",
  "Strategy",
  "Racing",
  "Indie",
  "Horror",
  "Sports",
  "Sim",
];

export const REGIONS: Region[] = ["Global", "EU", "NA", "UK", "CIS"];

export const KINDS: ProductKind[] = ["Game", "DLC", "Gift card", "Pre-order"];

export function discountPct(g: Pick<Game, "price" | "wasPrice">): number {
  if (!g.wasPrice || g.wasPrice <= g.price) return 0;
  return Math.round((1 - g.price / g.wasPrice) * 100);
}

export function money(n: number): string {
  return `$${n.toFixed(2)}`;
}

// palette pairs pulled from the token set for cover art
const P = {
  flame: "#e8431e",
  gold: "#ffb800",
  teal: "#0e8c7f",
  grape: "#5b2a86",
  ink: "#191207",
  sky: "#2a6df4",
  lime: "#7bc043",
  rose: "#d1417a",
  rust: "#b8300f",
  navy: "#182747",
};

export const GAMES: Game[] = [
  {
    slug: "ashfall-legion",
    title: "Ashfall Legion",
    platform: "Steam",
    region: "Global",
    genre: "Action",
    kind: "Game",
    price: 23.49,
    wasPrice: 59.99,
    rating: 4.6,
    reviews: 3182,
    releaseYear: 2025,
    featured: true,
    hue: [P.rust, P.gold],
    tagline: "Hold the last wall against the burning tide.",
  },
  {
    slug: "neon-district-2",
    title: "Neon District 2",
    platform: "Epic",
    region: "Global",
    genre: "Shooter",
    kind: "Game",
    price: 34.0,
    wasPrice: 49.99,
    rating: 4.3,
    reviews: 1890,
    releaseYear: 2026,
    hue: [P.grape, P.rose],
    tagline: "The city runs on stolen light.",
  },
  {
    slug: "harvest-hollow",
    title: "Harvest Hollow",
    platform: "Nintendo",
    region: "EU",
    genre: "Sim",
    kind: "Game",
    price: 18.75,
    wasPrice: 39.99,
    rating: 4.8,
    reviews: 5420,
    hue: [P.lime, P.teal],
    releaseYear: 2024,
    tagline: "Plant a farm, keep a village fed.",
  },
  {
    slug: "grand-circuit-x",
    title: "Grand Circuit X",
    platform: "PlayStation",
    region: "NA",
    genre: "Racing",
    kind: "Game",
    price: 41.99,
    wasPrice: 69.99,
    rating: 4.1,
    reviews: 2210,
    hue: [P.sky, P.gold],
    releaseYear: 2025,
    tagline: "Twenty tracks. One dry line.",
  },
  {
    slug: "deepvault",
    title: "Deepvault",
    platform: "Steam",
    region: "Global",
    genre: "Horror",
    kind: "Game",
    price: 12.99,
    wasPrice: 29.99,
    rating: 4.5,
    reviews: 4103,
    hue: [P.navy, P.teal],
    releaseYear: 2023,
    tagline: "The lights only work once.",
  },
  {
    slug: "kingdoms-of-vale",
    title: "Kingdoms of Vale",
    platform: "GOG",
    region: "Global",
    genre: "RPG",
    kind: "Game",
    price: 27.5,
    wasPrice: 44.99,
    rating: 4.7,
    reviews: 6890,
    featured: true,
    hue: [P.grape, P.gold],
    releaseYear: 2024,
    tagline: "Forty hours. Every choice sticks.",
  },
  {
    slug: "ironline-tactics",
    title: "Ironline Tactics",
    platform: "Xbox",
    region: "UK",
    genre: "Strategy",
    kind: "Game",
    price: 22.0,
    wasPrice: 34.99,
    rating: 4.4,
    reviews: 1544,
    hue: [P.teal, P.gold],
    releaseYear: 2025,
    tagline: "Move first or lose the map.",
  },
  {
    slug: "pixel-run-forever",
    title: "Pixel Run Forever",
    platform: "Steam",
    region: "Global",
    genre: "Indie",
    kind: "Game",
    price: 6.99,
    wasPrice: 14.99,
    rating: 4.9,
    reviews: 9021,
    hue: [P.rose, P.sky],
    releaseYear: 2022,
    tagline: "One button. No mercy.",
  },
  {
    slug: "frontline-6",
    title: "Frontline 6",
    platform: "PlayStation",
    region: "EU",
    genre: "Shooter",
    kind: "Game",
    price: 47.99,
    wasPrice: 69.99,
    rating: 4.0,
    reviews: 3320,
    hue: [P.rust, P.navy],
    releaseYear: 2026,
    tagline: "Twelve maps, one long war.",
  },
  {
    slug: "starbound-drift",
    title: "Starbound Drift",
    platform: "Epic",
    region: "Global",
    genre: "Sim",
    kind: "Game",
    price: 29.99,
    wasPrice: null,
    rating: 4.2,
    reviews: 980,
    hue: [P.navy, P.rose],
    releaseYear: 2026,
    tagline: "Mine the belt, build the fleet.",
  },
  {
    slug: "back-alley-brawl",
    title: "Back Alley Brawl",
    platform: "Xbox",
    region: "NA",
    genre: "Action",
    kind: "Game",
    price: 9.49,
    wasPrice: 24.99,
    rating: 4.3,
    reviews: 2670,
    hue: [P.flame, P.grape],
    releaseYear: 2023,
    tagline: "Six fighters. No rules.",
  },
  {
    slug: "cinder-peak",
    title: "Cinder Peak",
    platform: "Steam",
    region: "Global",
    genre: "RPG",
    kind: "Game",
    price: 33.99,
    wasPrice: 54.99,
    rating: 4.6,
    reviews: 4450,
    hue: [P.rust, P.teal],
    releaseYear: 2025,
    tagline: "Climb the mountain that eats climbers.",
  },
  {
    slug: "goalmaster-26",
    title: "Goalmaster 26",
    platform: "PlayStation",
    region: "Global",
    genre: "Sports",
    kind: "Game",
    price: 44.99,
    wasPrice: 69.99,
    rating: 3.9,
    reviews: 1210,
    hue: [P.lime, P.navy],
    releaseYear: 2026,
    tagline: "The whole season, in your hands.",
  },
  {
    slug: "hollow-signal",
    title: "Hollow Signal",
    platform: "GOG",
    region: "Global",
    genre: "Horror",
    kind: "Game",
    price: 15.99,
    wasPrice: 27.99,
    rating: 4.5,
    reviews: 3010,
    hue: [P.navy, P.flame],
    releaseYear: 2024,
    tagline: "Someone is still broadcasting.",
  },
  {
    slug: "turbo-league-gp",
    title: "Turbo League GP",
    platform: "Nintendo",
    region: "EU",
    genre: "Racing",
    kind: "Game",
    price: 21.49,
    wasPrice: 39.99,
    rating: 4.4,
    reviews: 2890,
    hue: [P.sky, P.rose],
    releaseYear: 2025,
    tagline: "Boost, drift, repeat.",
  },
  {
    slug: "ashfall-legion-warborn",
    title: "Ashfall Legion: Warborn",
    platform: "Steam",
    region: "Global",
    genre: "Action",
    kind: "DLC",
    price: 11.99,
    wasPrice: 19.99,
    rating: 4.5,
    reviews: 640,
    hue: [P.gold, P.rust],
    releaseYear: 2026,
    tagline: "Two campaigns, one new legion.",
  },
  {
    slug: "steam-wallet-50",
    title: "Steam Wallet Code $50",
    platform: "Steam",
    region: "Global",
    genre: "Indie",
    kind: "Gift card",
    price: 49.5,
    wasPrice: null,
    rating: 4.9,
    reviews: 12040,
    hue: [P.navy, P.teal],
    releaseYear: 2026,
    tagline: "Top up. Spend it anywhere on Steam.",
  },
  {
    slug: "vale-2-preorder",
    title: "Kingdoms of Vale II",
    platform: "GOG",
    region: "Global",
    genre: "RPG",
    kind: "Pre-order",
    price: 54.99,
    wasPrice: null,
    rating: 0,
    reviews: 0,
    featured: true,
    hue: [P.grape, P.flame],
    releaseYear: 2026,
    tagline: "The sequel. Key ships on launch day.",
  },
  {
    slug: "night-market",
    title: "Night Market",
    platform: "Epic",
    region: "Global",
    genre: "Indie",
    kind: "Game",
    price: 8.99,
    wasPrice: 16.99,
    rating: 4.7,
    reviews: 3320,
    hue: [P.rose, P.gold],
    releaseYear: 2024,
    tagline: "Sell dreams, buy secrets.",
  },
  {
    slug: "salt-and-storm",
    title: "Salt & Storm",
    platform: "Steam",
    region: "Global",
    genre: "Action",
    kind: "Game",
    price: 19.99,
    wasPrice: 34.99,
    rating: 4.6,
    reviews: 2110,
    hue: [P.teal, P.navy],
    releaseYear: 2025,
    tagline: "Sail the drowned coast.",
  },
  {
    slug: "overclocked",
    title: "Overclocked",
    platform: "Xbox",
    region: "Global",
    genre: "Shooter",
    kind: "Game",
    price: 25.99,
    wasPrice: 44.99,
    rating: 4.2,
    reviews: 1760,
    hue: [P.grape, P.sky],
    releaseYear: 2025,
    tagline: "Time slows when you aim.",
  },
  {
    slug: "farm-frontier",
    title: "Farm Frontier",
    platform: "Nintendo",
    region: "Global",
    genre: "Sim",
    kind: "Game",
    price: 16.49,
    wasPrice: 29.99,
    rating: 4.5,
    reviews: 4020,
    hue: [P.lime, P.gold],
    releaseYear: 2023,
    tagline: "Build a homestead from bare dirt.",
  },
  {
    slug: "shadow-ledger",
    title: "Shadow Ledger",
    platform: "Steam",
    region: "EU",
    genre: "Strategy",
    kind: "Game",
    price: 28.99,
    wasPrice: 49.99,
    rating: 4.4,
    reviews: 1330,
    hue: [P.navy, P.gold],
    releaseYear: 2026,
    tagline: "Run a crew. Balance the books in blood.",
  },
  {
    slug: "rift-runners",
    title: "Rift Runners",
    platform: "Epic",
    region: "Global",
    genre: "Action",
    kind: "Game",
    price: 13.49,
    wasPrice: 27.99,
    rating: 4.3,
    reviews: 2540,
    hue: [P.sky, P.grape],
    releaseYear: 2024,
    tagline: "Punch through reality. Land on your feet.",
  },
];

export const CATEGORIES: { title: string; filter: (g: Game) => boolean }[] = [
  { title: "Deals under $15", filter: (g) => g.price < 15 && g.kind === "Game" },
  { title: "Fresh drops", filter: (g) => g.releaseYear >= 2025 },
  { title: "Top rated", filter: (g) => g.rating >= 4.5 },
  { title: "RPGs to sink into", filter: (g) => g.genre === "RPG" },
];

export const featuredGame = GAMES.find((g) => g.slug === "ashfall-legion")!;

export function getGame(slug: string): Game | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function relatedTo(g: Game, count = 6): Game[] {
  return GAMES.filter((x) => x.slug !== g.slug)
    .sort((a, b) => {
      const as = (a.genre === g.genre ? 2 : 0) + (a.platform === g.platform ? 1 : 0);
      const bs = (b.genre === g.genre ? 2 : 0) + (b.platform === g.platform ? 1 : 0);
      return bs - as;
    })
    .slice(0, count);
}

// Live-deal ticker strings for the marquee
export const TICKER: string[] = [
  "Ashfall Legion −61%",
  "Free key giveaway Friday",
  "Pixel Run Forever $6.99",
  "New: Kingdoms of Vale II pre-orders open",
  "Deepvault −57%",
  "Weekend flash sale ends Sunday",
  "Harvest Hollow −53%",
  "Instant delivery on 120,000+ keys",
];

export interface CartLine {
  slug: string;
  qty: number;
}

export const MOCK_CART: CartLine[] = [];

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: "How fast do I get my key?",
    a: "For in-stock titles the key lands in your email and your account library the moment payment clears — usually under a minute. Pre-orders ship on the game's launch day.",
  },
  {
    q: "What is a region and does it matter?",
    a: "A key is tied to a region: Global works anywhere, while EU, NA, UK and CIS keys only activate for accounts set to that region. Check the badge on the product before you buy. Global is always the safe pick.",
  },
  {
    q: "Where do I redeem the code?",
    a: "Each product lists the exact steps. In short: open the matching launcher (Steam, Epic, Xbox, PlayStation, Nintendo or GOG), find Redeem or Activate a code, paste the key, done.",
  },
  {
    q: "My key didn't work. What now?",
    a: "First, confirm the region matches your account. If it still fails, contact support with your order number. We verify and replace or refund a bad key — that's the deal.",
  },
  {
    q: "Do you sell used or shared keys?",
    a: "No. Every key is sold once. Once it's redeemed it's yours and it leaves our stock.",
  },
  {
    q: "Which payment methods work?",
    a: "Visa and Mastercard at checkout, with PCI DSS compliant processing. You'll see the full list before you place the order.",
  },
  {
    q: "Can I get a refund?",
    a: "Unredeemed keys can be refunded within 14 days. Once a key has been revealed or activated it can't be returned, since we can't un-sell it.",
  },
];

export interface DeliveryStep {
  title: string;
  body: string;
}

export const DELIVERY_STEPS: DeliveryStep[] = [
  {
    title: "Buy the key",
    body: "Pick your title, pay, done. No account juggling, no launcher required to check out.",
  },
  {
    title: "Get the code",
    body: "The key hits your email and your account library within a minute. Copy it straight from the order.",
  },
  {
    title: "Redeem and play",
    body: "Paste the code into Steam, Epic, Xbox, PlayStation, Nintendo or GOG and the game is yours to keep.",
  },
];

export const SYSTEM_REQS = {
  minimum: {
    os: "Windows 10 64-bit",
    cpu: "Intel Core i5-8400 / AMD Ryzen 5 2600",
    ram: "8 GB",
    gpu: "NVIDIA GTX 1060 6GB / AMD RX 580 8GB",
    storage: "60 GB available",
  },
  recommended: {
    os: "Windows 11 64-bit",
    cpu: "Intel Core i7-10700 / AMD Ryzen 7 3700X",
    ram: "16 GB",
    gpu: "NVIDIA RTX 3060 / AMD RX 6700 XT",
    storage: "60 GB SSD",
  },
};

export const ACTIVATION_STEPS: string[] = [
  "Copy the key from your order confirmation or account library.",
  "Open the matching launcher and sign in to your account.",
  "Find “Activate a product” or “Redeem code” in the menu.",
  "Paste the key and confirm. The game downloads to your library.",
];
