import type { Metadata } from "next";
import { CheckoutForm } from "@/components/sections/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-6 md:py-10">
      <header className="mb-8">
        <span className="eyebrow inline-block">
          Almost yours
        </span>
        <h1 className="mt-2 text-stage text-ink">Checkout</h1>
      </header>
      <CheckoutForm />
    </div>
  );
}
