import { useScoutTheme, type Program } from "../lib/theme/ScoutThemeProvider";
import { cn } from "../lib/utils/cn";

export type MotifName = "diamonds" | "rule" | "chevrons" | "wave";

export type DecorativeDividerProps = {
  program?: Program;
  /**
   * Force a specific decorative motif regardless of the active program theme.
   *
   * By default the motif is derived from the program: cub -> diamonds,
   * scoutsbsa -> rule, venturing -> chevrons, seascouts -> wave. Pass this
   * prop to pin a particular motif when the component is used outside its
   * natural program context (e.g. a neutral page section that still wants
   * branded decoration).
   *
   * Unrecognised programs also fall back to "rule" automatically; this prop
   * lets a consumer override that fallback.
   */
  motif?: MotifName;
  className?: string;
};

/**
 * A program-specific horizontal divider. Each motif keys off the visual idiom
 * of its sub-brand without using any trademarked elements:
 *   cub (diamonds):       dotted diamond rhythm (paw-print echo, playful)
 *   scoutsbsa (rule):     double rule with central pip (heritage typography rule)
 *   venturing (chevrons): chevron arrows (expedition / mountain crossbar)
 *   seascouts (wave):     wave glyph (water/nautical)
 *
 * Unknown or future programs default to the "rule" motif so the component
 * never renders nothing at runtime (even though the Program type union
 * prevents unknown values statically, consumers may cast or extend).
 *
 * Renders inline SVG so it inherits `currentColor` from the program's decor
 * token. Decorative only: marked aria-hidden.
 */
export function DecorativeDivider({ program, motif, className }: DecorativeDividerProps) {
  const ctx = useScoutTheme();
  const active = program ?? ctx.program;

  // Derive the motif from the program when not explicitly overridden.
  // Unknown programs fall back to "rule" (the Scouts BSA double-rule style)
  // so a graceful visual is always rendered.
  const resolvedMotif: MotifName =
    motif ??
    (active === "cub"
      ? "diamonds"
      : active === "scoutsbsa"
        ? "rule"
        : active === "venturing"
          ? "chevrons"
          : active === "seascouts"
            ? "wave"
            : "rule");

  return (
    <div aria-hidden className={cn("w-full h-4 flex items-center text-os-decor", className)}>
      <svg
        viewBox="0 0 400 16"
        preserveAspectRatio="none"
        className="w-full h-full"
        fill="currentColor"
      >
        {resolvedMotif === "diamonds" && (
          <g>
            {Array.from({ length: 20 }).map((_, i) => (
              <rect
                key={i}
                x={i * 20 + 6}
                y={4}
                width={8}
                height={8}
                transform={`rotate(45 ${i * 20 + 10} 8)`}
              />
            ))}
          </g>
        )}
        {resolvedMotif === "rule" && (
          <g>
            <rect x={0} y={6} width={400} height={1} />
            <rect x={0} y={9} width={400} height={1} />
            <circle
              cx={200}
              cy={8}
              r={3}
              fill="rgb(var(--background))"
              stroke="currentColor"
              strokeWidth={1}
            />
            <circle cx={200} cy={8} r={1.5} />
          </g>
        )}
        {resolvedMotif === "chevrons" && (
          <g stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="square">
            {Array.from({ length: 16 }).map((_, i) => (
              <polyline key={i} points={`${i * 25 + 4},12 ${i * 25 + 12},4 ${i * 25 + 20},12`} />
            ))}
          </g>
        )}
        {resolvedMotif === "wave" && (
          <path
            d={`M0 8 ${Array.from({ length: 20 })
              .map((_, i) => `Q ${i * 20 + 5} 0, ${i * 20 + 10} 8 T ${i * 20 + 20} 8`)
              .join(" ")}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          />
        )}
      </svg>
    </div>
  );
}
