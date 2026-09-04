import type { Metadata } from "next";
import { WishlistView } from "@/components/sections/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The keys you saved, with their current prices.",
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-10 md:px-6 md:py-12">
      <span className="eyebrow inline-block">Saved for later</span>
      <h1 className="mt-2.5 text-stage text-ink">Your wishlist</h1>
      <p className="mt-3 max-w-xl text-pretty text-ink-muted">
        Saved on this device. Prices update every time you open the page, so a
        discount shows up here the moment it starts.
      </p>
      <div className="mt-8">
        <WishlistView />
      </div>
    </div>
  );
}
