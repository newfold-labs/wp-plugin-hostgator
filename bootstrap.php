<?php
/**
 * Plugin bootstrap file
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

use Hostgator\UpgradeHandler;
use Endurance_WP_Plugin_Updater\Updater;
use WP_Forge\WPUpdateHandler\PluginUpdater;

// Composer autoloader
if ( is_readable( __DIR__ . '/vendor/autoload.php' ) ) {
	require __DIR__ . '/vendor/autoload.php';
} else {
	if ( 'local' === wp_get_environment_type() ) {
		wp_die( esc_html( __( 'Please install the HostGator Plugin dependencies.', 'hostgator-wordpress-plugin' ) ) );
	}
	return;
}
$updateurl     = 'https://hiive.cloud/workers/release-api/plugins/bluehost/wp-plugin-hostgator'; // Custom API GET endpoint
$pluginUpdater = new PluginUpdater( HOSTGATOR_PLUGIN_FILE, $updateurl );
$pluginUpdater->setDataMap(
	array(
		'version'       => 'version.latest',
		'download_link' => 'download',
		'last_updated'  => 'updated',
		'requires'      => 'requires.wp',
		'requires_php'  => 'requires.php',
		'tested'        => 'tested.wp',
	)
);

// Handle any upgrade routines
if ( is_admin() ) {

	// Handle plugin upgrades
	require HOSTGATOR_PLUGIN_DIR . '/inc/UpgradeHandler.php';
	$upgrade_handler = new UpgradeHandler(
		HOSTGATOR_PLUGIN_DIR . '/inc/upgrades',
		get_option( 'hostgator_plugin_version', '1.0' ),
		HOSTGATOR_PLUGIN_VERSION
	);

	$did_upgrade = $upgrade_handler->maybe_upgrade();
	if ( $did_upgrade ) {
		update_option( 'hostgator_plugin_version', HOSTGATOR_PLUGIN_VERSION, true );
	}
}

// Required files
require HOSTGATOR_PLUGIN_DIR . '/inc/Admin.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/AdminBar.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/base.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/coming-soon.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/jetpack.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/partners.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/performance.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/RestApi/CachingController.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/RestApi/SettingsController.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/RestApi/rest-api.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/settings.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/updates.php';

/* WordPress Admin Page & Features */
if ( is_admin() ) {
	new Admin();
}

AdminBar::init();
