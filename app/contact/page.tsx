import type { Metadata } from "next";
import { Mail, MapPin, Building2, Clock } from "lucide-react";
import { COMPANY, POLICY, SITE } from "@/lib/site-config";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-[820px] px-4 py-12 md:px-6 md:py-16">
      <span className="eyebrow inline-block">
        Get in touch
      </span>
      <h1 className="mt-3 text-stage text-ink">Contact us</h1>
      <p className="mt-3 max-w-lg text-lg font-semibold text-ink-muted">
        Questions about an order or a key? Email us and we'll get back within one
        business day.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Row icon={Mail} label="Email">
          <a href={`mailto:${COMPANY.email}`} className="font-bold text-signal-deep underline">
            {COMPANY.email}
          </a>
        </Row>
        <Row icon={Clock} label="Support hours">{POLICY.supportHours}</Row>
        <Row icon={Building2} label="Legal entity">
          {COMPANY.legalName}
          <br />Reg. number {COMPANY.regNumber}
        </Row>
        <Row icon={MapPin} label="Registered address">{COMPANY.address}</Row>
      </div>

      <div className="mt-10">
        <ContactForm />
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        {SITE.name} is a trading name of {COMPANY.legalName}.
      </p>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-tile border border-edge bg-[var(--glass)] p-5 lift-sm">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-control border border-edge bg-preorder-tint text-ink lift-sm">
        <Icon width={20} height={20} strokeWidth={2.5} />
      </span>
      <div>
        <p className="eyebrow">{label}</p>
        <p className="mt-1 text-sm font-semibold text-ink">{children}</p>
      </div>
    </div>
  );
}
