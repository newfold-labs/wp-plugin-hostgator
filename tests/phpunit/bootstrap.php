<?php
/**
 * Bootstrap file for unit tests.
 *
 * When WP_PHPUNIT__DIR is set (e.g. in CI) and HOSTGATOR_PHPUNIT_MINIMAL is not set,
 * loads the WordPress test suite. Set HOSTGATOR_PHPUNIT_MINIMAL=1 to run only the
 * minimal PluginTest without WordPress (e.g. vendor/bin/phpunit tests/phpunit/PluginTest.php).
 *
 * @package HostGatorWordPressPlugin
 */

$plugin_root = dirname( dirname( __DIR__ ) );
require $plugin_root . '/vendor/autoload.php';

if ( getenv( 'HOSTGATOR_PHPUNIT_MINIMAL' ) ) {
	putenv( 'WP_PHPUNIT__DIR' );
	$wp_phpunit_dir = '';
} else {
	$wp_phpunit_dir = getenv( 'WP_PHPUNIT__DIR' );
}

if ( $wp_phpunit_dir && is_dir( $wp_phpunit_dir ) ) {
	$polyfills_path = $plugin_root . '/vendor/yoast/phpunit-polyfills';
	if ( is_dir( $polyfills_path ) && ! defined( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH' ) ) {
		define( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH', $polyfills_path );
	}
	if ( ! defined( 'WP_TESTS_CONFIG_FILE_PATH' ) ) {
		define( 'WP_TESTS_CONFIG_FILE_PATH', $plugin_root . '/tests/phpunit/wp-tests-config.php' );
	}
	require $wp_phpunit_dir . '/includes/bootstrap.php';
}
