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

		if ( isset( $_GET['page'] ) && strpos( filter_input( INPUT_GET, 'page', FILTER_SANITIZE_STRING ), 'hostgator' ) >= 0 ) { // phpcs:ignore
			\add_action( 'admin_footer_text', array( __CLASS__, 'add_brand_to_admin_footer' ) );
		}
	}

	/**
	 * Subpages to register with add_submenu_page().
	 *
	 * Order or array items determines menu order.
	 *
	 * @return array
	 */
	public static function subpages() {
		return array(
			'hostgator#/home'        => __( 'Home', 'hostgator' ),
			'hostgator#/marketplace' => __( 'Marketplace', 'hostgator' ),
			'hostgator#/performance' => __( 'Performance', 'hostgator' ),
			'hostgator#/settings'    => __( 'Settings', 'hostgator' ),
			'hostgator#/help'        => __( 'Help', 'hostgator' ),
		);
	}

	/**
	 * Add inline script to admin screens
	 * 1. hide extra link in subnav
	 * 2. style coming soon in adminbar
	 */
	public static function admin_nav_style() {
		echo '<style>';
		echo 'li#toplevel_page_hostgator > ul > li.wp-first-item { display: none !important; }';
		echo '#wp-toolbar #wp-admin-bar-hostgator-coming_soon .ab-item { padding: 0; }';
		echo '#wp-admin-bar-hostgator-coming_soon .hostgator-coming_soon-highlight{ background-color: #ffcf00; color: #191936; padding: 0 1rem; }';
		echo '#wp-admin-bar-hostgator-coming_soon .hostgator-coming_soon-highlight:hover { color: #1f2044; }';
		echo '</style>';
	}

	/**
	 * Add WordPress Page to Appearance submenu.
	 *
	 * @return void
	 */
	public static function page() {
		$snappy = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTggMTY3LjciPgogIDxwYXRoIGZpbGw9ImJsYWNrIiBkPSJNMTE2IDY1LjFjMi44LTI2LTQuOS00MS43LTEyLTQ0LjEtNy0yLjQtMTEuMiA1LTExLjIgNS0xMy42LTguNC0yNS43LTcuNi0yNS43LTcuNlM1OS42LS41IDQ0LjguMWMtMTkuNC44LTI5IDQxLTMxLjMgNTIuNGExNy40IDE3LjQgMCAwIDAtMTAuMiA5LjJjLTUuOCAxMS40LTguOCAzMi4yIDM0LjUgNjQuNyA0My4zIDMyLjYgNjIuNCA0MS40IDcxLjggNDEuNCAxMiAwIDEyLjgtNC41IDI2LjYtNi40IDcuMS0xIDEyLjQtMTMuMiA0LjgtMjMuNi03LjctMTAuNC0yNi0yMy0yNi0yM3MxMi4yLS4yIDE5LjgtMS4ybC4xLjRhMzkgMzkgMCAwIDAgMS4zIDNjLjggMS44IDEuMSA0IDEuNyA2IC4yIDEgLjUgMS44IDEgMi41LjMuNyAxIDEuMiAxLjggMS40IDIgLjIgMy44LTEgNS0yLjYgMS4zLTEuNyAyLjMtNCAzLTYuM2E1MyA1MyAwIDAgMCAxLjYtOS4ydi0uNGM0LjctMy4xIDguMy04LjYgNy43LTE4LjYtLjgtMTEuOC0xMy44LTE4LTI2LTE0LjEtNi05LjctMTYtMTAuNi0xNi0xMC42Wm0tMTMuNyAyMy4yYzQtMS4zIDcgNCAxLjggNi4yLS43IDIgLjQgNCAzLjYgNC44LTEwIDItMTAuNC05LjItNS40LTExWm0zOS43IDcuNWMyLjYtLjYgMy42LTIuNCAzLTQtNC4zLTEuOS0xLjgtNi4yIDEuNC01LjIgNC4xIDEuNSAzLjcgMTAuOS00LjQgOS4yWk00MS42IDIyczEzLjcgNi41IDIyLjggMzVjMCAwLTIxLjYtMy41LTMxLjEtMi44IDAgMCA4LjctMTYuMiA4LjMtMzIuMlptNC43IDI0YzAgNC42IDIuNyA4LjQgNiA4LjQgMy40IDAgNi4yLTMuOCA2LjItOC40IDAtNC42LTIuOC04LjMtNi4xLTguMy0zLjQgMC02IDMuNy02IDguM1ptNDMuNiAxMy40czUuNi0xOC4zIDE2LjItMjMuNGMwIDAgLjYgMTQuNyAzIDI2LjQgMCAwLTcuOC0xLjgtMTkuMi0zWm03LjYtNS40YzAgMy42IDIgNi40IDQuNiA2LjQgMi42IDAgNC42LTIuOCA0LjYtNi40IDAtMy41LTItNi40LTQuNi02LjQtMi41IDAtNC42IDIuOS00LjYgNi40Wm0xNS44IDYwLjhzLTQuOCAxOS42LTEyLjEgMTcuNGMtMi41LS43LTEuNS02LjMtMi41LTEwLTEtMy45LTMuOC0xMS4yLTMuOC0xMS4yWm0zNi41LTZzLTEuNSAxOC43LTkuMiAxNy44Yy0yLjUtLjMtMi40LTYtNC05LjYtMS43LTMuNi0xLjQtMy4zLTEuNC0zLjNhNTAgNTAgMCAwIDAgMTQuNi00LjlaIi8+Cjwvc3ZnPg==';

		\add_menu_page(
			__( 'HostGator', 'hostgator-wordpress-plugin' ),
			__( 'HostGator', 'hostgator-wordpress-plugin' ),
			'manage_options',
			'hostgator',
			array( __CLASS__, 'render' ),
			$snappy,
			0
		);

		foreach ( self::subpages() as $route => $title ) {
			\add_submenu_page(
				'hostgator',
				$title,
				$title,
				'manage_options',
				$route,
				array( __CLASS__, 'render' )
			);
		}
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
			array_merge( $asset['dependencies'] ),
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
		if ( false !== strpos( $screen->id, 'hostgator' ) ) {
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

	/**
	 * Filter WordPress Admin Footer Text "Thank you for creating with..."
	 *
	 * @param string $footer_text footer text
	 * @return string
	 */
	public static function add_brand_to_admin_footer( $footer_text ) {
		$footer_text = \sprintf( \__( 'Thank you for creating with <a href="https://wordpress.org/">WordPress</a> and <a href="https://hostgator.com/about">HostGator</a>.', 'hostgator-wordpress-plugin' ) );
		return $footer_text;
	}
} // END \HostGator\Admin
