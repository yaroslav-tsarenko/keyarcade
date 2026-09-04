import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

type Variant = "signal" | "glass" | "quiet" | "coral";
type Size = "sm" | "md" | "lg";

/* Every control carries the same focus treatment as the tiles — the ring is
   the brand, and it must look identical under a mouse and under a keyboard. */
const base =
  "ring-focus ring-focus-flat inline-flex select-none items-center justify-center gap-2 " +
  "rounded-control font-semibold transition-[background-color,color,box-shadow,transform] " +
  "duration-[var(--dur-2)] ease-[var(--ease-deck)] active:scale-[0.985] " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  signal: "bg-signal text-on-signal lift-sm hover:brightness-[1.06]",
  glass: "glass text-ink hover:bg-[color-mix(in_oklab,var(--glass)_70%,white)]",
  quiet: "text-ink-muted hover:bg-chip hover:text-ink",
  coral: "bg-coral text-white lift-sm hover:brightness-[1.05]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.8125rem]",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

export function Button({
  variant = "signal",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "signal",
  size = "md",
  className,
  children,
  href,
  ...rest
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link href={href} className={cx(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </Link>
  );
}
