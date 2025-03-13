<?php
/**
 * Handles global filters for the plugin.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

/**
 * Class Filters
 *
 * Registers global WordPress filters for the plugin.
 */
final class Filters {

	/**
	 * Register all filters.
	 */
	public static function init() {
		\add_filter( 'http_request_args', array( __CLASS__, 'add_locale_header' ), 99, 2 );
	}

	/**
	 * Add locale headers to Hiive API requests.
	 *
	 * @param array  $args - HTTP request arguments.
	 * @param string $url - URL of the request.
	 *
	 * @return array
	 */
	public static function add_locale_header( $args, $url ) {
		if ( defined( 'NFD_HIIVE_URL' ) && strpos( $url, NFD_HIIVE_URL ) !== false ) {
			if ( ! isset( $args['headers'] ) || ! is_array( $args['headers'] ) ) {
				$args['headers'] = array();
			}
			$args['headers']['X-WP-LOCALE'] = get_locale();
		}

		return $args;
	}
}
