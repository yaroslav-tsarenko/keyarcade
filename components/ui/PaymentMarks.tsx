/* eslint-disable @next/next/no-img-element */

// Colour Visa / Mastercard marks, used at checkout and in the footer.
// Real brand SVGs live in /public/payments (never greyscale).
const MARKS = [
  { src: "/payments/visa.svg", alt: "Visa" },
  { src: "/payments/mastercard.svg", alt: "Mastercard" },
];

export function PaymentMarks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {MARKS.map((m) => (
        <span
          key={m.alt}
          className="grid h-8 place-items-center rounded-control border border-edge bg-white px-2.5 lift-sm"
        >
          <img src={m.src} alt={m.alt} className="h-4 w-auto" />
        </span>
      ))}
    </div>
  );
}
