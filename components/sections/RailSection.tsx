import type { Game } from "@/lib/mock-data";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TileRail } from "@/components/ui/Rail";
import { cx } from "@/lib/cx";

/**
 * A titled rail. Every "row of games" on the home page is this component —
 * one browsing pattern, learned once.
 */
export function RailSection({
  kicker,
  title,
  games,
  href,
  numbered,
  className,
  id,
}: {
  kicker?: string;
  title: string;
  games: Game[];
  href?: string;
  numbered?: boolean;
  className?: string;
  id?: string;
}) {
  if (games.length === 0) return null;
  return (
    <section id={id} className={cx("mx-auto max-w-[1500px] px-4 md:px-6", className)}>
      <SectionHeading kicker={kicker} title={title} href={href} />
      <TileRail games={games} ariaLabel={title} numbered={numbered} />
    </section>
  );
}
