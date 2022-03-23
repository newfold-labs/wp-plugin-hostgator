<?php
/**
 * Plugin bootstrap file
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

use Hostgator\UpgradeHandler;
use WP_Forge\WPUpdateHandler\PluginUpdater;
use NewfoldLabs\WP\ModuleLoader\Container;
use NewfoldLabs\WP\ModuleLoader\Plugin;
use function NewfoldLabs\WP\ModuleLoader\container as setContainer;

// Composer autoloader
if ( is_readable( __DIR__ . '/vendor/autoload.php' ) ) {
	require __DIR__ . '/vendor/autoload.php';
} else {
	if ( 'local' === wp_get_environment_type() ) {
		wp_die( esc_html( __( 'Please install the HostGator Plugin dependencies.', 'wp-plugin-hostgator' ) ) );
	}
	return;
}


/*
 * Initialize coming soon module via container
 */
$nfd_module_container = new Container();
// Set plugin to container
$nfd_module_container->set(
	'plugin',
	$nfd_module_container->service(
		function() {
			return new Plugin(
				array(
					'id'   => 'hostgator',
					'file' => HOSTGATOR_PLUGIN_FILE,
				)
			);
		}
	)
);

// Set coming soon values
$nfd_module_container->set(
	'comingsoon',
	array(
		'option_name'         => 'mm_coming_soon',
		'admin_screen_id'     => 'hostgator',
		'admin_app_url'       => admin_url( 'admin.php?page=hostgator#/home' ),
		'template_h1'         => 'A New WordPress Site',
		'template_h2'         => 'Coming Soon!',
		'template_footer_t'   => sprintf(
			/* translators: %1$s is replaced with opening link tag taking you to hostgator.com/wordpress, %2$s is replaced with closing link tag, %3$s is replaced with opening link tag taking you to login page, %4$s is replaced with closing link tag, %5$s is replaced with opening link tag taking you to portal.hostgator.com, %6$s is replaced with closing link tag */
			esc_html__( 'A %1$sHostGator%2$s powered website. Is this your website? Log in to %3$sWordPress%4$s or %5$sHostgator%6$s.', 'wp-plugin-hostgator' ) . '&nbsp;',
			'<a href="' . esc_url( 'https://www.hostgator.com/managed-wordpress-hosting' ) . '" target="_blank" rel="noopener noreferrer nofollow">',
			'</a>',
			'<a href="' . esc_url( wp_login_url() ) . '">',
			'</a>',
			'<a href="' . esc_url( 'https://portal.hostgator.com/' ) . '" target="_blank" rel="noopener noreferrer nofollow">',
			'</a>'
		),
		'template_page_title' => sprintf(
			/* translators: %s: Blog name */
			__( '%s &mdash; Coming Soon', 'wp-plugin-hostgator' ),
			esc_html( get_option( 'blogname' ) )
		),
		'admin_bar_text'      => '<div style="background-color: #ffcf00; color: #191936; padding: 0 1rem;">' . __( 'Coming Soon Active', 'wp-plugin-hostgator' ) . '</div>',
		'admin_notice_text'   => sprintf(
			/* translators: %1$s is replaced with the opening link tag and %2$s is replaced with the closing link tag, %3$s is the opening link tag to preview the page, %4$s is the closing link tag. */
			__( 'Your site is currently displaying a %3$sComing Soon page%4$s. Once you are ready, %1$slaunch your site%2$s.', 'wp-plugin-hostgator' ),
			'<a href="' . esc_url( admin_url( 'admin.php?page=hostgator#/home' ) ) . '">',
			'</a>',
			'<a href="' . get_home_url() . '?preview=coming_soon" title="Preview the Coming Soon landing page">',
			'</a>'
		),
		'template_styles'     => esc_url( HOSTGATOR_PLUGIN_URL . 'assets/styles/coming-soon.css' ),
	)
);
setContainer( $nfd_module_container );


$updateurl     = 'https://hiive.cloud/workers/release-api/plugins/newfold-labs/wp-plugin-hostgator'; // Custom API GET endpoint
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
