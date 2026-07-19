---
"@opensourcescouting/design-system": minor
---

Expose the design tokens as framework-neutral data so non-Tailwind and non-web
consumers can use the exact brand values without hand-copying hex codes.
`src/styles/tokens.css` stays the authored source of truth; everything is
generated from it. Adds a typed `TOKENS` export (mirroring `SCOUTING_LINKS`)
plus three file artifacts shipped as package subpaths: `./tokens.json` (full
set, rgb + hex + values), `./tokens.scss` (a Sass color map), and
`./tokens.email.json` (hex-only, flat, for email tools that cannot use CSS
variables).
