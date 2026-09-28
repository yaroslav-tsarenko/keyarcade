"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  COOKIE_INVENTORY,
  CONSENT_CHANGED,
  NO_OPTIONAL,
  OPEN_COOKIE_SETTINGS,
  openCookieSettings,
  readConsent,
  writeConsent,
  type CookiePrefs,
} from "@/lib/cookie-consent";

const CATEGORIES = [
  {
    id: "necessary" as const,
    title: "Strictly necessary",
    body:
      "Sign-in, basket and the record of this choice. The shop cannot work without them, so they are always on and are not based on consent.",
    locked: true,
  },
  {
    id: "functional" as const,
    title: "Functional",
    body:
      "Remembers your currency, light/dark theme and wishlist between visits. Turning this off also clears what has already been stored.",
    locked: false,
  },
];

/** Banner on first visit, preference centre thereafter. Rejecting takes the
 *  same single click as accepting, and the choice can be changed at any time
 *  from the "Cookie settings" link in the footer. */
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(false);
  const [functional, setFunctional] = useState(false);

  const load = useCallback(() => {
    setFunctional(readConsent()?.functional ?? false);
  }, []);

  useEffect(() => {
    if (readConsent() === null) setOpen(true);
    load();
    const reopen = () => {
      load();
      setDetail(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_COOKIE_SETTINGS, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS, reopen);
  }, [load]);

  function save(prefs: CookiePrefs) {
    writeConsent(prefs);
    setFunctional(prefs.functional);
    setOpen(false);
    setDetail(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-3 md:p-4">
      <div
        role="dialog"
        aria-label="Cookie preferences"
        className="glass-panel mx-auto max-w-[820px] rounded-panel p-4"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-signal-tint text-signal-deep">
            <Cookie width={18} height={18} aria-hidden />
          </span>
          <p className="flex-1 text-sm text-ink-muted">
            We use strictly necessary storage to run sign-in and your basket, and
            optional functional storage to remember your currency, theme and
            wishlist. No analytics or advertising technologies are used.{" "}
            <Link
              href="/legal/cookies"
              className="font-semibold text-signal-deep underline-offset-2 hover:underline"
            >
              Cookie Policy
            </Link>
            .
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button type="button" variant="glass" size="sm" onClick={() => setDetail((d) => !d)}>
              {detail ? "Hide options" : "Manage"}
            </Button>
            <Button type="button" variant="glass" size="sm" onClick={() => save(NO_OPTIONAL)}>
              Reject optional
            </Button>
            <Button type="button" size="sm" onClick={() => save({ functional: true })}>
              Accept all
            </Button>
          </div>
        </div>

        {detail && (
          <div className="mt-4 space-y-3 border-t border-edge pt-4">
            {CATEGORIES.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id={`cookie-${c.id}`}
                  checked={c.locked ? true : functional}
                  disabled={c.locked}
                  onChange={(e) => setFunctional(e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--signal)]"
                />
                <label htmlFor={`cookie-${c.id}`} className="text-sm">
                  <span className="block font-bold text-ink">
                    {c.title}
                    {c.locked && " · always on"}
                  </span>
                  <span className="mt-0.5 block text-ink-muted">{c.body}</span>
                  <span className="mt-0.5 block font-mono text-xs text-ink-muted/80">
                    {COOKIE_INVENTORY.filter((e) => e.category === c.id)
                      .map((e) => e.name)
                      .join(", ")}
                  </span>
                </label>
              </div>
            ))}
            <div className="flex justify-end">
              <Button type="button" size="sm" onClick={() => save({ functional })}>
                Save preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** The withdrawal route the Cookie Policy promises. */
export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}

/** Subscribes to the stored preference so a provider can decide whether it is
 *  allowed to persist anything, and react the moment consent is withdrawn. */
export function useFunctionalConsent(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const sync = () => setOk(readConsent()?.functional === true);
    sync();
    window.addEventListener(CONSENT_CHANGED, sync);
    return () => window.removeEventListener(CONSENT_CHANGED, sync);
  }, []);
  return ok;
}
