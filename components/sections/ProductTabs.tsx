"use client";

import { useState } from "react";
import type { Game } from "@/lib/catalog-types";
import { ACTIVATION_STEPS } from "@/lib/catalog-types";

// Every panel below renders supplier data verbatim. Nothing is generated to
// fill a gap: a section with no data for this key is not offered as a tab.

function Facts({ game }: { game: Game }) {
  const rows: [string, string][] = [
    ["Platform", game.platform],
    ["Product type", game.kind],
    ["Activation region", game.regionNote || game.region],
    ["Edition", game.edition],
    ["Languages", game.languages.join(", ")],
    ["Developer", game.developers.join(", ")],
    ["Publisher", game.publishers.join(", ")],
    ["Release year", game.releaseYear ? String(game.releaseYear) : ""],
  ].filter((r): r is [string, string] => r[1] !== "");

  return (
    <dl className="glass grid gap-2 rounded-tile p-5 text-sm sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 border-b border-edge pb-2">
          <dt className="eyebrow">{k}</dt>
          <dd className="text-right font-medium text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ProductTabs({ game }: { game: Game }) {
  const tabs = [
    "Description",
    "Activation",
    ...(game.systemRequirements ? ["System requirements"] : []),
  ];
  const [tab, setTab] = useState(tabs[0]);

  return (
    <div>
      <div role="tablist" aria-label="Product details" className="flex flex-wrap gap-1.5 border-b border-edge pb-3">
        {tabs.map((t) => (
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
            <Facts game={game} />
            {game.description ? (
              game.description.split("\n\n").map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <p className="text-ink-muted">
                The publisher has not supplied a description for this title.
              </p>
            )}
          </div>
        )}

        {tab === "Activation" && (
          <div className="max-w-2xl space-y-4 text-[15px] leading-relaxed text-ink">
            {game.activationDetails ? (
              game.activationDetails.split("\n\n").map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <ol className="space-y-3">
                {ACTIVATION_STEPS.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-edge bg-chip font-display text-ink">
                      {i + 1}
                    </span>
                    <p className="pt-1">{s}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {tab === "System requirements" && (
          <div className="glass max-w-2xl whitespace-pre-line rounded-tile p-5 text-sm leading-relaxed text-ink">
            {game.systemRequirements}
          </div>
        )}
      </div>
    </div>
  );
}
