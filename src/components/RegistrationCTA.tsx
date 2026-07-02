import type { ReactNode } from "react";
import { Button } from "./Button";
import { Heading } from "./Heading";
import { ProgramMark } from "./ProgramMark";
import { useScoutTheme, PROGRAM_META } from "@/lib/theme/ScoutThemeProvider";
import { cn } from "@/lib/utils/cn";

export type RegistrationCTAProps = {
  headline?: ReactNode;
  body?: ReactNode;
  primaryLabel?: string;
  primaryHref?: string;
  onPrimaryClick?: () => void;
  className?: string;
};

export function RegistrationCTA({
  headline,
  body,
  primaryLabel = "Find a Unit Near You",
  primaryHref,
  onPrimaryClick,
  className,
}: RegistrationCTAProps) {
  const { program } = useScoutTheme();
  const meta = PROGRAM_META[program];

  const resolvedHeadline =
    headline ?? `Ready to join ${meta.label}?`;
  const resolvedBody = body ?? meta.platform;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-program",
        "bg-program-primary text-program-on-primary",
        "px-6 sm:px-10 py-10 sm:py-14",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute -right-8 -bottom-10 opacity-25">
        <ProgramMark variant="reversed" size={260} />
      </div>
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 max-w-4xl">
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
            onClick={
              primaryHref
                ? () => {
                    window.location.href = primaryHref;
                  }
                : onPrimaryClick
            }
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
