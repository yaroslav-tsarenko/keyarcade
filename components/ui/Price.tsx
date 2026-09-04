"use client";

import { useCurrency } from "@/components/ui/CurrencyProvider";

// Renders an EUR-base amount in the user's selected currency. Prices live in
// EUR everywhere (Kinguin's base); this converts + formats on the client so the
// header switcher updates every price instantly without a reload.
export function Price({ eur, className }: { eur: number; className?: string }) {
  const { format } = useCurrency();
  return <span className={className}>{format(eur)}</span>;
}
