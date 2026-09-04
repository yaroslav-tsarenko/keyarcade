"use client";

import { useEffect, useRef, useState } from "react";
import { PaymentMarks } from "@/components/ui/PaymentMarks";
import { POLICY } from "@/lib/site-config";

/**
 * Counts up numbers the store can actually prove: how many keys are live in
 * the catalogue right now, how many platforms they cover, and the refund
 * window from the policy. No order totals, no invented "happy customers".
 */
export function TrustBand({
  keysLive,
  platforms,
}: {
  keysLive: number;
  platforms: number;
}) {
  const stats = [
    { value: keysLive, suffix: "", label: "Keys live right now" },
    { value: platforms, suffix: "", label: "Platforms covered" },
    { value: POLICY.refundDays, suffix: "-day", label: "Refund window" },
    { value: 3, suffix: "", label: "Currencies at checkout" },
  ];

  return (
    <section className="border-y border-edge bg-deck-band py-12 md:py-14">
      <div className="mx-auto max-w-[1500px] px-4 md:px-6">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass rounded-panel p-5 text-center">
              <dt className="tnum font-display text-3xl font-extrabold text-signal-deep">
                <CountUp to={s.value} />
                {s.suffix}
              </dt>
              <dd className="mt-1.5 text-sm text-ink-muted">{s.label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <PaymentMarks />
          <span className="text-sm text-ink-muted">
            PCI DSS compliant processing · {POLICY.deliveryTime}
          </span>
        </div>
      </div>
    </section>
  );
}

/** Counts to the value once the element is on screen. Static under
 *  reduced motion, and static if IntersectionObserver is unavailable. */
function CountUp({ to, ms = 900 }: { to: number; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);

  useEffect(() => {
    const node = ref.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!node || reduced || typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / ms);
          // ease-out so the number settles rather than stopping dead
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        setN(0);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to, ms]);

  return <span ref={ref}>{n.toLocaleString("en-GB")}</span>;
}
