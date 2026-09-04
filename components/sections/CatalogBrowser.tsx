"use client";

import { useMemo, useState } from "react";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import type { Game, Platform, Genre, Region, ProductKind } from "@/lib/mock-data";
import { PLATFORMS, GENRES, REGIONS, KINDS } from "@/lib/mock-data";
import { ProductCard } from "@/components/ui/ProductCard";
import { useCurrency } from "@/components/ui/CurrencyProvider";

const SORTS = ["Featured", "Price: low to high", "Price: high to low", "Newest"] as const;
type Sort = (typeof SORTS)[number];
const STEP = 12;

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

interface FilterState {
  platforms: Set<Platform>;
  genres: Set<Genre>;
  regions: Set<Region>;
  kinds: Set<ProductKind>;
  maxPrice: number;
}

function CheckGroup<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: readonly T[];
  selected: Set<T>;
  onToggle: (v: T) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-edge py-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="text-lg text-ink">{title}</span>
        <ChevronDown width={18} height={18} strokeWidth={3} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul className="mt-3 flex flex-col gap-2">
          {options.map((o) => (
            <li key={o}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={selected.has(o)}
                  onChange={() => onToggle(o)}
                  className="h-4 w-4 shrink-0 accent-[var(--signal)]"
                />
                {o}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface FilterOptions {
  platforms: Platform[];
  genres: Genre[];
  regions: Region[];
  kinds: ProductKind[];
}

function Filters({
  state,
  setState,
  options,
  maxAvailable,
  onClear,
}: {
  state: FilterState;
  setState: (s: FilterState) => void;
  options: FilterOptions;
  maxAvailable: number;
  onClear: () => void;
}) {
  const { format } = useCurrency();
  return (
    <div>
      {options.platforms.length > 0 && (
        <CheckGroup title="Platform" options={options.platforms} selected={state.platforms} onToggle={(v) => setState({ ...state, platforms: toggle(state.platforms, v) })} />
      )}
      {options.genres.length > 0 && (
        <CheckGroup title="Genre" options={options.genres} selected={state.genres} onToggle={(v) => setState({ ...state, genres: toggle(state.genres, v) })} />
      )}
      {options.kinds.length > 0 && (
        <CheckGroup title="Type" options={options.kinds} selected={state.kinds} onToggle={(v) => setState({ ...state, kinds: toggle(state.kinds, v) })} />
      )}
      {options.regions.length > 0 && (
        <CheckGroup title="Region" options={options.regions} selected={state.regions} onToggle={(v) => setState({ ...state, regions: toggle(state.regions, v) })} />
      )}
      <div className="border-b border-edge py-3">
        <div className="flex items-center justify-between">
          <span className="text-lg text-ink">Price</span>
          <span className="text-sm font-bold tabular-nums text-ink-muted">≤ {format(state.maxPrice)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={maxAvailable}
          step={1}
          value={state.maxPrice}
          onChange={(e) => setState({ ...state, maxPrice: Number(e.target.value) })}
          className="mt-3 w-full accent-[var(--signal)]"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between text-xs font-bold text-ink-muted">
          <span>{format(0)}</span>
          <span>{format(maxAvailable)}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onClear}
        className="mt-4 w-full rounded-control border border-edge bg-[var(--glass)] px-3 py-2 text-sm font-semibold lift-sm"
      >
        Clear all
      </button>
    </div>
  );
}

export function CatalogBrowser({
  games,
  initialPlatform,
  initialKind,
  deals = false,
}: {
  games: Game[];
  initialPlatform?: Platform;
  initialKind?: ProductKind;
  deals?: boolean;
}) {
  const maxAvailable = useMemo(
    () => Math.max(10, Math.ceil(games.reduce((m, g) => Math.max(m, g.price), 0))),
    [games],
  );

  // Only offer filter values that actually match at least one in-stock title,
  // so a shopper never selects a facet (e.g. Platform → GOG) that returns zero
  // results. Options are derived live from the current catalog page.
  const options = useMemo<FilterOptions>(() => {
    const platforms = new Set<Platform>();
    const genres = new Set<Genre>();
    const regions = new Set<Region>();
    const kinds = new Set<ProductKind>();
    for (const g of games) {
      platforms.add(g.platform);
      genres.add(g.genre);
      regions.add(g.region);
      kinds.add(g.kind);
    }
    return {
      platforms: PLATFORMS.filter((p) => platforms.has(p)),
      genres: GENRES.filter((g) => genres.has(g)),
      regions: REGIONS.filter((r) => regions.has(r)),
      kinds: KINDS.filter((k) => kinds.has(k)),
    };
  }, [games]);

  const [state, setState] = useState<FilterState>({
    platforms: new Set(initialPlatform ? [initialPlatform] : []),
    genres: new Set(),
    regions: new Set(),
    kinds: new Set(initialKind ? [initialKind] : []),
    maxPrice: maxAvailable,
  });
  const [sort, setSort] = useState<Sort>(deals ? "Price: low to high" : "Featured");
  const [visible, setVisible] = useState(STEP);
  const [sheet, setSheet] = useState(false);

  const clear = () =>
    setState({ platforms: new Set(), genres: new Set(), regions: new Set(), kinds: new Set(), maxPrice: maxAvailable });

  const filtered = useMemo(() => {
    let list = games.filter((g) => {
      if (state.platforms.size && !state.platforms.has(g.platform)) return false;
      if (state.genres.size && !state.genres.has(g.genre)) return false;
      if (state.regions.size && !state.regions.has(g.region)) return false;
      if (state.kinds.size && !state.kinds.has(g.kind)) return false;
      if (g.price > state.maxPrice) return false;
      return true;
    });
    switch (sort) {
      case "Price: low to high":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "Price: high to low":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "Newest":
        list = [...list].sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      default:
        break;
    }
    return list;
  }, [games, state, sort]);

  const shown = filtered.slice(0, visible);

  const filterPanel = (
    <Filters state={state} setState={setState} options={options} maxAvailable={maxAvailable} onClear={clear} />
  );

  return (
    <>
      {/* mobile filter trigger */}
      <div className="mb-5 lg:hidden">
        <button
          type="button"
          onClick={() => setSheet(true)}
          className="inline-flex items-center gap-2 rounded-control border border-edge bg-ink px-4 py-2.5 text-sm font-semibold text-ink-invert lift-sm"
        >
          <SlidersHorizontal width={16} height={16} strokeWidth={2.5} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* desktop filter rail */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-28 rounded-tile border border-edge bg-[var(--glass)] p-4 lift-md">
            <div className="mb-1 flex items-center gap-2">
              <SlidersHorizontal width={18} height={18} strokeWidth={2.5} />
              <h2 className="text-xl text-ink">Filters</h2>
            </div>
            {filterPanel}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-ink-muted">{filtered.length} titles</p>
            <label className="flex items-center gap-2 rounded-control border border-edge bg-[var(--glass)] px-3 py-2 text-sm font-bold lift-sm">
              <span className="uppercase tracking-wide text-ink-muted">Sort</span>
              <span className="relative flex items-center">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="appearance-none bg-transparent pr-6 font-bold outline-none"
                  aria-label="Sort products"
                >
                  {SORTS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown width={16} height={16} strokeWidth={3} className="pointer-events-none absolute right-0" />
              </span>
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-tile border border-edge bg-[var(--glass)] p-8 text-center font-semibold text-ink-muted lift-md">
              No keys match these filters. Loosen a filter or clear them all.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
                {shown.map((g, i) => (
                  <ProductCard key={`${g.slug}-${i}`} game={g} />
                ))}
              </div>
              {visible < filtered.length && (
                <div className="mt-12 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + STEP)}
                    className="rounded-control border border-edge bg-ink px-8 py-3.5 text-base font-semibold text-ink-invert lift-sm transition-[filter] hover:brightness-[1.06] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    Load more keys
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* mobile bottom sheet */}
      {sheet && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button aria-label="Close filters" onClick={() => setSheet(false)} className="absolute inset-0 bg-[color-mix(in_oklab,var(--deck-sunk)_70%,transparent)]" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[10px] border-t-[3px] border-ink bg-deck p-5">
            <div className="sticky -top-5 -mx-5 -mt-5 mb-2 flex items-center justify-between border-b-2 border-ink bg-deck px-5 py-3">
              <h2 className="text-2xl text-ink">Filters</h2>
              <button
                type="button"
                onClick={() => setSheet(false)}
                aria-label="Close filters"
                className="grid h-10 w-10 place-items-center rounded-control border border-edge bg-[var(--glass)] lift-sm"
              >
                <X strokeWidth={2.5} />
              </button>
            </div>
            {filterPanel}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={clear}
                className="flex-1 rounded-control border border-edge bg-[var(--glass)] px-3 py-3 text-sm font-semibold lift-sm"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setSheet(false)}
                className="flex-[2] rounded-control border border-edge bg-signal px-3 py-3 text-sm font-semibold text-ink-invert lift-md"
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
