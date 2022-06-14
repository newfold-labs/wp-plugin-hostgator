<?php
/**
 * All data retrieval and saving happens from this file.
 *
 * @package HostGatorWordPressPlugin
 */

namespace HostGator;

/**
 * \HostGator\Data
 * This class does not have a constructor to get instantiated, just static methods.
 */
final class Data {

	/**
	 * Data loaded onto window.HGWP
	 *
	 * @return array
	 */
	public static function runtime() {
		global $wp_version;

		$runtime = array(
			'url'       => HOSTGATOR_BUILD_URL,
			'version'   => HOSTGATOR_PLUGIN_VERSION,
			'resturl'   => \get_home_url() . '/index.php?rest_route=',
			'wpversion' => $wp_version,
			'admin'     => \admin_url(),
			'assets'    => HOSTGATOR_PLUGIN_URL . 'assets/',
			'brand'     => get_option( 'mm_brand', false ),
			'region'    => get_option( 'hg_region', false ),
		);

		return $runtime;
	}

}
