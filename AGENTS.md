---
name: playwright-e2e-tests
description: Playwright E2E testing workflow for the Restful Booker Platform repo, with browser automation via playwright-cli and structured test execution via Playwright.
---

# Playwright E2E Tests

This repository contains a Playwright-based end-to-end test suite for the Restful Booker Platform demo app. The project follows a page-object structure, API helpers, and fixture-driven test data.

## Primary working rules

- Prefer real Playwright browser automation through `playwright-cli` for inspection, debugging and test generation.
- Use the repo's Playwright test runner for validation and CI-style execution.
- Keep tests deterministic, readable, and aligned with the existing page-object patterns.
- Keep the browser session open while debugging, then close pages cleanly when finished.
- ALWAYS open the browser with --headed.
- ALWAYS save screenshots under `/tmp` when using browser automation tasks.

## Project structure

- `tests/` — test specs grouped by feature area.
- `pages/` — page object models and UI actions.
- `apis/` — API wrappers and request helpers.
- `fixtures/` — shared fixtures and credentials.
- `utils/` — reusable helpers and test data.
- `playwright.config.ts` — Playwright setup and environment configuration.

## Local execution

### Install dependencies

```bash
npm install --legacy-peer-deps
npx playwright install --with-deps
npx playwright-cli install-browser --with-deps
```

### Run targeted Playwright tests

```bash
npx playwright test tests/front-page/room-booking.spec.ts --project chromium
npx playwright test --grep "@sanity" --project chromium
npx playwright test --last-failed
```

## Environment model

The project supports multiple environments via the `ENV` variable:

- `prod` → `https://automationintesting.online/`
- `local` → `http://localhost`

The test configuration defaults to production when `ENV` is unset.
Never rely on that default when running tests: ask the user whether to run against production or local, and use local only when it is up and running. 
If local is unavailable, tell the user and ask whether to use production or start the local environment. Set `ENV` explicitly for the selected environment.

## Agent workflow for this repo

When asked to work on an issue or feature:

1. Inspect the relevant test and page object files first.
2. Before running environment-backed tests or browser validation, ask the user whether to use production or local; offer local only if it is up and running. Never assume production.
3. Reproduce the failure or confirm the UI flow using the smallest possible Playwright command and set `ENV` explicitly to the user's choice.
4. Prefer a focused fix in the correct layer: test, page object, API helper, or fixture.
5. Use `playwright-cli` for live browser validation and debugging when the problem is UI/state-related.
6. Validate with the narrowest meaningful Playwright test command.
7. Run a TypeScript check when code changes affect shared abstractions.

## Validation expectations

Before claiming success:

- Run the smallest relevant test or script.
- Confirm the behavior matches the real page flow.
- If a UI change is involved, use `playwright-cli` to verify the actual page interaction.
- Do not claim completion without fresh command output.

## Debugging habits

When debugging a failing scenario, start by confirming the visible UI state and the target element before changing code. Reproduce the bug in the smallest possible flow, then fix the layer that actually owns the problem: test, page object, API helper, or fixture.

Use these questions to guide diagnosis:

- What is visible on the page?
- Which selector or page object owns the target action?
- Is the flow blocked by validation, auth, or stale state?
- Does the test need a better wait or a more stable locator?

## Coding conventions

- Keep selectors stable and prefer page object abstractions over inline UI logic in tests.
- When a selector is required, prefer the test attribute `data-testid` if already used in the page.
- Separate business flow logic from data generation and low-level browser actions.
- Prefer small, explicit helper methods in page objects over duplicated code in tests.
- Keep tests readable, named clearly, and scoped to a single behavior.
- Add a functionality tag to every newly generated test, appended to its title like the existing tests.
- Before choosing a functionality tag, search the existing tests and reuse the tag that best matches the behavior. If no existing tag fits, introduce a concise, descriptive tag. If the right tag is uncertain, ask the user what tag name to use before adding one.
- Never add `@sanity` unless the user explicitly approves adding it; user approval is required for every `@sanity` tag.
- Add `@slow` when a test uses an explicit timeout of 30 seconds or more, or when it is known or observed to take longer than one minute.

## When to use Playwright Test vs playwright-cli

- Use `npx playwright test ...` for repository validation, regression runs, and suite-level checks.
- Use `playwright-cli` for quick browser-state inspection, manual interaction, debugging, and targeted UI exploration.
- Use both together: inspect with `playwright-cli`, then encode the stable flow as a real Playwright test.

## Final reminder

Use the repository's Playwright conventions, keep the browser interactions real, and prefer focused validation over broad suite runs.
