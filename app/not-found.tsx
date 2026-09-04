import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { GAMES } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";

export default function NotFound() {
  const picks = GAMES.filter((g) => g.wasPrice).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-16 md:px-6 md:py-24">
      <div className="text-center">
        <p className="eyebrow tnum">Error 404</p>
        <h1 className="mt-3 text-stage text-ink">Nothing on this slot</h1>
        <p className="mx-auto mt-3 max-w-md text-pretty text-ink-muted">
          This page has either sold out or never existed. The rest of the deck is
          stocked — start from the shop front or browse every key we carry.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="signal" size="lg">
            Back to the shop
          </ButtonLink>
          <ButtonLink href="/catalog" variant="glass" size="lg">
            Browse all keys
          </ButtonLink>
        </div>
      </div>

      <div className="mt-16">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-rail text-ink">While you&apos;re here</h2>
          <Link
            href="/catalog?deals=1"
            className="ring-focus ring-focus-flat rounded-control px-3 py-2 text-sm font-semibold text-signal-deep transition-colors hover:bg-signal-tint"
          >
            More deals
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-4">
          {picks.map((g) => (
            <ProductCard key={g.slug} game={g} />
          ))}
        </div>
      </div>
    </div>
  );
}
