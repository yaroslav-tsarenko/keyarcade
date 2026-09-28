// Cookie consent state and the inventory of everything this site stores on a
// device. The inventory is the single source of truth: the Cookie Policy table
// and the preference centre both render from it, so the published list cannot
// drift from what the code actually sets.

export const CONSENT_KEY = "keyarcade:cookie-consent";

/** Fired on `window` whenever the stored preference changes. */
export const CONSENT_CHANGED = "keyarcade:consent-changed";
/** Fired on `window` to open the preference centre from anywhere. */
export const OPEN_COOKIE_SETTINGS = "keyarcade:open-cookie-settings";

export type CookieCategory = "necessary" | "functional";

export interface CookiePrefs {
  functional: boolean;
}

/** No optional storage until the visitor opts in. */
export const NO_OPTIONAL: CookiePrefs = { functional: false };

export interface CookieEntry {
  name: string;
  category: CookieCategory;
  type: "Cookie" | "Local storage";
  party: "First party";
  purpose: string;
  duration: string;
}

// Every key this site writes. Adding storage anywhere means adding a row here.
export const COOKIE_INVENTORY: CookieEntry[] = [
  {
    name: "blk_session",
    category: "necessary",
    type: "Cookie",
    party: "First party",
    purpose: "Keeps you signed in to your account. HttpOnly and not readable by scripts.",
    duration: "30 days",
  },
  {
    name: "blk_cart",
    category: "necessary",
    type: "Local storage",
    party: "First party",
    purpose: "Holds the contents of your basket so it survives a page reload.",
    duration: "Until cleared or the order is placed",
  },
  {
    name: "keyarcade:cookie-consent",
    category: "necessary",
    type: "Local storage",
    party: "First party",
    purpose: "Records your cookie choice so we do not ask again on every page.",
    duration: "Until you clear it",
  },
  {
    name: "blk_currency",
    category: "functional",
    type: "Cookie",
    party: "First party",
    purpose: "Remembers whether you view prices in EUR, GBP or USD.",
    duration: "12 months",
  },
  {
    name: "keyarcade:theme",
    category: "functional",
    type: "Local storage",
    party: "First party",
    purpose: "Remembers your choice of light or dark interface.",
    duration: "Until you clear it",
  },
  {
    name: "blk_wishlist",
    category: "functional",
    type: "Local storage",
    party: "First party",
    purpose: "Remembers the keys you saved to your wishlist on this device.",
    duration: "Until you clear it",
  },
];

/** Storage written only with functional consent, cleared when it is withdrawn. */
const FUNCTIONAL_LOCAL_KEYS = COOKIE_INVENTORY.filter(
  (c) => c.category === "functional" && c.type === "Local storage",
).map((c) => c.name);

const FUNCTIONAL_COOKIES = COOKIE_INVENTORY.filter(
  (c) => c.category === "functional" && c.type === "Cookie",
).map((c) => c.name);

/** null means the visitor has not chosen yet — show the banner, store nothing. */
export function readConsent(): CookiePrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookiePrefs>;
    return { functional: parsed.functional === true };
  } catch {
    // Unreadable or written by an older version — ask again rather than guess.
    return null;
  }
}

export function hasFunctionalConsent(): boolean {
  return readConsent()?.functional === true;
}

export function writeConsent(prefs: CookiePrefs): void {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(prefs));
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  if (!prefs.functional) forgetFunctional();
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED, { detail: prefs }));
}

/** Withdrawal has to actually remove what consent allowed us to keep. */
function forgetFunctional(): void {
  try {
    for (const key of FUNCTIONAL_LOCAL_KEYS) localStorage.removeItem(key);
  } catch {
    // Nothing readable to clear.
  }
  for (const name of FUNCTIONAL_COOKIES) {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
  }
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS));
}
