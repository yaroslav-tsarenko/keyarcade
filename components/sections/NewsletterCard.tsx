"use client";

import { useState } from "react";
import { BellRing, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * The newsletter, shaped like the notification a console shows you: an icon,
 * a title, one line of detail, and a single action.
 */
export function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="glass w-full max-w-sm rounded-panel p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-signal-tint text-signal-deep">
          <BellRing width={17} height={17} aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="font-display text-sm font-bold text-ink">Patch notes for your wallet</p>
          <p className="mt-0.5 text-xs text-ink-muted">
            Price drops and new releases. Weekly, never more.
          </p>
        </div>
      </div>

      {done ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-control bg-stock-tint px-3 py-2 text-sm text-stock">
          <Check width={15} height={15} aria-hidden /> You&apos;re on the list.
        </p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) setDone(true);
          }}
          className="mt-4 flex gap-2"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="ring-focus ring-focus-flat min-w-0 flex-1 rounded-control border border-[var(--glass-edge)] bg-[var(--deck-sunk)] px-3 py-2 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <Button type="submit" size="sm">
            Subscribe
          </Button>
        </form>
      )}
    </div>
  );
}
