<?php
/**
 * Generic helper utilities for the plugin.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

/**
 * Class Helpers
 */
final class Helpers {

	/**
	 * Read an SVG asset from `assets/svg/`.
	 *
	 * @param string $name File name with or without the `.svg` extension.
	 *
	 * @return string Raw SVG markup, or an empty string if missing/unreadable.
	 */
	public static function get_svg( $name ) {
		$name = basename( preg_replace( '/\.svg$/', '', (string) $name ) ) . '.svg';
		$path = HOSTGATOR_PLUGIN_DIR . 'assets/svg/' . $name;

		if ( ! is_readable( $path ) ) {
			return '';
		}

		$svg = file_get_contents( $path ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents -- local plugin asset.

		return false === $svg ? '' : $svg;
	}
}
