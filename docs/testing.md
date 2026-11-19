# Testing

This document describes the testing setup for the HostGator WordPress Plugin: **Playwright** E2E tests and **WPUnit** (PHPUnit + Codeception wp-browser) tests, plus how they are run in CI.

## Playwright E2E testing

### Overview

The project uses **Playwright** for end-to-end tests in the browser. Tests run against a WordPress instance started with **wp-env**; the plugin is loaded from a built distribution copy.

### Configuration

- **Config file:** **`playwright.config.mjs`** (repository root).
- **Port:** Taken from **`.wp-env.json`** (the dev site, 8884). Playwright and the WP-CLI helpers (`wp-env run cli`) use the dev site; the deprecated wp-env tests environment is disabled (`"testsEnvironment": false`). In CI, **`.wp-env.override.json`** is created by the workflow with a different core/phpVersion (and, in the matrix, the settings from `.wp-env.ci.json`).
- **Projects:** Playwright “projects” (plugin + modules) are defined in **`tests/playwright/playwright-projects.json`**, which can be generated/updated by **`.github/scripts/generate-playwright-projects.mjs`** (run via `npm run test:playwright:update-projects`). The config merges in optional **`project-overrides.json`** per project.
- **Global setup:** **`tests/playwright/global-setup.js`** runs before tests in the default (wp-env) mode only. Skipped when **`BASE_URL`** is set. See [Global setup (WP-CLI)](#global-setup-wp-cli) and [Test tagging](#test-tagging-env--prefix) below.

### Test tagging (`env-*` prefix)

Playwright tests can carry **`@env-*`** tags to control which specs run in each mode. Tags are applied on `test` or `test.describe` via Playwright's `{ tag: '…' }` option.

The `env-*` prefix means **how the runner selects tests** based on environment (`BASE_URL`, wp-env, remote target). It is separate from future tags such as `@requires-woocommerce` (site prerequisites) or runtime `test.skip()` helpers.

#### Tag reference

| Tag | Meaning | Default (local / wp-env) | Remote (`BASE_URL` set) | CI Playground |
|-----|---------|--------------------------|-------------------------|------------------------|
| **`@env-any`** | Generic smoke: works on any WordPress install pointed to by `baseURL`. No CLI setup, non-destructive, human-verified on a real target. | Runs (with full suite) | **Runs** | **Runs** (`--grep @env-any`) |
| **`@env-remote`** | Hosted / production-only behaviour (SSO login button, live portal URLs, real hosting capabilities). | **Skipped** (`grepInvert`) | Allowed by config | **Skipped** unless you pass `--grep @env-remote` locally |
| **`@env-local`** | Needs wp-env + **WP-CLI** (or equivalent shell) to establish or reset **specific initial state** before assertions. | Runs | **Skipped** (not in remote `grep`) | Skipped |
| *(untagged)* | Same runtime as `@env-local` until tagged; prefer explicit `@env-local` on CLI-dependent blocks. | Runs | Skipped | Skipped |

**Config behavior** (`playwright.config.mjs`):

- **`BASE_URL` unset:** full local suite, excluding `@env-remote`.
- **`BASE_URL` set:** config `grep` allows `@env-any` and `@env-remote`; no `globalSetup`, no `webServer`.
- **CI Playground:** passes `--grep @env-any --project newfold-labs/wp-plugin-hostgator`, so only plugin `@env-any` tests run. Run `@env-remote` locally with `BASE_URL=… npx playwright test --grep @env-remote`.

#### What is a poor fit for live / `@env-any`?

Remote runs have **no WP-CLI**, no disposable fixture, and often a **persistent** site. Avoid tagging (or split out of) tests that depend on:

| Pattern | Why it fails on live | Prefer |
|---------|----------------------|--------|
| **`global-setup.js` / `wordpress.wpCli()`** | Shell access does not exist against a deployed URL | `@env-local` only |
| **`beforeEach` / `beforeAll` that call CLI helpers** — e.g. `newfold.clearCapabilities()`, `newfold.setComingSoon()`, `setCapability()`, `installWooCommerce()` | State cannot be seeded remotely | `@env-local` block, or split file |
| **Hardcoded `localhost` / wp-env URLs** | Wrong host on other bases | Relative paths + dynamic assertions, or `@env-local` |
| **`process.env.WP_VERSION` / `PHP_VERSION` assertions** | Values come from `.wp-env.json`, not the remote site | `@env-local` |
| **`toHaveScreenshot` / visual baselines** | Pixels differ per environment | `@env-local` or separate baseline per env |
| **UI mutations** — toggles, settings changes, coming-soon enable/disable | Alters a shared or production site | `@env-local` |
| **Assuming a blank or known-capability state** | Live site has real customer data and capabilities | `@env-local`, or read-only checks only |

If a file mixes portable and CLI-dependent tests, **split into separate `test.describe` blocks** (see `dashboard-widgets.spec.js`: an `@env-any` a11y test, and an untagged/wp-env-only block that calls `clearCapabilities()` in `beforeEach`).

#### Designing good `@env-any` tests

Favour tests that check things **likely to exist on any healthy install** with the plugin active, without preparing state:

- **Navigation and routing** — admin menu, hash routes, page loads (`navigation.spec.js`).
- **Read-only visibility** — sections render, headings present, a11y on a stable container (`home` a11y, `settings` coming-soon section).
- **Mocked network** — `page.route()` intercepts at the browser; safe on any origin (`help.spec.js`).
- **Relative URLs** — `wp-login.php`, `wp-admin/...` via Playwright `baseURL`, not hardcoded hosts.

Tag **`@env-any` only after** the test passes against a non-wp-env `BASE_URL` (a staging site, shared host, or local URL with `BASE_URL=http://localhost:<port>`).

Use **`@env-remote`** when the assertion depends on **real hosting branding or live portal integration** that wp-env does not model (the “Login with HostGator” SSO button on `wp-login.php`, live portal URLs).

#### `@env-local` — state-dependent functionality tests

Reserve **`@env-local`** (or leave untagged) for tests whose **purpose is to verify behaviour given a controlled starting state**, for example:

- Change autoupdate or comment settings and assert notifications (`settings.spec.js` mutation tests).
- Set coming soon via CLI, assert admin notice, reset (`coming-soon-notice.spec.js`).
- Clear capabilities, mutate widgets, exercise help center with injected caps (`dashboard-widgets` wp-env block).

These need **repeatable setup** that today is done through **`wordpress.wpCli()`** and helpers in **`newfold.js`**. That is only available when wp-env (or similar) is running — not when `BASE_URL` points at a live site.

Until we have safe, supported ways to set equivalent state on a persistent remote site (admin UI-only setup with guaranteed cleanup, dedicated smoke-test accounts, feature flags, etc.), **do not tag these `@env-any`**.

Example layout:

```js
test.describe('Dashboard Widgets (env-any)', { tag: '@env-any' }, () => {
  test.beforeEach(async ({ page }) => {
    await auth.navigateToAdminPage(page, 'index.php');
    // No clearCapabilities() — read-only a11y only
  });
  test('HostGator Widgets are all Accessible', async ({ page }) => { ... });
});

test.describe('Dashboard Widgets (wp-env)', { tag: '@env-local' }, () => {
  test.beforeEach(async ({ page }) => {
    await auth.navigateToAdminPage(page, 'index.php');
    await newfold.clearCapabilities();
  });
  test('Site Preview Widget', async ({ page }) => { ... });
});
```

#### Examples and commands

```js
test.describe('Navigation', { tag: '@env-any' }, () => { ... });
test('Home Page Quick Links exist', { tag: '@env-remote' }, async ({ page }) => { ... });
test.describe('Settings mutations', { tag: '@env-local' }, () => { ... });
```

**Running against a custom `BASE_URL` locally:**

```bash
# Same opt-in filter as CI Playground
BASE_URL=https://your-site.example npx playwright test --grep @env-any --project newfold-labs/wp-plugin-hostgator --reporter=line

# Hosted-only checks (SSO, portal URLs) — not run in CI
BASE_URL=https://your-site.example npx playwright test --grep @env-remote --reporter=line
```

Set **`WP_ADMIN_USERNAME`** and **`WP_ADMIN_PASSWORD`** to valid admin credentials for that site.

#### Tags vs helpers

| Mechanism | Use for |
|-----------|---------|
| **`@env-*` tags** | Static runner selection (`grep` in config) |
| **`newfold.supportsWoo()` / `getSkipMessage()`** | Runtime: WP/PHP version or plugin requirements in **wp-env** matrix (uses WP-CLI today) |
| **`test.skip()`** | Runtime: feature not registered, plugin missing on this site |

**Module repos:** use the same `@env-any` / `@env-remote` / `@env-local` convention. Tag only after verifying behaviour in the appropriate mode.

#### Plugin spec tag inventory

| Spec | `@env-any` | `@env-remote` | Untagged / `@env-local` (wp-env only) |
|------|------------|---------------|----------------------------------------|
| `navigation.spec.js` | describe | — | — |
| `help.spec.js` | describe (mocked network) | — | — |
| `home.spec.js` | a11y | — | Home page content |
| `settings.spec.js` | a11y, Coming Soon section | — | Autoupdate / comments / content mutations |
| `dashboard-widgets.spec.js` | a11y | — | CLI `clearCapabilities` / Site Preview widget |
| `hosting-login-button.spec.js` | — | SSO button | — |
| `coming-soon-notice.spec.js` | — | — | CLI `setComingSoon` |
| `version-check.spec.js` | — | — | `WP_VERSION` / `PHP_VERSION` from wp-env |
| `vrt.spec.js` | — | — | Visual baselines (`describe.skip`) |

Do **not** retag mutation, CLI, screenshot, or version-matrix tests as `@env-any`.

#### Module tagging (one module at a time)

Module specs live in their own repositories (they are only vendored here), so tagging them is a separate PR per module — not part of the plugin PR.

1. Split layout/read-only checks into `test.describe(..., { tag: '@env-any' })` using `auth.navigateToAdminPage` and relative paths — no `wordpress.wpCli()`, transients, or plugin install/uninstall.
2. Tag CLI/stateful describes `@env-local` (or leave untagged).
3. Verify from the plugin with `npx playwright test --grep @env-any --project newfold-labs/wp-module-<name>` against Playground or `BASE_URL`.
4. Open the PR on the **module** repository. Only then tag the next module.

No module is tagged yet; the Playground job scopes to `--project newfold-labs/wp-plugin-hostgator`, so untagged modules cannot leak into remote runs.

### Global setup (WP-CLI)

**`tests/playwright/global-setup.js`** runs **`newfold.preparePlaywrightTestEnvironment()`** before any browser tests start (WP-CLI via **`tests/playwright/helpers/wordpress.js`** and **`newfold.js`**).

| Step | Helper / command | Notes |
|------|------------------|--------|
| Permalinks | **`setPlaywrightPermalinkStructure()`** | `rewrite structure '/%postname%/' --hard` with **`wpCliWithRetry()`** (2 attempts, 2s backoff). [`wp rewrite structure`](https://developer.wordpress.org/cli/commands/rewrite/structure/). Logs warning on failure; does not abort setup |
| Deactivate extra plugins | **`deactivateExtraPlaywrightPlugins()`** | [`wp plugin deactivate`](https://developer.wordpress.org/cli/commands/plugin/deactivate/) per entry in **`PLAYWRIGHT_EXTRA_PLUGINS_TO_DEACTIVATE`**; best-effort |
| Installer + orphan crons | **`clearInstallerQueues()`**, **`clearOrphanProneCronEvents()`** | One `wp eval` built from **`INSTALLER_QUEUE_OPTIONS`** / **`INSTALLER_CRON_HOOKS`** in **`newfold.js`** (validated before embedding in PHP) |

All of the above are invoked in order by **`preparePlaywrightTestEnvironment()`**. Module specs should still call **`clearInstallerQueues()`** in hooks when a project can queue installer work mid-run (e.g. onboarding).

**Why one command for permalinks?**  
`wp rewrite structure <pattern> --hard` replaces the older two-step `option update permalink_structure` + `rewrite flush --hard`. It updates the permalink option and regenerates rewrite rules; `--hard` also updates `.htaccess`.

**`failOnNonZeroExit` in global setup:**  
Permalinks and extra-plugin deactivation use `false` and log via **`isWpCliFailure()`**. **`clearInstallerQueues()`** throws if any installer option remains after delete, which aborts **`preparePlaywrightTestEnvironment()`** and global setup.

**Extra plugins:**  
List lives in **`PLAYWRIGHT_EXTRA_PLUGINS_TO_DEACTIVATE`** in **`newfold.js`**; **`deactivateExtraPlaywrightPlugins()`** deactivates only (not uninstall).

**`wordpress.wpCli()` helpers** (see helper JSDoc for full detail):

- **`wpCli(command, options?)`** — run a single WP-CLI command via wp-env.
- **`wpCliWithRetry(command, options?, { maxAttempts?, delayMs? })`** — retry on failure (default 2 attempts, 2s delay). Returns `{ result, attempt }`. Used in global setup for permalink setup; available to module tests for flaky CLI steps.
- **`isWpCliFailure(result)`** / **`formatWpCliResult(result)`** — interpret return values for logging or assertions.
- **Return value** — stdout string, `0` for empty success, or `Error: …` / exit code on failure.
- **`failOnNonZeroExit`** — only throws when explicitly set to `true`. Omitted or `false` preserves legacy return behavior.
- **`timeout`** — defaults to **120000 ms** (2 minutes) so CI runs do not hang indefinitely; pass `0` to disable.
- **`cwd`** — override plugin root; otherwise uses `PLUGIN_DIR` (set in `playwright.config.mjs` and global setup) or `process.cwd()`.

### Test layout

- **Specs:** **`tests/playwright/specs/`** – e.g. `home.spec.js`, `help.spec.js`, `navigation.spec.js`, `settings.spec.js`, `dashboard-widgets.spec.js`, `version-check.spec.js`, `vrt.spec.js`.
- **Helpers:** **`tests/playwright/helpers/`** – shared utilities (e.g. `utils.js`).
- **Module overrides:** **`tests/playwright/module-overrides/`** – short-lived copies of module tests; see its `readme.md`.
- **Output:** **`tests/playwright/test-results/`** – test results, screenshots, traces (retain-on-failure). Reports can be generated under **`tests/playwright/reports/`** if enabled in config.

### Running Playwright locally

1. **Start WordPress (wp-env):**

   ```bash
   npx wp-env start
   ```

2. **Run all Playwright tests:**

   ```bash
   npm run test:e2e
   # or
   npx playwright test
   ```

3. **Optional:** Regenerate projects (e.g. after adding a module with Playwright tests):

   ```bash
   npm run test:playwright:update-projects
   ```

4. **Optional:** Run with UI or a specific spec:

   ```bash
   npx playwright test tests/playwright/specs/home.spec.js
   npx playwright test --ui
   ```

5. **Optional:** Watch the browser, or run a single project (plugin tests only, or one vendored module):

   ```bash
   npx playwright test --headed --project=newfold-labs/wp-plugin-hostgator
   npx playwright test --headed --project=newfold-labs/wp-module-coming-soon
   ```

   Run `npx playwright install chromium` once if Playwright reports that the browser executable does not exist.

The config uses **Chrome** (Chromium), **headless: true**, and in non-CI / non-remote mode can start **webServer** with `wp-env start`. In CI the workflow starts wp-env separately and runs `npx playwright test --reporter=line`. When **`BASE_URL`** is set, `webServer` and `globalSetup` are skipped. Config `grep` allows `@env-any` and `@env-remote`; Playground CI adds `--grep @env-any`.

### Playwright CI workflows

| Workflow file | When it runs | What it does |
|---------------|--------------|--------------|
| **`.github/workflows/playwright-tests.yml`** | Push to `main`/`develop`, PR (opened/sync/reopened/ready), or manual | **Build** job: composer, npm, build, rsync dist, upload artifact. **Test** job: download artifact, create `.wp-env.override.json` pointing plugin to dist, `npx wp-env start`, `npx playwright install --with-deps chromium`, `npx playwright test --reporter=line`. Uploads **playwright-report** and debug.log on failure. |
| **`.github/workflows/playwright-matrix.yml`** | PR or manual (skips for most Dependabot PRs) | Matrix over PHP 7.4–8.4 and WordPress 6.9/7.0/7.1. For each cell: build dist, create override with that core/phpVersion and the [external HTTP block](#external-http-is-blocked-in-ci), wp-env start, run Playwright. Artifacts named e.g. `playwright-report-wp6.9-php8.3`. |
| **`.github/workflows/playground-preview.yml`** | PR (non-fork) | Builds plugin, publishes preview ZIP to GitHub Pages, comments a Playground link. **`playwright-env-any`** job (same workflow) starts a local Playground server from that ZIP and runs **`@env-any`** tests against it. |

See [workflows.md](workflows.md) for full workflow descriptions.

### External HTTP is blocked in CI

The Playwright matrix sets `WP_HTTP_BLOCK_EXTERNAL` to `true` on the test site, so any outbound request from WordPress to a host that is not on the allowlist fails immediately with `User has blocked requests through HTTP`.

**Why:** third-party plugins and Newfold modules make many blocking HTTP calls on every admin and login request: notification feeds, telemetry, and the Have I Been Pwned password check from `wp-module-secure-passwords`. On GitHub runners these were intermittently slow, which stalled `wp-login.php` and caused cascading timeouts in the WordPress 7.x matrix cells. Blocking them made the matrix stable and noticeably faster.

**Scope and behavior:**

- Applies to **`playwright-matrix.yml`** only. The override file it writes includes the settings from `.wp-env.ci.json`. Local `wp-env` runs (`.wp-env.json`) and `playwright-tests.yml` do not block requests.
- Plugins treat a blocked call as a failed request, so tests should not be affected unless they need real data from that host.
- The Have I Been Pwned check is blocked on purpose. The test admin password is known to be weak and leaked, so there is nothing to learn from checking it on every login.

**Where it lives:** the CI-only settings are in **`.wp-env.ci.json`** at the repo root, in the same shape as `.wp-env.json` (`config.WP_HTTP_BLOCK_EXTERNAL` and `config.WP_ACCESSIBLE_HOSTS`). The matrix workflow merges it with the per-cell core, PHP version and built plugin into the temporary `.wp-env.override.json`. `.wp-env.json` is not changed, so local runs are not blocked. `WP_ACCESSIBLE_HOSTS` is a single comma-separated string (JSON has no comments), so the reasons are listed here. Currently:

| Hosts | Why |
|-------|-----|
| `localhost`, `127.0.0.1` | The test site itself and loopback requests |
| `wordpress.org`, `*.wordpress.org`, `w.org`, `*.w.org` | Core, plugin and theme installs, update checks |
| `hiive.cloud`, `*.hiive.cloud`, `hiive.space`, `*.hiive.space` | Hiive connection, CTB, patterns, AI platform, CDN |

**Adding an exception** when a test needs a real outbound request:

1. Find the host. A blocked request shows in `wp-content/debug.log` as `User has blocked requests through HTTP to the URL: <url>` (with `WP_DEBUG_LOG` on), and the calling feature usually fails visibly. Locally: `npx wp-env run cli cat /var/www/html/wp-content/debug.log`.
2. Append the host to `WP_ACCESSIBLE_HOSTS` in `.wp-env.ci.json` and add a row to the table above saying which module or test needs it.
3. `*.example.com` matches subdomains only, not `example.com`; add both lines if you need both.
4. Keep the list small.

**Diagnosing slow requests:** to find out what is slow, temporarily remove `WP_HTTP_BLOCK_EXTERNAL` and `WP_ACCESSIBLE_HOSTS` from the override and log outbound calls, for example with a short mu-plugin that hooks `pre_http_request` and `http_api_debug` and writes slow or failing requests to `error_log`, mapped into the site with `mappings` in `.wp-env.override.json`. The CI log then shows each host and duration.

---

## WPUnit and PHPUnit tests

### Overview

- **PHPUnit** is used for **unit tests** that may or may not load WordPress (e.g. minimal sanity tests in `tests/phpunit/`).
- **Codeception** with **wp-browser** and the **Wpunit** suite is used for **WPUnit** tests that run inside a WordPress test environment (integration-style tests in `tests/wpunit/`).

The **codecoverage-main** workflow runs both and merges coverage.

### PHPUnit (unit tests)

- **Config:** **`phpunit.xml`** (root). Bootstrap: **`tests/phpunit/bootstrap.php`**.
- **Tests directory:** **`tests/phpunit/`** – e.g. `PluginTest.php`, `DataTest.php`, `JetpackTest.php`, `PartnersTest.php`, `UpdatesTest.php`, `BaseTest.php`.
- **Bootstrap behavior:** If `WP_PHPUNIT__DIR` is set (e.g. in CI), the bootstrap loads the WordPress test suite. If **`HOSTGATOR_PHPUNIT_MINIMAL=1`** is set, it skips WordPress and only runs tests that don’t require it (e.g. `PluginTest`).
- **Running locally (minimal, no WordPress):**

  ```bash
  HOSTGATOR_PHPUNIT_MINIMAL=1 vendor/bin/phpunit tests/phpunit/PluginTest.php
  ```

- **Running with WordPress:** Requires the WordPress test suite (e.g. `WP_PHPUNIT__DIR` set to the WP test install). CI provides this via the reusable codecoverage workflow.

### WPUnit (Codeception wp-browser)

- **Suite config:** **`tests/wpunit.suite.yml`** – defines the **WpunitTester** actor, **WPLoader** and **Helper\Wpunit** modules, and DB/site settings (via placeholders like `%WP_ROOT_FOLDER%`, `%TEST_DB_HOST%`, etc.).
- **Tests directory:** **`tests/wpunit/`** – Codeception/ wp-browser tests that run against a loaded WordPress instance.
- **Bootstrap:** Referenced in the suite as **`_bootstrap.php`** (under `tests/`).

These tests do not use wp-env. For local runs, copy `.env.testing.example` to `.env.testing` and start a MySQL that matches it (the defaults match the CI service):

```bash
docker run -d --name wpunit-mysql -p 33306:3306 -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=tests-wordpress mysql:8
```

In CI they are executed by the **newfold-labs/workflows** reusable codecoverage workflow, which sets up the WordPress test environment and runs both PHPUnit and the wpunit suite across multiple PHP versions.

### Code coverage and CI workflow

| Workflow file | When it runs | What it does |
|---------------|--------------|--------------|
| **`.github/workflows/codecoverage-main.yml`** | Push to `main`, PR to `main`/`develop`/`release/*`, or manual | Calls **`newfold-labs/workflows/.github/workflows/reusable-codecoverage.yml`**. Runs **PHPUnit** and **Codeception wp-browser wpunit** tests, generates and merges code coverage (PHP 7.4–8.4), pushes HTML report to GitHub Pages and comments coverage on PRs. Minimum coverage: 25%. |

Inputs passed to the reusable workflow include `php-versions`, `coverage-php-version` (7.4), `repository-name`, and `minimum-coverage`.

See [workflows.md](workflows.md) for the full list of workflows.

---

## Remote and Playground smoke tests

### PR remote smoke (Playground `@env-any`)

On pull requests, **`.github/workflows/playground-preview.yml`** includes a **`playwright-env-any`** job that runs after the preview ZIP is published:

1. **`playground-preview`** builds the plugin and uploads `hostgator-pr-<PR#>.zip` to GitHub Pages.
2. **`playwright-env-any`** downloads that ZIP, starts **`@wp-playground/cli`** in a **child process** (Playwright `webServer`), mounts the unzipped files, sets **`BASE_URL`** to the CLI `serverUrl`, and runs `npx playwright test --grep @env-any --project newfold-labs/wp-plugin-hostgator`.

The browser Playground URL (`playground.wordpress.net/#…`) is for manual QA; CI uses the CLI server in a separate process because Playwright needs a normal HTTP origin and the server must keep its own event loop. Playground's `login: true` blueprint flag auto-authenticates admin requests, so tests skip the `wp-login.php` credential flow (`PLAYGROUND_AUTO_LOGIN` / `PLAYGROUND_PLUGIN_DIR`).

**`ws` devDependency:** the `@php-wasm/node-*` PHP runtimes call `require('ws')` for PHP's outbound sockets without declaring it, so they get whichever `ws` npm hoists to the top of `node_modules`. `package.json` lists `ws` ^8 so that copy matches the ws 8 proxy server inside `@php-wasm/node`. If another package (e.g. `lighthouse` via `@wordpress/scripts`) hoists ws 7 instead, PHP's outbound requests hang the single Playground worker. Every `@env-any` spec then times out in `page.goto`. Don't remove it as unused.

---

## Quick reference

| Test type | Config / entry | Run locally | CI workflow(s) |
|-----------|----------------|-------------|----------------|
| **Playwright E2E** | `playwright.config.mjs`, `tests/playwright/specs/` | `npm run test:e2e` or `npx playwright test` | `playwright-tests.yml`, `playwright-matrix.yml` |
| **Playwright (PR Playground smoke)** | `@env-any` tagged specs | `PLAYGROUND_PLUGIN_DIR=/path/to/unzipped/plugin npx playwright test --grep @env-any` | `playground-preview.yml` (`playwright-env-any` job) |
| **PHPUnit (unit)** | `phpunit.xml`, `tests/phpunit/` | `vendor/bin/phpunit` (with or without `HOSTGATOR_PHPUNIT_MINIMAL=1`) | `codecoverage-main.yml` (reusable) |
| **WPUnit (Codeception)** | `tests/wpunit.suite.yml`, `tests/wpunit/` | Codeception/WP test env (as in reusable workflow) | `codecoverage-main.yml` (reusable) |
