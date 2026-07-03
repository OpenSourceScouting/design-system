import type { ReactNode } from "react";
import { Card, CardBody, CardFooter, CardEyebrow } from "./Card";
import { Heading } from "./Heading";
import { Button } from "./Button";
import { cn } from "../lib/utils/cn";

export type EventCardProps = {
  date: Date;
  /** Optional end date; forwarded to `renderDateBlock` when provided. */
  endDate?: Date;
  title: ReactNode;
  location?: ReactNode;
  description?: ReactNode;
  category?: string;
  cta?: { label: string; onClick?: () => void; href?: string };
  className?: string;
  /**
   * Slot for replacing the calendar-tear date block on the left side of the
   * card. Receives the event `date` (and `endDate` when present) so custom
   * renderers can display ranges or alternative formats.
   *
   * When omitted the built-in month/day block is rendered, preserving the
   * existing visual output exactly.
   */
  renderDateBlock?: (date: Date, endDate?: Date) => ReactNode;
  /**
   * SPA-router navigation hook. When provided and the `cta` prop has an
   * `href`, clicking the CTA button calls this function instead of assigning
   * `window.location.href`, keeping the browser history stack intact.
   *
   * @example navigate={router.push}
   */
  navigate?: (url: string) => void;
};

const MONTH_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function EventCard({ date, endDate, title, location, description, category, cta, className, renderDateBlock, navigate }: EventCardProps) {
  const month = MONTH_SHORT[date.getMonth()];
  const day = date.getDate();
  const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  const dateBlock = renderDateBlock
    ? renderDateBlock(date, endDate)
    : (
        // Date block: calendar-tear styling, themed per program.
        <div
          aria-hidden
          className={cn(
            "shrink-0 w-16 sm:w-20 rounded-program overflow-hidden",
            "bg-program-primary text-program-on-primary flex flex-col items-center justify-center py-2",
            "border border-program-primary",
          )}
        >
          <span className="display text-[10px] uppercase tracking-[0.2em]">{month}</span>
          <span className="display text-3xl sm:text-4xl leading-none">{day}</span>
        </div>
      );

  // Resolve CTA click: prefer explicit onClick, then route href through the
  // optional SPA navigate hook, then fall back to a hard redirect.
  let ctaOnClick: (() => void) | undefined;
  if (cta) {
    if (cta.onClick) {
      ctaOnClick = cta.onClick;
    } else if (cta.href) {
      const href = cta.href;
      const nav = navigate ?? ((url: string) => { window.location.href = url; });
      ctaOnClick = () => nav(href);
    }
  }

  return (
    <Card variant="elevated" featured className={cn("group", className)}>
      <CardBody className="flex gap-5">
        {dateBlock}

        <div className="flex flex-col gap-2 min-w-0">
          {category ? <CardEyebrow>{category}</CardEyebrow> : null}
          <Heading level={3} size={4} className="leading-tight">
            {title}
          </Heading>
          <div className="text-xs text-program-on-surface-soft font-body">
            <span>{weekday}</span>
            <span aria-hidden> · </span>
            <span>{time}</span>
            {location ? (
              <>
                <span aria-hidden> · </span>
                <span>{location}</span>
              </>
            ) : null}
          </div>
          {description ? (
            <p className="font-body text-sm text-program-on-surface/80 leading-relaxed mt-1 line-clamp-3">
              {description}
            </p>
          ) : null}
        </div>
      </CardBody>
      {cta ? (
        <CardFooter className="flex justify-end">
          <Button size="sm" variant="primary" onClick={ctaOnClick}>
            {cta.label}
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
