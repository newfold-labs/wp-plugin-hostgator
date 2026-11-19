# Getting started

## Prerequisites

- **Node.js** ≥ 20, **npm** ≥ 10 (see `package.json` engines).
- **PHP** 7.4+ (local dev often uses 8.1 via wp-env).
- **Composer** for PHP dependencies.
- **Git** for the repository.

## Install dependencies

From the plugin root:

```bash
npm install --legacy-peer-deps
composer install
```

Use `--legacy-peer-deps` for npm to satisfy the current dependency tree.

`composer install` needs PHP 8.2 or newer: it runs [PHP-Scoper](php-scoper.md) to generate the prefixed packages in `vendor-prefixed/`. The plugin itself still supports PHP 7.4+.

The MCP adapter brings in `automattic/jetpack-autoloader` as a dependency. HostGator explicitly disables that package's Composer plugin because this build uses Composer and PHP-Scoper for autoloading; the package can still be installed.

## First run (development)

1. Install dependencies (above).
2. Start the dev server (with hot reload):

   ```bash
   npm run start
   ```

3. Build output goes to `build/<version>/` (e.g. `build/4.0.0/`). The plugin loads assets from this path at runtime.

For a full local WordPress environment (recommended for testing the plugin in WP admin):

```bash
npx wp-env start
```

Then open the site and admin using the URLs wp-env prints (the dev site runs on port **8884**).

## Local WordPress (wp-env)

Configuration is in **`.wp-env.json`** at the repo root:

- **WordPress:** Core version defined in config (e.g. tag 7.1.4).
- **PHP:** 8.1.
- **Port:** 8884. The deprecated wp-env tests environment is turned off (`"testsEnvironment": false`); Playwright runs against the dev site.
- **Plugins:** Current directory is mounted as the HostGator plugin.
- **Themes:** Installs `yith-wonder` via config.
- **Environment:** `WP_ENVIRONMENT_TYPE` is `local`, with `WP_DEBUG` and `WP_DEBUG_LOG` on.

Useful commands:

```bash
npx wp-env start    # Start the environment
npx wp-env stop     # Stop it
npm run log:watch   # Tail WordPress debug.log (when WP_DEBUG_LOG is on)
```

Set `WP_DEBUG`, `WP_DEBUG_LOG`, and `WP_DEBUG_DISPLAY` in `.wp-env.json` as needed for local debugging.

## Next steps

- **Architecture:** See [architecture.md](architecture.md) for how the plugin and modules are wired.
- **Frontend:** See [frontend.md](frontend.md) for the React app and routes.
- **Backend:** See [backend.md](backend.md) for PHP and REST API.
- **Daily workflow:** See [development.md](development.md) for lint, test, and version commands.
