"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Price } from "@/components/ui/Price";
import { CurrencySwitcher } from "@/components/ui/CurrencySwitcher";
import { ThemeToggle } from "./TopStrip";
import { NAV_TABS, PLATFORM_LINKS, GENRE_LINKS, SUPPORT_LINKS } from "@/lib/nav";
import { cx } from "@/lib/cx";

/** The phone menu: the same tabs as the deck, with the two taxonomies as
 *  accordions rather than mega-panels. */
export function MobileDrawer({
  open,
  onClose,
  me,
}: {
  open: boolean;
  onClose: () => void;
  me: { firstName: string; balanceEur: number } | null;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const flat = NAV_TABS.filter((t) => !t.panel);

  return (
    <div
      className={cx("fixed inset-0 z-[60] lg:hidden", !open && "pointer-events-none")}
      aria-hidden={!open}
    >
      <button
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
        onClick={onClose}
        className={cx(
          "absolute inset-0 bg-[color-mix(in_oklab,var(--deck-sunk)_70%,transparent)] backdrop-blur-sm transition-opacity duration-[var(--dur-3)]",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={cx(
          "glass-panel absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col rounded-none border-y-0 border-r-0",
          "transition-transform duration-300 ease-[var(--ease-deck)]",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-edge p-4">
          <Logo size="sm" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="ring-focus ring-focus-flat grid size-10 place-items-center rounded-chip text-ink hover:bg-chip"
          >
            <X width={19} height={19} aria-hidden />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {flat.map((t) => (
              <li key={t.label}>
                <Link
                  href={t.href}
                  onClick={onClose}
                  className="ring-focus ring-focus-flat block rounded-control px-3 py-3 font-semibold text-ink transition-colors hover:bg-chip"
                >
                  {t.label}
                </Link>
              </li>
            ))}
          </ul>

          <DrawerAccordion title="Platforms" links={PLATFORM_LINKS} onNavigate={onClose} />
          <DrawerAccordion title="Genres" links={GENRE_LINKS} onNavigate={onClose} />
          <DrawerAccordion title="Support" links={SUPPORT_LINKS} onNavigate={onClose} />

          <Link
            href={me ? "/account" : "/auth"}
            onClick={onClose}
            className="ring-focus ring-focus-flat mt-4 flex items-center justify-between rounded-control bg-signal px-4 py-3 font-semibold text-on-signal"
          >
            {me ? "Your account" : "Sign in"}
            {me ? <Price eur={me.balanceEur} className="tnum" /> : null}
          </Link>
        </div>

        <div className="flex items-center justify-between border-t border-edge px-4 py-3">
          <CurrencySwitcher />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

function DrawerAccordion({
  title,
  links,
  onNavigate,
}: {
  title: string;
  links: { label: string; href: string }[];
  onNavigate: () => void;
}) {
  return (
    <details className="group border-t border-edge">
      <summary className="eyebrow flex cursor-pointer list-none items-center justify-between py-3.5">
        {title}
        <Plus
          width={15}
          height={15}
          aria-hidden
          className="text-ink-muted transition-transform duration-[var(--dur-2)] group-open:rotate-45"
        />
      </summary>
      <ul className="grid grid-cols-2 gap-1 pb-3">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link
              href={l.href}
              onClick={onNavigate}
              className="ring-focus ring-focus-flat block rounded-control px-3 py-2 text-sm text-ink-muted transition-colors hover:bg-chip hover:text-ink"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}
