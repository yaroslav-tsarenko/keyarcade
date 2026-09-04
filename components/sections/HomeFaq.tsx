import Link from "next/link";
import { FAQ } from "@/lib/mock-data";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** The five questions that actually block a purchase, on the cool band.
 *  Native <details> so it works before hydration and reads well to a screen
 *  reader without any ARIA of our own. */
export function HomeFaq() {
  return (
    <section className="border-t border-edge bg-deck-band py-12 md:py-16">
      <div className="mx-auto grid max-w-[1500px] gap-8 px-4 md:px-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading kicker="Before you buy" title="The short answers" className="mb-3" />
          <p className="max-w-sm text-pretty text-ink-muted">
            Regions, refunds and where a code gets redeemed — the three things
            worth checking before you pay.{" "}
            <Link href="/faq" className="font-semibold text-signal-deep hover:underline">
              Full help centre
            </Link>
            .
          </p>
        </div>

        <div className="glass divide-y divide-[var(--glass-edge)] rounded-panel px-5">
          {FAQ.slice(0, 5).map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="ring-focus ring-focus-flat flex cursor-pointer list-none items-center justify-between gap-4 rounded-control font-display text-base font-bold text-ink">
                {f.q}
                <span
                  aria-hidden
                  className="shrink-0 text-lg leading-none text-ink-muted transition-transform duration-[var(--dur-2)] group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-2.5 text-pretty text-sm text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
