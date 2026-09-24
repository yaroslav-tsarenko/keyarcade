import nodemailer from "nodemailer";
import { SITE, COMPANY } from "@/lib/site-config";

// SMTP transport — Spacemail on port 587 (STARTTLS). Configured via env.
let transporter: nodemailer.Transporter | null = null;

function getTransport(): nodemailer.Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true", // false => STARTTLS on 587
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

const FROM = process.env.MAIL_FROM ?? `${SITE.name} <${SITE.supportEmail}>`;

interface Mail {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: { filename: string; content: Buffer; contentType?: string }[];
}

export async function sendMail(mail: Mail): Promise<void> {
  await getTransport().sendMail({ from: FROM, ...mail });
}

export async function verifySmtp(): Promise<boolean> {
  try {
    await getTransport().verify();
    return true;
  } catch {
    return false;
  }
}

function shell(title: string, body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#ecdcbe;font-family:Arial,Helvetica,sans-serif;color:#191207">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#191207;color:#fbf4e4;padding:18px 22px;border-radius:6px 6px 0 0">
      <span style="font-size:22px;font-weight:800;letter-spacing:.5px">KEY<span style="color:#e8431e">ARCADE</span></span>
    </div>
    <div style="background:#f7ecd4;padding:26px 22px;border-radius:0 0 6px 6px;border:1px solid #e0cba3">
      <h1 style="margin:0 0 14px;font-size:20px">${title}</h1>
      ${body}
    </div>
    <p style="font-size:11px;color:#3a2f1e;margin:16px 4px 0;line-height:1.5">
      ${COMPANY.legalName} · Reg. ${COMPANY.regNumber} · ${COMPANY.address}<br/>
      Need help? <a href="mailto:${COMPANY.email}" style="color:#b8300f">${COMPANY.email}</a>
    </p>
  </div></body></html>`;
}

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#e8431e;color:#fbf4e4;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:4px">${label}</a>`;

export async function sendWelcomeEmail(to: string, firstName: string) {
  await sendMail({
    to,
    subject: `Welcome to ${SITE.name}`,
    html: shell(
      `Welcome, ${firstName}!`,
      `<p style="line-height:1.6">Your ${SITE.name} account is ready. You can now buy game keys, keep them in one library and track your orders.</p>
       <p style="margin:22px 0">${btn(`${SITE.url}/account`, "Go to your account")}</p>
       <p style="line-height:1.6;font-size:13px;color:#3a2f1e">If you didn't create this account, just ignore this email.</p>`,
    ),
    text: `Welcome to ${SITE.name}, ${firstName}! Your account is ready: ${SITE.url}/account`,
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await sendMail({
    to,
    subject: `Reset your ${SITE.name} password`,
    html: shell(
      "Reset your password",
      `<p style="line-height:1.6">We got a request to reset your password. This link expires in 60 minutes.</p>
       <p style="margin:22px 0">${btn(resetUrl, "Choose a new password")}</p>
       <p style="line-height:1.6;font-size:13px;color:#3a2f1e">Didn't ask for this? Your password stays the same — you can ignore this email.</p>`,
    ),
    text: `Reset your ${SITE.name} password: ${resetUrl} (expires in 60 minutes)`,
  });
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Contact-form message routed to the support inbox. replyTo is set to the
// sender so a support agent can reply straight to the customer.
export async function sendContactMessage(
  name: string,
  email: string,
  subject: string,
  message: string,
) {
  const safeSubject = subject.trim() || "New message";
  await getTransport().sendMail({
    from: FROM,
    to: COMPANY.email,
    replyTo: `${name} <${email}>`,
    subject: `[Contact] ${safeSubject}`,
    html: shell(
      "New contact message",
      `<table style="width:100%;border-collapse:collapse;margin:0 0 16px">
         <tr><td style="padding:6px 0;font-weight:700;width:90px">Name</td><td style="padding:6px 0">${esc(name)}</td></tr>
         <tr><td style="padding:6px 0;font-weight:700">Email</td><td style="padding:6px 0"><a href="mailto:${esc(email)}" style="color:#b8300f">${esc(email)}</a></td></tr>
         <tr><td style="padding:6px 0;font-weight:700">Subject</td><td style="padding:6px 0">${esc(safeSubject)}</td></tr>
       </table>
       <p style="line-height:1.6;white-space:pre-wrap;border-top:1px solid #e0cba3;padding-top:14px">${esc(message)}</p>`,
    ),
    text: `New contact message\n\nName: ${name}\nEmail: ${email}\nSubject: ${safeSubject}\n\n${message}`,
  });
}

export async function sendOrderEmail(
  to: string,
  orderId: string,
  lines: { name: string; qty: number; key: string }[],
  invoice: Buffer,
) {
  const rows = lines
    .map(
      (l) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #e0cba3">${l.name} ×${l.qty}</td>
         <td style="padding:8px 0;border-bottom:1px solid #e0cba3;font-family:monospace;font-weight:700">${l.key}</td></tr>`,
    )
    .join("");
  await sendMail({
    to,
    subject: `Your ${SITE.name} order ${orderId} — keys inside`,
    html: shell(
      "Your keys are ready",
      `<p style="line-height:1.6">Thanks for your order <strong>${orderId}</strong>. Your keys are below and your PDF invoice is attached.</p>
       <table style="width:100%;border-collapse:collapse;margin:16px 0">${rows}</table>
       <p style="line-height:1.6">Redeem each code in its matching launcher. Trouble activating? Reply to this email.</p>`,
    ),
    text: `Order ${orderId}\n${lines.map((l) => `${l.name} x${l.qty}: ${l.key}`).join("\n")}`,
    attachments: [
      { filename: `invoice-${orderId}.pdf`, content: invoice, contentType: "application/pdf" },
    ],
  });
}
