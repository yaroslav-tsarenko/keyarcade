import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { orderKeys, isKinguinConfigured } from "@/lib/kinguin";
import { buildInvoice } from "@/lib/invoice";
import { sendOrderEmail } from "@/lib/email";
import { CURRENCIES, PURCHASE_LIMITS, lookupPromo, type CurrencyCode } from "@/lib/site-config";

interface CartItem {
  productId: string;
  name: string;
  qty: number;
  priceEur: number;
}

function makeOrderId(): string {
  return "BLK-" + randomBytes(4).toString("hex").toUpperCase();
}

// Fallback key generator for when Kinguin isn't wired to a funded account yet.
function demoKey(): string {
  const block = () => randomBytes(2).toString("hex").toUpperCase();
  return `${block()}-${block()}-${block()}-${block()}`;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        items?: CartItem[];
        email?: string;
        currency?: CurrencyCode;
        withdrawalWaived?: boolean;
        promoCode?: string | null;
      }
    | null;

  const items = body?.items ?? [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  // Consumer law lets us start delivery — and end the withdrawal right — only
  // on the buyer's express request, so no key is issued without it.
  if (body?.withdrawalWaived !== true) {
    return NextResponse.json(
      { error: "Please confirm you want delivery to start immediately" },
      { status: 400 },
    );
  }

  // Caps enforced server-side, not just in the UI: key products are a card
  // testing and cash-out target, so one order cannot clear stock at volume.
  const units = items.reduce((n, i) => n + i.qty, 0);
  const orderValue = items.reduce((s, i) => s + i.priceEur * i.qty, 0);
  if (
    items.some((i) => i.qty > PURCHASE_LIMITS.maxQtyPerItem) ||
    units > PURCHASE_LIMITS.maxItemsPerOrder ||
    orderValue > PURCHASE_LIMITS.maxOrderValueEur
  ) {
    return NextResponse.json({ error: "This order exceeds our purchase limits" }, { status: 400 });
  }

  const user = await getCurrentUser();
  const email = (user?.email ?? body?.email ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required for delivery" }, { status: 400 });
  }

  const currency: CurrencyCode = body?.currency && body.currency in CURRENCIES ? body.currency : "EUR";
  // Resolve the discount from the code server-side. An unknown or withdrawn
  // code simply yields no discount rather than failing the order.
  const promo = lookupPromo(body?.promoCode ?? "");
  const total = orderValue - (promo ? orderValue * promo.off : 0);
  const orderId = makeOrderId();

  // Issue keys: real Kinguin dispatch when configured, otherwise demo keys so
  // the end-to-end flow (order → email → invoice) works in development.
  const lines: { name: string; qty: number; key: string; productId: string; priceEur: number }[] = [];
  for (const item of items) {
    let key = "";
    if (isKinguinConfigured() && process.env.KINGUIN_LIVE_ORDERS === "true") {
      try {
        const res = await orderKeys(item.productId, item.qty, item.priceEur);
        key = res.keys.join(", ");
      } catch (e) {
        console.error("Kinguin order failed, falling back to demo key:", e);
        key = demoKey();
      }
    } else {
      key = demoKey();
    }
    lines.push({ ...item, key });
  }

  // Persist order atomically
  const sql = await db();
  const statements = [
    sql`INSERT INTO orders (id, user_id, email, total_eur, currency, status) VALUES (${orderId}, ${user?.id ?? null}, ${email}, ${total}, ${currency}, 'paid')`,
    ...lines.map(
      (l) =>
        sql`INSERT INTO order_items (order_id, product_id, name, qty, price_eur, game_key) VALUES (${orderId}, ${l.productId}, ${l.name}, ${l.qty}, ${l.priceEur}, ${l.key})`,
    ),
  ];
  if (user) {
    // Keep the wallet balance and the ledger in agreement: a purchase both
    // records a spend row and draws the same amount down from the balance.
    statements.push(
      sql`UPDATE users SET balance_eur = balance_eur - ${total} WHERE id = ${user.id}`,
      sql`INSERT INTO ledger (user_id, kind, amount_eur, note) VALUES (${user.id}, 'purchase', ${-total}, ${`Order ${orderId}`})`,
    );
  }
  await sql.transaction(statements);

  // Invoice + delivery email (non-blocking on email failure)
  try {
    const invoice = await buildInvoice({
      orderId,
      date: new Date().toISOString().slice(0, 10),
      customerEmail: email,
      customerName: user ? `${user.first_name} ${user.last_name}` : undefined,
      currency,
      items: items.map((i) => ({ name: i.name, qty: i.qty, priceEur: i.priceEur })),
      promo: promo ? { code: promo.code, amountEur: orderValue * promo.off } : undefined,
    });
    await sendOrderEmail(
      email,
      orderId,
      lines.map((l) => ({ name: l.name, qty: l.qty, key: l.key })),
      invoice,
    );
  } catch (e) {
    console.error("order email/invoice failed:", e);
  }

  return NextResponse.json({ ok: true, orderId, keys: lines.map((l) => ({ name: l.name, key: l.key })) });
}
