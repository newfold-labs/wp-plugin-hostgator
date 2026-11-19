# GitHub Actions workflows

All workflow files live in **`.github/workflows/`**. This document summarizes each workflow, when it runs, and what it does.

## Testing workflows

| Workflow file | Name | Trigger | Purpose |
|---------------|------|---------|---------|
| **playwright-tests.yml** | E2E/Playwright Tests | Push to `main`/`develop`, PR (opened/sync/reopened/ready), `workflow_dispatch` | Builds the plugin, starts wp-env with the built dist, runs Playwright E2E tests. Two jobs: **build** (composer, npm, rsync dist, upload artifact), **test** (download artifact, wp-env start, `npx playwright test`). Uploads Playwright report and debug.log on failure. |
| **playwright-matrix.yml** | Playwright Test Matrix | PR (opened/sync/reopened/ready), `workflow_dispatch` | Runs Playwright across a matrix of **PHP** (7.4, 8.0–8.4) and **WordPress** (6.9, 7.0, 7.1). The site is created with external HTTP blocked except for an allowlist (see [testing.md](testing.md#external-http-is-blocked-in-ci)). Skips matrix for Dependabot PRs unless the PR touches `newfold-labs`. Builds dist, creates `.wp-env.override.json` per matrix cell (core, PHP version, the built plugin, and the HTTP block settings), runs Playwright, and uploads per-env artifacts named by wp/php version. After matrix completion, a dedicated summary job posts a consolidated table of pass/fail counts by env and an aggregated cross-env failure list sorted by failure frequency. |
| **codecoverage-main.yml** | Codecoverage-Main | Push to `main`, PR to `main`/`develop`/`release/*`, `workflow_dispatch` | Calls reusable **newfold-labs/workflows** workflow `reusable-codecoverage.yml`. Runs **PHPUnit** unit tests and **Codeception wp-browser wpunit** tests across PHP 7.4–8.4, merges coverage, publishes to GitHub Pages and PR comment. Minimum coverage 25%. See [testing.md](testing.md). |

| **codecoverage-cleanup.yml** | Code Coverage Cleanup | PR closed, branch `delete`, weekly cron (Sundays 00:00 UTC) | Removes stale per-commit coverage directories from `gh-pages` using the reusable cleanup workflow in **newfold-labs/workflows**. One run at a time per repo to avoid racing on `gh-pages`. |

## Lint and quality workflows

| Workflow file | Name | Trigger | Purpose |
|---------------|------|---------|---------|
| **lint.yml** | Lint | Push/PR when `**.php` or `package*.json` or `composer.*` or `phpcs.xml` change (on `main`/`develop`) | Runs **PHP_CodeSniffer** (PHP 8.3; compatibility rules still target the plugin's minimum PHP via `testVersion` in `phpcs.xml`). Caches PHPCS scan cache. Outputs checkstyle report; on failure runs `cs2pr` to show results in the PR. |
| **eslint.yml** | ESLint | Push/PR when `src/**/*.js` change (on `main`/`develop`) | Runs **ESLint** via `npm run lint:js`. Uses Node 20, composer install. |
| **ai-code-review.yml** | AI Code Review | PR (opened/sync/reopened/ready) | Calls the central reusable workflow that reviews the PR through the Cloudflare AI Gateway and posts a sticky PR comment with optional check annotations. Needs `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_AI_GATEWAY_TOKEN` secrets and the `CLOUDFLARE_AI_GATEWAY_ID` variable. |
| **workflow-lint.yml** | Scan & Lint Workflow Files | Push/PR when `**.yml` change, `workflow_dispatch` | Calls reusable **newfold-labs/workflows** `reusable-workflow-lint.yml` to scan and lint workflow YAML files. |

## Build and artifact workflows

| Workflow file | Name | Trigger | Purpose |
|---------------|------|---------|---------|
| **upload-artifact-on-push.yml** | Build Plugin | Push to `main`/`develop`, PR (opened/sync/reopened/ready), `workflow_dispatch` | **Only when repo is `newfold-labs/wp-plugin-hostgator`.** Validates version consistency (header, constant, package.json), builds plugin (composer, npm, rsync from `.distinclude`/`.distignore`), uploads artifact. Comments on PR with download link and note about Playground preview. |
| **upload-asset-on-release.yml** | Package Plugin | Release **published** | On release publish: validates version (tag vs header/constant/package.json), validates vendor dirs and (for non-prerelease) WP “Tested up to” vs `.wp-env.json`. Builds dist, creates zip, **uploads zip as release asset** via `gh release upload`. Optionally purges Cloudflare cache for the release API URL. |

## Release and release-infrastructure workflows

| Workflow file | Name | Trigger | Purpose |
|---------------|------|---------|---------|
| **newfold-prepare-release.yml** | Newfold Prepare Release | `workflow_dispatch` only | Manual release prep. Inputs: **level** (patch/minor/major), **target-branch** (default `main`), **source-branch** (default `develop`). Calls **newfold-labs/workflows** `reusable-plugin-prep-release.yml` to prepare the release (version bump, etc.). |
| **satis-webhook.yml** | Trigger Satis Build | Release **created** | When a release is created, sends a **repository_dispatch** to `newfold-labs/satis` with vendor/package/version so Satis can rebuild the package list. |
| **delete-release.yml** | Delete Release | Release **deleted** | When a release is deleted (repo must be `newfold-labs/wp-plugin-hostgator`), purges Cloudflare cache for the release API. |
| **upload-release-asset.yml** | Upload Release Asset to R2 | `workflow_dispatch` (optional `tag`, default latest published release) | Uploads a release asset to R2 storage (needs the R2 and Cloudflare secrets). Only runs for the canonical repository. |
| **dependabot-auto-merge.yml** | Dependabot Auto-Merge | Cron (06:00 and 18:00 UTC), `workflow_dispatch` (optional dry run) | Calls the reusable auto-merge workflow in **newfold-labs/workflows** to merge eligible Dependabot PRs. |
| **cloudflare-clear-cache.yml** | Cloudflare Clear Cache | `workflow_dispatch` only | Manually purges Cloudflare cache for the plugin’s release API URL. |

## i18n and translation workflows

| Workflow file | Name | Trigger | Purpose |
|---------------|------|---------|---------|
| **auto-translate.yml** | Check for Updates to Translations | Push to `develop`, `workflow_dispatch` | Calls **newfold-labs/workflows** `reusable-translations.yml` for the `wp-plugin-hostgator` text domain; uses npm for i18n scripts. Uses `TRANSLATOR_API_KEY`. |

## Playground (preview) workflows

| Workflow file | Name | Trigger | Purpose |
|---------------|------|---------|---------|
| **playground-preview.yml** | WordPress Playground Preview (PR & Comments) | PR (opened/sync/reopened/ready) | For non-fork PRs: builds plugin, deploys a **WordPress Playground** preview to GitHub Pages and comments on the PR with the preview link. Uses `contents`, `pull-requests`, `pages`, `id-token`. |
| **playground-cleanup.yml** | Cleanup Playground Preview | PR **closed** | Removes the Playground preview deployment from GitHub Pages for the closed PR. |

## Other workflows

| Workflow file | Name | Trigger | Purpose |
|---------------|------|---------|---------|
| **create-milestones.yml** | Create Milestone | Cron (Wednesdays noon UTC), `workflow_dispatch` (optional due date) | Creates a GitHub milestone; default due date 2 weeks from run. |

## Summary: workflows by concern

- **E2E (Playwright):** `playwright-tests.yml`, `playwright-matrix.yml`, plus the `playwright-env-any` job in `playground-preview.yml`
- **PHP/JS unit & wpunit coverage:** `codecoverage-main.yml` → reusable codecoverage workflow, `codecoverage-cleanup.yml`
- **Lint and review:** `lint.yml` (PHPCS), `eslint.yml` (JS), `workflow-lint.yml` (YAML scan and lint), `ai-code-review.yml`
- **Build on push/PR:** `upload-artifact-on-push.yml`
- **Release package:** `upload-asset-on-release.yml`
- **i18n:** `auto-translate.yml`
- **Release prep & Satis:** `newfold-prepare-release.yml`, `satis-webhook.yml`, `delete-release.yml`, `cloudflare-clear-cache.yml`, `upload-release-asset.yml`, `dependabot-auto-merge.yml`
- **Playground:** `playground-preview.yml`, `playground-cleanup.yml`
