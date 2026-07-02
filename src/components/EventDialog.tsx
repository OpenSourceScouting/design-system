import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Heading } from "./Heading";
import type { CalendarEvent } from "./Calendar";
// ProgramMark not imported here today, but the close-button area sits on the
// dark primary surface. If we add the program mark to the header later it
// must use variant="reversed".
import { isSameDay, isSameMonth } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

export type EventDialogAction = {
  label: string;
  /** Visual emphasis. Defaults to "secondary" except the first action, which defaults to "primary". */
  variant?: "primary" | "secondary" | "ghost" | "accent";
  onClick?: () => void;
  href?: string;
};

export type EventDialogProps = {
  /** When non-null, the dialog is open. Pass null to close. */
  event: CalendarEvent | null;
  onClose: () => void;
  /**
   * Action buttons in the footer. If omitted and `event.registrationUrl` is set,
   * a default "Register" action is added.
   */
  actions?: EventDialogAction[];
};

function formatRange(start: Date, end?: Date): string {
  const dateOpts: Intl.DateTimeFormatOptions = { weekday: "long", month: "long", day: "numeric", year: "numeric" };
  if (!end || isSameDay(start, end)) {
    return start.toLocaleDateString(undefined, dateOpts);
  }
  if (isSameMonth(start, end)) {
    return `${start.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })} – ${end.toLocaleDateString(undefined, { weekday: "long", day: "numeric", year: "numeric" })}`;
  }
  return `${start.toLocaleDateString(undefined, dateOpts)} – ${end.toLocaleDateString(undefined, dateOpts)}`;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatTimeRange(start: Date, end?: Date): string {
  if (!end || isSameDay(start, end)) {
    return end ? `${formatTime(start)} – ${formatTime(end)}` : formatTime(start);
  }
  return `Starts ${formatTime(start)}`;
}

export function EventDialog({ event, onClose, actions }: EventDialogProps) {
  const ref = useRef<HTMLDialogElement | null>(null);

  // Native <dialog> open/close: call showModal/close to drive native focus trap,
  // ESC handling, inert background, and ::backdrop styling.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (event && !el.open) el.showModal();
    if (!event && el.open) el.close();
  }, [event]);

  // Native dialog dispatches "close" on ESC. Sync that back to React state.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleClose = () => onClose();
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
    // The dialog element fills the viewport; clicks on the element itself
    // (not its inner card) are backdrop clicks.
    if (e.target === ref.current) onClose();
  };

  if (!event && typeof window !== "undefined") {
    // Render the dialog node even when closed so React-keyed state survives.
    return <dialog ref={ref} className="hidden" />;
  }

  const resolvedActions: EventDialogAction[] =
    actions ??
    (event?.registrationUrl
      ? [
          {
            label: "Register",
            variant: "primary",
            onClick: () => {
              if (event.registrationUrl) window.location.href = event.registrationUrl;
            },
          },
        ]
      : []);

  return (
    <dialog
      ref={ref}
      onClick={handleBackdropClick}
      className={cn(
        // Native <dialog> with showModal() handles centering via the browser's
        // user-agent stylesheet (position: fixed; inset: 0; margin: auto).
        "p-0 max-w-2xl w-[calc(100vw-2rem)] bg-transparent",
        "backdrop:bg-program-on-surface/55 backdrop:backdrop-blur-sm",
      )}
      aria-labelledby={event ? `event-dialog-title-${event.id}` : undefined}
    >
      {event && (
        <article
          className={cn(
            "rounded-program bg-program-surface text-program-on-surface shadow-program",
            "border border-program-border/60 overflow-hidden",
            "flex flex-col max-h-[85vh]",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <EventDialogHeader event={event} onClose={onClose} />
          <EventDialogBody event={event} />
          {resolvedActions.length > 0 && <EventDialogFooter actions={resolvedActions} />}
        </article>
      )}
    </dialog>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */

function EventDialogHeader({ event, onClose }: { event: CalendarEvent; onClose: () => void }) {
  return (
    <header
      className={cn(
        "relative px-6 sm:px-8 pt-6 pb-5",
        "bg-program-primary text-program-on-primary",
      )}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className={cn(
          "absolute top-3 right-3 h-9 w-9 grid place-items-center rounded-program",
          "text-program-on-primary-soft hover:text-program-on-primary hover:bg-program-on-primary/10",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-accent",
        )}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="flex flex-col gap-2 max-w-[calc(100%-3rem)]">
        {event.category && (
          <Badge
            variant="accent"
            className="self-start"
          >
            {event.category}
          </Badge>
        )}
        <Heading
          level={2}
          size={3}
          id={`event-dialog-title-${event.id}`}
          className="text-program-on-primary"
        >
          {event.title}
        </Heading>
        <div className="font-body text-sm sm:text-base text-program-on-primary-soft leading-relaxed">
          {formatRange(event.date, event.endDate)}
          <span aria-hidden> · </span>
          {formatTimeRange(event.date, event.endDate)}
        </div>
      </div>
    </header>
  );
}

function EventDialogBody({ event }: { event: CalendarEvent }) {
  const facts: { label: string; value: ReactNode }[] = [];
  if (event.location) facts.push({ label: "Location", value: event.location });
  if (event.organizer) facts.push({ label: "Organized by", value: event.organizer });
  if (event.cost) facts.push({ label: "Cost", value: event.cost });
  if (event.capacity) facts.push({ label: "Capacity", value: event.capacity });
  if (event.registrationDeadline) {
    facts.push({
      label: "Register by",
      value: event.registrationDeadline.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    });
  }

  return (
    <div className="px-6 sm:px-8 py-6 overflow-y-auto flex flex-col gap-6">
      {facts.length > 0 && (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {facts.map((f) => (
            <div key={f.label}>
              <dt className="display text-[10px] uppercase tracking-[0.18em] text-program-on-surface-soft">
                {f.label}
              </dt>
              <dd className="font-body text-sm sm:text-base mt-0.5 text-program-on-surface">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {event.description && (
        <div className="font-body text-base leading-relaxed text-program-on-surface/85 prose-program">
          {typeof event.description === "string"
            ? event.description.split(/\n\s*\n/).map((p, i) => (
                <p key={i} className="mb-3 last:mb-0">
                  {p}
                </p>
              ))
            : event.description}
        </div>
      )}
    </div>
  );
}

function EventDialogFooter({ actions }: { actions: EventDialogAction[] }) {
  return (
    <footer
      className={cn(
        "px-6 sm:px-8 py-4 border-t border-program-border/50",
        "bg-program-surface-muted/40",
        "flex flex-wrap items-center justify-end gap-3",
      )}
    >
      {actions.map((a, i) => {
        const variant = a.variant ?? (i === 0 ? "primary" : "secondary");
        const onClick = a.href
          ? () => {
              if (a.href) window.location.href = a.href;
            }
          : a.onClick;
        return (
          <Button key={i} variant={variant} size="md" onClick={onClick}>
            {a.label}
          </Button>
        );
      })}
    </footer>
  );
}
