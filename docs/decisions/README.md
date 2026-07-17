# Architecture Decision Records

This directory holds Architecture Decision Records (ADRs): short documents that
capture a significant decision, the context that forced it, and its
consequences. They exist so future contributors (and future us) can understand
_why_ the system is shaped the way it is without re-litigating settled
questions.

## When to write one

Write an ADR for decisions that are expensive to reverse or that constrain how
contributors work: adopting or dropping a dependency, changing the theming
architecture, changing the public API philosophy, build/tooling re-platforms,
legal/licensing posture. Small implementation choices belong in code comments,
not here.

## Format

One file per decision: `NNNN-short-slug.md`, numbered sequentially. Statuses:
`Proposed`, `Accepted`, `Superseded by NNNN`, `Rejected`. Keep them short. A
good ADR fits on one screen and states context, decision, and consequences
(including the downsides accepted).

## Index

- [0001](./0001-record-architecture-decisions.md) - Record architecture decisions (Accepted)
- [0002](./0002-adopt-shadcn-patterns.md) - Adopt shadcn/ui patterns as the component idiom (Accepted)
- [0003](./0003-tailwind-v4.md) - Migrate to Tailwind CSS v4 (Accepted)

Decisions made before this record existed (selected, documented in `CLAUDE.md`
and code comments instead): CSS-variable theming via `data-program`, real BSA
assets excluded from the repo, Git LFS for visual baselines, Lucide as the icon
set, canonical scouting links as versioned data.
