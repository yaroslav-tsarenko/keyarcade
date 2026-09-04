import { Price } from "@/components/ui/Price";
import { cx } from "@/lib/cx";

/**
 * Price row. Numbers are tabular so a column of tiles lines up like a system
 * UI, and the old price sits after the current one rather than above it.
 * Prices are EUR-base; Price converts to the shopper's selected currency.
 */
export function PriceTag({
  price,
  wasPrice,
  size = "md",
  className,
}: {
  price: number;
  wasPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const now = { sm: "text-base", md: "text-xl", lg: "text-3xl md:text-4xl" }[size];
  const was = { sm: "text-xs", md: "text-sm", lg: "text-base" }[size];

  return (
    <div className={cx("flex items-baseline gap-2", className)}>
      <Price eur={price} className={cx("tnum font-display font-extrabold text-ink", now)} />
      {wasPrice && wasPrice > price ? (
        <Price
          eur={wasPrice}
          className={cx("tnum font-medium text-ink-faint line-through", was)}
        />
      ) : null}
    </div>
  );
}
