import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Wallet, Package, KeyRound, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Price } from "@/components/ui/Price";
import { LogoutButton } from "@/components/sections/LogoutButton";
import { TopUp } from "@/components/sections/TopUp";
import { COUNTRIES } from "@/lib/site-config";

export const metadata: Metadata = { title: "Your account" };

interface OrderRow {
  id: string;
  total_eur: number;
  currency: string;
  status: string;
  created_at: string;
}
interface ItemRow {
  order_id: string;
  name: string;
  qty: number;
  game_key: string | null;
}
interface LedgerRow {
  kind: string;
  amount_eur: number;
  note: string | null;
  created_at: string;
}

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth");

  const sql = await db();
  const orders = (await sql`
    SELECT id, total_eur, currency, status, created_at::text AS created_at
    FROM orders WHERE user_id = ${user.id} ORDER BY created_at DESC
  `) as OrderRow[];
  const items = (await sql`
    SELECT oi.order_id, oi.name, oi.qty, oi.game_key
    FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE o.user_id = ${user.id}
  `) as ItemRow[];
  const ledger = (await sql`
    SELECT kind, amount_eur, note, created_at::text AS created_at
    FROM ledger WHERE user_id = ${user.id} ORDER BY created_at DESC
  `) as LedgerRow[];
  const countryName = COUNTRIES.find((c) => c.code === user.country)?.name ?? user.country;

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow inline-block">
            Your account
          </span>
          <h1 className="mt-2 text-stage text-ink">Hi, {user.first_name}</h1>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        <div className="rounded-tile border border-edge bg-[var(--glass)] p-5 lift-md">
          <span className="grid h-10 w-10 place-items-center rounded-control border border-edge bg-preorder-tint text-ink lift-sm">
            <Wallet width={20} height={20} strokeWidth={2.5} />
          </span>
          <p className="mt-3 eyebrow">Balance</p>
          <Price eur={user.balance_eur} className="text-3xl font-black text-ink" />
          <div className="mt-4 border-t border-edge pt-4">
            <TopUp />
          </div>
        </div>
        <div className="rounded-tile border border-edge bg-[var(--glass)] p-5 lift-md">
          <span className="grid h-10 w-10 place-items-center rounded-control border border-edge bg-stock text-ink-invert lift-sm">
            <Package width={20} height={20} strokeWidth={2.5} />
          </span>
          <p className="mt-3 eyebrow">Orders</p>
          <p className="text-3xl font-black text-ink">{orders.length}</p>
        </div>
        <div className="rounded-tile border border-edge bg-[var(--glass)] p-5 lift-md">
          <p className="eyebrow">Details</p>
          <p className="mt-1 text-sm font-semibold text-ink">{user.first_name} {user.last_name}</p>
          <p className="text-sm text-ink-muted">{user.email}</p>
          <p className="text-sm text-ink-muted">{user.phone}</p>
          <p className="text-sm text-ink-muted">{user.street}, {user.city}, {user.postal_code}, {countryName}</p>
        </div>
      </div>

      <h2 className="mt-12 text-rail text-ink">Order history</h2>
      {orders.length === 0 ? (
        <p className="mt-4 rounded-tile border border-edge bg-[var(--glass)] p-6 text-sm font-semibold text-ink-muted">
          No orders yet. Your purchased keys and invoices will appear here.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-tile border border-edge bg-[var(--glass)] p-5 lift-md">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-display text-xl text-ink">{o.id}</p>
                <span className="rounded-control chip border-transparent bg-stock-tint text-stock">
                  {o.status}
                </span>
                <p className="text-sm font-semibold text-ink-muted">{o.created_at.slice(0, 10)}</p>
                <Price eur={o.total_eur} className="text-xl font-black text-ink" />
              </div>
              <ul className="mt-3 flex flex-col gap-1.5 border-t border-edge pt-3">
                {items.filter((i) => i.order_id === o.id).map((i, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <KeyRound width={15} height={15} className="text-ink-muted" />
                    <span className="font-semibold text-ink">{i.name} ×{i.qty}</span>
                    {i.game_key && (
                      <code className="ml-auto rounded-control bg-[var(--glass)] px-2 py-0.5 font-mono text-xs font-bold text-signal-deep">
                        {i.game_key}
                      </code>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-12 text-rail text-ink">Transaction history</h2>
      {ledger.length === 0 ? (
        <p className="mt-4 rounded-tile border border-edge bg-[var(--glass)] p-6 text-sm font-semibold text-ink-muted">
          No transactions yet. Top-ups and purchases will be listed here.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {ledger.map((l, idx) => {
            const credit = l.amount_eur >= 0;
            return (
              <li
                key={idx}
                className="flex items-center gap-3 rounded-tile border border-edge bg-[var(--glass)] p-4 lift-sm"
              >
                {credit ? (
                  <ArrowDownCircle width={20} height={20} className="text-stock" strokeWidth={2.5} />
                ) : (
                  <ArrowUpCircle width={20} height={20} className="text-signal-deep" strokeWidth={2.5} />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">{l.note ?? (credit ? "Top-up" : "Purchase")}</p>
                  <p className="eyebrow">
                    {l.kind} · {l.created_at.slice(0, 10)}
                  </p>
                </div>
                <span className={`ml-auto font-body text-lg font-black tabular-nums ${credit ? "text-stock" : "text-signal-deep"}`}>
                  {credit ? "+" : "−"}
                  <Price eur={Math.abs(l.amount_eur)} />
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
