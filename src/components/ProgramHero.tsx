import type { ReactNode } from "react";
import { Heading } from "./Heading";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { ProgramMark } from "./ProgramMark";
import { DecorativeBorder } from "./DecorativeBorder";
import { useScoutTheme, PROGRAM_META } from "../lib/theme/ScoutThemeProvider";
import { cn } from "../lib/utils/cn";

export type ProgramHeroProps = {
  eyebrow?: ReactNode;
  headline: ReactNode;
  /** Long-form lede paragraph. Set in body serif for readability. */
  lede?: ReactNode;
  primaryAction?: { label: string; onClick?: () => void; href?: string };
  secondaryAction?: { label: string; onClick?: () => void; href?: string };
  /** When true, the program tagline from PROGRAM_META is rendered under the headline. */
  showTagline?: boolean;
  /**
   * Override the decorative background watermark in the hero.
   *
   * - undefined (default): renders the built-in ProgramMark at mono/0.08 opacity,
   *   identical to the original behaviour.
   * - false: suppresses the watermark entirely (useful when the background
   *   image already contains a mark, or the consumer provides their own).
   * - ReactNode: renders the supplied node inside the same absolute-positioned,
   *   pointer-events-none wrapper so it occupies the same slot.
   */
  watermark?: ReactNode | false;
  className?: string;
};

export function ProgramHero({
  eyebrow,
  headline,
  lede,
  primaryAction,
  secondaryAction,
  showTagline = true,
  watermark,
  className,
}: ProgramHeroProps) {
  const { program } = useScoutTheme();
  const meta = PROGRAM_META[program];

  // Resolve which node (if any) to render in the watermark slot.
  // `false` means suppress; `undefined` means use the built-in ProgramMark.
  const watermarkNode =
    watermark === false
      ? null
      : watermark !== undefined
        ? watermark
        : (
            <ProgramMark variant="mono" size={420} />
          );

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-program",
        "bg-program-surface text-program-on-surface",
        "px-6 sm:px-10 lg:px-16 py-12 sm:py-16 lg:py-20",
        className,
      )}
    >
      {/* Deep watermark mark, purely decorative. Uses the `mono` variant so
          the opacity tint applies to a single licensed color rather than
          ghosting every official color simultaneously. */}
      {watermarkNode !== null && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 sm:-right-20 sm:-top-20 opacity-[0.08] text-program-primary"
        >
          {watermarkNode}
        </div>
      )}

      <div className="relative flex flex-col gap-8 max-w-3xl">
        <header className="flex items-center gap-3">
          <ProgramMark size={44} />
          <div className="flex flex-col">
            <span className="display text-xs uppercase tracking-[0.18em] text-program-on-surface-soft">
              {meta.label}
            </span>
            <span className="text-xs text-program-on-surface-soft">{meta.ageRange}</span>
          </div>
          {eyebrow ? (
            <Badge variant="accent" className="ml-3">
              {eyebrow}
            </Badge>
          ) : null}
        </header>

        <Heading level={1} size={1} className="text-balance">
          {headline}
        </Heading>

        {showTagline ? (
          <p className="display text-lg sm:text-xl text-program-primary">{meta.tagline}</p>
        ) : null}

        {lede ? (
          <p className="font-body text-base sm:text-lg leading-relaxed text-program-on-surface/85 max-w-2xl">
            {lede}
          </p>
        ) : null}

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap gap-3 pt-1">
            {primaryAction ? (
              <Button size="lg" variant="primary" onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            ) : null}
            {secondaryAction ? (
              <Button size="lg" variant="secondary" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            ) : null}
          </div>
        )}

        <DecorativeBorder className="mt-2 max-w-md" />
      </div>
    </section>
  );
}
