import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { SITE } from "@/lib/site-config";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  // Always return ok — never reveal whether an email is registered.
  if (!email) return NextResponse.json({ ok: true });

  const sql = await db();
  const [user] = (await sql`SELECT id FROM users WHERE email = ${email}`) as { id: number }[];

  if (user) {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    await sql`INSERT INTO password_resets (token, user_id, expires_at) VALUES (${token}, ${user.id}, ${expires})`;
    const resetUrl = `${SITE.url}/auth/reset?token=${token}`;
    // Await so the send completes before the serverless function returns.
    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch (e) {
      console.error("reset email failed:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
