import type { Metadata } from "next";
import { MessageCircle, Mail, Clock } from "lucide-react";
import { FaqAccordion } from "@/components/sections/FaqAccordion";
import { ButtonLink } from "@/components/ui/Button";
import { ACTIVATION_STEPS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Support & FAQ",
  description: "Answers on delivery, regions, redeeming keys and refunds.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 md:px-6 md:py-10">
      <header className="mb-8">
        <span className="eyebrow inline-block">
          Help desk
        </span>
        <h1 className="mt-2 text-stage text-ink">Support</h1>
        <p className="mt-2 max-w-xl font-semibold text-ink-muted">
          The short answers to how keys, regions and refunds work. Can&apos;t find
          it? The counter&apos;s open.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:gap-10">
        <FaqAccordion />

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-tile border border-edge bg-ink p-6 text-ink-invert lift-md">
            <MessageCircle width={30} height={30} strokeWidth={2.5} className="text-preorder" />
            <h2 className="mt-3 text-2xl text-ink-invert">Still stuck?</h2>
            <p className="mt-2 text-sm text-ink-invert/75">
              Message the support desk with your order number. Real people, quick
              replies, no bot maze.
            </p>

            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail width={17} height={17} className="text-preorder" />
                <span className="font-semibold">support@keyarcade.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock width={17} height={17} className="text-preorder" />
                <span className="font-semibold">Mon–Fri, 09:00–18:00 (EET)</span>
              </li>
            </ul>

            <ButtonLink href="/contact" variant="coral" size="md" className="mt-6 w-full">
              Contact us
            </ButtonLink>
          </div>
        </aside>
      </div>

      <section id="activation" className="mt-14 scroll-mt-28">
        <span className="eyebrow inline-block">Activation guide</span>
        <h2 className="mt-2 text-rail text-ink">Redeem your key</h2>
        <p className="mt-2 max-w-xl font-semibold text-ink-muted">
          The same four steps work for Steam, Epic, Xbox, PlayStation, Nintendo and
          GOG — open the matching launcher and follow along.
        </p>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2">
          {ACTIVATION_STEPS.map((step, i) => (
            <li
              key={step}
              className="flex gap-3 rounded-tile border border-edge bg-[var(--glass)] p-4 lift-md"
            >
              <span className="tnum grid h-8 w-8 shrink-0 place-items-center rounded-control bg-signal font-display text-sm font-extrabold text-on-signal">
                {i + 1}
              </span>
              <p className="text-[15px] leading-relaxed text-ink">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
