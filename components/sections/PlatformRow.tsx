import Link from "next/link";
import { PLATFORMS } from "@/lib/mock-data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal, RevealItem } from "@/components/ui/Reveal";

const TONES = [
  "bg-signal text-ink-invert",
  "bg-stock text-ink-invert",
  "bg-special text-ink-invert",
  "bg-preorder-tint text-ink",
  "bg-ink text-ink-invert",
  "bg-signal-deep text-ink-invert",
];

export function PlatformRow() {
  return (
    <Reveal stagger className="mx-auto max-w-[1500px] px-4 md:px-6">
      <SectionHeading kicker="Browse" title="Pick your platform" href="/catalog" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {PLATFORMS.map((p, i) => (
          <RevealItem key={p}>
            <Link
              href={`/catalog?platform=${encodeURIComponent(p)}`}
              className={`group flex h-24 flex-col justify-between rounded-control border border-edge p-3 lift-md transition-transform hover:-translate-y-1 hover:-translate-x-0.5 ${TONES[i % TONES.length]}`}
            >
              <span className="text-2xl leading-none font-display">{p}</span>
              <span className="eyebrow opacity-80">
                Shop keys →
              </span>
            </Link>
          </RevealItem>
        ))}
      </div>
    </Reveal>
  );
}
