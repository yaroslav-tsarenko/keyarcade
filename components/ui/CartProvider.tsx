"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { Game } from "@/lib/mock-data";

// Client-side cart persisted to localStorage. Stores the full Game snapshot so
// live Kinguin products (which can't be looked up from static data later) still
// render in the cart and checkout.
export interface CartLine {
  game: Game;
  qty: number;
}

interface Ctx {
  lines: CartLine[];
  count: number;
  subtotalEur: number;
  add: (game: Game, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  ready: boolean;
}

const CartContext = createContext<Ctx | null>(null);
const KEY = "blk_cart";
const MAX_QTY = 10;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed);
      }
    } catch {
      /* ignore corrupt cart */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* storage full / unavailable */
    }
  }, [lines, ready]);

  const add = useCallback((game: Game, qty = 1) => {
    setLines((ls) => {
      const i = ls.findIndex((l) => l.game.slug === game.slug);
      if (i >= 0) {
        const next = [...ls];
        next[i] = { ...next[i], qty: Math.min(MAX_QTY, next[i].qty + qty) };
        return next;
      }
      return [...ls, { game, qty: Math.min(MAX_QTY, Math.max(1, qty)) }];
    });
  }, []);

  const setQty = useCallback(
    (slug: string, qty: number) =>
      setLines((ls) =>
        ls.map((l) => (l.game.slug === slug ? { ...l, qty: Math.min(MAX_QTY, Math.max(1, qty)) } : l)),
      ),
    [],
  );

  const remove = useCallback(
    (slug: string) => setLines((ls) => ls.filter((l) => l.game.slug !== slug)),
    [],
  );

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subtotalEur = useMemo(() => lines.reduce((s, l) => s + l.game.price * l.qty, 0), [lines]);

  return (
    <CartContext.Provider value={{ lines, count, subtotalEur, add, setQty, remove, clear, ready }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): Ctx {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
