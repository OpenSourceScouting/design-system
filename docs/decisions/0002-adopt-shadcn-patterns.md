# 0002. Adopt shadcn/ui patterns as the component idiom

Date: 2026-07-17
Status: Accepted

## Context

The system needs interactive widgets (menus, tabs, tooltips, dialogs, toasts)
whose keyboard/focus/ARIA behavior is expensive to hand-roll. We had already
adopted Radix primitives for this (see the themed Select) and were hand-writing
Tailwind skins over them: which is, structurally, what shadcn/ui generates.

shadcn/ui is not a runtime dependency. It is a set of component recipes (Radix +
Tailwind + `cn` + `cva`) whose source is copied into the consuming repo and
owned there. It is the dominant idiom in the React + Tailwind ecosystem:
contributors, documentation, community blocks, and AI coding tools all speak it.

We are pre-release: no consumers to break, and the one-time cost of
standardizing idioms is at its minimum. The project's goal is a cohesive system
a broad volunteer community can maintain long-term, which favors ecosystem
alignment over bespoke conventions.

## Decision

Adopt shadcn/ui's **form**: its token vocabulary, component APIs, `cva` variant
idiom, and recipe structure. Keep this project's **substance**: audited brand
values, the multi-program theming dimension, and accessibility guardrails.

Guiding principle: **minimize and codify the deltas from standard shadcn.**
Anything we do differently from stock shadcn must earn its place, be listed in
the delta register below, and be kept as small as possible. Everything else
follows shadcn conventions exactly, so that shadcn documentation, community
recipes, and tooling apply to this codebase unmodified.

### How multi-program branding works (the core mechanism)

shadcn components read semantic tokens (`--primary`, `--background`,
`--accent`, ...). Instead of shadcn's single `:root` + `.dark` pair, we define
those same token names **per program**:

```css
[data-program="cub"] {
  --primary: ...;
  --background: ...;
  --ring: ...;
}
[data-program="scoutsbsa"] {
  --primary: ...;
  --background: ...;
  --ring: ...;
}
/* venturing, seascouts, and :root (parent brand) likewise */
```

An unmodified shadcn component then themes across all five programs with zero
per-component changes. Dark mode later composes the same way
(`[data-program="cub"].dark`). `ScoutThemeProvider` and theme nesting are
unchanged.

### The delta register

The complete list of intentional deviations from stock shadcn. PRs must not
introduce deltas outside this list without updating this ADR.

| #   | Delta                                                                                                                                                                                         | Why it earns its place                                                                                                                                                                                                                                                                                                  |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Tokens are defined per `[data-program]`, not `:root` + `.dark` only                                                                                                                           | The entire point of the system: five brands from one codebase                                                                                                                                                                                                                                                           |
| 2   | Token values are ours (brand-guideline colors, audited for WCAG AA), not shadcn's zinc/neutral defaults                                                                                       | Brand fidelity and accessibility are the product                                                                                                                                                                                                                                                                        |
| 3   | Extended token vocabulary, prefixed `--os-*`, for concepts shadcn lacks (contrast-safe text tiers such as on-surface-soft/faint, rule weight, program decor color)                            | Documented AA guarantees need dedicated tokens; prefix keeps them visually distinct from stock names                                                                                                                                                                                                                    |
| 4   | Semantic mapping is curated, not name-matched. Notably shadcn `--accent` is a muted hover wash, NOT the brand accent (gold); the brand accent lives in the extended vocabulary                | Naive mapping paints hover states brand-gold; this is the known trap                                                                                                                                                                                                                                                    |
| 5   | `Button` excludes `variant="accent" size="sm"` at the type level, plus a dev warning                                                                                                          | Gold fill at 12px fails WCAG AA; a stock shadcn Button cannot express this guarantee                                                                                                                                                                                                                                    |
| 6   | Domain components with no shadcn counterpart (ProgramMark, ProgramHero, Calendar, EventCard, RegistrationCTA, DecorativeDivider, MadeWithBadge, ScoutingAmericaWordmark, scouting links data) | The scouting-specific value of the library                                                                                                                                                                                                                                                                              |
| 7   | Brand-asset legal model (gitignored real marks, no CSS recoloring, placeholder fallbacks)                                                                                                     | Trademark license compliance; see NOTICE.md                                                                                                                                                                                                                                                                             |
| 8   | Distribution is a published npm package, not copy-in                                                                                                                                          | Consumers are volunteer-run sites that need `npm update`-able fixes, not vendored source they must maintain                                                                                                                                                                                                             |
| 9   | Portalled Radix content re-stamps `data-program`                                                                                                                                              | Portals escape the themed subtree; without this, popups lose the program theme                                                                                                                                                                                                                                          |
| 10  | Form layer keeps the framework-agnostic `Field` context; shadcn's `Form` (react-hook-form) is NOT adopted                                                                                     | A library consumed by many volunteer sites must not force one form-state lib; `Field` is zero-dep a11y wiring that works with native forms, RHF, server actions, etc. shadcn's styled input primitives are adopted; only the RHF-coupled `Form` wrapper is declined                                                     |
| 11  | Primitives use one radius per program (`rounded-lg` = `--radius`), not shadcn's `rounded-md`/`-xl` size hierarchy                                                                             | Each program's radius is a deliberate brand trait (Cub 14px, Sea Scouts 1px hairline). A size hierarchy would break the "everything hairline" intent for Sea Scouts. The `--radius-sm/md/lg/xl` scale exists for recipes that want it, but primitives keep the single radius.                                           |
| 12  | Floating overlays (Dialog, Popover, DropdownMenu, Tooltip) use a fixed `shadow-lg`, not the per-program `shadow-program`                                                                      | The per-program brand shadow is intentionally faint (Sea Scouts is a 1px hairline), too weak to lift a modal off the page. Elevation for floating surfaces must read regardless of program.                                                                                                                             |
| 13  | Toasts (Sonner) are program-neutral: they read whatever program is on the document, defaulting to the parent brand                                                                            | Sonner renders at `document.body` and does not forward attributes to its container, so it sits outside the themed subtree. Rather than fight that, transient system feedback reads the parent brand (or the document program when `applyToDocument` is set), the same rationale as the Alert status palette (delta 14). |
| 14  | Alert tones and `--destructive` come from the raw `sa-*` palette, not program tokens                                                                                                          | System feedback (info/success/warning/danger) must read the same across programs; a per-program error color would be confusing. `--destructive` maps to `sa-red` in every program.                                                                                                                                      |

Deltas we gave up (previously bespoke, now standard shadcn): hand-rolled variant
maps became `cva`; the native `<dialog>` EventDialog was rebuilt on the shadcn
Dialog recipe (Radix) for one consistent overlay system; hand-written widget
skins were replaced by reskinned shadcn recipes. Note the form layer is the
exception (delta 10): we adopted shadcn's input primitives but kept our own
`Field` instead of the react-hook-form-coupled `Form`.

## Consequences

- Contributors familiar with shadcn are productive immediately; shadcn docs and
  community recipes apply directly; AI tooling generates idiomatic code for us.
- Complex composites (Combobox, Command, Data Table) become recipe adoptions
  instead of multi-day builds.
- One-time migration cost: tokens re-expressed per program under shadcn names,
  primitives rebuilt on `cva` with our values and guards, all visual-regression
  baselines regenerated. See `docs/shadcn-migration-plan.md`.
- We accept dependence on the Radix + shadcn ecosystem's health, mitigated by
  the copy-in model (recipes we adopt live in our repo and cannot be pulled out
  from under us).
- Requires Tailwind v4 to stay aligned with current shadcn generation: see
  ADR 0003.
