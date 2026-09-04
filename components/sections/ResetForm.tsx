"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight } from "lucide-react";

export function ResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!token) {
    return (
      <p className="mt-6 rounded-control bg-signal/15 px-3 py-2 text-sm font-bold text-signal-deep">
        This reset link is missing its token. Request a new one from the sign-in page.
      </p>
    );
  }

  if (done) {
    return (
      <div className="mt-6">
        <p className="rounded-control bg-stock/15 px-3 py-2 text-sm font-bold text-stock">
          Password updated. You can sign in now.
        </p>
        <Link href="/auth" className="mt-4 inline-block font-bold text-ink underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setBusy(false);
    if (!res.ok) {
      setError((await res.json()).error ?? "Reset failed");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/auth"), 2000);
  }

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
      <div>
        <label htmlFor="pw" className="eyebrow mb-2 block">
          New password (min 8 characters)
        </label>
        <div className="flex items-center gap-2 rounded-control border border-edge bg-[var(--glass)] px-3 lift-sm">
          <Lock width={17} height={17} className="text-ink-muted" />
          <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" autoComplete="new-password"
            className="w-full bg-transparent py-2.5 text-sm font-medium outline-none" />
        </div>
      </div>
      {error && <p className="rounded-control bg-signal/15 px-3 py-2 text-sm font-bold text-signal-deep">{error}</p>}
      <button type="submit" disabled={busy || password.length < 8}
        className="flex items-center justify-center gap-2 rounded-control border border-edge bg-signal px-6 py-3.5 text-base font-semibold text-on-signal lift-md disabled:opacity-50">
        {busy ? "Saving…" : "Set new password"}
        <ArrowRight width={18} height={18} strokeWidth={3} />
      </button>
    </form>
  );
}
