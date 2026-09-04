import type { Game } from "@/lib/mock-data";
import { Rail } from "@/components/ui/Rail";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function DealRail({
  kicker,
  title,
  games,
  href = "/catalog",
}: {
  kicker?: string;
  title: string;
  games: Game[];
  href?: string;
}) {
  if (games.length === 0) return null;
  return (
    <Reveal className="mx-auto min-w-0 max-w-[1500px] px-4 md:px-6">
      <SectionHeading kicker={kicker} title={title} href={href} />
      <Rail ariaLabel={title}>
        {games.map((g) => (
          <ProductCard key={g.slug} game={g} className="w-[220px] shrink-0 sm:w-[240px]" />
        ))}
      </Rail>
    </Reveal>
  );
}
