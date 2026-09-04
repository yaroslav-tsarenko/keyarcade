"use client";

import { useState } from "react";
import type { Game } from "@/lib/mock-data";
import { ACTIVATION_STEPS, SYSTEM_REQS } from "@/lib/mock-data";

const TABS = ["Description", "Activation", "System requirements"] as const;
type Tab = (typeof TABS)[number];

function ReqTable({ title, reqs }: { title: string; reqs: Record<string, string> }) {
  return (
    <div className="glass rounded-tile p-5">
      <h4 className="font-display text-base font-bold text-ink">{title}</h4>
      <dl className="mt-3 flex flex-col gap-2 text-sm">
        {Object.entries(reqs).map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 border-b border-edge pb-2">
            <dt className="eyebrow">{k}</dt>
            <dd className="text-right font-medium text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ProductTabs({ game }: { game: Game }) {
  const [tab, setTab] = useState<Tab>("Description");

  return (
    <div>
      <div role="tablist" aria-label="Product details" className="flex flex-wrap gap-1.5 border-b border-edge pb-3">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`ring-focus ring-focus-flat rounded-chip px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t ? "bg-signal text-on-signal" : "text-ink-muted hover:bg-chip hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="pt-6">
        {tab === "Description" && (
          <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-ink">
            <p>
              {game.title} is a {game.genre.toLowerCase()} {game.kind === "DLC" ? "expansion" : "title"} for{" "}
              {game.platform}. {game.tagline} You buy a genuine {game.region} key, redeem it in your
              launcher, and the game is yours to keep.
            </p>
            <p>
              This listing is a demo. In a live store this space holds the publisher&apos;s
              description, screenshots and trailer. The key you buy here is delivered instantly and
              verified before it ships — no shared accounts, no re-sold codes.
            </p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {["Single-player campaign", "Cloud saves", "Controller support", "Steam achievements"].map((f) => (
                <li key={f} className="flex items-center gap-2 rounded-control border border-edge bg-[var(--glass)] px-3 py-2 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full bg-signal" /> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "Activation" && (
          <ol className="max-w-2xl space-y-3">
            {ACTIVATION_STEPS.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-edge bg-preorder-tint font-display text-ink">
                  {i + 1}
                </span>
                <p className="pt-1 text-[15px] text-ink">{s}</p>
              </li>
            ))}
          </ol>
        )}

        {tab === "System requirements" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <ReqTable title="Minimum" reqs={SYSTEM_REQS.minimum} />
            <ReqTable title="Recommended" reqs={SYSTEM_REQS.recommended} />
          </div>
        )}
      </div>
    </div>
  );
}
