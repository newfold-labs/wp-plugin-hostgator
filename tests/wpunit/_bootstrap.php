<?php
/**
 * WPUnit suite bootstrap: define plugin constants so inc/ files can be required without loading the full plugin.
 *
 * @package HostGatorWordPressPlugin
 */
if ( ! defined( 'HOSTGATOR_PLUGIN_VERSION' ) ) {
	define( 'HOSTGATOR_PLUGIN_VERSION', '3.0.0' );
}
if ( ! defined( 'HOSTGATOR_PLUGIN_FILE' ) ) {
	define( 'HOSTGATOR_PLUGIN_FILE', codecept_root_dir( 'wp-plugin-hostgator.php' ) );
}
if ( ! defined( 'HOSTGATOR_PLUGIN_DIR' ) ) {
	define( 'HOSTGATOR_PLUGIN_DIR', codecept_root_dir() );
}
if ( ! defined( 'HOSTGATOR_PLUGIN_URL' ) ) {
	define( 'HOSTGATOR_PLUGIN_URL', 'https://test/' );
}
if ( ! defined( 'HOSTGATOR_BUILD_DIR' ) ) {
	define( 'HOSTGATOR_BUILD_DIR', HOSTGATOR_PLUGIN_DIR . 'build/' . HOSTGATOR_PLUGIN_VERSION );
}
if ( ! defined( 'HOSTGATOR_BUILD_URL' ) ) {
	define( 'HOSTGATOR_BUILD_URL', HOSTGATOR_PLUGIN_URL . 'build/' . HOSTGATOR_PLUGIN_VERSION );
}
if ( ! defined( 'NFD_HIIVE_URL' ) ) {
	define( 'NFD_HIIVE_URL', 'https://hiive.cloud/api' );
}

$root = codecept_root_dir();
if ( is_readable( $root . 'vendor/autoload.php' ) ) {
	require_once $root . 'vendor/autoload.php';
	$container = new \NewfoldLabs\WP\ModuleLoader\Container();
	$container->set( 'comingSoon', new \NewfoldLabs\WP\Module\ComingSoon\Service() );
	\NewfoldLabs\WP\ModuleLoader\container( $container );
}
