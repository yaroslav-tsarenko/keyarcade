import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { orderKeys, isKinguinConfigured } from "@/lib/kinguin";
import { isSellable, resolveCheckoutLine } from "@/lib/catalog";
import { buildInvoice } from "@/lib/invoice";
import { sendOrderEmail } from "@/lib/email";
import { CURRENCIES, PURCHASE_LIMITS, lookupPromo, type CurrencyCode } from "@/lib/site-config";

// What the client posts. Only `productId` and `qty` are trusted; `name` and
// `priceEur` are display hints from the cart and are re-resolved server-side.
interface PostedCartItem {
  productId: string;
  name?: string;
  qty: number;
  priceEur?: number;
}

// A line as checkout charges it: name and price come from the live catalogue.
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
        items?: PostedCartItem[];
        email?: string;
        currency?: CurrencyCode;
        withdrawalWaived?: boolean;
        promoCode?: string | null;
      }
    | null;

  const cart = Array.isArray(body?.items) ? body.items : [];
  if (cart.length === 0) {
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

  // Quantities must be whole positive numbers: a negative or fractional qty
  // would turn the order total negative and credit the wallet.
  if (cart.some((i) => !Number.isInteger(i?.qty) || i.qty < 1)) {
    return NextResponse.json({ error: "Invalid item quantity" }, { status: 400 });
  }

  // The live catalogue is the only source of what we sell and at what price.
  // With no supplier configured (local dev/demo without Kinguin keys) the
  // storefront lists nothing, so there is nothing to price a line against —
  // fail closed rather than fall back to the client's numbers, so a missing
  // env var in production can never open the door to self-priced orders.
  if (!isKinguinConfigured()) {
    return NextResponse.json({ error: "Checkout is temporarily unavailable" }, { status: 503 });
  }

  // Every line is re-priced and re-named from the live product; the client's
  // `priceEur` and `name` are ignored. A line we cannot resolve fails the order.
  const resolved = await Promise.all(cart.map((i) => resolveCheckoutLine(String(i?.productId ?? ""))));
  if (resolved.some((r) => r === null)) {
    return NextResponse.json(
      { error: "One or more items in your cart are no longer available. Please remove them and try again." },
      { status: 400 },
    );
  }
  const items: CartItem[] = cart.map((i, n) => ({ ...resolved[n]!, qty: i.qty }));

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

  // Restricted (RU/BY/CIS/VPN-locked) keys are pulled from the storefront, but
  // a stale cart or an old direct link could still post one here.
  const sellable = await Promise.all(items.map((i) => isSellable(i.productId, i.name)));
  if (sellable.includes(false)) {
    return NextResponse.json(
      { error: "One or more items in your cart are no longer available. Please remove them and try again." },
      { status: 400 },
    );
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
