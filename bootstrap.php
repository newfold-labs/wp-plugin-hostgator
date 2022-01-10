<?php
/**
 * Plugin bootstrap file
 * 
 * @package HostGatorWordPressPlugin
 */
namespace HostGator;

use Hostgator\UpgradeHandler;
use Endurance_WP_Plugin_Updater\Updater;

// Composer autoloader
require __DIR__ . '/vendor/autoload.php';

// Handle plugin updates
if ( is_admin() || ( defined( 'DOING_CRON' ) && DOING_CRON ) || ( defined( 'WP_CLI' ) && WP_CLI ) ) {
	new Updater( 'hostgator', 'hostgator-wordpress-plugin', 'hostgator-wordpress-plugin/hostgator-wordpress-plugin.php' );
}

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

/* WordPress Admin Page & Features */
if ( is_admin() ) {
	new Admin();
}

// Require files
require HOSTGATOR_PLUGIN_DIR . '/inc/RestApi/CachingController.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/RestApi/SettingsController.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/RestApi/rest-api.php';
// require HOSTGATOR_PLUGIN_DIR . '/inc/updates.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/coming-soon.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/settings.php';