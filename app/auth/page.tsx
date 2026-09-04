import type { Metadata } from "next";
import { Zap, ShieldCheck, Library } from "lucide-react";
import { AuthCard } from "@/components/sections/AuthCard";

export const metadata: Metadata = {
  title: "Sign in or join",
};

const PERKS = [
  { icon: Library, title: "One library", body: "Every key you buy, lined up in one place, ready to redeem." },
  { icon: Zap, title: "Faster checkout", body: "Save your details once and grab deals before they sell out." },
  { icon: ShieldCheck, title: "Order protection", body: "Bad code? Reach support from your order and we sort it." },
];

export default function AuthPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 md:px-6 md:py-14">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        {/* pitch */}
        <div className="order-2 lg:order-1">
          <span className="eyebrow inline-block">
            Your account
          </span>
          <h2 className="mt-3 text-stage text-ink">Keys, kept.</h2>
          <p className="mt-3 max-w-md text-lg font-semibold text-ink-muted">
            Sign in to reach your library and orders, or make an account and keep
            every code in one spot.
          </p>
          <ul className="mt-7 flex flex-col gap-4">
            {PERKS.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.title} className="flex gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-control border border-edge bg-preorder-tint text-ink lift-sm">
                    <Icon width={20} height={20} strokeWidth={2.5} />
                  </span>
                  <div>
                    <h3 className="text-lg text-ink">{p.title}</h3>
                    <p className="text-sm font-medium text-ink-muted">{p.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* form */}
        <div className="order-1 lg:order-2">
          <AuthCard />
        </div>
      </div>
    </div>
  );
}
