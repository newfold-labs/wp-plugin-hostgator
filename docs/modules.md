# Modules

The HostGator WordPress Plugin is a **collection of Newfold modules**: it provides the HostGator brand shell (menu, routing, runtime data) and pulls in shared functionality via Composer. Each module is a separate package under **`vendor/newfold-labs/`**, registered with the Newfold Module Loader and configured through the plugin’s container and context. See [architecture.md](architecture.md) for how the module system works.

The modules listed below are the ones present in **`vendor/newfold-labs/`** when dependencies are installed. Versions and the exact set are defined in **`composer.json`** (and lock file); this doc is a snapshot of what each package does.

Modules are grouped by **hierarchy**: foundation layers (loader, context, runtime) come first; core infrastructure (activation, data, features) builds on that; user-facing features, AI/integrations, and platform/security/utilities follow. This order reflects how the system is layered and how modules depend on one another.

---

## Tier 1 – Foundation

Loader, context, and runtime that other modules and the plugin rely on.

| Package | Description |
|---------|-------------|
| **container** | Lightweight, PSR-11-compatible dependency injection container used by the module loader. |
| **wp-module-loader** | Registers and manages Newfold modules used within WordPress brand plugins. |
| **wp-module-context** | Determines context for brands and platforms (e.g. hostgator vs atomic). |
| **wp-module-runtime** | Runtime for Newfold WP modules and plugins (exposes data to the admin app). |

---

## Tier 2 – Core infrastructure

Shared services and lifecycle: feature flags, data, activation/deactivation, installer, and tracking.

| Package | Description |
|---------|-------------|
| **wp-module-features** | Interface for feature flags and toggles (e.g. what’s enabled per brand/site). |
| **wp-module-data** | Newfold Data Module – shared data and telemetry. |
| **wp-module-activation** | Handles WordPress brand plugin activation logic. |
| **wp-module-deactivation** | Handles brand plugin and module deactivation logic. |
| **wp-module-installer** | Installer for WordPress plugins and themes. |
| **wp-module-link-tracker** | Adds tracking parameters to links (e.g. UTM). |

---

## Tier 3 – User-facing features

Customer-facing capabilities: coming soon, performance, staging, onboarding, marketplace, solutions, help, notifications, insights, and patterns.

| Package | Description |
|---------|-------------|
| **wp-module-coming-soon** | Coming Soon page for WordPress sites. |
| **wp-module-performance** | Caching and performance management. |
| **wp-module-staging** | Staging environment functionality in brand plugins. |
| **wp-module-onboarding** | Next-generation onboarding flow for Newfold WordPress sites. |
| **wp-module-marketplace** | Renders product data and interacts with the Hiive marketplace API. |
| **wp-module-ecommerce** | Brand-agnostic eCommerce experience. |
| **wp-module-solutions** | Integration of WordPress Solutions add-on packages (content creator / service / ecommerce) for Bluehost & HostGator. |
| **wp-module-help-center** | Help center and embedded help. |
| **wp-module-notifications** | In-site notifications for Newfold. |
| **wp-module-patterns** | WordPress Cloud Patterns. |

---

## Tier 4 – AI, integrations, and content

AI features, third-party integrations, and cross-sell content.

| Package | Description |
|---------|-------------|
| **wp-module-ai** | Artificial intelligence capabilities. |
| **wp-module-ai-chat** | AI Chat for WordPress. |
| **wp-module-editor-chat** | Site Editor AI Chat. |
| **wp-module-facebook** | Connects to the customer’s Facebook profile and fetches data. |
| **wp-module-global-ctb** | “Click to Buy” functionality in brand plugins. |

---

## Tier 5 – Platform, security, and utilities

Platform-specific behavior, security, migration, and tooling.

| Package | Description |
|---------|-------------|
| **wp-module-atomic** | Customizes the brand plugin for WP Cloud (Atomic) environments. |
| **wp-module-htaccess** | Centralized management of `.htaccess` (canonical rules, validation, backups, API for other modules). |
| **wp-module-secure-passwords** | Blocks passwords known to be exposed in breaches and encourages better password hygiene. |
| **wp-module-sso** | Single sign-on for Newfold WordPress sites. |
| **wp-module-migration** | Initiates the migration process. |
| **wp-module-mcp** | WordPress MCP (Model Context Protocol) module for Newfold Labs BLU. |
| **wp-module-pls** | License key provisioning, validation, and lifecycle for plugins using the PLS API via Hiive. |
| **wp-module-install-checker** | Checks if a WordPress installation is fresh and fetches estimated install date. |
| **wp-module-survey** | Collects customer satisfaction feedback via surveys in the WordPress admin. |
| **wp-module-reset** | Factory reset for Newfold WordPress plugins. |
| **wp-php-standards** | PHP Code Sniffer standards for Newfold WordPress projects (development tooling). |

---

## Adding or updating modules

Modules are Composer dependencies. To add or change a module:

1. Edit **`composer.json`** under `require` (e.g. `"newfold-labs/wp-module-*": "^x.y.z"`).
2. Run **`composer update newfold-labs/<package>`** (or `composer install` after changing the lock file).
3. Rebuild the plugin and run tests; some modules register admin pages, assets, or portal divs (see [architecture.md](architecture.md) and [frontend.md](frontend.md)).

Module source is installed under **`vendor/newfold-labs/`** (with `preferred-install: "source"` for `newfold-labs/*` in this plugin). The Newfold Satis repository is used for these packages; see [workflows.md](workflows.md) for release and Satis triggers.

A few modules are present in Bluehost but not here (for example `wp-module-next-steps`, `wp-module-insights` and `wp-module-adam`), so check `composer.json` rather than assuming the two plugins match. `wp-module-mcp` requires the PHP-Scoper setup described in [php-scoper.md](php-scoper.md).
