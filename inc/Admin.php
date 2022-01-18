<?php
/**
 * Register Admin page and features.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

/**
 * \HostGator\Admin
 */
final class Admin {

	/**
	 * Register functionality using WordPress Actions.
	 */
	public function __construct() {
		/* Add Page to WordPress Admin Menu. */
		\add_action( 'admin_menu', array( __CLASS__, 'page' ) );
		/* Load Page Scripts & Styles. */
		\add_action( 'load-toplevel_page_hostgator', array( __CLASS__, 'assets' ) );
		/* Add Links to WordPress Plugins list item. */
		\add_filter( 'plugin_action_links_hostgator-wordpress-plugin/hostgator-wordpress-plugin.php', array( __CLASS__, 'actions' ) );
		/* Add inline style to hide subnav link */
		\add_action( 'admin_head', array( __CLASS__, 'admin_nav_style' ) );
	}

	/**
	 * Add inline script to admin screens to hide extra link in subnav
	 */
	public static function admin_nav_style() {
		echo "<style>li#toplevel_page_hostgator > ul > li.wp-first-item { display: none !important;}</style>";
	}

	/**
	 * Add WordPress Page to Appearance submenu.
	 *
	 * @return void
	 */
	public static function page() {
        require_once HOSTGATOR_PLUGIN_DIR . '/assets/svg/snappy.php';

		\add_menu_page(
            __( 'HostGator', 'hostgator-wordpress-plugin' ),
            __( 'HostGator', 'hostgator-wordpress-plugin' ),
            'manage_options',
            'hostgator',
			array( __CLASS__, 'render' ),
            $snappy,
            3
        );

		\add_submenu_page(
            'hostgator',
			__('Home', 'hostgator-wordpress-plugin' ),
			__('Home', 'hostgator-wordpress-plugin' ),
            'manage_options',
			'hostgator#/home',
			array( __CLASS__, 'render' ),
		);

		\add_submenu_page(
            'hostgator',
			__('Marketplace', 'hostgator-wordpress-plugin' ),
			__('Marketplace', 'hostgator-wordpress-plugin' ),
            'manage_options',
			'hostgator#/marketplace',
			array( __CLASS__, 'render' ),
		);

		\add_submenu_page(
            'hostgator',
			__('Performance', 'hostgator-wordpress-plugin' ),
			__('Performance', 'hostgator-wordpress-plugin' ),
            'manage_options',
			'hostgator#/performance',
			array( __CLASS__, 'render' ),
		);

		\add_submenu_page(
            'hostgator',
			__('Settings', 'hostgator-wordpress-plugin' ),
			__('Settings', 'hostgator-wordpress-plugin' ),
            'manage_options',
			'hostgator#/settings',
			array( __CLASS__, 'render' ),
		);

		\add_submenu_page(
            'hostgator',
			__('Help', 'hostgator-wordpress-plugin' ),
			__('Help', 'hostgator-wordpress-plugin' ),
            'manage_options',
			'hostgator#/help',
			array( __CLASS__, 'render' ),
		);

	}

	/**
	 * Render DOM element for React to load onto.
	 *
	 * @return void
	 */
	public static function render() {
		echo '<!-- HostGator -->' . PHP_EOL;
		echo '<div id="hwa-app" class="hgwpp hgwpp_app"></div>' . PHP_EOL;
		echo '<!-- /HostGator -->' . PHP_EOL;
	}

	/**
	 * Load Page Scripts & Styles.
	 *
	 * @return void
	 */
	public static function assets() {
		$asset_file = HOSTGATOR_BUILD_DIR . '/index.asset.php';

		if ( is_readable( $asset_file ) ) {
			$asset = include_once $asset_file;
		} else {
			return;
		}

		\wp_register_script(
			'hostgator-script',
			HOSTGATOR_BUILD_URL . '/index.js',
			array_merge( $asset['dependencies'], array( 'wp-color-picker' ) ),
			$asset['version'],
			true
		);

        include HOSTGATOR_PLUGIN_DIR . '/inc/Data.php';
		\wp_add_inline_script(
			'hostgator-script',
			'var HGWP =' . \wp_json_encode( Data::runtime() ) . ';',
			'before'
		);

		\wp_register_style(
			'hostgator-style',
			HOSTGATOR_BUILD_URL . '/index.css',
			array( 'wp-components' ),
			$asset['version']
		);

        $screen = get_current_screen();
        if( false !== strpos( $screen->id, 'hostgator' ) ) {
			\wp_enqueue_script( 'hostgator-script' );
			\wp_enqueue_style( 'hostgator-style' );
		}
	}

	/**
	 * Add Links to WordPress Plugins list item for HostGator.
	 *
	 * @param  array $actions - array of action links for Plugin row item.
	 * @return array
	 */
	public static function actions( $actions ) {
		return array_merge(
			array(
				'overview' => '<a href="' . \admin_url( 'admin.php?page=hostgator#/home' ) . '">' . __( 'Home', 'hostgator-wordpress-plugin' ) . '</a>',
				'settings' => '<a href="' . \admin_url( 'admin.php?page=hostgator#/settings' ) . '">' . __( 'Settings', 'hostgator-wordpress-plugin' ) . '</a>',
			),
			$actions
		);
	}
} // END \HostGator\Admin
