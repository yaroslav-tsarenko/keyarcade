import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

/* System chips, the way a console badges its own tiles. Platform and region
   stay deliberately quieter than the focus blue; only status earns colour. */
const tones = {
  system: "",                                                   // .chip defaults
  signal: "border-transparent bg-signal-tint text-signal-deep",
  deal: "border-transparent bg-coral text-white",
  stock: "border-transparent bg-stock-tint text-stock",
  preorder: "border-transparent bg-preorder-tint text-preorder",
  special: "border-transparent bg-special-tint text-special",
  solid: "border-transparent bg-ink text-ink-invert",
} as const;

export function Badge({
  children,
  tone = "system",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tones;
  className?: string;
}) {
  return <span className={cx("chip", tones[tone], className)}>{children}</span>;
}
