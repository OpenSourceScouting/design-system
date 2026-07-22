---
"@opensourcescouting/design-system": minor
---

Rework `ProgramHero` around real consumer use cases, surfaced by the first
downstream adopter (Open Source Scouting site dogfooding, findings DS-1/DS-2/DS-3):

- **Program identity block is now opt-in.** The ProgramMark + program label +
  age range header no longer renders unless you pass `showProgramIdentity`
  (default `false`). Most consumers establish their own identity in their
  masthead and do not want the program's injected into their hero. (Breaking:
  set `showProgramIdentity` to restore the old block; the demo/showcase does.)
- **`showTagline` now defaults to `false`.** A consumer's hero no longer
  displays a Scouting America marketing slogan it did not explicitly request.
  (Breaking: pass `showTagline` to restore it.)
- **Hero actions honor `href`.** An action with an `href` now renders a real
  anchor styled as a button (correct semantics, works before hydration on
  prerendered/static pages, right/middle-click behave). `onClick`-only actions
  still render a `<button>`; passing both fires `onClick` alongside navigation.
  Previously `href` was typed but silently ignored, so `href`-only actions did
  nothing. The exported `ProgramHeroAction` type names the action shape.

Also hardens `MadeWithBadge` (DS-5): the badge now sets `width: fit-content`
so it keeps its pill shape as a direct child of a stretching grid/flex parent
instead of blowing out to full width.
