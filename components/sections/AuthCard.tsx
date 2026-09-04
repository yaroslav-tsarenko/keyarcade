"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Phone, Calendar, MapPin, ArrowRight, ArrowLeft } from "lucide-react";
import { COUNTRIES } from "@/lib/site-config";

type Mode = "signin" | "create";

const STEPS = ["Account", "About you", "Address"];

interface Form {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

const EMPTY: Form = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  birthDate: "",
  street: "",
  city: "",
  country: "EE",
  postalCode: "",
};

export function AuthCard() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const creating = mode === "create";

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const dial = COUNTRIES.find((c) => c.code === form.country)?.dial ?? "";

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function stepValid(): boolean {
    if (step === 0) return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) && form.password.length >= 8;
    if (step === 1) return Boolean(form.firstName && form.lastName && form.phone && form.birthDate);
    return Boolean(form.street && form.city && form.country && form.postalCode);
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password }),
    });
    setBusy(false);
    if (!res.ok) {
      setError((await res.json()).error ?? "Sign in failed");
      return;
    }
    router.push("/account");
    router.refresh();
  }

  async function register(e: React.FormEvent) {
    e.preventDefault();
    if (!stepValid()) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    if (!agree) return;
    setError(null);
    setBusy(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (!res.ok) {
      setError((await res.json()).error ?? "Registration failed");
      return;
    }
    router.push("/account");
    router.refresh();
  }

  async function forgot() {
    setBusy(true);
    await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    setBusy(false);
    setForgotSent(true);
  }

  return (
    <div className="rounded-tile border border-edge bg-[var(--glass)] p-6 lift-lg md:p-8">
      <div className="grid grid-cols-2 gap-1.5 rounded-control border border-edge bg-[var(--glass)] p-1.5 lift-sm">
        {(["signin", "create"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setStep(0);
              setError(null);
            }}
            aria-pressed={mode === m}
            className={`rounded-control py-2.5 text-sm font-semibold transition-colors ${
              mode === m ? "bg-ink text-ink-invert" : "text-ink hover:bg-chip"
            }`}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      {creating ? (
        <>
          <div className="mt-6 flex items-center gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink text-xs font-black ${
                    i <= step ? "bg-signal text-ink-invert" : "bg-[var(--glass)] text-ink"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="hidden eyebrow sm:inline">
                  {label}
                </span>
                {i < STEPS.length - 1 && <span className="h-0.5 flex-1 bg-chip" />}
              </div>
            ))}
          </div>

          <h1 className="mt-5 text-rail text-ink">Join Keyarcade</h1>

          <form className="mt-5 flex flex-col gap-4" onSubmit={register}>
            {step === 0 && (
              <>
                <Field id="email" label="Email" icon={Mail} type="email" value={form.email}
                  onChange={(v) => set("email", v)} placeholder="you@example.com" autoComplete="email" />
                <Field id="password" label="Password (min 8 characters)" icon={Lock} type="password"
                  value={form.password} onChange={(v) => set("password", v)} placeholder="••••••••"
                  autoComplete="new-password" />
              </>
            )}

            {step === 1 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="firstName" label="First name" icon={User} value={form.firstName}
                    onChange={(v) => set("firstName", v)} autoComplete="given-name" />
                  <Field id="lastName" label="Last name" icon={User} value={form.lastName}
                    onChange={(v) => set("lastName", v)} autoComplete="family-name" />
                </div>
                <Field id="phone" label={`Phone (${dial})`} icon={Phone} type="tel" value={form.phone}
                  onChange={(v) => set("phone", v)} placeholder={`${dial} …`} autoComplete="tel" />
                <Field id="birthDate" label="Date of birth" icon={Calendar} type="date"
                  value={form.birthDate} onChange={(v) => set("birthDate", v)} />
              </>
            )}

            {step === 2 && (
              <>
                <Field id="street" label="Street address" icon={MapPin} value={form.street}
                  onChange={(v) => set("street", v)} autoComplete="street-address" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="city" label="City" icon={MapPin} value={form.city}
                    onChange={(v) => set("city", v)} autoComplete="address-level2" />
                  <Field id="postalCode" label="Postal code" icon={MapPin} value={form.postalCode}
                    onChange={(v) => set("postalCode", v)} autoComplete="postal-code" />
                </div>
                <div>
                  <label htmlFor="country" className="eyebrow mb-2 block">
                    Country
                  </label>
                  <select id="country" value={form.country} onChange={(e) => set("country", e.target.value)}
                    className="w-full rounded-control border border-edge bg-[var(--glass)] px-3 py-2.5 text-sm font-medium lift-sm outline-none">
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <label className="flex items-start gap-2.5 text-xs font-medium text-ink-muted">
                  <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[var(--signal)]" />
                  I read and agree to the{" "}
                  <Link href="/legal/terms" className="font-bold text-ink underline">terms and conditions</Link>.
                </label>
              </>
            )}

            {error && <p className="rounded-control bg-signal/15 px-3 py-2 text-sm font-bold text-signal-deep">{error}</p>}

            <div className="mt-1 flex gap-3">
              {step > 0 && (
                <button type="button" onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 rounded-control border border-edge bg-[var(--glass)] px-5 py-3.5 text-sm font-semibold lift-sm">
                  <ArrowLeft width={16} height={16} strokeWidth={3} /> Back
                </button>
              )}
              <button type="submit" disabled={!stepValid() || (step === STEPS.length - 1 && !agree) || busy}
                className="flex flex-1 items-center justify-center gap-2 rounded-control border border-edge bg-signal px-6 py-3.5 text-base font-semibold text-on-signal lift-sm transition-[filter] hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-50">
                {busy ? "Creating…" : step < STEPS.length - 1 ? "Continue" : "Create account"}
                <ArrowRight width={18} height={18} strokeWidth={3} />
              </button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h1 className="mt-6 text-rail text-ink">Welcome back</h1>
          <p className="mt-1 text-sm font-semibold text-ink-muted">Sign in to reach your keys and order history.</p>
          <form className="mt-6 flex flex-col gap-4" onSubmit={signIn}>
            <Field id="email" label="Email" icon={Mail} type="email" value={form.email}
              onChange={(v) => set("email", v)} placeholder="you@example.com" autoComplete="email" />
            <div>
              <Field id="password" label="Password" icon={Lock} type="password" value={form.password}
                onChange={(v) => set("password", v)} placeholder="••••••••" autoComplete="current-password" />
              <div className="mt-1.5 text-right">
                <button type="button" onClick={forgot} disabled={busy || !form.email}
                  className="text-sm font-semibold text-signal-deep underline-offset-2 hover:underline disabled:opacity-50">
                  Forgot password?
                </button>
              </div>
            </div>
            {forgotSent && (
              <p className="rounded-control bg-stock/15 px-3 py-2 text-sm font-bold text-stock">
                If that email is registered, a reset link is on its way.
              </p>
            )}
            {error && <p className="rounded-control bg-signal/15 px-3 py-2 text-sm font-bold text-signal-deep">{error}</p>}
            <button type="submit" disabled={busy}
              className="mt-1 flex items-center justify-center gap-2 rounded-control border border-edge bg-signal px-6 py-3.5 text-base font-semibold text-on-signal lift-sm transition-[filter] hover:brightness-[1.06] disabled:opacity-50">
              {busy ? "Signing in…" : "Sign in"}
              <ArrowRight width={18} height={18} strokeWidth={3} />
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  ...rest
}: {
  id: string;
  label: string;
  icon: typeof Mail;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-control border border-edge bg-[var(--glass)] px-3 lift-sm">
        <Icon width={17} height={17} className="text-ink-muted" />
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-2.5 text-sm font-medium outline-none placeholder:text-ink-muted/60"
          {...rest} />
      </div>
    </div>
  );
}
