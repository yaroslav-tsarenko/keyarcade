import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { getCatalog, getCatalogGame } from "@/lib/catalog";
import { PosterZoom } from "@/components/ui/PosterZoom";
import { Badge } from "@/components/ui/Badge";
import { ProductBuyBox } from "@/components/sections/ProductBuyBox";
import { ProductTabs } from "@/components/sections/ProductTabs";
import { TileRail } from "@/components/ui/Rail";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Live products are rendered on-demand — nothing is prebuilt from mock data.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const game = await getCatalogGame(slug);
  if (!game) return { title: "Not found" };
  return {
    title: `${game.title} key`,
    description: game.tagline,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getCatalogGame(slug);
  if (!game) notFound();

  // Related titles come from the live catalog only.
  const { games } = await getCatalog(12);
  const related = games.filter((g) => g.slug !== game.slug).slice(0, 8);

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 md:px-6 md:py-10">
      {/* breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-ink-muted">
        <Link href="/" className="ring-focus ring-focus-flat rounded-control px-1 hover:text-ink">Home</Link>
        <ChevronRight width={14} height={14} aria-hidden />
        <Link href="/catalog" className="ring-focus ring-focus-flat rounded-control px-1 hover:text-ink">Catalog</Link>
        <ChevronRight width={14} height={14} aria-hidden />
        <span className="truncate px-1 text-ink">{game.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-10 xl:grid-cols-[minmax(0,420px)_1fr]">
        {/* poster */}
        <div className="mx-auto w-full max-w-[420px] lg:sticky lg:top-28 lg:self-start">
          <div className="glass overflow-hidden rounded-panel p-2">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-tile bg-deck-sunk">
              <PosterZoom game={game} />
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{game.platform}</Badge>
            <Badge>{game.region}</Badge>
            <Badge>{game.genre}</Badge>
            {game.kind !== "Game" && <Badge tone="special">{game.kind}</Badge>}
          </div>
        </div>

        {/* buy column */}
        <div>
          <p className="eyebrow tnum">
            {game.kind} · {game.releaseYear}
          </p>
          <h1 className="mt-2.5 text-stage text-balance text-ink">{game.title}</h1>
          <p className="mt-3 max-w-xl text-pretty text-lg text-ink-muted">{game.tagline}</p>

          <div className="mt-6 max-w-md">
            <ProductBuyBox game={game} />
          </div>

          <div className="mt-10">
            <ProductTabs game={game} />
          </div>
        </div>
      </div>

      {/* related */}
      <div className="mt-16">
        <SectionHeading kicker="You might also like" title="Related titles" href="/catalog" />
        <TileRail games={related} ariaLabel="Related titles" />
      </div>
    </div>
  );
}
