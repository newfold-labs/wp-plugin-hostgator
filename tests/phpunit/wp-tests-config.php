<?php
/**
 * PHPUnit / wp-phpunit test config. Defines constants from environment so the same
 * .env.testing (and CI env) used for wp-browser can drive the WP test suite.
 *
 * Required env vars (see .env.testing.example):
 *   WP_ROOT_FOLDER, TEST_DB_*, TEST_SITE_WP_DOMAIN, TEST_SITE_ADMIN_EMAIL
 * Optional: TEST_TABLE_PREFIX, WP_TESTS_TITLE
 *
 * @package HostGatorWordPressPlugin
 */

$plugin_root = dirname( dirname( __DIR__ ) );

$wp_root = getenv( 'WP_ROOT_FOLDER' );
if ( false === $wp_root || '' === $wp_root ) {
	// phpcs:ignore WordPress.WP.CapitalPDangit.MisspelledInText -- Default folder name for WP root path.
	$wp_root = 'wordpress';
}
define( 'ABSPATH', $plugin_root . '/' . rtrim( $wp_root, '/\\' ) . '/' );

define( 'DB_NAME', getenv( 'TEST_DB_NAME' ) ? getenv( 'TEST_DB_NAME' ) : 'tests-wordpress' );
define( 'DB_USER', getenv( 'TEST_DB_USER' ) ? getenv( 'TEST_DB_USER' ) : 'root' );
define( 'DB_PASSWORD', getenv( 'TEST_DB_PASSWORD' ) ? getenv( 'TEST_DB_PASSWORD' ) : 'password' );
$db_host = getenv( 'TEST_DB_HOST' ) ? getenv( 'TEST_DB_HOST' ) : '127.0.0.1';
$db_port = getenv( 'TEST_DB_PORT' );
if ( false !== $db_port && '' !== $db_port ) {
	$db_host .= ':' . $db_port;
}
define( 'DB_HOST', $db_host );
define( 'DB_CHARSET', 'utf8mb4' );
define( 'DB_COLLATE', '' );

// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- WP test bootstrap requires $table_prefix.
$table_prefix = getenv( 'TEST_TABLE_PREFIX' ) !== false ? getenv( 'TEST_TABLE_PREFIX' ) : 'wp_';

define( 'WP_TESTS_DOMAIN', getenv( 'TEST_SITE_WP_DOMAIN' ) ? getenv( 'TEST_SITE_WP_DOMAIN' ) : 'localhost:8888' );
define( 'WP_TESTS_EMAIL', getenv( 'TEST_SITE_ADMIN_EMAIL' ) ? getenv( 'TEST_SITE_ADMIN_EMAIL' ) : 'email@example.org' );
define( 'WP_TESTS_TITLE', getenv( 'WP_TESTS_TITLE' ) ? getenv( 'WP_TESTS_TITLE' ) : 'Test' );
define( 'WP_PHP_BINARY', getenv( 'WP_PHP_BINARY' ) ? getenv( 'WP_PHP_BINARY' ) : 'php' );
