"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Price } from "@/components/ui/Price";
import { Badge } from "@/components/ui/Badge";
import { cx } from "@/lib/cx";

interface Hit {
  slug: string;
  title: string;
  platform: string;
  price: number;
  wasPrice: number | null;
  image: string | null;
  hue: [string, string];
}

/**
 * The store's search combobox. Typing queries the live catalogue after a short
 * pause; results show a cover thumb, the platform chip and the price, so the
 * dropdown answers "is this the one?" without a page load.
 */
export function SearchBox({
  size = "md",
  autoFocus,
  className,
  onNavigate,
}: {
  size?: "md" | "lg";
  autoFocus?: boolean;
  className?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const listId = useId();
  const blurTimer = useRef<number | null>(null);

  const trimmed = useMemo(() => q.trim(), [q]);

  useEffect(() => {
    if (trimmed.length < 2) {
      setHits([]);
      setLoading(false);
      return;
    }
    // Debounced so a fast typist makes one request, not eight.
    setLoading(true);
    const ctrl = new AbortController();
    const id = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d: { results: Hit[] }) => {
          setHits(d.results ?? []);
          setActive(0);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      window.clearTimeout(id);
      ctrl.abort();
    };
  }, [trimmed]);

  function go(slug?: string) {
    setOpen(false);
    onNavigate?.();
    router.push(slug ? `/product/${slug}` : `/catalog?q=${encodeURIComponent(trimmed)}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") return setOpen(false);
    if (!open || hits.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && hits[active]) {
      e.preventDefault();
      go(hits[active].slug);
    }
  }

  const big = size === "lg";

  return (
    <div className={cx("relative", className)}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed) go();
        }}
        className={cx(
          "ring-focus ring-focus-flat glass flex items-center gap-2.5 rounded-chip transition-colors",
          big ? "h-13 px-5" : "h-11 px-4",
        )}
      >
        <Search
          width={big ? 20 : 18}
          height={big ? 20 : 18}
          className="shrink-0 text-ink-faint"
          aria-hidden
        />
        <input
          type="search"
          name="q"
          role="combobox"
          aria-expanded={open && hits.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-label="Search games and keys"
          aria-activedescendant={open && hits[active] ? `${listId}-${active}` : undefined}
          autoFocus={autoFocus}
          value={q}
          placeholder="Search games, DLC and gift cards"
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = window.setTimeout(() => setOpen(false), 130);
          }}
          onKeyDown={onKeyDown}
          className={cx(
            "w-full bg-transparent text-ink placeholder:text-ink-faint focus:outline-none",
            big ? "text-base" : "text-sm",
          )}
        />
        {loading ? (
          <span className="eyebrow shrink-0 text-ink-faint" role="status">
            …
          </span>
        ) : null}
      </form>

      {open && trimmed.length >= 2 ? (
        <div
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="glass-panel absolute z-50 mt-2 w-full overflow-hidden rounded-panel"
        >
          {hits.length === 0 ? (
            <p className="px-4 py-4 text-sm text-ink-muted">
              {loading ? "Searching…" : `Nothing matched “${trimmed}”.`}
            </p>
          ) : (
            <ul>
              {hits.map((h, i) => (
                <li
                  key={h.slug}
                  id={`${listId}-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (blurTimer.current) window.clearTimeout(blurTimer.current);
                    go(h.slug);
                  }}
                  className={cx(
                    "flex cursor-pointer items-center gap-3 px-3 py-2.5 transition-colors",
                    i === active && "bg-signal-tint",
                  )}
                >
                  <span
                    className="size-10 shrink-0 overflow-hidden rounded-[10px] bg-deck-sunk"
                    style={{ backgroundColor: h.hue?.[0] }}
                    aria-hidden
                  >
                    {h.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={h.image} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{h.title}</span>
                    <Badge className="mt-1">{h.platform}</Badge>
                  </span>
                  <Price eur={h.price} className="tnum shrink-0 text-sm font-bold text-ink" />
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
