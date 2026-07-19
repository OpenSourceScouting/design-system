---
"@opensourcescouting/design-system": minor
---

Open the API for third-party extension. `Program` is now
`KnownProgram | (string & {})`, so a consumer can register a custom program by
adding a matching `[data-program]` token block, with metadata/icons falling back
to a sensible default (new `isKnownProgram`, `resolveKnownProgram`, and
`DEFAULT_PROGRAM` helpers). The component style maps are also exported
(`buttonVariants`, `badgeVariants`, `cardVariants`, `alertToneStyles`) so
variants can be extended from a wrapper without forking.
