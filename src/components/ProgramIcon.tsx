import type { CSSProperties } from "react";
import { Anchor, Mountain, PawPrint, Tent, type LucideIcon } from "lucide-react";
import {
  useScoutTheme,
  PROGRAM_META,
  type Program,
} from "../lib/theme/ScoutThemeProvider";
import { cn } from "../lib/utils/cn";

/**
 * ProgramIcon renders a generic, trademark-safe symbol for each program.
 *
 * Unlike ProgramMark (which loads the official BSA brand mark from
 * /marks/), this component renders open-licensed icons from Lucide (ISC).
 * Use it for UI affordances where you need a quick visual cue for the
 * program but cannot or should not display the official mark: navigation,
 * filter chips, list rows, breadcrumbs, etc.
 *
 * Color
 * -----
 * These are line icons that inherit `currentColor`. Wrap in any text-* utility
 * (e.g. `text-program-primary`) to tint. Unlike ProgramMark, recoloring is
 * permitted because none of these are BSA trademarks.
 */

export const PROGRAM_ICONS: Record<Program, LucideIcon> = {
  cub: PawPrint,
  scoutsbsa: Tent,
  venturing: Mountain,
  seascouts: Anchor,
};

export type ProgramIconProps = {
  program?: Program;
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: CSSProperties;
  /** Override the default symbol for this program. */
  icon?: LucideIcon;
  /** Accessible label. Defaults to the program's label. Pass "" to mark decorative. */
  ariaLabel?: string;
};

export function ProgramIcon({
  program,
  size = 24,
  strokeWidth = 2,
  className,
  style,
  icon,
  ariaLabel,
}: ProgramIconProps) {
  const ctx = useScoutTheme();
  const active = program ?? ctx.program;
  const meta = PROGRAM_META[active];
  const IconComp = icon ?? PROGRAM_ICONS[active];
  const label = ariaLabel ?? meta.label;
  const decorative = label === "";

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

