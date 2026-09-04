import type { Game } from "@/lib/mock-data";
import { cx } from "@/lib/cx";

/**
 * Cover art. Live Kinguin products carry a real image; anything without one
 * gets a locally-generated console-style cover built from the title's own hue
 * pair, so the grid never shifts and nothing is hotlinked.
 *
 * The base hue doubles as the tile's ambient tint — see `coverTint`.
 */

/** The colour a focused cover washes behind its rail. */
export function coverTint(game: Pick<Game, "hue">): string {
  return game.hue[0];
}

function seeded(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) & 0xffff;
  return () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff;
    return h / 0x7fffffff;
  };
}

export function PosterArt({
  game,
  className,
  priority: _priority,
}: {
  game: Game;
  className?: string;
  priority?: boolean;
}) {
  const [base, accent] = game.hue;

  if (game.image) {
    return (
      <div
        className={cx("relative overflow-hidden", className)}
        style={{ backgroundColor: base }}
        role="img"
        aria-label={`${game.title} cover art`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={game.image}
          alt={`${game.title} cover art`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const rnd = seeded(game.slug);
  const variant = Math.floor(rnd() * 4);
  const shift = 0.2 + rnd() * 0.6;
  // Wrap the title into at most two lines that fit the 300-unit box, and
  // shrink the face when a single word is very long.
  const words = game.title.toUpperCase().split(/\s+/);
  const lines: string[] = [];
  const MAX = 15;
  for (const w of words) {
    const last = lines[lines.length - 1];
    if (last && (last + " " + w).length <= MAX) lines[lines.length - 1] = last + " " + w;
    else if (lines.length < 2) lines.push(w.slice(0, MAX + 3));
  }
  const [line1, line2] = lines;
  const longest = Math.max(line1?.length ?? 0, line2?.length ?? 0);
  const size = longest > 12 ? 24 : longest > 9 ? 28 : 32;
  const gid = `cov-${game.slug}`;

  return (
    <svg
      viewBox="0 0 300 400"
      className={cx("block", className)}
      role="img"
      aria-label={`${game.title} cover art`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`${gid}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={base} />
          <stop offset="1" stopColor={accent} stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={`${gid}-scrim`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#05070c" stopOpacity="0" />
          <stop offset="1" stopColor="#05070c" stopOpacity="0.82" />
        </linearGradient>
        <clipPath id={`${gid}-clip`}>
          <rect width="300" height="400" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${gid}-clip)`}>
        <rect width="300" height="400" fill={`url(#${gid}-bg)`} />

        {/* One large calm shape per cover — a console dashboard is quiet. */}
        <g opacity="0.5" fill="#ffffff">
          {variant === 0 && <circle cx={90 + shift * 140} cy="150" r="118" />}
          {variant === 1 && (
            <path d={`M-20 ${300 + shift * 40} L${120 + shift * 90} 60 L340 400 Z`} />
          )}
          {variant === 2 && (
            <rect
              x={20 + shift * 90}
              y="40"
              width="210"
              height="210"
              rx="34"
              transform={`rotate(${-14 + shift * 26} 150 150)`}
            />
          )}
          {variant === 3 && (
            <>
              <circle cx={70 + shift * 60} cy="120" r="74" />
              <circle cx={200 + shift * 50} cy="215" r="52" opacity="0.7" />
            </>
          )}
        </g>

        <rect width="300" height="400" fill={`url(#${gid}-scrim)`} />

        <text
          x="22"
          y={line2 ? 334 : 358}
          fill="#ffffff"
          fontFamily="var(--font-manrope), system-ui, sans-serif"
          fontSize={size}
          fontWeight="800"
          letterSpacing="-0.9"
        >
          {line1}
        </text>
        {line2 ? (
          <text
            x="22"
            y="366"
            fill="#ffffff"
            fillOpacity="0.78"
            fontFamily="var(--font-manrope), system-ui, sans-serif"
            fontSize={size - 3}
            fontWeight="700"
            letterSpacing="-0.6"
          >
            {line2}
          </text>
        ) : null}
      </g>
    </svg>
  );
}
