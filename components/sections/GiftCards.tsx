import Link from "next/link";
import { Gift } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/lib/cx";

/** Gift cards get their own band. The mockups are the product — a plastic
 *  card is the one thing in this store that has no cover art. */
const CARDS = [
  { label: "Steam Wallet", tone: "from-[#2E66F5] to-[#7B5CF0]" },
  { label: "PlayStation Store", tone: "from-[#1b4bd0] to-[#2E66F5]" },
  { label: "Xbox Game Pass", tone: "from-[#3f9142] to-[#7ED321]" },
  { label: "Nintendo eShop", tone: "from-[#d93b3b] to-[#FF5C5C]" },
];

export function GiftCards() {
  return (
    <section className="mx-auto max-w-[1500px] px-4 md:px-6">
      <SectionHeading
        kicker="Gift cards"
        title="Top up a wallet instead"
        href="/catalog?kind=Gift%20card"
      />
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c) => (
          <li key={c.label}>
            <Link
              href={`/catalog?kind=Gift%20card&q=${encodeURIComponent(c.label)}`}
              className="ring-focus block overflow-hidden rounded-tile"
            >
              <span
                className={cx(
                  "flex aspect-[16/10] flex-col justify-between bg-gradient-to-br p-4 text-white",
                  c.tone,
                )}
              >
                <Gift width={20} height={20} aria-hidden className="opacity-90" />
                <span className="font-display text-base font-extrabold leading-tight">
                  {c.label}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
