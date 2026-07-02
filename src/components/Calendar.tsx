import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Heading } from "./Heading";
import { DecorativeBorder } from "./DecorativeBorder";
import {
  addDays,
  addMonths,
  compareDays,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

export type CalendarEvent = {
  id: string;
  date: Date;
  /** Inclusive end. Omit for single-day events. */
  endDate?: Date;
  title: string;
  category?: string;
  location?: string;
  description?: ReactNode;
  /** When true, this event is the marquee/lead item and gets promoted styling in the agenda view. */
  featured?: boolean;
  /** Optional rich-detail fields surfaced by EventDialog. Calendar itself ignores these. */
  cost?: string;
  capacity?: string;
  registrationDeadline?: Date;
  organizer?: string;
  registrationUrl?: string;
};

export type CalendarView = "month" | "agenda";

export type CalendarProps = {
  events: CalendarEvent[];
  /** Initial view. Defaults to "agenda": the more common scouting question is "what's next?". */
  defaultView?: CalendarView;
  /** Initial month (any date in the month). Defaults to today. */
  defaultMonth?: Date;
  /** Cap on chips per day cell in month view; overflow surfaces as "+N more". */
  maxEventsPerDay?: number;
  /** Agenda window in days. Defaults to 60. */
  agendaDays?: number;
  /** 0 = Sunday, 1 = Monday. Defaults to 0 (US convention). */
  weekStartsOn?: 0 | 1;
  onEventClick?: (event: CalendarEvent) => void;
  onDayClick?: (date: Date) => void;
  className?: string;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_SHORT = ["S", "M", "T", "W", "T", "F", "S"];

function rotate<T>(arr: T[], n: number): T[] {
  return [...arr.slice(n), ...arr.slice(0, n)];
}

/**
 * True below Tailwind's `sm` breakpoint (640px). The month grid needs ~88px
 * per column; under 640px the cells crush event chips into unreadable slivers,
 * so the calendar falls back to the agenda view on narrow viewports.
 * Starts false so SSR and the first client render agree; the effect corrects
 * it before paint matters.
 */
function useIsNarrowViewport(): boolean {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setNarrow(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return narrow;
}

function eventsOnDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
  const target = startOfDay(day).getTime();
  return events.filter((e) => {
    const start = startOfDay(e.date).getTime();
    const end = startOfDay(e.endDate ?? e.date).getTime();
    return target >= start && target <= end;
  });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatDateRange(start: Date, end?: Date): string {
  if (!end || isSameDay(start, end)) {
    return start.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  }
  const sameMonth = isSameMonth(start, end);
  const startStr = start.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const endStr = end.toLocaleDateString(undefined, {
    month: sameMonth ? undefined : "short",
    day: "numeric",
  });
  return `${startStr} – ${endStr}`;
}

export function Calendar({
  events,
  defaultView = "agenda",
  defaultMonth,
  maxEventsPerDay = 3,
  agendaDays = 60,
  weekStartsOn = 0,
  onEventClick,
  onDayClick,
  className,
}: CalendarProps) {
  const [view, setView] = useState<CalendarView>(defaultView);
  const [cursor, setCursor] = useState<Date>(() => startOfMonth(defaultMonth ?? new Date()));
  const narrow = useIsNarrowViewport();
  // The chosen view is preserved; narrow viewports just render agenda instead
  // of an unusable month grid, and the original choice returns on resize.
  const effectiveView = narrow ? "agenda" : view;

  const today = useMemo(() => startOfDay(new Date()), []);
  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => compareDays(a.date, b.date) || a.date.getTime() - b.date.getTime()),
    [events],
  );

  return (
    <section
      className={cn(
        "rounded-program border border-program-border/60 bg-program-surface overflow-hidden",
        className,
      )}
      aria-label="Calendar"
    >
      <CalendarHeader
        view={effectiveView}
        onViewChange={setView}
        cursor={cursor}
        onCursorChange={setCursor}
        showNav={effectiveView === "month"}
        showToggle={!narrow}
      />

      {effectiveView === "month" ? (
        <MonthGrid
          month={cursor}
          today={today}
          events={sortedEvents}
          maxEventsPerDay={maxEventsPerDay}
          weekStartsOn={weekStartsOn}
          onEventClick={onEventClick}
          onDayClick={onDayClick}
        />
      ) : (
        <AgendaList
          events={sortedEvents}
          from={today}
          days={agendaDays}
          onEventClick={onEventClick}
        />
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Header                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

function CalendarHeader({
  view,
  onViewChange,
  cursor,
  onCursorChange,
  showNav,
  showToggle,
}: {
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
  cursor: Date;
  onCursorChange: (d: Date) => void;
  showNav: boolean;
  showToggle: boolean;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-program-border/50 bg-program-surface-muted/40">
      <div className="flex items-center gap-2">
        {showNav && (
          <>
            <IconButton
              label="Previous month"
              onClick={() => onCursorChange(addMonths(cursor, -1))}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              label="Next month"
              onClick={() => onCursorChange(addMonths(cursor, 1))}
            >
              <ChevronRight />
            </IconButton>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCursorChange(startOfMonth(new Date()))}
            >
              Today
            </Button>
          </>
        )}
        <Heading level={3} size={5} className="ml-1">
          {showNav
            ? `${MONTH_NAMES[cursor.getMonth()]} ${cursor.getFullYear()}`
            : "Upcoming"}
        </Heading>
      </div>

      {showToggle && <ViewToggle view={view} onChange={onViewChange} />}
    </header>
  );
}

function ViewToggle({ view, onChange }: { view: CalendarView; onChange: (v: CalendarView) => void }) {
  const id = useId();
  const options: { value: CalendarView; label: string }[] = [
    { value: "agenda", label: "Agenda" },
    { value: "month", label: "Month" },
  ];
  return (
    <div
      role="radiogroup"
      aria-labelledby={`${id}-label`}
      className="inline-flex items-center rounded-program border border-program-border/60 p-0.5 bg-program-surface"
    >
      <span id={`${id}-label`} className="sr-only">Calendar view</span>
      {options.map((opt) => {
        const active = view === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "display text-xs uppercase tracking-wider px-3 py-1.5 rounded-program transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-ring",
              active
                ? "bg-program-primary text-program-on-primary"
                : "bg-transparent text-program-on-surface-soft hover:text-program-on-surface",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "h-9 w-9 grid place-items-center rounded-program",
        "text-program-on-surface/80 hover:text-program-on-surface hover:bg-program-surface-muted",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-ring",
      )}
    >
      {children}
    </button>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Month view                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

function MonthGrid({
  month,
  today,
  events,
  maxEventsPerDay,
  weekStartsOn,
  onEventClick,
  onDayClick,
}: {
  month: Date;
  today: Date;
  events: CalendarEvent[];
  maxEventsPerDay: number;
  weekStartsOn: 0 | 1;
  onEventClick?: (event: CalendarEvent) => void;
  onDayClick?: (date: Date) => void;
}) {
  const firstCell = startOfWeek(startOfMonth(month), weekStartsOn);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(firstCell, i));
  const weekdayLabels = rotate(WEEKDAY_SHORT, weekStartsOn);
  const weekdayLong = rotate(WEEKDAY_LONG, weekStartsOn);

  return (
    <div className="p-2 sm:p-3">
      <div role="grid" aria-label={`${MONTH_NAMES[month.getMonth()]} ${month.getFullYear()}`}>
        <div role="row" className="grid grid-cols-7 mb-1">
          {weekdayLabels.map((d, i) => (
            <div
              key={i}
              role="columnheader"
              aria-label={weekdayLong[i]}
              className="display text-[10px] uppercase tracking-[0.18em] text-program-on-surface-soft text-center py-1.5"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            const inMonth = isSameMonth(day, month);
            const isToday = isSameDay(day, today);
            const dayEvents = eventsOnDay(events, day);
            const visible = dayEvents.slice(0, maxEventsPerDay);
            const overflow = dayEvents.length - visible.length;

            return (
              <div
                key={i}
                role="gridcell"
                aria-label={day.toLocaleDateString(undefined, {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
                className={cn(
                  "min-h-[88px] sm:min-h-[112px] rounded-program p-1.5 flex flex-col gap-1",
                  "border border-program-border/40",
                  inMonth ? "bg-program-surface" : "bg-program-surface-muted/30",
                  onDayClick && "cursor-pointer hover:border-program-primary/60",
                )}
                onClick={onDayClick ? () => onDayClick(day) : undefined}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "display text-xs leading-none h-6 min-w-6 px-1.5 rounded-program grid place-items-center",
                      !inMonth && "text-program-on-surface-faint",
                      inMonth && !isToday && "text-program-on-surface/80",
                      isToday && "bg-program-primary text-program-on-primary",
                    )}
                  >
                    {day.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="sr-only">
                      {dayEvents.length} event{dayEvents.length === 1 ? "" : "s"}
                    </span>
                  )}
                </div>

                <ul className="flex flex-col gap-0.5 min-h-0">
                  {visible.map((ev) => (
                    <li key={ev.id}>
                      <EventChip event={ev} day={day} onClick={onEventClick} />
                    </li>
                  ))}
                  {overflow > 0 && (
                    <li>
                      <span className="block text-[10px] text-program-on-surface-soft px-1.5">
                        +{overflow} more
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EventChip({
  event,
  day,
  onClick,
}: {
  event: CalendarEvent;
  day: Date;
  onClick?: (e: CalendarEvent) => void;
}) {
  const isStart = isSameDay(event.date, day);
  const isMultiDay = event.endDate && !isSameDay(event.date, event.endDate);
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      {...(onClick ? { onClick: () => onClick(event), type: "button" as const } : {})}
      className={cn(
        "group/chip flex items-baseline gap-1.5 w-full text-left truncate px-1 py-0.5 rounded-program",
        "text-[11px] leading-tight text-program-on-surface",
        onClick &&
          "hover:bg-program-surface-muted/50 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-program-ring",
        isMultiDay && !isStart && "italic text-program-on-surface-soft",
      )}
      title={event.title}
    >
      {!(isMultiDay && !isStart) && (
        <span
          aria-hidden
          className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-program bg-program-decor"
        />
      )}
      <span className="display text-[10px] text-program-on-surface-soft shrink-0">
        {isStart ? formatTime(event.date) : "→"}
      </span>
      <span className="truncate">{event.title}</span>
    </Wrapper>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Agenda view                                                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

function AgendaList({
  events,
  from,
  days,
  onEventClick,
}: {
  events: CalendarEvent[];
  from: Date;
  days: number;
  onEventClick?: (event: CalendarEvent) => void;
}) {
  const until = addDays(from, days);
  const visible = events.filter((e) => {
    const start = startOfDay(e.date);
    return start >= from && start <= until;
  });

  if (visible.length === 0) {
    return (
      <div className="px-5 py-12 text-center text-program-on-surface-soft font-body">
        Nothing on the calendar in the next {days} days.
      </div>
    );
  }

  // Group by start day for visual rhythm.
  const groups: { day: Date; items: CalendarEvent[] }[] = [];
  for (const ev of visible) {
    const day = startOfDay(ev.date);
    const last = groups[groups.length - 1];
    if (last && isSameDay(last.day, day)) last.items.push(ev);
    else groups.push({ day, items: [ev] });
  }

  return (
    <ol className="divide-y divide-program-border/40">
      {groups.map((g, gi) => (
        <li key={gi} className="grid grid-cols-[88px_1fr] sm:grid-cols-[120px_1fr] gap-4 px-4 sm:px-5 py-4">
          <DayStamp day={g.day} />
          <ul className="flex flex-col gap-3 min-w-0">
            {g.items.map((ev) => (
              <AgendaItem key={ev.id} event={ev} onClick={onEventClick} />
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

function DayStamp({ day }: { day: Date }) {
  const today = isSameDay(day, new Date());
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="display text-[10px] uppercase tracking-[0.18em] text-program-on-surface-soft">
        {day.toLocaleDateString(undefined, { weekday: "short" })}
      </span>
      <span className="display text-3xl leading-none text-program-on-surface">
        {day.getDate()}
      </span>
      <span className="display text-xs text-program-on-surface-soft">
        {day.toLocaleDateString(undefined, { month: "short" })}
      </span>
      {today && (
        <Badge variant="accent" className="mt-1.5">
          Today
        </Badge>
      )}
    </div>
  );
}

function AgendaItem({
  event,
  onClick,
}: {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      {...(onClick ? { onClick: () => onClick(event), type: "button" as const } : {})}
      className={cn(
        "group text-left rounded-program bg-program-surface px-4 py-3 transition",
        "ring-1 ring-inset ring-program-border/50",
        onClick &&
          "hover:bg-program-surface-muted/40 hover:ring-program-border hover:shadow-program focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-ring",
        event.featured && "shadow-program ring-program-border/60 px-4 py-3.5",
      )}
    >
      {event.featured && <DecorativeBorder className="h-2 mb-2 -mt-1" />}
      <div className="flex items-baseline gap-2 flex-wrap">
        {event.category && <Badge variant="subtle">{event.category}</Badge>}
        <span className="display text-xs text-program-on-surface-soft">
          {formatDateRange(event.date, event.endDate)}
          <span aria-hidden> · </span>
          {formatTime(event.date)}
        </span>
      </div>
      <div className={cn("display mt-1 text-program-on-surface", event.featured ? "text-lg sm:text-2xl" : "text-base sm:text-lg")}>
        {event.title}
      </div>
      {event.location && (
        <div className="font-body text-sm text-program-on-surface-soft mt-0.5">{event.location}</div>
      )}
      {event.description && (
        <p className="font-body text-sm text-program-on-surface/80 mt-1.5 leading-relaxed">
          {event.description}
        </p>
      )}
    </Wrapper>
  );
}
