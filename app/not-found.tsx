import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
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
    </div>
  );
}
