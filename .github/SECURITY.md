# Security Policy

## Supported versions

This project is pre-1.0 (`0.x`). Only the latest published version on the
default branch receives security fixes. Pin an exact version if you need
stability.

## Reporting a vulnerability

Please do **not** open a public issue for security problems.

Use GitHub's private vulnerability reporting instead:

1. Go to the repository's **Security** tab.
2. Click **Report a vulnerability**.
3. Describe the issue, affected version, and reproduction steps.

We aim to acknowledge reports within a few days. Because this is a
volunteer-maintained community project, response times are best-effort.

## Scope

This is a front-end component library with no server, database, or
authentication surface. The most relevant classes of issue are:

- Cross-site scripting (XSS) via unsanitized props rendered into the DOM.
- Supply-chain risks in the published npm package or its dependencies.
- Accidental inclusion of licensed brand assets (see below).

## A note on brand assets

Official Scouting America / BSA marks and the brand guidelines PDF are **not**
distributed with this repository by design (see [`NOTICE.md`](../NOTICE.md)). If
you discover any licensed asset committed to the repository or shipped in the
npm package, please report it through the process above so it can be removed
promptly. This is treated with the same urgency as a security issue.
