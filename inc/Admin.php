<?php
/**
 * Register Admin page and features.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

use function NewfoldLabs\WP\Module\Features\isEnabled;

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
		/* Load i18 files */
		\add_action( 'init', array( __CLASS__, 'load_text_domain' ), 100 );
		/* Add Links to WordPress Plugins list item. */
		\add_filter( 'plugin_action_links_wp-plugin-hostgator/wp-plugin-hostgator.php', array( __CLASS__, 'actions' ) );
		/* Add inline style to hide subnav link */
		\add_action( 'admin_head', array( __CLASS__, 'admin_nav_style' ) );
		/* Add runtime for data store */
		\add_filter( 'newfold-runtime', array( __CLASS__, 'add_to_runtime' ) );
		\add_filter( 'newfold_runtime', array( __CLASS__, 'add_to_runtime' ) );
		/* Filter plugin locale */
		\add_filter( 'plugin_locale', array( __CLASS__, 'locale_filter' ) );
		\add_filter( 'load_script_translation_file', array( __CLASS__, 'load_script_locale_filter' ), 10, 3 );
		\add_action( 'update_option_WPLANG', array( __CLASS__, 'clear_transient_on_language_change' ), 10, 2 );

		if ( isset( $_GET['page'] ) && strpos( filter_input( INPUT_GET, 'page', FILTER_UNSAFE_RAW ), 'hostgator' ) >= 0 ) { // phpcs:ignore
			\add_action( 'admin_footer_text', array( __CLASS__, 'add_brand_to_admin_footer' ) );
		}
	}

	/**
	 * Add to runtime
	 *
	 * @param array $sdk - runtime properties from module
	 *
	 * @return array
	 */
	public static function add_to_runtime( $sdk ) {
		include_once HOSTGATOR_PLUGIN_DIR . '/inc/Data.php';
		return array_merge( $sdk, Data::runtime() );
	}

	/**
	 * Subpages to register with add_submenu_page().
	 *
	 * Order or array items determines menu order.
	 *
	 * @return array
	 */
	public static function subpages() {
		$home          = array(
			'hostgator#/home' => __( 'Home', 'wp-plugin-hostgator' ),
		);
		$pagesAndPosts = array(
			'hostgator#/pages-and-posts' => __( 'Pages & Posts', 'wp-plugin-hostgator' ),
		);
		$store         = array(
			'hostgator#/store' => __( 'Store', 'wp-plugin-hostgator' ),
		);
		$marketplace   = array(
			'hostgator#/marketplace' => __( 'Marketplace', 'wp-plugin-hostgator' ),
		);
		// add performance if enabled
		$performance = isEnabled( 'performance' )
		? array(
			'hostgator#/performance' => __( 'Performance', 'wp-plugin-hostgator' ),
		)
		: array();
		$settings    = array(
			'hostgator#/settings' => __( 'Settings', 'wp-plugin-hostgator' ),
		);
		// add staging if enabled
		$staging = isEnabled( 'staging' )
			? array(
				'hostgator#/staging' => __( 'Staging', 'wp-plugin-hostgator' ),
			)
			: array();
		$help    = array(
			'hostgator#/help' => __( 'Help', 'wp-plugin-hostgator' ),
		);

		return array_merge(
			$home,
			$pagesAndPosts,
			$store,
			$marketplace,
			$performance,
			$settings,
			$staging,
			$help,
		);
	}

	/**
	 * Filter locale for plugin
	 * This updates php l10n to use pt_BR for all pt (Portuguese)
	 * or es_MX for all es (Spanish)
	 *
	 * @param  string $locale - locale string
	 * @return string updated locale
	 */
	public static function locale_filter( $locale ) {
		return self::locale_overrides( $locale );
	}

	/**
	 * Filter locale for plugin script
	 * This updates js l10n to use pt_BR for all pt (Portuguese)
	 * or es_MX for all es (Spanish)
	 *
	 * @param  string $file - file script is loading
	 * @param  string $handle - script handle
	 * @param  string $domain - text domain
	 * @return string updated locale
	 */
	public static function load_script_locale_filter( $file, $handle, $domain ) {
		// scope to just our script or our text-domain
		if (
			'hostgator-script' === $handle ||
			'wp-plugin-hostgator' === $domain
		) {
			$file = self::locale_overrides( $file );
		}
		return $file;
	}

	/**
	 * Wrapper function for locale overrides
	 *
	 * @param  string $locale - locale string
	 * @return string updated locale
	 */
	public static function locale_overrides( $locale ) {
		// Check for Spanish locale
		if ( false !== strpos( $locale, 'es_' ) ) {
			return self::force_MX_for_es( $locale );
		}
		// Check for Portuguese locale
		if ( false !== strpos( $locale, 'pt_' ) ) {
			return self::force_BR_for_pt( $locale );
		}
		// Return unchanged locale if not already updated
		return $locale;
	}

	/**
	 * Replace all Portuguese locales with Brazil
	 *
	 * @param  string $locale - locale string
	 * @return string updated locale
	 */
	public static function force_BR_for_pt( $locale ) {
		return str_replace(
			array(
				'pt_PT', // Portugal
				'pt_AO', // Angola
				'pt_PT_ao90', // AO90
			),
			'pt_BR', // Brazil
			$locale
		);
	}

	/**
	 * Replace all Spanish locales with Mexico
	 *
	 * This is in order to have one Spanish translation used for all locales.
	 *
	 * @param  string $locale - locale string
	 * @return string updated locale
	 */
	public static function force_MX_for_es( $locale ) {
		return str_replace(
			array(
				'es_AR', // Argentina
				'es_BO', // Bolivia
				'es_CL', // Chile
				'es_CO', // Colombia
				'es_CR', // Costa Rica
				'es_DO', // Dominican Republic
				'es_EC', // Ecuador
				'es_ES', // Espanol / Spain
				'es_GT', // Guatemala
				'es_PE', // Peru
				'es_PR', // Puerto Rico
				'es_UY', // Uruguay
				'es_VE', // Venezuela
			),
			'es_MX', // Mexico
			$locale
		);
	}

	/**
	 * Add inline script to admin screens
	 * - hide extra link in subnav
	 */
	public static function admin_nav_style() {
		echo '<style>';
		echo 'li#toplevel_page_hostgator > ul > li.wp-first-item { display: none !important; }';
		echo '#wp-toolbar #wp-admin-bar-hostgator-coming_soon .ab-item { padding: 0; }';
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
			__( 'HostGator', 'wp-plugin-hostgator' ),
			__( 'HostGator', 'wp-plugin-hostgator' ),
			'manage_options',
			'hostgator',
			array( __CLASS__, 'render' ),
			$snappy,
			0
		);

		// If we're outside of App, add subpages to App menu
		if ( false === ( isset( $_GET['page'] ) && strpos( filter_input( INPUT_GET, 'page', FILTER_UNSAFE_RAW ), 'hostgator' ) >= 0 ) ) { // phpcs:ignore
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
	}

	/**
	 * Render DOM element for React to load onto.
	 *
	 * @return void
	 */
	public static function render() {
		global $wp_version;

		echo '<!-- HostGator -->' . PHP_EOL;

		if ( version_compare( $wp_version, '5.4', '>=' ) ) {
			echo '<div id="hwa-app" class="hgwpp hgwpp_app"></div>' . PHP_EOL;
		} else {
			// fallback messaging for WordPress older than 5.4
			echo '<div id="hwa-app" class="hgwpp hgwpp_app">' . PHP_EOL;
			echo '<header class="hgwp-header" style="min-height: 90px; padding: 1rem; margin-bottom: 1.5rem;"><div class="hgwp-header-inner"><div class="hgwp-logo-wrap">' . PHP_EOL;
			echo '<img src="' . esc_url( HOSTGATOR_PLUGIN_URL . 'assets/svg/nav-for-light.svg' ) . '" alt="HostGator logo" />' . PHP_EOL;
			echo '</div></div></header>' . PHP_EOL;
			echo '<div class="wrap">' . PHP_EOL;
			echo '<div class="card" style="margin-left: 20px;"><h2 class="title">' . esc_html__( 'Please update to a newer WordPress version.', 'wp-plugin-hostgator' ) . '</h2>' . PHP_EOL;
			echo '<p>' . esc_html__( 'There are new WordPress components which this plugin requires in order to render the interface.', 'wp-plugin-hostgator' ) . '</p>' . PHP_EOL;
			echo '<p><a href="' . esc_url( admin_url( 'update-core.php' ) ) . '" class="button component-button is-primary button-primary" variant="primary">' . esc_html__( 'Please update now', 'wp-plugin-hostgator' ) . '</a></p>' . PHP_EOL;
			echo '</div></div></div>' . PHP_EOL;
		}

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
			array_merge( $asset['dependencies'], array( 'newfold-features', 'nfd-runtime' ) ),
			$asset['version'],
			true
		);

		\wp_set_script_translations(
			'hostgator-script',
			'wp-plugin-hostgator',
			HOSTGATOR_PLUGIN_DIR . '/languages'
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

		// These assets are loaded in all wp-admin
		\wp_register_script( 'newfold-plugin', false, array(), HOSTGATOR_PLUGIN_VERSION, true );
		\wp_localize_script(
			'newfold-plugin',
			'nfdplugin',
			array(
				'restApiUrl'   => \esc_url_raw( \get_home_url() . '/index.php?rest_route=' ),
				'restApiNonce' => \wp_create_nonce( 'wp_rest' ),
			)
		);
		\wp_enqueue_script( 'newfold-plugin' );
	}

	/**
	 * Load text domain for plugin
	 *
	 * @return void
	 */
	public static function load_text_domain() {

		\load_plugin_textdomain(
			'wp-plugin-hostgator',
			false,
			HOSTGATOR_PLUGIN_DIR . '/languages'
		);

		\load_script_textdomain(
			'hostgator-script',
			'wp-plugin-hostgator',
			HOSTGATOR_PLUGIN_DIR . '/languages'
		);
	}

	/**
	 * Clears a specific transient when the WordPress admin language setting is changed.
	 *
	 * This function hooks into the `update_option_WPLANG` action to detect when
	 * the site language is updated in the WordPress settings. If a change is detected,
	 * it deletes the specified transient to ensure fresh data is retrieved.
	 *
	 * @param string $old_value The previous language setting (e.g., 'en_US').
	 * @param string $new_value The new language setting (e.g., 'fr_FR').
	 */
	public static function clear_transient_on_language_change( $old_value, $new_value ) {
		// Check if the language has actually changed
		if ( $old_value !== $new_value ) {
			// Delete the transients to refresh cached data
			delete_transient( 'newfold_marketplace' );
			delete_transient( 'newfold_notifications' );
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
				'overview' => '<a href="' . \admin_url( 'admin.php?page=hostgator#/home' ) . '">' . __( 'Home', 'wp-plugin-hostgator' ) . '</a>',
				'settings' => '<a href="' . \admin_url( 'admin.php?page=hostgator#/settings' ) . '">' . __( 'Settings', 'wp-plugin-hostgator' ) . '</a>',
			),
			$actions
		);
	}

	/**
	 * Filter WordPress Admin Footer Text "Thank you for creating with..."
	 *
	 * @param  string $footer_text footer text
	 * @return string
	 */
	public static function add_brand_to_admin_footer( $footer_text ) {
		$footer_text = \sprintf( \__( 'Thank you for creating with <a href="https://wordpress.org/">WordPress</a> and <a href="https://hostgator.com/about">HostGator</a>.', 'wp-plugin-hostgator' ) );
		return $footer_text;
	}
} // END \HostGator\Admin
