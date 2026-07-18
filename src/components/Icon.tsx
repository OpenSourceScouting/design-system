import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../lib/utils/cn";

/**
 * Icon is the general-purpose icon primitive for the design system. Pass any
 * Lucide icon component and it applies the system's sizing, stroke, color, and
 * accessibility conventions.
 *
 *   import { Rocket } from "lucide-react";
 *   <Icon icon={Rocket} />                       // decorative (aria-hidden)
 *   <Icon icon={Rocket} label="Launch" />        // meaningful (role="img")
 *
 * Lucide (ISC-licensed) is the recommended icon set for this library. It is
 * tree-shakeable, so a consumer only ships the glyphs they import. We do NOT
 * re-export the whole set: import icons directly from `lucide-react` and pass
 * them here for a consistent look.
 *
 * Color: Lucide icons inherit `currentColor`, so tint with any text-* utility
 * (e.g. `text-primary`).
 *
 * Accessibility: icons default to decorative (rendered `aria-hidden`), which is
 * correct when the icon sits next to a text label. Pass `label` only when the
 * icon is the sole conveyer of meaning (e.g. an icon-only button).
 *
 * ProgramIcon is a preset built on top of this component.
 */
export type IconProps = {
  /** Any Lucide icon component, e.g. `import { Rocket } from "lucide-react"`. */
  icon: LucideIcon;
  /** Pixel size for width and height. */
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  /**
   * Accessible label. Omit for decorative icons (`aria-hidden`). Provide a
   * string when the icon carries meaning on its own.
   */
  label?: string;
};

export function Icon({
  icon: IconComp,
  size = 24,
  strokeWidth = 2,
  className,
  style,
  label,
}: IconProps) {
  const decorative = label === undefined || label === "";
  return (
    <IconComp
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
      style={style}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
      role={decorative ? undefined : "img"}
    />
  );
}
