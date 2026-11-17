<?php
/**
 * PHP-Scoper configuration.
 *
 * Defines the shared scoping policy (namespace prefix and WordPress symbol
 * excludes) used when prefixing bundled Composer packages into
 * `vendor-prefixed/`, so the plugin's copies cannot collide with unprefixed
 * copies of the same packages shipped by other plugins (e.g. the
 * `wordpress/mcp-adapter` copy bundled with WooCommerce).
 *
 * The list of packages to prefix lives in composer.json: the `scoper-run`
 * script invokes PHP-Scoper once per package with an explicit input path and
 * output directory, and the `autoload` section maps the prefixed namespaces
 * to the output directories via PSR-4. To scope an additional package, add a
 * `scoper-run` line and matching PSR-4 entries there (see
 * docs/php-scoper.md). PHP-Scoper itself is installed in isolation under
 * `bin/php-scoper/`.
 *
 * @see https://github.com/humbug/php-scoper/blob/main/docs/configuration.md
 *
 * @package HostGatorWordPressPlugin
 */

/**
 * Load a WordPress exclude list bundled with sniccowp/php-scoper-wordpress-excludes.
 *
 * WordPress core symbols referenced by the scoped packages (functions,
 * classes, constants, ...) must keep their global names rather than being
 * prefixed.
 *
 * @param string $file Exclude list file name.
 * @return string[]
 */
$nfd_scoper_excludes = static function ( $file ) {
	$path = __DIR__ . '/bin/php-scoper/vendor/sniccowp/php-scoper-wordpress-excludes/generated/' . $file;

	if ( ! is_readable( $path ) ) {
		// phpcs:ignore WordPress.Security.EscapeOutput.ExceptionNotEscaped -- Build-time PHP-Scoper config; WordPress escaping functions are not loaded and $path is a local filesystem path, not web output.
		throw new RuntimeException( 'Missing WordPress exclude list ' . $path . '. Run "composer run ensure-scoper" first.' );
	}

	// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- Reading a bundled local file, not a remote URL; wp_remote_get() is unavailable at build time.
	return json_decode( file_get_contents( $path ), true );
};

return array(
	// Must match the namespace prefix expected by consumers of the prefixed
	// packages, e.g. newfold-labs/wp-module-mcp.
	'prefix'             => 'Bluehost\\Plugin',

	// WP-CLI is a separate project, not covered by the WordPress exclude
	// lists, and is provided globally at runtime when running under WP-CLI.
	'exclude-namespaces' => array(
		'WP_CLI',
	),

	// PHP-Scoper handles interfaces and traits through 'exclude-classes'.
	'exclude-classes'    => array_merge(
		$nfd_scoper_excludes( 'exclude-wordpress-classes.json' ),
		$nfd_scoper_excludes( 'exclude-wordpress-interfaces.json' ),
		$nfd_scoper_excludes( 'exclude-wordpress-traits.json' ),
		array(
			'WP_CLI',
			'WP_CLI_Command',
		)
	),
	'exclude-functions'  => $nfd_scoper_excludes( 'exclude-wordpress-functions.json' ),
	'exclude-constants'  => $nfd_scoper_excludes( 'exclude-wordpress-constants.json' ),
);
