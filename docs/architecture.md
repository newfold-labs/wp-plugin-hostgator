# Architecture

## Module system (Newfold Module Loader)

The plugin uses the **Newfold Module Loader**. Composer-installed modules (e.g. `newfold-labs/wp-module-*`) register with a shared container and run in the HostGator brand context.

### Container and bootstrap

- **`bootstrap.php`** runs after the main plugin file and vendor autoload:
  - Creates `NewfoldLabs\WP\ModuleLoader\Container` and registers the HostGator plugin with it (id `hostgator`, brand, install date).
  - Sets **context** (e.g. `brand.name` = `hostgator`) via `NewfoldLabs\WP\Context`.
  - Registers the `editor_chat_brand` container payload (id, name, region-aware portal links, icons, admin URL) via `HostGator\Brand::register()`. `HostGator\Brand::filter_editor_chat_brand()` is hooked to `newfold/container/editor_chat_brand` so the plugin’s values win over the generic payload that `wp-module-onboarding` writes. Modules such as wp-module-editor-chat read it; the plugin owns these values.
  - On `plugins_loaded`, sets the `cache_types` and `marketplace_brand` container values, passing both through filters (so platforms like Atomic can change behavior). The default marketplace brand is `hostgator`, or `<mm_brand>_<HG_REGION>` when the `mm_brand` and `hg_region` options are both set.
  - Registers Coming Soon args/links and the solutions branding integration (`inc/SolutionsBrandIntegration.php`).
  - Passes the container into the loader with `setContainer()`.
- **Modules** are Composer dependencies. They register with the same container and receive the plugin instance and context.

### Key modules (examples)

- **wp-module-performance** – Performance/caching features. Registers the `performance` feature flag; toggle surfaces on the Admin page (`#/admin`) via `FeatureToggle`.
- **wp-module-coming-soon** – Coming soon page.
- **wp-module-ecommerce** – E-commerce integrations.
- **wp-module-marketplace** – Plugin/theme marketplace (subnav and UI).
- **wp-module-staging** – Staging environments. Registers the `staging` feature flag; toggle surfaces on the Admin page via `FeatureToggle`.
- **wp-module-onboarding** – Onboarding flows.
- **wp-module-solutions** – Commerce hub and solutions packages, branded through `inc/SolutionsBrandIntegration.php`.
- **wp-module-mcp** – WordPress MCP adapter; relies on the PHP-Scoper prefixed packages (see [php-scoper.md](php-scoper.md)).

Module code lives in `vendor/newfold-labs/`; the plugin does not ship their source in this repo, only references them via Composer.

### Context and platform

- **Context** is used for brand and environment (brand name `hostgator`; `wp-module-atomic` adjusts behaviour on WP Cloud/Atomic).
- Filters such as `newfold/container/cache_types` and `newfold/container/marketplace_brand` allow host/platform-specific overrides without changing core plugin code.

## PHP and React

- **PHP** handles: plugin bootstrap, admin menu, asset enqueue, REST API, upgrades, compatibility checks, and integration with WordPress and modules.
- **React** is a single-page admin app: one main entry (and optional portal entry points for modules). It is built with webpack and loaded only on the plugin’s admin page(s).
- **Bridge:** The plugin passes data into the app via `window.NewfoldRuntime` (and related globals). The app calls the REST API (e.g. `/hostgator/v1/settings`) and uses module-provided capabilities/features when present.

## Entry points

| Layer | Entry |
|-------|--------|
| Plugin | `wp-plugin-hostgator.php` → defines constants, compat checks, then requires `bootstrap.php`. |
| Bootstrap | `bootstrap.php` → autoload, container, context, updater, upgrades, then `inc/Admin.php` and other `inc/` files. |
| Admin UI | `inc/Admin.php` enqueues the script from `build/<version>/index.js` and mounts the app in the page. |
| React app | `src/app/index.js` (or equivalent) renders the router; routes live in `src/app/data/routes.js`. |

## Portals

Some module UIs mount into dedicated DOM nodes (portals), for example:

- `nfd-coming-soon-portal`
- `nfd-performance-portal`
- `nfd-staging-portal`

The main app may redirect to separate admin pages (e.g. `admin.php?page=nfd-staging`) for staging or performance; see routes and [frontend.md](frontend.md).

## Version and build

- The plugin version is read from the main plugin file and `HOSTGATOR_PLUGIN_VERSION`; the same value must exist in `package.json` for the build path.
- Built assets live under `build/<version>/` so each release has a clear asset set; see [development.md](development.md) and [release.md](release.md).
