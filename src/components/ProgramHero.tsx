import type { ReactNode } from "react";
import { Heading } from "./Heading";
import { Button, buttonVariants } from "./Button";
import { Badge } from "./Badge";
import { ProgramMark } from "./ProgramMark";
import { DecorativeDivider } from "./DecorativeDivider";
import { useScoutTheme, PROGRAM_META, resolveKnownProgram } from "../lib/theme/ScoutThemeProvider";
import { cn } from "../lib/utils/cn";

/**
 * A hero call-to-action. Provide `href` for navigation (renders a real anchor),
 * `onClick` for JS handlers, or both (anchor whose click also runs `onClick`,
 * e.g. for analytics). An action with neither still renders as a disabled-looking
 * button that does nothing, so always supply at least one.
 */
export type ProgramHeroAction = { label: string; onClick?: () => void; href?: string };

export type ProgramHeroProps = {
  eyebrow?: ReactNode;
  headline: ReactNode;
  /** Long-form lede paragraph. Set in body serif for readability. */
  lede?: ReactNode;
  primaryAction?: ProgramHeroAction;
  secondaryAction?: ProgramHeroAction;
  /**
   * When true, a program identity block (ProgramMark + program label + age
   * range, e.g. "Scouts BSA / Ages 11-17") is rendered above the headline.
   *
   * Defaults to `false`: most real consumers (a pack, council, or community
   * site) already establish their identity in their own masthead and do not
   * want the program's identity injected into their hero. Turn it on for
   * showcase/demo surfaces that exist to display per-program theming.
   */
  showProgramIdentity?: boolean;
  /**
   * When true, the program tagline from PROGRAM_META (e.g. "Be Prepared.") is
   * rendered under the headline. Defaults to `false` so a consumer's hero never
   * displays a Scouting America marketing slogan it did not explicitly ask for.
   */
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

/**
 * Renders a hero action. When `href` is present it renders a real anchor styled
 * as a button: correct semantics, works before hydration on prerendered pages,
 * and right/middle-click behave as links. `onClick`-only actions render a
 * <button>. When both are given the anchor still fires `onClick` (e.g. for
 * analytics) while the browser handles navigation. The className mirrors the
 * Button recipe via the shared `buttonVariants` so the two are visually identical.
 */
function HeroAction({
  action,
  variant,
}: {
  action: ProgramHeroAction;
  variant: "primary" | "secondary";
}) {
  if (action.href) {
    return (
      <a
        href={action.href}
        onClick={action.onClick}
        className={cn(buttonVariants({ variant, size: "lg" }))}
      >
        <span>{action.label}</span>
      </a>
    );
  }
  return (
    <Button size="lg" variant={variant} onClick={action.onClick}>
      {action.label}
    </Button>
  );
}

export function ProgramHero({
  eyebrow,
  headline,
  lede,
  primaryAction,
  secondaryAction,
  showProgramIdentity = false,
  showTagline = false,
  watermark,
  className,
}: ProgramHeroProps) {
  const { program } = useScoutTheme();
  const meta = PROGRAM_META[resolveKnownProgram(program)];

  // Resolve which node (if any) to render in the watermark slot.
  // `false` means suppress; `undefined` means use the built-in ProgramMark.
  const watermarkNode =
    watermark === false ? null : watermark !== undefined ? (
      watermark
    ) : (
      // Opacity sits on the mark, not the wrapper: ancestor opacity
      // isolates mix-blend-mode (used to key out JPG backgrounds) from
      // the surface behind it, which would leave the JPG's rectangle
      // visible. Custom watermark nodes control their own opacity.
      <ProgramMark variant="mono" size={280} className="opacity-[0.08]" />
    );

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-program",
        "bg-background text-foreground",
        "px-6 sm:px-10 lg:px-16 py-10 sm:py-12 lg:py-16",
        className,
      )}
    >
      {/* Deep watermark mark, purely decorative. Uses the `mono` variant so
          the opacity tint applies to a single licensed color rather than
          ghosting every official color simultaneously. Fully inset, never
          bleeding off the edge: the BSA license forbids cropping or
          truncating real marks (NOTICE.md), and this slot auto-loads real
          assets when they are present. Bleed treatments belong to our own
          motifs (DecorativeDivider), not the marks. */}
      {watermarkNode !== null && (
        <div
          aria-hidden
          className="pointer-events-none absolute right-6 top-6 sm:right-12 sm:top-12 text-primary"
        >
          {watermarkNode}
        </div>
      )}

      <div className="relative flex flex-col gap-8 max-w-3xl">
        {(showProgramIdentity || eyebrow) && (
          <header className="flex items-center gap-3">
            {showProgramIdentity ? (
              <>
                <ProgramMark size={44} />
                <div className="flex flex-col">
                  <span className="display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {meta.label}
                  </span>
                  <span className="text-xs text-muted-foreground">{meta.ageRange}</span>
                </div>
              </>
            ) : null}
            {eyebrow ? (
              <Badge variant="accent" className={showProgramIdentity ? "ml-3" : undefined}>
                {eyebrow}
              </Badge>
            ) : null}
          </header>
        )}

        <Heading level={1} size={1} className="text-balance">
          {headline}
        </Heading>

        {showTagline ? (
          <p className="display text-lg sm:text-xl text-primary">{meta.tagline}</p>
        ) : null}

        {lede ? (
          <p className="font-body text-base sm:text-lg leading-relaxed text-foreground/85 max-w-2xl">
            {lede}
          </p>
        ) : null}

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap gap-3 pt-1">
            {primaryAction ? <HeroAction action={primaryAction} variant="primary" /> : null}
            {secondaryAction ? <HeroAction action={secondaryAction} variant="secondary" /> : null}
          </div>
        )}

        <DecorativeDivider className="mt-2 max-w-md" />
      </div>
    </section>
  );
}
