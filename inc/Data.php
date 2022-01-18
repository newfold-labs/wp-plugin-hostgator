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
		$runtime = array(
			'url'     => HOSTGATOR_BUILD_URL,
			'version' => HOSTGATOR_PLUGIN_VERSION,
			'admin'   => \admin_url(),
			'assets'  => HOSTGATOR_PLUGIN_URL . 'assets/',
			// 'uid'     => uid(),
		);

		return $runtime;
	}

}
