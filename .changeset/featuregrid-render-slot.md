---
"@opensourcescouting/design-system": minor
---

`FeatureGrid` gains an optional `renderFeature(feature, index)` prop that
replaces the default per-cell card entirely (for teaser tiles, background
images, "Learn more" links, extra metadata) while keeping the grid layout. The
default rendering is unchanged when the prop is omitted. The `Feature` type is
exported for typing the render callback.
