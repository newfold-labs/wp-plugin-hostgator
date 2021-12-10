<?php
/**
 * Plugin bootstrap file
 * 
 * @package HostGatorWordPressPlugin
 */

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


// Require files
require HOSTGATOR_PLUGIN_DIR . '/inc/menu.php';
require HOSTGATOR_PLUGIN_DIR . '/inc/scripts.php';