import Link from "next/link";
import { Plus, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { PaymentMarks } from "@/components/ui/PaymentMarks";
import { NewsletterCard } from "./NewsletterCard";
import { SITE, COMPANY, FOOTER_PLATFORMS } from "@/lib/site-config";
import { PLATFORM_LINKS, GENRE_LINKS } from "@/lib/nav";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      ...PLATFORM_LINKS.slice(0, 4),
      { label: "Deals", href: "/catalog?deals=1" },
      { label: "Pre-orders", href: "/catalog?kind=Pre-order" },
      { label: "Gift cards", href: "/catalog?kind=Gift%20card" },
    ],
  },
  {
    title: "Genres",
    links: GENRE_LINKS.slice(0, 7),
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "/faq" },
      { label: "Activation guides", href: "/faq#activation" },
      { label: "Delivery", href: "/legal/delivery" },
      { label: "Refunds", href: "/legal/refunds" },
      { label: "Complaints", href: "/legal/complaints" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About the store", href: "/faq#about" },
      { label: "Acceptable use", href: "/legal/acceptable-use" },
      { label: "Accessibility", href: "/legal/accessibility" },
      { label: "All policies", href: "/legal/terms" },
    ],
  },
];

const LEGAL = [
  { label: "Privacy", href: "/legal/privacy" },
  { label: "Terms", href: "/legal/terms" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Refund policy", href: "/legal/refunds" },
];

export function Footer() {
  return (
    <footer className="deck-night mt-auto">
      {/* Tier 1 — identity and the one thing we ask for */}
      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 py-12 md:grid-cols-2 md:items-center md:px-6">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-pretty text-ink-muted">
            {SITE.tagline} Verified codes for Steam, Epic, Xbox, PlayStation,
            Nintendo and GOG — delivered by email the minute you pay.
          </p>
        </div>
        <div className="md:justify-self-end">
          <NewsletterCard />
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 md:px-6">
        <div className="h-px bg-[var(--glass-edge)]" />
      </div>

      {/* Tier 2 — the map of the store */}
      <div className="mx-auto grid max-w-[1500px] gap-1 px-4 py-8 md:grid-cols-4 md:gap-8 md:px-6 md:py-12">
        {COLUMNS.map((col) => (
          <FooterColumn key={col.title} title={col.title} links={col.links} />
        ))}
      </div>

      <div className="mx-auto max-w-[1500px] px-4 md:px-6">
        <div className="h-px bg-[var(--glass-edge)]" />
      </div>

      {/* Tier 3 — trust */}
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-6 md:px-6">
        <PaymentMarks />
        <p className="inline-flex items-center gap-2 text-sm text-ink-muted">
          <ShieldCheck width={16} height={16} className="text-stock" aria-hidden />
          Secure checkout · Keys sourced from official distributors
        </p>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 md:px-6">
        <div className="h-px bg-[var(--glass-edge)]" />
      </div>

      {/* Tier 4 — legal */}
      <div className="mx-auto max-w-[1500px] space-y-3 px-4 py-6 text-xs text-ink-faint md:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-pretty">
            © {new Date().getFullYear()} {COMPANY.legalName} · Reg. no. {COMPANY.regNumber} ·{" "}
            {COMPANY.address} · {COMPANY.email}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-4">
            {LEGAL.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="ring-focus ring-focus-flat rounded-control text-ink-muted transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="text-pretty">
          {FOOTER_PLATFORMS.join(", ")} and all related marks are trademarks of their
          respective owners. {SITE.name} is an independent retailer and is not
          affiliated with, endorsed by or sponsored by any platform holder or
          publisher.
        </p>
      </div>
    </footer>
  );
}

/** A plain column from `md` up; a disclosure on phones. */
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <>
      <details className="group border-b border-[var(--glass-edge)] md:hidden">
        <summary className="eyebrow flex cursor-pointer list-none items-center justify-between py-3.5">
          {title}
          <Plus
            width={14}
            height={14}
            aria-hidden
            className="transition-transform duration-[var(--dur-2)] group-open:rotate-45"
          />
        </summary>
        <ul className="grid grid-cols-2 gap-1 pb-3">
          {links.map((l) => (
            <FooterLink key={l.href + l.label} {...l} />
          ))}
        </ul>
      </details>
      <div className="hidden md:block">
        <h3 className="eyebrow mb-4">{title}</h3>
        <ul className="space-y-2">
          {links.map((l) => (
            <FooterLink key={l.href + l.label} {...l} />
          ))}
        </ul>
      </div>
    </>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="ring-focus ring-focus-flat inline-block rounded-control text-sm text-ink-muted transition-colors hover:text-ink"
      >
        {label}
      </Link>
    </li>
  );
}
