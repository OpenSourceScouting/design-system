# Self-hosted fonts example

A minimal app entry showing how a consumer of
`@opensourcescouting/design-system` loads the two brand font families from their
own origin, with no third-party (Google Fonts / CDN) request.

See [`main.tsx`](./main.tsx). The key part is the four `@fontsource-variable`
imports (each family in roman + italic) plus the design-system `tokens` and
`theme` stylesheets, all imported once at the app root.

```bash
npm i @opensourcescouting/design-system \
      @fontsource-variable/montserrat @fontsource-variable/source-serif-4
```

The families register under the exact names `tokens.css` references
(`"Montserrat Variable"`, `"Source Serif 4 Variable"`), so no `@font-face`
wiring is needed. This example is illustrative source, not a runnable project;
drop `main.tsx` into any Vite/React app entry.
