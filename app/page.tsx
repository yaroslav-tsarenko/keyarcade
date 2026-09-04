import { redirect } from "next/navigation";
import { Marquee } from "@/components/sections/Marquee";
import { Hero } from "@/components/sections/Hero";
import { RailSection } from "@/components/sections/RailSection";
import { ReleaseTabs } from "@/components/sections/ReleaseTabs";
import { GenreExplorer } from "@/components/sections/GenreExplorer";
import { PlatformShowcase } from "@/components/sections/PlatformShowcase";
import { GiftCards } from "@/components/sections/GiftCards";
import { DeliverySteps } from "@/components/sections/DeliverySteps";
import { Benefits } from "@/components/sections/Benefits";
import { TrustBand } from "@/components/sections/TrustBand";
import { HomeFaq } from "@/components/sections/HomeFaq";
import { getHomeData } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { PLATFORMS } from "@/lib/mock-data";

export default async function Home() {
  // Signed-in shoppers land in their library rather than the shop front.
  const user = await getCurrentUser();
  if (user) redirect("/account");

  const home = await getHomeData();
  const {
    stage,
    deals,
    topCharts,
    fresh,
    preorders,
    underTen,
    byPlatform,
    genres,
    ticker,
  } = home;

  // Every rail is a view of one fetched pool; this is how many distinct keys
  // that pool holds, which is the only "statistic" the trust band claims.
  const keysLive = new Set(
    [stage.map((s) => s.game), deals, topCharts, fresh, preorders, underTen]
      .flat()
      .map((g) => g.slug),
  ).size;

  if (stage.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-extrabold text-ink">The deck is restocking</h1>
        <p className="mt-3 text-ink-muted">
          Live keys are momentarily unavailable. Please try again in a minute.
        </p>
      </div>
    );
  }

  return (
    <>
      <Hero stage={stage} />
      <Marquee items={ticker} />

      <div className="space-y-14 py-12 md:space-y-16 md:py-14">
        <RailSection kicker="Deals" title="Biggest discounts today" games={deals} href="/catalog?deals=1" />
        <RailSection kicker="Top charts" title="What everyone is buying" games={topCharts} href="/catalog?sort=top" numbered />
        <ReleaseTabs fresh={fresh} preorders={preorders} />
      </div>

      <GenreExplorer games={[...deals, ...fresh, ...underTen]} genres={genres} />

      <div className="space-y-14 py-12 md:space-y-16 md:py-14">
        <RailSection kicker="Under €10" title="Cheap and worth it" games={underTen} href="/catalog" />
        <PlatformShowcase rows={byPlatform} />
        <GiftCards />
      </div>

      <TrustBand keysLive={keysLive} platforms={PLATFORMS.length} />

      <div className="space-y-14 py-12 md:space-y-16 md:py-14">
        <DeliverySteps />
        <Benefits />
      </div>

      <HomeFaq />
    </>
  );
}
