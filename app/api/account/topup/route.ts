import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

// Adds funds to the signed-in user's balance and records a ledger entry so the
// account history reflects both top-ups and spends.
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { amountEur?: number };
  const amount = Number(body.amountEur);
  if (!Number.isFinite(amount) || amount <= 0 || amount > 5000) {
    return NextResponse.json({ error: "Enter an amount between €1 and €5000." }, { status: 400 });
  }

  const sql = await db();
  const results = await sql.transaction([
    sql`UPDATE users SET balance_eur = balance_eur + ${amount} WHERE id = ${user.id}`,
    sql`INSERT INTO ledger (user_id, kind, amount_eur, note) VALUES (${user.id}, 'topup', ${amount}, 'Balance top-up')`,
    sql`SELECT balance_eur FROM users WHERE id = ${user.id}`,
  ]);
  const balanceEur = (results[2] as { balance_eur: number }[])[0].balance_eur;
  return NextResponse.json({ ok: true, balanceEur });
}
