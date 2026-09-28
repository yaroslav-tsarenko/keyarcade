// Catalogue vocabulary: the facet enums and the `Game` shape every live
// supplier product is mapped onto (see lib/catalog.ts). There is no local
// product data here — the storefront only ever renders keys that are really in
// stock, so an empty feed shows an empty shop rather than an invented one.

export type Platform =
  | "Steam"
  | "Epic"
  | "Xbox"
  | "PlayStation"
  | "Nintendo"
  | "GOG"
  | "Ubisoft Connect"
  | "EA App"
  | "Battle.net"
  | "Rockstar";

// Activation regions we are willing to sell into. Keys restricted to sanctioned
// markets are not listed, so there is no CIS facet.
export type Region = "Global" | "EU" | "NA" | "UK";

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

// No "Pre-order": the Delivery Policy states we do not sell keys that cannot be
// delivered immediately, so nothing unreleased is listed.
export type ProductKind = "Game" | "DLC" | "Gift card" | "Subscription";

export interface Game {
  slug: string;
  title: string;
  platform: Platform;
  region: Region;
  genre: Genre;
  kind: ProductKind;
  price: number; // current retail, in EUR (the base currency)
  wasPrice: number | null; // strike-through, null when no discount
  rating: number; // 0–5, 0 when the supplier carries no rating
  reviews: number;
  releaseYear: number;
  featured?: boolean;
  // deterministic art palette used when there is no cover image
  hue: [string, string]; // [base, accent] hex
  tagline: string;
  // real cover art when available (live supplier products); null → SVG box art
  image?: string | null;

  // Product facts from the supplier feed. Each may be empty when the feed
  // carries nothing for that title — the product page then omits the section
  // rather than filling it with generic copy.
  /** Publisher description, HTML stripped. */
  description: string;
  /** Verbatim activation/redemption instructions for this key. */
  activationDetails: string;
  /** Verbatim system requirements. Empty for non-PC and non-software items. */
  systemRequirements: string;
  developers: string[];
  publishers: string[];
  /** In-game/interface languages the key supports. */
  languages: string[];
  /** The supplier's raw regional limitation text, shown next to the region. */
  regionNote: string;
  /** Edition name ("Deluxe Edition", "GOTY"…) when the title carries one. */
  edition: string;
}

export const PLATFORMS: Platform[] = [
  "Steam",
  "Epic",
  "Xbox",
  "PlayStation",
  "Nintendo",
  "GOG",
  "Ubisoft Connect",
  "EA App",
  "Battle.net",
  "Rockstar",
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

export const REGIONS: Region[] = ["Global", "EU", "NA", "UK"];

export const KINDS: ProductKind[] = ["Game", "DLC", "Gift card", "Subscription"];

export function discountPct(g: Pick<Game, "price" | "wasPrice">): number {
  if (!g.wasPrice || g.wasPrice <= g.price) return 0;
  return Math.round((1 - g.price / g.wasPrice) * 100);
}

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ: FaqItem[] = [
  {
    q: "How fast do I get my key?",
    a: "Delivery is automated and starts as soon as your payment is confirmed: the key appears in your email and in your account library. We do not guarantee a fixed number of minutes — if an order needs a manual check, we tell you by email.",
  },
  {
    q: "What is a region and does it matter?",
    a: "A key is tied to an activation region: Global works anywhere we sell, while EU, NA and UK keys only activate for accounts set to that region. The region and any language restriction are printed on every product page — check them before you buy.",
  },
  {
    q: "Where do I redeem the code?",
    a: "Each product page lists the activation steps supplied for that exact key. In short: open the matching launcher (Steam, Epic, Xbox, PlayStation, Nintendo, GOG, Ubisoft Connect, EA App, Battle.net or Rockstar), find Redeem or Activate a code, paste the key.",
  },
  {
    q: "My key didn't work. What now?",
    a: "First, confirm the region matches your account. If it still fails, contact support with your order number. A code that is invalid, already redeemed or revoked through no fault of yours is replaced or refunded.",
  },
  {
    q: "Do you sell used or shared keys?",
    a: "No. Every key is sold once and leaves our stock when it is issued to you.",
  },
  {
    q: "Which payment methods work?",
    a: "Visa and Mastercard. Card details are entered on our payment provider's own secure page and are never handled by this website.",
  },
  {
    q: "Can I get a refund?",
    a: "By confirming your order you ask for delivery to start immediately and agree that you lose the 14-day right of withdrawal once the key is issued. Refunds are still made where a key is faulty, never delivered or not as described — see the Refund Policy.",
  },
  {
    q: "Do you sell pre-orders?",
    a: "No. We only list keys that are in stock and can be delivered straight after payment.",
  },
];

export interface DeliveryStep {
  title: string;
  body: string;
}

export const DELIVERY_STEPS: DeliveryStep[] = [
  {
    title: "Buy the key",
    body: "Pick your title and pay on our provider's secure checkout page. No launcher needed to place the order.",
  },
  {
    title: "Get the code",
    body: "Once payment is confirmed, delivery runs automatically: the key goes to your email and your account library.",
  },
  {
    title: "Redeem and play",
    body: "Paste the code into the launcher named on the product page and the game is yours to keep.",
  },
];

export const ACTIVATION_STEPS: string[] = [
  "Copy the key from your order confirmation or account library.",
  "Open the matching launcher and sign in to your account.",
  "Find “Activate a product” or “Redeem code” in the menu.",
  "Paste the key and confirm. The game downloads to your library.",
];
