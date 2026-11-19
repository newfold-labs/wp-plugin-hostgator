# Reference

## Cache and transients

The plugin uses WordPress transients for cached data. Important keys:

- **`newfold_marketplace`** – Marketplace data
- **`newfold_notifications`** – Notifications
- **`newfold_solutions`** – Solutions data
- **`nfd_site_capabilities`** – Site capabilities

These are cleared on plugin activation and when the site language changes (`update_option_WPLANG`). If you add new transients that should be cleared on activate or language change, add them in `on_activate()` and in the `clear_transient_on_language_change` logic in `inc/Admin.php` (or equivalent).

## Platform detection

Behavior can differ by hosting platform:

- **Standard HostGator:** Full cache types (`browser`, `skip404`) and default marketplace brand (`hostgator`).
- **Latam regions:** When both the `mm_brand` and `hg_region` options are set, the default marketplace brand becomes `<mm_brand>_<REGION>` (for example `hostgator_BR`).
- **Atomic (cloud):** `wp-module-atomic` can disable some cache types and override the marketplace brand.

Filters such as `newfold/container/cache_types` and `newfold/container/marketplace_brand` are applied in `bootstrap.php` on `plugins_loaded` so host-specific code can override defaults without changing the plugin core.

## Regions and locales

HostGator serves the US and Latin America, so links and copy depend on the site’s region.

- **Region option:** `hg_region` (e.g. `BR`). `Brand::region()` returns it uppercased and defaults to `US`. The JS side reads the same map from `window.NewfoldRuntime.region` (`src/app/data/region.js`), so there is one source of truth.
- **Link map:** `Brand::LINKS` in `inc/Brand.php` holds a `default` URL plus per-country overrides (AR, BO, BR, CL, CO, DO, EC, MX, PE, PR, UY). Use `Brand::link( $key )` to resolve a URL and `Brand::supports( $key )` to check if a surface should show. A value of the string `'false'` hides that link in that region.
- **Locale overrides** (`inc/Admin.php`): every Portuguese locale (`pt_PT`, `pt_AO`, `pt_PT_ao90`) is mapped to `pt_BR`, and every Spanish locale (`es_AR`, `es_ES`, `es_CL`, etc.) is mapped to `es_MX`, for both PHP and script translations, so one translation per language ships.
- **Tests and examples:** see `tests/wpunit/BrandWpunitTest.php` and `tests/playwright/specs/` for how region links are exercised.

## Compatibility

- **PHP:** 7.4 minimum (`Requires PHP` in the plugin header). Local wp-env uses 8.1; `composer install` itself needs 8.2+ for [PHP-Scoper](php-scoper.md).
- **WordPress:** 6.6 minimum; “Tested up to” is set in the plugin header (currently 7.1.4) and checked against `.wp-env.json` at release time.
- **Incompatible plugin:** If the Bluehost plugin (`bluehost-wordpress-plugin/bluehost-wordpress-plugin.php`) is active, this plugin deactivates itself.
- **Legacy plugins:** On activation, this plugin deactivates the legacy MOJO Marketplace, MOJO and Web.com plugins to avoid conflicts. The lists are in `wp-plugin-hostgator.php`, handled by `inc/plugin-nfd-compat-check.php`.

## Admin UX details

- The first submenu item under the HostGator menu is hidden via CSS (WordPress adds a duplicate of the main menu title); see `Admin::admin_nav_style()`.
- When Coming Soon is active, the admin bar shows a “Coming Soon Active” item.
- Admin footer text is branded on the plugin’s pages.

## Design and assets

- **Assets:** Plugin assets (e.g. SVG, styles) live under `assets/` (e.g. `assets/svg/`, `assets/styles/`). Read SVGs through `Helpers`.

## Update system

- The plugin handles its own updates independently of WordPress.org. It uses **WP_Forge WPUpdateHandler PluginUpdater** with a custom endpoint (Hiive release API).
- Endpoint: `https://hiive.cloud/workers/release-api/plugins/newfold-labs/wp-plugin-hostgator`.
- Banners and icons for the Plugins screen are overridden in the updater config in `bootstrap.php`.

## E2E and module tests

- **Playwright** is the primary E2E runner (`npm run test:e2e` / `npm run test:playwright`).
- For full details on Playwright, PHPUnit, WPUnit, and their CI workflows, see **[testing.md](testing.md)** and **[workflows.md](workflows.md)**.
