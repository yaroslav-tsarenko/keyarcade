import { cx } from "@/lib/cx";

/**
 * Keyarcade mark — a console tile with a key cut out of it. The tile is the
 * store's whole visual premise (covers live in tiles), the key is what it
 * sells, and the pinhole at the top-right is the focus dot that travels the
 * interface.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cx("relative grid shrink-0 place-items-center", className)}>
      <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden focusable="false">
        <rect width="40" height="40" rx="11" fill="var(--signal)" />
        {/* The key: a bow, a shaft and two teeth — drawn from primitives so it
            stays crisp at favicon size. */}
        <g stroke="var(--on-signal)" strokeLinecap="round" fill="none">
          <circle cx="15.6" cy="16.2" r="5" strokeWidth="3.2" />
          <path d="M19.4 19.6 30.2 30.4" strokeWidth="3.2" />
          <path d="M26.6 26.8 24 29.4" strokeWidth="2.6" />
          <path d="M23.6 23.8 21 26.4" strokeWidth="2.6" />
        </g>
        {/* The focus dot that travels the interface. */}
        <circle cx="30.6" cy="10.2" r="2.2" fill="var(--on-signal)" opacity="0.55" />
      </svg>
    </span>
  );
}

export function Logo({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const tile = size === "lg" ? "size-11" : size === "sm" ? "size-8" : "size-9";
  const text = size === "lg" ? "text-[1.65rem]" : size === "sm" ? "text-lg" : "text-xl";

  return (
    <span className={cx("flex items-center gap-2.5", className)}>
      <LogoMark className={tile} />
      <span className={cx("font-display font-extrabold leading-none tracking-[-0.03em] text-ink", text)}>
        Keyarcade
      </span>
    </span>
  );
}
