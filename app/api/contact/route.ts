import { NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/email";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, string> | null;
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Please fill in your name, email and message." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }

  try {
    await sendContactMessage(name, email, subject, message);
  } catch (e) {
    console.error("contact message failed:", e);
    return NextResponse.json({ error: "Couldn't send your message. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
