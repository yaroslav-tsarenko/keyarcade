"use client";

import { CURRENCY_ORDER, CURRENCIES } from "@/lib/site-config";
import { useCurrency } from "@/components/ui/CurrencyProvider";
import { cx } from "@/lib/cx";

export function CurrencySwitcher({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <label className={cx("inline-flex shrink-0 items-center", className)}>
      <span className="sr-only">Currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as typeof currency)}
        aria-label="Select currency"
        className="ring-focus ring-focus-flat cursor-pointer rounded-chip bg-transparent px-1.5 py-1 text-xs font-semibold tracking-wide text-ink-muted outline-none transition-colors hover:text-ink"
      >
        {CURRENCY_ORDER.map((code) => (
          <option key={code} value={code}>
            {CURRENCIES[code].symbol} {code}
          </option>
        ))}
      </select>
    </label>
  );
}
