import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, createSession } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";
import { COUNTRIES } from "@/lib/site-config";

const REQUIRED = [
  "email",
  "password",
  "firstName",
  "lastName",
  "phone",
  "birthDate",
  "street",
  "city",
  "country",
  "postalCode",
] as const;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, string> | null;
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  for (const field of REQUIRED) {
    if (!body[field]?.trim()) {
      return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
    }
  }

  const email = body.email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (body.password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }
  if (!COUNTRIES.some((c) => c.code === body.country)) {
    return NextResponse.json({ error: "We can't ship to the selected country" }, { status: 400 });
  }

  const sql = await db();
  const [exists] = await sql`SELECT id FROM users WHERE email = ${email}`;
  if (exists) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const [created] = (await sql`
    INSERT INTO users
      (email, password_hash, first_name, last_name, phone, birth_date, street, city, country, postal_code)
    VALUES (
      ${email},
      ${hashPassword(body.password)},
      ${body.firstName.trim()},
      ${body.lastName.trim()},
      ${body.phone.trim()},
      ${body.birthDate.trim()},
      ${body.street.trim()},
      ${body.city.trim()},
      ${body.country},
      ${body.postalCode.trim()}
    )
    RETURNING id
  `) as { id: number }[];

  await createSession(created.id);

  // Await the send so it actually completes before the (serverless) function
  // returns — a fire-and-forget promise can be dropped when the instance is
  // frozen right after the response, which is why confirmations never arrived.
  // Wrapped so a genuine SMTP failure still lets registration succeed.
  try {
    await sendWelcomeEmail(email, body.firstName.trim());
  } catch (e) {
    console.error("welcome email failed:", e);
  }

  return NextResponse.json({ ok: true });
}
