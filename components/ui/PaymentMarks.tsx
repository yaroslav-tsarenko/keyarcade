/* eslint-disable @next/next/no-img-element */

// Colour Visa / Mastercard / 3-D Secure marks, used at checkout and in the footer.
// Real brand SVGs live in /public/payments (never greyscale). The 3DS shield is
// taller than it is wide, so it gets more height to read at the same weight.
const MARKS = [
  { src: "/payments/visa.svg", alt: "Visa", size: "h-4" },
  { src: "/payments/mastercard.svg", alt: "Mastercard", size: "h-4" },
  { src: "/payments/3d-secure.svg", alt: "3-D Secure", size: "h-7" },
];

export function PaymentMarks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {MARKS.map((m) => (
        <span
          key={m.alt}
          className="grid h-8 place-items-center rounded-control border border-edge bg-white px-2.5 lift-sm"
        >
          <img src={m.src} alt={m.alt} className={`${m.size} w-auto`} />
        </span>
      ))}
    </div>
  );
}
