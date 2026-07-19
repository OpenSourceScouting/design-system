---
"@opensourcescouting/design-system": minor
---

Per-program motion language. Each program now carries three overridable
`--os-motion-*` tokens (easing, base duration, fast duration) so personality is
felt, not just static: Cub Scouts overshoots (bounce), Venturing snaps, Sea
Scouts glides, Scouts BSA stays steady. They map to `ease-program`,
`duration-program`, and `duration-program-fast` utilities (Button uses the fast
pair, Card the base), and are retuned per program by overriding the tokens, like
colors. `prefers-reduced-motion` still zeroes durations globally.
