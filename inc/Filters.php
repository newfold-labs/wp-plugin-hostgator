<?php
/**
 * Handles global filters for the plugin.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

use function NewfoldLabs\WP\ModuleLoader\container;
use function NewfoldLabs\WP\Module\LinkTracker\Functions\build_link as buildLink;

/**
 * Class Filters
 *
 * Registers global WordPress filters for the plugin.
 */
final class Filters {

	private const TENWEB_WVC_THEME_SLUG = 'wvc-theme';

	/**
	 * Register all filters.
	 */
	public static function init() {
		\add_filter( 'http_request_args', array( __CLASS__, 'add_hiive_headers' ), 99, 2 );
		\add_filter( 'newfold/coming-soon/filter/portal_data', array( __CLASS__, 'filter_coming_soon_portal_data' ) );
		\add_filter( 'newfold/sso/hosting_login', array( __CLASS__, 'configure_hosting_login' ) );
		\add_filter( 'newfold_performance_object_cache_ui_available', '__return_false' );
	}

	/**
	 * Admin URL for Edit site (dashboard widget + Coming Soon portal): Site Editor, Customizer, or 10Web WVC editor.
	 *
	 * @return string
	 */
	public static function get_site_edit_admin_url() {
		$path = self::is_wvc_theme_active()
			? 'admin.php?page=wvc-editor'
			: ( \wp_is_block_theme() ? 'site-editor.php?canvas=edit' : 'customize.php' );

		return \get_admin_url( null, $path );
	}

	/**
	 * Override Coming Soon portal "Edit" URL to the 10Web editor when WVC theme is active.
	 *
	 * @param mixed $data Portal payload (array) or other value returned unchanged.
	 * @return mixed
	 */
	public static function filter_coming_soon_portal_data( $data ) {
		if ( ! \is_array( $data ) || ! self::is_wvc_theme_active() ) {
			return $data;
		}

		$data['editUrl'] = self::get_site_edit_admin_url();

		return $data;
	}

	/**
	 * Add locale headers to Hiive API requests.
	 *
	 * @param array  $args - HTTP request arguments.
	 * @param string $url - URL of the request.
	 *
	 * @return array
	 */
	public static function add_hiive_headers( $args, $url ) {
		$container = container();
		if ( defined( 'NFD_HIIVE_URL' ) && strpos( $url, NFD_HIIVE_URL ) !== false ) {
			if ( ! isset( $args['headers'] ) || ! is_array( $args['headers'] ) ) {
				$args['headers'] = array();
			}
			$args['headers']['X-WP-LOCALE']      = get_locale();
			$args['headers']['X-HOST-PLUGIN-ID'] = $container->plugin()->id;
		}

		return $args;
	}

	/**
	 * Whether the active or parent theme directory is the 10Web WVC theme.
	 *
	 * @return bool
	 */
	private static function is_wvc_theme_active() {
		return self::TENWEB_WVC_THEME_SLUG === \get_stylesheet()
			|| self::TENWEB_WVC_THEME_SLUG === \get_template();
	}

	/**
	 * Configure the "Login with HostGator" control on wp-login.php (wp-module-sso).
	 *
	 * @param array $config Default config from wp-module-sso.
	 *
	 * @return array
	 */
	public static function configure_hosting_login( $config ) {
		$config['enabled']      = true;
		$config['url']          = buildLink(
			'https://www.hostgator.com/my-account/hosting/details/sites',
			array( 'source' => 'hosting_login_button' )
		);
		$config['label']        = __( 'Login with HostGator', 'wp-plugin-hostgator' );
		$config['accent_color'] = Brand::BUTTON_BACKGROUND;

		// The shared asset hardcodes fill="black", which overrides the module's
		// `fill: currentColor` CSS and renders the icon black on the button.
		// Swap to currentColor so it tints with the button's white text color.
		$config['icon_svg'] = str_replace(
			'fill="black"',
			'fill="currentColor"',
			Helpers::get_svg( 'snappy-head-monotone' )
		);

		return $config;
	}
}
