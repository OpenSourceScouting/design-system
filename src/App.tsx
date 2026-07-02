import { useState, type ReactElement, type ReactNode } from "react";
import { ScoutThemeProvider, PROGRAMS, PROGRAM_META, type Program } from "@/lib/theme/ScoutThemeProvider";
import { ProgramHero } from "@/components/ProgramHero";
import { FeatureGrid } from "@/components/FeatureGrid";
import { Calendar, type CalendarEvent } from "@/components/Calendar";
import { EventDialog } from "@/components/EventDialog";
import { RegistrationCTA } from "@/components/RegistrationCTA";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils/cn";

const ICONS = {
  adventure: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 20 L9 8 L13 14 L17 6 L21 20 Z" />
    </svg>
  ),
  leadership: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3" />
      <path d="M4 21 q0-6 8-6 t8 6" />
    </svg>
  ),
  service: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-4.5-7-11a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 6.5-7 11-7 11z" />
    </svg>
  ),
};

const CONTENT: Record<Program, {
  headline: string;
  lede: string;
  secondaryCta: string;
  eventTitle: string;
  eventCategory: string;
  eventLocation: string;
  eventDescription: string;
  features: { title: string; description: string; icon: ReactElement }[];
}> = {
  cub: {
    headline: "Where curious kids become confident leaders.",
    secondaryCta: "See what packs do",
    lede:
      "From overnight camping to STEM workshops, every Cub Scouts meeting is a chance to try something new and bring it home to share.",
    eventTitle: "Pinewood Derby Weekend",
    eventCategory: "Pack Event",
    eventLocation: "Pack 42 Hall · Peoria, IL",
    eventDescription: "Build, race, and cheer on your custom car. Trophies, snacks, and big smiles guaranteed.",
    features: [
      { title: "Family First", description: "Parents and siblings are part of every adventure. Dens stick together; families grow together.", icon: ICONS.service },
      { title: "Hands-On", description: "Knots, fire-building, robotics, baking. Real skills, taught by real volunteers.", icon: ICONS.adventure },
      { title: "Belonging", description: "Every kid gets a den, a uniform, and a circle of friends. Welcoming is the first rule.", icon: ICONS.leadership },
    ],
  },
  scoutsbsa: {
    headline: "Test your limits. Earn the trail.",
    secondaryCta: "The trail to Eagle",
    lede:
      "Scouts BSA is the program where young people lead their own patrols, plan their own treks, and discover what they are capable of.",
    eventTitle: "Summit Backpacking Trek",
    eventCategory: "High Adventure",
    eventLocation: "Sangre de Cristo Range · NM",
    eventDescription: "Four days, three nights, high altitude. Patrol-planned, patrol-led. YPT required for adults.",
    features: [
      { title: "Adventure", description: "Mountains, rivers, caves, and skies. The outdoors is the classroom, and the curriculum changes weekly.", icon: ICONS.adventure },
      { title: "Leadership", description: "Patrol leaders run meetings. Senior patrol leaders run the troop. Adults coach from the back.", icon: ICONS.leadership },
      { title: "Service", description: "From neighborhood projects to Eagle Scout community work, Scouts leave places better than they found them.", icon: ICONS.service },
    ],
  },
  venturing: {
    headline: "Your crew. Your call.",
    secondaryCta: "Meet the crews",
    lede:
      "Venturing is a co-ed, youth-led program for ages 14-20. Plan your own high-adventure crew around your interests: paddling, climbing, robotics, performing arts, anything.",
    eventTitle: "Crew Whitewater Weekend",
    eventCategory: "Crew Trip",
    eventLocation: "Ocoee River · TN",
    eventDescription: "Three days, two nights of Class III/IV paddling. Open to certified crew members aged 16+.",
    features: [
      { title: "Self-Directed", description: "Crews choose their own adventures. The program scales to your ambition, not the other way around.", icon: ICONS.adventure },
      { title: "Team-Led", description: "Officers are elected from within. Adults consult; the crew decides.", icon: ICONS.leadership },
      { title: "Real Impact", description: "Service hours and community projects count beyond the crew, on resumes, applications, and life.", icon: ICONS.service },
    ],
  },
  seascouts: {
    headline: "Take the helm.",
    secondaryCta: "Tour a ship",
    lede:
      "Sea Scouts learn maritime skills aboard real vessels: sailing, navigation, engineering, and safe-boating. Adventure on the water builds confidence ashore.",
    eventTitle: "Open Boats Day",
    eventCategory: "Recruitment",
    eventLocation: "Burnham Harbor · Chicago, IL",
    eventDescription: "Tour the fleet, meet active Sea Scouts, and try your hand at the helm. Lunch and pier tour included.",
    features: [
      { title: "Seamanship", description: "Knots, lines, navigation, weather, and small-craft handling, taught by experienced ship leaders.", icon: ICONS.adventure },
      { title: "Crew Leadership", description: "Boatswain, mate, purser: each role mirrors maritime tradition and modern team management.", icon: ICONS.leadership },
      { title: "Long Cruise", description: "Annual long cruises take crews offshore for a week or more of real expedition sailing.", icon: ICONS.service },
    ],
  },
};

function buildCalendarEvents(content: (typeof CONTENT)[Program]): CalendarEvent[] {
  const now = new Date();
  const Y = now.getFullYear();
  const M = now.getMonth();
  return [
    {
      id: "weekly-1",
      date: new Date(Y, M, 3, 18, 30),
      title: "Weekly Meeting",
      category: "Weekly",
      location: "Unit Hall",
    },
    {
      id: "weekly-2",
      date: new Date(Y, M, 10, 18, 30),
      title: "Weekly Meeting",
      category: "Weekly",
      location: "Unit Hall",
    },
    {
      id: "weekly-3",
      date: new Date(Y, M, 17, 18, 30),
      title: "Weekly Meeting",
      category: "Weekly",
      location: "Unit Hall",
    },
    {
      id: "service",
      date: new Date(Y, M, 12, 9, 0),
      title: "Service Saturday",
      category: "Service",
      location: "Riverside Park",
      description: "Bring gloves and a refillable water bottle. Trash bags provided.",
    },
    {
      id: "marquee",
      date: new Date(Y, M, 19, 14, 0),
      endDate: new Date(Y, M, 21, 11, 0),
      title: content.eventTitle,
      category: content.eventCategory,
      location: content.eventLocation,
      description: content.eventDescription,
      featured: true,
      organizer: "Unit Leadership",
      cost: "$25 per youth · $15 per adult",
      capacity: "60 participants",
      registrationDeadline: new Date(Y, M, 14),
    },
    {
      id: "next-month",
      date: new Date(Y, M + 1, 4, 9, 0),
      title: "Council Roundtable",
      category: "Leadership",
      location: "Council Office",
    },
  ];
}

function SectionHeading({
  index,
  kicker,
  title,
  action,
}: {
  index: string;
  kicker: string;
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-3 border-b-rule border-program-border/60 pb-3">
      <div className="flex items-baseline gap-4">
        <span className="display text-sm tabular-nums text-program-on-surface-soft">{index}</span>
        <div className="flex flex-col">
          <span className="display text-[11px] uppercase tracking-[0.22em] text-program-on-surface-soft">
            {kicker}
          </span>
          <Heading level={2} size={3}>{title}</Heading>
        </div>
      </div>
      {action}
    </div>
  );
}

function ProgramSwitcher({ active, onChange }: { active: Program; onChange: (p: Program) => void }) {
  return (
    <nav
      aria-label="Program theme switcher"
      className="sticky top-0 z-30 bg-program-surface/95 backdrop-blur border-b border-program-border/50"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2">
        <span className="display text-xs uppercase tracking-[0.2em] text-program-on-surface-soft mr-2">
          Theme
        </span>
        {PROGRAMS.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              "display text-xs px-3 py-1.5 rounded-program transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-program-ring",
              active === p
                ? "bg-program-primary text-program-on-primary"
                : "bg-transparent text-program-on-surface hover:bg-program-surface-muted",
            )}
            aria-pressed={active === p}
          >
            {PROGRAM_META[p].label}
          </button>
        ))}
      </div>
    </nav>
  );
}

export function App() {
  const [program, setProgram] = useState<Program>("cub");
  const [openEvent, setOpenEvent] = useState<CalendarEvent | null>(null);
  const content = CONTENT[program];

  return (
    <ScoutThemeProvider program={program} applyToDocument>
      <ProgramSwitcher active={program} onChange={setProgram} />

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 flex flex-col gap-12">
        <ProgramHero
          eyebrow="Fall 2026"
          headline={content.headline}
          lede={content.lede}
          primaryAction={{ label: "Find a Unit" }}
          secondaryAction={{ label: content.secondaryCta }}
        />

        <section className="flex flex-col gap-5">
          <SectionHeading
            index="01"
            kicker="What we do"
            title="The program at a glance"
            action={<Button variant="ghost">See full program guide →</Button>}
          />
          <FeatureGrid columns={3} features={content.features} />
        </section>

        <section className="flex flex-col gap-5">
          <SectionHeading index="02" kicker="Upcoming" title="What's on the calendar" />
          <Calendar
            events={buildCalendarEvents(content)}
            onEventClick={setOpenEvent}
          />
        </section>

        <EventDialog
          event={openEvent}
          onClose={() => setOpenEvent(null)}
          actions={[
            { label: "Register", variant: "primary", onClick: () => alert("Registration flow") },
            { label: "Add to Calendar", variant: "secondary", onClick: () => alert("Download .ics") },
            { label: "Directions", variant: "ghost", onClick: () => alert("Open maps") },
          ]}
        />

        <RegistrationCTA />

        <footer className="border-t border-program-border/50 pt-6 text-xs text-program-on-surface-soft font-body">
          <p>
            Built from the Scouting America 2024 Brand Guidelines. This page is a design-system
            showcase, not an official Scouting America property.
          </p>
        </footer>
      </main>
    </ScoutThemeProvider>
  );
}
