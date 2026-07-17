# Notice: Brand Asset Model

This design system is built to power Scouting America program websites and
communications for individual units, packs, troops, crews, ships, and local
councils. It is intentionally architected so the framework code can be freely
shared and reused, while the **trademarked brand assets** stay subject to their
own license.

## How the split works

| What                                                                                                   | Where                                                                                 | License                                                                      |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| React components, tokens, styles, build config                                                         | `src/`, `.storybook/`, `tailwind.config.ts`, etc.                                     | MIT (see [`LICENSE`](./LICENSE))                                             |
| Placeholder program marks (PawPrint / cub, Tent / scoutsbsa, Mountain / venturing, Anchor / seascouts) | `src/components/ProgramIcon.tsx` (via `PROGRAM_ICONS`), rendered by `ProgramMark.tsx` | ISC (Lucide icons, NOT BSA trademarks, NOT original artwork of this project) |
| Official Scouting America / BSA brand assets (real logos, fleur-de-lis, program marks)                 | `public/marks/*.svg` (gitignored, never committed)                                    | BSA Brand Center license; each user downloads under their own eligibility    |

The repository ships **without** official assets. Cloning it gets you only
code + placeholders. To use real marks, you download them yourself and place
them under `public/marks/` on your own deployment.

## Who can use the real assets

The BSA Brand Center license (the terms you accept when you download anything
from <https://scouting.webdamdb.com/bp/#/>) restricts asset use to:

- BSA National Council employees,
- Local council employees, and
- Registered BSA volunteers,

acting **solely to promote BSA and their local council's or unit's approved
programs and activities**, **in channels approved by their leadership**.

If you fit those criteria and your deployment is leadership-approved, you can
add the assets to your `public/marks/` directory and the `ProgramMark`
component will pick them up automatically. If you don't fit those criteria,
the `forcePlaceholder` prop (or simply not downloading the assets) keeps the
system functional in placeholder mode.

## What the no-derivative-works rule means in practice

The BSA Brand Center license forbids editing or creating derivative works
from the marks. In this codebase that means:

- **`ProgramMark` does not apply any color utilities** when rendering a real
  asset via `<img>`. It only applies them to the Lucide placeholder icons
  (ISC-licensed open-source icons, not original artwork of this project).
  If you need a one-color or reversed variant, save
  it as a separate file (e.g., `cub-mono.svg`, `cub-reversed.svg`) and
  reference that filename; do not recolor at runtime.
- **Do not pipe official marks through CSS `filter`, `mask`, or `mix-blend-mode`.**
  These produce derivative renditions.
- **Do not crop or truncate the marks.** Use the correct aspect ratio for the
  SVG and the included clear-space requirements from the 2024 Brand
  Guidelines.

The colors, typography choices, layout patterns, and brand-voice copy in this
system are documented from the public Brand Guidelines and are not themselves
licensed assets; those are facts and design choices that you and any other
registered leader are free to follow.

## Recommended deployment workflow

1. Clone this repository (private fork strongly recommended once assets are
   added).
2. Download the official marks for the programs you serve from the BSA Brand
   Center while signed in as yourself.
3. Place the SVG files under `public/marks/` using the filenames documented
   in [`public/marks/README.md`](./public/marks/README.md).
4. Confirm with your unit committee, council marketing, or chartered
   organization that the deployment target (your unit website, recruitment
   page, internal portal, etc.) is an approved channel under your brand
   license.
5. Deploy.

For a public-facing portfolio or open-source contribution, leave the
`public/marks/` directory empty. The placeholders render automatically, and
no trademarked artwork is ever displayed.

## Combining with other youth-serving organizations

The BSA Brand Center license explicitly forbids combining BSA assets with the
name, trademarks, or brand elements of any other youth-serving organization.
If your deployment also features 4-H, Boys & Girls Clubs, Girl Scouts, YMCA,
or similar, do not use real BSA assets; use the placeholder mode.

## Questions

For interpretive questions about your specific deployment, ask your local
council marketing team or contact the BSA Marketing Department directly:
amy.leslie@scouting.org.

Nothing in this NOTICE is legal advice.
