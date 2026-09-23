---
description: Run the site-kit quality gate on this site — design audit, browser QA, lint, typecheck, build — and fix what fails.
argument-hint: [--fix]
---

Run the full site-kit gate on this repository, using the `site-kit:site-qa` skill for the commands:

1. `pnpm lint`, `pnpm typecheck`, `pnpm build`
2. `node .site-kit/design-audit.mjs` (copy them from the kit first if `.site-kit/` is missing (see the site-qa skill))
3. Serve `out/` on port 4173, then run `node .site-kit/browser-qa.mjs`
4. Go through the pre-ship checklist items the scripts can't see, from the `site-kit:site-standards` skill's `references/preship-checklist.md`.

Report the results as a short list of what passed and each failure with its file and line. If `$ARGUMENTS` contains `--fix`, fix every error, re-run the gate until it is clean, and log anything non-obvious in `DESIGN.md`.
