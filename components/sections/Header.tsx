"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Menu, ShoppingCart, UserRound, Wallet } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Price } from "@/components/ui/Price";
import { useCart } from "@/components/ui/CartProvider";
import { useWishlist } from "@/components/ui/WishlistProvider";
import { NAV_TABS, PLATFORM_LINKS, GENRE_LINKS } from "@/lib/nav";
import { TopStrip } from "./TopStrip";
import { SearchBox } from "./SearchBox";
import { MiniCart } from "./MiniCart";
import { MegaPanel } from "./MegaPanel";
import { MobileDrawer } from "./MobileDrawer";
import { cx } from "@/lib/cx";

interface Me {
  firstName: string;
  balanceEur: number;
}

export function Header() {
  const [panel, setPanel] = useState<"platforms" | "genres" | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const pathname = usePathname();
  const { count: cartCount } = useCart();
  const { slugs: wishSlugs, ready: wishReady } = useWishlist();
  const cartRef = useRef<HTMLDivElement>(null);

  // Hydrate auth state on mount so storefront pages stay statically rendered.
  useEffect(() => {
    let active = true;
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        if (active) setMe(d.user ?? null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    setPanel(null);
    setCartOpen(false);
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes whatever is open, wherever focus happens to be.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPanel(null);
      setCartOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // A click anywhere else closes the mini-cart.
  useEffect(() => {
    if (!cartOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!cartRef.current?.contains(e.target as Node)) setCartOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [cartOpen]);

  const wishCount = wishReady ? wishSlugs.length : 0;

  return (
    <header className="sticky top-0 z-50">
      <TopStrip />

      <div
        onMouseLeave={() => setPanel(null)}
        className={cx(
          "relative border-b border-edge bg-[color-mix(in_oklab,var(--deck)_82%,transparent)]",
          "backdrop-blur-xl transition-shadow duration-[var(--dur-3)]",
          condensed && "lift-md",
        )}
      >
        {/* Main bar */}
        <div
          className={cx(
            "mx-auto flex max-w-[1500px] items-center gap-3 px-4 transition-[padding] duration-[var(--dur-3)] md:gap-4 md:px-6",
            condensed ? "py-2" : "py-3",
          )}
        >
          <Link
            href="/"
            className="ring-focus ring-focus-flat shrink-0 rounded-control"
            aria-label={`${"Keyarcade"} home`}
          >
            <Logo size={condensed ? "sm" : "md"} />
          </Link>

          <SearchBox className="hidden flex-1 lg:block" />

          <div className="ml-auto flex items-center gap-1">
            <IconLink
              href={me ? "/account" : "/auth"}
              label={me ? "Your account" : "Sign in"}
              badge={me ? "dot" : undefined}
            >
              <UserRound width={19} height={19} aria-hidden />
            </IconLink>

            <IconLink href="/wishlist" label="Wishlist" count={wishCount} coral>
              <Heart
                width={19}
                height={19}
                className={cx(wishCount > 0 && "fill-coral text-coral")}
                aria-hidden
              />
            </IconLink>

            <div ref={cartRef} className="relative">
              <button
                type="button"
                onClick={() => setCartOpen((o) => !o)}
                aria-expanded={cartOpen}
                aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
                className="ring-focus ring-focus-flat relative grid size-10 place-items-center rounded-chip text-ink transition-colors hover:bg-chip"
              >
                <ShoppingCart width={19} height={19} aria-hidden />
                {cartCount > 0 ? (
                  <span className="tnum absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-chip bg-signal px-1 text-[10px] font-bold text-on-signal">
                    {cartCount}
                  </span>
                ) : null}
              </button>
              {cartOpen ? <MiniCart onClose={() => setCartOpen(false)} /> : null}
            </div>

            {me ? (
              <Link
                href="/account"
                className="ring-focus ring-focus-flat glass ml-1 hidden items-center gap-2 rounded-chip px-3 py-1.5 md:inline-flex"
                aria-label="Your balance"
              >
                <Wallet width={15} height={15} className="text-signal" aria-hidden />
                <Price eur={me.balanceEur} className="tnum text-sm font-bold text-ink" />
              </Link>
            ) : null}

            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              aria-expanded={drawer}
              className="ring-focus ring-focus-flat ml-1 grid size-10 place-items-center rounded-chip text-ink transition-colors hover:bg-chip lg:hidden"
            >
              <Menu width={20} height={20} aria-hidden />
            </button>
          </div>
        </div>

        {/* Tab row */}
        <nav
          aria-label="Browse"
          className={cx(
            "mx-auto hidden max-w-[1500px] items-center gap-1 overflow-x-auto px-4 md:px-6 lg:flex",
            condensed ? "pb-1.5" : "pb-2.5",
          )}
        >
          {NAV_TABS.map((tab) => {
            const isOpen = tab.panel != null && panel === tab.panel;
            const common =
              "ring-focus ring-focus-flat inline-flex shrink-0 items-center gap-1 rounded-chip px-3.5 py-1.5 text-sm font-semibold transition-colors";
            return tab.panel ? (
              <button
                key={tab.label}
                type="button"
                onClick={() => setPanel(isOpen ? null : tab.panel!)}
                onMouseEnter={() => setPanel(tab.panel!)}
                aria-expanded={isOpen}
                aria-haspopup="true"
                className={cx(
                  common,
                  isOpen ? "bg-signal text-on-signal" : "text-ink-muted hover:bg-chip hover:text-ink",
                )}
              >
                {tab.label}
                <ChevronDown
                  width={15}
                  height={15}
                  className={cx("transition-transform duration-[var(--dur-2)]", isOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
            ) : (
              <Link
                key={tab.label}
                href={tab.href}
                onMouseEnter={() => setPanel(null)}
                className={cx(common, "text-ink-muted hover:bg-chip hover:text-ink")}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>

        {panel ? (
          <MegaPanel
            kind={panel}
            links={panel === "platforms" ? PLATFORM_LINKS : GENRE_LINKS}
            onClose={() => setPanel(null)}
          />
        ) : null}
      </div>

      {/* Search gets its own row on small screens, where the bar has no room. */}
      <div className="border-b border-edge bg-[color-mix(in_oklab,var(--deck)_82%,transparent)] px-4 py-2 backdrop-blur-xl lg:hidden">
        <SearchBox />
      </div>

      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} me={me} />
    </header>
  );
}

function IconLink({
  href,
  label,
  count,
  badge,
  coral,
  children,
}: {
  href: string;
  label: string;
  count?: number;
  badge?: "dot";
  coral?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={count ? `${label}, ${count}` : label}
      title={label}
      className="ring-focus ring-focus-flat relative grid size-10 place-items-center rounded-chip text-ink transition-colors hover:bg-chip"
    >
      {children}
      {count ? (
        <span
          className={cx(
            "tnum absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-chip px-1 text-[10px] font-bold text-white",
            coral ? "bg-coral" : "bg-signal",
          )}
        >
          {count}
        </span>
      ) : null}
      {badge === "dot" ? (
        <span aria-hidden className="absolute right-1.5 top-1.5 size-2 rounded-chip bg-stock ring-2 ring-[var(--deck)]" />
      ) : null}
    </Link>
  );
}
