<!-- Thanks for contributing! Keep PRs focused: one logical change each. -->

## What and why

<!-- What does this change do, and why is it needed? Link any related issue. -->

Closes #

## Type of change

- [ ] `fix` - bug fix
- [ ] `feat` - new feature
- [ ] `docs` - documentation only
- [ ] `refactor` - no behavior change
- [ ] `test` - tests only
- [ ] `chore` - tooling / maintenance

## Checklist

- [ ] Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
      and explain _why_.
- [ ] `npm run lint` passes (or `npm run format` was run).
- [ ] `npm run typecheck` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` succeeds.
- [ ] Per-program differences live in `src/styles/tokens.css` overrides, not in
      component logic.
- [ ] No official BSA brand assets or the guidelines PDF are committed.
- [ ] If rendered output changed, visual-regression baselines were regenerated
      per `.storybook/VISUAL_REGRESSION.md` (in the pinned Playwright container).
- [ ] Accessibility guardrails respected (contrast tokens, no
      `variant="accent" size="sm"`, no sub-`/80` text tints).
