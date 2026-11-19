# Overview

## What the plugin does

The **HostGator WordPress Plugin** connects a WordPress site to the HostGator control panel. It provides:

- **Performance** – Caching and optimization (via the performance module).
- **Security and updates** – Update checks and management (custom update endpoint, not WordPress.org).
- **Admin experience** – A React-based admin app with pages for Home, Manage WordPress (Settings), Commerce (solutions), Marketplace, and Help.
- **Module features** – Coming Soon page, staging, onboarding, e-commerce integrations, and plugin/theme marketplace, delivered through the Newfold Module Loader.
- **Regional support** – HostGator runs in the US and in Latin America. Region-specific links and locale overrides (Brazilian Portuguese and Mexican Spanish) are handled in the plugin; see [reference.md](reference.md#regions-and-locales).

Sites get a single “HostGator” entry in the WordPress admin menu; the plugin’s UI lives under that menu as a client-side app.

## Who maintains it

- **Newfold Labs** (Newfold Digital) maintains the plugin.
- **Brand context** for this repo is always **HostGator**; other Newfold brands (e.g. Bluehost, MOJO, Web.com, Crazy Domains) use their own plugin repos. This plugin deactivates the legacy MOJO and Web.com plugins when active to avoid conflicts, and it deactivates itself if the Bluehost plugin is active.

## High-level feature set

- **Dashboard (Home)** – Overview and quick actions.
- **Manage WordPress (Settings)** – WordPress management, with sub-areas for staging and performance (often via redirects to module-specific admin pages).
- **Commerce** – Solutions/commerce hub.
- **Marketplace** – Browse and manage plugins/themes from the Newfold marketplace.
- **Help** – Help resources and embedded help (when the help center feature is enabled).
- **Modules** – Coming Soon, Staging, Performance, Onboarding, E-commerce, etc., are provided by Composer packages and register with the plugin’s container.

The plugin requires **PHP 7.4+** and **WordPress 6.6+**, and uses a custom update server (Hiive/release API) rather than WordPress.org for updates.
