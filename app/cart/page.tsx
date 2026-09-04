import type { Metadata } from "next";
import { CartView } from "@/components/sections/CartView";

export const metadata: Metadata = {
  title: "Your cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6 md:py-10">
      <header className="mb-8">
        <span className="eyebrow inline-block">
          The counter
        </span>
        <h1 className="mt-2 text-stage text-ink">Your cart</h1>
      </header>
      <CartView />
    </div>
  );
}
