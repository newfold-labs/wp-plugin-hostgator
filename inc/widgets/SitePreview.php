<?php
/**
 * Site Preview Widget.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

/**
 * Dashboard widget: site preview + Coming Soon launch / enable controls (parity with Bluehost).
 */
class HostGatorSitePreviewWidget {
	/**
	 * The id of this widget.
	 */
	const ID = 'site_preview_widget';

	/**
	 * Constructor
	 */
	public function __construct() {
		\add_action( 'wp_dashboard_setup', array( __CLASS__, 'init' ), 1 );
	}

	/**
	 * Hook to wp_dashboard_setup to add the widget.
	 */
	public static function init() {

		\wp_add_dashboard_widget(
			self::ID,
			__( 'Site Preview', 'wp-plugin-hostgator' ),
			array( __CLASS__, 'widget_render' ),
			null,
			null,
			'normal',
			'high'
		);

		\add_action( 'admin_enqueue_scripts', array( __CLASS__, 'assets' ) );
	}

	/**
	 * Render the widget
	 */
	public static function widget_render() {
		$view_file = HOSTGATOR_PLUGIN_DIR . '/inc/widgets/views/site-preview.php';
		include $view_file;
	}

	/**
	 * Load scripts/styles needed for this dashboard widget.
	 *
	 * @return void
	 */
	public static function assets() {
		\wp_enqueue_style( 'hostgator-style' );
	}
}
