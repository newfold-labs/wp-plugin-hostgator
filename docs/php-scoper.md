# PHP-Scoper namespace prefixing

This plugin bundles Composer packages that other plugins may also ship. To avoid class collisions, those packages are copied into `vendor-prefixed/` with their namespaces prefixed. For example, WooCommerce bundles its own copy of `wordpress/mcp-adapter`; ours is prefixed to `Bluehost\Plugin\WP\MCP\*` so the two can coexist.

Prefixing is done with [PHP-Scoper](https://github.com/humbug/php-scoper). The setup is copied from the Bluehost plugin, which moved from [Strauss](https://github.com/BrianHenryIE/strauss) to PHP-Scoper after repeated Strauss-related CI failures. PHP-Scoper is also what the YITH-based plugins (`wp-plugin-subscriptions`, `wp-plugin-memberships`) use.

> **The prefix is `Bluehost\Plugin`, not `HostGator\Plugin`.** `wp-module-mcp` hardcodes the `Bluehost\Plugin\WP\MCP\*` namespace, so every brand plugin that ships that module has to prefix to the same names. Do not rename the prefix in `scoper.inc.php` or the PSR-4 entries in `composer.json` without a matching change in the module.

## How it works

- `composer install` and `composer update` run the `prefix-namespaces` script, which:
  1. `ensure-scoper`: installs PHP-Scoper into `bin/php-scoper/` from its own `composer.json`. This keeps PHP-Scoper (which needs PHP 8.2+ and has its own dependency tree) out of the plugin's dependencies, and available on `--no-dev` installs.
  2. `scoper-run`: runs PHP-Scoper once per bundled package with an explicit input path and output directory. Output lands in `vendor-prefixed/<vendor>/<package>/`.
  3. `composer dump-autoload`: refreshes the autoloader.
- `scoper.inc.php` holds the shared scoping policy: the `Bluehost\Plugin` prefix and the symbols that must not be prefixed (WordPress core symbols via `sniccowp/php-scoper-wordpress-excludes`, plus WP-CLI).
- The prefixed classes are autoloaded through PSR-4 entries in the plugin's `composer.json` `autoload` section. There is no separate autoloader in `vendor-prefixed/` and no autoloader patching.
- `vendor-prefixed/` is gitignored and regenerated on every install. It ships in the release artifact.
- The original, unprefixed packages remain in `vendor/`, matching previous behavior.

Currently prefixed packages:

| Package | Prefixed namespace | Consumer |
|---------|--------------------|----------|
| `wordpress/mcp-adapter` | `Bluehost\Plugin\WP\MCP\` | `newfold-labs/wp-module-mcp` |
| `wordpress/php-mcp-schema` | `Bluehost\Plugin\WP\McpSchema\` | `wordpress/mcp-adapter` |

## PHP version requirements

PHP-Scoper requires PHP 8.2+ to run. The scoped output is unaffected: it stays as compatible as the input (the plugin's platform config pins dependency resolution to PHP 7.4).

- Local development: use PHP 8.2 or newer to run `composer install`.
- CI: workflows that run `composer install` use PHP 8.3. The shared translations and prep-release workflows in `newfold-labs/workflows` run on 8.3 directly. The codecoverage matrix still tests on PHP 7.4 through 8.4; it installs dependencies on 8.3 via the `install-php-version` input of `reusable-codecoverage.yml`, then switches to the matrix PHP for the tests. The lock file and platform config make the installed tree identical regardless of the installing PHP.

## Adding a package

PHP-Scoper does not follow package dependencies. Scope the package and every dependency of it that must be isolated.

1. Add one line per package to the `scoper-run` script in `composer.json`, following the existing ones.
2. Add a PSR-4 entry per namespace to the `autoload` section of `composer.json`, mapping the prefixed namespace to the package's source directory under `vendor-prefixed/`.
3. If the package references globals that are neither PHP built-ins nor WordPress core (e.g. WP-CLI, another plugin's classes), add them to the exclude lists in `scoper.inc.php`.
4. Run `composer run prefix-namespaces` and check the output in `vendor-prefixed/` for stray prefixed globals: `grep -rE "Bluehost\\\\Plugin\\\\[A-Za-z_]+[^\\\\]" vendor-prefixed --include="*.php" | grep -v "Bluehost.Plugin.WP"` should return nothing unexpected.
5. Reference the prefixed class names (`Bluehost\Plugin\...`) from consuming code.

## Differences from the Bluehost plugin

- The setup (scripts, `bin/php-scoper/`, `scoper.inc.php`, `.distignore` rules, Dependabot entry) was ported from Bluehost; keep the two in step when one changes.
- Composer's `allow-plugins` sets `automattic/jetpack-autoloader` to `false`, as in Bluehost. The MCP adapter pulls that package in, but autoloading here is done by Composer and the prefixed PSR-4 entries.
- The release workflow (`upload-asset-on-release.yml`) checks that `vendor-prefixed/` is present in the built package.
