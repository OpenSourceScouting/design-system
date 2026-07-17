# 0001. Record architecture decisions

Date: 2026-07-17
Status: Accepted

## Context

The project is about to go public and aims to serve a broad volunteer community
long-term. Significant decisions (dependency adoption, theming architecture,
re-platforms) were previously captured only in commit messages, `CLAUDE.md`,
and conversation. New contributors cannot reconstruct why the system is shaped
the way it is, and settled questions risk being re-litigated.

## Decision

Keep Architecture Decision Records in `docs/decisions/`, one file per decision,
numbered sequentially, following the convention in the directory README.

## Consequences

- Significant decisions get a permanent, reviewable home; PRs that change
  architecture should include or update an ADR.
- Slight process overhead per major decision; deliberately kept to one page.
