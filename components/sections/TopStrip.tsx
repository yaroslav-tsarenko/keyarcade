"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { CurrencySwitcher } from "@/components/ui/CurrencySwitcher";
import { useTheme } from "@/components/ui/ThemeProvider";

const REASSURANCE = [
  "Instant key delivery",
  "Original keys",
  "Pay in EUR, GBP or USD",
  "14-day refund window",
];

/** The slim strip above the deck: what the store promises, plus the two
 *  preferences a shopper changes once and never again. */
export function TopStrip() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % REASSURANCE.length), 3800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="hidden border-b border-edge bg-deck-band md:block">
      <div className="mx-auto flex h-9 max-w-[1500px] items-center justify-between px-4 md:px-6">
        <p className="flex items-center gap-2" aria-live="polite">
          <span aria-hidden className="size-1.5 rounded-full bg-stock" />
          <span className="eyebrow text-ink">{REASSURANCE[i]}</span>
        </p>
        <div className="flex items-center gap-1">
          <CurrencySwitcher />
          <span aria-hidden className="mx-1 h-3.5 w-px bg-edge" />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light theme" : "Dark theme"}
      className={`ring-focus ring-focus-flat grid size-8 place-items-center rounded-chip text-ink-muted transition-colors hover:bg-chip hover:text-ink ${className ?? ""}`}
    >
      {theme === "dark" ? (
        <Sun width={16} height={16} aria-hidden />
      ) : (
        <Moon width={16} height={16} aria-hidden />
      )}
    </button>
  );
}
