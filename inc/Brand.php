<?php
/**
 * Brand-level constants for the plugin's PHP-rendered surfaces.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

/**
 * Class Brand
 */
final class Brand {

	/**
	 * Background color for brand-styled buttons rendered outside the React app
	 * (e.g. the "Login with HostGator" button on wp-login.php).
	 *
	 * Chosen for WCAG 2 AA contrast (~4.5:1) with white label text at 15px/500
	 * (see wp-login hosting-login Playwright a11y checks). Brighter brand oranges
	 * can fail color-contrast with #fff.
	 */
	const BUTTON_BACKGROUND = '#cc5500';
}
