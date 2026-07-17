#!/usr/bin/env bash
#
# git-maintenance.sh: reclaim space in .git by expiring the reflog and pruning
# unreachable objects, then repacking. Run this periodically (or after a rebase,
# amend, or baseline refresh) to keep the repository small.
#
# WHY THIS EXISTS: committing then rewriting binary files (the visual-regression
# PNG baselines, or the brand PDF earlier in this project's life) leaves orphaned
# objects in .git. They are unreachable from any branch or tag but survive in the
# reflog and loose object store until garbage-collected. This script forces that
# collection. It only removes objects nothing points to; reachable history is
# never touched.
#
# Usage: npm run maintenance:git   (or: bash scripts/git-maintenance.sh)

set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

before="$(du -sh .git | cut -f1)"
echo "==> .git before: ${before}"

echo "==> Expiring reflog and pruning unreachable objects..."
git reflog expire --expire=now --all
git gc --prune=now --quiet

after="$(du -sh .git | cut -f1)"
echo "==> .git after:  ${after}"

echo
echo "Largest reachable blobs still in history:"
git rev-list --objects --all \
  | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' \
  | awk '/^blob/ {print $3, $4}' \
  | sort -rn | head -10 \
  | awk '{ printf "  %6.2f MB  %s\n", $1/1048576, $2 }'
