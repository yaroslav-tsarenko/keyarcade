"use client";

import { useState } from "react";
import Link from "next/link";
import { Lock, Loader2, AlertCircle, Mail, KeyRound, CheckCircle2, ShoppingBag } from "lucide-react";
import { PosterArt } from "@/components/ui/PosterArt";
import { Price } from "@/components/ui/Price";
import { PaymentMarks } from "@/components/ui/PaymentMarks";
import { ButtonLink } from "@/components/ui/Button";
import { useCurrency } from "@/components/ui/CurrencyProvider";
import { useCart } from "@/components/ui/CartProvider";
import { COMPANY } from "@/lib/site-config";

interface IssuedKey {
  name: string;
  key: string;
}

export function CheckoutForm() {
  const { currency } = useCurrency();
  const { lines, subtotalEur, clear, ready } = useCart();
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ orderId: string; keys: IssuedKey[] } | null>(null);

  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const emailError = touched && !emailValid;

  const total = subtotalEur;

  async function placeOrder() {
    setTouched(true);
    setError(null);
    if (!emailValid || !agree || lines.length === 0) return;
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        currency,
        items: lines.map((l) => ({
          // slug is `name-<kinguinId>`; the trailing segment is the order id.
          productId: l.game.slug.split("-").pop() ?? l.game.slug,
          name: l.game.title,
          qty: l.qty,
          priceEur: l.game.price,
        })),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setError((await res.json()).error ?? "Order failed");
      return;
    }
    const data = await res.json();
    clear();
    setDone({ orderId: data.orderId, keys: data.keys });
  }

  // Nothing to pay for — steer the shopper back to the shelf instead of a
  // zero-total order.
  if (ready && lines.length === 0 && !done) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-tile border border-edge bg-preorder-tint lift-md">
          <ShoppingBag width={38} height={38} strokeWidth={2.5} />
        </div>
        <h2 className="mt-6 text-stage text-ink">Nothing to check out</h2>
        <p className="mx-auto mt-3 max-w-sm font-semibold text-ink-muted">
          Your cart is empty. Add a key to the counter and come back.
        </p>
        <div className="mt-7 flex justify-center">
          <ButtonLink href="/catalog" variant="signal" size="lg">
            Browse the shelf
          </ButtonLink>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl rounded-tile border border-edge bg-[var(--glass)] p-8 text-center lift-lg">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-edge bg-stock text-ink-invert lift-md">
          <CheckCircle2 width={32} height={32} strokeWidth={2.5} />
        </div>
        <h2 className="mt-5 text-rail text-ink">Order {done.orderId} confirmed</h2>
        <p className="mt-2 text-sm font-semibold text-ink-muted">
          Your keys are below and a confirmation with a PDF invoice is on its way to {email}.
        </p>
        <ul className="mt-6 flex flex-col gap-2 text-left">
          {done.keys.map((k, i) => (
            <li key={i} className="flex items-center gap-2 rounded-control border border-edge bg-[var(--glass)] p-3">
              <KeyRound width={16} height={16} className="text-ink-muted" />
              <span className="font-bold text-ink">{k.name}</span>
              <code className="ml-auto font-mono text-sm font-bold text-signal-deep">{k.key}</code>
            </li>
          ))}
        </ul>
        <Link href="/account" className="mt-6 inline-block rounded-control border border-edge bg-signal px-6 py-3 text-sm font-semibold text-on-signal lift-md">
          Go to your account
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-10">
      <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-2xl text-ink">1 · Where do we send the keys?</h2>
          <div className="mt-4 max-w-md">
            <label htmlFor="email" className="eyebrow mb-2 block">
              Email address
            </label>
            <div className={`flex items-center gap-2 rounded-control border-2 bg-[var(--glass)] px-3 lift-sm ${emailError ? "border-flame" : "border-ink"}`}>
              <Mail width={17} height={17} className={emailError ? "text-signal-deep" : "text-ink-muted"} />
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)} aria-invalid={emailError}
                placeholder="you@example.com"
                className="w-full bg-transparent py-2.5 text-sm font-medium outline-none placeholder:text-ink-muted/60" />
            </div>
            {emailError && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-signal-deep">
                <AlertCircle width={14} height={14} strokeWidth={2.5} />
                Enter a valid email so we can deliver your keys.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-2xl text-ink">2 · Payment</h2>
          <p className="mt-2 text-sm font-semibold text-ink-muted">
            Secure card payment. We accept Visa and Mastercard with PCI DSS compliant processing.
          </p>
          <PaymentMarks className="mt-3" />
          <div className="mt-4 grid max-w-lg gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="eyebrow mb-2 block">Card number</label>
              <input inputMode="numeric" placeholder="4242 4242 4242 4242" className="w-full rounded-control border border-edge bg-[var(--glass)] px-3 py-2.5 text-sm lift-sm outline-none" />
            </div>
            <div>
              <label className="eyebrow mb-2 block">Expiry</label>
              <input placeholder="12 / 28" className="w-full rounded-control border border-edge bg-[var(--glass)] px-3 py-2.5 text-sm lift-sm outline-none" />
            </div>
            <div>
              <label className="eyebrow mb-2 block">CVC</label>
              <input inputMode="numeric" placeholder="123" className="w-full rounded-control border border-edge bg-[var(--glass)] px-3 py-2.5 text-sm lift-sm outline-none" />
            </div>
          </div>
        </section>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-tile border border-edge bg-[var(--glass)] p-5 lift-lg">
          <h2 className="text-2xl text-ink">Your order</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {lines.map(({ game, qty }) => (
              <li key={game.slug} className="flex items-center gap-3">
                <div className="w-11 shrink-0 overflow-hidden rounded-control border border-edge bg-ink">
                  <div className="aspect-[3/4]"><PosterArt game={game} className="h-full w-full" /></div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">{game.title}</p>
                  <p className="text-xs font-semibold text-ink-muted">{game.platform} · Qty {qty}</p>
                </div>
                <Price eur={game.price * qty} className="font-body text-sm font-black tabular-nums" />
              </li>
            ))}
          </ul>

          <dl className="mt-4 flex flex-col gap-2 border-t border-edge pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Subtotal (incl. VAT)</dt>
              <dd><Price eur={total} className="font-bold tabular-nums" /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Delivery</dt>
              <dd className="font-bold text-stock">Instant · free</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-edge pt-4">
            <span className="text-xl text-ink">Total</span>
            <Price eur={total} className="font-display text-4xl text-ink" />
          </div>

          <label className="mt-4 flex items-start gap-2.5 text-xs font-medium text-ink-muted">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--signal)]" />
            I agree to the{" "}
            <Link href="/legal/terms" className="font-bold text-ink underline">terms</Link> and{" "}
            <Link href="/legal/refunds" className="font-bold text-ink underline">refund policy</Link>.
          </label>

          {error && <p className="mt-3 rounded-control bg-signal/15 px-3 py-2 text-sm font-bold text-signal-deep">{error}</p>}

          <button type="button" onClick={placeOrder} disabled={loading || !agree}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-control border border-edge bg-signal px-6 py-3.5 text-base font-semibold text-on-signal lift-sm transition-[filter] hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? (
              <><Loader2 width={18} height={18} strokeWidth={2.5} className="animate-spin" /> Placing order…</>
            ) : (
              <><Lock width={16} height={16} strokeWidth={2.5} /> Place order</>
            )}
          </button>

          <div className="mt-4 border-t border-edge pt-3 text-[11px] leading-relaxed text-ink-muted/80">
            <p className="font-bold text-ink-muted">Sold by {COMPANY.legalName}</p>
            <p>{COMPANY.address}</p>
            <p>Merchant of Record: {COMPANY.merchantOfRecord}</p>
          </div>

          <Link href="/cart" className="mt-3 block text-center text-sm font-semibold text-ink underline-offset-4 hover:underline">
            ← Back to cart
          </Link>
        </div>
      </div>
    </div>
  );
}
