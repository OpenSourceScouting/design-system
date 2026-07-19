---
"@opensourcescouting/design-system": minor
---

`ProgramMark` gains `src` and `preferExtension` props to control asset
resolution. `src` renders an explicit URL with no extension probing (the fix
for SPA-fallback hosts like Netlify/Vercel that return 200 + an app shell for
missing files, defeating probe-by-error); `preferExtension` tries one extension
first, cutting the common case from up to five requests to one. A zero natural
dimension load is now also treated as a miss (so a degenerate 200 falls through
to the placeholder). README and public/marks/README document the SPA-fallback
behavior and workarounds. Existing default probing and placeholder fallback are
unchanged.
