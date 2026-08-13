# Module test overrides

Each Newfold `wp-module-*` package has its own repo and Playwright tests. Failures sometimes only show up in a full plugin build. This directory is for **short-lived iteration** on those tests: you work from copies here, and the plugin copies them into the installed module under `tests/playwright/` **at the start of each** `npx playwright test` run, so you can try fixes without publishing the module.

## How it works

- **When:** Once per `playwright test` run, from [global-setup.js](../global-setup.js) (before the rest of global setup). You can also run the apply script yourself (see [Apply without running the full suite](#apply-without-running-the-full-suite)).
- **Script:** [.github/scripts/apply-playwright-module-overrides.mjs](../../../.github/scripts/apply-playwright-module-overrides.mjs) walks each `wp-module-*` folder under this directory and copies files into the matching module install. That keeps **relative imports** the same as in the package (e.g. `../helpers`, `../fixtures`).
- **Target module path:** The copy goes to `vendor/newfold-labs/<module-name>/` unless the same module is listed in **`composer.local.json`**, in which case the **local path wins** (same resolution as the Playwright project generator). If the module is not installed, that override folder is skipped and a message is printed.

## What is copied and where

Paths below are relative to `tests/playwright/module-overrides/<module-name>/` (for example `wp-module-solutions/`).

| Source | Copied to under the module |
|--------|----------------------------|
| `helpers/**` (any file) | `tests/playwright/helpers/**` |
| `specs/**` (any file) | `tests/playwright/specs/**` |
| `fixtures/**` (any file) | `tests/playwright/fixtures/**` |
| Any other file matching `*.spec.mjs` or `*.spec.js` | `tests/playwright/specs/**` (same relative path, including subfolders) |

Nested structure under `helpers/`, `specs/`, or `fixtures/` is preserved; the top-level directory name is not repeated in the destination (e.g. `specs/foo.spec.mjs` overwrites `tests/playwright/specs/foo.spec.mjs`).

## Layout

- **Location:** `tests/playwright/module-overrides/` (this folder).
- **Per module:** One directory named **exactly** like the module package, e.g. `wp-module-marketplace`. The name must start with `wp-module-` and have a non-empty suffix. Only these directories are scanned; loose files at the root of `module-overrides` (apart from this readme) are ignored.

You can use **only** root-level spec files, **or** mirror the module test tree with `helpers/`, `specs/`, and `fixtures/` subfolders, or mix both (e.g. `file.spec.mjs` at the root and `specs/another.spec.mjs`).

## Example

**Single spec at the root** (overrides the marketplace module’s spec of the same relative path under `specs/`):

- Source: `tests/playwright/module-overrides/wp-module-marketplace/failing-test.spec.mjs`
- Original: `vendor/newfold-labs/wp-module-marketplace/tests/playwright/specs/failing-test.spec.mjs`

**Subfolders** (same idea for `helpers/` and `fixtures/`):

- `…/wp-module-foo/specs/my.spec.mjs` → `…/wp-module-foo/tests/playwright/specs/my.spec.mjs`
- `…/wp-module-foo/helpers/index.mjs` → `…/wp-module-foo/tests/playwright/helpers/index.mjs`

## Apply without running the full suite

From the **plugin root**:

```sh
node .github/scripts/apply-playwright-module-overrides.mjs
```

The current working directory is used as the plugin root—the same directory you use when running Playwright.

## Scope and risk

- This mechanism only copies **test** assets under the module’s `tests/playwright/` tree (specs, optional helpers, fixtures, and the supported layouts above). It does not override application PHP or other module runtime code.
- `vendor` (or a local checkout) will **show local diffs** if that tree is tracked. Treat overrides as temporary: merge fixes into the real module repo, remove the files from this tree, and do **not** ship a release that depends on unmerged overrides. The script logs a **warning** per file so CI and local runs surface overrides.

## After you are done

1. Open a PR in the real module and merge the test (and helper or fixture) changes.  
2. Remove the override files and the module folder from this tree if it is empty.  
3. Prefer not to merge or tag a **release** of the plugin while relying on unmerged overrides for correctness.
