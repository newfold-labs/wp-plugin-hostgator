<?php
/**
 * HostGator WordPress Plugin
 *
 * @package           HostGatorWordPressPlugin
 * @author            Newfold Digital
 * @copyright         Copyright 2024 by Newfold Digital - All rights reserved.
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name:       The HostGator Plugin
 * Plugin URI:        https://hostgator.com
 * Update URI:        https://github.com/newfold-labs/wp-plugin-hostgator/
 * Description:       WordPress plugin that integrates a WordPress site with the HostGator control panel, including performance, security, and update features.
 * Version:           2.13.2
 * Requires at least: 6.5
 * Requires PHP:      7.3
 * Tested up to:      6.7.2
 * Author:            HostGator
 * Author URI:        https://hostgator.com
 * Text Domain:       wp-plugin-hostgator
 * Domain Path:       /languages
 * License:           GPL 2.0 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

namespace HostGator;

// Do not allow multiple copies of the HostGator Plugin to be active
if ( defined( 'HOSTGATOR_PLUGIN_VERSION' ) ) {
	return;
}

// Define constants
define( 'HOSTGATOR_PLUGIN_VERSION', '2.13.2' );
define( 'HOSTGATOR_PLUGIN_FILE', __FILE__ );
define( 'HOSTGATOR_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'HOSTGATOR_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'HOSTGATOR_BUILD_DIR', HOSTGATOR_PLUGIN_DIR . 'build/' . HOSTGATOR_PLUGIN_VERSION );
define( 'HOSTGATOR_BUILD_URL', HOSTGATOR_PLUGIN_URL . 'build/' . HOSTGATOR_PLUGIN_VERSION );

if ( ! defined( 'NFD_HIIVE_URL' ) ) {
	define( 'NFD_HIIVE_URL', 'https://hiive.cloud/api' );
}

global $pagenow;
if ( 'plugins.php' === $pagenow ) {

	require HOSTGATOR_PLUGIN_DIR . '/inc/plugin-php-compat-check.php';

	$plugin_check = new HG_Plugin_PHP_Compat_Check( __FILE__ );

	$plugin_check->min_php_version = '7.3';
	$plugin_check->min_wp_version  = '6.2';

	$plugin_check->check_plugin_requirements();
}

// Check NFD plugin incompatibilities
require_once HOSTGATOR_PLUGIN_DIR . '/inc/plugin-nfd-compat-check.php';
$nfd_plugins_check = new NFD_Plugin_Compat_Check( HOSTGATOR_PLUGIN_FILE );
// Defer to Incompatible plugin, self-deactivate
$nfd_plugins_check->incompatible_plugins = array(
	'The Bluehost Plugin' => 'bluehost-wordpress-plugin/bluehost-wordpress-plugin.php',
);
// Deactivate legacy plugin
$nfd_plugins_check->legacy_plugins = array(
	'The MOJO Marketplace' => 'mojo-marketplace-wp-plugin/mojo-marketplace.php',
	'The MOJO Plugin'      => 'wp-plugin-mojo/wp-plugin-mojo.php',
	'The Web.com Plugin'   => 'wp-plugin-web/wp-plugin-web.php',
);
$pass_nfd_check                    = $nfd_plugins_check->check_plugin_requirements();

// Check PHP version before initializing to prevent errors if plugin is incompatible.
if ( $pass_nfd_check && version_compare( PHP_VERSION, '7.3', '>=' ) ) {
	require __DIR__ . '/bootstrap.php';
}
