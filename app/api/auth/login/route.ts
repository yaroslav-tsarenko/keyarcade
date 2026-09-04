import { NextResponse } from "next/server";
import { db, type UserRow } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }
  const email = body.email.trim().toLowerCase();
  const sql = await db();
  const [user] = (await sql`SELECT * FROM users WHERE email = ${email}`) as UserRow[];
  if (!user || !verifyPassword(body.password, user.password_hash)) {
    return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
