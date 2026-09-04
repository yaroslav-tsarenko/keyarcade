import { CreditCard, MailCheck, Gamepad2 } from "lucide-react";
import { DELIVERY_STEPS } from "@/lib/mock-data";
import { SectionHeading } from "@/components/ui/SectionHeading";

const ICONS = [CreditCard, MailCheck, Gamepad2];

/**
 * Buy → key arrives → play. Rendered as three system notifications, because
 * that is literally what the middle step is.
 */
export function DeliverySteps() {
  return (
    <section className="mx-auto max-w-[1500px] px-4 md:px-6">
      <SectionHeading kicker="How it works" title="Three steps, about a minute" />
      <ol className="grid gap-4 md:grid-cols-3">
        {DELIVERY_STEPS.map((step, i) => {
          const Icon = ICONS[i] ?? CreditCard;
          return (
            <li key={step.title} className="glass flex gap-4 rounded-panel p-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-signal-tint text-signal-deep">
                <Icon width={20} height={20} aria-hidden />
              </span>
              <div>
                <p className="eyebrow tnum">Step {i + 1}</p>
                <h3 className="mt-1.5 font-display text-lg font-bold text-ink">{step.title}</h3>
                <p className="mt-1.5 text-sm text-pretty text-ink-muted">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
