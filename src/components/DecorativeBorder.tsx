import { useScoutTheme, type Program } from "@/lib/theme/ScoutThemeProvider";
import { cn } from "@/lib/utils/cn";

export type DecorativeBorderProps = {
  program?: Program;
  className?: string;
};

/**
 * A program-specific horizontal divider. Each motif keys off the visual idiom
 * of its sub-brand without using any trademarked elements:
 *   cub:       dotted diamond rhythm (paw-print echo, playful)
 *   scoutsbsa: double rule with central pip (heritage typography rule)
 *   venturing: chevron arrows (expedition / mountain crossbar)
 *   seascouts: wave glyph (water/nautical)
 *
 * Renders inline SVG so it inherits `currentColor` from the program's decor
 * token. Decorative only: marked aria-hidden.
 */
export function DecorativeBorder({ program, className }: DecorativeBorderProps) {
  const ctx = useScoutTheme();
  const active = program ?? ctx.program;

  return (
    <div
      aria-hidden
      className={cn(
        "w-full h-4 flex items-center text-program-decor",
        className,
      )}
    >
      <svg viewBox="0 0 400 16" preserveAspectRatio="none" className="w-full h-full" fill="currentColor">
        {active === "cub" && (
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
        {active === "scoutsbsa" && (
          <g>
            <rect x={0} y={6} width={400} height={1} />
            <rect x={0} y={9} width={400} height={1} />
            <circle cx={200} cy={8} r={3} fill="rgb(var(--program-surface))" stroke="currentColor" strokeWidth={1} />
            <circle cx={200} cy={8} r={1.5} />
          </g>
        )}
        {active === "venturing" && (
          <g stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="square">
            {Array.from({ length: 16 }).map((_, i) => (
              <polyline key={i} points={`${i * 25 + 4},12 ${i * 25 + 12},4 ${i * 25 + 20},12`} />
            ))}
          </g>
        )}
        {active === "seascouts" && (
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
