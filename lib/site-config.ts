// Single source of truth for brand, legal entity, currencies and policy
// values. Every page/footer/legal doc/checkout reads from here so numbers and
// company details stay identical across the whole site.

export const SITE = {
  name: "Keyarcade",
  shortName: "Keyarcade",
  domain: "keyarcade.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://keyarcade.com",
  tagline: "Your library, one key away.",
  supportEmail: "support@keyarcade.com",
} as const;

// Legal entity — must match everywhere (footer, /contact, legal pages, checkout)
// Placeholders until the legal entity exists. Never invent registration
// details — every one of these is shown to customers as a legal fact.
export const COMPANY = {
  legalName: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "SENODATE OÜ",
  regNumber: process.env.NEXT_PUBLIC_COMPANY_NUMBER ?? "17594191",
  address:
    process.env.NEXT_PUBLIC_COMPANY_ADDRESS ??
    "Harju maakond, Tallinn, Kesklinna linnaosa, Pärnu mnt 20, 101415",
  country: process.env.NEXT_PUBLIC_COMPANY_COUNTRY ?? "Estonia",
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL ?? "support@keyarcade.com",
  // Merchant of Record shown at checkout
  merchantOfRecord: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "SENODATE OÜ",
} as const;

// Consistent policy values — referenced by legal pages, FAQ, checkout, footer
export const POLICY = {
  refundDays: 14,
  supportHours: "Mon–Fri, 09:00–18:00 (EET)",
  deliveryTime: "Instant — under a minute for in-stock keys",
  serviceFeePct: 0,
  warranty: "Every key is replaced or refunded if it fails to activate",
} as const;

export type CurrencyCode = "GBP" | "EUR" | "USD";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
  // rate relative to the base currency (EUR). Kinguin prices are in EUR.
  rate: number;
}

// Base currency is EUR (Kinguin returns EUR). Rates are static fallbacks and
// can be refreshed from an FX source at build/run time.
export const BASE_CURRENCY: CurrencyCode = "EUR";

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  EUR: { code: "EUR", symbol: "€", label: "EUR", locale: "en-IE", rate: 1 },
  GBP: { code: "GBP", symbol: "£", label: "GBP", locale: "en-GB", rate: 0.85 },
  USD: { code: "USD", symbol: "$", label: "USD", locale: "en-US", rate: 1.08 },
};

export const CURRENCY_ORDER: CurrencyCode[] = ["EUR", "GBP", "USD"];
export const DEFAULT_CURRENCY: CurrencyCode = "EUR";

export function convert(amountEur: number, to: CurrencyCode): number {
  return amountEur * CURRENCIES[to].rate;
}

export function formatMoney(amountEur: number, to: CurrencyCode): string {
  const c = CURRENCIES[to];
  const value = convert(amountEur, to);
  return new Intl.NumberFormat(c.locale, {
    style: "currency",
    currency: c.code,
  }).format(value);
}

// Country dropdown for registration. Sanctioned / excluded countries are kept
// out of this list (extend BLOCKED_COUNTRIES to grow the exclusion set).
export const BLOCKED_COUNTRIES = ["RU", "BY", "IR", "KP"] as const;

export const COUNTRIES: { code: string; name: string; dial: string }[] = [
  { code: "AT", name: "Austria", dial: "+43" },
  { code: "BE", name: "Belgium", dial: "+32" },
  { code: "BG", name: "Bulgaria", dial: "+359" },
  { code: "HR", name: "Croatia", dial: "+385" },
  { code: "CY", name: "Cyprus", dial: "+357" },
  { code: "CZ", name: "Czechia", dial: "+420" },
  { code: "DK", name: "Denmark", dial: "+45" },
  { code: "EE", name: "Estonia", dial: "+372" },
  { code: "FI", name: "Finland", dial: "+358" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "GR", name: "Greece", dial: "+30" },
  { code: "HU", name: "Hungary", dial: "+36" },
  { code: "IE", name: "Ireland", dial: "+353" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "LV", name: "Latvia", dial: "+371" },
  { code: "LT", name: "Lithuania", dial: "+370" },
  { code: "LU", name: "Luxembourg", dial: "+352" },
  { code: "MT", name: "Malta", dial: "+356" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "NO", name: "Norway", dial: "+47" },
  { code: "PL", name: "Poland", dial: "+48" },
  { code: "PT", name: "Portugal", dial: "+351" },
  { code: "RO", name: "Romania", dial: "+40" },
  { code: "SK", name: "Slovakia", dial: "+421" },
  { code: "SI", name: "Slovenia", dial: "+386" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "SE", name: "Sweden", dial: "+46" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "AU", name: "Australia", dial: "+61" },
].filter((c) => !BLOCKED_COUNTRIES.includes(c.code as (typeof BLOCKED_COUNTRIES)[number]));

export const FOOTER_PLATFORMS = ["Steam", "Epic", "Xbox", "PlayStation", "Nintendo", "GOG"] as const;

// Live promo codes. Keys are the codes shoppers type at the cart; the value is
// the fraction off the subtotal. Validated against this set — unknown codes are
// rejected instead of silently applying a discount.
export const PROMO_CODES: Record<string, number> = {
  ARC10: 0.1,
  WELCOME5: 0.05,
  KEYS15: 0.15,
};

export function lookupPromo(code: string): { code: string; off: number } | null {
  const normalised = code.trim().toUpperCase();
  const off = PROMO_CODES[normalised];
  return off ? { code: normalised, off } : null;
}
