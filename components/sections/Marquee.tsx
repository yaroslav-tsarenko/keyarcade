import { Zap } from "lucide-react";

/**
 * A quiet live-price ticker. It carries real prices from the catalogue, so it
 * stays on the cool band rather than shouting — the deals rail does the
 * selling.
 */
export function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  const Row = () => (
    <ul className="flex shrink-0 items-center" aria-hidden="true">
      {items.map((t, i) => (
        <li
          key={i}
          className="tnum flex items-center whitespace-nowrap px-5 py-2 text-xs font-semibold text-ink-muted"
        >
          <Zap width={12} height={12} className="mr-2 text-signal" />
          {t}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee group relative overflow-hidden border-b border-edge bg-deck-band">
      <p className="sr-only">Live prices: {items.join(", ")}</p>
      <div className="marquee-track flex w-max">
        <Row />
        <Row />
      </div>
    </div>
  );
}
