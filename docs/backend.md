# Backend (PHP)

## Entry points

- **`wp-plugin-hostgator.php`** – Main plugin file. Defines constants (`HOSTGATOR_PLUGIN_VERSION`, `HOSTGATOR_PLUGIN_FILE`, `HOSTGATOR_PLUGIN_DIR`, `HOSTGATOR_PLUGIN_URL`, `HOSTGATOR_BUILD_DIR`, `HOSTGATOR_BUILD_URL`, `NFD_HIIVE_URL`), prevents double load, runs PHP/WP compatibility checks, and runs the NFD plugin compatibility check (self-deactivates if the Bluehost plugin is active; deactivates the legacy MOJO Marketplace, MOJO and Web.com plugins). Otherwise it requires **`bootstrap.php`**.
- **`bootstrap.php`** – Loads autoloaders, sets up the module container and context, registers the brand container values, configures the plugin updater and upgrade handler, then requires core `inc/` files. Admin-only logic (e.g. upgrades) runs only when `is_admin()`.

## Core PHP (`inc/`)

| File / directory | Role |
|------------------|------|
| **Admin.php** | Registers the admin menu, enqueues scripts/styles, plugin action links, runtime data (via `Data::runtime()`), the Brazil/Mexico locale overrides, and language-change transient clearing. Mounts the app root (`#hwa-app`) and the module portal nodes. |
| **Brand.php** | `HostGator\Brand`: brand ID/name, button color, the regional link map (`LINKS`, also published to the JS runtime), icon URLs, and the `editor_chat_brand` container payload. See [reference.md](reference.md#regions-and-locales). |
| **Data.php** | Runtime data for the app (included when building runtime in Admin), including the regional link map. |
| **Helpers.php** | Generic helpers (for example reading SVG assets from `assets/svg/`). |
| **RestApi/rest-api.php** | Registers REST API controllers on `rest_api_init`. See [api.md](api.md) for endpoints. |
| **RestApi/SettingsController.php** | Implements `/hostgator/v1/settings` (see [api.md](api.md)). |
| **upgrades/** | Versioned upgrade routines (`1.2.0.php`, `1.2.3.php`, `2.16.0.php`). Executed by `WP_Forge\UpgradeHandler\UpgradeHandler` when stored version &lt; current plugin version. |
| **LoginRedirect.php** | Customizes login redirect behavior (including the SSO success URL). |
| **SolutionsBrandIntegration.php** | Container merges and filters that brand `wp-module-solutions` for HostGator. |
| **Filters.php** | Global filters: Hiive API headers, Coming Soon portal data (10Web WVC editor URL), the SSO “Login with HostGator” button, and disabling the object cache UI. `Filters::init()` is called from bootstrap. See [integrations.md](integrations.md). |
| **settings.php**, **updates.php**, **base.php** | Settings, update checks, and base helpers (e.g. install date, setup). |
| **jetpack.php**, **partners.php** | Jetpack and partner integrations (see [integrations.md](integrations.md)). |
| **AutoIncrement.php** | DB healthcheck: fixes missing `AUTO_INCREMENT` on WordPress tables (used by support/tooling). |
| **plugin-php-compat-check.php**, **plugin-nfd-compat-check.php** | PHP/WP version checks and NFD plugin conflict handling. |
| **widgets/** | WordPress dashboard widget: SitePreview (bootstrap in `widgets/bootstrap.php`, view in `widgets/views/`). |

REST API endpoints are documented in **[api.md](api.md)** so they stay easy to find. Add new routes there when you add controllers.

## Updater

- **`WP_Forge\WPUpdateHandler\PluginUpdater`** is configured in `bootstrap.php` with a custom endpoint (Hiive release API).
- Endpoint: `https://hiive.cloud/workers/release-api/plugins/newfold-labs/wp-plugin-hostgator`, mapped to WordPress update fields with `setDataMap()`.
- Overrides for the banner and icon (served from `cdn.hiive.space`) are set on the updater so WordPress shows the correct update info in the Plugins screen. The plugin does not use WordPress.org for updates.

## Upgrades

- **UpgradeHandler** is given the path to `inc/upgrades`, the last stored version (e.g. `get_option('hostgator_plugin_version', '1.0')`), and `HOSTGATOR_PLUGIN_VERSION`.
- If stored version is lower, it runs matching upgrade files (by version) and then updates `hostgator_plugin_version` so they do not run again.
- Add new upgrade files when a release needs a one-time data or option migration.

## Activation

- On activation, an option (e.g. `nfd_activated_fresh`) is set so that on the next admin load, transients (e.g. `newfold_marketplace`, `newfold_notifications`, `newfold_solutions`, `nfd_site_capabilities`) are cleared and rewrite rules flushed. See `on_activate()` and `load_plugin()` in `bootstrap.php`.
