---
"@opensourcescouting/design-system": minor
---

`ScoutThemeProvider` gains an optional `theme` prop: a custom theme layer
stamped as `data-theme` alongside `data-program`. The library ships no theme
values itself (Scouting America has no dark mode; this package aligns to the
official design system), but a unit or project can now layer one, e.g. dark
mode, by setting `theme` and supplying `[data-theme]`-scoped token overrides in
their own CSS. Crucially, `useProgramStamp` re-stamps `data-theme` onto
portalled widgets, so a custom theme applies inside dialogs, menus, and tooltips
too, and `applyToDocument` manages it on `<html>`. `useScoutTheme()` exposes the
active `theme`.
