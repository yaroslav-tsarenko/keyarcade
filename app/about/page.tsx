import type { Metadata } from "next";
import { Zap, BadgeCheck, RefreshCw, Wallet } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SITE, POLICY } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About the store",
  description: `Who ${SITE.name} is: an independent retailer of digital game keys with instant delivery.`,
};

const POINTS = [
  {
    icon: Zap,
    title: "Instant delivery",
    body: "In-stock keys land in your email and account library within a minute of payment. Pre-orders ship on launch day.",
  },
  {
    icon: BadgeCheck,
    title: "Original keys, sold once",
    body: "Every code is sold a single time and leaves stock the moment it is yours — no shared accounts, no re-sold codes.",
  },
  {
    icon: RefreshCw,
    title: `${POLICY.refundDays}-day refunds on unused keys`,
    body: POLICY.warranty + ".",
  },
  {
    icon: Wallet,
    title: "Pay your way",
    body: "Prices convert to EUR, GBP or USD at the switcher in the header. What you see at checkout is what your card is charged.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 md:px-6 md:py-10">
      <header className="mb-8">
        <span className="eyebrow inline-block">About the store</span>
        <h1 className="mt-2 text-stage text-ink">Who we are</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-muted">
          {SITE.name} is an independent retailer of digital game keys for Steam,
          Epic, Xbox, PlayStation, Nintendo and GOG. {SITE.tagline} Every code is
          sold once and delivered by email the minute your payment clears. We are
          not affiliated with, endorsed by or sponsored by any platform holder or
          publisher — {SITE.name} is a storefront, not a launcher.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {POINTS.map((p) => (
          <li key={p.title} className="glass rounded-panel p-5">
            <span className="grid size-10 place-items-center rounded-[12px] bg-signal-tint text-signal-deep">
              <p.icon width={19} height={19} aria-hidden />
            </span>
            <h2 className="mt-4 font-display text-base font-bold text-ink">{p.title}</h2>
            <p className="mt-1.5 text-sm text-pretty text-ink-muted">{p.body}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/catalog" size="md">
          Browse the catalog
        </ButtonLink>
        <ButtonLink href="/faq" variant="glass" size="md">
          Read the FAQ
        </ButtonLink>
      </div>
    </div>
  );
}
