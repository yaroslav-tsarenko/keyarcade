import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cx } from "@/lib/cx";

/**
 * The label above a rail. Kicker, title, and an optional "see all" that is a
 * control in its own right — so it gets the same ring as everything else.
 */
export function SectionHeading({
  kicker,
  title,
  href,
  hrefLabel = "See all",
  className,
}: {
  kicker?: string;
  title: string;
  href?: string;
  hrefLabel?: string;
  className?: string;
}) {
  return (
    <div className={cx("mb-5 flex items-end justify-between gap-4", className)}>
      <div>
        {kicker ? <span className="eyebrow block">{kicker}</span> : null}
        <h2 className="mt-2 text-rail text-ink">{title}</h2>
      </div>
      {href ? (
        <Link
          href={href}
          className="ring-focus ring-focus-flat group inline-flex shrink-0 items-center gap-1.5 rounded-control px-3 py-2 text-sm font-semibold text-signal-deep transition-colors hover:bg-signal-tint"
        >
          {hrefLabel}
          <ArrowRight
            width={16}
            height={16}
            className="transition-transform duration-[var(--dur-2)] group-hover:translate-x-0.5"
          />
        </Link>
      ) : null}
    </div>
  );
}
