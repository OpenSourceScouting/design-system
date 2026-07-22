# Email template example

A table-based, inline-styled HTML email themed with Open Source Scouting brand
colors. Email clients do not support CSS variables, so this file uses literal
hex values (a header band, a bulletproof CTA button, and a footer) that a
marketer can copy into Mailchimp, Constant Contact, or any email tool.

See [`index.html`](./index.html). To preview it, open the file directly in a
browser, or paste its source into your email platform's HTML editor.

## Retheming per program

The file is Cub Scouts themed by default. To switch programs, swap the hex
values (there is a comment block at the top of `index.html` listing which
colors to change). The exact per-program hex values come from the token data
artifact:

```bash
npm install @opensourcescouting/design-system
# then read the hex-only, no-variable token set:
cat node_modules/@opensourcescouting/design-system/dist/tokens/tokens.email.json
```

You can also import the flat email stylesheet (hex utility classes, no
`var()`), exposed at the `./email.css` subpath, if your platform supports a
`<style>` block:

```html
<link rel="stylesheet" href="@opensourcescouting/design-system/email.css" />
```

This example is illustrative source, not a runnable project. See the "Email"
section of the main [README](../../README.md) for the full explanation.
