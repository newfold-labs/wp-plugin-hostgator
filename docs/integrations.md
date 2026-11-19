# Integrations

This document describes how the HostGator plugin integrates with third-party plugins, APIs, and partner services. For module-level features (e.g. marketplace, help center), see [modules.md](modules.md) and [architecture.md](architecture.md).

## Jetpack

- **File:** `inc/jetpack.php`
- **Purpose:** Customize which Jetpack modules and blocks are available when Jetpack is active.
- **Filters:**
  - `jetpack_get_default_modules` – adds `photon` and `sso` to the default enabled modules.
  - `jetpack_set_available_blocks` – removes `mailchimp` and `revue` from the available blocks so they are not enabled by default.

## Partners (affiliate and plugin behavior)

- **File:** `inc/partners.php`
- **Purpose:** Partner-specific affiliate links and behavior.
- **Notable behavior:**
  - **ShareASale ID removal:** `option_optinmonster_trial_id`, `option_wpforms_shareasale_id` and `option_monsterinsights_shareasale_id` are filtered so the blocked ShareASale ID `1258907` is returned as `false`.
  - **WPForms / AIOSEO:** Affiliate upgrade link filters exist but are commented out while the ShareASale issue is resolved.

## Hiive API requests (Filters)

- **File:** `inc/Filters.php`
- **Purpose:** Ensures outbound HTTP requests to the Hiive API include locale and host plugin identification for the backend.
- **Filter:** `http_request_args` – when the request URL contains `NFD_HIIVE_URL` (`https://hiive.cloud/api`), adds headers:
  - `X-WP-LOCALE` – current WordPress locale.
  - `X-HOST-PLUGIN-ID` – container plugin id (`hostgator`).

`Filters::init()` is called from `bootstrap.php` after the filter class is loaded.

## Single sign-on button (wp-module-sso)

- **File:** `inc/Filters.php` (`configure_hosting_login()`), `inc/LoginRedirect.php`
- **Purpose:** Configures the “Login with HostGator” control on `wp-login.php`: enabled, link into the HostGator account portal (through the link tracker), label, and the brand button color (`Brand::BUTTON_BACKGROUND`).
- **Hook:** `newfold/sso/hosting_login`. `LoginRedirect` also hooks `newfold_sso_success_url_default`.

## 10Web WVC editor

- **File:** `inc/Filters.php`
- **Purpose:** When the 10Web WVC theme is the active or parent theme, the “Edit site” URL used by the dashboard widget and the Coming Soon portal points to the 10Web editor instead of the Site Editor or Customizer.
- **Hook:** `newfold/coming-soon/filter/portal_data`.

## Solutions branding (wp-module-solutions)

- **File:** `inc/SolutionsBrandIntegration.php`
- **Purpose:** Merges HostGator-specific values into the container and hooks the filters `wp-module-solutions` expects, so commerce/solutions surfaces use HostGator links and branding.

## Editor chat brand

- **File:** `inc/Brand.php`
- **Purpose:** The plugin owns the `editor_chat_brand` container payload that `wp-module-editor-chat` reads. `Brand::register()` sets it and `Brand::filter_editor_chat_brand()` (hooked to `newfold/container/editor_chat_brand`) makes sure onboarding’s generic payload does not overwrite the region-aware links and icons.

## Adding or changing integrations

- Add new integration logic in `inc/` (or a new file if it’s a substantial integration) and require it from `bootstrap.php` if it must load early.
- Document new hooks and behavior here and in [backend.md](backend.md) if they add new entry points or config.
- When adding new HTTP headers or partner-specific behavior, consider feature flags or context (e.g. brand) so other Newfold brands can override or disable if needed.
