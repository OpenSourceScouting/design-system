import { forwardRef, type AnchorHTMLAttributes, type CSSProperties } from "react";

/**
 * MadeWithBadge: a drop-in "Made with Open Source Scouting" attribution badge.
 *
 * Unlike the themed components in this library, this badge is DELIBERATELY
 * self-contained:
 *
 *   - It uses inline styles and an inline SVG mark, so it renders correctly in
 *     ANY consumer app, even one that never imports this library's CSS or sets
 *     a `data-program` theme.
 *   - It hardcodes the Open Source Scouting brand colors (forest green + amber)
 *     rather than the program CSS variables, because it represents THIS project,
 *     not the consumer's active program theme.
 *
 * Use it to credit the design system in footers, about pages, and demos.
 */

export type MadeWithBadgeVariant = "light" | "dark";
export type MadeWithBadgeSize = "sm" | "md";

export type MadeWithBadgeProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  /** Link target. Defaults to the project repository. */
  href?: string;
  /** `light` for light backgrounds, `dark` for dark backgrounds. */
  variant?: MadeWithBadgeVariant;
  size?: MadeWithBadgeSize;
};

const GREEN = "#245235";
const AMBER = "#d0932b";
const PROJECT_URL = "https://github.com/opensourcescouting/design-system";

const SIZES: Record<
  MadeWithBadgeSize,
  { glyph: number; font: number; padY: number; padX: number }
> = {
  sm: { glyph: 16, font: 12, padY: 4, padX: 9 },
  md: { glyph: 20, font: 13, padY: 6, padX: 12 },
};

/**
 * The Open Source Scouting mark, drawn inline (compass + git-node graph).
 * `reversed` renders the compass in white for dark backgrounds, where the
 * forest-green compass would otherwise disappear. Amber nodes read on both.
 */
function Mark({ size, reversed = false }: { size: number; reversed?: boolean }) {
  const compass = reversed ? "#ffffff" : GREEN;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-hidden="true"
      style={{ flex: "0 0 auto" }}
    >
      <circle cx="16" cy="16" r="15" fill="none" stroke={compass} strokeWidth="2" />
      <path d="M16 1 L21 11 L31 16 L21 21 L16 31 L11 21 L1 16 L11 11 Z" fill={compass} />
      <circle cx="16" cy="16" r="8.5" fill="#ffffff" />
      <g stroke={AMBER} strokeWidth="1.6" strokeLinecap="round">
        <line x1="16" y1="11" x2="16" y2="18" />
        <line x1="16" y1="18" x2="20" y2="21" />
      </g>
      <g fill={AMBER}>
        <circle cx="16" cy="11" r="2" />
        <circle cx="16" cy="18" r="2" />
        <circle cx="20" cy="21" r="2" />
      </g>
    </svg>
  );
}

export const MadeWithBadge = forwardRef<HTMLAnchorElement, MadeWithBadgeProps>(
  function MadeWithBadge(
    { href = PROJECT_URL, variant = "light", size = "md", style, ...rest },
    ref,
  ) {
    const s = SIZES[size];
    const dark = variant === "dark";

    const base: CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      gap: s.glyph * 0.4,
      padding: `${s.padY}px ${s.padX}px`,
      borderRadius: 999,
      fontSize: s.font,
      lineHeight: 1,
      fontFamily: '"Montserrat Variable", ui-sans-serif, system-ui, sans-serif',
      textDecoration: "none",
      whiteSpace: "nowrap",
      border: `1px solid ${dark ? "rgba(255,255,255,0.18)" : "rgba(36,82,53,0.2)"}`,
      background: dark ? GREEN : "#ffffff",
      color: dark ? "rgba(255,255,255,0.85)" : "#4b5563",
      ...style,
    };

    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Made with Open Source Scouting"
        style={base}
        {...rest}
      >
        <Mark size={s.glyph} reversed={dark} />
        <span>
          Made with{" "}
          <span style={{ fontWeight: 600, color: dark ? "#ffffff" : GREEN }}>
            Open Source Scouting
          </span>
        </span>
      </a>
    );
  },
);
