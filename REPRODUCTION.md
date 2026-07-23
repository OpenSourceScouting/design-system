# Reproduction: Vite 8 dep optimizer breaks CJS interop in Vitest browser mode

This branch (`repro/vite8-rolldown-cjs-interop`) pins the project to Vite 8 to
reproduce a Rolldown dep-optimizer CJS-interop failure. `main` and the
`chore/dependency-updates-and-dependabot-config` branch stay on Vite 7, which
works.

## What changed from the working branch

- `vite` `^7.3.6` -> `^8.1.5`
- `@vitejs/plugin-react` `^5.2.0` -> `^6.0.4` (Vite 8 peer requirement)
- removed the `optimizeDeps.include` workaround from `.storybook/main.ts`

Everything else is unchanged: Vitest 4.1.10, `@vitest/browser` 4.1.10,
Storybook 10.5.2.

## Steps

```bash
npm install
npx playwright install chromium
npx vitest run --project unit        # passes (jsdom, no dep optimizer)
npx vitest run --project storybook   # fails (browser mode, Rolldown optimizer)
```

## Result

The `storybook` project (stories run as tests in real Chromium via
`@vitest/browser`) fails at import:

```
Error: Failed to import test file .../@storybook/addon-vitest/dist/vitest-plugin/setup-file-with-project-annotations.js
Caused by: SyntaxError: The requested module '/node_modules/aria-query/lib/index.js?v=...'
does not provide an export named 'elementRoles'
```

Adding the failing CJS module to `optimizeDeps.include` moves the error to the
next CJS dependency in the graph rather than fixing it:

1. `aria-query` -> `does not provide an export named 'elementRoles'`
2. add it -> `lz-string` -> `does not provide an export named 'default'`
3. add it -> `pretty-format` -> `exports is not defined` (a runtime
   `ReferenceError`, not a named-export miss)

Vite 7 (esbuild optimizer) has none of these failures with the same code.
