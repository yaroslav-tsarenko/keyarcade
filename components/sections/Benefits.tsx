import { BadgeCheck, Headphones, RefreshCw, Wallet } from "lucide-react";
import { POLICY } from "@/lib/site-config";

/** What the store guarantees, stated as policy rather than adjectives. */
const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Sourced from official distributors",
    body: "Every code comes through authorised distribution, is sold once, and leaves stock the moment it is yours.",
  },
  {
    icon: RefreshCw,
    title: `${POLICY.refundDays}-day refunds on unredeemed keys`,
    body: "Changed your mind before revealing the code? Send it back. Once a key is revealed it cannot be un-sold.",
  },
  {
    icon: Headphones,
    title: "A key that fails gets replaced",
    body: POLICY.warranty + ".",
  },
  {
    icon: Wallet,
    title: "Pay in EUR, GBP or USD",
    body: "Prices convert at the switcher in the header. What you see at checkout is what your card is charged.",
  },
];

export function Benefits() {
  return (
    <section className="mx-auto max-w-[1500px] px-4 md:px-6">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b) => (
          <li key={b.title} className="glass rounded-panel p-5">
            <span className="grid size-10 place-items-center rounded-[12px] bg-signal-tint text-signal-deep">
              <b.icon width={19} height={19} aria-hidden />
            </span>
            <h3 className="mt-4 font-display text-base font-bold text-ink">{b.title}</h3>
            <p className="mt-1.5 text-sm text-pretty text-ink-muted">{b.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
