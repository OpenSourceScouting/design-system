import type { ReactNode } from "react";
import { Card, CardBody, CardFooter, CardEyebrow } from "./Card";
import { Heading } from "./Heading";
import { Button } from "./Button";
import { cn } from "@/lib/utils/cn";

export type EventCardProps = {
  date: Date;
  title: ReactNode;
  location?: ReactNode;
  description?: ReactNode;
  category?: string;
  cta?: { label: string; onClick?: () => void; href?: string };
  className?: string;
};

const MONTH_SHORT = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export function EventCard({ date, title, location, description, category, cta, className }: EventCardProps) {
  const month = MONTH_SHORT[date.getMonth()];
  const day = date.getDate();
  const weekday = date.toLocaleDateString(undefined, { weekday: "long" });
  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <Card variant="elevated" featured className={cn("group", className)}>
      <CardBody className="flex gap-5">
        {/* Date block: calendar-tear styling, themed per program. */}
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
          <Button size="sm" variant="primary" onClick={cta.onClick}>
            {cta.label}
          </Button>
        </CardFooter>
      ) : null}
    </Card>
  );
}
