import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { token?: string; password?: string }
    | null;
  if (!body?.token || !body?.password) {
    return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
  }
  if (body.password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const sql = await db();
  const [row] = (await sql`
    SELECT user_id, expires_at::text AS expires_at, used FROM password_resets WHERE token = ${body.token}
  `) as { user_id: number; expires_at: string; used: number }[];

  if (!row || row.used || new Date(row.expires_at) < new Date()) {
    return NextResponse.json({ error: "This reset link is invalid or expired" }, { status: 400 });
  }

  await sql`UPDATE users SET password_hash = ${hashPassword(body.password)} WHERE id = ${row.user_id}`;
  await sql`UPDATE password_resets SET used = 1 WHERE token = ${body.token}`;
  // Invalidate existing sessions after a password change.
  await sql`DELETE FROM sessions WHERE user_id = ${row.user_id}`;

  return NextResponse.json({ ok: true });
}
