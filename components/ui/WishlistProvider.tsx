"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";

// Lightweight wishlist persisted to localStorage. Only slugs are stored — the
// heart is a save-for-later marker, not a full product snapshot like the cart.
interface Ctx {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  ready: boolean;
}

const WishlistContext = createContext<Ctx | null>(null);
const KEY = "blk_wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setSlugs(parsed.filter((s) => typeof s === "string"));
      }
    } catch {
      /* ignore corrupt wishlist */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(slugs));
    } catch {
      /* storage full / unavailable */
    }
  }, [slugs, ready]);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const toggle = useCallback(
    (slug: string) =>
      setSlugs((ls) => (ls.includes(slug) ? ls.filter((s) => s !== slug) : [...ls, slug])),
    [],
  );

  const value = useMemo(() => ({ slugs, has, toggle, ready }), [slugs, has, toggle, ready]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): Ctx {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
