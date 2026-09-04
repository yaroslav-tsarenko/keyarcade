import { cx } from "@/lib/cx";

/**
 * The deal chip. Coral is the store's one loud colour and it is spent here:
 * a discount is the only thing allowed to shout on a tile.
 */
export function PriceSticker({
  pct,
  size = "md",
  className,
}: {
  pct: number;
  /** Kept for call-site compatibility; the chip is no longer randomised. */
  slug?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  if (pct <= 0) return null;
  const dims = {
    sm: "px-1.5 py-0.5 text-[0.625rem]",
    md: "px-2 py-0.5 text-[0.6875rem]",
    lg: "px-2.5 py-1 text-sm",
  }[size];

  return (
    <span
      className={cx(
        "tnum inline-flex items-center rounded-chip bg-coral font-bold text-white lift-sm",
        dims,
        className,
      )}
    >
      −{pct}%<span className="sr-only"> off</span>
    </span>
  );
}
