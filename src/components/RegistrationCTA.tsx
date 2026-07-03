import type { ReactNode } from "react";
import { Button } from "./Button";
import { Heading } from "./Heading";
import { ProgramMark } from "./ProgramMark";
import { useScoutTheme, PROGRAM_META } from "../lib/theme/ScoutThemeProvider";
import { cn } from "../lib/utils/cn";

export type RegistrationCTAProps = {
  headline?: ReactNode;
  body?: ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
  onPrimaryClick?: () => void;
  /**
   * Override the decorative background watermark in the CTA banner.
   *
   * - undefined (default): renders the built-in ProgramMark at reversed/0.25
   *   opacity, identical to the original behaviour.
   * - false: suppresses the watermark entirely.
   * - ReactNode: renders the supplied node inside the same absolute-positioned,
   *   pointer-events-none wrapper so it occupies the same slot.
   */
  watermark?: ReactNode | false;
  /**
   * SPA-friendly navigation handler for the primary button.
   *
   * When provided, this function is called with the resolved URL instead of
   * assigning to window.location.href directly. Pass your router's navigate
   * function (e.g. React Router's `useNavigate()` result) so hard reloads are
   * avoided in single-page apps.
   *
   * Defaults to `(url) => { window.location.href = url; }`.
   */
  navigate?: (url: string) => void;
  className?: string;
};

export function RegistrationCTA({
  headline,
  body,
  primaryLabel = "Find a Unit Near You",
  primaryHref,
  onPrimaryClick,
  watermark,
  navigate,
  className,
}: RegistrationCTAProps) {
  const { program } = useScoutTheme();
  const meta = PROGRAM_META[program];

  const resolvedHeadline =
    headline ?? `Ready to join ${meta.label}?`;
  const resolvedBody = body ?? meta.platform;

  // Resolve which node (if any) to render in the watermark slot.
  // `false` means suppress; `undefined` means use the built-in ProgramMark.
  // The fade lives on the mark itself, not the positioning wrapper: JPG marks
  // key out their solid background with mix-blend-mode, and opacity on an
  // ancestor creates an isolated stacking context that stops the blend from
  // reaching the banner, leaving the JPG's rectangle visible. Opacity on the
  // blended element itself composites correctly. Custom watermark nodes
  // control their own opacity.
  const watermarkNode =
    watermark === false
      ? null
      : watermark !== undefined
        ? watermark
        : (
            <ProgramMark variant="reversed" size={150} className="opacity-25" />
          );

  // Route primary-button navigation through the consumer's navigate function
  // when supplied, avoiding a hard reload in SPA contexts.
  const handlePrimaryClick = primaryHref
    ? () => {
        if (navigate) {
          navigate(primaryHref);
        } else {
          window.location.href = primaryHref;
        }
      }
    : onPrimaryClick;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-program",
        "bg-program-primary text-program-on-primary",
        "px-6 sm:px-10 py-10 sm:py-14",
        className,
      )}
    >
      {/* Fully inset and vertically centered, never bleeding off the edge:
          the BSA license forbids cropping real marks, and this slot
          auto-loads them when present. Centered with flex, NOT translate:
          a transform on this wrapper would create a stacking context and
          isolate the mark's mix-blend-mode from the banner, resurfacing the
          JPG's background rectangle (same failure mode as ancestor opacity). */}
      {watermarkNode !== null && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-8 md:right-12 hidden md:flex items-center"
        >
          {watermarkNode}
        </div>
      )}
      {/* When the watermark renders, the content row reserves its zone with
          right padding instead of a fixed max-width, so the button stops
          short of the mark at every viewport rather than overlapping it in
          the band where an unrelated width cap used to land on the mark. */}
      <div
        className={cn(
          "relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6",
          watermarkNode !== null ? "md:pr-44 lg:pr-52" : "max-w-4xl",
        )}
      >
        <div className="flex flex-col gap-3 max-w-xl">
          <Heading level={2} size={2} className="text-program-on-primary">
            {resolvedHeadline}
          </Heading>
          <p className="font-body text-base sm:text-lg leading-relaxed text-program-on-primary-soft">
            {resolvedBody}
          </p>
        </div>
        <div className="shrink-0">
          <Button
            variant="accent"
            size="lg"
            onClick={handlePrimaryClick}
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
