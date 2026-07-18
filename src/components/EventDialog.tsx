import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Heading } from "./Heading";
import type { CalendarEvent } from "./Calendar";
// ProgramMark not imported here today, but the close-button area sits on the
// dark primary surface. If we add the program mark to the header later it
// must use variant="reversed".
import { isSameDay, isSameMonth } from "../lib/utils/date";
import { cn } from "../lib/utils/cn";

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
  /**
   * Additional class names merged onto the native `<dialog>` element.
   * Useful for overriding max-width or adding custom backdrop styles from
   * a consumer application without forking this component.
   */
  className?: string;
  /**
   * SPA-router navigation hook. When provided, all URL navigations (the
   * default "Register" action and any `href`-bearing footer actions) call
   * this function instead of assigning `window.location.href`. Inject your
   * router's `push` or `navigate` function here so the browser history stack
   * is not blown away on a hard reload.
   *
   * @example navigate={router.push}
   */
  navigate?: (url: string) => void;
};

export type EventDialogHeaderProps = {
  /** The calendar event whose title, date range, and category are displayed. */
  event: CalendarEvent;
  /** Called when the user presses the close button. */
  onClose: () => void;
};

export type EventDialogBodyProps = {
  /** The calendar event whose detail fields (location, cost, description, etc.) are rendered. */
  event: CalendarEvent;
};

export type EventDialogFooterProps = {
  /** Action buttons to render. At least one action is required for the footer to be shown. */
  actions: EventDialogAction[];
  /**
   * SPA-router navigation hook forwarded from `EventDialogProps`. When set,
   * `href`-bearing actions call this instead of `window.location.href`.
   */
  navigate?: (url: string) => void;
};

function formatRange(start: Date, end?: Date): string {
  const fullOpts: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  if (!end || isSameDay(start, end)) {
    return start.toLocaleDateString("en-US", fullOpts);
  }
  if (isSameMonth(start, end)) {
    // Both sides carry weekday + month + day; year appears only on the end date.
    const startFmt = start.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const endFmt = end.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return `${startFmt} - ${endFmt}`;
  }
  return `${start.toLocaleDateString("en-US", fullOpts)} - ${end.toLocaleDateString("en-US", fullOpts)}`;
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function formatTimeRange(start: Date, end?: Date): string {
  if (!end || isSameDay(start, end)) {
    return end ? `${formatTime(start)} - ${formatTime(end)}` : formatTime(start);
  }
  return `Starts ${formatTime(start)}`;
}

export function EventDialog({ event, onClose, actions, className, navigate }: EventDialogProps) {
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

  // Default navigation falls back to a hard redirect when no SPA hook is provided.
  const nav =
    navigate ??
    ((url: string) => {
      window.location.href = url;
    });

  const resolvedActions: EventDialogAction[] =
    actions ??
    (event?.registrationUrl
      ? [
          {
            label: "Register",
            variant: "primary",
            onClick: () => {
              if (event.registrationUrl) nav(event.registrationUrl);
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
        className,
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
          {resolvedActions.length > 0 && (
            <EventDialogFooter actions={resolvedActions} navigate={navigate} />
          )}
        </article>
      )}
    </dialog>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * The primary-colored header band of an EventDialog, containing the title,
 * date range, category badge, and close button.
 *
 * Exported so consumers can compose a custom dialog shell (e.g. inside a
 * Radix Dialog or Sheet) while reusing the branded header markup.
 */
export function EventDialogHeader({ event, onClose }: EventDialogHeaderProps) {
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
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="flex flex-col gap-2 max-w-[calc(100%-3rem)]">
        {event.category && (
          <Badge variant="accent" className="self-start">
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

/**
 * The scrollable body of an EventDialog, rendering the event fact grid
 * (location, organizer, cost, capacity, deadline) and the description.
 *
 * Exported so consumers can embed the body alone inside a custom dialog
 * shell without reconstructing the fact-grid or description layout.
 */
export function EventDialogBody({ event }: EventDialogBodyProps) {
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
              <dd className="font-body text-sm sm:text-base mt-0.5 text-program-on-surface">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {event.description && (
        <div className="font-body text-base leading-relaxed text-program-on-surface/85">
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

/**
 * The action-button footer of an EventDialog.
 *
 * Exported so consumers can render the footer standalone (e.g. inside a
 * Sheet or custom modal) or extend it with additional controls alongside
 * the standard action buttons.
 *
 * Pass `navigate` to route `href`-bearing actions through a SPA router
 * instead of a hard `window.location.href` assignment.
 */
export function EventDialogFooter({ actions, navigate }: EventDialogFooterProps) {
  // Default navigation falls back to a hard redirect when no SPA hook is provided.
  const nav =
    navigate ??
    ((url: string) => {
      window.location.href = url;
    });

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
              if (a.href) nav(a.href);
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
