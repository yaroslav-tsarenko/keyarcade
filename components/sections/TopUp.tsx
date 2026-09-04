"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

const PRESETS = [10, 25, 50, 100];

export function TopUp() {
  const router = useRouter();
  const [amount, setAmount] = useState("25");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/account/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountEur: Number(amount) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Top-up failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Top-up failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setAmount(String(p))}
            className={`rounded-control border border-edge px-3 py-1.5 text-sm font-bold lift-sm transition-[filter] hover:brightness-[1.06] ${
              amount === String(p) ? "bg-ink text-ink-invert" : "bg-[var(--glass)] text-ink"
            }`}
          >
            €{p}
          </button>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-control border border-edge bg-[var(--glass)] px-3">
          <span className="font-bold text-ink-muted">€</span>
          <input
            type="number"
            min={1}
            max={5000}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent py-2 text-sm font-bold tabular-nums text-ink outline-none"
            aria-label="Top-up amount in euros"
          />
        </div>
        <button
          type="button"
          onClick={submit}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-control border border-edge bg-signal px-4 py-2 text-sm font-semibold text-on-signal lift-sm disabled:opacity-60"
        >
          <Plus width={16} height={16} strokeWidth={3} /> {busy ? "Adding…" : "Add funds"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs font-bold text-signal-deep">{error}</p>}
    </div>
  );
}
