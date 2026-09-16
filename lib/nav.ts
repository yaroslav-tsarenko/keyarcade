import { GENRES, PLATFORMS } from "@/lib/mock-data";

export interface NavTab {
  label: string;
  href: string;
  /** Opens a mega-panel instead of navigating straight away. */
  panel?: "platforms" | "genres";
}

/** Every tab points at a catalogue view that actually exists. */
export const NAV_TABS: NavTab[] = [
  { label: "Platforms", href: "/catalog", panel: "platforms" },
  { label: "Genres", href: "/catalog", panel: "genres" },
  { label: "Deals", href: "/catalog?deals=1" },
  { label: "New releases", href: "/catalog?sort=new" },
  { label: "Pre-orders", href: "/catalog?kind=Pre-order" },
  { label: "Top charts", href: "/catalog?sort=top" },
  { label: "Gift cards", href: "/catalog?kind=Gift%20card" },
  { label: "Support", href: "/faq" },
];

export const PLATFORM_LINKS = PLATFORMS.map((p) => ({
  label: p,
  href: `/catalog?platform=${encodeURIComponent(p)}`,
}));

export const GENRE_LINKS = GENRES.map((g) => ({
  label: g,
  href: `/catalog?genre=${encodeURIComponent(g)}`,
}));

export const SUPPORT_LINKS = [
  { label: "Help centre", href: "/faq" },
  { label: "Activation guides", href: "/faq#activation" },
  { label: "Refunds", href: "/legal/refunds" },
  { label: "Contact us", href: "/contact" },
];
