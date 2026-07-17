import { Anchor, Mountain, PawPrint, Tent, type LucideIcon } from "lucide-react";
import { useScoutTheme, PROGRAM_META, type Program } from "../lib/theme/ScoutThemeProvider";
import { Icon, type IconProps } from "./Icon";

/**
 * ProgramIcon renders a generic, trademark-safe symbol for each program.
 *
 * It is a preset built on top of {@link Icon}: it resolves the active program
 * to a Lucide glyph and delegates rendering, inheriting Icon's sizing, stroke,
 * color, and accessibility behavior. Use `Icon` directly for any other glyph.
 *
 * Unlike ProgramMark (which loads the official BSA brand mark from /marks/),
 * these are open-licensed Lucide icons (ISC). Use it for UI affordances that
 * need a quick program cue but cannot or should not show the official mark:
 * navigation, filter chips, list rows, breadcrumbs, etc.
 *
 * Color: line icons inherit `currentColor`; tint with any text-* utility (e.g.
 * `text-program-primary`). Unlike ProgramMark, recoloring is permitted because
 * none of these are BSA trademarks.
 */

export const PROGRAM_ICONS: Record<Program, LucideIcon> = {
  cub: PawPrint,
  scoutsbsa: Tent,
  venturing: Mountain,
  seascouts: Anchor,
};

// Inherits the shared Icon contract (size, strokeWidth, className, style) and
// adds the program-specific props. `ariaLabel` defaults to the program label,
// so ProgramIcon is meaningful by default (Icon is decorative by default).
export type ProgramIconProps = Omit<IconProps, "icon" | "label"> & {
  program?: Program;
  /** Override the default symbol for this program. */
  icon?: LucideIcon;
  /** Accessible label. Defaults to the program's label. Pass "" to mark decorative. */
  ariaLabel?: string;
};

export function ProgramIcon({ program, icon, ariaLabel, ...iconProps }: ProgramIconProps) {
  const ctx = useScoutTheme();
  const active = program ?? ctx.program;
  const glyph = icon ?? PROGRAM_ICONS[active];
  const label = ariaLabel ?? PROGRAM_META[active].label;
  return <Icon icon={glyph} label={label} {...iconProps} />;
}
