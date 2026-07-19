---
"@opensourcescouting/design-system": minor
---

Layout components respond to their container, not the viewport (Tailwind v4
container queries, no plugin). `FeatureGrid` now picks its column count from its
own width, so `columns={4}` in a narrow sidebar collapses to one column even on
a wide screen. `Calendar` falls back to the agenda view based on its own width
(a ResizeObserver on the calendar element) rather than the viewport, so a
calendar in a narrow sidebar on a wide screen still falls back. New
narrow-container stories demonstrate both.
