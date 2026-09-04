import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db, type UserRow } from "@/lib/db";

const SESSION_COOKIE = "blk_session";
const SESSION_DAYS = 30;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = scryptSync(password, salt, 64);
  const known = Buffer.from(hash, "hex");
  return test.length === known.length && timingSafeEqual(test, known);
}

export async function createSession(userId: number): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 864e5);
  const sql = await db();
  await sql`INSERT INTO sessions (token, user_id, expires_at) VALUES (${token}, ${userId}, ${expires.toISOString()})`;
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    const sql = await db();
    await sql`DELETE FROM sessions WHERE token = ${token}`;
    jar.delete(SESSION_COOKIE);
  }
}

export async function getCurrentUser(): Promise<UserRow | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const sql = await db();
  const [session] = (await sql`
    SELECT user_id, expires_at::text AS expires_at FROM sessions WHERE token = ${token}
  `) as { user_id: number; expires_at: string }[];
  if (!session) return null;
  if (new Date(session.expires_at) < new Date()) {
    await sql`DELETE FROM sessions WHERE token = ${token}`;
    return null;
  }
  const [user] = (await sql`SELECT * FROM users WHERE id = ${session.user_id}`) as UserRow[];
  return user ?? null;
}
