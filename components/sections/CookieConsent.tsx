"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/Button";

const KEY = "keyarcade:cookie-consent";

/** Shaped like the rest of the deck's notifications: icon, one line, two
 *  equal-weight choices. Declining is as easy as accepting. */
export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      // Storage blocked — show the notice rather than silently assuming consent.
      setShow(true);
    }
  }, []);

  function decide(value: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* nothing to remember it with; the choice still applies to this visit */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] p-3 md:p-4">
      <div className="glass-panel mx-auto flex max-w-[820px] flex-col gap-3 rounded-panel p-4 md:flex-row md:items-center md:gap-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-signal-tint text-signal-deep">
          <Cookie width={18} height={18} aria-hidden />
        </span>
        <p className="flex-1 text-sm text-ink-muted">
          Cookies keep your cart, currency and session working, and tell us how the
          shop is used.{" "}
          <Link
            href="/legal/cookies"
            className="font-semibold text-signal-deep underline-offset-2 hover:underline"
          >
            Cookie Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button type="button" variant="glass" size="sm" onClick={() => decide("declined")}>
            Decline
          </Button>
          <Button type="button" size="sm" onClick={() => decide("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
