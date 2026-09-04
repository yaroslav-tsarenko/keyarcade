"use client";

import { useState } from "react";
import { Mail, User, Tag, Send, CheckCircle2 } from "lucide-react";

interface Form {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY: Form = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const valid =
    Boolean(form.name.trim()) &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email) &&
    Boolean(form.message.trim());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setError(null);
    setBusy(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setBusy(false);
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error ?? "Something went wrong. Please try again.");
      return;
    }
    setSent(true);
    setForm(EMPTY);
  }

  if (sent) {
    return (
      <div className="rounded-tile border border-edge bg-[var(--glass)] p-6 text-center lift-md md:p-8">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-edge bg-stock/20 text-stock">
          <CheckCircle2 width={26} height={26} strokeWidth={2.5} />
        </span>
        <h3 className="mt-4 text-rail text-ink">Message sent</h3>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          Thanks for reaching out — we'll reply within one business day.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-5 rounded-control border border-edge bg-[var(--glass)] px-5 py-2.5 text-sm font-semibold lift-sm"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-tile border border-edge bg-[var(--glass)] p-6 lift-md md:p-8">
      <h2 className="text-rail text-ink">Send us a message</h2>
      <p className="mt-1 text-sm font-semibold text-ink-muted">
        Fill in the form and your message lands straight in our support inbox.
      </p>
      <form className="mt-6 flex flex-col gap-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="name" label="Your name" icon={User} value={form.name}
            onChange={(v) => set("name", v)} autoComplete="name" placeholder="Jane Doe" />
          <Field id="email" label="Email" icon={Mail} type="email" value={form.email}
            onChange={(v) => set("email", v)} autoComplete="email" placeholder="you@example.com" />
        </div>
        <Field id="subject" label="Subject (optional)" icon={Tag} value={form.subject}
          onChange={(v) => set("subject", v)} placeholder="What's this about?" />
        <div>
          <label htmlFor="message" className="eyebrow mb-2 block">
            Message
          </label>
          <textarea
            id="message"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            rows={5}
            maxLength={5000}
            placeholder="Tell us how we can help…"
            className="w-full rounded-control border border-edge bg-[var(--glass)] px-3 py-2.5 text-sm font-medium lift-sm outline-none placeholder:text-ink-muted/60"
          />
        </div>

        {error && <p className="rounded-control bg-signal/15 px-3 py-2 text-sm font-bold text-signal-deep">{error}</p>}

        <button type="submit" disabled={!valid || busy}
          className="mt-1 flex items-center justify-center gap-2 rounded-control border border-edge bg-signal px-6 py-3.5 text-base font-semibold text-on-signal lift-sm transition-[filter] hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? "Sending…" : "Send message"}
          <Send width={18} height={18} strokeWidth={2.5} />
        </button>
      </form>
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
