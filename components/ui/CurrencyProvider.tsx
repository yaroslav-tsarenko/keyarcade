"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  formatMoney,
  type CurrencyCode,
} from "@/lib/site-config";

interface Ctx {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  format: (eur: number) => string;
}

const CurrencyContext = createContext<Ctx | null>(null);

const COOKIE = "blk_currency";

function readCookie(): CurrencyCode {
  if (typeof document === "undefined") return DEFAULT_CURRENCY;
  const m = document.cookie.match(new RegExp(`${COOKIE}=([A-Z]{3})`));
  const code = m?.[1] as CurrencyCode | undefined;
  return code && code in CURRENCIES ? code : DEFAULT_CURRENCY;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY);

  useEffect(() => {
    setCurrencyState(readCookie());
  }, []);

  const setCurrency = useCallback((c: CurrencyCode) => {
    setCurrencyState(c);
    document.cookie = `${COOKIE}=${c}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  }, []);

  const format = useCallback((eur: number) => formatMoney(eur, currency), [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): Ctx {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
